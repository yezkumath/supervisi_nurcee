import sql from 'mssql';

const config = {
  user: 'sa',
  password: '51mr53developer.',
  server: '172.17.12.67', // e.g., 'localhost' or 'your-server-name.database.windows.net'
  // database: 'RSSESWORKSHOP',
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