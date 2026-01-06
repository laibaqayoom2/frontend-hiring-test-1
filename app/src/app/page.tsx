'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Button,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import { useCalls } from '@/hooks/useCalls';
import CallTable from '@/components/CallTable';
import TablePagination from '@/components/TablePagination';
import { archiveCall, unarchiveCall, addNote } from '@/services/calls';
import { Call, CallFilter } from '@/types/call';
import { isAuthenticated, logout } from '@/services/auth';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const {
    calls,
    loading,
    error,
    totalCount,
    offset,
    limit,
    loadPage,
    updateCall,
    filter,
    setFilter,
  } = useCalls();

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) router.push('/login');
  }, [router]);

  const handleRowClick = (id: string) => router.push(`/call/${id}`);

  const handleArchiveToggle = async (call: Call) => {
    try {
      const updatedCall = call.is_archived
        ? await unarchiveCall(call.id)
        : await archiveCall(call.id);
      updateCall(updatedCall);
    } catch (err) {
      console.error('Failed to toggle archive:', err);
    }
  };

  const handleAddNote = async (call: Call, content: string) => {
    try {
      const updatedCall = await addNote(call.id, content);
      updateCall(updatedCall);
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  const handlePageChange = (page: number) => {
  loadPage(page); 
};

  const handleFilterChange = (event: any) => {
    setFilter(event.target.value as CallFilter);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!mounted) return null;

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#ffffff',
          boxShadow: 'none',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar>
          <Image
            src="/images/TT_Logo.png"
            alt="Company Logo"
            width={160}
            height={40}
            style={{ width: 'auto', height: 'auto', marginRight: '16px' }}
          />
          <Button
            onClick={handleLogout}
            sx={{
              boxShadow: 'none',
              marginLeft: 'auto',
              textTransform: 'none',
              backgroundColor: '#5C5CFF',
              color: '#fff',
              padding: '11px 32px',
              '&:hover': { backgroundColor: '#4A4AE5' },
            }}
          >
            Log out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{ color: '#000000', mb: 2 }}
          >
            Turing Technologies Frontend Test
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography sx={{ color: '#666' }}>Filter by:</Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
              
                value={filter}
                onChange={handleFilterChange}
                variant="standard"
                disableUnderline
                sx={{ color: '#5C5CFF', fontSize: '0.875rem' }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
                <MenuItem value="unarchived">Unarchived</MenuItem>
                <MenuItem value="missed">Missed</MenuItem>
                <MenuItem value="answered">Answered</MenuItem>
                <MenuItem value="voicemail">Voicemail</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading && calls.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#5C5CFF' }} />
          </Box>
        ) : calls.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No calls found
            </Typography>
          </Box>
        ) : (
          <>
            <CallTable
              calls={calls}
              onArchiveToggle={handleArchiveToggle}
              onRowClick={handleRowClick}
              onAddNote={handleAddNote}
            />
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalResults={totalCount}
              resultsPerPage={limit}
            />
          </>
        )}
      </Container>
    </>
  );
}
