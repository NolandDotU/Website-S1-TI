import { randomUUID } from "crypto";
import { Request, Response } from "express";
import ChatMessageModel, {
  ChatOwnerType,
  ChatRole,
  IChatMessageInput,
} from "../../../model/chatMessageModel";
import { verifyToken } from "../../../utils/jwt";
import { logger } from "../../../utils";
import { error } from "console";

const CHAT_GUEST_COOKIE = "chatGuestId";
const CHAT_SESSION_COOKIE = "chatSessionId";

type ChatOwner = {
  ownerType: ChatOwnerType;
  ownerId: string;
  sessionId: string;
};

class ChatHistoryService {
  private getTokenUserId(req: Request): string | null {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (accessToken) {
      try {
        return verifyToken(accessToken).id;
      } catch (error: any) {
        if (error.name === "TokenExpiredError") {
          console.warn("Access token expired, try refresh token...");
        } else {
          console.error("Access token not valid: ", error.message);
        }
      }
    }

    if (refreshToken) {
      try {
        return verifyToken(refreshToken, true).id;
      } catch (error: any) {
        console.error("Refresh token failed to validate: ", error.message);
      }
    }

    return null;
  }

  private readSessionId(req: Request): string | null {
    const querySession = req.query?.session_id;
    if (typeof querySession === "string" && querySession.trim()) {
      return querySession.trim();
    }

    const bodySession = req.body?.session_id;
    if (typeof bodySession === "string" && bodySession.trim()) {
      return bodySession.trim();
    }

    const cookieSession = req.cookies?.[CHAT_SESSION_COOKIE];
    if (typeof cookieSession === "string" && cookieSession.trim()) {
      return cookieSession.trim();
    }

    return null;
  }

  resolveOwner(req: Request, res: Response): ChatOwner {
    const sessionId = this.readSessionId(req) || randomUUID();
    const userId = this.getTokenUserId(req);

    res.cookie(CHAT_SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      ...(userId ? { maxAge: 30 * 24 * 60 * 60 * 1000 } : {}), // guest: session cookie 1 bulan
    });

    if (userId) {
      return {
        ownerType: "user",
        ownerId: userId,
        sessionId,
      };
    }

    let guestId = req.cookies?.[CHAT_GUEST_COOKIE];
    if (!guestId || typeof guestId !== "string") {
      guestId = randomUUID();
    }

    res.cookie(CHAT_GUEST_COOKIE, guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      // session cookie: clear on browser close
    });

    return {
      ownerType: "guest",
      ownerId: guestId,
      sessionId,
    };
  }

  async saveMessage(data: IChatMessageInput): Promise<void> {
    if (!data.content?.trim()) return;
    await ChatMessageModel.create(data);
  }

  async getRecentMessages(
    ownerType: ChatOwnerType,
    ownerId: string,
    sessionId: string,
    limit = 12,
  ): Promise<Array<{ role: ChatRole; content: string }>> {
    const docs = await ChatMessageModel.find({
      ownerType,
      ownerId,
      sessionId,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return docs
      .reverse()
      .map((doc) => ({ role: doc.role as ChatRole, content: doc.content }));
  }

  async getSessionMessages(
    ownerType: ChatOwnerType,
    ownerId: string,
    sessionId: string,
  ) {
    return ChatMessageModel.find({ ownerType, ownerId, sessionId })
      .sort({ createdAt: 1 })
      .lean();
  }

  async mergeGuestHistoryToUser(
    guestId: string,
    userId: string,
  ): Promise<void> {
    if (!guestId || !userId) return;

    try {
      await ChatMessageModel.updateMany(
        { ownerType: "guest", ownerId: guestId },
        { $set: { ownerType: "user", ownerId: userId } },
      );
    } catch (error) {
      logger.error(`Failed to merge guest chat history [${error}]`);
    }
  }
}

export const chatHistoryService = new ChatHistoryService();
