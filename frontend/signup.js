const app = Vue.createApp({
     data() {
        return {
            email : '',
            username : '',
            password : '',
            error:''
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
                        email: this.email,
                        username: this.username,
                        password: this.password
                    }
                    fetch('http://localhost:3000/api/auth/signup', {
                        method : 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                          },
                        body : JSON.stringify(user)
                    })
                    .then((res)=> {
                        if(res.ok){
                            window.location.assign('index.html');
                            return res.json();
                        }
                        else {
                            res.json()
                            .then(error => {
                                this.error = error;
                                this.mailError = false
                                this.usernameError = false
                                switch(error.type){
                                    case "email":
                                        this.mailError = true;
                                        break;
                                        case "username":
                                        this.usernameError = true;
                                        break;
                                }
                                })
                        }
                    })
                }
            }
         }
     }).mount('#signup');














