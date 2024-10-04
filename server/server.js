require("dotenv").config();
const express = require("express");
const { createServer } = require("http");

const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { rateLimit } = require("express-rate-limit");
const initializeSocket = require("./socket");
const router = require("./routes");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

const limiter = rateLimit({
  windowMs: 1000 * 60 * 10,
  limit: 200,
  message: "maximum number of requests reached, please try again in 10 minutes",
  legacyHeaders: true,
  standardHeaders: "draft-7",
})

app.use(helmet());
app.use(cors(corsOptions));
app.use(limiter);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", router);

const httpServer = createServer(app);

const server = httpServer.listen(8080, () => {
  console.log("Server is running on port 8080");
});

const io = initializeSocket(server);