import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const A11yConfig = () => {
  const { darkMode } = useTheme();

  return (
    <div role="complementary" className="sr-only">
      <div id="a11y-status" aria-live="polite"></div>
      <div id="a11y-announcer" aria-live="assertive"></div>
    </div>
  );
};

export default A11yConfig; 