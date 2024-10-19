const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', function (event) {
    console.log('Conectado al servidor WebSocket');
});

socket.addEventListener('message', function (event) {
    console.log('Mensaje del servidor:', event.data);
});

// Enviar un mensaje al servidor (puedes llamar a esta función más tarde cuando implementes la lógica)
function enviarMensaje(mensaje) {
    socket.send(mensaje);
}
