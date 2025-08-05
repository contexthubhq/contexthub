import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EditableList } from '@/components/ui/editable-list';
import { MetricDefinition, metricDefinitionSchema } from '@contexthub/core';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

const metricDefinitionSchemaWithoutId = metricDefinitionSchema.omit({
  id: true,
});

type MetricDefinitionWithoutId = z.infer<
  typeof metricDefinitionSchemaWithoutId
>;

export function MetricSheet({
  metric,
  onSubmit,
  open,
  onOpenChange,
}: {
  metric?: MetricDefinition;
  onSubmit: (data: MetricDefinitionWithoutId) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const title = metric ? 'Edit Metric' : 'Create Metric';

  const form = useForm<MetricDefinitionWithoutId>({
    resolver: zodResolver(metricDefinitionSchemaWithoutId),
    defaultValues: {
      name: metric?.name ?? '',
      description: metric?.description ?? null,
      formula: metric?.formula ?? null,
      tags: metric?.tags ?? [],
      exampleQueries: metric?.exampleQueries ?? [],
      unitOfMeasure: metric?.unitOfMeasure ?? null,
    },
  });

  useEffect(() => {
    if (metric) {
      form.reset(metric);
    }
  }, [metric, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-h-screen overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 py-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="formula"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Formula</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <EditableList
                        values={field.value}
                        setValues={field.onChange}
                        placeholder="Add a tag"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="exampleQueries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Example Queries</FormLabel>
                    <FormControl>
                      <EditableList
                        values={field.value}
                        setValues={field.onChange}
                        placeholder="Add a query"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unitOfMeasure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit of Measure</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  !form.formState.isDirty ||
                  !form.formState.isValid
                }
              >
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
