/* Create users */
INSERT INTO users (first_name, last_name)
VALUES
    ('Connor', 'Switenky'),
    ('Greg', 'Henigman'),
    ('Sarah', 'Bury'),
    ('Carson', 'Clarke-Magrab');


INSERT INTO tools (user_id, name, lendable, barcode, purchase_date, removed_date)
VALUES
    ((SELECT id FROM users WHERE first_name = 'Carson'), 'Hand Saw', TRUE, 'fSFS', NOW(), NULL),
    ((SELECT id FROM users WHERE first_name = 'Carson'), 'Power Saw', TRUE, 'dsagadfs', NOW(), NULL),
    ((SELECT id FROM users WHERE first_name = 'Carson'), 'Screwdriver', TRUE, 'gasdgdg', NOW(), NULL),
    ((SELECT id FROM users WHERE first_name = 'Carson'), 'Power Drill', TRUE, 'gasdg', NOW(), NULL),
    ((SELECT id FROM users WHERE first_name = 'Carson'), 'CNC Machine', FALSE, 'fhdhd', NOW(), NULL),
    ((SELECT id FROM users WHERE first_name = 'Carson'), '80 Grit Sandpaper', TRUE, 'trhbsg', NOW(), NULL),
    ((SELECT id FROM users WHERE first_name = 'Carson'), 'Band Saw', TRUE, '1xthsrh', NOW(), NULL);

INSERT INTO categories (name)
VALUES
    ('Power Tool'),
    ('Hand Tool'),
    ('Sanding'),
    ('Saw'),
    ('Drill');

INSERT INTO projects (user_id, name)
VALUES
    ((SELECT id FROM users WHERE first_name = 'Carson'), 'A Big Old Shed');

INSERT INTO borrows (tool_id, user_id, borrowed_on, return_date, borrowed)
VALUES
    ((SELECT id FROM tools WHERE name = 'Hand Saw'), (SELECT id FROM users WHERE first_name = 'Carson'), '9/15/2020', '9/18/2020', FALSE),
    ((SELECT id FROM tools WHERE name = 'Hand Saw'), (SELECT id FROM users WHERE first_name = 'Carson'), '9/20/2020', '9/21/2020', FALSE),
    ((SELECT id FROM tools WHERE name = 'Hand Saw'), (SELECT id FROM users WHERE first_name = 'Carson'), '9/22/2020', '9/30/2020', FALSE),
    ((SELECT id FROM tools WHERE name = 'Hand Saw'), (SELECT id FROM users WHERE first_name = 'Carson'), '10/03/2020', '10/18/2020', TRUE),
    ((SELECT id FROM tools WHERE name = 'Band Saw'), (SELECT id FROM users WHERE first_name = 'Carson'), '9/13/2020', '9/17/2020', FALSE),
    ((SELECT id FROM tools WHERE name = 'Band Saw'), (SELECT id FROM users WHERE first_name = 'Carson'), '9/27/2020', '9/29/2020', TRUE),
    ((SELECT id FROM tools WHERE name = 'Power Drill'), (SELECT id FROM users WHERE first_name = 'Carson'), '9/22/2020', '9/30/2020', FALSE),
    ((SELECT id FROM tools WHERE name = 'Power Drill'), (SELECT id FROM users WHERE first_name = 'Carson'), '10/01/2020', '10/07/2020', TRUE);

INSERT INTO used_in (tool_id, project_id)
VALUES
    ((SELECT id FROM tools WHERE name = 'Hand Saw'), (SELECT id FROM projects WHERE name = 'A Big Old Shed')),
    ((SELECT id FROM tools WHERE name = 'Power Drill'), (SELECT id FROM projects WHERE name = 'A Big Old Shed')),
    ((SELECT id FROM tools WHERE name = 'Power Saw'), (SELECT id FROM projects WHERE name = 'A Big Old Shed'));

INSERT INTO falls_under (tool_id, category_id)
VALUES
    ((SELECT id FROM tools WHERE name = 'Hand Saw'), (SELECT id FROM categories WHERE name = 'Saw')),
    ((SELECT id FROM tools WHERE name = 'Hand Saw'), (SELECT id FROM categories WHERE name = 'Hand Tool')),
    ((SELECT id FROM tools WHERE name = 'Power Saw'), (SELECT id FROM categories WHERE name = 'Saw')),
    ((SELECT id FROM tools WHERE name = 'Power Saw'), (SELECT id FROM categories WHERE name = 'Power Tool')),
    ((SELECT id FROM tools WHERE name = 'Screwdriver'), (SELECT id FROM categories WHERE name = 'Hand Tool')),
    ((SELECT id FROM tools WHERE name = 'Power Drill'), (SELECT id FROM categories WHERE name = 'Power Tool')),
    ((SELECT id FROM tools WHERE name = 'Power Drill'), (SELECT id FROM categories WHERE name = 'Drill'));