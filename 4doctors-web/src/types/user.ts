export interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
    avatar_url?: string;
    specialty?: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}
