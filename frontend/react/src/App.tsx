import './App.css';
import {
  HashRouter as Router,
} from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

import { Nav } from './components/Nav';
import { useEffect } from 'react';

function App() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  useEffect(() => {
    getToken().then((token) => {
      localStorage.setItem('clerkToken', token as string);
    });
  }, []);

  return (
    <Router>
      <Nav />
    </Router>
  );
}

export default App;


