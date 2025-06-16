const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const messagesFile = path.join(__dirname, 'messages.json');

// Middleware
app.use(express.json());

// Serve HTML directly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Get all messages
app.get('/messages', (req, res) => {
  fs.readFile(messagesFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json([]);
    const messages = JSON.parse(data || '[]');
    res.json(messages);
  });
});

// Post a new message
app.post('/messages', (req, res) => {
  const newMessage = req.body.message;
  fs.readFile(messagesFile, 'utf8', (err, data) => {
    let messages = [];
    if (!err && data) {
      messages = JSON.parse(data);
    }
    messages.push(newMessage);
    fs.writeFile(messagesFile, JSON.stringify(messages, null, 2), (err) => {
      if (err) return res.status(500).send("Error saving message.");
      res.json({ message: newMessage });
    });
  });
});

app.listen(PORT, () => {
  console.log(`?? Birthday server is live at http://localhost:${PORT}`);
});
