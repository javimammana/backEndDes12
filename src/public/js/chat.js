const socket = io();

//////////////CHAT/////////////////////

const chatbox = document.querySelector("#chatbox");
let user;

Swal.fire({
    title: "Bienvenido",
    text: "Ingresa tu nombre para continuar",
    input: "text",
    // backdrop: blur(2px),
    inputValidator: (value) => {
        return !value && "Necesitás identificarte";
    },
    allowOutsideClick: false,
}).then((value) => {
    user = value.value.toUpperCase();
    socket.emit("inicio", user);
});

chatbox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        if(chatbox.value.trim().length > 0) {
        socket.emit("message", {
            user,
            msg: e.target.value,
            created: Date(),
        });
        chatbox.value = "";
        }
    }
});

socket.on("connected", (data) => {
    if (user !== undefined) {
        Swal.fire({
            text: `Nuevo usuario conectado: ${data}`,
            toast: true,
            position: "top-right",
        });
    }
});

socket.on("messages", (data) => {
    const logChat = document.querySelector("#messages");
    let messages = "";

    data.forEach((message) => {
        if (message.user == user){
            messages += `<div class="msgUser">
                            <h5>${message.user}:</h5><p>${message.msg}</p>
                        </div>`
        } else { 
            messages += `<div class="msg">
                    <h5>${message.user}:</h5><p>${message.msg}</p>
                    </div>`
                }
    });

    logChat.innerHTML = messages;
});