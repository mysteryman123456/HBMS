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
    description,
    room_capacity,
    room_type,
    room_number,
    price,
    amenities,
  } = req.body;

  const amenitiesParsed = JSON.stringify(amenities);

  try {
    const hotelResult = await pool.query(
      `INSERT INTO Hotel (hotel_id , hotel_name, l_l, hotel_location, amenities ,seller_email , description) 
       VALUES ($1, $2, $3, $4 , $5 ,$6 , $7) RETURNING hotel_id`,
      [hotel_id , hotel_name, l_l, hotel_location, amenitiesParsed , seller_email , description]
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
    Hotel.hotel_id,
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
    Hotel.seller_email = $1
  ORDER BY 
    Hotel.hotel_id DESC`,[seller_email]);
      res.status(200).json({rows : data.rows})
  }
  catch(err){
    res.status(400).json({message : "Internal server error"})
    console.log(err)
  }
  });

  app.put("/update-listing", async (req, res) => {
    const {
        seller_email,
        hotel_name,
        hotel_location,
        amenities,
        price,
        room_number,
        room_capacity,
        hotel_id
    } = req.body;

    try {
      const hotelUpdateQuery = `
            UPDATE Hotel 
            SET hotel_name = $1, hotel_location = $2, amenities = $3
            WHERE hotel_id = $4 AND seller_email = $5;
        `;

        const hotelResult = await pool.query(hotelUpdateQuery, [
            hotel_name,
            hotel_location,
            JSON.stringify(amenities),
            hotel_id,
            seller_email
        ]);

        const roomUpdateQuery = `
            UPDATE Room 
            SET price = $1, room_number = $2, room_capacity = $3
            WHERE hotel_id = $4;
        `;

        const roomResult = await pool.query(roomUpdateQuery, [
            price,
            room_number,
            room_capacity,
            hotel_id
        ]);

        if (hotelResult.affectedRows === 0 && roomResult.affectedRows === 0) {
            return res.status(404).json({ message: "No record found!" });
        }
        res.status(200).json({ message: "Listing updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error!" });
    }
});

app.delete("/delete-listing", async (req, res) => {
  const { seller_email, hotel_id } = req.body;
  if (!seller_email || !hotel_id) {
    return res.status(400).json({ message: "Invalid data provided!" });
  }
  const client = await pool.connect(); 
  try {
    await client.query("BEGIN"); 
    const hotelResult = await client.query(
      "DELETE FROM Hotel WHERE hotel_id = $1 AND seller_email = $2 RETURNING hotel_id",
      [hotel_id, seller_email]
    );
    if (hotelResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Listing not found!" });
    }
    await client.query(
      "DELETE FROM Room WHERE hotel_id = $1",
      [hotel_id]
    );
    await client.query(
      "DELETE FROM Hotel_image WHERE hotel_id = $1",
      [hotel_id]
    );

    await client.query("COMMIT");
    res.status(200).json({ message: "Listing deleted successfully!" });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Could not delete!");
    res.status(500).json({ message: "Server error!" });
  } finally {
    client.release();
  }
});

app.get("/get-hotel-location-name",async(req , res)=>{
  try{
   const data =  await pool.query(`
    SELECT 
      hotel_location,
      hotel_name
      FROM  
      Hotel
    `)
    if(data.rowCount > 0){
      res.status(200).json({message : data.rows})
    }else{
      res.status(404).json({message : "No data available"})
    }
  }
  catch(err){
    console.log(err);
    res.status(404).json({message : "No data available"})
  }

})

app.post("/add-rating", async (req, res) => {
  const { review, rating, user_phonenumber, id } = req.body;
  if (!review || !rating || !user_phonenumber || !id) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const query = `
      INSERT INTO Review (hotel_id, user_phone, review, stars) VALUES ($1, $2, $3, $4)`;
    const values = [id, user_phonenumber, review, rating];
    const result = await pool.query(query, values);
    res.status(201).json({message: "Review added successfully"});
  } catch (error) {
    console.error(error)
  }
});


app.get("/get-rating/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        user_phone, 
        review, 
        stars AS rating
      FROM Review
      WHERE hotel_id = $1;
    `;

    const avgRatingQuery = `
      SELECT 
        AVG(stars) AS average_rating
      FROM Review
      WHERE hotel_id = $1;
    `;

    const reviewsResult = await pool.query(query, [id]);
    const avgRatingResult = await pool.query(avgRatingQuery, [id]);
    if (reviewsResult.rows.length === 0) {
      return res.status(404).json({
        message: "No reviews found",
      });
    }
    const averageRating = avgRatingResult.rows[0]?.average_rating || 0;
    return res.status(200).json({
      averageRating: parseFloat(averageRating).toFixed(1),
      reviews: reviewsResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});


app.get("/get-hotel-listing/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await pool.query(
      `
      SELECT 
        h.hotel_location,
        h.hotel_name,
        h.l_l,
        h.amenities,
        h.description,
        r.price,
        r.room_capacity,
        r.room_type,
        r.room_number,
        Array(
          SELECT image_url 
          FROM hotel_image 
          WHERE hotel_image.hotel_id = h.hotel_id 
        ) AS hotel_image
      FROM Hotel h
      INNER JOIN room r
      ON r.hotel_id = h.hotel_id
      WHERE h.hotel_id = $1
      `,
      [id]
    );

    if (data.rowCount > 0) {
      res.status(200).json({message : data.rows[0] });
    } else {
      res.status(404).json({message: "Hotel not found" });
    }
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({message: "An error occurred" });
  }
});


app.get("/get-hotel-listing", async (req, res) => {
  try {
    const data = await pool.query(`
      SELECT 
        h.hotel_id,
        h.hotel_location,
        h.hotel_name,
        r.price,
        ARRAY(
          SELECT image_url 
          FROM hotel_image 
          WHERE hotel_image.hotel_id = h.hotel_id 
          LIMIT 1
        ) AS hotel_image
      FROM Hotel h
      INNER JOIN room r
      ON
      r.hotel_id = h.hotel_id
    `);

    if (data.rowCount > 0) {
      res.status(200).json({ message: data.rows });
    } else {
      res.status(404).json({ message: "No data available" });
    }
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "An error occurred while fetching data" });
  }
});

app.get("/get-searched-listing", async (req, res) => {
  const {
    hotel_location,
    hotel_name,
    guest_count,
    minPrice,
    maxPrice,
    sortedPrice,
    rating,
    sortedRating,
    roomCategories,
    hotelFacilities,
  } = req.query;

console.log({
  hotel_location,
  hotel_name,
  guest_count,
  minPrice,
  maxPrice,
  sortedPrice,
  rating,
  sortedRating,
  roomCategories,
  hotelFacilities,
} )
  try {
    let query = `
      SELECT 
        h.hotel_id,
        h.hotel_location,
        h.amenities,
        h.hotel_name,
        r.room_capacity,
        r.room_type,
        r.price,
        (SELECT AVG(stars) FROM Review WHERE h.hotel_id = Review.hotel_id) AS avg_rating,
        (SELECT image_url FROM hotel_image WHERE hotel_image.hotel_id = h.hotel_id LIMIT 1) AS hotel_image
      FROM Hotel h
      INNER JOIN Room r ON r.hotel_id = h.hotel_id
      WHERE r.availability_status = TRUE
    `;

    const params = [];
    let index = 1;

    if (hotel_location) {
      query += ` AND h.hotel_location ILIKE $${index}`;
      params.push(`%${hotel_location}%`);
      index++;
    }

    if (hotel_name) {
      query += ` AND h.hotel_name ILIKE $${index}`;
      params.push(`%${hotel_name}%`);
      index++;
    }

    if (guest_count) {
      query += ` AND r.room_capacity >= $${index}`;
      params.push(parseInt(guest_count));
      index++;
    }

    if (minPrice) {
      query += ` AND r.price >= $${index}`;
      params.push(parseFloat(minPrice));
      index++;
    }

    if (maxPrice) {
      query += ` AND r.price <= $${index}`;
      params.push(parseFloat(maxPrice));
      index++;
    }

    if (rating) {
      query += ` AND (SELECT AVG(stars) FROM Review WHERE h.hotel_id = Review.hotel_id) >= $${index}`;
      params.push(parseFloat(rating));
      index++;
    }

    if (roomCategories) {
      const categories = roomCategories.toLowerCase().split(",");
      query += ` AND r.room_type = ANY($${index})`;
      params.push(categories);
      index++;
    }

    if (hotelFacilities) {
      const facilities = hotelFacilities.split(",");
      query += ` AND h.amenities::TEXT ILIKE ALL($${index})`;
      params.push(facilities.map((facility) => `%${facility}%`));
      index++;
    }

    if (sortedPrice) {
      query += ` ORDER BY r.price ${sortedPrice === "l_h" ? "ASC" : "DESC"}`;
    } else if (sortedRating) {
      query += ` ORDER BY avg_rating ${sortedRating === "r_l_h" ? "ASC" : "DESC"}`;
    }

    const data = await pool.query(query, params);

    if (data.rowCount > 0) {
      res.status(200).json({ message: data.rows });
    } else {
      res.status(404).json({ message: "No data available" });
    }
  } catch (err) {
    console.error("Database query error", err);
    res.status(500).json({ message: "An error occurred while fetching data" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
