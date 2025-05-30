import { Request, Response, NextFunction, RequestHandler } from "express";
import { validationResult } from "express-validator";

/**
 * Middleware Express para validar os dados da requisição usando express-validator.
 * 
 * Essa função verifica se existem erros de validação gerados pelas validações 
 * definidas nas rotas (com express-validator). Caso haja erros, responde com
 * status 400 e um objeto JSON contendo os erros formatados. Caso contrário,
 * permite que a requisição prossiga para o próximo middleware ou controller.
 * 
 * @param req - Objeto da requisição HTTP do Express.
 * @param res - Objeto da resposta HTTP do Express.
 * @param next - Função para passar para o próximo middleware.
 */
export const validarRequisicao: RequestHandler = (req, res, next) => {
  // Obtém o resultado da validação feita anteriormente (se houver)
  const errors = validationResult(req);

  // Se houver erros, processa e retorna uma resposta 400 com os erros
  if (!errors.isEmpty()) {
    // Mapeia os erros para um formato customizado: só com o campo e mensagem
    const formatados = errors.array().map(e => {
      // O cast é para garantir a tipagem correta do erro
      const err = e as unknown as { param: string; msg: string };
      return {
        campo: err.param,     // nome do campo que gerou o erro
        mensagem: err.msg,    // mensagem explicativa do erro
      };
    });

    // Envia resposta com status 400 (Bad Request) e os erros formatados
    res.status(400).json({ erros: formatados });
    return;  // Importante para interromper o fluxo da requisição aqui
  }

  // Se não há erros, chama o próximo middleware/controller
  next();
};