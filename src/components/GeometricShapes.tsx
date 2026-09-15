import { motion } from 'framer-motion';

export const ShapePyramid = ({ className = "" }) => (
  <motion.svg 
    viewBox="0 0 100 100" 
    className={`${className} drop-shadow-lg`}
    animate={{ rotateY: 360 }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    <defs>
      <linearGradient id="pyr1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" className="stop-color-text-light dark:stop-color-text-dark" stopOpacity="0.8" />
        <stop offset="100%" className="stop-color-text-light dark:stop-color-text-dark" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="pyr2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" className="stop-color-text-light dark:stop-color-text-dark" stopOpacity="0.4" />
        <stop offset="100%" className="stop-color-text-light dark:stop-color-text-dark" stopOpacity="0.7" />
      </linearGradient>
    </defs>
    <path d="M50 10 L90 85 L10 85 Z" fill="url(#pyr1)" />
    <path d="M50 10 L50 85 L90 85 Z" fill="url(#pyr2)" />
  </motion.svg>
);

export const ShapeCube = ({ className = "" }) => (
  <motion.svg 
    viewBox="0 0 100 100" 
    className={`${className} drop-shadow-lg`}
    whileHover={{ scale: 1.1, rotate: 90 }}
    transition={{ type: "spring", stiffness: 200 }}
  >
    <defs>
      <linearGradient id="cube1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" className="stop-color-text-light dark:stop-color-text-dark" stopOpacity="0.9" />
        <stop offset="100%" className="stop-color-text-light dark:stop-color-text-dark" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="cube2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" className="stop-color-text-light dark:stop-color-text-dark" stopOpacity="0.6" />
        <stop offset="100%" className="stop-color-text-light dark:stop-color-text-dark" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id="cube3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" className="stop-color-text-light dark:stop-color-text-dark" stopOpacity="0.3" />
        <stop offset="100%" className="stop-color-text-light dark:stop-color-text-dark" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    <path d="M50 10 L90 30 L50 50 L10 30 Z" fill="url(#cube1)" />
    <path d="M90 30 L90 75 L50 95 L50 50 Z" fill="url(#cube2)" />
    <path d="M50 50 L50 95 L10 75 L10 30 Z" fill="url(#cube3)" />
  </motion.svg>
);

export const ShapeIcosahedron = ({ className = "" }) => (
  <motion.svg 
    viewBox="0 0 100 100" 
    className={`${className} drop-shadow-lg`}
    animate={{ rotate: 360 }}
    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
  >
    <defs>
      <linearGradient id="ico1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" className="stop-color-text-light dark:stop-color-text-dark" stopOpacity="0.8" />
        <stop offset="100%" className="stop-color-text-light dark:stop-color-text-dark" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="ico2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" className="stop-color-text-light dark:stop-color-text-dark" stopOpacity="0.4" />
        <stop offset="100%" className="stop-color-text-light dark:stop-color-text-dark" stopOpacity="0.6" />
      </linearGradient>
    </defs>
    {/* Simplified faceted geometric shape */}
    <path d="M50 5 L85 25 L85 65 L50 85 L15 65 L15 25 Z" fill="url(#ico2)" />
    <path d="M50 5 L85 25 L50 45 L15 25 Z" fill="url(#ico1)" opacity="0.8" />
    <path d="M15 25 L50 45 L50 85 L15 65 Z" fill="url(#ico1)" opacity="0.6" />
    <path d="M85 25 L85 65 L50 85 L50 45 Z" fill="url(#ico1)" opacity="0.4" />
  </motion.svg>
);

export const ShapeTorus = ({ className = "" }) => (
  <motion.svg 
    viewBox="0 0 100 100" 
    className={`${className} drop-shadow-lg`}
    animate={{ rotateX: 360 }}
    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
  >
    <defs>
      <linearGradient id="torus1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" className="stop-color-text-light dark:stop-color-text-dark" stopOpacity="0.9" />
        <stop offset="100%" className="stop-color-text-light dark:stop-color-text-dark" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    {/* Abstract representation of interwoven rings */}
    <circle cx="50" cy="50" r="30" fill="none" stroke="url(#torus1)" strokeWidth="12" />
    <ellipse cx="50" cy="50" rx="35" ry="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-light dark:text-text-dark opacity-30" />
    <ellipse cx="50" cy="50" rx="10" ry="35" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-light dark:text-text-dark opacity-30" />
  </motion.svg>
);

