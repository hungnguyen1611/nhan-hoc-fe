"use client";

import * as React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useParams, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Product } from '@/lib/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Pencil } from 'lucide-react';
import { EditDialog } from '@/components/data-forge/edit-dialog';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function ProductDetailPage() {
  const { toast } = useToast();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const [isEditing, setIsEditing] = React.useState(false);

  const product = useLiveQuery(() => db.products.get(id), [id]);

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      await db.products.put(updatedProduct);
      setIsEditing(false);
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

  // The `product` can be `undefined` while loading, then the product object,
  // or `undefined` again if not found.
  const productExists = product !== undefined;
  const isLoading = product === undefined;

  // After loading, if product is still undefined, it's a 404.
  React.useEffect(() => {
    if (!isLoading && !productExists) {
      notFound();
    }
  }, [isLoading, productExists]);

  if (isLoading || !productExists) {
    return (
        <div className="min-h-screen bg-background font-body">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <p>Loading product...</p>
            </main>
            <Toaster />
        </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background font-body">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-6 flex justify-between items-center">
            <Button asChild variant="outline">
                <Link href="/" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to All Products
                </Link>
            </Button>
            <Button onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Product
            </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{product.name}</CardTitle>
            <CardDescription>Product ID: {product.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <h3 className="font-semibold text-lg mb-2">Details</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <dt className="font-medium text-muted-foreground">Category</dt>
                  <dd>{product.category}</dd>
                  <dt className="font-medium text-muted-foreground">Price</dt>
                  <dd>${product.price.toFixed(2)}</dd>
                  <dt className="font-medium text-muted-foreground">Stock</dt>
                  <dd>{product.stock} units</dd>
                </dl>
              </div>
              <div className="md:col-span-2">
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {product.description || 'No description available.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      {isEditing && (
        <EditDialog
            product={product}
            onOpenChange={(isOpen) => !isOpen && setIsEditing(false)}
            onSave={handleUpdateProduct}
        />
      )}
      <Toaster />
    </div>
  );
}
