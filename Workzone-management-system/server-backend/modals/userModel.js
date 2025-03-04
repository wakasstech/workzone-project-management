
const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
        username: {
        type: DataTypes.STRING,
      },
      userType: {
        type: DataTypes.ENUM("team member", "HR", "admin", "manager", "SQA", "user"),
        defaultValue: "team member",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profilePic: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      color: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
  User.associate = (models) => {
    // **One-to-Many**: User (owner) → Workspaces
    User.hasMany(models.workspaceModel, {
      foreignKey: "ownerId",
      as: "ownedWorkspaces",
    });
    // **Many-to-Many**: User ↔ Workspaces (as members)
    User.belongsToMany(models.workspaceModel, {
      through: models.workspaceMembersModel, // Junction table
      as: "workspaces",
      foreignKey: "userId",
      otherKey: "workspaceId",
    });
  };

  return User;
};
