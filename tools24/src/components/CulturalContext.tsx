interface CulturalContextProps {
  text: string;
}

export function CulturalContext({ text }: CulturalContextProps): React.ReactElement {
  return (
    <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-sm text-slate-300">
      <p className="font-medium text-slate-200 mb-1">About this tool</p>
      <p>{text}</p>
    </div>
  );
}
