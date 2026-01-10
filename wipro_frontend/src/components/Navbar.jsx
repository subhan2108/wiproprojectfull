import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { stats } = useProperty();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <div className="brand-logo">🏠</div>
            <div className="brand-text">
              <span className="brand-name">WIPO</span>
              <span className="brand-tagline">Properties</span>
            </div>
          </Link>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="navbar-search">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Search properties by location, title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                🔍
              </button>
            </div>
          </form>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-nav desktop-nav">
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
            >
              🏠 Home
            </Link>
            
            <Link 
              to="/properties" 
              className={`nav-link ${isActiveLink('/properties') ? 'active' : ''}`}
            >
              🔍 Browse Properties
              {stats.total_properties && (
                <span className="nav-badge">{stats.total_properties}</span>
              )}
            </Link>

            {isAuthenticated && (
              <>
                <Link 
                  to="/favorites" 
                  className={`nav-link ${isActiveLink('/favorites') ? 'active' : ''}`}
                >
                  ❤️ Favorites
                </Link>
                
                <Link 
                  to="/my-properties" 
                  className={`nav-link ${isActiveLink('/my-properties') ? 'active' : ''}`}
                >
                  📋 My Properties
                </Link>

                <Link 
                  to="/inquiries" 
                  className={`nav-link ${isActiveLink('/inquiries') ? 'active' : ''}`}
                >
                  💬 Inquiries
                </Link>
              </>
            )}
          </div>

          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                <Link to="/properties/new" className="nav-btn primary">
                  ➕ List Property
                </Link>
                
                {/* User Menu */}
                <div className="user-menu" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="user-menu-trigger"
                  >
                    <div className="user-avatar">
                      {user?.first_name ? user.first_name[0].toUpperCase() : user?.username?.[0]?.toUpperCase() || '👤'}
                    </div>
                    <span className="user-name">
                      {user?.first_name || user?.username || 'User'}
                    </span>
                    <span className="dropdown-arrow">▼</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="user-dropdown">
                      <div className="dropdown-header">
                        <div className="user-info">
                          <strong>{user?.first_name || user?.username}</strong>
                          <span className="user-email">{user?.email}</span>
                        </div>
                      </div>
                      
                      <div className="dropdown-divider" />
                      
                      <div className="dropdown-menu">
                        <Link to="/dashboard" className="dropdown-item">
                          📊 Dashboard
                        </Link>
                        
                        <Link to="/my-properties" className="dropdown-item">
                          🏠 My Properties
                        </Link>
                        
                        <Link to="/favorites" className="dropdown-item">
                          ❤️ Favorites
                        </Link>
                        
                        <Link to="/inquiries" className="dropdown-item">
                          💬 Inquiries
                        </Link>
                        
                        <div className="dropdown-divider" />
                        
                        <Link to="/profile" className="dropdown-item">
                          ⚙️ Settings
                        </Link>
                        
                        <button onClick={handleLogout} className="dropdown-item logout">
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="nav-btn secondary">
                  🔑 Login
                </Link>
                <Link to="/register" className="nav-btn primary">
                  🚀 Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="mobile-nav" ref={mobileMenuRef}>
          {/* Mobile Search */}
          <div className="mobile-search">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-group">
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  🔍
                </button>
              </div>
            </form>
          </div>

          {/* Mobile Menu Items */}
          <div className="mobile-menu">
            <Link 
              to="/" 
              className={`mobile-nav-link ${isActiveLink('/') ? 'active' : ''}`}
            >
              🏠 Home
            </Link>
            
            <Link 
              to="/properties" 
              className={`mobile-nav-link ${isActiveLink('/properties') ? 'active' : ''}`}
            >
              🔍 Browse Properties
            </Link>

            {isAuthenticated ? (
              <>
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">
                    {user?.first_name ? user.first_name[0].toUpperCase() : user?.username?.[0]?.toUpperCase() || '👤'}
                  </div>
                  <div className="mobile-user-details">
                    <strong>{user?.first_name || user?.username}</strong>
                    <span>{user?.email}</span>
                  </div>
                </div>

                <div className="mobile-divider" />

                <Link 
                  to="/dashboard" 
                  className={`mobile-nav-link ${isActiveLink('/dashboard') ? 'active' : ''}`}
                >
                  📊 Dashboard
                </Link>

                <Link 
                  to="/properties/new" 
                  className="mobile-nav-link primary"
                >
                  ➕ List New Property
                </Link>

                <Link 
                  to="/my-properties" 
                  className={`mobile-nav-link ${isActiveLink('/my-properties') ? 'active' : ''}`}
                >
                  📋 My Properties
                </Link>

                <Link 
                  to="/favorites" 
                  className={`mobile-nav-link ${isActiveLink('/favorites') ? 'active' : ''}`}
                >
                  ❤️ Favorites
                </Link>

                <Link 
                  to="/inquiries" 
                  className={`mobile-nav-link ${isActiveLink('/inquiries') ? 'active' : ''}`}
                >
                  💬 Inquiries
                </Link>

                <div className="mobile-divider" />

                <Link to="/profile" className="mobile-nav-link">
                  ⚙️ Settings
                </Link>

                <button onClick={handleLogout} className="mobile-nav-link logout">
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <div className="mobile-auth-buttons">
                  <Link to="/login" className="mobile-nav-btn secondary">
                    🔑 Login
                  </Link>
                  <Link to="/register" className="mobile-nav-btn primary">
                    🚀 Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
          

          {/* Mobile Quick Stats */}
          {stats.total_properties && (
            <div className="mobile-stats">
              <div className="stat-item">
                <span className="stat-number">{stats.total_properties}</span>
                <span className="stat-label">Properties Listed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.available_properties || '800+'}</span>
                <span className="stat-label">Available Now</span>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
