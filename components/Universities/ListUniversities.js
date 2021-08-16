import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import DeleteIcon from "@material-ui/icons/Delete";

import University from "./University";
import AdminServices from "../../services/admin.services";

function getModalStyle() {
  return {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "70vw",
    height: "95vh",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflowY: "scroll",
  },
}));

function ListUniversities() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [blogs, setUniversities] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [university, setUniversity] = useState({});
  const [id, setId] = useState("");
  useEffect(() => {
    async function fetchUniversities() {
      let universities = await AdminServices.universitiesServices.fetchAll();
      setUniversities(universities);
    }
    fetchUniversities();
  }, []);

  const columns = [
    { field: "_id", flex: 1, hide: true },
    { field: "id", headerName: "ID" },
    { field: "title", headerName: "Title", flex: 0.5 },
    { field: "arTitle", headerName: "الاسم", flex: 0.5 },
    {
      field: "action",
      headerName: " ",
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => (
        <strong>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => {
              setUniversity(blogs.find((blog) => blog._id === params.row._id));
              setId(params.row._id);
              handleOpen(true);
            }}
            startIcon={<EditTwoToneIcon />}
          >
            edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => {
              setId(params.row._id);
              setDialogOpen(true);
            }}
            startIcon={<DeleteIcon />}
          >
            delete
          </Button>
        </strong>
      ),
    },
  ];
  const rows = [];
  if (blogs) {
    blogs.forEach((blog, index) => {
      rows.push({
        id: index,
        _id: blog._id,
        title: blog.title,
        arTitle: blog.arTitle,
        action: (
          <Button variant="contained" color="primary">
            Primary
          </Button>
        ),
      });
    });
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUniversity({});
    setId("");
  };

  const handleSuccess = async () => {
    async function fetchUniversitys() {
      let universities = await AdminServices.universitiesServices.fetchAll();
      handleClose();
      setUniversities(universities);
    }
    fetchUniversitys();
  };

  const handleDeletionSuccess = async () => {
    async function fetchUniversitys() {
      let universities = await AdminServices.universitiesServices.fetchAll();
      setDialogOpen(false);
      setUniversities(universities);
    }
    fetchUniversitys();
  };

  const handleDialogClose = () => {
    setId("");
    setDialogOpen(false);
  };

  const handleDeleteConfirmation = async () => {
    try {
      const res = await AdminServices.universitiesServices.deleteUniversity(id);
      if (res) {
        handleDeletionSuccess();
      }
    } catch (error) {}
  };

  return (
    <>
      <div style={{ display: "flex", height: "68vh" }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            // className="DataGrid"
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">Update University</h2>
          <div id="simple-modal-description">
            <University
              title={university.title}
              arTitle={university.arTitle}
              establishmentYear={university.establishmentYear}
              selectedState={university.state}
              selectedArea={university.area}
              address={university.address}
              normalPrice={university.normalPrice}
              discountPrice={university.discountPrice}
              localRate={university.localRate}
              internationalRate={university.internationalRate}
              studentsCount={university.studentsCount}
              specializationsCount={university.specializationsCount}
              website={university.website}
              selectedColleges={university.colleges}
              selectedSpecializations={university.specializations}
              selectedScientificDegrees={university.scientificDegrees}
              selectedPrograms={university.programs}
              selectedCountry={university.country}
              selectedLanguages={university.languages}
              images={university.images}
              description={university.description}
              arDescription={university.arDescription}
              _id={id}
              handleSuccess={handleSuccess}
            />
          </div>
        </div>
      </Modal>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you you want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmation} color="secondary">
            Yes
          </Button>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ListUniversities;
