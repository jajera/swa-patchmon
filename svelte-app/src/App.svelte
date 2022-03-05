<script>
  export let AppName;
  import AllList from "./AllList.svelte";
</script>

<svelte:head>
  <title>{AppName}</title>
  <meta name="robots" content="noindex nofollow" />
  <html lang="en" />
</svelte:head>

<body>
  <main>
    <h1>{AppName}</h1>
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
