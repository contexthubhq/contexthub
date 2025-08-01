import React from 'react';
import type { DataSourceInfo } from '@/types/data-source-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';

export function DataSourceCredentialsForm({
  dataSource,
  onClose,
}: {
  dataSource: DataSourceInfo;
  onClose?: () => void;
}) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    // TODO: Replace with actual API call to save credentials
    console.log('Saving credentials:', data);
    alert(
      `Credentials saved for ${dataSource.name}!\n\n${JSON.stringify(
        data,
        null,
        2
      )}`
    );

    onClose?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {dataSource.description && (
        <p className="text-muted-foreground text-sm">
          {dataSource.description}
        </p>
      )}

      {dataSource.fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.description || field.name}
            {field.isRequired && (
              <span className="text-destructive ml-1">*</span>
            )}
          </Label>
          <Input
            id={field.name}
            name={field.name}
            type={'text'}
            required={field.isRequired}
            placeholder={`Enter ${field.description || field.name}`}
          />
        </div>
      ))}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Configuration</Button>
      </DialogFooter>
    </form>
  );
}
