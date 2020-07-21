const _ = require("lodash");
const { Path } = require("path-parser");
const { URL } = require("url");
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

const Survey = mongoose.model("surveys");

module.exports = (app) => {
  app.get("/api/surveys", requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false, // Doesn't include the recipients property
    });
    res.send(surveys);
  });

  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
    res.send("Thanks for voting!");
  });

  /* { email, url } are 2 params from the event object
   * new Path:          We create a url whose parameters can be extracted
   * URL(url).pathname: Extract the relative url from the given event. Example: /api/surveys/5324sa421/yes
   * p.test():          Assign the survey ID and the choice inside of an object
   * If the url can match the values, then we obtain: { surveyId: '5324sa421', choice: "yes" }
   * If not (maybe because it wasn't a click event), then we obtain an undefined object.
   * _.compact:        Removes the undefined events (the ones which aren't of type click)
   * _.uniqBy:         Removes the duplicated ones
   */
  app.post("/api/surveys/webhooks", (req, res) => {
    const p = new Path("/api/surveys/:surveyId/:choice");
    _.chain(req.body)
      .map(({ email, url }) => {
        const match = p.test(new URL(url).pathname);
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        }
      })
      .compact()
      .uniqBy("email", "surveyId")
      .each(({ surveyId, email, choice }) => {
        // Find the survey with the same id as the given one, besides, for every survey from the surveys collections
        // look through its recipients property, and inside, find the recipient that matches the given email and have
        // the responded property set to false. Then update the responded value, the num of answers of the survey and
        // the date of the moment the survey was answered
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false },
            },
          },
          {
            $inc: { [choice]: 1 }, // $inc === increment the "yes" or the "no" value by 1.
            $set: { "recipients.$.responded": true }, // Set the responded prop from the element matched to true.
            lastResponded: new Date(),
          }
        ).exec();
      })
      .value();

    res.send({});
  });

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
};
