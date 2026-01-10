import React from 'react';
import { Link } from 'react-router-dom';
import { SOCIAL_LINKS, CONTACT_INFO } from '../config/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleSubscribeNewsletter = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      // Handle newsletter subscription
      alert('Thank you for subscribing to our newsletter!');
      e.target.reset();
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        
       

     
      </div>
    </footer>
  );
};

export default Footer;
