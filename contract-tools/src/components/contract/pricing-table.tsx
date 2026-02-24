import { Check, X } from 'lucide-react';

const FEATURES = [
  { label: '分析回数', free: '2件/月', pro: '無制限' },
  { label: 'リスク検出', free: true, pro: true },
  { label: '改善案提示', free: true, pro: true },
  { label: '条項対照表', free: true, pro: true },
  { label: 'PDF読み込み', free: false, pro: true },
  { label: '分析履歴保存', free: false, pro: true },
  { label: '広告', free: 'あり', pro: 'なし' },
];

function Val({ v }: { v: boolean | string }) {
  if (typeof v === 'boolean') {
    return v ? (
      <Check className="h-4 w-4 text-green-500 mx-auto" />
    ) : (
      <X className="h-4 w-4 text-muted-foreground mx-auto" />
    );
  }
  return <span>{v}</span>;
}

export function PricingTable() {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50">
            <th className="px-4 py-3 text-left font-medium"></th>
            <th className="px-4 py-3 text-center font-medium">Free</th>
            <th className="px-4 py-3 text-center font-medium text-primary">Pro</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-4 py-3 font-medium text-muted-foreground">月額</td>
            <td className="px-4 py-3 text-center">0円</td>
            <td className="px-4 py-3 text-center font-semibold text-primary">490円</td>
          </tr>
          {FEATURES.map((f) => (
            <tr key={f.label} className="border-t">
              <td className="px-4 py-3 text-muted-foreground">{f.label}</td>
              <td className="px-4 py-3 text-center"><Val v={f.free} /></td>
              <td className="px-4 py-3 text-center"><Val v={f.pro} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
