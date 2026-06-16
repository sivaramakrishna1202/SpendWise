import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TransactionForm from '../components/TransactionForm';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, exportTransactions } from '../services/transactionService';
import { getCategories } from '../services/categoryService';
import { Plus } from 'lucide-react';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);
  const [categoryMap, setCategoryMap] = useState({});

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to load transactions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      const map = {};
      res.data.forEach(cat => { map[cat.id] = cat.name; });
      setCategoryMap(map);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  const handleExport = async () => {
    try {
      const res = await exportTransactions();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (e) {
      console.error("Export failed", e);
    }
  };

  const handleSave = async (data) => {
    if (editingTxn) {
      await updateTransaction(editingTxn.id, data);
    } else {
      await createTransaction(data);
    }
    setIsModalOpen(false);
    setEditingTxn(null);
    fetchTransactions();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      await deleteTransaction(id);
      fetchTransactions();
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content stagger">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} className="animate-fade-in-up">
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Transactions</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your income and expenses.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleExport} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src="/export-icon.png" alt="Export" className="dark-invert" style={{ width: 18, height: 18 }} />
              Export CSV
            </button>
            <button onClick={() => { setEditingTxn(null); setIsModalOpen(true); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} />
              New Transaction
            </button>
          </div>
        </header>

        <div className="glass animate-fade-in-up" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center' }}>Loading...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center' }}>No transactions found</td></tr>
              ) : (
                transactions.map(txn => (
                  <tr key={txn.id}>
                    <td>{new Date(txn.date).toLocaleDateString()}</td>
                    <td>
                        <span className={txn.type === 'income' ? 'badge-income' : 'badge-expense'}>
                          {txn.type}
                        </span>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{categoryMap[txn.category_id] || '-'}</td>
                    <td style={{ fontWeight: 600, color: txn.type === 'income' ? 'var(--color-income)' : 'var(--text-primary)' }}>
                      ₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td>{txn.description || '-'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => { setEditingTxn(txn); setIsModalOpen(true); }}
                        style={{ background: 'none', border: 'none', color: 'var(--color-primary-light)', cursor: 'pointer', marginRight: '1rem' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(txn.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-expense)', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <TransactionForm 
          initialData={editingTxn} 
          onSubmit={handleSave} 
          onCancel={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
