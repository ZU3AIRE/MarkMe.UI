const API_BASE_URL = 'http://localhost:5013/';

interface T {
    data: T;
    message?: string;
}

async function apiRequest<T>(endpoint: string, method: string = 'GET', body: any = null): Promise<T> {
    const headers = {
        'Content-Type': 'application/json',
    };

    const config: RequestInit = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
        console.error(`${response.statusText}(${response.status}): ${response.json()}` || 'API request failed');
    }
    const res = response.json();
    return res;
}

export function get<T>(endpoint: string): Promise<T> {
    return apiRequest<T>(endpoint);
}

export function post<T>(endpoint: string, body: any): Promise<T> {
    return apiRequest<T>(endpoint, 'POST', body);
}

export function put<T>(endpoint: string, body: any): Promise<T> {
    return apiRequest<T>(endpoint, 'PUT', body);
}

export function del<T>(endpoint: string): Promise<T> {
    return apiRequest<T>(endpoint, 'DELETE');
}
