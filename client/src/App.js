
import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Paper, Box, TextField, Button, Grid, Select, MenuItem, InputLabel, FormControl, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent, DialogActions
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
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Code-Snippet-Sammlung
          </Typography>
          <Button color="inherit" startIcon={<Add />} onClick={() => handleOpen()}>Neues Snippet</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Suche" value={search} onChange={e => setSearch(e.target.value)} fullWidth size="small" />
            </Grid>
            <Grid item xs={12} sm={3} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Sprache</InputLabel>
                <Select value={language} label="Sprache" onChange={e => setLanguage(e.target.value)}>
                  <MenuItem value=""><em>Alle</em></MenuItem>
                  {languages.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Kategorie</InputLabel>
                <Select value={category} label="Kategorie" onChange={e => setCategory(e.target.value)}>
                  <MenuItem value=""><em>Alle</em></MenuItem>
                  {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        <Paper elevation={1} sx={{ p: 2 }}>
          <List>
            {snippets.map(snippet => (
              <ListItem key={snippet._id} alignItems="flex-start" sx={{ mb: 1, borderRadius: 1, bgcolor: '#fafafa' }}>
                <ListItemText
                  primary={<>
                    <Typography variant="subtitle1" fontWeight="bold">{snippet.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{snippet.language} | {snippet.category}</Typography>
                  </>}
                  secondary={<>
                    <Typography variant="body2" color="text.secondary">{snippet.description}</Typography>
                    <Box component="pre" sx={{ bgcolor: '#eee', p: 1, mt: 1, borderRadius: 1, fontSize: '0.95em', overflowX: 'auto' }}>{snippet.code}</Box>
                  </>}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(snippet)}><Edit /></IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(snippet._id)}><Delete /></IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            {snippets.length === 0 && <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>Keine Snippets gefunden.</Typography>}
          </List>
        </Paper>
      </Container>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Snippet bearbeiten' : 'Neues Snippet hinzufügen'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
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
              sx={{ mb: 2, fontFamily: 'monospace' }}
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
          <DialogActions>
            <Button onClick={handleClose}>Abbrechen</Button>
            <Button type="submit" variant="contained">Speichern</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default App;
