import React from 'react';

const LecturerCard = ({ lecturer }) => {
  // Figma asset fallback
  const defaultPhoto = "http://localhost:3845/assets/b54b1a4408966511b4cec9353d765b04c33f2fcb.png";
  const vectorIcon = "http://localhost:3845/assets/1bc2f8a0f78f483271663fe4b0bec0321d9afff4.svg";

  // Card container style
  const cardStyle = {
    background: '#fff',
    borderRadius: 16,
    position: 'relative',
    width: 420,
    height: 210,
    overflow: 'hidden',
    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'flex-start',
    fontFamily: 'Inter, sans-serif',
    margin: '0 auto',
  };

  // Photo style
  const photoWrapStyle = {
    position: 'absolute',
    left: 18,
    top: 18,
    width: 90,
    height: 90,
    borderRadius: '50%',
    overflow: 'hidden',
    background: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Email style
  const emailStyle = {
    position: 'absolute',
    left: 120,
    top: 40,
    fontFamily: 'Inter, sans-serif',
    fontSize: 13,
    color: '#444',
    fontWeight: 400,
    whiteSpace: 'nowrap',
    maxWidth: 260,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  };

  // Name style
  const nameStyle = {
    position: 'absolute',
    left: 120,
    top: 70,
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    fontSize: 16,
    color: '#111',
    width: 260,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'normal',
    lineHeight: 1.2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  // Expertise label style
  const expertiseLabelStyle = {
    position: 'absolute',
    left: 24,
    top: 120,
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    fontSize: 10,
    color: '#555',
    letterSpacing: 1,
    textTransform: 'uppercase',
  };

  // Expertise grid style
  const expertiseGridStyle = {
    position: 'absolute',
    left: 24,
    top: 140,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    width: 370,
    minHeight: 40,
    alignItems: 'flex-start',
  };

  // Expertise badge style
  const badgeStyle = () => ({
    background: '#d9d9d9',
    borderRadius: 14,
    minWidth: 70,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    color: '#222',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    padding: '0 10px',
    margin: 0,
  });

  // Vector icon style
  const vectorStyle = {
    position: 'absolute',
    left: 24,
    bottom: 18,
    width: 18,
    height: 15,
  };

  // Prepare expertise badges (up to 9, 3x3 grid)
  const expertise = Array.isArray(lecturer.expertise) ? lecturer.expertise : [];
  const badges = [];
  for (let i = 0; i < Math.min(6, expertise.length); i++) {
    let text = expertise[i];
    let displayText = text && text.length > 10 ? text.slice(0, 10) + '…' : text;
    badges.push(
      <div key={i} style={badgeStyle()} title={text}>
        {displayText}
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      {/* Profile Image */}
      <div style={photoWrapStyle}>
        <img
          src={lecturer.photo || defaultPhoto}
          alt={lecturer.fullname || 'Lecturer'}
          style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover' }}
          onError={e => { e.target.onerror = null; e.target.src = defaultPhoto; }}
        />
      </div>
      {/* Email */}
      <div style={emailStyle}>
        <span style={{display:'flex',alignItems:'center'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>
        </span>
        <span>{lecturer.email || 'dosen.ti@uksw.edu'}</span>
      </div>
      {/* Name */}
      <div style={nameStyle}>{lecturer.fullname || 'No Name'}</div>
      {/* Expertise Label */}
      <div style={expertiseLabelStyle}>KEAHLIAN</div>
      {/* Expertise Grid */}
      <div style={expertiseGridStyle}>{badges.length > 0 ? badges : <div style={badgeStyle(0,0)}>Tidak ada data keahlian</div>}</div>
    </div>
  );
};

export default LecturerCard;