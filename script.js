document.addEventListener("DOMContentLoaded", () => {
  const videoIntro = document.getElementById("video-intro");
  const videoInterativo = document.getElementById("video-interativo");
  const videoInterativoAlternativo = document.getElementById("video-interativo-alternativo");
  const themeToggle = document.getElementById("theme-toggle");
  const conteudoPrincipal = document.getElementById("conteudo-principal");
  const tituloPrincipal = document.getElementById("titulo-principal");
  const subtituloPrincipal = document.getElementById("subtitulo-principal");
  const localizacao = document.getElementById("local");
  const heroExtras = document.getElementById("hero-extras"); // Nossa nova div
  const blocoApresentacao = document.querySelector(".bloco-apresentacao");
  const blocoFoto = document.querySelector(".bloco-foto");
  
  // Linha de segurança ATUALIZADA com todos os elementos
  if (!videoIntro || !videoInterativo || !videoInterativoAlternativo || !themeToggle || !conteudoPrincipal || !tituloPrincipal || !subtituloPrincipal || !localizacao || !heroExtras || !blocoApresentacao || !blocoFoto) {
    // Se der erro, ele avisa no console exatamente para você poder investigar!
    console.error("O Script parou! Algum elemento não foi encontrado no HTML.");
    return;
  }

  videoInterativo.pause();
  videoInterativo.currentTime = 0;
  videoInterativoAlternativo.pause();
  videoInterativoAlternativo.currentTime = 0;
  videoIntro.currentTime = 0;
  videoIntro.style.opacity = "1";
  videoInterativo.style.opacity = "0";
  conteudoPrincipal.style.opacity = "0";
  conteudoPrincipal.style.transform = "translateY(20px)";
  blocoApresentacao.style.opacity = "0";
  blocoApresentacao.style.transform = "translateY(20px)";
  blocoFoto.style.opacity = "0";
  blocoFoto.style.transform = "translateY(20px)";
  heroExtras.style.opacity = "0"; 
  heroExtras.style.transition = "opacity 0.8s ease, transform 0.8s ease";

  // O símbolo '|' vai dizer para o script pular de linha e mudar a cor
  const textoTitulo = "Olá, eu sou o |Caíke Tadeus"; 
  const textoSubtitulo = "Desenvolvedor Back-End / Java / PHP / Node.js / SQL";
  const textoLocal = "📍 Rio de Janeiro, Brasil";

  const digitarTexto = (elemento, texto, velocidade = 60) => {
    elemento.innerHTML = ""; // Usamos innerHTML para poder injetar tags HTML
    let indice = 0;
    
    // Variável para saber se estamos digitando a parte destacada
    let digitandoDestaque = false; 
    
    // Cria um elemento span para guardar o texto colorido
    let spanDestaque = document.createElement('span');
    spanDestaque.className = "texto-destaque";

    const intervalo = setInterval(() => {
      const letra = texto[indice];

      if (letra === '|') {
        // Quando encontrar o '|', pula a linha e avisa que o próximo texto é destaque
        elemento.appendChild(document.createElement('br'));
        elemento.appendChild(spanDestaque);
        digitandoDestaque = true;
      } else {
        if (digitandoDestaque) {
          // Se for destaque, coloca a letra dentro do span colorido
          spanDestaque.textContent += letra;
        } else {
          // Se não, coloca a letra normal no elemento pai
          elemento.innerHTML += letra;
        }
      }

      indice += 1;

      if (indice >= texto.length) {
        clearInterval(intervalo);
      }
    }, velocidade);
  };

  const iniciarTexto = () => {
    setTimeout(() => {
      conteudoPrincipal.style.opacity = "1";
      conteudoPrincipal.style.transform = "translateY(0)";
      blocoApresentacao.style.opacity = "1";
      blocoApresentacao.style.transform = "translateY(0)";
      blocoFoto.style.opacity = "1";
      blocoFoto.style.transform = "translateY(0)";

      themeToggle.classList.add("visivel");
      const menuAparecer = document.getElementById("menu-toggle");
      if (menuAparecer) menuAparecer.classList.add("visivel");

      digitarTexto(tituloPrincipal, textoTitulo, 80);
      setTimeout(() => digitarTexto(subtituloPrincipal, textoSubtitulo, 60), 1500);
      setTimeout(() => digitarTexto(localizacao, textoLocal, 40), 4000);
      
      setTimeout(() => {
        heroExtras.style.opacity = "1";
      }, 5500);
    }, 3000);
  };

  
  
  

  const atualizarVideoPeloMouse = (video, e) => {
    const centroX = window.innerWidth / 2;
    const centroY = window.innerHeight / 2;
    const deslocX = e.clientX - centroX;
    const deslocY = e.clientY - centroY;

    if (Math.abs(deslocX) < 2 && Math.abs(deslocY) < 2) {
      video.currentTime = 0;
      return;
    }

    const angulo = Math.atan2(deslocY, deslocX);
    const progressoRadial = (angulo + Math.PI) / (2 * Math.PI);

    if (video.duration) {
      const tempoDestino = progressoRadial * video.duration;
      video.currentTime = tempoDestino;
    }
  };

  let temaAtivo = false;
  const getVideoAtivo = () => (temaAtivo ? videoInterativoAlternativo : videoInterativo);

  const trocarParaInterativo = () => {
    videoIntro.style.opacity = "0";
    videoInterativo.style.opacity = "1";
    videoInterativoAlternativo.style.opacity = "0";

    videoInterativo.pause();
    videoInterativo.currentTime = 0;
    videoInterativoAlternativo.pause();
    videoInterativoAlternativo.currentTime = 0;

    if (!window.__mouseListenerAttached) {
      let animacaoPendente;

      window.addEventListener("mousemove", (e) => {
        // --- A MÁGICA ESTÁ AQUI: Se o menu estiver aberto, o mouse não atualiza o vídeo ---
        if (overlayMenu && overlayMenu.classList.contains('ativo')) return;

        if (animacaoPendente) cancelAnimationFrame(animacaoPendente);
        
        animacaoPendente = requestAnimationFrame(() => {
          const videoAtivo = getVideoAtivo();
          atualizarVideoPeloMouse(videoAtivo, e);
        });
      });

      window.__mouseListenerAttached = true;
    }
  };

  const aplicarTema = () => {
    document.body.classList.toggle("tema-claro", temaAtivo);
    themeToggle.querySelector(".theme-icon").textContent = temaAtivo ? "🌙" : "☀️";
  };

  themeToggle.addEventListener("click", () => {
    temaAtivo = !temaAtivo;
    aplicarTema();

    const videoAtual = getVideoAtivo();
    const videoAnterior = temaAtivo ? videoInterativo : videoInterativoAlternativo;

    if (videoAtual.src) {
      videoAnterior.style.opacity = "0";
      videoAtual.style.opacity = "1";
      videoAtual.currentTime = 0;
      videoAtual.pause();
    }
  });

  videoInterativoAlternativo.src = "Organic 3D Shapes Pulsing 202607131739 (Online-Video-Cutter.Com).mp4";

  videoIntro.addEventListener("ended", trocarParaInterativo);
  videoIntro.addEventListener("error", () => {
    trocarParaInterativo();
  });

  const iniciarIntro = () => {
    // Tenta dar o play no vídeo
    videoIntro.play().then(() => {
      // SUCESSO: O vídeo carregou e começou a rodar! 
      // Agora sim começamos a contar os 3 segundos para mostrar o texto.
      iniciarTexto(); 
    }).catch(() => {
      // ERRO (Autoplay bloqueado pelo navegador): 
      // Mostra o texto mesmo assim para a tela não ficar travada e vai pro vídeo interativo.
      iniciarTexto(); 
      setTimeout(trocarParaInterativo, 1000);
    });
  };

  if (videoIntro.readyState >= 2) {
    iniciarIntro();
  } else {
    videoIntro.addEventListener("canplay", iniciarIntro, { once: true });
  }


  // --- NAVEGAÇÃO POR SETAS NO CENTRO DA TELA ---
  const secaoInicial = document.querySelector('.container-video');
  const secaoSobre = document.getElementById('sobre');
  const secaoProjetos = document.getElementById('projetos');
  const secaoCurriculos = document.getElementById('curriculos');
  const secaoHabilidades = document.getElementById('habilidades');
  const navegacaoSecoes = document.querySelector('.navegacao-secoes');
  const setasNavegacao = document.querySelectorAll('.seta-navegacao');
  const secaoContato = document.getElementById('contato');
  const secaoFinal = document.getElementById('conversa');
  const secoesNavegacao = [secaoInicial, secaoSobre, secaoProjetos, secaoCurriculos, secaoHabilidades, secaoContato, secaoFinal].filter(Boolean);

  const transicionarParaSecao = (elemento) => {
    if (!elemento) return;
    elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const indiceSecaoAtual = () => {
    const centroTela = window.innerHeight / 2;
    let indiceAtual = 0;
    let menorDistancia = Infinity;

    secoesNavegacao.forEach((secao, index) => {
      const retangulo = secao.getBoundingClientRect();
      const centroSecao = retangulo.top + retangulo.height / 2;
      const distancia = Math.abs(centroSecao - centroTela);

      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        indiceAtual = index;
      }
    });

    return indiceAtual;
  };

  const navegarComSeta = (direcao) => {
    const indiceAtual = indiceSecaoAtual();
    const proximoIndice = Math.max(0, Math.min(secoesNavegacao.length - 1, indiceAtual + direcao));
    transicionarParaSecao(secoesNavegacao[proximoIndice]);
  };

  // Adiciona o evento de clique em cada uma das setas
  setasNavegacao.forEach((seta) => {
    seta.addEventListener('click', () => {
      const direcao = Number(seta.dataset.direcao || 0);
      navegarComSeta(direcao);
    });
  });

  // --- CONTROLE DE VISIBILIDADE DAS SETAS ---
  // --- CONTROLE DE VISIBILIDADE DAS SETAS COM OBSERVER ---
  const setaCima = document.querySelector('.seta-cima');
  const setaBaixo = document.querySelector('.seta-baixo');
  
  // 1. Esconde a seta de CIMA quando a seção do Vídeo (topo) estiver visível
  const observerTopo = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setaCima.classList.add('oculto');
    } else {
      setaCima.classList.remove('oculto');
    }
  }, { threshold: 0.1 }); // Dispara quando 10% do topo estiver visível
  
  if (secaoInicial) observerTopo.observe(secaoInicial);

  // 2. Esconde a seta de BAIXO quando a seção de Habilidades (final) estiver bem visível na tela
  const observerFinal = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setaBaixo.classList.add('oculto');
    } else {
      setaBaixo.classList.remove('oculto');
    }
  }, { threshold: 0.6 }); // Dispara quando 60% do final aparecer
  
if (secaoFinal) observerFinal.observe(secaoFinal);

  


  // --- OBSERVER PARA ANIMAÇÃO DE APARECER (FADE-IN NO SCROLL) ---
  const observerProjetos = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('mostrar');
        // Para parar de observar depois que já apareceu (opcional):
        // observerProjetos.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.animar-scroll').forEach(el => {
    if (!el.classList.contains('titulo-projetos')) {
      observerProjetos.observe(el);
    }
  });

  const tituloProjetos = document.querySelector('.titulo-projetos');
  let ultimoScrollY = window.scrollY;

  const observerTitulo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && window.scrollY > ultimoScrollY) {
        entry.target.classList.add('digitar');
        observerTitulo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  if (tituloProjetos) {
    observerTitulo.observe(tituloProjetos);
  }

  window.addEventListener('scroll', () => {
    const scrollAtual = window.scrollY;
    ultimoScrollY = scrollAtual;
  }, { passive: true });

  const cardsProjetos = document.querySelectorAll('.card-projeto');
  const secaoProjetosGlow = document.getElementById('projetos');
  const secaoCurriculosGlow = document.getElementById('curriculos');
  const secaoHabilidadesGlow = document.getElementById('habilidades');
  const secaoSobreGlow = document.getElementById('sobre');
  const secaoContatoGlow = document.getElementById('contato');
  const secaoFinalGlow = document.getElementById('conversa');

  const criarSpark = (section, event) => {
    if (!section) return;

    const spark = document.createElement('span');
    const size = 4 + Math.random() * 5;
    const offsetX = (Math.random() * 120) - 60;
    const offsetY = (Math.random() * 120) - 60;

    spark.className = 'spark';
    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    spark.style.left = `${event.clientX - section.getBoundingClientRect().left}px`;
    spark.style.top = `${event.clientY - section.getBoundingClientRect().top}px`;
    spark.style.setProperty('--spark-x', `${offsetX}px`);
    spark.style.setProperty('--spark-y', `${offsetY}px`);

    section.appendChild(spark);

    setTimeout(() => spark.remove(), 900);
  };

  const adicionarEfeitoEstrelas = (section) => {
    if (!section) return;

    let ultimoSpark = 0; // Controla o tempo da última faísca

    section.addEventListener('mousemove', (event) => {
      const agora = Date.now();
      // Só cria uma nova faísca se tiverem passado 50 milissegundos da última
      if (agora - ultimoSpark > 50 && Math.random() > 0.3) {
        criarSpark(section, event);
        ultimoSpark = agora;
      }
    });

    section.addEventListener('mouseenter', () => section.classList.add('estrelas-ativas'));
    section.addEventListener('mouseleave', () => section.classList.remove('estrelas-ativas'));
  };

  adicionarEfeitoEstrelas(secaoProjetosGlow);
  adicionarEfeitoEstrelas(secaoCurriculosGlow);
  adicionarEfeitoEstrelas(secaoHabilidadesGlow);
  adicionarEfeitoEstrelas(secaoSobreGlow);
  adicionarEfeitoEstrelas(secaoContatoGlow);
  adicionarEfeitoEstrelas(secaoFinalGlow);

  const observerSecaoProjetos = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cardsProjetos.forEach((card, index) => {
          // Adiciona um atraso dinâmico no CSS (0s, 0.15s, 0.30s...)
          card.style.transitionDelay = `${index * 0.15}s`; 
          card.classList.add('aparecer');
        });
      } else {
        cardsProjetos.forEach(card => {
          // Zera o atraso para sumirem todos juntos e rápido quando saem da tela
          card.style.transitionDelay = '0s'; 
          card.classList.remove('aparecer');
        });
      }
    });
  }, { threshold: 0.2 });

  if (secaoProjetos) {
    observerSecaoProjetos.observe(secaoProjetos);
  }

  // --- LÓGICA DO MODAL (POP-UP) ---
  const modal = document.getElementById("modal-projeto");
  const fecharModal = document.querySelector(".fechar-modal");
  const modalTitulo = document.getElementById("modal-titulo");
  const modalGif = document.getElementById("modal-gif");
  const modalLinkSite = document.getElementById("modal-link-site");
  const modalLinkGithub = document.getElementById("modal-link-github");
  const cards = document.querySelectorAll(".card-projeto");
  const cardsCurriculos = document.querySelectorAll(".card-curriculo");
  
  // Observer para a seção de currículos: anima os cards em cascata quando a seção entrar na viewport
  const observerSecaoCurriculos = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cardsCurriculos.forEach((card, index) => {
          card.style.transitionDelay = `${index * 0.15}s`;
          card.classList.add('aparecer');
        });
      } else {
        cardsCurriculos.forEach(card => {
          card.style.transitionDelay = '0s';
          card.classList.remove('aparecer');
        });
      }
    });
  }, { threshold: 0.2 });

  if (secaoCurriculos) {
    observerSecaoCurriculos.observe(secaoCurriculos);
  }
  const modalCurriculo = document.getElementById("modal-curriculo");
  const fecharCurriculo = document.querySelector(".fechar-curriculo");
  const modalCurriculoTitulo = document.getElementById("modal-curriculo-titulo");
  const modalCurriculoFoto = document.getElementById("modal-curriculo-foto");
  const modalCurriculoInfo = document.getElementById("modal-curriculo-info");

  // Abrir o modal de projetos
  cards.forEach(card => {
    card.addEventListener("click", () => {
      modalTitulo.textContent = card.getAttribute("data-titulo");
      modalGif.src = card.getAttribute("data-gif");
      modalLinkSite.href = card.getAttribute("data-site");
      modalLinkGithub.href = card.getAttribute("data-github");

      modal.classList.add("ativo");
      document.body.style.overflow = "hidden";
    });
  });

  // Abrir o modal de currículos
  cardsCurriculos.forEach(card => {
    card.addEventListener("click", () => {
      const cardImage = card.querySelector(".imagem-card img");
      const foto = (cardImage ? cardImage.src : "") || card.getAttribute("data-foto") || "";
      const info = card.getAttribute("data-info") || cardImage?.alt || "";

      modalCurriculoTitulo.textContent = card.getAttribute("data-titulo");
      modalCurriculoFoto.src = foto;
      modalCurriculoFoto.alt = card.getAttribute("data-titulo") || "Currículo";
      modalCurriculoInfo.textContent = info;

      modalCurriculo.classList.add("ativo");
      document.body.style.overflow = "hidden";
    });
  });

  // Fechar no botão X do modal de projetos
  fecharModal.addEventListener("click", () => {
    modal.classList.remove("ativo");
    document.body.style.overflow = "auto";
    modalGif.src = "";
  });

  // Fechar no botão X do modal de currículos
  fecharCurriculo.addEventListener("click", () => {
    modalCurriculo.classList.remove("ativo");
    document.body.style.overflow = "auto";
    modalCurriculoFoto.src = "";
  });

  // Fechar clicando fora da caixa
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("ativo");
      document.body.style.overflow = "auto";
      modalGif.src = "";
    }
  });

  // --- BOTÃO VOLTAR AO TOPO ---
  const btnVoltarTopo = document.getElementById("btn-voltar-topo");
  
  if (btnVoltarTopo) {
    btnVoltarTopo.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // --- LÓGICA DO FORMULÁRIO DE CONTATO (COM SPINNER) ---
  const formContato = document.getElementById("form-contato");
  const btnEnviar = document.getElementById("btn-enviar");
  const btnTexto = document.querySelector(".btn-texto");
  const btnSpinner = document.getElementById("btn-spinner");

  if (formContato) {
    formContato.addEventListener("submit", (e) => {
      e.preventDefault(); 

      // 1. ESTADO DE CARREGAMENTO (Inicia o Spinner)
      btnTexto.textContent = "Enviando...";
      btnSpinner.style.display = "block"; // Mostra a rodinha
      btnEnviar.disabled = true; 
      btnEnviar.style.opacity = "0.8";

      const formData = new FormData(formContato);

      // Envia os dados
      fetch("https://formsubmit.co/ajax/caikecarioca@gmail.com", {
        method: "POST",
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        // 2. SUCESSO (Para o Spinner)
        btnSpinner.style.display = "none";
        btnTexto.textContent = "Mensagem Enviada! ✓";
        btnEnviar.style.backgroundColor = "#28a745"; // Verde
        btnEnviar.style.opacity = "1";
        
        formContato.reset(); 

        // Volta ao normal depois de 4 segundos
        setTimeout(() => {
          btnTexto.textContent = "Enviar Mensagem";
          btnEnviar.style.backgroundColor = ""; 
          btnEnviar.disabled = false;
        }, 4000);
      })
      .catch(error => {
        // 3. ERRO (Para o Spinner)
        btnSpinner.style.display = "none";
        btnTexto.textContent = "Erro ao enviar ✕";
        btnEnviar.style.backgroundColor = "#dc3545"; // Vermelho escuro
        btnEnviar.style.opacity = "1";

        setTimeout(() => {
          btnTexto.textContent = "Enviar Mensagem";
          btnEnviar.style.backgroundColor = "";
          btnEnviar.disabled = false;
        }, 4000);
      });
    });
  }
});

// --- LÓGICA DO MENU FULLSCREEN ---
  // --- LÓGICA DO MENU FULLSCREEN OTIMIZADA ---
  const btnMenuToggle = document.getElementById('menu-toggle');
  const overlayMenu = document.getElementById('menu-overlay');
  const linksMenu = document.querySelectorAll('.link-menu');

  const alternarMenu = () => {
    btnMenuToggle.classList.toggle('menu-aberto');
    overlayMenu.classList.toggle('ativo');
    
    const isMenuAberto = overlayMenu.classList.contains('ativo');
    document.body.style.overflow = isMenuAberto ? 'hidden' : '';

    // --- CONTROLE INTELIGENTE DO VÍDEO ---
    if (isMenuAberto) {
      // Se o menu abriu e o vídeo de introdução estava tocando, pausamos ele para aliviar a GPU
      if (videoIntro && !videoIntro.paused) {
        videoIntro.pause();
        window.__introWasPlaying = true; // Salva o estado para saber que deve voltar a rodar depois
      }
    } else {
      // Se o menu fechou e o vídeo estava tocando antes, retomamos a reprodução
      if (window.__introWasPlaying && videoIntro) {
        videoIntro.play().catch(() => {});
        window.__introWasPlaying = false;
      }
    }
  };

  if (btnMenuToggle && overlayMenu) {
    btnMenuToggle.addEventListener('click', alternarMenu);
  }

  linksMenu.forEach(link => {
    link.addEventListener('click', () => {
      alternarMenu();
    });
  });