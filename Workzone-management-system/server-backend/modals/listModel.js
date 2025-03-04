const { DataTypes, Sequelize } = require("sequelize");
module.exports = (sequelize) => {
  // Define List Model
  const List = sequelize.define(
    "List",
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
      position: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
 
  const ListMembers = sequelize.define(
    "ListMembers",
    {
    
      list_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Composite Primary Key
      },
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Composite Primary Key
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "member",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
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
  // Associations
  List.associate = (models) => {
    // A list belongs to a single board
    List.belongsTo(models.Board, {
      foreignKey: "board_id",
      as: "Board", // Alias for clarity
    });

    // A list can have multiple cards
    List.hasMany(models.Card, {
      foreignKey: "list_id",
      as: "cards",
    });

    // A list can have multiple members
    List.belongsToMany(models.userModel, {
      through: ListMembers,
      as: "members",
      foreignKey: "list_id",
      otherKey: "user_id",
    });
     // A list can have multiple checklists
  List.hasMany(ListMembers, {
    foreignKey: "list_id",
    as: "ListMembers",
  });
  };
  ListMembers.associate = (models) => {
    // ListMembers belongs to a List
    ListMembers.belongsTo(models.List, {
      foreignKey: "list_id",
      as: "list",
    });

    // ListMembers belongs to a User
    ListMembers.belongsTo(models.userModel, {
      foreignKey: "user_id",
      as: "user",
    });
  };
  return { List, ListMembers };
};
