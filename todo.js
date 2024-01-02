const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 4000;

const uri = 'mongodb+srv://vspavipavi:7lsA87xsdEIIcBuZ@cluster0.q1hogvd.mongodb.net/Mydb';
mongoose.connect(uri)
  .then(() => console.log('DB connected'))
  .catch(err => console.error('Error connecting to DB:', err));

const todoSchema = new mongoose.Schema({
  taskName: String,
});

const Todo = mongoose.model('todos', todoSchema);

app.use(express.json());

app.get('/todos', async (req, res) => {
  try {
    const tasks = await Todo.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to add a new task
app.post('/todos', async (req, res) => {
  const { taskName } = req.body;
  const todo = new Todo({ taskName});
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


app.delete('/todos/:id', async (req, res) => {
  const id = req.params;
  try {
    await Todo.findByIdAndDelete(id);
    res.status(404);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
