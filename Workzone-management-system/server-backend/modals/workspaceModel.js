
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Workspace = sequelize.define(
    "Workspace",
    {
      _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
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

  Workspace.associate = (models) => {
    // **One-to-Many**: Workspace has one Owner
    Workspace.belongsTo(models.userModel, {
      foreignKey: "owner",
      as: "ownerBy",
    });
    // **Many-to-Many**: Workspaces have multiple Members
    Workspace.belongsToMany(models.userModel, {
      through: models.workspaceMembersModel, // Junction table
      as: "members",
      foreignKey: "workspaceId",
      otherKey: "userId",
    });
    Workspace.hasMany(models.Board, {
      foreignKey: "workspaceId",
      as: "boards",
    })
  };

  return Workspace;
};
