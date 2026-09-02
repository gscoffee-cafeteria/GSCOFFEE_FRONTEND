const API_URL =
    "http://localhost:5008";


/* =========================================================
   TOKEN / SESSÃO
   ========================================================= */

function getToken() {

    return (
        localStorage.getItem("gscoffee_token") ||
        localStorage.getItem("token")
    );

}


function removerSessao() {

    localStorage.removeItem("gscoffee_token");
    localStorage.removeItem("token");
    localStorage.removeItem("gscoffee_user");
    localStorage.removeItem("usuario");

}


function mostrarMensagem(
    elemento,
    texto,
    tipo = ""
) {

    elemento.textContent =
        texto;

    elemento.className =
        `perfil-message ${tipo}`;

}


/* =========================================================
   ELEMENTOS
   ========================================================= */

const perfilForm =
    document.getElementById("perfilForm");

const perfilNome =
    document.getElementById("perfilNome");

const perfilEmail =
    document.getElementById("perfilEmail");

const perfilTelefone =
    document.getElementById("perfilTelefone");

const perfilCpf =
    document.getElementById("perfilCpf");

const perfilDocumentoLabel =
    document.getElementById("perfilDocumentoLabel");

const perfilNascimento =
    document.getElementById("perfilNascimento");

const perfilNascimentoContainer =
    document.getElementById("perfilNascimentoContainer");

const perfilMessage =
    document.getElementById("perfilMessage");


const senhaForm =
    document.getElementById("senhaForm");

const senhaAtual =
    document.getElementById("senhaAtual");

const novaSenha =
    document.getElementById("novaSenha");

const confirmarNovaSenha =
    document.getElementById("confirmarNovaSenha");

const senhaMessage =
    document.getElementById("senhaMessage");


const logoutButton =
    document.getElementById("logoutButton");


const historicoPedidos =
    document.getElementById(
        "historicoPedidos"
    );

const meusPedidosContainer =
    document.getElementById("meusPedidosContainer");

    /* =========================================================
   CPF / CNPJ
   ========================================================= */

function formatarDocumento(valor, permitirCnpj = false) {

    let numeros =
        String(valor || "")
            .replace(/\D/g, "");

    if (!permitirCnpj) {

        numeros =
            numeros.slice(0, 11);

        return numeros
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    numeros =
        numeros.slice(0, 14);

    if (numeros.length <= 11) {

        return numeros
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    return numeros
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
}

perfilCpf?.addEventListener(
    "input",
    () => {

        const usuarioSalvo =
            JSON.parse(
                localStorage.getItem("gscoffee_user") ||
                localStorage.getItem("usuario") ||
                "null"
            );

        const permitirCnpj =
            usuarioSalvo?.role === "admin";

        perfilCpf.value =
            formatarDocumento(
                perfilCpf.value,
                permitirCnpj
            );

    }
);

/* =========================================================
   CARREGAR PERFIL
   ========================================================= */

async function carregarPerfil() {

    const token =
        getToken();


    if (!token) {

        window.location.href =
            "index.html";

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/auth/me`,
                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            removerSessao();

            window.location.href =
                "index.html";

            return;

        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Não foi possível carregar o perfil."
            );

        }


        const usuario = data.usuario;

perfilNome.value = usuario.nome || "";
perfilEmail.value = usuario.email || "";
perfilTelefone.value = usuario.telefone || "";

if (usuario.role === "admin") {

    perfilNascimentoContainer.style.display =
    "none";

perfilNascimento.value = "";

    perfilDocumentoLabel.textContent =
        "CPF ou CNPJ";

    perfilCpf.maxLength = 18;

    perfilCpf.placeholder =
        "CPF ou CNPJ";

    meusPedidosContainer.style.display =
    "none";

} else {

    perfilNascimentoContainer.style.display =
    "flex";

    perfilDocumentoLabel.textContent =
        "CPF";

    perfilCpf.maxLength = 14;

    perfilCpf.placeholder =
        "000.000.000-00";

    meusPedidosContainer.style.display =
    "block";
}

perfilCpf.value =
    formatarDocumento(
        usuario.cpf || "",
        usuario.role === "admin"
    );


        if (usuario.data_nascimento) {

            perfilNascimento.value =
                String(
                    usuario.data_nascimento
                ).slice(0, 10);

        } else {

            perfilNascimento.value =
                "";

        }


    } catch (error) {

        console.error(
            "Erro ao carregar perfil:",
            error
        );


        mostrarMensagem(
            perfilMessage,
            error.message,
            "perfil-error"
        );

    }

}

function validarCPF(valor) {

    const cpf =
        String(valor || "")
            .replace(/\D/g, "");

    if (
        cpf.length !== 11 ||
        /^(\d)\1{10}$/.test(cpf)
    ) {
        return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma +=
            Number(cpf[i]) *
            (10 - i);
    }

    let digito =
        (soma * 10) % 11;

    if (digito === 10) {
        digito = 0;
    }

    if (
        digito !==
        Number(cpf[9])
    ) {
        return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma +=
            Number(cpf[i]) *
            (11 - i);
    }

    digito =
        (soma * 10) % 11;

    if (digito === 10) {
        digito = 0;
    }

    return (
        digito ===
        Number(cpf[10])
    );
}


function validarCNPJ(valor) {

    const cnpj =
        String(valor || "")
            .replace(/\D/g, "");

    if (
        cnpj.length !== 14 ||
        /^(\d)\1{13}$/.test(cnpj)
    ) {
        return false;
    }

    function calcularDigito(
        numeros,
        pesos
    ) {

        let soma = 0;

        for (
            let i = 0;
            i < pesos.length;
            i++
        ) {
            soma +=
                Number(numeros[i]) *
                pesos[i];
        }

        const resto =
            soma % 11;

        return resto < 2
            ? 0
            : 11 - resto;
    }

    const primeiroDigito =
        calcularDigito(
            cnpj,
            [
                5, 4, 3, 2,
                9, 8, 7, 6,
                5, 4, 3, 2
            ]
        );

    if (
        primeiroDigito !==
        Number(cnpj[12])
    ) {
        return false;
    }

    const segundoDigito =
        calcularDigito(
            cnpj,
            [
                6, 5, 4, 3, 2,
                9, 8, 7, 6,
                5, 4, 3, 2
            ]
        );

    return (
        segundoDigito ===
        Number(cnpj[13])
    );
}


/* =========================================================
   ATUALIZAR PERFIL
   ========================================================= */

perfilForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const token =
            getToken();


        if (!token) {

            window.location.href =
                "index.html";

            return;

        }


        const documento =
    perfilCpf.value
        .replace(/\D/g, "");

    const usuarioSalvo =
    JSON.parse(
        localStorage.getItem("gscoffee_user") ||
        localStorage.getItem("usuario") ||
        "null"
    );

if (documento) {

    if (usuarioSalvo?.role === "admin") {

        const documentoValido =
            (
                documento.length === 11 &&
                validarCPF(documento)
            ) ||
            (
                documento.length === 14 &&
                validarCNPJ(documento)
            );

        if (!documentoValido) {

            mostrarMensagem(
                perfilMessage,
                "Informe um CPF ou CNPJ válido.",
                "perfil-error"
            );

            return;
        }

    } else {

        if (!validarCPF(documento)) {

            mostrarMensagem(
                perfilMessage,
                "Informe um CPF válido.",
                "perfil-error"
            );

            return;
        }
    }
}

const dados = {
    nome: perfilNome.value.trim(),
    email: perfilEmail.value.trim(),
    telefone: perfilTelefone.value.trim(),
    cpf: documento || null,
    data_nascimento: perfilNascimento.value || null
};


        try {

            mostrarMensagem(
                perfilMessage,
                "Salvando..."
            );


            const response =
                await fetch(
                    `${API_URL}/auth/me`,
                    {

                        method:
                            "PUT",

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
                    "Não foi possível atualizar o perfil."
                );

            }


            mostrarMensagem(
                perfilMessage,
                "Perfil atualizado com sucesso!",
                "perfil-success"
            );


            localStorage.setItem(
                "gscoffee_user",
                JSON.stringify(
                    data.usuario
                )
            );


            localStorage.setItem(
                "usuario",
                JSON.stringify(
                    data.usuario
                )
            );


        } catch (error) {

            console.error(
                "Erro ao atualizar perfil:",
                error
            );


            mostrarMensagem(
                perfilMessage,
                error.message,
                "perfil-error"
            );

        }

    }
);


/* =========================================================
   ALTERAR SENHA
   ========================================================= */

senhaForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const token =
            getToken();


        if (!token) {

            window.location.href =
                "index.html";

            return;

        }


        if (
            novaSenha.value !==
            confirmarNovaSenha.value
        ) {

            mostrarMensagem(
                senhaMessage,
                "As novas senhas não coincidem.",
                "perfil-error"
            );

            return;

        }


        if (
            novaSenha.value.length < 6
        ) {

            mostrarMensagem(
                senhaMessage,
                "A nova senha precisa ter pelo menos 6 caracteres.",
                "perfil-error"
            );

            return;

        }


        try {

            mostrarMensagem(
                senhaMessage,
                "Alterando senha..."
            );


            const response =
                await fetch(
                    `${API_URL}/auth/change-password`,
                    {

                        method:
                            "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify({

                                senha_atual:
                                    senhaAtual.value,

                                nova_senha:
                                    novaSenha.value

                            })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Não foi possível alterar a senha."
                );

            }


            senhaForm.reset();


            mostrarMensagem(
                senhaMessage,
                "Senha alterada com sucesso!",
                "perfil-success"
            );


        } catch (error) {

            console.error(
                "Erro ao alterar senha:",
                error
            );


            mostrarMensagem(
                senhaMessage,
                error.message,
                "perfil-error"
            );

        }

    }
);


/* =========================================================
   FORMATAÇÕES
   ========================================================= */

function formatarDinheiro(
    valor
) {

    return `R$ ${Number(valor)
        .toFixed(2)
        .replace(".", ",")}`;

}


function formatarData(
    data
) {

    if (!data) {

        return "-";

    }


    return new Date(
        data
    ).toLocaleString(
        "pt-BR",
        {

            dateStyle:
                "short",

            timeStyle:
                "short"

        }
    );

}


function statusLabel(
    status
) {

    const labels = {

        recebido:
            "Pedido recebido",

        preparando:
            "Em preparo",

        saiu_entrega:
            "Saiu para entrega",

        entregue:
            "Entregue",

        cancelado:
            "Cancelado"

    };


    return (
        labels[status] ||
        status ||
        "-"
    );

}


/* =========================================================
   HISTÓRICO DE PEDIDOS
   ========================================================= */

async function carregarHistoricoPedidos() {

    const token =
        getToken();


    if (
        !historicoPedidos ||
        !token
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/pedidos/me`,
                {

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
                "Não foi possível carregar seus pedidos."
            );

        }


        const pedidos =
            data.pedidos || [];


        historicoPedidos.innerHTML =
            "";


        if (!pedidos.length) {

            historicoPedidos.innerHTML = `
                <p>
                    Você ainda não realizou nenhum pedido.
                </p>
            `;

            return;

        }


        pedidos.forEach(
            pedido => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.style.padding =
                    "18px";


                card.style.marginBottom =
                    "15px";


                card.style.border =
                    "1px solid #e6d4c1";


                card.style.borderRadius =
                    "12px";


                card.style.background =
                    "#fffaf5";


                const itens =
                    pedido.itens || [];


                const historico =
                    pedido.historico || [];


                card.innerHTML = `

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            gap:15px;
                            flex-wrap:wrap;
                            margin-bottom:12px;
                        "
                    >

                        <div>

                            <strong>
                                Pedido #${pedido.pedido_id}
                            </strong>

                            <p
                                style="
                                    margin:4px 0 0;
                                    color:#766255;
                                "
                            >
                                ${formatarData(
                                    pedido.criado_em
                                )}
                            </p>

                        </div>


                        <div
                            style="
                                text-align:right;
                            "
                        >

                            <strong>
                                ${formatarDinheiro(
                                    pedido.total
                                )}
                            </strong>

                            <p
                                style="
                                    margin:4px 0 0;
                                    color:#603319;
                                    font-weight:bold;
                                "
                            >
                                ${statusLabel(
                                    pedido.status
                                )}
                            </p>

                        </div>

                    </div>


                    <div>

                        ${
                            itens
                                .map(
                                    item => `

                                        <p
                                            style="
                                                margin:6px 0;
                                                color:#5a4030;
                                            "
                                        >
                                            ${item.quantidade}x
                                            ${item.nome}

                                            —

                                            ${formatarDinheiro(
                                                item.quantidade *
                                                item.preco_unitario
                                            )}
                                        </p>

                                    `
                                )
                                .join("")
                        }

                    </div>


                    <div
                        style="
                            margin-top:12px;
                            padding-top:12px;
                            border-top:1px solid #ead9c8;
                            color:#766255;
                            font-size:14px;
                        "
                    >

                        Pagamento:

                        <strong>
                            ${pedido.pagamento || "-"}
                        </strong>

                    </div>


                    <div
                        style="
                            margin-top:16px;
                            padding-top:14px;
                            border-top:1px solid #ead9c8;
                        "
                    >

                        <strong
                            style="
                                color:#603319;
                                display:block;
                                margin-bottom:10px;
                            "
                        >
                            Histórico do pedido
                        </strong>


                        ${
                            historico.length

                                ? historico
                                    .map(
                                        item => `

                                            <div
                                                style="
                                                    display:flex;
                                                    justify-content:space-between;
                                                    gap:15px;
                                                    flex-wrap:wrap;
                                                    margin:8px 0;
                                                    padding:8px 10px;
                                                    background:#f6ebdd;
                                                    border-radius:8px;
                                                "
                                            >

                                                <strong
                                                    style="
                                                        color:#603319;
                                                    "
                                                >
                                                    ${statusLabel(
                                                        item.status
                                                    )}
                                                </strong>


                                                <span
                                                    style="
                                                        color:#766255;
                                                        font-size:14px;
                                                    "
                                                >
                                                    ${formatarData(
                                                        item.criado_em
                                                    )}
                                                </span>

                                            </div>

                                        `
                                    )
                                    .join("")

                                : `

                                    <p
                                        style="
                                            margin:0;
                                            color:#766255;
                                        "
                                    >
                                        Nenhum histórico registrado.
                                    </p>

                                `
                        }

                                            ${
                        pedido.status === "entregue"
                            ? `
                                <div
                                    style="
                                        margin-top:16px;
                                        padding-top:14px;
                                        border-top:1px solid #ead9c8;
                                    "
                                >

                                    ${
                                        pedido.avaliado

                                            ? `
                                                <div
                                                    style="
                                                        padding:12px;
                                                        background:#f6ebdd;
                                                        border-radius:8px;
                                                    "
                                                >

                                                    <strong
                                                        style="
                                                            color:#34723e;
                                                        "
                                                    >
                                                        ✓ Pedido avaliado
                                                    </strong>

                                                    <p
                                                        style="
                                                            margin:8px 0 4px;
                                                            color:#603319;
                                                        "
                                                    >
                                                        ${
                                                            "★".repeat(
                                                                Number(
                                                                    pedido.avaliacao?.nota || 0
                                                                )
                                                            )
                                                        }${
                                                            "☆".repeat(
                                                                5 -
                                                                Number(
                                                                    pedido.avaliacao?.nota || 0
                                                                )
                                                            )
                                                        }
                                                    </p>

                                                    <p
                                                        style="
                                                            margin:5px 0 0;
                                                            color:#766255;
                                                        "
                                                    >
                                                        ${
                                                            pedido.avaliacao?.comentario || ""
                                                        }
                                                    </p>

                                                </div>
                                            `

                                            : `
                                                <button
                                                    type="button"
                                                    class="perfil-btn perfil-btn-primary"
                                                    onclick="abrirAvaliacaoPedido(${pedido.pedido_id})"
                                                >
                                                    <i class="bi bi-star"></i>
                                                    Avaliar pedido
                                                </button>
                                            `
                                    }

                                </div>
                            `
                            : ""
                    }

                    </div>

                `;


                historicoPedidos.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "Erro ao carregar histórico:",
            error
        );


        historicoPedidos.innerHTML = `

            <p class="perfil-error">
                ${error.message}
            </p>

        `;

    }

}


/* =========================================================
   LOGOUT
   ========================================================= */

logoutButton.addEventListener(
    "click",
    () => {

        removerSessao();

        window.location.href =
            "index.html";

    }
);


/* =========================================================
   INICIAR
   ========================================================= */

carregarPerfil();

carregarHistoricoPedidos();


const listaEnderecos =
    document.getElementById("listaEnderecos");


async function carregarEnderecos() {

    const token =
        getToken();

    if (
        !listaEnderecos ||
        !token
    ) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/enderecos-usuario`,
                {
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
                "Não foi possível carregar os endereços."
            );
        }

        if (!data.length) {

            listaEnderecos.innerHTML = `
                <p>
                    Você ainda não possui endereços salvos.
                </p>
            `;

            return;
        }

        listaEnderecos.innerHTML =
            data.map(endereco => `

                <div
                    style="
                        border:1px solid #e6d4c1;
                        padding:16px;
                        border-radius:12px;
                        margin-bottom:15px;
                        background:#fffaf5;
                    "
                >

                    <strong>
                        ${endereco.apelido}
                    </strong>

                    <p style="margin:8px 0;">
                        ${endereco.rua}, ${endereco.numero}
                    </p>

                    <p style="margin:5px 0;">
                        ${endereco.bairro}
                        - CEP ${endereco.cep}
                    </p>

                    ${
                        endereco.complemento
                            ? `
                                <p style="margin:5px 0;">
                                    ${endereco.complemento}
                                </p>
                            `
                            : ""
                    }

                    <div class="perfil-actions">

                        <button
                            type="button"
                            class="perfil-btn perfil-btn-secondary"
                            onclick='editarEndereco(${JSON.stringify(endereco)})'
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            class="perfil-btn perfil-btn-logout"
                            onclick="excluirEndereco(${endereco.endereco_id})"
                        >
                            Excluir
                        </button>

                    </div>

                </div>

            `).join("");

    } catch (error) {

        console.error(
            "Erro ao carregar endereços:",
            error
        );

        listaEnderecos.innerHTML = `
            <p class="perfil-error">
                ${error.message}
            </p>
        `;
    }
}

/* =========================================================
   AÇÕES DOS ENDEREÇOS
   ========================================================= */

const adicionarEnderecoButton =
    document.getElementById("adicionarEnderecoButton");

const formEnderecoContainer =
    document.getElementById("formEnderecoContainer");

const enderecoForm =
    document.getElementById("enderecoForm");

const cancelarEnderecoButton =
    document.getElementById("cancelarEnderecoButton");

const enderecoMessage =
    document.getElementById("enderecoMessage");

    /* =========================================================
   BUSCA AUTOMÁTICA DE CEP
   ========================================================= */

const enderecoCep =
    document.getElementById("enderecoCep");

const enderecoRua =
    document.getElementById("enderecoRua");

const enderecoBairro =
    document.getElementById("enderecoBairro");


enderecoCep?.addEventListener(
    "blur",
    async () => {

        const cep =
            enderecoCep.value
                .replace(/\D/g, "");


        if (cep.length !== 8) {
            return;
        }


        try {

            const response =
                await fetch(
                    `https://viacep.com.br/ws/${cep}/json/`
                );


            const data =
                await response.json();


            if (data.erro) {

                mostrarMensagem(
                    enderecoMessage,
                    "CEP não encontrado.",
                    "perfil-error"
                );

                return;
            }


            enderecoRua.value =
                data.logradouro || "";

            enderecoBairro.value =
                data.bairro || "";


            enderecoMessage.textContent =
                "";


            document
                .getElementById("enderecoNumero")
                ?.focus();


        } catch (error) {

            console.error(
                "Erro ao buscar CEP:",
                error
            );

            mostrarMensagem(
                enderecoMessage,
                "Não foi possível consultar o CEP.",
                "perfil-error"
            );

        }

    }
);


adicionarEnderecoButton?.addEventListener(
    "click",
    () => {

        enderecoForm.reset();

        document
            .getElementById("enderecoId")
            .value = "";

        formEnderecoContainer.style.display =
            "block";

        enderecoMessage.textContent = "";

    }
);


cancelarEnderecoButton?.addEventListener(
    "click",
    () => {

        enderecoForm.reset();

        document
            .getElementById("enderecoId")
            .value = "";

        formEnderecoContainer.style.display =
            "none";

        enderecoMessage.textContent = "";

    }
);


enderecoForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const token =
            getToken();

        const enderecoId =
            document
                .getElementById("enderecoId")
                .value;


        const dados = {

            apelido:
                document
                    .getElementById("enderecoApelido")
                    .value.trim(),

            cep:
                document
                    .getElementById("enderecoCep")
                    .value.trim(),

            rua:
                document
                    .getElementById("enderecoRua")
                    .value.trim(),

            numero:
                document
                    .getElementById("enderecoNumero")
                    .value.trim(),

            bairro:
                document
                    .getElementById("enderecoBairro")
                    .value.trim(),

            complemento:
                document
                    .getElementById("enderecoComplemento")
                    .value.trim()
        };


        try {

            const url =
                enderecoId
                    ? `${API_URL}/enderecos-usuario/${enderecoId}`
                    : `${API_URL}/enderecos-usuario`;

            const method =
                enderecoId
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
                    "Não foi possível salvar o endereço."
                );
            }


            mostrarMensagem(
                enderecoMessage,
                data.message,
                "perfil-success"
            );


            await carregarEnderecos();


            enderecoForm.reset();

            document
                .getElementById("enderecoId")
                .value = "";


            setTimeout(() => {

                formEnderecoContainer.style.display =
                    "none";

            }, 600);


        } catch (error) {

            mostrarMensagem(
                enderecoMessage,
                error.message,
                "perfil-error"
            );

        }

    }
);


window.editarEndereco =
    function (endereco) {

        document
            .getElementById("enderecoId")
            .value =
            endereco.endereco_id;

        document
            .getElementById("enderecoApelido")
            .value =
            endereco.apelido || "";

        document
            .getElementById("enderecoCep")
            .value =
            endereco.cep || "";

        document
            .getElementById("enderecoRua")
            .value =
            endereco.rua || "";

        document
            .getElementById("enderecoNumero")
            .value =
            endereco.numero || "";

        document
            .getElementById("enderecoBairro")
            .value =
            endereco.bairro || "";

        document
            .getElementById("enderecoComplemento")
            .value =
            endereco.complemento || "";


        formEnderecoContainer.style.display =
            "block";

        enderecoMessage.textContent = "";

    };


window.excluirEndereco =
    async function (enderecoId) {

        const token =
            getToken();


        const confirmar =
            confirm(
                "Deseja excluir este endereço?"
            );


        if (!confirmar) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/enderecos-usuario/${enderecoId}`,
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
                    "Não foi possível excluir o endereço."
                );
            }


            await carregarEnderecos();


        } catch (error) {

            alert(
                error.message
            );

        }

    };

    /* =========================================================
   AVALIAR PEDIDO
   ========================================================= */

   const avaliacaoComentario =
    document.getElementById(
        "avaliacaoComentario"
    );

const contadorAvaliacao =
    document.getElementById(
        "contadorAvaliacao"
    );


avaliacaoComentario
    ?.addEventListener(
        "input",
        () => {

            if (contadorAvaliacao) {

                contadorAvaliacao.textContent =
                    `${avaliacaoComentario.value.length}/150`;

            }

        }
    );

let pedidoAvaliacaoId =
    null;


window.abrirAvaliacaoPedido =
    function (pedidoId) {

        pedidoAvaliacaoId =
            pedidoId;


        const modal =
            document.getElementById(
                "avaliacaoModal"
            );


        const numeroPedido =
            document.getElementById(
                "avaliacaoPedidoNumero"
            );


        const nota =
            document.getElementById(
                "avaliacaoNota"
            );


        const comentario =
            document.getElementById(
                "avaliacaoComentario"
            );


        const mensagem =
            document.getElementById(
                "avaliacaoMessage"
            );


        if (numeroPedido) {

            numeroPedido.textContent =
                `Pedido #${pedidoId}`;

        }


        if (nota) {

            nota.value =
                "";

        }


        if (comentario) {

            comentario.value =
                "";

        }


        if (mensagem) {

            mensagem.textContent =
                "";

            mensagem.className =
                "perfil-message";

        }


        if (modal) {

            modal.style.display =
                "flex";

        }

    };


const cancelarAvaliacaoButton =
    document.getElementById(
        "cancelarAvaliacaoButton"
    );


cancelarAvaliacaoButton
    ?.addEventListener(
        "click",
        () => {

            const modal =
                document.getElementById(
                    "avaliacaoModal"
                );


            if (modal) {

                modal.style.display =
                    "none";

            }


            pedidoAvaliacaoId =
                null;

        }
    );

    const enviarAvaliacaoButton =
    document.getElementById(
        "enviarAvaliacaoButton"
    );


enviarAvaliacaoButton
    ?.addEventListener(
        "click",
        async () => {

            const token =
                getToken();


            const nota =
                document.getElementById(
                    "avaliacaoNota"
                )?.value;


            const comentario =
                document.getElementById(
                    "avaliacaoComentario"
                )?.value.trim();


            const mensagem =
                document.getElementById(
                    "avaliacaoMessage"
                );


            if (!pedidoAvaliacaoId) {

                return;

            }


            if (!nota) {

                mostrarMensagem(
                    mensagem,
                    "Selecione uma nota.",
                    "perfil-error"
                );

                return;

            }


            if (!comentario) {

                mostrarMensagem(
                    mensagem,
                    "Escreva um comentário sobre o pedido.",
                    "perfil-error"
                );

                return;

            }


            try {

                enviarAvaliacaoButton.disabled =
                    true;


                mostrarMensagem(
                    mensagem,
                    "Enviando avaliação..."
                );


                const response =
                    await fetch(
                        `${API_URL}/pedidos/${pedidoAvaliacaoId}/avaliacao`,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify({

                                    nota:
                                        Number(nota),

                                    comentario

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Não foi possível enviar a avaliação."
                    );

                }


                mostrarMensagem(
                    mensagem,
                    "Avaliação enviada com sucesso!",
                    "perfil-success"
                );


                setTimeout(
                    async () => {

                        const modal =
                            document.getElementById(
                                "avaliacaoModal"
                            );


                        if (modal) {

                            modal.style.display =
                                "none";

                        }


                        pedidoAvaliacaoId =
                            null;


                        await carregarHistoricoPedidos();

                    },
                    700
                );


            } catch (error) {

                mostrarMensagem(
                    mensagem,
                    error.message,
                    "perfil-error"
                );


            } finally {

                enviarAvaliacaoButton.disabled =
                    false;

            }

        }
    );

carregarEnderecos();

