import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { MessageSquare, LogIn, UserPlus, MessageCircle, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand-icon">
            <MessageSquare size={26} strokeWidth={2.5} />
          </span>
          <span>OmniChat</span>
        </Link>
        <ul className="navbar-links">
          {user ? (
            <>
              <li className="navbar-user-info">
                <UserIcon size={16} className="navbar-user-icon" />
                <span className="navbar-user-name">{user.userName}</span>
              </li>
              <li>
                <NavLink to="/chats" className="navbar-link">
                  <MessageCircle size={16} />
                  <span>Chats</span>
                </NavLink>
              </li>
              <li>
                <button onClick={logout} className="navbar-link navbar-logout-btn">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/signin" className="navbar-link">
                  <LogIn size={16} />
                  <span>Sign In</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/signup" className="navbar-link">
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/chats" className="navbar-link">
                  <MessageCircle size={16} />
                  <span>Chats</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
