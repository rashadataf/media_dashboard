import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";

import Chip from "@material-ui/core/Chip";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import ListItemText from "@material-ui/core/ListItemText";
import Input from "@material-ui/core/Input";

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

function RTL(props) {
  const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

  const rtlTheme = createMuiTheme({
    typography: { useNextVariants: true },
    direction: "rtl",
  });

  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={rtlTheme}>{props.children}</ThemeProvider>
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
      button: {
        marginTop: theme.spacing(3),
        marginRight: theme.spacing(5),
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

class Service extends React.Component {
  state = {
    _id: this.props._id || "",
    title: this.props.title || "",
    arTitle: this.props.arTitle || "",
    titleError: "",
    arTitleError: "",
    description: this.props.description || "",
    arDescription: this.props.arDescription || "",
    image: this.props.image || null,
    imagePreview: this.props.image
      ? "http://localhost:3000/" + this.props.image
      : null,
    categories: [],
    selectedCategories: this.props.categories || [],
    editorState:
      this.props.description === ""
        ? EditorState.createEmpty()
        : EditorState.createWithContent(
            convertFromRaw(JSON.parse(this.props.description))
          ),
    arEditorState:
      this.props.arDescription === ""
        ? EditorState.createEmpty()
        : EditorState.createWithContent(
            convertFromRaw(JSON.parse(this.props.arDescription))
          ),
  };

  componentDidMount() {
    const fetchCategories = async () => {
      const categories = await AdminServices.categoriesServices.fetchAll();
      this.setState({ categories: categories });
    };
    fetchCategories();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + "Error"]: "",
    });
  };

  handleDescriptionChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    this.setState({
      editorState: editorState,
      description: JSON.stringify(convertToRaw(contentState)),
    });
  };

  handleArDescriptionChange = (arEditorState) => {
    const contentState = arEditorState.getCurrentContent();
    this.setState({
      arEditorState: arEditorState,
      arDescription: JSON.stringify(convertToRaw(contentState)),
    });
  };

  handleCategoriesSelect = (event) => {
    this.setState({ selectedCategories: event.target.value });
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

  handleUpdate = async () => {
    if (this.validateInput()) {
      const formData = new FormData();
      formData.append("title", this.state.title);
      formData.append("arTitle", this.state.arTitle);
      formData.append(
        "categories",
        JSON.stringify(this.state.selectedCategories)
      );
      formData.append("image", this.state.image);
      formData.append("description", this.state.description);
      formData.append("arDescription", this.state.arDescription);
      const result = await AdminServices.servicesServices.updateService(
        this.state._id,
        formData
      );
      if (result) {
        this.setState({
          title: "",
          arTitle: "",
          titleError: "",
          arTitleError: "",
          description: "",
          arDescription: "",
          image: null,
          imagePreview: "",
          categories: [],
          selectedCategories: [],
          editorState: EditorState.createEmpty(),
          arEditorState: EditorState.createEmpty(),
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
                      : `رجاء قم بإدخال اسم الخدمة`
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
                      : `Please Enter Service Name.`
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
                    this.setState({ imagePreview: null, image: "" });
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
            <FormControl
              className={this.props.classes.formControl}
              variant="outlined"
            >
              <InputLabel id="categories">Categories</InputLabel>
              <Select
                labelId="categories"
                id="categories"
                multiple
                value={this.state.selectedCategories}
                onChange={this.handleCategoriesSelect}
                input={<Input />}
                renderValue={(selected) => (
                  <div className={this.props.classes.chips}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={
                          this.state.categories.find(
                            (category) => category._id === value
                          )?.title
                        }
                        className={this.props.classes.chip}
                      />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {this.state.categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    <Checkbox
                      checked={
                        this.state.selectedCategories.indexOf(category._id) > -1
                      }
                    />
                    <ListItemText primary={category.title} />
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

export default withMyHook(Service);
