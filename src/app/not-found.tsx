import Link from "next/link";

export default function NotFound(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-kinari">
      <h1 className="font-sora font-semibold text-[22px] text-sumi tracking-tight">
        404
      </h1>
      <p className="mt-2 text-[13px] text-fude">
        \u30da\u30fc\u30b8\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093
      </p>
      <Link
        href="/tools/agent-card"
        className="mt-6 px-4 py-2 bg-sumi text-kinari font-sora text-[12px] font-medium rounded-[4px] hover:bg-sumi-light transition-colors"
      >
        \u30c8\u30c3\u30d7\u3078\u623b\u308b
      </Link>
    </div>
  );
}
