import request from 'supertest';
import app from '../src/app';
import { sequelize } from '../src/database/migrations';


describe('Testes de Usuário', () => {
  
  beforeEach(async () => {
    await sequelize.sync({ force: true }); // Zera o banco a cada teste
  });

  let token: string;

  it('Deve criar um usuário com nome e senha válidos', async () => {
    const res = await request(app).post('/usuario/register').send({
      nome: 'usuario1',
      senha: 'senha123',
    });

  console.log(res.body)
  
    expect(res.status).toBe(201);
    expect(res.body.usuario).toHaveProperty('id');
  });

  it('Não deve criar um usuário com nome vazio', async () => {
    const res = await request(app).post('/usuario/register').send({
      nome: '',
      senha: 'senha123',
    });

  console.log(res.body)

    expect(res.status).toBe(400);
  });

  it('Não deve criar um usuário com senha vazia', async () => {
    const res = await request(app).post('/usuario/register').send({
      nome: 'usuario2',
      senha: '',
    });

  console.log(res.body)

    expect(res.status).toBe(400);
  });

  it('Deve realizar login com nome e senha corretos', async () => {
  // Register
  await request(app).post('/usuario/register').send({
    nome: 'usuario1',
    senha: 'senha123',
  });

  // Faz login
  const res = await request(app).post('/usuario/login').send({
    nome: 'usuario1',
    senha: 'senha123',
  });

  console.log(res.body)

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('token');
});

  it('Não deve realizar login com nome incorreto', async () => {
    const res = await request(app).post('/usuario/login').send({
      nome: 'usuario_incorreto',
      senha: 'senha123',
    });

  console.log(res.body)

    expect(res.status).toBe(404);
  });

  it('Não deve realizar login com senha incorreta', async () => {
    const res = await request(app).post('/usuario/login').send({
      nome: 'usuario1',
      senha: 'senha_errada',
    });

  console.log(res.body)

    expect(res.status).toBe(404);
  });

  it('Não deve realizar login com nome vazio', async () => {
    const res = await request(app).post('/usuario/login').send({
      nome: '',
      senha: 'senha123',
    });

  console.log(res.body)

    expect(res.status).toBe(400);
  });

  it('Não deve realizar login com senha vazia', async () => {
    const res = await request(app).post('/usuario/login').send({
      nome: 'usuario1',
      senha: '',
    });

  console.log(res.body)

    expect(res.status).toBe(400);
  });

  it('Deve realizar logout e invalidar o token', async () => {
    // Register
    await request(app).post('/usuario/register').send({
      nome: 'usuario3',
      senha: 'senha123',
    });
    // Login
    const loginRes = await request(app).post('/usuario/login').send({
      nome: 'usuario3',
      senha: 'senha123',
    });

    //Token
    const userToken = loginRes.body.token;

    // Logout
    const res = await request(app)
      .post('/usuario/logout')
      .set('Authorization', `Bearer ${userToken}`);

  console.log(res.body)

    expect(res.status).toBe(202);
  });

  it('Deve bloquear uso de token inválido após logout', async () => {
    // Register
    await request(app).post('/usuario/register').send({
      nome: 'usuario3',
      senha: 'senha123',
    });
    // Login
    const loginRes = await request(app).post('/usuario/login').send({
      nome: 'usuario3',
      senha: 'senha123',
    });

    //Token
    const userToken = loginRes.body.token;

    //Logout
    const Logout = await request(app)
      .post('/usuario/logout')
      .set('Authorization', `Bearer ${userToken}`);
    expect(Logout.status).toBe(202);

    // Listar Tasks
    const res = await request(app)
      .get('/tarefa/tasks')
      .set('Authorization', `Bearer ${userToken}`);

  console.log(res.body)

    expect(res.status).toBe(411);
  });

  it('Não deve excluir usuário sem estar logado', async () => {
    const res = await request(app).delete('/usuario/delete');

  console.log(res.body)

    expect(res.status).toBe(402);
  });

  it('Deve excluir usuário logado', async () => {
    // Register
    await request(app).post('/usuario/register').send({
      nome: 'usuario3',
      senha: 'senha123',
    });
    // Login
    const loginRes = await request(app).post('/usuario/login').send({
      nome: 'usuario3',
      senha: 'senha123',
    });

    // Token
    const userToken = loginRes.body.token;

    // Excluir o usuário
    const res = await request(app)
      .delete('/usuario/delete')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(204);

    // Tentar logar novamente
    const reloginRes = await request(app).post('/usuario/login').send({
      nome: 'usuario3',
      senha: 'senha123',
    });

  console.log(res.body)

    expect(reloginRes.status).toBe(404);
  });
});

