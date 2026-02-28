export type TicketStatus = 'abierto' | 'proceso' | 'resuelto' | 'cerrado';
export type TicketType = 'tech' | 'admin' | 'info' | 'comment' | 'followup' | 'payments' | 'documentation';
export type Criticality = 'baja' | 'media' | 'alta' | 'critica';

export interface Attachment {
    name: string;
    type: 'image' | 'file';
    url: string;
}

export interface TicketMessage {
    id: number;
    user: string;
    role: string;
    timestamp: string;
    texto: string;
    isUser: boolean;
    hora: string;
    attachments?: Attachment[];
}

export interface Ticket {
    id: number;
    id_display: string;
    titulo: string;
    descripcion: string;
    status: TicketStatus;
    type: TicketType;
    critical: boolean;
    tiempo: string;
    mensajes_count: number;
    survey_required?: boolean;
    satisfaction_rating?: number;
    satisfaction_comment?: string;
    escalated?: boolean;
    escalated_to?: string | null;
    tienda: {
        razon_social: string;
        nombre_comercial: string;
    };
    contacto_adm: {
        nombre: string;
        apellido: string;
        numeros: string;
        correo: string;
    };
    mensajes: TicketMessage[];
}
