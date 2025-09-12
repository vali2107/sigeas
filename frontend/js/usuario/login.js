// faz o login e manda informações do usuário para o localStorage
document.getElementById("login_form").addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const data = {email, senha}

    const response = await fetch('http://localhost:3006/login', {
        method: 'POST',
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })

    let results = await response.json();

    if(results.success) {
        let userData = results.data;

        console.log(userData)
        localStorage.setItem('informacoes', JSON.stringify(userData))
        
        alert(results.message)

        if (userData.tipo_conta === "adm") {
            window.location.href = "adm_page.html"
        } else if (userData.tipo_conta === "professor") {
            window.location.href = "professor_page.html"
        } else {
            window.location.href = "aluno_page.html"
        }
    } else {
        alert(results.message)
    }
})