export const GenerateOTP = () => {
    const otp = Math.floor(100000000 + Math.random() * 90000000);

    let expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));

    return {otp, expiry};
}

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
    const accountSid = 'ACfeedd4807a13b78bc1d37454a2ad0269';
    const authToken = '555ec00926a14dc23ef02b50d1efb4ef';
    const client = require('twilio')(accountSid, authToken);

    const data = {
        body: 'OTP anda'+otp,
        from: '+16317764559',
        to : toPhoneNumber
    };
    console.log(data);

    const response = await client.messages.create(data);

    return response;
}