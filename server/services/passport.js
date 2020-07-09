const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");

const keys = require("../config/keys");

// This will pull the model out of mongoose
const User = mongoose.model("users");

// The user argument is the user we extracted from the bbdd in the callback of the GoogleStrategy,
// wich had the function: done(null, user)
passport.serializeUser((user, done) => {
   // user.id is not the profile ID, but the ID of the user in the database
   // We provide the ID of the database because we could have a few ways of authentication per user: Google, Facebook,
   // email and password, etc. Thus, we have one ID per way of authentication, so we use the ID of the user in the
   // database since this is unique.
   done(null, user.id);
});

passport.deserializeUser((id, done) => {
   User.findById(id).then((user) => {
      done(null, user);
   });
});

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
         User.findOne({ googleId: profile.id }).then((existingUser) => {
            // If there isn't a user, existingUser will be null
            if (existingUser) {
               // We already have a record with the given profile ID
               done(null, existingUser);
            } else {
               // We don't have a user record with this ID, make a new record.
               new User({ googleId: profile.id })
                  .save()
                  .then((user) => done(null, user));
            }
            done();
         });
      }
   )
);
