const API_URL = "https://gscoffee-backend.onrender.com";

const token =
    localStorage.getItem("gscoffee_token");

const list =
    document.getElementById("orders-list");

const message =
    document.getElementById("message");


/* =========================================================
   FORMATAR DINHEIRO
   ========================================================= */

function money(valor) {

    return `R$ ${Number(valor)
        .toFixed(2)
        .replace(".", ",")}`;

}


/* =========================================================
   FORMATAR DATA
   ========================================================= */

function formatarData(data) {

    if (!data) {
        return "-";
    }

    return new Date(
        data
    ).toLocaleString(
        "pt-BR",
        {
            dateStyle: "short",
            timeStyle: "short"
        }
    );

}


/* =========================================================
   NOME DOS STATUS
   ========================================================= */

function statusLabel(status) {

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
   FORMA DE PAGAMENTO
   ========================================================= */

function pagamentoLabel(pagamento) {

    const labels = {

        pix:
            "PIX",

        dinheiro:
            "Dinheiro",

        cartao:
            "Cartão",

        credito:
            "Cartão de crédito",

        debito:
            "Cartão de débito"

    };

    return (
        labels[pagamento] ||
        pagamento ||
        "Não informado"
    );

}


/* =========================================================
   MENSAGENS
   ========================================================= */

function show(
    msg,
    tipo = ""
) {

    let classe = "muted";

    if (tipo === "success") {
        classe = "success";
    }

    if (tipo === "error") {
        classe = "error";
    }

    message.innerHTML = `
        <p class="${classe}">
            ${msg}
        </p>
    `;

}


/* =========================================================
   CARREGAR PEDIDOS
   ========================================================= */

async function load() {

    if (!token) {

        show(
    "Faça login como administrador para acessar os pedidos.",
    "error"
);

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/pedidos`,
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
                "Não foi possível carregar os pedidos."
            );

        }


        render(
            data.pedidos || []
        );


    } catch (error) {

        show(
            error.message,
            true
        );

    }

}


/* =========================================================
   RENDERIZAR PEDIDOS
   ========================================================= */

function render(
    orders
) {

    if (!orders.length) {

        list.innerHTML = `
            <p class="muted">
                Nenhum pedido ainda.
            </p>
        `;

        return;

    }


    list.innerHTML =
        orders
            .map(
                pedido => {

                    const itens =
                        pedido.itens || [];

                    const historico =
                        pedido.historico || [];


                    return `

                        <article class="order">


                            <!-- CABEÇALHO -->

                            <div class="row">

                                <div>

                                    <h2>
                                        Pedido #${pedido.pedido_id}
                                    </h2>

                                    <p>
                                        ${pedido.cliente_nome}
                                        ·
                                        ${pedido.cliente_email}
                                    </p>

                                </div>


                                <strong>
                                    ${money(
                                        pedido.total
                                    )}
                                </strong>

                            </div>


                            <!-- ITENS -->

                            <div class="items">

                                ${
                                    itens
                                        .map(
                                            item => `

                                                <div>

                                                    ${item.quantidade}x
                                                    ${item.nome}

                                                    —

                                                    ${money(
                                                        item.quantidade *
                                                        item.preco_unitario
                                                    )}

                                                </div>

                                            `
                                        )
                                        .join("")
                                }


                                <hr>


                                <!-- ENDEREÇO -->

                                <div>

                                    <strong>
                                        Entrega:
                                    </strong>

                                    ${pedido.endereco.rua},
                                    ${pedido.endereco.numero}
                                    -
                                    ${pedido.endereco.bairro}

                                    · CEP
                                    ${pedido.endereco.cep}

                                </div>


                                <!-- PAGAMENTO -->

                                <div
                                    style="
                                        margin-top:12px;
                                        padding:10px 12px;
                                        background:#f6ebdd;
                                        border-radius:8px;
                                    "
                                >

                                    <strong>
                                        Forma de pagamento:
                                    </strong>

                                    ${pagamentoLabel(
                                        pedido.pagamento
                                    )}

                                </div>

                            </div>


                            <!-- HISTÓRICO -->

                            <div
                                style="
                                    margin-top:18px;
                                    padding:15px;
                                    background:#fffaf5;
                                    border:1px solid #ead9c8;
                                    border-radius:10px;
                                "
                            >

                                <strong
                                    style="
                                        display:block;
                                        margin-bottom:12px;
                                        color:#603319;
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
                                                            padding:8px 0;
                                                            border-bottom:1px solid #ead9c8;
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
                                                            class="muted"
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

                                            <p class="muted">
                                                Nenhum histórico registrado.
                                            </p>

                                        `
                                }

                            </div>


                            <!-- STATUS ATUAL -->

                            <div
                                class="row"
                                style="
                                    margin-top:18px;
                                "
                            >

                                <span class="muted">

                                    Pedido criado em:

                                    ${formatarData(
                                        pedido.criado_em
                                    )}

                                </span>


                                <div>

                                    <select
                                        class="status"
                                        data-id="${pedido.pedido_id}"
                                    >

                                        <option
                                            value="recebido"
                                            ${
                                                pedido.status === "recebido"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            Pedido recebido
                                        </option>


                                        <option
                                            value="preparando"
                                            ${
                                                pedido.status === "preparando"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            Em preparo
                                        </option>


                                        <option
                                            value="saiu_entrega"
                                            ${
                                                pedido.status === "saiu_entrega"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            Saiu para entrega
                                        </option>


                                        <option
                                            value="entregue"
                                            ${
                                                pedido.status === "entregue"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            Entregue
                                        </option>


                                        <option
                                            value="cancelado"
                                            ${
                                                pedido.status === "cancelado"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            Cancelado
                                        </option>

                                    </select>


                                    <button
                                        class="btn update"
                                        data-id="${pedido.pedido_id}"
                                    >
                                        Atualizar
                                    </button>

                                </div>

                            </div>


                        </article>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   ATUALIZAR STATUS
   ========================================================= */

list.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                ".update"
            );


        if (!button) {
            return;
        }


        const pedidoId =
            button.dataset.id;


        const select =
            document.querySelector(
                `.status[data-id="${pedidoId}"]`
            );


        try {

            button.disabled =
                true;


            button.textContent =
                "Atualizando...";


            const response =
                await fetch(
                    `${API_URL}/pedidos/${pedidoId}/status`,
                    {

                        method:
                            "PATCH",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify({

                                status:
                                    select.value

                            })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Não foi possível atualizar o status."
                );

            }


            show(
    "Status atualizado com sucesso!",
    "success"
);


            await load();


        } catch (error) {

            show(
    error.message,
    "error"
);


        } finally {

            button.disabled =
                false;


            button.textContent =
                "Atualizar";

        }

    }
);


/* =========================================================
   INICIAR
   ========================================================= */

load();