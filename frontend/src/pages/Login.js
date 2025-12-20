import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple authentication (you should implement proper backend authentication)
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/admin');
    } else {
      setError('Username atau password salah');
    }
    setLoading(false);
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut" } }
      }}
      className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center"
    >
      <div className="mx-auto w-full max-w-md px-4 py-8 text-center lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
          className="mb-6 flex justify-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-lg">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
          className="mb-2 text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-4xl lg:text-4xl"
        >
          Admin Portal
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
          className="mb-8 text-base font-medium text-gray-500 dark:text-gray-400"
        >
          Teknik Informatika UKSW
        </motion.p>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-6 text-left"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField('')}
              required
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium ${focusedField === 'username' ? 'border-blue-600' : 'border-gray-200 dark:border-gray-700'}`}
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField('')}
              required
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium ${focusedField === 'password' ? 'border-blue-600' : 'border-gray-200 dark:border-gray-700'}`}
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm mb-2 text-center font-semibold border-2 border-red-200">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-gradient-to-r from-blue-600 to-blue-900 text-white font-bold rounded-xl transition-all shadow-lg text-base uppercase tracking-wide ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:from-blue-700 hover:to-blue-900'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : 'Sign In'}
          </button>
        </motion.form>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.6 }}
          className="text-xs text-gray-400 text-center mt-8"
        >
          Secure admin access only
        </motion.p>
      </div>
    </motion.section>
  );
};

export default Login;
