import {FC, useEffect, useState} from 'react';
import {store} from "../index";
import {IComp} from "../models/IUser";
import {observer} from "mobx-react-lite";
import './CompanysStyle.css';
import UserService, { firstPage, getTotalPage, page, pageMinus } from '../services/UserService';
import {pageScore} from "../services/UserService"
import { AxiosResponse } from 'axios';
import $api from '../https';
import CompService from '../services/CompService';

export interface IStatus {
    status: string;
}


const CompsLeftBar: FC = () => {
    const [comps, setComps] = useState<IComp[]>([]);
    const [isComps, setisComps] = useState(false);
    const [idF, setIdF] = useState<any | null>();
    let [owner_id, setOwner] = useState(0);
    let [comp_id, setComp_id] = useState(0);
    const roleName = 'Администратор';
    const [nameF, setNameF] = useState<string>('');
    const [statusF, setStatusF] = useState<any | null>();
    const [counterF, setCounterF] = useState<string[]>(['']);
    const [carsF, setCarsF] = useState<string[]>(['']);

    let [name, setName] = useState<string>('');
    const [status, setStatus] = useState<any | null>();

    const [login, setLogin] = useState<string>('');
    const [uname, setUname] = useState<string>('');
    const [unhashed_password, setUnhashed_password] = useState<string>('');

    const [divForm, setDivForm] = useState(0);
    const [table, setTable] = useState(1);
    const [createDiv, setCreateDiv] = useState(0);
    const [reduct, setR] = useState(1);
    const [zIndex, setZ] = useState(100);
    const [createZ, setCreateZ] = useState(-100);
    const [score, setScore] = useState<number>(0);
    const [scoreCars, setScoreCars] = useState<number>(0);
    const [showPassword, setShowPassword] = useState(false);

    // переменные ошибок:
    const NameError = name.length < 4 ? '*Не менее 4 символов' : '';
    const UserNameError = uname.length < 4 ? '*Не менее 4 символов' : '';
    const LoginError = login.length < 4 ? '*Не менее 4 символов' : '';
    const PassError = unhashed_password.length < 8 ? '*Не менее 8 символов' : '';
    let [CreateMessage, setCreateMessage] = useState<string>('');
    //-------------------

    // переменные проверок:
    let UserCheck = false;
    let CompCheck = false;
    const isInputEmpty = !login || !uname || !unhashed_password || !name
    //-------------------
    
    const sortedData = comps.map(c => c).sort((a, b) => a.id - b.id);

    const handleInputChange = (index: number, value: string) => {
        const newInputs = [...counterF];
        newInputs[index] = value;
        setCounterF(newInputs);
        console.log(counterF);
      };
      
    const handleAddInput = () => {
        const newScore = scoreCars + 1;
        setScoreCars(newScore);
        
        if (newScore  <= 2) {
            const newInputs = [...counterF, ''];
            setCounterF(newInputs);
        } else {
            setCreateMessage('Нельзя добавить больше 3 контрагентов!');
            setTimeout(() => {
                setCreateMessage('');
            },3000);
        }
    };

    const handleInputChangeCars = (index: number, value: string) => {
        const newInputs = [...carsF];
        newInputs[index] = value;
        setCarsF(newInputs);
        console.log(carsF);
      };
      
    const handleAddInputCars = () => {
        const newScore = score + 1;
        setScore(newScore);
        
        if (newScore  <= 2) {
            const newInputs = [...carsF, ''];
            setCarsF(newInputs);
        } else {
            setCreateMessage('Нельзя добавить больше 3 автомобилей!');
            setTimeout(() => {
                setCreateMessage('');
            },3000);
        }
    };
    
    async function getComps() {      
        try {
            const response = await UserService.fetchComps();
            setComps(response.data.data);
            setisComps(isComps => !isComps);
            console.log(response.data.data);
            setCarsF(['']);
            setCounterF(['']);
            setScore(0);
            setScoreCars(0);      
            setLogin('');
            setUname('');
            setUnhashed_password('');    
            setName('');  
        } catch (e) {
            console.log(e);
        }
    
    }

    class CompSearch {
        static fetchCompById(id: number): Promise<AxiosResponse> {
         return ($api.get('/company/'+id+'/'))
        }
    }

    class CompSearchById_or_Name {
        static fetchCompById_or_Name(id: number): Promise<AxiosResponse> {
         return ($api.get('/company/?items_per_page=7&current_page=1&search='+id))
        }
    }

    class userSearch {
        static fetchUser(login: string): Promise<AxiosResponse> {
            return ($api.get('/user/'+login+'/'))
        }
    }

    async function getCompById(id: number) {      
        try {
            const response = await CompSearch.fetchCompById(id);
            setIdF(response.data.id);
            setNameF(response.data.name);
            setStatusF(response.data.status);
            setName(response.data.name);        
        } catch (e) {
            console.log(e);
        }
    }

    async function getCompById_or_Name(id: any) {      
        try {
            if (id != undefined) {
                const response = await CompSearchById_or_Name.fetchCompById_or_Name(id);
                setComps(response.data.data);   
            }    
        } catch (e) {
            console.log(e);
        }
    }

    async function userCreate(login: string, name: string, password: string, company_id: number) {
        try {
            const response = await UserService.userCreate(login,name,password,company_id);
            setOwner(owner_id = response.data.id);
            console.log(response.data);
             console.log(owner_id);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async function compCreate(name:string, status: number, owner_id: number, counterparties: string[], cars: string[]) {
        try {
            const response = await CompService.compCreate(name,status,owner_id,counterparties,cars);
            setComp_id(comp_id = response.data.id);
            setCreateMessage(CreateMessage = ("Компания успешно создана!"));
            setTimeout(() => {
                setCreateMessage(CreateMessage = '');
            },4000);
            console.log(response.data.id);
        } catch (e) {
            console.log(e.response?.data?.message);
            setCreateMessage(CreateMessage = ("Компания не была создана, проверьте введённые данные!"));
            setTimeout(() => {
                setCreateMessage(CreateMessage = '');
            },4000);
        }
    }

    async function getUserCompChecking(login:string, id: any) {
        try {
            const response = await userSearch.fetchUser(login);
            setCreateMessage(CreateMessage = 'Пользователь с таким логином уже есть!');
            setTimeout(() => {
                setCreateMessage(CreateMessage = '');
            },5000);
        } catch (e) {
            console.log(e);
            UserCheck = true;           
        }
        try {
            const responseComp = await CompSearch.fetchCompById(id);
            setCreateMessage(CreateMessage = 'Компания с таким названием уже есть!');
            setTimeout(() => {
                setCreateMessage(CreateMessage = '');
            },5000);
        } catch (e) {
            console.log(e);  
            CompCheck = true;        
        }

        if (isInputEmpty) {
            setCreateMessage('Все поля должны быть заполнены!')
        } else {
            if (UserCheck == true && CompCheck == true ) {
                userCreate(login,name,unhashed_password, 7);
                CreateLoading();
                setTimeout(() => {compCreate(name,status,owner_id,counterF,carsF)},5000);
                setTimeout(() => {store.updateCompId(owner_id,comp_id)},5500);
                setTimeout(() => {setCreateDiv(0); setTable(1); setZ(100); setCreateZ(-100);}, 7000);  
                // setTimeout(() => {roleCreate(roleName,comp_id,owner_id)},6000);
            }
        }
    }

    async function roleCreate(name:string, company_id: number, created_by: number) {
        try {
            const response = await CompService.roleCreate(name,company_id,created_by);
            setComp_id(comp_id = 0);
            setOwner(owner_id = 0);
            console.log(response.data);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async function CreateLoading() {
        setCreateMessage(CreateMessage = ("Загрузка"));
        setTimeout(() => {setCreateMessage(CreateMessage = ("Загрузка."))},500);
        setTimeout(() => {setCreateMessage(CreateMessage = ("Загрузка.."))},1000);
        setTimeout(() => {setCreateMessage(CreateMessage = ("Загрузка..."))},1500);
        setTimeout(() => {setCreateMessage(CreateMessage = ("Загрузка"))},2000);
        setTimeout(() => {setCreateMessage(CreateMessage = ("Загрузка."))},2500);
        setTimeout(() => {setCreateMessage(CreateMessage = ("Загрузка.."))},3000);
        setTimeout(() => {setCreateMessage(CreateMessage = ("Загрузка..."))},3500);
        setTimeout(() => {setCreateMessage(CreateMessage = ("Загрузка"))},4000);
        setTimeout(() => {setCreateMessage(CreateMessage = ("Загрузка."))},4500);
        setTimeout(() => {setCreateMessage(CreateMessage = ("Загрузка.."))},4900);
    }

    if (!isComps) {
        return (
            <body>
                <div className='left-bar'>
                    <h2>Admin|Panel</h2>
                    <p>____________</p>
                    <button onClick={getComps} id='button'>Компании</button>
                </div>
                <div className='UserSpace'>
                    <p></p>
                    <button onClick={() => {store.logout(); window.location.reload();}}>Выйти</button>
                </div>
            </body>
            
           )
        }
    else {
        return (           
            <div>
                <div className='left-bar'>
                    <h2>Admin|Panel</h2>
                    <p>____________</p>
                    <button onClick={getComps} id='button'>Компании</button>
                </div>

                <div className='UserSpace'>
                    <p></p>
                    <button onClick={() => {store.logout(); window.location.reload();}}>Выйти</button>
                </div>
    
                <div className='divTable' style={{opacity:table, zIndex}}>
                    <input type="text"
                    onChange={e => setIdF(e.target.value)}
                    value= {idF}>
                        
                    </input>
                    <button className='ButtonSerch' onClick={() => {getCompById_or_Name(idF)}}>Поиск</button>
                    <table className='compTB' id='table'>
                        <thead>
                            <tr className='compTR'>
                                <th>ID компании</th>
                                <th>Название компании</th>
                                <th className='th_Date'>Дата создания</th>
                                <th>Статус компании</th>
                            </tr>
                        </thead>
                        <tbody className='compTBbody'>
                            {
                                sortedData.map(c =>
                                    <tr key={c.id} onClick={() => {getCompById(c.id); setDivForm(1); setTable(0); setZ(-100);}}>
                                        <td>                                           
                                            <p >{c.id}</p>
                                               
                                        </td>
                                        <td>
                                            <p>{c.name}</p>

                                        </td>
                                        <td><p className='p_Date'>{new Date(c.date_created).toLocaleDateString('en-GB', { year: '2-digit', month: '2-digit', day: '2-digit' })}</p></td>
                                        <td>
                                            <p>{+c.status === 1 ? 'активен' : 'не активен'}</p>
                                            
                                        </td>

                                    </tr>
                                )
                            }
                            
                        </tbody>
                        </table>

                        <div className='buttons'>
                            <button onClick={() => {pageScore(); getComps(); getComps();}} className="buttonPlus">►</button>
                            <button onClick={() => {pageMinus(); getComps(); getComps();}} className="buttonMinus">◄</button>
                            <button onClick={() => {firstPage(); getComps(); setTimeout(getComps,300)}} className="buttonFirstPage">←</button>
                            <button onClick={() => {getTotalPage(); getComps(); setTimeout(getComps,300)}} className="buttonLastPage">→</button>
                            <button onClick={() => {setCreateDiv(1); setTable(0); setZ(-100); setCreateZ(100)}} className="buttonCreate">Создать</button>

                            <div className='pageNumber'><p>{page}</p></div>
                        </div>

                </div> 

                <div className='divFrame' style={{opacity: divForm}}>
                    <h2>Введите данные компании</h2>        
                    <div className='cNameF'><h3>Название Компании </h3>
                        <p>
                            <input type="text" style={{opacity: reduct}}
                                key={nameF}
                                onChange={e => setName(e.target.value)}
                                value= {name}
                                
                                
                               >
                                                                                             
                            </input>
                        </p>
                    </div>
                    <div className='cStatusF'><h3>Статус Компании </h3>
                        <p>
                            <select name="" id="" style={{opacity: reduct}}
                                onChange={e => setStatus(parseInt(e.target.value))}>
                                <option value="1">Активен</option>
                                <option value="0">Не активен</option>
                                
                            </select>
                        </p>
                    </div>

                    <button onClick={() => {setDivForm(0); setTable(1); setZ(100);}} className='close'>X</button>
                    <button onClick={() => {store.compUpdate(idF,name,status); getComps(); getComps()}} className='refresh'>Обновить</button>
                </div>

                <div className='divCreateComp' style={{opacity: createDiv, zIndex: createZ}}>
                    
                    <div className='div_user'>
                        <h2>Введите данные владельца</h2>
                        <div className='login'><h3>Login </h3>
                            <p>
                                <input 
                                    type="text"
                                    minLength={4}
                                    required
                                    onChange={e => setLogin(e.target.value)}
                                    value= {login}
                            >                                                                                            
                                </input>
                            </p>
                            {LoginError && <div className='LoginError'>{LoginError}</div>}
                        </div>  
                        <div className='uname'><h3>Имя </h3>
                            <p>
                                <input 
                                    type="text"
                                    minLength={4}
                                    required
                                    onChange={e => setUname(e.target.value)}
                                    value= {uname}
                            >                                                                                            
                                </input>
                            </p>
                            {UserNameError && <div className='UserNameError'>{UserNameError}</div>}
                        </div>
                        <div className='pass'><h3>Пароль </h3>
                            <p>
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    minLength={8}
                                    maxLength={20}
                                    required
                                    onChange={e => setUnhashed_password(e.target.value)}
                                    value= {unhashed_password}
                            >                                                                                           
                                </input>
                                <button 
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{position: 'absolute', 
                                            left: '160px', 
                                            top: '-9px', 
                                            fontSize: '27px',  
                                            backgroundColor: 'rgba(0, 0, 0, 0)', 
                                            border: 'none'
                                        }}
                                >
                                    {showPassword ? '\u{1F441}' : '\u{1F441}'}
                                </button> 
                            </p>
                            {PassError && <div className='PassError'>{PassError}</div>}
                        </div>
                    </div>
                    <div className='div_comp'>   
                        <h2>Введите данные компании</h2>
                        <div className='cNameF'><h3>Название Компании</h3>
                            <p>
                                <input 
                                    type="text"
                                    minLength={4}
                                    required
                                    onChange={e => setName(e.target.value)}
                                    value= {name}
                            >                                                                                            
                                </input>
                            </p>
                            {NameError && <div className='NameError'>{NameError}</div>}
                        </div>
                        {/* <div className='cStatusF'><h3>Статус Компании</h3>
                            <p>
                                <select name="" id=""
                                    onChange={e => setStatus(parseInt(e.target.value))}>
                                    <option value="1">Активен</option>
                                    <option value="0">Не активен</option>
                                </select>
                            </p>
                        </div> */}
                        <div className='cContrF'>
                            <h3>Cписок контрагентов
                                <button className='addCounter' onClick={handleAddInput}>+</button>
                            </h3>
                            {counterF.map((value, index) => (
                                <div key={index}>
                                    <input
                                        type='text'
                                        required
                                        style={{ opacity: reduct }}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        value={value}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className='cCarsF'>
                            <h3>Cписок автомобилей
                                <button className='addCar' onClick={handleAddInputCars}>+</button>
                            </h3>
                            {carsF.map((value, index) => (
                                <div key={index}>
                                    <input
                                        type='text'
                                        required
                                        style={{ opacity: reduct }}
                                        onChange={(e) => handleInputChangeCars(index, e.target.value)}
                                        value={value}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='divCreateMessage'>
                        <span>{CreateMessage}</span>
                    </div> 
                    <button type='button' onClick={() => {getUserCompChecking(login,name);}} className='create'>Создать</button>
                    <button onClick={() => {setCreateDiv(0); setTable(1); setZ(100); setCreateZ(-100); getComps(); getComps();}} className='close'>X</button>
                </div>

            </div>
        )
                    }
    }

    export default observer(CompsLeftBar);
    