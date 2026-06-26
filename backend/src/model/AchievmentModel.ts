import mongoose from "mongoose";


const achievementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        recipient: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            enum: [
                "Mahasiswa",
                "Dosen",
                "Program Studi",
                "Alumni",
                "Organisasi",
            ],
            required: true,
        },

        level: {
            type: String,
            enum: [
                "Internasional",
                "Nasional",
                "Provinsi",
                "Kabupaten/Kota",
                "Universitas",
                "Fakultas",
                "Program Studi",
            ],
            required: true,
        },

        organizer: {
            type: String,
            trim: true,
        },

        achievementDate: {
            type: Date,
            required: true,
        },

        description: {
            type: String,
            default: "",
        },

        image: {
            type: String,
            default: "",
        },

        certificate: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Achievement", achievementSchema);