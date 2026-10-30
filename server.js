const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Anthropic } = require('@anthropic-ai/sdk');
const nodemailer = require('nodemailer');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const SHEETS_URL = process.env.SHEETS_URL || 'https://script.google.com/macros/s/AKfycbyWMfNZhL7Z_xr19a7u9mONM8w3N-A_ING9RUNDGQka_13q4i7b9Vk8oEVawQ_gqYDowg/exec';

const anthropic = new Anthropic();

app.use(express.json({ limit: '25mb' }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

require('./clavdivs')(app, anthropic);

const ORG_CODES = {
  'PS-TRIAL-001': { org: 'Internal Trial' },
  'PS-TRIAL-002': { org: 'Internal Trial' },
  'PS-TRIAL-003': { org: 'Internal Trial' },
  'PS-DEMO-001': { org: 'Demo Session' },
  'CLAVDIVS': { org: 'Clavdivs' }
};
