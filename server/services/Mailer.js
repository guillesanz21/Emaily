const sendgrid = require("sendgrid");
const helper = sendgrid.mail;
const keys = require("../config/keys");

class Mailer extends helper.Mail {
  // We extract the subject and the recipients properties from the survey object
  constructor({ subject, recipients }, content) {
    super();

    this.sgApi = sendgrid(keys.sendGridKey);
    this.from_email = new helper.Email("rexinoy543@tmauv.com");
    this.subject = subject;
    this.body = new helper.Content("text/html", content);
    this.recipients = this.formatAddresses(recipients); // Helper function

    this.addContent(this.body); // Function defined in the parent class (helper.Mail)
    this.addClickTracking(); // Helper function
    this.addRecipients(); // Helper function
  }

  formatAddresses(recipients) {
    // This will extract the email addresses from the list of objects
    return recipients.map(({ email }) => {
      return new helper.Email(email); // This is going to format the email
    });
  }

  // Function responsible for tracking what user clicked the survey
  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipients() {
    const personalize = new helper.Personalization();

    this.recipients.forEach((recipient) => {
      personalize.addTo(recipient);
    });
    this.addPersonalization(personalize);
  }

  // This will send the email to sendgrid
  async send() {
    const request = this.sgApi.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: this.toJSON(),
    });
    let response;
    try {
      // Send them
      response = await this.sgApi.API(request);
    } catch (err) {
      console.log(err);
    }
    return response;
  }
}

module.exports = Mailer;
