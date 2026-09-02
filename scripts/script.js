document.addEventListener("DOMContentLoaded", () => {

  const API_URL = "https://gscoffee-backend.onrender.com";


  /* =========================================================
     CONFIGURAÇÕES DO SITE
     ========================================================= */

  async function loadSiteSettings() {

    try {

      const res = await fetch(
        `${API_URL}/configuracoes`
      );

      if (!res.ok) {
        throw new Error(
          "Não foi possível carregar as configurações."
        );
      }

      const config = await res.json();


      /* ================= HERO ================= */

      const heroTitulo =
        document.getElementById(
          "hero-titulo"
        );

      const heroSubtitulo =
        document.getElementById(
          "hero-subtitulo"
        );

      const heroTexto =
        document.getElementById(
          "hero-texto"
        );

      const heroVideo =
        document.getElementById(
          "hero-video"
        );

      const heroImagem =
        document.getElementById(
          "hero-imagem"
        );


      /* ===== TEXTOS ===== */

      if (
        heroTitulo &&
        config.hero_titulo
      ) {

        heroTitulo.textContent =
          config.hero_titulo;

      }


      if (heroSubtitulo) {

        heroSubtitulo.textContent =
          config.hero_subtitulo || "";

      }


      if (heroTexto) {

        heroTexto.textContent =
          config.hero_texto || "";

      }


      /* =========================================
         FOTO OU VÍDEO DO HERO
         ========================================= */

      if (config.hero_video) {

        if (heroVideo) {

          heroVideo.src =
            `${API_URL}${config.hero_video}`;

          heroVideo.style.display =
            "block";

          heroVideo.load();

          heroVideo
            .play()
            .catch(() => {});

        }


        if (heroImagem) {

          heroImagem.style.display =
            "none";

          heroImagem.removeAttribute(
            "src"
          );

        }

      } else if (config.hero_imagem) {

        if (heroImagem) {

          heroImagem.src =
            `${API_URL}${config.hero_imagem}`;

          heroImagem.style.display =
            "block";

        }


        if (heroVideo) {

          heroVideo.pause();

          heroVideo.style.display =
            "none";

          heroVideo.removeAttribute(
            "src"
          );

        }

      } else {

        if (heroVideo) {

          heroVideo.style.display =
            "none";

        }


        if (heroImagem) {

          heroImagem.style.display =
            "none";

        }

      }


      /* ================= FORMAS DE PAGAMENTO ================= */

      const formasPagamento =
        document.getElementById(
          "formas-pagamento-texto"
        );


      if (formasPagamento) {

        formasPagamento.textContent =
          config.formas_pagamento || "";

      }


    } catch (error) {

      console.error(
        "Erro ao carregar configurações do site:",
        error
      );

    }

  }


  /* =========================================================
     CONTATOS E REDES SOCIAIS
     ========================================================= */

  async function loadContacts() {

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


      const container =
        document.getElementById(
          "contatos-dinamicos"
        );


      if (!container) return;


      container.innerHTML = "";


      const contatosAtivos =
        contatos.filter(
          contato =>
            Number(contato.ativo) === 1
        );


      if (!contatosAtivos.length) {

        container.innerHTML = `
          <p>
            Nenhum contato disponível.
          </p>
        `;

        return;

      }


      contatosAtivos.forEach(
        contato => {

          const linha =
            document.createElement(
              "p"
            );


          const tipo =
            String(
              contato.tipo || ""
            ).toLowerCase();


          const nome =
            contato.nome || "";


          const valor =
            contato.valor || "";


          /* ================= TELEFONE ================= */

          if (tipo === "telefone") {

            linha.innerHTML = `
              <i class="bi bi-telephone"></i>

              ${
                nome
                  ? `${nome} - Telefone: `
                  : "Telefone: "
              }

              ${valor}
            `;

          }


          /* ================= WHATSAPP ================= */

          else if (tipo === "whatsapp") {

            let numero =
              valor.replace(
                /\D/g,
                ""
              );


            if (
              numero.length === 10 ||
              numero.length === 11
            ) {

              numero =
                `55${numero}`;

            }


            linha.innerHTML = `
              <a
                href="https://wa.me/${numero}"
                target="_blank"
                rel="noopener noreferrer"
              >

                <i class="bi bi-whatsapp"></i>

                ${
                  nome
                    ? `${nome} - WhatsApp: `
                    : "WhatsApp: "
                }

                ${valor}

              </a>
            `;

          }


          /* ================= INSTAGRAM ================= */

          else if (tipo === "instagram") {

            const usuario =
              valor
                .replace(
                  /^https?:\/\/(www\.)?instagram\.com\//i,
                  ""
                )
                .replace(
                  "@",
                  ""
                )
                .replace(
                  /\/$/,
                  ""
                );


            linha.innerHTML = `
              <a
                href="https://www.instagram.com/${usuario}"
                target="_blank"
                rel="noopener noreferrer"
              >

                <i class="bi bi-instagram"></i>

                ${
                  nome
                    ? `${nome} - Instagram: `
                    : "Instagram: "
                }

                ${valor}

              </a>
            `;

          }


          /* ================= FACEBOOK ================= */

          else if (tipo === "facebook") {

            const link =
              valor.startsWith("http")
                ? valor
                : `https://www.facebook.com/${valor.replace("@", "")}`;


            linha.innerHTML = `
              <a
                href="${link}"
                target="_blank"
                rel="noopener noreferrer"
              >

                <i class="bi bi-facebook"></i>

                ${
                  nome
                    ? `${nome} - Facebook: `
                    : "Facebook: "
                }

                ${valor}

              </a>
            `;

          }


          /* ================= TWITTER / X ================= */

          else if (
            tipo === "twitter" ||
            tipo === "x"
          ) {

            const usuario =
              valor
                .replace(
                  /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//i,
                  ""
                )
                .replace(
                  "@",
                  ""
                )
                .replace(
                  /\/$/,
                  ""
                );


            linha.innerHTML = `
              <a
                href="https://x.com/${usuario}"
                target="_blank"
                rel="noopener noreferrer"
              >

                <i class="bi bi-twitter-x"></i>

                ${
                  nome
                    ? `${nome} - X / Twitter: `
                    : "X / Twitter: "
                }

                ${valor}

              </a>
            `;

          }


          /* ================= TIKTOK ================= */

          else if (tipo === "tiktok") {

            const usuario =
              valor
                .replace(
                  /^https?:\/\/(www\.)?tiktok\.com\/@?/i,
                  ""
                )
                .replace(
                  "@",
                  ""
                )
                .replace(
                  /\/$/,
                  ""
                );


            linha.innerHTML = `
              <a
                href="https://www.tiktok.com/@${usuario}"
                target="_blank"
                rel="noopener noreferrer"
              >

                <i class="bi bi-tiktok"></i>

                ${
                  nome
                    ? `${nome} - TikTok: `
                    : "TikTok: "
                }

                ${valor}

              </a>
            `;

          }


          /* ================= YOUTUBE ================= */

          else if (tipo === "youtube") {

            const link =
              valor.startsWith("http")
                ? valor
                : `https://www.youtube.com/${valor}`;


            linha.innerHTML = `
              <a
                href="${link}"
                target="_blank"
                rel="noopener noreferrer"
              >

                <i class="bi bi-youtube"></i>

                ${
                  nome
                    ? `${nome} - YouTube: `
                    : "YouTube: "
                }

                ${valor}

              </a>
            `;

          }


          /* ================= OUTROS ================= */

          else {

            if (
              valor.startsWith("http")
            ) {

              linha.innerHTML = `
                <a
                  href="${valor}"
                  target="_blank"
                  rel="noopener noreferrer"
                >

                  <i class="bi bi-link-45deg"></i>

                  ${
                    nome
                      ? `${nome}: `
                      : ""
                  }

                  ${valor}

                </a>
              `;

            } else {

              linha.innerHTML = `
                <i class="bi bi-link-45deg"></i>

                ${
                  nome
                    ? `${nome}: `
                    : ""
                }

                ${valor}
              `;

            }

          }


          container.appendChild(
            linha
          );

        }
      );


    } catch (error) {

      console.error(
        "Erro ao carregar contatos:",
        error
      );

    }

  }


  /* =========================================================
     ENDEREÇOS
     ========================================================= */

  async function loadAddresses() {

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


      const container =
        document.getElementById(
          "enderecos-dinamicos"
        );


      if (!container) return;


      container.innerHTML = "";


      const enderecosAtivos =
        enderecos.filter(
          endereco =>
            Number(endereco.ativo) === 1
        );


      if (!enderecosAtivos.length) {

        container.innerHTML = `
          <p>
            Nenhuma unidade disponível.
          </p>
        `;

        return;

      }


      enderecosAtivos.forEach(
        unidade => {

          const bloco =
            document.createElement(
              "div"
            );


          bloco.className =
            "unidade-cafeteria";


          bloco.innerHTML = `
            <div class="unidade-header">

              <h3>

                <i class="bi bi-geo-alt-fill"></i>

                ${
                  unidade.nome ||
                  "Unidade GS Coffee"
                }

              </h3>

            </div>


            <p class="unidade-endereco">

  <a
    href="https://maps.app.goo.gl/T8367q2CUFWfSJFF7"
    target="_blank"
    rel="noopener noreferrer"
    class="endereco-maps"
  >
    ${unidade.endereco || ""}
  </a>

</p>

<div class="horarios-unidade">

  ${
    unidade.horario_seg_sab
      ? `
        <p>
          <strong>Segunda a sábado:</strong>
          ${unidade.horario_seg_sab}
        </p>
      `
      : ""
  }

  ${
    unidade.horario_domingo
      ? `
        <p>
          <strong>Domingo:</strong>
          ${unidade.horario_domingo}
        </p>
      `
      : ""
  }

  ${
    unidade.horario_feriado
      ? `
        <p>
          <strong>Feriados:</strong>
          ${unidade.horario_feriado}
        </p>
      `
      : ""
  }

</div>
          `;

          


          container.appendChild(
            bloco
          );

        }
      );


    } catch (error) {

      console.error(
        "Erro ao carregar endereços:",
        error
      );

    }

  }

  /* =========================================================
     CARDÁPIO DINÂMICO
     ========================================================= */

     async function carregarCardapioDinamico() {

    const container =
      document.getElementById(
        "cardapio-dinamico"
      );


    if (!container) {
      return;
    }


    try {

      /* =====================================================
         CARREGAR PRODUTOS
         ===================================================== */

      const response =
        await fetch(
          `${API_URL}/produtos`
        );


      const produtos =
        await response.json();


      if (!response.ok) {

        throw new Error(
          produtos.message ||
          "Não foi possível carregar o cardápio."
        );

      }


      const produtosDisponiveis =
        produtos.filter(
          produto =>
            Number(produto.disponivel) === 1
        );


      /* =====================================================
         CARREGAR CATEGORIAS
         ===================================================== */

      const responseCategorias =
        await fetch(
          `${API_URL}/categorias`
        );


      const categorias =
        await responseCategorias.json();


      if (!responseCategorias.ok) {

        throw new Error(
          categorias.message ||
          "Não foi possível carregar as categorias."
        );

      }


      /* =====================================================
         ORDENAR CATEGORIAS
         ===================================================== */

      categorias.sort(
        (a, b) =>
          String(a.nome).localeCompare(
            String(b.nome),
            "pt-BR"
          )
      );


      /* =====================================================
         MENU DE CATEGORIAS
         ===================================================== */

      const menuCategorias =
        document.getElementById(
          "menu-categorias"
        );


      if (menuCategorias) {

        menuCategorias.innerHTML = "";


        categorias.forEach(
          categoria => {

            const ancora =
              String(
                categoria.nome || ""
              )
                .normalize("NFD")
                .replace(
                  /[\u0300-\u036f]/g,
                  ""
                )
                .toLowerCase()
                .replace(
                  /[^a-z0-9]+/g,
                  "-"
                )
                .replace(
                  /^-+|-+$/g,
                  ""
                );


            const link =
              document.createElement(
                "a"
              );


            link.href =
              `#${ancora}`;


            link.className =
              "menu-btn";


            link.textContent =
              String(
                categoria.nome || ""
              ).toUpperCase();


            menuCategorias.appendChild(
              link
            );

          }
        );

      }


      /* =====================================================
         MONTAR CARDÁPIO
         ===================================================== */

      container.innerHTML = "";


      categorias.forEach(
        categoria => {

          const produtosCategoria =
            produtosDisponiveis
              .filter(
                produto =>
                  Number(
                    produto.categoria_id
                  ) ===
                  Number(
                    categoria.categoria_id
                  )
              )
              .sort(
                (a, b) =>
                  String(a.nome).localeCompare(
                    String(b.nome),
                    "pt-BR"
                  )
              );


          if (!produtosCategoria.length) {
            return;
          }


          const ancora =
            String(
              categoria.nome || ""
            )
              .normalize("NFD")
              .replace(
                /[\u0300-\u036f]/g,
                ""
              )
              .toLowerCase()
              .replace(
                /[^a-z0-9]+/g,
                "-"
              )
              .replace(
                /^-+|-+$/g,
                ""
              );


          const titulo =
            document.createElement(
              "h1"
            );


          titulo.id =
            ancora;


          titulo.className =
            "secao-titulo";


          titulo.textContent =
            categoria.nome;


          container.appendChild(
            titulo
          );


          produtosCategoria.forEach(
            produto => {

              const item =
                document.createElement(
                  "div"
                );


              item.className =
                "cardapio-item";


              let imagemProduto =
                produto.imagem || "";


              if (
                imagemProduto.startsWith(
                  "/uploads/"
                )
              ) {

                imagemProduto =
                  `${API_URL}${imagemProduto}`;

              }


              item.innerHTML = `

                <img
                  src="${imagemProduto}"
                  alt="${produto.nome}"
                  class="cardapio-img"
                >

                <div class="cardapio-info">

                  <h2 class="item-title">
                    ${produto.nome}
                  </h2>

                  <p class="item-desc">
                    ${produto.descricao || ""}
                  </p>

                  <p class="item-price">

                    R$ ${Number(
                      produto.preco
                    )
                      .toFixed(2)
                      .replace(".", ",")}

                  </p>

                  <button
                    type="button"
                    class="buy-button"
                    data-produto-id="${produto.produto_id}"
                  >
                    Adicionar ao carrinho
                  </button>

                </div>

              `;


              container.appendChild(
                item
              );

            }
          );

        }
      );


      if (!container.children.length) {

        container.innerHTML = `
          <p>
            Nenhum produto disponível no momento.
          </p>
        `;

      }


      /* =====================================================
         ADICIONAR PRODUTO AO CARRINHO
         ===================================================== */

      container.addEventListener(
        "click",
        event => {

          const button =
            event.target.closest(
              "[data-produto-id]"
            );


          if (!button) {
            return;
          }


          const produto =
            produtosDisponiveis.find(
              item =>
                String(
                  item.produto_id
                ) ===
                String(
                  button.dataset.produtoId
                )
            );


          if (!produto) {
            return;
          }


          let imagemProduto =
            produto.imagem || "";


          if (
            imagemProduto.startsWith(
              "/uploads/"
            )
          ) {

            imagemProduto =
              `${API_URL}${imagemProduto}`;

          }


          addToCart({

            id:
              produto.produto_id,

            nome:
              produto.nome,

            descricao:
              produto.descricao || "",

            preco:
              Number(produto.preco),

            imagem:
              imagemProduto

          });

        }
      );


    } catch (error) {

      console.error(
        "Erro ao carregar cardápio:",
        error
      );


      container.innerHTML = `
        <p>
          Não foi possível carregar o cardápio.
        </p>
      `;

    }

  }


  /* =========================================================
       INICIALIZAÇÃO DAS INFORMAÇÕES DO SITE
       ========================================================= */
  
    loadSiteSettings();
  
    loadContacts();
  
    loadAddresses();
  
    carregarCardapioDinamico();
  
  
    /* =========================================================
       ESTADO
       ========================================================= */
  
    let cart =
      JSON.parse(
        localStorage.getItem(
          "cart"
        )
      ) || [];
  
  
    let currentUser =
      null;
  
  
    let currentOrder =
      null;
  
  
    let orderPolling =
      null;
  
  
    /* =========================================================
       ELEMENTOS PRINCIPAIS
       ========================================================= */
  
    const loginModal =
      document.getElementById(
        "loginModal"
      );
  
  
    const userIcon =
      document.getElementById(
        "userIcon"
      );
  
  
    const cartModal =
      document.getElementById(
        "cart"
      );
  
  
    const cartIcon =
      document.getElementById(
        "cart-icon"
      );
  
  
    const finalizarModal =
      document.getElementById(
        "finalizarModal"
      );
  
  
    const pedidoModal =
      document.getElementById(
        "pedidoModal"
      );
  
  
    const userGreeting =
      document.getElementById(
        "userGreeting"
      );
  
  
    const loggedInUser =
      document.getElementById(
        "loggedInUser"
      );
  
  
    /* =========================================================
       TOKEN / USUÁRIO
       ========================================================= */
  
    const getToken =
      () =>
        localStorage.getItem(
          "gscoffee_token"
        );
  
  
    const getUser =
      () => {
  
        try {
  
          return (
            JSON.parse(
              localStorage.getItem(
                "gscoffee_user"
              )
            ) || null
          );
  
        } catch {
  
          return null;
  
        }
  
      };
  
  
    /* =========================================================
       MENSAGENS
       ========================================================= */
  
    function setMessage(
      id,
      message,
      type = "error"
    ) {
  
      const el =
        document.getElementById(
          id
        );
  
  
      if (!el) {
        return;
      }
  
  
      el.textContent =
        message || "";
  
  
      el.className =
        `auth-message ${type}`;
  
    }
  
  
    /* =========================================================
       ABRIR / FECHAR MODAIS
       ========================================================= */
  
    function openModal(
      modal
    ) {
  
      if (!modal) {
        return;
      }
  
  
      modal.style.display =
        "flex";
  
  
      modal.setAttribute(
        "aria-hidden",
        "false"
      );
  
  
      document.body.classList.add(
        "modal-open"
      );
  
    }
  
  
    function closeModal(
      modal
    ) {
  
      if (!modal) {
        return;
      }
  
  
      modal.style.display =
        "none";
  
  
      modal.setAttribute(
        "aria-hidden",
        "true"
      );
  
  
      if (
        ![
          loginModal,
          finalizarModal,
          pedidoModal
        ].some(
          modalItem =>
            modalItem &&
            modalItem.style.display ===
              "flex"
        )
      ) {
  
        document.body.classList.remove(
          "modal-open"
        );
  
      }
  
    }
  
  
    /* =========================================================
       MENU MOBILE
       ========================================================= */
  
    const openMenu =
      document.getElementById(
        "openMenu"
      );
  
  
    const menuMobile =
      document.getElementById(
        "menuMobile"
      );
  
  
    openMenu?.addEventListener(
      "click",
      () => {
  
        menuMobile?.classList.toggle(
          "mobile-open"
        );
  
      }
    );
  
  
    menuMobile
      ?.querySelectorAll(
        "a"
      )
      .forEach(
        link => {
  
          link.addEventListener(
            "click",
            () => {
  
              menuMobile.classList.remove(
                "mobile-open"
              );
  
            }
          );
  
        }
      );
  
  
    /* =========================================================
   LOGIN / PERFIL
   ========================================================= */

userIcon?.addEventListener(
  "click",
  () => {

    /* =============================================
       USUÁRIO LOGADO → PERFIL
       ============================================= */

    if (getToken()) {

      window.location.href =
        "perfil.html";

      return;

    }


    /* =============================================
       SEM LOGIN → ABRIR LOGIN
       ============================================= */

    openModal(
      loginModal
    );

  }
);
  
  
    document
      .getElementById(
        "close-login"
      )
      ?.addEventListener(
        "click",
        () => {
  
          closeModal(
            loginModal
          );
  
        }
      );
  
  
    loginModal?.addEventListener(
      "click",
      event => {
  
        if (
          event.target ===
          loginModal
        ) {
  
          closeModal(
            loginModal
          );
  
        }
  
      }
    );
  
  
    const formLogin =
      document.getElementById(
        "form-login"
      );
  
  
    formLogin?.addEventListener(
      "submit",
      async event => {
  
        event.preventDefault();
  
  
        setMessage(
          "login-message",
          "Entrando...",
          "info"
        );
  
  
        const email =
          document
            .getElementById(
              "login-email"
            )
            ?.value.trim();
  
  
        const senha =
          document
            .getElementById(
              "login-password"
            )
            ?.value;
  
  
        try {
  
          const res =
            await fetch(
              `${API_URL}/auth/login`,
              {
  
                method:
                  "POST",
  
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
            await res.json();
  
  
          if (!res.ok) {
  
            throw new Error(
              data.message ||
              "Não foi possível entrar."
            );
  
          }

          localStorage.setItem(
  "gscoffee_token",
  data.token
);

localStorage.setItem(
  "gscoffee_user",
  JSON.stringify(
    data.usuario
  )
);

updateLoggedUser();

          closeModal(
            loginModal
          );
  
  
          formLogin.reset();
  
  
          setMessage(
            "login-message",
            "",
            "success"
          );
  
  
        } catch (error) {
  
          setMessage(
            "login-message",
            error.message,
            "error"
          );
  
        }
  
      }
    );

    /* =========================================================
   ESQUECI MINHA SENHA
   ========================================================= */

const forgotPasswordButton =
document.getElementById(
  "forgot-password-button"
);

const forgotPasswordModal =
document.getElementById(
  "forgotPasswordModal"
);

const closeForgotPassword =
document.getElementById(
  "close-forgot-password"
);

const backToLogin =
document.getElementById(
  "back-to-login"
);

const forgotEmailForm =
document.getElementById(
  "forgot-email-form"
);

const forgotResetForm =
document.getElementById(
  "forgot-reset-form"
);

const forgotStepEmail =
document.getElementById(
  "forgot-step-email"
);

const forgotStepReset =
document.getElementById(
  "forgot-step-reset"
);

const forgotEmailMessage =
document.getElementById(
  "forgot-email-message"
);

const forgotResetMessage =
document.getElementById(
  "forgot-reset-message"
);

const recoveryCodeBox =
document.getElementById(
  "recovery-code-box"
);


let recoveryEmail = "";


/* =========================================================
 ABRIR RECUPERAÇÃO
 ========================================================= */

forgotPasswordButton?.addEventListener(
"click",
() => {

  closeModal(
    loginModal
  );

  openModal(
    forgotPasswordModal
  );

}
);


/* =========================================================
 FECHAR RECUPERAÇÃO
 ========================================================= */

closeForgotPassword?.addEventListener(
"click",
() => {

  closeModal(
    forgotPasswordModal
  );

}
);


forgotPasswordModal?.addEventListener(
"click",
event => {

  if (
    event.target ===
    forgotPasswordModal
  ) {

    closeModal(
      forgotPasswordModal
    );

  }

}
);


/* =========================================================
 VOLTAR AO LOGIN
 ========================================================= */

backToLogin?.addEventListener(
"click",
() => {

  closeModal(
    forgotPasswordModal
  );

  openModal(
    loginModal
  );

}
);


/* =========================================================
 GERAR CÓDIGO
 ========================================================= */

forgotEmailForm?.addEventListener(
"submit",
async event => {

  event.preventDefault();


  const email =
    document
      .getElementById(
        "forgot-email"
      )
      ?.value.trim();


  if (!email) {
    return;
  }


  forgotEmailMessage.textContent =
    "Gerando código...";


  forgotEmailMessage.className =
    "auth-message info";


  try {

    const response =
      await fetch(
        `${API_URL}/auth/forgot-password`,
        {

          method:
            "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({
              email
            })

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Não foi possível gerar o código."
      );

    }


    recoveryEmail =
      email;


    forgotEmailMessage.textContent =
      "";


    forgotStepEmail.style.display =
      "none";


    forgotStepReset.style.display =
      "block";


    /*
      Enquanto não temos envio por e-mail,
      exibimos o código gerado na própria tela.
    */

    recoveryCodeBox.style.display =
  "block";


  } catch (error) {

    forgotEmailMessage.textContent =
      error.message;


    forgotEmailMessage.className =
      "auth-message error";

  }

}
);


/* =========================================================
 REDEFINIR SENHA
 ========================================================= */

forgotResetForm?.addEventListener(
"submit",
async event => {

  event.preventDefault();


  const codigo =
    document
      .getElementById(
        "forgot-code"
      )
      ?.value.trim();


  const novaSenha =
    document
      .getElementById(
        "forgot-new-password"
      )
      ?.value;


  const confirmarSenha =
    document
      .getElementById(
        "forgot-confirm-password"
      )
      ?.value;


  if (
    novaSenha !==
    confirmarSenha
  ) {

    forgotResetMessage.textContent =
      "As senhas não conferem.";


    forgotResetMessage.className =
      "auth-message error";


    return;

  }


  if (
    novaSenha.length < 6
  ) {

    forgotResetMessage.textContent =
      "A senha precisa ter pelo menos 6 caracteres.";


    forgotResetMessage.className =
      "auth-message error";


    return;

  }


  forgotResetMessage.textContent =
    "Redefinindo senha...";


  forgotResetMessage.className =
    "auth-message info";


  try {

    const response =
      await fetch(
        `${API_URL}/auth/reset-password`,
        {

          method:
            "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({

              email:
                recoveryEmail,

              codigo,

              nova_senha:
                novaSenha

            })

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Não foi possível redefinir a senha."
      );

    }


    forgotResetMessage.textContent =
      "Senha redefinida com sucesso!";


    forgotResetMessage.className =
      "auth-message success";


    setTimeout(
      () => {

        forgotResetForm.reset();

        forgotEmailForm.reset();


        forgotStepReset.style.display =
          "none";


        forgotStepEmail.style.display =
          "block";


        recoveryCodeBox.style.display =
          "none";


        recoveryCodeValue.textContent =
          "";


        recoveryEmail =
          "";


        closeModal(
          forgotPasswordModal
        );


        openModal(
          loginModal
        );


        setMessage(
          "login-message",
          "Senha alterada. Entre com sua nova senha.",
          "success"
        );

      },
      1200
    );


  } catch (error) {

    forgotResetMessage.textContent =
      error.message;


    forgotResetMessage.className =
      "auth-message error";

  }

}
);

      /* =========================================================
     CADASTRO
     ========================================================= */

  const formSignup =
  document.getElementById(
    "form-signup"
  );


formSignup?.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    const nome =
      document
        .getElementById(
          "signup-name"
        )
        ?.value.trim();


    const email =
      document
        .getElementById(
          "signup-email"
        )
        ?.value.trim();


    const telefone =
      document
        .getElementById(
          "signup-phone"
        )
        ?.value.trim();


    const senha =
      document
        .getElementById(
          "signup-password"
        )
        ?.value;


    const confirmar =
      document
        .getElementById(
          "signup-password-confirm"
        )
        ?.value;


    if (
      senha !==
      confirmar
    ) {

      setMessage(
        "signup-message",
        "As senhas não conferem."
      );

      return;

    }


    if (
      senha.length < 6
    ) {

      setMessage(
        "signup-message",
        "A senha precisa ter pelo menos 6 caracteres."
      );

      return;

    }


    setMessage(
      "signup-message",
      "Criando sua conta...",
      "info"
    );


    try {

      const res =
        await fetch(
          `${API_URL}/auth/register`,
          {

            method:
              "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body:
              JSON.stringify({
                nome,
                email,
                telefone,
                senha
              })

          }
        );


      const data =
        await res.json();


      if (!res.ok) {

        throw new Error(
          data.message ||
          "Não foi possível criar a conta."
        );

      }


      localStorage.setItem(
        "gscoffee_token",
        data.token
      );


      localStorage.setItem(
        "gscoffee_user",
        JSON.stringify(
          data.usuario
        )
      );


      updateLoggedUser();

      if (data.usuario.role === "admin") {
    window.location.href = "admin/dashboard.html";
    return;
}


      formSignup.reset();


      setMessage(
        "signup-message",
        "Conta criada com sucesso!",
        "success"
      );


      setTimeout(
        () => {

          closeModal(
            loginModal
          );

        },
        700
      );


    } catch (error) {

      setMessage(
        "signup-message",
        error.message,
        "error"
      );

    }

  }
);


/* =========================================================
   USUÁRIO LOGADO
   ========================================================= */

function updateLoggedUser() {

  const user =
    getUser();

    const cartIcon =
    document.getElementById(
        "cart-icon"
    );

if (cartIcon) {

    if (
        user &&
        getToken() &&
        user.role === "admin"
    ) {

        cartIcon.style.display =
            "none";

    } else {

        cartIcon.style.display =
            "";

    }

}


  if (
    user &&
    getToken()
  ) {

    if (
      loggedInUser
    ) {

      loggedInUser.textContent =
        `Olá, ${
          user.nome ||
          user.email
        }`;

    }


    if (
      userGreeting
    ) {

      userGreeting.style.display =
        "block";

    }

  } else {

    if (
      loggedInUser
    ) {

      loggedInUser.textContent =
        "";

    }


    if (
      userGreeting
    ) {

      userGreeting.style.display =
        "none";

    }

  }

  const adminMenuItem =
  document.getElementById(
    "adminMenuItem"
  );


if (adminMenuItem) {

  if (
    user &&
    getToken() &&
    user.role === "admin"
  ) {

    adminMenuItem.style.display =
      "list-item";

  } else {

    adminMenuItem.style.display =
      "none";

  }

}

}


updateLoggedUser();


/* =========================================================
   CARRINHO
   ========================================================= */

const cartTableBody =
  document.querySelector(
    "#carrinho-table tbody"
  );


const cartTotal =
  document.getElementById(
    "total-amount"
  );


const checkoutTotal =
  document.getElementById(
    "checkout-total"
  );


function money(
  value
) {

  return `R$ ${
    Number(value)
      .toFixed(2)
      .replace(
        ".",
        ","
      )
  }`;

}


function saveCart() {

  localStorage.setItem(
    "cart",
    JSON.stringify(
      cart
    )
  );

}


function calculateTotal() {

  return cart.reduce(
    (
      sum,
      item
    ) =>
      sum +
      Number(
        item.preco
      ) *
      Number(
        item.quantity
      ),
    0
  );

}


function updateCart() {

  if (
    !cartTableBody
  ) {

    return;

  }


  cartTableBody.innerHTML =
    "";


  if (
    !cart.length
  ) {

    cartTableBody.innerHTML = `
      <tr>

        <td
          colspan="3"
          class="empty-cart"
        >
          Seu carrinho está vazio ☕
        </td>

      </tr>
    `;

  } else {

    cart.forEach(
      item => {

        const tr =
          document.createElement(
            "tr"
          );


        tr.innerHTML = `
          <td>

            <strong>
              ${item.nome}
            </strong>

          </td>


          <td>

            ${
              money(
                item.preco *
                item.quantity
              )
            }

          </td>


          <td>

            <button
              class="trash"
              data-id="${item.id}"
              aria-label="Diminuir"
            >
              −
            </button>


            ${item.quantity}


            <button
              class="more"
              data-id="${item.id}"
              aria-label="Aumentar"
            >
              +
            </button>

          </td>
        `;


        cartTableBody.appendChild(
          tr
        );

      }
    );

  }


  const total =
    calculateTotal();


  if (
    cartTotal
  ) {

    cartTotal.textContent =
      `Total: ${money(total)}`;

  }


  saveCart();

}


function addToCart(
  item
) {

  if (
    !item?.id
  ) {

    return;

  }


  const existing =
    cart.find(
      produto =>
        String(
          produto.id
        ) ===
        String(
          item.id
        )
    );


  if (
    existing
  ) {

    existing.quantity +=
      1;

  } else {

    cart.push({

      id:
        item.id,

      nome:
        item.nome,

      preco:
        Number(
          item.preco
        ),

      imagem:
        item.imagem || "",

      quantity:
        1

    });

  }


  saveCart();

  updateCart();


  showToast(
    `${item.nome} foi adicionado ao carrinho.`
  );

}


/* =========================================================
   ABRIR CARRINHO
   ========================================================= */

cartIcon?.addEventListener(
  "click",
  () => {

    cartModal?.classList.add(
      "open"
    );


    updateCart();

  }
);


document
  .getElementById(
    "close-cart"
  )
  ?.addEventListener(
    "click",
    () => {

      cartModal?.classList.remove(
        "open"
      );

    }
  );


/* =========================================================
   AUMENTAR / DIMINUIR QUANTIDADE
   ========================================================= */

cartModal?.addEventListener(
  "click",
  event => {

    const btn =
      event.target.closest(
        "button[data-id]"
      );


    if (!btn) {
      return;
    }


    const item =
      cart.find(
        produto =>
          String(
            produto.id
          ) ===
          String(
            btn.dataset.id
          )
      );


    if (!item) {
      return;
    }


    if (
      btn.classList.contains(
        "more"
      )
    ) {

      item.quantity +=
        1;

    }


    if (
      btn.classList.contains(
        "trash"
      )
    ) {

      item.quantity -=
        1;


      if (
        item.quantity <= 0
      ) {

        cart =
          cart.filter(
            produto =>
              String(
                produto.id
              ) !==
              String(
                item.id
              )
          );

      }

    }


    updateCart();

  }
);


/* =========================================================
   CHECKOUT
   ========================================================= */

  const deliveryCep =
  document.getElementById("delivery-cep");

const deliveryStreet =
  document.getElementById("delivery-street");

const deliveryNeighborhood =
  document.getElementById("delivery-neighborhood");


async function buscarCep() {

  if (!deliveryCep) {
    return;
  }

  const cep =
    deliveryCep.value.replace(/\D/g, "");

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

      showToast(
        "CEP não encontrado."
      );

      return;
    }

    if (deliveryStreet) {
      deliveryStreet.value =
        data.logradouro || "";
    }

    if (deliveryNeighborhood) {
      deliveryNeighborhood.value =
        data.bairro || "";
    }

  } catch (error) {

    console.error(
      "Erro ao buscar CEP:",
      error
    );

    showToast(
      "Não foi possível buscar o CEP."
    );
  }
}


deliveryCep?.addEventListener(
  "blur",
  buscarCep
);

/* =========================================================
   ENDEREÇOS SALVOS NO CHECKOUT
   ========================================================= */

const savedAddress =
  document.getElementById("saved-address");

async function carregarEnderecosSalvosCheckout() {

  const token =
    localStorage.getItem("gscoffee_token") ||
    localStorage.getItem("token");


  if (
    !savedAddress ||
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


    const enderecos =
      await response.json();


    if (!response.ok) {
      throw new Error(
        enderecos.message ||
        "Não foi possível carregar os endereços."
      );
    }


    savedAddress.innerHTML = `
      <option value="">
        Selecione um endereço
      </option>
    `;


    enderecos.forEach(endereco => {

      const option =
        document.createElement("option");

      option.value =
        endereco.endereco_id;

      option.textContent =
        `${endereco.apelido} - ${endereco.rua}, ${endereco.numero}`;

      option.dataset.endereco =
        JSON.stringify(endereco);

      savedAddress.appendChild(option);

    });


    const novoOption =
      document.createElement("option");

    novoOption.value =
      "novo";

    novoOption.textContent =
      "+ Usar outro endereço";

    savedAddress.appendChild(novoOption);


  } catch (error) {

    console.error(
      "Erro ao carregar endereços salvos:",
      error
    );

  }

}


savedAddress?.addEventListener(
  "change",
  () => {

    const option =
      savedAddress.options[
        savedAddress.selectedIndex
      ];


    if (
      !option ||
      option.value === "" ||
      option.value === "novo"
    ) {

      if (option?.value === "novo") {

        document
          .getElementById("delivery-cep")
          .value = "";

        document
          .getElementById("delivery-number")
          .value = "";

        document
          .getElementById("delivery-street")
          .value = "";

        document
          .getElementById("delivery-neighborhood")
          .value = "";

        document
          .getElementById("delivery-complement")
          .value = "";

      }

      return;
    }


    const endereco =
      JSON.parse(
        option.dataset.endereco
      );


    document
      .getElementById("delivery-cep")
      .value =
      endereco.cep || "";


    document
      .getElementById("delivery-number")
      .value =
      endereco.numero || "";


    document
      .getElementById("delivery-street")
      .value =
      endereco.rua || "";


    document
      .getElementById("delivery-neighborhood")
      .value =
      endereco.bairro || "";


    document
      .getElementById("delivery-complement")
      .value =
      endereco.complemento || "";

  }
);


carregarEnderecosSalvosCheckout();

const checkoutUser =
  document.getElementById(
    "checkout-user"
  );


const preview =
  document.getElementById(
    "checkout-order-preview"
  );


function renderCheckoutPreview() {

  if (
    !preview
  ) {

    return;

  }


  preview.innerHTML = `
    <strong>
      Resumo do pedido
    </strong>

    ${
      cart
        .map(
          item => `
            <div>

              <span>

                ${item.quantity}x
                ${item.nome}

              </span>


              <b>

                ${
                  money(
                    item.preco *
                    item.quantity
                  )
                }

              </b>

            </div>
          `
        )
        .join("")
    }
  `;


  if (
    checkoutTotal
  ) {

    checkoutTotal.textContent =
      `Total: ${
        money(
          calculateTotal()
        )
      }`;

  }

}


function fillCustomerData() {

  const user =
    getUser();


  if (
    checkoutUser
  ) {

    checkoutUser.textContent =
      user
        ? (
            user.nome ||
            user.email
          )
        : "Faça login para continuar";

  }


  const name =
    document.getElementById(
      "delivery-name"
    );


  const phone =
    document.getElementById(
      "delivery-phone"
    );


  if (
    user
  ) {

    if (
      name &&
      !name.value
    ) {

      name.value =
        user.nome || "";

    }


    if (
      phone &&
      !phone.value
    ) {

      phone.value =
        user.telefone || "";

    }

  }

}


document
  .getElementById(
    "finalizar-compra-button"
  )
  ?.addEventListener(
    "click",
    () => {

      if (
        !cart.length
      ) {

        showToast(
          "Seu carrinho está vazio."
        );

        return;

      }


      if (
        !getToken()
      ) {

        openModal(
          loginModal
        );


        setMessage(
          "login-message",
          "Entre ou crie sua conta para continuar o pedido.",
          "info"
        );

        return;

      }


      fillCustomerData();

      renderCheckoutPreview();

      openModal(
        finalizarModal
      );

    }
  );


finalizarModal
  ?.querySelector(
    ".checkout-close"
  )
  ?.addEventListener(
    "click",
    () => {

      closeModal(
        finalizarModal
      );

    }
  );


finalizarModal?.addEventListener(
  "click",
  event => {

    if (
      event.target ===
      finalizarModal
    ) {

      closeModal(
        finalizarModal
      );

    }

  }
);

/* =========================================================
   OPÇÕES EXTRAS DE PAGAMENTO
   ========================================================= */

const deliveryPayment =
  document.getElementById("delivery-payment");

const paymentExtra =
  document.getElementById("payment-extra");

const cardOptions =
  document.getElementById("card-options");

const cashOptions =
  document.getElementById("cash-options");

const pixOptions =
  document.getElementById("pix-options");

const needsChange =
  document.getElementById("needs-change");

const changeValueContainer =
  document.getElementById("change-value-container");

const changeValue =
  document.getElementById("change-value");


function atualizarOpcoesPagamento() {

  if (!deliveryPayment) {
    return;
  }

  const pagamento =
    deliveryPayment.value;


  if (paymentExtra) {
    paymentExtra.style.display = "none";
  }

  if (cardOptions) {
  cardOptions.style.display = "none";
  }

  if (cashOptions) {
    cashOptions.style.display = "none";
  }

  if (pixOptions) {
    pixOptions.style.display = "none";
  }

  if (changeValueContainer) {
    changeValueContainer.style.display = "none";
  }


  /* PIX */

  if (pagamento === "PIX") {

    if (paymentExtra) {
      paymentExtra.style.display = "block";
    }

    if (pixOptions) {
      pixOptions.style.display = "block";
    }

  }

  /* CARTÃO */

if (pagamento === "CARTAO") {

  if (cardOptions) {
    cardOptions.style.display = "block";
  }

}

  /* DINHEIRO */

  if (pagamento === "DINHEIRO") {

    if (paymentExtra) {
      paymentExtra.style.display = "block";
    }

    if (cashOptions) {
      cashOptions.style.display = "block";
    }

    if (
      needsChange &&
      needsChange.value === "SIM" &&
      changeValueContainer
    ) {
      changeValueContainer.style.display = "block";
    }

  }

}


deliveryPayment?.addEventListener(
  "change",
  atualizarOpcoesPagamento
);


needsChange?.addEventListener(
  "change",
  () => {

    if (!changeValueContainer) {
      return;
    }

    if (needsChange.value === "SIM") {

      changeValueContainer.style.display = "block";

    } else {

      changeValueContainer.style.display = "none";

      if (changeValue) {
        changeValue.value = "";
      }

    }

  }
);


atualizarOpcoesPagamento();

/* =========================================================
   CONFIRMAR PEDIDO
   ========================================================= */

document
  .getElementById(
    "confirmar-pedido-button"
  )
  ?.addEventListener(
    "click",
    async () => {

      if (
        !getToken()
      ) {

        closeModal(
          finalizarModal
        );


        openModal(
          loginModal
        );


        return;

      }


      const required = [

        "delivery-name",
        "delivery-phone",
        "delivery-cep",
        "delivery-number",
        "delivery-street",
        "delivery-neighborhood"

      ];


      const values =
        {};


      let invalid =
        false;


      required.forEach(
        id => {

          const el =
            document.getElementById(
              id
            );


          values[id] =
            el?.value.trim() ||
            "";


          if (
            !values[id]
          ) {

            invalid =
              true;


            if (
              el
            ) {

              el.classList.add(
                "input-error"
              );

            }

          } else {

            el?.classList.remove(
              "input-error"
            );

          }

        }
      );


      if (
        invalid
      ) {

        setMessage(
          "order-message",
          "Preencha os campos obrigatórios do endereço."
        );

        return;

      }


      const payload = {

        itens:
          cart.map(
            item => ({

              produto_id:
                item.id,

              nome:
                item.nome,

              quantidade:
                item.quantity,

              preco_unitario:
                Number(
                  item.preco
                )

            })
          ),


        endereco: {

          nome:
            values[
              "delivery-name"
            ],

          telefone:
            values[
              "delivery-phone"
            ],

          cep:
            values[
              "delivery-cep"
            ],

          rua:
            values[
              "delivery-street"
            ],

          numero:
            values[
              "delivery-number"
            ],

          bairro:
            values[
              "delivery-neighborhood"
            ],

          complemento:
            document
              .getElementById(
                "delivery-complement"
              )
              ?.value.trim() ||
            ""

        },


        pagamento:
          document
            .getElementById(
              "delivery-payment"
            )
            ?.value ||
          "PIX"

      };


      const button =
        document.getElementById(
          "confirmar-pedido-button"
        );


      button.disabled =
        true;


      setMessage(
        "order-message",
        "Registrando seu pedido...",
        "info"
      );


      try {

        const res =
          await fetch(
            `${API_URL}/pedidos`,
            {

              method:
                "POST",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${getToken()}`

              },

              body:
                JSON.stringify(
                  payload
                )

            }
          );


        const data =
          await res.json();


        if (
          !res.ok
        ) {

          throw new Error(
            data.message ||
            "Não foi possível registrar o pedido."
          );

        }


        localStorage.setItem(
          "gscoffee_last_order",
          JSON.stringify(
            data.pedido
          )
        );


        cart =
          [];


        saveCart();

        updateCart();


        cartModal?.classList.remove(
          "open"
        );


        closeModal(
          finalizarModal
        );


        await showTracking(
          data.pedido
        );


      } catch (error) {

        setMessage(
          "order-message",
          error.message
        );


      } finally {

        button.disabled =
          false;

      }

    }
  );

  /* =========================================================
     PEDIDO / ACOMPANHAMENTO
     ========================================================= */

     let trackingTimer =
     null;
 
 
   let currentTrackingId =
     null;
 
 
   async function showTracking(
     order
   ) {
 
     if (!order) {
       return;
     }
 
 
     currentTrackingId =
       order.pedido_id;
 
 
     const numeroPedido =
       document.getElementById(
         "tracking-order-number"
       );
 
 
     if (numeroPedido) {
 
       numeroPedido.textContent =
         `#${order.pedido_id}`;
 
     }
 
 
     renderReceipt(
       order
     );
 
 
     renderTracking(
       order.status ||
       "recebido"
     );
 
 
     openModal(
       pedidoModal
     );
 
 
     clearInterval(
       trackingTimer
     );
 
 
     trackingTimer =
       setInterval(
         refreshTracking,
         10000
       );
 
   }
 
 
   /* =========================================================
      RESUMO DO PEDIDO
      ========================================================= */
 
   function renderReceipt(
     order
   ) {
 
     const receipt =
       document.getElementById(
         "order-receipt"
       );
 
 
     if (!receipt) {
       return;
     }
 
 
     const addr =
       order.endereco ||
       {};
 
 
     const items =
       order.itens ||
       [];
 
 
     receipt.innerHTML = `
 
       <div class="receipt-title">
 
         <span>
           Resumo do pedido
         </span>
 
         <strong>
           ${money(order.total)}
         </strong>
 
       </div>
 
 
       <div class="receipt-items">
 
         ${
           items
             .map(
               item => `
 
                 <div>
 
                   <span>
 
                     ${item.quantidade}x
                     ${item.nome}
 
                   </span>
 
 
                   <b>
 
                     ${
                       money(
                         item.quantidade *
                         item.preco_unitario
                       )
                     }
 
                   </b>
 
                 </div>
 
               `
             )
             .join("")
         }
 
       </div>
 
 
       <div class="receipt-divider"></div>
 
 
       <div class="receipt-row">
 
         <span>
           Pagamento
         </span>
 
         <strong>
           ${
             paymentLabel(
               order.pagamento
             )
           }
         </strong>
 
       </div>
 
 
       <div class="receipt-row receipt-address">
 
         <span>
           Entrega
         </span>
 
         <strong>
 
           ${addr.rua || ""},
           ${addr.numero || ""}
 
           ${
             addr.complemento
               ? ` - ${addr.complemento}`
               : ""
           }
 
           <br>
 
           ${addr.bairro || ""}
 
           ${
             addr.cep
               ? ` - CEP ${addr.cep}`
               : ""
           }
 
         </strong>
 
       </div>
 
 
       <div class="receipt-row">
 
         <span>
           Telefone
         </span>
 
         <strong>
           ${addr.telefone || "-"}
         </strong>
 
       </div>
 
     `;
 
   }
 
 
   /* =========================================================
      FORMA DE PAGAMENTO
      ========================================================= */
 
   function paymentLabel(
     value
   ) {
 
     return (
       {
 
         PIX:
           "PIX",
 
         CARTAO:
           "Cartão",
 
         DINHEIRO:
           "Dinheiro"
 
       }[value] ||
       value ||
       "-"
     );
 
   }
 
 
   /* =========================================================
      STATUS DO PEDIDO
      ========================================================= */
 
   function renderTracking(
     status
   ) {
 
     const labels = {
 
       recebido:
         "Pedido recebido",
 
       preparando:
         "Seu pedido está sendo preparado",
 
       saiu_entrega:
         "Seu pedido saiu para entrega",
 
       entregue:
         "Pedido entregue"
 
     };
 
 
     const order = [
 
       "recebido",
       "preparando",
       "saiu_entrega",
       "entregue"
 
     ];
 
 
     const currentIndex =
       Math.max(
         0,
         order.indexOf(
           status
         )
       );
 
 
     document
       .querySelectorAll(
         ".tracking-step"
       )
       .forEach(
         step => {
 
           const idx =
             order.indexOf(
               step.dataset.status
             );
 
 
           step.classList.toggle(
             "completed",
             idx <= currentIndex
           );
 
 
           step.classList.toggle(
             "active",
             idx === currentIndex
           );
 
         }
       );
 
 
     const statusEl =
       document.getElementById(
         "tracking-status"
       );
 
 
     if (statusEl) {
 
       statusEl.textContent =
         labels[status] ||
         "Pedido recebido";
 
     }
 
   }
 
 
   /* =========================================================
      ATUALIZAR ACOMPANHAMENTO
      ========================================================= */
 
   async function refreshTracking() {
 
     if (
       !currentTrackingId ||
       !getToken()
     ) {
 
       return;
 
     }
 
 
     try {
 
       const response =
         await fetch(
           `${API_URL}/pedidos/${currentTrackingId}`,
           {
 
             headers: {
 
               Authorization:
                 `Bearer ${getToken()}`
 
             }
 
           }
         );
 
 
       if (!response.ok) {
 
         return;
 
       }
 
 
       const data =
         await response.json();
 
 
       const pedido =
         data.pedido ||
         data;
 
 
       if (!pedido) {
 
         return;
 
       }
 
 
       renderTracking(
         pedido.status ||
         "recebido"
       );
 
 
       if (
         pedido.itens ||
         pedido.endereco
       ) {
 
         renderReceipt(
           pedido
         );
 
       }
 
 
       localStorage.setItem(
         "gscoffee_last_order",
         JSON.stringify(
           pedido
         )
       );
 
 
       if (
         pedido.status ===
         "entregue"
       ) {
 
         clearInterval(
           trackingTimer
         );
 
 
         trackingTimer =
           null;
 
       }
 
 
     } catch (error) {
 
       console.error(
         "Erro ao atualizar pedido:",
         error
       );
 
     }
 
   }
 
 
   /* =========================================================
      FECHAR ACOMPANHAMENTO
      ========================================================= */
 
   document
     .getElementById(
       "close-pedido"
     )
     ?.addEventListener(
       "click",
       () => {
 
         closeModal(
           pedidoModal
         );
 
 
         clearInterval(
           trackingTimer
         );
 
 
         trackingTimer =
           null;
 
       }
     );
 
 
   pedidoModal?.addEventListener(
     "click",
     event => {
 
       if (
         event.target ===
         pedidoModal
       ) {
 
         closeModal(
           pedidoModal
         );
 
 
         clearInterval(
           trackingTimer
         );
 
 
         trackingTimer =
           null;
 
       }
 
     }
   );
 
 
   /* =========================================================
      RECUPERAR ÚLTIMO PEDIDO
      ========================================================= */
 
   function recuperarUltimoPedido() {
 
     try {
 
       const salvo =
         localStorage.getItem(
           "gscoffee_last_order"
         );
 
 
       if (!salvo) {
 
         return;
 
       }
 
 
       const pedido =
         JSON.parse(
           salvo
         );
 
 
       if (
         pedido &&
         pedido.pedido_id
       ) {
 
         currentOrder =
           pedido;
 
       }
 
 
     } catch (error) {
 
       console.error(
         "Erro ao recuperar último pedido:",
         error
       );
 
     }
 
   }
 
 
   recuperarUltimoPedido();
 
 
   /* =========================================================
      LIMPAR CARRINHO
      ========================================================= */
 
   const cancelButton =
     document.getElementById(
       "cancel-button"
     );
 
 
   const confirmarCancelamento =
     document.getElementById(
       "confirmarCancelamento"
     );
 
 
   cancelButton?.addEventListener(
     "click",
     () => {
 
       if (
         !cart.length
       ) {
 
         showToast(
           "Seu carrinho já está vazio."
         );
 
         return;
 
       }
 
 
       openModal(
         confirmarCancelamento
       );
 
     }
   );
 
 
   document
     .getElementById(
       "sim-cancelar"
     )
     ?.addEventListener(
       "click",
       () => {
 
         cart =
           [];
 
 
         saveCart();
 
         updateCart();
 
 
         closeModal(
           confirmarCancelamento
         );
 
 
         cartModal?.classList.remove(
           "open"
         );
 
 
         showToast(
           "Carrinho limpo."
         );
 
       }
     );
 
 
   document
     .getElementById(
       "nao-cancelar"
     )
     ?.addEventListener(
       "click",
       () => {
 
         closeModal(
           confirmarCancelamento
         );
 
       }
     );
 
 
   confirmarCancelamento?.addEventListener(
     "click",
     event => {
 
       if (
         event.target ===
         confirmarCancelamento
       ) {
 
         closeModal(
           confirmarCancelamento
         );
 
       }
 
     }
   );
 
 
   /* =========================================================
      TOAST
      ========================================================= */
 
   function showToast(
     message
   ) {
 
     let toast =
       document.getElementById(
         "gscoffee-toast"
       );
 
 
     if (!toast) {
 
       toast =
         document.createElement(
           "div"
         );
 
 
       toast.id =
         "gscoffee-toast";
 
 
       toast.style.position =
         "fixed";
 
 
       toast.style.right =
         "20px";
 
 
       toast.style.bottom =
         "20px";
 
 
       toast.style.zIndex =
         "99999";
 
 
       toast.style.padding =
         "14px 18px";
 
 
       toast.style.borderRadius =
         "10px";
 
 
       toast.style.background =
         "#603319";
 
 
       toast.style.color =
         "#fff";
 
 
       toast.style.boxShadow =
         "0 8px 25px rgba(0, 0, 0, 0.18)";
 
 
       toast.style.transition =
         "0.3s";
 
 
       document.body.appendChild(
         toast
       );
 
     }
 
 
     toast.textContent =
       message;
 
 
     toast.style.opacity =
       "1";
 
 
     toast.style.transform =
       "translateY(0)";
 
 
     clearTimeout(
       toast.hideTimer
     );
 
 
     toast.hideTimer =
       setTimeout(
         () => {
 
           toast.style.opacity =
             "0";
 
 
           toast.style.transform =
             "translateY(10px)";
 
         },
         2500
       );
 
   }
 
 
   /* =========================================================
      CARREGAR CARRINHO SALVO
      ========================================================= */
 
   updateCart();

    /* =========================================================
     PRODUTOS HOME - OS MAIS PEDIDOS
     ========================================================= */

     const cardContainer =
     document.getElementById(
       "card-container"
     );
 
 
   async function loadItems() {
 
     if (
       !cardContainer
     ) {
 
       return;
 
     }
 
 
     try {
 
       const res =
         await fetch(
           `${API_URL}/produtos`
         );
 
 
       const produtos =
         await res.json();
 
 
       if (!res.ok) {
 
         throw new Error(
           produtos.message ||
           "Não foi possível carregar os produtos."
         );
 
       }
 
 
       /* =====================================================
          SOMENTE OS MARCADOS COMO MAIS PEDIDOS
          ===================================================== */
 
       const maisPedidos =
         produtos.filter(
           produto =>
             Number(
               produto.disponivel
             ) === 1 &&
             Number(
               produto.mais_pedido
             ) === 1
         );
 
 
       cardContainer.innerHTML =
         "";
 
 
       if (
         !maisPedidos.length
       ) {
 
         cardContainer.innerHTML = `
           <p>
             Nenhum produto selecionado como mais pedido.
           </p>
         `;
 
         return;
 
       }
 
 
       /* =====================================================
          CRIAR CARDS
          MESMA ESTRUTURA QUE VOCÊ TINHA ANTES
          ===================================================== */
 
       maisPedidos.forEach(
         produto => {
 
           const card =
             document.createElement(
               "section"
             );
 
 
           let imagemProduto =
             produto.imagem || "";
 
 
           if (
             imagemProduto.startsWith(
               "/uploads/"
             )
           ) {
 
             imagemProduto =
               `${API_URL}${imagemProduto}`;
 
           }
 
 
           card.innerHTML = `
 
             <img
               src="${imagemProduto}"
               alt="${produto.nome}"
             >
 
 
             <article>
 
               <h2>
                 ${produto.nome}
               </h2>
 
               <p>
                 ${produto.descricao || ""}
               </p>
 
             </article>
 
 
             <div>
 
               <p>
                 ${money(
                   Number(
                     produto.preco
                   )
                 )}
               </p>
 
 
               <button
                 class="buy-button"
                 data-id="${produto.produto_id}"
               >
                 Comprar
               </button>
 
             </div>
 
           `;
 
 
           cardContainer.appendChild(
             card
           );
 
         }
       );
 
 
       /* =====================================================
          BOTÃO COMPRAR
          ===================================================== */
 
       cardContainer.onclick =
         event => {
 
           const button =
             event.target.closest(
               ".buy-button"
             );
 
 
           if (!button) {
 
             return;
 
           }
 
 
           const produto =
             maisPedidos.find(
               item =>
                 String(
                   item.produto_id
                 ) ===
                 String(
                   button.dataset.id
                 )
             );
 
 
           if (!produto) {
 
             return;
 
           }
 
 
           let imagemProduto =
             produto.imagem || "";
 
 
           if (
             imagemProduto.startsWith(
               "/uploads/"
             )
           ) {
 
             imagemProduto =
               `${API_URL}${imagemProduto}`;
 
           }
 
 
           addToCart({
 
             id:
               produto.produto_id,
 
             nome:
               produto.nome,
 
             preco:
               Number(
                 produto.preco
               ),
 
             imagem:
               imagemProduto
 
           });
 
         };
 
 
       /* =====================================================
          CARROSSEL
          ===================================================== */
 
       setupCarousel();
 
 
     } catch (error) {
 
       console.error(
         "Erro ao carregar os mais pedidos:",
         error
       );
 
 
       cardContainer.innerHTML = `
         <p>
           Não foi possível carregar os produtos.
         </p>
       `;
 
     }
 
   }
 
 
   /* =========================================================
      CARROSSEL DOS MAIS PEDIDOS
      ========================================================= */
 
   function setupCarousel() {

  if (!cardContainer) {
    return;
  }

  const next =
    document.getElementById(
      "seta-direita"
    );

  const prev =
    document.getElementById(
      "seta-esquerda"
    );

  let index = 0;

  const cardsPorVez = () => {

    if (window.innerWidth <= 760) {
      return 1;
    }

    if (window.innerWidth <= 1100) {
      return 2;
    }

    return 4;
  };


  const width = () => {

    const card =
      cardContainer.querySelector(
        "section"
      );

    if (!card) {
      return 0;
    }

    const styles =
      window.getComputedStyle(
        cardContainer
      );

    const gap =
      parseFloat(styles.gap) || 0;

    return card.offsetWidth + gap;
  };


  const totalCards = () =>
    cardContainer.querySelectorAll(
      "section"
    ).length;


  const maxIndex = () =>
    Math.max(
      0,
      totalCards() - cardsPorVez()
    );


  const move = () => {

    index =
      Math.max(
        0,
        Math.min(
          index,
          maxIndex()
        )
      );

    cardContainer.style.transform =
      `translateX(-${index * width()}px)`;
  };


  next?.addEventListener(
    "click",
    () => {

      if (index < maxIndex()) {

        index =
          Math.min(
            index + cardsPorVez(),
            maxIndex()
          );

        move();
      }

    }
  );


  prev?.addEventListener(
    "click",
    () => {

      if (index > 0) {

        index =
          Math.max(
            index - cardsPorVez(),
            0
          );

        move();
      }

    }
  );


  window.addEventListener(
    "resize",
    () => {

      index = 0;

      move();

    }
  );

}

  /* =========================================================
   AVALIAÇÕES
   ========================================================= */

const reviewsTrack =
  document.getElementById(
    "reviews-track"
  );

const reviewPrev =
  document.getElementById(
    "review-prev"
  );

const reviewNext =
  document.getElementById(
    "review-next"
  );

const reviewDots =
  document.getElementById(
    "review-dots"
  );


async function loadReviews() {

  if (!reviewsTrack) return;

  try {

    const response =
      await fetch(
        `${API_URL}/avaliacoes`
      );

    if (!response.ok) {
      throw new Error(
        "Não foi possível carregar as avaliações."
      );
    }

    const avaliacoes =
      await response.json();


    reviewsTrack.innerHTML = "";


    if (!avaliacoes.length) {

      reviewsTrack.innerHTML = `
        <article class="review-card">

          <div class="review-stars">
            ★★★★★
          </div>

          <p>
            Ainda não temos avaliações disponíveis.
          </p>

          <strong>
            GS Coffee
          </strong>

        </article>
      `;

    } else {

      avaliacoes.forEach(
        avaliacao => {

          const card =
            document.createElement(
              "article"
            );

          card.className =
            "review-card";


          const estrelas =
            "★".repeat(
              Number(avaliacao.nota)
            ) +
            "☆".repeat(
              5 -
              Number(avaliacao.nota)
            );


          const dataAvaliacao =
  avaliacao.criado_em
    ? new Date(
        avaliacao.criado_em
      ).toLocaleDateString(
        "pt-BR"
      )
    : "";


card.innerHTML = `

  <div class="review-stars">
    ${estrelas}
  </div>

  <p>
    “${avaliacao.comentario || ""}”
  </p>

  <strong>
    ${
      avaliacao.nome_avaliador ||
      "Cliente GS Coffee"
    }
  </strong>

  <small>
    ${
      avaliacao.origem === "Google"
        ? "Avaliação do Google"
        : "Avaliação do Delivery"
    }
  </small>

  ${
    dataAvaliacao
      ? `
        <small class="review-date">
          ${dataAvaliacao}
        </small>
      `
      : ""
  }

`;


          reviewsTrack.appendChild(
            card
          );

        }
      );

    }


    iniciarCarrosselAvaliacoes();


  } catch (error) {

    console.error(
      "Erro ao carregar avaliações:",
      error
    );

  }

}


function iniciarCarrosselAvaliacoes() {

  if (!reviewsTrack) return;


  let reviewIndex =
    0;


  const cards =
    [
      ...reviewsTrack.querySelectorAll(
        ".review-card"
      )
    ];


  const perView =
    () =>
      window.innerWidth <=
      760
        ? 1
        : (
            window.innerWidth <=
            1050
              ? 2
              : 3
          );


  const maxIndex =
    () =>
      Math.max(
        0,
        cards.length -
        perView()
      );


  const render =
    () => {

      reviewIndex =
        Math.min(
          reviewIndex,
          maxIndex()
        );


      const card =
        cards[0];


      const gap =
        22;


      const move =
        card
          ? (
              card
                .getBoundingClientRect()
                .width +
              gap
            ) *
            reviewIndex
          : 0;


      reviewsTrack.style.transform =
        `translateX(-${move}px)`;


      if (
        reviewDots
      ) {

        reviewDots.innerHTML =
          "";


        const dots =
          Math.max(
            1,
            maxIndex() + 1
          );


        for (
          let i = 0;
          i < dots;
          i++
        ) {

          const dot =
            document.createElement(
              "button"
            );


          dot.type =
            "button";


          dot.className =
            i === reviewIndex
              ? "active"
              : "";


          dot.setAttribute(
            "aria-label",
            `Ir para avaliação ${
              i + 1
            }`
          );


          dot.addEventListener(
            "click",
            () => {

              reviewIndex =
                i;

              render();

            }
          );


          reviewDots.appendChild(
            dot
          );

        }

      }

    };


  reviewNext?.addEventListener(
    "click",
    () => {

      if (
        reviewIndex <
        maxIndex()
      ) {

        reviewIndex++;

        render();

      }

    }
  );


  reviewPrev?.addEventListener(
    "click",
    () => {

      if (
        reviewIndex >
        0
      ) {

        reviewIndex--;

        render();

      }

    }
  );


  window.addEventListener(
    "resize",
    render
  );


  render();

}


loadReviews();
   /* =========================================================
      TOAST
      ========================================================= */
 
   function showToast(
     message
   ) {
 
     let toast =
       document.getElementById(
         "gs-toast"
       );
 
 
     if (
       !toast
     ) {
 
       toast =
         document.createElement(
           "div"
         );
 
 
       toast.id =
         "gs-toast";
 
 
       document.body.appendChild(
         toast
       );
 
     }
 
 
     toast.textContent =
       message;
 
 
     toast.classList.add(
       "show"
     );
 
 
     clearTimeout(
       window.__toastTimer
     );
 
 
     window.__toastTimer =
       setTimeout(
         () =>
           toast.classList.remove(
             "show"
           ),
         2200
       );
 
   }
 
 
   /* =========================================================
      INICIALIZAÇÃO FINAL
      ========================================================= */
 
   updateCart();
 
   loadItems();
 
   //loadLastOrder();

   const comentarioAvaliacao =
  document.getElementById("comentario");

const contadorAvaliacao =
  document.getElementById("contadorAvaliacao");

comentarioAvaliacao?.addEventListener(
  "input",
  () => {

    if (contadorAvaliacao) {
      contadorAvaliacao.textContent =
        `${comentarioAvaliacao.value.length}/150`;
    }

  }
);
 
 });