const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");

const keys = require("./config/keys");
// The next requires isn't assigned to any variable since this file it isn't exporting anything, it's just executing it.
require("./models/User");
require("./services/passport");

mongoose
   .connect(keys.mongoURI)
   .then(() => {
      console.log("CONNECTED TO DB!");
   })
   .catch((err) => {
      console.log("ERROR", err.message);
   });

const app = express();

app.use(bodyParser.json());
app.use(
   cookieSession({
      // maxAge: How long this cookie can exist inside the browser before it expires
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in miliseconds
      // key to encript the cookie
      keys: [keys.cookieKey],
   })
);
app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app); // This is invoking the function exported by authRoutes in the routes directory
require("./routes/billingRoutes")(app);

// Route handler for the react routes. This will only run on production.
if (process.env.NODE_ENV === "production") {
   // Express will serve up production assests like our main.js file, or main.css file!
   // If we don't have a route handler set up for one thing, then look into the client/build directory and
   // try to see if there's some file inside of there that matches up with what this request is looking for:
   app.use(express.static("client/build"));

   // If there's not, then Express will serve up the index.html file
   const path = require("path");
   app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
   });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log("App listening on port 5000!!");
});
