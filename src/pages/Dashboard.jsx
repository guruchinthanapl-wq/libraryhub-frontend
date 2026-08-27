import { useState, useEffect } from 'react';
import { getBooks, getMembers, getTransactions } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    activeIssues: 0,
    overdueCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [booksRes, membersRes, transactionsRes] = await Promise.all([
        getBooks(),
        getMembers(),
        getTransactions(),
      ]);

      const today = new Date();
      const issued = transactionsRes.data.filter((t) => t.status === 'issued');
      const overdue = issued.filter((t) => new Date(t.due_date) < today);

      setStats({
        totalBooks: booksRes.data.length,
        totalMembers: membersRes.data.length,
        activeIssues: issued.length,
        overdueCount: overdue.length,
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (loading) return <div className="page"><h1>Dashboard</h1><p>Loading...</p></div>;

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p className="dashboard-welcome">
        Welcome back{user.username ? `, ${user.username}` : ''}. Here's what's happening in your library right now.
      </p>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.totalBooks}</span>
          <span className="stat-label">Total books</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.totalMembers}</span>
          <span className="stat-label">Registered members</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.activeIssues}</span>
          <span className="stat-label">Books currently issued</span>
        </div>
        <div className="stat-card stat-warning">
          <span className="stat-value">{stats.overdueCount}</span>
          <span className="stat-label">Overdue returns</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;