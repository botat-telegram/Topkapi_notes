-- Drop database if exists
DROP DATABASE IF EXISTS topkapinotes;

-- Create database
CREATE DATABASE IF NOT EXISTS topkapinotes;

-- Use the database
USE topkapinotes;

-- Create Pathes table
CREATE TABLE IF NOT EXISTS Pathes (
    path_id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    path TEXT NOT NULL UNIQUE,
    path_type VARCHAR(10) NOT NULL DEFAULT 'folder'
);

-- Set auto increment start value
ALTER TABLE Pathes AUTO_INCREMENT = 21040301069;

-- Create Files table
CREATE TABLE IF NOT EXISTS Files (
    file_id VARCHAR(100) NOT NULL PRIMARY KEY,
    file_name VARCHAR(20) NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    path_id BIGINT NOT NULL,
    CONSTRAINT fk_path
        FOREIGN KEY (path_id)
        REFERENCES Pathes(path_id)
);
