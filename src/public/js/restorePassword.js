
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('.form')
    const errorMessage = document.getElementById('error-message')    

    form.addEventListener('submit', function async (event) {
        event.preventDefault()

        const restorePassword = {
            username: form.elements.username.value,
            newPassword: form.elements.newPassword.value,
        }


        const REGISTER_URL = 'http://localhost:8080/api/sessions/restorepassword'

        fetch(REGISTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(restorePassword),
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            if(data.status === 'ERROR'){
                console.error(`Error: ${data.data}`)
                errorMessage.textContent = `Error: ${data.data}`
            } else {
                window.location.href = "http://localhost:8080/login"
                console.log('Data:', data.data);
            }
        })
    });
});

function toLogin() {
    window.location.href = "http://localhost:8080/login";
}