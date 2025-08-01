'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataSourceInfo } from '@/types/data-source-info';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { ConnectDataSourceFormData } from '@/types/connect-data-source-form';
import { Input } from '@/components/ui/input';

export function ConnectDataSourceButton({
  availableDataSources,
  action,
}: {
  availableDataSources: DataSourceInfo[];
  action: (data: ConnectDataSourceFormData) => Promise<{
    success: boolean;
    error?: string;
  }>;
}) {
  const [selectedDataSource, setSelectedDataSource] =
    useState<DataSourceInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [pending, startTransition] = useTransition();
  const form = useForm();

  const handleDataSourceSelect = (dataSource: DataSourceInfo) => {
    setSelectedDataSource(dataSource);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDataSource(null);
    form.reset();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            Connect
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {availableDataSources.map((dataSource) => (
            <DropdownMenuItem
              key={dataSource.type}
              onClick={() => handleDataSourceSelect(dataSource)}
              className="cursor-pointer"
            >
              {dataSource.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          {selectedDataSource && (
            <>
              <DialogHeader>
                <DialogTitle>Connect {selectedDataSource.name}</DialogTitle>
                <DialogDescription>
                  {selectedDataSource.description}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(async (data) => {
                    startTransition(async () => {
                      const result = await action({
                        type: selectedDataSource.type,
                        credentials: data,
                      });
                      if (result.success) {
                        handleCloseModal();
                      } else {
                        form.setError('root', {
                          message: result.error ?? 'Unknown error',
                        });
                      }
                    });
                  })}
                >
                  {selectedDataSource.fields.map((dataSourceField) => (
                    <FormField
                      key={dataSourceField.name}
                      control={form.control}
                      name={dataSourceField.name}
                      rules={{
                        required: dataSourceField.isRequired
                          ? `${dataSourceField.name} is required`
                          : false,
                      }}
                      defaultValue={''}
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

                  <DialogFooter>
                    <Button type="submit" disabled={pending}>
                      {pending ? 'Connecting...' : 'Connect'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
