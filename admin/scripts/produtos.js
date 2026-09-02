const API_URL = "https://gscoffee-backend.onrender.com";


/* =========================================================
   ELEMENTOS
   ========================================================= */

const form = document.getElementById("produtoForm");
const mensagem = document.getElementById("produtoMessage");
const lista = document.getElementById("productsList");

const produtoId = document.getElementById("produtoId");
const nome = document.getElementById("nome");
const descricao = document.getElementById("descricao");
const preco = document.getElementById("preco");
const estoque = document.getElementById("estoque");
const imagem = document.getElementById("imagem");
const categoria = document.getElementById("categoria_id");

const disponivel = document.getElementById("disponivel");
const retirada = document.getElementById("retirada");
const balcao = document.getElementById("balcao");
const maisPedidos = document.getElementById("maisPedidos");

const imagemArquivo = document.getElementById("imagemArquivo");
const imagemPreview = document.getElementById("imagemPreview");
const imagemPreviewImg = document.getElementById("imagemPreviewImg");

const formTitle = document.getElementById("form-title");
const cancelarEdicao = document.getElementById("cancelarEdicao");

const modalExcluirProduto =
    document.getElementById("modalExcluirProduto");

const cancelarExclusaoProduto =
    document.getElementById("cancelarExclusaoProduto");

const confirmarExclusaoProduto =
    document.getElementById("confirmarExclusaoProduto");

let produtoExcluindoId = null;

/* =========================================================
   TOKEN
   ========================================================= */

function getToken() {

    return (
        localStorage.getItem("gscoffee_token") ||
        localStorage.getItem("token")
    );

}


/* =========================================================
   MENSAGEM
   ========================================================= */

function mostrarMensagem(texto, tipo = "") {

    mensagem.textContent = texto;
    mensagem.className = `message ${tipo}`;

}


/* =========================================================
   URL DA IMAGEM
   ========================================================= */

function getImagemUrl(caminho) {

    if (!caminho) {
        return "";
    }

    if (
        caminho.startsWith("http://") ||
        caminho.startsWith("https://")
    ) {
        return caminho;
    }

    if (caminho.startsWith("/uploads/")) {
        return `${API_URL}${caminho}`;
    }

    return `../${caminho}`;

}


/* =========================================================
   PRÉVIA DA IMAGEM
   ========================================================= */

imagemArquivo?.addEventListener(
    "change",
    () => {

        const arquivo =
            imagemArquivo.files?.[0];

        if (!arquivo) {
            return;
        }

        if (!arquivo.type.startsWith("image/")) {

            mostrarMensagem(
                "Selecione um arquivo de imagem.",
                "error"
            );

            imagemArquivo.value = "";

            return;
        }

        const url =
            URL.createObjectURL(arquivo);

        imagemPreviewImg.src = url;
        imagemPreview.style.display = "block";

    }
);


/* =========================================================
   UPLOAD DA IMAGEM
   ========================================================= */

async function enviarImagemProduto(token) {

    const arquivo =
        imagemArquivo?.files?.[0];

    /*
       Se nenhuma nova imagem foi escolhida,
       mantém a imagem atual.
    */
    if (!arquivo) {
        return imagem.value.trim();
    }


    const formData =
        new FormData();


    formData.append(
        "imagemArquivo",
        arquivo
    );


    const response =
        await fetch(
            `${API_URL}/produtos/upload-imagem`,
            {
                method: "POST",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                },

                body: formData
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Não foi possível enviar a imagem."
        );

    }


    return data.imagem;

}


/* =========================================================
   CARREGAR CATEGORIAS
   ========================================================= */

async function carregarCategorias() {

    try {

        const response =
            await fetch(
                `${API_URL}/categorias`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Erro ao carregar categorias"
            );

        }


        categoria.innerHTML =
            `<option value="">Selecione</option>`;


        data.forEach(cat => {

            const option =
                document.createElement("option");

            option.value =
                cat.categoria_id;

            option.textContent =
                cat.nome;

            categoria.appendChild(option);

        });


    } catch (error) {

        console.error(
            "Erro ao carregar categorias:",
            error
        );


        mostrarMensagem(
            "Não foi possível carregar as categorias.",
            "error"
        );

    }

}


/* =========================================================
   CARREGAR PRODUTOS
   ========================================================= */

   async function carregarProdutos() {

    try {

        const response =
            await fetch(`${API_URL}/produtos`);

        const produtos =
            await response.json();

        if (!response.ok) {
            throw new Error(
                produtos.message ||
                "Erro ao carregar produtos"
            );
        }

        lista.innerHTML = "";

        if (!produtos.length) {

            lista.innerHTML =
                "<p>Nenhum produto cadastrado.</p>";

            return;
        }


        // Guarda qual categoria está sendo exibida
        let categoriaAtual = null;


        produtos.forEach(produto => {


            // =============================================
            // TÍTULO DA CATEGORIA
            // =============================================

            if (
                produto.categoria_nome &&
                produto.categoria_nome !== categoriaAtual
            ) {
            
                categoriaAtual = produto.categoria_nome;
            
                const tituloCategoria =
                    document.createElement("div");
            
                tituloCategoria.className =
                    "categoria-produtos-titulo";
            
                tituloCategoria.innerHTML = `
                    <span>${categoriaAtual}</span>
                `;
            
                lista.appendChild(tituloCategoria);
            }


            // =============================================
            // PRODUTO
            // =============================================

            const item =
                document.createElement("div");


            item.className =
                "product-item";


            let imagemProduto = "";

            if (produto.imagem) {

                if (
                    produto.imagem.startsWith("/uploads/")
                ) {

                    imagemProduto =
                        `${API_URL}${produto.imagem}`;

                } else {

                    imagemProduto =
                        `../${produto.imagem}`;

                }

            }


            item.innerHTML = `

                <img
                    src="${imagemProduto}"
                    alt="${produto.nome}"
                >

                <div class="product-info">

                    <h3>
                        ${produto.nome}
                    </h3>

                    <p>
                        ${produto.descricao || ""}
                    </p>

                    <p>
                        <strong>
                            R$ ${Number(produto.preco)
                                .toFixed(2)
                                .replace(".", ",")}
                        </strong>
                    </p>

                    <p>
                        Estoque:
                        ${produto.estoque}
                    </p>

                    <p>
                        Disponível:
                        ${produto.disponivel
                            ? "Sim"
                            : "Não"}
                    </p>

                    <p>
                        Mais pedidos:
                        ${produto.mais_pedido
                            ? "Sim"
                            : "Não"}
                    </p>

                </div>


                <div class="product-actions">

                    <button
                        class="btn btn-edit"
                        data-edit="${produto.produto_id}"
                    >
                        Editar
                    </button>

                    <button
                        class="btn btn-delete"
                        data-delete="${produto.produto_id}"
                    >
                        Excluir
                    </button>

                </div>
            `;


            lista.appendChild(item);

        });


    } catch (error) {

        console.error(error);

        lista.innerHTML =
            "<p>Erro ao carregar produtos.</p>";

    }

}


/* =========================================================
   LIMPAR FORMULÁRIO
   ========================================================= */

function limparFormulario() {

    form.reset();

    produtoId.value = "";

    disponivel.checked = true;
    retirada.checked = true;
    balcao.checked = false;
    maisPedidos.checked = false;

    imagem.value = "";

    if (imagemArquivo) {
        imagemArquivo.value = "";
    }

    if (imagemPreview) {
        imagemPreview.style.display = "none";
    }

    if (imagemPreviewImg) {
        imagemPreviewImg.src = "";
    }

    formTitle.textContent =
        "Cadastrar produto";

    cancelarEdicao.style.display =
        "none";

}


/* =========================================================
   SALVAR PRODUTO
   ========================================================= */

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


        try {

            mostrarMensagem(
                "Salvando..."
            );


            /*
               Primeiro envia a imagem.
               Se estiver editando sem escolher uma nova,
               mantém a imagem que já existia.
            */

            const caminhoImagem =
                await enviarImagemProduto(token);


            imagem.value =
                caminhoImagem || "";


            const dados = {

                nome:
                    nome.value.trim(),

                descricao:
                    descricao.value.trim(),

                preco:
                    Number(preco.value),

                estoque:
                    Number(estoque.value),

                imagem:
                    imagem.value.trim(),

                categoria_id:
                    Number(categoria.value),

                disponivel:
                    disponivel.checked ? 1 : 0,

                retirada:
                    retirada.checked ? 1 : 0,

                balcao:
                    balcao.checked ? 1 : 0,

                mais_pedido:
                    maisPedidos.checked ? 1 : 0

            };


            const id =
                produtoId.value;


            const url =
                id
                    ? `${API_URL}/produtos/${id}`
                    : `${API_URL}/produtos`;


            const method =
                id
                    ? "PUT"
                    : "POST";


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
                            JSON.stringify(dados)
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Erro ao salvar produto"
                );

            }


            mostrarMensagem(
                id
                    ? "Produto atualizado com sucesso!"
                    : "Produto criado com sucesso!",
                "success"
            );


            limparFormulario();

            await carregarProdutos();


        } catch (error) {

            console.error(
                "Erro ao salvar produto:",
                error
            );


            mostrarMensagem(
                error.message ||
                "Não foi possível salvar o produto.",
                "error"
            );

        }

    }
);


/* =========================================================
   EDITAR / EXCLUIR
   ========================================================= */

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


        /* =====================================================
           EDITAR
           ===================================================== */

        if (editButton) {

            const id =
                editButton.dataset.edit;


            try {

                const response =
                    await fetch(
                        `${API_URL}/produtos/${id}`
                    );


                const produto =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        produto.message ||
                        "Erro ao buscar produto"
                    );

                }


                produtoId.value =
                    produto.produto_id;


                nome.value =
                    produto.nome || "";


                descricao.value =
                    produto.descricao || "";


                preco.value =
                    produto.preco || 0;


                estoque.value =
                    produto.estoque || 0;


                /*
                   Guarda a imagem atual.
                   Isso é importante para editar um produto
                   sem precisar selecionar a imagem novamente.
                */

                imagem.value =
                    produto.imagem || "";


                categoria.value =
                    produto.categoria_id || "";


                disponivel.checked =
                    Boolean(
                        produto.disponivel
                    );


                retirada.checked =
                    Boolean(
                        produto.retirada
                    );


                balcao.checked =
                    Boolean(
                        produto.balcao
                    );


                maisPedidos.checked =
                    Boolean(
                        produto.mais_pedido
                    );


                /* =============================================
                   MOSTRAR IMAGEM ATUAL
                   ============================================= */

                if (produto.imagem) {

                    imagemPreviewImg.src =
                        getImagemUrl(
                            produto.imagem
                        );

                    imagemPreview.style.display =
                        "block";

                } else {

                    imagemPreviewImg.src = "";

                    imagemPreview.style.display =
                        "none";

                }


                /*
                   Limpa somente o seletor de arquivo.
                   Não apaga a imagem atual do produto.
                */

                if (imagemArquivo) {
                    imagemArquivo.value = "";
                }


                formTitle.textContent =
                    "Editar produto";


                cancelarEdicao.style.display =
                    "inline-block";


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });


            } catch (error) {

                console.error(
                    "Erro ao carregar produto:",
                    error
                );


                mostrarMensagem(
                    "Não foi possível carregar o produto.",
                    "error"
                );

            }

        }


        /* =====================================================
           EXCLUIR
           ===================================================== */

        if (deleteButton) {

    produtoExcluindoId =
        deleteButton.dataset.delete;

    modalExcluirProduto.classList.add(
        "ativo"
    );

}
        }
);

cancelarExclusaoProduto?.addEventListener(
    "click",
    () => {

        produtoExcluindoId = null;

        modalExcluirProduto.classList.remove(
            "ativo"
        );

    }
);


confirmarExclusaoProduto?.addEventListener(
    "click",
    async () => {

        if (!produtoExcluindoId) {
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
                    `${API_URL}/produtos/${produtoExcluindoId}`,
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
                    "Erro ao excluir produto"
                );

            }


            modalExcluirProduto.classList.remove(
                "ativo"
            );


            produtoExcluindoId = null;


            mostrarMensagem(
                "Produto removido com sucesso!",
                "success"
            );


            await carregarProdutos();


        } catch (error) {

            console.error(
                "Erro ao excluir produto:",
                error
            );


            mostrarMensagem(
                error.message ||
                "Não foi possível excluir o produto.",
                "error"
            );

        }

    }
);


/* =========================================================
   CANCELAR EDIÇÃO
   ========================================================= */

cancelarEdicao.addEventListener(
    "click",
    limparFormulario
);


/* =========================================================
   INICIAR
   ========================================================= */

carregarCategorias();

carregarProdutos();