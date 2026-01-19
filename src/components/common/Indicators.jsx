import React from 'react';

export const TrustScore = ({ score, size = 'md' }) => {
  const getColor = (s) => {
    if (s >= 80) return '#10B981';
    if (s >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const dimensions = size === 'lg' ? 80 : size === 'sm' ? 40 : 60;
  const fontSize = size === 'lg' ? '1.5rem' : size === 'sm' ? '0.75rem' : '1rem';

  return (
    <div style={{
      width: dimensions,
      height: dimensions,
      borderRadius: '50%',
      border: `4px solid ${getColor(score)}`,
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: getColor(score),
      fontSize: fontSize,
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    }}>
      {score}
    </div>
  );
};

export const FairPriceMeter = ({ marketPrice, offeredPrice }) => {
  const diff = offeredPrice - marketPrice;
  const percent = (offeredPrice / (marketPrice * 2)) * 100;

  return (
    <div className="fair-price-meter" style={{ width: '100%', padding: '10px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Market: ₹{marketPrice}</span>
        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Offered: ₹{offeredPrice}</span>
      </div>
      <div style={{ height: '8px', background: '#E5E7EB', borderRadius: '4px', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: 0,
          height: '100%',
          width: `${Math.min(percent, 100)}%`,
          background: diff >= 0 ? 'var(--primary)' : 'var(--danger)',
          borderRadius: '4px'
        }}></div>
      </div>
      <div style={{ marginTop: '8px', fontSize: '0.75rem', textAlign: 'center', color: diff >= 0 ? 'var(--success)' : 'var(--danger)' }}>
        {diff >= 0 ? `+${((diff / marketPrice) * 100).toFixed(1)}% above market` : `${((diff / marketPrice) * 100).toFixed(1)}% below market`}
      </div>
    </div>
  );
};

export const Timeline = ({ steps, currentStep }) => {
  return (
    <div className="timeline" style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', width: '100%', padding: '20px 0' }}>
      <div style={{ position: 'absolute', top: '28px', left: '10%', right: '10%', height: '2px', background: '#E5E7EB', zIndex: 0 }}></div>
      {steps.map((step, index) => {
        const isActive = index <= currentStep;
        return (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: isActive ? 'var(--primary)' : 'white',
              border: isActive ? 'none' : '2px solid #E5E7EB',
              marginBottom: '8px'
            }}></div>
            <span style={{ fontSize: '0.65rem', color: isActive ? 'var(--text-main)' : 'var(--text-secondary)', fontWeight: isActive ? 600 : 400, textAlign: 'center' }}>
              {step}
            </span>
          </div>
        )
      })}
    </div>
  );
};
