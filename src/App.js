import React from 'react';
import TodoList from './TodoList';

function App() {
  return (
    <div className='container'>
      <header className='header'>
        <h1>Todo List</h1>
      </header>
      <main>
        <TodoList />
      </main>
      <footer className='footer'>
        <span>
          Built with ❤️ by{' '}
          <a href='https://whoisjaytee.com' target='_blank' rel='noreferrer'>
            Jaytee
          </a>
        </span>
      </footer>
    </div>
  );
}

export default App;
