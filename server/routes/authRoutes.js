const passport = require("passport");

module.exports = (app) => {
   // Route handler that will attempt to authenticate the user who is coming in on this route with google
   app.get(
      "/auth/google",
      passport.authenticate("google", {
         // The scope will inform to Google which access we want from it: the profile and the email in this case
         scope: ["profile", "email"],
      })
   );

   // Route handler for the callback of the authentication side
   app.get("/auth/google/callback", passport.authenticate("google"), (req, res) => {
      res.redirect("/surveys");
   });

   // Route handler which is going to logout the user
   app.get("/api/logout", (req, res) => {
      // Passport attaches a couple of functions to the request objets, such as the logout
      // req.logout will take the cookie that contains the user ID and it kills the ID that's in there
      req.logout();
      res.redirect("/");
   });

   // This route will show the client their user id
   app.get("/api/current_user", (req, res) => {
      res.send(req.user);
   });
};
