/// <reference types="vite/client" />

interface ViteTypeOptions {
	strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
	readonly VITE_API_URL: string
	readonly NODE_ENV: "development" | "production"
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}