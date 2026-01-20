import { Document } from "mongoose";

export interface PartnerDTO {
  company: string;
  link?: string;
  image: string;
}

export interface ResponsePartnerDTO extends Document, PartnerDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
