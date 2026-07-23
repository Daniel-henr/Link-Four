<script lang="ts">
	// Botão "BACK" único, usado em qualquer tela que precise voltar (rules, credits, etc).
	// Recebe a função de navegação via prop, pra cada tela decidir pra onde volta.

	let { onclick }: { onclick: () => void } = $props();
</script>

<button type="button" class="btn-voltar" {onclick}>
	<img src="/icons/arrow.png" alt="" aria-hidden="true" />
	<span>BACK</span>
</button>

<style>
	.btn-voltar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 9px 21px;
		background-color: #0439ff;
		border: 1px solid #2cb9ff;
		border-radius: 10px;
		color: #fff;
		font-family: 'Poppins', 'Arial Black', sans-serif;
		font-weight: bold;
		text-transform: uppercase;
		text-decoration: none;
		letter-spacing: 3%;
		font-size: 17px;
		cursor: pointer;
	}

	/* Ícone (seta) dentro do botão de voltar */
	.btn-voltar img {
		width: 20px;
		height: auto;
	}

	/* Efeito ao passar o mouse: fica mais azul e desliza um pouco */
	.btn-voltar:hover {
		background: linear-gradient(180deg, #3d8bff, #1a55ff);
		transform: translateX(-2px);
	}
</style>