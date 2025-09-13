"use client";

import { FileDown, Search, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Product } from '@/lib/schema';
import { exportToCsv, exportToJson } from '@/lib/utils';

interface ToolbarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedIds: Set<string>;
  data: Product[];
  onBatchEdit: () => void;
  onBatchDelete: () => void;
}

export function Toolbar({
  searchQuery,
  onSearchQueryChange,
  selectedIds,
  data,
  onBatchEdit,
  onBatchDelete
}: ToolbarProps) {
  const numSelected = selectedIds.size;

  const handleExportCSV = () => {
    const selectedData = data.filter(item => selectedIds.has(item.id));
    exportToCsv('products.csv', selectedData.length > 0 ? selectedData : data);
  };

  const handleExportJSON = () => {
    const selectedData = data.filter(item => selectedIds.has(item.id));
    exportToJson('products.json', selectedData.length > 0 ? selectedData : data);
  };

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex items-center gap-2">
        {numSelected > 0 && (
          <>
            <Button variant="outline" size="sm" onClick={onBatchEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Batch Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={onBatchDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({numSelected})
            </Button>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportCSV}>Export as CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportJSON}>Export as JSON</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
