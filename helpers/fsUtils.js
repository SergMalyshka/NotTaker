const fs = require('fs');
const util = require('util');

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);
/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      let parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

/**
 *  Counter method to the read and append, will delete a note with the specific ID
 *  @param {string} id The id of the note you would want to delete.
 *  @param {string} file The path to the file you want to delete from.
 *  @returns {void} Nothing
 */
const readAndDelete = (id, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      //parse the contents of the JSON file, loop through the notes, delete the note with the matching ID
      let parsedData = JSON.parse(data);
      for (let i = 0; i < parsedData.length; i++) {
        if (parsedData[i].id == id) {
          parsedData.splice(i, 1);
        }
      }
      //once the note is deleted, write the remaining notes back into the file
      writeToFile(file, parsedData);
    }
  });
}

module.exports = { readFromFile, writeToFile, readAndAppend, readAndDelete };
