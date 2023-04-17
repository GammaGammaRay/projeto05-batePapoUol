// axios
axios.defaults.headers.common['Authorization'] = '5wY65Pq5uCOFfh5yfnMVGhIF';
const chatScreen = document.getElementById('chat-screen');
const loginScreen = document.getElementById('login-screen');
const sendMsgBox = document.getElementById('send-msg-box');
const content = document.getElementById('content');

var now = new Date();
var currentTime = now.toLocaleTimeString(undefined, {hour12: false});

function updateTime() {
    now = new Date();
    currentTime = now.toLocaleTimeString(undefined, {hour12: false});
    // console.log("current time: " + currentTime); 
}

var messages = [];

setInterval(updateTime, 1000);


var username = "";

function login() {
    var newUser = document.getElementById("username").value;

    if(newUser === null || newUser === 'Digite seu nome') {
        alert("Escreva um apelido");
    } else {
        axios.get('https://mock-api.driven.com.br/api/vm/uol/participants')
            .then(response => {
                if (checkUniqueUsername(newUser, response.data)) {
                    username = newUser;
                    enterChat();
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

function enterChat() {
    loginScreen.style.display = 'none';
    chatScreen.style.display = 'flex';
    sendMsgBox.style.display = 'flex';

    axiosSignIn(username);
    
    setInterval(() => {
        axiosStatusUpdate(username);
    }, 5000);

    messages = getMessages();
    console.log("messages: " + messages);
    renderMessages();
}

function checkUniqueUsername(user, data) {
        for(let i = 0; i < data.length; i++) {
            if(user == data[i].name) {
                return false;
            }
        }
        return true;
}


function getMessages() {
    console.log("get messages");
    return new Promise((resolve, reject) => {
        axios.get('https://mock-api.driven.com.br/api/vm/uol/messages')
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    })
}


function renderMessages() {
    console.log("render messages");
    messages.then((data) => {
        console.log(messages);
        for(let i = 0; i < data.length; i++) {
            
            const msgTime = timeOffset(data[i].time,9);
            data[i].time = msgTime;
            // console.log(data[i]);
            if(compareTime(currentTime, msgTime)) {
                lastMsgIndex = i;
                console.log("current time:" + currentTime);
                console.log("msg time:" + msgTime);
                renderMessageHTML(data[i]);
                
            }
        }
    }).finally(() => {
        setTimeout(() => {
            renderMessages();
        }, 1000);
    });
}



function renderMessageHTML(data) {
    
    if (data.from === '${name}') {
        return
    }

    if(data.type === "status") {
        content.innerHTML += `<div class="msg-container" data-test="message">
        <p class="msg">
          <span class="time-stamp">${data.time}</span>
          <span class="msg-fromUser">${data.from}</span>
          <span class="msg-text">${data.text}</span>
        </p>
        </div>`;
    }
    else if (data.type === "message" || data.type === "private_message") {
        if (data.to === "Todos" || data.to === "everyone") {
            content.innerHTML += `<div class="msg-container" data-test="message">
            <p class="msg">
              <span class="time-stamp">${data.time}</span>
              <span class="msg-fromUser">${data.from}</span>
              <span class="msg-toUser">${data.to}</span>
              <span class="msg-text">${data.text}</span>
            </p>
            </div>`;
        }
        else {
            content.innerHTML += `<div class="msg-container" data-test="message">
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
    const n = {name: name};
    console.log(n);
    axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', n);
}

function axiosStatusUpdate(name) {
    const n = {name: name};
    axios.post('https://mock-api.driven.com.br/api/vm/uol/status', n)
    console.log("axios status update");
}

function convertToSeconds(time) {
    const [h,m,s] = time.split(':')
    var seconds = h * 3600 + m * 60 + s;
    return seconds;
}

function compareTime(userTime, msgTime) {
    uTime = convertToSeconds(userTime);
    mTime = convertToSeconds(msgTime);

    const secondsBefore = 1;

    if(mTime <= uTime && mTime >= uTime - secondsBefore) {
        return true;
    } else{return false;}
}

function timeOffset(time, offset) {
    var [h,m,s] = time.split(':');
    hour = (parseInt(h)+ offset) % 24;
    hour = hour.toString().padStart(2, '0');
    return `${hour}:${m}:${s}`;
}