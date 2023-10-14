import './App.css';
import {
  HashRouter as Router,
} from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

import { Nav } from './components/Nav';
import { useEffect } from 'react';
import { clerkToken } from './lib/apollo';

function App() {
  const { getToken } = useAuth();
  useEffect(() => {
    async function fetchToken() {
      const token = await getToken();
      if (token)
        clerkToken(token);
      // console.log('clerk token', clerkToken());
    }
    fetchToken();

  }, []);
  return (
    <Router>
      <Nav />
    </Router>
  );
}

export default App;


