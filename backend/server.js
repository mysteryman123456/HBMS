const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const roomRoutes = require("./routes/roomRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

dotenv.config();
const app = express();
const PORT = 3008;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/hotels", hotelRoutes);
app.use("/rooms", roomRoutes);
app.use("/reservations", reservationRoutes);
app.use("/reviews", reviewRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));