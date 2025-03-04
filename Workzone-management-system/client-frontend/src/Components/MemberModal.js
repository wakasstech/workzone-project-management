

import * as React from "react";
import   { useState, useEffect } from 'react';
import Select from 'react-select';
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";
import { sm, xs } from "../BreakPoints";
import { Avatar, Button, Typography } from "@mui/material";
import { Code, Group, GroupAddOutlined, GroupAddSharp, GroupAddTwoTone } from "@mui/icons-material";
import { colourStyles } from "./SelectStyle";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useDispatch } from "react-redux";
import { logout } from "../Redux/Slices/userSlice";
import { openAlert } from "../Redux/Slices/alertSlice";
import axios from "axios";
import Loader from "./Loader";


const Container = styled.div`
  outline: none;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 8px;
  width: 40rem;
  min-height: 45vh;
  height: fit-content;
  margin: 3rem auto;
  padding: 3rem 2rem 3rem 2rem;
  position: relative;
  overflow-x: auto;  /* Added horizontal scroll */
  overflow-y: auto;
  max-height: 80vh;
  ${sm({
    width: "90%",
  })}
  ${xs({
    width: "98%",
  })}
`;

const MainContainer = styled.div`
  flex: 3;
  min-height: 50vh;
  padding-right: 0.5rem;
  width: 100%;
  gap: 1.5rem;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
`;

const AddToCardContainer = styled.div`
  flex: 1;
  max-height: 50vh;  /* Added max height for scrolling */
  overflow-y: auto;  /* Added vertical scroll */
  ${xs({
    marginTop: "1rem",
  })}
`;

const MembersHeader = styled.h5`
  font-size: 1.3rem; /* Increased font size for emphasis */
  margin-bottom: 1rem; /* Added margin for separation */
`;

const LoadingScreen = styled.div`
  background-image: url(${(props) => props.image});
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
`;

const MemberName = styled.div`
  margin-left: 1rem; /* Added margin for separation */
`;
const Role = styled.span`
  font-size: 0.75rem;
  color: orange;
  marginleft: 1rem;
`;

const MemberContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem; /* Added margin for separation */
  // border: 1px solid #ccc; /* Add a border for separation */
  padding: 0.5rem; /* Add some padding for spacing */
  border-radius: 8px; /* Add rounded corners for a softer look */
  background-color: #f9f9f9; /* Add a background color */
`;
const CloseIconWrapper = styled.div`
  position: absolute;
  top: 0.8rem; /* Adjusted top position */
  right: 0.8rem; /* Adjusted right position */
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.1); /* Added a subtle background */
  &:hover {
    background-color: rgba(0, 0, 0, 0.2); /* Darker hover effect */
  }
`;
 const InviteButton = styled.button`
 marginTop: 5%;
 marginLeft: 25%;
  position: absolute;
	display: flex;
	border: none;
	height: 2rem;
	color: white;
	padding: 0rem 1rem;
	align-items: center;
	gap: 0.5rem;
	border-radius: 3px;
	background: linear-gradient(to  bottom, rgb(109,110,178), rgb(91,144,204));
	cursor: pointer;
	transition: 250ms ease;
	&:hover {
		background-color: #00599f;
	}
`;

 const TextSpan = styled.span`
	font-size: 0.85rem;
	font-weight: 600;
	${xs({
		display: 'none',
	})}
`;

const MemberModal = () =>{
  const dispatch = useDispatch();

  const [loader, setLoader] = useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [usersData, setUsersData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [workspacesData, setWorkspacesData] = useState([]);
  const [boardsData, setBoardsData] = useState({});
  const [allLists, setAllLists] = useState({});
  const [selectedWorkspaces, setSelectedWorkspaces] = useState([]);
  const [selectedBoards, setSelectedBoards] = useState({});
  const [selectedLists, setSelectedLists] = useState([]);
  const [allCards, setAllCards] = useState({});
  const [selectedCards, setSelectedCards] = useState([]);
  const handleOpen = () => {

    setSelectedUser(null);
    setSelectedWorkspaces([]);
    setSelectedBoards({});
    setSelectedLists([]);
    setSelectedCards([]);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };
  // <LoadingScreen image={CardLoadingSvg} />

  const boardIdsArray = Object.values(selectedBoards).flatMap(boardArray => boardArray.map(board => board.value));
  // const payload = {
  //   workspaceId: selectedWorkspaces.map(workspace => workspace.value),
  //   memberId: selectedUser?.value,
  //   boardIds: boardIdsArray,
  //   listIds: Object.values(selectedLists).flat(),
  //   cardIds: selectedCards,
  // };
  const payload = {
    workspaceId: selectedWorkspaces.map(workspace => String(workspace.value)),
    memberId: selectedUser ? String(selectedUser.value) : null,
    boardIds: boardIdsArray.map(id => String(id)),
    listIds: Object.values(selectedLists).flat().map(id => String(id)),
    cardIds: selectedCards.map(id => String(id)),
  };
  
  console.log(payload);
  
  const handleSubmit = async () => {
    console.log(payload, 'payload');
    try {
      setLoader(true); // Set loader to true before making the API call
  
      const response = await axios.post('https://taskmanagement.ranaafaqali.com/api/workspace/new-addmember', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
  
      if (response.status === 200) {
        setOpenModal(false);
       
        dispatch(
          openAlert({
            message: 'Member added successfully',
            severity: 'success',
          })
        );
        window.location.reload();
      } else {
        dispatch(
          openAlert({
            message: 'Member added failed',
            severity: 'error',
          })
        );
      }
    } catch (error) {
      console.error('Error adding member:', error);
      dispatch(
        openAlert({
          message: 'Member added failed',
          severity: 'error',
        })
      );
      if (error.response && error.response.data.errMessage === 'Authorization token invalid') {
        dispatch(logout());
        dispatch(openAlert({
          message: 'Authorization token expired. Please log in again.',
          severity: 'error',
        }));
        // Perform additional actions as needed for token expiration
        // ...
      }
    } finally {
      setLoader(false); // Set loader back to false after the API call is complete
    }
  };
  
  

  useEffect(() => {
    fetchWorkspaces();
  }, []);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://taskmanagement.ranaafaqali.com/api/user/get-all-users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      setUsersData(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  const handleUserSelect = (selectedOption) => {
    setSelectedUser(selectedOption);
  };
  const fetchWorkspaces = async () => {
    try {
      const response = await axios.get('https://taskmanagement.ranaafaqali.com/api/workspace/get-workspaces', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
  
      const data = response.data;
      setWorkspacesData(data);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
  
      if (error.response && error.response.data.errMessage === 'Authorization token invalid') {
        dispatch(logout());
        // Show an alert for token expiration
        dispatch(openAlert({
          message: 'Authorization token expired. Please log in again.',
          severity: 'error',
        }));
        // Perform additional actions as needed for token expiration
        // ...
      }
    }
  };
  
  

  const fetchBoardsForWorkspace = async (workspaceId) => {
    try {
      const response = await axios.get(`https://taskmanagement.ranaafaqali.com/api/board/${workspaceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
  
      const data = response.data;
      setBoardsData((prevData) => ({ ...prevData, [workspaceId]: data }));
    } catch (error) {
      console.error('Error fetching boards:', error);
  
      if (error.response && error.response.data.errMessage === 'Authorization token invalid') {
        dispatch(logout());
        // Show an alert for token expiration
        dispatch(openAlert({
          message: 'Authorization token expired. Please log in again.',
          severity: 'error',
        }));
        // Perform additional actions as needed for token expiration
        // ...
      }
    }
  };
  


  useEffect(() => {
    selectedWorkspaces.forEach(workspaceId => {
      fetchBoardsForWorkspace(workspaceId);
    });
  }, [selectedWorkspaces]);

  const handleWorkspaceSelect = (selectedOption) => {
 
    setSelectedWorkspaces(selectedOption);
    // Fetch boards for the selected workspace(s)
    selectedOption.forEach((workspace) => {
      fetchBoardsForWorkspace(workspace.value);
    });
  };

  const handleBoardSelect = async (selectedOption, workspaceId) => {

    setSelectedBoards((prevSelectedBoards) => ({
      ...prevSelectedBoards,
      [`${workspaceId}`]: selectedOption
    }));

    try {
      await Promise.all(
        selectedOption.map(async (board) => {
          await fetchLists(board.value, workspaceId);
        })
      );
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const fetchLists = async (boardId, workspaceId) => {
    try {
      const response = await axios.get(`https://taskmanagement.ranaafaqali.com/api/list/${workspaceId}/${boardId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
  
      const data = response.data;
      setAllLists((prevLists) => ({
        ...prevLists,
        [`${workspaceId}_${boardId}`]: data
      }));
    } catch (error) {
      console.error('Error fetching lists:', error);
  
      if (error.response && error.response.data.errMessage === 'Authorization token invalid') {
        dispatch(logout());
        // Show an alert for token expiration
        dispatch(openAlert({
          message: 'Authorization token expired. Please log in again.',
          severity: 'error',
        }));
        // Perform additional actions as needed for token expiration
        // ...
      }
    }
  };
  
  
  const handleListCheckboxChange = async (listId, boardId, workspaceId) => {
    setSelectedLists(prevSelectedLists => {
      const key = `${workspaceId}_${boardId}`;
      const selectedLists = prevSelectedLists[key] || [];
  
      if (selectedLists.includes(listId)) {
        return {
          ...prevSelectedLists,
          [key]: selectedLists.filter(id => id !== listId)
        };
      } else {
        fetchCards(boardId, listId, workspaceId);
        return {
          ...prevSelectedLists,
          [key]: [...selectedLists, listId]
        };
      }
    });
  };
  

  const fetchCards = async (boardId, listId, workspaceId) => {
    try {
      const response = await axios.get(`https://taskmanagement.ranaafaqali.com/api/card/${workspaceId}/${boardId}/${listId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
  
      const data = response.data;
      setAllCards(prevAllCards => ({
        ...prevAllCards,
        [`${workspaceId}_${boardId}_${listId}`]: data
      }));
    } catch (error) {
      console.error('Error fetching cards:', error);
  
      if (error.response && error.response.data.errMessage === 'Authorization token invalid') {
        // Show an alert
        dispatch(logout());
      
      // Show alert message
      dispatch(
        openAlert({
          message: 'Authorization token expired. Please log in again.',
          severity: 'error',
        })
      );
      }
    }
  };
  
  
  
  
  


  const handleCardCheckboxChange = (cardId) => {
    console.log('Card Checkbox Changed:', cardId);

    setSelectedCards(prevSelectedCards => {
      if (prevSelectedCards.includes(cardId)) {
        return prevSelectedCards.filter(id => id !== cardId);
      } else {
        return [...prevSelectedCards, cardId];
      }
    });
  };
 



  return (
    <div style={{ position: "relative" }}>
      {/* <Button style={{marginTop: '5.2%',textTransform: 'none',	background: 'linear-gradient(rgb(109, 110, 178), rgb(91, 144, 204), rgb(197 177 255))',
marginLeft: '24.5%', position: 'absolute'}} variant="contained"  onClick={handleOpen}>
        <GroupAddTwoTone style={{ background: 'linear-gradient(rgb(109, 110, 178), rgb(91, 144, 204), rgb(197 177 255))', marginBottom: 2,fontSize: 15, marginRight: "3px" }} /> 
      </Button>
      */}
						{/* <Avatar onClick={handleOpen} sx={{ position: 'absolute', cursor: 'pointer', marginTop: '5.2%', marginLeft: '24.5%' ,width: 40, height: 40,  backgroundImage:'linear-gradient(to  bottom, rgb(61 63 164), rgb(91,144,204))', fontSize: '0.875rem', fontWeight: '800' }}> */}
            <Avatar onClick={handleOpen} sx={{ position: 'absolute',  cursor: 'pointer', marginTop:{xs:8.5, sm: 9, md:9} , marginLeft:{xs:5, md: 50} ,width: 40, height: 40,  backgroundImage:'linear-gradient(to  bottom, rgb(61 63 164), rgb(91,144,204))', fontSize: '0.875rem', fontWeight: '800' }}>

            <GroupAddTwoTone style={{ fontSize: 20 }} /> 
						</Avatar>
				
     
      <Modal
        open={openModal}
        onClose={handleClose}
        style={{ overflow: "auto" }}
      >
        <Container>
          <CloseIconWrapper onClick={handleClose}>
            <CloseIcon fontSize="small" color="black" />
          </CloseIconWrapper>
            <MainContainer>
            <div >
            <Typography style={{fontSize: '12px', color: '#7c97c5', paddingBottom: '5px'}}>Select user*</Typography>
            <Select
            //  styles={{
            //   control: (baseStyles, state) => ({
            //     ...baseStyles,
                
                
            //   }),
            // }}
  isMulti={false}
  value={selectedUser} // Create state for selectedUser
  onChange={handleUserSelect} // Create a function to handle user selection
  options={usersData.map((user) => ({
    value: user._id,
    label: `${user.name}`,
  }))}
/>
{selectedUser && (
  <>
<Typography style={{fontSize: '12px', color: '#7c97c5', paddingBottom: '5px', paddingTop: '15px'}}>Select workspaces*</Typography>
      <Select
      //  styles={{
      //   control: (baseStyles, state) => ({
      //     ...baseStyles,
      //     borderColor: state.isFocused ? 'grey' : 'red',
          
      //   }),
      // }}
        isMulti
        value={selectedWorkspaces}
        onChange={handleWorkspaceSelect}
          // styles={colourStyles} // Apply colourStyles here
          // options={colourOptions}
        options={workspacesData.map((workspace) => ({
          value: workspace._id,
          label: workspace.name
        }))}
      />
      </>
    )}
      {selectedWorkspaces.map(workspace => (
        <div key={workspace.value} >
          <Typography style={{fontSize: '12px', color: '#7c97c5', paddingBottom: '5px', paddingTop: '15px'}}>Select boards for {workspace.label}</Typography>

          {/* <h7>Boards for Workspace {workspace.label}</h7> */}
          <Select
            isMulti
            value={selectedBoards[workspace.value] || []}
            onChange={(selectedOptions) => handleBoardSelect(selectedOptions, workspace.value)}
            options={(boardsData[workspace.value] || []).map((board) => ({
              value: board._id,
              label: board.title
            }))}
          />
        <div style={{paddingTop: '15px'  }}>
        {selectedBoards[workspace.value]?.length > 0 && <Typography style={{fontWeight: 600, fontStyle: 'italic', textDecoration: 'underline'}}>Lists</Typography> }
   {selectedBoards[workspace.value]?.length > 0 && (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column',  }}>
      
      {selectedBoards[workspace.value].map(board => (
        <div key={board.value} style={{ margin: '2px' }}>
          {/* <h7>List for selected {board.label}</h7> */}
          <Typography style={{fontSize: '12px', fontWeight: 600, color: '#7c97c5', paddingBottom: '5px', paddingTop: '15px'}}>List for selected {board.label}</Typography>

          {allLists[`${workspace.value}_${board.value}`] && allLists[`${workspace.value}_${board.value}`].length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {allLists[`${workspace.value}_${board.value}`].map(list => (
                <label key={list._id} style={{ margin: '5px' }}>
                  <input
                    type="checkbox"
                    checked={selectedLists[`${workspace.value}_${board.value}`]?.includes(list._id)}
                    onChange={() => handleListCheckboxChange(list._id, board.value, workspace.value)} 
                  />
                  {list.title}
                </label>
              ))}
            </div>
          ) : (
            <p>No lists found for this board</p>
          )}
        </div>
      ))}
    </div>
  )}
</div>

        </div>
      ))}




{Object.keys(selectedLists).map(listKey => {
  const [workspaceId, boardId] = listKey.split('_');
  const listIds = selectedLists[listKey];

  // Check if the board is selected
  if (selectedBoards[workspaceId]?.find(board => board.value == boardId)) {
    return (
      <div key={listKey}>
 {/* {Object.keys(selectedLists)?.length !== 0 && 
  <h7>Cards</h7>  } */}
        {listIds.map(listId => (
          <div key={listId}>
          <Typography style={{fontSize: '12px', fontWeight: 600, color: 'rgb(255 94 62)', paddingBottom: '5px', paddingTop: '15px'}}>  Cards for selected{allLists[`${workspaceId}_${boardId}`].find(list => list._id === listId)?.title}
</Typography>

            {allCards[`${workspaceId}_${boardId}_${listId}`] && allCards[`${workspaceId}_${boardId}_${listId}`].length > 0 ? (
              allCards[`${workspaceId}_${boardId}_${listId}`].map(card => (
                <label key={card._id}>
                  <input
                  
                    type="checkbox"
                    checked={selectedCards[card._id]}
                    onChange={() => handleCardCheckboxChange(card._id)}
                  />
                  {card.title}
                </label>
              ))
            ) : (
              <p>No cards found for this list</p>
            )}
          </div>
        ))}
        
      </div>
    );
  }
  // If the board is not selected, return null or an empty component
  return null;
})}



  
    </div>


    <div style={{ display: 'flex', justifyContent: 'flex-end' ,  marginTop: 'auto',}}>
  <button style={{
   
    background: 'linear-gradient(rgb(109, 110, 178), rgb(91, 144, 204))',
    // min-width: 20px;
    // height: 31px;
    color: 'white',
    // margin-bottom: 0px;
    // padding: 0px 8px;
    borderRadius: '5px',
    border : 'none',

    width: '100px', // Adjust the width as neededx
    padding: '8px', // Adjust the padding as needed
  }} onClick={handleSubmit}>Submit</button>
  {loader && <Loader />} 
</div>

    
            </MainContainer>

            <AddToCardContainer>
             
            </AddToCardContainer>
        </Container>
      </Modal>
    </div>
  );
}
export default MemberModal;
