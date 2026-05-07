export interface Venda {
  id?: number;
  id_cliente: number;
  endereco: string;
  data_venda: Date;
  valor: number;
  status_venda: string;
}