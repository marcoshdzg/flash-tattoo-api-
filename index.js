
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt requerido' });

  try {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.goto('https://www.mage.space/', { waitUntil: 'networkidle2' });
    await page.waitForSelector('textarea');
    await page.type('textarea', prompt);
    await page.keyboard.press('Enter');

    await page.waitForSelector('img.generated-img', { timeout: 120000 });
    const imageUrl = await page.$eval('img.generated-img', el => el.src);

    await browser.close();
    res.json({ image_url: imageUrl });

  } catch (error) {
    console.error('Error al generar imagen:', error);
    res.status(500).json({ error: 'Error al generar imagen', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Flash Tattoo API activa 🚀');
});

app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
