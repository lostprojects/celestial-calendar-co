import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './services/database';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Account from './pages/Account';
import Glossary from './pages/Glossary';
import StyleGuide from './pages/StyleGuide';
import './App.css';

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/account" element={<Account />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/style-guide" element={<StyleGuide />} />
          {/* Catch all route - redirect to home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </SessionContextProvider>
  );
}

export default App;
