import z from "zod";

const CustomContentSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  imageUrl: z.string().url(),
  link: z.string().url().optional(),
});

export const CreateHighlightSchema = z.object({
  type: z.enum(["announcement", "custom"]),
  announcementId: z.string().optional(),
  customContent: CustomContentSchema.optional(),
  order: z.number().int().min(1),
});

export interface CreateHighlightDTO {
  type: "announcement" | "custom";
  announcementId?: string;
  customContent?: {
    title: string;
    description: string;
    imageUrl: string;
    link?: string;
  };
  order: number;
}
