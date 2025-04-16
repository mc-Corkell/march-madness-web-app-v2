const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const PORT = 3001;
const POLL_INTERVAL_MS = 1000; // change this to control polling speed
const SAMPLE_GAME_URL = 6384744; 
const HARD_CODE_TIME_FOR_TESTING = "00:46";

let clients = [];
let lastSeenFreethrowTime = null;


// SSE endpoint
app.get('/freethrows', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  setInterval(() => {
    clients.forEach(res => res.write(':\n\n')); // Sends a "keep-alive" message
  }, 15000); // Every 15 seconds

  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(c => c !== res);
  });
});

// Poll external API
setInterval(async () => {
  try {
    const response = await axios.get(`https://ncaa-api.henrygd.me/game/${SAMPLE_GAME_URL}/play-by-play`);
    const freeThrows = extractFreeThrows(response.data);
    const newestFreethrowTime = freeThrows.length > 0 ? freeThrows.at(-1).time : null;

    if (JSON.stringify(newestFreethrowTime) !== JSON.stringify(lastSeenFreethrowTime)) {
      lastSeenFreethrowTime = newestFreethrowTime;
      // test
      lastSeenFreethrowTime = HARD_CODE_TIME_FOR_TESTING;
      console.log(freeThrows);
      const payload = `data: ${JSON.stringify(freeThrows)}\n\n`;
      clients.forEach(res => res.write(payload));
    }
  } catch (err) {
    console.error('Polling failed:', err);
  }
}, POLL_INTERVAL_MS);


function isFreeThrow(play) { 
  return isFreeThrowMiss(play) || isFreeThrowMade(play);
}

function isFreeThrowMiss(play) { 
  return play.homeText.includes("Free Throw MISSED") || play.visitorText.includes("Free Throw MISSED");
}

function isFreeThrowMade(play) { 
  // two trailing spaces indicate the freethrow was not missed, aka it was made
  return play.homeText.includes("Free Throw  ") || play.visitorText.includes("Free Throw  ");
}

// Function to filter homeText and visitorText for "Free Throw"
function extractFreeThrows(data) {
  const freeThrows = [];

  data.periods.forEach(period => {
    period.playStats.forEach(play => {
      if (isFreeThrow(play)) {
        freeThrows.push({ time: play.time, homeText: play.homeText, visitorText: play.visitorText });
      }
    });
  });
  return freeThrows;
}

app.get('/api/data', (req, res) => {
  res.json({message: "Hello, Katie"});
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
