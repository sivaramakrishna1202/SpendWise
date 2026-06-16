import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '0.75rem 1rem',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      }}>
        <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
          {d.category_icon} {d.category_name}
        </p>
        <p style={{ color: 'var(--color-expense)', fontSize: '0.9rem', fontWeight: 700 }}>
          ₹{d.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

export default function SpendingPieChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass animate-fade-in-up" style={{ padding: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>No spending data this month</p>
      </div>
    );
  }

  return (
    <div className="glass animate-fade-in-up" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Spending by Category</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category_name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.category_color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
