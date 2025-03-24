export interface MasterInstalasiRuang {
    id_ruang: string;      
    nama_ruangan: string;
    instalasi: string;
}

export interface ListDataSupervisi{
    tanggal: Date;
    ruang: string;
    supervisi:string;
    kolaborator:string;
}

export interface Collaborator {
    description: string;
  }

export interface DetailSupervisi{
    tanggal: Date;
    note:string;
    category:string;
}

export interface Instalasi_DataCategory {
    date: string; // Store date as a Date object
    [key: string]: number | string; // Allows dynamic keys for categories while keeping date as Date
}


export interface dataRadarChart{
    ruang:string;
    Complain:number;
    Fasilitas:number;
    JKN7:number;
}