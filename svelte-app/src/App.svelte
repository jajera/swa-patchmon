<script>
  export let header_content;
  import AllList from "./AllList.svelte";
</script>

<svelte:head>
  <title>{header_content}</title>
  <meta name="robots" content="noindex nofollow" />
  <html lang="en" />
</svelte:head>

<body>
  <main>
    <h1>{header_content}</h1>
    <AllList />
    &nbsp;
  </main>
</body>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
    vertical-align: center;
  }
  h1 {
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
    font-weight: bold;
  }

  body {
    vertical-align: middle;

    display: table-cell;
    text-align: center;
    font-family: "Helvetica Neue", Helvetica, Arial;
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: #3b3b3b;
    display: flex;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
