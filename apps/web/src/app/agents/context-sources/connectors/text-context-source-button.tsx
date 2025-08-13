'use client';

import { ContextSourceConnectorCard } from '@/components/context-sources/context-source-connector-card';
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
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { ConnectContextSourceFormData } from '@/types/connect-context-source-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Type } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useState } from 'react';

const textContextSourceSchema = z.object({
  name: z.string().nonempty('Name is required'),
  text: z.string().nonempty('Text is required'),
  description: z.string().optional(),
});

type TextContextSourceFormData = z.infer<typeof textContextSourceSchema>;

export function TextContextSourceButton({
  onSubmit,
}: {
  onSubmit: (data: ConnectContextSourceFormData) => Promise<{
    success: boolean;
    error?: string;
  }>;
}) {
  const form = useForm<TextContextSourceFormData>({
    resolver: zodResolver(textContextSourceSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      text: '',
      description: '',
    },
  });

  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: TextContextSourceFormData) => {
    try {
      const configuration: Record<string, string> = {
        text: data.text,
      };
      if (data.description) {
        configuration.description = data.description;
      }
      const result = await onSubmit({
        type: 'text',
        name: data.name,
        configuration,
      });
      if (result.success) {
        toast.success('Added');
        form.reset();
        setOpen(false);
      } else {
        toast.error(result.error ?? 'Failed to add');
      }
    } catch (error) {
      toast.error('Failed to add');
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          form.reset();
        }
      }}
    >
      <SheetTrigger asChild>
        <ContextSourceConnectorCard
          name="Text"
          description="Write or paste text, such as code or documentation."
          icon={<Type className="size-4" />}
        />
      </SheetTrigger>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="contents">
            <SheetHeader>
              <SheetTitle>Add text context source</SheetTitle>
            </SheetHeader>
            <SheetBody className="gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      The name you want to use to identify this context source.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Text</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={10}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      For example code or documentation.
                    </FormDescription>
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
                        rows={3}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Description of what this text is about.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </SheetBody>
            <SheetFooter>
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                {form.formState.isSubmitting ? 'Adding...' : 'Add'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
