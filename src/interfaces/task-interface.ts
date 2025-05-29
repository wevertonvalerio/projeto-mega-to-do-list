export interface Task {

    id?: number;
    titulo: string;
    descricao: string;
    data: Date;
    prioridade: 'baixa' | 'media' | 'alta';
    usuario_id: number;
    criada_em?: string;

}