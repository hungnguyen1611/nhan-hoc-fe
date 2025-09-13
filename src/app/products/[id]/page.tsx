import { products } from '@/lib/data';
import { Product } from '@/lib/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
            <Button asChild variant="outline">
                <Link href="/" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to All Products
                </Link>
            </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{product.name}</CardTitle>
            <CardDescription>Product ID: {product.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
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
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-muted-foreground">
                  This is a learning placeholder for the product description. 
                  More details about the {product.name.toLowerCase()} would appear here, 
                  including its features, benefits, and specifications. 
                  For now, we are just displaying the core data points.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
