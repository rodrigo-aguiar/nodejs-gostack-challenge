const express = require("express");
const { v4: uuidv4 } = require('uuid');
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

function verifyRepositoryId(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({message: "Repository id not found"});
  }

  return next();
}

app.use("/repositories/:id", verifyRepositoryId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const {title, url, techs} = request.body;

  repositories.forEach(repository => {
    if (repository.id === id) {
      repository.title = title;
      repository.url = url;
      repository.techs = techs;
    }
  });

  const updatedRepository = repositories.find(repository => repository.id === id);

  return response.json(updatedRepository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  repositories.forEach(repository => {
    if (repository.id === id) {
      repository.likes++;
    }
  });

  const updatedRepository = repositories.find(repository => repository.id === id);

  return response.status(200).json(updatedRepository);
});

module.exports = app;
