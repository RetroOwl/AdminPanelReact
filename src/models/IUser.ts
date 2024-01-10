export interface IComp {
    id: number;
    name: string;
    date_created: Date;
    status: string;
}

export interface IUser {
    id: number;
   login: string;
   name: string;
   //role: number;
   unhashed_password: string; 
}
