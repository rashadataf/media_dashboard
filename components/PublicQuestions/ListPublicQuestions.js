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

import PublicQuestion from "./PublicQuestion";
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
    width: "60vw",
    height: "60vh",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function ListPublicQuestions() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [publicQuestions, setPublicQuestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [publicQuestion, setPublicQuestion] = useState({});
  const [id, setId] = useState("");
  useEffect(() => {
    async function fetchPublicQuestions() {
      let publicQuestions = await AdminServices.publicQuestionsServices.fetchAll();
      setPublicQuestions(publicQuestions);
    }

    fetchPublicQuestions();
  }, []);

  const columns = [
    { field: "_id", flex: 1, hide: true },
    { field: "id", headerName: "ID" },
    { field: "question", headerName: "Question", flex: 1 },
    { field: "arQuestion", headerName: "السؤال", flex: 1 },
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
              setPublicQuestion(
                publicQuestions.find(
                  (publicQuestion) => publicQuestion._id === params.row._id
                )
              );
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
  if (publicQuestions) {
    publicQuestions.forEach((publicQuestion, index) => {
      rows.push({
        id: index,
        _id: publicQuestion._id,
        question: publicQuestion.question,
        arQuestion: publicQuestion.arQuestion,
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
    setPublicQuestion({});
    setId("");
  };

  const handleSuccess = async () => {
    async function fetchPublicQuestions() {
      let publicQuestions = await AdminServices.publicQuestionsServices.fetchAll();
      handleClose();
      setPublicQuestions(publicQuestions);
    }
    fetchPublicQuestions();
  };

  const handleDeletionSuccess = async () => {
    async function fetchPublicQuestions() {
      let publicQuestions = await AdminServices.publicQuestionsServices.fetchAll();
      setDialogOpen(false);
      setPublicQuestions(publicQuestions);
    }
    fetchPublicQuestions();
  };

  const handleDialogClose = () => {
    setId("");
    setDialogOpen(false);
  };

  const handleDeleteConfirmation = async () => {
    try {
      const res = await AdminServices.publicQuestionsServices.deletePublicQuestion(
        id
      );
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
          <h2 id="simple-modal-title">Update PublicQuestion</h2>
          <div id="simple-modal-description">
            <PublicQuestion
              question={publicQuestion.question}
              arQuestion={publicQuestion.arQuestion}
              answer={publicQuestion.answer}
              arAnswer={publicQuestion.arAnswer}
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

export default ListPublicQuestions;

// <Rating name="read-only" value={value} readOnly />
