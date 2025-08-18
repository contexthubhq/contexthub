import { Inbox } from 'lucide-react';
import { Card } from './ui/card';

export function EmptySection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-dashed p-10">
      <Card>
        <div className="p-3">
          <Inbox className="size-6" />
        </div>
      </Card>
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-xl font-medium">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      {children}
    </div>
  );
}
