'use client';
import dynamic from 'next/dynamic';

const ScoringWorkspace = dynamic(
  () => import('./ScoringWorkspace'),
  { ssr: false }
);

export default ScoringWorkspace;
