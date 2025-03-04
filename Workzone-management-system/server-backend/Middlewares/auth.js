
const { ApiError } = require("../utils/ApiError.js");
const { asyncHandler}  = require("../utils/asyncHandler.js");
const jwt = require("jsonwebtoken");
const db = require('../modals/index.js');

const generateToken = (id,email) => {
  const token = jwt.sign({ id,email }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRE_TIME,
  });
  return token.toString();
};
const generateTokenforInvited = (id,email) => {
  const token = jwt.sign({ id,email }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRE_TIME,
  });
  return token.toString();
};

const User=db.userModel

const verifyJWT = async(req, res, next) => {
 

  try {
    if (!req.headers["authorization"])
      return res
        .status(401)
        .send({ errMessage: "Authorization token not found!" });
    const header = req.headers["authorization"];
    const token = header.split(" ")[1];
    await jwt.verify(token, process.env.JWT_SECRET, async(err, verifiedToken) => {
      if (err)
        return res
          .status(401)
          .send({ errMessage: "Authorization token invalid", details: err });
    
          const user = await User.findByPk(verifiedToken.id, { raw: true });
      
      req.user = user;
   
      next();
    });
  } catch (error) {
    return res
      .status(500)
      .send({
        errMesage: "Internal server error occured!",
        details: error.message,
      });
  }
};
const adminMiddleware = (req, res, next) => {
    // Assuming req.user is set after authentication and contains user roles
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Admins only can do this' });
    }
  };
  const checkPermission = (resource, action) => {
    return asyncHandler(async (req, res, next) => {
      try {
        const userRole = req.user.role; // Assuming user role is attached to req.user
        const role = await Role.findOne({ name: userRole }).populate('permissions');
        console.log(role,"Role")
        if (!role) {
          return next(new ApiError(401, 'Access Denied: Role not found'));
        }
        const hasPermission = role.permissions.some(permission => 
          permission.resource === resource && permission.actions.includes(action)
        );
        if (!hasPermission) {
          return next(new ApiError(403, 'Access Denied: You do not have the required permissions'));
        }
        next();
      } catch (error) {
        console.log("in the catch block also")
        next(new ApiError(500, error.message || 'Server Error'));
      }
    });
  };
const checkEnrollment = (rolesRequired) => {
  return asyncHandler(async (req, res, next) => {
    try {
      const userId = req.user._id; 
      const courseId = req.query.courseId; 
     
      const enrollment = await Enrollment.findOne({ user_id: userId, course_id: courseId });
      if (!enrollment) {
        return next(new ApiError(403, 'you are not enrolled in this course  so enroll your self first'));
      }
      if (!rolesRequired.includes(enrollment.role)) {
        return next(new ApiError(403, `You have need  to be one of the following roles to access this resource: ${rolesRequired.join(',')}`));
      }
      req.enrollment = enrollment;
      next();
    } catch (error) {
      next(new ApiError(500, error.message || 'Server Error'));
    }
  });
};

module.exports={
  verifyJWT,
  adminMiddleware,
  checkPermission,
  checkEnrollment,
  generateToken,
  generateTokenforInvited
}  