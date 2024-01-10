import { makeAutoObservable } from "mobx";
import { IComp } from "../models/IUser";
import AuthService from "../services/AuthService";
import axios from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../https";
import UserService from "../services/UserService";
import CompService from "../services/CompService";

export default class Store {
    user = {} as IComp;
    isAuth = false;
    isLoading = false;
    isComps = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }
    setUser(user: IComp) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    setComps(bool:boolean) {
        this.isComps = bool;
    }

    async login(login: string, password: string, company_id: number) {
        try{
            const response = await AuthService.login(login, password, company_id);
            localStorage.setItem('token', response.data.access_token);
            console.log(response.data);
            this.setAuth(true);
            this.setUser(response.data.user);

        } catch (e) {
            console.log(e.response?.data?.message);
        }

        // const accessToken = localStorage.getItem('token');
        // const refreshToken = Cookies.get('refreshToken');
  
    }


    async compUpdate(id: number, name:string, status: number) {
        try {
            const response = await CompService.compUpdate(id,name,status);
            console.log(response.data);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }
    async updateCompId(user_id: number,new_company_id: number) {
        try {
            const response = await UserService.updateCompId(user_id,new_company_id);
            console.log(response.data);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async logout() {
        try{
            //const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IComp);
        } catch (err) {
            console.log(err.response?.data?.message);
        }
    }

    async checkAuth(token: string) {

        this.setLoading(true);   
        try {    
            const response = await axios.post<AuthResponse>(`${API_URL}/auth/update-token/`, { token }, {withCredentials: true})
            localStorage.removeItem('token');
            localStorage.setItem('token', response.data.access_token);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }
}

