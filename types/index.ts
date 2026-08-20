export interface Servicio {
  id: string;
  barberia_id: string;
  nombre: string;
  precio: number;
  duracion_minutos: number;
}

export interface Cita {
  id: string;
  barberia_id: string;
  servicio_id: string;
  cliente_nombre: string;
  cliente_telefono: string;
  fecha_hora: string;
  metodo_pago: 'PRESENCIAL' | 'TRANSFERENCIA';
  comprobante_url?: string;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
}
