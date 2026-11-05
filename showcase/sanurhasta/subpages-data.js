// Content extracted verbatim from sanurhastamitra.com (ID). status: 'live' = existing content, 'soon' = not on current site, 'pending' = exists on current site, extraction pending.
(function(){
const IMG = 'https://sanurhastamitra.com/wp-content/uploads/';
const people = {
  hendry: { name: 'Hendry Utomo', role: 'Komisaris Utama dan Komisaris Independen', photo: IMG + '2024/08/hendry-utomo-838x1024.jpg',
    bio: ['Warga Negara Indonesia, lahir di Jakarta pada tahun 1967, menjabat sebagai Komisaris Utama dan Independen PT Sanurhasta Mitra Tbk sejak tahun 2026, pengangkatan terakhir berdasarkan Akta Nomor 7 tanggal 15 Januari 2025 dibuat di hadapan Gatot Widodo, SH. Notaris di Jakarta.',
      'Meraih gelar Sarjana di bidang Ekonomi-Akuntansi dari California State University, Los Angeles pada tahun 1987 dan University of Wisconsin, Madison pada tahun 1990. Beliau meraih gelar Magister Manajemen jurusan Management International Business, Prasetya Mulya School of Management pada tahun 1998.'],
    lists: [['Riwayat Jabatan', ['Direktur PT Bukit Uluwatu Villa Tbk (2012 – sekarang)', 'Direktur PT Megaplast Jayacitra (2000 – 2007)', 'Berbagai posisisi dan terakhir sebagai Management Corporate, PT Bank Bali Tbk (1990 – 1999)']]] },
  jose: { name: 'Jose Luis Calle', role: 'Komisaris', photo: IMG + '2022/12/jose_lc_shm.jpg',
    bio: ['Warga Negara Spanyol, lahir di Madrid, Spanyol pada tahun 1972, menjabat sebagai Komisaris PT Sanurhasta Mitra Tbk sejak tahun 2022, pengangkatan terakhir berdasarkan Akta Nomor 51 tanggal 30 Juni 2023 dibuat di hadapan Gatot Widodo, SH. Notaris di Jakarta.',
      'Meraih gelar Administrasi Bisnis & Pariwsata dari Hotel School Sol, Madrid pada tahun 1993.'],
    lists: [['Riwayat Jabatan', ['Komisaris Perseroan (2022 – sekarang)', 'Komisaris P.T. Lifestyle Retreats Indonesia (2025 – sekarang)', 'Komisaris P.T. Lifestyle Pax Animi (2025 – sekarang)', 'Komisaris P.T. Eco Lifestyle (2025 – sekarang)', 'Pendiri dan Direktur Utama Mana-Mana Capital Pte Ltd, Singapura (2015 – sekarang)', 'Wakil Presiden – Hospitality di Trisula Corporation, Singapura (2012 – sekarang)', 'Pendiri dan Direktur Utama Lifestyle Retreats Pte Ltd, Singapura (2005 – sekarang)', 'Presiden Direktur P.T. Lifestyle Pax Animi (2021 – 2024)', 'Co-Founder dan Presiden Direktur P.T. Lifestyle Retreats Indonesia (2014 – 2024)', 'Co-Founder dan Presiden Direktur P.T. Eco Lifestyle (2013 – 2024)', 'General Manager di The Bale Nusa Dua, Bali (2002 – 2005)', 'General Manager di Hotel Melia Purosani, Yogyakarta (2001)', 'Executive Assistant Manager di Hotel Gran Melia Jakarta, Jakarta (2000 – 2002)', 'Manajer MICE di Melia Bali, Bali (2000)', 'Resident Manager di Sol Mayang Sari & Indramaya Villas, Bintan (1999 – 2000)', 'Director of Rooms di Sol Elite Bintan & Banyu Biru Villas, Bintan (1997 – 1999)', 'Executive Assistant di Melia at Scotts, Singapura (1996 – 1997)']]] },
  astini: { name: 'Astini Bernawati Oudang', role: 'Direktur Utama', photo: IMG + '2026/02/MINA-ASTINI-BERNAWATI-OUDANG-BLCK-819x1024.jpg',
    bio: ['Warga Negara Indonesia, lahir di Bern, Swiss pada tahun 1971, menjabat sebagai Direktur Utama PT Sanurhasta Mitra Tbk sejak tahun 2026, pengangkatan terakhir berdasarkan Akta Nomor 7 tanggal 15 Januari 2025 dibuat di hadapan Gatot Widodo, SH. Notaris di Jakarta.',
      'Meraih gelar Master of Science, Operations Research dari Stanford University, Amerika Serikat pada tahun 1996 dan gelar Master of Business Administration dari Georgetown University, McDonough School of Business, Amerika Serikat pada tahun 2000 setelah sebelumnya meraih gelar Bachelor of Science di bidang Manufacturing Engineering dari Boston University, Amerika Serikat pada tahun 1994.'],
    lists: [['Jabatan yang Masih dan/atau Pernah Dijabat', ['Komisaris Utama PT Bukit Uluwatu Villa Tbk (2023 – sekarang)', 'Komisaris Utama PT Tirta Orisa Yasa (2023 – sekarang)', 'Komisaris Utama PT Truba Jaga Cita (2022 – sekarang),', 'Direktur PT Red Planet Indonesia Tbk (2021 – sekarang)', 'Komisaris PT Arrayan Nusantara Development (2020 – sekarang)', 'Managing DirectorPT Pelayaran Intilintas Tirthanusantara (2014 – sekarang)', 'Direktur Utama PT Sapta Limani Nusantara (2013 – sekarang)', 'Komisaris PT Sapta Krida Kita (1998 – sekarang)', 'Direktur Eksekutif PT Basis Utama Prima (2018-2023)', 'Consultant PT Booz Allen Hamilton Indonesia (2000-2006)', 'Associate PT Trimegah Securities (2000)', 'Komisaris Utama PT Pelayaran Intilintas Tirthanusantara (1997-2014)', 'Komisaris PT Sriyaniasti (1996-2010)']]] },
  gunawan: { name: 'Gunawan Angkawibawa', role: 'Direktur', photo: IMG + '2022/12/MINA-GUNAWAN-ANGKAWIBAWA-BLCK-819x1024.jpg',
    bio: ['Warga Negara Indonesia, lahir di Jakarta pada tahun 1964, menjabat sebagai Direktur PT Sanurhasta Mitra Tbk sejak tahun 2008, pengangkatan terakhir berdasarkan Akta Nomor 51 tanggal 30 Juni 2023 dibuat di hadapan Gatot Widodo, SH. Notaris di Jakarta.',
      'Meraih gelar Magister Management dari Universitas Prasetya Mulia, Jakarta pada tahun 2001.'],
    lists: [['Jabatan yang Masih dan/atau Pernah Dijabat', ['Direktur Perseroan (2008 – sekarang)', 'Komisaris PT Bukit Uluwatu Villa Tbk (2013 – 2023)', 'Komisaris Independen PT Bumi Teknokultura Unggul Tbk (2012 – 2020)', 'Komisaris Independen PT Intiland Development Tbk (2010)', 'Direktur PT Delta Dunia Makmur Tbk (2007 – 2012)', 'General Manager PT Citraagung Tirta Jatim (2004 – 2007)', 'Koordinator Manajer PT Griyatirta Kencana dan PT Sinar Bahana Mulya (1997 – 2004)', 'Project Manager PT Belaputra Srani (1994 – 1996)', 'Kepala Surveyor PT Sinar Bahana Mulya (1991 – 1994)', 'Site Manager PT Multi Cipta Permai Wirasta (1988 – 1991)']]] },
  duddy: { name: 'Duddy Abdullah', role: 'Direktur & Sekretaris Perusahaan', photo: IMG + '2026/02/MINA-DUDDY-ABDULLAH-BLCK-819x1024.jpg',
    bio: ['Warga Negara Indonesia, lahir di Jakarta pada tahun 1987, menjabat sebagai Direktur PT Sanurhasta Mitra Tbk sejak tahun 2026, pengangkatan terakhir berdasarkan Akta Nomor 7 tanggal 15 Januari 2025 dibuat di hadapan Gatot Widodo, SH. Notaris di Jakarta.',
      'Beliau menyelesaikan pendidikan Strata 1 dengan program gelar ganda pada tahun 2010 dari University of Melbourne, Australia, dengan memperoleh gelar Bachelor of Commerce dengan spesialisasi Ekonomi dan Keuangan serta Bachelor of Property & Construction. Selanjutnya, pada tahun 2019 beliau meraih gelar Executive Master of Finance dari INSEAD, Singapura/Fontainebleau, Prancis.'],
    lists: [['Jabatan yang Masih dan/atau Pernah Dijabat', ['Co-Founder dan Direktur PT Anarya Kreasi Nusantara, Anarya Group (2020 – sekarang)', 'Direktur PT Deyon Resources, Mall Teraskota BSD (2018 – sekarang)', 'Komite Investasi, Badan Koordinasi Penananaman Modal Republik Indonesia (2017-1018)', 'Senior Associate Quvat/Principia Management (2013-2017)']]] }
};

const P = (slug, title, status, extra) => Object.assign({ slug, title, status, blocks: [] }, extra || {});

const cats = [
  { key: 'tentang', title: 'Tentang Kami', desc: 'Profil, struktur, dan kepemimpinan kami', img: 'assets/web/tentang-kami.jpg', pages: [
    P('profil-perusahaan', 'Profil Perusahaan', 'live', { src: 'about-us', reg: true, lead: 'Selamat Datang di Sanurhasta', blocks: [
      { type: 'prose', paras: [
        'Berkantor pusat di Jakarta Selatan, P.T. Sanurhasta Mitra Tbk (MINA) memiliki, mengembangkan, dan mengelola sejumlah aset serta entitas di berbagai wilayah Indonesia, dengan fokus kuat pada sektor properti.',
        'Perusahaan memegang saham mayoritas strategis di P.T. Minna Padi Resorts, pemilik The Santai – sebuah resor butik mewah dengan konsep all-villa yang terletak di kawasan Umalas, Bali. The Santai dioperasikan oleh Lifestyle Retreats Pte Ltd, grup perhotelan yang berbasis di Singapura. Resor eksklusif ini berada di lokasi strategis, dikelilingi sawah yang asri dan pura tradisional, serta hanya berjarak singkat dari pusat hiburan dan kuliner.',
        'Sebagai pelengkap portofolio di bidang perhotelan, P.T. Sanurhasta Mitra Tbk memperluas usahanya melalui P.T. Sanurhasta Griya, entitas afiliasi yang bergerak di bidang konstruksi dan pengembangan real estat. Saat ini, Sanurhasta Griya fokus pada pengembangan perumahan subsidi (FLPP) sebagai bentuk dukungan terhadap program perumahan terjangkau yang digagas pemerintah Indonesia. Proyek perdananya yang berlokasi di Boyolali, Jawa Tengah, menargetkan pembangunan lebih dari 1.000 unit rumah subsidi di atas lahan seluas 11 hektar.',
        'Selain berbagai lini usaha tersebut, P.T. Sanurhasta Mitra Tbk juga memiliki land bank strategis seluas lebih dari 4 hektar di kawasan Sanur, Bali. Perusahaan secara aktif menjajaki peluang bisnis baru di lokasi ini dengan mengedepankan komitmen terhadap kualitas konstruksi, manajemen properti, dan keterlibatan komunitas — prinsip-prinsip yang telah membangun reputasi kuat hingga saat ini.'] },
      { type: 'facts', items: [['1.000+', 'unit rumah subsidi ditargetkan di Boyolali, Jawa Tengah'], ['11 ha', 'lahan proyek perdana Sanurhasta Griya'], ['4+ ha', 'land bank strategis di Sanur, Bali']] }
    ] }),
    P('visi-misi', 'Visi & Misi', 'live', { src: 'about-us', blocks: [
      { type: 'vm', vision: 'Menjadi pengembang properti terkemuka dan inovatif yang berkomitmen pada keunggulan, keberlanjutan, serta penciptaan nilai yang berkelanjutan bagi komunitas dan para pemangku kepentingan.',
        mission: ['Kami berkomitmen untuk menghadirkan pengembangan properti yang inovatif dan berkelanjutan dengan standar keunggulan, integritas, dan transparansi tertinggi.', 'Kami bertekad menciptakan nilai jangka panjang bagi para pemegang saham, pelanggan, dan komunitas melalui pertumbuhan yang bertanggung jawab, peningkatan kualitas hidup, serta membangun hubungan yang kuat di seluruh lini operasional kami.'] },
      { type: 'heading', t: 'Nilai-Nilai Perusahaan', p: 'Nilai-nilai ini menjadi landasan bagi setiap tindakan dan keputusan kami, serta membentuk komitmen bersama dalam mendorong kesuksesan perusahaan. Dengan menjadikan prinsip-prinsip ini sebagai pedoman, kami memastikan keselarasan, membangun kepercayaan, dan bekerja secara efektif untuk mencapai tujuan strategis serta menciptakan nilai yang berkelanjutan.' },
      { type: 'values', items: [
        ['Profesional', 'Secara konsisten menjunjung tinggi profesionalisme sebagai prinsip utama dalam setiap tugas dan interaksi.'],
        ['Dapat dipercaya', 'Sifat individu yang selalu dapat diandalkan, dan dapat dipercaya untuk mengemban tugas perusahaan.'],
        ['Inovatif', 'Dalam menjalankan bisnis perusahaan, secara kreatif berinovasi supaya dapat bersaing.'],
        ['Integritas', 'Berkomitmen untuk menjalankan perusahaan dengan standar etika dan sesuai nilai-nilai perusahaan.'],
        ['Harmoni', 'Hubungan kerja yang harmonis, untuk meraih cita-cita perusahaan.'],
        ['Kerjasama', 'Menjaga kerja sama tim antar divisi, demi menggapai tujuan perusahaan.'],
        ['Kejujuran', 'Menghormati pihak lain, sebagai sifat dasar kami, antara pemangku jabatan dengan konsumen.'],
        ['Unggul', 'Dengan SDM yang bekerja sepenuh hati, terus berkembang menuju lebih baik.']] }
    ] }),
    P('milestone', 'Milestone', 'live', { src: 'milestone', lead: 'Berikut adalah tonggak-tonggak penting yang telah memainkan peran krusial dalam membentuk perjalanan perusahaan menuju aspirasi jangka panjangnya.', blocks: [
      { type: 'timeline', items: [['2016', 'Mengambil Alih PT. Minna Padi Resorts'], ['2017', 'Penawaran Umum Saham Perdana'], ['2019', 'Pendirian Anak Perusahaan Property']] }
    ] }),
    P('struktur-organisasi', 'Struktur Organisasi', 'pending', { src: 'struktur-organisasi', reg: true }),
    P('pemegang-saham', 'Pemegang Saham', 'live', { src: 'pemegang-saham', reg: true, blocks: [
      { type: 'shareholders', asOf: 'Per 31 Desember 2025', items: [['PT Tirta Orisa Yasa', '(dahulu bernama PT Basis Utama Prima)', 30.48], ['Hapsoro', '', 19.68], ['Djoni', '', 5.33], ['Masyarakat', '(masing-masing di bawah 5%)', 44.51]] }
    ] }),
    P('struktur-perusahaan', 'Struktur Perusahaan', 'pending', { src: 'struktur-perusahaan', reg: true }),
    P('dewan-komisaris', 'Dewan Komisaris', 'live', { src: 'dewan-komisaris', reg: true, blocks: [
      { type: 'prose', paras: ['Peran Dewan Komisaris adalah mengawasi manajemen Perusahaan, memberikan masukan dan arahan strategis terkait kebijakan dan pengelolaan secara keseluruhan oleh Dewan Direksi. Dewan Komisaris secara terus-menerus memantau efektivitas kebijakan Perusahaan, kinerja Dewan Direksi dan proses pengambilan keputusan serta implementasi strategi yang berfokus pada pemenuhan dan pencapaian kepentingan pemegang saham Perusahaan.', 'Sehubungan dengan itu, komposisi dan jumlah anggota Dewan Komisaris ditetapkan melalui Rapat Umum Pemegang Saham (RUPS), dengan mempertimbangkan nilai-nilai perusahaan serta rencana strategis Perseroan. Menggabungkan talenta dan keahlian, Dewan Komisaris berkomitmen untuk mempertahankan nilai ekonomi jangka panjang secara berkelanjutan.'] },
      { type: 'people', ids: ['hendry', 'jose'] }
    ] }),
    P('direksi', 'Direksi', 'live', { src: 'direksi', reg: true, blocks: [
      { type: 'prose', paras: ['Direksi memiliki peran dalam mengelola Perseroan sesuai dengan kepentingan dan tujuan Perseroan, dengan menjalankan seluruh inisiatif dan tindakan yang berkaitan dengan pengelolaan serta kepemilikan aset perusahaan, dalam batas-batas yang telah ditetapkan dalam Anggaran Dasar Perseroan.', 'Dengan demikian, Direksi bertanggung jawab dalam menetapkan strategi dan kebijakan perusahaan guna mencapai target finansial dan operasional yang telah disepakati dan disetujui dalam Rapat Umum Pemegang Saham (RUPS).'] },
      { type: 'people', ids: ['astini', 'gunawan', 'duddy'] }
    ] }),
    P('sekretaris-perusahaan', 'Sekretaris Perusahaan', 'soon', { reg: true, regNote: 'POJK 35/2014', blocks: [ { type: 'people', ids: ['duddy'] } ] }),
    P('penghargaan', 'Penghargaan & Pencapaian', 'pending', { src: 'penghargaan-dan-pencapaian' })
  ] },
  { key: 'bisnis', title: 'Bisnis Kami', desc: 'Lini bisnis utama kami', img: 'assets/web/bisnis-kami.jpg', pages: [
    P('perhotelan', 'Perhotelan', 'live', { src: 'perhotelan', blocks: [
      { type: 'prose', paras: ['P.T. Sanurhasta Mitra Tbk memandang pengembangan aset perhotelan sebagai salah satu pilar strategis utama, yang menawarkan potensi kuat untuk menghasilkan pendapatan stabil, apresiasi nilai aset, serta penciptaan nilai jangka panjang. Keberagaman destinasi pariwisata di Indonesia yang terus berkembang membuka peluang menarik untuk investasi perhotelan berkualitas tinggi yang berorientasi pada pengalaman.', 'Dengan berfokus pada proyek-proyek yang terletak di lokasi strategis dan memiliki permintaan tinggi, perusahaan bertujuan untuk memberikan imbal hasil yang berkelanjutan sekaligus berkontribusi pada pertumbuhan sektor pariwisata Indonesia dan pengakuannya di tingkat global.'] },
      { type: 'property', name: 'The Santai, Umalas', img: IMG + '2025/07/the_santai_main_entrance.jpg', url: 'https://www.thesantai.com/', paras: ['Retret eksklusif ini menjadi simbol dari visi strategis P.T. Sanurhasta Mitra Tbk dalam investasi di sektor perhotelan. Dirancang oleh Studio TonTon yang ternama di bawah arahan arsitek peraih berbagai penghargaan, Antony Liu, resor all-villa yang mewah ini telah meraih pengakuan internasional berkat desain arsitekturnya yang khas, suasana yang tenang, serta standar layanan yang luar biasa.', 'Selama bertahun-tahun, The Santai secara konsisten menempatkan dirinya sebagai salah satu properti butik paling diminati di Bali, khususnya oleh para tamu yang berkelas dan memiliki selera tinggi.'] },
      { type: 'property', name: 'Rhadia Nitya', img: 'assets/web/hotel-05-oceanfront-pool.jpg', imgNote: 'Foto ilustrasi — ganti dengan foto Rhadia Nitya', url: 'http://www.radhiacruise.com/', paras: ['Radhia Nitya menawarkan Anda janji akan momen indah yang tidak biasa, eksklusif, dengan layanan luar biasa, dan pengalaman kebebasan yang tiada bandingannya. Rasakan kesempatan untuk mengunjungi desa-desa setempat, trekking, atau snorkeling. Nikmati saat-saat tak terlupakan dan temukan pengalaman yang menggembirakan bersama kami.'] }
    ] }),
    P('pengembangan-properti', 'Pengembangan Properti', 'pending', { src: 'properti-pengembangan' }),
    P('perbankan-tanah', 'Perbankan Tanah', 'pending', { src: 'perbankan-tanah' })
  ] },
  { key: 'investor', title: 'Hubungan Investor', desc: 'Data investor dan keterbukaan informasi pasar modal', img: 'assets/web/hubungan-investor.jpg', pages: [
    P('ikhtisar-keuangan', 'Ikhtisar Keuangan', 'soon', { reg: true }),
    P('laporan-tahunan', 'Laporan Tahunan', 'pending', { src: 'laporan-tahunan', reg: true }),
    P('laporan-keuangan', 'Laporan Keuangan', 'pending', { src: 'laporan-keuangan', reg: true }),
    P('prospektus', 'Prospektus Penawaran Umum', 'soon', { reg: true }),
    P('informasi-saham', 'Informasi Saham', 'pending', { src: 'informasi-saham', reg: true }),
    P('informasi-dividen', 'Informasi Dividen', 'soon', { reg: true }),
    P('rups', 'Rapat Umum Pemegang Saham (RUPS)', 'pending', { src: 'rapat-umum-pemegang-saham', reg: true, children: [
      P('rups-pengumuman', 'Pengumuman & Pemanggilan', 'pending', { src: 'rapat-umum-pemegang-saham', reg: true }),
      P('rups-materi', 'Materi Mata Acara', 'soon', { reg: true }),
      P('rups-tata-tertib', 'Tata Tertib RUPS', 'soon', { reg: true }),
      P('rups-surat-kuasa', 'Surat Kuasa', 'soon', { reg: true }),
      P('rups-risalah', 'Ringkasan Risalah RUPS', 'soon', { reg: true })] }),
    P('keterbukaan-informasi', 'Aksi Korporasi / Keterbukaan Informasi', 'pending', { src: 'keterbukaan-informasi', reg: true }),
    P('kalender-investor', 'Kalender Investor', 'soon'),
    P('kontak-ir', 'Kontak Hubungan Investor', 'soon', { reg: true })
  ] },
  { key: 'gcg', title: 'Tata Kelola Perusahaan', desc: 'Kebijakan tata kelola dan kepatuhan', img: 'assets/web/tata-kelola-gcg.jpg', pages: [
    P('board-manual', 'Pedoman Dewan (Board Manual)', 'soon', { reg: true }),
    P('piagam-dekom', 'Piagam Dewan Komisaris', 'soon', { reg: true }),
    P('piagam-direksi', 'Piagam Direksi', 'soon', { reg: true }),
    P('piagam-audit', 'Piagam Audit Internal', 'soon', { reg: true }),
    P('kode-etik', 'Kode Etik', 'pending', { src: 'kode-etik', reg: true }),
    P('komite', 'Komite', 'pending', { src: 'komite', reg: true, children: [
      P('komite-audit', 'Komite Audit', 'pending', { src: 'komite', reg: true }),
      P('komite-nomrem', 'Komite Nominasi & Remunerasi', 'pending', { src: 'komite', reg: true }),
      P('piagam-komite', 'Piagam Komite', 'pending', { src: 'komite', reg: true })] }),
    P('manajemen-risiko', 'Kebijakan Manajemen Risiko', 'soon', { reg: true }),
    P('wbs', 'Sistem Pelaporan Pelanggaran', 'soon'),
    P('antikorupsi', 'Kebijakan Antikorupsi', 'soon'),
    P('profesi-penunjang', 'Profesi Penunjang Pasar Modal', 'pending', { src: 'profesi-penunjang', reg: true }),
    P('anggaran-dasar', 'Anggaran Dasar', 'soon', { reg: true })
  ] },
  { key: 'keberlanjutan', title: 'Keberlanjutan', desc: 'Laporan keberlanjutan dan LST', img: 'assets/web/keberlanjutan.jpg', pages: [
    P('laporan-keberlanjutan', 'Laporan Keberlanjutan', 'pending', { src: 'keberlanjutan', reg: true }),
    P('kebijakan-lst', 'Kebijakan LST', 'soon'),
    P('program-lingkungan', 'Program Lingkungan', 'soon', { reg: true }),
    P('program-sosial', 'Program Sosial & Ketenagakerjaan', 'soon', { reg: true })
  ] },
  { key: 'berita', title: 'Berita & Media', desc: 'Publikasi dan informasi terbaru', img: 'assets/web/berita-media.jpg', pages: [
    P('siaran-pers', 'Siaran Pers', 'live', { src: 'berita-dan-acara', lead: 'Tetap terinformasi saat kami memperkenalkan pengembangan terbaru, merayakan pencapaian, dan mengumumkan rencana masa depan.', blocks: [
      { type: 'news', items: [
        ['05 Februari 2026', 'Siaran Pers PT Sanurhasta Mitra Tbk (“Perusahaan”)', '', 'https://sanurhastamitra.com/press-release-pt-sanurhasta-mitra-tbk-company/'],
        ['25 November 2025', 'Sanurhasta Mitra TBK (MINA) Menunjuk LAB Architecture Untuk Memimpin Pengembangan Visi Proyek Sanur Seluas 4 Hektar', 'PT Sanurhasta Mitra Tbk, yang diperdagangkan dengan kode saham MINA di Bursa Efek Indonesia, dengan bangga...', 'https://sanurhastamitra.com/sanurhasta-mitra-tbk-mina-menunjuk-lab-architecture-untuk-memimpin-pengembangan-visi-proyek-sanur-seluas-4-hektar/'],
        ['31 Maret 2025', 'The Santai - Umalas Raih Sertifikasi Green Globe', 'PT Sanurhasta Mitra Tbk. (MINA) dengan bangga mengumumkan bahwa The Santai – Umalas, resort vila mewah...', 'https://sanurhastamitra.com/the-santai-umalas-raih-sertifikasi-green-globe/'],
        ['01 November 2020', 'The Santai Certified A Safe Hotel', 'The Santai, bagian dari Lifestyle Retreats, dengan bangga mengumumkan bahwa hotel ini telah secara resmi...', 'https://sanurhastamitra.com/the-santai-certified-a-safe-hotel/']] }
    ] }),
    P('pengumuman', 'Pengumuman & Publikasi', 'pending', { src: 'berita-dan-acara' })
  ] },
  { key: 'kontak', title: 'Kontak', desc: 'Saluran komunikasi resmi', img: 'assets/web/kontak.jpg', pages: [
    P('kantor-pusat', 'Kantor Pusat', 'live', { src: 'kontak', reg: true, blocks: [ { type: 'contact' } ] }),
    P('peta-lokasi', 'Peta Lokasi', 'soon'),
    P('formulir-investor', 'Formulir Pertanyaan Investor', 'soon')
  ] }
];
window.SH_DATA = { cats, people, contact: {
  name: 'PT Sanurhasta Mitra Tbk', addr: ['Graha Iskandarsyah Lt. 6', 'Jl. Iskandarsyah Raya No. 66C', 'Melawai, Kec. Kebayoran Baru', 'Jakarta Selatan, 12160'],
  phone: '(021) 290 356 20', tel: '+622129035620', fax: '(021) 7206 039', email: 'shm@sanurhastamitra.com' } };
})();
