<script>
	export let header_content;
  export let all_list_table;
</script>

<main>
	<h1>{header_content}</h1>
  <div class='all_list'>
    {all_list_table}
  </div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		align: center;
	}

	table {
		border: 1px;
	}

	td {
		text-align: left;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>