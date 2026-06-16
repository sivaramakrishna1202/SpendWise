import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getCategories, createCategory, deleteCategory } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import AlertBanner from '../components/AlertBanner';

export default function Settings() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📁');
  const [color, setColor] = useState('#6366f1');
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) return setError("Category name required");
    try {
      await createCategory({ name, icon, color });
      setName('');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create category");
    }
  };

  const handleDeleteCategory = async (id, isSystem) => {
    if (isSystem) return alert("Cannot delete system categories!");
    if (window.confirm("Are you sure?")) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (err) {
        alert("Cannot delete category in use");
      }
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content stagger">
        <header style={{ marginBottom: '2rem' }} className="animate-fade-in-up">
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Settings</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your profile and custom categories.</p>
        </header>

        <div className="glass animate-fade-in-up" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Profile</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 700, color: 'white',
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{user?.name}</p>
              <p style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Joined: {new Date(user?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="glass animate-fade-in-up" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Categories</h3>
          {error && <AlertBanner message={error} type="danger" />}
          
          <form onSubmit={handleCreateCategory} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label>New Category Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Subscriptions" />
            </div>
            <div style={{ width: '80px' }}>
              <label>Icon</label>
              <input type="text" value={icon} onChange={e => setIcon(e.target.value)} />
            </div>
            <div style={{ width: '80px' }}>
              <label>Color</label>
              <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ padding: '0.2rem', height: '42px' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>Add</button>
          </form>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {categories.map(cat => (
              <div key={cat.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)',
                border: `1px solid ${cat.color}40`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{cat.icon}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{cat.name}</span>
                </div>
                {!cat.user_id ? (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>System</span>
                ) : (
                  <button onClick={() => handleDeleteCategory(cat.id, false)} style={{ background: 'none', border: 'none', color: 'var(--color-expense)', cursor: 'pointer' }}>✕</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
