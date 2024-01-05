export const GenerateOTP = () => {
    const otp = Math.floor(100000000 + Math.random() * 90000000);

    let expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));

    return {otp, expiry};
}

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
    const accountSid = 'ACaff1720d69e33d51c7853c2a5b4ac581';
    const authToken = 'bc383f30eaf7859dc24542f047bf2716';
    const client = require('twilio')(accountSid, authToken);

    const data = {
        body: 'OTP anda'+otp,
        from: '+12165038292',
        to : toPhoneNumber
    };
    console.log(data);

    const response = await client.messages.create(data);

    return response;
}