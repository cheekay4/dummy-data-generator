// Root layout — minimal shell required by Next.js App Router.
// All locale-aware content (lang, ThemeProvider, Header/Footer) is in [locale]/layout.tsx.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
