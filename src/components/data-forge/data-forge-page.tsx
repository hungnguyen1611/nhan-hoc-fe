"use client";

import * as React from 'react';
import { Product } from '@/lib/schema';
import { DataVisualization } from './data-visualization';
import { DataTable } from './data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditDialog } from './edit-dialog';
import { BatchEditDialog } from './batch-edit-dialog';
import { useToast } from '@/hooks/use-toast';

const DATA_STORAGE_KEY = 'data-forge-products';

export function DataForgePage({ initialData }: { initialData: Product[] }) {
  const [data, setData] = React.useState<Product[]>([]);
  const [isDataLoaded, setIsDataLoaded] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [isBatchEditing, setIsBatchEditing] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const storedData = localStorage.getItem(DATA_STORAGE_KEY);
      if (storedData) {
        setData(JSON.parse(storedData));
      } else {
        setData(initialData);
      }
    } catch (error) {
      console.error("Failed to load data from local storage, using initial data.", error);
      setData(initialData);
    }
    setIsDataLoaded(true);
  }, [initialData]);

  React.useEffect(() => {
    if (isDataLoaded) {
      try {
        localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error("Failed to save data to local storage.", error);
        toast({
            variant: "destructive",
            title: "Storage Error",
            description: "Could not save data changes to your browser's local storage.",
        });
      }
    }
  }, [data, isDataLoaded, toast]);

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((product) =>
      Object.values(product).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery]);
  
  const handleUpdateProduct = (updatedProduct: Product) => {
    setData(prevData => prevData.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
     toast({
      title: "Success",
      description: `Product "${updatedProduct.name}" has been updated.`,
      className: 'bg-accent text-accent-foreground',
    });
  };

  const handleDeleteProducts = (ids: string[]) => {
    setData(prevData => prevData.filter(p => !ids.includes(p.id)));
    const newSelectedIds = new Set(selectedIds);
    ids.forEach(id => newSelectedIds.delete(id));
    setSelectedIds(newSelectedIds);
    toast({
      title: "Products Deleted",
      description: `${ids.length} product(s) have been removed.`,
    });
  };

  const handleBatchUpdate = (field: keyof Product, value: string | number) => {
    setData(prevData =>
      prevData.map(p =>
        selectedIds.has(p.id) ? { ...p, [field]: value } : p
      )
    );
    setIsBatchEditing(false);
    setSelectedIds(new Set());
     toast({
      title: "Batch Update Successful",
      description: `${selectedIds.size} products have been updated.`,
      className: 'bg-accent text-accent-foreground',
    });
  };

  if (!isDataLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <div className="space-y-8">
      <DataVisualization data={data} />
      <Card>
        <CardHeader>
          <CardTitle>Manage Products</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredData}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
            onEdit={setEditingProduct}
            onDelete={(id) => handleDeleteProducts([id])}
            onBatchDelete={() => handleDeleteProducts(Array.from(selectedIds))}
            onBatchEdit={() => setIsBatchEditing(true)}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            allProductIds={data.map(p => p.id)}
          />
        </CardContent>
      </Card>
      
      {editingProduct && (
        <EditDialog
          product={editingProduct}
          onOpenChange={(isOpen) => !isOpen && setEditingProduct(null)}
          onSave={handleUpdateProduct}
        />
      )}

      {isBatchEditing && (
        <BatchEditDialog
          onOpenChange={(isOpen) => !isOpen && setIsBatchEditing(false)}
          onBatchUpdate={handleBatchUpdate}
        />
      )}
    </div>
  );
}
