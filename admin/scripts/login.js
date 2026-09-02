const form = document.getElementById("loginForm");
const mensagem = document.getElementById("loginMessage");

function mostrarMensagem(texto, tipo = "") {

    mensagem.textContent = texto;

    mensagem.classList.remove(
        "success",
        "error"
    );

    if (tipo) {
        mensagem.classList.add(tipo);
    }

}


form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const senha =
            document
                .getElementById("senha")
                .value;


        mostrarMensagem(
            "Entrando..."
        );


        try {

            const response =
                await fetch(
                    "http://localhost:5008/auth/login",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                email,
                                senha
                            })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                mostrarMensagem(
                    data.message ||
                    "Erro ao realizar login.",
                    "error"
                );

                return;

            }


            // Apenas administradores podem acessar o painel
            if (
                data.usuario?.role !==
                "admin"
            ) {

                mostrarMensagem(
                    "Acesso permitido somente para administradores.",
                    "error"
                );

                return;

            }


            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "gscoffee_token",
                data.token
            );


            localStorage.setItem(
                "usuario",
                JSON.stringify(
                    data.usuario
                )
            );

            localStorage.setItem(
                "gscoffee_user",
                JSON.stringify(
                    data.usuario
                )
            );


            mostrarMensagem(
                "Login realizado com sucesso!",
                "success"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "dashboard.html";

                },
                500
            );


        } catch (error) {

            console.error(
                "Erro ao realizar login:",
                error
            );

            mostrarMensagem(
                "Erro ao conectar com o servidor.",
                "error"
            );

        }

    }
);