import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";

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
    }));
    const classes = useStyles();
    return <MyComponent {...props} classes={classes} />;
  };
}

class Area extends React.Component {
  state = {
    _id: this.props._id || "",
    title: this.props.title || "",
    arTitle: this.props.arTitle || "",
    titleError: "",
    arTitleError: "",
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + "Error"]: "",
    });
  };

  validateInput = () => {
    let titleError = "",
      arTitleError = "";
    if (this.state.title === "") titleError = "This field cann't be empty!";
    if (this.state.arTitle === "")
      arTitleError = "?????? ?????????? ???????????? ???? ???????? ??????????!";
    if (titleError.length > 0 || arTitleError.length > 0) {
      this.setState({
        titleError: titleError,
        arTitleError: arTitleError,
      });
      return false;
    }
    return true;
  };

  handleUpdate = async () => {
    if (this.validateInput()) {
      const result = await AdminServices.areasServices.updateArea(
        this.state._id,
        this.state.title,
        this.state.arTitle
      );
      if (result) {
        this.setState({
          title: "",
          arTitle: "",
          titleError: "",
          arTitleError: "",
        });
        this.props.handleSuccess();
      }
    }
  };
  render() {
    return (
      <Container>
        <div className={this.props.classes.root}>
          <div className={this.props.classes.title}>
            <DIR
              rtlInput={
                <TextField
                  id="arTitle"
                  name="arTitle"
                  label="??????????"
                  value={this.state.arTitle}
                  onChange={this.handleChange}
                  onBlur={this.validateInput}
                  dir="rtl"
                  className={this.props.classes.textField}
                  variant="outlined"
                  helperText={
                    this.state.arTitleError
                      ? `${this.state.arTitleError}`
                      : `???????? ???? ???????????? ?????? ??????????????`
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
                      : `Please Enter Area Name.`
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
