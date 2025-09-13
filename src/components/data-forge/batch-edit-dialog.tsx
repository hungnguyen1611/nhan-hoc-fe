"use client";

import * as React from 'react';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product, productCategories } from '@/lib/schema';

interface BatchEditDialogProps {
  onOpenChange: (open: boolean) => void;
  onBatchUpdate: (field: keyof Product, value: string | number) => void;
}

type EditableField = 'category' | 'price' | 'stock';

export function BatchEditDialog({ onOpenChange, onBatchUpdate }: BatchEditDialogProps) {
  const [field, setField] = React.useState<EditableField>('category');
  const [value, setValue] = React.useState<string>('');

  const handleSave = () => {
    let processedValue: string | number = value;
    if (field === 'price' || field === 'stock') {
      processedValue = Number(value);
      if (isNaN(processedValue)) {
        // Basic validation, should be improved
        alert('Please enter a valid number for price or stock.');
        return;
      }
    }
    onBatchUpdate(field, processedValue);
  };
  
  const renderValueInput = () => {
    switch (field) {
      case 'category':
        return (
          <Select onValueChange={setValue} value={value}>
            <SelectTrigger>
              <SelectValue placeholder="Select new category" />
            </SelectTrigger>
            <SelectContent>
              {productCategories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'price':
        return <Input type="number" step="0.01" value={value} onChange={e => setValue(e.target.value)} placeholder="Enter new price" />;
      case 'stock':
        return <Input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Enter new stock amount" />;
      default:
        return null;
    }
  }

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Batch Edit Products</DialogTitle>
          <DialogDescription>
            Update a single field for all selected products.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="field" className="text-right">
              Field
            </Label>
            <Select onValueChange={(v) => { setField(v as EditableField); setValue(''); }}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="stock">Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">
              Value
            </Label>
            <div className="col-span-3">
                {renderValueInput()}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Apply Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
