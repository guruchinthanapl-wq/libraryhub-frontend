import { useState, useEffect } from 'react';
import { getBooks, getMembers, getTransactions, issueBook, returnBook } from '../services/api';

function Transactions() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [booksRes, membersRes, transactionsRes] = await Promise.all([
        getBooks(),
        getMembers(),
        getTransactions(),
      ]);
      setBooks(booksRes.data);
      setMembers(membersRes.data);
      setTransactions(transactionsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();

    if (!selectedBook || !selectedMember) {
      alert('Please select both a book and a member.');
      return;
    }

    try {
      await issueBook(selectedBook, selectedMember);
      setSelectedBook('');
      setSelectedMember('');
      fetchAll(); // refresh everything from the server
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to issue book.');
    }
  };

  const handleReturn = async (transactionId) => {
    try {
      const res = await returnBook(transactionId);
      if (res.data.fine > 0) {
        alert(`Book returned ${res.data.daysLate} day(s) late. Fine: ₹${res.data.fine}`);
      }
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to return book.');
    }
  };

  if (loading) return <div className="page"><h1>Transactions</h1><p>Loading...</p></div>;
   const isOverdue = (t) => {
  if (t.status !== 'issued') return false;
  const today = new Date();
  const due = new Date(t.due_date);
  return today > due;
};

const getStatusLabel = (t) => {
  if (t.status === 'returned') return 'returned';
  return isOverdue(t) ? 'overdue' : 'issued';
};

const getStatusClass = (t) => {
  if (t.status === 'returned') return 'status-returned';
  return isOverdue(t) ? 'status-overdue' : 'status-issued';
};
  return (
    <div className="page">
      <h1>Transactions</h1>

      <form className="issue-form" onSubmit={handleIssue}>
        <h3>Issue a Book</h3>
        <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)}>
          <option value="">Select Book</option>
          {books
            .filter((b) => b.available_copies > 0)
            .map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} ({b.available_copies} available)
              </option>
            ))}
        </select>

        <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}>
          <option value="">Select Member</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <button type="submit">Issue Book</button>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Book</th>
            <th>Member</th>
            <th>Issue Date</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Fine</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.book_title}</td>
              <td>{t.member_name}</td>
              <td>{t.issue_date?.split('T')[0]}</td>
              <td>{t.due_date?.split('T')[0]}</td>
              <td>
                <span className={getStatusClass(t)}>
                 {getStatusLabel(t)}
                </span>
              </td>
              <td>{t.fine ? `₹${t.fine}` : '-'}</td>
              <td>
                {t.status === 'issued' && (
                  <button onClick={() => handleReturn(t.id)}>Return</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;