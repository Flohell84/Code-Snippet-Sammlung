
import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Paper, Box, TextField, Button, Grid, Select, MenuItem, InputLabel, FormControl, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent, DialogActions, Fab, Tooltip, useTheme
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const API_URL = 'http://localhost:5000/api/snippets';

const languages = ['JavaScript', 'Python', 'Java', 'C#', 'C++', 'TypeScript', 'Go', 'Ruby', 'PHP', 'Andere'];
const categories = ['Frontend', 'Backend', 'Datenbank', 'DevOps', 'Algorithmus', 'Sonstiges'];

function App() {
  const [snippets, setSnippets] = useState([]);
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('');
  const [category, setCategory] = useState('');
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', code: '', language: '', category: '' });

  const fetchSnippets = async () => {
    let url = API_URL + '?';
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (language) url += `language=${encodeURIComponent(language)}&`;
    if (category) url += `category=${encodeURIComponent(category)}&`;
    const res = await fetch(url);
    setSnippets(await res.json());
  };

  useEffect(() => { fetchSnippets(); }, [search, language, category]);

  const handleOpen = (snippet = null) => {
    if (snippet) {
      setEditId(snippet._id);
      setForm({
        title: snippet.title,
        description: snippet.description,
        code: snippet.code,
        language: snippet.language,
        category: snippet.category
      });
    } else {
      setEditId(null);
      setForm({ title: '', description: '', code: '', language: '', category: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setForm({ title: '', description: '', code: '', language: '', category: '' });
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editId) {
      await fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    }
    handleClose();
    fetchSnippets();
  };

  const handleDelete = async id => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchSnippets();
  };

  return (
    <Box sx={{ bgcolor: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)', boxShadow: 3 }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
            Code-Snippet-Sammlung
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 5, mb: 8 }}>
        <Paper elevation={4} sx={{ p: 4, mb: 4, borderRadius: 4, boxShadow: 6, background: 'rgba(255,255,255,0.95)' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <TextField label="Suche" value={search} onChange={e => setSearch(e.target.value)} fullWidth size="small" variant="outlined" sx={{ bgcolor: 'white', borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <FormControl fullWidth size="small" variant="outlined" sx={{ bgcolor: 'white', borderRadius: 2, minWidth: 140 }}>
                <InputLabel>Sprache</InputLabel>
                <Select value={language} label="Sprache" onChange={e => setLanguage(e.target.value)}>
                  <MenuItem value=""><em>Alle</em></MenuItem>
                  {languages.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <FormControl fullWidth size="small" variant="outlined" sx={{ bgcolor: 'white', borderRadius: 2, minWidth: 140 }}>
                <InputLabel>Kategorie</InputLabel>
                <Select value={category} label="Kategorie" onChange={e => setCategory(e.target.value)}>
                  <MenuItem value=""><em>Alle</em></MenuItem>
                  {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        <Grid container spacing={3}>
          {snippets.map(snippet => (
            <Grid item xs={12} sm={6} key={snippet._id}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3, minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 4, background: 'linear-gradient(135deg, #f8fafc 60%, #e3f2fd 100%)' }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>{snippet.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{snippet.language} | {snippet.category}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{snippet.description}</Typography>
                  <Box component="pre" sx={{ bgcolor: '#23272e', color: '#e3f2fd', p: 2, mt: 2, borderRadius: 2, fontSize: '0.98em', overflowX: 'auto', fontFamily: 'Fira Mono, monospace', boxShadow: 1 }}>{snippet.code}</Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Tooltip title="Bearbeiten">
                    <IconButton color="primary" onClick={() => handleOpen(snippet)}><Edit /></IconButton>
                  </Tooltip>
                  <Tooltip title="Löschen">
                    <IconButton color="error" onClick={() => handleDelete(snippet._id)}><Delete /></IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Grid>
          ))}
          {snippets.length === 0 && <Grid item xs={12}><Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>Keine Snippets gefunden.</Typography></Grid>}
        </Grid>
      </Container>
      <Tooltip title="Neues Snippet" placement="left">
        <Fab color="primary" aria-label="add" onClick={() => handleOpen()} sx={{ position: 'fixed', bottom: 32, right: 32, boxShadow: 6 }}>
          <Add />
        </Fab>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editId ? 'Snippet bearbeiten' : 'Neues Snippet hinzufügen'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers sx={{ bgcolor: '#f8fafc' }}>
            <TextField
              label="Titel"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Beschreibung"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={2}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Code"
              name="code"
              value={form.code}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={4}
              required
              sx={{ mb: 2, fontFamily: 'Fira Mono, monospace', bgcolor: '#23272e', color: '#e3f2fd', borderRadius: 2 }}
              InputProps={{ style: { color: '#e3f2fd' } }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Sprache</InputLabel>
                  <Select
                    name="language"
                    value={form.language}
                    label="Sprache"
                    onChange={handleChange}
                    required
                  >
                    {languages.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Kategorie</InputLabel>
                  <Select
                    name="category"
                    value={form.category}
                    label="Kategorie"
                    onChange={handleChange}
                    required
                  >
                    {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ bgcolor: '#f8fafc' }}>
            <Button onClick={handleClose}>Abbrechen</Button>
            <Button type="submit" variant="contained">Speichern</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default App;
