import {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import './loginForm.css';
import $api from '../https';
import { AxiosResponse } from 'axios';

const LoginForm: FC = () => {
    const [loginU, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const company_id = 7;
    const {store} = useContext(Context);

    const [errorMessage, setMessage] = useState<string>('')

    // class checkUserRole {
    //     static searchUser(login: string): Promise<AxiosResponse> {
    //         return ($api.get('/users/'+login))
    //     }
    // }

    async function loginIfRole(login:string) {
        try {
            // const response = await checkUserRole.searchUser(login)
            // console.log(response.data.role);
            // const role = response.data.role;
            // if (role != 14) {
            store.login(loginU,password,company_id);
            setMessage("");            
            // } else {
            //     setMessage("Недостаточно прав для входа!");
            // } 

        } catch (e) {
            console.log(e);           
        }
        
    }

    return (
        <div className='login-box'>
            <h2>Admin</h2>
            <input
                onChange={e => setLogin(e.target.value)}
                value={loginU}
                type="text"
                placeholder='Login'
            />
            <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder='Пароль'
            />
            <button onClick={() => {loginIfRole(loginU)}}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Войти
            </button>
            <p>{errorMessage}</p>
        </div>
    );
};

export default observer(LoginForm);