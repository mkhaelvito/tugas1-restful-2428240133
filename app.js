// impor express
const express = require("express");
const app = express();

// middleware untuk membaca body JSON
app.use(express.json());

// ==================== DATA (array di memori) ====================
// Resource: pets (Topik 21 - Pet Shop: Hewan Peliharaan)
let pets = [
  { id: 1, nama: "Mochi", jenisHewan: "kucing", ras: "Persia", umurBulan: 4, harga: 2500000 },
  { id: 2, nama: "Bruno", jenisHewan: "anjing", ras: "Golden Retriever", umurBulan: 6, harga: 4500000 },
  { id: 3, nama: "Kiko", jenisHewan: "burung", ras: "Lovebird", umurBulan: 3, harga: 350000 },
];
// id berikutnya (otomatis bertambah)
let nextId = 4;

// ==================== ROUTES ====================

// GET /
// Info API: nama mahasiswa, NIM, nomor topik, daftar endpoint
app.get("/", (req, res) => {
  res.json({
    nama: "Mikhael Vito Wicaksono",
    nim: "2428240133",
    topik: 21,
    deskripsi: "Pet Shop - Hewan Peliharaan",
    endpoints: [
      "GET /pets",
      "GET /pets/:id",
      "GET /pets?jenisHewan=kucing",
      "POST /pets",
      "PUT /pets/:id",
      "DELETE /pets/:id",
    ],
  });
});

// ==================== SERVER ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));