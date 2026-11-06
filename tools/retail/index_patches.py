# Tambalan index.html untuk demo retail. Dipakai oleh tools/make-retail.py.
# Format: (teks lama, teks baru[, jumlah kemunculan yang diharapkan]).

OFF = '&quot;editor&quot;:&quot;boolean&quot;,&quot;default&quot;:'

INDEX = [
    # ── judul & meta ──────────────────────────────────────────────────────
    ('Omnify Lab POS — Demo Kasir &amp; Inventori', 'Omnify Lab POS Retail — Demo Kasir &amp; Stok Toko Fashion', 4),
    ('Coba demo Omnify Lab POS: kasir, inventori, self order, jadwal staf, dan laporan dalam satu sistem.',
     'Coba demo Omnify Lab POS untuk toko fashion: kasir dengan varian ukuran, stok per ukuran, pembelian, absensi, dan laporan dalam satu sistem.', 3),
    ('https://omnifyid.github.io/demo/', 'https://omnifyid.github.io/demo-retail/', 2),

    # ── modul: tanpa self order, meja, dapur, kanal ojol, BOM ─────────────
    ('&quot;selfOrderModule&quot;:{' + OFF + 'true', '&quot;selfOrderModule&quot;:{' + OFF + 'false'),
    ('&quot;tablesModule&quot;:{' + OFF + 'true', '&quot;tablesModule&quot;:{' + OFF + 'false'),
    ('&quot;kitchenModule&quot;:{' + OFF + 'true', '&quot;kitchenModule&quot;:{' + OFF + 'false'),
    ('selfOrder: p.selfOrderModule ?? true, tables: p.tablesModule ?? true, kitchen: p.kitchenModule ?? true,',
     'selfOrder: p.selfOrderModule ?? false, tables: p.tablesModule ?? false, kitchen: p.kitchenModule ?? false,'),
    ('multi: p.multiOutletModule ?? true }; }', 'multi: p.multiOutletModule ?? true, bom: false }; }'),
    ("const PAGE_MOD = { pos: 'pos',", "const PAGE_MOD = { reservations: 'tables', pos: 'pos',"),
    ("{ id: 'reservations', label: 'Reservasi', icon: 'calendar-check' },", "{ id: 'reservations', label: 'Reservasi', icon: 'calendar-check', mod: 'tables' },"),
    ("    { h: 'Menu' },\n    { id: 'products', label: 'Produk', icon: 'coffee' },", "    { h: 'Katalog' },\n    { id: 'products', label: 'Produk', icon: 'shirt' },"),

    # ── katalog & varian ukuran ──────────────────────────────────────────
    ("const CATS = ['Semua', 'Kopi', 'Non-kopi', 'Pastry', 'Makanan'];", "const CATS = ['Semua', 'Pakaian', 'Sepatu', 'Tas'];"),
    ("const CATICON = { Kopi: 'coffee', 'Non-kopi': 'emoji_food_beverage', Pastry: 'bakery_dining', Makanan: 'restaurant' };",
     "const CATICON = { Pakaian: 'shirt', Sepatu: 'footprints', Tas: 'backpack' };"),
    ("const DEFMOD = { size: 'R', temp: 'ice', milk: 'fresh', sugar: 'normal' };",
     "const DEFMOD = { size: '' };\n"
     "// stok satu varian ukuran di outlet aktif; produk tanpa ukuran memakai id produk\n"
     "const szStock = (stock, id, z) => (stock || {})[z ? id + '-' + z : id] || 0;\n"
     "// ukuran awal di kasir: ukuran default produk kalau ada stok, kalau tidak ukuran terdekat yang masih ada\n"
     "const szDef = (m, stock) => { const zs = m.sizes || [], i0 = Math.max(0, zs.indexOf(m.def)); const order = zs.map((z, i) => [z, Math.abs(i - i0) + (i < i0 ? .5 : 0)]).sort((a, b) => a[1] - b[1]).map(x => x[0]); return { size: order.find(z => szStock(stock, m.id, z) > 0) || m.def }; };"),
    ("const modGroups = (OM, id, sel, set) => {\n",
     "const modGroups = (OM, id, sel, set, stock) => {\n"
     "  const M = OM.MB[id]; if (OM.RETAIL) return M.sizes ? [{ label: 'Ukuran · stok di outlet ini', opts: M.sizes.map(z => { const a = sel.size === z, n = szStock(stock, id, z), out = stock && n <= 0; return { label: z, price: out ? 'habis' : 'sisa ' + n, hasPrice: !!stock, ...chip(a), op: out ? .45 : 1, pick: () => set({ ...sel, size: z }) }; }) }] : [];\n"),
    ('color:{{ o.fg }};font-weight:500;cursor:pointer;display:flex;align-items:center;gap:6px">{{ o.label }}<sc-if value="{{ o.hasPrice }}"',
     'color:{{ o.fg }};font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;min-width:64px;justify-content:center;opacity:{{ o.op }}">{{ o.label }}<sc-if value="{{ o.hasPrice }}"'),
    ("modGroups: mi ? modGroups(OM, mi.id, s.modSel, v => c.setState({ modSel: v })) : [],",
     "modGroups: mi ? modGroups(OM, mi.id, s.modSel, v => c.setState({ modSel: v }), md.inventory ? s.stock : null) : [],"),
    ("const opts = isDrink(m.cat);", "const opts = !!m.sizes;"),
    ("if (opts) c.setState({ modItem: m.id, modSel: { ...DEFMOD }, modNote: '', modCustom: false }); else c.addLine(m.id, null);",
     "if (opts) c.setState({ modItem: m.id, modSel: szDef(m, s.stock), modNote: '', modCustom: false }); else c.addLine(m.id, null);"),
    ("confirmMod: () => c.addLine(s.modItem, { ...s.modSel }, s.modCustom ? (s.modNote || '').trim() : ''),",
     "confirmMod: () => { const sz = s.modSel.size, n = szStock(s.stock, s.modItem, sz), inCart = s.cart.filter(x => x.id === s.modItem && x.mods && x.mods.size === sz).reduce((a, x) => a + x.qty, 0); if (md.inventory && n - inCart <= 0) return c.showToast(n > 0 ? `Stok ukuran ${sz} tinggal ${n}, semuanya sudah di keranjang` : `Ukuran ${sz} habis di outlet ini. Cek stok outlet lain di Inventaris.`, 'warn'); c.addLine(s.modItem, { ...s.modSel }, s.modCustom ? (s.modNote || '').trim() : ''); },"),
    ("canMake(id) { const OM = window.OM, r = this.recOf(id, this.oidCur()), st = this.sv().stock || {}; if (!r || !Object.keys(r).length) return 99;",
     "canMake(id) { const OM = window.OM, r = this.recOf(id, this.oidCur()), st = this.sv().stock || {}; if (!r || !Object.keys(r).length) return 99; const M = OM.MB[id]; if (M && M.sizes) return M.sizes.reduce((a, z) => a + Math.max(0, Math.floor(st[id + '-' + z] || 0)), 0);"),
    # contoh kondisi stok di data "toko sudah berjalan": 2 ukuran terlaris habis, 1 produk habis semua ukuran
    ("stockBy = { ...stockBy, kmg: { ...stockBy.kmg, granola: 0, cocoa: 0 } }; unavailableBy = { ...(unavailableBy || {}), kmg: { ...((unavailableBy || {}).kmg || {}), n2: 'on' } };",
     "stockBy = { ...stockBy, kmg: { ...stockBy.kmg, 'a5-M': 0, 'a5-L': 0, 's9-36': 0, 's9-37': 0, 's9-38': 0, 's9-39': 0, 's9-40': 0, 'a1-M': 1, 'b3': 1 } };"),

    # ── keranjang: tanpa dine-in/meja/jumlah tamu ────────────────────────
    ("cart: [], orderType: 'dine', table: '',", "cart: [], orderType: 'take', table: '',"),
    ("orderTypes: [{ id: 'dine', label: 'Dine-in', icon: 'coffee' }, { id: 'take', label: 'Take Away', icon: 'shopping-bag' }, ...(md.delivery ? [{ id: 'online', label: 'Online', icon: 'bike' }] : [])]",
     "otDisp: md.delivery ? 'grid' : 'none', orderTypes: [{ id: 'take', label: 'Di toko', icon: 'store' }, ...(md.delivery ? [{ id: 'online', label: 'Online', icon: 'bike' }] : [])]"),
    ('<div style="display:grid;grid-template-columns:{{ otCols }};', '<div style="display:{{ otDisp }};grid-template-columns:{{ otCols }};'),
    ("otCols: md.delivery ? 'repeat(3,minmax(0,1fr))' : '1fr 1fr'", "otCols: md.delivery ? '1fr 1fr' : '1fr'"),
    ("'Pilih meja') : 'Bawa pulang', detTableFg", "'Pilih meja') : 'Beli di toko', detTableFg"),
    ('name="utensils" size="16"></om-icon>{{ detTable }}', 'name="store" size="16"></om-icon>{{ detTable }}'),
    ('<span style="display:inline-flex;align-items:center;gap:4px;flex-shrink:0"><om-icon aria-hidden="true" name="users" size="16" style="color:#4A4E47"></om-icon>{{ detPax }}</span>',
     '<span style="display:none"><om-icon aria-hidden="true" name="users" size="16" style="color:#4A4E47"></om-icon>{{ detPax }}</span>'),
    ('aria-label="Jumlah tamu" style="flex:1 1 0;min-width:0;display:flex;', 'aria-label="Jumlah tamu" style="flex:1 1 0;min-width:0;display:none;'),
]

# ── Ringkasan: kartu ritel ─────────────────────────────────────────────────
INDEX += [
    ("const HL = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'];",
     "const HL = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'];"),
    # KPI reservasi → barang terjual (UPT)
    ("  kpis.push({ label: 'Reservasi hari ini', icon: 'calendar-check',",
     "  if (!md.tables) { const pcs = sales.reduce((a, o) => a + o.items.reduce((b, i) => b + OS.lineQty(i), 0), 0); kpis.push({ label: 'Barang terjual', icon: 'shopping-bag', value: pcs + ' pcs', note: sum.n ? `${(pcs / sum.n).toLocaleString('id-ID', { maximumFractionDigits: 1 })} pcs per transaksi` : 'Belum ada transaksi', noteFg: '#4A4E47', g: ['reports', { reportRange: 'today' }] }); }\n"
     "  else kpis.push({ label: 'Reservasi hari ini', icon: 'calendar-check',"),
    # tipe pesanan → kategori terlaris 7 hari
    ("  const ty = TY.filter(t => t[0] !== 'Online' || md.delivery).map(([label, color, f]) => { const os = sales.filter(f), v = os.reduce((a, o) => a + OS.netOf(o), 0); return { label, color, v, n: os.length }; }), tyT = ty.reduce((a, t) => a + t.v, 0) || 1;",
     "  const ty = OM.RETAIL ? (() => { const g = {}; s.orders.filter(o => o.createdAt >= t0 - 6 * DAY && OS.validSale(o)).forEach(o => o.items.forEach(i => { const m = OM.MB[i.id], q = OS.lineQty(i); if (!m || q <= 0) return; const x = g[m.cat] || (g[m.cat] = { v: 0, n: 0 }); x.v += i.price * q; x.n += q; })); return CATS.slice(1).map(k => ({ label: k, color: '#45A02E', v: (g[k] || {}).v || 0, n: (g[k] || {}).n || 0 })).sort((a, b) => b.v - a.v); })()\n"
     "    : TY.filter(t => t[0] !== 'Online' || md.delivery).map(([label, color, f]) => { const os = sales.filter(f), v = os.reduce((a, o) => a + OS.netOf(o), 0); return { label, color, v, n: os.length }; }), tyT = ty.reduce((a, t) => a + t.v, 0) || 1;"),
    ("sub2: `${t.n} pesanan · rata-rata ${fmt(t.n ? t.v / t.n : 0)}`, sub: `${t.label}: ${t.n} pesanan",
     "sub2: `${t.n} ${OM.RETAIL ? 'pcs' : 'pesanan'} · rata-rata ${fmt(t.n ? t.v / t.n : 0)}`, sub: `${t.label}: ${t.n} pesanan"),
    ('<span style="font-weight:600;font-size:16px">Tipe pesanan</span><span style="font-size:12px;color:#4A4E47">Hari ini · penjualan bersih</span>',
     '<span style="font-weight:600;font-size:16px">Kategori terlaris</span><span style="font-size:12px;color:#4A4E47">7 hari · penjualan kotor</span>'),
    # reservasi berikutnya → perlu restock
    ("  const canR = c.canPage('reservations');",
     "  const canR = md.tables ? c.canPage('reservations') : c.canPage('inventory');\n"
     "  const rsk = all ? [] : OM.INGS.map(i => ({ i, on: (s.stock || {})[i.id] || 0 })).filter(x => x.on < x.i.par).sort((a, b) => a.on / a.i.par - b.on / b.i.par || b.i.par - a.i.par);\n"
     "  const rskRows = rsk.slice(0, fit ? 4 : 6).map(({ i, on }) => ({ time: on + ' pcs', name: (OM.MB[i.pid] || i).name, meta: (i.size ? 'Ukuran ' + i.size + ' · ' : '') + 'min. ' + i.par + ' pcs', dpS: (OM.SB[i.sup] || {}).name ? (OM.SB[i.sup].name.split(' ').slice(0, 2).join(' ')) : '', dpFg: '#4A4E47', stS: on <= 0 ? 'Habis' : 'Menipis', stFg: on <= 0 ? '#8E1A14' : '#6A4400', open: () => c.go('inventory', { invQ: (OM.MB[i.pid] || i).name }) }));"),
    ("showRvCard: !all, rvUp: up, rvUpEmpty: !up.length, rvCardSub: `${rvs.length} aktif hari ini · ${rvArr} sudah datang`, canGoResv: canR, goResv: () => c.go('reservations', { rvDate: tdy, rvFilter: 'all' }),",
     "showRvCard: !all, rvUp: md.tables ? up : rskRows, rvUpEmpty: md.tables ? !up.length : !rskRows.length, rvCardSub: md.tables ? `${rvs.length} aktif hari ini · ${rvArr} sudah datang` : `${rsk.length} SKU di bawah stok minimum`, canGoResv: canR, goResv: () => md.tables ? c.go('reservations', { rvDate: tdy, rvFilter: 'all' }) : c.go('inventory', { invQ: '' }),\n"
     "    rvTitle: md.tables ? 'Reservasi berikutnya' : 'Perlu restock', rvGoLabel: md.tables ? 'Buka reservasi' : 'Buka inventaris', rvEmptyMsg: md.tables ? 'Tidak ada reservasi yang ditunggu lagi hari ini.' : 'Semua ukuran aman di atas stok minimum.',"),
    ('<span style="font-weight:600;font-size:16px">Reservasi berikutnya</span>', '<span style="font-weight:600;font-size:16px">{{ rvTitle }}</span>'),
    ('cursor:pointer">Buka reservasi</a>', 'cursor:pointer">{{ rvGoLabel }}</a>'),
    ('padding:8px">Tidak ada reservasi yang ditunggu lagi hari ini.</div>', 'padding:8px">{{ rvEmptyMsg }}</div>'),
]

# ── Produk: panel harga beli & margin + stok per ukuran (pengganti BOM) ───
RT_PANEL = (
    '<sc-if value="{{ edBomOff }}" hint-placeholder-val="{{ false }}">'
    '<section aria-label="Harga beli dan margin" style="background:#fff;border:1px solid #E7E5DF;border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:14px;box-sizing:border-box">'
    '<div style="display:flex;flex-direction:column;gap:4px"><h2 style="margin:0;font-size:16px;font-weight:700;color:#10140F">Harga beli &amp; margin</h2>'
    '<span style="font-size:14px;color:#4A4E47;line-height:1.45">HPP = harga beli per pcs dari pemasok. Tanpa resep: 1 barang terjual = stok ukuran itu berkurang 1 pcs.</span></div>'
    '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;font-variant-numeric:tabular-nums">'
    '<div style="display:flex;flex-direction:column;gap:2px;padding:12px;border-radius:10px;background:#F6F5F1;min-width:0"><span style="font-size:12px;color:#3B3F38">HPP per pcs</span><span style="font-size:18px;font-weight:700;color:#10140F">{{ rtCost }}</span></div>'
    '<div style="display:flex;flex-direction:column;gap:2px;padding:12px;border-radius:10px;background:#F6F5F1;min-width:0"><span style="font-size:12px;color:#3B3F38">Harga jual</span><span style="font-size:18px;font-weight:700;color:#10140F">{{ rtPrice }}</span></div>'
    '<div style="display:flex;flex-direction:column;gap:2px;padding:12px;border-radius:10px;background:#F6F5F1;min-width:0"><span style="font-size:12px;color:#3B3F38">Margin</span><span style="font-size:18px;font-weight:700;color:{{ rtMgFg }}">{{ rtMargin }}</span></div></div>'
    '<span style="font-size:14px;color:#3B3F38">Laba kotor per pcs <strong style="font-variant-numeric:tabular-nums">{{ rtProfit }}</strong> · harga sudah termasuk PPN</span></section>'
    '<sc-if value="{{ rtHas }}" hint-placeholder-val="{{ true }}"><section aria-label="Stok per ukuran" style="background:#fff;border:1px solid #E7E5DF;border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:14px;box-sizing:border-box">'
    '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap"><div style="display:flex;flex-direction:column;gap:4px"><h2 style="margin:0;font-size:16px;font-weight:700;color:#10140F">Stok per ukuran</h2><span style="font-size:14px;color:#4A4E47">{{ rtOutlet }} · total {{ rtTotal }}</span></div>'
    '<button onClick="{{ rtGoInv }}" style="height:44px;padding:0 14px;border-radius:10px;border:1.5px solid #10140F;background:#fff;color:#10140F;font-weight:600;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-family:inherit" style-hover="background:#EDECE7"><om-icon aria-hidden="true" name="archive" size="20"></om-icon>Buka di Inventaris</button></div>'
    '<div role="list" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:8px"><sc-for list="{{ rtSizes }}" as="z" hint-placeholder-count="4">'
    '<div role="listitem" style="display:flex;flex-direction:column;gap:2px;padding:10px 12px;border-radius:10px;background:{{ z.bg }}"><span style="font-size:12px;color:#3B3F38">{{ z.z }}</span><span style="font-size:20px;font-weight:700;color:#10140F;font-variant-numeric:tabular-nums">{{ z.n }}</span><span style="font-size:12px;font-weight:600;color:{{ z.fg }}">{{ z.st }}</span></div>'
    '</sc-for></div></section></sc-if></sc-if>'
)

def _bom_off_block():
    # dua baris asli (panel "nonaktif" + placeholder margin) diganti satu panel ritel
    return None

INDEX += [
    ("    edBomOn: !!md.bom, edBomOff: !md.bom, bomOffCan: u.role === 'owner',",
     "    edBomOn: !!md.bom, edBomOff: !md.bom, bomOffCan: u.role === 'owner',\n"
     "    ...(() => { if (!pm || !pf) return { rtHas: false, rtCost: '—', rtPrice: '—', rtMargin: '—', rtMgFg: '#4A4E47', rtProfit: '—', rtSizes: [], rtGoInv: () => {} };\n"
     "      const o = oid || (c.me().outlets[0]), st = (s.stockBy || {})[o] || {}, cost = c.hppOf(pid, o), price = fPrice(pf) || s.prodCfg[pid].base, mg = price ? 1 - cost / price : 0, zs = pm.sizes || [''];\n"
     "      return { rtHas: !!md.inventory, rtCost: fmt(cost), rtPrice: fmt(price), rtMargin: pc(mg), rtMgFg: mgFg(mg), rtProfit: fmt(price - cost), rtOutlet: oname(s, o), rtTotal: zs.reduce((a, z) => a + (st[z ? pid + '-' + z : pid] || 0), 0) + ' pcs',\n"
     "        rtSizes: zs.map(z => { const k = z ? pid + '-' + z : pid, i = OM.IB[k], n = st[k] || 0, lo = i && n < i.par; return { z: z ? 'Ukuran ' + z : 'Stok', n: String(n), st: !i ? '—' : n <= 0 ? 'Habis' : lo ? 'Menipis' : 'Aman', fg: n <= 0 ? '#8E1A14' : lo ? '#6A4400' : '#1F5C12', bg: n <= 0 ? '#FCE9E6' : lo ? '#FBF1DC' : '#F6F5F1' }; }),\n"
     "        rtGoInv: () => c.go('inventory', { selProd: null, prodForm: null, invQ: pm.name }) }; })(),"),
]

# ── kosakata ritel (teks yang terlihat) ────────────────────────────────────
INDEX += [
    ('Cari menu', 'Cari produk', None),
    ('Tampilan menu', 'Tampilan produk', None),
    ('{{ g.count }} menu<', '{{ g.count }} produk<'),
    ('Pilih opsi', 'Pilih ukuran', None),
    ('`Sisa ${av.cm} porsi`', '`Sisa ${av.cm} pcs`'),
    ('Stok bahan habis', 'Stok habis', None),
    ('Stok bahan untuk menu ini habis, jadi menu nonaktif otomatis. Jika diaktifkan manual, menu bisa dijual lagi dan kartu kasir tetap menampilkan peringatan.',
     'Stok semua ukuran produk ini habis, jadi produk nonaktif otomatis. Jika diaktifkan manual, produk bisa dijual lagi (mis. pre-order) dan kartu kasir tetap menampilkan peringatan.'),
    ('Menu ini dinonaktifkan manual. Aktifkan lagi untuk dijual di kasir.', 'Produk ini dinonaktifkan manual. Aktifkan lagi untuk dijual di kasir.'),
    ('Ketuk menu untuk menambahkannya ke pesanan.', 'Ketuk produk untuk menambahkannya ke keranjang.'),
    ('<om-icon name="coffee" size="32" style="color:#4A4E47"></om-icon></div>\n            <div style="font-weight:600;color:#10140F">Belum ada item',
     '<om-icon name="shopping-bag" size="32" style="color:#4A4E47"></om-icon></div>\n            <div style="font-weight:600;color:#10140F">Belum ada item'),
    ("taxLabel: online && cs.inclTax ? `PB1 ${ol.pb1}% (termasuk harga)` : `PB1 ${ol.pb1}%`", "taxLabel: `PPN ${ol.pb1}% (termasuk harga)`"),
    ("if (R.showTax && o.tax) add('PB1', '', fmt(o.tax));", "if (R.showTax && o.tax) add('PPN ' + (ol.pb1 || 11) + '% (termasuk)', '', fmt(o.tax));"),
    ("o.type === 'take' ? 'TAKE AWAY'", "o.type === 'take' ? 'BELI DI TOKO'"),
    ('padding-top:75%;background:#EEF0EA', 'padding-top:100%;background:#EEF0EA'),
    ("orders: ['Pesanan', `${pending.length} menunggu verifikasi · ${active.length} di dapur`]", "orders: ['Pesanan', 'Riwayat transaksi, struk, refund, dan tukar barang']"),
    ("products: ['Produk', 'Menu pusat, harga per kanal, dan ketersediaan per outlet']", "products: ['Produk', 'Katalog pusat, varian ukuran, harga, margin, dan ketersediaan per outlet']"),
    ("inventory: ['Inventaris', 'Stok per outlet, berkurang otomatis dari setiap penjualan']", "inventory: ['Inventaris', 'Stok per ukuran per outlet, berkurang otomatis dari setiap penjualan']"),
    ("finance: ['Keuangan', 'Shift & kas, pengeluaran, hutang, dan pencairan platform']", "finance: ['Keuangan', 'Shift & kas, pengeluaran, hutang ke pemasok, dan pencairan marketplace']"),
    ("settings: ['Pengaturan', 'Modul, outlet, kanal, kebijakan, dan akun']", "settings: ['Pengaturan', 'Modul, outlet, kanal online, kebijakan, dan akun']"),
    ("const CHF = [{ id: 'all', label: 'Semua' }, { id: 'dine', label: 'Dine-in' }, { id: 'take', label: 'Take Away' }, ", "const CHF = [{ id: 'all', label: 'Semua' }, "),
    ("`Dine-in · ${o.table}` : 'Take Away')", "`Dine-in · ${o.table}` : 'Di toko')", None),
    ("o.type === 'take' ? 'Take away' : 'Tanpa meja'", "o.type === 'take' ? 'Transaksi ditahan' : 'Tanpa meja'"),
    # produk
    ("`Hapus menu ${m.name}?`", "`Hapus produk ${m.name}?`"),
    ("'Menu hilang dari Kasir, Self-order, Dapur, dan semua outlet. Riwayat penjualan dan laporan tetap tersimpan. Tindakan ini tercatat di log.', okLabel: 'Hapus menu'",
     "'Produk hilang dari Kasir dan semua outlet. Riwayat penjualan dan laporan tetap tersimpan. Tindakan ini tercatat di log.', okLabel: 'Hapus produk'"),
    ("objLabel: m.name + ' · menu', before: 'Ada di menu'", "objLabel: m.name + ' · katalog', before: 'Ada di katalog'"),
    ("`${m.name} dihapus dari menu`", "`${m.name} dihapus dari katalog`"),
    ('Hapus menu', 'Hapus produk', None),
    ('mis. Es Kopi Pandan', 'mis. Kemeja Linen Putih'),
    ('Wajib diisi untuk outlet yang menjual menu ini.', 'Wajib diisi untuk outlet yang menjual produk ini.'),
    ('Muncul di kasir dan self order saat menu dipilih. Grup wajib harus diisi sebelum menu masuk keranjang.', 'Muncul di kasir saat produk dipilih, mis. ukuran. Stok dicatat per ukuran di Inventaris.'),
    ('Salin dari menu lain…', 'Salin dari produk lain…'),
    ('Salin opsi dari menu lain', 'Salin varian dari produk lain'),
    ('Belum ada opsi. Menu langsung masuk keranjang tanpa pilihan. Tambah grup seperti ukuran, tingkat gula, atau topping.', 'Belum ada varian. Produk langsung masuk keranjang tanpa memilih ukuran.'),
    ("Menu \"${name}\" sudah ada.", "Produk \"${name}\" sudah ada."),
    ("`${name} ditambahkan ke menu`", "`${name} ditambahkan ke katalog`"),
    ("const OPT_TPL = [\n", "const OPT_TPL = window.OM && window.OM.RETAIL ? [{ k: 'size', name: 'Ukuran', req: true, items: [['S', 0], ['M', 0, true], ['L', 0], ['XL', 0]] }, { k: 'shoe', name: 'Ukuran sepatu', req: true, items: [['38', 0], ['39', 0], ['40', 0, true], ['41', 0], ['42', 0]] }, { k: 'color', name: 'Warna', req: true, items: [['Hitam', 0, true], ['Putih', 0], ['Navy', 0]] }] : [\n"),
    ("const m = window.OM.MB[pid]; if (!m || !isDrink(m.cat)) return [];",
     "const m = window.OM.MB[pid]; if (m && m.sizes) return [mkGrp({ name: 'Ukuran', req: true, items: m.sizes.map(z => [z, 0, z === m.def]) })]; if (!m || !isDrink(m.cat)) return [];"),
    # inventaris & pembelian
    ('Bahan dipantau', 'SKU dipantau'),
    ('Cari bahan, kategori, atau pemasok', 'Cari produk, ukuran, kategori, atau pemasok', None),
    ('Bahan perlu dipesan', 'SKU perlu dipesan'),
    ('Langsung bisa dipakai di resep menu, PO, dan stock opname.', 'Langsung bisa dipakai di PO, transfer, dan stock opname.'),
    ('PB1 (pajak restoran)', 'PPN (pajak pertambahan nilai)', None),
    ('NPWPD', 'NPWP', None),
    ('PB1', 'PPN', None),
    # pengaturan
    ("s.prodCfg.k1.base", "s.prodCfg.a1.base", None),
    ("Contoh: Kopi Susu Aren", "Contoh: Kaos Stripe Abu-Hitam"),
    ('Bisnis Kopi Senja → outlet. PPN dan biaya layanan dipakai di kasir outlet masing-masing.', 'Bisnis Garis Goods → outlet. PPN (sudah termasuk harga) dipakai di kasir outlet masing-masing.'),
    ("full: 'Kopi Senja · ' + of.name.trim()", "full: 'Garis Goods · ' + of.name.trim()"),
    ("  ];\n  const settingsLog", "  ].filter(x => !['selfOrder', 'tables', 'kitchen', 'bom'].includes(x.key));\n  const settingsLog"),
    ("desc: 'Stok bahan per outlet, stock opname, dan pengurangan otomatis.'", "desc: 'Stok per ukuran per outlet, stock opname, transfer, dan potong stok otomatis saat terjual.'"),
    ("desc: 'Shift & kas wajib di kasir, pengeluaran, hutang, dan pencairan platform.'", "desc: 'Shift & kas wajib di kasir, pengeluaran, hutang ke pemasok, dan pencairan marketplace.'"),
    ("desc: 'Penjualan, produk, margin, dan pajak.'", "desc: 'Penjualan, produk & ukuran terlaris, margin, dan pajak.'"),
    ('Mis. Kopi enak, harga teman', 'Mis. Tukar ukuran maks. 7 hari dengan struk'),
    ('Pagi hari, toko baru saja buka. Riwayat 60 hari sampai tutup toko kemarin sudah lengkap, tapi hari ini belum ada pesanan, shift kasir belum dibuka, dan dapur masih kosong. Stok sisa kemarin.',
     'Pagi hari, toko baru saja buka. Riwayat 60 hari sampai tutup toko kemarin sudah lengkap, tapi hari ini belum ada transaksi dan shift kasir belum dibuka. Stok sisa kemarin.'),
    # karyawan: jam toko 10–22
    ("{ id: 'pagi', label: 'Pagi', start: 7, end: 15 }, { id: 'siang', label: 'Siang', start: 15, end: 22 }", "{ id: 'pagi', label: 'Pagi', start: 10, end: 16 }, { id: 'siang', label: 'Sore', start: 16, end: 22 }"),
    ("{ id: 'pagi', label: 'Pagi', start: '07:00', end: '15:00', tol: 10 }, { id: 'siang', label: 'Siang', start: '15:00', end: '22:00', tol: 10 }",
     "{ id: 'pagi', label: 'Pagi', start: '10:00', end: '16:00', tol: 10 }, { id: 'siang', label: 'Sore', start: '16:00', end: '22:00', tol: 10 }"),
    ("shift: 'Pagi', start: 7, end: 15", "shift: 'Pagi', start: 10, end: 16", 2),
    ("shift: 'Siang', start: 15, end: 22", "shift: 'Sore', start: 16, end: 22", 3),
    ("role: 'Barista', shift", "role: 'Pramuniaga', shift"),
    ("role: 'Kitchen', shift", "role: 'Gudang', shift"),
    ("[['Rina', 7], ['Dewi', 7], ['Bayu', 15], ['Putri', 15], ['Fajar', 15]]", "[['Rina', 10], ['Dewi', 10], ['Bayu', 16], ['Putri', 16], ['Fajar', 16]]"),
    ("in: at(-5, 14, 59), out: at(-5, 21, 15)", "in: at(-5, 15, 59), out: at(-5, 22, 5)"),
    ("in: at(-5, 6, 55), out: at(-5, 15, 10)", "in: at(-5, 9, 55), out: at(-5, 16, 10)"),
    ("in: at(-2, 15, 21), out: at(-2, 22, 4)", "in: at(-2, 16, 21), out: at(-2, 22, 4)"),
]

import os as _os
INDEX.append((open(_os.path.join(_os.path.dirname(__file__), 'bom_off_block.txt')).read(), '          ' + RT_PANEL))

INDEX += [
    ('Opsi &amp; tambahan', 'Varian ukuran', None),
    ('aria-label="Opsi dan tambahan"', 'aria-label="Varian ukuran"', None),
]

INDEX += [
    (": `Bawa pulang${cu ? ' · ' + cu : ''}`", ": `Beli di toko${cu ? ' · ' + cu : ''}`"),
    ("[['cust', 'Nota pelanggan'], ['kit', 'Tiket dapur']]", "[['cust', 'Nota pelanggan']]", 2),
    ('<div style="background:#fff;border:1px solid #E7E5DF;border-radius:14px;padding:8px 18px">\n              <div style="font-weight:600;padding:10px 0 6px">Tiket dapur</div>',
     '<div style="display:none">\n              <div style="font-weight:600;padding:10px 0 6px">Tiket dapur</div>'),
]

# margin ritel dihitung dari harga sebelum PPN (harga jual sudah termasuk PPN 11%)
INDEX += [
    ("g: pr ? 1 - h / pr : 0", "g: pr ? 1 - h * 1.11 / pr : 0"),
    ("mg = p ? 1 - cost / p : 0", "mg = p ? 1 - cost * 1.11 / p : 0"),
    ("const mgFg = m => m > .7 ? '#1F5C12' : m > .55 ? '#6A4400' : '#8E1A14';", "const mgFg = m => m > .45 ? '#1F5C12' : m > .3 ? '#6A4400' : '#8E1A14';"),
    ("mg = price ? 1 - cost / price : 0, zs = pm.sizes", "mg = price ? 1 - cost * 1.11 / price : 0, zs = pm.sizes"),
    ("rtProfit: fmt(price - cost)", "rtProfit: fmt(price / 1.11 - cost)"),
    ("Laba kotor per pcs <strong", "Laba kotor per pcs (setelah PPN) <strong"),
    (" · harga sudah termasuk PPN</span></section>", "</span></section>"),
    ('<span style="font-size:12px;color:#3B3F38">Margin</span><span style="font-size:18px', '<span style="font-size:12px;color:#3B3F38">Margin (sebelum PPN)</span><span style="font-size:18px'),
]

INDEX += [
    (" · harga, resep & outlet", " · harga, ukuran & outlet"),
    (" · harga & resep", " · harga & ukuran"),
    ("Harga, resep & outlet", "Harga, ukuran & outlet"),
    ("Harga & resep", "Harga & ukuran"),
    ("paling rapi di menu", "paling rapi di katalog"),
]

INDEX += [
    ("for (let hh = 7; hh <= 22; hh++) series.push", "for (let hh = 10; hh <= 22; hh++) series.push"),
    ("{ label: 'Platform online', value: fmt(plat), sub: plat ? 'Komisi ' + fmt(A.comm) + ' · belum cair' : 'Tidak ada', c: '#A9B3A5', w: w(plat) }, ",
     "...(plat ? [{ label: 'Platform online', value: fmt(plat), sub: 'Komisi ' + fmt(A.comm) + ' · belum cair', c: '#A9B3A5', w: w(plat) }] : []), "),
    ('placeholder="No., ID platform, nama"', 'placeholder="No. transaksi atau nama"'),
]

# ── kanal online ritel + status pesanan & pengiriman (dummy) ──────────────
SHIP_JS = r"""
// ── pengiriman (data contoh): kurir, no. resi, dan lacak paket untuk pesanan online ritel ──
const COURIERS = { web: ['JNE REG', 'SiCepat REG', 'Kurir toko'], shopee: ['SPX Express', 'J&T Express'], tokopedia: ['JNE REG', 'SiCepat REG', 'GoSend Same Day'] };
const shHash = t => { let h = 7; for (const ch of String(t)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
const shipCourier = o => o.driver || (COURIERS[o.channel] || ['JNE REG'])[shHash(o.id) % (COURIERS[o.channel] || [1]).length];
const shipResi = o => { const c = shipCourier(o), n = String(shHash(o.id + 'r')).padStart(10, '0').slice(0, 10); return /SPX/.test(c) ? 'SPXID0' + n : /J&T/.test(c) ? 'JP' + n : /SiCepat/.test(c) ? '0048' + n : /GoSend/.test(c) ? 'GK-' + n.slice(0, 8) : /toko/i.test(c) ? 'GG-' + o.no : 'CGK' + n; };
const SHIP_CITY = ['Jakarta Timur', 'Bekasi', 'Depok', 'Tangerang', 'Bandung', 'Bogor', 'Surabaya', 'Semarang', 'Yogyakarta', 'Medan'];
const shipDest = o => /GoSend|toko/i.test(shipCourier(o)) ? 'Jakarta Selatan' : SHIP_CITY[shHash(o.id + 'c') % SHIP_CITY.length];
const SHIP_ST = { wait: ['Belum dikirim', '#F1F0EC', '#3B3F38'], pickup: ['Menunggu pickup kurir', '#FBF1DC', '#6A4400'], transit: ['Dalam perjalanan', '#EAF0FB', '#1F4A8F'], last: ['Sedang diantar', '#EAF0FB', '#1F4A8F'], done: ['Terkirim', '#E6F4DF', '#1F5C12'], cancel: ['Dibatalkan', '#FCE9E6', '#8E1A14'] };
// tahap lacak dihitung dari waktu serah ke kurir (pickedAt); pesanan lama dianggap sudah terkirim
const shipInfo = (o, now) => {
  const c = shipCourier(o), resi = shipResi(o), dest = shipDest(o), same = /GoSend|toko/i.test(c), st = o.status;
  const pick = o.pickedAt || o.createdAt + 50 * 60000, el = now - pick, H = 3600000;
  const k = st === 'pcancel' ? 'cancel' : st === 'served' ? 'done' : st === 'picked' ? (el > (same ? .7 : 5) * H ? 'last' : 'transit') : st === 'ready' ? 'pickup' : 'wait';
  const doneAt = st === 'served' ? Math.min(now, pick + (same ? 1.5 : 26) * H) : null, sent = st === 'picked' || st === 'served';
  const T = (t, d) => d ? dtm(Math.min(now, t)) : '';
  const steps = [
    ['Pesanan diterima dari ' + ((window.OS.CHB[o.channel] || {}).label || 'online'), o.createdAt, true],
    ['Dikemas di gudang outlet', o.createdAt + 15 * 60000, ['cooking', 'ready', 'picked', 'served'].includes(st)],
    [sent ? `Diserahkan ke ${c} · resi ${resi}` : `Diserahkan ke ${c}`, pick, sent],
    [same ? 'Kurir menuju alamat pembeli' : `Transit di hub sortir ${c.split(' ')[0]} Jakarta`, pick + (same ? .3 : 2) * H, st === 'served' || (st === 'picked' && el > (same ? .3 : 2) * H)],
    [`Sedang diantar ke ${dest}`, pick + (same ? .7 : 5) * H, st === 'served' || k === 'last'],
    [`Terkirim · diterima ${o.customer || 'pembeli'}`, doneAt || 0, st === 'served'],
  ];
  const last = steps.reduce((a, x, i) => x[2] ? i : a, 0);
  return { courier: c, resi: sent ? resi : 'Dibuat saat diserahkan ke kurir', dest, k, label: SHIP_ST[k][0], bg: SHIP_ST[k][1], fg: SHIP_ST[k][2],
    steps: st === 'pcancel' ? [{ label: 'Pesanan dibatalkan di kanal online', time: '', dot: '#8E1A14', ring: '#FCE9E6', fg: '#8E1A14', fw: 600 }] : steps.map((x, i) => ({ label: x[0], time: T(x[1], x[2]), dot: x[2] ? (i === last ? '#1F5C12' : '#45A02E') : '#D7D5CE', ring: i === last ? '#E6F4DF' : 'transparent', fg: x[2] ? '#10140F' : '#4A4E47', fw: i === last ? 700 : 500 })) };
};
"""

SHIP_TPL = (
    '<sc-if value="{{ sel.shipOn }}" hint-placeholder-val="{{ false }}"><div style="height:1px;background:#E7E5DF"></div>'
    '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><span style="font-weight:700">Status pengiriman</span><span style="font-size:12px;font-weight:600;padding:4px 10px;border-radius:20px;background:{{ sel.shipBg }};color:{{ sel.shipFg }}">{{ sel.shipLabel }}</span></div>'
    '<div style="display:flex;justify-content:space-between;gap:10px"><span style="color:#3B3F38">No. resi</span><span style="font-variant-numeric:tabular-nums;font-weight:600;text-align:right">{{ sel.shipResi }}</span></div>'
    '<div style="display:flex;justify-content:space-between;gap:10px"><span style="color:#3B3F38">Tujuan</span><span style="font-weight:500">{{ sel.shipDest }}</span></div>'
    '<ol aria-label="Lacak pengiriman" style="list-style:none;margin:4px 0 0;padding:0;display:flex;flex-direction:column"><sc-for list="{{ sel.shipSteps }}" as="p" hint-placeholder-count="5">'
    '<li style="display:grid;grid-template-columns:16px minmax(0,1fr);gap:10px;padding-bottom:10px"><span aria-hidden="true" style="width:12px;height:12px;margin-top:4px;border-radius:50%;background:{{ p.dot }};box-shadow:0 0 0 3px {{ p.ring }}"></span>'
    '<span style="display:flex;flex-direction:column;gap:2px;min-width:0"><span style="font-size:14px;font-weight:{{ p.fw }};color:{{ p.fg }};overflow-wrap:anywhere">{{ p.label }}</span><span style="font-size:12px;color:#4A4E47">{{ p.time }}</span></span></li></sc-for></ol>'
    '<span style="font-size:12px;color:#4A4E47">Data lacak di demo ini adalah contoh.</span></sc-if>'
)

INDEX += [
    ("const DEFMOD = { size: '' };\n", "const DEFMOD = { size: '' };\n" + SHIP_JS),
    # status: konteks ritel
    ("const ST = { new: { label: 'Baru', bg: '#EEF0EA', fg: '#3B3F38' }, cooking: { label: 'Diproses', bg: '#FBF1DC', fg: '#6A4400' }, ready: { label: 'Siap', bg: '#E6F4DF', fg: '#1F5C12' },",
     "const ST = { new: { label: 'Pesanan baru', bg: '#FCE9E6', fg: '#8E1A14' }, cooking: { label: 'Dikemas', bg: '#FBF1DC', fg: '#6A4400' }, ready: { label: 'Siap kirim', bg: '#E6F4DF', fg: '#1F5C12' },"),
    ("picked: { label: 'Diambil driver', bg: '#EAF0FB', fg: '#1F4A8F' }, pcancel: { label: 'Dibatalkan platform', bg: '#FCE9E6', fg: '#8E1A14' }",
     "picked: { label: 'Dikirim', bg: '#EAF0FB', fg: '#1F4A8F' }, pcancel: { label: 'Dibatalkan di kanal', bg: '#FCE9E6', fg: '#8E1A14' }"),
    ("gofood: '#9E1B2F', grabfood: '#14633A', shopeefood: '#9A3412' };", "web: '#1F4A8F', shopee: '#9A3412', tokopedia: '#14633A' };"),
    # alur: diterima → dikemas → siap kirim → dikirim → selesai
    ("const nx = (on ? { new: 'cooking', cooking: 'ready', ready: 'served', picked: 'served' }", "const nx = (on ? { new: 'cooking', cooking: 'ready', ready: 'picked', picked: 'served' }"),
    ("status: nx, prev: { status: x.status, items: x.items },", "status: nx, prev: { status: x.status, items: x.items }, ...(nx === 'picked' ? { pickedAt: Date.now(), driver: x.driver || shipCourier(x) } : {}),"),
    ("const L = on ? { cooking: 'sedang disiapkan', ready: 'siap diambil driver', served: 'diambil driver · selesai' }",
     "const L = on ? { cooking: 'sedang dikemas', ready: 'siap kirim · menunggu pickup kurir', picked: `diserahkan ke ${shipCourier(o)} · resi ${shipResi(o)}`, served: 'terkirim · selesai' }"),
    ("({ new: 'Baru', cooking: 'Diproses', ready: 'Siap diambil' })[p.status] || 'status sebelumnya'", "({ new: 'Pesanan baru', cooking: 'Dikemas', ready: 'Siap kirim', picked: 'Dikirim' })[p.status] || 'status sebelumnya'"),
    ("acts.push({ label: { new: 'Mulai siapkan', cooking: 'Siap diambil', ready: 'Diambil driver', picked: 'Tandai selesai' }[so.status], icon: 'arrow-right'",
     "acts.push({ label: { new: 'Mulai kemas', cooking: 'Selesai dikemas', ready: 'Serahkan ke kurir', picked: 'Tandai terkirim' }[so.status], icon: { new: 'package-open', cooking: 'package-check', ready: 'truck', picked: 'circle-check' }[so.status] || 'arrow-right'"),
    ("flowOn = ['new', 'cooking', 'ready', 'served']", "flowOn = ['new', 'cooking', 'ready', 'picked', 'served']"),
    ("steps: on ? ['Diterima', 'Disiapkan', 'Siap', 'Diambil', 'Selesai']", "steps: on ? ['Diterima', 'Dikemas', 'Siap kirim', 'Dikirim', 'Selesai']"),
    ("acts.push({ label: 'Dibatalkan platform', icon: 'circle-x', kind: 'danger', act: () => c.ask({ kind: 'pcancel', noPin: true, outletId: so.outletId, title: `Dibatalkan ${OS.CHB[so.channel].label}`, desc: `${so.channelOrderId} dibatalkan dari aplikasi. Piutang ${fmt(so.expectedPayout || 0)} dihapus.`, reasons: OS.REASONS.pcancel, f: { made: so.status !== 'new' }",
     "acts.push({ label: 'Dibatalkan di kanal', icon: 'circle-x', kind: 'danger', act: () => c.ask({ kind: 'pcancel', noPin: true, outletId: so.outletId, title: `Dibatalkan di ${OS.CHB[so.channel].label}`, desc: `${so.channelOrderId} dibatalkan pembeli atau ${OS.CHB[so.channel].label}. Barang kembali ke stok, piutang ${fmt(so.expectedPayout || 0)} dihapus.`, reasons: OS.REASONS.pcancel, f: { made: false }"),
    # filter pesanan
    ("{ id: 'kitchen', label: 'Di dapur', f: o => o.status === 'new' || o.status === 'cooking', m: 'kitchen' }, { id: 'ready', label: 'Siap', f: o => o.status === 'ready', m: 'kitchen' },",
     "{ id: 'kitchen', label: 'Perlu dikemas', f: o => o.status === 'new' || o.status === 'cooking', m: 'delivery' }, { id: 'ready', label: 'Siap kirim', f: o => o.status === 'ready', m: 'delivery' }, { id: 'ship', label: 'Dikirim', f: o => o.status === 'picked', m: 'delivery' },"),
    ("{ id: 'served', label: 'Selesai', f: o => (o.status === 'served' || o.status === 'picked') && !(o.openBill && !o.paidAt) }",
     "{ id: 'served', label: 'Selesai', f: o => o.status === 'served' && !(o.openBill && !o.paidAt) }"),
    # baris & detail pesanan
    ("(OS.isOnline(o) ? (o.driver ? 'Driver ' + o.driver : 'Online')", "(OS.isOnline(o) ? (['picked', 'served'].includes(o.status) ? shipCourier(o) + ' · ' + shipResi(o) : shipCourier(o) + ' · belum dikirim')"),
    ('<span style="color:#3B3F38">ID platform</span>', '<span style="color:#3B3F38">No. pesanan {{ sel.chLabel }}</span>'),
    ('<span style="color:#3B3F38">Driver</span><span style="font-weight:500">{{ sel.onDriver }}</span></div>', '<span style="color:#3B3F38">Kurir</span><span style="font-weight:500">{{ sel.onDriver }}</span></div>' + SHIP_TPL),
    ("onDriver: so.driver || '—',", "onDriver: on ? shipCourier(so) : '—', ...(() => { if (!on) return { shipOn: false, shipSteps: [] }; const x = shipInfo(so, Date.now()); return { shipOn: true, shipLabel: x.label, shipBg: x.bg, shipFg: x.fg, shipResi: x.resi, shipDest: x.dest, shipSteps: x.steps }; })(),"),
    ('<span style="color:#3B3F38">Bruto di aplikasi</span>', '<span style="color:#3B3F38">Total di kanal</span>'),
    ("'Selisih dengan aplikasi ' + fmtS(", "'Selisih dengan kanal ' + fmtS("),
    ("${so.wasted ? ' · makanan terbuang' : ''}", "${so.wasted ? ' · barang rusak' : ''}"),
    # kasir: form pesanan online
    ("label: 'Online', icon: 'bike' }] : [])]", "label: 'Online', icon: 'globe' }] : [])]"),
    ("status: md.kitchen ? 'new' : 'served', createdAt: now, paidAt: null, userId: u.id, shiftId: sh ? sh.id : null, channelOrderId:", "status: 'new', createdAt: now, paidAt: null, userId: u.id, shiftId: sh ? sh.id : null, channelOrderId:"),
    ('placeholder="Salin dari tablet merchant"', 'placeholder="Salin dari Seller Centre / dashboard web"'),
    ('placeholder="Dari aplikasi"', 'placeholder="Nama pembeli"'),
    ('Catatan dari aplikasi (opsional)', 'Catatan pembeli (opsional)'),
    ('placeholder="Mis. es dipisah" style="height:{{ tap }}', 'placeholder="Mis. tolong bungkus kado" style="height:{{ tap }}'),
    ('Harga total di aplikasi <span', 'Total di {{ chName }} <span'),
    ("`Kirim ke dapur · ${fmt(tot.total)}`) : 'Bayar'", "`Simpan pesanan · ${fmt(tot.total)}`) : 'Bayar'"),
    ("'Isi harga di aplikasi'", "'Isi total dari kanal'"),
    ("'Isi nama pelanggan dari aplikasi'", "'Isi nama pembeli'"),
    ("'Isi harga total dari aplikasi'", "'Isi total dari kanal online'"),
    ("`Total di aplikasi ${fmt(app)} · Omnify Lab ${fmt(tot.total)}", "`Total di ${CH.label} ${fmt(app)} · Omnify Lab ${fmt(tot.total)}"),
    ("`${OS.CHB[f.ch].label} ${f.pid.trim().toUpperCase()} dikirim ke dapur · piutang ${fmt(tot.expectedPayout)}`",
     "`${OS.CHB[f.ch].label} ${f.pid.trim().toUpperCase()} tersimpan · stok dipotong · lanjut kemas di Pesanan`"),
    ("di aplikasi ${chs.join(', ')}", "di ${chs.join(', ')}"),
    ("Matikan juga ${m.name} di aplikasi ${chs}", "Matikan juga ${m.name} di ${chs}"),
    # badge & subjudul Pesanan: pesanan online yang perlu diproses
    ("{ id: 'orders', label: 'Pesanan', icon: 'receipt-text', mod: 'pos', badge: pending.length, tone: 'red' },",
     "{ id: 'orders', label: 'Pesanan', icon: 'receipt-text', mod: 'pos', badge: pending.length + (md.delivery ? s.orders.filter(o => window.OS.isOnline(o) && ['new', 'cooking', 'ready'].includes(o.status)).length : 0), tone: 'red' },"),
    ("orders: ['Pesanan', 'Riwayat transaksi, struk, refund, dan tukar barang']",
     "orders: ['Pesanan', (() => { const on = s.orders.filter(o => window.OS.isOnline(o)), n = st => on.filter(o => st.includes(o.status)).length; return md.delivery ? `${n(['new', 'cooking'])} perlu dikemas · ${n(['ready'])} siap kirim · ${n(['picked'])} dalam pengiriman` : 'Riwayat transaksi, struk, refund, dan tukar barang'; })()]"),
    ("desc: 'Input manual GoFood, GrabFood, ShopeeFood, harga per kanal, dan pencairan.'",
     "desc: 'Pesanan Website, Shopee & Tokopedia: harga per kanal, alur kemas–kirim, resi & lacak, komisi, dan pencairan. Stok satu untuk toko & online.'"),
    ("onl: { ch: 'gofood',", "onl: { ch: 'shopee',"),
    ("setlCh: 'gofood',", "setlCh: 'shopee',"),
]

INDEX += [
    ("onlDriver: f.driver,", "onlDriver: f.driver, courierOpts: (COURIERS[ch] || []).map(v => ({ v })),"),
    ('<label style="display:flex;flex-direction:column;gap:5px;min-width:0"><span style="font-size:12px;color:#3B3F38;font-weight:500">Catatan pembeli (opsional)',
     '<label style="display:flex;flex-direction:column;gap:5px;min-width:0"><span style="font-size:12px;color:#3B3F38;font-weight:500">Kurir</span>'
     '<select value="{{ onlDriver }}" onChange="{{ onDriver }}" style="height:{{ tap }};padding:0 12px;border:1px solid #D7D5CE;border-radius:10px;font-size:16px;font-family:inherit;color:#10140F;background:#fff;min-width:0;cursor:pointer">'
     '<option value="">Sesuai pilihan pembeli</option><sc-for list="{{ courierOpts }}" as="k" hint-placeholder-count="3"><option value="{{ k.v }}">{{ k.v }}</option></sc-for></select></label>\n          '
     '<label style="display:flex;flex-direction:column;gap:5px;min-width:0"><span style="font-size:12px;color:#3B3F38;font-weight:500">Catatan pembeli (opsional)'),
]

INDEX += [
    ("kitchen: { label: 'Di dapur', bg: '#EAF0FB', fg: '#1F4A8F' }, ready: { label: 'Siap', bg: '#E6F4DF', fg: '#1F5C12' },",
     "kitchen: { label: 'Perlu dikemas', bg: '#FCE9E6', fg: '#8E1A14' }, ready: { label: 'Siap kirim', bg: '#E6F4DF', fg: '#1F5C12' }, ship: { label: 'Dikirim', bg: '#EAF0FB', fg: '#1F4A8F' },"),
    ("if (t === 'ready') return SS.ready; if (o.openBill", "if (t === 'ready') return SS.ready; if (t === 'picked') return SS.ship; if (o.openBill"),
    ('Harga khusus aplikasi {{ chName }}', 'Harga khusus {{ chName }}'),
    ("style=\"width:72px;height:24px;max-width:100%;flex-shrink:1;background:url('{{ co.logo }}') center center/contain no-repeat\"></span></button>",
     "style=\"width:22px;height:22px;flex-shrink:0;background:url('{{ co.logo }}') center center/contain no-repeat\"></span><span style=\"font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis\">{{ co.label }}</span></button>"),
    ("srcIcon: on ? 'bike'", "srcIcon: on ? 'globe'"),
    ("kpis.push({ label: 'Penjualan online', icon: 'bike'", "kpis.push({ label: 'Penjualan online', icon: 'globe'"),
    ("{ key: 'delivery', name: 'Kanal online', icon: 'bike'", "{ key: 'delivery', name: 'Kanal online', icon: 'globe'"),
    ("icon: id === 'none' ? 'receipt-text' : pb ? (pb.icon || 'banknote') : 'bike'", "icon: id === 'none' ? 'receipt-text' : pb ? (pb.icon || 'banknote') : 'globe'"),
    ('ID pesanan platform', 'No. pesanan kanal', None),
]

INDEX += [
    ('<div style="display:flex;justify-content:space-between"><span>Layanan</span><span style="font-variant-numeric:tabular-nums">{{ sel.svc }}</span></div>',
     '<div style="display:none"><span>Layanan</span><span style="font-variant-numeric:tabular-nums">{{ sel.svc }}</span></div>'),
    ('<span>PPN</span>', '<span>PPN 11% (termasuk)</span>', None),
]

INDEX += [
    ('Pencairan platform', 'Pencairan marketplace', None),
    ("label: 'Platform online', value: fmt(plat)", "label: 'Kanal online', value: fmt(plat)"),
]

INDEX += [("'Harga di aplikasi sudah termasuk PPN'", "'Harga di kanal sudah termasuk PPN'")]
