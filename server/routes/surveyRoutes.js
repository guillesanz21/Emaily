const mongoose = require("mongoose");
const axios = require("axios"); // DELETE AND UNINSTALL THIS
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

const Survey = mongoose.model("surveys");

module.exports = (app) => {
  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      // This takes the list of comma-separated emails and it turns into an array of objects,
      // each one with a email property. The email needs to be wrapped up into an object since
      // this is a Subdocument Collection. The "responded" property don't need to be called here
      // because we set that prop with a default value.
      recipients: recipients.split(",").map((email) => ({ email: email.trim() })),
      // "yes" and "no" have a default value assigned
      _user: req.user.id,
      dateSent: Date.now(),
    });

    const mailer = new Mailer(survey, surveyTemplate(survey));
    try {
      await mailer.send();

      await survey.save();

      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });

  app.get("/api/surveys/thanks", (req, res) => {
    res.send("Thanks for voting!");
  });

  app.get("/test", async (req, res) => {
    const survey = {
      title: "my title",
      subject: "my subject",
      recipients: "guillermo.sanz.gs@gmail.com",
      body: "Here is the body of the email",
    };
    try {
      const response = await axios.post("/api/surveys", survey);
      res.send("GOOD: " + response);
    } catch (err) {
      res.send(err);
    }
  });
};
