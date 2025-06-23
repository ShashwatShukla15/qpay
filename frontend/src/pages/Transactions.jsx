import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// import { api } from '../services/api'
import { ArrowLeft, PlusCircle, Minus, ArrowUpDown, Download } from 'lucide-react'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions')
      setTransactions(response.data.transactions)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'var(--success-color)'
      case 'pending':
        return 'var(--warning-color)'
      case 'failed':
        return 'var(--error-color)'
      default:
        return 'var(--text-secondary)'
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true
    return transaction.type === filter
  })

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Type', 'Description', 'Amount', 'Status'],
      ...filteredTransactions.map(t => [
        formatDate(t.createdAt),
        t.type,
        t.description,
        t.amount,
        t.status
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'qpay-transactions.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Transaction History</h1>
        <p className="page-subtitle">View all your wallet transactions</p>
      </div>

      <div className="form-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              All
            </button>
            <button
              className={`btn ${filter === 'deposit' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('deposit')}
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              Deposits
            </button>
            <button
              className={`btn ${filter === 'withdraw' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('withdraw')}
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              Withdrawals
            </button>
            <button
              className={`btn ${filter === 'sent' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('sent')}
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              Sent
            </button>
            <button
              className={`btn ${filter === 'received' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('received')}
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              Received
            </button>
          </div>

          <button
            className="btn btn-secondary"
            onClick={exportTransactions}
            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
        ) : filteredTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            No transactions found
          </div>
        ) : (
          <div>
            {filteredTransactions.map((transaction) => (
              <div key={transaction._id} className="transaction-item">
                <div className="transaction-info">
                  <div className={`transaction-icon ${transaction.type === 'deposit' || transaction.type === 'received' ? 'credit' : 'debit'}`}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="transaction-details">
                    <h4>{transaction.description}</h4>
                    <p>{formatDate(transaction.createdAt)}</p>
                    <p style={{ color: getStatusColor(transaction.status), fontWeight: '500' }}>
                      {transaction.status.toUpperCase()}
                    </p>
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

        <div className="form-actions">
          <Link to="/dashboard" className="btn btn-secondary">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Transactions