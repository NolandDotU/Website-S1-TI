import z from "zod";

const CustomContentSchema = z.object({
  title: z.string().max(50).optional(),
  description: z.string().optional(),
  imageUrl: z.string(),
  link: z.string().url().optional(),
});

export const CreateHighlightSchema = z.object({
  type: z.enum(["announcement", "custom"]),
  announcementId: z.string().optional(),
  customContent: CustomContentSchema.optional(),
});

export interface HighlightDTO {
  type: "announcement" | "custom";
  announcementId?: string;
  customContent?: {
    title: string;
    description?: string;
    imageUrl: string;
    link?: string;
  };
  order: number;
}
