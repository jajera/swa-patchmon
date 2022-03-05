import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		AppName: 'Patch Monitor'
	}
});

export default app;