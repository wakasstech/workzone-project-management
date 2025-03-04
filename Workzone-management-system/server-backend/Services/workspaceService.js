;

const { Op, Sequelize } = require("sequelize");
const db = require("../modals/index.js");
const sequelize = db.sequelize;
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
const helperMethods = require('./helperMethods');
const CardLabel=db.CardLabels;
//const CardMember=db.CardMembers;
const CardWatcher=db.CardWatchers;
const Attachment=db.CardAttachments;
const Checklist=db.CardChecklists;
const CardMembers=db.CardMembers;
const CardActivities=db.CardActivities;

const create = async (req, callback) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { name, type, description, color } = req.body;
        const ownerId = req.user._id;
        // Create new workspace
        const newWorkspace = await Workspace.create({
            name,
            type,
            description,
            color,
            owner: ownerId,
        }, { transaction });
        // Add owner as a member
        await WorkspaceMembers.create({
            workspaceId: newWorkspace._id,
            userId: ownerId,
            role: "owner",
            name: req.user?.username,
            email: req.user?.email,
            color:req.user?.color,
           
        }, { transaction });

        await transaction.commit();
        return callback(null, newWorkspace);
    } catch (error) {
        await transaction.rollback();
        return callback({ errMessage: "Error creating workspace", details: error.message });
    }
};


const getWorkspaces = async (userId, callback) => {
    try {
        const workspaces = await Workspace.findAll({
            include: [
                {
                    model: User,
                    as: "members",
                    attributes: ["_id"], // Fetch only user ID
                    through: { attributes: ["role", "name", "surname", "email", "color"] }, // Fetch pivot table attributes
                    required: false
                },
                {
                    model: Board,  // Include related Boards
                    as: "boards",
                    attributes: ["_id", "title", "backgroundImageLink", "description"], // Fetch board details
                }
            ],
            where: {
                [Op.or]: [
                    { owner: userId }, // Workspaces owned by the user
                    { "$members.id$": userId } // Workspaces where the user is a member
                ]
            }
        });
        // Transform response to remove `WorkspaceMembers` nesting
        const transformedWorkspaces = workspaces.map(workspace => ({
            ...workspace.toJSON(),
            members: workspace.members.map(member => ({
                user: member._id, // Rename `id` to `user`
                role: member.WorkspaceMembers.role,
                name: member.WorkspaceMembers.name,
                surname: member.WorkspaceMembers.surname,
                email: member.WorkspaceMembers.email,
                color: member.WorkspaceMembers.color
            })),
            boards: workspace.boards // Include related boards directly
        }));

        return callback(null, transformedWorkspaces);
    } catch (error) {
        return callback({ msg: "Something went wrong", details: error.message });
    }
};



const getWorkspace = async (workspaceId, callback) => {
    console.log("Fetching workspace:", workspaceId);

    try {
        const workspace = await Workspace.findByPk(workspaceId, {
            include: [
                {
                    model: User,
                    as: "members",
                    attributes: ["_id"], // Fetch only user ID
                    through: { attributes: ["role", "name", "surname", "email", "color"] } // Fetch pivot table attributes
                },
                {
                    model: Board,  // Include related Boards
                    as: "boards",
                    attributes: ["_id", "title", "backgroundImageLink", "description"], // Fetch board details
                }
            ]
        });
console.log("...................")
        if (!workspace) {
            return callback({ message: "Workspace not found" });
        }

        // Transform response to structure `members` correctly
        const transformedWorkspace = {
            ...workspace.toJSON(),
            members: workspace.members.map(member => ({
                user: member._id, // Rename `id` to `user`
                role: member.WorkspaceMembers.role,
                name: member.WorkspaceMembers.name,
                surname: member.WorkspaceMembers.surname,
                email: member.WorkspaceMembers.email,
                color: member.WorkspaceMembers.color
            })),
            boards: workspace.boards // Include related boards directly
        };

        return callback(null, transformedWorkspace);
    } catch (error) {
        return callback({ message: "Something went wrong", details: error.message });
    }
};


const updateWorkspaceName = async (workspaceId, name, user, callback) => {
    try {
        const workspace = await Workspace.findByPk(workspaceId);
        if (!workspace) return callback({ message: "Workspace not found" });

        workspace.name = name;
        await workspace.save();
        return callback(null, { message: "Workspace name updated successfully" });
    } catch (error) {
        return callback({ message: "Something went wrong", details: error.message });
    }
};

const updateWorkspaceDescription = async (workspaceId, description, user, callback) => {
    try {
        const workspace = await Workspace.findByPk(workspaceId);
        if (!workspace) return callback({ message: "Workspace not found" });

        workspace.description = description;
        await workspace.save();
        return callback(null, { message: "Workspace description updated successfully" });
    } catch (error) {
        return callback({ message: "Something went wrong", details: error.message });
    }
};


  
const addMembersToWorkspace = async (workspaceId, newMembers, boardIds, listIds, cardIds, user, callback) => {
    try {
      console.log("newMembers");
  
      // Fetch workspace along with its current members
      const workspace = await Workspace.findByPk(workspaceId, {
        include: {
          model: User,
          as: "members",
          attributes: ["_id", "username", "email", "color"],
          through: { attributes: ["role", "name", "email", "color"] }, // Include role from join table
        },
      });
  
      if (!workspace) {
        return callback({ errMessage: "Workspace not found" });
      }
  
      console.log("workspace members", workspace.members);
  
      // Get existing members in the workspace
      const existingMemberIds = workspace.members.map((member) => member._id);
  
      // Fetch full user details for new members
      const membersToAdd = await Promise.all(
        newMembers
          .filter((member) => !existingMemberIds.includes(member._id))
          .map(async (member) => {
            const fullUser = await User.findByPk(member._id, {
              attributes: ["_id", "username", "email", "color"],
            });
  
            if (!fullUser) return null;
  
            return {
              ...fullUser.get(), // Extract user details
            
              role: member.role || "member", // Default role if not provided
            };
          })
      );
  

      // Remove any `null` values from failed user lookups
      const validMembersToAdd = membersToAdd.filter(Boolean);

     if (validMembersToAdd.length > 0) {
        await Promise.all(
          validMembersToAdd.map(async (member) => {
            await workspace.addMember(member._id, {
              through: {
                role: member.role || "member",
                name: member.username, // Save name
                email: member.email, // Save email
                color: member.color, // Save color
              },
            });
          })
        );
      }
      callback(null, { message: "Members added successfully." });
    } catch (error) {
      callback({ errMessage: "Something went wrong", details: error.message });
    }
  };
  
const deleteMember = async (workspaceId, memberId, user, callback) => {
    const transaction = await db.sequelize.transaction();
    try {
        const workspace = await Workspace.findByPk(workspaceId);
        if (!workspace) return callback({ message: "Workspace not found" });

        const member = await WorkspaceMembers.findOne({
            where: { workspace_id: workspaceId, user_id: memberId }
        });

        if (!member) return callback({ message: "Member not found in this workspace" });

        await WorkspaceMembers.destroy({
            where: { workspace_id: workspaceId, user_id: memberId },
            transaction
        });

        await transaction.commit();
        return callback(null, { message: "Member removed successfully" });
    } catch (error) {
        await transaction.rollback();
        return callback({ message: "Something went wrong", details: error.message });
    }
};


const newAddMember = async (payload, callback) => {
    try {
      const { workspaceId, memberId, boardIds, listIds, cardIds } = payload;
      
      if (!workspaceId.length || !memberId) {
        return callback({ errMessage: "workspaceId and memberId are required." });
      }
      
      if (typeof callback !== "function") {
        throw new Error("Callback function is required");
      }
  
      const user = await User.findByPk(memberId, {
        attributes: ["_id", "username", "email", "color"],
      });
      if (!user) {
        return callback({ errMessage: "User not found" });
      }
  
      for (const wId of workspaceId) {
        const workspace = await Workspace.findByPk(wId, {
          include: [{ model: User, as: "members", attributes: ["_id"] }],
        });
  
        if (!workspace) {
          return callback({ errMessage: `Workspace ID ${wId} not found.` });
        }
  
        const existingWorkspaceMemberIds = workspace.members.map((member) => member._id);
        if (!existingWorkspaceMemberIds.includes(Number(memberId))) { 
          const addedWorkspace = await workspace.addMember(user._id, {
            through: {
              role: "member",
              name: user.username,
              email: user.email,
              color: user.color,
            },
          });
          if (!addedWorkspace) {
            return callback({ errMessage: `Failed to add user ${memberId} to workspace ${wId}` });
          }
        }
  
        for (const boardId of boardIds) {
          const board = await Board.findByPk(boardId, {
            include: [{ model: User, as: "members", attributes: ["_id"] }],
          });
          if (!board) {
            return callback({ errMessage: `Board ID ${boardId} not found.` });
          }
  
          const existingBoardMemberIds = board.members.map((member) => member._id);
          if (!existingBoardMemberIds.includes(Number(memberId))) {
            const addedBoardMember = await board.addMember(user._id,{
              through: {
                role: "member",
                name: user.username,
                email: user.email,
                color: user.color,
              },
            });
            if (!addedBoardMember) {
              return callback({ errMessage: `Failed to add user ${memberId} to board ${boardId}` });
            }
          }
  
          for (const listId of listIds) {
            const list = await List.findByPk(listId, {
              include: [{ model: User, as: "members", attributes: ["_id"] }],
            });
            if (!list) {
              return callback({ errMessage: `List ID ${listId} not found.` });
            }
  console.log(list.members,"............list.ListMembers.dataValues..............")
            const existingListMemberIds = list.members.map((member) => member._id);
            if (!existingListMemberIds.includes(Number(memberId))) {
              const addedListMember = await list.addMember(user._id,{
                through: {
                  role: "member",
                  name: user.username,
                  email: user.email,
                  color: user.color,
                },
              });
              if (!addedListMember) {
                return callback({ errMessage: `Failed to add user ${memberId} to list ${listId}` });
              }
            }
  
            for (const cardId of cardIds) {
              const card = await Card.findByPk(cardId, {
                include: [{ model: User, as: "members", attributes: ["_id"] }],
              });
              if (!card) {
                return callback({ errMessage: `Card ID ${cardId} not found.` });
              }
  
              const existingCardMemberIds = card.members.map((member) => member._id);
              if (!existingCardMemberIds.includes(Number(memberId))) {
                const addedCardMember = await card.addMember(user._id,{
              through: {
                role: "member",
                name: user.username,
                email: user.email,
                color: user.color,
              },
            });
                if (!addedCardMember) {
                  return callback({ errMessage: `Failed to add user ${memberId} to card ${cardId}` });
                }
              }
            }
          }
        }
      }
  
      callback(null, { message: "Member added successfully to all levels." });
    } catch (error) {
      callback({ errMessage: error.message || "Something went wrong", details: error.stack });
    }
  };

  const removeMemberFromWorkspace = async (workspaceId, memberId, user, callback) => {
    try {
        // Fetch the workspace with its boards, lists, and members
        const workspace = await Workspace.findByPk(workspaceId, {
            include: [
                {
                    model: Board,
                    as: "boards",
                    include: [
                        {
                            model: List,
                            as: "lists",
                            include: [
                                {
                                    model: Card,
                                    as: "cards",
                                    include: [
                                        {
                                            model: User,
                                            as: "members",
                                            attributes: ["_id"],
                                            through: { attributes: ["role"] },
                                        },
                                    ],
                                },
                                {
                                    model: User,
                                    as: "members",
                                    attributes: ["_id"],
                                    through: { attributes: ["role"] },
                                },
                            ],
                        },
                        {
                            model: User,
                            as: "members",
                            attributes: ["_id"],
                            through: { attributes: ["role"] },
                        },
                    ],
                },
                {
                    model: User,
                    as: "members",
                    attributes: ["_id"],
                    through: { attributes: ["role"] },
                },
            ],
        });
  
        if (!workspace) return callback({ errMessage: "Workspace not found" });
  
        // Check if the member exists in the workspace
        const existingMember = workspace.members.find((m) => m._id === Number(memberId));
        if (!existingMember) {
            return callback({ errMessage: "Member not found in this workspace" });
        }
  
        // Remove the member from the workspace
        await workspace.removeMember(memberId);
  
        // Remove the member from all associated boards
        for (const board of workspace.boards) {
            const boardMember = board.members.find((m) => m._id === Number(memberId));
            if (boardMember) {
                await board.removeMember(memberId);
            }
  
            // Remove the member from all lists in the board
            for (const list of board.lists) {
                const listMember = list.members.find((m) => m._id === Number(memberId));
                if (listMember) {
                    await list.removeMember(memberId);
                }
  
                // Remove the member from all cards in the list
                for (const card of list.cards) {
                    const cardMember = card.members.find((m) => m._id === Number(memberId));
                    if (cardMember) {
                        await card.removeMember(memberId);
                    }
                }
            }
        }
  
        // Fetch updated workspace members after deletion
        const updatedWorkspaceMembers = await workspace.getMembers({
            attributes: ["_id", "username", "email", "color"],
            joinTableAttributes: ["role"],
        });
  
        const response = {
            message: "Member removed from workspace, boards, lists, and cards",
            removedMemberId: memberId,
            remainingMembers: updatedWorkspaceMembers.map((m) => ({
                _id: m._id,
                name: m.username,
                email: m.email,
                color: m.color,
                role: m.WorkspaceMembers.role,
            })),
        };
  
        callback(null, response);
    } catch (error) {
        callback({ errMessage: "Something went wrong", details: error.message });
    }
  };

  const deleteById = async (workspaceId, user) => {
    const transaction = await sequelize.transaction(); // Start transaction
  
    try {
      // Find workspace with related boards, lists, and cards
      const workspace = await Workspace.findByPk(workspaceId, {
        include: [{
          model: Board, as: "boards",
          include: [{
            model: List, as: "lists",
            include: [{
              model: Card, as: "cards",
              include: [
                { model: CardLabel, as: "labels" },
                { model: CardMembers, as: "cardmembers" },
                { model: CardActivities, as: "activities" },
                { model: Attachment, as: "attachments" },
                { model: Checklist, as: "checklists", include: [{ model: ChecklistItems, as: "items" }] }
              ]
            }]
          }]
        }],
        transaction
      });
  
      if (!workspace) {
        await transaction.rollback();
        return { error: { message: "Workspace not found" } };
      }
  
      // Check if the user is the owner
      if (workspace.owner !== user._id) {
        await transaction.rollback();
        return { error: { message: "You do not have permission to delete this workspace" } };
      }
  
      // Delete related boards, lists, and cards
      for (const board of workspace.boards) {
        for (const list of board.lists) {
          const cardIds = list.cards.map(card => card._id);
  
          if (cardIds.length > 0) {
            // Delete related data for all cards in the list
            await CardLabel.destroy({ where: { card_id: cardIds }, transaction });
            await CardMembers.destroy({ where: { card_id: cardIds }, transaction });
            await CardActivities.destroy({ where: { card_id: cardIds }, transaction });
            await Attachment.destroy({ where: { card_id: cardIds }, transaction });
  
            // Delete checklist items before checklists
            const checklistIds = list.cards.flatMap(card => card.checklists?.map(c => c._id) || []);
            if (checklistIds.length > 0) {
              await ChecklistItems.destroy({ where: { checklist_id: checklistIds }, transaction });
              await Checklist.destroy({ where: { id: checklistIds }, transaction });
            }
  
            // Delete the cards
            await Card.destroy({ where: { list_id: list._id }, transaction });
          }
  
          // Delete the list
          await List.destroy({ where: { board_id: board._id }, transaction });
        }
  
        // Delete the board
        await Board.destroy({ where: { workspace_id: workspaceId }, transaction });
      }
  
      // Delete members from the workspace
      await WorkspaceMembers.destroy({ where: { workspace_id: workspaceId }, transaction });
  
      // Finally, delete the workspace
      await workspace.destroy({ transaction });
  
      // Commit transaction
      await transaction.commit();
  
      return { message: "Workspace and all related data deleted successfully" };
    } catch (error) {
      if (transaction.finished !== "rollback") {
        await transaction.rollback();
      }
      console.error("Error deleting workspace:", error);
      return { error: { message: "Error deleting workspace", details: error.message } };
    }
  };

module.exports = {
    create,
    getWorkspaces,
    getWorkspace,
    updateWorkspaceName,
    updateWorkspaceDescription,
  addMembersToWorkspace,
    deleteMember,
    newAddMember,
    removeMemberFromWorkspace,
    deleteById
};

