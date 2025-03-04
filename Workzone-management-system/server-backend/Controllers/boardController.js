const boardService = require('../Services/boardServices');
const db = require("../modals/index.js");
const Workspace = db.workspaceModel;
const User = db.userModel;
const WorkspaceMembers = db.workspaceMembersModel;
const Activity = db.BoardActivity;
const Board = db.Board;
const BoardMembers = db.listModel;
const List = db.BoardMembers;



// Create a new board

exports.create = async (req, res) => {
    try {
        const { title, backgroundImageLink, workspaceId } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!(title && backgroundImageLink && workspaceId)) {
            return res.status(400).json({ errMessage: "Title and image cannot be null" });
        }

       // Fetch user and their associated workspaces
    const user = await User.findByPk(userId, {
      include: {
        model: Workspace,
        as: "workspaces",
        attributes: ["_id"], // Only fetch workspace IDs for validation
      },
    });
    if (!user) {
      return res.status(404).send({ errMessage: "User not found" });
    }
    // Check if the user is part of the given workspace
    console.log(user.workspaces.map(workspace => workspace._id));

    const isMemberOfWorkspace = user.workspaces.some((workspace) => workspace._id === workspaceId);
    if (!isMemberOfWorkspace && user?.userType !== 'admin') {
      return res.status(403).send({
        errMessage: "You cannot create a board in this workspace as you are not a member.",
      });
    }

        // Create board using service function
        const board = await boardService.create({ title, backgroundImageLink, workspaceId, userId: user._id });

        return res.status(201).json(board);
    } catch (error) {
        console.error("Error creating board:", error);
        return res.status(500).json({ errMessage: "Internal Server Error", error: error.message });
    }
};





exports.getAllBoards = async (req, res) => {
  try {
    const userId = req.user._id;
    const workspaceId = req.params.workspaceId;

    const result = await boardService.getBoards(userId, workspaceId);
console.log("response result .......",result,"end of response result....")
    if (result.error) {
      return res.status(400).json(result.error);
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Server error", details: err.message });
  }
};


exports.getBoardById = async (req, res) => {
  try {
    const { boardId } = req.params; // Get board ID from request params
    const result = await boardService.getById(boardId);

    if (result.error) {
      return res.status(400).json(result.error);
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Server error", details: err.message });
  }
};

exports.getBoardActivities = async (req, res) => {
  try {
    const { workspaceId, boardId } = req.params;

    const result = await boardService.getActivityById(workspaceId, boardId);

    if (result.error) {
      return res.status(400).json(result.error);
    }

    return res.status(200).json(result.activities);
  } catch (err) {
    return res.status(500).json({ message: "Server error", details: err.message });
  }
};
exports.updateBoardTitle = async (req, res) => {
  try {
    const { workspaceId, boardId } = req.params;
    const { title } = req.body;
    const user = req.user;
    const result = await boardService.updateBoard({
      workspaceId,
      boardId,
      updates: { title },
      user,
      action: "updated the board title",
    });
    if (result.error) return res.status(400).json(result.error);

    return res.status(200).json(result.board);
  } catch (err) {
    return res.status(500).json({ message: "Server error", details: err.message });
  }
};

exports.updateBoardDescription = async (req, res) => {
  try {
    const { workspaceId, boardId } = req.params;
    const { description } = req.body;
    const user = req.user;
    const result = await boardService.updateBoard({
      workspaceId,
      boardId,
      updates: { description },
      user,
      action: "updated the board description",
    });
    if (result.error) return res.status(400).json(result.error);

    return res.status(200).json(result.board);
  } catch (err) {
    return res.status(500).json({ message: "Server error", details: err.message });
  }
};

exports.updateBoardBackground = async (req, res) => {
  try {
    const { workspaceId, boardId } = req.params;
    const { background, isImage } = req.body;
    const user = req.user;

    const result = await boardService.updateBoard({
      workspaceId,
      boardId,
      updates: { backgroundImageLink: background, isImage },
      user,
      action: "updated the board background",
    });

    if (result.error) return res.status(400).json(result.error);

    return res.status(200).json(result.board);
  } catch (err) {
    return res.status(500).json({ message: "Server error", details: err.message });
  }
};


exports.addMember = async (req, res) => {
  try {
      const { boardId } = req.params;
      const { members } = req.body; // Array of new members to be added
      const user = req.user; // Authenticated user

      if (!Array.isArray(members) || members.length === 0) {
          return res.status(400).json({ errMessage: "No members provided." });
      }
console.log("members",members,boardId);
      // Call service function
      await boardService.addMembersToBoard(boardId, members, user, (err, result) => {
          if (err) return res.status(400).json(err);
          console.log("result",result);
          return res.status(200).json(result);
      });

  } catch (error) {
      return res.status(500).json({ errMessage: "Internal server error", details: error.message });
  }
};


// Delete member from the board
exports.deleteMember = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const memberId = req.params.memberId;
    const user = req.user;
    const result = await boardService.deleteMember(boardId, memberId, user);
    if (result.error) {
      return res.status(400).json(result.error);
    }
    return res.status(200).json(result.board);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', details: err.message });
  }
};




exports.removeMemberFromBoard = async (req, res) => {
  try {
      const { boardId } = req.params;
const {memberId} = req.body;
console.log(memberId, 'memberidddddddddddddddddddd')
      if (!boardId || !memberId) {
          return res.status(400).json({ error: "Invalid input data " });
      }
      boardService.removeMemberFromBoard(boardId, memberId, req.user, (err, result) => {
          if (err) return res.status(400).json(err);
          return res.status(200).json(result);
      });

  } catch (error) {
      return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

exports.deleteBoard = async (req, res) => {
  try {
    const { boardId, workspaceId } = req.params;
    const user = req.user;
    
    const result = await boardService.deleteById(boardId, workspaceId, user);
    
    if (result.error) {
      return res.status(400).json(result.error);
    }
    
    return res.status(200).json(result.message);
  } catch (err) {
    return res.status(500).json({ message: "Server error", details: err.message });
  }
};
