import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'laney80@ethereal.email',
        pass: 'Vzk2jqKNrtB7F4PxuY'
    }
})

function mailer(message){
    transporter.sendMail(message, (err, info) => {
        if (err) return console.log(err)
        console.log('Письмо отправлено: ', info)
    })
}

export default mailer; 