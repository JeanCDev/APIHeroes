DROP TABLE IF EXISTS tb_heroes;
CREATE TABLE tb_heroes (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  power TEXT NOT NULL
);

-- CREATE
INSERT INTO tb_heroes (name, power) VALUES ('Flash', 'Velocidade');
INSERT INTO tb_heroes (name, power) VALUES ('Aquaman', 'Falar com animais aquáticos');
INSERT INTO tb_heroes (name, power) VALUES ('Batman', 'Dinheiro');

-- READ
SELECT * FROM tb_heroes;
SELECT * FROM tb_heroes WHERE name = 'Flash';

-- UPDATE
UPDATE tb_heroes SET name = 'Goku', power = 'Deus' WHERE id = 1;

-- DELETE
DELETE FROM tb_heroes WHERE id = 1;
