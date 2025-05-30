import request from 'supertest';
import app from '../src/app';

describe('Testes de Usuário', () => {
  let token: string;

  it('Deve criar um usuário com nome e senha válidos', async () => {
    const res = await request(app).post('/usuario/register').send({
      nome: 'usuario1',
      senha: 'senha123',
    });
    console.log('Resposta:', res.body);
    expect(res.status).toBe(201);
    expect(res.body.usuario).toHaveProperty('id');
  });

  it('Não deve criar um usuário com nome vazio', async () => {
    const res = await request(app).post('/usuario/register').send({
      nome: '',
      senha: 'senha123',
    });
    expect(res.status).toBe(500);
  });

  it('Não deve criar um usuário com senha vazia', async () => {
    const res = await request(app).post('/usuario/register').send({
      nome: 'usuario2',
      senha: '',
    });
    expect(res.status).toBe(500);
  });

  it('Deve realizar login com nome e senha corretos', async () => {
    const res = await request(app).post('/usuario/login').send({
      nome: 'usuario1',
      senha: 'senha123',
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('Não deve realizar login com nome incorreto', async () => {
    const res = await request(app).post('/usuario/login').send({
      nome: 'usuario_incorreto',
      senha: 'senha123',
    });
    expect(res.status).toBe(404);
  });

  it('Não deve realizar login com senha incorreta', async () => {
    const res = await request(app).post('/usuario/login').send({
      nome: 'usuario1',
      senha: 'senha_errada',
    });
    expect(res.status).toBe(404);
  });

  it('Não deve realizar login com nome vazio', async () => {
    const res = await request(app).post('/usuario/login').send({
      nome: '',
      senha: 'senha123',
    });
    expect(res.status).toBe(400);
  });

  it('Não deve realizar login com senha vazia', async () => {
    const res = await request(app).post('/usuario/login').send({
      nome: 'usuario1',
      senha: '',
    });
    expect(res.status).toBe(400);
  });

  it.only('Deve realizar logout e invalidar o token', async () => {
    const res = await request(app)
      .post('/usuario/logout')
      .set('Authorization', `Bearer ${token}`);
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
    console.log('Token: ', userToken);

    // Listar Tasks
    const res = await request(app)
      .get('/tarefa/tasks')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(401);
  });

  it('Não deve excluir usuário sem estar logado', async () => {
    const res = await request(app).delete('/usuario/delete');
    expect(res.status).toBe(502);
  });

  it('Deve excluir usuário logado', async () => {
    // Primeiro, criar e logar um novo usuário
    await request(app).post('/usuario/register').send({
      nome: 'usuario3',
      senha: 'senha123',
    });
    const loginRes = await request(app).post('/usuario/login').send({
      nome: 'usuario3',
      senha: 'senha123',
    });
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
    expect(reloginRes.status).toBe(401);
  });
});