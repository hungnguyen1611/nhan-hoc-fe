
"use client";

import * as React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useParams } from 'next/navigation';
import { db } from '@/lib/db';
import { Postcard } from '@/lib/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Pencil } from 'lucide-react';
import { EditDialog } from '@/components/data-forge/edit-dialog';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

function PostcardNotFound() {
    return (
        <div className="min-h-screen bg-background font-body">
            <Header />
            <main className="container mx-auto flex flex-col items-center justify-center p-4 text-center md:p-8">
                <h1 className="text-4xl font-bold">Postcard Not Found</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Sorry, we couldn&apos;t find the postcard you were looking for.
                </p>
                <Button asChild variant="outline" className="mt-8">
                    <Link href="/" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to All Postcards
                    </Link>
                </Button>
            </main>
            <Toaster />
        </div>
    );
}


export default function PostcardDetailPage() {
  const { toast } = useToast();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const [isEditing, setIsEditing] = React.useState(false);
  const [postcard, setPostcard] = React.useState<Postcard | null | undefined>(undefined);

  const livePostcard = useLiveQuery(() => db.postcards.get(id), [id], undefined);

  React.useEffect(() => {
    // dexie-react-hooks returns undefined on initial load, then the data or null if not found.
    setPostcard(livePostcard);
  }, [livePostcard]);


  const handleUpdatePostcard = async (updatedPostcard: Postcard) => {
    try {
      await db.postcards.put(updatedPostcard);
      setIsEditing(false);
      toast({
        title: "Success",
        description: `Postcard "${updatedPostcard.name}" has been updated.`,
        className: 'bg-accent text-accent-foreground',
      });
    } catch (error) {
      console.error("Failed to update postcard:", error);
      toast({
        variant: "destructive",
        title: "Database Error",
        description: "Could not update the postcard in the local database.",
      });
    }
  };

  const isLoading = postcard === undefined;

  if (isLoading) {
    return (
        <div className="min-h-screen bg-background font-body">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <p>Loading postcard...</p>
            </main>
            <Toaster />
        </div>
    );
  }

  if (postcard === null) {
    return <PostcardNotFound />;
  }
  
  return (
    <div className="min-h-screen bg-background font-body">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-6 flex justify-between items-center">
            <Button asChild variant="outline">
                <Link href="/" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to All Postcards
                </Link>
            </Button>
            <Button onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Postcard
            </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{postcard.name}</CardTitle>
            <CardDescription>Postcard ID: {postcard.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <h3 className="font-semibold text-lg mb-2">Details</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <dt className="font-medium text-muted-foreground">Category</dt>
                  <dd>{postcard.category}</dd>
                  <dt className="font-medium text-muted-foreground">Price</dt>
                  <dd>${postcard.price.toFixed(2)}</dd>
                  <dt className="font-medium text-muted-foreground">Stock</dt>
                  <dd>{postcard.stock} units</dd>
                </dl>
              </div>
              <div className="md:col-span-2">
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {postcard.description || 'No description available.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      {isEditing && (
        <EditDialog
            postcard={postcard}
            onOpenChange={(isOpen) => !isOpen && setIsEditing(false)}
            onSave={handleUpdatePostcard}
        />
      )}
      <Toaster />
    </div>
  );
}
