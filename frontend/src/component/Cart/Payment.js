import React, { useRef, useState } from 'react';
import axios from 'axios';

const Payment = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('BDT');
  const [transactionId, setTransactionId] = useState('');

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleTransactionIdChange = (event) => {
    setTransactionId(event.target.value);
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('http://mahal.com:3100/api/v1/process/payment', {
      method: '',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        transactionId: transactionId,
      }),
    });
    // handle the response from the server
  };

  return (
    <form onSubmit={handlePaymentSubmit}>
      <label>
        Amount:
        <input type="text" value={amount} onChange={handleAmountChange} />
      </label>
      <label>
        Currency:
        <select value={currency} onChange={handleCurrencyChange}>
          <option value="BDT">BDT</option>
          <option value="USD">USD</option>
        </select>
      </label>
      <label>
        Transaction ID:
        <input type="text" value={transactionId} onChange={handleTransactionIdChange} />
      </label>
      <button type="submit">Pay with SSLCommerz</button>
    </form>
  );
};

export default Payment;
