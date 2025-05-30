// Usado em auth-utils, se apagar da erro!

import { Request } from "express"; // Representa a requisição HTTP recebida pelo servidor.

/*
  O bloco abaixo é uma "declaração de módulo".
  Estamos dizendo ao TypeScript que queremos adicionar uma nova propriedade dentro do tipo 'Request' do Express.
  Isso é útil quando queremos extender ou personalizar o tipo original de uma biblioteca.
*/
declare module "express" {

  // Estamos adicionando/modificando a interface Request do Express
  export interface Request {
    
    /*
      Adicionamos uma nova propriedade chamada `user`.
      Essa propriedade é opcional (por isso o `?`), pois nem toda requisição vai ter um usuário logado.

      O objeto `user` terá um único campo:
      - id: número que representa o identificador do usuário autenticado (geralmente vem do banco de dados).

      Essa modificação permite que, em outras partes do código, possamos acessar:
        request.user?.id
      sem que o TypeScript reclame que `user` não existe no tipo Request.
    */
    user?: {
      id: number;
    };
  }
}