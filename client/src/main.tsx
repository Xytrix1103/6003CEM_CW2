import {createRoot} from 'react-dom/client';
import App from './App';
import {AuthProvider} from "@/components/providers";
import {StrictMode} from "react";
import {ThemeProvider} from "@/components/themes/theme-provider.tsx";
import "./styles/globals.css";

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<AuthProvider>
				<App/>
			</AuthProvider>
		</ThemeProvider>
	</StrictMode>
);