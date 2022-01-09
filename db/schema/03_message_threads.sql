CREATE TABLE messagethreads (
  id SERIAL PRIMARY KEY NOT NULL,
  from_user INTEGER REFERENCES users(id) NOT NULL,
  item_id INTEGER REFERENCES items(id) NOT NULL
);