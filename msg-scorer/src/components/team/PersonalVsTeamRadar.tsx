import dynamic from 'next/dynamic';

const PersonalVsTeamRadarChart = dynamic(() => import('./PersonalVsTeamRadarChart'), { ssr: false });

interface AxisData {
  name: string;
  personal: number;
  team: number;
}

export default function PersonalVsTeamRadar({ data }: { data: AxisData[] }) {
  return <PersonalVsTeamRadarChart data={data} />;
}
