// axios
axios.defaults.headers.common['Authorization'] = '5wY65Pq5uCOFfh5yfnMVGhIF';
const chatScreen = document.getElementById('chat-screen');
const loginScreen = document.getElementById('login-screen');

const now = new Date();
const currentTime = now.toLocaleTimeString(undefined, {hour12: false});
console.log(currentTime); 

var username = "";

function login() {
    var newUser = document.getElementById("username").value;
    var data = axios.get('https://mock-api.driven.com.br/api/vm/uol/participants');

    if(newUser === null || newUser === 'Digite seu nome') {
        alert("Escreva um apelido");
    } else {
        data.then(response => {
            
            if (checkUniqueUsername(newUser, response.data)) {
                console.log("unique username");
                axiosSignIn(newUser);
                enterChat(response.data);
                username = newUser;
                return true;
              } else {
                alert("O apelido já está sendo usado.");
              }
            })
            .catch(error => {
              console.error(error);
            });
    }
}

function checkUniqueUsername(user, data) {
        for(let i = 0; i < data.length; i++) {
            if(user == data[i].name) {
                return false;
            }
        }
        return true;
}

function enterChat(data) {
    var messages = getMessages();
    console.log(messages);

    console.log(getMessages());

    loginScreen.style.display = 'none';
    chatScreen.style.display = 'flex';

    for (let i = 0; i < messages.length; i++) {
        renderMessage(messages[i]);
    }
}

function timeOffset(time, offset) {
    var [h,m,s] = time.split(':');
    console.log(h,m,s);
    hour = (parseInt(h)+ offset) % 12;
    return `${hour}:${m}:${s}`;
}

function getMessages() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            axios.get('https://mock-api.driven.com.br/api/vm/uol/messages')
                .then(response => {
                    resolve(response.data);
                    for(let i = 0; i < response.data.length; i++) {
                        const newTime = timeOffset(response.data[i].time,9);
                        response.data[i].time = newTime;

                        console.log(response.data[i]);
                        renderMessage(response.data[i]);
                    }
                    
                })
                .catch(error => {
                    reject(error);
                });
        }, 200);
    });
}

var content = document.getElementById('content');

function renderMessage(data) {

    if (data.from === '${name}') {
        return
    }

    if(data.type === "status") {
        content.innerHTML += `<div class="msg-container">
        <p class="msg">
          <span class="time-stamp">${data.time}</span>
          <span class="msg-fromUser">${data.from}</span>
          <span class="msg-text">${data.text}</span>
        </p>
        </div>`;
    }
    else if (data.type === "message" || data.type === "private_message") {
        if (data.to === "Todos" || data.to === "everyone") {
            content.innerHTML += `<div class="msg-container">
            <p class="msg">
              <span class="time-stamp">${data.time}</span>
              <span class="msg-fromUser">${data.from}</span>
              <span class="msg-toUser">${data.to}</span>
              <span class="msg-text">${data.text}</span>
            </p>
            </div>`;
        }
        else {
            content.innerHTML += `<div class="msg-container">
            <p class="msg">
              <span class="time-stamp">${data.time}</span>
              <span class="msg-fromUser">${data.from}</span>
              <span class="msg-toUser">${data.to}</span>
              <span class="msg-text">${data.text}</span>
            </p>
            </div>`;
        }
    }
    else {
        console.log("unrecognized message type")
    }
}

function axiosSignIn(name) {
    const n = {name};
    axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', n);
}

function axiosStatusUpdate(name) {
    const n = {name: `"${name}"`};
    setTimeout(
        axiousStatusUpdate.post('https://mock-api.driven.com.br/api/vm/uol/status', n)
    , 5000)
}

