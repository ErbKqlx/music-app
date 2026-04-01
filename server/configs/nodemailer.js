import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'music_app06@mail.ru',
        pass: 'To0yNUhIZgCETcHxez6W'
    }
})

function mailer(message){
    transporter.sendMail(message, (err, info) => {
        if (err) return console.log(err)
        console.log('Письмо отправлено: ', info)
    })
}

export default mailer; 