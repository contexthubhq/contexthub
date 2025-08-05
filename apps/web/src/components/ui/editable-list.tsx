import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EditableListProps {
  values: string[];
  setValues: (values: string[]) => void;
  placeholder?: string;
  allowDuplicates?: boolean;
}

export function EditableList({
  values,
  setValues,
  placeholder = 'New value',
  allowDuplicates = false,
}: EditableListProps) {
  const [newValue, setNewValue] = useState<string>('');

  const addValue = () => {
    const trimmed = newValue.trim();
    if (!trimmed) return;

    if (allowDuplicates || !values.includes(trimmed)) {
      setValues([...values, trimmed]);
      setNewValue('');
    }
  };

  const removeValue = (valueToRemove: string) => {
    setValues(values.filter((v) => v !== valueToRemove));
  };

  return (
    <div className="flex flex-col gap-4">
      {values.length > 0 && (
        <div className="flex max-h-[12rem] flex-col gap-2 overflow-auto">
          {values.map((v, index) => (
            <div
              key={`${v}-${index}`}
              className="flex items-center justify-between gap-2 rounded border px-2 py-1 text-sm"
            >
              <span className="truncate">{v}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0"
                onClick={() => removeValue(v)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addValue();
            }
          }}
        />
        <Button size="sm" onClick={addValue} disabled={!newValue.trim()}>
          Add
        </Button>
      </div>
    </div>
  );
}
