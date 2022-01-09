CREATE TABLE messagethreads (
  id SERIAL PRIMARY KEY NOT NULL,
  from_user INTEGER REFERENCES users(id) NOT NULL,
  product_id INTEGER REFERENCES products(id) NOT NULL
);
