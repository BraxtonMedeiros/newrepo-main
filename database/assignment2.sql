INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

DELETE FROM account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' and inv_model = 'Hummer';

SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory AS i
INNER JOIN classification AS c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

UPDATE inventory
SET inv_image = CONCAT('/images/vehicles/', REPLACE(inv_image, '/images/', '')),
    inv_thumbnail = CONCAT('/images/vehicles/', REPLACE(inv_thumbnail, '/images/', ''))
WHERE inv_image LIKE '/images/%' AND inv_thumbnail LIKE '/images/%';