CREATE TABLE favourites (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  product_id INTEGER REFERENCES products(id) NOT NULL
);
