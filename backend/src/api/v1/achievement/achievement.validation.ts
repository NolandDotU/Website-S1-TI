import { z } from "zod";

export const achievementValidation = z.object({
  title: z.string({ message: "Judul prestasi wajib diisi" }).min(1, "Judul prestasi wajib diisi"),
  recipient: z.string({ message: "Penerima prestasi wajib diisi" }).min(1, "Penerima prestasi wajib diisi"),
  category: z.enum(
    ["Mahasiswa", "Dosen", "Program Studi", "Alumni", "Organisasi"],
    {
      message: "Kategori tidak valid",
    }
  ),
  level: z.enum(
    [
      "Internasional",
      "Nasional",
      "Provinsi",
      "Kabupaten/Kota",
      "Universitas",
      "Fakultas",
      "Program Studi",
    ],
    {
      message: "Tingkat prestasi tidak valid",
    }
  ),
  organizer: z.string().optional().or(z.literal("")),
  achievementDate: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date({
      message: "Tanggal prestasi tidak valid",
    })
  ),
  description: z.string().optional().or(z.literal("")),
  image: z.string().optional().nullable(),
  certificate: z.string().optional().nullable(),
});
