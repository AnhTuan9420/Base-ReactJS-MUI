import { defineConfig, splitVendorChunkPlugin, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import jsconfigPaths from 'vite-jsconfig-paths'
import { esbuildCommonjs, viteCommonjs } from '@originjs/vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	return {
		plugins: [
			react(),
			legacy({
				targets: ['defaults', 'not IE 11']
			}),
			jsconfigPaths(),
			splitVendorChunkPlugin(),
			viteCommonjs()
		],
		optimizeDeps: {
			esbuildOptions: {
				plugins: [esbuildCommonjs(['firebaseui'])]
			}
		},

		server: {
			cors: true,
			proxy: {
				'/api': {
					target: env.VITE_API_URL,
					changeOrigin: true,
					// rewrite: path => path.replace(/^\/api/, ''),
					configure: (proxy, options) => {
						// proxy will be an instance of 'http-proxy'
					}
				}
			}
		}
	}
})
