import React from 'react';

export const Logo1 = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 5L20 25H5L12.5 5Z" fill="currentColor"/>
    <path d="M22 15L25 25H19L22 15Z" fill="currentColor"/>
    <text x="35" y="20" fill="currentColor" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="16" letterSpacing="1">ALRAJHI</text>
  </svg>
);

export const Logo2 = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="15" cy="15" r="10" fill="currentColor"/>
    <circle cx="15" cy="15" r="5" fill="white"/>
    <text x="35" y="20" fill="currentColor" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="15" letterSpacing="0.5">AL-FOUZAN</text>
  </svg>
);

export const Logo3 = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="20" height="20" rx="4" fill="currentColor"/>
    <path d="M15 10V20M10 15H20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <text x="35" y="21" fill="currentColor" fontFamily="Georgia, serif" fontWeight="bold" fontSize="14">Logistics Co.</text>
  </svg>
);

export const Logo4 = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 25L15 5L25 25H5Z" stroke="currentColor" strokeWidth="3" fill="none"/>
    <path d="M10 20L15 10L20 20" stroke="currentColor" strokeWidth="3" fill="none"/>
    <text x="35" y="21" fill="currentColor" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="14">South Housing</text>
  </svg>
);

export const Logo5 = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 105 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 5L25 15L15 25L5 15L15 5Z" fill="currentColor"/>
    <text x="35" y="21" fill="currentColor" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="14" fontStyle="italic">Tatweer</text>
  </svg>
);
