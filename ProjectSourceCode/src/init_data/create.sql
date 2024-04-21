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
  passWordHash CHAR(60) NOT NULL,
  firstName VARCHAR(45) NOT NULL,
  lastName VARCHAR(45) NOT NULL,
  --Usercol VARCHAR(45) NOT NULL,
  idPref INT NOT NULL DEFAULT 1
);


-- -----------------------------------------------------
-- Table todo
-- -----------------------------------------------------
DROP TABLE IF EXISTS todo CASCADE;
CREATE TABLE todo(
  idTODO SERIAL PRIMARY KEY,
  eventDate DATE NOT NULL,
  eventTime TIME NOT NULL,
  eventTitle VARCHAR(45) UNIQUE NOT NULL,
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


-- -----------------------------------------------------
-- Table share_todo
-- -----------------------------------------------------
DROP TABLE IF EXISTS share_todo CASCADE;
CREATE TABLE share_todo (
idTODO INT NOT NULL,
hostUser INT NOT NULL,
sharedUser INT NOT NULL
);

