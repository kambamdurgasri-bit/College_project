/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        secondary: '#A78BFA',
        lightPurple: '#F5F3FF',
        bg: '#F7F7FB',
        card: '#FFFFFF',
        borderPurple: '#EDE9FE',
        textPrimary: '#0F172A',
        textSecondary: '#64748B',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#F43F5E',

        // Dark theme tokens (used via dark: variants, e.g. dark:bg-dark-bg)
        dark: {
          bg: '#15151F',
          bgSecondary: '#1B1B29',
          surface: '#1B1B29',
          card: '#1B1B29',
          primary: '#8B5CF6',
          primaryHover: '#A78BFA',
          accent: '#C4B5FD',
          text: '#F1F5F9',
          textSecondary: '#CBD5E1',
          textMuted: '#94A3B8',
          border: '#1E293B',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#F43F5E',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '22px',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(124, 58, 237, 0.06)',
        softHover: '0 12px 32px rgba(124, 58, 237, 0.14)',
        glow: '0 8px 24px rgba(124, 58, 237, 0.28)',
        softDark: '0 4px 24px rgba(0, 0, 0, 0.25)',
        softHoverDark: '0 12px 32px rgba(0, 0, 0, 0.4)',
        glowDark: '0 8px 24px rgba(139, 92, 246, 0.35)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
        'hero-gradient': 'linear-gradient(135deg, #F5F3FF 0%, #F7F7FB 60%)',
        'primary-gradient-dark': 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
        'hero-gradient-dark': 'linear-gradient(135deg, #1B1B29 0%, #15151F 60%)',
      },
    },
  },
  plugins: [],
};
