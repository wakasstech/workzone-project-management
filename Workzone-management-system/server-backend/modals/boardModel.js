
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Board = sequelize.define(
    "Board",
    
    {
      _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isImage: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      backgroundImageLink: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );


 const BoardMembers = sequelize.define(
    "BoardMembers",
    {

      board_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Composite Primary Key
        allowNull:false
      },
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Composite Primary Key
        allowNull:false
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "member",
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
  const BoardActivity = sequelize.define(
    "BoardActivity",
    {
      
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      edited: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      cardTitle: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      actionType: {
        type: DataTypes.STRING,
        defaultValue: "action",
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  Board.associate = (models) => {
    // **Each Board belongs to a Workspace**
    Board.belongsTo(models.workspaceModel, {
      foreignKey: "workspace_id",
      as: "workspace",
    });

    // **Many-to-Many**: Boards have multiple Members
    Board.belongsToMany(models.userModel, {
      through: BoardMembers,
      as: "members",
      foreignKey: "board_id",
      otherKey: "user_id",
    });

    // **One-to-Many**: Board can track multiple Activities
    Board.hasMany(models.BoardActivity, {
      foreignKey: "board_id",
      as: "activities",
    });

    // **One-to-Many**: Board can have multiple Lists
    Board.hasMany(models.List, {
      foreignKey: "board_id",
      as: "lists",
    });
  };
  BoardActivity.associate = (models) => {
    // **Each Activity belongs to a Board**
    BoardActivity.belongsTo(models.Board, {
      foreignKey: "board_id",
      as: "board",
    });
    // **Each Activity is optionally tied to a User**
    BoardActivity.belongsTo(models.userModel, {
      foreignKey: "user_id",
      as: "user",
    });
  };
  return { Board, BoardMembers, BoardActivity };
};
