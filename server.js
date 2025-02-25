const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// koneksi ke MongoDB
mongoose
  .connect('mongodb://localhost:27017/catatanDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Model Note
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});
const Note = mongoose.model('Note', noteSchema);

// CRUD

// Create Note
app.post('/notes', async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content });
    await note.save();
    res.status(201).json(note); // Send JSON response
  } catch (error) {
    res.status(500).json({ message: 'Failed to create note', error: error.message });
  }
});

// Read Notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes); // Send JSON response
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve notes', error: error.message });
  }
});

// Update Notes
app.get('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving note', error: error.message });
  }
});

app.put('/notes/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.status(200).json(note); // Send JSON response
  } catch (error) {
    res.status(500).json({ message: 'Failed to update note', error: error.message });
  }
});

// Delete Note
app.delete('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.status(200).json({ message: 'Note deleted' }); // Send JSON response
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete note', error: error.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
