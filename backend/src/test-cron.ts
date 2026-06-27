import { mongoConnect } from "./config/database";
import AnnouncementModel from "./model/AnnouncementModel";
import mongoose from "mongoose";

const checkDb = async () => {
  await mongoConnect();
  const docs = await AnnouncementModel.find({ status: "scheduled" });
  console.log("SCHEDULED ANNOUNCEMENTS:");
  docs.forEach(doc => {
    console.log(`- ID: ${doc._id}, title: ${doc.title}, scheduleDate: ${doc.scheduleDate}, validUntil: ${doc.validUntil}`);
  });
  console.log("Current time (new Date()):", new Date());
  await mongoose.disconnect();
};

checkDb().catch(console.error);
