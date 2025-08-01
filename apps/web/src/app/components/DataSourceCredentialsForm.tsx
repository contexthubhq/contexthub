import React, { useState } from 'react';
import type { DataSourceInfo } from '../common/data-source-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { createDataSourceCredentialsAction } from '../actions/create-data-source-credentials';

export function DataSourceCredentialsForm({
  dataSource,
  onClose,
}: {
  dataSource: DataSourceInfo;
  onClose?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.target as HTMLFormElement);
      const credentials = Object.fromEntries(formData.entries()) as Record<
        string,
        string
      >;

      const result = await createDataSourceCredentialsAction({
        type: dataSource.type,
        credentials,
      });

      if (result.success) {
        onClose?.();
      } else {
        setError(result.error || 'Failed to save credentials');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {dataSource.description && (
        <p className="text-muted-foreground text-sm">
          {dataSource.description}
        </p>
      )}

      {error && (
        <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
          {error}
        </div>
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
            disabled={isSubmitting}
          />
        </div>
      ))}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Configuration'}
        </Button>
      </DialogFooter>
    </form>
  );
}
