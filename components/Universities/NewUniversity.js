import React from "react";
import dynamic from "next/dynamic";

import { EditorState } from "draft-js";
import { convertFromHTML, convertToHTML } from "draft-convert";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Chip from "@material-ui/core/Chip";
import Container from "@material-ui/core/Container";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

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
        minWidth: 200,
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

class NewUniversity extends React.Component {
  state = {
    title: "",
    arTitle: "",
    titleError: "",
    arTitleError: "",
    establishmentYear: "",
    establishmentYearError: "",
    selectedState: "",
    states: [],
    selectedArea: "",
    areas: [],
    address: "",
    normalPrice: "",
    discountPrice: "",
    localRate: "",
    localRateError: "",
    internationalRate: "",
    internationalRateError: "",
    studentsCount: "",
    studentsCountError: "",
    specializationsCount: "",
    website: "",
    description: "",
    arDescription: "",
    colleges: [],
    selectedColleges: [],
    specializations: [],
    selectedSpecializations: [],
    scientificDegrees: [],
    selectedScientificDegrees: [],
    programs: [],
    selectedPrograms: [],
    countries: [],
    selectedCountry: "",
    languages: [],
    selectedLanguages: [],
    images: [],
    imagesPreviews: [],
    editorState: EditorState.createEmpty(),
    arEditorState: EditorState.createEmpty(),
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
    const fetchPrograms = async () => {
      const programs = await AdminServices.programsServices.fetchAll();
      this.setState({ programs: programs });
    };
    const fetchStates = async () => {
      const states = await AdminServices.statesServices.fetchAll();
      this.setState({ states: states });
    };
    const fetchCountries = async () => {
      const countries = await AdminServices.countriesServices.fetchAll();
      this.setState({ countries: countries });
    };
    const fetchAreas = async () => {
      const areas = await AdminServices.areasServices.fetchAll();
      this.setState({ areas: areas });
    };

    const fetchColleges = async () => {
      const colleges = await AdminServices.collegesServices.fetchAll();
      this.setState({ colleges: colleges });
    };
    fetchDegrees();
    fetchSpecializations();
    fetchLanguages();
    fetchPrograms();
    fetchStates();
    fetchCountries();
    fetchAreas();
    fetchColleges();
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

  handleScientificDegreesSelect = (event) => {
    this.setState({ selectedScientificDegrees: event.target.value });
  };

  handleSpecializationSelect = (event) => {
    this.setState({ specialization: event.target.value });
  };

  handleLanguagesSelect = (event) => {
    this.setState({ selectedLanguages: event.target.value });
  };

  handleProgramsSelect = (event) => {
    this.setState({ selectedPrograms: event.target.value });
  };

  handleCollegesSelect = (event) => {
    this.setState({ selectedColleges: event.target.value });
  };

  handleSpecializationsSelect = (event) => {
    this.setState({ selectedSpecializations: event.target.value });
  };

  handleStateSelect = (event) => {
    if (event.target.value !== 0)
      this.setState({ selectedState: event.target.value });
    else this.setState({ selectedState: "" });
  };

  handleCountrySelect = (event) => {
    if (event.target.value !== 0)
      this.setState({ selectedCountry: event.target.value });
    else this.setCountry({ selectedCountry: "" });
  };

  handleAreaSelect = (event) => {
    if (event.target.value !== 0)
      this.setState({ selectedArea: event.target.value });
    else this.setState({ selectedArea: "" });
  };

  handleDescriptionChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    this.setState({
      editorState: editorState,
      description: convertToHTML(contentState),
    });
  };

  handleArDescriptionChange = (arEditorState) => {
    const contentState = arEditorState.getCurrentContent();
    this.setState({
      arEditorState: arEditorState,
      arDescription: convertToHTML(contentState),
    });
  };

  validateInput = () => {
    let titleError = "",
      arTitleError = "";
    if (this.state.title.length === 0)
      titleError = "This field cann't be empty!";
    if (this.state.arTitle.length === 0)
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

  convertImageToData = async (img) => {
    const reader = new FileReader();
    reader.onerror = (err) => console.log(err);
    reader.onload = (e) => {
      const imagesPreviews = this.state.imagesPreviews;
      imagesPreviews.push(e.target.result);
      this.setState({ imagesPreviews: imagesPreviews });
    };
    reader.readAsDataURL(img);
  };

  handleImageChange = async (event) => {
    let images = this.state.images;
    let newImages = [];
    if (event.target.files) {
      newImages = Array.from(event.target.files);
      images = images.concat(newImages);
      for (let i = 0; i < event.target.files.length; i++) {
        await this.convertImageToData(event.target.files[i]);
      }
      this.setState({ images: images });
    }
  };

  deleteImage = (index) => {
    let imagesPreviews = this.state.imagesPreviews;
    let images = this.state.images;
    imagesPreviews.splice(index, 1);

    images.splice(index, 1);

    this.setState({ imagesPreviews: imagesPreviews, images: images });
  };

  handleSave = async () => {
    if (this.validateInput()) {
      const formData = new FormData();
      formData.append("title", this.state.title);
      formData.append("arTitle", this.state.arTitle);
      formData.append("establishmentYear", this.state.establishmentYear);
      formData.append("selectedState", this.state.selectedState);
      formData.append("selectedArea", this.state.selectedArea);
      formData.append("address", this.state.address);
      formData.append("normalPrice", this.state.normalPrice);
      formData.append("discountPrice", this.state.discountPrice);
      formData.append("localRate", this.state.localRate);
      formData.append("internationalRate", this.state.internationalRate);
      formData.append("studentsCount", this.state.studentsCount);
      formData.append("specializationsCount", this.state.specializationsCount);
      formData.append("website", this.state.website);
      formData.append("description", this.state.description);
      formData.append("arDescription", this.state.arDescription);
      formData.append(
        "selectedColleges",
        JSON.stringify(this.state.selectedColleges)
      );
      formData.append(
        "selectedSpecializations",
        JSON.stringify(this.state.selectedSpecializations)
      );
      formData.append(
        "selectedScientificDegrees",
        JSON.stringify(this.state.selectedScientificDegrees)
      );
      formData.append(
        "selectedPrograms",
        JSON.stringify(this.state.selectedPrograms)
      );
      formData.append("selectedCountry", this.state.selectedCountry);
      formData.append(
        "selectedLanguages",
        JSON.stringify(this.state.selectedLanguages)
      );
      for (let i = 0; i < this.state.images.length; i++) {
        formData.append("images", this.state.images[i]);
      }
      const result = await AdminServices.universitiesServices.createNewUniversity(
        formData
      );
      if (result) {
        this.setState({
          title: "",
          arTitle: "",
          titleError: "",
          arTitleError: "",
          establishmentYear: "",
          establishmentYearError: "",
          selectedState: "",
          states: [],
          selectedArea: "",
          areas: [],
          address: "",
          normalPrice: "",
          discountPrice: "",
          localRate: "",
          localRateError: "",
          internationalRate: "",
          internationalRateError: "",
          studentsCount: "",
          studentsCountError: "",
          specializationsCount: "",
          website: "",
          description: "",
          arDescription: "",
          colleges: [],
          selectedColleges: [],
          specializations: [],
          selectedSpecializations: [],
          scientificDegrees: [],
          selectedScientificDegrees: [],
          programs: [],
          selectedPrograms: [],
          countries: [],
          selectedCountry: "",
          languages: [],
          selectedLanguages: [],
          images: [],
          imagesPreviews: [],
          editorState: EditorState.createEmpty(),
          arEditorState: EditorState.createEmpty(),
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
                      : `رجاء قم بإدخال اسم الجامعة`
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
                  className={this.props.classes.textField}
                  variant="outlined"
                  onChange={this.handleChange}
                  onBlur={this.validateInput}
                  helperText={
                    this.state.titleError
                      ? `${this.state.titleError}`
                      : `Please Enter University Name.`
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
          <div style={{ width: "100%", marginTop: "2rem" }}>
            <label
              style={{
                display: "block",
                padding: "1.5rem 0",
              }}
            >
              Description
            </label>
            <Editor
              editorState={this.state.editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="Wrapper"
              editorClassName="Editor"
              onEditorStateChange={this.handleDescriptionChange}
            />
          </div>
          <div style={{ width: "100%", marginTop: "2rem" }}>
            <label
              style={{
                display: "block",
                padding: "1.5rem 0",
                textAlign: "right",
              }}
            >
              الوصف
            </label>
            <Editor
              editorState={this.state.arEditorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="Wrapper"
              editorClassName="Editor"
              onEditorStateChange={this.handleArDescriptionChange}
              textAlignment="right"
            />
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
            <FormControl
              className={this.props.classes.formControl}
              variant="outlined"
            >
              <InputLabel id="scientificDegrees">Scientific Degrees</InputLabel>
              <Select
                labelId="scientificDegrees"
                id="scientificDegrees"
                multiple
                value={this.state.selectedScientificDegrees}
                onChange={this.handleScientificDegreesSelect}
                input={<Input />}
                renderValue={(selected) => (
                  <div className={this.props.classes.chips}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={
                          this.state.scientificDegrees.find(
                            (scientificDegree) => scientificDegree._id === value
                          ).title
                        }
                        className={this.props.classes.chip}
                      />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {this.state.scientificDegrees.map((scientificDegree) => (
                  <MenuItem
                    key={scientificDegree._id}
                    value={scientificDegree._id}
                  >
                    <Checkbox
                      checked={
                        this.state.selectedScientificDegrees.indexOf(
                          scientificDegree._id
                        ) > -1
                      }
                    />
                    <ListItemText primary={scientificDegree.title} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              className={this.props.classes.formControl}
              variant="outlined"
            >
              <InputLabel id="programs">Programs</InputLabel>
              <Select
                labelId="programs"
                id="programs"
                multiple
                value={this.state.selectedPrograms}
                onChange={this.handleProgramsSelect}
                input={<Input />}
                renderValue={(selected) => (
                  <div className={this.props.classes.chips}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={
                          this.state.programs.find(
                            (program) => program._id === value
                          ).title
                        }
                        className={this.props.classes.chip}
                      />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {this.state.programs.map((program) => (
                  <MenuItem key={program._id} value={program._id}>
                    <Checkbox
                      checked={
                        this.state.selectedPrograms.indexOf(program._id) > -1
                      }
                    />
                    <ListItemText primary={program.title} />
                  </MenuItem>
                ))}
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
              <InputLabel id="colleges">Colleges</InputLabel>
              <Select
                labelId="colleges"
                id="colleges"
                multiple
                value={this.state.selectedColleges}
                onChange={this.handleCollegesSelect}
                input={<Input />}
                renderValue={(selected) => (
                  <div className={this.props.classes.chips}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={
                          this.state.colleges.find(
                            (college) => college._id === value
                          ).title
                        }
                        className={this.props.classes.chip}
                      />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {this.state.colleges.map((college) => (
                  <MenuItem key={college._id} value={college._id}>
                    <Checkbox
                      checked={
                        this.state.selectedColleges.indexOf(college._id) > -1
                      }
                    />
                    <ListItemText primary={college.title} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              className={this.props.classes.formControl}
              variant="outlined"
            >
              <InputLabel id="specializations">Specializations</InputLabel>
              <Select
                labelId="specializations"
                id="specializations"
                multiple
                value={this.state.selectedSpecializations}
                onChange={this.handleSpecializationsSelect}
                input={<Input />}
                renderValue={(selected) => (
                  <div className={this.props.classes.chips}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={
                          this.state.specializations.find(
                            (specialization) => specialization._id === value
                          ).title
                        }
                        className={this.props.classes.chip}
                      />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {this.state.specializations.map((specialization) => (
                  <MenuItem key={specialization._id} value={specialization._id}>
                    <Checkbox
                      checked={
                        this.state.selectedSpecializations.indexOf(
                          specialization._id
                        ) > -1
                      }
                    />
                    <ListItemText primary={specialization.title} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div
            className={this.props.classes.title}
            style={{ marginTop: "5rem" }}
          >
            <TextField
              id="establishmentYear"
              label="Establishment Year"
              name="establishmentYear"
              type="number"
              variant="outlined"
              onChange={this.handleNumberChange}
              onBlur={this.validateInput}
              value={this.state.establishmentYear}
              helperText={
                this.state.establishmentYearError
                  ? `${this.state.establishmentYearError}`
                  : `Please Enter Establishment Year`
              }
              error={this.state.establishmentYearError ? true : false}
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
            style={{ marginTop: "5rem", justifyContent: "space-evenly" }}
          >
            <TextField
              id="localRate"
              style={{ width: "30%" }}
              label="Local Rate"
              name="localRate"
              type="number"
              variant="outlined"
              onChange={this.handleNumberChange}
              onBlur={this.validateInput}
              value={this.state.localRate}
              helperText={
                this.state.localRateError
                  ? `${this.state.localRateError}`
                  : `Please Enter Local Rate`
              }
              error={this.state.localRateError ? true : false}
            />
            <TextField
              id="internationalRate"
              label="International Rate"
              name="internationalRate"
              type="number"
              style={{ width: "30%" }}
              variant="outlined"
              onChange={this.handleNumberChange}
              onBlur={this.validateInput}
              value={this.state.internationalRate}
              helperText={
                this.state.internationalRateError
                  ? `${this.state.internationalRateError}`
                  : `Please Enter International Rate`
              }
              error={this.state.internationalRateError ? true : false}
            />
          </div>
          <div
            className={this.props.classes.title}
            style={{ marginTop: "2rem", justifyContent: "space-evenly" }}
          >
            <TextField
              id="studentsCount"
              label="Students Count"
              name="studentsCount"
              type="number"
              style={{ width: "30%" }}
              variant="outlined"
              onChange={this.handleNumberChange}
              onBlur={this.validateInput}
              value={this.state.studentsCount}
              helperText={
                this.state.studentsCountError
                  ? `${this.state.studentsCountError}`
                  : `Please Enter Students Count`
              }
              error={this.state.studentsCountError ? true : false}
            />
            <TextField
              id="specializationsCount"
              label="Specializations Count"
              name="specializationsCount"
              type="number"
              variant="outlined"
              style={{ width: "30%" }}
              onChange={this.handleNumberChange}
              onBlur={this.validateInput}
              value={this.state.specializationsCount}
              helperText={
                this.state.specializationsCountError
                  ? `${this.state.specializationsCountError}`
                  : `Please Enter Specializations Count`
              }
              error={this.state.specializationsCountError ? true : false}
            />
          </div>
          <div
            className={this.props.classes.title}
            style={{ marginTop: "5rem" }}
          >
            <TextField
              id="country"
              select
              label="Country"
              style={{ width: "30%" }}
              value={this.state.selectedCountry}
              onChange={this.handleCountrySelect}
              SelectProps={{
                native: true,
              }}
              helperText="Please select Country"
              variant="outlined"
            >
              <option value="0">Please Select</option>
              {this.state.countries.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.title}
                </option>
              ))}
            </TextField>

            <TextField
              id="state"
              select
              label="State"
              style={{ width: "30%" }}
              value={this.state.selectedState}
              onChange={this.handleStateSelect}
              SelectProps={{
                native: true,
              }}
              helperText="Please select State"
              variant="outlined"
            >
              <option value="0">Please Select</option>
              {this.state.states.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.title}
                </option>
              ))}
            </TextField>
            <TextField
              id="area"
              select
              label="Area"
              style={{ width: "30%" }}
              value={this.state.selectedArea}
              onChange={this.handleAreaSelect}
              SelectProps={{
                native: true,
              }}
              helperText="Please select a area"
              variant="outlined"
            >
              <option value="0">Please Select</option>
              {this.state.areas.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.title}
                </option>
              ))}
            </TextField>
          </div>
          <div style={{ marginTop: "4rem", width: "100%" }}>
            <TextField
              id="address"
              name="address"
              label="Address"
              style={{ width: "100%" }}
              value={this.state.address}
              onChange={this.handleChange}
              onBlur={this.validateInput}
              multiline={true}
              className={this.props.classes.textField}
              variant="outlined"
              helperText="Please Enter Address."
            />
          </div>
          <div style={{ marginTop: "4rem", width: "100%" }}>
            <TextField
              id="website"
              name="website"
              label="Official Website"
              style={{ width: "100%" }}
              value={this.state.website}
              onChange={this.handleChange}
              onBlur={this.validateInput}
              className={this.props.classes.textField}
              variant="outlined"
              helperText="Please Enter Official Website."
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
                  style={{ marginRight: "3rem" }}
                  accept="image/*"
                  id="image"
                  hidden
                  multiple
                />
              </Button>
            </div>
            {this.state.imagesPreviews && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  maxWidth: "650px",
                  padding: "8px",
                }}
              >
                {this.state.imagesPreviews.map((imagePreview, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        margin: "8px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <img
                        src={imagePreview}
                        alt="image"
                        width={150}
                        height={150}
                      />
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        style={{ marginTop: "1rem" }}
                        onClick={() => this.deleteImage(index)}
                        startIcon={<DeleteIcon />}
                      >
                        delete
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "5rem", backgroundColor: "#00BF00" }}
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

export default withMyHook(NewUniversity);
