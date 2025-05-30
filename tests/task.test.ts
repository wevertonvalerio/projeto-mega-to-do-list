import request from 'supertest';
import app from '../src/app';
import { sequelize } from '../src/database/migrations';
import { User } from '../src/models/user-model';

let token!: string;
let taskId!: number;
let user2Id!: number;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const res = await request(app).post('/usuario/register').send({
    nome: 'usuario1',
    senha: 'senha123',
  });

  const login = await request(app).post('/usuario/login').send({
    nome: 'usuario1',
    senha: 'senha123',
  });

  token = login.body.token;

  await request(app).post('/usuario/register').send({
    nome: 'usuario2',
    senha: 'senha456',
  });

  const user2 = await User.findOne({ where: { nome: 'usuario2' } });
  if (user2) user2Id = user2.id;
});

// Funções de teste
function testCriarTarefaValida() {
  it('Deve criar uma tarefa válida', async () => {
    const res = await request(app)
      .post('/tarefa/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Minha primeira tarefa',
        description: 'Estudar Node.js',
        priority: 'alta',
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Minha primeira tarefa');
    taskId = res.body.id;
  });
}

function testCriarTarefaSemAutenticacao() {
  it('Não deve criar tarefa sem estar autenticado', async () => {
    const res = await request(app).post('/tarefa/tasks').send({
      title: 'Tarefa não autorizada',
    });
    expect(res.status).toBe(401);
  });
}

function testCriarTarefaInvalida() {
  it('Não deve criar tarefa com dados inválidos', async () => {
    const res = await request(app)
      .post('/tarefa/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '',
        priority: 'desconhecida',
      });
    expect(res.status).toBe(400);
  });
}

function testEditarTarefaValida() {
  it('Deve editar tarefa válida', async () => {
    const res = await request(app)
      .put(`/tarefa/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Tarefa editada',
        description: 'Conteúdo alterado',
        priority: 'média',
        completed: true,
      });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Tarefa editada');
    expect(res.body.completed).toBe(true);
  });
}

function testEditarTarefaInexistente() {
  it('Não deve editar tarefa que não existe', async () => {
    const res = await request(app)
      .put('/tarefa/tasks/9999')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Teste' });
    expect(res.status).toBe(404);
  });
}

function testEditarTarefaOutroUsuario() {
  it('Não deve editar tarefa de outro usuário', async () => {
    const loginRes = await request(app).post('/usuario/login').send({
      nome: 'usuario2',
      senha: 'senha123',
    });
    const token2 = loginRes.body.token;

    const tarefaRes = await request(app)
      .post('/tarefa/tasks')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        title: 'Tarefa do outro usuário',
        priority: 'baixa',
      });

    const outraTaskId = tarefaRes.body.id;

    const res = await request(app)
      .put(`/tarefa/tasks/${outraTaskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tentativa de invasão' });

    expect(res.status).toBe(403);
  });
}

function testExcluirTarefaValida() {
  it('Deve excluir tarefa válida', async () => {
    const res = await request(app)
      .delete(`/tarefa/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
}

function testExcluirTarefaInexistente() {
  it('Não deve excluir tarefa que não existe', async () => {
    const res = await request(app)
      .delete('/tarefa/tasks/9999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
}

function testExcluirTarefaOutroUsuario() {
  it('Não deve excluir tarefa de outro usuário', async () => {
    const loginRes = await request(app).post('/usuario/login').send({
      nome: 'usuario2',
      senha: 'senha123',
    });
    const token2 = loginRes.body.token;

    const tarefaRes = await request(app)
      .post('/tarefa/tasks')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        title: 'Tarefa protegida',
        priority: 'baixa',
      });

    const outraTaskId = tarefaRes.body.id;

    const res = await request(app)
      .delete(`/tarefa/tasks/${outraTaskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
}

function testListarTarefasUsuarioLogado() {
  it('Deve listar todas as tarefas do usuário logado', async () => {
    const res = await request(app)
      .get('/tarefa/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
}

// Executa todos os testes
describe('Rotas de tarefas', () => {
  testCriarTarefaValida();
  // testCriarTarefaSemAutenticacao();
  // testCriarTarefaInvalida();
  // testEditarTarefaValida();
  // testEditarTarefaInexistente();
  // testEditarTarefaOutroUsuario();
  // testExcluirTarefaValida();
  // testExcluirTarefaInexistente();
  // testExcluirTarefaOutroUsuario();
  // testListarTarefasUsuarioLogado();
});

afterAll(async () => {
  await sequelize.close();
});