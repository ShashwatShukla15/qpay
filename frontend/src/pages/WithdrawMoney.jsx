import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Alert from '../components/Alert'
import { ArrowLeft, Download, Building } from 'lucide-react'
import axios from 'axios'

const baseURL = 'http://localhost:8000';

const WithdrawMoney = () => {
  const [formData, setFormData] = useState({
    amount: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const numAmount = parseFloat(formData.amount)
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (numAmount < 100) {
      setError('Minimum withdrawal amount is ₹100')
      return
    }

    if (numAmount > 50000) {
      setError('Maximum withdrawal amount is ₹50,000')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${baseURL}/api/wallet/withdraw`, {
        amount: numAmount,
        bankDetails: {
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          accountHolderName: formData.accountHolderName
        }
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setSuccess('Money withdrawn successfully!')
        refreshUser()
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Withdraw Money</h1>
        <p className="page-subtitle">Transfer money from your wallet to your bank account</p>
      </div>

      <div className="form-card">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} onClose={() => setSuccess('')} />

        <div style={{ 
          background: 'var(--bg-secondary)', 
          padding: '1rem', 
          borderRadius: 'var(--radius)', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Building size={20} color="var(--primary-color)" />
          <div>
            <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>Withdraw Money</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              None of these info will be verified. This is only a mock simulation of a withdrawal process.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount" className="form-label">Amount (₹)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="form-input"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="100"
              max="50000"
              step="1"
              required
            />
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Min: ₹100, Max: ₹50,000
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="accountHolderName" className="form-label">Account Holder Name</label>
            <input
              type="text"
              id="accountHolderName"
              name="accountHolderName"
              className="form-input"
              value={formData.accountHolderName}
              onChange={handleChange}
              placeholder="Enter account holder name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="accountNumber" className="form-label">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              className="form-input"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Enter bank account number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ifscCode" className="form-label">IFSC Code</label>
            <input
              type="text"
              id="ifscCode"
              name="ifscCode"
              className="form-input"
              value={formData.ifscCode}
              onChange={handleChange}
              placeholder="Enter IFSC code"
              required
            />
          </div>

          <div className="form-actions">
            <Link to="/dashboard" className="btn btn-secondary">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
            <button type="submit" className="btn btn-success" disabled={loading}>
              <Download size={16} />
              {loading ? 'Processing...' : 'Withdraw Money'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WithdrawMoney