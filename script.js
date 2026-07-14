document.addEventListener("DOMContentLoaded", () => {
  const videoIntro = document.getElementById("video-intro");
  const videoInterativo = document.getElementById("video-interativo");
  const videoInterativoAlternativo = document.getElementById("video-interativo-alternativo");
  const themeToggle = document.getElementById("theme-toggle");
  const conteudoPrincipal = document.getElementById("conteudo-principal");
  const tituloPrincipal = document.getElementById("titulo-principal");
  const subtituloPrincipal = document.getElementById("subtitulo-principal");
  const tituloSobreMim = document.getElementById("titulo-sobre-mim");
  const textoSobreMim = document.getElementById("texto-sobre-mim");
  const blocoApresentacao = document.querySelector(".bloco-apresentacao");
  const blocoFoto = document.querySelector(".bloco-foto");
  const blocoSobreMim = document.querySelector(".bloco-sobre-mim");

  if (!videoIntro || !videoInterativo || !videoInterativoAlternativo || !themeToggle || !conteudoPrincipal || !tituloPrincipal || !subtituloPrincipal || !tituloSobreMim || !textoSobreMim || !blocoApresentacao || !blocoFoto || !blocoSobreMim) return;

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
  blocoSobreMim.style.opacity = "0";
  blocoSobreMim.style.transform = "translateY(20px)";

  const textoTitulo = "Olá, eu sou o Caike :)";
  const textoSubtitulo = "Desenvolvedor Front-End";
  const textoSobre = "Escreva aqui uma breve descrição sobre você, suas habilidades e o que você busca.";

  const digitarTexto = (elemento, texto, velocidade = 35) => {
    elemento.textContent = "";
    let indice = 0;

    const intervalo = setInterval(() => {
      elemento.textContent += texto[indice];
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
      blocoSobreMim.style.opacity = "1";
      blocoSobreMim.style.transform = "translateY(0)";

      digitarTexto(tituloPrincipal, textoTitulo);
      setTimeout(() => digitarTexto(subtituloPrincipal, textoSubtitulo), 450);
      setTimeout(() => digitarTexto(tituloSobreMim, "Sobre mim"), 900);
      setTimeout(() => digitarTexto(textoSobreMim, textoSobre, 20), 1400);
    }, 3000);
  };

  iniciarTexto();

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
      window.addEventListener("mousemove", (e) => {
        const videoAtivo = getVideoAtivo();
        atualizarVideoPeloMouse(videoAtivo, e);
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
    videoIntro.play().catch(() => {
      setTimeout(trocarParaInterativo, 1000);
    });
  };

  if (videoIntro.readyState >= 2) {
    iniciarIntro();
  } else {
    videoIntro.addEventListener("canplay", iniciarIntro, { once: true });
  }
});