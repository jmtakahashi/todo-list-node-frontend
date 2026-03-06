import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import TodoList from './TodoList';
import Header from './Header';
import SignInForm from './SignInForm';
import RegisterForm from './RegisterForm';
import Footer from './Footer';

function App() {
  const [token, setToken] = React.useState(null);

  return (
    <BrowserRouter>
      <div className='container'>
        <Header setToken={setToken} token={token} />
        <main>
          <Routes>
            <Route path='/' element={token ? <TodoList token={token} /> : <SignInForm setToken={setToken} />} />
            <Route
              path='/register'
              element={
                <RegisterForm
                  setToken={setToken}
                />
              }
            />
            <Route
              path='/signin'
              element={
                <SignInForm
                  setToken={setToken}
                />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
