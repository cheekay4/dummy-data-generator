interface Props {
  ngWordsFound: string[];
}

export default function NGWordWarning({ ngWordsFound }: Props) {
  if (ngWordsFound.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <span className="text-amber-500 text-lg mt-0.5">⚠️</span>
        <div>
          <p className="text-sm font-semibold text-amber-800 mb-1">景表法リスクワードが含まれています</p>
          <div className="flex flex-wrap gap-1.5">
            {ngWordsFound.map((word) => (
              <span key={word} className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-md border border-amber-200">
                {word}
              </span>
            ))}
          </div>
          <p className="text-xs text-amber-600 mt-2">
            これらの表現は不当景品類及び不当表示防止法（景表法）に抵触するリスクがあります。法務確認を推奨します。
          </p>
        </div>
      </div>
    </div>
  );
}
