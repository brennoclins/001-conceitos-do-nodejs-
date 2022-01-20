const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const userFound = users.find(user => user.username === username);
  
  if(!userFound) {
    return response.status(404).json({ error: "User not found!" });
  };

  // repassando o USER do meu meddleware para as rotas que chamarem ele
  request.user = userFound;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.find(
    user => user.username === username
  );

  if(userAlreadyExists) {
    return response.status(400).json({ error: "User already exists!"});
  }
   
  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(newUser);

  //console.log(newUser.id);
  return response.status(201).json(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;
  const { title, deadline } = request.body;

  const updateTodo = user.todos.find((todo) => todo.id === id);

  if(!updateTodo) {
    return response.status(404).json({error: "Todo not found!"});
  }
 
  updateTodo.title = title;
  updateTodo.deadline = new Date(deadline);

  return response.json(updateTodo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const updateTodo = user.todos.find((todo) => todo.id === id);

  if(!updateTodo) {
    return response.status(404).json({error: "Todo not found!"})
  }
 
  updateTodo.done = true;
 
  return response.json(updateTodo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  
  const deleteTodo = user.todos.find((todo) => todo.id === id);
  
  if(!deleteTodo) {
    return response.status(404).json({error: "Id not found!"});
  } 

  user.todos.splice(deleteTodo, 1);
  
  return response.status(204).send();
});

module.exports = app;