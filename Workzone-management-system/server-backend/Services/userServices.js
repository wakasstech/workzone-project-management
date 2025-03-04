const db = require('../modals/index');
const User=db.userModel
const workspaceModel=db.workspaceModel
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createRandomHexColor } = require('./helperMethods');
const auth = require('../Middlewares/auth');

const register = async (user) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL; // Get the admin email from the environment variable
  

    const newUser = {
      ...user,
      color: createRandomHexColor(),
      userType: user.email === adminEmail ? 'admin' : 'team Member', // Set userType based on email
    };

    console.log(newUser, "newUser");
    // Create user using Sequelize's create method
    const createdUser = await User.create(newUser);
    console.log(createdUser, "createdUser");

    return { message: "User created successfully!", user: createdUser.dataValues };
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      throw { errMessage: "Email already in use!", details: err };
    } else {
      console.log(err.message);
      throw err;
    }
  }
};

const login = async (email, callback) => {
  try {
    let user = await User.findOne({
      where: { email },
      include: [
        {
          model: workspaceModel,
          as: "ownedWorkspaces",
          attributes: ["_id", "name"], // Workspaces owned by the user
        },
        {
          model: workspaceModel,
          as: "workspaces", // Workspaces where the user is a member
          attributes: ["_id", "name"],
          through: { attributes: [] }, // Exclude pivot table attributes
        },
      ],
    });
    if (!user) {
      return callback({ errMessage: "Your email/password is wrong!" });
    }
    console.log(user,"user...............")
    // Combine owned and member workspaces
    const workspaces = [
      ...user.ownedWorkspaces.map((ws) => ({ _id: ws._id, name: ws.name })),
      ...user.workspaces.map((ws) => ({ _id: ws._id, name: ws.name })), 
    ];

console.log(user?.dataValues._id,".id")
console.log(user?.dataValues.username,"username")
console.log(user?.dataValues.email,"email")

console.log(user?.dataValues.userType,"type")
console.log(workspaces,"workspaces")
    // Format response (excluding password & version field)
    return callback(false, {
      _id: user?.dataValues._id,
      name: user?.dataValues.username,
      email: user?.dataValues.email,
      password: user?.dataValues.password,
    
      workspaces: workspaces, // Include all workspaces
      userType: user?.dataValues.userType,

    });

  } catch (err) {
    console.log(err.message)
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};


const getUser = async (_id, callback) => {
  try {
    let user = await User.findByPk( _id, {
      attributes: ["_id", "username","email","color", "userType"], // Select only required fields
      include: [
        {
          model: workspaceModel,
          as: "ownedWorkspaces", 
          attributes: ["id"], // Get only the workspace ID
        },
        {
          model: workspaceModel,
          as: "workspaces", // Workspaces where the user is a member
          attributes: ["id"],
          through: { attributes: [] }, // Exclude pivot table attributes
        },
      ],
    });

    if (!user) {
      return callback({ errMessage: "User not found!" });
    }

    // Extract only workspace IDs
    const workspaces = [
      ...user.ownedWorkspaces.map((ws) => ws._id),
      ...user.workspaces.map((ws) => ws._id),
    ];

    // Format the response as required
    const formattedUser = {
      _id: user.dataValues._id,
      name: user.username,
      surname: user.surname,
      email: user.email,
      color: user.color,
      workspaces: workspaces, // Workspace IDs array
      userType: user.userType,
    };

    callback(false, formattedUser);
  } catch (err) {
    console.log(err.message, "error");
    callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};


const getAllUser = async (callback) => {
  try {
    let users = await User.findAll({
      attributes: ["_id",  "username", "email", "color", "userType"], // Exclude password and other unnecessary fields
      include: [
        {
          model: workspaceModel,
          as: "ownedWorkspaces", 
          attributes: ["_id"], // Get only workspace ID
        },
        {
          model: workspaceModel,
          as: "workspaces", // Workspaces where the user is a member
          attributes: ["_id"],
          through: { attributes: [] }, // Exclude pivot table attributes
        },
      ],
    });

    if (!users || users.length === 0) {
      return callback({ errMessage: "Users not found!" });
    }

    // Map and format each user correctly
    const formattedUsers = users.map((user) => ({
      _id: user._id,
      name: user.username,
      surname: user.username,
      email: user.email,
      color: user.color,
      workspaces: [
        ...user.ownedWorkspaces.map((ws) => ws._id),
        ...user.workspaces.map((ws) => ws._id),
      ], // Workspace IDs array
      userType: user.userType,
    }));

    callback(false, formattedUsers);
  } catch (err) {
    callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};

// Get user by email
const getUserWithMail = async (email) => {
  try {
    let user = await User.findOne({ where: { email } });

    if (!user) {
      throw {
        errMessage: "There is no registered user with this e-mail.",
      };
    }
    

    console.log("Registered", user.dataValues);
    return user.dataValues;
  } catch (error) {
    throw {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

const updateUser = async (_id, updateData, callback) => {
  // 
  try {
    // Check if the user exists
    const existingUser = await User.findOne({ where: { _id } });

    if (!existingUser) {
      return callback({ errMessage: "User not found!" });
    }

    // If password is being updated, hash it before saving
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    // Update the user in the database
    const [affectedRows] = await User.update(updateData, { where: { _id } });
console.log(affectedRows,"affectedRows")
    if (affectedRows === 0) {
      return callback({ errMessage: "No changes were made to the user." });
    }

    // Fetch the updated user
    const updatedUser = await User.findOne({
      where: { _id },
      attributes: { exclude: ['password', '__v'] }, // Exclude sensitive fields
      raw: true
    });

    // Return the updated user through the callback
    return callback(null, updatedUser);
  } catch (err) {
    // Handle and pass errors to the callback
    console.error("Error updating user:", err);
    callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};

// Submit OTP and change password
const submitOtp = async (otp, newPassword, callback) => {
  try {
    const user = await User.findOne({ where: { otp } });

    if (!user) {
      return callback({ errMessage: 'OTP not found' });
    }

    if (user.otpUsed) {
      return callback({ errMessage: 'OTP already used' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.update(
      { otpUsed: true, password: hashedPassword },
      { where: { email: user.email, otpUsed: false } }
    );

    callback(false, { message: 'Password updated' });
  } catch (err) {
    callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};

module.exports = {
  register,
  login,
  getUser,
  getAllUser,
  getUserWithMail,
  updateUser,
  submitOtp,
};
