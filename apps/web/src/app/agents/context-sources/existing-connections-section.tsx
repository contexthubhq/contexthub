'use client';

import { Card } from '@/components/ui/card';
import { ContextSourceConnection } from '@contexthub/context-sources-connections';

export function ExistingConnectionsSection({
  connections,
}: {
  connections: ContextSourceConnection[];
}) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <h2 className="col-span-4 text-lg font-semibold">Enabled sources</h2>
      <div>
        {connections.map((connection) => (
          <Card key={connection.id}>
            <div className="flex flex-col p-4">
              <h2 className="text-sm font-semibold">{connection.name}</h2>
              <p className="text-muted-foreground text-xs">
                Type: {connection.type}, Created:{' '}
                {connection.createdAt.toLocaleDateString()}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
