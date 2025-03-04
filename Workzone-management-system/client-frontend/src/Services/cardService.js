import axios from 'axios';
import { openAlert } from '../Redux/Slices/alertSlice';

import {
	setPending,
	setCard,
	updateTitle,
	updateDescription,
	addComment,
	updateComment,
	deleteComment,
	addMember,
	deleteMember,
	createLabel,
	updateLabel,
	deleteLabel,
	updateLabelSelection,
	updateCreatedLabelId,
	createChecklist,
	updateCreatedChecklist,
	deleteChecklist,
	addChecklistItem,
	updateAddedChecklistItemId,
	setChecklistItemCompleted,
	deleteChecklistItem,
	setChecklistItemText,
	updateStartDueDates,
	updateDateCompleted,
	addAttachment,
	updateAddedAttachmentId,
	deleteAttachment,
	updateAttachment,
	updateCover,
} from '../Redux/Slices/cardSlice';

import {
	addAttachmentForCard,
	addChecklistItemForCard,
	createChecklistForCard,
	createLabelForCard,
	deleteAttachmentOfCard,
	deleteChecklistItemOfCard,
	deleteChecklistOfCard,
	deleteLabelOfCard,
	deleteMemberOfCard,
	setCardTitle,
	setChecklistItemCompletedOfCard,
	setChecklistItemTextOfCard,
	updateCoverOfCard,
	updateDateCompletedOfCard,
	updateDescriptionOfCard,
	updateLabelOfCard,
	updateLabelSelectionOfCard,
	updateMemberOfCard,
	updateStartDueDatesOfCard,
} from '../Redux/Slices/listSlice';

const baseUrl = 'https://taskmanagement.ranaafaqali.com/api/card';
let submitCall = Promise.resolve();


export const getCard = async (workspaceId, cardId, listId, boardId, dispatch) => {
	console.log('here I am getting',workspaceId )
	dispatch(setPending(true));
	try {
		let response = '';
		submitCall = submitCall.then(() =>
			axios.get(baseUrl + '/' + workspaceId + '/' + boardId + '/' + listId + '/' + cardId).then((res) => {
				response = res;
			})
		);
		await submitCall;

		const card = await JSON.parse(JSON.stringify(response.data));
		dispatch(setCard(card));
		dispatch(setPending(false));
	} catch (error) {
		dispatch(setPending(false));
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const titleUpdate = async (workspaceId, cardId, listId, boardId, title, dispatch) => {
  console.log(typeof listId, typeof cardId, 'list id type');

	try {
		dispatch(setCardTitle({ listId, cardId, title }));
		dispatch(updateTitle(title));

		submitCall = submitCall.then(() =>
			axios.put(baseUrl + '/' + workspaceId + '/' + boardId + '/' + listId + '/' + cardId, { title: title })
		);
		await submitCall;
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const descriptionUpdate = async (workspaceId, cardId, listId, boardId, description, dispatch) => {

	try {
		dispatch(updateDescription(description));
		dispatch(updateDescriptionOfCard({ listId, cardId, description }));

		submitCall = submitCall.then(() =>
			axios.put(baseUrl + '/' + workspaceId + '/' + boardId + '/' + listId + '/' + cardId, { description: description })
		);
		await submitCall;
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const comment = async (workspaceId, cardId, listId, boardId, text, userName, dispatch) => {
	try {
		dispatch(setPending(true));

		let response = '';
		submitCall = submitCall.then(() =>
			axios
				.post(baseUrl + '/' + workspaceId + '/' + boardId + '/' + listId + '/' + cardId + '/add-comment', {
					text: text,
				})
				.then((res) => {
					response = res;
				})
		);
		await submitCall;

		dispatch(addComment(response.data?.comments));
		dispatch(setPending(false));
	} catch (error) {
		dispatch(setPending(false));
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const commentUpdate = async (workspaceId, cardId, listId, boardId, text, commentId, dispatch) => {
	try {
		dispatch(updateComment(commentId, text));

		submitCall = submitCall.then(() =>
			axios.put(baseUrl + '/' + workspaceId + '/' + boardId + '/' + listId + '/' + cardId + '/' + commentId, {
				text: text,
			})
		);
		await submitCall;
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const commentDelete = async (workspaceId, cardId, listId, boardId, commentId, dispatch) => {
	try {
		dispatch(deleteComment(commentId));

		submitCall = submitCall.then(() =>
			axios.delete(baseUrl + '/' + workspaceId + '/' + boardId + '/' + listId + '/' + cardId + '/' + commentId)
		);
		await submitCall;
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const memberAdd = async (workspaceId, cardId, listId, boardId, memberId, memberName, memberColor, dispatch, id) => {
	try {
		dispatch(addMember({ memberId, memberName, memberColor }));
		dispatch(updateMemberOfCard({ listId, cardId, memberId, memberName, memberColor }));

		submitCall = submitCall.then(() =>
			axios.post(baseUrl + '/' + workspaceId + '/' + boardId + '/' + listId + '/' + cardId + '/add-member', {
				"memberId": memberId || id
			})
		);
		await submitCall;
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const memberDelete = async (workspaceId, cardId, listId, boardId, memberId, memberName, dispatch, id) => {
	try {
		dispatch(deleteMember({ memberId }));
		dispatch(deleteMemberOfCard({ listId, cardId, memberId }));
		const finalId = memberId || id; 
		submitCall = submitCall.then(() =>
			axios.delete(baseUrl + '/' + workspaceId + '/' + boardId + '/' + listId + '/' + cardId + '/' + finalId + '/delete-member')
		);
		await submitCall;
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const labelCreate = async (workspaceId, cardId, listId, boardId, text, color, backColor, dispatch) => {
	try {
		dispatch(createLabel({ _id: 'notUpdated', text, color, backColor, selected: true }));

		let response = '';
		submitCall = submitCall.then(() =>
			axios
				.post(baseUrl + '/' + workspaceId + '/' + boardId + '/' + listId + '/' + cardId + '/create-label', {
					text,
					color,
					backColor,
				})
				.then((res) => {
					response = res;
				})
		);
		await submitCall;

		dispatch(updateCreatedLabelId(response.data.labelId));
		dispatch(
			createLabelForCard({ listId, cardId, _id: response.data.labelId, text, color, backColor, selected: true })
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

export const labelUpdate = async (workspaceId, cardId, listId, boardId, labelId, label, dispatch) => {
	try {
		dispatch(updateLabel({ labelId: labelId, text: label.text, color: label.color, backColor: label.backColor }));
		dispatch(
			updateLabelOfCard({
				listId,
				cardId,
				labelId: labelId,
				text: label.text,
				color: label.color,
				backColor: label.backColor,
			})
		);

		submitCall = submitCall.then(() =>
			axios.put(baseUrl + '/' + workspaceId + '/' + boardId + '/' + listId + '/' + cardId + '/' + labelId + '/update-label', label)
		);
		await submitCall;
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const labelDelete = async (workspaceId, cardId, listId, boardId, labelId, dispatch) => {
	try {
		dispatch(deleteLabel(labelId));
		dispatch(deleteLabelOfCard({ listId, cardId, labelId }));

		submitCall = submitCall.then(() =>
			axios.delete(baseUrl + '/' + workspaceId + '/' + boardId + '/' + listId + '/' + cardId + '/' + labelId + '/delete-label')
		);
		await submitCall;
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const labelUpdateSelection = async (workspaceId, cardId, listId, boardId, labelId, selected, dispatch) => {
	try {
		dispatch(updateLabelSelection({ labelId: labelId, selected: selected }));
		dispatch(updateLabelSelectionOfCard({ listId, cardId, labelId, selected }));

		submitCall = submitCall.then(() =>
			axios.put(
				baseUrl + '/' + workspaceId + '/' + boardId + '/' + listId + '/' + cardId + '/' + labelId + '/update-label-selection',
				{ selected: selected }
			)
		);
		await submitCall;
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const checklistCreate = async (workspaceId, cardId, listId, boardId, title, dispatch) => {
	try {
		dispatch(createChecklist({ _id: 'notUpdated', title }));

		let response = '';
		submitCall = submitCall.then(() =>
			axios
				.post(baseUrl + '/' + workspaceId + '/' + boardId + '/' + listId + '/' + cardId + '/create-checklist', {
					title,
				})
				.then((res) => {
					response = res;
				})
		);
		await submitCall;

		dispatch(updateCreatedChecklist(response.data.checklistId));
		dispatch(createChecklistForCard({ listId, cardId, _id: response.data.checklistId, title }));
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const checklistDelete = async (workspaceId, cardId, listId, boardId, checklistId, dispatch) => {
	try {
		dispatch(deleteChecklist(checklistId));
		dispatch(deleteChecklistOfCard({ listId, cardId, checklistId }));
		submitCall = submitCall.then(() =>
			axios.delete(
				baseUrl + '/' + workspaceId + '/' + boardId + '/' + listId + '/' + cardId + '/' + checklistId + '/delete-checklist'
			)
		);
		await submitCall;
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const checklistItemAdd = async (workspaceId, cardId, listId, boardId, checklistId, text, selectedMember , dispatch) => {
	try {
		dispatch(addChecklistItem({ checklistId: checklistId, _id: 'notUpdated', text: text, assignedTo:selectedMember  }));

		let response = '';
		submitCall = submitCall.then(() =>
			axios
				.post(
					baseUrl + '/' + workspaceId + '/' + boardId + '/' + listId + '/' + cardId + '/' + checklistId + '/add-checklist-item',
					{
						text:text, assignedTo:selectedMember
					}
				)
				.then((res) => {
					response = res;
				})
		);
		await submitCall;

		dispatch(
			updateAddedChecklistItemId({ checklistId: checklistId, checklistItemId: response.data.checklistItemId })
		);
		dispatch(
			addChecklistItemForCard({
				listId,
				cardId,
				checklistId: checklistId,
				_id: response.data.checklistItemId,
				text: text,
				assignedTo:selectedMember
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

export const checklistItemCompletedSet = async (
	workspaceId,
	cardId,
	listId,
	boardId,
	checklistId,
	checklistItemId,
	completed,
	dispatch
) => {
	try {
		dispatch(
			setChecklistItemCompleted({
				checklistId: checklistId,
				checklistItemId: checklistItemId,
				completed: completed,
			})
		);
		dispatch(
			setChecklistItemCompletedOfCard({
				listId,
				cardId,
				checklistId: checklistId,
				checklistItemId: checklistItemId,
				completed: completed,
			})
		);

		submitCall = submitCall.then(() =>
			axios.put(
				baseUrl +
				   '/' +
				   workspaceId +
					'/' +
					boardId +
					'/' +
					listId +
					'/' +
					cardId +
					'/' +
					checklistId +
					'/' +
					checklistItemId +
					'/set-checklist-item-completed',
				{
					completed,
				}
			)
		);
		await submitCall;
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const checklistItemTextSet = async (workspaceId, cardId, listId, boardId, checklistId, checklistItemId, text,selectedMember, dispatch) => {
	try {
		const assignedTo = selectedMember;
		dispatch(setChecklistItemText({ checklistId: checklistId, checklistItemId: checklistItemId, text: text, assignedTo}));
		dispatch(
			setChecklistItemTextOfCard({
				listId,
				cardId,
				checklistId: checklistId,
				checklistItemId: checklistItemId,
				text,
				assignedTo
			})
		);

		submitCall = submitCall.then(() =>
			axios.put(
				baseUrl +
				'/' +
				workspaceId +
				'/' +
					
					boardId +
					'/' +
					listId +
					'/' +
					cardId +
					'/' +
					checklistId +
					'/' +
					checklistItemId +
					'/set-checklist-item-text',
				{
					text,
					assignedTo

				}
			)
		);
		await submitCall;
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const checklistItemDelete = async (workspaceId, cardId, listId, boardId, checklistId, checklistItemId, dispatch) => {
	try {
		dispatch(deleteChecklistItem({ checklistId: checklistId, checklistItemId: checklistItemId }));
		dispatch(
			deleteChecklistItemOfCard({ listId, cardId, checklistId: checklistId, checklistItemId: checklistItemId })
		);

		submitCall = submitCall.then(() =>
			axios.delete(
				baseUrl +
				   '/' +
				   workspaceId +
					'/' +
					boardId +
					'/' +
					listId +
					'/' +
					cardId +
					'/' +
					checklistId +
					'/' +
					checklistItemId +
					'/delete-checklist-item'
			)
		);
		await submitCall;
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const startDueDatesUpdate = async (workspaceId, cardId, listId, boardId, startDate, dueDate, dueTime, dispatch) => {
	try {
		dispatch(updateStartDueDates({ startDate, dueDate, dueTime }));
		dispatch(updateStartDueDatesOfCard({ listId, cardId, startDate, dueDate, dueTime }));

		submitCall = submitCall.then(() =>
			axios.put(baseUrl + '/' + workspaceId + '/' + boardId + '/' + listId + '/' + cardId + '/update-dates', {
				startDate,
				dueDate,
				dueTime,
			})
		);
		await submitCall;
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const dateCompletedUpdate = async (workspaceId, cardId, listId, boardId, completed, dispatch) => {
	try {
		dispatch(updateDateCompleted(completed));
		dispatch(updateDateCompletedOfCard({ listId, cardId, completed }));

		submitCall = submitCall.then(() =>
			axios.put(baseUrl + '/' + workspaceId + '/' + boardId + '/' + listId + '/' + cardId + '/update-date-completed', {
				completed,
			})
		);
		await submitCall;
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const attachmentAdd = async (workspaceId, cardId, listId, boardId, link, name, dispatch) => {
	try {
		dispatch(addAttachment({ link: link, name: name, _id: 'notUpdated', date: Date() }));

		let response = '';
		submitCall = submitCall.then(() =>
			axios
				.post(baseUrl + '/' + workspaceId + '/' + boardId + '/' + listId + '/' + cardId + '/add-attachment', {
					link: link,
					name: name,
				})
				.then((res) => {
					response = res;
				})
		);
		await submitCall;

		dispatch(updateAddedAttachmentId(response.data.attachmentId));
		dispatch(
			addAttachmentForCard({
				listId,
				cardId,
				link: link,
				name: name,
				_id: response.data.attachmentId,
				date: Date(),
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

export const attachmentDelete = async (cardId, listId, boardId, attachmentId, dispatch) => {
	try {
		dispatch(deleteAttachment(attachmentId));
		dispatch(deleteAttachmentOfCard({ listId, cardId, attachmentId }));

		submitCall = submitCall.then(() =>
			axios.delete(
				baseUrl + '/' + boardId + '/' + listId + '/' + cardId + '/' + attachmentId + '/delete-attachment'
			)
		);
		await submitCall;
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const attachmentUpdate = async (cardId, listId, boardId, attachmentId, link, name, dispatch) => {
	try {
		dispatch(updateAttachment({ attachmentId: attachmentId, link: link, name: name }));

		submitCall = submitCall.then(() =>
			axios.put(
				baseUrl + '/' + boardId + '/' + listId + '/' + cardId + '/' + attachmentId + '/update-attachment',
				{ link: link, name: name }
			)
		);
		await submitCall;
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const coverUpdate = async (cardId, listId, boardId, color, isSizeOne, dispatch) => {
	try {
		dispatch(updateCover({ color: color, isSizeOne: isSizeOne }));
		dispatch(updateCoverOfCard({ listId, cardId, color, isSizeOne }));

		submitCall = submitCall.then(() =>
			axios.put(baseUrl + '/' + boardId + '/' + listId + '/' + cardId + '/update-cover', {
				color: color,
				isSizeOne: isSizeOne,
			})
		);
		await submitCall;
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};
