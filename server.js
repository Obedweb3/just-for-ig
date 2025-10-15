const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/api/instagram', async (req, res) => {
  const igUrl = req.query.url;
  if (!igUrl) return res.json({ success: false, message: "Missing URL" });

  try {
    const apiUrl = `https://instagram-downloader-api.vercel.app/api?url=${encodeURIComponent(igUrl)}`;
    const response = await fetch(apiUrl);
    const json = await response.json();

    if (!json.success || !json.data?.url) {
      return res.json({ success: false, message: "Media not found or unsupported." });
    }

    res.json({
      success: true,
      media: {
        url: json.data.url,
        type: json.data.type,
        title: json.data.title || "Instagram Media"
      }
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
