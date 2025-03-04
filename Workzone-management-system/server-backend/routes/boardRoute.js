const express = require('express');
const boardController = require('../Controllers/boardController');
const route = express.Router();
const auth = require("../Middlewares/auth");
route.post('/:workspaceId/:boardId/add-member',boardController.addMember);
route.put('/:workspaceId/:boardId/update-background' ,auth.verifyJWT, boardController.updateBoardBackground);
route.put('/:workspaceId/:boardId/update-board-description',auth.verifyJWT,  boardController.updateBoardDescription);
route.put('/:workspaceId/:boardId/update-board-title', auth.verifyJWT,boardController.updateBoardTitle);
route.post('/create',auth.verifyJWT,boardController.create);
route.get('/:workspaceId/:boardId', boardController.getBoardById);
route.get('/:workspaceId/:boardId/activity', boardController.getBoardActivities);
route.get('/:workspaceId', auth.verifyJWT, boardController.getAllBoards);

route.delete('/:workspaceId/:boardId',auth.verifyJWT,boardController.deleteBoard);

route.delete('/:workspaceId/:boardId/delete-member-from-Board',boardController.removeMemberFromBoard);
module.exports = route;
