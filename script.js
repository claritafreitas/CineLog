

const filmes = [
    {
        id: 1,
        titulo: "Interestelar",
        ano: 2014,
        nota: "4.8",
        poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        sinopse: "Em um futuro em que a Terra enfrenta uma crise ambiental, um grupo de astronautas parte em uma missão espacial em busca de um novo lar para a humanidade."
    },
    {
        id: 2,
        titulo: "A Origem",
        ano: 2010,
        nota: "4.7",
        poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
        sinopse: "um especialista em invadir sonhos recebe a missão de implantar uma ideia na mente de uma pessoa."
    },
    {
        id: 3,
        titulo: "The Batman",
        ano: 2022,
        nota: "4.3",
        poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
        sinopse: "Batman investiga uma série de crimes em Gotham e enfrenta um mistério que envolve pessoas poderosas da cidade."
    },
    {
        id: 4,
        titulo: "Duna: Parte Dois",
        ano: 2024,
        nota: "4.6",
        poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        sinopse: "Paul Atreides se une aos Fremen e enfrenta escolhas que podem mudar o destino de Arrakis."
    }
];


// ======================================
// ARMAZENAMENTO NO NAVEGADOR
// ======================================

function carregarDados(chave) {
    try {
        const dados = JSON.parse(localStorage.getItem(chave));
        return Array.isArray(dados) ? dados : [];
    } catch (erro) {
        return [];
    }
}

function salvarDados(chave, dados) {
    try {
        localStorage.setItem(chave, JSON.stringify(dados));
        return true;
    } catch (erro) {
        alert("Não foi possível salvar os dados neste navegador.");
        return false;
    }
}

let minhaLista = carregarDados("cinelog-lista");
let avaliacoes = carregarDados("cinelog-avaliacoes");


// ======================================
// CRIAR CARTÃO DE FILME
// ======================================

function criarCartao(filme) {
    const cartao = document.createElement("article");
    cartao.className = "filme";

    const imagem = document.createElement("img");
    imagem.src = filme.poster;
    imagem.alt = "Pôster de " + filme.titulo;
    imagem.loading = "lazy";

    imagem.style.cursor = "pointer";
    imagem.addEventListener("click", function() {
    window.location.href = "filme.html?id=" + filme.id;
});

    // Se o pôster falhar, o cartão continua aparecendo.
    imagem.addEventListener("error", function() {
        const alternativa = document.createElement("div");
        alternativa.className = "poster-indisponivel";
        alternativa.textContent = filme.titulo;

        imagem.replaceWith(alternativa);
    }, { once: true });

    const informacoes = document.createElement("div");
    informacoes.className = "info-filme";

    const titulo = document.createElement("h3");
    titulo.textContent = filme.titulo;

    titulo.style.cursor = "pointer";
    titulo.addEventListener("click", function() {
    window.location.href = "filme.html?id=" + filme.id;
});

    const ano = document.createElement("p");
    ano.className = "texto-secundario";
    ano.textContent = String(filme.ano);

    const nota = document.createElement("p");
    nota.className = "nota";
    nota.textContent = "★ " + filme.nota;

    informacoes.append(titulo, ano, nota);

    const botao = document.createElement("button");
    botao.type = "button";
    atualizarBotaoLista(botao, filme);

    botao.addEventListener("click", function() {
        if (minhaLista.includes(filme.id)) {
            return;
        }

        minhaLista.push(filme.id);

        if (salvarDados("cinelog-lista", minhaLista)) {
            atualizarBotaoLista(botao, filme);
            mostrarMinhaLista();
        } else {
            minhaLista = minhaLista.filter(function(id) {
                return id !== filme.id;
            });
        }
    });

    cartao.append(imagem, informacoes, botao);

    return cartao;
}


// ======================================
// ATUALIZAR BOTÃO DA LISTA
// ======================================

function atualizarBotaoLista(botao, filme) {
    const estaNaLista = minhaLista.includes(filme.id);

    botao.textContent = estaNaLista
        ? "✓ Na minha lista"
        : "+ Quero assistir";

    botao.classList.toggle("na-lista", estaNaLista);
    botao.setAttribute("aria-pressed", String(estaNaLista));
}


// ======================================
// MOSTRAR FILMES NA PÁGINA
// ======================================

function mostrarFilmes(lista, elemento) {
    if (!elemento) {
        return;
    }

    elemento.replaceChildren();

    lista.forEach(function(filme) {
        elemento.appendChild(criarCartao(filme));
    });
}

// A página inicial mostra os filmes em destaque.
mostrarFilmes(
    filmes,
    document.getElementById("listaDestaque")
);

// A página Explorar mostra o catálogo completo.
mostrarFilmes(
    filmes,
    document.getElementById("listaFilmes")
);


// ======================================
// PESQUISAR FILMES
// ======================================

const campoPesquisa = document.getElementById("pesquisaFilmes");
const resultadoPesquisa = document.getElementById("resultadoPesquisa");

if (campoPesquisa) {
    campoPesquisa.addEventListener("input", function() {
        const pesquisa = campoPesquisa.value
            .trim()
            .toLocaleLowerCase("pt-BR");

        const encontrados = filmes.filter(function(filme) {
            return filme.titulo
                .toLocaleLowerCase("pt-BR")
                .includes(pesquisa);
        });

        mostrarFilmes(
            encontrados,
            document.getElementById("listaFilmes")
        );

        if (resultadoPesquisa) {
            if (encontrados.length === 0) {
                resultadoPesquisa.textContent =
                    "Nenhum filme encontrado. Tente outro título.";
            } else {
                resultadoPesquisa.textContent =
                    encontrados.length === 1
                        ? "1 filme encontrado"
                        : encontrados.length + " filmes encontrados";
            }
        }
    });
}


// ======================================
// MINHA LISTA
// ======================================

function mostrarMinhaLista() {
    const elemento = document.getElementById("listaAssistir");

    if (!elemento) {
        return;
    }

    elemento.replaceChildren();

    if (minhaLista.length === 0) {
        const aviso = document.createElement("p");
        aviso.className = "vazio";
        aviso.textContent =
            "Sua lista está vazia. Explore o catálogo e salve filmes para assistir depois.";

        elemento.appendChild(aviso);
        return;
    }

    minhaLista.forEach(function(idFilme) {
        const filme = filmes.find(function(item) {
            return item.id === idFilme;
        });

        // Ignora IDs que não existem mais no catálogo.
        if (!filme) {
            return;
        }

        const item = document.createElement("article");
        item.className = "item-lista";

        const nome = document.createElement("span");
        nome.textContent = filme.titulo + " (" + filme.ano + ")";

        const remover = document.createElement("button");
        remover.type = "button";
        remover.textContent = "Remover";

        remover.addEventListener("click", function() {
            const listaAnterior = [...minhaLista];

            minhaLista = minhaLista.filter(function(id) {
                return id !== filme.id;
            });

            if (salvarDados("cinelog-lista", minhaLista)) {
                mostrarMinhaLista();

                // Atualiza os botões se o catálogo estiver na mesma página.
                document.querySelectorAll(".filme").forEach(function(cartao) {
                    const titulo = cartao.querySelector("h3");

                    if (titulo && titulo.textContent === filme.titulo) {
                        const botao = cartao.querySelector("button");

                        if (botao) {
                            atualizarBotaoLista(botao, filme);
                        }
                    }
                });
            } else {
                minhaLista = listaAnterior;
            }
        });

        item.append(nome, remover);
        elemento.appendChild(item);
    });
}

mostrarMinhaLista();


// ======================================
// AVALIAÇÕES
// ======================================

const formulario = document.getElementById("formAvaliacao");

if (formulario) {
    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const nome = document.getElementById("nomeUsuario")
            .value.trim();

        const filmeId = Number(
            document.getElementById("filmeAvaliacao").value
        );

        const nota = Number(
            document.getElementById("notaAvaliacao").value
        );

        const comentario = document.getElementById("textoAvaliacao")
            .value.trim();

        if (!nome) {
            return;
        }

        avaliacoes.unshift({
            id: Date.now(),
            nome: nome,
            filmeId: filmeId,
            nota: nota,
            comentario: comentario
        });

        if (salvarDados("cinelog-avaliacoes", avaliacoes)) {
            formulario.reset();

            const mensagem = document.getElementById("mensagemAvaliacao");

            if (mensagem) {
                mensagem.textContent = "Avaliação salva!";
            }

            mostrarAvaliacoes();
        } else {
            avaliacoes.shift();
        }
    });
}

function mostrarAvaliacoes() {
    const elemento = document.getElementById("listaAvaliacoes");

    if (!elemento) {
        return;
    }

    elemento.replaceChildren();

    if (avaliacoes.length === 0) {
        const aviso = document.createElement("p");
        aviso.className = "vazio";
        aviso.textContent = "Ainda não existem avaliações.";
        elemento.appendChild(aviso);
        return;
    }

    avaliacoes.forEach(function(avaliacao) {
        const filme = filmes.find(function(item) {
            return item.id === avaliacao.filmeId;
        });

        const cartao = document.createElement("article");
        cartao.className = "critica";

        const nome = document.createElement("h3");
        nome.textContent = avaliacao.nome;

        const tituloFilme = document.createElement("p");
        tituloFilme.className = "filme-avaliado";
        tituloFilme.textContent = filme
            ? filme.titulo
            : "Filme não encontrado";

        const nota = document.createElement("p");
        nota.className = "nota";
        nota.textContent =
            "★".repeat(avaliacao.nota) +
            "☆".repeat(5 - avaliacao.nota) +
            " (" + avaliacao.nota + "/5)";

        const comentario = document.createElement("p");
        comentario.className = "comentario";
        comentario.textContent = avaliacao.comentario ||
            "Nenhum comentário escrito.";

        cartao.append(nome, tituloFilme, nota, comentario);
        elemento.appendChild(cartao);
    });
}

mostrarAvaliacoes();


function mostrarDetalhesFilme() {
    const id = Number(new URLSearchParams(window.location.search).get("id"));
    const filme = filmes.find(function(f) {
        return f.id === id;
    });

    const detalhes = document.getElementById("detalhesFilme");

    if (!filme) {
        detalhes.textContent = "Filme não encontrado.";
        return;
    }

    // Verifica se o filme já está curtido
    let curtidos = carregarDados("cinelog-curtidos");
    const estaCurtido = curtidos.includes(filme.id);

    detalhes.innerHTML = `
        <a href="explorar.html" class="voltar-filmes">← Voltar aos filmes</a>

        <div class="detalhes-filme">
            <img src="${filme.poster}" alt="${filme.titulo}"
                 class="poster-detalhes">

            <div class="informacoes-detalhes">
                <h1>${filme.titulo}</h1>
                <p>Ano: ${filme.ano}</p>
                <p>Nota do catálogo: ⭐ ${filme.nota}</p>
                <p>${filme.sinopse}</p>

                <button id="botaoCurtir">
                    ${estaCurtido ? "❤️ Curtido" : "🤍 Curtir"}
                </button>

                <button id="botaoAvaliar">⭐ Avaliar filme</button>
                <button id="botaoLista"></button>
            </div>
        </div>

        <section id="areaFormulario" class="painel-avaliacao hidden">
            <h2>Avalie este filme</h2>

            <form id="formAvaliacaoFilme">
                <label for="notaFilme">Sua nota:</label>
                <select id="notaFilme" required>
                    <option value="">Escolha uma nota</option>
                    <option value="1">1 estrela</option>
                    <option value="2">2 estrelas</option>
                    <option value="3">3 estrelas</option>
                    <option value="4">4 estrelas</option>
                    <option value="5">5 estrelas</option>
                </select>

                <label for="comentarioFilme">Seu comentário:</label>
                <textarea id="comentarioFilme"
                          placeholder="O que você achou do filme?"
                          required></textarea>

                <button type="submit">Salvar avaliação</button>
                <p id="mensagemFilme" aria-live="polite"></p>
            </form>
        </section>

        <section class="painel-avaliacao">
            <h2>Avaliações da comunidade</h2>
            <div id="avaliacoesDoFilme"></div>
        </section>
    `;

    // Botão de curtir
    document.getElementById("botaoCurtir").addEventListener("click", function() {
        let listaCurtidos = carregarDados("cinelog-curtidos");

        if (listaCurtidos.includes(filme.id)) {
            listaCurtidos = listaCurtidos.filter(function(idFilme) {
                return idFilme !== filme.id;
            });
        } else {
            listaCurtidos.push(filme.id);
        }

        salvarDados("cinelog-curtidos", listaCurtidos);
        mostrarDetalhesFilme();
    });

    // Botão de avaliação: leva o usuário até o formulário
    document.getElementById("botaoAvaliar").addEventListener("click", function() {
    const formulario = document.getElementById("areaFormulario");

    formulario.classList.remove("hidden");
    formulario.scrollIntoView({ behavior: "smooth" });

    document.getElementById("notaFilme").focus();
});

    // Botão para adicionar ou remover da lista
    const botaoLista = document.getElementById("botaoLista");

function atualizarListaDetalhes() {
    const lista = carregarDados("cinelog-lista");

    const estaNaLista = lista.some(function(item) {
        return Number(typeof item === "object" ? item.id : item) === filme.id;
    });

    botaoLista.textContent = estaNaLista
        ? "➖ Remover da minha lista"
        : "➕ Adicionar à minha lista";
}

atualizarListaDetalhes();

botaoLista.addEventListener("click", function() {
    let lista = carregarDados("cinelog-lista");

    const estaNaLista = lista.some(function(item) {
        return Number(typeof item === "object" ? item.id : item) === filme.id;
    });

    if (estaNaLista) {
        lista = lista.filter(function(item) {
            return Number(typeof item === "object" ? item.id : item) !== filme.id;
        });
    } else {
        lista.push(filme);
    }

    salvarDados("cinelog-lista", lista);
    atualizarListaDetalhes();
});

    // Salva a avaliação
    document.getElementById("formAvaliacaoFilme").addEventListener("submit", function(event) {
        event.preventDefault();

        let avaliacoesSalvas = carregarDados("cinelog-avaliacoes");

        const novaAvaliacao = {
            id: Date.now(),
            nome: "Você",
            filmeId: filme.id,
            nota: document.getElementById("notaFilme").value,
            comentario: document.getElementById("comentarioFilme").value
        };

        avaliacoesSalvas.push(novaAvaliacao);
        salvarDados("cinelog-avaliacoes", avaliacoesSalvas);

        document.getElementById("mensagemFilme").textContent =
            "Avaliação salva com sucesso!";

        mostrarDetalhesFilme();
    });

    // Mostra as avaliações feitas para este filme
    const avaliacoesDoFilme = document.getElementById("avaliacoesDoFilme");
    const avaliacoesSalvas = carregarDados("cinelog-avaliacoes");

    const desteFilme = avaliacoesSalvas.filter(function(avaliacao) {
        return Number(avaliacao.filmeId) === filme.id;
    });

    if (desteFilme.length === 0) {
        avaliacoesDoFilme.textContent = "Este filme ainda não tem avaliações.";
    } else {
        desteFilme.forEach(function(avaliacao) {
            const cartao = document.createElement("div");
            cartao.className = "cartao-avaliacao";

            const titulo = document.createElement("h3");
            titulo.textContent = avaliacao.nome || "Usuário";

            const nota = document.createElement("p");
            nota.textContent = "⭐ Nota: " + avaliacao.nota + "/5";

            const comentario = document.createElement("p");
            comentario.textContent = avaliacao.comentario;

            cartao.append(titulo, nota, comentario);
            avaliacoesDoFilme.appendChild(cartao);
        });
    }
}

mostrarDetalhesFilme();

function mostrarCurtidosPerfil() {
    const area = document.getElementById("listaCurtidos");

    // Só executa se estiver na página de perfil
    if (!area) {
        return;
    }

    area.innerHTML = "";

    const curtidos = carregarDados("cinelog-curtidos");

    const filmesCurtidos = filmes.filter(function(filme) {
        return curtidos.includes(filme.id);
    });

    if (filmesCurtidos.length === 0) {
        area.textContent = "Você ainda não curtiu nenhum filme.";
        return;
    }

    filmesCurtidos.forEach(function(filme) {
        const cartao = document.createElement("a");
        cartao.className = "cartao-curtido";
        cartao.href = "filme.html?id=" + filme.id;

        const imagem = document.createElement("img");
        imagem.src = filme.poster;
        imagem.alt = filme.titulo;

        const titulo = document.createElement("h3");
        titulo.textContent = filme.titulo;

        cartao.append(imagem, titulo);
        area.appendChild(cartao);
    });
}

mostrarCurtidosPerfil();