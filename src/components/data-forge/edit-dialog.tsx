"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Postcard, postcardSchema, postcardCategories } from '@/lib/schema';
import { validatePostcardData } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';

interface EditDialogProps {
  postcard: Postcard;
  onOpenChange: (open: boolean) => void;
  onSave: (postcard: Postcard) => void;
}

export function EditDialog({ postcard, onOpenChange, onSave }: EditDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [aiError, setAiError] = React.useState<string | null>(null);

  const form = useForm<Postcard>({
    resolver: zodResolver(postcardSchema),
    defaultValues: postcard,
  });

  const onSubmit = async (values: Postcard) => {
    setIsSubmitting(true);
    setAiError(null);
    form.clearErrors();

    const aiValidationResult = await validatePostcardData(values);

    if (!aiValidationResult.isValid) {
      setAiError(aiValidationResult.reasoning);
      aiValidationResult.validationErrors.forEach(errorMsg => {
        // Try to map AI error to a field
        const field = (Object.keys(postcardSchema.shape) as (keyof Postcard)[]).find(key => errorMsg.toLowerCase().includes(key));
        form.setError(field || "root.ai", { message: errorMsg });
      });
      setIsSubmitting(false);
      return;
    }
    
    onSave(values);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Postcard</DialogTitle>
          <DialogDescription>
            Make changes to the postcard details. AI will verify your input.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             {aiError && (
                <Alert variant="destructive">
                    <AlertTitle>AI Validation Failed</AlertTitle>
                    <AlertDescription>{aiError}</AlertDescription>
                </Alert>
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postcard Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Greetings from California" {...field} />
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
                    <Textarea placeholder="Describe the postcard" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {postcardCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g. 1.99" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g. 100" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
