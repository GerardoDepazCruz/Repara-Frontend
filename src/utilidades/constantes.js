export const API_URL = 'http://localhost:8080/api';
export const TOKEN_KEY = 'repara_token';
export const USUARIO_KEY = 'repara_usuario';

export const ROLES = {
  CLIENTE: 'CLIENTE',
  ADMIN: 'ADMIN',
  TECNICO: 'TECNICO',
};

export const ESTADOS_SOLICITUD = {
  EN_CREACION: 'En creación',
  PENDIENTE_ASIGNACION: 'Buscando técnico',
  ACEPTADA: 'Técnico asignado',
  PAGO_INICIAL_PENDIENTE: 'Esperando pago',
  EN_CAMINO: 'Técnico en camino',
  EN_DIAGNOSTICO: 'En diagnóstico',
  DIAGNOSTICO_NO_REPARABLE: 'No reparable',
  REPARACION_EN_PROCESO: 'Reparando',
  PAGO_FINAL_PENDIENTE: 'Esperando pago final',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado',
};