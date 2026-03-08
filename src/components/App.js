import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import TodoList from '../features/todo/TodoList';
import Header from './Header';
import Home from './Home';
import LoginForm from '../features/auth/login/LoginForm';
import RegisterForm from '../features/auth/register/RegisterForm';
import Footer from './Footer';
import Prefetch from '../features/auth/Prefetch';

function App() {
  return (
    <BrowserRouter>
      <div className='container'>
        <Header />
        <main>
          <Routes>
            <Route path='/' element={ <Home /> }/>
            <Route path='/register' element={ <RegisterForm /> }/>
            <Route path='/login' element={ <LoginForm/> }/>
            <Route path='/todoList' element={<Prefetch><TodoList /></Prefetch>}/>
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
