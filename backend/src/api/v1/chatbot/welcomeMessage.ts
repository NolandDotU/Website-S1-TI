import { Request, Response } from "express";

export class welcomeMessage {
    getWelcomeMessage = async (req: Request, res: Response) => {
        return res.status(200).json({
            status: "OK",
            data: {
                message:
                "Hallo!!👋 Saya Mr. Wacana, Asisten Virtual Program Studi Teknik Informatika UKSW. Silahkan tanyakan seputar Pengumuman, Dosen, atau informasi kampus lainnya.😊",
            },
        });
    };
}

export const wlcMessage = new welcomeMessage();