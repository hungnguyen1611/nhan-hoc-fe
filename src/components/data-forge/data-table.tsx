"use client";

import * as React from 'react';
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
import { Product } from '@/lib/schema';
import { Toolbar } from './toolbar';

type SortKey = keyof Product | null;
type SortDirection = 'asc' | 'desc';

const categoryColors: { [key: string]: string } = {
  Electronics: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Clothing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  Books: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Home Goods': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Groceries: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
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
  allProductIds,
}: {
  data: Product[];
  selectedIds: Set<string>;
  onSelectedIdsChange: (ids: Set<string>) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onBatchEdit: () => void;
  onBatchDelete: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  allProductIds: string[];
}) {

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
      onSelectedIdsChange(new Set(allProductIds));
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

  const handleSort = (key: keyof Product) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const isAllSelected = selectedIds.size > 0 && selectedIds.size === allProductIds.length;
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < allProductIds.length;

  const renderSortableHeader = (key: keyof Product, label: string) => (
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
              {renderSortableHeader('name', 'Product Name')}
              {renderSortableHeader('category', 'Category')}
              {renderSortableHeader('price', 'Price')}
              {renderSortableHeader('stock', 'Stock')}
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((product) => (
                <TableRow
                  key={product.id}
                  data-state={selectedIds.has(product.id) && 'selected'}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.has(product.id)}
                      onCheckedChange={(checked) => handleSelectRow(product.id, !!checked)}
                      aria-label="Select row"
                      className="translate-y-[2px]"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={categoryColors[product.category] || ''}>
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(product.id)}>
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
