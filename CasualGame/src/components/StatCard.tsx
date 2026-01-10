import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  type: 'time' | 'money' | 'record';
  isLowTime?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, type, isLowTime }) => {
  return (
    <div className={`side-stat ${type}-stat`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <span className="label">{label}</span>
        <span className={`value ${isLowTime ? 'low-time' : ''}`}>{value}</span>
      </div>
    </div>
  );
};

export default StatCard;

