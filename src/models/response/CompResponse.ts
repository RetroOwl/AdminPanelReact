export interface CompResponse {
    id: number;
    name: string;
    status: number;
    owner_id: number;
    // date_created: string;
}

export interface updateCompIdResponse {
    user_id: number;
    new_company_id: number;
}

export interface RoleResponse {
    company_id: number;
    name: string;
    created_by: number;
}