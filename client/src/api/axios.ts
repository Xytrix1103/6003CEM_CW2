import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { auth } from '@/firebase'

interface ApiCallerConfig {
	baseURL: string;
	headers?: Record<string, string>; // Optional headers
}

const defaultHeaders = {
	'ngrok-skip-browser-warning': '69420',
	'Bypass-Tunnel-Reminder': 'yup',
}

const apiCaller = (config: ApiCallerConfig) => {
	const instance = axios.create({
		baseURL: config.baseURL,
		headers: { ...defaultHeaders, ...(config.headers || {}) },
		withCredentials: true,
	})

	// Add request interceptor to dynamically inject token
	instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
		try {
			await auth.authStateReady()
			const user = auth.currentUser

			if (user) {
				const token = await user.getIdToken()
				config.headers.Authorization = `Bearer ${token}`
			}

			return config
		} catch (error) {
			console.error('Failed to set auth token:', error)
			return config
		}
	})

	return instance
}

const apiCallerInstance = apiCaller({ baseURL: `/api/` })

const post = async <T = {
	message: string
}, D extends Record<string, unknown> = Record<string, unknown>, E = AxiosError<{
	message: string
}>>(
	url: string,
	data: D = {} as D,
	headers?: Record<string, string>,
): Promise<T> => {
	return await apiCallerInstance.post(url, data, {
		headers: { ...defaultHeaders, ...headers },
	})
		.then((response: AxiosResponse<T>) => {
			return response.data
		})
		.catch((error: E) => {
			throw error
		})
}

const get = async <T = { message: string }, E = AxiosError<{ message: string }>>(
	url: string,
	params: Record<string, unknown> = {},
	headers?: Record<string, string>,
	responseType?:
		| 'arraybuffer'
		| 'blob'
		| 'document'
		| 'json'
		| 'text'
		| 'stream',
): Promise<T> => {
	return await apiCallerInstance.get(url, {
		params,
		headers: { ...defaultHeaders, ...headers },
		responseType: responseType,
	})
		.then((response: AxiosResponse<T>) => {
			return response.data
		})
		.catch((error: E) => {
			throw error
		})
}

const put = async <T = {
	message: string
}, D extends Record<string, unknown> = Record<string, unknown>, E = AxiosError<{
	message: string
}>>(
	url: string,
	data: D = {} as D,
	headers?: Record<string, string>,
): Promise<T> => {
	return await apiCallerInstance.put(url, data, {
		headers: { ...defaultHeaders, ...headers },
	})
		.then((response: AxiosResponse<T>) => {
			return response.data
		})
		.catch((error: E) => {
			throw error
		})
}

const del = async <T = {
	message: string
}, D extends Record<string, unknown> = Record<string, unknown>, E = AxiosError<{
	message: string
}>>(
	url: string,
	data: D = {} as D,
	headers?: Record<string, string>,
): Promise<T> => {
	return await apiCallerInstance.delete(url, {
		data,
		headers: { ...defaultHeaders, ...headers },
	})
		.then((response: AxiosResponse<T>) => {
			return response.data
		})
		.catch((error: E) => {
			throw error
		})
}

const patch = async <T = {
	message: string
}, D extends Record<string, unknown> = Record<string, unknown>, E = AxiosError<{
	message: string
}>>(
	url: string,
	data: D = {} as D,
	headers?: Record<string, string>,
): Promise<T> => {
	return await apiCallerInstance.patch(url, data, {
		headers: { ...defaultHeaders, ...headers },
	})
		.then((response: AxiosResponse<T>) => {
			return response.data
		})
		.catch((error: E) => {
			throw error
		})
}

export {
	get,
	post,
	put,
	del,
	patch,
}