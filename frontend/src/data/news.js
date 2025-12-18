// Example mock news data for Berita page
const news = [
  {
    id: '1',
    title: 'Seminar Teknologi Informasi 2025',
    category: 'event',
    content: 'Ikuti seminar TI dengan pembicara nasional dan internasional.',
    link: 'https://example.com/seminar-ti',
    photo: 'https://source.unsplash.com/400x200/?seminar,technology',
    uploadDate: '2025-12-10T09:00:00Z',
    eventDate: '2025-12-20T09:00:00Z',
    isActive: true,
  },
  {
    id: '2',
    title: 'Lowongan Asisten Laboratorium',
    category: 'lowongan',
    content: 'Dibuka kesempatan menjadi asisten lab untuk mahasiswa aktif.',
    link: '',
    photo: 'https://source.unsplash.com/400x200/?job,lab',
    uploadDate: '2025-12-05T09:00:00Z',
    eventDate: null,
    isActive: true,
  },
  {
    id: '3',
    title: 'Pengumuman Libur Akhir Tahun',
    category: 'pengumuman',
    content: 'Kampus akan libur mulai 24 Desember hingga 2 Januari.',
    link: '',
    photo: 'https://source.unsplash.com/400x200/?holiday,announcement',
    uploadDate: '2025-12-01T09:00:00Z',
    eventDate: null,
    isActive: true,
  },
];

export default news;
