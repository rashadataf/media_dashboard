import React, { useState, useEffect } from "react";

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

import Media from "./Media";
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
    width: "80vw",
    height: "80vh",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: "scroll",
  },
}));

export default function ListMedia() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [media, setMedia] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cMedia, setCMedia] = useState({});
  const [id, setId] = useState("");
  useEffect(() => {
    async function fetchMedia() {
      let media = await AdminServices.mediaServices.fetchAll();
      setMedia(media);
    }
    fetchMedia();
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
              setCMedia(media.find((m) => m._id === params.row._id));
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
  if (media) {
    media.forEach((area, index) => {
      rows.push({
        id: index,
        _id: area._id,
        title: area.title,
        arTitle: area.arTitle,
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
    setCMedia({});
    setId("");
  };

  const handleSuccess = async () => {
    async function fetchMedia() {
      let media = await AdminServices.mediaServices.fetchAll();
      handleClose();
      setMedia(media);
    }
    fetchMedia();
  };

  const handleDeletionSuccess = async () => {
    async function fetchMedia() {
      let media = await AdminServices.mediaServices.fetchAll();
      setDialogOpen(false);
      setMedia(media);
    }
    fetchMedia();
  };

  const handleDialogClose = () => {
    setId("");
    setDialogOpen(false);
  };

  const handleDeleteConfirmation = async () => {
    try {
      const res = await AdminServices.mediaServices.deleteMedia(id);
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
          <h2 id="simple-modal-title">Update Media</h2>
          <div id="simple-modal-description">
            <Media
              title={cMedia.title}
              arTitle={cMedia.arTitle}
              images={cMedia.images}
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

// <Rating name="read-only" value={value} readOnly />
