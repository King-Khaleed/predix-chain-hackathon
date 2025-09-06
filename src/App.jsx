import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Home from './pages/Home';
import Polls from './pages/Polls';
import Dashboard from './pages/Dashboard';
import CreatePoll from './components/CreatePoll';

function App() {
  return (
    <Router>
      <Toaster />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/polls" element={<Polls />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreatePoll />} />
      </Routes>
    </Router>
  );
}

export default App;
