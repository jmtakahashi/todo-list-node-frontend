import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import TodoList from '../features/todos/TodoList';
import Header from './Header';
import LoginForm from '../features/auth/login/LoginForm';
import RegisterForm from '../features/auth/register/RegisterForm';
import Footer from './Footer';
import Prefetch from '../features/auth/Prefetch';
import { useSelector } from 'react-redux';

function App() {
  const token = useSelector((state) => state.auth.token);

  console.log('in App. token: ', token);

  return (
    <BrowserRouter>
      <div className='container'>
        <Header />
        <main>
          <Routes>
            <Route path='/' element={ token ? <Prefetch><TodoList /></Prefetch> : <LoginForm /> }/>
            <Route path='/register' element={ <RegisterForm /> }/>
            <Route path='/login' element={ <LoginForm/> }/>
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
