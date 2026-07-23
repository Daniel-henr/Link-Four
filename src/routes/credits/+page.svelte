<script lang="ts">
  // Css com as animações de entrada/saída de tela (popIn/popOut)
  import '../../../static/animation.css';

  // Botão único de voltar, compartilhado com a tela de rules
  import BackButton from '$lib/component/ButtonBack.svelte';

  // Controla a animação de saída da tela, igual usado na tela do jogo
  import { createExitAnimation } from '$lib/utils';
  const { animateExit, isExiting } = createExitAnimation();

  // Volta pra tela inicial (com animação de saída antes)
  function goBack() {
    animateExit('/');
  }

  // Vai pra tela de regras (com animação de saída antes)
  function goRules() {
    animateExit('/rules');
  }

  // Lista dos integrantes do grupo, mostrada na tela
  const team = [
    { name: 'Caio Victor Santana de Souza',     role: 'Designer',  icon: 'fa-brands fa-figma' },
    { name: 'João Ibson Lima',        role: 'Designer',  icon: 'fa-brands fa-figma' },
    { name: 'Guilherme Santos de Oliveira',  role: 'Developer', icon: 'fa-solid fa-code' },
    { name: 'Daniel Henrique Pereira Paiva',   role: 'Developer', icon: 'fa-solid fa-code' },
    { name: 'Rafael Lima Gonaçalves da Silva',       role: 'Developer', icon: 'fa-solid fa-code' }
  ];

  // Lista das tecnologias usadas no projeto, mostrada na tela
  const technologies = [
    { name: 'FIGMA',      icon: 'fa-brands fa-figma' },
    { name: 'SVELTE',     icon: 'si si-svelte' },
    { name: 'HTML',       icon: 'fa-brands fa-html5' },
    { name: 'CSS',        icon: 'fa-brands fa-css3-alt' },
    { name: 'TYPESCRIPT', icon: 'si si-typescript' },
  ];
</script>

<svelte:head>
  <title>Credits – Connect Four</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-icons-font@13/font/simple-icons.min.css" />
  <link rel="stylesheet" href="/credits.css" />
</svelte:head>

<main class="credits-page">

  <!-- Barra de navegação -->
  <nav id="NAV__prime0" class="animate" class:closing={$isExiting}>
      <div id="DV_home_prime0">
        <BackButton onclick={goBack} />
      </div>
    </nav>

  <!-- Menu lateral -->
  <div class="credits-sidebar animate" class:closing={$isExiting}>
    <button class="btn-credits-active" onclick={goRules}>About</button>
    <!-- CREDITS já é a aba ativa nessa tela, então não navega pra lugar nenhum -->
    <button class="btn-credits-active">CREDITS</button>
  </div>

  <!-- Conteúdo principal -->
  <section class="credits-content">

    <div class="animate" class:closing={$isExiting}>
      <h1 class="credits-title">Credits</h1>
    </div>

    <h2 class="meet-title animate" class:closing={$isExiting}>Meet the team</h2>

    <!-- Lista da equipe: tem uma animação própria (definida em credits.css), diferente do resto da tela -->
    <div class="team-panel animate" class:closing={$isExiting}>
      <div class="team-column">
        {#each team as member (member.name)}
          <div class="member-card">
            <div class="member-avatar">
              <i class={member.icon}></i>
            </div>
            <div class="member-info">
              <span class="member-name">{member.name}</span>
              <span class="member-role">{member.role}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Tecnologias usadas -->
    <h3 class="tech-title animate" class:closing={$isExiting}>Technologies</h3>
    <div class="tech-row animate" class:closing={$isExiting}>
      {#each technologies as tech (tech.name)}
        <div class="tech-item">
          <div class="tech-icon">
            <i class={tech.icon}></i>
          </div>
          <span class="tech-name">{tech.name}</span>
        </div>
      {/each}
    </div>

  </section>

</main>