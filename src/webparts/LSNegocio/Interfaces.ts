export interface I_DiaAdmin {
    ID: number;
    Title: string;
    DiaASolicitar?: Date;
    Solicitante?: I_Usuario;
    SolicitanteId?: number;
    DiasHabiles?: number;
    Aprobador?: I_Usuario;
    AprobadorId?: number;
    FechaAprobacion?: string;
    MotivoRechazo?: string;
    EstadoSolicitud?: string;
    DiasSolicitados?: number;
    CargoAprobador?: string;    

}

export interface I_Empleado {
    ID: number;
    Title: string;
    Usuario?: I_Usuario;
    UsuarioId?: number;
    Area?: I_Area;
    AreaId?: number;
    DiaAdministrativo?: number;
    
}


export interface I_Area {
    ID: number;
    Title: string;//Nombre Interno del campo
}

export interface I_OperacionInterna {
    ID?: number;
    Estado:boolean;
    Mensaje?: string;
}

export interface I_Usuario {
    Id?: number;
    ID?: number;
    Title?: string;
    Email?: string;
    EMail?: string;
    LoginName?: string;
}

export interface I_Rol {
    ID?: number;
    Title?: string;
    EstadoFuncionario?: string;
    Area?: I_Area;
    AreaId?: number;
    Cargo?: string;
    Usuario?: I_Usuario;
    UsuarioId?: number;
    Filtro?: string;

}