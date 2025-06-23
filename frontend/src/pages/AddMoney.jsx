import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Alert from '../components/Alert'
import { ArrowLeft, CreditCard } from 'lucide-react'
import axios from 'axios'

const baseURL = 'http://localhost:8000';

const AddMoney = () => {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { refreshUser } = useAuth()
  const navigate = useNavigate()

  const quickAmounts = [100, 500, 1000, 2000, 5000]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const numAmount = parseFloat(amount)
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (numAmount < 10) {
      setError('Minimum amount is ₹10')
      return
    }

    if (numAmount > 50000) {
      setError('Maximum amount is ₹50,000')
      return
    }

    setLoading(true)

    try {
        const token = localStorage.getItem('token'); // Get token from storage
        const response = await axios.post(
            `${baseURL}/api/wallet/deposit`,
            { amount: numAmount },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
      
        setSuccess('Money added successfully!')
        refreshUser()
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString())
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Add Money</h1>
        <p className="page-subtitle">Add money to your QPay wallet securely</p>
      </div>

      <div className="form-card">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} onClose={() => setSuccess('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount" className="form-label">Amount (₹)</label>
            <input
              type="number"
              id="amount"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="10"
              max="50000"
              step="1"
              required
            />
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Min: ₹10, Max: ₹50,000
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Quick Select</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  className="btn btn-secondary"
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                  onClick={() => handleQuickAmount(quickAmount)}
                >
                  ₹{quickAmount}
                </button>
              ))}
            </div>
          </div>

          <div style={{ 
            background: 'var(--bg-secondary)', 
            padding: '1rem', 
            borderRadius: 'var(--radius)', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CreditCard size={20} color="var(--primary-color)" />
            <div>
              <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>Secure Payment</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                This is a mock wallet. No real money is involved
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/dashboard" className="btn btn-secondary">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Processing...' : 'Add Money'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMoney