import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";

(async () => {
  mongoose.connect(process.env.MONGO_URL);
  const buttonSchema = new mongoose.Schema({
    isOnline: { type: Boolean, default: false },
  });

  const OnlineSwitch = mongoose.model("isOnline", buttonSchema);
  let onlineSwitchID = null;
  let onlineSwitch = await OnlineSwitch.findOne({});

  if (!onlineSwitch) {
    const newOnlineSwitch = await OnlineSwitch.create({});
    onlineSwitchID = newOnlineSwitch._id;
  } else {
    onlineSwitchID = onlineSwitch._id;
  }

  const app = express();
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));

  app.get("/api", async (req, res) => {
    const onlineSwitch = await OnlineSwitch.findOne({ _id: onlineSwitchID });
    res.send({ vladIsOnline: onlineSwitch.isOnline });
  });

  app.post("/api", async (req, res) => {
    await OnlineSwitch.updateOne({ _id: onlineSwitchID }, [
      { $set: { isOnline: { $eq: [false, "$isOnline"] } } },
    ]);
    res.status(200).send();
  });

  app.listen(process.env.PORT, () =>
    console.log("button-home-manager running on 9090")
  );
})(); // IIFE
