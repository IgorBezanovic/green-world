'use client';

import { SharedPagination } from '@green-world/components/SharedPagination';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';

export interface AdminTableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface AdminTableProps<T extends { _id: string }> {
  title: string;
  columns: AdminTableColumn<T>[];
  rows: T[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  searchValue: string;
  onSearchChange: (v: string) => void;
  onPageChange: (p: number) => void;
  onEdit: (row: T) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  createLabel?: string;
}

export function AdminTable<T extends { _id: string }>({
  title,
  columns,
  rows,
  totalPages,
  currentPage,
  isLoading,
  searchValue,
  onSearchChange,
  onPageChange,
  onEdit,
  onDelete,
  onCreate,
  createLabel = 'Dodaj novo'
}: AdminTableProps<T>) {
  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Pretraži…"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              )
            }}
          />
          <Button
            variant="contained"
            size="small"
            startIcon={<Plus size={16} />}
            onClick={onCreate}
          >
            {createLabel}
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              {columns.map((col) => (
                <TableCell key={String(col.key)} sx={{ fontWeight: 700 }}>
                  {col.label}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Akcije
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={String(col.key)}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                  </TableRow>
                ))
              : rows.map((row) => (
                  <TableRow key={row._id} hover>
                    {columns.map((col) => (
                      <TableCell key={String(col.key)}>
                        {col.render
                          ? col.render(row)
                          : String((row as any)[col.key] ?? '—')}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <Tooltip title="Izmeni">
                        <IconButton size="small" onClick={() => onEdit(row)}>
                          <Pencil size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Obriši">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDelete(row._id)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  align="center"
                  sx={{ py: 4 }}
                >
                  <Typography color="text.secondary">Nema podataka</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <SharedPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </Box>
      )}
    </Box>
  );
}
