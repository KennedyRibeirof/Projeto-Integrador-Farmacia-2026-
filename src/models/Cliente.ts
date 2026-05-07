export interface Cliente {
  id?: number;
  nome_completo: string;
  email: string;
  senha: string;
  data_cadastro: Date;
}