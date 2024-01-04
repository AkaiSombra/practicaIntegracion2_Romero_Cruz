
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('.form')
    const errorMessage = document.getElementById('error-message')    

    form.addEventListener('submit', function async (event) {
        event.preventDefault()

        const user = {
            firstName: form.elements.firstName.value,
            lastName: form.elements.lastName.value,
            email: form.elements.email.value,
            username: form.elements.username.value,
            password: form.elements.password.value,
            gender: form.elements.gender.value,
            age: form.elements.age.value
        };


        const REGISTER_URL = 'http://localhost:8080/api/sessions/register'

        fetch(REGISTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
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
                console.log('Datos enviados con éxito:', data.data);
            }
        })
  
    });

});

function toLogin() {
    window.location.href = "http://localhost:8080/login";
}