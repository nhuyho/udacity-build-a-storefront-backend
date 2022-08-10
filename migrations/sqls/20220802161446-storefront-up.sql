CREATE TABLE products (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(250) NOT NULL,
  price INTEGER      NOT NULL
);

CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  userName        VARCHAR(250) NOT NULL,
  firstName       VARCHAR(250) NOT NULL,
  lastName        VARCHAR(250) NOT NULL,
  password_digest VARCHAR(250) NOT NULL
);

CREATE TABLE orders (
  id      SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id),
  status  BOOLEAN NOT NULL
);

CREATE TABLE order_products (
  order_id   INTEGER NOT NULL REFERENCES orders (id),
  product_id INTEGER NOT NULL REFERENCES products (id),
  quantity   INTEGER NOT NULL
);