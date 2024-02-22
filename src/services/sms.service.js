const axios = require('axios');

const sendMessage = async (recipients, sender, text) => {

    const url = (
        process.env.SMS_HOST +  `/message/send.json`
    );
    const {data} = await axios.post(url, {
        token: process.env.SMS_TOKEN,
        recipients: recipients,
        sms: {
            sender: sender,
            text: text
        }
    },{
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded'
        }
    });
    return data;
};

module.exports = {
    sendMessage
}
