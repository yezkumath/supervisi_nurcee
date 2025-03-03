'use server';
import { connectToDatabase } from '@/lib/db';


export async function GET_master_instalasi_ruang() {
    let sql;
    try {
        sql = await connectToDatabase();
        const result = await sql.query`SELECT * FROM master_instalasi_ruang`;
        return result.recordset; 
    } catch (error) {
        console.error("Error:", error);
        return null;
    } finally {
        if (sql) {
            await sql.close(); 
        }
    }
}


export async function POST_SUPERVISI(note:string, id_supervisi:string, id_ruang:string, category:string) {
    let sql;
    try {
        sql = await connectToDatabase();
        const result = await sql.query 
        `INSERT INTO tb_supervisi_nurce (note, id_supervisi,id_ruang,category)
        VALUES (${note},${id_supervisi},${id_ruang},${category})`;
        return result.recordset;
    } catch (error) {
        console.error("Error:", error);
        return null;
    } finally {
        if (sql) {
            await sql.close(); 
        }
    }
}


export async function GET_list_supervisi(date:string) {
    let sql;
    try {
        sql = await connectToDatabase();
        const result = await sql.query
        `SELECT DISTINCT 
            CAST(t.create_at AS DATE) AS tanggal,
            CONCAT(m.nama_ruangan, ' - ', m.instalasi) AS ruang_lengkap,
            t.id_ruang AS ruang,
            t.id_supervisi AS supervisi
        FROM tb_supervisi_nurce t
        JOIN master_instalasi_ruang m ON t.id_ruang = m.id_ruang
        WHERE CAST(t.create_at AS DATE) = ${date}`;
        return result.recordset;
    } catch (error) {
        console.error("Error:", error);
        return null;
    } finally {
        if (sql) {
            await sql.close(); 
        }
    }
}

export async function GET_detail_list_supervisi(ruang: string, supervisi:string, date:string) {
    let sql;
    try {
        sql = await connectToDatabase();
        const result = await sql.query`SELECT create_at as tanggal,note,category FROM tb_supervisi_nurce  WHERE id_ruang= ${ruang} AND id_supervisi = ${supervisi} AND CAST(create_at AS DATE) = ${date}`;
        return result.recordset;
    } catch (error) {
        console.error("Error:", error);
        return null;
    } finally {
        if (sql) {
            await sql.close(); 
        }
    }
}



export async function GET_instalasi_dataCategory(category:string, instalasi:string, dateFrom:Date , dateTo:Date) {
    let sql;
    let data;
    const formattedDateFrom = dateFrom.toISOString().split('T')[0]; // Converts to 'YYYY-MM-DD'
    const formattedDateTo = dateTo.toISOString().split('T')[0]; // Converts to 'YYYY-MM-DD'

    console.log(dateFrom,dateTo);
    if(instalasi === "A"){
        data = `SELECT 
                    CONVERT(DATE, update_at) AS date,
                    COUNT(CASE WHEN id_ruang = 'A_FRAS' THEN 1 END)  AS Fransiskus,
                    COUNT(CASE WHEN id_ruang = 'A_MD' THEN 1 END)  AS Magdalena,
                    COUNT(CASE WHEN id_ruang = 'A_YS' THEN 1 END)  AS Yosep
                FROM  
                    tb_supervisi_nurce

                WHERE
                    category = '${category}'
                    AND 
                        CONVERT(DATE, update_at) BETWEEN '${formattedDateFrom}' AND '${formattedDateTo}'
                GROUP BY 
                    CONVERT(DATE, update_at)
                    ORDER BY 
                    CONVERT(DATE, update_at);`;
    }else if(instalasi === "B"){
        data = `SELECT 
                    CONVERT(DATE, update_at) AS date,
                    COUNT(CASE WHEN id_ruang = 'B_MAR' THEN 1 END)  AS Maria,
                    COUNT(CASE WHEN id_ruang = 'B_THER' THEN 1 END)  AS Theresia
                FROM  
                    tb_supervisi_nurce

                WHERE
                    category = '${category}'
                    AND 
                        CONVERT(DATE, update_at) BETWEEN '${formattedDateFrom}' AND '${formattedDateTo}'
                GROUP BY 
                    CONVERT(DATE, update_at)
                    ORDER BY 
                    CONVERT(DATE, update_at);`;
    }else if(instalasi === "C"){
        data = `SELECT 
                    CONVERT(DATE, update_at) AS date,
                    COUNT(CASE WHEN id_ruang = 'C_ANG' THEN 1 END)  AS Anggela,
                    COUNT(CASE WHEN id_ruang = 'C_CARO' THEN 1 END)  AS Carolus,
                    COUNT(CASE WHEN id_ruang = 'C_XAV' THEN 1 END)  AS Xaverius
                FROM  
                    tb_supervisi_nurce
                WHERE
                    category = '${category}'
                    AND 
                        CONVERT(DATE, update_at)  BETWEEN '${formattedDateFrom}' AND '${formattedDateTo}'
                GROUP BY 
                    CONVERT(DATE, update_at)
                    ORDER BY 
                    CONVERT(DATE, update_at);`;
    }
    try {
        sql = await connectToDatabase();
        const result = await sql.query(data);
        console.log(result.recordset);
        return result.recordset;
    } catch (error) {
        console.error("Error:", error);
        return null;
    } finally {
        if (sql) {
            await sql.close(); 
        }
    }
}


export async function GET_fullCategory(dateFrom:Date , dateTo:Date) {
    let sql;
    try {
        sql = await connectToDatabase();
        const result = await sql.query
        `SELECT 
            m.nama_ruangan,
            COUNT(CASE WHEN t.category = 'Complain' THEN 1 END)  AS Complain,
            COUNT(CASE WHEN t.category = 'Fasilitas' THEN 1 END)  AS Fasilitas,
            COUNT(CASE WHEN t.category = 'Pasien4hari' THEN 1 END)  AS Pasien4hari
        FROM  
            tb_supervisi_nurce t
            JOIN master_instalasi_ruang m ON t.id_ruang = m.id_ruang

        WHERE
            CONVERT(DATE, update_at) BETWEEN ${dateFrom} AND ${dateTo}

        GROUP BY 
            m.nama_ruangan
        ORDER BY 
            m.nama_ruangan;`;
            console.log(result.recordset);
        return result.recordset;
    } catch (error) {
        console.error("Error:", error);
        return null;
    } finally {
        if (sql) {
            await sql.close(); 
        }
    }
}