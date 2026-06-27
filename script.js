// Memuat data lama yang tersimpan di HP saat aplikasi dibuka
document.addEventListener("DOMContentLoaded", () => {
    muatDataDariMemori();
});

function formatTanggal(tanggalObj) {
    let d = tanggalObj.getDate();
    let m = tanggalObj.getMonth() + 1;
    let y = tanggalObj.getFullYear();
    return `${d < 10 ? '0'+d : d}/${m < 10 ? '0'+m : m}/${y}`;
}

function tambahBatch() {
    let nama = document.getElementById("batchName").value;
    let tglInput = document.getElementById("dateInput").value;

    if (nama === "" || tglInput === "") {
        alert("Mohon isi Nama Batch dan Tanggal!");
        return;
    }

    let batchBaru = { nama: nama, tglAwal: tglInput };
    
    // Simpan ke memori lokal HP
    let daftarBatch = JSON.parse(localStorage.getItem("bsf_data")) || [];
    daftarBatch.push(batchBaru);
    localStorage.setItem("bsf_data", JSON.stringify(daftarBatch));

    tampilkanKeTabel(batchBaru);

    document.getElementById("batchName").value = "";
    document.getElementById("dateInput").value = "";
}

function tampilkanKeTabel(batch) {
    let tglTelur = new Date(batch.tglAwal);
    tglTelur.setHours(0,0,0,0);
    
    let tglMenetas = new Date(tglTelur); tglMenetas.setDate(tglTelur.getDate() + 4);
    let tglPrepupa = new Date(tglMenetas); tglPrepupa.setDate(tglMenetas.getDate() + 18);
    let tglInduk = new Date(tglPrepupa); tglInduk.setDate(tglPrepupa.getDate() + 21);

    let hariIni = new Date(); hariIni.setHours(0,0,0,0);
    let statusOtomatis = "🥚 Telur";

    if (hariIni >= tglInduk) statusOtomatis = "🪰 Lalat Induk";
    else if (hariIni >= tglPrepupa) statusOtomatis = "🟫 Prepupa/Pupa";
    else if (hariIni >= tglMenetas) statusOtomatis = "🐛 Maggot Kecil";

    let tbody = document.getElementById("tabelBody");
    let row = tbody.insertRow();
    row.innerHTML = `
        <td><strong>${batch.nama}</strong></td>
        <td>${formatTanggal(tglTelur)}</td>
        <td>${formatTanggal(tglMenetas)}</td>
        <td>${formatTanggal(tglPrepupa)}</td>
        <td>${formatTanggal(tglInduk)}</td>
        <td>
            <select style="font-weight:bold;">
                <option value="🥚 Telur" ${statusOtomatis === '🥚 Telur' ? 'selected' : ''}>🥚 Telur</option>
                <option value="🐛 Maggot Kecil" ${statusOtomatis === '🐛 Maggot Kecil' ? 'selected' : ''}>🐛 Maggot Kecil</option>
                <option value="🟫 Prepupa/Pupa" ${statusOtomatis === '🟫 Prepupa/Pupa' ? 'selected' : ''}>🟫 Prepupa/Pupa</option>
                <option value="🪰 Lalat Induk" ${statusOtomatis === '🪰 Lalat Induk' ? 'selected' : ''}>🪰 Lalat Induk</option>
                <option value="✅ Selesai">✅ Selesai</option>
            </select>
        </td>
        <td><button class="btn-delete" onclick="hapusData('${batch.nama}', this)">Hapus</button></td>
    `;
}

function muatDataDariMemori() {
    let daftarBatch = JSON.parse(localStorage.getItem("bsf_data")) || [];
    document.getElementById("tabelBody").innerHTML = "";
    daftarBatch.forEach(batch => tampilkanKeTabel(batch));
}

function hapusData(namaBatch, btn) {
    let daftarBatch = JSON.parse(localStorage.getItem("bsf_data")) || [];
    daftarBatch = daftarBatch.filter(b => b.nama !== namaBatch);
    localStorage.setItem("bsf_data", JSON.stringify(daftarBatch));
    
    let row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}