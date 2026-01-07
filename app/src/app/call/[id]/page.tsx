'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    TextField,
    Chip,
    Divider,
    CircularProgress,
    Alert,
    IconButton,
} from '@mui/material';
import {
    ArrowBack,
    Archive,
    Unarchive,
    CallMade,
    CallReceived,
    CallMissed,
    Voicemail,
    AccessTime,
    Person,
    Phone as PhoneIcon,
} from '@mui/icons-material';
import { Call } from '@/types/call';
import { fetchCallById, toggleArchiveCall, addNote } from '@/services/calls';
import { formatDuration, formatTime, getDateLabel } from '@/utils/groupByDate';

export default function CallDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    

    const [call, setCall] = useState<Call | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [addingNote, setAddingNote] = useState(false);
    const isArchived = call?.is_archived ?? false;
    useEffect(() => {
        if (id) {
            loadCall();
        }
    }, [id]);

    const loadCall = async () => {
        try {
            setLoading(true);
            const data = await fetchCallById(id);
            setCall(data);
            setError('');
        } catch (err) {
            setError('Failed to load call details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleArchiveToggle = async (call: Call) => {
    try {
        const updatedCall = await toggleArchiveCall(call.id);
        setCall(updatedCall);
    } catch (err) {
        console.error('Failed to toggle archive:', err);
    }
    };

    const handleAddNote = async () => {
        if (!call || !noteContent.trim()) return;

        try {
            setAddingNote(true);
            const updatedCall = await addNote(call.id, noteContent);
            setCall(updatedCall);
            setNoteContent('');
        } catch (err) {
            console.error('Failed to add note:', err);
        } finally {
            setAddingNote(false);
        }
    };

    const getCallIcon = () => {
        if (!call) return null;
        if (call.call_type === 'missed') return <CallMissed sx={{ color: '#ff3b3b' }} />;
        if (call.call_type === 'voicemail') return <Voicemail sx={{ color: '#ffa500' }} />;
        if (call.direction === 'outbound') return <CallMade sx={{ color: '#00a846' }} />;
        return <CallReceived sx={{ color: '#00a846' }} />;
    };

    const getCallTypeLabel = () => {
        if (!call) return '';
        const type = call.call_type.charAt(0).toUpperCase() + call.call_type.slice(1);
        const direction = call.direction === 'outbound' ? 'Outbound' : 'Inbound';
        return `${type} ${direction}`;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress sx={{ color: '#00a846' }} />
            </Box>
        );
    }

    if (error || !call) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">{error || 'Call not found'}</Alert>
                <Button startIcon={<ArrowBack />} onClick={() => router.push('/')} sx={{ mt: 2 }}>
                    Back to Calls
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => router.push('/')}
                sx={{
                    mb: 3,
                    fontFamily: 'Avenir, sans-serif',
                    textTransform: 'none',
                    color: '#00a846',
                }}
            >
                Back to Calls
            </Button>

            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                backgroundColor: '#00a84620',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {getCallIcon()}
                        </Box>
                        <Box>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: 'Avenir, sans-serif',
                                    fontWeight: 900,
                                    mb: 0.5,
                                }}
                            >
                                {call.direction === 'outbound' ? call.to : call.from}
                            </Typography>
                            <Chip
                                label={getCallTypeLabel()}
                                size="small"
                                sx={{
                                    fontFamily: 'Avenir, sans-serif',
                                    backgroundColor: call.call_type === 'missed' ? '#ff3b3b20' : '#00a84620',
                                }}
                            />
                        </Box>
                    </Box>

                    <Button
                        variant={isArchived ? 'outlined' : 'contained'}
                        startIcon={isArchived ? <Unarchive /> : <Archive />}
                        onClick={() => handleArchiveToggle(call)} // pass the call here
                        >
                        {isArchived ? 'Unarchive' : 'Archive'}
                        </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Person sx={{ color: '#00a846' }} />
                            <Typography
                                variant="caption"
                                sx={{ fontFamily: 'Avenir, sans-serif', color: 'text.secondary' }}
                            >
                                From
                            </Typography>
                        </Box>
                        <Typography sx={{ fontFamily: 'Avenir, sans-serif', fontWeight: 600 }}>
                            {call.from}
                        </Typography>
                    </Box>

                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Person sx={{ color: '#00a846' }} />
                            <Typography
                                variant="caption"
                                sx={{ fontFamily: 'Avenir, sans-serif', color: 'text.secondary' }}
                            >
                                To
                            </Typography>
                        </Box>
                        <Typography sx={{ fontFamily: 'Avenir, sans-serif', fontWeight: 600 }}>
                            {call.to}
                        </Typography>
                    </Box>

                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <PhoneIcon sx={{ color: '#00a846' }} />
                            <Typography
                                variant="caption"
                                sx={{ fontFamily: 'Avenir, sans-serif', color: 'text.secondary' }}
                            >
                                Via
                            </Typography>
                        </Box>
                        <Typography sx={{ fontFamily: 'Avenir, sans-serif', fontWeight: 600 }}>
                            {call.via}
                        </Typography>
                    </Box>

                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <AccessTime sx={{ color: '#00a846' }} />
                            <Typography
                                variant="caption"
                                sx={{ fontFamily: 'Avenir, sans-serif', color: 'text.secondary' }}
                            >
                                Duration
                            </Typography>
                        </Box>
                        <Typography sx={{ fontFamily: 'Avenir, sans-serif', fontWeight: 600 }}>
                            {call.duration > 0 ? formatDuration(call.duration) : 'N/A'}
                        </Typography>
                    </Box>

                    <Box sx={{ gridColumn: '1 / -1' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <AccessTime sx={{ color: '#00a846' }} />
                            <Typography
                                variant="caption"
                                sx={{ fontFamily: 'Avenir, sans-serif', color: 'text.secondary' }}
                            >
                                Call Time
                            </Typography>
                        </Box>
                        <Typography sx={{ fontFamily: 'Avenir, sans-serif', fontWeight: 600 }}>
                            {getDateLabel(new Date(call.created_at))} at {formatTime(call.created_at)}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: 'Avenir, sans-serif',
                            fontWeight: 700,
                            mb: 2,
                        }}
                    >
                        Notes
                    </Typography>

                    {call.notes && call.notes.length > 0 ? (
                        <Box sx={{ mb: 3 }}>
                            {call.notes.map((note) => (
                                <Paper
                                    key={note.id}
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        mb: 1.5,
                                        backgroundColor: '#f9f9f9',
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{ fontFamily: 'Avenir, sans-serif', mb: 1 }}
                                    >
                                        {note.content}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontFamily: 'Avenir, sans-serif',
                                            color: 'text.secondary',
                                        }}
                                    >
                                        {formatTime(note.created_at)}
                                    </Typography>
                                </Paper>
                            ))}
                        </Box>
                    ) : (
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: 'Avenir, sans-serif',
                                color: 'text.secondary',
                                mb: 2,
                            }}
                        >
                            No notes yet
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Add a note..."
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    fontFamily: 'Avenir, sans-serif',
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleAddNote}
                            disabled={!noteContent.trim() || addingNote}
                            sx={{
                                fontFamily: 'Avenir, sans-serif',
                                textTransform: 'none',
                                backgroundColor: '#00a846',
                                '&:hover': {
                                    backgroundColor: '#008a3a',
                                },
                            }}
                        >
                            {addingNote ? 'Adding...' : 'Add Note'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}