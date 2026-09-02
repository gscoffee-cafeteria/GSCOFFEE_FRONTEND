const API_URL = "https://gscoffee-backend.onrender.com";


/* =========================================================
   ELEMENTOS PRINCIPAIS
   ========================================================= */

const form =
    document.getElementById("configForm");

const saveButton =
    document.getElementById("saveButton");

const mensagem =
    document.getElementById("configMessage");


/* =========================================================
   MÍDIA DO HERO
   ========================================================= */

const heroTipoMidia =
    document.getElementById("heroTipoMidia");

const heroArquivo =
    document.getElementById("heroArquivo");

const heroPreview =
    document.getElementById("heroPreview");


let heroMidiaAtual = "";
let heroTipoAtual = "imagem";
let previewObjectUrl = null;


/* =========================================================
   CONTATOS
   ========================================================= */

const contactTipo =
    document.getElementById("contactTipo");

const contactNome =
    document.getElementById("contactNome");

const contactValor =
    document.getElementById("contactValor");

const addContactButton =
    document.getElementById("addContactButton");

const contactsList =
    document.getElementById("contactsList");

const contactMessage =
    document.getElementById("contactMessage");


let editingContactId = null;


/* =========================================================
   ENDEREÇOS
   ========================================================= */

const addressNome =
    document.getElementById("addressNome");

const addressValor =
    document.getElementById("addressValor");

const addressHorarioSegSab =
    document.getElementById("addressHorarioSegSab");

const addressHorarioDomingo =
    document.getElementById("addressHorarioDomingo");

const addressHorarioFeriado =
    document.getElementById("addressHorarioFeriado");

const addAddressButton =
    document.getElementById("addAddressButton");

const addressesList =
    document.getElementById("addressesList");

const addressMessage =
    document.getElementById("addressMessage");


let editingAddressId = null;

const modalExcluirContato =
    document.getElementById("modalExcluirContato");

const cancelarExclusaoContato =
    document.getElementById("cancelarExclusaoContato");

const confirmarExclusaoContato =
    document.getElementById("confirmarExclusaoContato");

let contatoExcluindoId = null;


const modalExcluirEndereco =
    document.getElementById("modalExcluirEndereco");

const cancelarExclusaoEndereco =
    document.getElementById("cancelarExclusaoEndereco");

const confirmarExclusaoEndereco =
    document.getElementById("confirmarExclusaoEndereco");

let enderecoExcluindoId = null;


/* =========================================================
   TOKEN
   ========================================================= */

function getToken() {

    return (
        localStorage.getItem("token") ||
        localStorage.getItem("gscoffee_token")
    );

}


/* =========================================================
   MENSAGENS
   ========================================================= */

function mostrarMensagem(
    texto,
    tipo = ""
) {

    if (!mensagem) return;

    mensagem.textContent =
        texto;

    mensagem.className =
        tipo;

}


function mostrarMensagemContato(
    texto,
    tipo = ""
) {

    if (!contactMessage) return;

    contactMessage.textContent =
        texto;

    contactMessage.className =
        tipo;

}


function mostrarMensagemEndereco(
    texto,
    tipo = ""
) {

    if (!addressMessage) return;

    addressMessage.textContent =
        texto;

    addressMessage.className =
        tipo;

}


/* =========================================================
   ESCAPAR HTML
   ========================================================= */

function escaparHTML(valor) {

    return String(valor || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   CONFIGURAR TIPO DE ARQUIVO
   ========================================================= */

function configurarAcceptHero(tipo) {

    if (!heroArquivo) return;


    if (tipo === "video") {

        heroArquivo.accept =
            "video/mp4,video/webm,video/ogg";

    } else {

        heroArquivo.accept =
            "image/jpeg,image/png,image/webp,image/gif";

    }

}


/* =========================================================
   MOSTRAR PRÉVIA DA MÍDIA
   ========================================================= */

function mostrarPreviewHero(
    arquivoOuUrl,
    tipo
) {

    if (!heroPreview) return;


    if (previewObjectUrl) {

        URL.revokeObjectURL(
            previewObjectUrl
        );

        previewObjectUrl =
            null;

    }


    heroPreview.innerHTML =
        "";


    if (!arquivoOuUrl) {

        heroPreview.innerHTML = `
            <p
                style="
                    color: #766255;
                    margin: 0;
                "
            >
                Nenhuma mídia selecionada.
            </p>
        `;

        return;

    }


    let url =
        arquivoOuUrl;


    if (
        arquivoOuUrl instanceof File
    ) {

        previewObjectUrl =
            URL.createObjectURL(
                arquivoOuUrl
            );

        url =
            previewObjectUrl;

    }


    if (tipo === "video") {

        const video =
            document.createElement(
                "video"
            );

        video.src =
            url;

        video.controls =
            true;

        video.muted =
            true;

        video.style.width =
            "100%";

        video.style.maxWidth =
            "500px";

        video.style.maxHeight =
            "320px";

        video.style.objectFit =
            "cover";

        video.style.borderRadius =
            "12px";

        video.style.display =
            "block";


        heroPreview.appendChild(
            video
        );

    } else {

        const imagem =
            document.createElement(
                "img"
            );

        imagem.src =
            url;

        imagem.alt =
            "Prévia da imagem do hero";

        imagem.style.width =
            "100%";

        imagem.style.maxWidth =
            "500px";

        imagem.style.maxHeight =
            "320px";

        imagem.style.objectFit =
            "cover";

        imagem.style.borderRadius =
            "12px";

        imagem.style.display =
            "block";


        heroPreview.appendChild(
            imagem
        );

    }

}


/* =========================================================
   ALTERAR TIPO DE MÍDIA
   ========================================================= */

heroTipoMidia?.addEventListener(
    "change",
    () => {

        const tipo =
            heroTipoMidia.value;


        configurarAcceptHero(
            tipo
        );


        if (heroArquivo) {

            heroArquivo.value =
                "";

        }


        if (
            heroMidiaAtual &&
            tipo === heroTipoAtual
        ) {

            mostrarPreviewHero(
                `${API_URL}${heroMidiaAtual}`,
                heroTipoAtual
            );

        } else {

            mostrarPreviewHero(
                "",
                tipo
            );

        }

    }
);


/* =========================================================
   ESCOLHER ARQUIVO DO COMPUTADOR
   ========================================================= */

heroArquivo?.addEventListener(
    "change",
    () => {

        const arquivo =
            heroArquivo.files[0];


        if (!arquivo) {

            if (heroMidiaAtual) {

                mostrarPreviewHero(
                    `${API_URL}${heroMidiaAtual}`,
                    heroTipoAtual
                );

            } else {

                mostrarPreviewHero(
                    "",
                    heroTipoMidia?.value || "imagem"
                );

            }

            return;

        }


        const tipoSelecionado =
            heroTipoMidia?.value ||
            "imagem";


        if (
            tipoSelecionado === "imagem" &&
            !arquivo.type.startsWith("image/")
        ) {

            mostrarMensagem(
                "Escolha um arquivo de imagem.",
                "error"
            );

            heroArquivo.value =
                "";

            return;

        }


        if (
            tipoSelecionado === "video" &&
            !arquivo.type.startsWith("video/")
        ) {

            mostrarMensagem(
                "Escolha um arquivo de vídeo.",
                "error"
            );

            heroArquivo.value =
                "";

            return;

        }


        mostrarMensagem("");


        mostrarPreviewHero(
            arquivo,
            tipoSelecionado
        );

    }
);


/* =========================================================
   CARREGAR CONFIGURAÇÕES GERAIS
   ========================================================= */

async function carregarConfiguracoes() {

    try {

        mostrarMensagem(
            "Carregando informações..."
        );


        const response =
            await fetch(
                `${API_URL}/configuracoes`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Erro ao carregar configurações"
            );

        }


        document.getElementById(
            "heroTitulo"
        ).value =
            data.hero_titulo || "";


        document.getElementById(
            "heroSubtitulo"
        ).value =
            data.hero_subtitulo || "";


        document.getElementById(
            "heroTexto"
        ).value =
            data.hero_texto || "";


        document.getElementById(
            "formasPagamento"
        ).value =
            data.formas_pagamento || "";


        /* ================================================
           DESCOBRIR SE O HERO ATUAL É FOTO OU VÍDEO
           ================================================ */

        if (data.hero_video) {

            heroTipoAtual =
                "video";

            heroMidiaAtual =
                data.hero_video;

        } else if (data.hero_imagem) {

            heroTipoAtual =
                "imagem";

            heroMidiaAtual =
                data.hero_imagem;

        } else {

            heroTipoAtual =
                "imagem";

            heroMidiaAtual =
                "";

        }


        if (heroTipoMidia) {

            heroTipoMidia.value =
                heroTipoAtual;

        }


        configurarAcceptHero(
            heroTipoAtual
        );


        if (heroMidiaAtual) {

            mostrarPreviewHero(
                `${API_URL}${heroMidiaAtual}`,
                heroTipoAtual
            );

        } else {

            mostrarPreviewHero(
                "",
                heroTipoAtual
            );

        }


        mostrarMensagem("");


    } catch (error) {

        console.error(
            "Erro ao carregar configurações:",
            error
        );


        mostrarMensagem(
            "Não foi possível carregar as configurações.",
            "error"
        );

    }

}


/* =========================================================
   ENVIAR FOTO OU VÍDEO
   ========================================================= */

async function enviarMidiaHero(
    token
) {

    const arquivo =
        heroArquivo?.files?.[0];


    if (!arquivo) {

        return null;

    }


    const formData =
        new FormData();


    formData.append(
        "heroArquivo",
        arquivo
    );


    const response =
        await fetch(
            `${API_URL}/configuracoes/hero-upload`,
            {

                method: "POST",

                headers: {

                    Authorization:
                        `Bearer ${token}`

                },

                body:
                    formData

            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Não foi possível enviar a mídia."
        );

    }


    return data;

}


/* =========================================================
   SALVAR CONFIGURAÇÕES GERAIS
   ========================================================= */

form?.addEventListener(
    "submit",
    async (event) => {

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


        const configuracoes = {

            hero_titulo:
                document
                    .getElementById(
                        "heroTitulo"
                    )
                    .value
                    .trim(),

            hero_subtitulo:
                document
                    .getElementById(
                        "heroSubtitulo"
                    )
                    .value
                    .trim(),

            hero_texto:
                document
                    .getElementById(
                        "heroTexto"
                    )
                    .value
                    .trim(),

            formas_pagamento:
                document
                    .getElementById(
                        "formasPagamento"
                    )
                    .value
                    .trim()

        };


        try {

            saveButton.disabled =
                true;


            mostrarMensagem(
                "Salvando alterações..."
            );


            /* =============================================
               SALVAR TEXTOS E CONFIGURAÇÕES
               ============================================= */

            const response =
                await fetch(
                    `${API_URL}/configuracoes`,
                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify(
                                configuracoes
                            )

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Erro ao salvar configurações"
                );

            }


            /* =============================================
               SE ESCOLHEU FOTO/VÍDEO, FAZER UPLOAD
               ============================================= */

            if (
                heroArquivo?.files?.length
            ) {

                mostrarMensagem(
                    "Enviando foto/vídeo..."
                );


                const resultadoUpload =
                    await enviarMidiaHero(
                        token
                    );


                if (resultadoUpload) {

                    heroTipoAtual =
                        resultadoUpload.tipo;


                    heroMidiaAtual =
                        resultadoUpload.caminho;


                    if (heroTipoMidia) {

                        heroTipoMidia.value =
                            heroTipoAtual;

                    }


                    configurarAcceptHero(
                        heroTipoAtual
                    );


                    heroArquivo.value =
                        "";


                    mostrarPreviewHero(
                        `${API_URL}${heroMidiaAtual}`,
                        heroTipoAtual
                    );

                }

            }


            mostrarMensagem(
                "Configurações salvas com sucesso!",
                "success"
            );


        } catch (error) {

            console.error(
                "Erro ao salvar configurações:",
                error
            );


            mostrarMensagem(
                error.message ||
                "Não foi possível salvar as alterações.",
                "error"
            );


        } finally {

            saveButton.disabled =
                false;

        }

    }
);


/* =========================================================
   NOMES DOS TIPOS DE CONTATO
   ========================================================= */

function getTipoLabel(tipo) {

    const labels = {

        telefone:
            "📞 Telefone",

        whatsapp:
            "💬 WhatsApp",

        instagram:
            "📷 Instagram",

        facebook:
            "📘 Facebook",

        twitter:
            "𝕏 Twitter / X",

        tiktok:
            "🎵 TikTok",

        youtube:
            "▶️ YouTube",

        outro:
            "🔗 Outro"

    };


    return (
        labels[tipo] ||
        tipo
    );

}


/* =========================================================
   CARREGAR CONTATOS
   ========================================================= */

async function carregarContatos() {

    if (!contactsList) return;


    try {

        const response =
            await fetch(
                `${API_URL}/contatos`
            );


        const contatos =
            await response.json();


        if (!response.ok) {

            throw new Error(
                "Não foi possível carregar os contatos."
            );

        }


        contactsList.innerHTML =
            "";


        if (!contatos.length) {

            contactsList.innerHTML = `
                <p class="contact-empty">
                    Nenhum contato cadastrado.
                </p>
            `;

            return;

        }


        contatos.forEach(
            contato => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "contact-item";


                const tipo =
                    escaparHTML(
                        getTipoLabel(
                            contato.tipo
                        )
                    );


                const nome =
                    escaparHTML(
                        contato.nome
                    );


                const valor =
                    escaparHTML(
                        contato.valor
                    );


                item.innerHTML = `
                    <div class="contact-info">

                        <strong>
                            ${tipo}
                        </strong>

                        ${
                            nome
                                ? `
                                    <span>
                                        ${nome}
                                    </span>
                                `
                                : ""
                        }

                        <span>
                            ${valor}
                        </span>

                    </div>


                    <div class="contact-actions">

                        <button
                            type="button"
                            class="contact-edit"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="contact-delete"
                        >
                            Excluir
                        </button>

                    </div>
                `;


                item
                    .querySelector(
                        ".contact-edit"
                    )
                    .addEventListener(
                        "click",
                        () =>
                            iniciarEdicaoContato(
                                contato
                            )
                    );


                item
                    .querySelector(
                        ".contact-delete"
                    )
                    .addEventListener(
                        "click",
                        () =>
                            excluirContato(
                                contato.contato_id
                            )
                    );


                contactsList.appendChild(
                    item
                );

            }
        );


    } catch (error) {

        console.error(
            "Erro ao carregar contatos:",
            error
        );


        contactsList.innerHTML = `
            <p class="error">
                Não foi possível carregar os contatos.
            </p>
        `;

    }

}


/* =========================================================
   CADASTRAR / EDITAR CONTATO
   ========================================================= */

addContactButton?.addEventListener(
    "click",
    async () => {

        const token =
            getToken();


        if (!token) {

            mostrarMensagemContato(
                "Sessão expirada. Faça login novamente.",
                "error"
            );

            return;

        }


        const tipo =
            contactTipo.value;


        const nome =
            contactNome.value.trim();


        const valor =
            contactValor.value.trim();


        if (!valor) {

            mostrarMensagemContato(
                "Digite o número, usuário ou link.",
                "error"
            );

            return;

        }


        const payload = {

            tipo,
            nome,
            valor,
            ativo: 1

        };


        try {

            addContactButton.disabled =
                true;


            mostrarMensagemContato(
                editingContactId
                    ? "Salvando alteração..."
                    : "Adicionando contato..."
            );


            let url =
                `${API_URL}/contatos`;


            let method =
                "POST";


            if (editingContactId) {

                url =
                    `${API_URL}/contatos/${editingContactId}`;

                method =
                    "PUT";

            }


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
                            JSON.stringify(
                                payload
                            )

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Não foi possível salvar o contato."
                );

            }


            mostrarMensagemContato(
                editingContactId
                    ? "Contato atualizado com sucesso!"
                    : "Contato adicionado com sucesso!",
                "success"
            );


            limparFormularioContato();


            await carregarContatos();


        } catch (error) {

            console.error(
                "Erro ao salvar contato:",
                error
            );


            mostrarMensagemContato(
                error.message,
                "error"
            );


        } finally {

            addContactButton.disabled =
                false;

        }

    }
);


/* =========================================================
   EDITAR CONTATO
   ========================================================= */

function iniciarEdicaoContato(
    contato
) {

    editingContactId =
        contato.contato_id;


    contactTipo.value =
        contato.tipo;


    contactNome.value =
        contato.nome || "";


    contactValor.value =
        contato.valor;


    addContactButton.textContent =
        "Salvar alteração";


    mostrarMensagemContato(
        "Editando contato..."
    );


    contactValor.focus();

}


/* =========================================================
   LIMPAR FORMULÁRIO DE CONTATO
   ========================================================= */

function limparFormularioContato() {

    editingContactId =
        null;


    contactTipo.value =
        "telefone";


    contactNome.value =
        "";


    contactValor.value =
        "";


    addContactButton.textContent =
        "+ Adicionar contato";

}


/* =========================================================
   EXCLUIR CONTATO
   ========================================================= */

async function excluirContato(
    contatoId
) {

    contatoExcluindoId =
        contatoId;

    modalExcluirContato.classList.add(
        "ativo"
    );

}


/* =========================================================
   CARREGAR ENDEREÇOS
   ========================================================= */

async function carregarEnderecos() {

    if (!addressesList) return;


    try {

        const response =
            await fetch(
                `${API_URL}/enderecos`
            );


        const enderecos =
            await response.json();


        if (!response.ok) {

            throw new Error(
                "Não foi possível carregar os endereços."
            );

        }


        addressesList.innerHTML =
            "";


        if (!enderecos.length) {

            addressesList.innerHTML = `
                <p class="contact-empty">
                    Nenhum endereço cadastrado.
                </p>
            `;

            return;

        }


        enderecos.forEach(
            unidade => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "contact-item";


                const nome =
                    escaparHTML(
                        unidade.nome ||
                        "Unidade GS Coffee"
                    );


                const endereco =
                    escaparHTML(
                        unidade.endereco
                    );


                const segSab =
                    escaparHTML(
                        unidade.horario_seg_sab ||
                        "Não informado"
                    );


                const domingo =
                    escaparHTML(
                        unidade.horario_domingo ||
                        "Não informado"
                    );


                const feriado =
                    escaparHTML(
                        unidade.horario_feriado ||
                        "Não informado"
                    );


                item.innerHTML = `
                    <div class="contact-info">

                        <strong>
                            📍 ${nome}
                        </strong>

                        <span>
                            ${endereco}
                        </span>

                        <span>
                            <b>Segunda a sábado:</b>
                            ${segSab}
                        </span>

                        <span>
                            <b>Domingo:</b>
                            ${domingo}
                        </span>

                        <span>
                            <b>Feriados:</b>
                            ${feriado}
                        </span>

                    </div>


                    <div class="contact-actions">

                        <button
                            type="button"
                            class="address-edit contact-edit"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="address-delete contact-delete"
                        >
                            Excluir
                        </button>

                    </div>
                `;


                item
                    .querySelector(
                        ".address-edit"
                    )
                    .addEventListener(
                        "click",
                        () =>
                            iniciarEdicaoEndereco(
                                unidade
                            )
                    );


                item
                    .querySelector(
                        ".address-delete"
                    )
                    .addEventListener(
                        "click",
                        () =>
                            excluirEndereco(
                                unidade.endereco_id
                            )
                    );


                addressesList.appendChild(
                    item
                );

            }
        );


    } catch (error) {

        console.error(
            "Erro ao carregar endereços:",
            error
        );


        addressesList.innerHTML = `
            <p class="error">
                Não foi possível carregar os endereços.
            </p>
        `;

    }

}


/* =========================================================
   CADASTRAR / EDITAR ENDEREÇO
   ========================================================= */

addAddressButton?.addEventListener(
    "click",
    async () => {

        const token =
            getToken();


        if (!token) {

            mostrarMensagemEndereco(
                "Sessão expirada. Faça login novamente.",
                "error"
            );

            return;

        }


        const nome =
            addressNome.value.trim();


        const endereco =
            addressValor.value.trim();


        const horario_seg_sab =
            addressHorarioSegSab.value.trim();


        const horario_domingo =
            addressHorarioDomingo.value.trim();


        const horario_feriado =
            addressHorarioFeriado.value.trim();


        if (!endereco) {

            mostrarMensagemEndereco(
                "Digite o endereço da unidade.",
                "error"
            );


            addressValor.focus();

            return;

        }


        const payload = {

            nome,

            endereco,

            horario_seg_sab,

            horario_domingo,

            horario_feriado,

            ativo: 1

        };


        try {

            addAddressButton.disabled =
                true;


            mostrarMensagemEndereco(
                editingAddressId
                    ? "Salvando alteração..."
                    : "Adicionando endereço..."
            );


            let url =
                `${API_URL}/enderecos`;


            let method =
                "POST";


            if (editingAddressId) {

                url =
                    `${API_URL}/enderecos/${editingAddressId}`;

                method =
                    "PUT";

            }


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
                            JSON.stringify(
                                payload
                            )

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


            mostrarMensagemEndereco(
                editingAddressId
                    ? "Endereço atualizado com sucesso!"
                    : "Endereço adicionado com sucesso!",
                "success"
            );


            limparFormularioEndereco();


            await carregarEnderecos();


        } catch (error) {

            console.error(
                "Erro ao salvar endereço:",
                error
            );


            mostrarMensagemEndereco(
                error.message ||
                "Não foi possível salvar o endereço.",
                "error"
            );


        } finally {

            addAddressButton.disabled =
                false;

        }

    }
);


/* =========================================================
   EDITAR ENDEREÇO
   ========================================================= */

function iniciarEdicaoEndereco(
    unidade
) {

    editingAddressId =
        unidade.endereco_id;


    addressNome.value =
        unidade.nome || "";


    addressValor.value =
        unidade.endereco || "";


    addressHorarioSegSab.value =
        unidade.horario_seg_sab || "";


    addressHorarioDomingo.value =
        unidade.horario_domingo || "";


    addressHorarioFeriado.value =
        unidade.horario_feriado || "";


    addAddressButton.textContent =
        "Salvar alteração";


    mostrarMensagemEndereco(
        "Editando endereço..."
    );


    addressValor.focus();

}


/* =========================================================
   LIMPAR FORMULÁRIO DE ENDEREÇO
   ========================================================= */

function limparFormularioEndereco() {

    editingAddressId =
        null;


    addressNome.value =
        "";


    addressValor.value =
        "";


    addressHorarioSegSab.value =
        "";


    addressHorarioDomingo.value =
        "";


    addressHorarioFeriado.value =
        "";


    addAddressButton.textContent =
        "+ Adicionar endereço";

}


/* =========================================================
   EXCLUIR ENDEREÇO
   ========================================================= */

async function excluirEndereco(
    enderecoId
) {

    enderecoExcluindoId =
        enderecoId;

    modalExcluirEndereco.classList.add(
        "ativo"
    );

}

/* =========================================================
   MODAL - EXCLUIR CONTATO
   ========================================================== */

cancelarExclusaoContato?.addEventListener(
    "click",
    () => {

        contatoExcluindoId = null;

        modalExcluirContato.classList.remove(
            "ativo"
        );

    }
);


confirmarExclusaoContato?.addEventListener(
    "click",
    async () => {

        if (!contatoExcluindoId) {
            return;
        }


        const token =
            getToken();


        if (!token) {

            mostrarMensagemContato(
                "Sessão expirada. Faça login novamente.",
                "error"
            );

            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/contatos/${contatoExcluindoId}`,
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
                    "Não foi possível excluir o contato."
                );

            }


            if (
                String(editingContactId) ===
                String(contatoExcluindoId)
            ) {

                limparFormularioContato();

            }


            modalExcluirContato.classList.remove(
                "ativo"
            );

            contatoExcluindoId = null;


            mostrarMensagemContato(
                "Contato excluído com sucesso!",
                "success"
            );


            await carregarContatos();


        } catch (error) {

            console.error(
                "Erro ao excluir contato:",
                error
            );

            mostrarMensagemContato(
                error.message ||
                "Não foi possível excluir o contato.",
                "error"
            );

        }

    }
);


/* =========================================================
   MODAL - EXCLUIR ENDEREÇO
   ========================================================== */

cancelarExclusaoEndereco?.addEventListener(
    "click",
    () => {

        enderecoExcluindoId = null;

        modalExcluirEndereco.classList.remove(
            "ativo"
        );

    }
);


confirmarExclusaoEndereco?.addEventListener(
    "click",
    async () => {

        if (!enderecoExcluindoId) {
            return;
        }


        const token =
            getToken();


        if (!token) {

            mostrarMensagemEndereco(
                "Sessão expirada. Faça login novamente.",
                "error"
            );

            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/enderecos/${enderecoExcluindoId}`,
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


            if (
                String(editingAddressId) ===
                String(enderecoExcluindoId)
            ) {

                limparFormularioEndereco();

            }


            modalExcluirEndereco.classList.remove(
                "ativo"
            );

            enderecoExcluindoId = null;


            mostrarMensagemEndereco(
                "Endereço excluído com sucesso!",
                "success"
            );


            await carregarEnderecos();


        } catch (error) {

            console.error(
                "Erro ao excluir endereço:",
                error
            );

            mostrarMensagemEndereco(
                error.message ||
                "Não foi possível excluir o endereço.",
                "error"
            );

        }

    }
);


/* =========================================================
   INICIAR
   ========================================================= */

carregarConfiguracoes();

carregarContatos();

carregarEnderecos();

