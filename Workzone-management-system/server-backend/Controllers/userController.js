const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const db = require("../modals/index"); // Sequelize User model
const  User=db.userModel
const auth = require("../Middlewares/auth");
const userService = require("../Services/userServices");
const { request } = require("express");


const register = async (req, res) => {
  const { username, email, password } = req.body;
  // Validate request body
  if (!(username && email && password)) {
    return res.status(400).send({ errMessage: "Please fill all required areas!" });
  }
  const user =await User.findOne({where:{email}})
if(user){
  return res.status(409).send({ errMessage: "Email already exists" });
}
  // Hash the password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  req.body.password = hashedPassword;
  try {
    console.log(username, "->", email, "->", password);
    const result = await userService.register(req.body); // Call the service function
    console.log(result)
    

    return res.status(201).send(result); // Send success response
  } catch (err) {
    return res.status(400).send(err); // Send error response
  }
};
const registerViaInvite = async (req, res) => {
  const token = req.query.token;
  const invitationToken = jwt.decode(token);
  const { email, username, password } = req.body;
  const Invited_Email = invitationToken.id;

  if (Invited_Email === email) {
    if (!(username  && email && password))
      return res.status(400).send({ errMessage: "Please fill all required areas!" });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    req.body.password = hashedPassword;

    try {
      const result = await userService.register(req.body);
      return res.status(201).send(result);
    } catch (err) {
      return res.status(400).send(err);
    }
  } else {
    return res.status(400).send({ errMessage: `Please enter the same email: ${Invited_Email} on which you were invited!` });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate request body
  if (!(email && password)) {
    return res.status(400).send({ errMessage: "Please fill all required areas!" });
  }

  userService.login(email, (err, user) => {
    if (err) {
      return res.status(400).send(err); // Handle the error from the service layer
    }

    // Compare the provided password with the stored hashed password
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({ errMessage: "Your email/password is wrong!" });
    }

    // Generate token and send success response

    const token = auth.generateToken(user._id, user.email);
    user.password = undefined; // Remove password from the response
    user.__v = undefined; // Remove version field from the response

    return res.status(200).send({
      message: "User login successful!",
      user: { ...user, token },
    });
  });
};


const getUser = async (req, res) => {
  console.log(".............",req.user,",,,,,,,ppppp")
  const userId = req.user._id; // Assume `req.user` is populated through authentication middleware

  userService.getUser(userId, (err, user) => {
    if (err) {
      // Handle the error returned from the service
      return res.status(404).send(err);
    }

    // Remove sensitive fields like password or version before sending the response
  
console.log(user,"user")
    return res.status(200).send(user); // Send the success response
  });
};

const getAllUser = async (req, res) => {
  userService.getAllUser((err, users) => {
    if (err) {
      // Handle the error returned from the service
      return res.status(404).send(err);
    }

    // Send the list of users as a response
    console.log(users,"users dataValues")
    return res.status(200).send(users);
  });
};

const getUserWithMail = async (req, res) => {
  const { email } = req.body;
  console.log(email)
  try {
    const result = await userService.getUserWithMail(email);
 // Format the result into the required structure
 const formattedResult = {
  user: result._id, 
  name: result.username,
  surname: result.surname,
  color: result.color,
  email: result.email,
};

// Send the formatted result
return res.status(200).send(formattedResult);
  } catch (err) {
    return res.status(404).send(err);
  }
};


const updateUser = async (req, res) => {
  const id = req.body._id;
  console.log(req.user.userType,".................")
  if (req.user.userType === "admin") {
 

    try {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      userService.updateUser(_id, req.body, (err, updatedUser) => {
        if (err) {
          return res.status(500).json(err); 
        }
        return res.status(200).json(updatedUser); 
      });
    } catch (err) {
      return res.status(500).json(err); 
    }
  } else {
    return res.status(401).json("Only admin can change this!");
  }
};

const sendotp = async (req, res) => {
  const _otp = Math.floor(100000 + Math.random() * 900000);
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return res.status(500).send({ message: 'User not found' });
  }
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.OUR_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: 'hafiznizaqatali@gmail.com',
    to: req.body.email,
    subject: "OTP",
    text: String(_otp),
  });

  if (info.messageId) {
    await User.update(
      { otp: _otp, otpUsed: false },
      { where: { email: req.body.email } }
    );
    return res.status(200).send({ message: 'OTP sent' });
  } else {
    return res.status(500).send({ message: 'Server error' });
  }
};
const submitotp = async (req, res) => {
  try {
    const user = await User.findOne({ where: { otp: req.body.otp } });

    if (!user) {
      return res.status(404).json({ message: 'OTP not found' });
    }
    if (user.otpUsed) {
      return res.status(400).json({ message: 'OTP already used' });
    }

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    await User.update(
      { otpUsed: true, password: req.body.password },
      { where: { email: user.email, otpUsed: false } }
    );

    return res.status(200).json({ message: 'Password updated' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const sendInvitation = async (req, res) => {
  try {
    const { email } = req.body;

   
    // Generate an invitation token
    const invitationToken = auth.generateTokenforInvited(email);
    const registrationLink = `http://localhost:3000/registerWithInvite?token=${invitationToken}`;
console.log(registrationLink,"registeration link...........")
    // Configure the email transporter
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.OUR_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send the email
    let info = await transporter.sendMail({
      from: '"Workspace Team" <' + process.env.OUR_EMAIL + '>',
      to: email,
      subject: "Invitation to Register",
      text: `Click on the following link to register: ${registrationLink}`,
      html: `<p>Click on the following link to register:</p>
             <a href="${registrationLink}">${registrationLink}</a>`,
    });
    // If email was sent successfully, update the user's invitation token
    if (info.messageId) {
      // await user.update({ invitationToken }); // Using `update` method on instance

      return res.status(200).json({ message: "Invitation sent successfully." });
    } else {
      return res.status(500).json({ message: "Failed to send email. Please try again later." });
    }
  } catch (error) {
    console.error("Error sending invitation:", error);
    return res.status(500).json({ message: "Server error", details: error.message });
  }
};

module.exports = {
  registerViaInvite,
  register,
  login,
  getUser,
  getAllUser,
  getUserWithMail,
  updateUser,
  sendotp,
  submitotp,
  sendInvitation
};
