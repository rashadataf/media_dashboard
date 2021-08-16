import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import ListItemText from "@material-ui/core/ListItemText";
import Input from "@material-ui/core/Input";

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
      formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
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

class NewProgram extends React.Component {
  state = {
    title: "",
    arTitle: "",
    titleError: "",
    arTitleError: "",
    years: 0,
    yearsError: "",
    normalPrice: 0,
    normalPriceError: "",
    discountPrice: 0,
    discountPriceError: "",
    scientificDegree: "",
    scientificDegreeError: "",
    scientificDegrees: [],
    specialization: "",
    specializationError: "",
    specializations: [],
    languages: [],
    selectedLanguages: [],
  };

  componentDidMount() {
    const fetchDegrees = async () => {
      const scientificDegrees = await AdminServices.degreesServices.fetchAll();
      this.setState({ scientificDegrees: scientificDegrees });
    };
    const fetchSpecializations = async () => {
      const specializations = await AdminServices.specializationsServices.fetchAll();
      this.setState({ specializations: specializations });
    };
    const fetchLanguages = async () => {
      const languages = await AdminServices.languagesServices.fetchAll();
      this.setState({ languages: languages });
    };
    fetchDegrees();
    fetchSpecializations();
    fetchLanguages();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + "Error"]: "",
    });
  };

  handleNumberChange = (event) => {
    if (!isNaN(parseInt(event.target.value)))
      this.setState({
        [event.target.name]: parseInt(event.target.value),
        [event.target.name + "Error"]: "",
      });
  };

  handleDegreeSelect = (event) => {
    this.setState({ scientificDegree: event.target.value });
  };

  handleSpecializationSelect = (event) => {
    this.setState({ specialization: event.target.value });
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

  handleSave = async () => {
    if (this.validateInput()) {
      const result = await AdminServices.programsServices.createNewProgram(
        this.state.title,
        this.state.arTitle,
        this.state.years,
        this.state.normalPrice,
        this.state.discountPrice,
        this.state.scientificDegree,
        this.state.specialization,
        this.state.selectedLanguages
      );
      if (result) {
        this.setState({
          title: "",
          arTitle: "",
          titleError: "",
          arTitleError: "",
          years: 0,
          yearsError: "",
          normalPrice: 0,
          normalPriceError: "",
          discountPrice: 0,
          discountPriceError: "",
          scientificDegree: "",
          scientificDegreeError: "",
          scientificDegrees: [],
          specialization: "",
          specializationError: "",
          specializations: [],
          languages: [],
          selectedLanguages: [],
        });
        this.props.handleChange(null, 0);
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
                      : `رجاء قم بإدخال اسم البرنامج`
                  }
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
                      : `Please Enter Program Name.`
                  }
                  error={this.state.titleError ? true : false}
                />
              }
            />
          </div>
          <div
            className={this.props.classes.title}
            style={{ marginTop: "1rem" }}
          >
            <TextField
              id="years"
              label="Years"
              name="years"
              type="number"
              variant="outlined"
              onChange={this.handleNumberChange}
              onBlur={this.validateInput}
              value={this.state.years}
              helperText={
                this.state.yearsError
                  ? `${this.state.yearsError}`
                  : `Please Enter Number of Program Years.`
              }
              error={this.state.yearsError ? true : false}
            />
            <TextField
              id="normalPrice"
              label="Normal Price"
              name="normalPrice"
              type="number"
              variant="outlined"
              onChange={this.handleNumberChange}
              onBlur={this.validateInput}
              value={this.state.normalPrice}
              helperText={
                this.state.normalPriceError
                  ? `${this.state.normalPriceError}`
                  : `Please Enter Number of Program Normal Price.`
              }
              error={this.state.normalPriceError ? true : false}
            />
            <TextField
              id="discountPrice"
              label="Discount Price"
              name="discountPrice"
              type="number"
              variant="outlined"
              onChange={this.handleNumberChange}
              onBlur={this.validateInput}
              value={this.state.discountPrice}
              helperText={
                this.state.discountPriceError
                  ? `${this.state.discountPriceError}`
                  : `Please Enter Number of Program Discount Price.`
              }
              error={this.state.discountPriceError ? true : false}
            />
          </div>
          <div
            className={this.props.classes.title}
            style={{ marginTop: "2rem" }}
          >
            <TextField
              id="scientificDegree"
              select
              label="Scientific Degree"
              value={this.state.scientificDegree}
              onChange={this.handleDegreeSelect}
              SelectProps={{
                native: true,
              }}
              helperText="Please select program degree"
              variant="outlined"
            >
              <option value="0">Please Select</option>
              {this.state.scientificDegrees.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.title}
                </option>
              ))}
            </TextField>
            <TextField
              id="specialization"
              select
              label="Specialization"
              value={this.state.specialization}
              onChange={this.handleSpecializationSelect}
              SelectProps={{
                native: true,
              }}
              helperText="Please select a specialization"
              variant="outlined"
            >
              <option value="0">Please Select</option>
              {this.state.specializations.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.title}
                </option>
              ))}
            </TextField>
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
                          ).title
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
            onClick={this.handleSave}
          >
            Save
          </Button>
        </div>
      </Container>
    );
  }
}

export default withMyHook(NewProgram);
