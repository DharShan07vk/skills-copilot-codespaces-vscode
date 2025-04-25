// Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Comment = require('./models/comment'); // Import the Comment model
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = 'mydatabase'; // Replace with your database name
const db = client.db(dbName);
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Connect to MongoDB
client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });
// Define the Comment schema
const commentSchema = new mongoose.Schema({
  name: String,
  email: String,
  comment: String,
  date: { type: Date, default: Date.now }
});
// Create the Comment model
const Comment = mongoose.model('Comment', commentSchema);
// Middleware to parse JSON bodies
app.use(bodyParser.json());
// Middleware to enable CORS
app.use(cors());
// Middleware to serve static files
app.use(express.static('public'));
// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
// Route to get all comments
app.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
});
// Route to add a new comment
app.post('/comments', async (req, res) => {
  const { name, email, comment } = req.body;
  const newComment = new Comment({ name, email, comment });
  try {
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: 'Error saving comment' });
  }
});
// Route to delete a comment
app.delete('/comments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Comment.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error deleting comment' });
  }
});
// Route to update a comment
app.put('/comments/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, comment } = req.body;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(id, { name, email, comment }, { new: true });
    res.json(updatedComment);
  } catch (err) {
    res.status(500).json({ error: 'Error updating comment' });
  }
});
// Route to get a comment by ID
app.get('/comments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching comment' });
  }
}
);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// Close the MongoDB connection when the server is closed
process.on('SIGINT', () => {
  client.close()
    .then(() => {
      console.log('MongoDB connection closed');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error closing MongoDB connection', err);
      process.exit(1);
    });
});
// Export the app for testing
module.exports = app;
// Export the Comment model for testing
module.exports = {
  Comment,
  app
};
// Export the MongoDB client for testing
module.exports = {
  client,
  db
};
// Export the MongoDB connection string for testing
module.exports = {
  uri
};
// Export the MongoDB database name for testing
module.exports = {
  dbName
};
// Export the MongoDB database for testing
module.exports = {
  db
};
// Export the MongoDB collection for testing
module.exports = {
  collection
};
// Export the MongoDB collection name for te