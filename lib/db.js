import sql from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  //database: 'RSSESWORKSHOP',
  database: 'RSSES',
  options: {
    encrypt: true, // For Azure SQL Database
    trustServerCertificate: true, // For local development
  },
};


export async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log('Connected to SQL Server');
    return sql;
  } catch (err) {
    console.error('Error connecting to SQL Server:', err);
    throw err;
  }
}