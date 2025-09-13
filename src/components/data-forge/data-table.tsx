"use client";

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Postcard } from '@/lib/schema';
import { Toolbar } from './toolbar';

type SortKey = keyof Postcard | null;
type SortDirection = 'asc' | 'desc';

const categoryColors: { [key: string]: string } = {
  Travel: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Art: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  Greeting: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Vintage: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Holiday: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};


export function DataTable({
  data,
  selectedIds,
  onSelectedIdsChange,
  onEdit,
  onDelete,
  onBatchEdit,
  onBatchDelete,
  searchQuery,
  onSearchQueryChange,
  allPostcardIds,
}: {
  data: Postcard[];
  selectedIds: Set<string>;
  onSelectedIdsChange: (ids: Set<string>) => void;
  onEdit: (postcard: Postcard) => void;
  onDelete: (id: string) => void;
  onBatchEdit: () => void;
  onBatchDelete: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  allPostcardIds: string[];
}) {
  const router = useRouter();
  const [sortKey, setSortKey] = React.useState<SortKey>('name');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 10;

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDirection]);

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage]);
  
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectedIdsChange(new Set(allPostcardIds));
    } else {
      onSelectedIdsChange(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    if (checked) {
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    onSelectedIdsChange(newSelectedIds);
  };

  const handleSort = (key: keyof Postcard) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (postcardId: string) => {
    router.push(`/postcards/${postcardId}`);
  };

  const isAllSelected = selectedIds.size > 0 && selectedIds.size === allPostcardIds.length;
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < allPostcardIds.length;

  const renderSortableHeader = (key: keyof Postcard, label: string) => (
    <TableHead>
      <Button variant="ghost" onClick={() => handleSort(key)}>
        {label}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );

  return (
    <div className="space-y-4">
      <Toolbar 
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        selectedIds={selectedIds}
        data={data}
        onBatchEdit={onBatchEdit}
        onBatchDelete={onBatchDelete}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead padding="checkbox">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                  className="translate-y-[2px]"
                  data-state={isIndeterminate ? "indeterminate" : (isAllSelected ? "checked" : "unchecked")}
                />
              </TableHead>
              {renderSortableHeader('name', 'Postcard Name')}
              {renderSortableHeader('category', 'Category')}
              {renderSortableHeader('price', 'Price')}
              {renderSortableHeader('stock', 'Stock')}
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((postcard) => (
                <TableRow
                  key={postcard.id}
                  data-state={selectedIds.has(postcard.id) && 'selected'}
                  onClick={() => handleRowClick(postcard.id)}
                  className="cursor-pointer"
                >
                  <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(postcard.id)}
                      onCheckedChange={(checked) => handleSelectRow(postcard.id, !!checked)}
                      aria-label="Select row"
                      className="translate-y-[2px]"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/postcards/${postcard.id}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>
                      {postcard.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={categoryColors[postcard.category] || ''}>
                      {postcard.category}
                    </Badge>
                  </TableCell>
                  <TableCell>${postcard.price.toFixed(2)}</TableCell>
                  <TableCell>{postcard.stock}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(postcard)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(postcard.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
       <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedIds.size} of {data.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
            >
                Previous
            </Button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
            >
                Next
            </Button>
        </div>
      </div>
    </div>
  );
}
