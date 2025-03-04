const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const WorkspaceMembers = sequelize.define(
    "WorkspaceMembers",
    {
      role: {
        type: DataTypes.STRING,
        defaultValue: "member",
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      name: {
        type: DataTypes.STRING,
      },
      surname: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      color: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
  return WorkspaceMembers;
};
