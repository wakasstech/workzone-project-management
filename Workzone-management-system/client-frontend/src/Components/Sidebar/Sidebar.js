import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
  Box,
  Collapse,
  Accordion,
  AccordionSummary, // Import Collapse for dropdown effect
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Icon for expanded dropdown
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DropdownMenu from "../DropdownMenu";
import styled from "styled-components";
import { xs } from "../../BreakPoints";
import WorkspaceDropdown from "../WorkspaceDropdown";
import { useDispatch, useSelector } from "react-redux";
import { getBoards, getWorkspaces } from "../../Services/boardsService";
import AddIcon from "@mui/icons-material/Add";
import CreateMenu from "../CreateMenu";
import "./Sidebar.css";
import { Board } from "./StyleId";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Add } from "@mui/icons-material";
import CreateBoard from "../Modals/CreateBoardModal/CreateBoard";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 245,
    marginTop: 48,
    paddingBottom: 45,
  
  },
  gradientBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    backdropFilter: 'blur(24px)'
  },
  whiteBackground: {
    backgroundColor: "white",
  },
  mobileIconButton: {
    fontWeight: "bold",
    marginTop: 60,
    position: "absolute",
    color: "white",
  },
  spaceName: {
    fontSize: 2,
    color: "red",
  },
}));

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 10px;
  align-items: center;
  justify-content: flex-start;
  ${xs({
    display: "none",
  })}
`;

const Sidebar = (props) => {
  const boardWorkspace = Number(props.workspaceId);
  const [expanded, setExpanded] = React.useState(false);

  // Filter workspaces based on workspaceId

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const isMobile = useMediaQuery(theme.breakpoints.down(788)); // Modify the breakpoint as needed
  const { workspacesData } = useSelector((state) => state.workspaces);
  const filteredWorkspaces = Array.isArray(workspacesData)
    ? workspacesData.filter((workspace) => workspace?._id === boardWorkspace)
    : [];
  const [openModal, setOpenModal] = useState(false);

  const { pending, boardsData } = useSelector((state) => state.boards);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  const handleClickBoards = (workspaceId) => {
    console.log("Workspace ID:", workspaceId);
    history.push(`/board/${workspaceId}`);
    localStorage.setItem("workspaceId", workspaceId);
  };

  const handleClickMembers = (workspace) => {
    history.push({
      pathname: "/checknew/member",
      state: { workspace: workspace },
    });
  };

  const handleClickBox = (boardId) => {
    // const boardId = e.target.id;
    // alert("hello")
    console.log(boardId, 'boardId');
    console.log(boardWorkspace, 'boardWorkspace');
    history.push(`/board/${boardWorkspace}/${boardId}`);
  };

  useEffect(() => {
    getWorkspaces(false, dispatch).then((response) => {
      console.log(response); // Check the response here
    });
  }, [dispatch]);

  // Add a useEffect to fetch boardsData when workspaceId changes
  useEffect(() => {
    if (boardWorkspace) {
      getBoards(false, dispatch, boardWorkspace);
    }
  }, [dispatch, boardWorkspace]); // Watch for changes in workspaceId

  return (
    <React.Fragment>
      {isMobile ? (
        <IconButton
          className={classes.mobileIconButton}
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerOpen}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      ) : (
        <Drawer
          variant="permanent"
          classes={{
            paper: `${classes.drawer} ${props.flag === 'board' ? classes.gradientBackground : classes.whiteBackground}`,
          }}
          open={drawerOpen}
        >
          <List>
            <Box className="workspace" style={{ marginTop: 16 }}>
              {Array.isArray(filteredWorkspaces) ? (
                filteredWorkspaces.map((workspace, index) => (
                  <Box key={workspace._id}>
                    <Box
                      aria-controls={`workspace-${index}-content`}
                      id={`workspace-${index}-header`}
                      sx={{
                        padding: "0px 15px",
                        justifyContent: "space-between",
                        border: "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between", // Center space between elements
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              marginRight: "8px",
                              padding: "0x 9px",
                              width: "30px", // Set the width of the Avatar
                              height: "30px", // Set the height of the Avatar
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "10%", // Make it a circle
                              background: 'linear-gradient(to  bottom, rgb(109,110,178), rgb(91,144,204))',
                              color: "white", // Text color
                              fontWeight: "bold",
                              fontSize: "16px", // Font size
                            }}
                          >
                            {workspace?.name?.charAt(0).toUpperCase()}
                          </div>
                          <ListItemText
                            primaryTypographyProps={{
                              style: {
                                color: "#243757",
                                fontWeight: "800",
                                fontSize: '13px',
                                fontFamily:
                                  "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                              },
                              textTransform: "uppercase", // Add this line

                            }}
                            primary={workspace?.name.toUpperCase()} // Use toUpperCase() to transform the text
                          />
                        </div>
                      </div>
                    </Box>
                    <List sx={{ paddingTop: 2, paddingLeft: 1 }}>
                      <ListItem
                        button
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <div style={{ marginRight: "8px" }}>
                          <DashboardIcon
                            style={{
                              color: "#878b92",
                              fontSize: "14px",
                            }}
                          />
                        </div>
                        <ListItemText
                          primary="Boards"
                          onClick={() => handleClickBoards(workspace._id)}
                          primaryTypographyProps={{
                            style: {
                              fontSize: "14px",
                              marginBottom: 3, // Change the font size to the desired value
                              color: "var(--ds-text,#172b4d)",
                              fontFamily:
                                "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                            },
                          }}
                        />
                      </ListItem>
                      <ListItem
                        button
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <div style={{ marginRight: "8px" }}>
                          <GroupIcon
                            style={{
                              color: "#878b92",
                              fontSize: "14px",
                            }}
                          />
                        </div>
                        <ListItemText
                          primaryTypographyProps={{
                            style: {
                              fontSize: "14px", // Change the font size to the desired value
                              marginBottom: 3, // Change the font size to the desired value
                              color: "var(--ds-text,#172b4d)",
                              fontFamily:
                                "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                            },
                          }}
                          primary="Members"
                          onClick={() => handleClickMembers(workspace)}
                        />
                      </ListItem>
                    </List>

                    <ListItem button sx={{ padding: "2px 15px", alignItems: 'center' }}>
                      <ListItemText
                        primary="Your Boards"
                        primaryTypographyProps={{
                          style: {
                            // fontSize: "14px", // Change the font size to the desired value
                            // color: "var(--ds-text,#172b4d)",
                            // fontWeight: 500,
                            // fontFamily:
                            //   "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                            color: "#243757",
                            fontWeight: "800",
                            fontSize: '15px',
                            fontFamily:
                              "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                          
                          },
                        }}
                      />
                      {props.role === 'admin' &&
                      <Add style={{fontSize: '20px',fontWeight:'bold', marginBottom: 6, color: "var(--ds-text,#172b4d)",}} onClick={() => setOpenModal(true)} />
                      
                      }
                      </ListItem>
                    {openModal && (
                      <CreateBoard
                        callback={handleModalClose}
                        workspace={boardWorkspace}
                      />
                    )}

                    {/* Map Boards data with avatar title */}

                    {!pending &&
                      boardsData &&
                      Object.values(boardsData).map((item) => (
                        <Box sx={{marginTop: '2px'}}
                          key={item._id}
                          id={item._id}
                          className="board-container"
                          onClick={() => handleClickBox(item._id)}
                        >
                          <Box className="avatar">
                            <img
                              src={item.backgroundImageLink}
                              alt={item.title}
                            />
                          </Box>
                          <Box className="board-title">{item.title}</Box>
                        </Box>
                      ))}
                  </Box>
                ))
              ) : (
                <div
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    marginTop: "20px",
                    color: "var(--ds-text,#172b4d)",
                    fontFamily:
                      "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add a box shadow
                    padding: "10px",
                    borderRadius: "8px",
                    background: "white",
                    animation: "loading 1s infinite alternate", // Add a loading animation
                  }}
                >
                  Checking for Workspaces data ... Wait
                </div>
              )}
            </Box>
          </List>
        </Drawer>
      )}
      {isMobile && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerClose}
          classes={{
            paper: classes.drawer,
          }}
        >
           <List>
            <Box className="workspace" style={{ marginTop: 16 }}>
              {Array.isArray(filteredWorkspaces) ? (
                filteredWorkspaces.map((workspace, index) => (
                  <Box key={workspace._id}>
                    <Box
                      aria-controls={`workspace-${index}-content`}
                      id={`workspace-${index}-header`}
                      sx={{
                        padding: "0px 15px",
                        justifyContent: "space-between",
                        border: "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between", // Center space between elements
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              marginRight: "8px",
                              padding: "0x 9px",
                              width: "30px", // Set the width of the Avatar
                              height: "30px", // Set the height of the Avatar
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "10%", // Make it a circle
                              background: 'linear-gradient(to  bottom, rgb(109,110,178), rgb(91,144,204))',
                              color: "white", // Text color
                              fontWeight: "bold",
                              fontSize: "16px", // Font size
                            }}
                          >
                            {workspace?.name?.charAt(0).toUpperCase()}
                          </div>
                          <ListItemText
                            primaryTypographyProps={{
                              style: {
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "var(--ds-text,#172b4d)",
                                fontFamily:
                                  "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                                textTransform: "uppercase", // Add this line
                              },
                            }}
                            primary={workspace?.name.toUpperCase()} // Use toUpperCase() to transform the text
                          />
                        </div>
                      </div>
                    </Box>
                    <List sx={{ paddingTop: 2, paddingLeft: 1 }}>
                      <ListItem
                        button
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <div style={{ marginRight: "8px" }}>
                          <DashboardIcon
                            style={{
                              color: "#878b92",
                              fontSize: "14px",
                            }}
                          />
                        </div>
                        <ListItemText
                          primary="Boards"
                          onClick={() => handleClickBoards(workspace._id)}
                          primaryTypographyProps={{
                            style: {
                              fontSize: "14px",
                              marginBottom: 3, // Change the font size to the desired value
                              color: "var(--ds-text,#172b4d)",
                              fontFamily:
                                "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                            },
                          }}
                        />
                      </ListItem>
                      <ListItem
                        button
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <div style={{ marginRight: "8px" }}>
                          <GroupIcon
                            style={{
                              color: "#878b92",
                              fontSize: "14px",
                            }}
                          />
                        </div>
                        <ListItemText
                          primaryTypographyProps={{
                            style: {
                              fontSize: "14px", // Change the font size to the desired value
                              marginBottom: 3, // Change the font size to the desired value
                              color: "var(--ds-text,#172b4d)",
                              fontFamily:
                                "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                            },
                          }}
                          primary="Members"
                          onClick={() => handleClickMembers(workspace)}
                        />
                      </ListItem>
                    </List>

                    <ListItem button sx={{ padding: "2px 15px", alignItems: 'center' }}>
                      <ListItemText
                        primary="Your Boards"
                        primaryTypographyProps={{
                          style: {
                            fontSize: "14px", // Change the font size to the desired value
                            color: "var(--ds-text,#172b4d)",
                            fontWeight: 500,
                            fontFamily:
                              "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                          },
                        }}
                      />
                      {props.role === 'admin' &&
                      <Add style={{fontSize: '17px', marginBottom: 6, color: "var(--ds-text,#172b4d)",}} onClick={() => setOpenModal(true)} />
                      }
                      </ListItem>
                    {openModal && (
                      <CreateBoard
                        callback={handleModalClose}
                        workspace={boardWorkspace}
                      />
                    )}

                    {/* Map Boards data with avatar title */}

                    {!pending &&
                      boardsData &&
                      Object.values(boardsData).map((item) => (
                        <Box sx={{marginTop: '2px'}}
                          key={item._id}
                          id={item._id}
                          className="board-container"
                          onClick={() => handleClickBox(item._id)}
                        >
                          <Box className="avatar">
                            <img
                              src={item.backgroundImageLink}
                              alt={item.title}
                            />
                          </Box>
                          <Box className="board-title">{item.title}</Box>
                        </Box>
                      ))}
                  </Box>
                ))
              ) : (
                <div
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    marginTop: "20px",
                    color: "var(--ds-text,#172b4d)",
                    fontFamily:
                      "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add a box shadow
                    padding: "10px",
                    borderRadius: "8px",
                    background: "white",
                    animation: "loading 1s infinite alternate", // Add a loading animation
                  }}
                >
                  Checking for Workspaces data ... Wait
                </div>
              )}
            </Box>
          </List>
        </Drawer>
      )}
    </React.Fragment>
  );
};

export default Sidebar;
