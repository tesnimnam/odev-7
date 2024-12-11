const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL bağlantısı
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'school'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// CRUD Endpoint'leri
// 1. CREATE: Yeni öğrenci ekleme
app.post('/students', (req, res) => {
    const { ad, soyad, bolumId } = req.body;
    const query = 'INSERT INTO ogrenci (ad, soyad, bolumId) VALUES (?, ?, ?)';
    db.query(query, [ad, soyad, bolumId], (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: 'Öğrenci eklendi', id: result.insertId });
    });
});

// 2. READ: Tüm öğrencileri listeleme
app.get('/students', (req, res) => {
    const query = 'SELECT * FROM ogrenci';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 3. READ: ID ile bir öğrenci bulma
app.get('/students/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM ogrenci WHERE ogrenciID = ?';
    db.query(query, [id], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// 4. UPDATE: Öğrenci bilgilerini güncelleme
app.put('/students/:id', (req, res) => {
    const { id } = req.params;
    const { ad, soyad, bolumId } = req.body;
    const query = 'UPDATE ogrenci SET ad = ?, soyad = ?, bolumId = ? WHERE ogrenciID = ?';
    db.query(query, [ad, soyad, bolumId, id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Öğrenci bilgileri güncellendi' });
    });
});

app.delete('/students/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM ogrenci WHERE ogrenciID = ?';
    db.query(query, [id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Öğrenci silindi' });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
