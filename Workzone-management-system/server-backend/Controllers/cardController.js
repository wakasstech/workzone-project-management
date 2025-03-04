const cardService = require('../Services/cardService'); // Import card service
const { Op } = require("sequelize");
const db = require("../modals/index.js");
const Workspace = db.workspaceModel;
const User = db.userModel;
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
// Controller function to handle the creation of a card
const create = async (req, res) => {
  try {
      console.log("In the create card route");

      // Extract parameters from request body
      const { workspaceId, title, listId, boardId } = req.body;
      const user = req.user;

      // Validate the inputs
      if (!(workspaceId && title && listId && boardId)) {
          return res.status(400).json({
              errMessage: "The create operation could not be completed because there is missing information",
          });
      }

      // Call the card service
      const result = await cardService.create(workspaceId, title, listId, boardId, user);

      // Check if the service returned an error
      if (result.errMessage) {
          return res.status(500).json(result);
      }

      // Return success response
      return res.status(201).json(result);
  } catch (error) {
      console.error("Error in createCard controller:", error);
      return res.status(500).json({ errMessage: "Internal Server Error", details: error.message });
  }
};

const getCard = async (req, res) => {
  try {
      const user = req.user;
      const { workspaceId, boardId, listId, cardId } = req.params;

      const result = await cardService.getCardService(workspaceId, cardId, listId, boardId, user);

      if (result.error) {
          return res.status(403).json({ message: result.error });
      }

      return res.status(200).json(result);
  } catch (error) {
      console.error("Error in getCard controller:", error);
      return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllCards = async (req, res) => {
	try {
		// Extract parameters from request
		const { workspaceId, boardId, listId } = req.params;
		const userId = req.user._id;

		// Check if user has access to the workspace
		const workspace = await Workspace.findOne({
			where: { id: workspaceId },
			include: [{ model: User, as: "members", where: { id: userId }, required: false }]
		});

		if (!workspace) {
			return res.status(400).json({ errMessage: "Workspace not found or you do not have access to it." });
		}

		// Call the service function
		const cards = await cardService.getAllCards(workspaceId, boardId, listId, userId);

		return res.status(200).json(cards);
	} catch (error) {
		return res.status(500).json({ errMessage: "Something went wrong", details: error.message });
	}
};
const update = async (req, res) => {
    try {
      const user = req.user;
      const { workspaceId, boardId, listId, cardId } = req.params;
      const updateData = req.body;
  
      // Check if request body is empty
      if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "Request body must not be empty." });
      }
  
      // Call the card service function
      const result = await cardService.updateCard(cardId, listId, boardId, workspaceId, user, updateData);
  
      return res.status(200).json({ message: "Card updated successfully", data: result });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  };
  const addComment = async (req, res) => {
	// Get params
	const user = req.user;
	const {  workspaceId,boardId, listId, cardId } = req.params;
	// Call the card service
	await cardService.addComment(cardId, listId, boardId, workspaceId, user, req.body, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};
const updateComment = async (req, res) => {
	// Get params
	const user = req.user;
	const {  workspaceId,boardId, listId, cardId, commentId } = req.params;
	// Call the card service
	await cardService.updateComment(cardId, listId, boardId, commentId, workspaceId, user, req.body, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};
const deleteComment = async (req, res) => {
	// Get params
	const user = req.user;
	const {  workspaceId,boardId, listId, cardId, commentId } = req.params;
	// Call the card service
	await cardService.deleteComment(cardId, listId, boardId, commentId, workspaceId, user, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};
const createLabel = async (req, res) => {
    const user = req.user;
    const { workspaceId, boardId, listId, cardId } = req.params;
    const label = req.body;

    await cardService.createLabel(cardId, listId, boardId, workspaceId, user, label, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(result);
    });
};

const updateLabel = async (req, res) => {
    const user = req.user;
    const { workspaceId, boardId, listId, cardId, labelId } = req.params;
    const label = req.body;

    await cardService.updateLabel(cardId, listId, boardId, labelId, user, workspaceId, label, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(result);
    });
};

const deleteLabel = async (req, res) => {
    const user = req.user;
    const { workspaceId, boardId, listId, cardId, labelId } = req.params;

    await cardService.deleteLabel(cardId, listId, boardId, labelId, workspaceId, user, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(result);
    });
};
const addMember = async (req, res) => {
	// Get params
	const user = req.user;
	const { workspaceId, boardId, listId, cardId } = req.params;
    if ( !(workspaceId&& boardId&& listId&& cardId)) {
        return res.status(400).json({ message: "Workspace ,board , list or  card  not found or you do not have access to it." });
    }
	// Call the card service
	await cardService.addMember(cardId, listId, boardId, workspaceId,user, req.body.memberId, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};
const deleteMember = async (req, res) => {
 
	// Get params
	const user = req.user;
	const { workspaceId,boardId, listId, cardId, memberId } = req.params;
	// Call the card service
	await cardService.deleteMember(cardId, listId, boardId,workspaceId, user, memberId, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};


const createChecklist = async (req, res) => {
    try {
        const user = req.user;
        const { workspaceId, boardId, listId, cardId } = req.params;
        const { title } = req.body;
        if ( !(workspaceId&& boardId&& listId&& cardId)) {
            return res.status(400).json({ message: "Workspace ,board , list or  card  not found or you do not have access to it." });
        }
        const result = await cardService.createChecklist(cardId, listId, boardId, workspaceId, user, title);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteChecklist = async (req, res) => {
    try {
        const user = req.user;
        const { workspaceId, boardId, listId, cardId, checklistId } = req.params;
        if ( !(workspaceId&& boardId&& listId&& cardId)) {
            return res.status(400).json({ message: "Workspace ,board , list or  card  not found or you do not have access to it." });
        }
        const result = await cardService.deleteChecklist(cardId, listId, boardId, checklistId, workspaceId, user);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const addChecklistItem = async (req, res) => {
    try {
        const user = req.user;
        const { workspaceId, boardId, listId, cardId, checklistId } = req.params;
        const { text, assignedTo } = req.body;
        if ( !(workspaceId&& boardId&& listId&& cardId&& checklistId)) {
            return res.status(400).json({ message: "Workspace ,board , list or  card  not found or you do not have access to it." });
        }
        const result = await cardService.addChecklistItem(cardId, listId, boardId, workspaceId, user, checklistId, text, assignedTo);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const setChecklistItemCompleted = async (req, res) => {
    try {
        const user = req.user;
        const { workspaceId, boardId, listId, cardId, checklistId, checklistItemId } = req.params;
        const { completed } = req.body;
        if ( !(workspaceId&& boardId&& listId&& cardId&& checklistId)) {
            return res.status(400).json({ message: "Workspace ,board , list or  card  not found or you do not have access to it." });
        }
        const result = await cardService.setChecklistItemCompleted(cardId, listId, boardId, workspaceId, user, checklistId, checklistItemId, completed);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const setChecklistItemText = async (req, res) => {
    try {
        const user = req.user;
        const { workspaceId, boardId, listId, cardId, checklistId, checklistItemId } = req.params;
        const { text , assignedTo} = req.body;
        if ( !(workspaceId&& boardId&& listId&& cardId&& checklistId&&checklistItemId)) {
            return res.status(400).json({ message: "Workspace ,board , list or  card  not found or you do not have access to it." });
        }
        const result = await cardService.setChecklistItemText(cardId, listId, boardId, workspaceId, user, checklistId, checklistItemId, text, assignedTo);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteChecklistItem = async (req, res) => {
    try {
        const user = req.user;
        const { workspaceId, boardId, listId, cardId, checklistId, checklistItemId } = req.params;
        if ( !(workspaceId&& boardId&& listId&& cardId&& checklistId&&checklistItemId)) {
            return res.status(400).json({ message: "Workspace ,board , list or  card  not found or you do not have access to it." });
        }
        const result = await cardService.deleteChecklistItem(cardId, listId, boardId, workspaceId, user, checklistId, checklistItemId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
const updateStartDueDates = async (req, res) => {
	try {
		const user = req.user;
		const { workspaceId, boardId, listId, cardId } = req.params;
		const { startDate, dueDate, dueTime } = req.body;

		const result = await cardService.updateStartDueDates(
			cardId, listId, boardId, workspaceId, user, startDate, dueDate, dueTime
		);

		return res.status(200).send(result);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const updateDateCompleted = async (req, res) => {
	try {
		const user = req.user;
		const { workspaceId, boardId, listId, cardId } = req.params;
		const { completed } = req.body;

		const result = await cardService.updateDateCompleted(
			cardId, listId, boardId, workspaceId, user, completed
		);

		return res.status(200).send(result);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const addAttachment = async (req, res) => {
	try {
		const user = req.user;
		const { workspaceId, boardId, listId, cardId } = req.params;
		const { link, name } = req.body;

		if (!link || !name) {
			return res.status(400).json({ error: 'Both link and name must be provided.' });
		}

		const result = await cardService.addAttachment(cardId, listId, boardId, workspaceId, user, link, name);

		return res.status(200).send(result);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const deleteAttachment = async (req, res) => {
	try {
		const user = req.user;
		const { workspaceId, boardId, listId, cardId, attachmentId } = req.params;

		const result = await cardService.deleteAttachment(cardId, listId, boardId, workspaceId, user, attachmentId);

		return res.status(200).send(result);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const updateAttachment = async (req, res) => {
	try {
		const user = req.user;
		const { workspaceId, boardId, listId, cardId, attachmentId } = req.params;
		const { link, name } = req.body;

		const result = await cardService.updateAttachment(cardId, listId, boardId, workspaceId, user, attachmentId, link, name);

		return res.status(200).send(result);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const removeMember = async (req, res) => {
    try {
        // Get parameters from request
        const user = req.user;
        const { workspaceId, boardId, listId, cardId, memberId } = req.params;

        if (!(workspaceId && boardId && listId && cardId && memberId)) {
            return res.status(400).json({ message: "Workspace, board, list, card, or member ID is missing." });
        }

        // Call the service function
        await cardService.removeMember(cardId, listId, boardId, workspaceId, user, memberId, (err, result) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send(result);
        });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", details: error.message });
    }
};

const deleteCard = async (req, res) => {
    try {
     
        const user = req.user;
        const { workspaceId, boardId, listId, cardId } = req.params;
        

        const result = await cardService.deleteCardService(workspaceId, cardId, listId, boardId, user);

        if (result.error) {
            return res.status(403).json({ message: result.error });
        }

        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.error("Error in deleteCard controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
module.exports = { create,getCard,getAllCards,update,addComment,updateComment,deleteComment,createLabel,updateLabel,deleteLabel, addMember, deleteMember,
    createChecklist, deleteChecklist, addChecklistItem, setChecklistItemCompleted, setChecklistItemText, deleteChecklistItem, 
    updateStartDueDates, updateDateCompleted, addAttachment, deleteAttachment, updateAttachment,
    removeMember, deleteCard
};
