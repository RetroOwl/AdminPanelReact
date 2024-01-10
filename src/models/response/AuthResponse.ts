import { IComp } from "../IUser";

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: IComp;
}