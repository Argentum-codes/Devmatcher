const { SendEmailCommand } = require ("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");


const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
    return new SendEmailCommand({
      Destination: {
        /* required */
        CcAddresses: [
          /* more items */
        ],
        ToAddresses: [
          toAddress,
          /* more To-email addresses */
        ],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: "UTF-8",
            Data: `<h1>${body}</p>`,
          },
          Text: {
            Charset: "UTF-8",
            Data: `Hello from DevMatcher!`,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
};

const run = async (subject, body) => {
    const sendEmailCommand = createSendEmailCommand(
      "arghaguha3001@gmail.com",
      "argha@devmatcher.xyz",
       subject,
       body,
    );
  
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
        const messageRejectedError = caught;
        return messageRejectedError;
      }
      throw caught;
    }
  };
  
  // snippet-end:[ses.JavaScript.email.sendEmailV3]
  module.exports = { run };
  