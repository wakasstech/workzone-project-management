
const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = new Sequelize('trello_app', 'root', '', {
  host: 'localhost',
     dialect: 'mysql',
     logging: false,
     operationsAliases: false,
      pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 1000 }},
      {query:{raw:true}},
      );
 
  const  db={};
db.userModel =  require('./userModel')(sequelize,DataTypes,Op);
db.workspaceModel =  require('./workspaceModel')(sequelize,DataTypes,Op);
db.workspaceMembersModel =  require('./workspaceMembersModel')(sequelize,DataTypes,Op);
const boardModels =  require('./boardModel')(sequelize,DataTypes,Op);
db.Board=boardModels.Board; 
db.BoardMembers = boardModels.BoardMembers;
db.BoardActivity = boardModels.BoardActivity;
const listModels =  require('./listModel')(sequelize,DataTypes,Op);
db.List=listModels.List;
db.ListMembers = listModels.ListMembers;

const cardModels =  require('./cardModel')(sequelize,DataTypes,Op);
db.Card=cardModels.Card;
db.CardMembers = cardModels.CardMembers;
db.CardActivities = cardModels.CardActivities;
db.CardWatchers = cardModels.CardWatchers;
db.CardAttachments= cardModels.CardAttachments;
db.CardLabels = cardModels.CardLabels;
db.CardChecklists = cardModels.CardChecklists;
db.ChecklistItems = cardModels.ChecklistItems;

console.log(db,"db")
  db.Sequelize=Sequelize;
  db.sequelize=sequelize;
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      
      db[modelName].associate(db);
    }
  });
  try {
    db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  db.sequelize.sync({alter:true})
  .then(() => {
    console.log('Table .... are syncronized');
  })
  .catch((err) => {
    console.error('Error creating table:', err);
  });     
    module.exports = db;  