const API_URL =
    "https://gscoffee-backend.onrender.com";


const form =
    document.getElementById(
        "categoriaForm"
    );

const mensagem =
    document.getElementById(
        "categoriaMessage"
    );

const lista =
    document.getElementById(
        "categoriesList"
    );

const categoriaId =
    document.getElementById(
        "categoriaId"
    );

const nome =
    document.getElementById(
        "nome"
    );

const formTitle =
    document.getElementById(
        "form-title"
    );

const cancelarEdicao =
    document.getElementById(
        "cancelarEdicao"
    );

    const modalExcluirCategoria =
    document.getElementById(
        "modalExcluirCategoria"
    );

const cancelarExclusaoCategoria =
    document.getElementById(
        "cancelarExclusaoCategoria"
    );

const confirmarExclusaoCategoria =
    document.getElementById(
        "confirmarExclusaoCategoria"
    );

let categoriaExcluindoId = null;


function getToken() {

    return (
        localStorage.getItem(
            "gscoffee_token"
        ) ||
        localStorage.getItem(
            "token"
        )
    );

}


function mostrarMensagem(
    texto,
    tipo = ""
) {

    mensagem.textContent =
        texto;

    mensagem.className =
        `message ${tipo}`;

}


async function carregarCategorias() {

    try {

        const response =
            await fetch(
                `${API_URL}/categorias`
            );


        const categorias =
            await response.json();


        if (!response.ok) {

            throw new Error(
                categorias.message ||
                "Erro ao carregar categorias"
            );

        }


        lista.innerHTML =
            "";


        if (!categorias.length) {

            lista.innerHTML =
                `
                <p>
                    Nenhuma categoria cadastrada.
                </p>
                `;

            return;

        }


        categorias
            .sort(
                (a, b) =>
                    a.nome.localeCompare(
                        b.nome,
                        "pt-BR"
                    )
            )
            .forEach(
                categoria => {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "category-item";


                    item.innerHTML =
                        `
                        <div class="category-info">

                            <strong>
                                ${categoria.nome}
                            </strong>

                        </div>


                        <div class="category-actions">

                            <button
                                type="button"
                                class="btn btn-edit"
                                data-edit="${categoria.categoria_id}"
                            >
                                Editar
                            </button>

                            <button
                                type="button"
                                class="btn btn-delete"
                                data-delete="${categoria.categoria_id}"
                            >
                                Excluir
                            </button>

                        </div>
                        `;


                    lista.appendChild(
                        item
                    );

                }
            );


    } catch (error) {

        console.error(
            "Erro ao carregar categorias:",
            error
        );


        lista.innerHTML =
            `
            <p class="error">
                Não foi possível carregar as categorias.
            </p>
            `;

    }

}


function limparFormulario() {

    categoriaId.value =
        "";

    nome.value =
        "";

    formTitle.textContent =
        "Cadastrar categoria";

    cancelarEdicao.style.display =
        "none";

}


form.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const token =
            getToken();


        if (!token) {

            mostrarMensagem(
                "Sessão expirada. Faça login novamente.",
                "error"
            );

            return;

        }


        const nomeCategoria =
            nome.value.trim();


        if (!nomeCategoria) {

            mostrarMensagem(
                "Digite o nome da categoria.",
                "error"
            );

            return;

        }


        const id =
            categoriaId.value;


        const url =
            id
                ? `${API_URL}/categorias/${id}`
                : `${API_URL}/categorias`;


        const method =
            id
                ? "PUT"
                : "POST";


        try {

            mostrarMensagem(
                "Salvando..."
            );


            const response =
                await fetch(
                    url,
                    {

                        method,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify({
                                nome:
                                    nomeCategoria
                            })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Não foi possível salvar a categoria."
                );

            }


            mostrarMensagem(
                id
                    ? "Categoria atualizada com sucesso!"
                    : "Categoria criada com sucesso!",
                "success"
            );


            limparFormulario();


            await carregarCategorias();


        } catch (error) {

            console.error(
                "Erro ao salvar categoria:",
                error
            );


            mostrarMensagem(
                error.message,
                "error"
            );

        }

    }
);


lista.addEventListener(
    "click",
    async event => {

        const editButton =
            event.target.closest(
                "[data-edit]"
            );


        const deleteButton =
            event.target.closest(
                "[data-delete]"
            );


        if (editButton) {

            const id =
                editButton.dataset.edit;


            try {

                const response =
                    await fetch(
                        `${API_URL}/categorias/${id}`
                    );


                const categoria =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        categoria.message ||
                        "Erro ao buscar categoria."
                    );

                }


                categoriaId.value =
                    categoria.categoria_id;


                nome.value =
                    categoria.nome || "";


                formTitle.textContent =
                    "Editar categoria";


                cancelarEdicao.style.display =
                    "inline-block";


                nome.focus();


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });


            } catch (error) {

                console.error(
                    error
                );


                mostrarMensagem(
                    "Não foi possível carregar a categoria.",
                    "error"
                );

            }

        }


        if (deleteButton) {

    categoriaExcluindoId =
        deleteButton.dataset.delete;

    modalExcluirCategoria.classList.add(
        "ativo"
    );
}
        }
);

cancelarExclusaoCategoria?.addEventListener(
    "click",
    () => {

        categoriaExcluindoId = null;

        modalExcluirCategoria.classList.remove(
            "ativo"
        );

    }
);


confirmarExclusaoCategoria?.addEventListener(
    "click",
    async () => {

        if (!categoriaExcluindoId) {
            return;
        }


        const token =
            getToken();


        if (!token) {

            mostrarMensagem(
                "Sessão expirada. Faça login novamente.",
                "error"
            );

            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/categorias/${categoriaExcluindoId}`,
                    {

                        method: "DELETE",

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Não foi possível excluir a categoria."
                );

            }


            const idExcluido =
                categoriaExcluindoId;


            modalExcluirCategoria.classList.remove(
                "ativo"
            );


            categoriaExcluindoId = null;


            mostrarMensagem(
                "Categoria excluída com sucesso!",
                "success"
            );


            if (
                String(categoriaId.value) ===
                String(idExcluido)
            ) {

                limparFormulario();

            }


            await carregarCategorias();


        } catch (error) {

            console.error(
                "Erro ao excluir categoria:",
                error
            );


            mostrarMensagem(
                error.message ||
                "Não foi possível excluir a categoria.",
                "error"
            );

        }

    }
);

cancelarEdicao.addEventListener(
    "click",
    limparFormulario
);


carregarCategorias();