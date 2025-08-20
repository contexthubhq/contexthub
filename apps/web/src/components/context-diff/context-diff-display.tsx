'use client';

import React from 'react';
import type { TableContext, ColumnContext } from '@contexthub/core';
import { ContextWorkingCopyDiff } from '@contexthub/context-repository';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

import {
  Table as TableIcon,
  Columns3,
  Plus,
  Minus,
  GitCompare,
  Info,
  ChevronDown,
} from 'lucide-react';

/* -----------------------------------------------------------------------------------------------
 * Small utils
 * ---------------------------------------------------------------------------------------------*/

type PrimitiveVal = string | null | undefined;
type FieldType = 'text' | 'mono' | 'code' | 'array';

type FieldSpec<T> = {
  key: keyof T;
  label: string;
  type: FieldType;
  /** For arrays: compare as sets (order-insensitive). */
  asSet?: boolean;
};

const isNil = (v: unknown) => v === null || v === undefined;
const toStr = (v: PrimitiveVal) => (isNil(v) ? '' : String(v));

function setsEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const A = new Set(a);
  for (const x of b) if (!A.has(x)) return false;
  return true;
}

function diffArrays(before: string[], after: string[]) {
  const beforeSet = new Set(before);
  const afterSet = new Set(after);
  const added: string[] = [];
  const removed: string[] = [];
  const unchanged: string[] = [];

  for (const v of Array.from(afterSet)) {
    if (!beforeSet.has(v)) added.push(v);
    else unchanged.push(v);
  }
  for (const v of Array.from(beforeSet)) {
    if (!afterSet.has(v)) removed.push(v);
  }

  // Sort for stable UI
  added.sort();
  removed.sort();
  unchanged.sort();
  return { added, removed, unchanged };
}

function fieldChanged(
  type: FieldType,
  before: unknown,
  after: unknown,
  asSet?: boolean
) {
  if (type === 'array') {
    const b = Array.isArray(before) ? (before as string[]) : [];
    const a = Array.isArray(after) ? (after as string[]) : [];
    return asSet ? !setsEqual(b, a) : JSON.stringify(b) !== JSON.stringify(a);
  }
  return (
    toStr(before as PrimitiveVal).trim() !== toStr(after as PrimitiveVal).trim()
  );
}

function countChanges<T>(c: {
  added: T[];
  removed: T[];
  modified: Array<{ before: T; after: T }>;
}) {
  return {
    added: c.added.length,
    removed: c.removed.length,
    modified: c.modified.length,
    total: c.added.length + c.removed.length + c.modified.length,
  };
}

/* -----------------------------------------------------------------------------------------------
 * Field definitions for each entity type
 * ---------------------------------------------------------------------------------------------*/

const tableFields: FieldSpec<TableContext>[] = [
  {
    key: 'dataSourceConnectionId',
    label: 'Data Source Connection ID',
    type: 'mono',
  },
  {
    key: 'fullyQualifiedTableName',
    label: 'Fully Qualified Table Name',
    type: 'mono',
  },
  { key: 'description', label: 'Description', type: 'text' },
];

const columnFields: FieldSpec<ColumnContext>[] = [
  {
    key: 'dataSourceConnectionId',
    label: 'Data Source Connection ID',
    type: 'mono',
  },
  {
    key: 'fullyQualifiedTableName',
    label: 'Fully Qualified Table Name',
    type: 'mono',
  },
  { key: 'columnName', label: 'Column Name', type: 'mono' },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'exampleValues', label: 'Example Values', type: 'array', asSet: true },
];

/* -----------------------------------------------------------------------------------------------
 * Value renderers
 * ---------------------------------------------------------------------------------------------*/

function ValueView({ type, value }: { type: FieldType; value: unknown }) {
  if (type === 'array') {
    const arr = Array.isArray(value) ? (value as string[]) : [];
    if (arr.length === 0)
      return <span className="text-muted-foreground text-xs">—</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {arr.map((v, i) => (
          <Badge
            key={`${v}-${i}`}
            variant="secondary"
            className="text-xs font-normal"
          >
            {v}
          </Badge>
        ))}
      </div>
    );
  }

  const str = toStr(value as PrimitiveVal);
  if (!str) return <span className="text-muted-foreground">—</span>;

  if (type === 'mono') {
    return (
      <code className="bg-muted rounded px-1.5 py-0.5 text-xs">{str}</code>
    );
  }

  if (type === 'code') {
    return (
      <pre className="bg-muted whitespace-pre-wrap break-words rounded p-2 text-xs">
        {str}
      </pre>
    );
  }

  // text
  return <div className="whitespace-pre-wrap break-words text-xs">{str}</div>;
}

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 gap-3 p-2">
      <div className="text-muted-foreground col-span-4 flex items-center text-xs font-medium">
        {label}
      </div>
      <div className="col-span-8">{children}</div>
    </div>
  );
}

/* Modified field: side-by-side before/after */
function FieldRowDiff({
  label,
  type,
  before,
  after,
  asSet,
}: {
  label: string;
  type: FieldType;
  before: unknown;
  after: unknown;
  asSet?: boolean;
}) {
  const content =
    type === 'array'
      ? (() => {
          const b = Array.isArray(before) ? (before as string[]) : [];
          const a = Array.isArray(after) ? (after as string[]) : [];
          const { added, removed, unchanged } = diffArrays(b, a);
          return (
            <div className="flex flex-wrap gap-1">
              {removed.map((x, i) => (
                <Badge
                  key={`rm-${x}-${i}`}
                  variant="destructive"
                  className="font-normal"
                  title="Removed"
                >
                  <Minus className="mr-1 h-3 w-3" />
                  {x}
                </Badge>
              ))}
              {unchanged.map((x, i) => (
                <Badge
                  key={`eq-${x}-${i}`}
                  variant="secondary"
                  className="font-normal"
                >
                  {x}
                </Badge>
              ))}
              {added.map((x, i) => (
                <Badge
                  key={`add-${x}-${i}`}
                  className="bg-emerald-600 font-normal text-white hover:bg-emerald-600/90"
                  title="Added"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  {x}
                </Badge>
              ))}
              {added.length === 0 &&
              removed.length === 0 &&
              unchanged.length === 0 ? (
                <span className="text-muted-foreground">—</span>
              ) : null}
            </div>
          );
        })()
      : (() => {
          const b = toStr(before as PrimitiveVal);
          const a = toStr(after as PrimitiveVal);
          return (
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <div className="text-muted-foreground mb-1 text-xs font-medium">
                  Before
                </div>
                <ValueView type={type} value={b} />
              </div>
              <div>
                <div className="text-muted-foreground mb-1 text-xs font-medium">
                  After
                </div>
                <ValueView type={type} value={a} />
              </div>
            </div>
          );
        })();

  return <FieldRow label={label}>{content}</FieldRow>;
}

/* -----------------------------------------------------------------------------------------------
 * Generic section blocks
 * ---------------------------------------------------------------------------------------------*/

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-muted-foreground flex items-center gap-2 rounded-md border border-dashed p-4 text-sm">
      <Info className="h-4 w-4" />
      {text}
    </div>
  );
}

function SectionShell({
  title,
  count,
  icon,
  children,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="shadow-none">
      <Collapsible defaultOpen={false}>
        <CardHeader>
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center justify-between text-left">
              <span className="flex items-center gap-2 text-sm">
                {icon}
                {title}
              </span>
              <span className="flex items-center gap-2 text-sm">
                <Badge variant="secondary">{count}</Badge>
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent asChild>
          <CardContent className="pt-0">{children}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Per-entity render helpers
 * ---------------------------------------------------------------------------------------------*/

function tableKey(t: TableContext) {
  return `${t.dataSourceConnectionId}::${t.fullyQualifiedTableName}`;
}
function tableTitle(t: TableContext) {
  return t.fullyQualifiedTableName;
}

function columnKey(c: ColumnContext) {
  return `${c.dataSourceConnectionId}::${c.fullyQualifiedTableName}::${c.columnName}`;
}
function columnTitle(c: ColumnContext) {
  return `${c.fullyQualifiedTableName}.${c.columnName}`;
}

/* Simple details renderer used by Added/Removed items */
function DetailsList<T>({
  entity,
  fields,
}: {
  entity: T;
  fields: FieldSpec<T>[];
}) {
  return (
    <div className="divide-y">
      {fields.map((f) => (
        <FieldRow key={String(f.key)} label={f.label}>
          <ValueView type={f.type} value={(entity as any)[f.key]} />
        </FieldRow>
      ))}
    </div>
  );
}

/* Modified details: show only changed fields (nice and focused) */
function ModifiedDetails<T>({
  before,
  after,
  fields,
}: {
  before: T;
  after: T;
  fields: FieldSpec<T>[];
}) {
  const changed = fields.filter((f) =>
    fieldChanged(f.type, (before as any)[f.key], (after as any)[f.key], f.asSet)
  );

  const showing = changed.length > 0 ? changed : fields; // fallback if our detector failed

  return (
    <div className="divide-y">
      {showing.map((f) => (
        <FieldRowDiff
          key={String(f.key)}
          label={f.label}
          type={f.type}
          before={(before as any)[f.key]}
          after={(after as any)[f.key]}
          asSet={f.asSet}
        />
      ))}
    </div>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Entity diff list (generic)
 * ---------------------------------------------------------------------------------------------*/

function EntityDiffList<T>({
  label,
  changes,
  fields,
  getKey,
  getTitle,
}: {
  label: string;
  changes: {
    added: T[];
    removed: T[];
    modified: Array<{ before: T; after: T }>;
  };
  fields: FieldSpec<T>[];
  getKey: (x: T) => string;
  getTitle: (x: T) => string;
}) {
  const totals = countChanges(changes);

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      <div className="flex flex-col gap-3">
        <SectionShell
          title="Added"
          count={totals.added}
          icon={<Plus className="h-4 w-4" />}
        >
          {changes.added.length === 0 ? (
            <EmptyState text={`No ${label.toLowerCase()} were added.`} />
          ) : (
            <div className="space-y-3">
              {changes.added.map((item) => (
                <Card key={getKey(item)} className="shadow-none">
                  <CardHeader>
                    <CardTitle className="flex gap-2 text-xs">
                      {getTitle(item)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DetailsList entity={item} fields={fields} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </SectionShell>

        <SectionShell
          title="Removed"
          count={totals.removed}
          icon={<Minus className="h-4 w-4" />}
        >
          {changes.removed.length === 0 ? (
            <EmptyState text={`No ${label.toLowerCase()} were removed.`} />
          ) : (
            <div className="space-y-3">
              {changes.removed.map((item) => (
                <Card key={getKey(item)} className="shadow-none">
                  <CardHeader>
                    <CardTitle className="flex gap-2 text-xs">
                      {getTitle(item)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DetailsList entity={item} fields={fields} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </SectionShell>

        <SectionShell
          title="Modified"
          count={totals.modified}
          icon={<GitCompare className="h-4 w-4" />}
        >
          {changes.modified.length === 0 ? (
            <EmptyState text={`No ${label.toLowerCase()} were modified.`} />
          ) : (
            <div className="space-y-3">
              {changes.modified.map(({ before, after }) => (
                <Card
                  key={`${getKey(before)}::${getKey(after)}`}
                  className="shadow-none"
                >
                  <CardHeader>
                    <CardTitle className="flex gap-2 text-xs">
                      {getTitle(after)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ModifiedDetails
                      before={before}
                      after={after}
                      fields={fields}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </SectionShell>
      </div>
    </div>
  );
}

export function ContextDiffDisplay({ diff }: { diff: ContextWorkingCopyDiff }) {
  const sections = React.useMemo(() => {
    const t = countChanges(diff.table);
    const c = countChanges(diff.column);
    const defaultTab = t.total > 0 ? 'table' : 'column';

    return {
      totals: { table: t, column: c },
      defaultTab,
    };
  }, [diff]);

  return (
    <Tabs defaultValue={sections.defaultTab}>
      <TabsList>
        <TabsTrigger value="table" className="flex items-center gap-2">
          <TableIcon className="h-4 w-4" /> Tables
          <Badge variant="secondary" className="ml-2">
            {sections.totals.table.total}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="column" className="flex items-center gap-2">
          <Columns3 className="h-4 w-4" /> Columns
          <Badge variant="secondary" className="ml-2">
            {sections.totals.column.total}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="table">
        <EntityDiffList<TableContext>
          label="Tables"
          changes={diff.table}
          fields={tableFields}
          getKey={tableKey}
          getTitle={tableTitle}
        />
      </TabsContent>

      <TabsContent value="column">
        <EntityDiffList<ColumnContext>
          label="Columns"
          changes={diff.column}
          fields={columnFields}
          getKey={columnKey}
          getTitle={columnTitle}
        />
      </TabsContent>
    </Tabs>
  );
}
