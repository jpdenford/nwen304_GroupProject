
function isAuthenicated(req, res, next) {
  if (!req.user) {
    res.status(403).json({success: false, error: "Requires authenication to complete this request"});
  } else {
    next();
  }
}

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
