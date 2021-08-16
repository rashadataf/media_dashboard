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

class PublicQuestion extends React.Component {
  state = {
    _id: this.props._id || "",
    question: this.props.question || "",
    arQuestion: this.props.arQuestion || "",
    questionError: "",
    arQuestionError: "",
    answer: this.props.answer || "",
    answerError: "",
    arAnswer: this.props.arAnswer || "",
    arAnswerError: "",
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + "Error"]: "",
    });
  };

  validateInput = () => {
    let questionError = "",
      arQuestionError = "",
      answerError = "",
      arAnswerError = "";
    if (this.state.question === "")
      questionError = "This field cann't be empty!";
    if (this.state.arQuestion === "")
      arQuestionError = "هذا الحقل لايمكن أن يبقى فارغا!";
    if (this.state.answer === "") answerError = "This field cann't be empty!";
    if (this.state.arAnswer === "")
      arAnswerError = "هذا الحقل لايمكن أن يبقى فارغا!";

    if (
      questionError.length > 0 ||
      arQuestionError.length > 0 ||
      answerError.length > 0 ||
      arAnswerError.length > 0
    ) {
      this.setState({
        questionError: questionError,
        arQuestionError: arQuestionError,
      });
      return false;
    }
    return true;
  };

  handleUpdate = async () => {
    if (this.validateInput()) {
      const result = await AdminServices.publicQuestionsServices.updatePublicQuestion(
        this.state._id,
        this.state.question,
        this.state.arQuestion,
        this.state.answer,
        this.state.arAnswer
      );
      if (result) {
        this.setState({
          question: "",
          arQuestion: "",
          questionError: "",
          arQuestionError: "",
          answer: "",
          answerError: "",
          arAnswer: "",
          arAnswerError: "",
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
                  id="arQuestion"
                  name="arQuestion"
                  label="السؤال"
                  value={this.state.arQuestion}
                  onChange={this.handleChange}
                  onBlur={this.validateInput}
                  dir="rtl"
                  className={this.props.classes.textField}
                  variant="outlined"
                  helperText={
                    this.state.arQuestionError
                      ? `${this.state.arQuestionError}`
                      : `رجاء قم بإدخال السؤال`
                  }
                  error={this.state.arQuestionError ? true : false}
                />
              }
              ltrInput={
                <TextField
                  id="question"
                  name="question"
                  label="Question"
                  value={this.state.question}
                  onChange={this.handleChange}
                  onBlur={this.validateInput}
                  className={this.props.classes.textField}
                  variant="outlined"
                  helperText={
                    this.state.questionError
                      ? `${this.state.questionError}`
                      : `Please Enter Question.`
                  }
                  error={this.state.questionError ? true : false}
                />
              }
            />
          </div>
          <div
            className={this.props.classes.title}
            style={{ marginTop: "2rem" }}
          >
            <DIR
              rtlInput={
                <TextField
                  id="arAnswer"
                  name="arAnswer"
                  label="الجواب"
                  value={this.state.arAnswer}
                  onChange={this.handleChange}
                  onBlur={this.validateInput}
                  multiline={true}
                  dir="rtl"
                  className={this.props.classes.textField}
                  variant="outlined"
                  helperText={
                    this.state.arAnswerError
                      ? `${this.state.arAnswerError}`
                      : `رجاء قم بإدخال الجواب`
                  }
                  error={this.state.arAnswerError ? true : false}
                />
              }
              ltrInput={
                <TextField
                  id="answer"
                  name="answer"
                  label="Answer"
                  value={this.state.answer}
                  onChange={this.handleChange}
                  onBlur={this.validateInput}
                  multiline={true}
                  className={this.props.classes.textField}
                  variant="outlined"
                  helperText={
                    this.state.answerError
                      ? `${this.state.answerError}`
                      : `Please Enter Answer.`
                  }
                  error={this.state.answerError ? true : false}
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

export default withMyHook(PublicQuestion);
