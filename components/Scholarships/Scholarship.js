import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Chip from "@material-ui/core/Chip";

// Arabic Support
import { create } from "jss";
import rtl from "jss-rtl";
import {
  createMuiTheme,
  StylesProvider,
  ThemeProvider,
  jssPreset,
} from "@material-ui/core/styles";

import AdminServices from "../../services/admin.services";

function DIR(props) {
  const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

  const rtlTheme = createMuiTheme({
    typography: { useNextVariants: true },
    direction: "rtl",
  });

  const ltrTheme = createMuiTheme({
    typography: { useNextVariants: true },
    direction: "ltr",
  });

  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={ltrTheme}>
        {props.ltrInput}
        <ThemeProvider theme={rtlTheme}>{props.rtlInput}</ThemeProvider>
      </ThemeProvider>
    </StylesProvider>
  );
}

function withMyHook(MyComponent) {
  return function WrappedComponent(props) {
    const useStyles = makeStyles((theme) => ({
      root: {
        display: "flex",
        flexWrap: "wrap",
      },
      title: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      },
      textField: {
        width: "49%",
      },
      formControl: {
        minWidth: 150,
        maxWidth: 300,
      },
      chips: {
        display: "flex",
        flexWrap: "wrap",
      },
      chip: {
        margin: 2,
      },
    }));
    const classes = useStyles();
    return <MyComponent {...props} classes={classes} />;
  };
}

class Scholarship extends React.Component {
  state = {
    _id: this.props._id || "",
    title: this.props.title || "",
    arTitle: this.props.arTitle || "",
    titleError: "",
    arTitleError: "",
    specialization: this.props.specialization || "",
    specializations: [],
    fees: this.props.fees || "",
    feesError: "",
    languages: [],
    selectedLanguages: this.props.selectedLanguages || [],
  };

  componentDidMount() {
    const fetchSpecializations = async () => {
      try {
        const specializations = await AdminServices.specializationsServices.fetchAll();
        this.setState({ specializations: specializations });
      } catch (error) {
        console.log(error);
      }
    };
    const fetchLanguages = async () => {
      const languages = await AdminServices.languagesServices.fetchAll();
      this.setState({ languages: languages });
    };
    fetchSpecializations();
    fetchLanguages();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + "Error"]: "",
    });
  };

  handleLanguagesSelect = (event) => {
    this.setState({ selectedLanguages: event.target.value });
  };

  validateInput = () => {
    let titleError = "",
      arTitleError = "";
    if (this.state.title === "") titleError = "This field cann't be empty!";
    if (this.state.arTitle === "")
      arTitleError = "هذا الحقل لايمكن أن يبقى فارغا!";
    if (titleError.length > 0 || arTitleError.length > 0) {
      this.setState({
        titleError: titleError,
        arTitleError: arTitleError,
      });
      return false;
    }
    return true;
  };

  validateNumber = () => {
    if (this.state.fees !== "") {
      if (isNaN(parseInt(this.state.fees)))
        this.setState({
          feesError: "You should Enter a valid fees number!!",
        });
    }
  };

  handleUpdate = async () => {
    if (this.validateInput()) {
      const result = await AdminServices.scholarshipsServices.updateScholarship(
        this.state._id,
        this.state.title,
        this.state.arTitle,
        this.state.fees,
        this.state.specialization,
        this.state.selectedLanguages
      );
      if (result) {
        this.setState({
          title: "",
          arTitle: "",
          titleError: "",
          arTitleError: "",
          specialization: "",
          specializations: [],
          fees: "",
          feesError: "",
          languages: [],
          selectedLanguages: [],
        });
        this.props.handleSuccess();
      }
    }
  };
  render() {
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };
    return (
      <Container>
        <div className={this.props.classes.root}>
          <div className={this.props.classes.title}>
            <DIR
              rtlInput={
                <TextField
                  id="arTitle"
                  name="arTitle"
                  label="الاسم"
                  value={this.state.arTitle}
                  onChange={this.handleChange}
                  onBlur={this.validateInput}
                  dir="rtl"
                  className={this.props.classes.textField}
                  variant="outlined"
                  helperText={
                    this.state.arTitleError
                      ? `${this.state.arTitleError}`
                      : `رجاء قم بإدخال اسم المنحة`
                  }
                  FormHelperTextProps={{
                    style: {
                      marginTop: "1rem",
                    },
                  }}
                  error={this.state.arTitleError ? true : false}
                />
              }
              ltrInput={
                <TextField
                  id="title"
                  name="title"
                  label="Name"
                  value={this.state.title}
                  onChange={this.handleChange}
                  onBlur={this.validateInput}
                  className={this.props.classes.textField}
                  variant="outlined"
                  helperText={
                    this.state.titleError
                      ? `${this.state.titleError}`
                      : `Please Enter Scholarship Name.`
                  }
                  FormHelperTextProps={{
                    style: {
                      marginTop: "1rem",
                    },
                  }}
                  error={this.state.titleError ? true : false}
                />
              }
            />
          </div>
          <div
            className={this.props.classes.title}
            style={{
              marginTop: "4rem",
            }}
          >
            <TextField
              id="fees"
              name="fees"
              label="Fees"
              value={this.state.fees}
              onChange={this.handleChange}
              onBlur={this.validateNumber}
              className={this.props.classes.textField}
              variant="outlined"
              helperText={
                this.state.feesError
                  ? `${this.state.feesError}`
                  : `Please Enter Scholarship Fees.`
              }
              error={this.state.feesError ? true : false}
            />
            <FormControl
              variant="outlined"
              className={this.props.classes.formControl}
            >
              <InputLabel id="specializationLabel">Specialization</InputLabel>
              <Select
                labelId="specializationLabel"
                id="specialization"
                name="specialization"
                value={this.state.specialization}
                onChange={this.handleChange}
                label="Specialization"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {this.state.specializations.map((spec) => {
                  return (
                    <MenuItem value={spec._id} key={spec._id}>
                      {spec.title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <div
            className={this.props.classes.title}
            style={{ marginTop: "2rem" }}
          >
            <FormControl
              className={this.props.classes.formControl}
              variant="outlined"
            >
              <InputLabel id="languages">Languages</InputLabel>
              <Select
                labelId="languages"
                id="languages"
                multiple
                value={this.state.selectedLanguages}
                onChange={this.handleLanguagesSelect}
                input={<Input />}
                renderValue={(selected) => (
                  <div className={this.props.classes.chips}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={
                          this.state.languages.find(
                            (language) => language._id === value
                          )?.title
                        }
                        className={this.props.classes.chip}
                      />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {this.state.languages.map((language) => (
                  <MenuItem key={language._id} value={language._id}>
                    <Checkbox
                      checked={
                        this.state.selectedLanguages.indexOf(language._id) > -1
                      }
                    />
                    <ListItemText primary={language.title} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

export default withMyHook(Scholarship);
