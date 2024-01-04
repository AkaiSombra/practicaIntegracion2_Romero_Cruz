
const socket = io()

const message = document.getElementById('message')
const received_messages = document.getElementById('received_messages')

const users = [
    { id: 1, firstName: '狂三', lastName: '時崎', userName: 'kTokisaki', email: "KurumiTokisaki@gmail.com", age: 19},
    { id: 2, firstName: '琴里', lastName: '五河', userName: 'KotoriItsu', email: "KotoriItsuka@gmail.com", age: 15},
    { id: 3, firstName: '士道', lastName: '五河', userName: 'ShidoItsu', email: "ShidoItsuka@gmail.com", age: 18},
]

let user

socket.on('user_connected', data => {
    Swal.fire({
        text: `${data.user.firstName} ${data.user.lastName} se ha conectado`,
        toast: true,
        position: 'top-right'
    })
})

socket.on('messageLogs', data => {
    let messages = `${data.firstName}: ${data.content} <br />`
    received_messages.innerHTML += messages
})

 socket.on('chatLogs', data => {
    let messages = ''
    data.forEach(message => {
        messages += `${message.firstName}: ${message.content} <br />`
    })

    received_messages.innerHTML = messages
})

const sendMessage = () => {
    const messageValue = message.value.trim()

    if (messageValue !== '') {
        socket.emit('message', { userName: user.userName, firstName: user.firstName, email: user.email, content: messageValue })
        message.value = ''
    }
}

const authenticate = () =>{
    Swal.fire({
        title: 'Login',
        input: 'text',
        text: 'Ingresar usuario:',
        inputValidator: value => {
            return !value && 'Por favor ingresar usuario'
        },
        allowOutsideClick: false
    }).then(res => {
        user = users.find(user => user.userName === res.value)
        if(user !== undefined) {
            socket.emit('user_connected', { user: user })
        } else {
            Swal.fire({
                text: 'Usuario no valido',
                toast: true,
                position: 'top-right'
            }).then(res => {
                authenticate()
            })
        }
    })
}

authenticate()