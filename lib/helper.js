// Helper made with the assumption of the existance of req.user implies logged in

/// Middleware that will redirect the user to `path`  if not logged in
/// simple redirect to path if you are not logged in
function authedOrRedirect(path) {
  return function(req, res, next) {
    if (!req.user) {
      res.redirect(path);
    } else {
      next();
    }
  }
}

/// Middleware that will redirect the user to the login page if not logged in
/// short cut for authedOrRedirect('/user/login')
var authedOrLogin = authedOrRedirect('/users/login');

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

// Function to check if
function isTimedOut(req, res, next) {
  if (!req.user) {
    next();
    return;
  }

  var lastaction = req.user.lastaction;
  var now = new Date();
  var elapsed = now.getTime() - lastaction.getTime();

  // timeout after 5mins
  var max = 1000 * 60 * 5;

  if (elapsed <= max) {
    req.user.lastaction = lastaction;
    next();
  } else {
    req.logout();
    next();
  }
}


module.exports = {
  isAuthenicated: isAuthenicated,
  isAuthenicatedAdmin: isAuthenicatedAdmin,
  isTimedOut: isTimedOut,
  authedOrRedirect: authedOrRedirect,
  authedOrLogin: authedOrLogin
}
