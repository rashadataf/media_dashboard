import React from "react";
import Image from "next/image";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import AdminServices from "../../services/admin.services";

function withMyHook(MyComponent) {
  return function WrappedComponent(props) {
    const useStyles = makeStyles((theme) => ({
      root: {
        display: "flex",
        flexWrap: "wrap",
      },
      name: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: "2rem",
      },
      textField: {
        width: "100%",
      },
      button: {
        marginTop: theme.spacing(3),
        marginRight: theme.spacing(5),
      },
      formControl: {
        minWidth: 150,
      },
    }));
    const classes = useStyles();
    return <MyComponent {...props} classes={classes} />;
  };
}

class Area extends React.Component {
  state = {
    _id: this.props._id || "",
    name: this.props.name || "",
    nameError: "",
    email: this.props.email || "",
    emailError: "",
    password: "",
    passwordError: "",
    repeatPassword: "",
    repeatPasswordError: "",
    nationality: this.props.nationality ? this.props.nationality : "",
    phone: this.props.phone ? this.props.phone : "",
    phoneError: "",
    image: this.props.image ? this.props.image : null,
    imagePreview: this.props.image
      ? "http://localhost:3000/" + this.props.image.split("public/").pop()
      : null,
    status: this.props.status,
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + "Error"]: "",
    });
  };

  handleStatusChange = (event) => {
    if (event.target.checked) {
      this.setState({ status: "active" });
    } else {
      this.setState({ status: "inactive" });
    }
  };

  validateEmail = () => {
    if (this.state.email.length === 0) {
      this.setState({
        emailError: "You cann't leave email empty!",
      });
      return false;
    } else {
      let emailFilter = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      let isEmail = emailFilter.test(this.state.email.toLowerCase());
      if (!isEmail) {
        this.setState({
          emailError: "You should enter a valid email address!",
        });
        return false;
      }
    }
    return true;
  };

  validatePassword = () => {
    if (this.state.password.length !== 0) {
      let passwordError = "";
      if (!/[a-z]/.test(this.state.password)) {
        passwordError =
          passwordError +
          "\nyou should enter one Lowercase character at least!";
      }
      if (!/[A-Z]/.test(this.state.password)) {
        passwordError =
          passwordError +
          `\nyou should enter one Uppercase character at least!`;
      }
      if (
        !/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(this.state.password)
      ) {
        passwordError =
          passwordError + "\nyou should enter one Symbol(@#$%...) at least!";
      }
      if (this.state.password.length < 6) {
        passwordError =
          passwordError + "\nyou should enter 6 characters at least!";
      }
      if (passwordError.length > 0) {
        this.setState({ passwordError: passwordError });
        return false;
      }
      return true;
    }
    return true;
  };

  validateRepeatPassword = () => {
    if (this.state.password.length !== 0) {
      if (this.state.repeatPassword !== this.state.password) {
        this.setState({
          repeatPasswordError: "you should enter the same password",
        });
        return false;
      }
    }
    return true;
  };

  validateNumber = () => {
    if (this.state.phone !== "") {
      if (isNaN(parseInt(this.state.phone))) {
        this.setState({
          phoneError: "You should Enter a valid phone number!!",
        });
        return false;
      }
    } else {
      this.setState({
        phoneError: "You cann't leave phone number empty!",
      });
      return false;
    }
    return true;
  };

  validateName = () => {
    if (this.state.name.length === 0) {
      this.setState({
        nameError: "This field cann't be empty",
      });
      return false;
    }
    return true;
  };

  validateInput = (event) => {
    if (event) {
      switch (event.target.name) {
        case "name":
          this.validateName();
          break;
        case "phone":
          this.validateNumber();
          break;
        case "email":
          this.validateEmail();
          break;
        case "password":
          this.validatePassword();
          break;
        case "repeatPassword":
          this.validateRepeatPassword();
          break;
        default:
          break;
      }
    } else {
      if (
        this.validateName() &&
        this.validateNumber() &&
        this.validateEmail() &&
        this.validatePassword() &&
        this.validateRepeatPassword()
      )
        return true;
      else return false;
    }
  };

  handleImageChange = (event) => {
    if (event.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => this.setState({ imagePreview: e.target.result });
      reader.onerror = (err) => console.log(err);
      reader.readAsDataURL(event.target.files[0]);
      this.setState({ image: event.target.files[0] });
    }
  };

  handleUpdate = async () => {
    if (this.validateInput()) {
      const formData = new FormData();
      formData.append("name", this.state.name);
      formData.append("nationality", this.state.nationality);
      formData.append("phone", this.state.phone);
      formData.append("email", this.state.email.toLowerCase());
      formData.append("password", this.state.password);
      formData.append("residenceCountry", this.state.residenceCountry);
      formData.append("image", this.state.image);
      formData.append("status", this.state.status);
      const result = await AdminServices.usersServices.updateUser(
        this.state._id,
        formData
      );
      if (result) {
        this.setState({
          name: "",
          nameError: "",
          email: "",
          emailError: "",
          password: "",
          passwordError: "",
          repeatPassword: "",
          repeatPasswordError: "",
          nationality: "",
          phone: "",
          phoneError: "",
          residenceCountry: "",
          companyFacebook: "",
          companyAddress: "",
          image: null,
          imagePreview: "",
          status: "",
        });
        this.props.handleSuccess();
      }
    }
  };
  render() {
    return (
      <Container>
        <div className={this.props.classes.root}>
          <div className={this.props.classes.name}>
            <TextField
              id="name"
              name="name"
              label="Name"
              value={this.state.name}
              onChange={this.handleChange}
              onBlur={this.validateInput}
              className={this.props.classes.textField}
              variant="outlined"
              helperText={
                this.state.nameError
                  ? `${this.state.nameError}`
                  : `Please Enter User Name.`
              }
              error={this.state.nameError ? true : false}
            />
          </div>
          <div className={this.props.classes.name}>
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
              onBlur={this.validateInput}
              className={this.props.classes.textField}
              variant="outlined"
              helperText={
                this.state.passwordError
                  ? `${this.state.passwordError}`
                  : `Please Enter User password.`
              }
              error={this.state.passwordError ? true : false}
            />
          </div>
          <div className={this.props.classes.name}>
            <TextField
              id="repeatPassword"
              name="repeatPassword"
              label="Confirm Password"
              type="password"
              value={this.state.repeatPassword}
              onChange={this.handleChange}
              onBlur={this.validateInput}
              className={this.props.classes.textField}
              variant="outlined"
              helperText={
                this.state.repeatPasswordError
                  ? `${this.state.repeatPasswordError}`
                  : `Please Enter User Password Again.`
              }
              error={this.state.repeatPasswordError ? true : false}
            />
          </div>
          <div className={this.props.classes.name}>
            <TextField
              id="phone"
              name="phone"
              label="Phone Number"
              value={this.state.phone}
              onChange={this.handleChange}
              onBlur={this.validateInput}
              className={this.props.classes.textField}
              variant="outlined"
              helperText={
                this.state.phoneError
                  ? `${this.state.phoneError}`
                  : `Please Enter User Phone Number.`
              }
              error={this.state.phoneError ? true : false}
            />
          </div>
          <div className={this.props.classes.name}>
            <TextField
              id="nationality"
              name="nationality"
              label="Nationality"
              value={this.state.nationality}
              onChange={this.handleChange}
              className={this.props.classes.textField}
              variant="outlined"
              helperText="Please Enter User Nationality."
            />
          </div>
          <div className={this.props.classes.name}>
            <TextField
              id="email"
              name="email"
              label="Email"
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
              onBlur={this.validateInput}
              className={this.props.classes.textField}
              variant="outlined"
              helperText={
                this.state.emailError
                  ? `${this.state.emailError}`
                  : `Please Enter User Email.`
              }
              error={this.state.emailError ? true : false}
            />
          </div>
          <div style={{ width: "100%", marginTop: "2rem", display: "flex" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button
                variant="contained"
                color="default"
                component="label"
                className={this.props.classes.button}
                startIcon={<CloudUploadIcon />}
              >
                Upload Image
                <input
                  type="file"
                  onChange={this.handleImageChange}
                  accept="image/*"
                  id="image"
                  hidden
                />
              </Button>
              {this.state.imagePreview && (
                <Button
                  variant="contained"
                  color="secondary"
                  className={this.props.classes.button}
                  onClick={() => {
                    this.setState({ imagePreview: "", image: "" });
                  }}
                  startIcon={<DeleteIcon />}
                >
                  Delete Image
                </Button>
              )}
            </div>
            {this.state.imagePreview && (
              <Image
                src={this.state.imagePreview}
                alt="image"
                width={300}
                height={250}
              />
            )}
          </div>
          <div style={{ width: "100%", marginTop: "2rem" }}>
            <label style={{ marginRight: "1rem" }}>Status: </label>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.status === "active"}
                  onChange={this.handleStatusChange}
                  color="primary"
                  name="checkedB"
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              }
              label={this.state.status}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "2rem", backgroundColor: "#00BF00" }}
            startIcon={<SaveIcon />}
            onClick={this.handleUpdate}
          >
            Update
          </Button>
        </div>
      </Container>
    );
  }
}

export default withMyHook(Area);
