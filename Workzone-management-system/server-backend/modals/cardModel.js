const { DataTypes, Sequelize } = require("sequelize");
module.exports = (sequelize) => {
 
const Card = sequelize.define(
    "Card",
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
      description: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dueTime: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reminder: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      position: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },

      cover: {
        type: DataTypes.JSON, // Use JSON to store structured data
        allowNull: true,      // Allow null values
        defaultValue: {       // Default value is an object
          color: null,
          isSizeOne: null,
        },
        get() {
          const rawValue = this.getDataValue("cover");
          return rawValue ? rawValue : { color: null, isSizeOne: null };
        },
        set(value) {
          this.setDataValue("cover", JSON.stringify(value));
        },
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
  
  module.exports = Card;
  

  // Card Members Model (Many-to-Many relationship)
  const CardMembers = sequelize.define(
    "CardMembers",
    {
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
  // Card Watchers Model (Many-to-Many relationship)
  const CardWatchers = sequelize.define(
    "CardWatchers",
    {},
    {
      timestamps: false,
      underscored: true,
    }
  );
  // Card Labels Model
  const CardLabels = sequelize.define(
    "CardLabels",
    {
      text: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      backColor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      selected: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      underscored: true,
    }
  );
  // Card Attachments Model
  const CardAttachments = sequelize.define(
    "CardAttachments",
    {
      link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
    },
    {
      timestamps: false,
      underscored: true,
    }
  );

  // Card Activities Model
  const CardActivities = sequelize.define(
    "CardActivities",
    {
      userName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
      isComment: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      underscored: true,
    }
  );

  // Card Checklists Model
  const CardChecklists = sequelize.define(
    "CardChecklists",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      underscored: true,
    }
  );
  const ChecklistItems = sequelize.define(
    "ChecklistItems",
    {
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      assignedTo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      underscored: true,
    }
  );
CardChecklists.hasMany(ChecklistItems, {
  foreignKey: "checklist_id",
  as: "items",
  });
  // Associations
  ChecklistItems.belongsTo(CardChecklists, {
    foreignKey: "checklist_id",
    as: "checklist",
  });
  // A card belongs to a single list (owner)
  Card.belongsTo(sequelize.models.List, {
    foreignKey: "list_id",
    as: "owner",
  });

  // A card can have multiple members
  Card.belongsToMany(sequelize.models.User, {
    through: CardMembers,
    as: "members",
    foreignKey: "card_id",
    otherKey: "user_id",
  });

  // A card can have multiple watchers
  Card.belongsToMany(sequelize.models.User, {
    through: CardWatchers,
    as: "watchers",
    foreignKey: "card_id",
    otherKey: "user_id",
  });
    // A card can have multiple labels
    Card.hasMany(CardWatchers, {
      foreignKey: "card_id",
      as: "CardWatchers",
    });

  // A card can have multiple labels
  Card.hasMany(CardLabels, {
    foreignKey: "card_id",
    as: "labels",
  });

  // A card can have multiple attachments
  Card.hasMany(CardAttachments, {
    foreignKey: "card_id",
    as: "attachments",
  });

  // A card can have multiple activities
  Card.hasMany(CardActivities, {
    foreignKey: "card_id",
    as: "activities",
  });

  // A card can have multiple checklists
  Card.hasMany(CardChecklists, {
    foreignKey: "card_id",
    as: "checklists",
  });
   // A card can have multiple checklists
   Card.hasMany(CardMembers, {
    foreignKey: "card_id",
    as: "cardmembers",
  });

  // Card Members Associations
  CardMembers.belongsTo(sequelize.models.Card, {
    foreignKey: "card_id",
    as: "card",
  });
  CardMembers.belongsTo(sequelize.models.User, {
    foreignKey: "user_id",
    as: "user",
  });

  // Card Watchers Associations
  CardWatchers.belongsTo(Card, {
    foreignKey: "card_id",
    as: "card",
  });
  CardWatchers.belongsTo(sequelize.models.User, {
    foreignKey: "user_id",
    as: "user",
  });

  // Card Labels Associations
  CardLabels.belongsTo(Card, {
    foreignKey: "card_id",
    as: "card",
  });

  // Card Attachments Associations
  CardAttachments.belongsTo(Card, {
    foreignKey: "card_id",
    as: "card",
  });

  // Card Activities Associations
  CardActivities.belongsTo(Card, {
    foreignKey: "card_id",
    as: "card",
  });

  // Card Checklists Associations
  CardChecklists.belongsTo(Card, {
    foreignKey: "card_id",
    as: "card",
  });

  return {
    Card,
    CardMembers,
    CardWatchers,
    CardLabels,
    CardAttachments,
    CardActivities,
    CardChecklists,
    ChecklistItems
  };
};
