import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SummaryCard from '../components/SummaryCard';
import SpendingPieChart from '../components/SpendingPieChart';
import SpendingLineChart from '../components/SpendingLineChart';
import AlertBanner from '../components/AlertBanner';
import { getDashboardSummary, getSpendingByCategory, getSpendingOverTime } from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, pieRes, lineRes] = await Promise.all([
          getDashboardSummary(),
          getSpendingByCategory(),
          getSpendingOverTime()
        ]);
        setSummary(sumRes.data);
        setPieData(pieRes.data);
        setLineData(lineRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !summary) {
    return (
      <div className="app-layout">
        <Navbar />
        <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-fade-in-up" style={{ color: 'var(--text-secondary)' }}>Loading Dashboard...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content stagger">
        <header style={{ marginBottom: '2rem' }} className="animate-fade-in-up">
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Hello, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 
            <img src="/handwave-icon.png" alt="Handwave" className="dark-invert" style={{ width: 32, height: 32 }} />
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Here is your financial overview for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </header>

        {summary.active_alerts > 0 && (
          <AlertBanner 
            message={`You have ${summary.active_alerts} budget(s) nearing or exceeding their limit! Check your budgets page.`} 
            type="warning" 
          />
        )}

        <div className="animate-fade-in-up" style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' 
        }}>
          <SummaryCard 
            title="Total Income" 
            value={summary.total_income} 
            icon="/income-icon.png" 
            type="income" 
          />
          <SummaryCard 
            title="Total Expenses" 
            value={summary.total_expense} 
            icon="/expences-icon.png" 
            type="expense" 
          />
          <SummaryCard 
            title="Net Balance" 
            value={summary.net_balance} 
            icon="/netbalance-icon.png" 
            type="primary" 
          />
        </div>

        <div className="animate-fade-in-up" style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' 
        }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <SpendingPieChart data={pieData} />
          </div>
          <div style={{ flex: 1.5, minWidth: '300px' }}>
            <SpendingLineChart data={lineData} />
          </div>
        </div>
      </main>
    </div>
  );
}
