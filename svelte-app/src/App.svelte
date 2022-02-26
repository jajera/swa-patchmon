<script>
	export let name;
</script>

<main>
	<h1>Hello {name}!</h1>

	<h1>Patch Monitor</h1>
	<table>
		<tr><td>Application</td><td>Current Version</td></tr>
		<tr><td>Chef Automate</td><td>x.x.x</td></tr>
		<tr><td>Atlassian Bitbucket</td><td>x.x.x</td></tr>
		<tr><td>OpenJDK</td><td>x.x.x</td></tr>
		<tr><td>DELL PS Firmware</td><td>x.x.x</td></tr>
		<tr><td>Google Chrome - Windows</td><td>x.x.x</td></tr>
		<tr><td>MariaDB MaxScale 2.4</td><td>x.x.x</td></tr>
		<tr><td>SmartBear</td><td>x.x.x</td></tr>
		<tr><td>Oracle MySQL Enterprise</td><td>x.x.x</td></tr>
		<tr><td>Dell EMC OpenManage Enterprise</td><td>x.x.x</td></tr>
		<tr><td>Spring Framework</td><td>x.x.x</td></tr>
		<tr><td>Atlassian Bamboo</td><td>x.x.x</td></tr>
		<tr><td>Atlassian JIRA Software</td><td>x.x.x</td></tr>
		<tr><td>Atlassian JIRA Core</td><td>x.x.x</td></tr>
		<tr><td>Atlassian JIRA Servicedesk</td><td>x.x.x</td></tr>
		<tr><td>Chef Infra Server</td><td>x.x.x</td></tr>
		<tr><td>Chef Habitat</td><td>x.x.x</td></tr>
		<tr><td>Atlassian JIRA Servicedesk</td><td>x.x.x</td></tr>
	</table>

</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
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