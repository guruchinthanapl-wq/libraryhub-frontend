import { useState, useEffect } from 'react';
import { getMembers, addMember, updateMember, deleteMember } from '../services/api';

function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await getMembers();
      setMembers(res.data);
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('member');
    setEditingMember(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email) {
      setError('Name and email are required.');
      return;
    }

    try {
      if (editingMember) {
        const res = await updateMember(editingMember.id, { name, email, role });
        setMembers(members.map((m) => (m.id === editingMember.id ? res.data : m)));
      } else {
        const res = await addMember({ name, email, role });
        setMembers([...members, res.data]);
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save member.');
    }
  };

  const startEditing = (member) => {
    setEditingMember(member);
    setName(member.name);
    setEmail(member.email);
    setRole(member.role);
    setError('');
  };

  const handleDelete = async (id, memberName) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${memberName}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await deleteMember(id);
      setMembers(members.filter((m) => m.id !== id));
    } catch (err) {
      const msg = err.response?.data?.error || '';
      if (msg.includes('foreign key') || msg.includes('FOREIGN KEY') || err.response?.status === 500) {
        alert(`Cannot delete "${memberName}" — this member has existing transaction history (issued or returned books). Remove or reassign their transactions first.`);
      } else {
        alert(msg || 'Failed to delete member.');
      }
    }
  };

  if (loading) return <div className="page"><h1>Members</h1><p>Loading...</p></div>;

  return (
    <div className="page">
      <h1>Members</h1>

      <form className="member-form" onSubmit={handleSubmit}>
        <h3>{editingMember ? 'Edit Member' : 'Add Member'}</h3>
        {error && <p className="form-error">{error}</p>}
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="member">Member</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        <button type="submit">{editingMember ? 'Save Changes' : 'Add Member'}</button>
        {editingMember && (
          <button type="button" onClick={resetForm} className="cancel-btn">
            Cancel
          </button>
        )}
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.role}</td>
              <td>
                <button onClick={() => startEditing(member)}>Edit</button>
                <button onClick={() => handleDelete(member.id, member.name)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MemberList;