/*
  Archived homepage. Preserved so the previous design stays reachable and
  reviewable at /legacy while the new homepage is built at /.
*/
export default function LegacyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-paper-alt text-ink">
      <div className="mx-2 my-2 sm:mx-4 sm:my-4">
        <div className="flex min-h-[calc(100vh-2rem)] flex-col">{children}</div>
      </div>
    </div>
  );
}
