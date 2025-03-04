//cardrouter
const cardController = require('../Controllers/cardController');
const express = require('express');
const router = express.Router();
const auth = require("../Middlewares/auth");


router.put('/:workspaceId/:boardId/:listId/:cardId/:attachmentId/update-attachment',  auth.verifyJWT ,cardController.updateAttachment);
router.delete('/:workspaceId/:boardId/:listId/:cardId/:attachmentId/delete-attachment', auth.verifyJWT,  cardController.deleteAttachment); 
router.post('/:workspaceId/:boardId/:listId/:cardId/add-attachment',  auth.verifyJWT, cardController.addAttachment);
router.put('/:workspaceId/:boardId/:listId/:cardId/update-date-completed',  auth.verifyJWT, cardController.updateDateCompleted);
router.put('/:workspaceId/:boardId/:listId/:cardId/update-dates', auth.verifyJWT,  cardController.updateStartDueDates);
router.delete('/:workspaceId/:boardId/:listId/:cardId/:checklistId/:checklistItemId/delete-checklist-item', auth.verifyJWT,  cardController.deleteChecklistItem);
router.put('/:workspaceId/:boardId/:listId/:cardId/:checklistId/:checklistItemId/set-checklist-item-text',  auth.verifyJWT, cardController.setChecklistItemText);
router.put('/:workspaceId/:boardId/:listId/:cardId/:checklistId/:checklistItemId/set-checklist-item-completed', auth.verifyJWT,  cardController.setChecklistItemCompleted);
router.post('/:workspaceId/:boardId/:listId/:cardId/:checklistId/add-checklist-item',  auth.verifyJWT, cardController.addChecklistItem);
router.delete('/:workspaceId/:boardId/:listId/:cardId/:checklistId/delete-checklist', auth.verifyJWT,  cardController.deleteChecklist);
router.post('/:workspaceId/:boardId/:listId/:cardId/create-checklist', auth.verifyJWT,  cardController.createChecklist);

router.delete('/:workspaceId/:boardId/:listId/:cardId/delete-card', auth.verifyJWT,  cardController.deleteCard);


router.delete('/:workspaceId/:boardId/:listId/:cardId/:memberId/delete-member', auth.verifyJWT,cardController.removeMember);


router.post('/:workspaceId/:boardId/:listId/:cardId/add-member', auth.verifyJWT,  cardController.addMember);    
router.post('/create',auth.verifyJWT,cardController.create);
router.get('/:workspaceId/:boardId/:listId/:cardId',  auth.verifyJWT, cardController.getCard);
 router.get('/:workspaceId/:boardId/:listId',  auth.verifyJWT, cardController.getAllCards);
 router.put('/:workspaceId/:boardId/:listId/:cardId',  auth.verifyJWT, cardController.update);
router.post('/:workspaceId/:boardId/:listId/:cardId/add-comment',  auth.verifyJWT, cardController.addComment);
router.put('/:workspaceId/:boardId/:listId/:cardId/:commentId', auth.verifyJWT, cardController.updateComment);
router.delete('/:workspaceId/:boardId/:listId/:cardId/:commentId', auth.verifyJWT, cardController.deleteComment);
module.exports = router;
