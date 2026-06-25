import mongoose from "mongoose";

export interface IProdiProfile extends mongoose.Document {
  title: string;
  description: string;
  accreditationText: string;
  peminatan: { title: string; description: string }[];
  profilLulusan: { title: string; desc: string }[];
  visi: string;
  misi: string[];
  kurikulum: {
    title: string;
    sk: string;
    perubahanUtama: { title: string; description: string }[];
    strategiPembelajaran: { tahun: string; description: string }[];
    notes: string;
  };
}

const prodiProfileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Program Studi Teknik Informatika",
    },
    description: {
      type: String,
      default:
        "Program Studi S1 Teknik Informatika UKSW hadir untuk memenuhi kebutuhan sumber daya manusia yang handal serta mampu merencanakan dan mengimplementasikan teknologi informasi untuk berbagai keperluan. Kurikulum yang dipergunakan di Program Studi S1 Teknik Informatika UKSW didasarkan pada Kerangka Kualifikasi Nasional Indonesia (KKNI) yang menekankan kualifikasi setiap lulusan yang dihasilkan.",
    },
    accreditationText: {
      type: String,
      default: "BAN-PT No. 3925/SK/BAN-PT/Ak.KP/S/X/2023",
    },
    sertifikatUrl: {
      type: String,
      default: "",
    },
    peminatan: {
      type: [
        {
          title: String,
          description: String,
        },
      ],
      default: [
        {
          title: "Network Engineering",
          description:
            "Fokus pada perancangan, pembangunan, dan pengelolaan infrastruktur jaringan komputer yang handal dan aman.",
        },
        {
          title: "Software Engineering",
          description:
            "Spesialisasi dalam pengembangan perangkat lunak dan aplikasi berbasis metodologi rekayasa perangkat lunak modern.",
        },
        {
          title: "Data Science",
          description:
            "Mengolah dan menganalisis data untuk memberikan nilai tambah dan mendukung pengambilan keputusan organisasi.",
        },
      ],
    },
    profilLulusan: {
      type: [
        {
          title: String,
          desc: String,
        },
      ],
      default: [
        { title: "Software Developer", desc: "yaitu menjadi tenaga terampil untuk mengembangkan perangkat lunak baik di perusahaan swasta, instansi pemerintahan, LSM maupun usaha mandiri (freelancer, wirausaha)." },
        { title: "Network Engineer", desc: "yaitu menjadi tenaga terampil untuk merancang, membangun dan mengelola infrastruktur jaringan baik di perusahaan swasta, instansi pemerintahan, LSM maupun usaha mandiri (freelancer, wirausaha)." },
        { title: "Data Scientist", desc: "yaitu menjadi tenaga terampil untuk mengumpulkan, mengolah dan menganalisa data sehingga memberikan nilai tambah (untuk keperluan marketing, pengembangan produk, strategi bisnis, dll) bagi perusahaan maupun instansi pengguna." },
        { title: "Data Engineer", desc: "yaitu menjadi tenaga terampil untuk mengelola arsitektur data sehingga data-data yang dimiliki perusahaan/instansi bisa terdokumentasi, tersimpan serta dapat diakses dengan mudah untuk berbagai keperluan." },
        { title: "Database Administrator", desc: "yaitu tenaga terampil yang mengelola dan mengembangkan basis data di perusahaan/instansi untuk mendukung proses operasional perusahaan dan instansi tersebut." },
        { title: "System Analyst", desc: "yaitu tenaga terampil yang bertugas untuk merencanakan, mengkoordinasikan dan memberikan rekomendasi terkait perangkat lunak dan sistem untuk mengakomodasi kebutuhan perusahaan/instansi sehingga pengembangan sistem di perusahaan/instansi bisa tercukupi dengan baik." },
        { title: "IT Support", desc: "yaitu tenaga terampil yang bertugas untuk mendukung kebutuhan IT di perusahaan seperti melakukan instalasi, mengevaluasi dan mengembangkan object IT antara lain komputer, software dan jaringan." },
        { title: "Akademisi", desc: "yaitu tenaga profesional yang bertugas untuk mentransformasikan, mengembangkan dan menyebarluaskan ilmu pengetahuan dan teknologi melalui pendidikan, penelitian dan pengabdian kepada masyarakat." },
        { title: "Peneliti", desc: "yaitu tenaga profesional yang bertugas untuk mengembangkan ilmu pengetahuan." },
      ],
    },
    visi: {
      type: String,
      default: "Pada tahun 2030 menjadi pusat unggulan Teknik Informatika untuk menghasilkan pemimpin yang menjunjung tinggi nilai kebenaran dan iman Kristiani serta memiliki kepekaan terhadap perubahan dan berkontribusi terhadap pengembangan Teknik Informatika berlandaskan nilai kritis, kreatif, dan inovatif.",
    },
    misi: {
      type: [
        {
          type: String,
        },
      ],
      default: [
        "Melaksanakan proses pembelajaran yang berbasis keunggulan dalam bidang teknik informatika yang menjunjung tinggi nilai kebenaran dan iman Kristiani.",
        "Melaksanakan penelitian yang berbasis keunggulan dan selaras dengan perkembangan teknik informatika yang berciri kritis, kreatif, dan inovatif.",
        "Melaksanakan pengabdian masyarakat yang berbasis keunggulan dalam bidang teknik informatika yang berciri pada semangat pelayanan.",
        "Mengembangkan kepemimpinan yang mencerminkan sikap kritis, kreatif, dan inovatif serta memiliki kepekaan terhadap perubahan.",
        "Menciptakan dan mengembangkan sinergi antara pengajaran, penelitian dan pengabdian masyarakat dalam semangat pelayanan dengan berbagai pihak, baik di dalam maupun luar negeri.",
      ],
    },
    kurikulum: {
      type: {
        title: String,
        sk: String,
        perubahanUtama: [
          {
            title: String,
            description: String,
          },
        ],
        strategiPembelajaran: [
          {
            tahun: String,
            description: String,
          },
        ],
        notes: String,
      },
      default: {
        title: "Kurikulum Program Studi S1 Teknik Informatika 2021",
        sk: "Disahkan dengan SK Rektor No. 318/Kep./Rek./8/2021 tentang Pemberlakuan Kurikulum Program Studi S1 Teknik Informatika Fakultas Teknologi Informasi Universitas Kristen Satya Wacana.",
        perubahanUtama: [
          {
            title: "Program Merdeka Belajar Kampus Merdeka",
            description: "Pemberlakuan program Merdeka Belajar Kampus Merdeka dimana mahasiswa bisa mengambil Mata Kuliah sebanyak 20 SKS di luar program studi S1 Teknik Informatika tetapi masih di dalam UKSW dan 24 SKS di luar UKSW. Untuk program yang bisa diambil di luar PT adalah: Magang Industri, KKN- Tematik, Penelitian, pertukaran pelajar, asistensi mengajar, Project Independen, kegiatan kemanusiaan dan kewirausahaan."
          },
          {
            title: "Kolaborasi dengan Industri",
            description: "Penyesuaian perkembangan ilmu pengetahuan dan teknologi dengan menggandeng industri untuk memberikan pembelajaran di kelas dalam satu semester penuh. Hal ini diakomodasi dalam mata kuliah kapita selekta yang berisi topik khusus dari industri."
          },
          {
            title: "Penyesuaian Konsentrasi",
            description: "Penyesuaian bidang kajian dalam konsentrasi sehingga lebih sesuai dengan kebutuhan industri. Antara lain penguatan untuk bidang Data Science."
          }
        ],
        strategiPembelajaran: [
          { tahun: "Tahun 1", description: "Berfokus pada pemberian dasar-dasar teknik informatika." },
          { tahun: "Tahun 2", description: "Berfokus pada peningkatan keterampilan di bidang teknik informatika." },
          { tahun: "Tahun 3", description: "Berfokus pada pendalaman ketrampilan sesuai dengan peminatan mahasiswa." },
          { tahun: "Tahun 4", description: "Berfokus pada pembelajaran di luar program studi dan tugas akhir." }
        ],
        notes: "Pengembangan Holistik:\nUntuk mencapai pusat keunggulan, maka Program Studi S1 Teknik Informatika mengkhususkan diri pada 3 bidang, yaitu: Software Engineering, Network Engineering dan Data Science. Kurikulum S1 Teknik Informatika memuat komponen pengembangan individu secara holistik, sehingga tidak hanya mengembangkan hard skill tetapi juga mengembangkan soft skill. Oleh karena, kurikulum S1 Teknik Informatika disusun untuk menghadirkan mata kuliah yang mendukung pengembangan hard skill dan soft skill sehingga lulusan dapat memiliki kemampuan yang baik dalam beradaptasi dengan perubahan dan perkembangan ilmu pengetahuan maupun teknologi."
      }
    }
  },
  { timestamps: true }
);

const ProdiProfileModel = mongoose.model("prodi_profile", prodiProfileSchema);
export default ProdiProfileModel;
