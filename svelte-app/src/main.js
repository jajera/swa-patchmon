import App from './App.svelte';

var s_all_list_table = fs.readFileSync(__dirname + "/all_list_table.html").toString()
console.log(s_all_list_table.toString());

const app = new App({
	target: document.body,
	props: {
		header_content: 'Patch Monitor',
		all_list_table: s_all_list_table
	}
});

export default app;