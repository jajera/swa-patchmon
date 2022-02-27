import App from './App.svelte';
 
const app = new App({
	target: document.body,
	props: {
		header_content: 'Patch Monitor',
		all_list_table: 'test'
	}
});

export default app;