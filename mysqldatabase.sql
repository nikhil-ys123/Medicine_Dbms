-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: medicine_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `medicine`
--

DROP TABLE IF EXISTS `medicine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicine` (
  `med_id` int NOT NULL AUTO_INCREMENT,
  `med_name` varchar(50) NOT NULL,
  `quantity` int NOT NULL,
  `price_prpk` decimal(10,2) NOT NULL,
  PRIMARY KEY (`med_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicine`
--

LOCK TABLES `medicine` WRITE;
/*!40000 ALTER TABLE `medicine` DISABLE KEYS */;
INSERT INTO `medicine` VALUES (2,'Amoxicillin 250mg',450,45.50),(3,'Cetirizine 10mg',200,15.00),(4,'Dolo 650',150,30.00),(6,'Pregazeal 150mg',200,65.00),(7,'Diovaaal 40mg',700,350.00),(8,'Nexpro 20mg',550,220.00),(9,'Aerocort 40mg',450,120.00),(10,'Neulox 30mg',200,140.00),(11,'Fluvoxinn 50mg',350,120.00),(12,'Pantosec 40mg',300,240.00),(17,'Vitzee (120 mg)',150,25.00),(18,'Cough Syrup (100ml)',150,70.00);
/*!40000 ALTER TABLE `medicine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier` (
  `supp_id` int NOT NULL AUTO_INCREMENT,
  `supp_name` varchar(50) NOT NULL,
  `supp_add` varchar(100) NOT NULL,
  `supp_contact` varchar(15) NOT NULL,
  PRIMARY KEY (`supp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (1,'Alpha Pharma','Mumbai','9999000001'),(2,'Beta Distributors','Delhi','9999000002'),(3,'Gamma Suppliers','Pune','9999000003'),(6,'Medisupply','Sinhgad College','1233211233'),(7,'Medicon','Nagpur','9089786756'),(8,'Biogenix','kolkata','9889897654'),(11,'PharmaCorp','Mumbai','1233211234');
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_medicine`
--

DROP TABLE IF EXISTS `supplier_medicine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_medicine` (
  `supp_id` int NOT NULL,
  `med_id` int NOT NULL,
  PRIMARY KEY (`supp_id`,`med_id`),
  KEY `fk_sm_med` (`med_id`),
  CONSTRAINT `fk_sm_med` FOREIGN KEY (`med_id`) REFERENCES `medicine` (`med_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sm_supplier` FOREIGN KEY (`supp_id`) REFERENCES `supplier` (`supp_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_medicine`
--

LOCK TABLES `supplier_medicine` WRITE;
/*!40000 ALTER TABLE `supplier_medicine` DISABLE KEYS */;
INSERT INTO `supplier_medicine` VALUES (1,2),(8,3),(3,4),(2,6),(3,7),(11,8),(2,9),(7,10),(6,11),(1,12),(1,17),(1,18);
/*!40000 ALTER TABLE `supplier_medicine` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-08 11:17:34
