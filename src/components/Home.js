import { Link } from 'react-router';

export default function Home() {
  return (
    <div className='home'>
      <h2 className='welcome'>
        Welcome, please <Link to='/login'>log in</Link> to access your todo list.
      </h2>
    </div>
  );
}
