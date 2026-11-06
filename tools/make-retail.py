#!/usr/bin/env python3
"""Bangun demo POS RETAIL (demo-retail/) dari demo POS FnB (demo/).

    python3 tools/make-retail.py

Cara kerja: salin demo/ → demo-retail/, ganti data katalog dengan tools/retail/omnify-data.js,
lalu tambal omnify-store.js dan index.html dengan penggantian teks yang persis (setiap pola
harus ditemukan tepat sesuai jumlah yang diharapkan; kalau demo/ berubah dan pola tidak cocok,
skrip berhenti dengan pesan yang jelas). Jadi perbaikan di demo FnB bisa dibawa ke retail
cukup dengan menjalankan ulang skrip ini.

Yang berbeda di retail: produk pakaian/sepatu/tas dengan varian ukuran, stok per ukuran
(tanpa resep/BOM), PPN 11% termasuk harga, tanpa dapur/meja/self order/kanal ojol/reservasi,
jam toko 10:00–22:00, data contoh toko fashion "Garis Goods" (3 outlet).
"""
import os
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'demo')
DST = os.path.join(ROOT, 'demo-retail')
RET = os.path.join(ROOT, 'tools', 'retail')


def patch(name, text, pairs):
    for i, p in enumerate(pairs):
        old, new = p[0], p[1]
        n = p[2] if len(p) > 2 else 1
        found = text.count(old)
        if n is None:  # ganti semua, minimal 1
            n = max(found, 1)
        if found != n:
            sys.exit(f'[{name}] pola #{i + 1} ditemukan {found}x (harus {n}x):\n  {old[:160]!r}')
        text = text.replace(old, new)
    return text


# ── omnify-store.js ─────────────────────────────────────────────────────────
STORE = [
    ("KEY = 'omnify-db-v7', SKEY = 'omnify-session-v7'", "KEY = 'omnify-retail-db-v7', SKEY = 'omnify-retail-session-v7'"),
    # varian ukuran menggantikan opsi minuman
    ("const isDrink = c => c === 'Kopi' || c === 'Non-kopi';", "const isDrink = c => false;"),
    ("const modAdd = (OM, id, m) => (m && m.size === 'L' ? 6000 : 0) + (m && m.milk === 'oat' && OM.MB[id].milk ? 8000 : 0);", "const modAdd = (OM, id, m) => 0;"),
    ("const modsStr = (OM, id, m) => { if (!m) return '';", "const modsStr = (OM, id, m) => { if (!m) return ''; if (OM.RETAIL) return m.size && OM.MB[id] && OM.MB[id].sizes ? 'Ukuran ' + m.size : '';"),
    # outlet
    ("full: 'Kopi Senja · Kemang', addr: 'Jl. Kemang Raya No. 18, Jakarta Selatan', phone: '021-7199-0418', npwpd: 'P2.0018.2210.7', pb1: 10, svc: 5, svcOn: false, open: '07:00', close: '22:00', rcHead: 'KOPI SENJA KEMANG · Jl. Kemang Raya No. 18', rcFoot: 'Terima kasih! IG @kopisenja'",
     "full: 'Garis Goods · Kemang', addr: 'Jl. Kemang Raya No. 18, Jakarta Selatan', phone: '021-7199-0418', npwpd: '01.234.567.8-015.000', pb1: 11, svc: 0, svcOn: false, open: '10:00', close: '22:00', rcHead: 'GARIS GOODS KEMANG · Jl. Kemang Raya No. 18', rcFoot: 'Tukar ukuran maks. 7 hari dengan struk ini.\\nTerima kasih! IG @garisgoods'"),
    ("full: 'Kopi Senja · Senopati', addr: 'Jl. Senopati No. 62, Kebayoran Baru, Jakarta Selatan', phone: '021-2751-6620', npwpd: 'P2.0018.3391.2', pb1: 10, svc: 5, svcOn: true, open: '07:00', close: '23:00', rcHead: 'KOPI SENJA SENOPATI · Jl. Senopati No. 62', rcFoot: 'Terima kasih! IG @kopisenja'",
     "full: 'Garis Goods · Senopati', addr: 'Jl. Senopati No. 62, Kebayoran Baru, Jakarta Selatan', phone: '021-2751-6620', npwpd: '01.234.567.8-015.000', pb1: 11, svc: 0, svcOn: false, open: '10:00', close: '22:00', rcHead: 'GARIS GOODS SENOPATI · Jl. Senopati No. 62', rcFoot: 'Tukar ukuran maks. 7 hari dengan struk ini.\\nTerima kasih! IG @garisgoods'"),
    ("full: 'Kopi Senja · BSD', addr: 'Ruko Golden Boulevard Blok C-7, BSD City, Tangerang Selatan', phone: '021-5316-0287', npwpd: '36.74.0412.88', pb1: 10, svc: 0, svcOn: false, open: '08:00', close: '22:00', rcHead: 'KOPI SENJA BSD · Golden Boulevard C-7', rcFoot: 'Terima kasih! IG @kopisenja'",
     "full: 'Garis Goods · BSD', addr: 'Ruko Golden Boulevard Blok C-7, BSD City, Tangerang Selatan', phone: '021-5316-0287', npwpd: '01.234.567.8-015.000', pb1: 11, svc: 0, svcOn: false, open: '10:00', close: '21:00', rcHead: 'GARIS GOODS BSD · Golden Boulevard C-7', rcFoot: 'Tukar ukuran maks. 7 hari dengan struk ini.\\nTerima kasih! IG @garisgoods'"),
    ("@kopisenja.id'", "@garisgoods.id'", 6),
    ("kasirdapur: { label: 'Kasir + Dapur', desc: 'Seperti Kasir, plus resep & ketersediaan di dapur' },", "kasirdapur: { label: 'Kasir + Gudang', desc: 'Seperti Kasir, plus terima barang, transfer & stock opname' },"),
    ("dapur: { label: 'Dapur', desc: 'Layar dapur, resep & ketersediaan' },", "dapur: { label: 'Gudang', desc: 'Stok, terima barang & transfer antar outlet' },"),
    ("kasirdapur: 'pos', dapur: 'kitchen' }", "kasirdapur: 'pos', dapur: 'inventory' }"),
    ("  { g: 'Operasional', label: 'Dapur & Bar', page: 'kitchen' }, { g: 'Operasional', label: 'Meja & Self Order', page: 'tables' },\n", ""),
    ("label: 'Ubah harga produk & resep'", "label: 'Ubah harga produk'"),
    ("'Bahan non-stok', 'Marketing'", "'Perlengkapan toko', 'Marketing'"),
    ("refund: ['Komplain · kualitas tidak sesuai', 'Komplain · pesanan salah', 'Komplain · terlalu lama', 'Komplain · lainnya'],",
     "refund: ['Barang cacat / rusak', 'Ukuran tidak pas', 'Salah ambil barang', 'Komplain · lainnya'],"),
    ("cancel: ['Pelanggan membatalkan', 'Salah input', 'Item habis',", "cancel: ['Pelanggan membatalkan', 'Salah input', 'Stok habis',"),
    ("price: ['Harga lama di menu', 'Porsi khusus', 'Kompensasi', 'Lain-lain'],", "price: ['Harga label lama', 'Barang display / cacat ringan', 'Kompensasi', 'Lain-lain'],"),
    ("stock: ['Hasil stock opname', 'Barang rusak', 'Koreksi input', 'Lain-lain'],", "stock: ['Hasil stock opname', 'Barang rusak', 'Hilang / susut', 'Koreksi input', 'Lain-lain'],"),
    ("{ id: 'd1', name: 'Senja Hemat', code: 'SENJA10', type: 'pct', value: 10, active: true, used: 38, note: 'Semua menu' },",
     "{ id: 'd1', name: 'Member Garis', code: 'MEMBER10', type: 'pct', value: 10, active: true, used: 64, note: 'Semua produk, pelanggan terdaftar' },"),
    ("{ id: 'd2', name: 'Happy Hour Kopi', code: 'HAPPY15', type: 'pct', value: 15, active: true, used: 21, note: 'Setiap hari 14:00–16:00' },",
     "{ id: 'd2', name: 'Payday Sale', code: 'PAYDAY15', type: 'pct', value: 15, active: true, used: 27, note: 'Tanggal 25 s.d. 2 bulan berikutnya' },"),
    ("{ id: 'd3', name: 'Potongan Rp20rb', code: 'HEMAT20', type: 'amt', value: 20000, active: false, used: 4, note: 'Min. belanja Rp150.000' },",
     "{ id: 'd3', name: 'Potongan Rp50rb', code: 'HEMAT50', type: 'amt', value: 50000, active: false, used: 9, note: 'Min. belanja Rp500.000' },"),
    # PPN sudah termasuk harga (lazim di ritel)
    ("tax = Math.round((sub - d + svc) * pb);\n  return { sub, disc: d, svc, tax, total: sub - d + svc + tax };",
     "gross = sub - d + svc, tax = Math.round(gross - gross / (1 + pb));\n  return { sub, disc: d, svc, tax, total: gross, inclTax: true };"),
    # stok per ukuran
    ("function usage(OM, items) {\n  const use = {};\n",
     "function usage(OM, items) {\n  const use = {};\n  if (OM.RETAIL) { items.forEach(c => { const q = lineQty(c); if (q <= 0) return; const m = OM.MB[c.id], k = m && m.sizes ? c.id + '-' + ((c.mods && c.mods.size) || m.def) : null; if (k && OM.IB[k]) use[k] = (use[k] || 0) + q; else Object.entries(OM.REC[c.id] || {}).forEach(([kk, r]) => { use[kk] = (use[kk] || 0) + r * q; }); }); return use; }\n"),
    # seed
    ("selfOrderOn: true, soPrefix: 'Meja' };", "selfOrderOn: false, soPrefix: 'Meja' };"),
    ("db.prodCfg.k5.out.bsd.on = false; db.prodCfg.f2.out.bsd.on = false; db.prodCfg.k5.out.snp.price = 42000; db.prodCfg.f1.out.snp.price = 48000; db.prodCfg.k1.ch.gofood = 34000;",
     "db.prodCfg.b7.out.bsd.on = false; db.prodCfg.s6.out.bsd.on = false; db.prodCfg.s6.out.snp.price = 799000; db.prodCfg.b2.out.snp.price = 1049000;"),
    (" db.stockBy.snp.milk = 22; db.stockBy.snp.croissant = 18; db.stockBy.snp.espresso = 2.6;", ""),
    (" db.stockBy.bsd.espresso = 0.9; db.stockBy.bsd.cup = 90;", ""),
    ("const W = { k1: 22, k4: 12, k3: 11, p1: 10, f1: 8, n1: 7, f2: 6, k2: 7, k5: 3, n2: 4, n3: 5, p2: 6, p3: 4, f3: 3, f4: 3 };",
     "const W = { a1: 10, a2: 8, a3: 6, a4: 9, a5: 11, a6: 8, a7: 6, a8: 7, s1: 6, s2: 7, s3: 3, s4: 3, s5: 4, s6: 3, s7: 3, s8: 4, s9: 3, b1: 6, b2: 3, b3: 4, b4: 3, b5: 3, b6: 4, b7: 1 };\n"
     "  const SZW = { S: 15, M: 35, L: 32, XL: 18, 36: 12, 37: 24, 38: 30, 39: 22, 40: 12, 41: 28, 42: 24, 43: 12 };\n"
     "  const pickSize = m => { const w = m.sizes.map(z => [z, SZW[z] || 10]); if (m.cat === 'Sepatu' && m.sizes[0] === '38') { w[0][1] = 14; w[1][1] = 22; w[2][1] = 30; w[3][1] = 22; w[4][1] = 12; } return wp(w); };"),
    ("const METH = [['cash', 30], ['edc', 50], ['gopay', 8], ['ovo', 5], ['dana', 4], ['shopeepay', 3]];", "const METH = [['cash', 18], ['edc', 62], ['gopay', 7], ['ovo', 5], ['dana', 5], ['shopeepay', 3]];"),
    ("const HW = { 7: .5, 8: 1, 9: .9, 10: .6, 11: .6, 12: 1, 13: .9, 14: .6, 15: .7, 16: .8, 17: .7, 18: .6, 19: .6, 20: .5, 21: .3 };",
     "const HW = { 10: .6, 11: .85, 12: .8, 13: .8, 14: .6, 15: .6, 16: .7, 17: .8, 18: 1, 19: 1, 20: .8, 21: .4 };"),
    ("const n = wp([[1, 40], [2, 35], [3, 18], [4, 7]]), items = [];", "const n = wp([[1, 58], [2, 30], [3, 9], [4, 3]]), items = [];"),
    ("const m = OM.MB[pid]; const mods = isDrink(m.cat) ? { size: R() < .2 ? 'L' : 'R', temp: R() < .7 ? 'ice' : 'hot', milk: m.milk && R() < .1 ? 'oat' : 'fresh', sugar: R() < .15 ? 'less' : 'normal' } : null;",
     "const m = OM.MB[pid]; const mods = m.sizes ? { size: pickSize(m) } : null;"),
    ("if (ex) ex.qty++; else items.push({ key, id: pid, qty: R() < .15 ? 2 : 1,", "if (ex) ex.qty++; else items.push({ key, id: pid, qty: R() < .04 ? 2 : 1,"),
    ("const BASEN = { kmg: 48, snp: 56, bsd: 38 };", "const BASEN = { kmg: 17, snp: 21, bsd: 13 };"),
    ("const ch = opt.ch || (R() < (opt.onP || .24) ? wp([['gofood', 45], ['grabfood', 35], ['shopeefood', 20]]) : 'direct'), on = ch !== 'direct';",
     "const ch = opt.ch || (R() < (opt.onP || .24) * 1.1 ? wp([['shopee', 45], ['tokopedia', 33], ['web', 22]]) : 'direct'), on = ch !== 'direct';"),
    ("const mm = isDrink(OM.MB[id].cat) ? { size: 'R', temp: 'ice', milk: 'fresh', sugar: 'normal', ...(mods || {}) } : null;",
     "const mm = OM.MB[id].sizes ? { size: OM.MB[id].def, ...(mods || {}) } : null;"),
    ("const type = opt.type || (on ? 'online' : R() < .6 ? 'dine' : 'take');", "const type = opt.type || (on ? 'online' : 'take');"),
    ("const p = pk([['SENJA10', 10], ['HAPPY15', 15]]);", "const p = pk([['MEMBER10', 10], ['MEMBER10', 10], ['PAYDAY15', 15]]);"),
    ("if (!on && !opt.items) { if (R() < .08) {", "if (!on && !opt.items) { if (R() < .14) {"),
    ("let blocks = [[day0 + 7 * H, day0 + 15 * H], [day0 + 15 * H, day0 + 22 * H]];", "let blocks = [[day0 + 10 * H, day0 + 16 * H], [day0 + 16 * H, day0 + 22 * H]];"),
    ("hwIn(day0 + 7 * H, day0 + 22 * H)", "hwIn(day0 + 10 * H, day0 + 22 * H)"),
    # tidak ada tiket dapur aktif di ritel
    ("const HC0 = oid === 'kmg' ? [", "const HC0 = OM.RETAIL ? ({ kmg: [[12, { ch: 'direct', type: 'take', items: [['a6', 1, { size: 'XL' }], ['b6', 1]], status: 'served', method: 'edc' }], [47, { ch: 'direct', type: 'take', items: [['s2', 1, { size: '41' }]], status: 'served', method: 'cash' }], [6, { ch: 'shopee', items: [['a4', 1, { size: 'L' }]], status: 'new' }], [22, { ch: 'web', items: [['s1', 1, { size: '40' }]], status: 'new' }], [38, { ch: 'tokopedia', items: [['b1', 1], ['a2', 1, { size: 'M' }]], status: 'cooking' }], [55, { ch: 'web', items: [['a1', 2, { size: 'M' }]], status: 'ready' }], [85, { ch: 'shopee', items: [['s8', 1, { size: '38' }]], status: 'picked' }]], snp: [[18, { ch: 'tokopedia', items: [['a6', 1, { size: 'M' }]], status: 'new' }], [60, { ch: 'shopee', items: [['b6', 1]], status: 'picked' }]], bsd: [[30, { ch: 'web', items: [['s5', 1, { size: '42' }]], status: 'cooking' }]] })[oid] : oid === 'kmg' ? ["),
    ("const PRIO = oid === 'kmg' ? [8, 1, 2, 4, 7, 0, 6, 3, 5]", "const PRIO = oid === 'kmg' && !OM.RETAIL ? [8, 1, 2, 4, 7, 0, 6, 3, 5]"),
    ("['Bahan non-stok', 'Es batu kristal 2 karung', ri(5, 12) * 5000]", "['Perlengkapan toko', 'Plastik & paper bag tambahan', ri(5, 12) * 10000]"),
    ("const PLAN = { s1: [14, 'h30'], s2: [7, 'h14'], s3: [7, 'tunai'], s4: [7, 'h7'], s5: [14, 'h30'] };", "const PLAN = { s1: [14, 'h30'], s2: [14, 'h30'], s3: [7, 'h14'] };"),
    ("const PACK = i => i.unit === 'pcs' ? (i.par >= 100 ? 50 : i.par >= 30 ? 10 : 4) : i.unit === 'kg' ? .5 : 1;", "const PACK = i => i.cat === 'Tas' ? 3 : 2;"),
    ("kPo('s1', 'sent', 20 * H, NEW ? 'Hari ini' : 'Besok', 'kmg', 'h30'); kPo('s2', 'draft', 30 * MIN, '—', 'kmg', 'h14'); kPo('s4', 'sent', 3 * H, NEW ? 'Besok' : 'Hari ini', 'snp', 'h7');",
     "kPo('s1', 'sent', 20 * H, NEW ? 'Hari ini' : 'Besok', 'kmg', 'h30'); kPo('s3', 'draft', 30 * MIN, '—', 'kmg', 'h14'); kPo('s2', 'sent', 3 * H, NEW ? 'Besok' : 'Hari ini', 'snp', 'h30');"),
    ("[['kmg', 's5', 100, 30, 3250000, 0], ['snp', 's1', 70, 30, 4860000, 2000000], ['bsd', 's2', 40, 14, 1720000, 0]]",
     "[['kmg', 's3', 100, 30, 8250000, 0], ['snp', 's1', 70, 30, 12460000, 5000000], ['bsd', 's2', 40, 14, 6720000, 0]]"),
    ("['snp', 'Marketing', 'Endorse influencer kuliner', 2500000, 'ewallet', 18], ['kmg', 'Marketing', 'Cetak menu & poster promo', 850000, 'petty', 26], ['kmg', 'Perbaikan & perawatan', 'Servis mesin espresso', 1200000, 'bank', 9]",
     "['snp', 'Marketing', 'Endorse influencer fashion', 3500000, 'ewallet', 18], ['kmg', 'Marketing', 'Cetak lookbook & poster promo', 1250000, 'petty', 26], ['kmg', 'Perbaikan & perawatan', 'Servis AC & lampu display', 1200000, 'bank', 9]"),
    ("lines: [{ ing: 'milk', qty: 10, recv: 9.5 }, { ing: 'croissant', qty: 12, recv: 12 }]", "lines: [{ ing: 'a5-M', qty: 4, recv: 3 }, { ing: 'a5-L', qty: 4, recv: 4 }]"),
    ("lines: [{ ing: 'espresso', qty: 1, recv: null }, { ing: 'oat', qty: 3, recv: null }]", "lines: [{ ing: 's5-41', qty: 2, recv: null }, { ing: 's5-42', qty: 1, recv: null }]"),
    ("lines: [{ ing: 'cup', qty: 100, recv: null }], status: 'requested', requestedAt: NOW - 2 * H, requestedBy: 'u6', sentAt: null, sentBy: null, receivedAt: null, receivedBy: null, note: 'Cup habis sebelum PO datang' }",
     "lines: [{ ing: 'b1', qty: 2, recv: null }, { ing: 'b6', qty: 2, recv: null }], status: 'requested', requestedAt: NOW - 2 * H, requestedBy: 'u6', sentAt: null, sentBy: null, receivedAt: null, receivedBy: null, note: 'Ransel laku keras minggu ini, PO baru datang 3 hari lagi' }"),
    ("before: 'Dikirim 10 L susu segar', after: 'Diterima 9,5 L (selisih −0,5 L)', reason: 'Selisih saat penerimaan'",
     "before: 'Dikirim 4 pcs Polo Knit Stripe Marun · M', after: 'Diterima 3 pcs (selisih −1 pcs)', reason: 'Selisih saat penerimaan'"),
    ("Math.max(sod(NOW) + 7 * H + 5 * MIN, x)", "Math.max(sod(NOW) + 10 * H + 5 * MIN, x)"),
    ("[{ t: tOpen(NOW - 150 * MIN), outletId: 'kmg', ing: 'milk', d: -1, reason: 'Terbuang · kedaluwarsa' }, { t: tOpen(NOW - 120 * MIN), outletId: 'kmg', ing: 'croissant', d: -2, reason: 'Terbuang · rusak' }, { t: NOW - 3 * H, outletId: 'snp', ing: 'espresso', d: -1, reason: 'Transfer keluar TR-0002 → BSD' }, { t: NOW - 3 * H, outletId: 'snp', ing: 'oat', d: -3, reason: 'Transfer keluar TR-0002 → BSD' }]",
     "[{ t: tOpen(NOW - 150 * MIN), outletId: 'kmg', ing: 'a1-M', d: -1, reason: 'Rusak · noda di display' }, { t: tOpen(NOW - 120 * MIN), outletId: 'kmg', ing: 'b6', d: -1, reason: 'Hilang · selisih cek display' }, { t: NOW - 3 * H, outletId: 'snp', ing: 's5-41', d: -2, reason: 'Transfer keluar TR-0002 → BSD' }, { t: NOW - 3 * H, outletId: 'snp', ing: 's5-42', d: -1, reason: 'Transfer keluar TR-0002 → BSD' }]"),
    ("[[7, -184000, 'kmg', 'u3'], [14, -96500, 'kmg', 'u3'], [8, -142000, 'snp', 'u3'], [10, -61000, 'bsd', 'u4']]", "[[7, -460000, 'kmg', 'u3'], [14, -249000, 'kmg', 'u3'], [8, -658000, 'snp', 'u3'], [10, -329000, 'bsd', 'u4']]"),
    ("items: 20, varianceVal: v,", "items: 84, varianceVal: v,"),
    ("before: '20 bahan', after:", "before: '84 SKU', after:"),
    ("objId: 'k3', objLabel: 'Cappuccino · harga dasar', before: fmtR(30000), after: fmtR(32000)", "objId: 'a4', objLabel: 'Polo Knit Stripe Cokelat · harga dasar', before: fmtR(299000), after: fmtR(329000)"),
    ("objId: 'k5', objLabel: 'Manual Brew V60 · harga Senopati', before: fmtR(38000), after: fmtR(42000)", "objId: 's6', objLabel: 'Brogues Kulit Cokelat · harga Senopati', before: fmtR(789000), after: fmtR(799000)"),
    ("type: 'recipe_change', objType: 'product', objId: 'k1', objLabel: 'Kopi Susu Aren · resep', before: 'Gula aren cair 25 ml', after: 'Gula aren cair 30 ml'",
     "type: 'price_change', objType: 'product', objId: 'b2', objLabel: 'Ransel Suede Bottom Juniper · harga Senopati', before: fmtR(999000), after: fmtR(1049000)"),
    ("objId: 'grabfood', objLabel: 'Kanal GrabFood · komisi', before: '18%', after: '20%'", "objId: 'policy', objLabel: 'Batas diskon tanpa PIN', before: '15%', after: '10%'"),
    ("const TGT = (oid, i) => i.par * 1.2 + (DAILY[oid][i.id] || 0) * EV[i.sup];", "const TGT = (oid, i) => i.par * 1.9 + (DAILY[oid][i.id] || 0) * EV[i.sup] * 1.3;"),
    # kanal online ritel: Website, Shopee, Tokopedia
    ("""  { id: 'gofood', label: 'GoFood',""", """  { id: 'web', label: 'Website', mark: 'WB', logo: 'assets/pay/ch-web.svg', color: '#1F4A8F', tint: '#EAF0FB' },
  { id: 'shopee', label: 'Shopee', mark: 'SP', logo: 'assets/pay/ch-shopee.svg', color: '#9A3412', tint: '#FCF0E8' },
  { id: 'tokopedia', label: 'Tokopedia', mark: 'TP', logo: 'assets/pay/ch-tokopedia.svg', color: '#14633A', tint: '#EAF5EE' },
  { id: 'gofood', label: 'GoFood',"""),
    ("\n];\nconst CHB = ", "\n].filter(c => !['gofood', 'grabfood', 'shopeefood'].includes(c.id));\nconst CHB = "),
    ("channels: { gofood: { on: true, comm: 20, markup: 20, inclTax: true, lag: 2 }, grabfood: { on: true, comm: 20, markup: 20, inclTax: true, lag: 3 }, shopeefood: { on: true, comm: 18, markup: 15, inclTax: true, lag: 7 } },",
     "channels: { web: { on: true, comm: 2, markup: 0, inclTax: true, lag: 1 }, shopee: { on: true, comm: 10, markup: 8, inclTax: true, lag: 3 }, tokopedia: { on: true, comm: 9, markup: 8, inclTax: true, lag: 3 } },"),
    ("pcancel: ['Driver tidak ditemukan', 'Pelanggan membatalkan', 'Restoran terlalu lama', 'Item habis', 'Lain-lain'],",
     "pcancel: ['Pembeli membatalkan', 'Melewati batas waktu kirim', 'Stok habis', 'Alamat tidak terjangkau kurir', 'Lain-lain'],"),
    ("online_cancel: ['Dibatalkan platform', 'delivery_dining']", "online_cancel: ['Dibatalkan di kanal online', 'circle-x']"),
    ("const DRIVERS = ['Pak Sutrisno', 'Mas Andre', 'Pak Wawan', 'Mas Rizky', 'Pak Darto', 'Mas Ilham', 'Pak Yanto', 'Mas Bagas'];",
     "const DRIVERS = ['JNE REG'], COUR = { web: ['JNE REG', 'SiCepat REG', 'Kurir toko'], shopee: ['SPX Express', 'J&T Express'], tokopedia: ['JNE REG', 'SiCepat REG', 'GoSend Same Day'] };"),
    ("const pid6 = ch => ch === 'gofood' ? 'GF-' + ri(100000, 999999) + '-' + ri(10, 99) : ch === 'grabfood' ? 'GR-A' + ri(1000000, 9999999) : 'SF' + ri(10000000, 99999999);",
     "const pid6 = ch => ch === 'shopee' ? '2611' + ri(10, 99) + String.fromCharCode(65 + ri(0, 25), 65 + ri(0, 25)) + ri(100000, 999999) : ch === 'tokopedia' ? 'INV/2026/MPL/' + ri(1000000, 9999999) : 'GG-WEB-' + ri(10000, 99999);"),
    ("driver: opt.driver || pk(DRIVERS), appNote: R() < .3 ? pk(['Sendok garpu ya', 'Es dipisah', 'Jangan pedas', 'Tolong dibungkus rapi']) : ''",
     "driver: opt.driver || pk(COUR[ch] || DRIVERS), appNote: R() < .3 ? pk(['Tolong dibungkus kado ya', 'Kirim hari ini kalau bisa', 'Cek ukuran sebelum kirim', 'Jangan pakai bubble wrap berlebihan']) : ''"),
    ("o.cancelReason = pk(REASONS.pcancel); o.wasted = R() < .5;", "o.cancelReason = pk(REASONS.pcancel); o.wasted = false;"),
    ("if (o2.ch !== 'direct') o2.driver = pk(DRIVERS);", "if (o2.ch !== 'direct') o2.driver = pk(COUR[o2.ch] || DRIVERS);"),
    ("const keep = new Set(PRIO.filter(i => i < HC0.length).slice(0, nAct));", "const keep = new Set(PRIO.filter(i => i < HC0.length).slice(0, OM.RETAIL ? 99 : nAct));"),
    ("recipe_change: ['Ubah resep', 'menu_book'], ", ""),
    ("['Listrik & air', 'Tagihan PLN & PDAM', 6,", "['Listrik & air', 'Tagihan PLN & PDAM', 3,"),
    ("if (l.mods && (l.mods.size === 'L' || l.mods.milk === 'oat' || l.mods.sugar !== 'normal' || l.mods.temp === 'hot')) x.mods = l.mods;", "if (l.mods && l.mods.size) { x.mods = l.mods; x.note = l.note; }"),
]


def main():
    if os.path.isdir(DST):
        shutil.rmtree(DST)
    shutil.copytree(SRC, DST)
    shutil.copy(os.path.join(RET, 'omnify-data.js'), os.path.join(DST, 'omnify-data.js'))
    shutil.copytree(os.path.join(RET, 'products'), os.path.join(DST, 'assets', 'products'))
    for f in os.listdir(os.path.join(RET, 'pay')):
        shutil.copy(os.path.join(RET, 'pay', f), os.path.join(DST, 'assets', 'pay', f))

    p = os.path.join(DST, 'omnify-store.js')
    text = patch('omnify-store.js', open(p).read(), STORE)
    open(p, 'w').write(text)

    sys.path.insert(0, RET)
    from index_patches import INDEX  # noqa: E402
    p = os.path.join(DST, 'index.html')
    text = patch('index.html', open(p).read(), INDEX)
    # kosakata: di ritel tidak ada "bahan" (bahan baku), yang ada "barang" (SKU per ukuran)
    import re
    text = re.sub(r'\bbahan\b', 'barang', text)
    text = re.sub(r'\bBahan\b', 'Barang', text)
    # tombol cetak tiket dapur tidak relevan (tanpa modul dapur)
    text, n = re.subn(r'<button(?:(?!</button>).)*?name="chef-hat"(?:(?!</button>).)*?</button>', lambda m: m.group(0).replace('display:flex', 'display:none', 1), text, flags=re.S)
    if n < 2:
        sys.exit(f'tombol tiket dapur hanya ditemukan {n}x')
    open(p, 'w').write(text)
    print('demo-retail/ selesai dibangun')


if __name__ == '__main__':
    main()
