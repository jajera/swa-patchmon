import App from './App.svelte';
import fs from "fs";

const all_list_table = fs.readFileSync(__dirname + "/all_list_table.html", "utf8");

const app = new App({
	target: document.body,
	props: {
		header_content: 'Patch Monitor',
		all_list_table: 'test'
	}
});

export default app;