import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-title">
              <span>OmniChat</span>
            </div>
            <p className="footer-brand-desc">
              Experience the next generation of messaging. End-to-end security, lightning-fast sync, and modular customizability built for the modern web.
            </p>
          </div>
          <div className="footer-nav">
            <div className="footer-nav-col">
              <span className="footer-nav-title">Platform</span>
              <ul className="footer-nav-list">
                <li>
                  <Link to="/signin" className="footer-nav-link">Sign In</Link>
                </li>
                <li>
                  <Link to="/signup" className="footer-nav-link">Sign Up</Link>
                </li>
                <li>
                  <Link to="/chats" className="footer-nav-link">Chats Dashboard</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {currentYear} OmniChat Inc. All rights reserved. Designed with premium dark system patterns.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
