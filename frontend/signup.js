document.querySelector('.connect__btn').addEventListener('click', (e) =>{
    e.preventDefault();
    let valid = true;

    document.querySelectorAll('.connect__input').forEach((input) => {
        valid = input.reportValidity() && valid;
    })
    if (valid) {
        const user = {
            email:email.value,
            username:username.value,
            password: password.value
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
                return res.json();
            }
        })
        .then(()=> {
            window.location.assign('index.html');
            return;
        });
    }
})