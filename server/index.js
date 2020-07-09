const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log("App listening on port 5000!!");
});
