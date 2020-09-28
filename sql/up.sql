CREATE TABLE users (
    /* Keys */
    id          SERIAL,
    
    /* Standard Attributes */
    first_name  VARCHAR(255) NOT NULL,
    last_name   VARCHAR(255) NOT NULL,

    /* Constraints */
    PRIMARY KEY (id)
);

CREATE TABLE tools (
    /* Keys */
    id              SERIAL,
    user_id         SERIAL,

    /* Standard Attributes */
    name            VARCHAR(255) NOT NULL,
    lendable        BOOLEAN NOT NULL,
    barcode         VARCHAR(255) NOT NULL,
    purchase_date   DATE NOT NULL,
    removed_date    DATE,

    /* Constraints */
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE (barcode)
);

CREATE TABLE categories (
    /* Keys */
    id          SERIAL,
    
    /* Standard Attributes */
    name        VARCHAR(255) NOT NULL,

    /* Constraints */
    PRIMARY KEY (id),
    UNIQUE (name)
);

CREATE TABLE projects (
    /* Keys */
    id          SERIAL,
    user_id     SERIAL,
    
    /* Standard Attributes */
    name        VARCHAR(255) NOT NULL,
    completed   BOOLEAN DEFAULT FALSE,

    /* Constraints */
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);