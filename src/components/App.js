import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import TodoList from '../features/todo/TodoList';
import Header from './Header';
import Home from './Home';
import LoginForm from '../features/auth/login/LoginForm';
import RegisterForm from '../features/auth/register/RegisterForm';
import Footer from './Footer';
import Prefetch from '../features/auth/Prefetch';
import RequireAuth from './RequireAuth';
import PersistLogin from './PersistLogin';

function App() {
  return (
      <div className='container'>
        <Header />
        <main>
          <Routes>
            {/* public routes */}
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<RegisterForm />} />
            <Route path='/login' element={<LoginForm />} />

            {/* protected routes */}
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth />}>
                <Route element={<Prefetch />}>
                  <Route path='/todo-list' element={<TodoList />} />      
                </Route>
              </Route>
            </Route>
            
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </main>
        <Footer />
      </div>
  );
}

export default App;
