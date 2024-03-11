export const renderDashboard = (req, res) => {
  res.render("admin/dashboard", {
    pageName: "dashboard",
    messages: req.flash(),
  });

};
