-- Drop database if exists
DROP DATABASE IF EXISTS topkapinotes;

-- Create database
CREATE DATABASE IF NOT EXISTS topkapinotes;

-- Use the database
USE topkapinotes;

-- Create Pathes table
CREATE TABLE IF NOT EXISTS Pathes (
    path_id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    path TEXT NOT NULL
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

-- Insert sample data into Pathes
INSERT INTO Pathes (path) VALUES
    ('Home/Documents/Work'),
    ('Home/Documents/Personal'),  -- Fixed typo in 'Personal'
    ('Home/Downloads'),
    ('Home/Pictures');

-- Insert sample data into Files
INSERT INTO Files (file_id, file_name, file_type, path_id) VALUES
    ('BQACAgQAAx0CfZqZ-gACAzpnXKQ1gaVSLPb5_eslTxjc1T4IQAACLhYAAqD7uFJmy9d5-RuPZjYE', 'document1.pdf', 'document', 21040301069),
    ('BQACAgQAAx0CfZqZ-gACAztnXKQ18dQFI2Z_fL5axnKUjC40ZwACRhYAAqD7uFLVn1uK4p5dbTYE', 'image1.jpg', 'image', 21040301070),
    ('BQACAgQAAx0CfZqZ-gACAzxnXKQ1-OERYMwsD2IyDF67zhvmsgACTRkAAiO_wFKS5-FB3KwU8jYE', 'spreadsheet1.xlsx', 'document', 21040301069),
    ('BQACAgQAAx0CfZqZ-gACAz5nXKQ18LsFfXPsDAPaBbSc0eeHSgAC1hYAApkN2VJz2e6bN_KmrzYE', 'presentation.pptx', 'document', 21040301071);

-- Select all records from Pathes table
SELECT * FROM Pathes;