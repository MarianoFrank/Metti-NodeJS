export const renderDashboard = (req, res) => {
  let messages = req.flash();

  if (req.query.msg && !messages.success) {
    messages.success = [req.query.msg];
  } else if (req.query.msg && messages.success) {
    messages.success.push(req.query.msg);
  }
  
  if (req.query.error && !messages.error) {
    messages.error = [req.query.error];
  } else if (req.query.error && messages.error) {
    messages.error.push(req.query.error);
  }


  res.render("admin/dashboard", {
    pageName: "dashboard",
    messages,
  });
};
