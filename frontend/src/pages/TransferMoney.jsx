import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Alert from '../components/Alert'
import { ArrowLeft, Send, User } from 'lucide-react'
import axios from 'axios'

const baseURL = 'http://localhost:8000';

const TransferMoney = () => {
  const [formData, setFormData] = useState({
    phoneNumber: 0,
    amount: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [recipient, setRecipient] = useState(null)
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleVerifyRecipient = async () => {
    if (!formData.phoneNumber) {
      setError('Please enter a phone number')
      return
    }

    if (user && formData.phoneNumber === user.phone) {
      setError('You cannot transfer money to yourself')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.post(`${baseURL}/api/wallet/verify`, {
        phoneNumber: formData.phoneNumber
      })
      setRecipient(response.data.user)
    } catch (error) {
      setError(error.response?.data?.message || 'User not found')
      setRecipient(null)
    } finally {
      setLoading(false)
    }
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

    if (numAmount < 1) {
      setError('Minimum transfer amount is ₹1')
      return
    }

    if (!recipient) {
      setError('Please verify the recipient first')
      return
    }

    if (user && recipient.phone === user.phone) {
      setError('You cannot transfer money to yourself');
      return;
    }

    setLoading(true)

    try {
      await axios.post(`${baseURL}/api/wallet/transfer`, {
        recipientPhone: formData.phoneNumber,
        amount: numAmount,
        description: formData.description || `Transfer to ${recipient.name}`
      })

      setError('');
      setSuccess(`Successfully transferred ₹${numAmount} to ${recipient.name}`)
      // refreshUser()
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      console.error("TRANSFER ERROR:", error);
      setSuccess('');
      setError(error.response?.data?.message || 'Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Transfer Money</h1>
        <p className="page-subtitle">Send money to friends and family instantly</p>
      </div>

      <div className="form-card">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} onClose={() => setSuccess('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">Recipient Phone Number</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className="form-input"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleVerifyRecipient}
                disabled={loading || !formData.phoneNumber}
              >
                Verify
              </button>
            </div>
          </div>

          {recipient && (
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.1)', 
              border: '1px solid var(--success-color)',
              borderRadius: 'var(--radius)', 
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--success-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <User size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '500' }}>{recipient.name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {recipient.phone}
                </div>
              </div>
            </div>
          )}

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
              min="1"
              step="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description (Optional)</label>
            <input
              type="text"
              id="description"
              name="description"
              className="form-input"
              value={formData.description}
              onChange={handleChange}
              placeholder="What's this for?"
            />
          </div>

          <div className="form-actions">
            <Link to="/dashboard" className="btn btn-secondary">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || !recipient}
            >
              <Send size={16} />
              {loading ? 'Sending...' : 'Send Money'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransferMoney