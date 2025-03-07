import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaGithub, 
  FaTwitter, 
  FaDiscord, 
  FaHeart, 
  FaKeyboard,
  FaStar,
  FaCode
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', path: '/features' },
      { label: 'Game Modes', path: '/modes' },
      { label: 'Challenges', path: '/challenges' },
      { label: 'Leaderboard', path: '/leaderboard' }
    ],
    resources: [
      { label: 'Guide', path: '/guide' },
      { label: 'Stats', path: '/stats' },
      { label: 'FAQ', path: '/faq' },
      { label: 'Support', path: '/support' }
    ],
    legal: [
      { label: 'Privacy', path: '/privacy' },
      { label: 'Terms', path: '/terms' },
      { label: 'Cookie Policy', path: '/cookies' }
    ]
  };

  const socialLinks = [
    { icon: FaGithub, url: 'https://github.com/yourusername/typerush', label: 'GitHub' },
    { icon: FaTwitter, url: 'https://twitter.com/typerush', label: 'Twitter' },
    { icon: FaDiscord, url: 'https://discord.gg/typerush', label: 'Discord' }
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <FaKeyboard className="text-3xl text-blue-500 flex-shrink-0" />
              <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 truncate">
                TypeRush
              </span>
            </Link>
            <p className="text-gray-400 mb-4">
              Improve your typing speed and accuracy with our engaging practice platform.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="text-xl" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Updated for better mobile display */}
        <div className="pt-8 mt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-center md:text-left text-sm">
              <span>© {currentYear} TypeRush. All rights reserved.</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.a
                href="https://github.com/yourusername/typerush"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                whileHover={{ scale: 1.05 }}
              >
                <FaStar className="text-yellow-400 flex-shrink-0" />
                <span>Star us on GitHub</span>
              </motion.a>
              
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <FaCode className="text-blue-400 flex-shrink-0" />
                <span>Made with</span>
                <FaHeart className="text-red-400 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 