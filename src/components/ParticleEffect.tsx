import React from 'react';
import { FloatingNotification } from '../types';

interface ParticleEffectProps {
  notifications: FloatingNotification[];
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({ notifications }) => {
  return (
    <>
      {/* Floating Ambient Green Embers / Spooky Spores */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-15">
        <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-emerald-300 rounded-full blur-[0.5px] animate-ping opacity-60 duration-3000" />
        <div className="absolute top-[35%] right-[20%] w-2 h-2 bg-yellow-200 rounded-full blur-[1px] animate-pulse opacity-70" />
        <div className="absolute top-[60%] left-[25%] w-1.5 h-1.5 bg-emerald-400 rounded-full blur-[0.5px] animate-ping opacity-50 duration-2000" />
        <div className="absolute top-[75%] right-[15%] w-2 h-2 bg-emerald-300 rounded-full blur-[1px] animate-pulse opacity-60" />
        <div className="absolute top-[10%] left-[60%] w-1 h-1 bg-yellow-100 rounded-full opacity-80" />
      </div>

      {/* Floating Text Notifications (Battle / Upgrade Popups) */}
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="absolute font-lilita text-base tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-floatUpFade"
            style={{
              left: `${notif.x}%`,
              top: `${notif.y}%`,
              color:
                notif.type === 'health'
                  ? '#4ADE80'
                  : notif.type === 'sword'
                  ? '#38BDF8'
                  : notif.type === 'coin'
                  ? '#FDE047'
                  : '#EF4444',
            }}
          >
            {notif.text}
          </div>
        ))}
      </div>
    </>
  );
};
