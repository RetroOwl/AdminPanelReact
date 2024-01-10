import $api from "../https";
import {AxiosResponse} from 'axios';
import { IUser } from "../models/IUser";
import {updateCompIdResponse} from "../models/response/CompResponse"


export let page = 1;

export async function getTotalPage() {      
    try {
        const response = await UserService.fetchComps();
        page = await(response.data.total_pages);
        // console.log('страница № '+page);
        
    } catch (e) {
        console.log(e);
    }

}

export function firstPage() {
    page = 1;
}

export function pageScore() {
    page = page+1;
    console.log(page);        
}

export function pageMinus() {
    page = page-1;
    console.log(page);
    return page;
}

export default class UserService {
    static fetchComps(): Promise<AxiosResponse> {
     return ($api.get('/company/?items_per_page=7&current_page='+page))
    }

    static async userCreate(login: string, name: string, password: string, company_id: number): Promise<AxiosResponse<IUser>> {
        return $api.post<IUser>(`/user/`, {login,name,password,company_id});
    }

    static updateCompId(user_id: number, new_company_id: number): Promise<AxiosResponse<updateCompIdResponse>> {
        let id = user_id;
        let comp_id = new_company_id;
        return $api.put<updateCompIdResponse>(`/user/change-company/`+id+`/?new_company_id=`+comp_id, {user_id,new_company_id});
    }
}