require('dotenv').config(); // Load environment variables at the very top

const PORT = 8000;
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const apiKey = process.env.REACT_APP_API_KEY;


if (!apiKey) {
  console.error('REACT_APP_API_KEY is not defined in .env file');
  process.exit(1); // Exit the application if API key is not defined
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.json('hello world');
});

app.get('/movies', async (req, res) => {
  const endPoint = req.query.q || 'default';
  try {
    const response = await axios.get(
      `https://online-movie-database.p.rapidapi.com/auto-complete?q=${endPoint}`,
      {
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'online-movie-database.p.rapidapi.com',
        },
      }
    );

    const data = response.data;
    const filteredData = data.d.filter((item) => item.q === 'feature');
    res.json(filteredData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching movies' });
  }
});
