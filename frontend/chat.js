const app = Vue.createApp({
    data() {
        return {
            messageToSend: '',
            image: '',
            user: JSON.parse(localStorage.getItem("user")),
            userImageUrl: JSON.parse(localStorage.getItem("user")).imageUrl,
            charNumber: 240,
            messages:[],
            users:[],
            newUsername:"",
            newImage:''
        }
    },
    
    methods: {
        getUsers(id) {
            fetch('http://localhost:3000/api/auth/user/' + id)
            .then((res) => {
                if (res.ok) {
                  return res.json();
                }
              }).then(user => {
                this.users.push(user);
            })
        },
        getUser(id) {
            return this.users.find(user => user.id === id);
        },
        conversionDate(date){
            const posted = new Date(date);
            const today = new Date(Date.now());
            let difference = {
                seconde : Math.floor((today-posted)/1000),
                minute : Math.floor((today-posted)/(1000*60)),
                heure : Math.floor((today-posted)/(1000*3600)),
                jour : Math.floor((today-posted)/(1000*3600*24)),
                semaine : Math.floor((today-posted)/(1000*3600*24*7)),
                mois : Math.floor((today-posted)/(1000*3600*24*7*4)),
                an : Math.floor((today-posted)/(1000*3600*24*7*4*12)),
            };

            let pluriel = '';
            let value = {};
            if (difference.seconde > 59){
                value.number = difference.minute;
                value.text = " minute";
                if (difference.minute > 59){
                    value.number = difference.heure;
                    value.text = " heure";
                    if (difference.heure > 23){
                        value.number = difference.jour;
                        value.text = " jour";
                        if (difference.jour > 6){
                            value.number = difference.semaine;
                            value.text = " semaine";
                            if (difference.semaine > 3){
                                value.number = difference.mois;
                                value.text = " mois";
                                value.mois = true
                                if (difference.mois > 11){
                                    value.number = difference.an;
                                    value.text = " an";
                                }
                            }
                        }
                    }
                }
            }else{
                value.number = difference.seconde;
                value.text = " seconde";
            }
            if(value.number > 1 && !value.mois){
                pluriel = 's';
            }
            return 'Il y a ' + value.number + value.text + pluriel + '.';
        },
        countChar(message){
            return 240 - message.length;
        },
        disconnect(){
            localStorage.clear();
            window.location.assign('index.html');
        },
        replaceImage(e){
            this.image = e.currentTarget.files[0]
        },
        replaceUserImage(e){
            this.newImage = e.currentTarget.files[0]
        },
        deleteUser(){
            fetch('http://localhost:3000/api/auth/delete-user/'+this.user.userId, {
                method : 'DELETE',
                headers: {
                    authorization:'bearer '+ this.user.token
                  }
            })
            .then((res)=> {
                if(res.ok){
                    this.disconnect();
                    return res.json();
                }
            })
        },
        sendUser(e){
            e.preventDefault();
            let valid = true;

            document.querySelectorAll('.form__input, .form__file').forEach((input) => {
                valid = input.reportValidity() && valid;
            })
            if (valid) {
                let data = new FormData();
                data.append('user', JSON.stringify({username:this.newUsername, userId: this.user.userId}));
                data.append('image', this.newImage);

                fetch('http://localhost:3000/api/auth/modify-user/'+this.user.userId, {
                    method : 'POST',
                    headers: {
                        authorization:'bearer '+ this.user.token
                      },
                    body : data
                })
                .then((res)=> {
                    if(res.ok){
                        return res.json().then(data => {
                            localStorage.setItem('user', JSON.stringify(data.user))
                            window.location.reload();
                        })
                    }
                });
            }
        },
        deleteMsg(message){
            fetch('http://localhost:3000/api/auth/delete-message/'+message.id, {
                method : 'DELETE',
                headers: {
                    authorization:'bearer '+ this.user.token
                  }
            })
            .then((res)=> {
                if(res.ok){
                    window.location.reload();
                    return res.json();
                }
            })
        },
        sendData(e){
            e.preventDefault();
            let valid = true;

            document.querySelectorAll('.form__input, .form__file').forEach((input) => {
                valid = input.reportValidity() && valid;
            })
            if (valid) {
                let data = new FormData();
                data.append('message', JSON.stringify({message: this.messageToSend}));
                data.append('image', this.image);
                
                fetch('http://localhost:3000/api/auth/add-message', {
                    method : 'POST',
                    headers: {
                        authorization:'bearer '+ this.user.token
                      },
                    body : data
                })
                .then((res)=> {
                    if(res.ok){
                        window.location.reload();
                        return res.json();
                    }
                });
            }
        }
    },
    created() {
        if(!localStorage.getItem('user')) {
            window.location.assign('index.html')
        }
        fetch('http://localhost:3000/api/auth/messages')
        .then((res) => {
            if (res.ok) {
              return res.json();
            }
          }).then(messages => {
              messages.forEach(message => {
                  this.getUsers(message.userId);
                  fetch('http://localhost:3000/api/auth/comment/'+ message.id)
                    .then((res) => {
                        if (res.ok) {
                        return res.json();
                        }
                    }).then(comments => {
                        message.reply_number = comments.length;
                    });
              });
              
            this.messages = messages;
        });

    },
}).mount('#chat');

// e.target.files
