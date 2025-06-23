import { useAuth } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthContextProvider from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import AddMoney from './pages/AddMoney';
import WithdrawMoney from './pages/WithdrawMoney';
import TransferMoney from './pages/TransferMoney';
import Transactions from './pages/Transactions';

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-money" element={<AddMoney />} />
          <Route path="/withdraw" element={<WithdrawMoney />} />
          <Route path="/transfer" element={<TransferMoney />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
