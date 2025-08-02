export function PageHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header>
      <div className="flex w-full items-center justify-between py-6">
        <h1 className="text-2xl font-medium">{title}</h1>
        {children}
      </div>
    </header>
  );
}
