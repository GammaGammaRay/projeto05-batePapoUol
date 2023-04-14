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

function checkUniqueUsername(user, data) {
    // print online users
    // let i = 0;
    // while(i < data.length) {
    //         console.log(data[i].name);
    //         i++;
    //     }
        for(let i = 0; i < data.length; i++) {
            if(user == data[i].name) {
                return false;
            }
        }
        return true;
}

function enterChat() {
    loginScreen.style.display = 'none';
    chatScreen.style.display = 'flex';

    printMessages();
}

function printMessages() {
    var data = getMessages();

    for(let i = 0; i < data.length; i++) {
        console.log(data[i].text);
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
                    }
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        }, 200);
    });
}