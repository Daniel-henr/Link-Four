<script lang="ts">
	// Css com as animações de entrada/saída de tela (popIn/popOut)
	import '../../static/animation.css';

	// Controla a animação de saída da tela, igual usado na tela do jogo
	import { createExitAnimation } from '$lib/utils';
	const { animateExit, isExiting } = createExitAnimation();
</script>

<svelte:head>
  <title>Link Four</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/home.css" />
</svelte:head>

<section>
  <div class="logo-wrapper">

    <!-- Título/logo da tela inicial: é um h1 só, então anima tudo junto (não cada palavra separada) -->
    <h1 class="logo-title animate" class:closing={$isExiting}>
      <div class="word">
        <div class="ball ball-red"></div>
        <span class="letter1">LINK</span>
      </div>

      <div class="word2">
        <span class="letter" data-text="FOUR">FOUR</span>
        <div class="ball ball-yellow"></div>
      </div>
    </h1>

    <div class="piece-bar animate" class:closing={$isExiting}>
      <div class="piece piece-red"></div>
      <div class="piece piece-yellow"></div>
      <div class="piece piece-red"></div>
      <div class="piece piece-yellow"></div>
      <div class="piece piece-red"></div>
      <div class="piece piece-yellow"></div>
      <div class="piece piece-red"></div>
    </div>

    <div class="msg-wrapper animate" class:closing={$isExiting}>
      <div class="tagline">
        <span class="line"></span>
        <span class="msg-line">Every Move Counts</span>
        <span class="line"></span>
      </div>
    </div>

    <div class="btn-wrapper animate" class:closing={$isExiting}>
      <!-- Clicar em PLAY dispara a animação de saída e só depois vai pra tela do jogo -->
      <a onclick={() => animateExit('/game')} rel="external">
        <button class="play-btn">
          <span>PLAY</span>
        </button>
      </a>
    </div>

    <div class="btn-wrapper animate" class:closing={$isExiting}>
      <!-- Clicar em MORE ABOUT dispara a animação de saída e só depois vai pra tela de regras -->
      <a onclick={() => animateExit('/rules')} rel="external">
        <button class="about-btn">
          <span>MORE ABOUT</span>
        </button>
      </a>
    </div>

  </div>
</section>


