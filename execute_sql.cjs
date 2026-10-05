const fs = require('fs');
const { Client } = require('pg');

const runSQL = async () => {
  const client = new Client({
    connectionString: "postgresql://postgres:057112Tufi!@db.ywnkfuifnyacaxamgkut.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Bağlantı başarılı!");
    const sql = fs.readFileSync('fix_final.sql', 'utf8');
    await client.query(sql);
    console.log("Bütün RLS kilitleri açıldı ve şemalar güncellendi!");
  } catch (err) {
    console.error("Hata:", err.message);
  } finally {
    await client.end();
  }
};

runSQL();
