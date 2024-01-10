import React, {FC, useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import CompsLeftBar from "./components/Companys";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {IComp} from "./models/IUser";

const App: FC = () => {
  const {store} = useContext(Context);
  const [users, setUsers] = useState<IComp[]>([]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      store.checkAuth(String(token))
    }
  },[])


  if (store.isLoading) {
    return <div>Загрузка...</div>
  }

  if (!store.isAuth) {
    return (
      <LoginForm/>
      //<button onClick={() => store.logout()}>Выйти</button>
    );
  }

  
  
  return (

      <CompsLeftBar/>

  )
}
export default observer(App);
