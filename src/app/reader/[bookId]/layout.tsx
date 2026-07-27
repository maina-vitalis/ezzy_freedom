export default function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">{children}</div>
  );
}
