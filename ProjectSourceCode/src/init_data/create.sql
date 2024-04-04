-- -----------------------------------------------------
-- Table prefrences
-- -----------------------------------------------------
DROP TABLE IF EXISTS preferences CASCADE;
CREATE TABLE preferences(
  idPref SERIAL PRIMARY KEY ,
  sortingPref INT NULL
);

-- -----------------------------------------------------
-- Table users
-- -----------------------------------------------------
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
  idUser SERIAL PRIMARY KEY,
  --email VARCHAR(45) NOT NULL,
  userName VARCHAR(45) NOT NULL,
  passWordHash CHAR(100) NOT NULL --Need to add comma when/if below is uncommented
  --firstName VARCHAR(45) NOT NULL,
  --lastName VARCHAR(45) NULL,
  --Usercol VARCHAR(45) NULL,
  --idPref INT NOT NULL
);


-- -----------------------------------------------------
-- Table todo
-- -----------------------------------------------------
DROP TABLE IF EXISTS todo CASCADE;
CREATE TABLE todo(
  idTODO SERIAL PRIMARY KEY,
  eventDate DATE NOT NULL,
  eventTime TIME NOT NULL,
  eventTitle VARCHAR(45) NOT NULL,
  eventDesc VARCHAR(4500) NULL,
  eventLocation VARCHAR(70) NULL
  );

-- -----------------------------------------------------
-- Table users_to_todo
-- -----------------------------------------------------
DROP TABLE IF EXISTS users_to_todo CASCADE;
CREATE TABLE users_to_todo (
  idTODO INT NOT NULL,
  idUser INT NOT NULL
);