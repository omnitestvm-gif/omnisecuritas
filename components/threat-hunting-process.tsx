import HowItWorks, { type Step } from '@/components/ui/how-it-works';

const gold = { bg: 'bg-[#fff5e6]', text: 'text-[#946322]', border: 'border-[#eed9b6]' };
const slate = { bg: 'bg-[#edf2f4]', text: 'text-[#3f5968]', border: 'border-[#d8e3e8]' };

export const THREAT_HUNTING_STEPS: Step[] = [
  {
    title: 'Identify',
    description:
      'Understand business-critical assets, endpoint activity, and priority risks to focus our investigation.',
    colors: gold,
  },
  {
    title: 'Protect',
    description:
      'Strengthen endpoint defenses and security practices that help reduce your organization’s exposure.',
    colors: slate,
  },
  {
    title: 'Detect',
    description:
      'Hunt for suspicious behavior and investigate relevant endpoint signals with analyst context.',
    colors: gold,
  },
  {
    title: 'Respond',
    description:
      'Coordinate investigation, escalation, and appropriate response within agreed permissions.',
    colors: slate,
  },
  {
    title: 'Recover',
    description:
      'Review incident findings, support recovery planning, and recommend improvements for resilience.',
    colors: gold,
  },
];

export default function ThreatHuntingProcess() {
  return (
    <HowItWorks
      features={THREAT_HUNTING_STEPS}
      className="threat-hunting-component"
      desktopHeight={1000}
    />
  );
}
