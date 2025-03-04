import React, { useEffect, useState } from "react";
// import { Container, SearchContainer, SearchBar, ChipContainer } from './styled';
import Button from "../../ReUsableComponents/Button";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { makeStyles } from "@mui/styles";
import styled from "styled-components";

import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { useDispatch, useSelector } from "react-redux";
import { getUserFromEmail } from "../../../../../Services/userService";
import { openAlert } from "../../../../../Redux/Slices/alertSlice";
import {
  boardMemberAdd,
  boardMemberDelete,
} from "../../../../../Services/boardService";
import { getWorkspaces } from "../../../../../Services/boardsService";

const Container = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
  padding-bottom: 1rem;
`;

const SearchArea = styled.input`
  width: 100%;
  height: 2rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding-left: 0.5rem;
  outline: none;
  background-color: rgba(0, 0, 0, 0.02);
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  &:focus {
    border: 2px solid #0079bf;
    background-color: #fff;
  }
`;

export const Title = styled.div`
  color: #5e6c84;
  margin-top: 0.3rem;
  font-size: 0.85rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MemberWrapper = styled.div`
  width: 100%;
  background-color: transparent;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  height: 2rem;
  align-items: center;
  padding: 0.5rem;
  position: relative;
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

export const IconWrapper = styled.div``;

const MemberName = styled.div``;
const Role = styled.span`
  font-size: 0.75rem;
  color: orange;
`;

const useStyles = makeStyles({
  root: {
    maxWidth: "8rem",
    opacity: "70%",
  },
});

const ListMembersComponent = (props) => {
  console.log(props, 'propss')
  const dispatch = useDispatch();

  // const isMemberAdded = listMembers.some(member => member.email === props.email);
  // const workspaceId = localStorage.getItem('workspaceId');
  // const board = useSelector((state) => state.board);

  const boardMembers = useSelector((state) => state.board.members);
  const boardId = useSelector((state) => state.board.id);
  const workspaceId = localStorage.getItem("workspaceId");
  const userId = props.user;
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false); // Added state to track if member is added
  const [isDeleting, setIsDeleting] = useState(false); // Added state to track if member is being deleted
  const [isDeleted, setIsDeleted] = useState(false); // Added state to track if member is added

  const isMemberAdded = boardMembers.some(member => member.email === props.email);
  // useEffect(() => {
  // 	setIsAdded(isMemberAdded);
  //   }, [isMemberAdded]);

   React.useEffect(() => {
  	setIsAdded(isMemberAdded);
    // setIsDeleted(!isMemberAdded);

   }, [isMemberAdded])

  const isOwner = props.role === "owner";

  const handleClick = async () => {
    const members = [{ email: props.email }];
    setIsAdding(true)
    await boardMemberAdd(workspaceId, boardId, members, dispatch);
    setIsAdding(false)
    setIsAdded(true);
    setIsDeleted(false);
  };

  const handleDelete = async () => {
	  const userId = props.user;
    setIsDeleting(true)
    await boardMemberDelete(workspaceId, boardId, String(userId), dispatch);
    setIsDeleting(false)
    setIsAdded(false);
    setIsDeleted(true);
   
//  dispatch(
//                 openAlert({
//                   message: "🚧 This feature is currently under maintenance. It will be available soon!",
//                   severity: "error",
//                 }) 
//                 );
  };

  return (
    <MemberWrapper>
      <Avatar
        sx={{
          width: 28,
          height: 28,
          bgcolor: props.color,
          fontSize: "0.875rem",
          fontWeight: "800",
        }}
      >
        {props.name[0].toUpperCase()}
      </Avatar>
      <MemberName>{props.name}</MemberName>
      <Role>({props.role})</Role>

      {!isOwner && (
        <IconWrapper>
          <button
            onClick={handleClick}
            style={{
              backgroundColor: isAdded ? "rgb(34 48 78)" : "",
              color: isAdded ? "white" : "",
              cursor: "pointer",
              borderRadius: "3px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
            disabled={isAdding || isAdded}
          >
            {isAdding ? "Adding..." : isAdded ? "Added" : "Add"}
          </button>
        </IconWrapper>
      )}
      {!isOwner && (
        <IconWrapper>
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: isDeleted ? "rgb(34 48 78)" : "",
              color: isDeleted ? "white" : "",
              cursor: "pointer",
              borderRadius: "3px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
            disabled={isDeleting || isDeleted}
          >
            {isDeleting ? "Deleting..." : isDeleted ? "Deleted" : "Delete"}
          </button>
        </IconWrapper>
      )}
    </MemberWrapper>
  );
};

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

// const InviteMembers = (props) => {
//   // const [memberMail, setMemberMail] = useState('');
//   // const [members, setMembers] = useState([]);
//   // const dispatch = useDispatch();
//   // const boardMembers = useSelector((state) => state.board.members);
//   // const boardId = useSelector(state=>state.board.id);
//   // const workspaceId = localStorage.getItem('workspaceId');

//   // const workspacesData = localStorage.getItem('workspacesData');

//   // const handleAddClick = async () => {
//   // 	const checkMember = boardMembers.filter((m) => m.email === memberMail)[0];
//   // 	if (checkMember) {
//   // 		dispatch(
//   // 			openAlert({
//   // 				message: `${checkMember.name} is already member of this board!`,
//   // 				severity: 'error',
//   // 			})
//   // 		);
//   // 		setMemberMail('');
//   // 		return;
//   // 	}

//   // 	const result = await getUserFromEmail(memberMail, dispatch);
//   // 	if (!result) return;
//   // 	setMembers((prev) => [...prev, result]);
//   // 	setMemberMail('');
//   // };

//   // const handleDeleteClick = async () => {
//   // 	const membersArray = JSON.parse(props.workspace);
//   // 	const isMemberPresent = membersArray.find(member => member.email === memberMail);
//   // 	if (isMemberPresent) {
//   // 		const userId = isMemberPresent.user;
//   // 		await boardMemberDelete(workspaceId, boardId, userId, dispatch);
//   // 	}
//   // };

//   // const handleDelete = (email) => {
//   // 	const newMembers = members.filter((member) => member.email !== email);
//   // 	setMembers([...newMembers]);
//   // };

//   // const handleInviteClick= async()=>{
//   // 	await boardMemberAdd(workspaceId,boardId,members,dispatch);
//   // };
//   const membersShow = JSON.parse(props.workspace);
//   // const members = useSelector((state) => state.board.members);
//   return (
//     // <Container>
//     // 	<SearchContainer>
//     // 		<SearchBar
//     // 			type='email'
//     // 			placeholder="Member's Email"
//     // 			value={memberMail}
//     // 			onChange={(e) => {
//     // 				setMemberMail(e.target.value);
//     // 			}}
//     // 		/>
//     // 		<Button title='Add' style={{ flex: '1' }} clickCallback={handleAddClick} />
//     // 		<Button title='Delete' style={{ flex: '1' }} clickCallback={handleDeleteClick} />

//     // 	</SearchContainer>
//     // 	<ChipContainer>
//     // 		{members.map((member) => {
//     // 			return <ChipComponent key={member.email} callback={handleDelete} {...member} />;
//     // 		})}
//     // 	</ChipContainer>
//     // 	{members.length > 0 && <Button clickCallback={handleInviteClick} title='Invite' />}
//     // </Container>
//     <Container>
//       <Title>Board members</Title>
//       {membersShow.map((member) => {
//         return <ListMembersComponent key={member.user} {...member} />;
//       })}
//     </Container>
//   );
// };
const InviteMembers = (props) => {
  
  const { pending, workspacesData } = useSelector((state) => state.workspaces);
  const dispatch = useDispatch();
  const [members, setMembers] = useState([]);
   console.log(typeof props?.boardId, 'props board id')
  
  // const members = useSelector((state) => state.board.members);
  useEffect(() => {
    // Call getWorkspaces only if workspacesData is empty
    if (!workspacesData.length) {
      getWorkspaces(false, dispatch)
        .then(() => {
          const workspace = workspacesData.find(workspace =>
            workspace.boards.some(board => board._id === props?.boardId)
          );
          setMembers(workspace ? workspace.members : []);
        })
        .catch((error) => {
          console.error("Error fetching workspaces:", error);
        });
    } else {
      const workspace = workspacesData.find(workspace =>
        workspace.boards.some(board => board._id === props?.boardId)
      );
      setMembers(workspace ? workspace.members : []);
    }
  }, [dispatch, props?.boardId]);
  return (
    // <Container>
    // 	<SearchContainer>
    // 		<SearchBar
    // 			type='email'
    // 			placeholder="Member's Email"
    // 			value={memberMail}
    // 			onChange={(e) => {
    // 				setMemberMail(e.target.value);
    // 			}}
    // 		/>
    // 		<Button title='Add' style={{ flex: '1' }} clickCallback={handleAddClick} />
    // 		<Button title='Delete' style={{ flex: '1' }} clickCallback={handleDeleteClick} />

    // 	</SearchContainer>
    // 	<ChipContainer>
    // 		{members.map((member) => {
    // 			return <ChipComponent key={member.email} callback={handleDelete} {...member} />;
    // 		})}
    // 	</ChipContainer>
    // 	{members.length > 0 && <Button clickCallback={handleInviteClick} title='Invite' />}
    // </Container>
    <Container>
      <Title>Board members</Title>
      {members?.length > 0 && members.map((member) => {
        return <ListMembersComponent key={member.user} {...member} />;
      })}
    </Container>
  );
};
export default InviteMembers;
