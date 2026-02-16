-- Reset Database Script
-- Run this in MySQL to fix the "too many keys" error

DROP DATABASE IF EXISTS food_waste_app;
CREATE DATABASE food_waste_app;
USE food_waste_app;

-- Database is now clean and ready for Sequelize to create tables
