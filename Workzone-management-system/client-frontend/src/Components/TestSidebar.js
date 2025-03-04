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
import DropdownMenu from "./DropdownMenu";
import styled from "styled-components";
import { xs } from "../BreakPoints";
import WorkspaceDropdown from "./WorkspaceDropdown";
import { useDispatch, useSelector } from "react-redux";
import { getWorkspaces } from "../Services/boardsService";
import AddIcon from "@mui/icons-material/Add";
import CreateMenu from "./CreateMenu";
import "./TestSidebar.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Groups2 } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 245,
    marginTop: 48,
    backgroundColor: "white",
    backdropFilter: "blur(24px)",
    borderRight:"1px solid #80808054 !important",
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

const TestSidebar = (props) => {

  const [expanded, setExpanded] = React.useState(0);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const isMobile = useMediaQuery(theme.breakpoints.down(788)); // Modify the breakpoint as needed
  const { pending, workspacesData } = useSelector((state) => state.workspaces);

  const [drawerOpen, setDrawerOpen] = useState(false);

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
  const handleAllUsers = () => {
    history.push(`/all/users`);
    
  };
  const handleClickMembers = (workspace) => {
    history.push({
      pathname: '/checknew/member',
      state: { workspace: workspace },
    });
  };
  useEffect(() => {
    getWorkspaces(false, dispatch).then((response) => {
      console.log(response); // Check the response here
    });
  }, [dispatch]);
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
        style={{borderRight: '1px solid #dcdcdc !important',
      }}
          variant="permanent"
          classes={{
            paper: classes.drawer,
          }}
          open={drawerOpen}
        >
          <List>
            <ListItem button sx={{ padding: "5px 15px", marginTop: "25px" }}>
              <ListItemText
                primary="Workspaces"
                primaryTypographyProps={{
                style: {
                  color: "#243757",
                  fontWeight: "800",
                  fontSize: '15px',
                  fontFamily:
                    "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                }
              }}
              />
               { props.role === 'admin' && 
              <CreateMenu flag={"sidebar"} />
            }
             
            </ListItem>
            <Box style={{}}>
              {Array.isArray(workspacesData) ? (
                workspacesData.map((workspace, index) => (
                  <Accordion key={workspace._id}
                  expanded={expanded === index} 
                  onChange={() => setExpanded(expanded === index ? false : index)}>
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon style={{ color: "#A6ADA9" }} />
                      }
                      aria-controls={`workspace-${index}-content`}
                      id={`workspace-${index}-header`}
                      sx={{
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
                              padding: "9px",
                              width: "19px", // Set the width of the Avatar
                              height: "22px", // Set the height of the Avatar
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "10%", // Make it a circle
                              background:
                              'linear-gradient(to  bottom, rgb(109,110,178), rgb(91,144,204))',                              color: "white", // Text color
                              fontWeight: "bold",
                              fontSize: "16px", // Font size
                            }}
                          >
                            {workspace?.name?.charAt(0).toUpperCase()}
                          </div>
                          <ListItemText
                            primaryTypographyProps={{
                              style: {
                                fontSize: "13px", // Change the font size to the desired value
                                color: "var(--ds-text,#172b4d)",
                                fontFamily:
                                  "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                              },
                            }}
                            primary={workspace?.name}
                          />
                        </div>
                      </div>
                    </AccordionSummary>
                    <List sx={{ paddingLeft: "28px", paddingTop: 0 }}>
                      <ListItem button>
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
                              fontSize: "13px", // Change the font size to the desired value
                              color: "var(--ds-text,#172b4d)",
                              fontFamily:
                                "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                            },
                          }}
                        />
                      </ListItem>
                      <ListItem button>
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
                              fontSize: "13px", // Change the font size to the desired value
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
                  </Accordion>
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
            { props.role === 'admin'  && 
            <ListItem button sx={{ padding: "5px 15px", marginTop: "25px" }}> 
            <Groups2   onClick={handleAllUsers} style={{    color: 'rgb(91, 144, 204)', fontSize: 22}} />
              <ListItemText onClick={handleAllUsers}
                primary="Users"
                primaryTypographyProps={{
                style: {
                  marginLeft: 8,
                  color: "#243757",
                  fontWeight: "400",
                  fontSize: '15px',
                  fontFamily:
                    "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                }
              }}
              />
              
              {/* <Groups2 style={{    color: 'rgb(135, 139, 146)', fontSize: 14}} /> */}
            </ListItem>
}
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
            <ListItem button sx={{ padding: "5px 15px", marginTop: "25px" }}>
              <ListItemText
                primary="Workspaces"
                primaryTypographyProps={{
                style: {
                  color: "#243757",
                  fontWeight: "800",
                  fontSize: '15px',
                  fontFamily:
                    "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                }
              }}
              />
               { props.role === 'admin' && 
              <CreateMenu flag={"sidebar"} />
            }
             
            </ListItem>
            <Box style={{}}>
              {Array.isArray(workspacesData) ? (
                workspacesData.map((workspace, index) => (
                  <Accordion key={workspace._id}
                  expanded={expanded === index} 
                  onChange={() => setExpanded(expanded === index ? false : index)}>
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon style={{ color: "#A6ADA9" }} />
                      }
                      aria-controls={`workspace-${index}-content`}
                      id={`workspace-${index}-header`}
                      sx={{
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
                              padding: "9px",
                              width: "19px", // Set the width of the Avatar
                              height: "22px", // Set the height of the Avatar
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "10%", // Make it a circle
                              background:
                              'linear-gradient(to  bottom, rgb(109,110,178), rgb(91,144,204))',                              color: "white", // Text color
                              fontWeight: "bold",
                              fontSize: "16px", // Font size
                            }}
                          >
                            {workspace?.name?.charAt(0).toUpperCase()}
                          </div>
                          <ListItemText
                            primaryTypographyProps={{
                              style: {
                                fontSize: "13px", // Change the font size to the desired value
                                color: "var(--ds-text,#172b4d)",
                                fontFamily:
                                  "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                              },
                            }}
                            primary={workspace?.name}
                          />
                        </div>
                      </div>
                    </AccordionSummary>
                    <List sx={{ paddingLeft: "28px", paddingTop: 0 }}>
                      <ListItem button>
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
                              fontSize: "13px", // Change the font size to the desired value
                              color: "var(--ds-text,#172b4d)",
                              fontFamily:
                                "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                            },
                          }}
                        />
                      </ListItem>
                      <ListItem button>
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
                              fontSize: "13px", // Change the font size to the desired value
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
                  </Accordion>
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
            { props.role === 'admin'  && 
            <ListItem button sx={{ padding: "5px 15px", marginTop: "25px" }}> 
            <Groups2   onClick={handleAllUsers} style={{    color: 'rgb(91, 144, 204)', fontSize: 22}} />
              <ListItemText onClick={handleAllUsers}
                primary="Users"
                primaryTypographyProps={{
                style: {
                  marginLeft: 8,
                  color: "#243757",
                  fontWeight: "400",
                  fontSize: '15px',
                  fontFamily:
                    "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif",
                }
              }}
              />
              
              {/* <Groups2 style={{    color: 'rgb(135, 139, 146)', fontSize: 14}} /> */}
            </ListItem>
}
          </List>
        </Drawer>
      )}
    </React.Fragment>
  );
};

export default TestSidebar;
