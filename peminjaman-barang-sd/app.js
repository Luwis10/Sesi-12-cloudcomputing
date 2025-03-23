const express = require('express');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'rahasia-anak-sd',
    resave: false,
    saveUninitialized: true
}));

// Data sementara (simulasi database)
let barangList = [
    { id: 1, nama: 'Buku Tulis', status: 'Tersedia' },
    { id: 2, nama: 'Pensil', status: 'Tersedia' }
];

// Middleware untuk cek login
function isAuthenticated(req, res, next) {
    if (req.session.loggedin) {
        return next();
    }
    res.redirect('/login');
}

// Rute: Halaman Login
app.get('/login', (req, res) => {
    res.render('login', { pesan: '' });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Username: "siswa", Password: "sd123"
    if (username === 'siswa' && password === 'sd123') {
        req.session.loggedin = true;
        res.redirect('/dashboard');
    } else {
        res.render('login', { pesan: 'Username atau password salah!' });
    }
});

// Rute: Dashboard (halaman utama setelah login)
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { barangList });
});

// Rute: Tambah Barang
app.post('/add-barang', isAuthenticated, (req, res) => {
    const namaBarang = req.body.nama;
    const id = barangList.length + 1;
    barangList.push({ id, nama: namaBarang, status: 'Tersedia' });
    res.redirect('/dashboard');
});

// Rute: Hapus Barang
app.post('/hapus-barang', isAuthenticated, (req, res) => {
    const id = parseInt(req.body.id);
    barangList = barangList.filter(item => item.id !== id);
    res.redirect('/dashboard');
});

// Rute: Pinjam/Kembalikan Barang
app.post('/ubah-status', isAuthenticated, (req, res) => {
    const id = parseInt(req.body.id);
    const barang = barangList.find(item => item.id === id);
    if (barang) {
        barang.status = barang.status === 'Tersedia' ? 'Dipinjam' : 'Tersedia';
    }
    res.redirect('/dashboard');
});

// Rute: Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});