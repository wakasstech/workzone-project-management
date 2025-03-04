import React from 'react';
import { Container, Title } from './styled';
import Button from '../ReUsableComponents/IconButton';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { cardDelete } from '../../../../Services/listService';
import { openAlert } from '../../../../Redux/Slices/alertSlice';
import { getLists } from '../../../../Services/boardService';
import Swal from 'sweetalert2';
const Actions = ({ callback,boardId }) => {
	const card = useSelector((state) => state.card);
	const dispatch = useDispatch();
	const workspaceId = localStorage.getItem('workspaceId');
 
	return (
		<Container>
			<Title>Actions</Title>
			{/* 	<Button title='Move' icon={<ArrowForwardIcon fontSize='1rem' />}></Button>
			<Button title='Copy' icon={<CopyIcon fontSize='small' />}></Button>
			<Button title='Watch' icon={<WatchIcon fontSize='small' />}></Button> */}
			<Button 
				clickCallback={
					
					
					async () => {
						if (typeof callback === "function") {
							callback(); // ✅ Safe to call
						  } else {
							console.error("callback is not a function");
						  }
						
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
							  
									
									await cardDelete(workspaceId,card.listId, card.boardId, card.cardId, dispatch);
									await getLists(boardId, dispatch, workspaceId);
									
							  dispatch(
								openAlert({
								  message: 'Card deleted successfully',
								  severity: 'success',
								})
							  );
							 
								} catch (error) {
								  dispatch(
									openAlert({
									  message: 'Card not deleted, something went wrong',
									  severity: "error",
									})
								  );
								}
							  } 
							});
					
					//   dispatch(
					// 			openAlert({
					// 			  message: "🚧 This feature is currently under maintenance. It will be available soon!",
					// 			  severity: "error",
					// 			}) 
					// 		  );
				}}
				title='Delete'
				icon={<DeleteIcon fontSize='small' />}
			></Button>
		</Container>
	);
};

export default Actions;
