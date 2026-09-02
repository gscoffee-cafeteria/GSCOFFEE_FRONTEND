const API_URL = "https://gscoffee-backend.onrender.com";
const form = document.getElementById("avaliacaoForm");
const lista = document.getElementById("listaAvaliacoes");

const comentarioInput =
  document.getElementById("comentario");

const contadorAvaliacao =
  document.getElementById("contadorAvaliacao");


comentarioInput?.addEventListener(
  "input",
  () => {

    if (contadorAvaliacao) {

      contadorAvaliacao.textContent =
        `${comentarioInput.value.length}/150`;

    }

  }
);

let avaliacaoEditandoId = null;

const modalExcluir =
  document.getElementById("modalExcluir");

const cancelarExclusao =
  document.getElementById("cancelarExclusao");

const confirmarExclusao =
  document.getElementById("confirmarExclusao");

let avaliacaoExcluindoId = null;

async function carregarAvaliacoes() {

  try {

    const token =
  localStorage.getItem("gscoffee_token") ||
  localStorage.getItem("token");

if (!token) {
  lista.innerHTML = `
    <p>
      Sessão administrativa não encontrada.
      Faça login novamente.
    </p>
  `;

  return;
}

const response =
  await fetch(
    `${API_URL}/avaliacoes/admin`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );

    const avaliacoes =
      await response.json();

    if (!response.ok) {
      throw new Error(
        "Erro ao carregar avaliações."
      );
    }


    lista.innerHTML = "";


    if (!avaliacoes.length) {

      lista.innerHTML = `
        <p>
          Nenhuma avaliação cadastrada.
        </p>
      `;

      return;
    }


    avaliacoes.forEach(
      avaliacao => {

        const item =
          document.createElement(
            "div"
          );

        item.className =
          "avaliacao-item";


        const notaNumero =
  Number(
    avaliacao.nota
  );


const estrelas =
  "★".repeat(
    notaNumero
  ) +
  "☆".repeat(
    5 - notaNumero
  );


        const dataAvaliacao =
  avaliacao.criado_em
    ? new Date(
        avaliacao.criado_em
      ).toLocaleString(
        "pt-BR"
      )
    : "Data não informada";


item.innerHTML = `

  <div class="estrelas">
    ${estrelas}
  </div>

  <strong>
    ${avaliacao.nome_avaliador}
  </strong>

  <p>
    ${avaliacao.comentario}
  </p>

  <small>
  Origem: ${avaliacao.origem}
</small>

<br>

<small>
  Status:
  ${
    Number(avaliacao.publicada) === 1
      ? "Publicada no site"
      : "Oculta do site"
  }
</small>

<br>

<small>
  Data: ${dataAvaliacao}
</small>

  <div class="avaliacao-acoes">

  <button
  type="button"
  class="btn-publicar"
  data-id="${avaliacao.avaliacao_id}"
>
  ${
    Number(avaliacao.publicada) === 1
      ? "Ocultar do site"
      : "Publicar no site"
  }
</button>

    <button
      type="button"
      class="btn-editar"
      data-id="${avaliacao.avaliacao_id}"
    >
      Editar
    </button>

    <button
      type="button"
      class="btn-excluir"
      data-id="${avaliacao.avaliacao_id}"
    >
      Excluir
    </button>

  </div>

`;


        lista.appendChild(
          item
        );

        const btnEditar =
  item.querySelector(
    ".btn-editar"
  );


const btnExcluir =
  item.querySelector(
    ".btn-excluir"
  );

  const btnPublicar =
  item.querySelector(
    ".btn-publicar"
  );

  btnPublicar?.addEventListener(
  "click",
  async () => {

    const token =
      localStorage.getItem("gscoffee_token") ||
      localStorage.getItem("token");

    const novoStatus =
      Number(avaliacao.publicada) === 1
        ? 0
        : 1;

    try {

      const response =
        await fetch(
          `${API_URL}/avaliacoes/${avaliacao.avaliacao_id}/publicada`,
          {
            method: "PATCH",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
              publicada: novoStatus
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Erro ao alterar publicação."
        );

      }

      await carregarAvaliacoes();

    } catch (error) {

      console.error(
        "Erro ao publicar/ocultar avaliação:",
        error
      );

    }

  }
);

btnEditar?.addEventListener(
  "click",
  () => {

    avaliacaoEditandoId =
      avaliacao.avaliacao_id;


    document.getElementById(
      "nome_avaliador"
    ).value =
      avaliacao.nome_avaliador || "";


    document.getElementById(
      "nota"
    ).value =
      avaliacao.nota;


    document.getElementById(
      "comentario"
    ).value =
      avaliacao.comentario || "";

      if (contadorAvaliacao) {
  contadorAvaliacao.textContent =
    `${comentarioInput.value.length}/150`;
}

    const botaoSalvar =
      form.querySelector(
        'button[type="submit"]'
      );


    if (botaoSalvar) {
      botaoSalvar.textContent =
        "Salvar alterações";
    }


    form.scrollIntoView({
      behavior: "smooth"
    });

  }
);


btnExcluir?.addEventListener(
  "click",
  () => {

    avaliacaoExcluindoId =
      avaliacao.avaliacao_id;

    modalExcluir.classList.add(
      "ativo"
    );

  }
);

      }
    );


  } catch (error) {

    console.error(
      "Erro:",
      error
    );

    lista.innerHTML = `
      <p>
        Não foi possível carregar as avaliações.
      </p>
    `;

  }

}

form.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    const nome_avaliador =
      document
        .getElementById("nome_avaliador")
        .value
        .trim();


    const nota =
      Number(
        document
          .getElementById("nota")
          .value
      );


    const comentario =
      document
        .getElementById("comentario")
        .value
        .trim();


    try {

      const editando =
        avaliacaoEditandoId !== null;


      const url =
        editando
          ? `${API_URL}/avaliacoes/${avaliacaoEditandoId}`
          : `${API_URL}/avaliacoes`;


      const metodo =
        editando
          ? "PUT"
          : "POST";

      const token =
        localStorage.getItem("gscoffee_token") ||
        localStorage.getItem("token");


      const response =
  await fetch(
    url,
    {
      method: metodo,

      headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`
},

      body: JSON.stringify({
        nome_avaliador,
        nota,
        comentario,
        origem: "Google"
      })
    }
  );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Erro ao salvar avaliação."
        );

      }


      const mensagem =
  document.createElement("p");

mensagem.className =
  "mensagem-sucesso";

mensagem.textContent =
  editando
    ? "Avaliação atualizada com sucesso!"
    : "Avaliação cadastrada com sucesso!";

form.after(mensagem);


      setTimeout(() => {
        mensagem.remove();
      }, 3000);


      avaliacaoEditandoId =
        null;


      form.reset();

      if (contadorAvaliacao) {
  contadorAvaliacao.textContent = "0/150";
}


      const botaoSalvar =
        form.querySelector(
          'button[type="submit"]'
        );


      if (botaoSalvar) {
        botaoSalvar.textContent =
          "Cadastrar avaliação";
      }


      await carregarAvaliacoes();


    } catch (error) {

      console.error(
        "Erro:",
        error
      );

    }

  }
);

cancelarExclusao?.addEventListener(
  "click",
  () => {

    avaliacaoExcluindoId = null;

    modalExcluir.classList.remove(
      "ativo"
    );

  }
);


confirmarExclusao?.addEventListener(
  "click",
  async () => {

    if (!avaliacaoExcluindoId) return;

    try {

      const response =
        await fetch(
          `${API_URL}/avaliacoes/${avaliacaoExcluindoId}`,
          {
            method: "DELETE"
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
          "Erro ao excluir avaliação."
        );
      }


      modalExcluir.classList.remove(
        "ativo"
      );

      avaliacaoExcluindoId = null;


      await carregarAvaliacoes();


      const mensagem =
        document.createElement("div");

      mensagem.className =
        "mensagem-sucesso";

      mensagem.textContent =
        "Avaliação excluída com sucesso!";

      lista.before(mensagem);


      setTimeout(() => {
        mensagem.remove();
      }, 3000);


    } catch (error) {

      console.error(
        "Erro ao excluir avaliação:",
        error
      );

    }

  }
);

carregarAvaliacoes();