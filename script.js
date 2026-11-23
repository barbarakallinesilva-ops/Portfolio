
// ==========================================
// PORTFÓLIO - BARBARA KALLINE
// ==========================================

//  E-MAIL 
const EMAIL_DESTINO = "barbara.kallinesilva@gmail.com";

// ==========================================
// ELEMENTOS DA PÁGINA
// ==========================================

document.getElementById("ano").textContent = new Date().getFullYear();

const formulario = document.getElementById("contactForm");
const painelAdmin = document.getElementById("painelAdmin");
const abrirAdmin = document.getElementById("abrirAdmin");
const fecharAdmin = document.getElementById("fecharAdmin");

const listaMensagens = document.getElementById("listaMensagens");
const contador = document.getElementById("contador");
const areaEdicao = document.getElementById("areaEdicao");

// ==========================================
// LOCALSTORAGE
// ==========================================

let mensagens = [];

try {
    mensagens = JSON.parse(
        localStorage.getItem("mensagensBarbara")
    ) || [];
} catch (erro) {
    mensagens = [];
}

// Criar 20 registros de teste caso esteja vazio
if (mensagens.length === 0) {
    for (let i = 1; i <= 20; i++) {
        mensagens.push({
            id: i,
            nome: "Usuário de teste " + i,
            email: "teste" + i + "@email.com",
            assunto: "Mensagem de teste",
            mensagem: "Este é um registro utilizado para testar o sistema administrativo."
        });
    }

    salvarDados();
}

// Salvar mensagens
function salvarDados() {
    localStorage.setItem(
        "mensagensBarbara",
        JSON.stringify(mensagens)
    );
}

// ==========================================
// PAINEL ADMINISTRATIVO
// ==========================================

function abrirPainel() {
    painelAdmin.style.display = "flex";
    atualizarLista();
}

function fecharPainel() {
    painelAdmin.style.display = "none";
}

abrirAdmin.addEventListener("click", abrirPainel);
fecharAdmin.addEventListener("click", fecharPainel);

// Atalho Ctrl + Shift + A
document.addEventListener("keydown", function(event) {
    if (
        event.ctrlKey &&
        event.shiftKey &&
        event.key.toLowerCase() === "a"
    ) {
        abrirPainel();
    }
});

// ==========================================
// MOSTRAR MENSAGENS
// ==========================================

function atualizarLista() {
    listaMensagens.innerHTML = "";
    contador.textContent = mensagens.length;

    if (mensagens.length === 0) {
        listaMensagens.textContent = "Nenhuma mensagem cadastrada.";
        return;
    }

    mensagens.forEach(function(item) {
        const card = document.createElement("div");
        card.className = "mensagem-admin";

        const titulo = document.createElement("h3");
        titulo.textContent = item.assunto;

        const nome = document.createElement("p");
        nome.textContent = "Nome: " + item.nome;

        const email = document.createElement("p");
        email.textContent = "E-mail: " + item.email;

        const texto = document.createElement("p");
        texto.textContent = item.mensagem;

        const editar = document.createElement("button");
        editar.type = "button";
        editar.textContent = "Editar";

        editar.addEventListener("click", function() {
            prepararEdicao(item.id);
        });

        const excluir = document.createElement("button");
        excluir.type = "button";
        excluir.textContent = "Excluir";

        excluir.addEventListener("click", function() {
            excluirMensagem(item.id);
        });

        card.append(
            titulo,
            nome,
            email,
            texto,
            editar,
            excluir
        );

        listaMensagens.appendChild(card);
    });
}

// ==========================================
// CADASTRAR E ENVIAR MENSAGEM
// ==========================================

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    const novaMensagem = {
        id: Date.now(),
        nome: document.getElementById("nome").value.trim(),
        email: document.getElementById("email").value.trim(),
        assunto: document.getElementById("assunto").value.trim(),
        mensagem: document.getElementById("mensagem").value.trim()
    };

    const status = document.getElementById("status");

    // Salvar no sistema
    mensagens.push(novaMensagem);
    salvarDados();
    atualizarLista();

    status.textContent = "Mensagem cadastrada. Enviando e-mail...";

    // Verificar se o e-mail foi configurado
    if (
        EMAIL_DESTINO === "SEU_EMAIL_AQUI" ||
        EMAIL_DESTINO.trim() === ""
    ) {
        status.textContent =
            "Mensagem salva no painel. Configure seu e-mail para ativar o envio.";
        formulario.reset();
        return;
    }

    try {
        const resposta = await fetch(
            "https://formsubmit.co/ajax/" + encodeURIComponent(EMAIL_DESTINO),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: novaMensagem.nome,
                    email: novaMensagem.email,
                    subject: novaMensagem.assunto,
                    message: novaMensagem.mensagem,
                    _captcha: "false"
                })
            }
        );

        const resultado = await resposta.json();

        if (
            resposta.ok &&
            String(resultado.success).toLowerCase() === "true"
        ) {
            status.textContent =
                "Mensagem enviada e salva com sucesso!";
        } else {
            status.textContent =
                "Mensagem salva no painel, mas o envio do e-mail precisa ser verificado.";
        }

    } catch (erro) {
        console.error("Erro no envio:", erro);

        status.textContent =
            "Mensagem salva no painel, mas não foi possível enviar o e-mail.";
    }

    formulario.reset();
});

// ==========================================
// EDITAR MENSAGENS
// ==========================================

function prepararEdicao(id) {
    const item = mensagens.find(function(mensagem) {
        return mensagem.id === id;
    });

    if (!item) return;

    document.getElementById("editarNome").value = item.nome;
    document.getElementById("editarEmail").value = item.email;
    document.getElementById("editarAssunto").value = item.assunto;
    document.getElementById("editarMensagem").value = item.mensagem;

    areaEdicao.style.display = "block";

    document.getElementById("salvarEdicao").onclick = function() {
        item.nome = document.getElementById("editarNome").value;
        item.email = document.getElementById("editarEmail").value;
        item.assunto = document.getElementById("editarAssunto").value;
        item.mensagem = document.getElementById("editarMensagem").value;

        salvarDados();
        atualizarLista();

        areaEdicao.style.display = "none";
    };
}

// Cancelar edição
document.getElementById("cancelarEdicao").addEventListener("click", function() {
    areaEdicao.style.display = "none";
});

// ==========================================
// EXCLUIR MENSAGENS
// ==========================================

function excluirMensagem(id) {
    mensagens = mensagens.filter(function(item) {
        return item.id !== id;
    });

    salvarDados();
    atualizarLista();
}

// ==========================================
// EXPORTAR ARQUIVO JSON
// ==========================================

document.getElementById("exportar").addEventListener("click", function() {
    const arquivo = new Blob(
        [JSON.stringify(mensagens, null, 2)],
        { type: "application/json" }
    );

    const link = document.createElement("a");

    const url = URL.createObjectURL(arquivo);

    link.href = url;
    link.download = "mensagens-barbara.json";

    link.click();

    URL.revokeObjectURL(url);
});

// ==========================================
// INICIALIZAÇÃO
// ==========================================

atualizarLista();
