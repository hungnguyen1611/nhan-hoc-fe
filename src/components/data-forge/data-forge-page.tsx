"use client";

import * as React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Postcard } from '@/lib/schema';
import { db } from '@/lib/db';
import { DataVisualization } from './data-visualization';
import { DataTable } from './data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditDialog } from './edit-dialog';
import { BatchEditDialog } from './batch-edit-dialog';
import { useToast } from '@/hooks/use-toast';

export function DataForgePage({ initialData }: { initialData: Postcard[] }) {
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
  
  const allData = useLiveQuery(() => db.postcards.toArray(), [], [] as Postcard[]);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  
  const [editingPostcard, setEditingPostcard] = React.useState<Postcard | null>(null);
  const [isBatchEditing, setIsBatchEditing] = React.useState(false);

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return allData;
    return allData.filter((postcard) =>
      Object.values(postcard).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [allData, searchQuery]);
  
  const handleUpdatePostcard = async (updatedPostcard: Postcard) => {
    try {
      await db.postcards.put(updatedPostcard);
      setEditingPostcard(null);
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

  const handleDeletePostcards = async (ids: string[]) => {
    try {
      await db.postcards.bulkDelete(ids);
      const newSelectedIds = new Set(selectedIds);
      ids.forEach(id => newSelectedIds.delete(id));
      setSelectedIds(newSelectedIds);
      toast({
        title: "Postcards Deleted",
        description: `${ids.length} postcard(s) have been removed.`,
      });
    } catch (error) {
        console.error("Failed to delete postcards:", error);
        toast({
            variant: "destructive",
            title: "Database Error",
            description: "Could not delete postcards from the local database.",
        });
    }
  };

  const handleBatchUpdate = async (field: keyof Postcard, value: string | number) => {
     try {
        const postcardsToUpdate = await db.postcards.where('id').anyOf(Array.from(selectedIds)).toArray();
        const updatedPostcards = postcardsToUpdate.map(p => ({ ...p, [field]: value }));
        await db.postcards.bulkPut(updatedPostcards);

        setIsBatchEditing(false);
        setSelectedIds(new Set());
        toast({
            title: "Batch Update Successful",
            description: `${selectedIds.size} postcards have been updated.`,
            className: 'bg-accent text-accent-foreground',
        });
    } catch (error) {
        console.error("Failed to batch update postcards:", error);
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
          <CardTitle>Manage Postcards</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredData}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
            onEdit={setEditingPostcard}
            onDelete={(id) => handleDeletePostcards([id])}
            onBatchDelete={() => handleDeletePostcards(Array.from(selectedIds))}
            onBatchEdit={() => setIsBatchEditing(true)}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            allPostcardIds={allData.map(p => p.id)}
          />
        </CardContent>
      </Card>
      
      {editingPostcard && (
        <EditDialog
          postcard={editingPostcard}
          onOpenChange={(isOpen) => !isOpen && setEditingPostcard(null)}
          onSave={handleUpdatePostcard}
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
