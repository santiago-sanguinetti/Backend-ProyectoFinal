const socket = io();

socket.on("messages", (data) => {
    render(data);
});
const render = (data) => {
    const html = data
        .map((item) => {
            return `<div>
      <p>${item.user}:</p> <p>${item.message}</p>
      </div>
      `;
        })
        .join(" ");
    document.getElementById("messages").innerHTML = html;
};
const paramsValidador = (message) => {
    if (message.user && message.message) {
        return true;
    } else {
        if (!message.user) {
            throw new Error(`Missing username`);
        } else if (!message.message) {
            throw new Error(`Need to write the message`);
        }
    }
};
const addMessage = () => {
    const message = {
        user: document.getElementById("user").value,
        message: document.getElementById("message").value,
    };
    if (paramsValidador(message)) {
        socket.emit("newMessage", message);
        const form = document.getElementById("addMessageForm");
        form.reset();
    }
};
