'use client';
import { useEffect, useState } from 'react';
import { Team, TeamMember } from '@/lib/types';

interface TeamContext {
  team: Team | null;
  myMember: TeamMember | null;
  isOwner: boolean;
  loading: boolean;
}

export function useTeam(): TeamContext {
  const [team, setTeam] = useState<Team | null>(null);
  const [myMember, setMyMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/team')
      .then(r => r.ok ? r.json() : { team: null, myMember: null })
      .then(data => {
        setTeam(data.team ?? null);
        setMyMember(data.myMember ?? null);
      })
      .catch(() => {
        setTeam(null);
        setMyMember(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    team,
    myMember,
    isOwner: myMember?.role === 'owner',
    loading,
  };
}
