const mongoose = require("mongoose");
const { Schema } = mongoose; // Equals to: const Schema = mongoose.Schema; (destructuring)

const userSchema = new Schema({
   googleId: String,
});

// This will load the schema into mongoose
mongoose.model("users", userSchema);
