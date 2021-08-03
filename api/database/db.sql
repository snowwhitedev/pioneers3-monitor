/*
SQLyog Community v13.1.5  (64 bit)
MySQL - 10.4.17-MariaDB : Database - pio3
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`pio3` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `pio3`;

/*Table structure for table `weight_history` */

DROP TABLE IF EXISTS `weight_history`;

CREATE TABLE `weight_history` (
  `id` int(128) unsigned NOT NULL AUTO_INCREMENT,
  `address` varchar(64) DEFAULT NULL,
  `timestamp` int(32) DEFAULT NULL,
  `weight` varchar(64) DEFAULT NULL,
  `token` enum('222b099fe58d01b2eac666177dd06d9b0003b25c','b406040d9e1a9bbb19fcc803a7a808b038ae45ce') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

/*Data for the table `weight_history` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
