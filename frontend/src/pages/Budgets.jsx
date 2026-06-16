import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import BudgetProgressBar from '../components/BudgetProgressBar';
import { getBudgetStatus, createBudget, deleteBudget } from '../services/budgetService';
import { getCategories } from '../services/categoryService';
import AlertBanner from '../components/AlertBanner';
import { Plus } from 'lucide-react';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [categoryId, setCategoryId] = useState('');
  const [limit, setLimit] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budRes, catRes] = await Promise.all([getBudgetStatus(), getCategories()]);
      setBudgets(budRes.data);
      setCategories(catRes.data);
      if (catRes.data.length > 0) setCategoryId(catRes.data[0].id);
    } catch (error) {
      console.error("Failed to load budgets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!categoryId || !limit) return setError("Required fields missing");
    
    try {
      await createBudget({
        category_id: categoryId,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        limit_amount: parseFloat(limit)
      });
      setIsModalOpen(false);
      setLimit('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create budget");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this budget?")) {
      await deleteBudget(id);
      fetchData();
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content stagger">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} className="animate-fade-in-up">
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Budgets</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Track spending limits by category.</p>
          </div>
          <button onClick={() => { setError(''); setIsModalOpen(true); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} />
            New Budget
          </button>
        </header>

        <div className="animate-fade-in-up">
          {loading ? (
            <p>Loading...</p>
          ) : budgets.length === 0 ? (
            <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>You have not set any budgets for this month.</p>
            </div>
          ) : (
            budgets.map(budget => (
              <BudgetProgressBar key={budget.id} budget={budget} onDelete={() => handleDelete(budget.id)} />
            ))
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Create Budget</h3>
            {error && <AlertBanner message={error} type="danger" />}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>Category</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Monthly Limit (₹)</label>
                <input type="number" step="1" required value={limit} onChange={e => setLimit(e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
