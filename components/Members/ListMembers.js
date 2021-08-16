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

import Member from "./Member";
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
    height: "95vh",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: "scroll",
  },
}));

function ListMembers({ isConnected }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [member, setMember] = useState({});
  const [id, setId] = useState("");
  useEffect(() => {
    async function fetchMembers() {
      let members = await AdminServices.membersServices.fetchAll();
      setMembers(members);
    }

    fetchMembers();
  }, []);

  const columns = [
    { field: "_id", flex: 1, hide: true },
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "status", headerName: "Status", flex: 0.5 },
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
              setMember(
                members.find((member) => member._id === params.row._id)
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
  if (members) {
    members.forEach((member, index) => {
      rows.push({
        id: index,
        _id: member._id,
        name: member.name,
        status: member.status,
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
    setMember({});
    setId("");
  };

  const handleSuccess = async () => {
    async function fetchMembers() {
      let members = await AdminServices.membersServices.fetchAll();
      handleClose();
      setMembers(members);
    }
    fetchMembers();
  };

  const handleDeletionSuccess = async () => {
    async function fetchMembers() {
      let members = await AdminServices.membersServices.fetchAll();
      setDialogOpen(false);
      setMembers(members);
    }
    fetchMembers();
  };

  const handleDialogClose = () => {
    setId("");
    setDialogOpen(false);
  };

  const handleDeleteConfirmation = async () => {
    try {
      const res = await AdminServices.membersServices.deleteMember(id);
      if (res) {
        handleDeletionSuccess();
      }
    } catch (error) {}
  };

  return (
    <>
      <p>{isConnected}</p>
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
          <h2 id="simple-modal-title">Update Member</h2>
          <div id="simple-modal-description">
            <Member
              name={member.name}
              email={member.email}
              nationality={member.nationality}
              phone={member.phone}
              residenceCountry={member.residenceCountry}
              image={member.imageUrl}
              specialization={member.specialization}
              university={member.university}
              _id={id}
              status={member.status}
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

export default ListMembers;

// <Rating name="read-only" value={value} readOnly />
