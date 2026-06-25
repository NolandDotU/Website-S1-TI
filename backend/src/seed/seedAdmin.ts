import mongoose from "mongoose";
import UserModel from "../model/userModel";
import ProdiProfileModel from "../model/ProdiProfileModel";
import { LecturerModel } from "../model/lecturerModel";
import { logger, hashingPassword } from "../utils";
import EmbeddingInsertService from "../api/v1/embeddings/embeddingInsert.service";
import EmbeddingModel from "../model/embeddingModel";

export const seedAdmin = async () => {
  try {
    const data = {
      username: "admin",
      password: "admin123",
      role: "admin",
    };
    const exist = await UserModel.findOne({ username: data.username });
    if (exist) return;

    const seed = await UserModel.create(data);
    logger.info("Admin account created");
    return;
  } catch (error) {
    logger.error("Error seeding admin: ", error);
    throw error;
  }
};

export const seedHMPTI = async () => {
  try {
    const data = {
      username: "hmpti",
      email: "fti.hmp.s1.ti@uksw.edu",
      fullname: "HMPTI S1 Teknik Informatika",
      password: "hmpti123",
      role: "hmp",
      authProvider: "local",
      isActive: true,
    };
    const exist = await UserModel.findOne({ username: data.username });
    if (exist) return;

    const seed = await UserModel.create(data);
    logger.info("HMPTI account created");
    return;
  } catch (error) {
    logger.error("Error seeding HMPTI: ", error);
    throw error;
  }
};

export const seedLecturerUsers = async () => {
  try {
    const lecturers = [
      {
        username: "teguh.bayu",
        fullname: "Teguh Indra Bayu, S.Kom., M.Cs., Ph.D.",
        email: "teguh.bayu@uksw.edu",
        expertise: [
          "Computer Networks and Communications",
          "Vehicular Communications",
          "Computer Networks Security",
        ],
        externalLink:
          "https://drive.google.com/u/0/open?usp=forms_web&id=1zbZfJ9GiouLfg3jS6u286bZ5iDqJQ6v6",
      },
      {
        username: "chris.rudianto",
        fullname: "Ir. Christ Rudianto, MT.",
        email: "chris.rudianto@uksw.edu",
        expertise: [
          "Sistem Dan Teknologi Informasi",
          "e-Government/Pemerintah Digital",
        ],
        externalLink:
          "https://drive.google.com/u/0/open?usp=forms_web&id=1CoXC2H228T4WARHrwc6NrN_fjrYTc-sR",
      },
      {
        username: "kristoko",
        fullname: "Prof. Dr. Kristoko Dwi Hartomo, M.Kom",
        email: "kristoko@uksw.edu",
        expertise: [
          "Artificial Intelligence & Machine Learning",
          "Time Series Forecasting & Data Analytics",
        ],
        externalLink:
          "https://drive.google.com/u/0/open?usp=forms_web&id=1EUNhY9oWYcfifpO7ZCVDBcGEe_VUA0g6",
      },
      {
        username: "edna.maria",
        fullname: "Edna Maria, S. Kom., M. Pd.",
        email: "edna.maria@uksw.edu",
        expertise: ["Matematika Komputer", "Pemrograman Database"],
        externalLink:
          "https://drive.google.com/u/0/open?usp=forms_web&id=1g8GziYPEZizwCBtQxKc7vx6C6neaJNYF",
      },
      {
        username: "daniel.kurniawan",
        fullname: "Daniel Kurniawan, M.Pd., M.Pd.",
        email: "daniel.kurniawan@uksw.edu",
        expertise: ["Bahasa Inggris"],
        externalLink:
          "https://drive.google.com/u/0/open?usp=forms_web&id=1EDwVonP9zflg4hBk5zyCy-kQAJjAEfkx",
      },
      {
        username: "hindriyanto.purnomo",
        fullname: "Prof. Hindriyanto Dwi Purnomo, S.T., M.IT., Ph.D",
        email: "hindriyanto.purnomo@uksw.edu",
        expertise: [
          "Metaheuristics",
          "Applied Soft Computing",
          "Machine Learning",
        ],
        externalLink:
          "https://drive.google.com/u/0/open?usp=forms_web&id=1rfbXC4VJW-9KWeeyPMN-boeZbzubViG-",
      },
      {
        username: "danang.widiatmoko",
        fullname: "Danang Tri Widiatmoko, S.Ds., M.Kom.",
        email: "danang.widiatmoko@uksw.edu",
        expertise: [
          "Human and Computer Interaction",
          "Web Design",
          "Web Programming",
          "UI/UX Design",
          "Graphic Design",
        ],
        externalLink:
          "https://drive.google.com/u/0/open?usp=forms_web&id=1AdUqrG8ELNPNntIQHFF8LI8dNSVOthBK",
      },
      {
        username: "pratyaksa.ocsa",
        fullname: "Pratyaksa Ocsa Nugraha Saian, S.Kom., M.T.",
        email: "pratyaksa.ocsa@uksw.edu",
        expertise: [
          "Web Programming",
          "Mobile Programming",
          "Software Engineering",
        ],
        externalLink:
          "https://drive.google.com/u/0/open?usp=forms_web&id=1xTxOf0rJqkNqwZJePPb7-MqQ18psPP7-",
      },
      {
        username: "christa.tehusalawany",
        fullname: "Christa Audrea Yosevana Tehusalawany, M.Pd.",
        email: "christa.tehusalawany@uksw.edu",
        expertise: [
          "English as a foreign language teaching",
          "English for Specific Purposes",
          "Indonesian language for foreign speakers",
        ],
        externalLink:
          "https://drive.google.com/u/0/open?usp=forms_web&id=1wKcD71EjroHz0YppVOqfyGQ4_uKQAPtQ",
      },
      {
        username: "angling.kusumandhita",
        fullname: "Angling Kusumandhita Raden, S.T., M.M.",
        email: "angling.kusumandhita@gmail.com",
        expertise: [
          "Web Programming",
          "Desktop Programming",
          "Mobile Programming",
          "Artificial Intelligence",
        ],
        externalLink: "https://www.instagram.com/angling_kusumandhita.raden/",
      },
      {
        username: "charitas.fibriani",
        fullname: "Dr. Charitas Fibriani, S.Kom., M.Eng.",
        email: "charitas.fibriani@uksw.edu",
        expertise: ["Data Analysis"],
        externalLink:
          "https://drive.google.com/u/0/open?usp=forms_web&id=1V37DGeAsJ37FcKbDfyNjNrPdYGZe4xLg",
      },
      {
        username: "hilda.momongan",
        fullname: "Hilda Saranita M. Momongan, M.Pd",
        email: "hilda.momongan@uksw.edu",
        expertise: ["Bahasa Inggris"],
        externalLink:
          "https://drive.google.com/u/0/open?usp=forms_web&id=1BkL2NTPVpnmnRIxlPkTOj7qs-OIuW28L",
      },
      {
        username: "afiyatar.asyer",
        fullname: "Afiyatar Asyer, S. Kom.",
        email: "afiasyer@gmail.com",
        expertise: [
          "Data Science & Machine Learning",
          "Computer Vision",
          "NLP",
          "Data Mining",
          "Artificial Intelligence",
          "Deep Learning",
        ],
        externalLink:
          "https://drive.google.com/u/0/open?usp=forms_web&id=10u8pl5Xty6G5pdL9sOPT55EwCb8oH9hH",
      },
      {
        username: "adi.nugroho",
        fullname: "Dr. Adi Nugroho, ST, MMSI",
        email: "adi.nugroho@uksw.edu",
        expertise: [
          "Database",
          "Programming",
          "Software Engineering",
          "Machine Learning",
          "Data Science",
        ],
        externalLink:
          "https://scholar.google.com/citations?user=SzV1emoAAAAJ&hl=id",
      },
      {
        username: "eryka.ekaliadewi",
        fullname: "Eryka Pandu Ekaliadewi, ST, M.Eng",
        email: "eryka.ekaliadewi@uksw.edu",
        expertise: [
          "Matematika Komputer",
          "Computer Manufacturing",
          "Operational Research",
        ],
        externalLink:
          "https://drive.google.com/u/0/open?usp=forms_web&id=1sm2vUWKoi6FYnQVyLkYLFQItMWQY7urf",
      },
      {
        username: "virgelius.taralandu",
        fullname: "VIRGELIUS HENDRAWAN TARALANDU, S.Kom",
        email: "virgelius.taralandu@uksw.edu",
        expertise: ["Data Science"],
        externalLink: "https://hendraatara91.github.io/hendratara.github.io/",
      },
      {
        username: "martza.swastikasari",
        fullname: "Martza Merry Swastikasari, S.Kom., M.Kom.",
        email: "martza.swastikasari@uksw.edu",
        expertise: ["Teknologi dan Manajemen Pendidikan"],
        externalLink:
          "https://drive.google.com/u/0/open?usp=forms_web&id=1eUy9HGHGdtnstoBt-bkSZbpw48UP2b_U",
      },
      {
        username: "rissal.efendi",
        fullname: "Rissal Efendi, M.Kom.",
        email: "rissal.efendi@uksw.edu",
        expertise: ["Keamanan Jaringan Komputer", "Data Siber"],
        externalLink:
          "https://drive.google.com/u/0/open?usp=forms_web&id=1mxrBOx3fwqb55XsCKnHiQ7FeGu24tyXP",
      },
      {
        username: "budhi.kristianto",
        fullname: "Budhi Kristianto, S.Kom., M.Sc., Ph.D",
        email: "budhik@uksw.edu",
        expertise: [""],
      },
    ];

    for (const lecturer of lecturers) {
      const exist = await UserModel.findOne({ email: lecturer.email });
      if (!exist) {
        const userData = {
          username: lecturer.username,
          fullname: lecturer.fullname,
          email: lecturer.email,
          password: lecturer.username, // Default password is username
          role: "dosen",
          isActive: true,
        };

        const user = await UserModel.create(userData);

        // Create lecturer profile
        const lecturerData = {
          username: lecturer.username,
          fullname: lecturer.fullname,
          email: lecturer.email,
          expertise: lecturer.expertise,
          externalLink: lecturer.externalLink,
          isActive: true,
        };

        const lecturerExist = await LecturerModel.findOne({
          email: lecturer.email,
        });
        
        let lecturerDocId = lecturerExist?._id;
        
        if (!lecturerExist) {
          const newLecturer = await LecturerModel.create(lecturerData);
          lecturerDocId = newLecturer._id;
          logger.info(`Lecturer profile ${lecturer.fullname} created`);
        }

        if (lecturerDocId) {
          const hasEmbedding = await EmbeddingModel.findOne({
            tableName: "lecturer",
            rowId: lecturerDocId.toString(),
          });
          
          if (!hasEmbedding) {
            await EmbeddingInsertService.upsertOne(
              "lecturer",
              lecturerDocId.toString(),
              `${lecturer.fullname}\n${lecturer.email}\n${lecturer.expertise}\n${lecturer.externalLink}`
            ).catch((err) => logger.error(`Failed to embed seeded lecturer ${lecturer.fullname}:`, err));
            logger.info(`Generated embedding for ${lecturer.fullname}`);
          }
        }

        logger.info(`User account for ${lecturer.fullname} created/verified`);
      } else {
        // If user exists, we still want to ensure their lecturer profile and embedding exists.
        const lecturerExist = await LecturerModel.findOne({
          email: lecturer.email,
        });
        
        if (lecturerExist) {
          const hasEmbedding = await EmbeddingModel.findOne({
            tableName: "lecturer",
            rowId: lecturerExist._id.toString(),
          });
          
          if (!hasEmbedding) {
            await EmbeddingInsertService.upsertOne(
              "lecturer",
              lecturerExist._id.toString(),
              `${lecturer.fullname}\n${lecturer.email}\n${lecturer.expertise}\n${lecturer.externalLink}`
            ).catch((err) => logger.error(`Failed to embed seeded lecturer ${lecturer.fullname}:`, err));
            logger.info(`Generated embedding for existing seeded lecturer ${lecturer.fullname}`);
          }
        }
      }
    }

    logger.info("All lecturer user accounts seeding completed");
    return;
  } catch (error) {
    logger.error("Error seeding lecturer users: ", error);
    throw error;
  }
};

export const seedProdiProfile = async () => {
  try {
    const exist = await ProdiProfileModel.findOne();
    if (exist) return;

    await ProdiProfileModel.create({} as any);
    logger.info("Prodi Profile seeded");
  } catch (error) {
    logger.error("Error seeding Prodi Profile: ", error);
    throw error;
  }
};
