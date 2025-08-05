'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

type LocalFormInputs = Omit<ConnectDataSourceFormData, 'type'>;

import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface ConnectionFormProps {
  dataSource: DataSourceInfo;
  onSubmit: (data: ConnectDataSourceFormData) => void | Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitButtonText?: string;
  loadingText?: string;
}

/**
 * The form to connect a data source.
 */
export function ConnectDataSourceSheet({
  dataSource,
  onSubmit,
  open,
  onOpenChange,
  submitButtonText = 'Connect',
  loadingText = 'Connecting...',
}: ConnectionFormProps) {
  // Build a dynamic zod schema based on the required fields coming from the backend
  const credentialFieldSchema = dataSource.fields.reduce(
    (acc, field) => {
      acc[field.name] = field.isRequired
        ? z.string().nonempty(`${field.name} is required`)
        : z.string().optional();
      return acc;
    },
    {} as Record<string, z.ZodTypeAny>
  );

  const connectDataSourceSchema = z.object({
    name: z.string().nonempty('Name is required'),
    credentials: z.object(credentialFieldSchema),
  });

  // Initialize all credential fields with empty strings to prevent controlled/uncontrolled issues
  const initialCredentials = dataSource.fields.reduce(
    (acc, field) => {
      acc[field.name] = '';
      return acc;
    },
    {} as Record<string, string>
  );
  const defaultValues: LocalFormInputs = {
    name: '',
    credentials: initialCredentials,
  };

  const form = useForm<LocalFormInputs>({
    resolver: zodResolver(connectDataSourceSchema),
    mode: 'onChange',
    defaultValues,
  });

  const handleSubmit = (data: LocalFormInputs) => {
    // Returning the promise (if any) ensures `isSubmitting` is accurate in RHF state
    return onSubmit({
      ...data,
      type: dataSource.type,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="contents">
            <SheetHeader>
              <SheetTitle>Connect {dataSource.name}</SheetTitle>
            </SheetHeader>
            <SheetBody>
              <div className="pb-4">
                <FormField
                  control={form.control}
                  name="name"
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required={dataSourceField.isRequired}>
                          {dataSourceField.name}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type={
                              /password|secret|token|key/i.test(
                                dataSourceField.name
                              )
                                ? 'password'
                                : 'text'
                            }
                            placeholder={dataSourceField.description ?? ''}
                          />
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
            </SheetBody>
            <SheetFooter>
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset(defaultValues)}
                >
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
              >
                {form.formState.isSubmitting ? loadingText : submitButtonText}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
