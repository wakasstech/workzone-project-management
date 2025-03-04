import axios from 'axios';
import {
	setLoading,
	successCreatingList,
	successDeletingList,
	successFetchingLists,
	updateListTitle,
} from '../Redux/Slices/listSlice';
import { openAlert } from '../Redux/Slices/alertSlice';
import { addMembers, setActivityLoading, updateActivity, updateBackground, updateDescription } from '../Redux/Slices/boardSlice';
import { addWorspaceMembers } from '../Redux/Slices/workspacesSlice';

const listRoute = 'https://taskmanagement.ranaafaqali.com/api/list';
const boardRoute = 'https://taskmanagement.ranaafaqali.com/api/board';
const baseUrlWorkspace = "https://taskmanagement.ranaafaqali.com/api/workspace";

export const getLists = async (boardId, dispatch, workspaceId) => {
	dispatch(setLoading(true));
  	try {
		const url = `${listRoute}/${workspaceId}/${boardId}`;

		const res = await axios.get(url);
		dispatch(successFetchingLists(res.data));
		setTimeout(() => {
			dispatch(setLoading(false));
		}, 300);
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

export const activityUpdate = async (workspaceId, boardId, dispatch) => {
	console.log(workspaceId);
	dispatch(setActivityLoading(true));
	try {
		const res = await axios.get(boardRoute + '/' + workspaceId + '/' + boardId + '/activity');
		dispatch(updateActivity(res.data));
		dispatch(setActivityLoading(false));
	} catch (error) {
		dispatch(setActivityLoading(false));
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const createList = async (title, boardId, workspaceId, dispatch) => {
	dispatch(setLoading(true));
	try {
		const url = `${listRoute}/${workspaceId}/create`;

		const res = await axios.post(url, { title: title, boardId: boardId });
		dispatch(successCreatingList(res.data));
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

export const DeleteList = async (workspaceId, listId, boardId, dispatch) => {
	dispatch(setLoading(true));
	try {
		await axios.delete(listRoute + '/' + workspaceId + '/' + boardId + '/' + listId);
		await dispatch(successDeletingList(listId));
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

export const listTitleUpdate = async (workspaceId, listId, boardId, title, dispatch) => {
	try {
		await dispatch(updateListTitle({ listId: listId, title: title }));
		await axios.put(listRoute + '/' + workspaceId + '/' + boardId + '/' + listId + '/update-title', { title: title });
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const boardDescriptionUpdate = async (workspaceId, boardId, description, dispatch) => {
	try {
		await dispatch(updateDescription(description));
		await axios.put(`${boardRoute}/${workspaceId}/${boardId}/update-board-description`,{
			description
		});
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const boardBackgroundUpdate = async (workspaceId, boardId, background, isImage, dispatch) => {
	try {
		await dispatch(updateBackground({background,isImage}));
		await axios.put(`${boardRoute}/${workspaceId}/${boardId}/update-background`,{
			background,
			isImage,
		});
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const boardMemberAdd = async (workspaceId, boardId, members, dispatch) => {
	try {
		const result = await axios.post(`${boardRoute}/${workspaceId}/${boardId}/add-member`,{
			members
		});
		await dispatch(addMembers(result.data.allBoardMembers));
		dispatch(
			openAlert({
				message: 'Members are added to this board successfully',
				severity: 'success',
			})
		);
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};


export const boardMemberDelete = async (workspaceId, boardId, userId, dispatch) => {
	try {
		const result = await axios.delete(`${boardRoute}/${workspaceId}/${boardId}/delete-member-from-Board`,{
			data: {
				memberId: userId
			}
		});
		await dispatch(addMembers(result.data?.remainingMembers));
		await getLists(boardId, dispatch, workspaceId);

		dispatch(
			openAlert({
				message: 'Members deleted to this board successfully',
				severity: 'success',
			})
		);
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const workspaceMemberAdd = async (workspaceId, members, dispatch) => {
	try {
		const result = await axios.post(`${baseUrlWorkspace}/${workspaceId}/add-member`,{
			members
		});
		await dispatch(addWorspaceMembers(result.data));
		dispatch(
			openAlert({
				message: 'Members are added to this workspace successfully',
				severity: 'success',
			})
		);
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};



export const workspaceMemberDelete = async (workspaceId, userId, dispatch) => {
	try {
		const result = await axios.delete(`${baseUrlWorkspace}/${workspaceId}/delete-member`,{
			data: {
				memberId : userId
			}
			});
		// await dispatch(addWorspaceMembers(result.data));
		dispatch(
			openAlert({
				message: 'Members deleted to this workspace successfully',
				severity: 'success',
			})
		);
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};