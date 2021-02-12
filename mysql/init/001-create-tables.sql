CREATE USER 'root'@'%' IDENTIFIED BY 'shimahara';
GRANT SELECT, UPDATE, INSERT, DELETE, ON mydb.users TO 'root'@'%';
DROP TABLE IF EXISTS `users`;

create table IF NOT EXISTS `users`
(
  `id` INT AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
