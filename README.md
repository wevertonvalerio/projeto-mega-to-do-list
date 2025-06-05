# 📌 Mega To-Do
 
## 📖 Introdução

Este repositório contém **apenas o backend** de um projeto web completo do tipo **to-do list**, desenvolvido para o **processo seletivo da MegaJúnior**.

O projeto está dividido em três partes, cada uma com seu próprio repositório:

- 🔙 [Backend (este repositório)](https://github.com/wevertonvalerio/projeto-mega-to-do-list/tree/main)
- 📟 ([Figma](https://www.figma.com/design/4FB017cTA2qMRyysZkdmEc/Mega-To-do?node-id=4-2&p=f))
- 🌐 [Frontend](link_frontend)
- 📱 [Mobile](link_mobile)

Essas três aplicações **se comunicam entre si** para entregar uma solução integrada e funcional.

Este backend é responsável por **armazenar, processar e fornecer dados via API REST** para os demais sistemas.

🔗 Acompanhe a MegaJúnior nas redes sociais:  
[Instagram da MegaJúnior](https://www.instagram.com/megaufms/)  
[LinkedIn da MegaJúnior](https://br.linkedin.com/company/megajr)  
[Site da MegaJúnior](https://www.megajunior.com.br/)

## 🛠️ Tecnologias Utilizadas

O backend deste projeto foi desenvolvido com as seguintes tecnologias:

- **Node.js** – ambiente de execução JavaScript no servidor
- **TypeScript** – linguagem tipada que compila para JavaScript
- **Express** – framework web para Node.js
- **Nodemon** (opcional) – reinicia o servidor automaticamente ao salvar arquivos

## ⚙️ Pré-requisitos  
Antes de começar, instale o seguinte no seu computador (caso **não use Codespaces**):

- [ ] [Git](https://git-scm.com/) – para clonar o repositório e colaborar via Git
- [ ] [Node.js](https://nodejs.org/) (versão 18 ou superior) – inclui o `npm`
- [ ] [Visual Studio Code](https://code.visualstudio.com/) – recomendado para editar o projeto
- [ ] [SQLite](https://www.sqlite.org/) – banco de dados
- [ ] [Express](https://expressjs.com/pt-br/) – framework para Node.js

### SQLite
- Instale o Sequelize e o driver do SQLite pelo terminal utilizando esse comando:
`npm install sequelize sqlite3`

- Instale os tipos do Sequelize para TypeScript pelo terminal utilizando esse comando:
`npm install --save-dev @types/sequelize`

### Express Validator
- Instale o Express Validator pelo terminal utilizando esse comando:
`npm install express-validator`

- Instale os tipos do Express Validator para TypeScript pelo terminal utilizando esse comando:
`npm install --save-dev @types/express-validator`

## 📁 Organização das Pastas

A estrutura de pastas do projeto backend segue um padrão baseado na **arquitetura MVC (Model - View - Controller)** para facilitar a manutenção, leitura e escalabilidade do código.

```bash
projeto-mega-to-do-list/
│
├── /config                                # Arquivos de configuração (ex.: conexões com banco, JWT, etc.)
│     └── db.ts                            # Configuração do banco de dados
│     └── jwt.ts                           # Configuração de autenticação JWT
│     └── tsconfig.json                    # Configurações do TypeScript
|
├── /src                                    # Código fonte do projeto
|
|     └── /controllers                     # Controladores que lidam com as requisições e respostas
│             └── task-controller.ts       # Funções de cadastro, edição, exclusão e listagem de tarefas
│             └── user-controller.ts       # Funções de cadastro, login, logout e exclusão de contas de usuário
│
|     └── /database                        # Arquivos relacionados ao banco de dados
│             └── migrations.ts            # Scripts para migração de banco
│
|     └── /middlewares                     # Middlewares para controle de requisições (autenticação, validação, etc.)
│             └── auth-middleware.ts       # Middleware para verificar token JWT
│             └── validation-middleware.ts # Middleware para validação de dados da requisição
│
|     └── /models                          # Modelos de dados (entidades que representam os dados)
│             └── task-model.ts            # Modelo de tarefa com os atributos: título, descrição, prioridade, etc.
│             └── user-model.ts            # Modelo de usuário com atributos: nome, email, senha, etc.
│
|     └── /routes                          # Definição das rotas da API
│             └── task-routes.ts           # Rotas para as tarefas (CRUD)
│             └── user-routes.ts           # Rotas para o usuário (login, cadastro, etc.)
│
|     └── /services                        # Lógica de negócios, manipulação de dados e interações com o banco de dados
│             └── task-service.ts          # Lógica relacionada a tarefas
│             └── user-service.ts          # Lógica relacionada a usuários
│
|     └── /types                           # Lógica de negócios, manipulação de dados e interações com o banco de dados
|             └── /express                 # Lógica de negócios, manipulação de dados e interações com o banco de dados
│                     └── index.d.ts       # Lógica relacionada a tarefas
│
|     └── /utils                           # Funções utilitárias (ex.: formatação de dados, validações)
│             └── formatters.ts            # Funções de formatação de dados, como formatação de data e hora
│             └── validators.ts            # Funções de validação de dados, como CPF, etc.
│
|     └── app.ts                           # Arquivo principal da aplicação, onde começa a rodar a aplicação
|     └── server.ts                        # Onde o servidor Express é configurado
|
├── /tests                                 # Testes da aplicação
│     └── task.test.ts                     # Testes para a lógica de tarefas
│     └── user.test.ts                     # Testes para a lógica de usuários
│
├── .env                                   # Arquivo para configurar JWT_SECRET
├── .gitignore                             # Arquivo para ignorar arquivos no Git
├── database.sqlite                        # Arquivo local de banco de dados SQLite.
├── jest.config.ts                         # Arquivo de configuração do framework de testes Jest escrito em TypeScript.
├── package-lock.json                      # Trava de versões das dependências
├── package.json                           # Gerenciador de dependências e scripts do projeto
├── README.md                              # Instruções do projeto
├── tsconfig.json                          # Arquivo que define as configurações de compilação do TypeScript em um projeto.
└── yarn.lock                              # Arquivo que registra as versões exatas das dependências instaladas com o Yarn para garantir builds reproduzíveis.
```

## Executar testes

Para executar os testes com Jest, TypeScript e SQLite em memória instale as dependências necessárias pelo terminal:

`npm install --save-dev jest ts-jest @types/jest supertest @types/supertest`

Execute os testes:

`npm test`

Ou, se quiser ver os testes rodando com mais detalhes:

`npm test -- --verbose`

Se quiser rodar apenas um arquivo:

`npx jest tests/task.test.ts`
`npx jest tests/user.test.ts`
