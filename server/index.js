import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const snippetSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  language: String,
  category: String
});

const Snippet = mongoose.model('Snippet', snippetSchema);

// Snippet-CRUD-API
app.get('/api/snippets', async (req, res) => {
  const { search, language, category } = req.query;
  let filter = {};
  if (search) filter.$or = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
    { code: { $regex: search, $options: 'i' } }
  ];
  if (language) filter.language = language;
  if (category) filter.category = category;
  const snippets = await Snippet.find(filter);
  res.json(snippets);
});

app.post('/api/snippets', async (req, res) => {
  const snippet = new Snippet(req.body);
  await snippet.save();
  res.status(201).json(snippet);
});

app.put('/api/snippets/:id', async (req, res) => {
  const snippet = await Snippet.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(snippet);
});

app.delete('/api/snippets/:id', async (req, res) => {
  await Snippet.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/snippets';

mongoose.connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server läuft auf Port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB-Verbindung fehlgeschlagen:', err));
