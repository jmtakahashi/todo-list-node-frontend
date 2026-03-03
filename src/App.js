import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import TodoList from './TodoList';
import Header from './Header';
import SignInForm from './SignInForm';
import RegisterForm from './RegisterForm';
import Footer from './Footer';

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className='container'>
        <Header setLoggedIn={setLoggedIn} />
        <main>
          <Routes>
            <Route path='/' element={loggedIn ? <TodoList /> : <SignInForm setLoggedIn={setLoggedIn} />} />
            <Route
              path='/register'
              element={
                <RegisterForm
                  setLoggedIn={setLoggedIn}
                />
              }
            />
            <Route
              path='/signin'
              element={
                <SignInForm
                  setLoggedIn={setLoggedIn}
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
