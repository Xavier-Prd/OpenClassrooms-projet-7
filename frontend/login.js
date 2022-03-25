

// Vue JS
const app = Vue.createApp({
    data() {
        return {
                email : '',
                password : '',
                error: ''
        }
    },
    methods: {
        sendData(e){
            e.preventDefault();
            let valid = true;

            document.querySelectorAll('.connect__input').forEach((input) => {
                valid = input.reportValidity() && valid;
            })
            if (valid) {
                const user = {
                    email:this.email,
                    password: this.password
                }
                fetch('http://localhost:3000/api/auth/login', {
                    method : 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                    body : JSON.stringify(user)
                })
                .then((res)=> {
                    if(res.ok){
                        return res.json()
                        .then(data => {
                            localStorage.setItem('user', JSON.stringify(data))
                            window.location.assign('chat.html');
                        })
                    }
                    else {
                        res.json()
                        .then(error => {
                            this.error = error;
                        })
                    }
                })
                
            }
        }
    },
}).mount('#login');




// Natif
// document.querySelector('.connect__btn').addEventListener('click', (e) =>{
//     e.preventDefault();
    // let valid = true;

    // document.querySelectorAll('.connect__input').forEach((input) => {
    //     valid = input.reportValidity() && valid;
    // })
    // if (valid) {
    //     const user = {
    //         email:email.value,
    //         password: password.value
    //     }
    //     fetch('http://localhost:3000/api/auth/login', {
    //         method : 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //           },
    //         body : JSON.stringify(user)
    //     })
    //     .then((res)=> {
    //         if(res.ok){
    //             return res.json();
    //         }
    //     })
    //     .then(()=> {
    //         window.location.assign('chat.html');
    //     });
    // }
// })