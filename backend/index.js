const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db.js');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const app = express();
const PORT = 3008;

app.use(cors());
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended: true }));

app.post('/signup', async (req, res) => {
  const { username, email, phone, password, role} = req.body;

  if (!username || !email || !phone || !password || !role) {
    return res.status(400).json({ message: 'All fields are required'});
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const checkUser = await pool.query(
      'SELECT * FROM Users WHERE email = $1 OR phone = $2',
      [email, phone]
    );
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email or phone exists' });
    }

    const result = await pool.query(
      'INSERT INTO Users (username, email, phone, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, email, phone, hashedPassword, role]
    );

    res.status(201).json({
      message: 'Registered Successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Fields can't be empty"});
  }
  try {
    const user = await pool.query(
      'SELECT * FROM Users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    isMatch = await bcrypt.compare(password , user.rows[0].password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const payload = {
      email : user.rows[0].email,
      role : user.rows[0].role,
    }

    const token = jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "30d" });

    res.status(200).json({
      message: 'Login successful',
      token : token,
    });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Unique id for adding website
const crypto = require("crypto");
function UUID() {
  const uuid = crypto.randomUUID(); 
  const alphanumericPart = uuid.replace(/-/g, ""); 
  return alphanumericPart.slice(0, 20); 
}
const hotel_id = UUID();

// cloudinary imports
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY,       
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hotel_images", 
    format: async (req, file) => "jpg", 
    public_id: (req, file) => file.originalname.split(".")[0], 
  },
});

const upload = multer({ storage: storage });

app.post("/add-hotel", upload.array("images"), async (req, res) => {
  const {
    seller_email,
    hotel_name,
    hotel_location,
    l_l,
    room_capacity,
    room_type,
    room_number,
    price,
    amenities,
  } = req.body;

  const amenitiesParsed = JSON.stringify(amenities);

  try {
    const hotelResult = await pool.query(
      `INSERT INTO Hotel (hotel_id , hotel_name, l_l, hotel_location, amenities ,seller_email) 
       VALUES ($1, $2, $3, $4 , $5 ,$6) RETURNING hotel_id`,
      [hotel_id , hotel_name, l_l, hotel_location, amenitiesParsed , seller_email]
    );

    const imagePromises = req.files.map((file) =>
      pool.query(
        `INSERT INTO Hotel_image (hotel_id, image_url) VALUES ($1, $2)`,
        [hotel_id, file.path]
      )
    );
    await Promise.all(imagePromises);

    await pool.query(
      `INSERT INTO Room (room_number, hotel_id, room_capacity, room_type, price) 
       VALUES ($1, $2, $3, $4, $5)`,
      [room_number, hotel_id, room_capacity, room_type, price]
    );

    res.status(201).json({ message: "Hotel listed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred"});
  }
});

app.post("/fetch-hotel-edit",async(req , res)=>{
  const {seller_email} = req.body
  try{
    const data = await pool.query(`
    SELECT 
      Hotel.hotel_name,
      Hotel.hotel_location,
      Hotel.amenities,
      Room.room_number,
      Room.room_capacity,
      Room.room_type,
      Room.price
    FROM 
      Hotel
    INNER JOIN 
      Room
    ON 
      Hotel.hotel_id = Room.hotel_id
    WHERE 
      Hotel.seller_email = $1`,[seller_email]);
      res.status(200).json({rows : data.rows[0]})
  }
  catch(err){
    res.status(400).json({message : "Internal server error"})
    console.log(err)
  }
  });
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
