import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default ({mode}: { mode: 'development' | 'production' }) => {
	process.env = {...process.env, ...loadEnv(mode, process.cwd())};

	return defineConfig({
		plugins: [
			tailwindcss(), react()
		],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		server: {
			cors: {
				// the origin you will be accessing via browser
				origin: process.env.VITE_API_URL || 'http://localhost:4000',
			},
			proxy: {
				// proxy requests to the API server
				'/api': {
					target: process.env.VITE_API_URL || 'http://localhost:4000',
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
			port: 5173, // default Vite port
			strictPort: true, // fail if port is already in use
		},
	})
}