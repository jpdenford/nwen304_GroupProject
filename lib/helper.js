// Helper made with the assumption of the existance of req.user implies logged in

/// Middleware to response with 403 when user is not logged in
/// To be used for protected API call such as creating or editing
function isAuthenicated(req, res, next) {
  if (!req.user) {
    res.status(403).json({success: false, error: "Requires authenication to complete this request"});
  } else {
    next();
  }
}

/// Middleware to response with 403 + failure response when user is not logged in or not an admin
/// To be used for protected API call such as creating or editing
function isAuthenicatedAdmin(req, res, next) {
  if (!req.user) {
    res.status(403).json({success: false, error: "Requires authenication to complete this request"});
  } else if (!req.user.is_admin) {
    res.status(403).json({success: false, error: "Not authroised to complete this request"});
  } else {
    next();
  }
}

module.exports = {
  isAuthenicated: isAuthenicated,
  isAuthenicatedAdmin: isAuthenicatedAdmin
}
