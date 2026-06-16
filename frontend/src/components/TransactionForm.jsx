import { useState, useEffect } from 'react';
import { getAccounts } from '../services/accountService';
import { getCategories } from '../services/categoryService';
import AlertBanner from './AlertBanner';

export default function TransactionForm({ initialData = null, onSubmit, onCancel }) {
  const [type, setType] = useState(initialData?.type || 'expense');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [accountId, setAccountId] = useState(initialData?.account_id || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
  const [date, setDate] = useState(
    initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
  );
  const [description, setDescription] = useState(initialData?.description || '');

  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [accRes, catRes] = await Promise.all([getAccounts(), getCategories()]);
        setAccounts(accRes.data);
        setCategories(catRes.data);
        if (!initialData) {
          if (accRes.data.length > 0) setAccountId(accRes.data[0].id);
          if (catRes.data.length > 0) setCategoryId(catRes.data[0].id);
        }
      } catch (err) {
        setError('Failed to load form options');
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, [initialData]);

  // Income category names — used to filter the dropdown
  const incomeCategories = ['Salary', 'Freelance'];
  const sharedCategories = ['Other'];

  const filteredCategories = categories.filter(cat => {
    if (sharedCategories.includes(cat.name)) return true;
    if (type === 'income') {
      return incomeCategories.includes(cat.name);
    }
    return !incomeCategories.includes(cat.name);
  });

  // When type changes, reset category to first available in filtered list
  useEffect(() => {
    if (filteredCategories.length > 0 && !filteredCategories.find(c => c.id === categoryId)) {
      setCategoryId(filteredCategories[0].id);
    }
  }, [type, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountId || !categoryId) return setError('Account and Category are required');
    if (parseFloat(amount) <= 0) return setError('Amount must be positive');

    const data = {
      type,
      amount: parseFloat(amount),
      account_id: accountId,
      category_id: categoryId,
      date: new Date(date).toISOString(),
      description,
    };

    setSubmitting(true);
    try {
      await onSubmit(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{initialData ? 'Edit Transaction' : 'New Transaction'}</h3>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>

        {error && <AlertBanner message={error} type="danger" />}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label>Type</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setType('expense')}
                    className="btn"
                    style={{ 
                      flex: 1,
                      background: type === 'expense' ? 'var(--foreground)' : 'var(--secondary)',
                      color: type === 'expense' ? 'var(--background)' : 'var(--foreground)',
                      border: `1px solid ${type === 'expense' ? 'var(--foreground)' : 'var(--border)'}`,
                    }}
                  >
                    Expense
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setType('income')}
                    className="btn"
                    style={{ 
                      flex: 1,
                      background: type === 'income' ? 'var(--foreground)' : 'var(--secondary)',
                      color: type === 'income' ? 'var(--background)' : 'var(--foreground)',
                      border: `1px solid ${type === 'income' ? 'var(--foreground)' : 'var(--border)'}`,
                    }}
                  >
                    Income
                  </button>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="amount">Amount (₹)</label>
                <input id="amount" type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
            </div>

            <div>
              <label htmlFor="account">Account</label>
              <select id="account" required value={accountId} onChange={(e) => setAccountId(e.target.value)}>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name} (₹{acc.balance})</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="category">Category</label>
              <select id="category" required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                {filteredCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date">Date</label>
              <input id="date" type="datetime-local" required value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div>
              <label htmlFor="description">Description (Optional)</label>
              <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What was this for?" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
              <button type="submit" disabled={submitting} className="btn btn-primary">{initialData ? 'Update' : 'Save'} Transaction</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
