import { ContextWorkingCopyDiff } from '@contexthub/context-repository';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type TableContext = ContextWorkingCopyDiff['table']['added'][number];
type ColumnContext = ContextWorkingCopyDiff['column']['added'][number];
type Metric = ContextWorkingCopyDiff['metric']['added'][number];
type Concept = ContextWorkingCopyDiff['concept']['added'][number];

export function ContextDiffDisplay({ diff }: { diff: ContextWorkingCopyDiff }) {
  const hasAnyChanges =
    hasChanges(diff.table) ||
    hasChanges(diff.column) ||
    hasChanges(diff.metric) ||
    hasChanges(diff.concept);

  if (!hasAnyChanges) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">No changes</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          The agent did not propose any changes.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <EntitySection
        entityLabel="Tables"
        entityKey={getTableKey}
        changes={diff.table}
        toDisplay={tableToDisplay}
      />
      <EntitySection
        entityLabel="Columns"
        entityKey={getColumnKey}
        changes={diff.column}
        toDisplay={columnToDisplay}
      />
      <EntitySection
        entityLabel="Metrics"
        entityKey={getMetricKey}
        changes={diff.metric}
        toDisplay={metricToDisplay}
      />
      <EntitySection
        entityLabel="Concepts"
        entityKey={getConceptKey}
        changes={diff.concept}
        toDisplay={conceptToDisplay}
      />
    </div>
  );
}

function hasChanges<T>(c: ContextWorkingCopyDiff['table'] | any): boolean {
  return (
    (c.added && c.added.length > 0) ||
    (c.removed && c.removed.length > 0) ||
    (c.modified && c.modified.length > 0)
  );
}

function EntitySection<
  T extends TableContext | ColumnContext | Metric | Concept,
>(props: {
  entityLabel: string;
  entityKey: (t: T) => string;
  changes: {
    added: T[];
    removed: T[];
    modified: Array<{ before: T; after: T }>;
  };
  toDisplay: (t: T) => Record<string, string>;
}) {
  const { entityLabel, entityKey, changes, toDisplay } = props;
  if (!hasChanges(changes)) return null;

  const totalCount =
    changes.added.length + changes.removed.length + changes.modified.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{entityLabel}</CardTitle>
        <div className="flex items-center gap-2">
          {changes.added.length > 0 && (
            <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
              +{changes.added.length} added
            </Badge>
          )}
          {changes.removed.length > 0 && (
            <Badge variant="destructive">
              -{changes.removed.length} removed
            </Badge>
          )}
          {changes.modified.length > 0 && (
            <Badge variant="secondary">
              {changes.modified.length} modified
            </Badge>
          )}
          <Badge variant="outline">{totalCount} total</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {changes.added.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium">Added</div>
            <div className="flex flex-col divide-y rounded-md border">
              {changes.added.map((item, idx) => (
                <div key={`${entityKey(item)}:added:${idx}`} className="p-3">
                  <ItemTitle title={entityKey(item)} />
                  <ItemFields fields={toDisplay(item)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {changes.removed.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium">Removed</div>
            <div className="flex flex-col divide-y rounded-md border">
              {changes.removed.map((item, idx) => (
                <div
                  key={`${entityKey(item)}:removed:${idx}`}
                  className="p-3 opacity-70"
                >
                  <ItemTitle title={entityKey(item)} />
                  <ItemFields fields={toDisplay(item)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {changes.modified.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium">Modified</div>
            <div className="flex flex-col gap-3">
              {changes.modified.map(({ before, after }, idx) => {
                const key = entityKey(after);
                const beforeDisplay = toDisplay(before);
                const afterDisplay = toDisplay(after);
                const changedKeys = Object.keys(afterDisplay).filter(
                  (k) => (beforeDisplay[k] ?? '') !== (afterDisplay[k] ?? '')
                );

                return (
                  <div
                    key={`${key}:modified:${idx}`}
                    className="rounded-md border"
                  >
                    <div className="flex items-center justify-between p-3">
                      <ItemTitle title={key} />
                      <Badge variant="secondary">
                        {changedKeys.length} field
                        {changedKeys.length === 1 ? '' : 's'} changed
                      </Badge>
                    </div>
                    <Separator />
                    <div className="grid gap-0 md:grid-cols-2">
                      <div className="p-3">
                        <div className="text-muted-foreground mb-2 text-xs font-medium uppercase">
                          Before
                        </div>
                        <ItemFields
                          fields={beforeDisplay}
                          highlightKeys={changedKeys}
                          variant="before"
                        />
                      </div>
                      <Separator className="md:hidden" />
                      <div className="p-3">
                        <div className="text-muted-foreground mb-2 text-xs font-medium uppercase">
                          After
                        </div>
                        <ItemFields
                          fields={afterDisplay}
                          highlightKeys={changedKeys}
                          variant="after"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ItemTitle({ title }: { title: string }) {
  return <div className="text-sm font-medium">{title}</div>;
}

function ItemFields({
  fields,
  highlightKeys = [],
  variant,
}: {
  fields: Record<string, string>;
  highlightKeys?: string[];
  variant?: 'before' | 'after';
}) {
  const entries = Object.entries(fields);
  if (entries.length === 0) return null;

  return (
    <div className="mt-1 flex flex-col gap-1">
      {entries.map(([label, value]) => {
        const isChanged = highlightKeys.includes(label);
        const base = 'rounded-md border px-2 py-1 text-xs';
        const changed =
          variant === 'before'
            ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/20'
            : 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20';
        const className = isChanged
          ? `${base} ${changed}`
          : 'text-xs text-muted-foreground';
        return (
          <div key={label} className="grid grid-cols-3 items-start gap-2">
            <div className="text-muted-foreground col-span-1 text-[11px] uppercase tracking-wide">
              {label}
            </div>
            <div className="col-span-2">
              <div className={className}>{value || '—'}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function tableToDisplay(t: TableContext): Record<string, string> {
  return {
    Connection: t.dataSourceConnectionId,
    Table: t.fullyQualifiedTableName,
    Description: t.description ?? '',
  };
}

function columnToDisplay(c: ColumnContext): Record<string, string> {
  return {
    Connection: c.dataSourceConnectionId,
    Table: c.fullyQualifiedTableName,
    Column: c.columnName,
    Description: c.description ?? '',
    'Example values': c.exampleValues?.join(', ') ?? '',
  };
}

function metricToDisplay(m: Metric): Record<string, string> {
  return {
    Name: m.name,
    Description: m.description ?? '',
    Formula: m.formula ?? '',
    Tags: m.tags?.join(', ') ?? '',
    'Example queries': m.exampleQueries?.join('\n') ?? '',
    Unit: m.unitOfMeasure ?? '',
    Id: m.id,
  };
}

function conceptToDisplay(c: Concept): Record<string, string> {
  return {
    Name: c.name,
    Description: c.description ?? '',
    Synonyms: c.synonyms?.join(', ') ?? '',
    Tags: c.tags?.join(', ') ?? '',
    'Example values': c.exampleValues?.join(', ') ?? '',
    Id: c.id,
  };
}

function getTableKey(t: TableContext): string {
  return `${t.dataSourceConnectionId} • ${t.fullyQualifiedTableName}`;
}

function getColumnKey(c: ColumnContext): string {
  return `${c.dataSourceConnectionId} • ${c.fullyQualifiedTableName} • ${c.columnName}`;
}

function getMetricKey(m: Metric): string {
  return m.name || m.id;
}

function getConceptKey(c: Concept): string {
  return c.name || c.id;
}
