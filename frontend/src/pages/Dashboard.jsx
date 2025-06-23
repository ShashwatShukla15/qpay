import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PlusCircle, ArrowUpDown, Minus, History, RefreshCw } from 'lucide-react'
import axios from 'axios'

const baseURL = 'http://localhost:8000';

const Dashboard = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate();
  const [wallet, setWallet] = useState({ balance: 0 })
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [walletResponse, transactionsResponse] = await Promise.all([
        axios.get(`${baseURL}/api/wallet`),
        axios.get(`${baseURL}/api/transactions?limit=5`)
      ]);

      console.log('Wallet response:', walletResponse.data);
      
      setWallet(walletResponse.data.wallet || {balance: 0})
      setTransactions(transactionsResponse.data.transactions || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }
  // console.log(typeof currentUser.name)
  const handleRefresh = () => {
    setLoading(true)
    fetchDashboardData()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
      case 'received':
        return <PlusCircle size={20} />
      case 'withdraw':
      case 'sent':
        return <Minus size={20} />
      default:
        return <ArrowUpDown size={20} />
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  console.log('currentUser:', currentUser);
  console.log('currentWallet:', wallet);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <nav className="dashboard-nav">
          <div className="dashboard-logo">QPay</div>
          <div className="dashboard-user">
            <div className="dashboard-welcome">
              Welcome back, {currentUser?.name.split(' ')[0] || 'User'}
            </div>
            <button onClick={handleLogout} className="btn btn-logout">
              Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="dashboard-content">
        <div className="wallet-balance">
          <div className="balance-label">Current Balance</div>
          <div className="balance-amount">
            {formatCurrency(wallet.balance)}
          </div>
          <div className="balance-actions">
            <button onClick={handleRefresh} className="btn btn-secondary" disabled={loading}>
              <RefreshCw size={16} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <Link to="/transactions" className="btn btn-secondary">
              <History size={16} />
              View All Transactions
            </Link>
          </div>
        </div>

        <div className="action-cards">
          <Link to="/add-money" className="action-card">
            <div className="action-card-icon add-money">
              <PlusCircle size={24} />
            </div>
            <h3 className="action-card-title">Add Money</h3>
            <p className="action-card-description">
              Add money to your wallet from your bank account securely and instantly.
            </p>
          </Link>

          <Link to="/transfer" className="action-card">
            <div className="action-card-icon transfer">
              <ArrowUpDown size={24} />
            </div>
            <h3 className="action-card-title">Transfer Money</h3>
            <p className="action-card-description">
              Send money to friends and family using their phone number instantly.
            </p>
          </Link>

          <Link to="/withdraw" className="action-card">
            <div className="action-card-icon withdraw">
              <Minus size={24} />
            </div>
            <h3 className="action-card-title">Withdraw Money</h3>
            <p className="action-card-description">
              Withdraw money from your wallet to your bank account anytime.
            </p>
          </Link>
        </div>

        <div className="recent-transactions">
          <div className="transactions-header">
            <h2 className="transactions-title">Recent Transactions</h2>
            <Link to="/transactions" className="btn btn-secondary">View All</Link>
          </div>

          {transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              No transactions yet. Start by adding money to your wallet!
            </div>
          ) : (
            <div>
              {transactions.map((transaction) => (
                <div key={transaction._id} className="transaction-item">
                  <div className="transaction-info">
                    <div className={`transaction-icon ${transaction.type === 'deposit' || transaction.type === 'received' ? 'credit' : 'debit'}`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="transaction-details">
                      <h4>{transaction.description}</h4>
                      <p>{formatDate(transaction.createdAt)}</p>
                    </div>
                  </div>
                  <div className={`transaction-amount ${transaction.type === 'deposit' || transaction.type === 'received' ? 'credit' : 'debit'}`}>
                    {transaction.type === 'deposit' || transaction.type === 'received' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard