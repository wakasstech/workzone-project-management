


const { Op, Sequelize } = require("sequelize");
const workspaceService = require("../Services/workspaceService.js");
const helperMethods = require('../Services/helperMethods.js');

const db = require("../modals/index.js");
const Workspace = db.workspaceModel;
const User = db.userModel;
const ChecklistItems=db.ChecklistItems;
const WorkspaceMembers = db.workspaceMembersModel;
const Activity = db.BoardActivity;
const Board = db.Board;
const BoardActivity = db.BoardActivity;
const BoardMembers = db.BoardMembers;
const List = db.List;
const ListMembers = db.ListMembers;
const Card = db.Card;
const CardLabel=db.CardLabels;
//const CardMember=db.CardMembers;
const CardWatcher=db.CardWatchers;
const Attachment=db.CardAttachments;
const Checklist=db.CardChecklists;
const CardMembers=db.CardMembers;
const CardActivities=db.CardActivities;


const createWorkspace = async (req, res) => {
    workspaceService.create(req, (err, newWorkspace) => {
        if (err) return res.status(400).json(err);
        return res.status(201).json(newWorkspace);
    });
};

const getUserWorkspaces = async (req, res) => {
    try {
        workspaceService.getWorkspaces(req.user._id, (err, workspaces) => {
            if (err) return res.status(400).json(err);
            return res.status(200).json(workspaces);
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
const getWorkspaceById = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        // Call the service function to get workspace details
        workspaceService.getWorkspace(workspaceId, (err, workspace) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(200).json(workspace);
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
const updateWorkspaceName = async (req, res) => {
    workspaceService.updateWorkspaceName(req.params.workspaceId, req.body.name, req.user, (err, result) => {
        if (err) return res.status(400).json(err);
        return res.status(200).json(result);
    });
};

const updateWorkspaceDescription = async (req, res) => {
    workspaceService.updateWorkspaceDescription(req.params.workspaceId, req.body.description, req.user, (err, result) => {
        if (err) return res.status(400).json(err);
        return res.status(200).json(result);
    });
};



const deleteMemberFromWorkspace = async (req, res) => {
    workspaceService.deleteMember(req.params.id, req.body.memberId, req.user, (err, updatedMembers) => {
        if (err) return res.status(400).json(err);
        return res.status(200).json(updatedMembers);
    });
};


  
const addMemberToWorkspace = async (req, res) => {
  console.log("working...");

  try {
    const { workspaceId } = req.params;
    const { members, boardIds = [], listIds = [], cardIds = [] } = req.body;
    const user = req.user;

    // Validate whether the user belongs to the workspace
    const validUser = await User.findByPk(user._id, {
      include: {
        model: Workspace,
        as: "workspaces",
        where: { _id: workspaceId },
      },
    });

    if (!validUser || !validUser.workspaces.length) {
      return res.status(403).json({ errMessage: "Workspace not found or you do not have access." });
    }

    // Extract emails from the members array
    const memberEmails = members.map((member) => member.email);

    // Fetch users based on their emails
    const newMembers = await User.findAll({
      where: { email: memberEmails },
      attributes: ["_id", "username", "email", "color"],
    });

    if (newMembers.length === 0) {
      return res.status(400).json({ errMessage: "No valid users found with the provided emails." });
    }

    // Map new members with their roles
    const membersWithRoles = newMembers.map((member) => {
      const providedMember = members.find((m) => m.email === member.email);
      return {
        ...member.get(),
        role: providedMember?.role || "member",
      };
    });

    // Call the service function
    await workspaceService.addMembersToWorkspace(
      workspaceId,
      membersWithRoles,
      boardIds,
      listIds,
      cardIds,
      user,
      (err, result) => {
        if (err) return res.status(400).json(err);
        return res.status(200).json(result);
      }
    );
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error", details: error.message });
  }

 
};
const newAddMember = async (req, res) => {
  try {
    const { workspaceId, memberId, boardIds, listIds, cardIds } = req.body;
    
    console.log(workspaceId, 'workspcae')

    // Check if the user is a member of the workspace
    const isMember = await WorkspaceMembers.findOne({
      where: {
        workspaceId,
        userId: req.user._id, 
      },
    });

    if (!isMember) {
      return res.status(403).json({
        errMessage: "You cannot add members to this workspace, you are not a member or owner!",
      });
    }
  
    console.log("In the controller - Adding new member");

    // ✅ Pass a single payload object instead of multiple arguments
    const payload = { workspaceId, memberId, boardIds, listIds, cardIds };

    workspaceService.newAddMember(payload, (err, result) => {
      if (err) {
        return res.status(400).json(err);
      }
      return res.status(200).json(result);
    });

  } catch (error) {
    return res.status(500).json({ errMessage: "Internal Server Error", details: error.message });
  }
};
const removeMemberFromWorkspace = async (req, res) => {
  try {
      const { workspaceId} = req.params;
      const {memberId}=req.body;

      if (!workspaceId || !memberId) {
          return res.status(400).json({ error: "Invalid input data" });
      }

      workspaceService.removeMemberFromWorkspace(workspaceId, memberId, req.user, (err, result) => {
          if (err) return res.status(400).json(err);
          return res.status(200).json(result);
      });

  } catch (error) {
      return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};
const deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const user = req.user;

    const result = await workspaceService.deleteById(workspaceId, user);

    if (result.error) {
      return res.status(400).json(result.error);
    }

    return res.status(200).json(result.message);
  } catch (err) {
    return res.status(500).json({ message: "Server error", details: err.message });
  }
};
module.exports = {
    createWorkspace,
    getUserWorkspaces,
    getWorkspaceById,
    updateWorkspaceName,
    updateWorkspaceDescription,
    addMemberToWorkspace,
    deleteMemberFromWorkspace,
    newAddMember,
    removeMemberFromWorkspace,
    deleteWorkspace
};
