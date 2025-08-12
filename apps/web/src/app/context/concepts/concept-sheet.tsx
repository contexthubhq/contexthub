import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EditableList } from '@/components/ui/editable-list';
import { Concept, NewConcept, newConceptSchema } from '@contexthub/core';
import {
  Sheet,
  SheetBody,
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

type ConceptSheetProps = (
  | {
      concept: Concept;
      onSubmit: (data: Concept) => void | Promise<void>;
    }
  | {
      concept: null;
      onSubmit: (data: NewConcept) => void | Promise<void>;
    }
) & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ConceptSheet({
  concept,
  onSubmit,
  open,
  onOpenChange,
}: ConceptSheetProps) {
  const title = concept ? 'Edit Concept' : 'Create Concept';

  const form = useForm<NewConcept>({
    resolver: zodResolver(newConceptSchema),
    mode: 'onChange',
    defaultValues: {
      name: concept?.name ?? '',
      description: concept?.description ?? null,
      synonyms: concept?.synonyms ?? [],
      tags: concept?.tags ?? [],
      exampleValues: concept?.exampleValues ?? [],
    },
  });

  useEffect(() => {
    if (concept) {
      form.reset(concept);
    }
  }, [concept, form]);

  const handleSubmit = (data: NewConcept | Concept) => {
    if (concept) {
      onSubmit({ ...concept, ...data });
    } else {
      onSubmit(data);
    }
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="contents">
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
            </SheetHeader>
            <SheetBody>
              <div className="flex flex-col gap-4">
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
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="synonyms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Synonyms</FormLabel>
                      <FormControl>
                        <EditableList
                          values={field.value}
                          setValues={field.onChange}
                          placeholder="Add a synonym"
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
                  name="exampleValues"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Example Values</FormLabel>
                      <FormControl>
                        <EditableList
                          values={field.value}
                          setValues={field.onChange}
                          placeholder="Add an example value"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </SheetBody>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline" onClick={() => form.reset()}>
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  !form.formState.isValid ||
                  !form.formState.isDirty
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
