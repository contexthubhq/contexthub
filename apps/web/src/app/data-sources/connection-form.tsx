'use client';

import { useForm } from 'react-hook-form';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DataSourceInfo } from '@/types/data-source-info';
import { ConnectDataSourceFormData } from '@/types/connect-data-source-form';

interface ConnectionFormProps {
  dataSource: DataSourceInfo;
  action: (data: ConnectDataSourceFormData) => Promise<{
    success: boolean;
    error?: string;
  }>;
  onSuccess?: () => void;
  onCancel?: () => void;
  submitButtonText?: string;
  loadingText?: string;
  initialData?: Partial<ConnectDataSourceFormData>;
  showCancelButton?: boolean;
}

export function ConnectionForm({
  dataSource,
  action,
  onSuccess,
  onCancel,
  submitButtonText = 'Connect',
  loadingText = 'Connecting...',
  initialData,
  showCancelButton = true,
}: ConnectionFormProps) {
  const [pending, startTransition] = useTransition();

  // Initialize all credential fields with empty strings to prevent controlled/uncontrolled issues
  const initialCredentials = dataSource.fields.reduce((acc, field) => {
    acc[field.name] = initialData?.credentials?.[field.name] || '';
    return acc;
  }, {} as Record<string, string>);

  const form = useForm<ConnectDataSourceFormData>({
    defaultValues: {
      name: initialData?.name || '',
      credentials: initialCredentials,
    },
  });

  const handleSubmit = async (data: ConnectDataSourceFormData) => {
    startTransition(async () => {
      const result = await action({
        type: dataSource.type,
        name: data.name,
        credentials: data.credentials,
      });
      if (result.success) {
        onSuccess?.();
      } else {
        form.setError('root', {
          message: result.error ?? 'Unknown error',
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="pb-4">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: true }}
            render={({ field }) => (
              <div className="pb-4">
                <FormItem>
                  <FormLabel required>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The name you want to use to identify this data source
                    connection.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
          {dataSource.fields.map((dataSourceField) => (
            <FormField
              key={dataSourceField.name}
              control={form.control}
              name={`credentials.${dataSourceField.name}`}
              rules={{ required: dataSourceField.isRequired }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required={dataSourceField.isRequired}>
                    {dataSourceField.name}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    {dataSourceField.description ?? ''}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {form.formState.errors.root && (
            <p className="text-destructive text-[0.8rem] font-medium">
              {form.formState.errors.root.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          {showCancelButton && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? loadingText : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
