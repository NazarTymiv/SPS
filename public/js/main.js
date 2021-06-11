const chat__form = document.querySelector('.chat__form');
const chat__mainwall = document.querySelector('.chat__mainwall');
const chat__infoUsers = document.querySelector('.chat__info-users');
const chat__infoTitle = document.querySelector('.chat__info-title');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

socket.emit('joinRoom', { username, room });

// GET ROOM AND USERS
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message', message => {
    console.log(message);
    outputMessage(message);
    chat__mainwall.scrollTop = chat__mainwall.scrollHeight;
})

chat__form.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

const outputMessage = message => {
    chat__mainwall.innerHTML += `
        <div class="chat__message">
            <div class="chat__message-top">
                <p class="chat__message-name">${message.username}</p>
                <p class="chat__message-date">${message.time}</p>
            </div>
            <p class="chat__message-text">${message.text}</p>
        </div>
    `;
}

const outputRoomName = room => {
    chat__infoTitle.innerHTML = room;
}

const outputUsers = users => {
    chat__infoUsers.innerHTML = `
        ${users.map(user => `<li class="chat__info-user">${user.username}</li>`).join('')}
    `;
    console.log(users);
}