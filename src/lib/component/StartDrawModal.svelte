<script lang="ts">
	// Mandatory pre-match color draw. Blocks play until resolved and then
	// hands control back to the caller, which sets game.currentPlayer.

	import { game, type Player } from '$lib/game.svelte';

	type DrawColor = 'red' | 'yellow';

	const DRAW_ROLL_MS = 1200;

	let rolling = $state(false);
	let settled = $state(false);
	let winnerColor = $state<DrawColor | null>(null);

	const winnerPlayer = $derived<Player | null>(
		winnerColor === 'red' ? 1 : winnerColor === 'yellow' ? 2 : null
	);

	function rollDraw(): void {
		settled = false;
		winnerColor = null;
		rolling = true;

		setTimeout(() => {
			rolling = false;
			winnerColor = Math.random() < 0.5 ? 'red' : 'yellow';
			settled = true;
		}, DRAW_ROLL_MS);
	}

	function handlePrimaryClick(): void {
		if (rolling) return;

		if (!settled) {
			rollDraw();
			return;
		}

		if (winnerPlayer !== null) {
			game.beginMatch(winnerPlayer);
		}
	}

	const buttonLabel = $derived(settled ? 'START MATCH' : 'DRAW');
</script>

<div class="draw-overlay">
	<div class="draw-modal">
		<div class="eyebrow"><span class="dot"></span>BEFORE YOU START</div>
		<h2 class="draw-title">Who goes <span class="accent-red">first</span>?</h2>
		<p class="draw-text">
			Draw to decide which color opens the match — <strong class="red-txt">red</strong> or
			<strong class="yellow-txt">yellow</strong>.
		</p>

		<div class="turn-row" class:settled>
			<div class="turn-col">
				<div
					class="turn-avatar red-bg"
					class:rolling
					class:winner={settled && winnerColor === 'red'}
					class:loser={settled && winnerColor === 'yellow'}
				>
					<div class="turn-avatar-inner red"></div>
				</div>
				<div class="turn-label" class:winner-label={settled && winnerColor === 'red'}>
					PLAYER 1
				</div>
			</div>

			<span class="vs">VS</span>

			<div class="turn-col">
				<div
					class="turn-avatar yellow-bg"
					class:rolling
					class:winner={settled && winnerColor === 'yellow'}
					class:loser={settled && winnerColor === 'red'}
				>
					<div class="turn-avatar-inner yellow"></div>
				</div>
				<div class="turn-label" class:winner-label={settled && winnerColor === 'yellow'}>
					PLAYER 2
				</div>
			</div>
		</div>

		<button type="button" class="draw-btn" disabled={rolling} onclick={handlePrimaryClick}>
			{buttonLabel}
		</button>

		<p class="draw-result">
			{#if settled && winnerColor === 'red'}
				<span class="red-txt">Red</span> goes first!
			{:else if settled && winnerColor === 'yellow'}
				<span class="yellow-txt">Yellow</span> goes first!
			{:else}
				&nbsp;
			{/if}
		</p>
	</div>
</div>

<style>
	.draw-overlay {
		--board-blue-1: #0141bd;
		--board-blue-2: #0129ac;
		--board-border: #16bdfc;
		--red: #db181f;
		--red-dark: #c21319;
		--yellow: #fcba01;
		--yellow-dark: #e19100;
		--ink: #eaf1ff;
		--ink-dim: #9fb3e8;

		position: fixed;
		inset: 0;
		z-index: 90;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(1, 8, 40, 0.6);
		backdrop-filter: blur(3px);
		font-family: 'Poppins', sans-serif;
		animation: fadeIn 0.25s ease-out;
		/* The dimmed background doesn't capture clicks, so anything rendered
		   above it (like the Instructions button in the header) stays clickable. */
		pointer-events: none;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.draw-modal {
		width: min(90vw, 420px);
		max-height: 90vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 6px;
		padding: 32px 26px;
		border-radius: 1.75rem;
		background: linear-gradient(135deg, var(--board-blue-1) 6%, var(--board-blue-2) 55%, #011a80 100%);
		border: 1px solid var(--board-border);
		box-shadow:
			0px 8px 0px #0123ab,
			0px 30px 40px rgba(1, 20, 90, 0.55);
		color: var(--ink);
		animation: popIn 0.3s cubic-bezier(0.2, 0.8, 0.3, 1.1);
		/* Only the card itself accepts clicks again (the DRAW/START MATCH button needs to work). */
		pointer-events: auto;
	}

	@keyframes popIn {
		from {
			transform: scale(0.92);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 11.5px;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--board-border);
		margin-bottom: 6px;
	}
	.eyebrow .dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--board-border);
		box-shadow: 0 0 8px var(--board-border);
	}

	.draw-title {
		font-weight: 800;
		font-size: 22px;
		line-height: 1.25;
		margin: 0 0 8px 0;
	}
	.accent-red {
		color: var(--red);
	}

	.draw-text {
		font-size: 13.5px;
		line-height: 1.55;
		color: var(--ink-dim);
		max-width: 320px;
		margin: 0 0 18px 0;
		font-weight: 400;
	}
	.red-txt {
		color: var(--red);
	}
	.yellow-txt {
		color: var(--yellow);
	}

	.turn-row {
		display: flex;
		gap: 26px;
		align-items: center;
		justify-content: center;
		margin-bottom: 22px;
	}
	.turn-col {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.turn-avatar {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			inset 1px 2px 4px rgba(255, 255, 255, 0.45),
			inset -5px -12px 4px rgba(0, 0, 0, 0.25);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease,
			opacity 0.3s ease;
	}
	.turn-avatar.red-bg {
		background: var(--red-dark);
	}
	.turn-avatar.yellow-bg {
		background: var(--yellow-dark);
	}
	.turn-avatar.rolling {
		animation: shake 0.12s linear infinite;
	}
	@keyframes shake {
		0%,
		100% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(-3px) scale(1.03);
		}
	}
	.turn-avatar.winner {
		transform: scale(1.18);
		box-shadow:
			inset 1px 2px 4px rgba(255, 255, 255, 0.45),
			inset -5px -12px 4px rgba(0, 0, 0, 0.25),
			0 0 0 3px var(--board-border),
			0 0 22px 4px rgba(22, 189, 252, 0.7);
	}
	.turn-avatar.loser {
		opacity: 0.35;
	}
	.turn-avatar-inner {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		box-shadow: inset 1px 2px 3px rgba(255, 255, 255, 0.45);
	}
	.turn-avatar-inner.red {
		background: var(--red);
	}
	.turn-avatar-inner.yellow {
		background: var(--yellow);
	}
	.turn-label {
		font-size: 12px;
		margin-top: 8px;
		color: var(--ink-dim);
		font-weight: 600;
		letter-spacing: 0.05em;
		transition: opacity 0.25s ease;
	}
	.vs {
		font-size: 12px;
		color: var(--ink-dim);
		font-weight: 700;
		letter-spacing: 0.15em;
		transition: opacity 0.25s ease;
	}
	.turn-row.settled .turn-label,
	.turn-row.settled .vs {
		opacity: 0.4;
	}
	.turn-row.settled .turn-label.winner-label {
		opacity: 1;
		color: var(--board-border);
		font-weight: 700;
	}

	.draw-btn {
		font-family: 'Poppins', sans-serif;
		font-weight: 700;
		font-size: 13px;
		letter-spacing: 0.08em;
		color: var(--deep-navy, #010e3d);
		background: linear-gradient(180deg, var(--yellow), var(--yellow-dark));
		border: none;
		padding: 12px 30px;
		border-radius: 99px;
		cursor: pointer;
		box-shadow:
			0 6px 0 var(--yellow-dark),
			0 10px 18px rgba(0, 0, 0, 0.3);
		transition: transform 0.12s ease;
	}
	.draw-btn:active {
		transform: translateY(4px);
		box-shadow: 0 2px 0 var(--yellow-dark);
	}
	.draw-btn:disabled {
		opacity: 0.6;
		cursor: default;
	}
	.draw-btn:disabled:active {
		transform: none;
		box-shadow:
			0 6px 0 var(--yellow-dark),
			0 10px 18px rgba(0, 0, 0, 0.3);
	}

	.draw-result {
		min-height: 18px;
		font-size: 13.5px;
		font-weight: 700;
		letter-spacing: 0.03em;
		margin: 14px 0 0 0;
		color: var(--ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.turn-avatar.rolling {
			animation: none;
		}
	}
</style>