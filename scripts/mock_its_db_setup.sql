-- LAST_NAME, FIRST_NAME, MIDDLE_NAME, 
-- GRAD_YEAR, PHONE, USER_ID, DORM, DORM_ROOM
-- student_data


CREATE DATABASE IF NOT EXISTS its_cygnet;
GO

USE its_cygnet;
GO

DROP TABLE IF EXISTS student_data;

CREATE TABLE student_data(
    ID          int NOT NULL AUTO_INCREMENT,
    LAST_NAME   varchar(20),
    FIRST_NAME  varchar(20),
    MIDDLE_NAME varchar(20),
    GRAD_YEAR   smallint,
    PHONE       char(10),
    USER_ID     char(10),
    DORM        varchar(15),
    DORM_ROOM   char(3),
    PHOTO       blob,
    PRIMARY KEY (ID)
);

-- For local dev
-- SET @profile_path = "PATH/TO/media/its_photos/profile.jpg";
-- For Docker
SET @profile_path = "/cygnet/media/its_photos/profile.jpg";

INSERT INTO student_data
    (LAST_NAME, FIRST_NAME, USER_ID, GRAD_YEAR, DORM, DORM_ROOM, PHOTO)
    VALUES
    ("Phoenix", "Alice", "aphoe1", "2021", "Alice Paul", "212", LOAD_FILE(@profile_path));

INSERT INTO student_data
    (LAST_NAME, FIRST_NAME, USER_ID, GRAD_YEAR, DORM, DORM_ROOM, PHOTO)
    VALUES
    ("Phoenix", "Bob", "bphoe1", "2024", "Willets", "310", LOAD_FILE(@profile_path));
