import axios from 'axios';
import { openAlert } from '../Redux/Slices/alertSlice';
import { setLoading, successCreatingCard,deleteCard, updateListMembers } from '../Redux/Slices/listSlice';
import { getLists } from './boardService';

const baseUrl = 'https://taskmanagement.ranaafaqali.com/api/card';
const listRoute = 'https://taskmanagement.ranaafaqali.com/api/list';


export const createCard = async (title, listId, boardId, dispatch, workspaceId) => {
    console.log(title, listId, boardId, workspaceId, 'here i amm')
	dispatch(setLoading(true));
	try {
		const updatedList = await axios.post(baseUrl + '/create', { workspaceId: workspaceId, title: title, listId: listId, boardId: boardId });
		
        dispatch(successCreatingCard({ listId: listId, updatedList: updatedList.data }));
        await getLists(boardId, dispatch, workspaceId);
		dispatch(setLoading(false));
	} catch (error) {
		dispatch(setLoading(false));
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const cardDelete = async(workspaceId,listId,boardId,cardId,dispatch)=>{
	try {
		await dispatch(deleteCard({listId,cardId}));
		await axios.delete(baseUrl + "/"+workspaceId + "/"+boardId+"/"+listId + "/" + cardId+ "/delete-card");
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
}


export const listMemberAdd = async (workspaceId, boardId, listId, members, dispatch) => {
    try {
        console.log('Adding members:', members);  // Log the members being sent to the API

        const response = await axios.post(listRoute + "/" + workspaceId + "/" + boardId + "/" + listId + "/add-member", {
            members // Assuming members is an array of objects with email property
        });

        console.log('API response:', response.data);  // Log the API response

        // Assuming you have the updated members from the server response
        const updatedMembers = response.data;
        console.log('Updated Members:', updatedMembers);  // Log the updated members

        // Dispatch the action to update the members in the Redux state
        dispatch(updateListMembers({ listId, members: response.data?.allListMembers }));
        await getLists(boardId, dispatch, workspaceId);

        // ... rest of the code ...
    } 
    catch (error) {
        dispatch(
            openAlert({
                message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
                severity: 'error',
            })
        );
    }
};

export const listMemberDelete = async (workspaceId, boardId, listId, members, dispatch) => {
    console.log(workspaceId, boardId, listId, members, 'list member delete..');
    try {
        console.log('Adding members:', members);  // Log the members being sent to the API

        const response = await axios.delete(listRoute + "/" + workspaceId + "/" + boardId + "/" + listId + "/delete-member-from-list", {
            data: {
                memberId: members, // Assuming members is an array of objects with email property
            }
        });
        
        console.log('API response:', response.data);  // Log the API response

        // Assuming you have the updated members from the server response
        const updatedMembers = response.data;
        console.log('Updated Members:', updatedMembers);  // Log the updated members

        // Dispatch the action to update the members in the Redux state
        dispatch(updateListMembers({ listId, members: response.data?.remainingMembers }));
        await getLists(boardId, dispatch, workspaceId);
        // ... rest of the code ...
    } 
    catch (error) {
        dispatch(
            openAlert({
                message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
                severity: 'error',
            })
        );
    }
};