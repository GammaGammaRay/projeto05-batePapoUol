// axios
axios.defaults.headers.common['Authorization'] = '5wY65Pq5uCOFfh5yfnMVGhIF';
const chatScreen = document.getElementById('chat-screen');
const loginScreen = document.getElementById('login-screen');

function login() {
    var username = document.getElementById("username").value;
    var data = axios.get('https://mock-api.driven.com.br/api/vm/uol/participants');

    if(username === null || username === 'Digite seu nome') {
        alert("Escreva um apelido");
    } else {
        data.then(response => {
            
            if (checkUniqueUsername(username, response.data)) {
                console.log("unique username");
                axiosSignIn(username);
                enterChat(response.data);
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



function axiosSignIn(name) {
    const n = {name: "${name}"};
    axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', n);
}

function axiosStatusUpdate(name) {
    const n = {name: `"${name}"`};
    setTimeout(
        axiousStatusUpdate.post('https://mock-api.driven.com.br/api/vm/uol/status', n)
    , 5000)
}

function getMessages() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            axios.get('https://mock-api.driven.com.br/api/vm/uol/messages')
                .then(response => {
                    for(let i = 0; i < response.data.length; i++) {
                        console.log(response.data[i]);
                        renderMessage(response.data[i]);
                    }
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        }, 200);
    });
}

var content = document.getElementById('content');


function renderMessage(data) {
    console.log("render message");
    if(data.type === "status") {
        content.innerHTML += `<div class="msg-container">
        <p class="msg">
          <span class="time-stamp">${data.time}</span>
          <span class="msg-fromUser">${data.from}</span>
          <span class="msg-text">${data.text}</span>
        </p>
        </div>`;
    }
    else if (data.type === "message") {
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