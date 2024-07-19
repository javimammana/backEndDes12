import nodemailer from  "nodemailer";

class EmailManager {
    constructor() {
        this.transport = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: "javiermammana.dev@gmail.com",
                pass: "xnln qlld uvbj ktdc"
            }
        })
    }

    async sendMailBuy (email, first_name, ticket) {
        try {
            
            const mailOptions = {
                    from:"Javi M <javiermammana.deb@gmail.com>",
                    to: email,
                    subject: `Detalle de compra, pedido ${ticket}.-`,
                    html: ` <h1>Confirmamos tu compra</h1>
                            <p>Hola ${first_name}, Muchas gracias por elegirnos!!</p>
                            <p>Tu compra se genero exitosamente bajo el Ticket ${ticket}, Saludos!!</p>`

            }
            await this.transport.sendMail(mailOptions);

        } catch (error) {
            console.log("Error al enviar e-Mail de compra");
        }
    }

    async sendMailStock (email, first_name, product) {
        try {
            
            const mailOptions = {
                    from:"Javi M <javiermammana.deb@gmail.com>",
                    to: email,
                    subject: `${product.title} de nuevo en Stock!!!`,
                    html: ` <h1>Hola ${first_name}</h1>
                            <p>El producto ${product.title} se encuentra nuevamente en stock!!!</p>
                            <p>Solo contamos con ${product.stock} de unidades, no lo dejes pasar!!</p>
                            <p>Compralo desde haciendo <a href="http://localhost:8080/product/${product._id}">click aqui!!</a></p>
                            <p>Que tengas un excelente dia!</p>
                            <p>Te saluda el quipo de TIENDA VIRTUAL</p>
                            `

            }
            await this.transport.sendMail(mailOptions);

        } catch (error) {
            console.log("Error al enviar e-Mail de compra");
        }
    }

    async sendMailReset(email, first_name, token) {
        try {
            const mailOptions = {
                from:"Javi M <javiermammana.deb@gmail.com>",
                to: email,
                subject: `Restablecimiento de contraseña.-`,
                html: ` <h1>Restablece tu contraseña</h1>
                        <p>Hola ${first_name}!!</p>
                        <p>Te enviamos tu token para restablecer tu contraseña</p>
                        <strong> ${token} </strong>
                        <p>Tenes 1Hs para poder <a href="http://localhost:8080/password">restablecer la clave desde este aqui</a>, luego de este tiempo, tu token expira.</p>
                        <p>Saludos!!!</p>`
            }
            await this.transport.sendMail(mailOptions);

        } catch (error) {
            console.log("Error al enviar e-Mail de restablecimiento");
        }
    }
}

export {EmailManager};