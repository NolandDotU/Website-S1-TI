import React from 'react';

const Skeleton = ({ height = 20, width = '100%', style = {} }) => (
  <div
    style={{
      background: 'linear-gradient(90deg, #f3f3f3 25%, #e0e0e0 37%, #f3f3f3 63%)',
      backgroundSize: '400% 100%',
      animation: 'skeleton-loading 1.2s ease-in-out infinite',
      borderRadius: 6,
      height,
      width,
      margin: '8px 0',
      ...style,
    }}
  />
);

export default Skeleton;

// Add this to your global CSS (e.g., index.css):
// @keyframes skeleton-loading {
//   0% { background-position: 100% 50%; }
//   100% { background-position: 0 50%; }
// }
