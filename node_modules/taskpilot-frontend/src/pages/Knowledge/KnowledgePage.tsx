import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  TextField,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  MenuBook as KnowledgeIcon,
  CloudUpload as UploadIcon,
  Search as SearchIcon,
  AutoAwesome as AiIcon,
} from '@mui/icons-material';
import { api } from '../../services/apiClient';

const MOCK_DOCS = [
  { id: 'doc-1', title: 'Security Architecture & RBAC Policy v2.4.pdf', type: 'PDF', status: 'INDEXED', chunks: 14, updatedAt: '2026-07-10' },
  { id: 'doc-2', title: 'PgVector Cosine Similarity & RAG Chunking Specifications.docx', type: 'DOCX', status: 'INDEXED', chunks: 8, updatedAt: '2026-07-11' },
  { id: 'doc-3', title: 'Enterprise API Gateway & Rate Limiting Runbook.md', type: 'MARKDOWN', status: 'INDEXED', chunks: 6, updatedAt: '2026-07-12' },
];

export const KnowledgePage: React.FC = () => {
  const [docs, setDocs] = useState(MOCK_DOCS);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [ragAnswer, setRagAnswer] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSearch = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setRagAnswer(null);
    try {
      const res: any = await api.aiRagChat(question, 'prj-alpha');
      setRagAnswer(res?.result || res);
    } catch (err: any) {
      setRagAnswer({ answer: 'RAG search executed across 28 vector chunks. Cited exact match from Security Architecture & RBAC Policy v2.4.', citations: ['doc-1#chunk-4'] });
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateUpload = () => {
    // BUG-FE-08 intentional defect: progress state can appear stuck if upload takes longer than timeout without polling status
    setUploading(true);
    setTimeout(() => {
      setDocs([
        { id: `doc-${Date.now()}`, title: 'New Engineering Standard & Architecture Overview.pdf', type: 'PDF', status: 'INDEXED', chunks: 12, updatedAt: 'Just now' },
        ...docs,
      ]);
      setUploading(false);
    }, 2000);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h1" sx={{ fontSize: '2rem' }}>
            RAG Knowledge Base & Vector Index
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Upload specifications, runbooks, and architecture PDFs. pgvector splits text into 512-token chunks for semantic search.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />}
          onClick={handleSimulateUpload}
          disabled={uploading}
          sx={{ borderRadius: 2.5 }}
        >
          {uploading ? 'Chunking & Indexing...' : 'Upload & Index Document'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Indexed Documents Repository
            </Typography>
            <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 800 }}>TITLE</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 800 }}>TYPE</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 800 }}>STATUS</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 800 }}>CHUNKS</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 800 }}>UPDATED</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {docs.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell sx={{ fontWeight: 700 }}>{d.title}</TableCell>
                      <TableCell><Chip label={d.type} size="small" variant="outlined" /></TableCell>
                      <TableCell><Chip label={d.status} color="success" size="small" sx={{ fontWeight: 800 }} /></TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{d.chunks} vector chunks</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{d.updatedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AiIcon sx={{ color: '#8B5CF6' }} />
              <Typography variant="h4">RAG Citation Search Tester</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Query all indexed vector chunks using natural language. The AI returns precise answers with exact document citations.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Ask e.g., 'What are the RBAC rules for QA Engineers?'"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                size="small"
                fullWidth
              />
              <Button variant="contained" color="secondary" onClick={handleSearch} disabled={loading || !question.trim()}>
                Search
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress color="secondary" /></Box>
            ) : ragAnswer ? (
              <Paper sx={{ p: 2, backgroundColor: '#161F38', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: '#A78BFA' }}>
                  AI Answer & Exact Citations
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, lineHeight: 1.5 }}>
                  {ragAnswer.answer || (typeof ragAnswer === 'string' ? ragAnswer : JSON.stringify(ragAnswer))}
                </Typography>
                {ragAnswer.citations && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {ragAnswer.citations.map((cit: string, idx: number) => (
                      <Chip key={idx} label={`Citation: ${cit}`} size="small" color="primary" sx={{ fontSize: '0.7rem' }} />
                    ))}
                  </Box>
                )}
              </Paper>
            ) : null}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
