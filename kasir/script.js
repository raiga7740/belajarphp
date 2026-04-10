// ==================== VARIABEL GLOBAL ==================== //
let daftarBelanja = [];  // Array menyimpan semua barang
let indexSedangEdit = -1;  // -1 = mode tambah, >=0 = mode edit

// ==================== HITUNG TOTAL BELANJA ====================
function hitungTotal() {
    let total = daftarBelanja.reduce((sum, item) => sum + item.subtotal, 0);
    document.getElementById("totalBelanja").innerHTML = `Rp ${formatRupiah(total)}`;
    return total;
}

// ==================== FORMAT RUPIAH ====================
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID').format(angka);
}

// ==================== TAMPILKAN DAFTAR BARANG ====================
function tampilkanBarang() {
    let tbody = document.querySelector("#tableBarang tbody");
    tbody.innerHTML = "";

    daftarBelanja.forEach(function(item, index) {
        let row = tbody.insertRow();
        
        row.insertCell(0).innerHTML = index + 1;
        row.insertCell(1).innerHTML = item.nama;
        row.insertCell(2).innerHTML = `Rp ${formatRupiah(item.harga)}`;
        row.insertCell(3).innerHTML = item.jumlah;
        row.insertCell(4).innerHTML = `Rp ${formatRupiah(item.subtotal)}`;
        
        let actionCell = row.insertCell(5);
        
        // Tombol EDIT
        let editBtn = document.createElement("button");
        editBtn.innerHTML = "Edit";
        editBtn.className = "btn-edit";
        editBtn.onclick = function() { editBarang(index); };
        
        // Tombol HAPUS
        let deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "Hapus";
        deleteBtn.className = "btn-hapus";
        deleteBtn.onclick = function() {
            if (confirm(`Hapus ${item.nama} dari daftar?`)) {
                daftarBelanja.splice(index, 1);
                tampilkanBarang();
                hitungTotal();
            }
        };
        
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
    });
    
    hitungTotal();
}

// ==================== EDIT BARANG ====================
function editBarang(index) {
    let item = daftarBelanja[index];
    
    // Isi form dengan data yang akan diedit
    document.getElementById("namaBarang").value = item.nama;
    document.getElementById("harga").value = item.harga;
    document.getElementById("jumlahBarang").value = item.jumlah;
    
    // Simpan index yang sedang diedit
    indexSedangEdit = index;
    
    // Ubah UI ke mode edit
    let btnSubmit = document.getElementById("btnSubmit");
    btnSubmit.innerHTML = "Update Barang";
    btnSubmit.className = "btn-update";
    
    let btnBatal = document.getElementById("btnBatalEdit");
    btnBatal.style.display = "inline-block";
    
    document.getElementById("formBarang").classList.add("edit-mode");
    
    // Scroll ke form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== BATAL EDIT ====================
function batalEdit() {
    document.getElementById("formBarang").reset();
    indexSedangEdit = -1;
    
    let btnSubmit = document.getElementById("btnSubmit");
    btnSubmit.innerHTML = "Tambah Barang";
    btnSubmit.className = "btn-tambah";
    
    let btnBatal = document.getElementById("btnBatalEdit");
    btnBatal.style.display = "none";
    
    document.getElementById("formBarang").classList.remove("edit-mode");
}
// ==================== SUBMIT FORM + SIMPAN DATABASE ====================
document.getElementById("formBarang").addEventListener("submit", function(event) {
    event.preventDefault();

    let nama = document.getElementById("namaBarang").value;
    let harga = parseInt(document.getElementById("harga").value);
    let jumlah = parseInt(document.getElementById("jumlahBarang").value);

    // ==================== VALIDASI INPUT ====================
    if (!nama || harga <= 0 || jumlah <= 0) {
        alert("Isi semua data dengan benar!");
        return;
    }

    let subtotal = harga * jumlah;

    // ==================== MODE EDIT ====================
    if (indexSedangEdit !== -1) {
        let barang = {
            nama: nama,
            harga: harga,
            jumlah: jumlah,
            subtotal: subtotal
        };

        daftarBelanja[indexSedangEdit] = barang;
        alert("Barang berhasil diupdate!");
        batalEdit();
        tampilkanBarang();
        return;
    }

    // ==================== CEK DUPLIKASI ====================
    let namaSudahAda = daftarBelanja.some(
        item => item.nama.toLowerCase() === nama.toLowerCase()
    );

    if (namaSudahAda) {
        alert("Nama barang sudah ada!");
        return;
    }

    // ==================== KIRIM KE DATABASE ====================
    fetch("simpan_barang.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nama: nama,
            harga: harga,
            jumlah: jumlah
        })
    })
    .then(response => response.text())
    .then(data => {
        // ==================== SIMPAN KE ARRAY ====================
        daftarBelanja.push({
            nama: nama,
            harga: harga,
            jumlah: jumlah,
            subtotal: subtotal
        });

        alert("Barang berhasil ditambahkan & disimpan ke database!");

        tampilkanBarang();
        document.getElementById("formBarang").reset();
    })
    .catch(error => {
        alert("Gagal menyimpan ke database!");
        console.log(error);
    });
});
// ==================== HITUNG KEMBALIAN ====================
document.getElementById("btnHitung").addEventListener("click", function() {
    let total = hitungTotal();
    let uangBayar = parseInt(document.getElementById("uangBayar").value);
    
    if (isNaN(uangBayar) || uangBayar < total) {
        alert(`Uang kurang! Total belanja Rp ${formatRupiah(total)}`);
        return;
    }
    
    let kembalian = uangBayar - total;
    document.getElementById("kembalian").innerHTML = `Rp ${formatRupiah(kembalian)}`;
    alert(`Kembalian: Rp ${formatRupiah(kembalian)}`);
});

// ==================== RESET SEMUA ====================
document.getElementById("btnReset").addEventListener("click", function() {
    if (confirm("Reset semua data belanja?")) {
        daftarBelanja = [];
        tampilkanBarang();
        document.getElementById("uangBayar").value = "";
        document.getElementById("kembalian").innerHTML = "Rp 0";
        batalEdit();
        alert("Semua data telah direset!");
    }
});

// ==================== BATAL EDIT ====================
document.getElementById("btnBatalEdit").addEventListener("click", function() {
    batalEdit();
});

// ==================== HITUNG OTOMATIS SAAT UANG DIINPUT ====================
document.getElementById("uangBayar").addEventListener("input", function() {
    let total = hitungTotal();
    let uangBayar = parseInt(this.value);
    
    if (!isNaN(uangBayar) && uangBayar >= total) {
        let kembalian = uangBayar - total;
        document.getElementById("kembalian").innerHTML = `Rp ${formatRupiah(kembalian)}`;
    } else if (!isNaN(uangBayar) && uangBayar < total) {
        document.getElementById("kembalian").innerHTML = `Rp 0 (Kurang Rp ${formatRupiah(total - uangBayar)})`;
        document.getElementById("kembalian").style.color = "#f44336";
    } else {
        document.getElementById("kembalian").innerHTML = "Rp 0";
        document.getElementById("kembalian").style.color = "#4caf50";
    }
});

// ==================== TAMPILKAN PERTAMA KALI ====================
tampilkanBarang();