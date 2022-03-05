<script>
  export let AppName;
  import AllList from "./AllList.svelte";

  let DateTime = new Date().toISOString().substr(0, 19).replace('T', ' ');;
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
<footer class="footer">
  <div class="copyright">
    <span>
		Last update: {DateTime} | Dev: <a href="mailto:jdcajera@gmail.com">jdcajera@gmail.com</a>
	</span>
  </div>
</footer>

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

  .footer {
	text-align: center;
	font-family: "Helvetica Neue", Helvetica, Arial;
    font-size: 14px;
    padding: 75px 0 0;
    position: relative;
    z-index: 2;
  }

  .footer div {
    padding: 14px 0;
    margin-top: 55px;
    background-color:  rgba(0, 0, 0, 0.15);
  }

  .footer span {
    color: #000000;
    -webkit-transition: all 0.3s linear;
    -o-transition: all 0.3s linear;
    transition: all 0.3s linear;
  }

  .footer a:hover {
    color: #007bff;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
