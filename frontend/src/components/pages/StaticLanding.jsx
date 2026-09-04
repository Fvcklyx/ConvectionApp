import React from 'react';
import { motion } from 'motion/react'
import Lottie from 'lottie-react/build/index.es.js';
import animationData from '../../assets/landing-animation.json'
import { useTheme } from '../context/ThemeContext';

export default function StaticLanding() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <section
      className="static-landing"
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark ? 'var(--background)' : 'var(--surface)'
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 700,
          marginBottom: '1rem',
          color: 'var(--text-primary)'
        }}
      >
        Selamat Datang di FRNDLY Marketplace
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          fontSize: 'var(--text-lg)',
          marginBottom: '2rem',
          color: 'var(--text-secondary)'
        }}
      >
        Platform custom apparel dengan desain interaktif dan kemudahan order.
      </motion.p>
      <Lottie
        animationData={animationData}
        loop
        style={{ width: 300, height: 300, marginBottom: '2rem' }}
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => (window.location.href = '/login')}
        className="btn btn-primary"
        style={{ fontSize: 'var(--text-md)' }}
      >
        Mulai Sekarang
      </motion.button>
    </section>
  );
}
