<script lang="ts">
	// Css da tela do jogo e das animações de entrada/saída
	import '../../../static/game.css';
	import '../../../static/animation.css';

	

	// Imagens usadas na tela
	import logo from '$lib/assets/Component 15.png';

	// Componentes usados na tela
	import Board from '$lib/component/board.svelte';
	import AvatarPlayer from '$lib/component/AvatarPlayer.svelte';
	import TutorialModal from '$lib/component/HowToPlayCarousel.svelte';
	import StartDrawModal from '$lib/component/StartDrawModal.svelte';

	// Ícones dos botões
	import restart from '$lib/assets/Restart.svg';
	import flag from '$lib/assets/Flag.svg';

	// Controla a animação de saída da tela (usada ao clicar na logo pra voltar)
	import { createExitAnimation } from '$lib/utils';
	const { animateExit, isExiting } = createExitAnimation();

	// Transições prontas do Svelte, usadas na troca de mensagem da barra de vez
	import { fade, fly } from 'svelte/transition';

	// Estado e regras do jogo
	import { game } from '$lib/game.svelte';

	// Controla se o modal de instruções está aberto e se está fechando (pra animação)
	let modalOpen = $state(false);
	let modalClosing = $state(false);

	// Abre o modal de instruções
	function openModal() {
		modalOpen = true;
		modalClosing = false;
	}

	// Fecha o modal de instruções (espera a animação antes de sumir de vez)
	function closeModal() {
		modalClosing = true;
		setTimeout(() => {
			modalOpen = false;
			modalClosing = false;
		}, 350); // Mesmo tempo da animação em CSS
	}

	// Controla o modal de resultado (vitória, empate ou desistência), com a mesma lógica do modal de instruções
	let resultModalOpen = $state(false);
	let resultModalClosing = $state(false);

	// Fecha o modal de resultado (espera a animação antes de sumir de vez)
	function closeResultModal() {
		resultModalClosing = true;
		setTimeout(() => {
			resultModalOpen = false;
			resultModalClosing = false;
		}, 350); // Mesmo tempo da animação em CSS
	}

	// Assim que o jogo sai do status "jogando" (ganhou, empatou ou desistiu), abre o modal sozinho
	$effect(() => {
		if (game.status !== 'playing') {
			resultModalOpen = true;
			resultModalClosing = false;
		}
	});

	// Monta a mensagem certa pra mostrar na barra de vez e no modal de resultado
	const turnMessage = $derived.by(() => {
		if (!game.readyToPlay) return 'Sorteando quem começa...';
		if (game.status === 'won') return `Player ${game.winner} Won!`;
		if (game.status === 'forfeited') return `Player ${game.winner} Won by Forfeit!`;
		if (game.status === 'draw') return "It's a Draw!";
		return `Player ${game.currentPlayer}'s Turn`;
	});

	// Reinicia a partida e garante que o modal de resultado feche junto, sem animação de saída
	// O game.restart() já zera o readyToPlay, então o sorteio obrigatório volta a aparecer sozinho
	function handleRestart() {
		game.restart();
		resultModalOpen = false;
		resultModalClosing = false;
	}
</script>

<svelte:head>
	<link rel="stylesheet" href="/game.css" />
	<link
		href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@1,800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main class="home">
	<div class="container">
		<header class="top">
			<div class="logo-title">
				<!-- Clicar na logo dispara a animação de saída e só depois volta pra tela inicial -->
				<a onclick={() => animateExit('/')} rel="external" class="logo animate" class:closing={$isExiting}>
					<img src={logo} alt="Connect Four Logo" class="logo" />
				</a>
			</div>

			<!-- Fica clicável mesmo com o sorteio obrigatório na tela (z-index maior que o overlay do sorteio) -->
			<button onclick={openModal} class="btn-home animate" class:closing={$isExiting}>
				<span>Instructions</span>
			</button>
		</header>

		<section class="game-content">
			<div class="game-turn">
				<div class="game-turn-bar animate" class:closing={$isExiting}>
					<!-- Toda vez que a mensagem muda (troca de vez, vitória, empate...), -->
					<!-- o texto antigo voa pra direita e o novo aparece com fade de 0% a 100% -->
					{#key turnMessage}
						<div class="turn-content" in:fade={{ duration: 400 }} out:fly={{ x: 80, duration: 300 }}>
							<AvatarPlayer player={game.winner ?? game.currentPlayer} size={41} />
							<p>{turnMessage}</p>
						</div>
					{/key}
				</div>
			</div>

			<div class="game-functions">
				<article class="player-card-1 animate" class:closing={$isExiting}>
					<div class="player-avatar">
						<AvatarPlayer player={1} size={109} />
					</div>
					<p class="player-name">Player 1</p>
					<div class="player-score">
						<p class="player-score-label">Score</p>
						<p class="player1-score-value">{game.scores.player1}</p>
					</div>
				</article>

				<Board isExitingStore={isExiting} />

				<article class="player-card-2 animate" class:closing={$isExiting}>
					<div class="player-avatar">
						<AvatarPlayer player={2} size={109} />
					</div>
					<p class="player-name">Player 2</p>
					<div class="player-score">
						<p class="player-score-label">Score</p>
						<p class="player2-score-value">{game.scores.player2}</p>
					</div>
				</article>
			</div>

			<footer class="game-options">
				<!-- Botão de desistência do jogador 1: só acende quando é a vez dele -->
				<button
					class="btn btn-player-1 animate"
					id="btn-loss-player-1"
					class:closing={$isExiting}
					disabled={!game.canForfeit(1)}
					onclick={() => game.forfeit(1)}
				>
					<img src={flag} alt="Flag Icon" />
					<span>FORFEIT</span>
				</button>
				<button
					class="btn-restart animate"
					id="btn-restart"
					class:closing={$isExiting}
					onclick={handleRestart}
				>
					<img src={restart} alt="Restart Icon" />
					<span>RESTART</span>
				</button>
				<!-- Botão de desistência do jogador 2: só acende quando é a vez dele -->
				<button
					class="btn btn-player-2 animate"
					id="btn-loss-player-2"
					class:closing={$isExiting}
					disabled={!game.canForfeit(2)}
					onclick={() => game.forfeit(2)}
				>
					<img src={flag} alt="Flag Icon" />
					<span>FORFEIT</span>
				</button>
			</footer>
		</section>
	</div>

	<!-- Os dois modais abaixo são mutuamente exclusivos: só um overlay fica na tela por vez. -->
	<!-- O de instruções tem prioridade; se o resultado ficar pendente, ele aparece assim que o de instruções fechar. -->
	{#if modalOpen}
		<div class="modal-overlay" onclick={closeModal}>
			<div class="modal modal-tutorial" class:closing={modalClosing} onclick={(e) => e.stopPropagation()}>
				<TutorialModal />
			</div>
		</div>
	{:else if resultModalOpen}
		<!-- Mesmo padrão de modal do de instruções acima; clicar fora fecha, igualzinho -->
		<div class="modal-overlay" onclick={closeResultModal}>
			<div class="modal result-modal" class:closing={resultModalClosing} onclick={(e) => e.stopPropagation()}>
				<div class="result-avatar">
					<AvatarPlayer player={game.winner ?? 1} size={72} />
				</div>
				<h2>{turnMessage}</h2>
				<p class="result-modal-subtitle">
					{#if game.status === 'draw'}
						Nobody wins this round.
					{:else}
						Player {game.winner} takes the point.
					{/if}
				</p>
			</div>
		</div>
	{/if}

	<!-- Sorteio obrigatório de quem começa: fica de fora da cadeia acima de propósito, -->
	<!-- pra poder aparecer junto com o modal de Instruções sem se fecharem um ao outro -->
	{#if !game.readyToPlay}
		<StartDrawModal />
	{/if}
</main>