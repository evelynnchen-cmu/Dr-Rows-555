const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

async function getTestimonials() {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const sheetId = '1J-0t68w8JCox-8MpMuZvq9B2Lj7ociugnehBq9kUGLc';
    const range = 'Form Responses 1!A:C';

    const response = await sheets.spreadsheets.values.get({
        auth: client,
        spreadsheetId: sheetId,
        range: range,
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return []; 

    return rows.slice(1).map(row => ({
        name: row[1],
        testimonial: row[2],
    }));
}

app.get('/testimonials', async (req, res) => {
    try {
        const testimonials = await getTestimonials();
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
