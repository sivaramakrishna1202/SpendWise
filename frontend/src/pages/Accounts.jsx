import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getAccounts, createAccount, deleteAccount } from '../services/accountService';
import AlertBanner from '../components/AlertBanner';
import { Plus } from 'lucide-react';

const typeIcons = { bank: '🏦', cash: '💵', credit: '💳', upi: '📱' };

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [type, setType] = useState('bank');
  const [balance, setBalance] = useState('0');
  const [error, setError] = useState('');

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await getAccounts();
      setAccounts(res.data);
    } catch (error) {
      console.error("Failed to load accounts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name) return setError("Name is required");
    
    try {
      await createAccount({ name, type, balance: parseFloat(balance) || 0 });
      setIsModalOpen(false);
      setName('');
      setBalance('0');
      fetchAccounts();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create account");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Cannot delete accounts with associated transactions. Force delete?")) {
      try {
        await deleteAccount(id);
        fetchAccounts();
      } catch (err) {
        alert("Failed to delete account");
      }
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content stagger">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} className="animate-fade-in-up">
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Accounts</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your financial sources.</p>
          </div>
          <button onClick={() => { setError(''); setIsModalOpen(true); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} />
            New Account
          </button>
        </header>

        <div className="animate-fade-in-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {loading ? (
            <p>Loading...</p>
          ) : accounts.length === 0 ? (
            <p>No accounts found.</p>
          ) : (
            accounts.map(acc => (
              <div key={acc.id} className="glass glass-hover" style={{ padding: '1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem', background: 'var(--bg-surface)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                      {typeIcons[acc.type]}
                    </span>
                    <div>
                      <h4 style={{ fontWeight: 600 }}>{acc.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{acc.type}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(acc.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: acc.balance >= 0 ? 'var(--color-income)' : 'var(--color-expense)' }}>
                  ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </h3>
              </div>
            ))
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>New Account</h3>
            {error && <AlertBanner message={error} type="danger" />}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>Account Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. HDFC Checking" />
              </div>
              <div>
                <label>Type</label>
                <select value={type} onChange={e => setType(e.target.value)} required>
                  <option value="bank">Bank</option>
                  <option value="cash">Cash</option>
                  <option value="credit">Credit Card</option>
                  <option value="upi">UPI / Wallet</option>
                </select>
              </div>
              <div>
                <label>Initial Balance (₹)</label>
                <input type="number" step="0.01" required value={balance} onChange={e => setBalance(e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
