import React, { useEffect, useState } from "react";
import {
  Container,
  SearchContainer,
  SearchBar,
  ChipContainer,
} from "./styleId";
import Button from "../../ReUsableComponents/Button";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { makeStyles } from "@mui/styles";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { useDispatch, useSelector } from "react-redux";
import { getUserFromEmail } from "../../../../../Services/userService";
import { openAlert } from "../../../../../Redux/Slices/alertSlice";
import Alert from '@mui/material/Alert';
import {
  boardMemberAdd,
  workspaceMemberAdd,
} from "../../../../../Services/boardService";
import Loader from "../../../../Loader";
import axios from 'axios';

import { getWorkspaces } from "../../../../../Services/boardsService";
import { Box, Typography } from "@mui/material";
import Swal from "sweetalert2";

const useStyles = makeStyles({
  root: {
    maxWidth: "8rem",
    opacity: "70%",
  },
});

const ChipComponent = (props) => {
  const { name, surname, email, callback } = props;
  const classes = useStyles();
  return (
    <Tooltip
      TransitionComponent={Zoom}
      title={`${name} ${surname}`}
      size="small"
      placement="top"
      arrow
    >
      <Chip
        className={classes.root}
        onDelete={() => callback(email)}
        avatar={<Avatar>{name.toString()[0]}</Avatar>}
        label={name}
        size="small"
        color="secondary"
      />
    </Tooltip>
  );
};

const InviteMembersBoards = (props) => {

  const workspaceId = localStorage.getItem('workspaceId');

  const {  workspacesData } = useSelector((state) => state.workspaces);  
  const [loader, setLoader] = useState(false);
  const [counter, setCounter] = useState(false);
  const [memberMail, setMemberMail] = useState("");
  const [members, setMembers] = useState([]);
  const dispatch = useDispatch();
  const boardMembers = useSelector((state) => state.board.members);

  const boardId = useSelector((state) => state.board.id);


  const  filteredMembersWorkspace = workspacesData?.length > 0 ?  workspacesData.find(workspace => workspace._id == workspaceId) : [];
  const comingWorkspaceMembers = filteredMembersWorkspace ? filteredMembersWorkspace.members : []; 
  console.log(comingWorkspaceMembers, 'comingWorkspaceMembers')

  

  const handleAddClick = async () => {
	setLoader(true); // Set addingMember to true before API call
  
	const checkMember = boardMembers.filter((m) => m.email === memberMail)[0];
	if (checkMember) {
	  dispatch(
		openAlert({
		  message: `${checkMember.name} is already a member of this board!`,
		  severity: "error",
		})
	  );
	  setLoader(false); // Set addingMember to false after error handling
	  setMemberMail("");
	  return;
	}
  
	const result = await getUserFromEmail(memberMail, dispatch);
	if (!result) {
		setLoader(false); // Set addingMember to false after error handling
	  return;
	}
	
	setMembers((prev) => [...prev, result]);
	setMemberMail("");
	setLoader(false); // Set addingMember to false after successful member addition
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
  
  const handleDelete = (email) => {
    const newMembers = members.filter((member) => member.email !== email);
    setMembers([...newMembers]);
    console.log('delete')
  };

  const handleInviteClick = async () => {
	setLoader(true); // Set loader to true before API call
  
	try {
	  await workspaceMemberAdd(workspaceId, members, dispatch);
    await getWorkspaces(false, dispatch)
	} catch (error) {
	  console.error("Error inviting members:", error);
	  // Handle error, e.g., display an error message to the user
	}
  
	setLoader(false); // Set loader to false after API call is complete (whether it succeeded or not)
  };
  const handleDeleteClick = async () => {
  //   const user = await getUserFromEmail(memberMail, dispatch); 
	// const userId = 'target from user';
  //   if (user) {
  //     alert("User ID:", user);
	// //   await workspaceMemberDelete(workspaceId, userId, dispatch);
  //   } else {
  //     console.log("User ID not available");
  //   }
  console.log('delete')


  dispatch(
    openAlert({
      message: '🚧 This feature is currently under maintenance. It will be available soon!',
      severity: "error",
    })
  )
 
  };

  const handleDeleteMember =  async (e,userid) => {
    e.preventDefault();
    props.closeCallback();
    // try {
    //   const result = await axios.delete(`https://taskmanagement.ranaafaqali.com/api/workspace/${workspaceId}/delete-member`,{
    //     data: {
    //       memberId : userid
    //     }
    //     });
    //   // await dispatch(addWorspaceMembers(result.data));
    //   dispatch(
    //     openAlert({
    //       message: 'Members deleted to this workspace successfully',
    //       severity: 'success',
    //     })
    //   );
    //   await  getWorkspaces(false, dispatch);

    // } catch (error) {
    //   dispatch(
    //     openAlert({
    //       message: 'Members not deleted to this workspace, something went wrong',
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
      color: "#fff", // White text for better contrast
      willOpen: () => {
        document.querySelector(".swal2-icon").style.margin = "0 auto";
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        
        try {
      
          const result = await axios.delete(`https://taskmanagement.ranaafaqali.com/api/workspace/${workspaceId}/delete-member`,{
            data: {
              memberId : userid
            }
            });
              //  await dispatch(addWorspaceMembers(result.data));
      dispatch(
        openAlert({
          message: 'Member deleted to this workspace successfully',
          severity: 'success',
        })
      );
      await  getWorkspaces(false, dispatch);
        } catch (error) {
          dispatch(
            openAlert({
              message: 'Members not deleted to this workspace, something went wrong',
              severity: "error",
            })
          );
        }
      } 
    });
  };

  return (
    <Container>
      <SearchContainer>
        <SearchBar
          type="email"
          placeholder="Member's Email"
          value={memberMail}
          onChange={(e) => {
            setMemberMail(e.target.value);
          }}
        />
        <Button
          title="Add"
          style={{ flex: "1" }}
          clickCallback={handleAddClick}
        />
        {/* <Button
          title="Delete"
          style={{ flex: "1" }}
          clickCallback={handleDeleteClick}
        /> */}
      </SearchContainer>
      <ChipContainer>
        {members.map((member) => {
          return (
            <ChipComponent
              key={member.email}
              callback={handleDelete}
              {...member}
            />
          );
        })}
      </ChipContainer>
      {members.length > 0 && (
        <Button clickCallback={handleInviteClick} title="Invite" />
      )}

<span style={{textAlign:'center', fontSize:13, fontWeight:'bold'}}>Workspace Members</span>

{comingWorkspaceMembers.map((member) => {
          return (
             <SearchContainer> 
            <Typography sx={{ fontStyle: 'italic', fontSize: 14, flex: 1 }}>
  {member?.name} {(member?.role === 'owner' || member?.role === 'admin') ? `(${member?.role})` : ''}
</Typography>
                {
                  (member?.role == 'owner' || member?.role == 'admin') ? 

                  <Typography sx={{fontStyle:'italic', fontSize: 14, fontWeight:'bold', color: 'green'}}>
                  You 
                    </Typography> 
                    : 
                    <button   style={{ flex: "1", background:'orangered', color:'#fff', fontWeight: 'bold', border: '1px solid orangered', cursor: 'pointer', borderRadius: 3 }} onClick={(e)=> handleDeleteMember(e,member?.user)} >
                  Delete </button>
                }
               
            </ SearchContainer>
          );
        })}
	  {loader && <Loader/>}
    </Container>
  );
};

export default InviteMembersBoards;
