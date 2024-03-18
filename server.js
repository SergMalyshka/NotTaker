const express = require('express');
const path = require('path');
const uuid = require('uuid')
const db = path.join(__dirname, '/db/db.json')

//heroku port selection
const PORT = process.env.PORT || 3001;

const app = express();
//helper files
const { readFromFile, readAndAppend, readAndDelete } = require(path.join(__dirname, '/helpers/fsUtils.js'));

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

//landing page
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

//get all notes from the storage
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile(db).then((data) => res.json(JSON.parse(data)));
}
);

//fallback route
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

//delete the note based off the id
app.delete('/api/notes/:id', (req, res) => {
  try {
    console.info(`${req.method} request received for a note`);
    const { id } = req.params;

    //helper method, takes ID and DB location
    readAndDelete(id, db)
    res.json("Delete request success")
  } catch {
    res.json("Delete request unsuccessful")
  }
})

app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to submit notes`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the note we will save
    const newNote = {
      title,
      text,
      id: uuid.v4()
    };

    //helper method
    readAndAppend(newNote, db);

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
  console.log(`App is listening on port ${PORT}`)
);