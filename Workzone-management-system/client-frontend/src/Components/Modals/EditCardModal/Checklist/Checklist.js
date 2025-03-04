import React, { useEffect, useState } from 'react';
import {
	Container,
	Row,
	LeftColumn,
	RightColumn,
	Title,
	Percentage,
	CheckText,
	RowRightButtonsWrapper,
	IconWrapper,
	TextAreaContainer,
	TextArea,
	MemberItem,
	MemberDropDown
} from './styled';
import CheckIcon from '@mui/icons-material/LibraryAddCheckOutlined';
import BottomButtonGroup from '../../../Pages/BoardPage/BoardComponents/BottomButtonGroup/BottomButtonGroup.js';
import Checkbox from '../ReUsableComponents/Checkbox';
import Button from '../ReUsableComponents/Button';
import Progressbar from '../ReUsableComponents/Progressbar';
import { useDispatch, useSelector } from 'react-redux';
import {
	checklistDelete,
	checklistItemAdd,
	checklistItemCompletedSet,
	checklistItemDelete,
	checklistItemTextSet,
} from '../../../../Services/cardService';
import DeleteIcon from '@mui/icons-material/DeleteForeverOutlined';
import { Typography } from '@mui/material';

const Checklist = (props) => {

	
	const dispatch = useDispatch();
	const workspaceId = localStorage.getItem('workspaceId');
	const card = useSelector((state) => state.card);
	console.log(card?.members, 'propsssss')
	const [showAddItem, setShowAddItem] = useState(false);
	const [newItem, setNewItem] = useState('');
	const [selectedMember, setSelectedMember] = useState('');
		
		const members = card?.members || [];

	const { userInfo } = useSelector((state) => state.user);
	const userRole = userInfo?.userType;
	const userName = userInfo?.name;

	const [hideItems, setHideItems] = useState(false);
	const percentage = () => {
		if (props.items.length === 0) return 0;
		const completed = props.items.filter((item) => item.completed);
		return Math.round(100 - ((props.items.length - completed.length) / props.items.length) * 100);
	};

	const handleChecklistDelete = async (checklistId) => {
		await checklistDelete(workspaceId, card.cardId, card.listId, card.boardId, checklistId, dispatch);
	};

	const handleAddChecklistItem = async (checklistId) => {
		console.log({ item: newItem, assignedTo: selectedMember }, 'here is am ');
		setShowAddItem(false);
		await checklistItemAdd(workspaceId, card.cardId, card.listId, card.boardId, checklistId, newItem,selectedMember,  dispatch);
		// checklistItemAdd(workspaceId, card.cardId, card.listId, card.boardId, checklistId, { item: newItem, assignedTo: selectedMember }, dispatch);
		
		setNewItem('');
		setSelectedMember('');
	};

	

	const ChecklistItemInitially = (props) => {
		

		const assignedTask = props?.assignedTo;
		const userNamee = userName;
		console.log(assignedTask, 'assignTo')
		console.log(userNamee, 'user name coming');
		const [checked] = useState(props.completed);
		const [showEdit, setShowEdit] = useState(false);
		const [editedText, setEditedText] = useState(props.text);
		const [selectedMember, setSelectedMember] = useState('');
        const members = props?.members;
		const handleChecklistItemDeleteClick = async () => {
			await checklistItemDelete(workspaceId, card.cardId, card.listId, card.boardId, props.checklistId, props._id, dispatch);
		};
      
		const handleCompletedChange = async () => {
            //  if(assignedTask == userNamee)
			//  {alert("success")} else {alert("fail")}
			
			await checklistItemCompletedSet(
				workspaceId,
				card.cardId,
				card.listId,
				card.boardId,
				props.checklistId,
				props._id,
				!checked,
				dispatch
			);
		};
	
	
		const handleTextChangeSubmit = async () => {
			console.log({ item: editedText, assignedTo: selectedMember }, 'here is am ');
			await checklistItemTextSet(
				workspaceId,
				card.cardId,
				card.listId,
				card.boardId,
				props.checklistId,
				props._id,
				editedText,
				selectedMember,
				dispatch
			);
		};

   useEffect ( () => {
	setSelectedMember(props?.assignedTo);
   }, [props])

		return (
			<Row showHover={true}>
				<LeftColumn>
				{(assignedTask == userNamee || userRole === 'admin') &&  (
					<Checkbox checked={checked} clickCallback={handleCompletedChange} />
				 )}
				</LeftColumn>
				<RightColumn>
					{showEdit && userRole === 'admin' ? (
						<TextAreaContainer>
							{/* <TextArea value={editedText} onChange={(e) => setEditedText(e.target.value)} /> */}
							<TextArea
								value={editedText}
								onChange={(e) => setEditedText(e.target.value)}
								placeholder='Add an item'
							/> 
							
							<select
							style={{    border: '1px solid #c8c8c8',
								padding: 4,
								fontSize: 15,
								borderRadius: 4,
								color: '#007bff',
								fontWeight: 'bold'}}
                                value={selectedMember}
                                onChange={(e) => setSelectedMember(e.target.value)}
                            >
                                <option value='' disabled>Select a member</option>
                                {members.map((member) => (
                                    <option key={member.id} value={member.id}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>
							<BottomButtonGroup
								title='Save'
								clickCallback={handleTextChangeSubmit}
								closeCallback={() => {
									setShowEdit(false);
								}}
							/>
						</TextAreaContainer>
					) : (
						<>
							<CheckText
								onClick={() => {
									setShowEdit(true);
								}}
								isChecked={checked}
							>
								{props.text}
							</CheckText>
							{selectedMember && (
								<Typography sx={{fontSize: 10,fontWeight:'bold', color:'#4B94BF'}}>@{selectedMember} </Typography>
							)}
							{userRole === 'admin' &&
							<IconWrapper onClick={handleChecklistItemDeleteClick}>
								<DeleteIcon style={{color: "orangered"}} fontSize='1rem' />
							</IconWrapper>
							}
						</>
					)}
				</RightColumn>
			</Row>
		);
	};



	return (
		<Container>
			<Row >
				<LeftColumn>
					<CheckIcon fontSize='small' />
				</LeftColumn>
				<RightColumn makeColumn={true}>
					<Title>{props.title}</Title>
                {userRole === 'admin' && 
					<RowRightButtonsWrapper>
						<Button
							clickCallback={() => setHideItems((prev) => !prev)}
							title={hideItems ? 'Show checkeds' : 'Hide checkeds'}
						/>
						<Button clickCallback={() => handleChecklistDelete(props._id)} title='Delete' />
					</RowRightButtonsWrapper>
                    }
				</RightColumn>
			</Row>
			<Row>
				<LeftColumn>
					<Percentage>{percentage()}%</Percentage>
				</LeftColumn>
				<RightColumn>
					<Progressbar value={percentage()} />
				</RightColumn>
			</Row>

			{props.items.map((item) => {
				if (hideItems && item.completed) return undefined;
				return <ChecklistItemInitially key={item._id} checklistId={props._id} {...item} members={members}/>;
			})}

			<Row>
				<LeftColumn></LeftColumn>
				{userRole === 'admin' && 
				<RightColumn>
					{showAddItem ? (
						<TextAreaContainer>
							<TextArea
								value={newItem}
								onChange={(e) => setNewItem(e.target.value)}
								placeholder='Add an item'
							/>
							
							<select
							style={{    border: '1px solid #c8c8c8',
								padding: 4,
								fontSize: 15,
								borderRadius: 4,
								color: '#007bff',
								fontWeight: 'bold'}}
                                value={selectedMember}
                                onChange={(e) => setSelectedMember(e.target.value)}
                            >
                                <option value='' disabled>Select a member</option>
                                {members.map((member) => (
                                    <option key={member.id} value={member.id}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>
							<BottomButtonGroup
								title='Add'
								clickCallback={() => handleAddChecklistItem(props._id)}
								closeCallback={() => setShowAddItem(false)}
							/>
							
						</TextAreaContainer>
					) : (
						<Button clickCallback={() => setShowAddItem(true)} title='Add an item' />
					)}
				</RightColumn>
}
			</Row>
		</Container>
	);
};

export default Checklist;
