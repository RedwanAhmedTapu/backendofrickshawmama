// server.js or app.js

const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);

require("dotenv").config();

// const frontendOrigin = `http://localhost:3000`;
const frontendOrigin = process.env.ORIGIN;
// console.log(frontendOrigin);

const Rickshawpuller = require("../models/rickshawpuller.model");

const signup = require("../route/user");
const login = require("../route/userlogin");
const rickshawpullerlogin = require("../route/rickshawmama.login");
const googleAuthentication = require("../route/googleAuth");
const verifyEmail = require("../route/email.verification");
// const googleAuthverfication = require("../route/googleAuth.verfication");
const rickshawpullerRegistration = require("../route/rickshawpuller.registration");
const rickshawpullerData = require("../route/rickshawpullerdata");
const rickshawpullerLocationUpdate = require("../route/rickshawpuller.update.location");
const rickshawPullerROuteDelete = require("../route/rickshawpuller.route.delete");
const rickshawmamalocationSharingPermission = require("../route/rickshawmama.permit.location");
const contact=require("../route/contact");

require("../db/connection");

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());
const serverUrl = process.env.SERVER_URL;
// const serverUrl = "http://localhost:5001";

// Websocket connection
const io = socketIo(server, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

let connectedUsers = 0;

io.on("connection", (socket) => {
  console.log("New puller connected");
  connectedUsers++;

  // Emit the total number of connected users to all clients
  io.emit("connectedUsersCount", connectedUsers);

  socket.on("message", (message) => {
    console.log("Received: ", message);
  });

  // Event listener for when a client disconnects
  socket.on("disconnect", () => {
    connectedUsers--;
    io.emit("connectedUsersCount", connectedUsers);
  });
});

// Function to notify pullers
function notifyPullers(message) {
  io.emit("notification", message);
}

const getNearbyRickshawPullers = async (lat, lon) => {
  try {
    // console.log(`Searching for nearby pullers at coordinates: ${lat}, ${lon}`);
    const nearbyPullers = await Rickshawpuller.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lon, lat], // Correct order: [longitude, latitude]
          },
          $maxDistance: 30000, // 1km in meters
        },
      },
      ispermitted: true,
    });
    // console.log(`Found nearby pullers: ${JSON.stringify(nearbyPullers)}`);

    return nearbyPullers;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};

app.post("/getNearbyRickshawPullers", async (req, res) => {
  const { lat, lon } = req.body;

  try {
    // console.log(`Received request for nearby pullers at coordinates: ${lat}, ${lon}`);
    const nearbyPullers = await getNearbyRickshawPullers(lat, lon);
    // console.log(`Sending response with nearby pullers: ${JSON.stringify(nearbyPullers)}`);
    if (nearbyPullers) {
      res.json(nearbyPullers);
    }else{
      res.status(404).json({message:"no rickshawmama avilabe at now"})
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Other routes
app.post("/user/signup", signup);
app.post("/user/login", login);
app.post("/user/rickshawpullerlogin", rickshawpullerlogin);
app.post("/auth/registration", googleAuthentication);
app.post("/verify-email", verifyEmail);
app.post("/contact", contact);
// app.post("/auth/googleAuth-verfication", googleAuthverfication);
app.post("/rickshawpuller/registration", rickshawpullerRegistration);
app.get("/rickshawpuller/details", rickshawpullerData);
app.delete("/rickshawpuller/route-delete/:nid", rickshawPullerROuteDelete);
app.put("/rickshawpuller-update-location", rickshawpullerLocationUpdate);
app.put("/rickshawpuller/permit/:nid", (req, res) => {
  rickshawmamalocationSharingPermission(req, res, "permit");
});
app.put("/rickshawpuller/permit-deny/:nid", (req, res) => {
  rickshawmamalocationSharingPermission(req, res, "deny");
});

const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/upload-Face-Image", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file provided" });
  } else {
    const imageUrl = `${serverUrl}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
    // Assuming you have a Rickshawpuller instance, update the image field
    // Note: This needs to be adapted based on your actual application logic
    // For example, you need to retrieve the specific rickshawpuller instance before updating
    // rickshawpuller.image = imageUrl;
  }
});

app.post("/upload-Nid-Image", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file provided" });
  } else {
    const imageUrl = `${serverUrl}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
    // Assuming you have a Rickshawpuller instance, update the nid field
    // Note: This needs to be adapted based on your actual application logic
    // For example, you need to retrieve the specific rickshawpuller instance before updating
    // rickshawpuller.nidImage = imageUrl;
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log(__dirname);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("Server is running on port: " + port);
});
