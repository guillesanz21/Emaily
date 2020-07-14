// Figure out what set of credentials to return

if (process.env.NODE_ENV === "production") {
   // wer are in production - return the prod set of keys!!!
   module.exports = require("./prod");
} else {
   // we are in development - return the dev keys!!!
   module.exports = require("./dev"); // Exporting and requiring at the same line
}
