import React from 'react';

const Header = ({ theme, toggleTheme }) => {
  return (
    <header>
      <h1>Task Manager</h1>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  );
};

export default Header;