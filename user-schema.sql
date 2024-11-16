CREATE TABLE `user-management`.`user` (`id` INT NOT NULL AUTO_INCREMENT ,
 `firstName` VARCHAR(45) NOT NULL , `lastName` VARCHAR(45) NOT NULL , 
 `email` VARCHAR(55) NOT NULL , `phone` VARCHAR(45) NOT NULL , `comments` TEXT NOT NULL ,
 `status` VARCHAR(20) NOT NULL DEFAULT 'active' , PRIMARY KEY (`id`)) ENGINE = InnoDB;