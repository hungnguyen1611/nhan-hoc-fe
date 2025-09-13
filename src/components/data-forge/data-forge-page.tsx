"use client";

import * as React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Product } from '@/lib/schema';
import { db } from '@/lib/db';
import { DataVisualization } from './data-visualization';
import { DataTable } from './data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditDialog } from './edit-dialog';
import { BatchEditDialog } from './batch-edit-dialog';
import { useToast } from '@/hooks/use-toast';

export function DataForgePage({ initialData }: { initialData: Product[] }) {
  const { toast } = useToast();

  // Seed the database on initial load
  React.useEffect(() => {
    db.seed().catch(error => {
       toast({
        variant: "destructive",
        title: "Database Error",
        description: "Failed to initialize the local database.",
      });
      console.error(error);
    });
  }, []);
  
  const allData = useLiveQuery(() => db.products.toArray(), [], [] as Product[]);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [isBatchEditing, setIsBatchEditing] = React.useState(false);

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return allData;
    return allData.filter((product) =>
      Object.values(product).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [allData, searchQuery]);
  
  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      await db.products.put(updatedProduct);
      setEditingProduct(null);
      toast({
        title: "Success",
        description: `Product "${updatedProduct.name}" has been updated.`,
        className: 'bg-accent text-accent-foreground',
      });
    } catch (error) {
      console.error("Failed to update product:", error);
      toast({
        variant: "destructive",
        title: "Database Error",
        description: "Could not update the product in the local database.",
      });
    }
  };

  const handleDeleteProducts = async (ids: string[]) => {
    try {
      await db.products.bulkDelete(ids);
      const newSelectedIds = new Set(selectedIds);
      ids.forEach(id => newSelectedIds.delete(id));
      setSelectedIds(newSelectedIds);
      toast({
        title: "Products Deleted",
        description: `${ids.length} product(s) have been removed.`,
      });
    } catch (error) {
        console.error("Failed to delete products:", error);
        toast({
            variant: "destructive",
            title: "Database Error",
            description: "Could not delete products from the local database.",
        });
    }
  };

  const handleBatchUpdate = async (field: keyof Product, value: string | number) => {
     try {
        const productsToUpdate = await db.products.where('id').anyOf(Array.from(selectedIds)).toArray();
        const updatedProducts = productsToUpdate.map(p => ({ ...p, [field]: value }));
        await db.products.bulkPut(updatedProducts);

        setIsBatchEditing(false);
        setSelectedIds(new Set());
        toast({
            title: "Batch Update Successful",
            description: `${selectedIds.size} products have been updated.`,
            className: 'bg-accent text-accent-foreground',
        });
    } catch (error) {
        console.error("Failed to batch update products:", error);
        toast({
            variant: "destructive",
            title: "Database Error",
            description: "Could not perform batch update in the local database.",
        });
    }
  };

  if (!allData) {
    return null; // Or a loading spinner
  }

  return (
    <div className="space-y-8">
      <DataVisualization data={allData} />
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
            allProductIds={allData.map(p => p.id)}
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
