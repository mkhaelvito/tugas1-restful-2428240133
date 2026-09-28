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

// ==================== HELPER ====================
// response error standar { status, message, data }
const kirimError = (res, kode, pesan) =>
  res.status(kode).json({ status: "error", message: pesan, data: null });

// cek string wajib: tidak boleh kosong / bukan string
const stringKosong = (v) => typeof v !== "string" || v.trim() === "";
// cek number wajib: harus number valid
const angkaTidakValid = (v) => typeof v !== "number" || Number.isNaN(v);

// validasi field wajib (nama, jenisHewan, umurBulan, harga); return pesan error atau null
const validasi = (body) => {
  const { nama, jenisHewan, ras, umurBulan, harga } = body || {};
  if (stringKosong(nama)) return "Field nama wajib diisi";
  if (stringKosong(jenisHewan)) return "Field jenisHewan wajib diisi";
  if (angkaTidakValid(umurBulan)) return "Field umurBulan wajib diisi dan berupa angka";
  if (angkaTidakValid(harga)) return "Field harga wajib diisi dan berupa angka";
  // field opsional: ras harus string jika dikirim
  if (ras !== undefined && ras !== null && typeof ras !== "string") return "Field ras harus berupa string";
  return null;
};

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

// GET /pets
// GET /pets?jenisHewan=kucing  (filter dengan query string)
app.get("/pets", (req, res) => {
  const { jenisHewan } = req.query;
  // jika ada filter, kembalikan array hasil filter (boleh kosong [])
  if (jenisHewan) {
    const hasil = pets.filter(
      (p) => p.jenisHewan.toLowerCase() === String(jenisHewan).toLowerCase()
    );
    return res.status(200).json(hasil);
  }
  // tanpa filter, kembalikan semua data
  res.status(200).json(pets);
});

// GET /pets/1
app.get("/pets/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pet = pets.find((p) => p.id === id);
  if (!pet) return kirimError(res, 404, `Data dengan id ${req.params.id} tidak ditemukan`);
  res.status(200).json(pet);
});

// POST /pets
// Body: { "nama": "Mochi", "jenisHewan": "kucing", "ras": "Persia", "umurBulan": 4, "harga": 2500000 }
app.post("/pets", (req, res) => {
  // validasi field wajib -> 400
  const pesan = validasi(req.body);
  if (pesan) return kirimError(res, 400, pesan);

  const { nama, jenisHewan, ras, umurBulan, harga } = req.body;
  const baru = { id: nextId++, nama, jenisHewan, ras, umurBulan, harga };
  pets.push(baru);

  // berhasil -> 201 + data yang baru dibuat
  res.status(201).json({
    status: "success",
    message: "Data hewan peliharaan berhasil ditambahkan",
    data: baru,
  });
});

// PUT /pets/1
// Body: { "nama": "Mochi", "jenisHewan": "kucing", "ras": "Persia", "umurBulan": 5, "harga": 2700000 }
app.put("/pets/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = pets.findIndex((p) => p.id === id);
  // data tidak ada -> 404
  if (index === -1) return kirimError(res, 404, `Data dengan id ${req.params.id} tidak ditemukan`);

  // field wajib kosong -> 400
  const pesan = validasi(req.body);
  if (pesan) return kirimError(res, 400, pesan);

  // penggantian penuh (id tetap)
  const { nama, jenisHewan, ras, umurBulan, harga } = req.body;
  pets[index] = { id, nama, jenisHewan, ras, umurBulan, harga };

  res.status(200).json({
    status: "success",
    message: "Data hewan peliharaan berhasil diubah",
    data: pets[index],
  });
});

// DELETE /pets/1
app.delete("/pets/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = pets.findIndex((p) => p.id === id);
  // data tidak ada -> 404
  if (index === -1) return kirimError(res, 404, `Data dengan id ${req.params.id} tidak ditemukan`);

  pets.splice(index, 1);
  res.status(200).json({
    status: "success",
    message: `Data hewan peliharaan dengan id ${id} berhasil dihapus`,
    data: null,
  });
});

// ==================== MIDDLEWARE AKHIR ====================

// catch-all 404: route yang tidak terdaftar
app.use((req, res) => {
  kirimError(res, 404, "Endpoint tidak ditemukan");
});

// error handler (mis. JSON body rusak) tetap dibalas JSON
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return kirimError(res, 400, "Body request bukan JSON yang valid");
  }
  kirimError(res, 500, "Terjadi kesalahan pada server");
});

// ==================== SERVER ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));