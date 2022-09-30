# Repositório do projeto de back-end Talker Manager!

# Habilidades

Neste projeto, foram verificadas as seguintes habilidades:

  * Desenvolvimento de uma API CRUD a partir de um banco de dados SQL local;
  * Desenvolvimento de alguns endpoints que irão ler e escrever em um arquivo utilizando o módulo `fs`.

### Como abrir o projeto:

1. Clone o repositório
  * `git clone https://github.com/BrunaScauri/trybe_talkerManager.git`.
2. Instale as dependências
  * `npm install`
3. Rode o server com o comando:
  * `npm run dev `
4. Para verificar os endpoints, basta usar apps como Postman ou Insomnia e fazer uma requisição:
  * `http://localhost:3000/rota-da-api`
4. Para verificar os testes, rode o comando:
  * `npm test nome-do-teste`

### Endpoints: 
    - GET `/talker` retorna toods os palestrantes da lista;
    - POST `/talker` adicionar um novo palestrante;
    - GET `/talker/:id` retorna um palestrante via id
    - PUT `/talker/:id`  edita uma pessoa palestrante com base no id da rota
    - DELETE `/talker/:id` deleta uma pessoa palestrante com base no id da rota
    - GET `/talker/search?q=searchTerm` retorna um array de palestrantes que contenham em seu nome o termo pesquisado no queryParam da URL.
    - POST `/login` criação de usuário
