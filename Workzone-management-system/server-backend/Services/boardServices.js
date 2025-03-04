
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
// Service method to create a new board
exports.create = async ({ title, backgroundImageLink, workspaceId, userId }) => {
  try {
      // Create new board
      console.log("board Services............." )
      const newBoard = await Board.create({
          title,
          backgroundImageLink,
          workspaceId,
      });
console.log("newBoard",newBoard,"WorkspaceId",workspaceId)
      // Add creator as a board member with "owner" role
      await BoardMembers.create({
          board_id: newBoard._id,
          user_id: userId,
          role: "owner",
      });

      return newBoard;
  } catch (error) {
      console.error("Error in board creation:", error);
      throw error;
  }
};

exports.getById = async (boardId) => {
  try {
    const board = await Board.findByPk(boardId, {
      include: [
        {
          model: List,
          as: "lists",
          attributes: ["_id"], // Only list IDs
        },
        {
          model: User,
          as: "members",
          attributes: ["_id", "username", "email"], // Include surname
          through: { attributes: ["role", "color"] }, // Include role & color
        },
        {
          model: BoardActivity,
          as: "activities",
          attributes: [ "name", "action", "edited", "cardTitle", "actionType",  "date"], // Include _id & user
        },
      ],
    });

    if (!board) {
      return { error: { message: "Board not found" } };
    }

    // Transform the board response
    const transformedBoard = {
      _id: board._id,
      title: board.title,
      isImage: !!board.backgroundImageLink, // Boolean check
      backgroundImageLink: board.backgroundImageLink || "",
      lists: board.lists.map(list => list._id), // Only list IDs
      description: board.description || "",
      owner: board.owner, // Assuming this stores the owner's ID
      activity: board.activities.map(act => ({
        _id: act._id,
        user: act._id, // Ensure user ID is present
        name: act.name,
        action: act.action,
        edited: act.edited,
        cardTitle: act.cardTitle,
        actionType: act.actionType,
        color: act.color,
        date: act.date,
      })),
      members: board.members.map(member => ({
        user: member._id,
        name: member.username, // Fix name field
        surname: member.surname || "", // Ensure surname is handled
        email: member.email,
        role: member.BoardMembers.role,
        color: member.BoardMembers.color,
        _id: member.BoardMembers._id, // Ensure correct _id is used
      })),
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
      __v: board.__v || 0,
    };

    return transformedBoard;
  } catch (error) {
    return { error: { message: "Error fetching board", details: error.message } };
  }
};


exports.getBoards = async (userId, workspaceId) => {
  try {
    const workspace = await Workspace.findByPk(workspaceId, {
      include: [
        {
          model: Board,
          as: "boards",
          include: [
            {
              model: User,
              as: "members",
              attributes: ["_id", "username", "email"], // Select only relevant fields
              through: { attributes: ["role", "color"] }, // Include membership details
            },
            {
              model: List,
              as: "lists",
              attributes: ["_id", "title"], // Include lists
            },
            {
              model: BoardActivity,
              as: "activities",
              attributes: ["id", "name", "action", "date"], // Include activity logs
            },
          ],
        },
      ],
    });

    if (!workspace) {
      return { error: { message: "Workspace not found" } };
    }

    // Format the response and filter boards where the user is a member or owner
    const boards = workspace.boards
      .filter((board) => 
        board.owner === userId || board.members.some((member) => member._id === userId)
      )
      .map((board) => ({
        _id: board._id,
        title: board.title,
        isImage: board.isImage,
        backgroundImageLink: board.backgroundImageLink,
        description: board.description,
        owner: board.workspace_id,
        members: board.members.map((member) => ({
          user: member._id,
          name: member.username,
          surname: member.surname || "",
          email: member.email,
          role: member.BoardMembers.role,
          color: member.BoardMembers.color,
          _id: member.BoardMembers._id,
        })),
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
        __v: board.__v || 0,
      }));

    return boards; // Returning only the filtered boards
  } catch (error) {
    return { error: { message: "Error fetching boards", details: error.message } };
  }
};

exports.getActivityById = async (workspaceId, boardId) => {
  try {
    // Validate that the board exists and belongs to the correct workspace
    const board = await Board.findOne({
      where: { _id: boardId, workspace_id: workspaceId },
      include: [
        {
          model: BoardActivity,
          as: "activities",
          attributes: ["_id", "name", "action", "date", "edited", "cardTitle", "actionType", "color"],
          order: [["date", "DESC"]], // Order activities by most recent
        },
      ],
    });

    if (!board) {
      return { error: { message: "Board not found or does not belong to the workspace" } };
    }

    return { activities: board.activities || [] }; // Return an empty array if no activities exist
  } catch (error) {
    return { error: { message: "Error fetching activities", details: error.message } };
  }
};


exports.updateBoard = async ({ workspaceId, boardId, updates, user, action }) => {
  try {
    console.log(user,"user")
    // Ensure board exists and belongs to workspace
    const board = await Board.findOne({
      where: { _id: boardId, workspace_id: workspaceId },
      include: [{ model: Workspace, as: "workspace" }],
    });

    if (!board) {
      return { error: { message: "Board not found or does not belong to workspace" } };
    }
    // Update board fields
    await board.update(updates);
    // Log activity
    console.log(boardId, user, action);
    await BoardActivity.create({
      board_id: boardId,
      user_id: user._id,
      name: user.name,
      action: action,
    });
    return { board };
  } catch (error) {
    return { error: { message: "Error updating board", details: error.message } };
  }
};

exports.addMembersToBoard = async (boardId, newMembers, user, callback) => {
  try {
    console.log("New members received:", newMembers);

    // Fetch the board along with workspace and members
    const board = await Board.findByPk(boardId, {
      include: [
        {
          model: Workspace,
          as: "workspace",
          include: {
            model: User,
            as: "members",
            attributes: ["_id"],
            through: { attributes: ["role"] },
          },
        },
        {
          model: User,
          as: "members",
          attributes: ["_id", "username",  "email", "color"],
          through: { attributes: ["role"] },
        },
      ],
    });

    if (!board) {
      return callback({ errMessage: "Board not found" });
    }

    const workspace = board.workspace;
    if (!workspace) {
      return callback({ errMessage: "Parent workspace not found for this board" });
    }

    // Get existing board and workspace members
    const existingBoardMemberIds = board.members.map((member) => member._id);
    const workspaceMemberIds = workspace.members.map((member) => member._id);

    // Fetch `_id` for new members using email
    const membersWithIds = await Promise.all(
      newMembers.map(async (member) => {
        const userRecord = await User.findOne({ where: { email: member.email } });
        return userRecord ? { ...member, _id: userRecord._id } : null;
      })
    );

    // Filter valid members (must be in workspace and not in board)
    const validMembersToAdd = [];
    const skippedMembers = [];

    membersWithIds.forEach((member) => {
      if (!member) {
        skippedMembers.push({ email: member.email, reason: "User not found" });
      } else if (!workspaceMemberIds.includes(member._id)) {
        skippedMembers.push({ email: member.email, reason: "Not a workspace member" });
      } else if (existingBoardMemberIds.includes(member._id)) {
        skippedMembers.push({ email: member.email, reason: "Already in board" });
      } else {
        validMembersToAdd.push(member);
      }
    });

    // Add valid members to the board
    if (validMembersToAdd.length > 0) {
      await Promise.all(
        validMembersToAdd.map(async (member) => {
          await board.addMember(member._id, {
            through: {
              role: member.role || "member",
              name: member.name || "",
              email: member.email,
              color: member.color || "",
            },
          });
        })
      );
    }

    // 🔹 Fetch updated board members
    const updatedBoard = await Board.findByPk(boardId, {
      include: [
        {
          model: User,
          as: "members",
          attributes: ["_id", "username", "email", "color"],
          through: { attributes: ["role"] },
        },
      ],
    });
console.log(updatedBoard.members,"updatedBoard")
    return callback(null, {
      message: "Members processed successfully",
      addedMembers: validMembersToAdd.map(({ _id, username, surname, email, role, color }) => ({
        _id,
        name:username,
        surname,
        email,
        role,
        color,
      })),
      skippedMembers,
      allBoardMembers: updatedBoard.members.map(({ _id, username, surname, email, color, BoardMembers }) => ({
        _id,
        name:username,
        surname,
        email,
        color,
        role:BoardMembers.role // Role from board_members relation
      })),
    });
  } catch (error) {
    console.log(error.message);
    return callback({ errMessage: "Something went wrong", details: error.message });
  }
};


// Delete member from the board
exports.deleteMember = async (boardId, memberId, user) => {
  try {
    const board = await Board.findByPk(boardId);
    if (!board) {
      return { error: { message: 'Board not found' } };
    }
    const member = await User.findByPk(memberId);
    if (!member) {
      return { error: { message: 'Member not found' } };
    }
    await board.removeUser(member);
    await board.createActivity({
      userId: user._id,
      action: `removed user '${member.name}' from this board`
    });
    return { board };
  } catch (error) {
    return { error: { message: 'Error deleting member', details: error.message } };
  }
};
// Delete the board
exports.deleteById = async (boardId, workspaceId, user) => {
  const transaction = await sequelize.transaction(); // Start transaction

  try {
    // Find the board and workspace
    const board = await Board.findByPk(boardId, {
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
      }],
      transaction
    });

    if (!board) {
      await transaction.rollback();
      return { error: { message: "Board not found" } };
    }

    // Check if the user has permission to delete the board
    const workspace = await Workspace.findByPk(workspaceId, { transaction });
    console.log(workspace.owner,"workspaceId",user._id)
    if (!workspace || workspace.owner !== user._id) {
      await transaction.rollback();
      return { error: { message: "You do not have permission to delete this board" } };
    }

    // Delete lists and their child entities
    for (const list of board.lists) {
      const cardIds = list.cards.map((card) => card._id);

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
      await List.destroy({ where: { board_id: boardId }, transaction });
    }

    // Finally, delete the board
    await board.destroy({ transaction });

    // Commit transaction
    await transaction.commit();

    return { message: "Board and all related lists & cards deleted successfully" };
  } catch (error) {
    if (transaction.finished !== "rollback") {
      await transaction.rollback();
    }
    console.error("Error deleting board:", error);
    return { error: { message: "Error deleting board", details: error.message } };
  }
};


exports.removeMemberFromBoard = async (boardId, memberId, user, callback) => {
  try {
    console.log("heloooooo")
      // Fetch the board with its lists and members
      const board = await Board.findByPk(boardId, {
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
      });

      if (!board) return callback({ errMessage: "Board not found" });

      // Check if the member exists in the board
      console.log(board.members, 'boardmemmmmmmmmmmmmmm')
      const existingMember = board.members.find((m) => m._id === Number(memberId));
      console.log(existingMember, 'existinggggggggggmem')
      if (!existingMember) {
          return callback({ errMessage: "Member not found in this board" });
      }

      // Remove the member from the board
      await board.removeMember(memberId);

      // Remove the member from all associated lists
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

      // Fetch updated board members after deletion
      const updatedBoardMembers = await board.getMembers({
          attributes: ["_id", "username", "email", "color"],
          joinTableAttributes: ["role"],
      });

      const response = {
          message: "Member removed from board, lists, and cards",
          removedMemberId: memberId,
          remainingMembers: updatedBoardMembers.map((m) => ({
              _id: m._id,
              name: m.username,
              email: m.email,
              color: m.color,
              role: m.BoardMembers.role,
          })),
      };

      callback(null, response);
  } catch (error) {
      callback({ errMessage: "Something went wrong", details: error.message });
  }
};
