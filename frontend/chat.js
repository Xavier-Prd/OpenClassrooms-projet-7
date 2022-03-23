const app = Vue.createApp({
    data() {
        return {
            userId: 1,
            messageToSend: '',
            image: '',
            username: 'Xavier Pardoue',
            userImageUrl: './images/user/default.png',
            charNumber: 240,
            messages:[],
            users:[]
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

        redirect(id){
            window.location.assign(`post.html?id=${id}`);
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
        replaceImage(image){
            this.image = image
        },
        sendData(e){
            e.preventDefault();
            let valid = true;

            document.querySelectorAll('.form__input, .form__file').forEach((input) => {
                valid = input.reportValidity() && valid;
            })
            if (valid) {
                const message = {
                    userId:this.userId,
                    message: this.messageToSend,
                    // image: this.image
                }
                fetch('http://localhost:3000/api/auth/add-message', {
                    method : 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                    body : JSON.stringify({message})
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
