const express = require('express');
const path = require('path');
const uuid = require('uuid')

const PORT = 3001;

const app = express();
const { readFromFile, readAndAppend, readAndDelete} = require('./helpers/fsUtils');

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve up static assets from the public folder
app.use(express.static('public'));

// This view route is a GET route for the homepage
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
}
);

// This view route is a GET route for the feedback page
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
}
);

app.delete('/api/notes/:id', (req, res) => {
    console.info(`${req.method} request received for a note`);
    const { id } = req.params;
    readAndDelete(id, `./db/db.json`)
    res.json("Delete request success")
})

app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to submit notes`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id: uuid.v4()
      };
  
      readAndAppend(newNote, './db/db.json');
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      res.json(response);
    } else {
      res.json('Error in posting new note');
    }
  });

  app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);