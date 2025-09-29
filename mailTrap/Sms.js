import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();
const accountSid =process.env.accountSid;
const authToken = process.env.authToken;
const client =twilio(accountSid, authToken);

const sms=async(phoneNo)=>{
client.verify.v2.services(process.env.serViceId)
      .verifications
      .create({
        to: `+91${phoneNo}`,
        channel: 'sms'
    })
    .then(verification => console.log(verification.sid))
.catch(error => console.error(error));

}
export default sms;