const pool = require("../config/db");

const Hotel = {
  create: async ({ hotel_id, hotel_name, l_l, hotel_location, amenities, seller_email, description }) => {
    const amenitiesParsed = JSON.stringify(amenities);
    return pool.query(
      `INSERT INTO Hotel (hotel_id, hotel_name, l_l, hotel_location, amenities, seller_email, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING hotel_id`,
      [hotel_id, hotel_name, l_l, hotel_location, amenitiesParsed, seller_email, description]
    );
  },
  addImage: async (hotel_id, image_url) => {
    return await pool.query("INSERT INTO Hotel_image (hotel_id, image_url) VALUES ($1, $2)", [hotel_id, image_url]);
  },
  findBySellerEmail: async (seller_email) => {
    return pool.query(
      `SELECT 
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
  },
  update: async (hotel_id, seller_email, hotel_name, hotel_location, amenities) => {
    return pool.query(
      `UPDATE Hotel 
       SET hotel_name = $1, hotel_location = $2, amenities = $3
       WHERE hotel_id = $4 AND seller_email = $5`,
      [hotel_name, hotel_location, JSON.stringify(amenities), hotel_id, seller_email]
    );
  },
  delete: async (hotel_id, seller_email) => {
    return pool.query(
      "DELETE FROM Hotel WHERE hotel_id = $1 AND seller_email = $2 RETURNING hotel_id",
      [hotel_id, seller_email]
    );
  },
  deleteImages: async (hotel_id) => {
    return pool.query("DELETE FROM Hotel_image WHERE hotel_id = $1", [hotel_id]);
  },
  getLocationAndName: async () => {
    return pool.query("SELECT hotel_location, hotel_name FROM Hotel");
  },
  getListingById: async (id) => {
    return pool.query(
      `SELECT 
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
         ARRAY(
           SELECT image_url 
           FROM hotel_image 
           WHERE hotel_image.hotel_id = h.hotel_id 
         ) AS hotel_image
       FROM Hotel h
       INNER JOIN Room r ON r.hotel_id = h.hotel_id
       WHERE h.hotel_id = $1`,
      [id]
    );
  },
  getAllListings: async () => {
    return pool.query(
      `SELECT 
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
      INNER JOIN Room r ON r.hotel_id = h.hotel_id LIMIT 5
    `);
  },
  search: async ({ hotel_location, hotel_name, guest_count, minPrice, maxPrice, sortedPrice, rating, sortedRating, roomCategories, hotelFacilities }) => {
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
      query += ` ORDER BY avg_rating ${sortedRating === "r_l_h" ? "ASC" : "DESC"}`;
    }

    return pool.query(query, params);
  },
};

module.exports = Hotel;