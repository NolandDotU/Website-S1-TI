import React from 'react';

const LecturerCard = ({ lecturer }) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 30px -3px rgba(0, 0, 0, 0.3)', // Stronger shadow
        overflow: 'hidden',
        border: '2px solid #d1d5db' // Darker border
      }}
    >
      {/* Profile Image */}
      <div style={{
        position: 'relative',
        height: '256px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
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
              e.target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.innerHTML = '👨‍🏫';
              fallback.style.fontSize = '96px';
              fallback.style.color = 'white';
              e.target.parentElement.appendChild(fallback);
            }}
          />
        ) : (
          <div style={{ fontSize: '96px', color: 'white' }}>👨‍🏫</div>
        )}
      </div>

      {/* Lecturer Info */}
      <div style={{ 
        padding: '24px',
        backgroundColor: '#f9fafb'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '900',
          color: '#000000',
          marginBottom: '16px',
          display: 'block',
          minHeight: '48px',
          backgroundColor: '#ffffff',
          padding: '8px',
          border: '2px solid #000000'
        }}>
          {lecturer.fullname || 'No Name'}
        </h3>
        
        <div style={{ 
          marginBottom: '16px',
          backgroundColor: '#ffffff',
          padding: '12px',
          border: '1px solid #d1d5db'
        }}>
          <p style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#000000',
            marginBottom: '8px'
          }}>
            Keahlian:
          </p>
          <p style={{
            fontSize: '14px',
            color: '#000000',
            lineHeight: '1.5',
            fontWeight: '600'
          }}>
            {Array.isArray(lecturer.expertise) && lecturer.expertise.length > 0 
              ? lecturer.expertise.join(', ') 
              : 'Tidak ada data keahlian'}
          </p>
        </div>

        {/* Contact Info */}
        <div style={{ 
          marginBottom: '16px',
          backgroundColor: '#ffffff',
          padding: '12px'
        }}>
          {lecturer.email && (
          <a
            href={`mailto:${lecturer.email}`}
            style={{
              display: 'block',
              fontSize: '14px',
              color: '#dc2626',
              textDecoration: 'underline',
              marginBottom: '8px',
              fontWeight: 'bold'
            }}
          >
            📧 {lecturer.email}
          </a>
          )}
          
          {lecturer.externalLink && lecturer.externalLink !== '-' && lecturer.externalLink !== 'null' && (
            <a
              href={lecturer.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                fontSize: '14px',
                color: '#dc2626',
                textDecoration: 'underline',
                fontWeight: 'bold'
              }}
            >
              🔗 Profil Eksternal
            </a>
          )}
        </div>

        {/* View Profile Button */}
        <button style={{
          width: '100%',
          padding: '12px',
          background: 'linear-gradient(90deg, #2563eb 0%, #8b5cf6 100%)',
          color: 'white',
          fontWeight: '600',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.3s'
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Lihat Profil Lengkap
        </button>
      </div>
    </div>
  );
};

export default LecturerCard;