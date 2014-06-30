DROP DATABASE IF EXISTS `chat`;
CREATE DATABASE chat;

USE chat;

CREATE TABLE `messages` (
  /* Describe your table here.*/
  `username` VARCHAR(255) DEFAULT NULL,
  `text` MEDIUMTEXT DEFAULT NULL,
  `roomname` VARCHAR(255) DEFAULT NULL
);
ALTER TABLE `messages` ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/* Create other tables and define schemas for them here! */




/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/




