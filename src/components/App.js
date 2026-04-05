import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import TodoList from './TodoList';
import Todos from '../features/todos/Todos';
import Header from './Header';
import Home from './Home';
import LoginForm from '../features/auth/login/LoginForm';
import RegisterForm from '../features/auth/register/RegisterForm';
import Footer from './Footer';
// import Prefetch from '../features/auth/Prefetch';
import RequireAuth from './RequireAuth';
import PersistLogin from './PersistLogin';
import AddEditLists from '../features/lists/AddEditLists';

function App() {
  return (
    <BrowserRouter>
      <div className='container'>
        <Header />
        <main>
          <Routes>
            {/* public routes */}
            <Route path='/' element={<Home />} />
            <Route path='register' element={<RegisterForm />} />
            <Route path='login' element={<LoginForm />} />

            {/* protected routes */}
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth />}>
                {/* <Route element={<Prefetch />}> */}
                <Route path='/add-edit-lists' element={<AddEditLists />} />

                <Route path='/todo-list' element={<TodoList />} >
                  <Route path=':listId' element={<Todos />} />
                </Route>
                {/* </Route> */}
              </Route>
            </Route>
            
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
