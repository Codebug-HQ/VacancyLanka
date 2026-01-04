'use client';

import React from 'react';

export default function Map({ src }: { src: string }) {
  return (
    <div className="w-full h-full min-h-[300px] relative group">
      <div className="absolute inset-0 border-[8px] border-white/10 pointer-events-none z-10 rounded-[2.5rem]" />
      <iframe
        src={src}
        className="w-full h-full grayscale-[0.2] contrast-[1.1] brightness-[0.9] hover:grayscale-0 transition-all duration-700"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Office Location"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none" />
    </div>
  );
}