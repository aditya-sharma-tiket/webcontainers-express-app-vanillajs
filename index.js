import express from 'express';

const app = express();
const port = 8080;

app.get('/', (req, res) => {
    var temp=req.ip
  res.send(`Welcome to a WebContainers app ip : ${temp || 'undefined'} `);
});

app.listen(port, () => {
  console.log(`express server is live at ws://localhost:${port}`);
});
