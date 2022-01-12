CREATE TABLE products (
  id SERIAL PRIMARY KEY NOT NULL,
  seller_id INTEGER REFERENCES users(id) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  price INTEGER NOT NULL,
  product_description VARCHAR(255) NOT NULL,
  is_featured BOOLEAN DEFAULT TRUE,
  list_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  image_url VARCHAR(255) NOT NULL
);
