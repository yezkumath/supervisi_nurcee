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

export async function GET_Supervisi_Anggota() {
    let sql;
    try {
        sql = await connectToDatabase();
        const result = await sql.query`SELECT description FROM tb_approles where app_id=6 and app_roles=1 ORDER BY  description ASC`;
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



export async function POST_SUPERVISI(note:string, supervisi:string, kolaborator:string, id_ruang:string, category:string) {
    let sql;
    try {
        sql = await connectToDatabase();
        const result = await sql.query 
        `INSERT INTO tb_supervisi_nurce (note, nama_supervisi, nama_kolaborator, ruang, category)
        VALUES (${note},${supervisi},${kolaborator},${id_ruang},${category})`;
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
            CAST(create_at AS DATE) AS tanggal,
            ruang AS ruang,
            nama_supervisi AS supervisi,
            nama_kolaborator AS kolaborator
        FROM tb_supervisi_nurce
        WHERE CAST(create_at AS DATE) = ${date}`;
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
        const result = await sql.query`SELECT create_at as tanggal,note,category FROM tb_supervisi_nurce  WHERE ruang= ${ruang} AND nama_supervisi = ${supervisi} AND CAST(create_at AS DATE) = ${date}`;
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

  //  console.log(dateFrom,dateTo);
    if(instalasi === "A"){
        data = `SELECT 
                    CONVERT(DATE, update_at) AS date,
                    COUNT(CASE WHEN ruang = 'YOSEPH' THEN 1 END)  AS YOSEPH,
                    COUNT(CASE WHEN ruang = 'FRANSISKUS' THEN 1 END)  AS FRANSISKUS,
                    COUNT(CASE WHEN ruang = 'LUKAS' THEN 1 END)  AS LUKAS
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
                    COUNT(CASE WHEN ruang = 'MARIA 5 -VK' THEN 1 END)  AS Maria5,
                    COUNT(CASE WHEN ruang = 'MARIA 4' THEN 1 END)  AS Maria4,
                    COUNT(CASE WHEN ruang = 'THERESIA 3' THEN 1 END)  AS THERESIA3,
                    COUNT(CASE WHEN ruang = 'THERESIA 2' THEN 1 END)  AS THERESIA2,
                    COUNT(CASE WHEN ruang = 'THERESIA 1' THEN 1 END)  AS THERESIA1,
                    COUNT(CASE WHEN ruang = 'UP. JENAZAH' THEN 1 END)  AS JENAZAH
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
                    COUNT(CASE WHEN ruang = 'ANNA 1' THEN 1 END)  AS ANNA1,
                    COUNT(CASE WHEN ruang = 'ANNA 2' THEN 1 END)  AS ANNA2,
                    COUNT(CASE WHEN ruang = 'ANNA 3' THEN 1 END)  AS ANNA3,
                    COUNT(CASE WHEN ruang = 'ANNA 4' THEN 1 END)  AS ANNA4,
                    COUNT(CASE WHEN ruang = 'ANGELA-GABRIEL' THEN 1 END)  AS ANGELA_GABRIEL,
                    COUNT(CASE WHEN ruang = 'XAVERIUS' THEN 1 END)  AS XAVERIUS,
                    COUNT(CASE WHEN ruang = 'CAROLUS' THEN 1 END)  AS CAROLUS
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
    else if(instalasi === "N"){
        data = `SELECT 
                    CONVERT(DATE, update_at) AS date,
                    COUNT(CASE WHEN ruang = 'IGD-PU' THEN 1 END)  AS IGD_PU,
                    COUNT(CASE WHEN ruang = 'TPP-RI' THEN 1 END)  AS TPP_RI,
                    COUNT(CASE WHEN ruang = 'HAEMODIALISA' THEN 1 END)  AS HAEMODIALISA,
                    COUNT(CASE WHEN ruang = 'RAWAT INTENSIF DEWASA' THEN 1 END)  AS RAWAT_INTENSIF_DEWASA,
                    COUNT(CASE WHEN ruang = 'RAWAT INTENSIF ANAK' THEN 1 END)  AS RAWAT_INTENSIF_ANAK
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
      //  console.log(result.recordset);
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
            ruang,
            COUNT(CASE WHEN category = 'Complain' THEN 1 END)  AS Complain,
            COUNT(CASE WHEN category = 'Fasilitas' THEN 1 END)  AS Fasilitas,
            COUNT(CASE WHEN category = 'JKN7+' THEN 1 END)  AS JKN7
        FROM  
            tb_supervisi_nurce
        WHERE
            CONVERT(DATE, update_at) BETWEEN ${dateFrom} AND ${dateTo}
        GROUP BY 
            ruang
        ORDER BY 
            ruang`;
           // console.log(result.recordset);
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