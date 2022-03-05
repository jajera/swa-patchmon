<script>
<<<<<<< HEAD
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
=======
	export let header_content;
</script>

<main>
	<h1>{header_content}</h1>
  	<div class='all_list'>
		<table>
			<tr><td>Name</td><td>Version</td><td>Entry Date</td></tr>
			<tr><td>Atlassian Bamboo</td><td>8.1.3</td><td>Sun Feb 27 17:25:03 2022</td></tr>
			<tr><td>Atlassian Bitbucket</td><td>7.20.0</td><td>Sun Feb 27 17:24:52 2022</td></tr>
			<tr><td>Atlassian Confluence</td><td>7.9.3</td><td>Sun Feb 27 17:24:57 2022</td></tr>
			<tr><td>Atlassian JIRA Core</td><td>8.22.0</td><td>Sun Feb 27 17:25:06 2022</td></tr>
			<tr><td>Atlassian JIRA Servicedesk</td><td>4.22.0</td><td>Sun Feb 27 17:25:07 2022</td></tr>
			<tr><td>Atlassian JIRA Software</td><td>8.22.0</td><td>Sun Feb 27 17:25:04 2022</td></tr>
			<tr><td>Chef Automate</td><td>20220209045542</td><td>Sun Feb 27 17:24:50 2022</td></tr>
			<tr><td>Chef Habitat</td><td>1.6.420</td><td>Sun Feb 27 17:25:09 2022</td></tr>
			<tr><td>Chef Infra Server</td><td>14.13.39</td><td>Sun Feb 27 17:25:08 2022</td></tr>
			<tr><td>DELL PS Firmware</td><td></td><td>Sun Feb 27 17:24:53 2022</td></tr>
			<tr><td>Dell EMC OpenManage Enterprise</td><td></td><td>Sun Feb 27 17:25:00 2022</td></tr>
			<tr><td>Google Chrome - Windows</td><td>98.0.4758.102</td><td>Sun Feb 27 17:24:55 2022</td></tr>
			<tr><td>MariaDB MaxScale 2.4</td><td></td><td>Sun Feb 27 17:24:58 2022</td></tr>
			<tr><td>OpenJDK</td><td></td><td>Sun Feb 27 17:24:52 2022</td></tr>
			<tr><td>Oracle MySQL Enterprise</td><td></td><td>Sun Feb 27 17:24:59 2022</td></tr>
			<tr><td>SmartBear</td><td></td><td>Sun Feb 27 17:24:59 2022</td></tr>
			<tr><td>Spring Framework</td><td></td><td>Sun Feb 27 17:25:01 2022</td></tr>
		</table>
  	</div>	
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		vertical-align: center;
	}
>>>>>>> eb52279115cbdb9e0187e046ff0963d5897994a5

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

<<<<<<< HEAD
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
=======
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
>>>>>>> eb52279115cbdb9e0187e046ff0963d5897994a5
</style>
