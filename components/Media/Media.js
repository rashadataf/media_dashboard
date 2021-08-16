import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";

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

class Media extends React.Component {
  state = {
    _id: this.props._id || "",
    title: this.props.title || "",
    arTitle: this.props.arTitle || "",
    titleError: "",
    arTitleError: "",
    oldImages: this.props.images || [],
    images: [],
    imagesPreviews:
      this.props.images.map((img) => `http://localhost:3000/${img}`) || [],
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
    if (this.state.title.length === 0)
      titleError = "This field can't be empty!";
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
    let oldImages = this.state.oldImages;
    let images = this.state.images;
    imagesPreviews.splice(index, 1);
    if (oldImages.length > 0) {
      if (index < oldImages.length) {
        oldImages.splice(index, 1);
      } else {
        images.splice(index - oldImages.length, 1);
      }
    } else {
      images.splice(index, 1);
    }

    this.setState({
      imagesPreviews: imagesPreviews,
      oldImages: oldImages,
      images: images,
    });
  };

  handleUpdate = async () => {
    if (this.validateInput()) {
      const formData = new FormData();
      formData.append("title", this.state.title);
      formData.append("arTitle", this.state.arTitle);
      for (let i = 0; i < this.state.images.length; i++) {
        formData.append("images", this.state.images[i]);
      }
      formData.append("oldImages", JSON.stringify(this.state.oldImages));
      const result = await AdminServices.mediaServices.updateMedia(
        this.state._id,
        formData
      );
      if (result) {
        this.setState({
          title: "",
          arTitle: "",
          titleError: "",
          arTitleError: "",
          images: [],
          imagesPreviews: [],
          oldImages: [],
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
                      : `رجاء قم بإدخال اسم الميديا`
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
                      : `Please Enter Media Name.`
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
          <div style={{ width: "100%", marginTop: "2rem", display: "flex" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button
                variant="contained"
                color="default"
                component="label"
                className={this.props.classes.button}
                startIcon={<CloudUploadIcon />}
              >
                Upload Images
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

export default withMyHook(Media);
