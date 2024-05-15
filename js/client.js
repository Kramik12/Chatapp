const socket = io('http://localhost:8000');

//Get DOM elements in respective Js varirables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Audio that will play on receiving messages
var audio = new Audio('ting.wav');

// Function which will append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement('div')
    messageElement.classList.add('message')
    messageElement.classList.add(position)
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// If a new user joins, receive his/her the event from the server
socket.on('user-joined', data => {
    append(`${name} joined the chat`, 'right')
})

// If server send a message, receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
})

// If a user leaves the chat, append the info to the container
socket.on('left', name => {
    append(`${name}: left the chat`, 'left')    
})

//If the form gets submitted, send server ther message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.vale = ''

})
