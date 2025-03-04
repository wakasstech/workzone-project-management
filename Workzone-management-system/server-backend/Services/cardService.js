const { Op, Sequelize } = require("sequelize");
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
const helperMethods = require('./helperMethods');
const CardLabel=db.CardLabels;
//const CardMember=db.CardMembers;
const CardWatcher=db.CardWatchers;
const Attachment=db.CardAttachments;
const Checklist=db.CardChecklists;
const CardMembers=db.CardMembers;
const CardActivities=db.CardActivities;

const create = async (workspaceId, title, listId, boardId, user) => {
    try {
        // Fetch List, Board, and Workspace
        const list = await List.findByPk(listId, {
          include: [
              {
                  model: ListMembers,
                  as: "ListMembers",
                  include: [
                      {
                          model: User,
                          as: "user",
                      },
                  ],
              },
          ],
      });
        const board = await Board.findByPk(boardId);
        const workspace = await Workspace.findByPk(workspaceId);
  
        if (!list || !board || !workspace) {
            return { errMessage: "List, Board, or Workspace not found" };
        }
  
        // Create a new card
        const newCard = await Card.create({
            title: title,
            list_id: listId,
        });
  
        // Create labels for the card from labelsSeed
        const createdLabels = await Promise.all(
            helperMethods.labelsSeed.map(async (label) => {
                return await CardLabel.create({
                    text: label.text,
                    color: label.color,
                    backColor: label.backColor,
                    selected: label.selected,
                    card_id: newCard.id,
                });
            })
        );
  
        // Add card activity
        const activity = await CardActivities.create({
            card_id: newCard._id,
            userName: user.username,
            text: `added this card to ${list.title}`,
            color: user.color,
            isComment: false,
            date: new Date(),
        });
  
        // Assign the card creator as an owner in CardMembers
        const cardMember = await CardMembers.create({
            card_id: newCard._id,
            user_id: user._id,
            name: user.username,
            surname: user.surname || "",
            email: user.email,
            color: user.color,
            role: "owner",
        });
  
        // Log the new card in board activity
        await BoardActivity.create({
            board_id: board.id,
            user_id: user.id,
            name: user.username,
            action: `added ${newCard.title} to this board`,
            color: user.color,
        });
  
     
     // / **Fetch all cards for this list including the newly created one**
      const allCards = await Card.findAll({
          where: { list_id: listId },
          include: [
              { model: CardLabel, as: "labels" },
              { 
                  model: CardMembers, 
                  as: "cardmembers", 
                  include: [{ model: User, as: "user" }]
              },
              { model: CardWatcher, as: "CardWatchers" },
              { model: Attachment, as: "attachments" },
              { model: CardActivities, as: "activities" },
              { model: Checklist, as: "checklists", include: [{ model: ChecklistItems, as: "items" }] }
          ],
          order: [["createdAt", "ASC"]], // Ensuring order by creation time
      });
       // Format response
       const formattedCards = allCards.map((card) => ({
          _id: card.dataValues._id,
          title: card.dataValues.title,
          description: card.dataValues.description || "",
          isDeleted: card.dataValues.isDeleted || false,
          date: {
              startDate: card.dataValues.startDate || null,
              dueDate: card.dataValues.dueDate || null,
              dueTime: card.dataValues.dueTime || null,
              completed: card.dataValues.completed || false
          },
          cover: { 
              color: card.dataValues.cover?.color || null, 
              isSizeOne: card.dataValues.cover?.isSizeOne || null 
          },
          labels: card.dataValues.labels.map((label) => ({
              _id: label.dataValues.id,
              text: label.dataValues.text || "",
              color: label.dataValues.color,
              backColor: label.dataValues.backColor,
              selected: label.dataValues.selected || false,
          })),
          members: card.dataValues.cardmembers 
              ? card.dataValues.cardmembers.map((member) => ({
                    user: member.dataValues.user ? member.dataValues.user_id : null,
                    name: member.dataValues.user ? member.dataValues.user.username : "",
                    surname: member.dataValues.user ? member.dataValues.user.surname : "",
                    email: member.dataValues.user ? member.dataValues.user.email : "",
                    role: member.dataValues.user ? member.dataValues.user.userType : "",
                    color: member.dataValues.user ? member.dataValues.user.color : "",
                }))
              : [],
          watchers: card.dataValues.CardWatchers.map((watcher) => watcher.dataValues.user_id),
          attachments: card.dataValues.attachments.map((attachment) => ({
              _id: attachment.dataValues.id,
              link: attachment.dataValues.link,
              name: attachment.dataValues.name,
                 date: attachment.dataValues.date,
          })),
          activities: card.dataValues.activities
              ? card.dataValues.activities.map((activity) => ({
                    _id: activity.dataValues.id,
                    userName: activity.dataValues.userName,
                    text: activity.dataValues.text,
                    isComment: activity.dataValues.isComment,
                    color: activity.dataValues.color,
                    date: activity.dataValues.date,
                }))
              : [],
          checklists: card.dataValues.checklists.map((checklist) => ({
              _id: checklist.dataValues.id,
              title: checklist.dataValues.title,
              items: checklist.dataValues.items.map((item) => ({
                  _id: item.dataValues.id,
                  text: item.dataValues.text,
                  completed: item.dataValues.completed,
              })),
          })),
          owner: listId,
      }));
  
      console.log(list,";;;;;;;;;;;;;;;;;;;;;;;;")
        return {
            _id: listId,
            title: list.title,
            cards: formattedCards, // Ensuring previous list cards are included
            owner: list.board_id,
          members: list.ListMembers.map((member) => ({
              user: member.user ? member.user.id : null,
              name: member.user ? member.user.username : "",
              email: member.user ? member.user.email : "",
              role: member.user ? member.user.userType : "",
              color: member.user ? member.user.color : "",
          })),
            
            __v: 2,
        };
  
    } catch (error) {
        console.error("Error in createCardService:", error);
        return { errMessage: "Something went wrong", details: error.message };
    }
  };

const getCardService = async (workspaceId, cardId, listId, boardId, user) => {
    try {
      // Fetch models using Sequelize
      const card = await Card.findByPk(cardId, {
        include: [
          { model: CardLabel, as: "labels" },
          { model: CardMembers, as: "cardmembers" },
          { model: CardActivities, as: "activities" },
          { model: Attachment, as: "attachments" },
          { 
            model: Checklist, 
            as: "checklists", 
            include: [{ model: ChecklistItems, as: "items" }] 
        }
        ],
      });
      const list = await List.findByPk(listId);
      const board = await Board.findByPk(boardId);
      const workspace = await Workspace.findByPk(workspaceId);
  
      if (!card || !list || !board || !workspace) {
        return { error: "Card, List, Board, or Workspace not found" };
      }
  
      // Construct labels array
      const labels = card.labels.map((label) => ({
        text: label.text || "",
        color: label.color,
        backColor: label.backColor,
        selected: label.selected,
        _id: label.id,
      }));
      // Construct members array
      const members = card.cardmembers.map((member) => ({
        user: member.user_id,
        name: member.name,
        surname: member.surname,
        email: member.email,
        role: member.role,
        color: member.color,
      }));

      // Construct activities array
      const activities = card.activities.map((activity) => ({
        userName: activity.userName,
        text: activity.text,
        isComment: activity.isComment,
        color: activity.color,
        _id: activity.id,
        date: activity.date.toISOString(),
      }));
  
       // Construct checklists array
       const checklists = card.checklists.map((checklist) => ({
        _id: checklist.id,
        title: checklist.title,
        items: checklist.items.map((item) => ({
            _id: item.id,
            text: item.text,
            assignedTo: item.assignedTo,
            completed: item.completed,
        })),
    }));
      // Construct attachments array
      const attachments = card.attachments.map((attachment) => ({
        _id: attachment.id,
        link: attachment.link,
        name: attachment.name,
        date:attachment.date
    }));
      // Build response object
      return {
        date: {
            startDate: card.startDate ? card.startDate.toISOString() : null,
            dueDate: card.dueDate ? card.dueDate.toISOString() : null,
            dueTime: card.dueTime || null,
            completed: card.completed || false,
        },
        cover: { color: null, isSizeOne: null },
        _id: card._id,
        title: card.title,
        description: card.description || "",
        isDeleted: false,
        labels,
        members,
        watchers: [], // Add watchers if implemented
        attachments, // Add attachments if implemented
        activities,
        checklists, // Add checklists if implemented
        owner: listId,
        __v: card.__v || 0,
        listTitle: list.title,
        listId: listId,
        boardId: boardId,
      };
    } catch (error) {
      console.error("Error fetching card:", error);
      return { error: "Something went wrong", details: error.message };
    }
  };

const updateCard = async (cardId, listId, boardId, workspaceId, user, updateData) => {
    try {
        console.log("Finding the card...");

        // Find the card in the database
        const card = await Card.findOne({
            where: { id: cardId, list_id: listId }
        });

        console.log("Card found:", card);

        if (!card) {
            throw new Error("Card not found");
        }

        // Update the card
        await card.update(updateData);

        // Fetch the updated card and convert it to a plain object
        const updatedCard = await Card.findOne({ 
            where: { id: cardId }, 
            raw: true 
        });
        
console.log(updatedCard,"updte")
        return updatedCard // ✅ Convert Sequelize model to plain JSON object
    } catch (error) {
        throw new Error(error.message);
    }
};


const addComment = async (cardId, listId, boardId, workspaceId, user, body, callback) => {
  try {
      // Fetch the card and board
      const card = await Card.findOne({ where: { id: cardId, list_id: listId } });
      const board = await Board.findOne({ where: { id: boardId, workspace_id: workspaceId } });

      if (!card) return callback({ errMessage: "Card not found" });
      if (!board) return callback({ errMessage: "Board not found" });

      // Add the new comment
      await CardActivities.create({
          card_id: card._id,
          user_id: user._id,
          userName: user.username,
          text: body.text,
          isComment: true,
          color: user.color,
          date: new Date(),
      });

      // Log activity in the board
      await BoardActivity.create({
          board_id: board._id,
          user_id: user.id,
          name: user.username,
          action: body.text,
          actionType: "comment",
          cardTitle: card.title,
          color: user.color,
      });

   
      const allComments = await CardActivities.findAll({
        where: { card_id: card._id, isComment: true }, // Filtering only comments
        attributes: ["id", "userName", "text", "isComment", "color", "date"], // Select only required fields
        order: [["date", "DESC"]], // Latest comments first
    });

      // Transform response to match your required format
      const formattedComments = allComments.map(comment => ({
          _id: comment.id,  // Fixing _id reference
          userName: comment.userName,
          text: comment.text,
          isComment: comment.isComment,
          color: comment.color,
          date: comment.date,
      }));

      return callback(null, {
          message: "Comment added successfully",
          comments: formattedComments, // Return all comments including the new one
      });

  } catch (error) {
      console.error("Error adding comment:", error);
      return callback({ errMessage: "Something went wrong", details: error.message });
  }
};
const updateComment = async (cardId, listId, boardId, commentId, workspaceId, user, body, callback) => {
    try {
        // Find comment
        const comment = await CardActivities.findOne({ 
            where: { id: commentId, card_id: cardId, isComment: true } 
        });

        if (!comment) {
            return callback({ errMessage: "Comment not found" });
        }

        // Check if the user owns the comment
        if (comment.userName !== user.username) {
            return callback({ errMessage: "You can only edit your own comments" });
        }

        // Update comment
        await comment.update({ text: body.text });

        // Log in board activity
        await BoardActivity.create({
            board_id: boardId,
            user_id: user.id,
            name: user.username,
            action: body.text,
            actionType: "comment",
            edited: true,
            color: user.color,
            cardTitle: comment.cardTitle
        });

        return callback(null, { message: "Success!" });
    } catch (error) {
        return callback({ errMessage: "Something went wrong", details: error.message });
    }
};const deleteComment = async (cardId, listId, boardId, commentId, workspaceId, user, callback) => {
    try {
        // Find comment
        const comment = await CardActivities.findOne({
            where: { id: commentId, card_id: cardId, isComment: true }
        });

        if (!comment) {
            return callback({ errMessage: "Comment not found" });
        }

        // Check if the user owns the comment
        if (comment.userName !== user.username) {
            return callback({ errMessage: "You can only delete your own comments" });
        }

        // Delete comment
        await comment.destroy();

        // Log in board activity
        await BoardActivity.create({
            board_id: boardId,
            user_id: user.id,
            name: user.name,
            action: `deleted their comment from ${cardId}`,
            color: user.color
        });

        return callback(null, { message: "Success!" });
    } catch (error) {
        return callback({ errMessage: "Something went wrong", details: error.message });
    }
};
const createLabel = async (cardId, listId, boardId, workspaceId, user, label, callback) => {
    try {
        // Find card, list, board, and workspace
        const card = await Card.findOne({ where: { id: cardId, list_id: listId } });
        const board = await Board.findOne({ where: { id: boardId } });
        const list = await Board.findOne({ where: { id: listId } });
        const workspace = await Workspace.findOne({ where: { id: workspaceId } });

        if (!card || !board || !workspace) {
            return callback({ errMessage: "Card, Board, or Workspace not found" });
        }

      
        // Add label
        const newLabel = await CardLabel.create({
            card_id: card.id,
            text: label.text,
            color: label.color,
            backColor: label.backColor,
            selected: true
        });

        // Return the created label ID
        return callback(null, { labelId: newLabel.id });
    } catch (error) {
        return callback({ errMessage: "Something went wrong", details: error.message });
    }
};
const updateLabel = async (cardId, listId, boardId, labelId, user, workspaceId, label, callback) => {
    try {
        // Find card, list, board, and workspace
        const card = await Card.findOne({ where: { id: cardId, list_id: listId } });
        const board = await Board.findOne({ where: { id: boardId } });
        const workspace = await Workspace.findOne({ where: { id: workspaceId } });
        const list = await Board.findOne({ where: { id: listId } });
        if (!card || !board || !workspace) {
            return callback({ errMessage: "Card, Board, or Workspace not found" });
        }

       
        // Update label
        const labelToUpdate = await CardLabel.findOne({ where: { id: labelId } });

        if (!labelToUpdate) {
            return callback({ errMessage: "Label not found" });
        }

        await labelToUpdate.update({
            text: label.text,
            color: label.color,
            backColor: label.backColor
        });

        return callback(null, { message: "Success!" });
    } catch (error) {
        return callback({ errMessage: "Something went wrong", details: error.message });
    }
};
const deleteLabel = async (cardId, listId, boardId, labelId, workspaceId, user, callback) => {
    try {
        // Find card, list, board, and workspace
        const card = await Card.findOne({ where: { id: cardId, list_id: listId } });
        const board = await Board.findOne({ where: { id: boardId } });
        const workspace = await Workspace.findOne({ where: { id: workspaceId } });
        const list = await Board.findOne({ where: { id: listId } });
        if (!card || !board || !workspace) {
            return callback({ errMessage: "Card, Board, or Workspace not found" });
        }

      
        // Delete label
        const labelToDelete = await CardLabel.findOne({ where: { id: labelId } });

        if (!labelToDelete) {
            return callback({ errMessage: "Label not found" });
        }

        await labelToDelete.destroy();

        return callback(null, { message: "Success!" });
    } catch (error) {
        return callback({ errMessage: "Something went wrong", details: error.message });
    }
};

const addMember = async (cardId, listId, boardId, workspaceId, user, memberId, callback) => {
  try {
    // Fetch records using Sequelize
    const card = await Card.findByPk(cardId);
    const list = await List.findByPk(listId);
    const board = await Board.findByPk(boardId);
    const workspace = await Workspace.findByPk(workspaceId);
    const member = await User.findByPk(memberId);

    if (!card || !list || !board || !workspace || !member) {
      return callback({ errMessage: "Invalid data provided" });
    }
    

    // Check if the member already exists in the card
    const existingMember = await CardMembers.findOne({ where: { card_id: cardId, user_id: memberId } });
    if (existingMember) {
      return callback({ errMessage: "Member already exists in this card" });
    }

    // Check if the member exists in the list
    const listMember = await ListMembers.findOne({ where: { list_id: listId, user_id: memberId } });
    if (!listMember) {
      return callback({
        errMessage: "To add a member to this card, the member should be added to the parent list as well",
      });
    }

    // Add member to the card
    await CardMembers.create({
      card_id: cardId,
      user_id: memberId,
      color: member.color,
      name: member.username,
      email: member.email,
      role: "member",
    });

    // Log activity in the board
    await BoardActivity.create({
      board_id: boardId,
      user_id: user._id,
      action: `added '${member.username}' to ${card.title}`,
      color: user.color,
    });

    return callback(false, { message: "success" });
  } catch (error) {
    return callback({ errMessage: "Something went wrong", details: error.message });
  }
};
const deleteMember = async (cardId, listId, boardId, workspaceId, user, memberId, callback) => {
  try {
    // Fetch records
    const card = await Card.findByPk(cardId);
    const list = await List.findByPk(listId);
    const board = await Board.findByPk(boardId);
    const workspace = await Workspace.findByPk(workspaceId);
    const member = await User.findByPk(memberId);

    if (!card || !list || !board || !workspace || !member) {
      return callback({ errMessage: "Invalid data provided" });
    }

   

    // Check if the member exists in the card
    const existingMember = await CardMembers.findOne({ where: { card_id: cardId, user_id: memberId } });
    if (!existingMember) {
      return callback({ errMessage: "Member not found in this card" });
    }

    // Remove member from the card
    await CardMembers.destroy({ where: { card_id: cardId, user_id: memberId } });

    // Log activity in the board
    const action =
      member.username === user.username
        ? `left ${card.title}`
        : `removed '${member.username}' from ${card.title}`;

    await BoardActivity.create({
      board_id: boardId,
      user_id: user._id,
      action: action,
      color: user.color,
    });

    return callback(false, { message: "success" });
  } catch (error) {
    return callback({ errMessage: "Something went wrong", details: error.message });
  }
};
const createChecklist = async (cardId, listId, boardId, workspaceId, user, title) => {
  

    const checklist = await Checklist.create({ title, card_id: cardId });

    await BoardActivity.create({
        board_id: boardId,
        user_id: user._id,
        action: `added '${title}' to a card`,
        color: user.color
    });

    return { checklistId: checklist.id };
};

const deleteChecklist = async (cardId, listId, boardId, checklistId, workspaceId, user) => {
  

    const checklist = await Checklist.findByPk(checklistId);
    if (!checklist) throw new Error("Checklist not found");

    await checklist.destroy();

    await BoardActivity.create({
        board_id: boardId,
        user_id: user._id,
        action: `removed '${checklist.title}' from a card`,
        color: user.color
    });

    return { message: "Checklist deleted successfully" };
};

const addChecklistItem = async (cardId, listId, boardId, workspaceId, user, checklistId, text, assignedTo) => {
 

    const checklistItem = await ChecklistItems.create({ text, assignedTo: assignedTo, checklist_id: checklistId, isCompleted: false });

    return { checklistItemId: checklistItem.id };
};

const setChecklistItemCompleted = async (cardId, listId, boardId, workspaceId, user, checklistId, checklistItemId, completed) => {
 

    const checklistItem = await ChecklistItems.findByPk(checklistItemId);
    if (!checklistItem) throw new Error("Checklist item not found");

    checklistItem.completed = completed;
    await checklistItem.save();
console.log(checklistItem,"............")
    return { message: "Checklist item updated successfully" };
};

const setChecklistItemText = async (cardId, listId, boardId, workspaceId, user, checklistId, checklistItemId, text, assignedTo) => {
  
   console.log(text, assignedTo, 'hereeeeeeee')
    const checklistItem = await ChecklistItems.findByPk(checklistItemId);
    if (!checklistItem) throw new Error("Checklist item not found");

    checklistItem.text = text;
    checklistItem.assignedTo = assignedTo;
    await checklistItem.save();

    return { message: "Checklist item text updated successfully" };
};

const deleteChecklistItem = async (cardId, listId, boardId, workspaceId, user, checklistId, checklistItemId) => {
  

    const checklistItem = await ChecklistItems.findByPk(checklistItemId);
    if (!checklistItem) throw new Error("Checklist item not found");

    await checklistItem.destroy();

    return { message: "Checklist item deleted successfully" };
};
const updateStartDueDates = async (cardId, listId, boardId, workspaceId, user, startDate, dueDate, dueTime) => {
	try {
		const card = await Card.findByPk(cardId);
		const list = await List.findByPk(listId);
		const board = await Board.findByPk(boardId);
		const workspace = await Workspace.findByPk(workspaceId);

		

		await card.update({ startDate, dueDate, dueTime, completed: dueDate === null ? false : card.completed });

		return { message: 'Success!' };
	} catch (error) {
		throw new Error(error.message);
	}
};

const updateDateCompleted = async (cardId, listId, boardId, workspaceId, user, completed) => {
	try {
		const card = await Card.findByPk(cardId);
		const board = await Board.findByPk(boardId);


		await card.update({ completed });

		await board.createActivity({
			userId: user._id,
			name: user.name,
			action: `marked the due date on ${card.title} ${completed ? 'complete' : 'incomplete'}`,
			color: user.color
		});

		return { message: 'Success!' };
	} catch (error) {
		throw new Error(error.message);
	}
};

const addAttachment = async (cardId, listId, boardId, workspaceId, user, link, name) => {
	try {
		const card = await Card.findByPk(cardId);
		const board = await Board.findByPk(boardId);

	
        console.log(".....................",user)
		const validLink = /^https?:\/\//.test(link) ? link : `http://${link}`;

		const newAttachment = await card.createAttachment({ link: validLink, name });

		await board.createActivity({
			userId: user._id,
			name: user.username,
			action: `attached ${validLink} to ${card.title}`,
			color: user.color
		});

		return { attachmentId: newAttachment.id };
	} catch (error) {
		throw new Error(error.message);
	}
};

const deleteAttachment = async (cardId, listId, boardId, workspaceId, user, attachmentId) => {
	try {
		const card = await Card.findByPk(cardId);
		const board = await Board.findByPk(boardId);
		const attachment = await card.getAttachments({ where: { id: attachmentId } });

		if (!attachment) {
			throw new Error('Attachment not found.');
		}


		await attachment.destroy();

		await board.createActivity({
			userId: user._id,
			name: user.name,
			action: `deleted the attachment from ${card.title}`,
			color: user.color
		});

		return { message: 'Success!' };
	} catch (error) {
		throw new Error(error.message);
	}
};

const updateAttachment = async (cardId, listId, boardId, workspaceId, user, attachmentId, link, name) => {
	try {
		const card = await Card.findByPk(cardId);
		const board = await Board.findByPk(boardId);
		const attachment = await card.getAttachments({ where: { id: attachmentId } });

		if (!attachment) {
			throw new Error('Attachment not found.');
		}

		

		await attachment.update({ link, name });

		return { message: 'Success!' };
	} catch (error) {
		throw new Error(error.message);
	}
};
const getAllCards = async (workspaceId, boardId, listId, userId) => {
	try {
		// Fetch the workspace, board, and list from MySQL
		const workspace = await Workspace.findByPk(workspaceId);
		const board = await Board.findByPk(boardId);
		const list = await List.findByPk(listId, {
			include: [{ model: Card, as: "cards" }]
		});

		if (!workspace || !board || !list) {
			throw new Error("Invalid workspace, board, or list");
		}
		// Check if user is the owner of the workspace
		const isOwner = workspace.owner === userId;

		// Get all card IDs from the list
		const cardIds = list.cards.map((card) => card._id);

		// Define filter for fetching cards
		let filter = { id: { [Op.in]: cardIds } };

		// If the user is not the owner, only show cards where the user is a member
		if (!isOwner) {
			filter["$cardmembers.user_id$"] = userId;
		}

		// Fetch cards from the database with filtering
		const cards = await Card.findAll({
			where: filter,
			include: [
				{
					model: CardMembers,
					as: "cardmembers",
					include: [{ model: User, as: "user", attributes: ["_id", "username", "email", "color"] }]
				},
				{
					model: CardLabel,
					as: "labels",
					attributes: ["id", "text", "color", "backColor", "selected"]
				},
				{
					model: CardWatcher,
					as: "CardWatchers",
					attributes: ["user_id"]
				},
				{
					model: Attachment,
					as: "attachments",
					attributes: ["id", "link", "name"]
				},
				{
					model: CardActivities,
					as: "activities",
					attributes: ["userName", "id", "text", "isComment", "color", "date"]
				},
				{
					model: Checklist,
					as: "checklists",
					include: [{ model: ChecklistItems, as: "items", attributes: ["id", "text", "completed", "assignedTo"] }]
				}
			],
			order: [["position", "ASC"]]
		});

		// ✅ Transform Sequelize response to match the exact JSON format
		const formattedCards = cards.map((card) => ({
			_id: card.dataValues._id, // MongoDB-style `_id`
			title: card.dataValues.title,
			description: card.dataValues.description,
			isDeleted: card.dataValues.isDeleted || false,
			date: { completed: card.dataValues.completed || false },
			cover: { color: card.dataValues.coverColor || null, isSizeOne: card.dataValues.isSizeOne || null },
			labels: card.dataValues.labels.map((label) => ({
				_id: label.id,
				text: label.text,
				color: label.color,
				backColor: label.backColor,
				selected: label.selected
			})),
			members: card.dataValues.cardmembers.map((member) => ({
				user: member.dataValues.user._id,
				name: member.dataValues.user.username,
				email: member.dataValues.user.email,
				color: member.dataValues.user.color
			})),
			watchers: card.dataValues.watchers?.map((watcher) => watcher.user_id),
			attachments: card.dataValues.attachments.map((attachment) => ({
				id: attachment.dataValues.id,
				link: attachment.dataValues.link,
				name: attachment.dataValues.name,
                date:attachment.dataValues.date
			})),
			activities: card.dataValues.activities.map((activity) => ({
				_id: activity.dataValues.id,
				userName: activity.dataValues.userName,
				text: activity.dataValues.text,
				isComment: activity.dataValues.isComment,
				color: activity.dataValues.color,
				date: activity.dataValues.date
			})),
			checklists: card.dataValues.checklists.map((checklist) => ({
				_id: checklist.dataValues.id,
				items: checklist.items.map((item) => ({
					id: item.dataValues.id,
					text: item.dataValues.text,
                    assignedTo: item.assignedTo,
					completed: item.dataValues.completed
				}))
			})),
			owner: card.dataValues.owner,
			__v: 1 // Mimic MongoDB versioning
		}));

		return formattedCards; // Final response
	} catch (error) {
		throw new Error(`Something went wrong: ${error.message}`);
	}
};


const removeMember = async (cardId, listId, boardId, workspaceId, user, memberId, callback) => {
    try {
        // Fetch records using Sequelize
        const card = await Card.findByPk(cardId);
        const list = await List.findByPk(listId);
        const board = await Board.findByPk(boardId);
        const workspace = await Workspace.findByPk(workspaceId);
        const member = await User.findByPk(memberId);

        if (!card || !list || !board || !workspace || !member) {
            return callback({ errMessage: "Invalid data provided" });
        }

        // Check if the member exists in the card
        const existingMember = await CardMembers.findOne({ where: { card_id: cardId, user_id: memberId } });
        if (!existingMember) {
            return callback({ errMessage: "Member not found in this card" });
        }

        // Remove member from the card
        await CardMembers.destroy({ where: { card_id: cardId, user_id: memberId } });

        // Log activity in the board
        await BoardActivity.create({
            board_id: boardId,
            user_id: user.id,
            action: `removed '${member.username}' from ${card.title}`,
            color: user.color,
        });

        return callback(false, { message: "Member removed successfully" });
    } catch (error) {
        return callback({ errMessage: "Something went wrong", details: error.message });
    }
};
const deleteCardService = async (workspaceId, cardId, listId, boardId, user) => {
    try {
        // Fetch the card with all related data
        const card = await Card.findByPk(cardId, {
            include: [
                { model: CardLabel, as: "labels" },
                { model: CardMembers, as: "cardmembers" },
                { model: CardActivities, as: "activities" },
                { model: Attachment, as: "attachments" },
                { model: Checklist, as: "checklists", include: [{ model: ChecklistItems, as: "items" }] }
            ],
        });

        if (!card) {
            return { error: "Card not found" };
        }

        // Delete related entities
        await Promise.all([
            CardLabel.destroy({ where: { card_id:cardId } }),
            CardMembers.destroy({ where: { card_id:cardId } }),
            CardActivities.destroy({ where: { card_id:cardId } }),
            Attachment.destroy({ where: { card_id:cardId } }),
            ChecklistItems.destroy({ where: { checklist_id: card.checklists.map(c => c.id) } }),
            Checklist.destroy({ where: { card_id:cardId } })
        ]);
 
        // Finally, delete the card
        await card.destroy();

        return { success: true, message: "Card deleted successfully" };
    } catch (error) {
        console.error("Error deleting card:", error);
        return { error: "Something went wrong", details: error.message };
    }
};

module.exports = { create,getCardService,updateCard,addComment,updateComment ,deleteComment,createLabel,updateLabel,deleteLabel, addMember,deleteMember,
    createChecklist, deleteChecklist, addChecklistItem, setChecklistItemCompleted, setChecklistItemText, deleteChecklistItem, 
    updateStartDueDates, updateDateCompleted, addAttachment, deleteAttachment, updateAttachment, getAllCards,
    removeMember, deleteCardService
 };
