import axios, { AxiosError, type AxiosResponse } from 'axios'

interface ApiCallerConfig {
	baseURL: string;
	headers?: Record<string, string>; // Optional headers
}

const defaultHeaders = {
	'ngrok-skip-browser-warning': '69420',
	'Bypass-Tunnel-Reminder': 'yup',
}

const apiCaller = (config: ApiCallerConfig) => {
	const defaultHeaders = {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Credentials': 'true',
		...(config.headers || {}), // Merge custom headers if provided in the config
	}

	return axios.create({
		baseURL: config.baseURL,
		headers: defaultHeaders,
		withCredentials: true,
	})
}

const apiCallerInstance = apiCaller({ baseURL: `/api/` }) // Initial instance with default base URL


// Helper to update the authorization header
const setAuthToken = (token: string | null) => {
	if (token) {
		apiCallerInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
	} else {
		delete apiCallerInstance.defaults.headers.common['Authorization']
	}
}

const post = async <T = never, D extends Record<string, unknown> = Record<string, unknown>>(
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
		.catch((error: AxiosError) => {
			handleApiError(error)
			throw error
		})
}

const get = async <T = never>(
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
		.catch((error: AxiosError) => {
			handleApiError(error)
			throw error
		})
}

const put = async <T = never, D extends Record<string, unknown> = Record<string, unknown>>(
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
		.catch((error: AxiosError) => {
			handleApiError(error)
			throw error
		})
}

const del = async <T = never, D extends Record<string, unknown> = Record<string, unknown>>(
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
		.catch((error: AxiosError) => {
			handleApiError(error)
			throw error
		})
}

const handleApiError = (error: AxiosError) => {
	console.error('API Error:', error)
}

const getBaseUrl = () => {
	return apiCallerInstance.defaults.baseURL
}

export {
	get,
	post,
	put,
	del,
	getBaseUrl,
	setAuthToken,
}