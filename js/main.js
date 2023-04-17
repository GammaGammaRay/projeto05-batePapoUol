// axios
axios.defaults.headers.common['Authorization'] = '5wY65Pq5uCOFfh5yfnMVGhIF';
const chatScreen = document.getElementById('chat-screen');
const loginScreen = document.getElementById('login-screen');
const sendMsgBox = document.getElementById('send-msg-box');
const content = document.getElementById('content');
const msgInput = document.querySelector("#msg-input");

var messages = [];

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
                username = newUser;
                enterChat();
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

    axiosSignIn(username)
        .then(() => {
            //send status update every 5s
            setInterval(() => {
                axiosStatusUpdate(username);
            }, 5000);

            //get messages every 2s
            setInterval(() => {
                getMessages()
                    .then(response => {
                        messages = response;
                        renderMessages(messages);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }, 2000);
        })
        .catch(error => {
            console.error(error);
        });
}

function checkUniqueUsername(user, data) {
        for(let i = 0; i < data.length; i++) {
            console.log(data[i].name); 
            if(user === data[i].name) {
                return false;
            }
        }
        return true;
}


function getMessages() {
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


function renderMessages(data) {
    content.innerHTML = '';
    
    for (let i = 0; i < data.length; i++) {
        renderMessageHTML(data[i]);
    }
}



function renderMessageHTML(data) {
    
    if (data.from === '${name}') {
        return
    }

    if(data.type === "status") {
        content.innerHTML += `<div class="msg-container status" data-test="message">
        <p class="msg">
          <span class="msg-time">(${data.time})</span>
          <span class="msg-fromUser">${data.from}</span>
          <span class="msg-text">: ${data.text}</span>
        </p>
        </div>`;
    }
    else if (data.type === "message" || data.type === "private_message") {
        if (data.to === "Todos" || data.to === "everyone") {
            content.innerHTML += `<div class="msg-container" data-test="message">
            <p class="msg">
              <span class="msg-time">(${data.time})</span>
              <span class="msg-fromUser">${data.from}</span>
              <span> para </span>
              <span class="msg-toUser">${data.to}</span>
              <span class="msg-text">: ${data.text}</span>
            </p>
            </div>`;
        }
        else {
            content.innerHTML += `<div class="msg-container pvt" data-test="message">
            <p class="msg">
              <span class="msg-time">(${data.time})</span>
              <span class="msg-fromUser">${data.from}</span>
              <span> para </span>
              <span class="msg-toUser">${data.to}</span>
              <span class="msg-text">: ${data.text}</span>
            </p>
            </div>`;

        }
    }
    else {
        console.log("unrecognized message type")
    }
}

function checkIfStillLogged(username) {
    return axios
      .get("https://mock-api.driven.com.br/api/vm/uol/participants")
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (username === response.data[i].name) {
            return true;
          }
        }
        return false;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }

function sendMsg() {
    console.log("send message click")

    if(checkIfStillLogged(username)){
        const message = msgInput.value;
    
    let msgObj = {
        from: username,
        to: "Todos",
        text: message,
        type: "message"
    }
    
    axios.post("https://mock-api.driven.com.br/api/vm/uol/messages", msgObj)
        .then(response => {
            console.log(response)
            msgInput.value = ''
        }).catch(error => {
            console.error(error);
            window.location.reload();
            window.alert("Erro de envio");
        });
    } else {
        window.location.reload();
    }
    
    
}

function axiosSignIn(name) {
    const n = {name: name};
    console.log(n);
    return axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', n);
}

function axiosStatusUpdate(name) {
    const n = {name: name};
    axios.post('https://mock-api.driven.com.br/api/vm/uol/status', n)
    console.log("axios status update");
}

msgInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMsg();
    }
});