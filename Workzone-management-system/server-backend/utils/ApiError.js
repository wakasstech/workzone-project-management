// class ApiError extends Error {
//     constructor(
//         statusCode,
//         message= "Something went wrong",
//         errors = [],
//         stack = ""
//     ){
//         console.log(statusCode,"statusCode")
//         console.log(message,"messGE")
//         super(message)
//         this.statusCode = statusCode
//         this.data = null
//         this.message = message
//         this.success = false;
//         this.errors = errors

//         if (stack) {
//             this.stack = stack
//         } else{
//             Error.captureStackTrace(this, this.constructor)
//         }

//     }
// }
// module.exports= {ApiError}
 // Ensure i18n is included for multi-language support
class ApiError extends Error {
  constructor(
    statusCode,
    messageKey = "unexpected_error", // Default to a message key instead of hardcoded text
    errors = [],
    stack = ""
  ) {
    const localizedMessage = i18n.__(`${messageKey}`); // Fetch localized message
    super(localizedMessage); // Set the error message
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
    console.log("ApiError Details:", { statusCode, localizedMessage, errors }); // Debugging output
  }
}
module.exports = { ApiError };