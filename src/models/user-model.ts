// Importa utilitários do Sequelize:
// - DataTypes: para definir os tipos dos campos da tabela
// - Model: classe base que representa uma tabela no banco
// - Optional: utilitário do TypeScript para tornar alguns atributos opcionais
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/migrations"; // Importa a conexão com o banco de dados

/*
  Define a interface que representa os atributos de um usuário (User).
*/
export interface UserAttributes {
  id: number;     // Identificador único do usuário
  nome: string;   // Nome do usuário
  senha: string;  // Senha do usuário (armazenada como hash)
}

/*
  Define quais atributos são opcionais na hora de criar um novo usuário.
*/
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

/*
  Define a classe User, que representa a tabela de usuários.
  Ela estende a classe Model do Sequelize e implementa a interface UserAttributes.
*/
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public nome!: string;
  public senha!: string;
}

/*
  Inicializa o modelo User, definindo os campos da tabela e suas configurações.
*/
User.init(
  {
    // Campo ID (chave primária, auto incremento)
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    // Nome do usuário
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Senha do usuário (deve ser salva como hash)
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, // Conexão com o banco
    modelName: "User", // Nome do modelo no Sequelize
    tableName: "users", // Nome real da tabela no banco
    timestamps: false, // Desativa os campos `createdAt` e `updatedAt`

    // Índices no banco para melhorar a performance
    indexes: [
      { fields: ["nome"] }, // índice para buscas por nome
    ],
  }
);