const express = require('express');
const router = express.Router();
const auth = require("../Middlewares/auth");
const listController = require('../Controllers/listController');
router.put('/:workspaceId/:boardId/:listId/update-title',  listController.updateListTitle);
router.post('/:workspaceId/create', auth.verifyJWT, listController.create);
router.get('/:workspaceId/:boardId',  auth.verifyJWT,  listController.getAll);


router.delete('/:workspaceId/:boardId/:listId/delete-member-from-list', listController.removeMemberFromList);
router.delete('/:workspaceId/:boardId/:listId',listController.deleteList);


router.post('/change-card-order', auth.verifyJWT,   listController.updateCardOrder);
router.post('/change-list-order',  auth.verifyJWT,   listController.updateListOrder);
router.post('/:workspaceId/:boardId/:listId/add-member', listController.addMemberToList);
module.exports = router;
