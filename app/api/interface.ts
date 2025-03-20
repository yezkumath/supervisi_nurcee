export interface MasterInstalasiRuang {
    id_ruang: string;      
    nama_ruangan: string;
    instalasi: string;
}

export interface ListDataSupervisi{
    tanggal: Date;
    ruang_lengkap:string;
    ruang: string;
    supervisi:string;
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
    nama_ruangan:string;
    Complain:number;
    Fasilitas:number;
    Pasien4hari:number;
}