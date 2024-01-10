import $api from "../https";
import {AxiosResponse} from 'axios';
import { AuthResponse } from "../models/response/AuthResponse";

export default class AuthService {
    static async login(login: string, password: string, company_id: number): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/login/', {login, password, company_id})
    }

    static async logout(): Promise<void> {
        return $api.post('/auth')
    }
}