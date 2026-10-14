
const nomeExibido = document.getElementById("nomeExibido");
const usuarioExibido = document.getElementById("usuarioExibido");
const bioExibida = document.getElementById("bioExibida");
const avatarPerfil = document.getElementById("avatarPerfil");

const areaEdicao = document.getElementById("areaEdicao");
const formPerfil = document.getElementById("formPerfil");
const mensagemPerfil = document.getElementById("mensagemPerfil");

const campoNome = document.getElementById("nome");
const campoUsuario = document.getElementById("usuario");
const campoBio = document.getElementById("bio");
const campoAvatar = document.getElementById("avatarInicial");

const botaoEditar = document.getElementById("botaoEditar");
const botaoCancelar = document.getElementById("botaoCancelar");

const chavePerfil = "cinelog-perfil";

// Informações que aparecem quando o perfil é aberto pela primeira vez.
const perfilPadrao = {
    nome: "Cinéfilo",
    usuario: "cinefilo",
    bio: "Seu espaço para registrar sua jornada pelo cinema.",
    avatar: "C"
};

// Busca as informações salvas no navegador.
function carregarPerfil() {
    const dadosSalvos = localStorage.getItem(chavePerfil);

    let perfil = perfilPadrao;

    if (dadosSalvos) {
        try {
            perfil = {
                ...perfilPadrao,
                ...JSON.parse(dadosSalvos)
            };
        } catch (erro) {
            perfil = perfilPadrao;
        }
    }

    nomeExibido.textContent = perfil.nome;
    usuarioExibido.textContent = "@" + perfil.usuario;
    bioExibida.textContent = perfil.bio;
    avatarPerfil.textContent = perfil.avatar || "C";
}

// Preenche os campos com as informações atuais.
function preencherFormulario() {
    campoNome.value = nomeExibido.textContent;
    campoUsuario.value = usuarioExibido.textContent.replace("@", "");
    campoBio.value = bioExibida.textContent;
    campoAvatar.value = avatarPerfil.textContent;
}

// Abre a área de edição.
botaoEditar.addEventListener("click", function() {
    preencherFormulario();
    mensagemPerfil.textContent = "";
    areaEdicao.hidden = false;
});

// Fecha a edição sem salvar.
botaoCancelar.addEventListener("click", function() {
    areaEdicao.hidden = true;
});

// Salva as informações quando o formulário é enviado.
formPerfil.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nome = campoNome.value.trim();
    const usuario = campoUsuario.value.trim();
    const bio = campoBio.value.trim();
    const avatar = campoAvatar.value.trim();

    if (!nome || !usuario) {
        mensagemPerfil.textContent = "Preencha o nome e o usuário.";
        return;
    }

    const perfil = {
        nome: nome,
        usuario: usuario,
        bio: bio || "Ainda não escreveu uma biografia.",
        avatar: (avatar || nome).slice(0, 2).toUpperCase()
    };

    localStorage.setItem(chavePerfil, JSON.stringify(perfil));

    carregarPerfil();
    areaEdicao.hidden = true;
    mensagemPerfil.textContent = "Perfil salvo!";
});

// Mostra os dados salvos ao abrir a página.
carregarPerfil();
