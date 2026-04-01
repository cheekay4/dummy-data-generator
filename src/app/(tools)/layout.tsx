import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <Header breadcrumb="generator" />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
