import { hydrateRoot } from 'react-dom/client';
import { ThreatHuntingProcess, SecurityClarity, HeroGlobe } from '@/components/homepage-islands';

const globe = document.querySelector('#hero-globe-root');
if (globe) hydrateRoot(globe, <HeroGlobe />);

const process = document.querySelector('#threat-hunting-root');
if (process) hydrateRoot(process, <ThreatHuntingProcess />);

const clarity = document.querySelector('#security-clarity-root');
if (clarity) hydrateRoot(clarity, <SecurityClarity />);
