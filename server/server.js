// server.js or app.js

const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");



// const frontendOrigin=`http://localhost:3000`;
const frontendOrigin="https://rickshawmama.vercel.app";
const io = socketIo(server, {
  cors: {
    origin:frontendOrigin, // Your frontend origin
    methods: ["GET", "POST"],
  },
});

const Rickshawpuller = require("../models/rickshawpuller.model");

const signup = require("../route/user");
const login = require("../route/userlogin");
const rickshawpullerlogin = require("../route/rickshawmama.login");
const googleAuthentication = require("../route/googleAuth");
const verifyEmail = require("../route/email.verification");
const googleAuthverfication = require("../route/googleAuth.verfication");
const rickshawpullerRegistration = require("../route/rickshawpuller.registration");
const rickshawpullerData = require("../route/rickshawpullerdata");

require("dotenv").config();
require("../db/connection");

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());
const serverUrl= "https://backendofrickshawmama.onrender.com";
// const serverUrl = "http://localhost:5001";


// Websocket connection
io.on("connection", (socket) => {
  console.log("Client connected");

  // Listen for user details and update rickshawpuller's location
  socket.on("updateRickshawmamaLocation", async (data) => {
    try {
      const { userNid: nid, lat, lon } = data;

      // Find the rickshawpuller by nid
      const rickshawpuller = await Rickshawpuller.findOne({ nid });

      if (rickshawpuller) {
        // Update the location in the database
        await Rickshawpuller.findByIdAndUpdate(rickshawpuller._id, {
          $set: {
            "location.coordinates": [lon, lat],
          },
        });

        // Broadcast the updated location to all clients
        io.emit("rickshawPullerLocationUpdate", {
          rickshawpullerdata: rickshawpuller,
        });

        console.log(`Updated location for rickshawpuller with nid: ${nid}`);
      } else {
        console.log(`Rickshawpuller with nid ${nid} not found`);
      }
    } catch (error) {
      console.error(error);
    }
  });

  const getNearbyRickshawPullers = async (lat, lon) => {
    try {
      console.log(`Searching for nearby pullers at coordinates: ${lat}, ${lon}`);
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
      });
      console.log(`Found nearby pullers: ${JSON.stringify(nearbyPullers)}`);

      return nearbyPullers;
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
  };

  app.get("/getNearbyRickshawPullers", async (req, res) => {
    const { lat, lon, socketId } = req.body;

    try {
      console.log(`Received request for nearby pullers at coordinates: ${lat}, ${lon}`);
      const nearbyPullers = await getNearbyRickshawPullers(lat, lon);
      console.log(`Sending response with nearby pullers: ${JSON.stringify(nearbyPullers)}`);

      res.json(nearbyPullers);
      io.emit("rickshawPullerUpdate", nearbyPullers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Other routes
app.post("/user/signup", signup);
app.post("/user/login", login);
app.post("/user/rickshawpullerlogin", rickshawpullerlogin);
app.post("/auth/registration", googleAuthentication);
app.post("/verify-email", verifyEmail);
app.post("/auth/googleAuth-verfication", googleAuthverfication);
app.post("/rickshawpuller/registration", rickshawpullerRegistration);
app.get("/rickshawpuller/details", rickshawpullerData);

const storage = multer.diskStorage({
  destination: path.join(__dirname,"uploads"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post('/upload-Face-Image', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  } else {
    const imageUrl = `${serverUrl}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
    // Assuming you have a Rickshawpuller instance, update the image field
    // Note: This needs to be adapted based on your actual application logic
    // For example, you need to retrieve the specific rickshawpuller instance before updating
    // rickshawpuller.image = imageUrl;
  }
});

app.post('/upload-Nid-Image', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
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
