import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h2 className="logo">📚 Library Hub</h2>
      <div className="nav-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active-link' : ''}>
          Dashboard
        </NavLink>
        <NavLink to="/books" className={({ isActive }) => isActive ? 'active-link' : ''}>
          Books
        </NavLink>
        <NavLink to="/members" className={({ isActive }) => isActive ? 'active-link' : ''}>
          Members
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => isActive ? 'active-link' : ''}>
          Transactions
        </NavLink>
        <NavLink to="/change-password" className={({ isActive }) => isActive ? 'active-link' : ''}>
          Change Password
        </NavLink>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;