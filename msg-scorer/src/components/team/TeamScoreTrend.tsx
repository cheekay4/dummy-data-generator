import dynamic from 'next/dynamic';

const TeamScoreTrendChart = dynamic(() => import('./TeamScoreTrendChart'), { ssr: false });

interface DataPoint {
  date: string;
  [key: string]: string | number;
}

interface Props {
  data: DataPoint[];
  memberEmails: string[];
  minThreshold?: number;
}

export default function TeamScoreTrend(props: Props) {
  return <TeamScoreTrendChart {...props} />;
}
