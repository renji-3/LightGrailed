CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  from_buyer BOOLEAN NOT NULL DEFAULT TRUE,
  message_thread_id INTEGER REFERENCES messagethreads(id) NOT NULL,
  message_content VARCHAR(255) NOT NULL
);