import App from './App.svelte';
import AppList from './AllList.svelte';

const app = new App({
	target: document.body,
	props: {
		header_content: 'Patch Monitor',
	}
});

export default app;