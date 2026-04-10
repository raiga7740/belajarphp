<?php
include "koneksi.php";

// ==================== AMBIL DATA DARI JAVASCRIPT ====================
$data = json_decode(file_get_contents("php://input"), true);

$nama = $data["nama"];
$harga = $data["harga"];
$jumlah = $data["jumlah"];
$subtotal = $harga * $jumlah;

// ==================== SIMPAN KE DATABASE ====================
$sql = "INSERT INTO barang (nama_barang, harga, jumlah, subtotal)
        VALUES ('$nama', '$harga', '$jumlah', '$subtotal')";

if (mysqli_query($conn, $sql)) {
    echo "berhasil";
} else {
    echo "gagal";
}
?>