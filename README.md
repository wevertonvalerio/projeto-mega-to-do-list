# 📌 Mega To-Do
 
## 📖 Introdução

Este repositório contém **apenas o backend** de um projeto web completo do tipo **to-do list**, desenvolvido para o **processo seletivo da MegaJúnior**.

O projeto está dividido em três partes, cada uma com seu próprio repositório:

- 🔙 [Backend (este repositório)](https://github.com/wevertonvalerio/projeto-mega-to-do-list/tree/main)
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

## ⚠️ Importante: Se estiver usando os computadores da faculdade

Nos computadores da faculdade, **você provavelmente não terá permissão de administrador**, então:

- **Não será possível instalar o Node.js, Git ou VS Code**
- **Não será possível gerar nem configurar chave SSH**
- **Terá dificuldade de programar localmente com Git**

❗ **Recomendação**: nesses casos, use o **[GitHub Codespaces](#-usando-o-github-codespaces-recomendado)**, que permite programar direto do navegador sem precisar instalar nada.  
Ele já vem com Git, Node.js, terminal e extensões prontos para uso.

## ⚙️ Pré-requisitos  
Antes de começar, instale o seguinte no seu computador (caso **não use Codespaces**):

- [ ] [Git](https://git-scm.com/) – para clonar o repositório e colaborar via Git
- [ ] [Node.js](https://nodejs.org/) (versão 18 ou superior) – inclui o `npm`
- [ ] [Visual Studio Code](https://code.visualstudio.com/) – recomendado para editar o projeto
- [ ] [SQLite](https://www.sqlite.org/) – banco de dados

### SQLite
- Instale o Sequelize e o driver do SQLite pelo terminal utilizando esse comando:
`npm install sequelize sqlite3`

- Instale os tipos do Sequelize para TypeScript pelo terminal utilizando esse comando:
`npm install --save-dev @types/sequelize`


## 💻 Usando o GitHub Codespaces (Recomendado)

O GitHub Codespaces permite programar direto do navegador, sem precisar instalar nada.

### Como abrir o projeto no Codespaces:

1. Acesse o repositório no GitHub  
2. Clique no botão verde `<> Code`  
3. Vá na aba `Codespaces`  
4. Clique em `Create codespace on main`  
5. Aguarde enquanto ele configura tudo  
6. Comece a programar direto do navegador  
7. Ou clique em **"Open in VS Code"** para usar o VS Code instalado

> **Obs:** o Codespaces já vem com Git, terminal e extensões configuradas.

## 📚 Guia Básico de Git

### 🔐 Configurando o Git com chave SSH

Para configurar uma chave SSH e evitar digitar sua senha toda vez que usar o Git, siga a documentação oficial:

🔗 [Como gerar e adicionar uma chave SSH no GitHub](https://docs.github.com/pt/authentication/connecting-to-github-with-ssh)

### 🔁 Clonando um repositório

Para clonar este ou qualquer repositório em sua máquina local, siga:

🔗 [Como clonar um repositório do GitHub](https://docs.github.com/pt/repositories/creating-and-managing-repositories/cloning-a-repository)

### 🔄 Atualizar o repositório local (git pull)

Sempre antes de começar a programar, sincronize com o repositório remoto:

🔗 [Como usar o git pull](https://www.atlassian.com/git/tutorials/syncing/git-pull)

### 🚀 Enviar alterações para o GitHub (git push)

Depois de fazer mudanças no código, siga esses passos para enviar ao repositório:

🔗 [Como usar o git push](https://www.atlassian.com/git/tutorials/syncing/git-push)

### ℹ️ Resumo

| Comando                | Para que serve                         |
|------------------------|----------------------------------------|
| `git clone`            | Copiar um repositório para sua máquina |
| `git pull origin main` | Atualizar com o que está no GitHub     |
| `git add .`            | Adicionar todas as alterações          |
| `git commit -m ""`     | Salvar as alterações localmente        |
| `git push origin main` | Enviar suas alterações para o GitHub   |

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
|     └── app.ts                           # Arquivo principal da aplicação, onde o servidor Express é configurado
|
├── /tests                                 # Testes da aplicação
│     └── task.test.ts                     # Testes para a lógica de tarefas
│     └── user.test.ts                     # Testes para a lógica de usuários
│
├── .dockerignore                          # Arquivo para ignorar arquivos no Docker
├── .gitignore                             # Arquivo para ignorar arquivos no Git
├── docker-compose.yml                     # Arquivo docker-compose para orquestrar containers
├── Dockerfile                             # Arquivo de configuração do Docker
├── package-lock.json # Trava de versões das dependências
├── package.json # Gerenciador de dependências e scripts do projeto
└── README.md # Instruções do projeto
```

## ✅ Boas Práticas

Para manter o projeto organizado e facilitar o trabalho em equipe, siga estas boas práticas:

### 🧹 Organização

- Mantenha cada funcionalidade no seu diretório correspondente (`controllers`, `routes`, `services`, etc).
- Nomeie arquivos e pastas em **kebab-case** (ex: `create-task.service.ts`).

### ✍️ Commits

- Escreva mensagens de commit claras e descritivas.
- Use convenções como:
  - `feat:` para novas funcionalidades
  - `fix:` para correções de bugs
  - `refactor:` para melhorias no código
  - `docs:` para mudanças na documentação

Exemplo:
```bash
git commit -m "feat: adiciona criação de tarefas"
```

### 🔁 Sincronização

- Sempre dê `git pull` antes de começar a programar para garantir que está com a versão mais atual do código.
- Faça `git push` com frequência para compartilhar suas alterações com o grupo e evitar conflitos.
- Se estiver trabalhando com branches, sempre verifique se está na branch correta com `git branch`.

### 🚫 Não faça isso

- ❌ Não edite arquivos diretamente na branch `main` sem combinar com o grupo.
- ❌ Não suba arquivos desnecessários, como:
  - `node_modules/`
  - Arquivos temporários do editor (ex: `.vscode/`, `.DS_Store`)
  - Esses arquivos devem estar listados no `.gitignore`.

### ✅ Faça isso

- ✅ Crie branches para novas funcionalidades quando necessário (`git checkout -b nome-da-feature`).
- ✅ Escreva commits claros e com mensagens curtas e descritivas.
- ✅ Avise o grupo sobre qualquer mudança importante.
- ✅ Teste suas alterações antes de enviar (`git push`).
- ✅ Mantenha o padrão de código e organização definido pelo grupo.

Seguindo essas práticas, o trabalho em equipe flui melhor e o projeto continua limpo e funcional para todos.

## Executar testes

Para executar os testes com Jest, TypeScript e SQLite em memória instale as dependências necessárias pelo terminal:

`npm install --save-dev jest ts-jest @types/jest @types/node @types/express`

Execute os testes:

`NODE_ENV=test npm test`