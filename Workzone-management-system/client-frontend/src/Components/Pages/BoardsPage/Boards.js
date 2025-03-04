import LoadingScreen from "../../LoadingScreen";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBoards,
  handleDeleteBoardById,
} from "../../../Services/boardsService";

import Navbar from "../../Navbar";
import { AddBoard, Board, Container, Title, Wrapper, BoardHeader } from "./Styled";
import CreateBoard from "../../Modals/CreateBoardModal/CreateBoard";
import { useHistory } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/DeleteForeverOutlined";
import ConfirmationDialog from "../../Modals/ConfirmationDialog";
import Sidebar from "../../Sidebar/Sidebar";
import { TypeAnimation } from "react-type-animation";
import TopBarBoards from "./TopBarBoards/TopBarBoards";
import { ClickableIcon } from './CommonStyleId';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { MoreVertOutlined } from "@mui/icons-material";
import Loader from "../../Loader";
import { openAlert } from "../../../Redux/Slices/alertSlice";
import { Typography } from "@mui/material";


const Boards = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { userInfo } = useSelector((state) => state.user);
  const userRole = userInfo?.userType;

  const spaceId = props.match.params.workspaceId;
  const workspaceId = localStorage.getItem("workspaceId");
  const workspaceName = localStorage.getItem("workspaceName");
  console.log(spaceId, "from params space id");
  console.log(workspaceId, "from local storage");
  console.log(workspaceId, "from redux storage");

  const { pending, boardsData } = useSelector((state) => state.boards);
  const [openModal, setOpenModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [searchString, setSearchString] = useState("");

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const ref = useRef();

  const handleDeleteBoard = (event, boardId) => {
    event.stopPropagation();
    setAnchorEl(null)
    setBoardToDelete(boardId);
    setConfirmationOpen(true);
  };
  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
    setBoardToDelete(null);
  };

  const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

  const handleModalClose = () => {
    setOpenModal(false);
  };

  // const handleClickBoard = (e) => {
  //   const boardId = e.target.id;
  //   setLoader(true);
  //   history.push(`/board/${workspaceId}/${boardId}`);
  //   setLoader(false);
  // };
  const handleClickBoard = (e) => {
   
    setLoader(true);
    const boardId = e.target.id;
    console.log(workspaceId, 'board iddd')
    history.push(`/board/${workspaceId}/${boardId}`);
    setLoader(false);
  };
  


  // Add a useEffect to fetch boardsData when workspaceId changes
  useEffect(() => {
    if (workspaceId) {
      setLoader(true); // Set board loader to true before API call
  
      getBoards(false, dispatch, workspaceId)
        .then(() => {
          setLoader(false); // Set board loader to false after API call is complete
        })
        .catch((error) => {
          console.error("Error fetching boards:", error);
          setLoader(false); // Set board loader to false even if there's an error
        });
    }
  }, [dispatch, workspaceId]);

  useEffect(() => {
    document.title = "Boards ";
  }, []);
  return (
    <>
      {pending && <LoadingScreen />}
      <Container>
        <Sidebar flag={"boards"} workspaceId={workspaceId} role={userRole}/>

        <Navbar
          searchString={searchString}
          setSearchString={setSearchString}
          flag={"boards"}
        />

        <Wrapper>
          <TopBarBoards spaceName={workspaceName} role={userRole} />
          {/* <Title>Your Boards</Title> */}
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              "Your",
              1000, // wait 1s before replacing "Mice" with "Hamsters"
              "Boards",
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
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Add a subtle shadow,
              cursor: "default",
              fontWeight: "bold",
              fontSize: "1.3rem",
              textAlign: "center",
              width: "100vw",
              marginBottom: "1rem",
              color: "#FFFFFF",
              userSelect: "none",
            }}
            repeat={Infinity}
          />
          {!pending &&
            Object.values(boardsData)
              .filter((item) =>
                searchString
                  ? item.title
                      .toLowerCase()
                      .includes(searchString.toLowerCase())
                  : true
              )
              .map((item) => {
                return (
                  <Board
                    key={item._id}
                    link={item.backgroundImageLink}
                    isImage={item.isImage}
                    id={item._id}
                    onClick={(e) => handleClickBoard(e)}
                  >
                              <BoardHeader>
                              <Typography sx={{backgroundColor:'white',fontSize: 14, textTransform: 'capitalize', color: '#36358B', padding: '0px 12px', fontWeight:'bold', borderTopRightRadius:10}}>
                            {item.title}
                            </Typography>
                    {/* <DeleteIcon
                      sx={{ float: "right" }}
                      onClick={(e) => handleDeleteBoard(e, item._id, dispatch)}
                    /> */}
                  {userRole === 'admin' &&
                    <ClickableIcon
									color='white'
									aria-controls='basic-menu'
									aria-haspopup='true'
									aria-expanded={open ? 'true' : undefined}
									onClick={handleClick}
								>
									<MoreVertOutlined fontSize='0.1rem' onClick={() => {}} />
                 
								</ClickableIcon>
                }
                </BoardHeader>

								<Menu
									id='basic-menu'
									anchorEl={anchorEl}
									open={open}
									onClose={handleClose}
									MenuListProps={{
										'aria-labelledby': 'basic-button',
									}}
								>						
                    <MenuItem   onClick={(e) => handleDeleteBoard(e, item._id, dispatch)}>
										<ListItemIcon>
											<DeleteIcon fontSize='small' />
										</ListItemIcon>
										<ListItemText>Delete</ListItemText>										
									</MenuItem>
                  </Menu>
                  </Board>
                );
              })}
              {userRole === 'admin' && !pending && (
          // {!pending && (
            <AddBoard onClick={() => setOpenModal(true)}>
              Create new board
            </AddBoard>
          )}
          {openModal && (
            <CreateBoard callback={handleModalClose} workspace={workspaceId} />
          )}
        </Wrapper>
        {loader && <Loader />} 
      </Container>
      {/* Confirmation dialog */}
      <ConfirmationDialog
        open={confirmationOpen}
        onClose={handleCloseConfirmation}
        message="Are you sure you want to delete this board?"
        onConfirm={(e) =>
         
          handleDeleteBoardById(
            workspaceId,
            e,
            boardToDelete,
            dispatch,
            setBoardToDelete,
            handleCloseConfirmation
          )
          
        }
        // onConfirm={(e) => {
        //   console.log("delete");
        //   handleCloseConfirmation();
        //   handleClose();
        //   dispatch(
        //     openAlert({
        //       message: "🚧 This feature is currently under maintenance. It will be available soon!",
        //       severity: "error",
        //     }) 
        //   );
        // }}
        
      />
    </>
  );
};

export default Boards;
