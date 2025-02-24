let senhaAutenticada = localStorage.setItem('senhaAutenticada', false); // Variável para armazenar o estado de autenticação

document.addEventListener("DOMContentLoaded", function () {
    // Carrega a senha a partir do arquivo JSON
    fetch("https://gruposmi.github.io/database/password.json")
      .then(response => response.json())
      .then(data => {
        senhaCorreta = data[0].senha;
      })
      .catch(error => console.error("Erro ao carregar a senha:", error));

    // Evento para o envio do formulário de login
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const password = document.getElementById('password').value;

        if (password === senhaCorreta) {
            alert("Autorização bem-sucedida!");
            // Armazena o estado de autenticação no localStorage
            localStorage.setItem('senhaAutenticada', true);
            // Redirecionar para a página principal
            window.location.href = "index.html";
        } else {
            alert("Senha incorreta!");
        }
    });
});