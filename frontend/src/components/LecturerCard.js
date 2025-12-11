import React from 'react';

const LecturerCard = ({ lecturer }) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        transition: 'box-shadow 0.3s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'}
    >
      {/* Profile Image */}
      <div style={{
        position: 'relative',
        height: '280px',
        backgroundColor: '#2563eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {lecturer.photo ? (
          <img
            src={lecturer.photo}
            alt={lecturer.fullname}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              const parent = e.target.parentElement;
              // Only add fallback if it doesn't already exist
              if (!parent.querySelector('.fallback-icon')) {
                e.target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'fallback-icon';
                fallback.innerHTML = `
                  <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                `;
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        )}
      </div>

      {/* Lecturer Info */}
      <div style={{ 
        padding: '20px',
        backgroundColor: '#ffffff'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '12px',
          display: 'block',
          lineHeight: '1.4'
        }}>
          {lecturer.fullname || 'No Name'}
        </h3>
        
        <div style={{ 
          marginBottom: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <p style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#6b7280',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Keahlian
          </p>
          <p style={{
            fontSize: '14px',
            color: '#374151',
            lineHeight: '1.6'
          }}>
            {Array.isArray(lecturer.expertise) && lecturer.expertise.length > 0 
              ? lecturer.expertise.join(', ') 
              : 'Tidak ada data keahlian'}
          </p>
        </div>

        {/* Contact Info */}
        <div style={{ 
          marginBottom: '16px'
        }}>
          {lecturer.email && (
          <a
            href={`mailto:${lecturer.email}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#2563eb',
              textDecoration: 'none',
              marginBottom: '8px'
            }}
          >
            <span>📧</span>
            <span style={{ wordBreak: 'break-all' }}>{lecturer.email}</span>
          </a>
          )}
          
          {lecturer.externalLink && lecturer.externalLink !== '-' && lecturer.externalLink !== 'null' && (
            <a
              href={lecturer.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#2563eb',
                textDecoration: 'none'
              }}
            >
              <span>🔗</span>
              <span>Profil Eksternal</span>
            </a>
          )}
        </div>

        {/* View Profile Button */}
        <button style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#2563eb',
          color: 'white',
          fontWeight: '600',
          fontSize: '14px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          Lihat Profil Lengkap
        </button>
      </div>
    </div>
  );
};

export default LecturerCard;