const app = Vue.createApp({
    data() {
        return {
            messageToSend: '',
            image: '',
            user: JSON.parse(localStorage.getItem("user")),
            userImageUrl: JSON.parse(localStorage.getItem("user")).imageUrl,
            charNumber: 240,
            message:'',
            comments:[],
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
        conversionDate(date){
            const day1 = new Date(date);
            const day2 = new Date(Date.now());
            let difference = {
                seconde : Math.floor((day2-day1)/1000),
                minute : Math.floor((day2-day1)/(1000*60)),
                heure : Math.floor((day2-day1)/(1000*3600)),
                jour : Math.floor((day2-day1)/(1000*3600*24)),
                semaine : Math.floor((day2-day1)/(1000*3600*24*7)),
                mois : Math.floor((day2-day1)/(1000*3600*24*7*4)),
                an : Math.floor((day2-day1)/(1000*3600*24*7*4*12)),
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
        replaceImage(e){
            this.image = e.currentTarget.files[0];
        },
        disconnect(e){
            localStorage.setItem('user', '');
            window.location.assign('index.html');
        },
        deleteComment(comment) {
            fetch('http://localhost:3000/api/auth/delete-comment/'+comment.id, {
                method : 'DELETE',
                headers: {
                    authorization:'bearer '+ this.user.token
                  }
            })
            .then((res)=> {
                if(res.ok){
                    return res.json();
                }
            })
        },
        deleteMsg(){
            fetch('http://localhost:3000/api/auth/delete-message/'+this.message.id, {
                method : 'DELETE',
                headers: {
                    authorization:'bearer '+ this.user.token
                  }
            })
            .then((res)=> {
                if(res.ok){
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
                data.append('comment', JSON.stringify({comment: this.messageToSend, messageId: this.message.id}));
                data.append('image', this.image);

                fetch('http://localhost:3000/api/auth/add-comment', {
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
        fetch('http://localhost:3000/api/auth/comment/'+ (new URL(window.location.href)).searchParams.get('id'))
        .then((res) => {
            if (res.ok) {
              return res.json();
            }
          }).then(comments => {
            comments.forEach(comment => {
                  this.getUsers(comment.userId);
                  
              });
            this.comments = comments;
        });
        fetch('http://localhost:3000/api/auth/message/'+ (new URL(window.location.href)).searchParams.get('id'))
        .then((res) => {
            if (res.ok) {
              return res.json();
            }
          }).then(message => {
            this.getUsers(message.userId);
                  
            this.message = message;
        });

    },
}).mount('#chat');

// e.target.files
