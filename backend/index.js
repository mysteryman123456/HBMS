const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./db.js");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// for sending email
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "decorssite@gmail.com",
    pass: "rgujellxkfgoelzz",
  },
});

require("dotenv").config();
const app = express();

const PORT = 3008;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.post("/signup", async (req, res) => {
  const { username, email, phone, password, role } = req.body;

  if (!username || !email || !phone || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const checkUser = await pool.query(
      "SELECT * FROM Users WHERE email = $1 OR phone = $2",
      [email, phone]
    );
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "Email or phone exists" });
    }

    const result = await pool.query(
      "INSERT INTO Users (username, email, phone, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [username, email, phone, hashedPassword, role]
    );

    res.status(201).json({
      message: "Registered Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Fields can't be empty" });
  }
  try {
    const user = await pool.query("SELECT * FROM Users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "User does not exist" });
    }
    isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const payload = {
      email: user.rows[0].email,
      role: user.rows[0].role,
      phonenumber: user.rows[0].phone,
    };

    const token = jwt.sign(payload, process.env.JWT_TOKEN, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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

// for ading hotel data by admin
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
      [
        hotel_id,
        hotel_name,
        l_l,
        hotel_location,
        amenitiesParsed,
        seller_email,
        description,
      ]
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
    res.status(500).json({ message: "An error occurred" });
  }
});

// fetching hotel data to update
app.post("/fetch-hotel-edit", async (req, res) => {
  const { seller_email } = req.body;
  try {
    const data = await pool.query(
      `
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
    Hotel.hotel_id DESC`,
      [seller_email]
    );
    res.status(200).json({ rows: data.rows });
  } catch (err) {
    res.status(400).json({ message: "Internal server error" });
    console.log(err);
  }
});

// admin updating listing
app.put("/update-listing", async (req, res) => {
  const {
    seller_email,
    hotel_name,
    hotel_location,
    amenities,
    price,
    room_number,
    room_capacity,
    hotel_id,
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
      seller_email,
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
      hotel_id,
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

// admin hotel deleting
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
    await client.query("DELETE FROM Room WHERE hotel_id = $1", [hotel_id]);
    await client.query("DELETE FROM Hotel_image WHERE hotel_id = $1", [
      hotel_id,
    ]);

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

// for searchbar in home page
app.get("/get-hotel-location-name", async (req, res) => {
  try {
    const data = await pool.query(`
    SELECT 
      hotel_location,
      hotel_name
      FROM  
      Hotel
    `);
    if (data.rowCount > 0) {
      res.status(200).json({ message: data.rows });
    } else {
      res.status(404).json({ message: "No data available" });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "No data available" });
  }
});

// for adding rating in product page

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
    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error(error);
  }
});

// for geting rating in product page

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

// for geting data in productPage
app.get("/get-hotel-listing/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await pool.query(
      `
      SELECT 
        h.hotel_id,
        h.hotel_location,
        h.hotel_name,
        h.l_l,
        h.amenities,
        h.description,
        h.seller_email,
        r.price,
        r.room_capacity,
        r.room_type,
        r.room_number,
        r.room_id,
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
      res.status(200).json({ message: data.rows[0] });
    } else {
      res.status(404).json({ message: "Hotel not found" });
    }
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "An error occurred" });
  }
});

// for adding reservations and sending emails
app.post("/add-reservations", async (req, res) => {
  const {
    hotel_name,
    seller_email,
    hotel_id,
    room_number,
    room_id,
    user_phone,
    check_in_date,
    check_out_date,
  } = req.body;

  const mailOptions = {
    from: "",
    to: seller_email,
    subject: "🔔 New Reservation Confirmation",
    html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
  <h2 style="color: #2c3e50; text-align: center;">Room Reservation Confirmation 📅</h2>
  
  <p>Dear Hotel Manager,</p>
  <p>A new room reservation has been successfully processed. Below are the reservation details:</p>
  
  <table style="width: 100%; border-collapse: collapse; margin-top: 15px; background: #fff;">
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd; background: #f2f2f2;"><strong>Hotel Name</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">${hotel_name}</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd; background: #f2f2f2;"><strong>Room Number</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">${room_number}</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd; background: #f2f2f2;"><strong>Guest Contact</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">${user_phone}</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd; background: #f2f2f2;"><strong>Check-in Date</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">${check_in_date}</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd; background: #f2f2f2;"><strong>Check-out Date</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">${check_out_date}</td>
    </tr>
  </table>
  
  <p style="margin-top: 20px;">
    Please ensure that the room is prepared for the guest's arrival. If any further verification is required, kindly reach out to the guest using the provided contact details.
  </p>
  
  <p style="margin-top: 20px; font-style: italic; color: #555;">
    Thank you for choosing our booking system. We appreciate your partnership and look forward to providing seamless service.  
  </p>
  
  <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;" />
  
  <p style="font-size: 14px; color: #888; text-align: center;">
    This is an automated notification. Please do not reply to this email.
  </p>
  </div>
  `,
  };

  try {
    await pool.query("BEGIN");

    const dateConflictQuery = `
      SELECT * FROM reservation 
      WHERE room_id = $1 
      AND (
        (check_in_date <= $2 AND check_out_date > $2) OR
        (check_in_date < $3 AND check_out_date >= $3) OR
        (check_in_date >= $2 AND check_out_date <= $3)
      ) 
    `;

    const dateConflictResult = await pool.query(dateConflictQuery, [
      room_id,
      check_in_date,
      check_out_date,
    ]);

    if (dateConflictResult.rows.length > 0) {
      await pool.query("ROLLBACK");
      return res.status(400).json({ message: "Unavailable on picked dates" });
    }

    const reservationQuery = `
      INSERT INTO reservation (hotel_id, user_phone, room_id, room_number, check_in_date, check_out_date) 
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const reservationValues = [
      hotel_id,
      user_phone,
      room_id,
      room_number,
      check_in_date,
      check_out_date,
    ];

    await pool.query(reservationQuery, reservationValues);
    await pool.query("COMMIT");

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Reservation successful!" });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Reservation failed!" });
  }
});

// admin deleting reservations
app.delete("/delete-reservation/:reservation_id", async (req, res) => {
  const { reservation_id } = req.params;
  try {
    const deleteQuery = "DELETE FROM reservation WHERE reservation_id = $1";
    await pool.query(deleteQuery, [reservation_id]);

    res.status(200).json({ message: "Reservation deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete reservation!" });
  }
});

// fetching reservation details for admin page

app.get("/reservations/:seller_email", async (req, res) => {
  const { seller_email } = req.params;
  try {
    const query = `
      SELECT 
        r.reservation_id,
        r.user_phone,
        r.room_number,
        r.check_in_date,
        r.check_out_date,
        h.hotel_name,
        h.hotel_id,
        (SELECT u.email FROM users u WHERE u.phone = r.user_phone) AS user_email,
        h.seller_email
      FROM reservation r
      INNER JOIN hotel h ON r.hotel_id = h.hotel_id
      WHERE h.seller_email = $1
      ORDER BY r.check_in_date DESC
    `;
    const result = await pool.query(query, [seller_email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No reservations found!" });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching reservations" });
  }
});

// for home page
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

// for search page
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
      query += ` ORDER BY avg_rating ${
        sortedRating === "r_l_h" ? "ASC" : "DESC"
      }`;
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

// user dashboard code

// code to change password
app.post("/user-change-password", async (req, res) => {
  const { email, old_password, new_password } = req.body;

  if (!email || !old_password || !new_password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    const user = userResult.rows[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordMatch = await bcrypt.compare(old_password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    if (new_password.length < 8) {
      return res.status(400).json({ message: "Use stronger password" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(new_password, salt);
    await pool.query("UPDATE users SET password = $1 WHERE email = $2", [
      hashedNewPassword,
      email,
    ]);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// code to update user phonenumber from userdashboard

app.post("/update-user-phonenumber", async (req, res) => {
  const { email, new_phone_number } = req.body;

  if (!email || !new_phone_number)
    return res.status(400).json({ message: "Missing required fields" });

  if (!/^[9][0-9]{9}$/.test(new_phone_number))
    return res.status(400).json({ message: "Invalid phonenumber !" });

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    const user = userResult.rows[0];

    if (!user) return res.status(404).json({ message: "User not found" });

    await pool.query("UPDATE users SET phone = $1 WHERE email = $2", [
      new_phone_number,
      email,
    ]);

    return res
      .status(200)
      .json({ message: "Phone number updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// code to delete user account

app.delete("/user-delete-account/:email", async (req, res) => {
  const { email } = req.params;
  if (!email) return res.status(400).json({ message: "Email is required" });
  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    const user = userResult.rows[0];
    if (!user) return res.status(404).json({ message: "User not found" });
    await pool.query("DELETE FROM users WHERE email = $1", [email]);
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// code to fetch reservation for user

app.get("/user-reservations/:phone", async (req, res) => {
  const { phone } = req.params;

  if (!/^[9]\d{9}$/.test(phone)) {
    return res.status(400).json({ message: "Invalid phone number format" });
  }
  try {
    const query = `
      SELECT 
        r.reservation_id, 
        r.room_number, 
        r.check_in_date, 
        r.check_out_date, 
        rm.room_type, 
        rm.room_capacity, 
        rm.price,
        rm.room_id,
        h.hotel_name,
        h.hotel_id,
        h.seller_email,
        h.hotel_location
      FROM reservation r
      INNER JOIN room rm ON r.room_id = rm.room_id
      INNER JOIN hotel h ON r.hotel_id = h.hotel_id
      WHERE r.user_phone = $1
    `;

    const result = await pool.query(query, [phone]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// code to update user reservation by user

app.post("/update-user-reservation", async (req, res) => {
  const { check_in_date, check_out_date, user_phone, room_id, reservation_id } =
    req.body;

  if (
    !check_in_date ||
    !check_out_date ||
    !user_phone ||
    !room_id ||
    !reservation_id
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const checkConflict = await pool.query(
      `SELECT * FROM reservation 
      WHERE room_id = $1 
      AND reservation_id != $4 
      AND (
        (check_in_date <= $2 AND check_out_date > $2) OR
        (check_in_date < $3 AND check_out_date >= $3) OR
        (check_in_date >= $2 AND check_out_date <= $3)
      )`,
      [room_id, check_in_date, check_out_date, reservation_id]
    );

    if (checkConflict.rows.length > 0) {
      return res.status(400).json({ message: "Unavailable for picked dates" });
    }
    await pool.query(
      "UPDATE reservation SET check_in_date = $1, check_out_date = $2 WHERE reservation_id = $3",
      [check_in_date, check_out_date, reservation_id]
    );

    res.status(200).json({ message: "Updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



// Admin deletes reservation
app.delete("/admin-delete-reservation/:reservation_id", async (req, res) => {
  const { reservation_id } = req.params;
  const { 
    hotel_name, check_in_date, 
    check_out_date, room_number, user_email 
  } = req.body;

  try {
    const deleteQuery = "DELETE FROM reservation WHERE reservation_id = $1";
    await pool.query(deleteQuery, [reservation_id]);

    const emailContent = `
      <h3>Dear user, your reservation has been cancelled !</h3>
      <table border="1" cellspacing="0" cellpadding="5">
        <tr><td><strong>Hotel Name</strong></td><td>${hotel_name}</td></tr>
        <tr><td><strong>Room Number</strong></td><td>${room_number}</td></tr>
        <tr><td><strong>Check-in Date</strong></td><td>${check_in_date}</td></tr>
        <tr><td><strong>Check-out Date</strong></td><td>${check_out_date}</td></tr>
      </table>
    `;

    // Sending email to user
    await transporter.sendMail({
      from: "", 
      to: user_email,
      subject: "Reservation Cancellation Notice",
      html: emailContent,
    });

    res.status(200).json({ message: "Reservation deleted successfully and email sent!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to delete reservation!" });
  }
});

// User deletes reservation
app.delete("/user-delete-reservation/:reservation_id", async (req, res) => {
  const { reservation_id } = req.params;
  const { 
    seller_email, hotel_name, check_in_date, 
    check_out_date, room_number, user_phone 
  } = req.body;

  try {
    const deleteQuery = "DELETE FROM reservation WHERE reservation_id = $1";
    await pool.query(deleteQuery, [reservation_id]);

    // email to hotel admin that user deleted the listing
    const emailContent = `
      <h3>A Reservation Has Been Cancelled</h3>
      <table border="1" cellspacing="0" cellpadding="5">
        <tr><td><strong>Hotel Name</strong></td><td>${hotel_name}</td></tr>
        <tr><td><strong>Room Number</strong></td><td>${room_number}</td></tr>
        <tr><td><strong>Check-in Date</strong></td><td>${check_in_date}</td></tr>
        <tr><td><strong>Check-out Date</strong></td><td>${check_out_date}</td></tr>
        <tr><td><strong>User Phonenumber</strong></td><td>${user_phone}</td></tr>
      </table>
      <p>Please update your availability accordingly.</p>
    `;

    await transporter.sendMail({
      from: "", 
      to: seller_email,
      subject: "Reservation Deletion",
      html: emailContent,
    });

    res.status(200).json({ message: "Reservation deleted successfully!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to delete reservation!" });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));