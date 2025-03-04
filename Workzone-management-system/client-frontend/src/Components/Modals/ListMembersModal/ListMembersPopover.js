import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DoneIcon from '@mui/icons-material/Done';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '@mui/material';
import { listMemberAdd, listMemberDelete } from '../../../Services/listService';
import { openAlert } from '../../../Redux/Slices/alertSlice';
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

export const IconWrapper = styled.div`
`;

const MemberName = styled.div``;
const Role = styled.span`
  font-size: 0.75rem;
  color: orange;
`;


const ListMembersComponent = (props) => {
	// alert(props.user)
	const dispatch = useDispatch();
	
	console.log('listMembers', props.listMembers);
	const listMembers = props.listMembers || []; // Ensure listMembers is an array
	const isMemberAdded = listMembers.some(member => member.email === props.email);
	

	const workspaceId = localStorage.getItem('workspaceId');
	const board = useSelector((state) => state.board);
	const members = [{ email: props.email }];
	const userId = props.user;
	const [isAdding, setIsAdding] = useState(false);
	const [isAdded, setIsAdded] = useState(false); // Added state to track if member is added
    const [isDeleting, setIsDeleting] = useState(false); // Added state to track if member is being deleted
	const [isDeleted, setIsDeleted] = useState(false); // Added state to track if member is added


	// useEffect(() => {
	// 	setIsAdded(isMemberAdded);
	//   }, [isMemberAdded]);

     React.useEffect(() => {
		setIsAdded(isMemberAdded);
	 }, [isMemberAdded])


	 const isOwner = props.role === 'owner';


   
	 const handleClick = async () => {
		if (isMemberAdded) {
			return; // Do nothing if member is already added
		}
	
		setIsAdding(true);
	
		try {
			console.log('Adding member to list...');  // Log that we're adding a member
	
			await listMemberAdd(workspaceId, props.board, props.list, members, dispatch);
	
			setIsAdded(true);
	
			console.log('Member added to the list successfully');  // Log success message
	
			setIsAdding(false);
		} catch (error) {
			console.error('Error adding member:', error);  // Log the error
	
			setIsAdding(false);
	
			dispatch(
				openAlert({
					message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
					severity: 'error',
				})
			);
		}
	};
	
	const handleDelete = async () => {
		setIsDeleting(true);
	  
		try {
		  console.log('Deleting member from list...');
	  
		  await listMemberDelete(workspaceId, props.board, props.list, userId, dispatch);
	      
		  setIsDeleted(true); // Set isDeleted to true after successful deletion
	  
		  console.log('Member deleted from the list successfully');
	  
		  setIsDeleting(false);
		} catch (error) {
		  console.error('Error deleting member:', error);
		  setIsDeleting(false);
	  
		  dispatch(
			openAlert({
			  message: error?.response?.data?.errMessage
				? error.response.data.errMessage
				: error.message,
			  severity: 'error',
			})
		  );
		}
	  };
	  
	
	
	return (
		<MemberWrapper>
			<Avatar sx={{ width: 28, height: 28, bgcolor: props.color, fontSize: '0.875rem', fontWeight: '800' }}>
		  {props.name[0].toUpperCase()}
		</Avatar>
		<MemberName>
          {props.name} 
        </MemberName>
		<Role>({props.role})</Role>			
				 
		{!isOwner && (
  <IconWrapper>
    <button
        onClick={handleClick} 
		style={{
        backgroundColor: isAdded ? 'rgb(34 48 78)' : '',
        color: isAdded ? 'white' : '',
        cursor: 'pointer',
        borderRadius: '3px',
        border: '1px solid rgba(0, 0, 0, 0.1)'
      }}
      disabled={isAdding || isAdded}
    >
      {isAdding ? 'Adding...' : (isAdded ? 'Added' : 'Add')}
    </button>
  </IconWrapper>
)}
		{!isOwner && (
  <IconWrapper>
    <button
            onClick={handleDelete} 
			style={{
        backgroundColor: isDeleted ? 'rgb(34 48 78)' : '',
        color: isDeleted ? 'white' : '',
        cursor: 'pointer',
        borderRadius: '3px',
        border: '1px solid rgba(0, 0, 0, 0.1)'
      }}
      disabled={isDeleting || isDeleted}
    >
      {isDeleting ? 'Deleting...' : (isDeleted ? 'Deleted' : 'Delete')}
    </button>
  </IconWrapper>
)}

	  </MemberWrapper>
	);
  };

const ListMembersPopover = (props) => {
	const members = useSelector((state) => state.board.members);
	return (
		<Container>
			<Title>Board members</Title>
			{members.map((member) => {
				return <ListMembersComponent key={member.user} {...member} list={props.list} board={props.board} listMembers={props.listMembers}/>;
			})}
		</Container>
	);
};

export default ListMembersPopover;
