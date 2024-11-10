export interface Chat {
    participantes: Array<{
      id: string;
      tipo: "estudiante" | "tutor";
    }>;
    tutoriaId: string;
    mensajes: Array<{
      remitenteId: string;
      mensaje: string;
      fechaEnvio: Date;
    }>;
    fechaCreacion: Date;
  }
  