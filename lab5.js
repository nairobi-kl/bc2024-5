const express = require('express');
const { Command } = require('commander');
const fs = require('fs').promises;
const http = require('http');
const path = require('path');

const program = new Command();
const app = express();

program
  .requiredOption('-h, --host <host>', 'Server host')
  .requiredOption('-p, --port <port>', 'Server port')
  .requiredOption('-c, --cache <path>', 'Path to cache');

program.parse(process.argv);

const options = program.opts();
const { host, port, cache } = options;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/UploadForm.html', async (req, res) => {
  const filePath = path.join(__dirname, 'UploadForm.html'); 
  try {
    const htmlForm = await fs.readFile(filePath, 'utf-8');
    res.send(htmlForm);
  } catch (err) {
    res.status(500).send('Error reading HTML form');
  }
});


app.get('/notes/:name', async (req, res) => {
  const name = req.params.name;
  const filePath = path.join(cache, `${name}.txt`);
   try {
    const text = await fs.readFile(filePath, 'utf-8');
    res.send(text);
  } catch {
    res.status(404).json({ error: 'Note not found' });
  }
});


const server = http.createServer(app);
server.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
