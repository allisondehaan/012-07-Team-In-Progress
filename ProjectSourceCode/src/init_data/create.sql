-- -----------------------------------------------------
-- Table Prefrences
-- -----------------------------------------------------


CREATE TABLE Prefrences(
  idPref SERIAL PRIMARY KEY ,
  sortingPref INT NULL,
)

-- -----------------------------------------------------
-- Table User
-- -----------------------------------------------------

CREATE TABLE User (
  idUser SERIAL PRIMARY KEY,
  email VARCHAR(45) NOT NULL,
  userName VARCHAR(45) NOT NULL,
  passWordHash VARCHAR(45) NOT NULL,
  firstName VARCHAR(45) NOT NULL,
  lastName VARCHAR(45) NULL,
  Usercol VARCHAR(45) NULL,
  idPref INT NOT NULL,
)


-- -----------------------------------------------------
-- Table TODO
-- -----------------------------------------------------

CREATE TABLE TODO (
  idTODO SERIAL PRIMARY KEY,
  eventDate DATE NOT NULL,
  eventTime TIME NOT NULL,
  eventTitle VARCHAR(45) NOT NULL,
  eventDesc VARCHAR(4500) NULL,
  eventLocation VARCHAR(70) NULL,
  )

-- -----------------------------------------------------
-- TableUser_to_TODOS
-- -----------------------------------------------------

CREATE TABLE User_to_TODOS (
  idTODO INT NOT NULL,
  idUser INT NOT NULL,
)