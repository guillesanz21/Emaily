// Subdocument Collection
const mongoose = require("mongoose");
const { Schema } = mongoose;

const recipientSchema = new Schema({
   email: String,
   responded: {
      type: Boolean,
      default: false,
   },
});

// The subdocuments collections need to be exported
module.exports = recipientSchema;
