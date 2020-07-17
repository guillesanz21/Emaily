const mongoose = require("mongoose");
const { Schema } = mongoose;

const RecipientSchema = require("./Recipient");

const surveySchema = new Schema({
   title: String, // Title of the survey the user will see in our app
   subject: String, // Subject line
   body: String, // Text to show in the survey
   // List of recipients (email addresses to send survey to and if they already responded)
   // (Subdocument Collection)
   recipients: [RecipientSchema],
   yes: {
      type: Number,
      default: 0,
   },
   no: {
      type: Number,
      default: 0,
   },
   _user: {
      type: Schema.Types.ObjectId,
      ref: "User",
   },
   dateSent: Date, // Date which the survey was sent
   lastResponded: Date, // Date which the survey was responded
});

// This will load the schema into mongoose
mongoose.model("surveys", surveySchema);
