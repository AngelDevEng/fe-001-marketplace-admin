export type Priority = 'Baja' | 'Media' | 'Alta' | 'Crítica';
export type TicketStatus = 'Abierto' | 'En Proceso' | 'Resuelto' | 'Cerrado' | 'Reabierto';
export type ActionType = 'Escalamiento' | 'Cierre' | 'Respuesta' | 'Asignación' | 'Cambio Prioridad';

export interface User {
    id: number;
    nombre: string;
    empresa?: string;
}

export interface Message {
    id: number;
    usuario: string;
    contenido: string;
    timestamp: string;
    archivo?: string | null;
    leido: boolean;
    tipo?: 'normal' | 'respuesta_rapida' | 'escalamiento' | 'sistema';
}

export interface Ticket {
    id: number;
    numero: string;
    asunto: string;
    descripcion: string;
    vendedor: User;
    admin_asignado: User;
    categoria: string;
    prioridad: Priority;
    estado: TicketStatus;
    fecha_creacion: string;
    fecha_actualizacion: string;
    total_mensajes: number;
    mensajes_sin_leer: number;
    mensajes: Message[];
}

export interface FAQArticle {
    id: number;
    titulo: string;
    categoria: string;
    contenido: string;
    visitas: number;
    util_si: number;
    util_no: number;
    palabras_clave: string[];
}

export interface AuditEntry {
    id: number;
    tienda: string;
    accion: ActionType;
    timestamp: string;
    responsable: string;
    detalles: string;
}

export interface Admin {
    id: number;
    nombre: string;
    rol: string;
}

export interface MesaAyudaData {
    tickets: Ticket[];
    faq: FAQArticle[];
    vendedores: User[];
    admins: Admin[];
    auditoria: AuditEntry[];
}
