export interface IKnowledge {
  kind: "contact" | "service";
  title: string;
  content: string;
  link?: string;
  synonyms?: string[];
}

export interface IKnowledgeGet extends IKnowledge {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IKnowledgeInput extends IKnowledge {}

export interface IKnowledgeResponse {
  items: IKnowledgeGet[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}
