<?php
require_once "koneksi.php";
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kasir Sederhana</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>SISTEM KASIR SEDERHANA</h1>

        <div class="form-section">
            <h2>Tambah Barang</h2>
            <form id="formBarang">
                <table>
                    <tr>
                        <td>Nama Barang:</td>
                        <td><input type="text" id="namaBarang" required placeholder="Contoh: Indomie"></td>
                    </tr>
                    <tr>
                        <td>Harga (Rp):</td>
                        <td><input type="number" id="harga" required min="0" placeholder="0"></td>
                    </tr>
                    <tr>
                        <td>Jumlah:</td>
                        <td><input type="number" id="jumlahBarang" required min="1" value="1"></td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center">
                            <button type="submit" id="btnSubmit" class="btn-tambah">Tambah Barang</button>
                            <button type="button" id="btnBatalEdit" class="btn-batal" style="display: none;">Batal Edit</button>
                        </td>
                    </tr>
                </table>
            </form>
        </div>

        <div class="cart-section">
            <h2>Daftar Belanja</h2>
            <table class="table-barang" id="tableBarang">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Barang</th>
                        <th>Harga</th>
                        <th>Jumlah</th>
                        <th>Subtotal</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>

        <div class="payment-section">
            <h2>Pembayaran</h2>
            <table>
                <tr>
                    <td><strong>Total Belanja:</strong></td>
                    <td><strong id="totalBelanja">Rp 0</strong></td>
                </tr>
                <tr>
                    <td>Uang Bayar:</td>
                    <td><input type="number" id="uangBayar" placeholder="Masukkan uang"></td>
                </tr>
                <tr>
                    <td><strong>Kembalian:</strong></td>
                    <td><strong id="kembalian">Rp 0</strong></td>
                </tr>
                <tr>
                    <td colspan="2" align="center">
                        <button id="btnHitung" class="btn-hitung">Hitung Kembalian</button>
                        <button id="btnReset" class="btn-reset">Reset Semua</button>
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>