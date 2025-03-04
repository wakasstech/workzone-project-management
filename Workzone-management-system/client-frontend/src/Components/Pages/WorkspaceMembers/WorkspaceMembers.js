import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {workspaceDescriptionUpdate, workspaceTitleUpdate} from "../../../Services/boardsService";
import { useDispatch } from "react-redux";
import { Avatar, Box, Container, Divider, Typography } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import GroupAddIcon from "@mui/icons-material/GroupAdd"; // Import the GroupAddIcon from Material-UI
import PersonIcon from '@mui/icons-material/Person'; // Assuming this is the role icon
import EmailIcon from '@mui/icons-material/Email'; // Assuming this is the email icon
import "./WorkspaceMembers.css";
import Navbar from "../../Navbar";

const WorkspaceMembers = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState(
    location.state.workspace.name
  );
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(
    location.state.workspace.description
  );
  const workspace = location.state && location.state.workspace;
  console.log(workspace);
  const id = workspace?._id;

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdateTitleWorkspace = () => {
    workspaceTitleUpdate(newWorkspaceName, id, dispatch).then(() => {
      // After successful update, toggle off editing mode
      setIsEditing(false);
    });
  };
  const handleUpdateDescription = () => {
    workspaceDescriptionUpdate(newDescription, id, dispatch).then(() => {
      // After successful update, toggle off editing mode
      setIsDescriptionEditing(false);
    });
  };
  const toggleDescriptionEdit = () => {
    setIsDescriptionEditing(!isDescriptionEditing);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      const nameElement = document.getElementById("name-container");

      if (nameElement && !nameElement.contains(event.target)) {
        setIsEditing(false);
      }

      const descriptionElement = document.getElementById(
        "description-container"
      );

      if (descriptionElement && !descriptionElement.contains(event.target)) {
        setIsDescriptionEditing(false);
      }
    };

    if (isEditing || isDescriptionEditing) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isEditing, isDescriptionEditing]);
  useEffect(() => {
    setNewWorkspaceName(location.state.workspace.name);
    setNewDescription(location.state.workspace.description);
  }, [location.state.workspace.name, location.state.workspace.description]);

  // Function to generate the Avatar's letter based on the newWorkspaceName
  const getAvatarLetter = () => {
    if (newWorkspaceName && newWorkspaceName.length > 0) {
      return newWorkspaceName.charAt(0).toUpperCase();
    }
    return "";
  };

  return (
    <>
      <Navbar />
      {/* <Container className="workspace-container" style={{ marginTop: 80 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { lg: "row",md: "row", xs: "column" },
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0px 150px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div>
              <Avatar
                sx={{ bgcolor: deepOrange[500], borderRadius: 1 }}
                variant="square"
              >
                {getAvatarLetter()}
              </Avatar>
            </div>
            {isEditing ? (
              <div id="name-container" style={{ marginLeft: 8 }}>
                <input
                  type="text"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                />
                <button
                  style={{ marginLeft: 5 }}
                  onClick={handleUpdateTitleWorkspace}
                >
                  Save
                </button>
              </div>
            ) : (
              <div
                id="name-container"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginLeft: 8,
                  alignItems: "center",
                }}
              >
                <h4>{newWorkspaceName}</h4>
                <EditIcon
                  style={{ marginLeft: 5, fontSize: 16, cursor: "pointer" }}
                  onClick={toggleEdit}
                />
              </div>
            )}
          </div>
          <div style={{ alignItems: "center" }}>
            <button
              style={{
                cursor: "pointer",
                backgroundColor: "var(--ds-background-brand-bold,#0c66e4)",
                border: "none",
                boxShadow: "none",
                color: "var(--ds-text-inverse,#fff)",
                padding: "5px 10px",
                borderRadius: 3,
                fontFamily:
                  "Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                alignItems: "center",
              }}
            >
              {" "}
              <GroupAddIcon style={{ fontSize: 15 }} /> Invite Team Members
            </button>
          </div>
        </Box>

        <Box sx={{ padding: "50px 150px" }}>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: "30px",
              color: "var(--ds-text,#172b4d)",
              fontFamily:
                "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
            }}
          >
            Workspace Description
            {isDescriptionEditing ? (
              <span style={{ marginLeft: 10 }}>
                <button onClick={handleUpdateDescription}>Save</button>
              </span>
            ) : (
              <EditIcon
                style={{
                  marginLeft: 10,
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={toggleDescriptionEdit}
              />
            )}
          </Typography>
          {isDescriptionEditing ? (
            <div id="description-container" style={{ marginTop: 10 }}>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
          ) : (
            <p
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
                color: "var(--ds-text,#172b4d)",
                fontFamily:
                  "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
              }}
            >
              {newDescription}
            </p>
          )}
        </Box>

        <Divider sx={{ marginTop: 5 }} />

        <Box sx={{ padding: "50px 150px" }}>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: "30px",
              color: "var(--ds-text,#172b4d)",
              fontFamily:
                "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
            }}
          >
            Workspace Members ({workspace.members.length})
          </Typography>
          <p
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "20px",
              color: "var(--ds-text,#172b4d)",
              fontFamily:
                "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
            }}
          >
            Workspace members can view and join all Workspace visible boards and
            create new boards in the Workspace.
          </p>

          {workspace.members.map((member, index) => (
            <div key={index} style={{ marginTop: 10 }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "var(--ds-text,#172b4d)",
                }}
              >
                {member.name} {member.surname}
              </Typography>
              <Typography
                sx={{
                  marginTop: 1,
                  alignItems: 'center',
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "var(--ds-text,#172b4d)",
                }}
              >
                <PersonIcon style={{fontSize: 12}}/> {member.role} <EmailIcon style={{fontSize: 12, marginLeft:5}} /> {member.email}
              </Typography>
            </div>
          ))}
        </Box>
      </Container> */}
      <Container className="workspace-container" sx={{ marginTop: 8, px: { xs: 2, sm: 4, md: 6, lg: 12 } }}>
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 2,
    }}
  >
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <Avatar sx={{ bgcolor: deepOrange[500], borderRadius: 1, width: { xs: 30, sm: 40 }, height: { xs: 30, sm: 40 } }} variant="square">
        {getAvatarLetter()}
      </Avatar>
      {isEditing ? (
        <Box sx={{ ml: 1 }}>
          <input
            type="text"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
          />
          <button sx={{ ml: 1 }} onClick={handleUpdateTitleWorkspace}>Save</button>
        </Box>
      ) : (
        <Box sx={{ ml: 1, display: "flex", flexDirection: "row", alignItems: "center" }}>
          <Typography sx={{ fontSize: { xs: "14px", sm: "16px" } }}>{newWorkspaceName}</Typography>
          <EditIcon sx={{ ml: 1, fontSize: 16, cursor: "pointer" }} onClick={toggleEdit} />
        </Box>
      )}
    </Box>
    <Box>
      <button
        sx={{
          cursor: "pointer",
          backgroundColor: "#0c66e4",
          border: "none",
          boxShadow: "none",
          color: "#fff",
          padding: "5px 10px",
          borderRadius: 3,
          fontSize: { xs: "12px", sm: "14px" },
          display: "flex",
          alignItems: "center",
        }}
      >
        <GroupAddIcon sx={{ fontSize: 15, mr: 1 }} /> Invite Team Members
      </button>
    </Box>
  </Box>

  <Box sx={{ pt: 4 }}>
    <Typography sx={{ fontSize: { xs: "16px", sm: "18px" }, fontWeight: 600, color: "#172b4d" }}>
      Workspace Description
      {isDescriptionEditing ? (
        <span sx={{ ml: 2 }}>
          <button onClick={handleUpdateDescription}>Save</button>
        </span>
      ) : (
        <EditIcon sx={{ ml: 2, fontSize: 16, cursor: "pointer" }} onClick={toggleDescriptionEdit} />
      )}
    </Typography>
    {isDescriptionEditing ? (
      <Box sx={{ mt: 1 }}>
        <input type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
      </Box>
    ) : (
      <Typography sx={{ fontSize: "14px", fontWeight: 400, color: "#172b4d" }}>{newDescription}</Typography>
    )}
  </Box>

  <Divider sx={{ my: 4 }} />

  <Box>
    <Typography sx={{ fontSize: { xs: "16px", sm: "18px" }, fontWeight: 600, color: "#172b4d" }}>
      Workspace Members ({workspace.members.length})
    </Typography>
    <Typography sx={{ fontSize: "14px", fontWeight: 400, color: "#172b4d" }}>
      Workspace members can view and join all visible boards and create new boards.
    </Typography>

    {workspace.members.map((member, index) => (
      <Box key={index} sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: "16px", fontWeight: 600, color: "#172b4d" }}>
          {member.name} {member.surname}
        </Typography>
        <Typography sx={{ fontSize: "14px", fontWeight: 400, color: "#172b4d", display: "flex", alignItems: "center" }}>
          <PersonIcon sx={{ fontSize: 12, mr: 1 }} /> {member.role}
          <EmailIcon sx={{ fontSize: 12, ml: 1 }} /> {member.email}
        </Typography>
      </Box>
    ))}
  </Box>
</Container>

    </>
  );
};

export default WorkspaceMembers;
