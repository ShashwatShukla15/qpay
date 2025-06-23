const axios = require('axios')

const INSTAMOJO_API_ENDPOINT = process.env.INSTAMOJO_API_ENDPOINT || 'https://www.instamojo.com/api/1.1'
const INSTAMOJO_AUTH_TOKEN = process.env.INSTAMOJO_AUTH_TOKEN
const INSTAMOJO_API_KEY = process.env.INSTAMOJO_API_KEY

const instamojoClient = axios.create({
  baseURL: INSTAMOJO_API_ENDPOINT,
  headers: {
    'X-Api-Key': INSTAMOJO_API_KEY,
    'X-Auth-Token': INSTAMOJO_AUTH_TOKEN,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// Create payment request
const createPaymentRequest = async (paymentData) => {
  try {
    const params = new URLSearchParams({
      purpose: paymentData.purpose,
      amount: paymentData.amount,
      buyer_name: paymentData.buyer_name,
      email: paymentData.email,
      phone: paymentData.phone,
      redirect_url: paymentData.redirect_url,
      webhook: paymentData.webhook,
      allow_repeated_payments: 'False'
    })

    const response = await instamojoClient.post('payment-requests/', params)
    return response.data.payment_request
  } catch (error) {
    console.error('Instamojo payment request error:', error.response?.data || error.message)
    throw new Error('Failed to create payment request')
  }
}

// Get payment request status
const getPaymentRequestStatus = async (paymentRequestId) => {
  try {
    const response = await instamojoClient.get(`payment-requests/${paymentRequestId}/`)
    return response.data.payment_request
  } catch (error) {
    console.error('Instamojo get payment status error:', error.response?.data || error.message)
    throw new Error('Failed to get payment status')
  }
}

// Create payout (for withdrawals)
const createPayout = async (payoutData) => {
  try {
    const params = new URLSearchParams({
      amount: payoutData.amount,
      account_number: payoutData.account_number,
      ifsc: payoutData.ifsc,
      beneficiary_name: payoutData.beneficiary_name,
      purpose: payoutData.purpose
    })

    const response = await instamojoClient.post('payouts/', params)
    return response.data.payout
  } catch (error) {
    console.error('Instamojo payout error:', error.response?.data || error.message)
    throw new Error('Failed to create payout')
  }
}

// Get payout status
const getPayoutStatus = async (payoutId) => {
  try {
    const response = await instamojoClient.get(`payouts/${payoutId}/`)
    return response.data.payout
  } catch (error) {
    console.error('Instamojo get payout status error:', error.response?.data || error.message)
    throw new Error('Failed to get payout status')
  }
}

module.exports = {
  createPaymentRequest,
  getPaymentRequestStatus,
  createPayout,
  getPayoutStatus
}