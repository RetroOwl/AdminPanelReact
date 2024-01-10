import $api from "../https";
import {AxiosResponse} from 'axios';
import { CompResponse, RoleResponse } from "../models/response/CompResponse";

export default class CompService {
    static async compUpdate(id: number, name: string, status: number): Promise<AxiosResponse<CompResponse>> {
        let c_id = id;
        return $api.put<CompResponse>(`/company/`+c_id, {id, name, status})
    }

    static async compCreate(name: string, status: number, owner_id: number, counterparties: string[], cars: string[]): Promise<AxiosResponse<CompResponse>> {
        return $api.post<CompResponse>(`/company/`, {name,status,owner_id,counterparties,cars})      
    }

    static async roleCreate(name:string, company_id: number, created_by: number): Promise<AxiosResponse<RoleResponse>> {
        return $api.post<RoleResponse>(`/role/create`, {name,company_id,created_by})      
    }
}