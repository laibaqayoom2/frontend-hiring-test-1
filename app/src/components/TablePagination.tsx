'use client';

import { Box, Button, Typography } from '@mui/material';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults: number;
  resultsPerPage: number;
}

export const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
  resultsPerPage,
}: TablePaginationProps) => {
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  const renderPageButtons = () => {
    const buttons = [];
    const maxVisible = 10;

    for (let i = 1; i <= Math.min(totalPages, maxVisible); i++) {
      buttons.push(
        <Button
          key={i}
          onClick={() => onPageChange(i)}
          sx={{
            minWidth: '36px',
            height: '36px',
            padding: '6px 12px',
            fontFamily: 'Avenir, sans-serif',
            fontSize: '0.875rem',
            backgroundColor: currentPage === i ? '#5C5CFF' : 'transparent',
            color: currentPage === i ? 'white' : '#666',
            border: 'none',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: currentPage === i ? '#5C5CFF' : '#f0f0f0',
            },
          }}
        >
          {i}
        </Button>
      );
    }

    if (totalPages > maxVisible) {
      buttons.push(
        <Typography key="ellipsis" sx={{ px: 1, color: '#666' }}>
          ...
        </Typography>
      );
    }

    return buttons;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 2,
        mt: 3,
        mb: 3,
      }}
    >
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
        {renderPageButtons()}

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          sx={{
            minWidth: '36px',
            height: '36px',
            padding: '6px 12px',
            fontFamily: 'Avenir, sans-serif',
            fontSize: '0.875rem',
            color: '#666',
            border: 'none',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
            '&:disabled': {
              color: '#ccc',
            },
          }}
        >
          →
        </Button>
      </Box>

      <Typography
        sx={{
          fontFamily: 'Avenir, sans-serif',
          fontSize: '0.875rem',
          color: '#666',
        }}
      >
        {startResult} - {endResult} of {totalResults} results
      </Typography>
    </Box>
  );
};

export default TablePagination;