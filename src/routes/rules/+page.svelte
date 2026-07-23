<script lang="ts">
  // Imagem usada no card grande
  import Rectangle from '$lib/assets/Rectangle.png';

  // Css com as animações de entrada/saída de tela (popIn/popOut)
  import '../../../static/animation.css';

  // Botão único de voltar, compartilhado com a tela de créditos
  import BackButton from '$lib/component/ButtonBack.svelte';

  // Controla a animação de saída da tela, igual usado na tela do jogo
  import { createExitAnimation } from '$lib/utils';
  const { animateExit, isExiting } = createExitAnimation();

  // Volta pra tela inicial (com animação de saída antes)
  function goBack() {
    animateExit('/');
  }

  // Vai pra tela de créditos (com animação de saída antes)
  function goCredits() {
    animateExit('/credits');
  }

  // Botão RULES já é a aba ativa nessa tela, então não navega pra lugar nenhum
  function handleRules() {
    console.log('Rules clicked');
  }
</script>

<svelte:head>
  <title>Link Four</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
  <link rel="stylesheet" href="/rules.css" />
</svelte:head>

<main class="home">
  <div id="page">

    <nav id="NAV__prime0" class="animate" class:closing={$isExiting}>
      <div id="DV_home_prime0">
        <BackButton onclick={goBack} />
      </div>
    </nav>

    <div class="titulo animate" class:closing={$isExiting}>
      <h1>About of</h1>
      <h2>Game</h2>
    </div>

    <div id="DV_regras_e_creditos" class="animate" class:closing={$isExiting}>
      <button class="A_regras_e_creditos" onclick={handleRules}>
        About
      </button>

      <button class="A_regras_e_creditos" onclick={goCredits}>
        CREDITS
      </button>
    </div>

    <section id="SEC_prime0">
      <div class="center-col">

        <!-- O card grande anima como um bloco só; a imagem e o texto de dentro não animam separado -->
        <div class="DV_main_card animate" class:closing={$isExiting}>
          <div class="DV_card_content">

            <div>
              <img src={Rectangle} alt="Rectangle" />
            </div>

            <div class="card-text">
              <h2>Classic Strategy.<span>Endless Fun.</span></h2>
              <p>Connect Four is a classic strategy game that challenges players to think ahead. Connect four pieces of the same color horizontally, vertically, or diagonally before your opponent to win.</p>
              <div class="features">
                <span>Easy to Learn</span>
                <span>Quick Matches</span>
                <span>Strategic Gameplay</span>
                <span>Fun for All Ages</span>
              </div>
            </div>

          </div>
        </div>

        <div class="pillars animate" class:closing={$isExiting}>
          <div class="pillar">
            <div class="pillar-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </div>
            <h3>Strategy</h3>
            <p>Anticipate your movements, anticipate your opponent and win with intelligence.</p>
          </div>

          <div class="pillar">
            <div class="pillar-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <h3>For everyone</h3>
            <p>Easy to learn, difficult to master. Perfect for all ages.</p>
          </div>

          <div class="pillar">
            <div class="pillar-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V18H9v2h6v-2h-2v-2.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
              </svg>
            </div>
            <h3>Challenges</h3>
            <p>Exciting matches, climb the rankings and show that you are the best.</p>
          </div>
        </div>

      </div>
    </section>

  </div>
</main>