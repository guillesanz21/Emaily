const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const keys = require("./config/keys");

const app = express();

passport.use(
   new GoogleStrategy(
      // This argument will ask Google for an user code that will identify the user to Google
      {
         clientID: keys.googleClientID, // API Client ID for Google oauth
         clientSecret: keys.googleClientSecret, // API Client Secret for Google oauth
         callbackURL: "/auth/google/callback", // path of our page that will use Google to provide the user code
      },
      // When Google redirect to localhost:5000/auth/google/callback, Google will exchange the code user for the
      // profile of the user and an access token
      // The acess token allow us to do something on the user's behalf. It simply give us access to do certain things
      // The refresh token update the access token when it has expired
      (accessToken, refreshToken, profile, done) => {
         console.log(accessToken);
      }
   )
);

// Route handler that will attempt to authenticate the user who is coming in on this route with google
app.get(
   "/auth/google",
   passport.authenticate("google", {
      // The scope will inform to Google which access we want from it: the profile and the email in this case
      scope: ["profile", "email"],
   })
);

// Route handler for the callback of the authentication side
app.get("/auth/google/callback", passport.authenticate("google"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log("App listening on port 5000!!");
});
