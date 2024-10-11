import express, { type Request, type Response } from 'express';

const app = express();
const port = 3000;

let data = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const randomId = () => {
  const range = 9999 - 99 + 1;
  const randomNumber = Math.floor(Math.random() * range) + 99;
  const id = randomNumber.toString().padStart(4, '0');

  return id;
};

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.get('/api/persons', (req: Request, res: Response) => {
  res.json(data);
});

app.get('/info', (req: Request, res: Response) => {
  res.send(`Phonebook has info for ${data.length} people <br/> ${new Date()}`);
});

app.get('/api/persons/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const person = data.find((p) => p.id === id);

  if (!person) {
    return res.status(404).json({
      message: `Person with id: ${id} not found`,
    });
  }

  return res.json(person);
});

app.delete('/api/persons/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  data = data.filter((p) => p.id !== id);

  return res.status(204).end();
});

app.post('/api/persons', (req: Request, res: Response) => {
  const newId = randomId();

  const person = req.body;
  person.id = newId;
  // Validar datos llenos
  if (!person.name || !person.number) {
    return res.status(400).json({
      error: 'name or number missing',
    });
  }

  // Validar nombre duplicado
  const nameExists = data.some((p) => p.name === person.name);

  if (nameExists) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }

  data.push(person);

  return res.status(201).json(person);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
