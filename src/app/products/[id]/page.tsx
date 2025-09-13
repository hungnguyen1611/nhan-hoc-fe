"use client";

import * as React from 'react';
import { products } from '@/lib/data';
import { Product } from '@/lib/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Pencil } from 'lucide-react';
import { EditDialog } from '@/components/data-forge/edit-dialog';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const DATA_STORAGE_KEY = 'data-forge-products';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);

  const [productData, setProductData] = React.useState<Product[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem(DATA_STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : products;
      }
    } catch (error) {
      console.error("Failed to load data from local storage, using initial data.", error);
    }
    return products;
  });

  const product = productData.find((p) => p.id === params.id);

  const handleUpdateProduct = (updatedProduct: Product) => {
    const newData = productData.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProductData(newData);
    try {
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(newData));
    } catch (error) {
      console.error("Failed to save data to local storage.", error);
      toast({
        variant: "destructive",
        title: "Storage Error",
        description: "Could not save data changes to your browser's local storage.",
      });
    }
    setIsEditing(false);
    toast({
      title: "Success",
      description: `Product "${updatedProduct.name}" has been updated.`,
      className: 'bg-accent text-accent-foreground',
    });
  };

  if (!product) {
    const initialProduct = products.find((p) => p.id === params.id);
    if (!initialProduct) {
        notFound();
    }
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
