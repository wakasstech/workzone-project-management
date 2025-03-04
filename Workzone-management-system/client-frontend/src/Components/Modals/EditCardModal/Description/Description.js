import React, { useEffect, useRef, useState } from 'react';
import { Container, RightContainer, Title, DescriptionInput, DescriptionText } from './styled';
import DescriptionIcon from '@mui/icons-material/TextSnippetOutlined';
import BottomButtonGroup from '../../../Pages/BoardPage/BoardComponents/BottomButtonGroup/BottomButtonGroup.js';
import { useDispatch, useSelector } from 'react-redux';
import { descriptionUpdate } from '../../../../Services/cardService';
const Description = () => {
	const thisCard = useSelector((state) => state.card);
	const workspaceId = localStorage.getItem('workspaceId');
	const dispatch = useDispatch();
	const [inputFocus, setInputFocus] = useState(false);
	const [description, setDescription] = useState(thisCard.description);

	const { userInfo } = useSelector((state) => state.user);
	const userRole = userInfo?.userType;

	const ref = useRef();
	const ref2 = useRef();

	const handleSaveClick = async () => {
		// console.log(thisCard.cardId, 'des')
		setInputFocus(false);
		await descriptionUpdate(workspaceId, thisCard.cardId, thisCard.listId, thisCard.boardId, description, dispatch);
	};

	useEffect(() => {
		setDescription(thisCard.description);
	}, [thisCard.description]);

	useEffect(() => {
		if (inputFocus) {
			ref.current.focus();
		}
	}, [inputFocus]);

	const handleClickOutside = (event) => {
		if (ref2.current && !ref2.current.contains(event.target)) {
			setInputFocus(false);
			setDescription(thisCard.description);
		} else {
			setInputFocus(true);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	});

	return (
		<Container ref={ref2}>
			<DescriptionIcon fontSize='small' />
			<RightContainer>
				<Title>Description</Title>
				{description && !inputFocus ? (
					<DescriptionText onClick={() => setInputFocus(true)}>{description}</DescriptionText>
				) : (
					<DescriptionInput
						ref={ref}
						minHeight={inputFocus ? '5.5rem' : '2.5rem'}
						placeholder='Add a more detailed description...'
						value={description}
						// onChange={(e) => setDescription(e.target.value)}   
						onChange = {(e) => {
							if (userRole === "admin") {
								setDescription(e.target.value);
							}
						  }}


					/>
				)}
				{userRole === 'admin' && 
				<div style={{ display: inputFocus ? 'block' : 'none' }}>
					<BottomButtonGroup
						closeCallback={() => {
							setInputFocus(false);
							setDescription(thisCard.description);
						}}
						clickCallback={handleSaveClick}
						title='Save'
					/>
				</div>
               }
			</RightContainer>
		</Container>
	);
};

export default Description;
