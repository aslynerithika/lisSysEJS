function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
}

function isNotAuthenticated(req, res, next) {
  if (!req.session.user) {
    return next();
  }
  res.redirect("/");
}

function isLibrarian(req, res, next) {
  if (req.session.user && req.session.user.role === "l") {
    return next();
  }
  res.status(403).render("error", {
    message: "Access Denied",
    error: { status: 403, stack: "Only librarians can access this resource" },
  });
}

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  isLibrarian,
};
