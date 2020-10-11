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

CREATE TABLE borrows (
    /* Keys */
    id          SERIAL,
    tool_id     SERIAL,
    user_id     SERIAL,
    
    /* Standard Attributes */
    borrowed_on DATE NOT NULL,
    return_date DATE NOT NULL,
    borrowed    BOOLEAN DEFAULT TRUE,

    /* Constraints */
    PRIMARY KEY (id),
    FOREIGN KEY (tool_id) REFERENCES tools (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE used_in (
    /* Keys */
    id          SERIAL,
    tool_id     SERIAL,
    project_id  SERIAL,

    /* Constraints */
    PRIMARY KEY (id),
    FOREIGN KEY (tool_id) REFERENCES tools (id),
    FOREIGN KEY (project_id) REFERENCES projects (id)
);


CREATE TABLE falls_under (
    /* Keys */
    id          SERIAL,
    tool_id     SERIAL,
    category_id SERIAL,

    /* Constraints */
    PRIMARY KEY (id),
    FOREIGN KEY (tool_id) REFERENCES tools (id),
    FOREIGN KEY (category_id) REFERENCES categories (id)
);