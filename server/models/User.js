const mongoose = require("mongoose");
const { Schema } = mongoose; // Equals to: const Schema = mongoose.Schema; (destructuring)

const userSchema = new Schema({
   googleId: String,
   credits: {
      type: Number,
      default: 0,
   },
});

// This will load the schema into mongoose
mongoose.model("users", userSchema);
