'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import { Call } from '@/types/call';
import { useState } from 'react';

interface CallTableProps {
  calls: Call[];
  onArchiveToggle: (call: Call) => void;
  onAddNote?: (call: Call, noteContent: string) => void;
  onRowClick?: (id: string) => void;
}

const CallTable = ({ calls, onArchiveToggle, onAddNote, onRowClick }: CallTableProps) => {
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [noteContent, setNoteContent] = useState('');

  const getCallTypeColor = (callType: string) => {
    switch (callType) {
      case 'voicemail':
        return '#325AE7';
      case 'answered':
        return '#1DC9B7';
      case 'missed':
        return '#C91D3E';
      default:
        return '#95A5A6';
    }
  };

  const formatCallID = (callID: string) => {
    return callID.charAt(0).toUpperCase() + callID.slice(1);
  };
  const formatCallType = (callType: string) => {
    return callType.charAt(0).toUpperCase() + callType.slice(1);
  };

  const formatDirection = (direction: string) => {
    return direction.charAt(0).toUpperCase() + direction.slice(1);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} minutes ${secs} seconds`;
  };


  const handleOpenNoteModal = (call: Call) => {
    setSelectedCall(call);
    setNoteContent('');
    setOpenNoteModal(true);
  };

  const handleAddNoteClick = () => {
    if (selectedCall && noteContent.trim()) {
      if (onAddNote) {
        onAddNote(selectedCall, noteContent.trim());
      }
      setOpenNoteModal(false);
      setNoteContent('');
    }
  };


  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 'none',
          border: '1px solid #e0e0e0',
          overflowX: 'auto',
          width: '100%',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontFamily: 'Avenir, sans-serif', fontWeight: 900, color: '#000000ff' }}>
                CALL TYPE
              </TableCell>
              <TableCell sx={{ fontFamily: 'Avenir, sans-serif', fontWeight: 900, color: '#000000ff' }}>
                DIRECTION
              </TableCell>
              <TableCell sx={{ fontFamily: 'Avenir, sans-serif', fontWeight: 900, color: '#000000ff' }}>
                DURATION
              </TableCell>
              <TableCell sx={{ fontFamily: 'Avenir, sans-serif', fontWeight: 900, color: '#000000ff' }}>
                FROM
              </TableCell>
              <TableCell sx={{ fontFamily: 'Avenir, sans-serif', fontWeight: 900, color: '#000000ff' }}>
                TO
              </TableCell>
              <TableCell sx={{ fontFamily: 'Avenir, sans-serif', fontWeight: 900, color: '#000000ff' }}>
                VIA
              </TableCell>
              <TableCell sx={{ fontFamily: 'Avenir, sans-serif', fontWeight: 900, color: '#000000ff' }}>
                CREATED AT
              </TableCell>
              <TableCell sx={{ fontFamily: 'Avenir, sans-serif', fontWeight: 900, color: '#000000ff' }}>
                STATUS
              </TableCell>
              <TableCell sx={{ fontFamily: 'Avenir, sans-serif', fontWeight: 900, color: '#000000ff' }}>
                ACTIONS
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {calls.map((call) => (
              <TableRow
                key={call.id}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f9f9f9' },
                }}
                onClick={() => onRowClick && onRowClick(call.id)}
              >
                <TableCell
                  sx={{
                    color: getCallTypeColor(call.call_type),
                    fontFamily: 'Avenir, sans-serif',
                    fontWeight: 500,
                  }}>
                  {formatCallType(call.call_type)}
                </TableCell>
                <TableCell sx={{ fontFamily: 'Avenir, sans-serif', color: '#325AE7' }}>
                  {formatDirection(call.direction)}
                </TableCell>
                <TableCell sx={{ fontFamily: 'Avenir, sans-serif', fontSize: '0.875rem' }}>
                  {formatDuration(call.duration)}
                  <Box component="span" sx={{ color: '#325AE7', display: 'block' }}>
                    ({call.duration} seconds)
                  </Box>
                </TableCell>
                <TableCell sx={{ fontFamily: 'Avenir, sans-serif' }}>{call.from}</TableCell>
                <TableCell sx={{ fontFamily: 'Avenir, sans-serif' }}>{call.to}</TableCell>
                <TableCell sx={{ fontFamily: 'Avenir, sans-serif' }}>{call.via}</TableCell>


                <TableCell sx={{ fontFamily: 'Avenir, sans-serif' }}>
                  {new Date(call.created_at).toLocaleDateString('en-GB')}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                      onArchiveToggle(call);
                    }}
                    sx={{
                      boxShadow: 'none',
                      backgroundColor: call.is_archived ? '#C6F1E5' : '#E0E0E0',
                      color: call.is_archived ? '#1DC9B7' : '#666',
                      fontFamily: 'Avenir, sans-serif',
                      fontSize: '0.75rem',
                      padding: '5px 11px',
                      textTransform: 'none',

                    }}
                  >
                    {call.is_archived ? 'Unarchive' : 'Archive'}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenNoteModal(call);
                    }}
                    sx={{
                      backgroundColor: '#5C5CFF',
                      boxShadow: 'none',
                      color: 'white',
                      fontFamily: 'Avenir, sans-serif',
                      padding: '5px 11px',
                      textTransform: 'none',
                      fontSize: '0.75rem',
                    }}
                  >
                    Add Note
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openNoteModal}
        onClose={() => setOpenNoteModal(false)}
        fullWidth
        maxWidth="sm"
      >
        {/* Title */}
        <DialogTitle sx={{ fontWeight: 500, pb: 1 }}>
          Add Notes
        </DialogTitle>

        {/* Call ID – no gap */}
        {selectedCall && (
          <Typography
            variant="body2"
            sx={{ px: 3, color: '#4f46f8', pb: 1 }}
          >
            Call ID: {formatCallID(selectedCall.id)}
          </Typography>
        )}

        <Divider />

        <DialogContent sx={{ pt: 2, mb: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {selectedCall && (
            <>
              <Typography variant="body2">
                <b> Call Type: </b> <span style={{ color: '#4875f1ff' }}> {formatCallType(selectedCall.call_type)} </span>
              </Typography>
              <Typography variant="body2">
                <b>Duration:</b> {formatDuration(selectedCall.duration)}
              </Typography>

              <Typography variant="body2">
                <b>From:</b> {selectedCall.from}
              </Typography>
              <Typography variant="body2">
                <b>To:</b> {selectedCall.to}
              </Typography>
              <Typography variant="body2">
                <b>Via:</b> {selectedCall.via}
              </Typography>

              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Notes
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add Notes"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            </>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddNoteClick}
            sx={{
              backgroundColor: '#4f46f8',
              textTransform: 'none',
              fontWeight: 400,
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>


    </>
  );
};

export default CallTable;
