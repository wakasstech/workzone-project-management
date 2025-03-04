const { Op } = require("sequelize");

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
const CardLabel=db.CardLabels;
//const CardMember=db.CardMembers;
const CardWatcher=db.CardWatchers;
const Attachment=db.CardAttachments;
const Checklist=db.CardChecklists;
const CardMembers=db.CardMembers;
const CardActivities=db.CardActivities;
const listService = {
 
async createList({ title, board_id }, user, callback) {
  try {
      // Create the new list
      const newList = await List.create({ title, board_id });

      // Find the board where the list is being added
      const board = await Board.findByPk(board_id);
      if (!board) return callback({ errMessage: "Board not found" });

      // Add the owner (creator) as the first member of the list
      const listOwner = await ListMembers.create({
          list_id: newList._id,
          user_id: user._id,
          name: user.username,
          surname: user.surname,
          email: user.email,
          color: user.color,
          role: "owner",
      });

      // Save activity in the board (if you track board activity)
      const activity = {
          user: user._id,
          name: user.name,
          action: `added ${newList.title} to this board`,
          color: user.color,
      };
      board.activities = board.activities ? [...board.activities, activity] : [activity];
      await board.save();

      // Fetch the newly created list with populated members
      const populatedList = await List.findByPk(newList._id, {
          include: [
              {
                  model: ListMembers,
                  as: "ListMembers",
                  attributes: [ "user_id", "name", "surname", "email", "role", "color"],
              },
          ],
      });

      console.log(",,,,,,,,,,,,,,,,,,,",populatedList,"populatedList")
      // Format the response
      const response = {
        _id: populatedList.dataValues._id,
        title: populatedList.dataValues.title,
        cards: [], // Assuming a new list starts empty
        owner: user._id, // Owner is the creator's ID
        members: populatedList.ListMembers.map((member) => ({
            _id: member.dataValues._id,  // Ensure dataValues is accessed if needed
            user: member.dataValues.user_id, // Check if user_id exists inside member
            name: member.dataValues.name,
            surname: member.dataValues.surname,
            email: member.dataValues.email,
            role: member.dataValues.role,
            color: member.dataValues.color,
        })),
    };
    

      return callback(null, response);
  } catch (error) {
      return callback({ errMessage: "Something went wrong", details: error.message });
    }
},


async getListsByBoard(boardId, userId) {
  try {
    const lists = await List.findAll({
      where: { board_id: boardId },
      include: [
        {
          model: Card,
          as: "cards",
          include: [
            { model: CardLabel, as: "labels", attributes: ["id", "text", "color", "backColor", "selected"] },
            {
              model: CardMembers,
              as: "cardmembers",
              attributes: ["user_id"],
              include: [{ model: User, as: "user", attributes: ["id", "username", "email", "userType", "color"] }],
            },
            { model: CardWatcher, as: "CardWatchers", attributes: ["user_id"] },
            { model: Attachment, as: "attachments", attributes: ["id", "link", "name"] },
            { model: CardActivities, as: "activities", attributes: ["userName", "id", "text", "isComment", "color", "date"] },
            { 
              model: Checklist, 
              as: "checklists", 
              include: [{ model: ChecklistItems, as: "items", attributes: ["id", "text", "completed"] }]
            },
       
          ],
          order: [["position", "ASC"]],  // This ensures cards are ordered by position

        },
        {
          model: ListMembers,
          as: "ListMembers",
          include: [{ model: User, as: "user", attributes: ["id", "username", "email", "color"] }],
        },
      ],
order: [["position", "ASC"]], // Orders the lists based on the position field

    });

    // Filter lists based on membership
    const filteredLists = lists.filter(
      (list) => list.ListMembers.some((member) => member.user_id === userId && ["member", "owner"].includes(member.role))
    );
    // Transform the response to match the desired format
    const transformedLists = filteredLists.map((list) => ({
      _id: list._id,
      title: list.title,
      position: list.dataValues.position, // Include position
      cards: list.cards ? list.cards.filter((card) => 
        card.cardmembers.some((member) => member.user_id === userId) 
      ).sort((a, b) => a.position - b.position).map((card) => ({
        _id: card._id,
        position: card.position,
        title: card.title,
        description: card.description || "",
        isDeleted: card.isDeleted || false,
        date: {
          startDate: card.startDate ? card.startDate.toISOString() : null,
          dueDate: card.dueDate ? card.dueDate.toISOString() : null,
          dueTime: card.dueTime || null,
          completed: card.completed || false,
        },
        cover: {
          color: card.coverColor || null,
          isSizeOne: card.coverSizeOne || null,
        },
        labels: card.labels ? card.labels.map((label) => ({
          _id: label.id,
          text: label.text || "",
          color: label.color,
          backColor: label.backColor,
          selected: label.selected || false,
        })) : [],
        members: card.cardmembers ? card.cardmembers.map((member) => ({
          user: member.user ? member.user_id : null,
          name: member.user ? member.user.username : "",
          surname: member.user ? member.user.surname : "",
          email: member.user ? member.user.email : "",
          role: member.user ? member.user.userType : "",
          color: member.user ? member.user.color : "",
        })) : [],
        watchers: card.CardWatchers ? card.CardWatchers.map((watcher) => watcher.user_id) : [],
        attachments: card.attachments ? card.attachments.map((attachment) => ({
          _id: attachment.id,
          link: attachment.link,
          name: attachment.name,
          date: attachment.date
        })) : [],
        activities: card.activities ? card.activities.map((activity) => ({
          userName: activity.userName,
          text: activity.text,
          isComment: activity.isComment,
          color: activity.color,
          _id: activity.id,
          date: activity.date ? activity.date.toISOString() : null,
        })) : [],
        checklists: card.checklists ? card.checklists.map((checklist) => ({
          _id: checklist.id,
          title: checklist.title,
          items: checklist.items.map((item) => ({
            _id: item.id,
            text: item.text,
            completed: item.completed,
          })),
        })) : [],
        owner: list._id,
      })) : [],
      owner: list.board_id,
      members: list.ListMembers.map((member) => ({
        user: member.user ? member.user_id : "",
        name: member.user ? member.user.username : "",
        surname: member.user ? member.user.surname : "",
        email: member.user ? member.user.email : "",
        role: member.role || "",
        color: member.user ? member.user.color : "",
        _id: member.user_id,
      })),
    }));
    return transformedLists;
  } catch (error) {
    console.error("Error fetching lists:", error.message);
    throw new Error("Error fetching lists: " + error.message);
  }
},
/**
   * 
   * Update a list's title
   */
  async getListById(listId, callback) {
    try {
        const list = await List.findOne({
            where: { _id: listId },
            include: [
                {
                    model: Card,
                    as: "cards",
                    include: [
                        {
                            model: CardLabels,
                            as: "labels",
                        },
                        {
                            model: CardMembers,
                            as: "cardmembers",
                            include: [
                                {
                                    model: User,
                                    as: "user",
                                    attributes: ["_id", "username", "email", "userType", "color"],
                                },
                            ],
                        },
                        {
                            model: CardWatchers,
                            as: "watchers",
                        },
                        {
                            model: CardAttachments,
                            as: "attachments",
                        },
                        {
                            model: CardActivities,
                            as: "activities",
                            attributes: ["userName", "text", "isComment", "color", "date"],
                        },
                        {
                            model: CardChecklists,
                            as: "checklists",
                        },
                    ],
                },
                {
                    model: ListMembers,
                    as: "ListMembers",
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["_id", "username", "email", "userType", "color"],
                        },
                    ],
                },
            ],
        });

        if (!list) {
            return callback({ message: "List not found" }, null);
        }
// 
        // Formatting ListMembers to match expected structure
        const formattedList = {
            ...list.toJSON(),
            ListMembers: list.ListMembers.map(member => ({
                list_id: member.list_id,
                user_id: member.user_id,
                role: member.role,
                name: member.name,
                surname: member.surname,
                email: member.email,
                color: member.color,
                createdAt: member.createdAt,
                updatedAt: member.updatedAt,
            })),
        };

        return callback(null, formattedList);
    } catch (error) {
        return callback({ message: "Error fetching list", details: error.message });
    }
},
  async updateListTitle(listId, newTitle, callback) {
    try {
      const list = await List.findByPk(listId);
      if (!list) return callback({ message: "List not found" });

      list.title = newTitle;
      await list.save();

      return callback(null, list);
    } catch (error) {
      return callback({ message: "Error updating title", details: error.message });
    }
  },

  /**
   * Delete a list by ID
   */
  async deleteListById(listId, callback) {
   
    try {
      const list = await List.findByPk(listId);
      if (!list) return callback({ message: "List not found" });

      await list.destroy();
      return callback(null, { message: "List deleted successfully" });
    } catch (error) {
      return callback({ message: "Error deleting list", details: error.message });
    }
  },

  
  async  updateCardOrder(boardId, sourceId, destinationId, destinationIndex, cardId, workspaceId, user, callback) {
    try {
      // Validate source and destination lists
      const [sourceList, destinationList] = await Promise.all([
        List.findByPk(sourceId, { include: [{ model: Card, as: "cards", order: [["position", "ASC"]] }] }),
        List.findByPk(destinationId, { include: [{ model: Card, as: "cards", order: [["position", "ASC"]] }] }),
      ]);
  
      if (!sourceList || !destinationList) {
        return callback({ errMessage: "List or board information is incorrect" });
      }
  
      // Validate if the card exists in the source list
      const card = await Card.findOne({ where: { id: cardId, list_id: sourceId } });
      if (!card) {
        return callback({ errMessage: "Card not found in source list" });
      }
  
      console.log("Before Moving - Source List:", sourceList.cards.map((c, index) => ({ id: c.dataValues._id, position: index })));
      console.log("Before Moving - Destination List:", destinationList.cards.map((c, index) => ({ id: c.dataValues._id, position: index })));
  
      // Case 1: Moving within the same list
      if (sourceId === destinationId) {
        // Find the index of the card to be moved
        const cardToMoveIndex = sourceList.cards.findIndex(c => c.dataValues._id === Number(cardId));
        if (cardToMoveIndex === -1) {
          return callback({ errMessage: "Card not found in source list" });
        }
  
        // Remove the card from its current position
        const [cardToMove] = sourceList.cards.splice(cardToMoveIndex, 1);
  
        // Insert it at the new position
        sourceList.cards.splice(destinationIndex, 0, cardToMove);
  
        // Update positions in DB
        await Promise.all(
          sourceList.cards.map((c, index) => 
            Card.update({ position: index }, { where: { id: c.dataValues._id } })
          )
        );
  
      } else {
        // Case 2: Moving to a different list
  
        // Remove the card from the source list
        const updatedSourceCards = sourceList.cards.filter((c) => c.dataValues._id !== Number(cardId));
  
        // Update positions of remaining cards in the source list
        await Promise.all(
          updatedSourceCards.map((c, index) =>
            Card.update({ position: index }, { where: { id: c.dataValues._id } })
          )
        );
  
        // Insert the card into the destination list at the specified position
        destinationList.cards.splice(destinationIndex, 0, { dataValues: { _id: cardId } });
  
        // Update the card's list_id and position in DB
        await Card.update({ list_id: destinationId, position: destinationIndex }, { where: { id: cardId } });
  
        // Reorder positions for all cards in the destination list
        await Promise.all(
          destinationList.cards.map((c, index) =>
            Card.update({ position: index }, { where: { id: c.dataValues._id } })
          )
        );
  
        // Log activity for moving to a different list
        await Activity.create({
          card_id: cardId,
          user_id: user._id,
          text: `moved this card from ${sourceList.title} to ${destinationList.title}`,
          color: user.color,
          date: new Date(),
        });
      }
  
      console.log("After Moving - Source List:", sourceList.cards.map((c, index) => ({ id: c.dataValues._id, position: index })));
      console.log("After Moving - Destination List:", destinationList.cards.map((c, index) => ({ id: c.dataValues._id, position: index })));
  
      return callback(null, { message: "Card order updated successfully" });
  
    } catch (error) {
      return callback({ errMessage: "Something went wrong", details: error.message });
    }
  },
  /**
   * Update list order inside a board
   */
  async updateListOrder(workspaceId, boardId, sourceIndex, destinationIndex, listId, callback){
    try {
        // Fetch the board with its associated lists
        const board = await Board.findOne({
            where: { id: boardId },
            include: [
                {
                    model: List,
                    as: "lists",
                },
            ],
        });

        if (!board || !board.lists.length) {
            return callback({ errMessage: "Board not found or no lists available" });
        }

        // Convert Sequelize results to a mutable array
        let lists = board.lists.map(list => list.toJSON());
        console.log("List",lists,"ListId",listId);
        // Validate that the list exists in the board
        const movingList = lists.find(list =>{ 
          console.log("listId",listId,"list",list._id)
      return list._id == listId});
        if (!movingList) {
            return callback({ errMessage: "List not found in the specified board" });
        }

        // Remove list from the source index
        lists.splice(sourceIndex, 1);
        // Insert list at the destination index
        lists.splice(destinationIndex, 0, movingList);

        // Update positions in the database
        const updatePromises = lists.map((list, index) =>
            List.update({ position: index }, { where: { _id: list.id } })
        );

        await Promise.all(updatePromises);
console.log(updatePromises,"...............")
        return callback(false, { message: "List order updated successfully" });
    } catch (error) {
        return callback({ errMessage: "Something went wrong", details: error.message });
    }
},

async addMembersToListService(listId, boardId, newMembers, user, callback) {
  try {
      // Fetch the list with its parent board and existing members
      const list = await List.findByPk(listId, {
          include: [
              {
                  model: Board,
                  as: "Board",
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
                  attributes: ["_id", "username", "email", "color"],
                  through: { attributes: ["role"] },
              },
          ],
      });

      if (!list) return callback({ errMessage: "List not found" });

      // ✅ Correct Board Validation
      if (list.dataValues.board_id != boardId) {
          return callback({ errMessage: "List does not belong to the provided board" });
      }

      const board = list.Board;
      if (!board) return callback({ errMessage: "Board not found" });

      console.log("Board members:", board.members);
      console.log("List members:", list.members);

      // Get existing list member IDs
      const existingListMemberIds = list.members.map((member) => member._id);

      // Get board member IDs (only they can be added)
      const boardMemberIds = board.members.map((member) => member._id);

      // Step 1: Fetch _id for new members using email
      const membersWithIds = await Promise.all(
          newMembers.map(async (member) => {
              const userRecord = await User.findOne({ where: { email: member.email } });
              return userRecord ? { ...member, _id: userRecord._id, name: userRecord.username } : null;
          })
      );

      // Step 2: Categorize members
      let addedMembers = [];
      let skippedMembers = [];

      for (const member of membersWithIds.filter(Boolean)) {
          if (!boardMemberIds.includes(member._id)) {
              skippedMembers.push({ email: member.email, reason: "Not a board member" });
          } else if (existingListMemberIds.includes(member._id)) {
              skippedMembers.push({ email: member.email, reason: "Already in list" });
          } else {
              addedMembers.push({
                  _id: member._id,
                  name: member.name,
                  email: member.email,
                  color: member.color || "",
                  role: member.role || "member",
              });

              // Add the member to the list
              await list.addMember(member._id, {
                  through: {
                      role: member.role || "member",
                      name: member.name || "",
                      email: member.email,
                      color: member.color || "",
                  },
              });
          }
      }

      // Get updated list members
      const allListMembers = await list.getMembers({
          attributes: ["_id", "username", "email", "color"],
          joinTableAttributes: ["role"],
      });

      const response = {
          message: "Members processed successfully",
          addedMembers,
          skippedMembers,
          allListMembers: allListMembers.map((m) => ({
              _id: m._id,
              name: m.username,
              email: m.email,
              color: m.color,
              role: m.ListMembers.role,
          })),
      };

      callback(null, response);
  } catch (error) {
      callback({ errMessage: "Something went wrong", details: error.message });
  }
}
,

/**
   * Remove a member from a list
   */
  async removeMemberFromList(listId, userId, callback) {
    try {
      const member = await ListMembers.findOne({
        where: { list_id: listId, user_id: userId },
      });

      if (!member) return callback({ message: "Member not found in list" });

      await member.destroy();
      return callback(null, { message: "Member removed from list" });
    } catch (error) {
      return callback({ message: "Error removing member", details: error.message });
    }
  },
 
  async removeMemberFromListService(listId, boardId, memberId, user, callback) {
    try {
        // Fetch the list along with its parent board and members
        const list = await List.findByPk(listId, {
            include: [
                {
                    model: Board,
                    as: "Board",
                    attributes: ["_id"],
                },
                {
                    model: User,
                    as: "members",
                    attributes: ["_id"],
                    through: { attributes: ["role"] },
                },
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
            ],
        });

        if (!list) return callback({ errMessage: "List not found" });
console.log(list.dataValues.board_id,"list.dataValues.board_id",boardId)
        // Ensure the list belongs to the specified board
        if (list.dataValues.board_id !== Number(boardId)) {
            return callback({ errMessage: "List does not belong to the provided board" });
        }

        // Check if the member exists in the list
        const existingMember = list.members.find((m) => m._id === Number(memberId));
        if (!existingMember) {
            return callback({ errMessage: "Member not found in this list" });
        }

        // Remove the member from the list
        await list.removeMember(memberId);

        // Remove the member from all cards under this list
        for (const card of list.cards) {
            const cardMember = card.members.find((m) => m._id === Number(memberId));
            if (cardMember) {
                await card.removeMember(memberId);
            }
        }

        // Fetch updated list members after deletion
        const updatedListMembers = await list.getMembers({
            attributes: ["_id", "username", "email", "color"],
            joinTableAttributes: ["role"],
        });

        const response = {
            message: "Member removed from list and associated cards",
            removedMemberId: memberId,
            remainingMembers: updatedListMembers.map((m) => ({
                _id: m._id,
                name: m.username,
                email: m.email,
                color: m.color,
                role: m.ListMembers.role,
            })),
        };

        callback(null, response);
    } catch (error) {
        callback({ errMessage: "Something went wrong", details: error.message });
    }
},

async deleteListService(workspaceId, boardId, listId, user){
  const transaction = await sequelize.transaction(); // Start transaction
  try {
    // Fetch the list with its child cards
    const list = await List.findByPk(listId, {
      include: [{
        model: Card, as: "cards", include: [
          { model: CardLabel, as: "labels" },
          { model: CardMembers, as: "cardmembers" },
          { model: CardActivities, as: "activities" },
          { model: Attachment, as: "attachments" },
          { model: Checklist, as: "checklists", include: [{ model: ChecklistItems, as: "items" }] }
        ]
      }],
      transaction
    });

    if (!list) {
      await transaction.rollback(); // Rollback before returning
      return { error: "List not found" };
    }

    // Extract all card IDs from the list
    const cardIds = list.cards.map((card) => card.id);

    if (cardIds.length > 0) {
      // Delete related data for all cards in the list sequentially
      await CardLabel.destroy({ where: { card_id: cardIds }, transaction });
      await CardMembers.destroy({ where: { card_id: cardIds }, transaction });
      await CardActivities.destroy({ where: { card_id: cardIds }, transaction });
      await Attachment.destroy({ where: { card_id: cardIds }, transaction });

      // Delete checklist items before checklists
      const checklistIds = list.cards.flatMap(card => card.checklists?.map(c => c.id) || []);
      if (checklistIds.length > 0) {
        await ChecklistItems.destroy({ where: { checklist_id: checklistIds }, transaction });
        await Checklist.destroy({ where: { id: checklistIds }, transaction });
      }

      // Finally, delete the cards
      await Card.destroy({ where: { list_id: listId }, transaction });
    }

    // Delete the list
    await list.destroy({ transaction });

    // Commit transaction
    await transaction.commit();

    return { success: true, message: "List and its child cards deleted successfully" };
  } catch (error) {
    if (transaction.finished !== "rollback") {
      await transaction.rollback(); // Only rollback if not already rolled back
    }
    console.error("Error deleting list:", error);
    return { error: "Something went wrong", details: error.message };
    }
  },
};

module.exports = listService;






