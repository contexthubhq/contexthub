import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Props = React.ComponentProps<typeof Card> & {
  name: string;
  description: string;
  icon: React.ReactNode;
};

export const ContextSourceConnectorCard = React.forwardRef<
  React.ElementRef<typeof Card>,
  Props
>(({ name, description, icon, className, ...props }, ref) => {
  return (
    <Card
      ref={ref}
      className={cn(
        'flex cursor-pointer flex-row items-center gap-3 p-4',
        className
      )}
      {...props}
    >
      <div className="rounded-lg border p-2">{icon}</div>
      <div className="flex flex-col">
        <h2 className="text-sm font-semibold">{name}</h2>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
    </Card>
  );
});
ContextSourceConnectorCard.displayName = 'ContextSourceConnectorCard';
