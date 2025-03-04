const express = require('express');
const workspaceController = require('../Controllers/workspaceController');
const router = express.Router();
const auth = require("../Middlewares/auth");
router.post('/create',auth.verifyJWT, workspaceController.createWorkspace);

router.post('/new-addmember', auth.verifyJWT,workspaceController.newAddMember);

router.get("/get-workspaces",auth.verifyJWT,workspaceController.getUserWorkspaces);
router.get("/get-workspace/:workspaceId",  workspaceController.getWorkspaceById);
router.post('/:workspaceId/update-name', workspaceController.updateWorkspaceName);
router.post('/:workspaceId/add-member',auth.verifyJWT, workspaceController.addMemberToWorkspace);
router.put("/update-workspaceDescription/:workspaceId", workspaceController.updateWorkspaceDescription);
router.put("/update-workspaceName/:workspaceId",  workspaceController.updateWorkspaceName);

router.delete('/:workspaceId/delete-workspace',auth.verifyJWT, workspaceController.deleteWorkspace);

router.delete('/:workspaceId/delete-member', workspaceController.removeMemberFromWorkspace);
module.exports = router;
  