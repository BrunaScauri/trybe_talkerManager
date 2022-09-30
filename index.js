const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const crypto = require('crypto');

const valMidd = require('./midds/valMidd');
const valName = require('./midds/valName');
const valAge = require('./midds/valAge');
const valWatchedAt = require('./midds/valWatchedAt');
const valRate = require('./midds/valRate');
const valTalk = require('./midds/valTalk');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// endpoint do avaliador
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});
// endpoint do avaliador

const talkerFilePath = './talker.json';

const readingFile = async () => {
  const reading = await fs.readFile(talkerFilePath, 'utf-8');
  const talkers = JSON.parse(reading);
  return talkers;
};

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  const token = crypto.randomBytes(8).toString('hex');
    return res.status(HTTP_OK_STATUS).json({ token });
});

app.get('/talker/search', valMidd, async (req, res) => {
  const { q } = req.query;
  const talkers = await readingFile();
  const nameFilter = talkers.filter((talker) =>
    talker.name.toLowerCase().includes(q.toLowerCase()));
  if (nameFilter === []) {
    return res.status(200).json([]);
  }
  return res.status(200).json(nameFilter);
});

app.delete('/talker/:id', valMidd, async (req, res) => {
  const { id } = req.params;
  const talkers = await readingFile();
  const talkerId = talkers.filter((t) => t.id !== Number(id));
  fs.writeFile(talkerFilePath, JSON.stringify(talkerId, null, 2));
  return res.status(204).json();
});

app.put('/talker/:id', valMidd, valName, valAge, valTalk, valWatchedAt,
valRate, async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const { id } = req.params;
  const talkersInfo = await readingFile();
  const talkerId = talkersInfo.findIndex((t) => t.id === Number(id));
  talkersInfo[talkerId] = { ...talkersInfo[talkerId], name, age, talk: { watchedAt, rate } };
  const newTalker = talkersInfo.find((talker) => talker.id === Number(id));
  fs.writeFile(talkerFilePath, (talkersInfo[talkerId] = JSON.stringify(talkersInfo, null, 2)));

  return res.status(200).json(newTalker);
});

app.delete('/talker/:id', valMidd, async (req, res) => {
  const { id } = req.params;
  const reading = await readingFile();
  const talkerId = reading.filter((r) => r.id !== Number(id));
  fs.writeFile(talkerFilePath, JSON.stringify(talkerId, null, 2));
  return res.status(204).json();
});

app.get('/talker/:id', async (req, res) => {
  const reading = await fs.readFile(talkerFilePath, 'utf-8');
  const { id } = req.params;
  const talker = JSON.parse(reading).find((r) => r.id === Number(id));
  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  return res.status(200).json(talker);
}); 

app.post('/talker', valMidd, valName, valAge, valTalk,
 valAge, valWatchedAt, valRate, async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const talker = await readingFile();
  const idPrimary = talker[talker.length - 1].id;
  talker.push({ name, age, id: idPrimary + 1, talk: { watchedAt, rate } });
  fs.writeFile(talkerFilePath, JSON.stringify(talker, null, 2));
  return res.status(201).json(talker[talker.length - 1]);
  });
    
app.get('/talker', async (req, res) => {
  const reading = await readingFile();
  if (reading.length === 0) {
    return res.status(200).json([]);
  }   
  return res.status(200).json(reading);
});

app.listen(PORT, () => {
  console.log('Online');
});
