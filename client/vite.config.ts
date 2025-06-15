import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default ({ mode }: { mode: 'development' | 'production' }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

	console.log(`Vite running in ${mode} mode`)

	return defineConfig({
		plugins: [tailwindcss(), react()],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		// Only enable proxy in development
		server: mode === 'development' ? {
			proxy: {
				'/api': {
					target: process.env.VITE_API_URL || 'http://localhost:4000',
					rewrite: (path) => path.replace(/^\/api/, ''),
					changeOrigin: true,
				},
			},
			port: 5173,
			strictPort: true,
		} : undefined,
	})
}