const listService = require("../Services/listService");
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
const listController = {
 
    async create(req, res) {
      try {
        const { workspaceId } = req.params;
        const { title, boardId } = req.body;
        const userId = req.user._id; // Authenticated user ID
  console.log(req.user,"pakistan user")
        // Validate input
        if (!title || !boardId) {
          return res.status(400).json({ errMessage: "Title and Board ID are required" });
        }
  console.log(workspaceId,"workspaceId")
        // Fetch user along with their workspaces
        console.log(userId,"userId")
        const user = await User.findByPk(userId, {
          include: {
            model: Workspace,
            as: "workspaces", // Ensure this matches your Sequelize association alias
            where: { _id: workspaceId },
          },
        });
  
        // If user does not have access to the workspace, return error
        if (!user || !user.workspaces.length) {
          return res.status(403).json({ errMessage: "Workspace not found or you do not have access." });
        }
        // Call the service to create the list
        listService.createList({ title, board_id: boardId }, user, (err, result) => {
          if (err) {
            return res.status(500).json(err);
          }
          return res.status(201).json(result);
        });
      } catch (error) {
        return res.status(500).json({ errMessage: "Internal server error", details: error.message });
      }
    },

  
async getAll(req, res) {
  try {
    const { boardId } = req.params;
    const userId = req.user._id; // Assuming req.user exists from authentication middleware
    const lists = await listService.getListsByBoard(boardId, userId);

    return res.status(200).json(lists);
  } catch (error) {
    return res.status(500).json({ errMessage: "Internal server error", details: error.message });
  }
},
  async getById(req, res) {
    try {
        const { listId } = req.params;

        listService.getListById(listId, (err, list) => {
            if (err) {
                return res.status(400).json(err); // Return error if any
            }
            return res.status(200).json(list); // Return the fetched list
        });
    } catch (error) {
        return res.status(500).json({ 
            errMessage: "Internal server error", 
            details: error.message 
        });
    }
}
,
  /**
   * Update list title
   */
  async updateListTitle(req, res) {
    try {
      const { listId } = req.params;
      const { title } = req.body;

      listService.updateListTitle(listId, title, (err, result) => {
        if (err) return res.status(400).json(err);
        return res.status(200).json(result);
      });
    } catch (error) {
      return res.status(500).json({ errMessage: "Internal server error", details: error.message });
    }
  },

  /**
   * Delete a list by ID
   */
  async deleteById(req, res) {
    try {
      const { listId } = req.params;

      listService.deleteListById(listId, (err, result) => {
        if (err) return res.status(400).json(err);
        return res.status(200).json(result);
      });
    } catch (error) {
      return res.status(500).json({ errMessage: "Internal server error", details: error.message });
    }
  },

  
  async updateListOrder (req, res) {
    // Destructure the request payload
    const { workspaceId, boardId, sourceIndex, destinationIndex, listId } = req.body;
    const user = req.user;

    console.log("Updating list order:", workspaceId, boardId, sourceIndex, destinationIndex, listId);

    const Validuser = await User.findByPk(user.id, {
      include: {
        model: Workspace,
        as: "workspaces", // Ensure this matches your Sequelize association alias
        where: { id: workspaceId },
      },
    });

    // If user does not have access to the workspace, return error
    if (!Validuser || !Validuser.workspaces.length) {
      return res.status(403).json({ errMessage: "Workspace not found or you do not have access." });
    }
    // Call the service function
    await listService.updateListOrder(workspaceId, boardId, sourceIndex, destinationIndex, listId, (err, result) => {
        if (err) return res.status(500).send(err);
        console.log(result,"result")
        return res.status(200).send(result);
    });
},

  async addMemberToList(req, res) {
    try {
        const { listId ,boardId} = req.params;
        const { members } = req.body;

        if (!listId || !Array.isArray(members) || members.length === 0) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        listService.addMembersToListService(listId,boardId, members, req.user, (err, result) => {
            if (err) return res.status(400).json(err);
            return res.status(200).json(result);
        });

    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
},
  /**
   * Remove a member from a list
   */
  async deleteMemberFromList(req, res) {
    try {
      const { listId, userId } = req.params;

      listService.removeMemberFromList(listId, userId, (err, result) => {
        if (err) return res.status(400).json(err);
        return res.status(200).json(result);
      });
    } catch (error) {
      return res.status(500).json({ errMessage: "Internal server error", details: error.message });
    }
  },

  async updateCardOrder(req, res){
    try {
      const { workspaceId, boardId, sourceId, destinationId, destinationIndex, cardId } = req.body;
      const user = req.user;
  
      if (!boardId || !sourceId || !destinationId || !cardId) {
        return res.status(400).json({ errMessage: "All parameters not provided" });
      }
  
      // Call the service function to handle order update
      await listService.updateCardOrder(boardId, sourceId, destinationId, destinationIndex, cardId, workspaceId, user, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(result);
      });
  
    } catch (error) {
      return res.status(500).json({ errMessage: "Internal server error", details: error.message });
    }
  },


  async removeMemberFromList(req, res) {
    try {
        const { listId, boardId } = req.params;
const { memberId } = req.body;
        if (!listId || !boardId || !memberId) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        listService.removeMemberFromListService(listId, boardId, memberId, req.user, (err, result) => {
            if (err) return res.status(400).json(err);
            return res.status(200).json(result);
        });

    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
},

async deleteList(req, res){
  try {
  
    const user = req.user;
    const { workspaceId, boardId, listId } = req.params;

    const result = await listService.deleteListService(workspaceId, boardId, listId, user);

    if (result.error) {
      return res.status(403).json({ message: result.error });
    }

    return res.status(200).json({ message: "List and its cards deleted successfully" });
  } catch (error) {
    console.error("Error in deleteList controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}



};



module.exports = listController;
