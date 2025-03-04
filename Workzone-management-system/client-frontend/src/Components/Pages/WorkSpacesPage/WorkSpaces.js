

import LoadingScreen from "../../LoadingScreen";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getWorkspaces,
  handleDeleteBoardById,
} from "../../../Services/boardsService";

import Navbar from "../../Navbar";
import { AddWorkspace, Board, Container, Title, Wrapper } from "./StyleId";
import CreateBoard from "../../Modals/CreateBoardModal/CreateBoard";
import { useHistory } from "react-router-dom";
import TestSidebar from "../../TestSidebar";
import DeleteIcon from "@mui/icons-material/DeleteForeverOutlined";
import { setWorkspaceId } from "../../../Redux/Slices/workspacesSlice";
import { Box, CircularProgress, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { TypeAnimation } from "react-type-animation";
import Loader from "../../Loader";
import MemberModal from "../../MemberModal";
import { ClickableIcon } from "../BoardsPage/CommonStyleId";
import { MoreVertOutlined } from "@mui/icons-material";
import { BoardHeader } from "../BoardsPage/Styled";
import { openAlert } from "../../../Redux/Slices/alertSlice";
import axios from "axios";
import Swal from "sweetalert2";

const Workspaces = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { pending, workspacesData } = useSelector((state) => state.workspaces);
  const { userInfo } = useSelector((state) => state.user);
  const userRole = userInfo?.userType;
   
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const ref = useRef();


  console.log(userRole, 'user type is here.........');
  const [loader, setLoader] = useState(false);
  const [searchString, setSearchString] = useState("");
  const id = '1';


  const handleClickMenu = (event) => {
    event.preventDefault();
    event.stopPropagation(); // Prevent click from reaching Board

		setAnchorEl(event.currentTarget);
	};
  const handleClose = (e) => {
    e.stopPropagation(); // Prevents the click from reaching the Board
		setAnchorEl(null);
	};
   const handleClick = (e, workspaceName, id) => {
    const workspaceId = e.target.id || id;
    // alert(workspaceId)
  //  const id =  db.workspaceId.find().forEach(function(doc){ 
  //     doc._id=doc.UserId; db.status_new.insert(doc);
  // });
    // console.log(workspaceId, 'workspace iddd')

    history.push(`/board/${workspaceId}`);
    dispatch(setWorkspaceId(workspaceId)); 
    localStorage.setItem("workspaceId", workspaceId);
    localStorage.setItem("workspaceName", workspaceName);
    if (workspacesData && workspacesData.length > 0) {
      // console.log(workspacesData[0].members);
        localStorage.setItem("workspacesData", JSON.stringify(workspacesData[0].members));
    } 
  };




  useEffect(() => {
    setLoader(true); 

    getWorkspaces(false, dispatch)
      .then(() => {
        setLoader(false); 
      })
      .catch((error) => {
        console.error("Error fetching workspaces:", error);
        setLoader(false); 
      });
  }, [dispatch]);
 
 
  const handleDeleteWorksapce =async (event, workspaceId) => {
    event.stopPropagation();
    setAnchorEl(null);
    console.log(workspaceId)
    // try {
    //   if (workspaceId) {
    //     await axios.delete(
    //       `https://taskmanagement.ranaafaqali.com/api/workspace/${workspaceId}/delete-workspace`
    //     );
      
    //     await getWorkspaces(false, dispatch);
    //     setAnchorEl(null);
    //     dispatch(
    //       openAlert({
    //         message: 'Workspace deleted successfully',
    //         severity: 'success',
    //       })
    //     );
    //   }
     
    // } catch (error) {
    //   dispatch(
    //     openAlert({
    //       message: 'Workspace not deleted, something went wrong',
    //       severity: 'error',
    //     })
    //   );
    // }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6B5AE0", // Purple shade matching the image theme
      cancelButtonColor: "#4169E1", // Royal Blue shade matching the image theme
      confirmButtonText: "Yes, delete it!",
      background: "#1A1C39", // Darker background to match the image aesthetic
      color: "#fff", // White text for better contrast,
      willOpen: () => {
        document.querySelector(".swal2-icon").style.margin = "0 auto";
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        
        try {
      
          if (workspaceId) {
            await axios.delete(
              `https://taskmanagement.ranaafaqali.com/api/workspace/${workspaceId}/delete-workspace`
            );
  
            await getWorkspaces(false, dispatch);
           
            dispatch(
              openAlert({
                message: "Workspace deleted successfully",
                severity: "success",
              })
            );
          }
        } catch (error) {
          dispatch(
            openAlert({
              message: "Workspace not deleted, something went wrong",
              severity: "error",
            })
          );
        }
      } 
    });
   
  };
  
  useEffect(() => {
    document.title = "Workspaces ";
  }, []);

  return (
    <>
      {/* {pending && <LoadingScreen />} */}
      <Container>
        <TestSidebar role={userRole}/>
        
        <Navbar
          searchString={searchString}
          spaces={"spaces"}
          setSearchString={setSearchString}
          role={userRole}
        />
       <Box sx={{display: 'flex',  justifyContent: 'flex-start'}}> 
            
             {userRole === 'admin' && <MemberModal/>} 
           </Box>
        <Wrapper>
          {/* <Title>Your Workspaces</Title> */}
        
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              "Your",
              1000, // wait 1s before replacing "Mice" with "Hamsters"
              "Workspaces",
              1000,
              // 'Your Boardsafds',
              // 1000,
              // 'Your Boarasdsadds',
              // 1000
            ]}
            wrapper="span"
            speed={20}
            style={{
              fontFamily: "Arial, sans-serif",
              cursor: "default",
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: "2rem",
              textAlign: "center",
              width: "100vw",
              marginBottom: "2rem",
              textShadow: "2px 3px 4px rgb(6, 6, 19)" /* Add a text shadow */,
              userSelect: "none",
            }}
            repeat={Infinity}
          />
       
         
        
          {/* <Box> */}
           
          {!pending &&
            workspacesData.length > 0 &&
            workspacesData
              .filter((item) =>
                searchString
                  ? item.name.toLowerCase().includes(searchString.toLowerCase())
                  : true
              )
              .map((item) => {
                return (
                  <>
                    <Board
                      key={item._id}
                      id={item._id}
                      onClick={(e) => handleClick(e, item?.name,item._id )}
                    >

                      <BoardHeader>

                    
                     <Typography sx={{backgroundColor:'white',fontSize: 14, textTransform: 'capitalize',color: '#36358B', padding: '0px 12px', fontWeight:'bold', borderTopRightRadius:10}}>
                     {item?.name}
                      </Typography> 

                       {userRole === 'admin' &&
                                          <ClickableIcon
                                        color='white'
                                        aria-controls='basic-menu'
                                        aria-haspopup='true'
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClickMenu}
                                      >
                                        <MoreVertOutlined fontSize='0.1rem' onClick={() => {}} />
                                       
                                      </ClickableIcon>
                                      }
                                        </BoardHeader>

                                        <Menu
									id='basic-menu'
									anchorEl={anchorEl}
									open={open}
									onClose={(e) => handleClose(e)}
									MenuListProps={{
										'aria-labelledby': 'basic-button',
									}}
								>						
                    <MenuItem   onClick={(e) => handleDeleteWorksapce(e, item._id)}>
										<ListItemIcon>
											<DeleteIcon fontSize='small' />
										</ListItemIcon>
										<ListItemText>Delete</ListItemText>										
									</MenuItem>
                  </Menu>
                    </Board>
                  
                  </> 
                );
              })}
          {/* </Box> */}
        </Wrapper>
       
        
      </Container>
      {loader && <Loader />} 
    </>
  );
};

export default Workspaces;


