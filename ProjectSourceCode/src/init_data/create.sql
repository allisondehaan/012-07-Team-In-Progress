-- -----------------------------------------------------
-- Table Prefrences
-- -----------------------------------------------------
DROP TABLE IF EXISTS Preferences CASCADE;
CREATE TABLE Preferences(
  idPref SERIAL PRIMARY KEY ,
  sortingPref INT NULL
);

-- -----------------------------------------------------
-- Table User
-- -----------------------------------------------------
DROP TABLE IF EXISTS Users CASCADE;
CREATE TABLE Users (
  idUser SERIAL PRIMARY KEY,
  email VARCHAR(45) NOT NULL,
  userName VARCHAR(45) NOT NULL,
  passWordHash VARCHAR(45) NOT NULL,
  firstName VARCHAR(45) NOT NULL,
  lastName VARCHAR(45) NULL,
  Usercol VARCHAR(45) NULL,
  idPref INT NOT NULL,
);


-- -----------------------------------------------------
-- Table TODO
-- -----------------------------------------------------
DROP TABLE IF EXISTS TODO CASCADE;
CREATE TABLE TODO (
  idTODO SERIAL PRIMARY KEY,
  eventDate DATE NOT NULL,
  eventTime TIME NOT NULL,
  eventTitle VARCHAR(45) NOT NULL,
  eventDesc VARCHAR(4500) NULL,
  eventLocation VARCHAR(70) NULL,
  );

-- -----------------------------------------------------
-- TableUser_to_TODOS
-- -----------------------------------------------------
DROP TABLE IF EXISTS Users_toTODO CASCADE;
CREATE TABLE Users_to_TODO (
  idTODO INT NOT NULL,
  idUser INT NOT NULL,
);