import React from 'react';
import styled from 'styled-components';
import DoneIcon from '@mui/icons-material/Done';
import { useDispatch, useSelector } from 'react-redux';
import { memberAdd, memberDelete } from '../../../../../Services/cardService';
import { Avatar } from '@mui/material';
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
const Role = styled.span`
  font-size: 0.75rem;
  color: orange;
`;

export const IconWrapper = styled.div`
	width: fit-content;
	height: fit-content;
	position: absolute;
	right: 0.5rem;
	top: 0.5rem;
`;

const MemberName = styled.div``;

const MemberComponent = (props) => {
	const dispatch = useDispatch();
	const workspaceId = localStorage.getItem('workspaceId');
	const card = useSelector((state) => state.card);
	const isMember = card.members.filter((a) => a.user === props.user).length ? true : false;
	const handleClick = async () => {
		if (isMember) {
			await memberDelete(workspaceId, card.cardId, card.listId, card.boardId, props.user, props.name, dispatch, props?._id);
		} else {
			await memberAdd(workspaceId, card.cardId, card.listId, card.boardId, props.user, props.name, props.color, dispatch, props?._id);
		}
	};
	return (
		<MemberWrapper onClick={props.role === 'owner' ? null : handleClick}>
			<Avatar sx={{ width: 28, height: 28, bgcolor: props.color, fontSize: '0.875rem', fontWeight: '800' }}>
				{props.name[0].toUpperCase()} 
			</Avatar>
			<MemberName>{props.name}</MemberName>
			<Role>({props.role})</Role>
			{props.role !== 'owner' && isMember && (
				<IconWrapper>
					<DoneIcon fontSize='1rem' />
				</IconWrapper>
			)}
		</MemberWrapper>
	);
};

const MembersPopover = (props) => {
	const members = useSelector((state) => state.board.members);
	const listmembers = props?.listDetail?.members;
	console.log('doneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', listmembers)
	return (
		<Container>
			{/* <SearchArea placeholder='Search member...' /> */}
			<Title>List members</Title>
			{listmembers?.map((member) => {
  console.log(member?._id, 'track user ids'); // Log member.user here
  return <MemberComponent key={member.user} {...member} />;
})}
		</Container>
	);
};

export default MembersPopover;
