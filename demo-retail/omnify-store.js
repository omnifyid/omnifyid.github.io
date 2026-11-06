/* Omnify shared store — data model, seed (60 hari, 3 outlet), kalkulasi.
 * Semua record transaksional punya outletId. Angka uang dalam Rupiah bulat.
 * orders:      { id, no, outletId, channel:'direct'|'gofood'|'grabfood'|'shopeefood', source:'kasir'|'qr'|'manual'|'api',
 *                type:'dine'|'take'|'online', table, customer, items:[{id,qty,voidQty,price,origPrice,mods,note,done}],
 *                sub, disc, discPct, discLabel, svc, tax, total, paid, refunded, method, status, createdAt, paidAt,
 *                userId, shiftId, channelOrderId, driver, appNote, appTotal, commissionAmount, expectedPayout,
 *                expectedPayoutDate, settlementId, cancelReason, wasted, reopenedFrom }
 *   status direct: pending|new|cooking|ready|served|rejected|cancelled|reopened
 *   status online: new(Diterima)|cooking(Disiapkan)|ready(Siap diambil)|picked(Diambil driver)|served(Selesai)|pcancel
 *   Pendapatan (incl. pajak) = total − refunded untuk status valid. total sudah dikurangi void.
 * refunds:     { id, orderId, outletId, t, amount, method, type:'void'|'partial'|'full'|'cancel'|'reopen', shiftId, userId, approverId, reason, items }
 * shifts:      { id, outletId, userId, openedAt, openCash, closedAt, denoms, counted, expected, variance, note, approverId, status:'open'|'closed'|'reviewed', reviewNote, reviewedBy }
 * cashMoves:   { id, shiftId, outletId, t, type:'in'|'out'|'nosale', amount, category, reason, userId, expenseId, payPaymentId, refType }
 * expenses:    { id, no, outletId, date, category, desc, amount, source:'drawer'|'bank'|'ewallet'|'petty', shiftId, cashMoveId, receipt, recurring, seriesId, status:'posted'|'draft', userId }
 * payables:    { id, poId, poNo, outletId, sup, invoiceNo, invoiceDate, term, termDays, dueDate, total, paid }
 * payPayments: { id, payableId, outletId, t, amount, source, shiftId, userId }
 * settlements: { id, no, outletId, channel, receivedAt, amount, expected, diff, reason, orderIds, userId }
 * transfers:   { id, no, from, to, lines:[{ing,qty,recv}], status:'requested'|'sent'|'received', requestedAt/By, sentAt/By, receivedAt/By }
 * wastes:      { id, outletId, t, source, orderId, items:[{id,qty}], value }
 * logs (read-only): { id, t, outletId, userId, role, type, objType, objId, objLabel, before, after, approverId, reason, device }
 */
(function () {
const D = 86400000, H = 3600000, MIN = 60000, VER = 7, KEY = 'omnify-retail-db-v7', SKEY = 'omnify-retail-session-v7';
const sod = t => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
const clone = o => JSON.parse(JSON.stringify(o));
const r500 = v => Math.ceil(v / 500) * 500;
const isDrink = c => false;
const modAdd = (OM, id, m) => 0;
const modsStr = (OM, id, m) => { if (!m) return ''; if (OM.RETAIL) return m.size && OM.MB[id] && OM.MB[id].sizes ? 'Ukuran ' + m.size : ''; const p = [m.temp === 'ice' ? 'Es' : 'Panas']; if (m.size === 'L') p.push('Besar'); if (m.milk === 'oat' && OM.MB[id].milk) p.push('Susu oat'); if (m.sugar === 'less') p.push('Kurang manis'); if (m.sugar === 'none') p.push('Tanpa gula'); return p.join(' · '); };

const OUTLETS = [
  { id: 'kmg', name: 'Kemang', full: 'Garis Goods · Kemang', addr: 'Jl. Kemang Raya No. 18, Jakarta Selatan', phone: '021-7199-0418', npwpd: '01.234.567.8-015.000', pb1: 11, svc: 0, svcOn: false, open: '10:00', close: '22:00', rcHead: 'GARIS GOODS KEMANG · Jl. Kemang Raya No. 18', rcFoot: 'Tukar ukuran maks. 7 hari dengan struk ini.\nTerima kasih! IG @garisgoods', active: true, device: 'iPad Kasir 01' },
  { id: 'snp', name: 'Senopati', full: 'Garis Goods · Senopati', addr: 'Jl. Senopati No. 62, Kebayoran Baru, Jakarta Selatan', phone: '021-2751-6620', npwpd: '01.234.567.8-015.000', pb1: 11, svc: 0, svcOn: false, open: '10:00', close: '22:00', rcHead: 'GARIS GOODS SENOPATI · Jl. Senopati No. 62', rcFoot: 'Tukar ukuran maks. 7 hari dengan struk ini.\nTerima kasih! IG @garisgoods', active: true, device: 'iPad Kasir 01' },
  { id: 'bsd', name: 'BSD', full: 'Garis Goods · BSD', addr: 'Ruko Golden Boulevard Blok C-7, BSD City, Tangerang Selatan', phone: '021-5316-0287', npwpd: '01.234.567.8-015.000', pb1: 11, svc: 0, svcOn: false, open: '10:00', close: '21:00', rcHead: 'GARIS GOODS BSD · Golden Boulevard C-7', rcFoot: 'Tukar ukuran maks. 7 hari dengan struk ini.\nTerima kasih! IG @garisgoods', active: true, device: 'Tablet Kasir 01' },
];
const USERS = [
  { id: 'u1', name: 'Rina', email: 'rina@garisgoods.id', pw: '0000', role: 'kasir', outlets: ['kmg'], pin: '1111', phone: '0812-3300-1182' },
  { id: 'u2', name: 'Bayu', email: 'bayu@garisgoods.id', pw: '0000', role: 'kasir', outlets: ['kmg'], pin: '2222', phone: '0813-2201-7744' },
  { id: 'u5', name: 'Sinta', email: 'sinta@garisgoods.id', pw: '0000', role: 'kasir', outlets: ['snp'], pin: '3333', phone: '0857-1123-6650' },
  { id: 'u6', name: 'Yoga', email: 'yoga@garisgoods.id', pw: '0000', role: 'kasirdapur', outlets: ['bsd'], pin: '4444', phone: '0821-7765-0091' },
  { id: 'u3', name: 'Dewi', email: 'dewi@garisgoods.id', pw: '0000', role: 'manajer', outlets: ['kmg', 'snp'], pin: '5555', phone: '0811-8890-2210', device: 'MacBook Dewi' },
  { id: 'u4', name: 'Arif', email: 'arif@garisgoods.id', pw: '0000', role: 'owner', outlets: ['kmg', 'snp', 'bsd'], pin: '6666', phone: '0811-1200-4400', device: 'iPhone Arif' },
];
const ROLES = {
  owner: { label: 'Owner', desc: 'Akses dan ubah semua outlet/cabang' },
  manajer: { label: 'Manajer outlet', desc: 'Semua proses & back office untuk outlet yang ditugaskan, menyetujui PIN' },
  kasir: { label: 'Kasir', desc: 'Operasional, inventaris, pembelian, keuangan, absensi, log aktivitas' },
  kasirdapur: { label: 'Kasir + Gudang', desc: 'Seperti Kasir, plus terima barang, transfer & stock opname' },
  dapur: { label: 'Gudang', desc: 'Stok, terima barang & transfer antar outlet' },
};
const RESV_FEE = 5000;
const ALLR = ['owner', 'manajer'];
const KSR = ['owner', 'manajer', 'kasir', 'kasirdapur'];
const PAGE_ROLES = { dashboard: ALLR, reservations: KSR, pos: KSR, orders: KSR, kitchen: ['owner', 'manajer', 'dapur', 'kasir', 'kasirdapur'], tables: KSR, selforder: KSR, products: ALLR, discounts: ALLR, inventory: KSR, purchasing: KSR, finance: KSR, staff: KSR, audit: KSR, reports: ['owner', 'manajer', 'kasir', 'kasirdapur', 'dapur'], settings: ALLR };
const HOME = { owner: 'dashboard', manajer: 'dashboard', kasir: 'pos', kasirdapur: 'pos', dapur: 'inventory' };
const PERM_ROWS = [
  { g: 'Operasional', label: 'Ringkasan', page: 'dashboard' }, { g: 'Operasional', label: 'Kasir', page: 'pos' }, { g: 'Operasional', label: 'Pesanan', page: 'orders' },
  { g: 'Back office', label: 'Inventaris', page: 'inventory' }, { g: 'Back office', label: 'Pembelian', page: 'purchasing' }, { g: 'Back office', label: 'Keuangan', page: 'finance' },
  { g: 'Back office', label: 'Karyawan (absensi)', page: 'staff' }, { g: 'Back office', label: 'Log aktivitas', page: 'audit' },
  { g: 'Back office', label: 'Produk & Diskon', page: 'products' }, { g: 'Back office', label: 'Laporan', page: 'reports' }, { g: 'Back office', label: 'Pengaturan', page: 'settings' },
  { g: 'Aksi', label: 'Buka & tutup shift sendiri, kas masuk/keluar', roles: KSR },
  { g: 'Aksi', label: 'Open bill, terima pembayaran', roles: KSR },
  { g: 'Aksi', label: 'Koreksi metode bayar / hapus item di shift sendiri (tanpa PIN)', roles: KSR },
  { g: 'Aksi', label: 'Minta void, refund, diskon, ubah harga (butuh PIN)', roles: KSR },
  { g: 'Aksi', label: 'Menyetujui dengan PIN', roles: ALLR },
  { g: 'Aksi', label: 'Tinjau shift & selisih kas', roles: ALLR },
  { g: 'Aksi', label: 'Rekap karyawan, pengguna & akses outlet', roles: ALLR },
  { g: 'Aksi', label: 'Ubah harga produk', roles: ALLR },
  { g: 'Aksi', label: 'Ubah data outlet yang ditugaskan', roles: ALLR },
  { g: 'Aksi', label: 'Ubah pengaturan bisnis (modul, kanal, kebijakan)', roles: ['owner'] },
  { g: 'Aksi', label: 'Ubah peran pengguna', roles: ['owner'] },
  { g: 'Aksi', label: 'Akses & ubah semua outlet/cabang', roles: ['owner'] },
  { g: 'Aksi', label: 'Ubah atau hapus log aktivitas', roles: [] },
];
const CHANNELS = [
  { id: 'web', label: 'Website', mark: 'WB', logo: 'assets/pay/ch-web.svg', color: '#1F4A8F', tint: '#EAF0FB' },
  { id: 'shopee', label: 'Shopee', mark: 'SP', logo: 'assets/pay/ch-shopee.svg', color: '#9A3412', tint: '#FCF0E8' },
  { id: 'tokopedia', label: 'Tokopedia', mark: 'TP', logo: 'assets/pay/ch-tokopedia.svg', color: '#14633A', tint: '#EAF5EE' },
  { id: 'gofood', label: 'GoFood', mark: 'GF', logo: ((window.__resources&&window.__resources.chLogo0)||'assets/pay/gojek.svg'), color: '#9E1B2F', tint: '#FBEFF1' },
  { id: 'grabfood', label: 'GrabFood', mark: 'GR', logo: ((window.__resources&&window.__resources.chLogo1)||'assets/pay/grabapp.svg'), color: '#14633A', tint: '#EAF5EE' },
  { id: 'shopeefood', label: 'ShopeeFood', mark: 'SF', logo: ((window.__resources&&window.__resources.chLogo2)||'assets/pay/Shopee.svg'), color: '#9A3412', tint: '#FCF0E8' },
].filter(c => !['gofood', 'grabfood', 'shopeefood'].includes(c.id));
const CHB = Object.fromEntries(CHANNELS.map(c => [c.id, c]));
const isOnline = o => !!(o && o.channel && o.channel !== 'direct');
const EXP_CATS = ['Sewa', 'Listrik & air', 'Gaji & upah', 'Perlengkapan toko', 'Marketing', 'Perbaikan & perawatan', 'Transport', 'Internet & software', 'Lain-lain'];
const SETTINGS = {
  channels: { web: { on: true, comm: 2, markup: 0, inclTax: true, lag: 1 }, shopee: { on: true, comm: 10, markup: 8, inclTax: true, lag: 3 }, tokopedia: { on: true, comm: 9, markup: 8, inclTax: true, lag: 3 } },
  varianceThreshold: 20000, discThreshold: 10, defaultFloat: 500000, expenseCats: EXP_CATS.slice(),
};
const FUNDS = [{ id: 'drawer', label: 'Laci kasir' }, { id: 'bank', label: 'Bank' }, { id: 'ewallet', label: 'E-wallet' }, { id: 'petty', label: 'Kas kecil' }];
const FB = Object.fromEntries(FUNDS.map(f => [f.id, f]));
const TERMS = [{ id: 'tunai', label: 'Tunai', days: 0 }, { id: 'h7', label: 'H+7', days: 7 }, { id: 'h14', label: 'H+14', days: 14 }, { id: 'h30', label: 'H+30', days: 30 }, { id: 'custom', label: 'Lainnya', days: null }];
const DENOMS = [100000, 50000, 20000, 10000, 5000, 2000, 1000];
const CASH_IN_CATS = ['Tambah uang kembalian', 'Dari kas kecil', 'Setoran pemilik', 'Lain-lain'];
const CASH_OUT_NONEXP = ['Setor ke bank', 'Pindah ke kas kecil'];
const REASONS = {
  void: ['Salah input item', 'Salah metode pembayaran', 'Salah jumlah', 'Lain-lain'],
  refund: ['Barang cacat / rusak', 'Ukuran tidak pas', 'Salah ambil barang', 'Komplain · lainnya'],
  cancel: ['Pelanggan membatalkan', 'Salah input', 'Stok habis', 'Pembayaran ganda', 'Lain-lain'],
  disc: ['Kompensasi keluhan', 'Pelanggan tetap', 'Karyawan', 'Rekanan', 'Lain-lain'],
  price: ['Harga label lama', 'Barang display / cacat ringan', 'Kompensasi', 'Lain-lain'],
  reopen: ['Salah metode bayar', 'Tambah item', 'Salah pesanan', 'Lain-lain'],
  nosale: ['Tukar uang kecil', 'Cek isi laci', 'Koreksi kembalian', 'Lain-lain'],
  stock: ['Hasil stock opname', 'Barang rusak', 'Hilang / susut', 'Koreksi input', 'Lain-lain'],
  variance: ['Salah kembalian', 'Uang palsu ditolak', 'Belum ditemukan', 'Lain-lain'],
  pcancel: ['Pembeli membatalkan', 'Melewati batas waktu kirim', 'Stok habis', 'Alamat tidak terjangkau kurir', 'Lain-lain'],
  settle: ['Penyesuaian komisi', 'Pesanan dibatalkan platform', 'Biaya promo merchant', 'Biaya iklan/layanan', 'Pembulatan', 'Lain-lain'],
};
const LOG_TYPES = {
  void_item: ['Void item', 'remove_shopping_cart'], order_edit: ['Koreksi pesanan', 'edit_note'], cancel_order: ['Batalkan pesanan dibayar', 'cancel'], refund: ['Refund', 'currency_exchange'],
  discount_manual: ['Diskon manual', 'percent'], price_override: ['Ubah harga di kasir', 'edit'], reopen_bill: ['Buka ulang tagihan', 'restart_alt'],
  no_sale: ['Buka laci tanpa transaksi', 'point_of_sale'], stock_adjust: ['Penyesuaian stok', 'inventory'], shift_variance: ['Tutup shift dengan selisih', 'warning'],
  shift_open: ['Buka shift', 'lock_open'], shift_close: ['Tutup shift', 'lock'], shift_review: ['Tinjau shift', 'fact_check'],
  cash_in: ['Kas masuk', 'south_west'], cash_out: ['Kas keluar', 'north_east'], login: ['Masuk', 'login'], logout: ['Keluar', 'logout'],
  price_change: ['Ubah harga produk', 'sell'], permission_change: ['Ubah izin pengguna', 'admin_panel_settings'],
  settings_change: ['Ubah pengaturan', 'settings'], online_cancel: ['Dibatalkan di kanal online', 'circle-x'], expense: ['Catat pengeluaran', 'receipt'],
  payable_pay: ['Bayar hutang', 'payments'], settlement: ['Catat pencairan', 'account_balance'], transfer: ['Transfer stok', 'swap_horiz'], po_receive: ['Terima barang', 'inventory_2'], data_reset: ['Reset data demo', 'restart_alt'],
};
const DISCOUNTS = [
  { id: 'd1', name: 'Member Garis', code: 'MEMBER10', type: 'pct', value: 10, active: true, used: 64, note: 'Semua produk, pelanggan terdaftar' },
  { id: 'd2', name: 'Payday Sale', code: 'PAYDAY15', type: 'pct', value: 15, active: true, used: 27, note: 'Tanggal 25 s.d. 2 bulan berikutnya' },
  { id: 'd3', name: 'Potongan Rp50rb', code: 'HEMAT50', type: 'amt', value: 50000, active: false, used: 9, note: 'Min. belanja Rp500.000' },
];

// ── harga & total ───────────────────────────────────────────────────────────
const outletOf = (db, oid) => (db.outlets || []).find(o => o.id === oid) || OUTLETS[0];
const carried = (db, pid, oid) => { const c = db.prodCfg[pid]; if (!c || c.active === false) return false; const o = c.out && c.out[oid]; return !o || o.on !== false; };
const outletPrice = (db, pid, oid) => { const c = db.prodCfg[pid]; const o = c && c.out && c.out[oid]; return (o && o.price) || (c ? c.base : 0); };
const autoChPrice = (db, pid, oid, ch, add) => r500((outletPrice(db, pid, oid) + (add || 0)) * (1 + db.settings.channels[ch].markup / 100));
const chPrice = (db, pid, oid, ch, add) => {
  add = add || 0; if (!ch || ch === 'direct') return outletPrice(db, pid, oid) + add;
  const c = db.prodCfg[pid], ov = c && c.ch && c.ch[ch];
  return ov ? ov + r500(add * (1 + db.settings.channels[ch].markup / 100)) : autoChPrice(db, pid, oid, ch, add);
};
const lineQty = l => l.qty - (l.voidQty || 0);
function calcTot(db, oid, lines, type, ch, discPct) {
  const ol = outletOf(db, oid), pb = ol.pb1 / 100;
  const sub = lines.reduce((a, l) => a + l.price * lineQty(l), 0);
  if (ch && ch !== 'direct') {
    const cs = db.settings.channels[ch]; let tax, total;
    if (cs.inclTax) { total = Math.round(sub); tax = Math.round(total - total / (1 + pb)); } else { tax = Math.round(sub * pb); total = Math.round(sub + tax); }
    const comm = Math.round(total * cs.comm / 100);
    return { sub, disc: 0, svc: 0, tax, total, commissionAmount: comm, expectedPayout: total - comm, inclTax: cs.inclTax };
  }
  const d = Math.round(sub * (discPct || 0)), svc = type === 'dine' && ol.svcOn ? Math.round((sub - d) * ol.svc / 100) : 0, gross = sub - d + svc, tax = Math.round(gross - gross / (1 + pb));
  return { sub, disc: d, svc, tax, total: gross, inclTax: true };
}
const VALID = { new: 1, cooking: 1, ready: 1, picked: 1, served: 1 };
const validSale = o => !!VALID[o.status];
const revenueOf = o => validSale(o) ? o.total - (o.refunded || 0) : 0;
const netOf = o => { if (!validSale(o) || !o.total) return 0; return (o.total - o.tax) * (o.total - (o.refunded || 0)) / o.total; };
function usage(OM, items) {
  const use = {};
  if (OM.RETAIL) { items.forEach(c => { const q = lineQty(c); if (q <= 0) return; const m = OM.MB[c.id], k = m && m.sizes ? c.id + '-' + ((c.mods && c.mods.size) || m.def) : null; if (k && OM.IB[k]) use[k] = (use[k] || 0) + q; else Object.entries(OM.REC[c.id] || {}).forEach(([kk, r]) => { use[kk] = (use[kk] || 0) + r * q; }); }); return use; }
  items.forEach(c => { const q = lineQty(c); if (q <= 0) return; const f = c.mods && c.mods.size === 'L' ? 1.4 : 1; Object.entries(OM.REC[c.id] || {}).forEach(([k, r]) => { const kk = k === 'milk' && c.mods && c.mods.milk === 'oat' ? 'oat' : k; use[kk] = (use[kk] || 0) + r * f * q; }); });
  return use;
}
const costOf = (OM, id) => Object.entries(OM.REC[id] || {}).reduce((a, [k, q]) => a + q * OM.IB[k].cost, 0);

// ── kalkulasi shift (di-cache per referensi array) ───────────────────────────
let IX = {};
function index(db) {
  if (IX.o === db.orders && IX.r === db.refunds && IX.c === db.cashMoves) return IX.v;
  const sh = {}, g = id => sh[id] || (sh[id] = { cashSales: 0, cashRefunds: 0, cashIn: 0, cashOut: 0, nosale: 0, nOrders: 0, pay: {}, payRef: {}, ch: {}, chN: {}, refunds: [], moves: [] });
  db.orders.forEach(o => {
    if (!o.shiftId) return; const x = g(o.shiftId);
    if (isOnline(o)) { if (o.status !== 'pcancel') { x.ch[o.channel] = (x.ch[o.channel] || 0) + o.total; x.chN[o.channel] = (x.chN[o.channel] || 0) + 1; } return; }
    if (!o.paidAt) return; x.nOrders++; const amt = o.paid != null ? o.paid : o.total;
    if (o.method === 'cash') x.cashSales += amt; else x.pay[o.method] = (x.pay[o.method] || 0) + amt;
  });
  db.refunds.forEach(r => { if (!r.shiftId) return; const x = g(r.shiftId); x.refunds.push(r); if (r.method === 'cash') x.cashRefunds += r.amount; else if (!CHB[r.method]) x.payRef[r.method] = (x.payRef[r.method] || 0) + r.amount; });
  db.cashMoves.forEach(m => { const x = g(m.shiftId); x.moves.push(m); if (m.type === 'in') x.cashIn += m.amount; else if (m.type === 'out') x.cashOut += m.amount; else if (m.type === 'nosale') x.nosale++; });
  IX = { o: db.orders, r: db.refunds, c: db.cashMoves, v: sh }; return sh;
}
function shiftCalc(db, s) {
  const x = index(db)[s.id] || { cashSales: 0, cashRefunds: 0, cashIn: 0, cashOut: 0, nosale: 0, nOrders: 0, pay: {}, payRef: {}, ch: {}, chN: {}, refunds: [], moves: [] };
  const rf = x.refunds || [], sm = (v, m) => rf.filter(r => (r.type === 'void') === v && r.method === m).reduce((a, r) => a + r.amount, 0);
  const voidCash = sm(true, 'cash'), voidEdc = sm(true, 'edc'), refCash = sm(false, 'cash'), refEdc = sm(false, 'edc'), edcSales = x.pay.edc || 0;
  return { ...x, voidCash, voidEdc, refCash, refEdc, edcSales, netCash: x.cashSales - voidCash - refCash, netEdc: edcSales - voidEdc - refEdc, expected: s.openCash + x.cashSales - x.cashRefunds + x.cashIn - x.cashOut };
}
const payStatus = (p, now) => { const rem = p.total - p.paid; if (rem <= 0) return 'lunas'; if (p.dueDate < sod(now)) return 'overdue'; return p.paid > 0 ? 'partial' : 'unpaid'; };
const overdueDays = (p, now) => Math.max(0, Math.floor((sod(now) - p.dueDate) / D));
function aging(payables, now) {
  const b = { cur: 0, d30: 0, d60: 0, d90: 0 };
  payables.forEach(p => { const rem = p.total - p.paid; if (rem <= 0) return; const od = p.dueDate < sod(now) ? overdueDays(p, now) : 0; if (!od) b.cur += rem; else if (od <= 30) b.d30 += rem; else if (od <= 60) b.d60 += rem; else b.d90 += rem; });
  return b;
}
const receivable = o => isOnline(o) && o.status !== 'pcancel' && (o.expectedPayout || 0) > 0 && !o.settlementId;

// ── persistensi ─────────────────────────────────────────────────────────────
const DBK = ['v', 'seededAt', 'outlets', 'users', 'settings', 'prodCfg', 'stockBy', 'tablesBy', 'unavailableBy', 'orders', 'moves', 'pos', 'opnames', 'shifts', 'cashMoves', 'expenses', 'payables', 'payPayments', 'settlements', 'refunds', 'wastes', 'transfers', 'logs', 'nextNoBy', 'seq', 'discounts', 'payEnabled', 'selfOrderOn', 'soPrefix', 'menuCats', 'customMenu', 'deletedMenu', 'bom', 'customSup', 'customIng', 'reservations', 'demoMode', 'demoAuto'];
// Data disimpan terkompresi gzip (base64, berawalan GZ) supaya muat di kuota localStorage
// Safari/iPad (±2,5 jt karakter). Browser tanpa CompressionStream memakai JSON biasa.
const GZ = 'gz1:', CAN_GZ = typeof CompressionStream === 'function' && typeof DecompressionStream === 'function';
const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } };
const pickDbk = st => { const o = {}; DBK.forEach(k => { o[k] = st[k]; }); return o; };
const okDb = db => db && db.v === VER ? db : null;
async function gzip(str) {
  const buf = new Uint8Array(await new Response(new Blob([str]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
  let bin = ''; for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
  return btoa(bin);
}
async function gunzip(b64) {
  const bin = atob(b64), buf = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
}
function load() { try { const raw = lsGet(KEY); if (!raw || raw.startsWith(GZ)) return null; return okDb(JSON.parse(raw)); } catch (e) { return null; } }
async function loadAsync() {
  try { const raw = lsGet(KEY); if (!raw) return null; return okDb(JSON.parse(raw.startsWith(GZ) ? await gunzip(raw.slice(GZ.length)) : raw)); } catch (e) { return null; }
}
let saveSeq = 0;
// async; resolve true jika tersimpan. Penyimpanan yang lebih baru selalu menang atas yang lebih lama.
async function save(st) {
  const my = ++saveSeq, json = JSON.stringify(pickDbk(st));
  if (!CAN_GZ) return lsSet(KEY, json);
  let v; try { v = GZ + await gzip(json); } catch (e) { v = json; }
  if (my !== saveSeq) return true;
  return lsSet(KEY, v);
}
// sinkron, untuk saat halaman ditutup: gzip tidak bisa sinkron, jadi coba JSON biasa
function saveNow(st) { saveSeq++; return lsSet(KEY, JSON.stringify(pickDbk(st))); }
function storageInfo() { const raw = lsGet(KEY) || ''; return { chars: raw.length, gz: raw.startsWith(GZ) }; }
function loadSess() { try { return JSON.parse(localStorage.getItem(SKEY) || 'null'); } catch (e) { return null; } }
function saveSess(s) { try { localStorage.setItem(SKEY, JSON.stringify(s)); } catch (e) { } }

// ── seed ────────────────────────────────────────────────────────────────────
function seed(OM, now, mode) {
  mode = mode === 'new' ? 'new' : 'running'; const NEW = mode === 'new', DAYS = 60;
  let s0 = (20261028 + Math.round(sod(now) / D) * 7919) >>> 0; const R = () => { s0 = (Math.imul(s0, 1664525) + 1013904223) >>> 0; return s0 / 4294967296; };
  const ri = (a, b) => a + Math.floor(R() * (b - a + 1)), pk = a => a[Math.floor(R() * a.length)];
  const wp = pairs => { let t = 0; pairs.forEach(p => { t += p[1]; }); let x = R() * t; for (const p of pairs) { x -= p[1]; if (x <= 0) return p[0]; } return pairs[pairs.length - 1][0]; };
  const today = sod(now);
  // toko baru buka: riwayat 60 hari s.d. kemarin tutup, hari ini belum ada aktivitas. NOW = jangkar kejadian "terbaru".
  const NOW = NEW ? today - 90 * MIN : now;
  const db = { v: VER, seededAt: now, demoMode: mode, demoAuto: true, outlets: clone(OUTLETS), users: clone(USERS), settings: clone(SETTINGS), prodCfg: {}, stockBy: {}, tablesBy: {}, unavailableBy: { kmg: {}, snp: {}, bsd: {} }, orders: [], moves: [], pos: [], opnames: [], shifts: [], cashMoves: [], expenses: [], payables: [], payPayments: [], settlements: [], refunds: [], wastes: [], transfers: [], logs: [], nextNoBy: {}, seq: {}, discounts: clone(DISCOUNTS), payEnabled: Object.fromEntries(OM.PAY.map(p => [p.id, true])), selfOrderOn: false, soPrefix: 'Meja' };
  const nid = p => { db.seq[p] = (db.seq[p] || 0) + 1; return p + '-' + String(db.seq[p]).padStart(4, '0'); };
  const U = Object.fromEntries(db.users.map(u => [u.id, u]));
  const devOf = oid => { const o = outletOf(db, oid); return o.device + ' · ' + o.name; };
  const L = e => { const u = U[e.userId]; db.logs.push({ id: nid('LG'), t: e.t, outletId: e.outletId || null, userId: e.userId, role: u.role, type: e.type, objType: e.objType || null, objId: e.objId || null, objLabel: e.objLabel || '', before: e.before == null ? null : e.before, after: e.after == null ? null : e.after, approverId: e.approverId || null, reason: e.reason || '', device: e.device || u.device || devOf(e.outletId) }); };
  const OIDS = ['kmg', 'snp', 'bsd'];

  OM.MENU.forEach(m => { db.prodCfg[m.id] = { base: m.price, active: true, ch: {}, out: { kmg: { on: true, price: null }, snp: { on: true, price: null }, bsd: { on: true, price: null } } }; });
  db.prodCfg.b7.out.bsd.on = false; db.prodCfg.s6.out.bsd.on = false; db.prodCfg.s6.out.snp.price = 799000; db.prodCfg.b2.out.snp.price = 1049000;
  const rq = (i, v) => i.unit === 'pcs' ? Math.round(v) : Math.round(v * 100) / 100;
  db.stockBy.kmg = Object.fromEntries(OM.INGS.map(i => [i.id, i.on]));
  db.stockBy.snp = Object.fromEntries(OM.INGS.map(i => [i.id, rq(i, i.on * 1.35)]));
  db.stockBy.bsd = Object.fromEntries(OM.INGS.map(i => [i.id, rq(i, i.on * 0.85)]));
  OIDS.forEach(oid => { db.tablesBy[oid] = Object.fromEntries(OM.TABLES.map(x => [x.id, { status: 'free', since: null, orders: [], note: '' }])); });
  if (NEW) db.demoAvail = true;

  const W = { a1: 10, a2: 8, a3: 6, a4: 9, a5: 11, a6: 8, a7: 6, a8: 7, s1: 6, s2: 7, s3: 3, s4: 3, s5: 4, s6: 3, s7: 3, s8: 4, s9: 3, b1: 6, b2: 3, b3: 4, b4: 3, b5: 3, b6: 4, b7: 1 };
  const SZW = { S: 15, M: 35, L: 32, XL: 18, 36: 12, 37: 24, 38: 30, 39: 22, 40: 12, 41: 28, 42: 24, 43: 12 };
  const pickSize = m => { const w = m.sizes.map(z => [z, SZW[z] || 10]); if (m.cat === 'Sepatu' && m.sizes[0] === '38') { w[0][1] = 14; w[1][1] = 22; w[2][1] = 30; w[3][1] = 22; w[4][1] = 12; } return wp(w); };
  const WP = Object.entries(W);
  const NAMES = ['Andi', 'Sari', 'Maya', 'Kevin', 'Nadia', 'Rafi', 'Tom', 'Laras', 'Bima', 'Citra', 'Dimas', 'Eka', 'Fikri', 'Gita', 'Hana', 'Indra', 'Joko', 'Kirana', 'Lukas', 'Mira', 'Aditya', 'Bella', 'Cahya', 'Dina', 'Evan', 'Farah', 'Galih', 'Hendra', 'Intan', 'Jessica', 'Kurnia', 'Lina', 'Michael', 'Novi', 'Oscar', 'Putra', 'Qori', 'Reza', 'Siska', 'Teguh', 'Vina', 'Wulan', 'Yosua', 'Zahra', 'Ayu', 'Bagus', 'Clara', 'Daniel', 'Fani', 'Gilang'];
  // pelanggan tetap per outlet: sebagian kecil orang datang berulang kali (pola pareto)
  const REG = { kmg: [['Andi', 9], ['Sari', 7], ['Kevin', 6], ['Laras', 5], ['Bima', 4], ['Hana', 3], ['Reza', 3], ['Intan', 2]], snp: [['Maya', 9], ['Michael', 7], ['Nadia', 6], ['Jessica', 5], ['Daniel', 4], ['Clara', 3], ['Putra', 3]], bsd: [['Rafi', 8], ['Citra', 7], ['Dimas', 5], ['Wulan', 4], ['Galih', 3], ['Fani', 3]] };
  const custOf = (oid, on) => { const r = R(); if (!on && r < .45) return 'Umum'; return r < (on ? .3 : .75) ? wp(REG[oid]) : pk(NAMES); };
  const DRIVERS = ['JNE REG'], COUR = { web: ['JNE REG', 'SiCepat REG', 'Kurir toko'], shopee: ['SPX Express', 'J&T Express'], tokopedia: ['JNE REG', 'SiCepat REG', 'GoSend Same Day'] };
  const METH = [['cash', 18], ['edc', 62], ['gopay', 7], ['ovo', 5], ['dana', 5], ['shopeepay', 3]];
  const HW = { 10: .6, 11: .85, 12: .8, 13: .8, 14: .6, 15: .6, 16: .7, 17: .8, 18: 1, 19: 1, 20: .8, 21: .4 };
  // bobot keramaian kumulatif dalam rentang waktu, supaya volume per jam mengikuti pola harian
  const hwIn = (a, b) => { let x = 0; for (let t = a; t < b;) { const h = new Date(t).getHours(), e = Math.min(b, sod(t) + (h + 1) * H); x += (HW[h] || 0) * (e - t) / H; t = e; } return x; };
  const sampleT = (a, b) => { for (let k = 0; k < 30; k++) { const t = a + R() * (b - a); if (R() < (HW[new Date(t).getHours()] || .25)) return Math.round(t); } return Math.round(a + R() * (b - a)); };
  const pid6 = ch => ch === 'shopee' ? '2611' + ri(10, 99) + String.fromCharCode(65 + ri(0, 25), 65 + ri(0, 25)) + ri(100000, 999999) : ch === 'tokopedia' ? 'INV/2026/MPL/' + ri(1000000, 9999999) : 'GG-WEB-' + ri(10000, 99999);
  const mkItems = (oid, ch) => {
    const n = wp([[1, 58], [2, 30], [3, 9], [4, 3]]), items = [];
    for (let i = 0; i < n; i++) {
      let pid, g = 0; do { pid = wp(WP); g++; } while (!carried(db, pid, oid) && g < 20);
      const m = OM.MB[pid]; const mods = m.sizes ? { size: pickSize(m) } : null;
      const key = pid + JSON.stringify(mods || {}), ex = items.find(x => x.key === key);
      if (ex) ex.qty++; else items.push({ key, id: pid, qty: R() < .04 ? 2 : 1, mods, note: modsStr(OM, pid, mods), price: chPrice(db, pid, oid, ch, modAdd(OM, pid, mods)), done: true });
    }
    return items;
  };
  const CASHIER = { kmg: ['u1', 'u2'], snp: ['u5', 'u5'], bsd: ['u6', 'u6'] };
  const APPR = { kmg: 'u3', snp: 'u3', bsd: 'u4' };
  const BASEN = { kmg: 17, snp: 21, bsd: 13 };
  const wasteOf = (oid, o, t, src, items) => { db.wastes.push({ id: nid('WS'), outletId: oid, t, source: src, orderId: o.id, items: items.map(x => ({ id: x.id, qty: x.qty })), value: Math.round(items.reduce((a, x) => a + costOf(OM, x.id) * x.qty, 0)) }); };
  const apply = (o, tot) => { o.sub = tot.sub; o.disc = tot.disc; o.svc = tot.svc; o.tax = tot.tax; o.total = tot.total; if (tot.commissionAmount != null) { o.commissionAmount = tot.commissionAmount; o.expectedPayout = tot.expectedPayout; } };
  const mkOrder = (oid, no, t, w, opt) => {
    opt = opt || {};
    const ch = opt.ch || (R() < (opt.onP || .24) * 1.1 ? wp([['shopee', 45], ['tokopedia', 33], ['web', 22]]) : 'direct'), on = ch !== 'direct';
    const items = opt.items ? opt.items.map(([id, qty, mods]) => { const mm = OM.MB[id].sizes ? { size: OM.MB[id].def, ...(mods || {}) } : null; return { key: id + JSON.stringify(mm || {}), id, qty, mods: mm, note: modsStr(OM, id, mm), price: chPrice(db, id, oid, ch, modAdd(OM, id, mm)), done: false }; }) : mkItems(oid, ch);
    const type = opt.type || (on ? 'online' : 'take');
    let discPct = 0, discLabel = '';
    if (!on && !opt.items) { if (R() < .14) { const p = pk([['MEMBER10', 10], ['MEMBER10', 10], ['PAYDAY15', 15]]); discPct = p[1] / 100; discLabel = p[0]; } }
    const tot = calcTot(db, oid, items, type, ch, discPct);
    const method = on ? ch : (opt.method || wp(METH));
    const o = { id: 'O-' + oid + '-' + no, no, outletId: oid, channel: ch, source: on ? 'manual' : (opt.source || (type === 'dine' && R() < .15 ? 'qr' : 'kasir')), type, table: type === 'dine' ? (opt.table || 'T' + String(ri(1, 12)).padStart(2, '0')) : null, customer: opt.cust || custOf(oid, on), items, ...tot, discPct, discLabel, paid: on || opt.status === 'pending' ? 0 : tot.total, refunded: 0, method: opt.status === 'pending' ? 'none' : method, status: opt.status || 'served', createdAt: t, paidAt: on || opt.status === 'pending' ? null : t, userId: w ? w.user : null, shiftId: w && opt.status !== 'pending' ? w.id : null };
    if (o.source === 'qr' && o.customer === 'Umum') o.customer = pk(NAMES); // self order selalu isi nama
    if (opt.custNote) o.custNote = opt.custNote;
    if (type === 'dine' && !on && o.source === 'kasir' && no % 9 === 0) o.resv = { ref: 'RSV-' + oid.toUpperCase().slice(0, 3) + '-' + String(no).padStart(4, '0'), source: 'Booking app', fee: RESV_FEE, name: o.customer === 'Umum' ? pk(NAMES) : o.customer, at: t - 2 * H };
    if (on) Object.assign(o, { channelOrderId: pid6(ch), driver: opt.driver || pk(COUR[ch] || DRIVERS), appNote: R() < .3 ? pk(['Tolong dibungkus kado ya', 'Kirim hari ini kalau bisa', 'Cek ukuran sebelum kirim', 'Jangan pakai bubble wrap berlebihan']) : '', appTotal: tot.total, expectedPayoutDate: sod(t) + db.settings.channels[ch].lag * D, settlementId: null });
    return o;
  };

  const RAIN = Array.from({ length: DAYS }, () => R() < .3), PAYDAY = d => { const x = new Date(today - d * D).getDate(); return x >= 25 || x <= 2; };
  OIDS.forEach((oid, k) => {
    const wins = [];
    for (let d = DAYS - 1; d >= (NEW ? 1 : 0); d--) {
      const day0 = today - d * D, dow = new Date(day0).getDay();
      let blocks = [[day0 + 10 * H, day0 + 16 * H], [day0 + 16 * H, day0 + 22 * H]];
      if (d === 0) { blocks = blocks.map(([a, b]) => [a, Math.min(b, now)]).filter(([a, b]) => b - a >= 10 * MIN); }
      blocks.forEach(([a, b], bi) => {
        const f = (dow === 0 || dow === 6 ? 1.3 : dow === 5 ? 1.1 : 1) * (PAYDAY(d) ? 1.12 : 1) * (RAIN[d] ? .9 : 1) * (0.85 + R() * .3) * (1 + (59 - d) * 0.0017);
        // shift berjalan: volume dihitung s.d. 20 menit lalu; sisanya adalah tiket aktif di dapur
        const last = d === 0 && b >= now, n = Math.round(BASEN[oid] * f * hwIn(a, last ? now - 20 * MIN : b) / hwIn(day0 + 10 * H, day0 + 22 * H));
        const sh = { id: nid('SH'), outletId: oid, userId: CASHIER[oid][bi], openedAt: a, openCash: 500000, closedAt: d === 0 && b >= now ? now : b, denoms: null, counted: null, expected: null, variance: null, note: '', approverId: null, status: 'closed', reviewNote: '', reviewedBy: null };
        db.shifts.push(sh); wins.push({ id: sh.id, a, b, user: sh.userId, d, n, sh, last });
      });
    }
    // tiket aktif dapur dihitung sebagai bagian dari volume shift berjalan, bukan tambahan
    const busy = HW[new Date(now).getHours()] || .25, nHC = { kmg: 9, snp: 3, bsd: 2 }[oid];
    // tiket aktif = pesanan ±20 menit terakhir; dibatasi volume shift supaya pagi hari tidak langsung penuh
    const lw0 = wins.find(w => w.last), nAct = lw0 ? Math.min(nHC, Math.max(1, Math.round(lw0.n * .5)), Math.max(oid === 'kmg' ? 3 : 1, Math.round((oid === 'kmg' ? 6 : nHC) * busy))) : 0;
    const slots = [];
    wins.forEach(w => { const lim = w.last ? now - 20 * MIN : w.b - 2 * MIN; if (lim <= w.a + 2 * MIN) return; for (let i = 0; i < w.n; i++) slots.push({ t: sampleT(w.a + 2 * MIN, lim), w }); });
    slots.sort((a, b) => a.t - b.t);
    let no = 1001;
    const recent = Date.now() - 7 * D;
    slots.forEach(({ t, w }) => {
      const o = mkOrder(oid, no++, t, w, { onP: RAIN[w.d] ? .4 : .24 }); db.orders.push(o);
      const fraud = oid === 'snp' && t > today - 6 * D;
      const appr = APPR[oid] === w.user ? 'u4' : APPR[oid];
      if (o.channel === 'direct') {
        if (R() < (fraud ? .012 : .006)) {
          const pct = ri(15, 30), tot = calcTot(db, oid, o.items, o.type, 'direct', pct / 100); o.discPct = pct / 100; o.discLabel = 'Diskon manual ' + pct + '%'; apply(o, tot); o.paid = o.total;
          L({ t, outletId: oid, userId: w.user, type: 'discount_manual', objType: 'order', objId: o.id, objLabel: 'Pesanan #' + o.no, before: '0%', after: pct + '%', approverId: appr, reason: pk(REASONS.disc) });
        }
        const rT = Math.min(t + ri(3, 20) * MIN, w.b - MIN);
        const r = R();
        if (r < (fraud ? .03 : .008) && o.items.some(l => l.qty > 0)) {
          const li = Math.floor(R() * o.items.length), it = o.items[li], before = lineQty(it); it.voidQty = (it.voidQty || 0) + 1;
          const tot = calcTot(db, oid, o.items, o.type, 'direct', o.discPct); const amt = o.total - tot.total; apply(o, tot); const made = R() < .4;
          db.refunds.push({ id: nid('RF'), orderId: o.id, outletId: oid, t: rT, amount: amt, method: o.method, type: 'void', shiftId: w.id, userId: w.user, approverId: appr, reason: pk(REASONS.void), items: [{ id: it.id, qty: 1 }] });
          if (made) wasteOf(oid, o, rT, 'void', [{ id: it.id, qty: 1 }]);
          L({ t: rT, outletId: oid, userId: w.user, type: 'void_item', objType: 'order', objId: o.id, objLabel: 'Pesanan #' + o.no, before: before + '× ' + OM.MB[it.id].name, after: (before - 1) + '× ' + OM.MB[it.id].name, approverId: appr, reason: db.refunds[db.refunds.length - 1].reason + (made ? ' · sudah dibuat' : '') });
        } else if (r < .016) {
          const amt = Math.min(o.total, Math.round(o.items[0].price * 1.1)); o.refunded = amt; const m = o.method === 'cash' ? 'cash' : o.method;
          db.refunds.push({ id: nid('RF'), orderId: o.id, outletId: oid, t: rT, amount: amt, method: m, type: 'partial', shiftId: w.id, userId: w.user, approverId: appr, reason: pk(REASONS.refund) });
          L({ t: rT, outletId: oid, userId: w.user, type: 'refund', objType: 'order', objId: o.id, objLabel: 'Pesanan #' + o.no, before: fmtR(o.total), after: fmtR(o.total - amt), approverId: appr, reason: db.refunds[db.refunds.length - 1].reason + ' · ' + (m === 'cash' ? 'Tunai' : (OM.PB[m] || {}).label) });
        } else if (r < .02) {
          o.status = 'cancelled'; o.refunded = o.total; const made = R() < .5;
          db.refunds.push({ id: nid('RF'), orderId: o.id, outletId: oid, t: rT, amount: o.total, method: o.method, type: 'cancel', shiftId: w.id, userId: w.user, approverId: appr, reason: pk(REASONS.cancel) });
          if (made) wasteOf(oid, o, rT, 'cancel', o.items);
          L({ t: rT, outletId: oid, userId: w.user, type: 'cancel_order', objType: 'order', objId: o.id, objLabel: 'Pesanan #' + o.no, before: 'Dibayar ' + fmtR(o.total), after: 'Dibatalkan', approverId: appr, reason: db.refunds[db.refunds.length - 1].reason });
        }
      } else if (R() < .015) {
        o.status = 'pcancel'; o.cancelReason = pk(REASONS.pcancel); o.wasted = false; o.commissionAmount = 0; o.expectedPayout = 0;
        if (o.wasted) wasteOf(oid, o, t + 15 * MIN, 'pcancel', o.items);
        L({ t: t + 15 * MIN, outletId: oid, userId: w.user, type: 'online_cancel', objType: 'order', objId: o.id, objLabel: CHB[o.channel].label + ' ' + o.channelOrderId, before: 'Disiapkan', after: 'Dibatalkan platform', reason: o.cancelReason + (o.wasted ? ' · makanan terbuang' : '') });
      }
    });
    // pesanan terbaru (KDS) per outlet
    const liveW = wins.find(w => w.last);
    const findW = () => liveW;
    // tiket aktif di dapur; urutan = prioritas tampil (fitur yang paling sering didemokan dulu)
    const HC0 = OM.RETAIL ? ({ kmg: [[12, { ch: 'direct', type: 'take', items: [['a6', 1, { size: 'XL' }], ['b6', 1]], status: 'served', method: 'edc' }], [47, { ch: 'direct', type: 'take', items: [['s2', 1, { size: '41' }]], status: 'served', method: 'cash' }], [6, { ch: 'shopee', items: [['a4', 1, { size: 'L' }]], status: 'new' }], [22, { ch: 'web', items: [['s1', 1, { size: '40' }]], status: 'new' }], [38, { ch: 'tokopedia', items: [['b1', 1], ['a2', 1, { size: 'M' }]], status: 'cooking' }], [55, { ch: 'web', items: [['a1', 2, { size: 'M' }]], status: 'ready' }], [85, { ch: 'shopee', items: [['s8', 1, { size: '38' }]], status: 'picked' }]], snp: [[18, { ch: 'tokopedia', items: [['a6', 1, { size: 'M' }]], status: 'new' }], [60, { ch: 'shopee', items: [['b6', 1]], status: 'picked' }]], bsd: [[30, { ch: 'web', items: [['s5', 1, { size: '42' }]], status: 'cooking' }]] })[oid] : oid === 'kmg' ? [
      [16.4, { type: 'take', items: [['k5', 1, { temp: 'hot' }], ['p2', 2]], status: 'ready', method: 'ovo', cust: 'Maya' }],
      [12.6, { type: 'dine', table: 'T09', items: [['f2', 1], ['n1', 1], ['f4', 1]], status: 'cooking', method: 'edc', cust: 'Kevin', done: [1] }],
      [11, { ch: 'grabfood', items: [['k1', 2], ['p3', 1]], status: 'ready', cust: 'Laras', driver: 'Mas Andre' }],
      [7.2, { type: 'dine', table: 'T02', items: [['f1', 1], ['k3', 2, { temp: 'hot' }]], status: 'cooking', method: 'cash', cust: 'Umum', done: [1] }],
      [5, { ch: 'gofood', items: [['k4', 1, { size: 'L' }], ['f1', 1]], status: 'cooking', cust: 'Bima', driver: 'Pak Sutrisno' }],
      [3.5, { type: 'take', items: [['k4', 1, { size: 'L', milk: 'oat' }], ['p3', 1]], status: 'new', method: 'gopay', cust: 'Sari' }],
      [2.1, { type: 'dine', table: 'T08', items: [['k3', 2, { temp: 'hot' }], ['p1', 1]], status: 'pending', source: 'qr', cust: 'Rafi' }],
      [1.2, { type: 'dine', table: 'T07', items: [['k1', 2, { sugar: 'less' }], ['p1', 2]], status: 'new', method: 'edc', cust: 'Andi' }],
      [0.6, { type: 'dine', table: 'T03', items: [['k1', 1, { size: 'L' }], ['n1', 1, { sugar: 'none' }], ['p3', 1]], status: 'pending', source: 'qr', cust: 'Nadia', custNote: 'Tolong cepat ya, mau meeting' }],
    ] : oid === 'snp' ? [
      [9, { type: 'take', items: [['k2', 1], ['p1', 1]], status: 'ready', method: 'edc', cust: 'Gita' }],
      [6, { ch: 'shopeefood', items: [['k1', 2], ['f1', 1]], status: 'cooking', cust: 'Dimas', driver: 'Mas Ilham' }],
      [2, { type: 'dine', table: 'T03', items: [['k4', 1], ['p3', 1]], status: 'new', method: 'cash', cust: 'Eka' }],
    ] : [
      [8, { type: 'dine', table: 'T01', items: [['f1', 1], ['n3', 1]], status: 'cooking', method: 'edc', cust: 'Indra' }],
      [3, { ch: 'grabfood', items: [['k1', 1], ['p2', 2]], status: 'new', cust: 'Kirana', driver: 'Pak Yanto' }],
    ];
    const tb = db.tablesBy[oid];
    // jumlah tiket mengikuti tingkat keramaian jam ini, supaya tidak ada lonjakan di jam sepi
    const PRIO = oid === 'kmg' && !OM.RETAIL ? [8, 1, 2, 4, 7, 0, 6, 3, 5] : HC0.map((_, i) => i);
    const keep = new Set(PRIO.filter(i => i < HC0.length).slice(0, OM.RETAIL ? 99 : nAct));
    const freeT = OM.TABLES.map(x => x.id).filter(x => !(oid === 'kmg' && (x === 'T04' || x === 'T11'))).sort(() => R() - .5);
    const HC = HC0.filter((_, i) => keep.has(i)).map(([ago, opt]) => {
      const o2 = { ch: 'direct', ...opt }; if (o2.type === 'dine') o2.table = freeT.shift();
      if (!o2.custNote) o2.cust = o2.status === 'pending' || o2.ch !== 'direct' ? pk(NAMES) : custOf(oid, false); if (o2.ch !== 'direct') o2.driver = pk(COUR[o2.ch] || DRIVERS);
      return [ago, o2];
    });
    HC.forEach(([ago, opt]) => {
      const t = Math.round(now - ago * MIN), w = findW(t);
      if (!w || t < w.a + MIN) return;
      const o = mkOrder(oid, no++, t, w, opt);
      if (opt.done) o.items.forEach((it, i) => { it.done = opt.done.includes(i); });
      if (o.status === 'ready' || o.status === 'served') o.items.forEach(it => { it.done = true; });
      db.orders.push(o);
      if (o.table && ['new', 'cooking', 'ready'].includes(o.status)) { const x = tb[o.table]; tb[o.table] = { status: 'occupied', since: x.status === 'occupied' ? x.since : t, orders: [...(x.status === 'occupied' ? x.orders : []), o.no], note: '' }; }
    });
    if (oid === 'kmg' && liveW) { tb.T04 = { status: 'dirty', since: now - 30 * MIN, orders: [], note: '' }; tb.T11 = { status: 'reserved', since: null, orders: [], note: 'Bu Lina · 4 orang · 19:00' }; }
    db.nextNoBy[oid] = no;

    // kas & tutup shift
    wins.forEach(w => {
      const sh = w.sh, fraud = oid === 'snp' && w.d <= 6, appr = APPR[oid] === w.user ? 'u4' : APPR[oid];
      const at = () => Math.round(w.a + (w.b - w.a) * (0.15 + R() * 0.7));
      if (R() < .3) {
        const exp = R() < .6 ? ['Perlengkapan toko', 'Plastik & paper bag tambahan', ri(5, 12) * 10000] : ['Transport', 'Parkir & ojek antar barang', ri(2, 8) * 5000];
        const t = at(), cmId = nid('CM'), exId = nid('EX');
        db.cashMoves.push({ id: cmId, shiftId: sh.id, outletId: oid, t, type: 'out', amount: exp[2], category: exp[0], reason: exp[1], userId: w.user, expenseId: exId });
        db.expenses.push({ id: exId, no: exId, outletId: oid, date: t, category: exp[0], desc: exp[1], amount: exp[2], source: 'drawer', shiftId: sh.id, cashMoveId: cmId, receipt: R() < .7 ? 'struk-' + exId.toLowerCase() + '.jpg' : null, recurring: false, seriesId: null, status: 'posted', userId: w.user });
      }
      if (R() < .05) { const t = at(); db.cashMoves.push({ id: nid('CM'), shiftId: sh.id, outletId: oid, t, type: 'in', amount: 100000, category: 'Tambah uang kembalian', reason: 'Pecahan Rp5.000 dari kas kecil', userId: w.user }); }
      if (R() < (fraud ? .4 : .03)) { const t = at(), rs = pk(REASONS.nosale); db.cashMoves.push({ id: nid('CM'), shiftId: sh.id, outletId: oid, t, type: 'nosale', amount: 0, category: '', reason: rs, userId: w.user, approverId: appr }); L({ t, outletId: oid, userId: w.user, type: 'no_sale', objType: 'shift', objId: sh.id, objLabel: 'Shift ' + sh.id, approverId: appr, reason: rs }); }
      if (w.d <= 6) L({ t: w.a, outletId: oid, userId: w.user, type: 'login', objType: 'user', objId: w.user, objLabel: U[w.user].name });
      L({ t: w.a + MIN, outletId: oid, userId: w.user, type: 'shift_open', objType: 'shift', objId: sh.id, objLabel: 'Shift ' + sh.id, after: fmtR(sh.openCash) });
      if (w.last) { sh.closedAt = null; sh.status = 'open'; return; }
      sh.closedAt = w.b;
      const x = shiftCalc(db, sh); IX = {};
      const r = R(); let v = 0;
      if (r < .2) v = (R() < .5 ? -1 : 1) * ri(1, 10) * 500; else if (r < .28) v = -ri(2, 8) * 5000; else if (r < .3) v = R() < .5 ? -ri(5, 12) * 10000 : ri(2, 4) * 10000;
      if (fraud && R() < .4) v = -ri(3, 6) * 10000;
      sh.expected = x.expected; sh.variance = v; sh.counted = x.expected + v;
      const thr = db.settings.varianceThreshold;
      if (Math.abs(v) > thr) { sh.note = pk(REASONS.variance) + (v < 0 ? ' · uang kurang' : ' · uang lebih'); sh.approverId = appr; L({ t: sh.closedAt, outletId: oid, userId: w.user, type: 'shift_variance', objType: 'shift', objId: sh.id, objLabel: 'Shift ' + sh.id, before: 'Seharusnya ' + fmtR(sh.expected), after: 'Dihitung ' + fmtR(sh.counted), approverId: appr, reason: sh.note }); }
      L({ t: sh.closedAt, outletId: oid, userId: w.user, type: 'shift_close', objType: 'shift', objId: sh.id, objLabel: 'Shift ' + sh.id, after: 'Selisih ' + (v ? (v < 0 ? '−' : '+') + fmtR(Math.abs(v)) : 'Rp 0') });
      if (w.d <= 6) L({ t: sh.closedAt + 1000, outletId: oid, userId: w.user, type: 'logout', objType: 'user', objId: w.user, objLabel: U[w.user].name });
      if (w.d > 3 && R() < .75) { sh.status = 'reviewed'; sh.reviewedBy = 'u4'; sh.reviewNote = Math.abs(v) > thr ? 'Sudah dibahas dengan kasir' : 'OK'; }
    });
  });

  // pencairan platform (mingguan per outlet & kanal)
  const wk = t => { const d = new Date(sod(t)); const k = (d.getDay() + 6) % 7; return d.getTime() - k * D; };
  OIDS.forEach(oid => CHANNELS.forEach(c => {
    const g = {};
    db.orders.forEach(o => { if (o.outletId === oid && o.channel === c.id && receivable(o)) { const k = wk(o.expectedPayoutDate); (g[k] = g[k] || []).push(o); } });
    Object.keys(g).map(Number).sort((a, b) => a - b).forEach(k => {
      const end = k + 7 * D; if (end > today - 2 * D) return;
      if (oid === 'kmg' && c.id === 'gofood' && end > today - 12 * D) return;
      const os = g[k], exp = os.reduce((a, o) => a + o.expectedPayout, 0); const r = R();
      const diff = r < .15 ? -ri(2, 15) * 1000 : r < .2 ? -ri(20, 60) * 1000 : 0;
      const st = { id: nid('PC'), no: null, outletId: oid, channel: c.id, receivedAt: end + D + 10 * H, amount: exp + diff, expected: exp, diff, reason: diff ? (r < .15 ? pk(['Biaya promo merchant', 'Penyesuaian komisi']) : 'Pesanan dibatalkan platform') : '', orderIds: os.map(o => o.id), userId: 'u4' };
      st.no = st.id; db.settlements.push(st); os.forEach(o => { o.settlementId = st.id; });
      L({ t: st.receivedAt, outletId: oid, userId: 'u4', type: 'settlement', objType: 'settlement', objId: st.id, objLabel: c.label + ' ' + st.id, before: 'Diharapkan ' + fmtR(exp), after: 'Diterima ' + fmtR(st.amount), reason: st.reason });
    });
  }));

  // pembelian & hutang
  const PLAN = { s1: [14, 'h30'], s2: [14, 'h30'], s3: [7, 'h14'] };
  const TD = Object.fromEntries(TERMS.map(t => [t.id, t.days]));
  const recs = [];
  OIDS.forEach((oid, k) => Object.entries(PLAN).forEach(([sup, [ev, term]]) => {
    for (let d = 56 - k * 2 - (sup.charCodeAt(1) % 3); d >= 2; d -= ev) recs.push({ oid, sup, term, d });
  }));
  recs.sort((a, b) => b.d - a.d);
  // stok mengikuti penjualan: tiap hari berkurang sesuai resep pesanan, PO datang mengisi ulang sesuai kebutuhan
  const EV = Object.fromEntries(Object.entries(PLAN).map(([k, v]) => [k, v[0]]));
  const USE = {}, DAILY = {};
  OIDS.forEach(oid => { USE[oid] = {}; DAILY[oid] = {}; });
  db.orders.forEach(o => {
    if (o.status === 'pending' || (o.status === 'pcancel' && !o.wasted)) return;
    const d = Math.round((today - sod(o.createdAt)) / D), u = usage(OM, o.items), m = USE[o.outletId][d] || (USE[o.outletId][d] = {});
    Object.keys(u).forEach(k => { m[k] = (m[k] || 0) + u[k]; DAILY[o.outletId][k] = (DAILY[o.outletId][k] || 0) + u[k] / DAYS; });
  });
  const TGT = (oid, i) => i.par * 1.9 + (DAILY[oid][i.id] || 0) * EV[i.sup] * 1.3;
  const PACK = i => i.cat === 'Tas' ? 3 : 2;
  const needOf = (oid, i, st) => { const need = TGT(oid, i) - st, pk1 = PACK(i); return need > pk1 * .5 ? Math.round(Math.ceil(need / pk1 - 1e-9) * pk1 * 100) / 100 : 0; };
  const STK = {}; OIDS.forEach(oid => { STK[oid] = Object.fromEntries(OM.INGS.map(i => [i.id, TGT(oid, i)])); });
  const RCV = {}; recs.forEach(rc => (RCV[rc.d] = RCV[rc.d] || []).push(rc));
  const mkPO = (rc, lines) => {
    const total = Math.round(lines.reduce((a, l) => a + l.qty * l.cost, 0)), rcv = today - rc.d * D + 10 * H, no = nid('PO');
    const pay = { id: nid('AP'), poId: no, poNo: no, outletId: rc.oid, sup: rc.sup, invoiceNo: 'INV/' + rc.sup.toUpperCase() + '/' + ri(1000, 9999), invoiceDate: sod(rcv), term: rc.term, termDays: TD[rc.term], dueDate: sod(rcv) + TD[rc.term] * D, total, paid: 0 };
    const po = { id: no, no, outletId: rc.oid, sup: rc.sup, lines, status: 'received', createdAt: rcv - D, eta: 'Diterima', term: rc.term, termDays: TD[rc.term], receivedAt: rcv, invoiceNo: pay.invoiceNo, payableId: pay.id };
    db.pos.push(po); db.payables.push(pay);
    const P = (t, amt, src) => { db.payPayments.push({ id: nid('PP'), payableId: pay.id, outletId: rc.oid, t, amount: amt, source: src, shiftId: null, userId: 'u4' }); pay.paid += amt; };
    if (rc.term === 'tunai') P(rcv, total, 'petty');
    else if (pay.dueDate < today) { const r = R(); if (r < .78) P(Math.min(pay.dueDate - ri(0, 2) * D + 11 * H, NOW), total, 'bank'); else if (r < .9) P(pay.dueDate - D + 11 * H, Math.round(total / 2), 'bank'); }
    else if (R() < .15) P(rcv + D, Math.round(total / 2), 'bank');
    return po;
  };
  for (let d = DAYS - 1; d >= 0; d--) {
    (RCV[d] || []).forEach(rc => {
      const lines = OM.INGS.filter(i => i.sup === rc.sup).map(i => ({ ing: i.id, qty: needOf(rc.oid, i, STK[rc.oid][i.id]), cost: i.cost })).filter(l => l.qty > 0);
      if (!lines.length) return;
      lines.forEach(l => { STK[rc.oid][l.ing] += l.qty; });
      const po = mkPO(rc, lines);
      if (rc.d <= 10) lines.forEach(l => db.moves.push({ t: po.receivedAt, outletId: rc.oid, ing: l.ing, d: l.qty, reason: 'Penerimaan ' + po.no }));
    });
    OIDS.forEach(oid => { const u = USE[oid][d] || {}; Object.keys(u).forEach(k => { STK[oid][k] = Math.max(0, STK[oid][k] - u[k]); }); });
  }
  [['kmg', 's3', 100, 30, 8250000, 0], ['snp', 's1', 70, 30, 12460000, 5000000], ['bsd', 's2', 40, 14, 6720000, 0]].forEach(([oid, sup, ago, days, total, paid]) => {
    const p = { id: nid('AP'), poId: null, poNo: 'Saldo awal', outletId: oid, sup, invoiceNo: 'INV/' + sup.toUpperCase() + '/' + ri(1000, 9999), invoiceDate: today - ago * D, term: days === 30 ? 'h30' : 'h14', termDays: days, dueDate: today - ago * D + days * D, total, paid: 0 };
    db.payables.push(p); if (paid) { db.payPayments.push({ id: nid('PP'), payableId: p.id, outletId: oid, t: p.dueDate + 3 * D, amount: paid, source: 'bank', shiftId: null, userId: 'u4' }); p.paid = paid; }
  });
  // PO terbuka berisi bahan yang memang sedang menipis di outlet itu
  const kPo = (sup, st, ago, eta, oid, term) => { const no = nid('PO'), ings = OM.INGS.filter(i => i.sup === sup); let lines = ings.map(i => ({ ing: i.id, qty: needOf(oid, i, STK[oid][i.id]), cost: i.cost })).filter(l => l.qty > 0).sort((a, b) => STK[oid][a.ing] / OM.IB[a.ing].par - STK[oid][b.ing] / OM.IB[b.ing].par).slice(0, 4); if (!lines.length) lines = ings.slice(0, 2).map(i => ({ ing: i.id, qty: PACK(i) * 2, cost: i.cost })); db.pos.push({ id: no, no, outletId: oid, sup, lines, status: st, createdAt: NOW - ago, eta, term, termDays: TD[term], receivedAt: null, invoiceNo: '', payableId: null }); };
  kPo('s1', 'sent', 20 * H, NEW ? 'Hari ini' : 'Besok', 'kmg', 'h30'); kPo('s3', 'draft', 30 * MIN, '—', 'kmg', 'h14'); kPo('s2', 'sent', 3 * H, NEW ? 'Besok' : 'Hari ini', 'snp', 'h30');

  // pengeluaran rutin
  const REC = [
    ['Sewa', 'Sewa tempat bulanan', 1, { kmg: 35000000, snp: 45000000, bsd: 25000000 }, 'bank', false],
    ['Internet & software', 'Internet + langganan Omnify Pro', 3, { kmg: 1150000, snp: 1150000, bsd: 1150000 }, 'bank', false],
    ['Listrik & air', 'Tagihan PLN & PDAM', 3, { kmg: 5200000, snp: 6400000, bsd: 4100000 }, 'bank', true],
    ['Lain-lain', 'Iuran keamanan & kebersihan', 10, { kmg: 300000, snp: 450000, bsd: 250000 }, 'petty', false],
    ['Gaji & upah', 'Gaji karyawan', 25, { kmg: 26000000, snp: 31000000, bsd: 19000000 }, 'bank', false],
  ];
  const nd = new Date(NOW);
  OIDS.forEach(oid => REC.forEach(([cat, desc, day, amt, src, varAmt]) => {
    const series = 'RS-' + oid + '-' + cat.replace(/\W/g, '');
    let drafted = false;
    for (let mo = -3; mo <= 1; mo++) {
      const dt = new Date(nd.getFullYear(), nd.getMonth() + mo, day, 9).getTime();
      if (dt < NOW - 62 * D) continue;
      const a = varAmt ? Math.round(amt[oid] * (0.9 + R() * 0.25) / 1000) * 1000 : amt[oid];
      if (dt <= NOW) { const id = nid('EX'); db.expenses.push({ id, no: id, outletId: oid, date: dt, category: cat, desc, amount: a, source: src, shiftId: null, cashMoveId: null, receipt: 'bukti-' + id.toLowerCase() + '.pdf', recurring: true, seriesId: series, status: 'posted', userId: 'u4' }); }
      else if (!drafted) { drafted = true; const id = nid('EX'); db.expenses.push({ id, no: id, outletId: oid, date: dt, category: cat, desc, amount: amt[oid], source: src, shiftId: null, cashMoveId: null, receipt: null, recurring: true, seriesId: series, status: 'draft', userId: 'u4' }); }
    }
  }));
  [['snp', 'Marketing', 'Endorse influencer fashion', 3500000, 'ewallet', 18], ['kmg', 'Marketing', 'Cetak lookbook & poster promo', 1250000, 'petty', 26], ['kmg', 'Perbaikan & perawatan', 'Servis AC & lampu display', 1200000, 'bank', 9], ['bsd', 'Perbaikan & perawatan', 'Ganti selang AC', 450000, 'petty', 33]].forEach(([oid, cat, desc, a, src, ago]) => { const id = nid('EX'); db.expenses.push({ id, no: id, outletId: oid, date: today - ago * D + 11 * H, category: cat, desc, amount: a, source: src, shiftId: null, cashMoveId: null, receipt: 'bukti-' + id.toLowerCase() + '.jpg', recurring: false, seriesId: null, status: 'posted', userId: 'u3' }); });

  // transfer, mutasi, opname, log lain
  db.transfers.push({ id: 'TR-0001', no: 'TR-0001', from: 'kmg', to: 'snp', lines: [{ ing: 'a5-M', qty: 4, recv: 3 }, { ing: 'a5-L', qty: 4, recv: 4 }], status: 'received', requestedAt: today - 6 * D + 9 * H, requestedBy: 'u3', sentAt: today - 5 * D + 8 * H, sentBy: 'u1', receivedAt: today - 5 * D + 11 * H, receivedBy: 'u5', note: '' });
  db.transfers.push({ id: 'TR-0002', no: 'TR-0002', from: 'snp', to: 'bsd', lines: [{ ing: 's5-41', qty: 2, recv: null }, { ing: 's5-42', qty: 1, recv: null }], status: 'sent', requestedAt: today - D + 15 * H, requestedBy: 'u6', sentAt: NOW - 3 * H, sentBy: 'u5', receivedAt: null, receivedBy: null, note: '' });
  db.transfers.push({ id: 'TR-0003', no: 'TR-0003', from: 'kmg', to: 'bsd', lines: [{ ing: 'b1', qty: 2, recv: null }, { ing: 'b6', qty: 2, recv: null }], status: 'requested', requestedAt: NOW - 2 * H, requestedBy: 'u6', sentAt: null, sentBy: null, receivedAt: null, receivedBy: null, note: 'Ransel laku keras minggu ini, PO baru datang 3 hari lagi' });
  db.seq.TR = 3;
  L({ t: today - 5 * D + 11 * H, outletId: 'snp', userId: 'u5', type: 'transfer', objType: 'transfer', objId: 'TR-0001', objLabel: 'TR-0001 Kemang → Senopati', before: 'Dikirim 4 pcs Polo Knit Stripe Marun · M', after: 'Diterima 3 pcs (selisih −1 pcs)', reason: 'Selisih saat penerimaan' });
  const tOpen = x => Math.min(NOW - MIN, Math.max(sod(NOW) + 10 * H + 5 * MIN, x));
  [{ t: tOpen(NOW - 150 * MIN), outletId: 'kmg', ing: 'a1-M', d: -1, reason: 'Rusak · noda di display' }, { t: tOpen(NOW - 120 * MIN), outletId: 'kmg', ing: 'b6', d: -1, reason: 'Hilang · selisih cek display' }, { t: NOW - 3 * H, outletId: 'snp', ing: 's5-41', d: -2, reason: 'Transfer keluar TR-0002 → BSD' }, { t: NOW - 3 * H, outletId: 'snp', ing: 's5-42', d: -1, reason: 'Transfer keluar TR-0002 → BSD' }]
    .forEach(m => { db.moves.push(m); STK[m.outletId][m.ing] = Math.max(0, STK[m.outletId][m.ing] + m.d); });
  // mutasi penjualan hari ini, sama seperti yang dicatat kasir
  db.orders.forEach(o => { if (o.createdAt < today || o.status === 'pending' || (o.status === 'pcancel' && !o.wasted)) return; const u = usage(OM, o.items), lb = isOnline(o) ? CHB[o.channel].label + ' #' + o.no : 'pesanan #' + o.no; Object.keys(u).forEach(k => db.moves.push({ t: o.createdAt, outletId: o.outletId, ing: k, d: -Math.round(u[k] * 1000) / 1000, reason: 'Terjual · ' + lb })); });
  OIDS.forEach(oid => { db.stockBy[oid] = Object.fromEntries(OM.INGS.map(i => [i.id, rq(i, STK[oid][i.id])])); });
  [[7, -460000, 'kmg', 'u3'], [14, -249000, 'kmg', 'u3'], [8, -658000, 'snp', 'u3'], [10, -329000, 'bsd', 'u4']].forEach(([ago, v, oid, by]) => { const no = nid('SO'); db.opnames.push({ no, t: today - ago * D + 21 * H, items: 84, varianceVal: v, by: U[by].name, outletId: oid }); L({ t: today - ago * D + 21 * H, outletId: oid, userId: by, type: 'stock_adjust', objType: 'opname', objId: no, objLabel: 'Stock opname ' + no, before: '84 SKU', after: 'Selisih ' + fmtR(v), approverId: by === 'u3' ? 'u3' : 'u4', reason: 'Hasil stock opname' }); });
  db.opnames.sort((a, b) => b.t - a.t);
  L({ t: today - 20 * D + 10 * H, outletId: null, userId: 'u4', type: 'price_change', objType: 'product', objId: 'a4', objLabel: 'Polo Knit Stripe Cokelat · harga dasar', before: fmtR(299000), after: fmtR(329000), device: 'iPhone Arif' });
  L({ t: today - 15 * D + 14 * H, outletId: 'snp', userId: 'u3', type: 'price_change', objType: 'product', objId: 's6', objLabel: 'Brogues Kulit Cokelat · harga Senopati', before: fmtR(789000), after: fmtR(799000) });
  L({ t: today - 12 * D + 9 * H, outletId: null, userId: 'u3', type: 'price_change', objType: 'product', objId: 'b2', objLabel: 'Ransel Suede Bottom Juniper · harga Senopati', before: fmtR(999000), after: fmtR(1049000) });
  L({ t: today - 30 * D + 20 * H, outletId: null, userId: 'u4', type: 'settings_change', objType: 'settings', objId: 'policy', objLabel: 'Batas diskon tanpa PIN', before: '15%', after: '10%' });
  L({ t: today - 45 * D + 9 * H, outletId: null, userId: 'u4', type: 'permission_change', objType: 'user', objId: 'u3', objLabel: 'Dewi · outlet', before: 'Kemang', after: 'Kemang, Senopati' });
  L({ t: today - 25 * D + 9 * H, outletId: null, userId: 'u4', type: 'settings_change', objType: 'settings', objId: 'policy', objLabel: 'Batas selisih kas', before: fmtR(25000), after: fmtR(20000) });
  const ACT = { pending: 1, new: 1, cooking: 1, ready: 1, picked: 1 };
  db.orders.forEach(o => {
    if (ACT[o.status]) return;
    o.items = o.items.map(l => { const x = { id: l.id, qty: l.qty, price: l.price }; if (l.mods && l.mods.size) { x.mods = l.mods; x.note = l.note; } if (l.voidQty) x.voidQty = l.voidQty; return x; });
    ['discLabel', 'custNote', 'appNote'].forEach(k => { if (!o[k]) delete o[k]; }); if (!o.discPct) delete o.discPct; if (!o.refunded) delete o.refunded;
  });
  db.orders.sort((a, b) => b.createdAt - a.createdAt);
  db.logs.sort((a, b) => b.t - a.t);
  db.expenses.sort((a, b) => b.date - a.date);
  db.pos.sort((a, b) => b.createdAt - a.createdAt);
  db.shifts.sort((a, b) => b.openedAt - a.openedAt);
  IX = {};
  return db;
}
function fmtR(n) { return (n < 0 ? '−' : '') + 'Rp ' + Math.round(Math.abs(n)).toLocaleString('id-ID'); }

window.OS = { VER, D, H, MIN, sod, clone, r500, OUTLETS, USERS, ROLES, RESV_FEE, PAGE_ROLES, HOME, PERM_ROWS, CHANNELS, CHB, isOnline, EXP_CATS, FUNDS, FB, TERMS, DENOMS, CASH_IN_CATS, CASH_OUT_NONEXP, REASONS, LOG_TYPES,
  outletOf, carried, outletPrice, autoChPrice, chPrice, modAdd, modsStr, lineQty, calcTot, validSale, revenueOf, netOf, usage, costOf, index, shiftCalc, payStatus, overdueDays, aging, receivable,
  DBK, load, loadAsync, save, saveNow, storageInfo, loadSess, saveSess, seed, fmtR };
})();
