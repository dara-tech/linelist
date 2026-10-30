
/*
SQLyog Community v13.1.7 (64 bit)
MySQL - 8.0.46-0ubuntu0.24.04.4 : Database - main_dbs
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`main_dbs` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `main_dbs`;

/*Table structure for table `art_indicator_counts_dirty` */

DROP TABLE IF EXISTS `art_indicator_counts_dirty`;

CREATE TABLE `art_indicator_counts_dirty` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `dirty_key` varchar(64) NOT NULL,
  `reason` varchar(128) DEFAULT NULL,
  `dirty_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `locked_at` timestamp NULL DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `attempts` int unsigned NOT NULL DEFAULT '0',
  `last_error` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),

  
  UNIQUE KEY `art_indicator_dirty_key` (`dirty_key`),
  KEY `art_indicator_dirty_queue_idx` (`processed_at`,`locked_at`,`dirty_at`)
) ENGINE=InnoDB AUTO_INCREMENT=112140282 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `art_sync_logs` */

DROP TABLE IF EXISTS `art_sync_logs`;

CREATE TABLE `art_sync_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `site_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `table_name` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sync_status` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `error_message` text COLLATE utf8mb4_unicode_ci,
  `total_tables` int unsigned DEFAULT NULL,
  `viewed_status` tinyint DEFAULT '1',
  `viewed_by_user_id` int DEFAULT NULL,
  `viewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14878 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `blacklisted_tokens` */

DROP TABLE IF EXISTS `blacklisted_tokens`;

CREATE TABLE `blacklisted_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=327 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `cache` */

DROP TABLE IF EXISTS `cache`;

CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Table structure for table `cache_locks` */

DROP TABLE IF EXISTS `cache_locks`;

CREATE TABLE `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Table structure for table `code_tables` */

DROP TABLE IF EXISTS `code_tables`;

CREATE TABLE `code_tables` (
  `code_id` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `code_desc` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `code_status` tinyint DEFAULT '1',
  `table_ref` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Table structure for table `counselor_dhis2_optionsets` */

DROP TABLE IF EXISTS `counselor_dhis2_optionsets`;

CREATE TABLE `counselor_dhis2_optionsets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code_name` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `first_name` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `last_name` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `sex` int DEFAULT NULL,
  `phone` char(12) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `status_id` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `created_by_user_id` int DEFAULT NULL,
  `updated_by_user_id` int DEFAULT NULL,
  `pin_code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `site_code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Table structure for table `counselors` */

DROP TABLE IF EXISTS `counselors`;

CREATE TABLE `counselors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sex` int DEFAULT NULL,
  `phone` char(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_id` tinyint DEFAULT '1',
  `last_log_pin` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `created_by_user_id` int DEFAULT NULL,
  `updated_by_user_id` int DEFAULT NULL,
  `pin_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `site_code` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=345 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `cqi_scheduler_config` */

DROP TABLE IF EXISTS `cqi_scheduler_config`;

CREATE TABLE `cqi_scheduler_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_type` enum('data_update','validation','cleanup','report') COLLATE utf8mb4_unicode_ci NOT NULL,
  `cron_expression` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `site_id` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parameters` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_run` timestamp NULL DEFAULT NULL,
  `last_status` enum('success','error','running') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_error` text COLLATE utf8mb4_unicode_ci,
  `run_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `job_name` (`job_name`),
  KEY `idx_job_type` (`job_type`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_last_run` (`last_run`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `dashboards` */

DROP TABLE IF EXISTS `dashboards`;

CREATE TABLE `dashboards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(99) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `view` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `controller` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `badge_count` smallint NOT NULL DEFAULT '0',
  `is_favorite` tinyint(1) DEFAULT '0',
  `ordering` tinyint DEFAULT '0',
  `uid` char(11) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (concat(char((floor((rand() * 26)) + 65)),char((floor((rand() * 26)) + 97)),floor((rand() * 10)),char((floor((rand() * 26)) + 97)),char((floor((rand() * 26)) + 65)),char((floor((rand() * 26)) + 97)),floor((rand() * 10)),char((floor((rand() * 26)) + 97)))),
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `drug_line_list` */

DROP TABLE IF EXISTS `drug_line_list`;

CREATE TABLE `drug_line_list` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `report_year` smallint unsigned NOT NULL,
  `section_key` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `section_title` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `patient_type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clinic_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mvid` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `site_code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `drug_name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `drug_source` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `drug_status` tinyint unsigned DEFAULT NULL,
  `visit_date` date DEFAULT NULL,
  `next_appointment_date` date DEFAULT NULL,
  `generated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `drug_line_list_year_site_idx` (`report_year`,`site_code`),
  KEY `drug_line_list_year_section_idx` (`report_year`,`section_key`),
  KEY `drug_line_list_year_mvid_idx` (`report_year`,`mvid`)
) ENGINE=InnoDB AUTO_INCREMENT=2090723 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `failed_jobs` */

DROP TABLE IF EXISTS `failed_jobs`;

CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Table structure for table `imports` */

DROP TABLE IF EXISTS `imports`;

CREATE TABLE `imports` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `directory` char(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `filename` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `note` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `last_initial` date DEFAULT NULL,
  `last_visited` date DEFAULT NULL,
  `tables_count` smallint DEFAULT '0',
  `import_type_id` smallint DEFAULT '0',
  `site_code` char(6) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by_user_id` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=236 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Table structure for table `indicator_status` */

DROP TABLE IF EXISTS `indicator_status`;

CREATE TABLE `indicator_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `indicator_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `indicator_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `indicator_id` (`indicator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `ip_addresses` */

DROP TABLE IF EXISTS `ip_addresses`;

CREATE TABLE `ip_addresses` (
  `ip` char(15) NOT NULL,
  `country` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `region_code` char(10) DEFAULT NULL,
  `region_name` varchar(50) DEFAULT NULL,
  `isp` varchar(50) DEFAULT NULL,
  `org` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ip`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `job_batches` */

DROP TABLE IF EXISTS `job_batches`;

CREATE TABLE `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Table structure for table `jobs` */

DROP TABLE IF EXISTS `jobs`;

CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Table structure for table `laravel_migrations` */

DROP TABLE IF EXISTS `laravel_migrations`;

CREATE TABLE `laravel_migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Table structure for table `main_deletes` */

DROP TABLE IF EXISTS `main_deletes`;

CREATE TABLE `main_deletes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `table_name` varchar(90) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `site_code` char(6) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `delete_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by_user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `migrations` */

DROP TABLE IF EXISTS `migrations`;

CREATE TABLE `migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `occupations` */

DROP TABLE IF EXISTS `occupations`;

CREATE TABLE `occupations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `occupation` varchar(45) NOT NULL,
  `status_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ocid_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `parity_ref_caches` */

DROP TABLE IF EXISTS `parity_ref_caches`;

CREATE TABLE `parity_ref_caches` (
  `cache_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`cache_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `password_reset_tokens` */

DROP TABLE IF EXISTS `password_reset_tokens`;

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Table structure for table `roles` */

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_name` varchar(90) NOT NULL,
  `role_desc` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `sessions` */

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Table structure for table `tblaart` */

DROP TABLE IF EXISTS `tblaart`;

CREATE TABLE `tblaart` (
  `site_code` char(4) NOT NULL,
  `ClinicID` int NOT NULL COMMENT 'Store ID Patient',
  `ART` char(10) NOT NULL COMMENT 'ART Number Paient',
  `DaArt` date NOT NULL COMMENT 'Date Start ART Patient',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`site_code`,`ClinicID`),
  KEY `idx_tblaart_clinicid_daart` (`ClinicID`,`DaArt`),
  KEY `idx_tblaart_daart_clinicid` (`DaArt`,`ClinicID`),
  KEY `idx_tblaart_site_daart_clinic` (`site_code`,`DaArt`,`ClinicID`),
  KEY `idx_tblaart_site_clinicid` (`site_code`,`ClinicID`),
  KEY `idx_tblaart_clinic_daart_art` (`ClinicID`,`DaArt`,`ART`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblaccess` */

DROP TABLE IF EXISTS `tblaccess`;

CREATE TABLE `tblaccess` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `Uid` int NOT NULL,
  `Type` int NOT NULL,
  `Dat` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblaiallergy` */

DROP TABLE IF EXISTS `tblaiallergy`;

CREATE TABLE `tblaiallergy` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `ClinicID` int NOT NULL COMMENT 'Store PreART ID patient',
  `DrugName` char(15) NOT NULL COMMENT 'Drug Name ',
  `Allergy` char(25) NOT NULL COMMENT 'Allergy',
  `Da` date NOT NULL COMMENT 'Date Allergy',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `tblaiarvtreathis` */

DROP TABLE IF EXISTS `tblaiarvtreathis`;

CREATE TABLE `tblaiarvtreathis` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `ClinicID` int NOT NULL,
  `DrugName` char(15) NOT NULL,
  `Clinic` char(20) NOT NULL,
  `DaStart` date NOT NULL,
  `DaStop` date NOT NULL,
  `Note` char(40) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblaimain` */

DROP TABLE IF EXISTS `tblaimain`;

CREATE TABLE `tblaimain` (
  `site_code` char(4) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ClinicID` int NOT NULL,
  `DafirstVisit` date NOT NULL,
  `TypeofReturn` int DEFAULT NULL,
  `LClinicID` char(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `SiteNameold` char(4) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `DaBirth` date NOT NULL,
  `Sex` int NOT NULL,
  `Education` int NOT NULL,
  `Rea` int NOT NULL,
  `Write` int NOT NULL,
  `Referred` int NOT NULL,
  `Orefferred` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `DaHIV` date NOT NULL,
  `Vcctcode` char(9) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `VcctID` char(9) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `PclinicID` char(7) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `OffIn` int NOT NULL,
  `SiteName` char(4) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `DaART` date NOT NULL,
  `Artnum` char(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `TbPast` int NOT NULL,
  `TPT` int NOT NULL,
  `TPTdrug` int NOT NULL,
  `DaStartTPT` date DEFAULT NULL,
  `DaEndTPT` date DEFAULT NULL,
  `TypeTB` int NOT NULL,
  `ResultTB` int NOT NULL,
  `Daonset` date NOT NULL,
  `Tbtreat` int NOT NULL,
  `Datreat` date NOT NULL,
  `ResultTreat` int NOT NULL,
  `DaResultTreat` date NOT NULL,
  `ARVTreatHis` int NOT NULL,
  `Diabete` char(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Hyper` char(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Abnormal` char(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Renal` char(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Anemia` char(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Liver` char(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `HepBC` char(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `MedOther` char(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Allergy` int NOT NULL,
  `Nationality` int DEFAULT NULL,
  `Targroup` int DEFAULT NULL,
  `Refugstatus` int DEFAULT NULL,
  `RefugART` char(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Refugsite` char(4) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`site_code`,`ClinicID`),
  KEY `tblaimain_clinic_site_idx` (`ClinicID`,`site_code`),
  KEY `idx_aimain_site_clinic` (`site_code`,`ClinicID`),
  KEY `idx_aimain_sex_site_clinic` (`Sex`,`site_code`,`ClinicID`),
  KEY `idx_aimain_site_sex_clinic` (`site_code`,`Sex`,`ClinicID`),
  KEY `idx_aimain_dabirth_sex_site_clinic` (`DaBirth`,`Sex`,`site_code`,`ClinicID`),
  KEY `idx_aimain_site_dabirth_sex_clinic` (`site_code`,`DaBirth`,`Sex`,`ClinicID`),
  KEY `idx_aimain_sex_dabirth_site_clinic` (`Sex`,`DaBirth`,`site_code`,`ClinicID`),
  KEY `idx_tblaimain_site_clinic_sex_dob` (`site_code`,`ClinicID`,`Sex`,`DaBirth`),
  KEY `idx_tblaimain_site_clinicid` (`site_code`,`ClinicID`),
  KEY `idx_tblaimain_dafirstvisit_clinicid` (`DafirstVisit`,`ClinicID`),
  KEY `idx_tblaimain_site_first_clinic` (`site_code`,`DafirstVisit`,`ClinicID`),
  KEY `idx_tblaimain_site_synced_first_clinic` (`site_code`,`synced_at`,`DafirstVisit`,`ClinicID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Table structure for table `tblaiothmedabnormal` */

DROP TABLE IF EXISTS `tblaiothmedabnormal`;

CREATE TABLE `tblaiothmedabnormal` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `ClinicID` int NOT NULL,
  `DrugName` char(10) NOT NULL,
  `Clinic` char(20) NOT NULL,
  `DaStart` date NOT NULL,
  `Dastop` date NOT NULL,
  `Note` char(40) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblaiothmedanemia` */

DROP TABLE IF EXISTS `tblaiothmedanemia`;

CREATE TABLE `tblaiothmedanemia` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `ClinicID` int NOT NULL,
  `DrugName` char(10) NOT NULL,
  `Clinic` char(20) NOT NULL,
  `DaStart` date NOT NULL,
  `Dastop` date NOT NULL,
  `Note` char(40) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblaiothmeddiabete` */

DROP TABLE IF EXISTS `tblaiothmeddiabete`;

CREATE TABLE `tblaiothmeddiabete` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `ClinicID` int NOT NULL,
  `DrugName` char(10) NOT NULL,
  `Clinic` char(20) NOT NULL,
  `DaStart` date NOT NULL,
  `Dastop` date NOT NULL,
  `Note` char(40) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblaiothmedhepbc` */

DROP TABLE IF EXISTS `tblaiothmedhepbc`;

CREATE TABLE `tblaiothmedhepbc` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `ClinicID` int NOT NULL,
  `DrugName` char(10) NOT NULL,
  `Clinic` char(20) NOT NULL,
  `DaStart` date NOT NULL,
  `Dastop` date NOT NULL,
  `Note` char(40) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblaiothmedhyper` */

DROP TABLE IF EXISTS `tblaiothmedhyper`;

CREATE TABLE `tblaiothmedhyper` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `ClinicID` int NOT NULL,
  `DrugName` char(10) NOT NULL,
  `Clinic` char(20) NOT NULL,
  `DaStart` date NOT NULL,
  `Dastop` date NOT NULL,
  `Note` char(40) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblaiothmedliver` */

DROP TABLE IF EXISTS `tblaiothmedliver`;

CREATE TABLE `tblaiothmedliver` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `ClinicID` int NOT NULL,
  `DrugName` char(10) NOT NULL,
  `Clinic` char(20) NOT NULL,
  `DaStart` date NOT NULL,
  `Dastop` date NOT NULL,
  `Note` char(40) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblaiothmedother` */

DROP TABLE IF EXISTS `tblaiothmedother`;

CREATE TABLE `tblaiothmedother` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `ClinicID` int NOT NULL,
  `DrugName` char(10) NOT NULL,
  `Clinic` char(20) NOT NULL,
  `DaStart` date NOT NULL,
  `Dastop` date NOT NULL,
  `Note` char(40) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblaiothmedrenal` */

DROP TABLE IF EXISTS `tblaiothmedrenal`;

CREATE TABLE `tblaiothmedrenal` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `ClinicID` int NOT NULL,
  `DrugName` char(10) NOT NULL,
  `Clinic` char(20) NOT NULL,
  `DaStart` date NOT NULL,
  `Dastop` date NOT NULL,
  `Note` char(40) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblalink` */

DROP TABLE IF EXISTS `tblalink`;

CREATE TABLE `tblalink` (
  `site_code` char(4) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ClinicID` int NOT NULL,
  `Codes` varchar(20) COLLATE utf8mb3_unicode_ci NOT NULL,
  `Typecode` char(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ARTIss` int NOT NULL,
  `DaExpiry` date NOT NULL,
  `Dacreate` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ClinicID`,`Codes`,`Typecode`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Table structure for table `tblallergy` */

DROP TABLE IF EXISTS `tblallergy`;

CREATE TABLE `tblallergy` (
  `Aid` int NOT NULL AUTO_INCREMENT,
  `AllergyStatus` varchar(30) DEFAULT NULL,
  `Type` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Aid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblapntt` */

DROP TABLE IF EXISTS `tblapntt`;

CREATE TABLE `tblapntt` (
  `site_code` char(4) NOT NULL,
  `ClinicID` int NOT NULL,
  `DaVisit` date NOT NULL,
  `SexHIV` int NOT NULL,
  `Wsex` int NOT NULL,
  `SexM` int NOT NULL,
  `SexTran` int NOT NULL,
  `Sex4` int NOT NULL,
  `Drug` int NOT NULL,
  `Pill` int NOT NULL,
  `SexMoney` int NOT NULL,
  `SexProvice` int NOT NULL,
  `WOut` int NOT NULL,
  `Agree` int NOT NULL,
  `AsID` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`site_code`,`AsID`),
  KEY `idx_tblapntt_site_synced_visit_asid` (`site_code`,`synced_at`,`DaVisit`,`AsID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblapnttchild` */

DROP TABLE IF EXISTS `tblapnttchild`;

CREATE TABLE `tblapnttchild` (
  `site_code` char(4) NOT NULL,
  `APID` double NOT NULL,
  `NumChild` int NOT NULL,
  `Age` int NOT NULL,
  `Sex` int NOT NULL,
  `Grou` char(10) NOT NULL,
  `House` varchar(20) NOT NULL,
  `Street` varchar(20) NOT NULL,
  `Village` varchar(70) NOT NULL,
  `Commune` varchar(70) NOT NULL,
  `District` char(30) NOT NULL,
  `Province` char(30) NOT NULL,
  `Phone` char(12) NOT NULL,
  `PlanChild` int DEFAULT NULL,
  `PatientDate` date NOT NULL,
  `SeviceDate` date NOT NULL,
  `StatusHIV` int DEFAULT NULL,
  `Result` int NOT NULL,
  `RegTreat` int DEFAULT NULL,
  `ClinicID` char(7) NOT NULL,
  `ArtNumber` char(10) NOT NULL,
  `Other` char(30) NOT NULL,
  `CAPID` double NOT NULL,
  `AsID` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`CAPID`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblapnttchildcont` */

DROP TABLE IF EXISTS `tblapnttchildcont`;

CREATE TABLE `tblapnttchildcont` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `Dat` date NOT NULL,
  `TypeContact` int NOT NULL,
  `Contact` int NOT NULL,
  `Confirm` char(30) NOT NULL,
  `CAPID` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblapnttpart` */

DROP TABLE IF EXISTS `tblapnttpart`;

CREATE TABLE `tblapnttpart` (
  `site_code` char(4) NOT NULL,
  `AsID` double NOT NULL,
  `NumSexPart` char(2) DEFAULT NULL,
  `NumPin` char(2) DEFAULT NULL,
  `NumChildren` char(2) DEFAULT NULL,
  `NumPart` int NOT NULL,
  `Age` int NOT NULL,
  `Sex` int NOT NULL,
  `Grou` char(10) NOT NULL,
  `House` varchar(20) NOT NULL,
  `Street` varchar(20) NOT NULL,
  `Village` varchar(60) NOT NULL,
  `Commune` varchar(50) NOT NULL,
  `District` char(30) NOT NULL,
  `Province` char(30) NOT NULL,
  `Phone` char(12) NOT NULL,
  `RePatient` int NOT NULL,
  `OtherPatient` char(30) NOT NULL,
  `IpvHit` int NOT NULL,
  `IpvThreat` int NOT NULL,
  `IpvSex` int NOT NULL,
  `ProIPV` int DEFAULT NULL,
  `SupIPV` int DEFAULT NULL,
  `RefIPV` int DEFAULT NULL,
  `NotificationIPV` int DEFAULT NULL,
  `PatientDate` date NOT NULL,
  `SeviceDate` date NOT NULL,
  `StatusHIV` int DEFAULT NULL,
  `HTS` int NOT NULL,
  `Result` int NOT NULL,
  `RegTreat` int DEFAULT NULL,
  `ClinicID` int NOT NULL,
  `ArtNumber` char(10) NOT NULL,
  `Other` char(30) NOT NULL,
  `APID` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`APID`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblapnttpartcont` */

DROP TABLE IF EXISTS `tblapnttpartcont`;

CREATE TABLE `tblapnttpartcont` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `Dat` date NOT NULL,
  `TypeContact` int NOT NULL,
  `Contact` int NOT NULL,
  `Confirm` char(30) NOT NULL,
  `APID` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblappointment` */

DROP TABLE IF EXISTS `tblappointment`;

CREATE TABLE `tblappointment` (
  `site_code` char(4) NOT NULL,
  `Vid` varchar(17) NOT NULL,
  `Doctore` int NOT NULL,
  `Time` int NOT NULL,
  `Att` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Vid`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblartsite` */

DROP TABLE IF EXISTS `tblartsite`;

CREATE TABLE `tblartsite` (
  `Sid` varchar(4) NOT NULL,
  `SiteName` varchar(40) NOT NULL,
  `Status` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblaumain` */

DROP TABLE IF EXISTS `tblaumain`;

CREATE TABLE `tblaumain` (
  `site_code` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ClinicID` int NOT NULL,
  `Daupdate` date NOT NULL,
  `Marital` int NOT NULL,
  `Occupation` char(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `HIVshow` int DEFAULT NULL,
  `Relative` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Family` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Community` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Grou` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `House` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Street` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Village` varchar(70) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Commune` varchar(70) COLLATE utf8mb4_unicode_ci NOT NULL,
  `District` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Province` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Phone` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `AddCont1` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Phone1` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `AddCont2` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Phone2` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NGO` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `NameNGO` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `AUID` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`site_code`,`AUID`),
  KEY `idx_tblaumain_site_synced_update_auid` (`site_code`,`synced_at`,`Daupdate`,`AUID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tblavarvdrug` */

DROP TABLE IF EXISTS `tblavarvdrug`;

CREATE TABLE `tblavarvdrug` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `DrugName` char(16) NOT NULL,
  `Dose` char(20) NOT NULL,
  `Quantity` int NOT NULL,
  `Freq` char(5) NOT NULL,
  `Form` char(15) NOT NULL,
  `Status` int NOT NULL,
  `Da` date NOT NULL,
  `Reason` char(40) NOT NULL,
  `Remark` char(6) NOT NULL,
  `Vid` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`),
  KEY `idx_tblavarvdrug_vid_status` (`Vid`,`Status`),
  KEY `idx_tblavarvdrug_site_vid_status_drug` (`site_code`,`Vid`,`Status`,`DrugName`),
  KEY `idx_tblavarvdrug_vid_status_drug` (`Vid`,`Status`,`DrugName`),
  KEY `idx_art_avarvdrug_vid_site_status_drug` (`Vid`,`site_code`,`Status`,`DrugName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `tblavhydrug` */

DROP TABLE IF EXISTS `tblavhydrug`;

CREATE TABLE `tblavhydrug` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `DrugName` char(16) NOT NULL,
  `Dose` char(20) NOT NULL,
  `Quantity` int NOT NULL,
  `Freq` char(5) NOT NULL,
  `Form` char(15) NOT NULL,
  `Status` int NOT NULL,
  `Da` date NOT NULL,
  `Reason` char(40) NOT NULL,
  `Remark` char(6) NOT NULL,
  `Vid` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`),
  KEY `idx_tblavhydrug_vid_status_drug` (`Vid`,`Status`,`DrugName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `tblavmain` */

DROP TABLE IF EXISTS `tblavmain`;

CREATE TABLE `tblavmain` (
  `site_code` char(4) CHARACTER SET utf8mb3 NOT NULL,
  `ClinicID` int NOT NULL,
  `ARTnum` char(10) CHARACTER SET utf8mb3 NOT NULL,
  `DatVisit` date NOT NULL,
  `TypeVisit` int NOT NULL,
  `Womenstatus` int NOT NULL,
  `PregStatus` int NOT NULL,
  `DaPreg` date NOT NULL,
  `ANCservice` int DEFAULT NULL,
  `Weight` float NOT NULL,
  `Height` float NOT NULL,
  `Temp` float NOT NULL,
  `Pulse` int NOT NULL,
  `Resp` int NOT NULL,
  `Blood` char(7) CHARACTER SET utf8mb3 NOT NULL,
  `STIPreven` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `ARTAdher` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `Birthspac` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `TBinfect` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `Partner` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `Condoms` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `CMTypeClient` int NOT NULL,
  `CMDaUse` date NOT NULL,
  `CMCondom` char(3) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `CoC` char(2) CHARACTER SET utf8mb3 NOT NULL,
  `Poc` char(2) CHARACTER SET utf8mb3 NOT NULL,
  `CMVaccine` char(2) CHARACTER SET utf8mb3 NOT NULL,
  `UseOther` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `OCMcondom` char(3) COLLATE utf8mb4_general_ci NOT NULL,
  `OCoc` char(2) CHARACTER SET utf8mb3 NOT NULL,
  `OPoC` char(2) CHARACTER SET utf8mb3 NOT NULL,
  `OCMVaccin` char(2) CHARACTER SET utf8mb3 NOT NULL,
  `OCMother` char(3) COLLATE utf8mb4_general_ci NOT NULL,
  `Cough` int NOT NULL,
  `Fever` int NOT NULL,
  `Wlost` int NOT NULL,
  `Drenching` int NOT NULL,
  `Urine` int NOT NULL,
  `Genital` int NOT NULL,
  `Chemnah` int NOT NULL,
  `Hospital` int NOT NULL,
  `NumDay` char(3) CHARACTER SET utf8mb3 NOT NULL,
  `CauseHospital` char(30) CHARACTER SET utf8mb3 NOT NULL,
  `MissARV` int NOT NULL,
  `MissTime` char(3) CHARACTER SET utf8mb3 NOT NULL,
  `WHO` int NOT NULL,
  `Eligible` int NOT NULL,
  `TestID` char(15) CHARACTER SET utf8mb3 NOT NULL,
  `Function` int NOT NULL,
  `TB` int NOT NULL,
  `TypeTB` int NOT NULL,
  `TBtreat` int NOT NULL,
  `DaTBtreat` date NOT NULL,
  `TestHIV` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `ResultHIV` int NOT NULL,
  `ReCD4` int NOT NULL,
  `ReVL` int NOT NULL,
  `ReHCV` int NOT NULL,
  `CrAG` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `CrAGResult` int NOT NULL,
  `VLDetectable` int NOT NULL,
  `Referred` int NOT NULL,
  `OReferred` char(30) CHARACTER SET utf8mb3 NOT NULL,
  `Moderate` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `Renal` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `Rash` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `Hepatitis` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `Peripheral` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `Neutropenia` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `Hyperlipidemia` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `Lactic` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `Hypersensitivity` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `Jaundice` char(6) CHARACTER SET utf8mb3 NOT NULL,
  `MTother` char(30) CHARACTER SET utf8mb3 NOT NULL,
  `ARVreg` int DEFAULT NULL,
  `ResultHC` int NOT NULL,
  `TPTout` int DEFAULT NULL,
  `TBout` int DEFAULT NULL,
  `DaApp` date NOT NULL,
  `Vid` double NOT NULL,
  `Foworker` int NOT NULL,
  `Country` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`site_code`,`Vid`),
  KEY `idx_avmain_site_datvisit` (`site_code`,`DatVisit` DESC,`Vid`,`ClinicID`),
  KEY `idx_avmain_site_clinic_datvisit_vid` (`site_code`,`ClinicID`,`DatVisit` DESC,`Vid`),
  KEY `idx_avmain_site_datvisit_vid` (`site_code`,`DatVisit` DESC,`Vid`),
  KEY `idx_avmain_site_typevisit_datvisit_vid` (`site_code`,`TypeVisit`,`DatVisit` DESC,`Vid`),
  KEY `idx_avmain_typevisit_site_datvisit_vid` (`TypeVisit`,`site_code`,`DatVisit` DESC,`Vid`),
  KEY `idx_avmain_site_clinic_typevisit_datvisit_vid` (`site_code`,`ClinicID`,`TypeVisit`,`DatVisit` DESC,`Vid`),
  KEY `idx_perf_art_avmain_site_clinic_datvisit` (`site_code`,`ClinicID`,`DatVisit`),
  KEY `idx_tblavmain_site_updated` (`site_code`,`updated_at`),
  KEY `idx_tblavmain_site_vid` (`site_code`,`Vid`),
  KEY `idx_tblavmain_site_datvisit` (`site_code`,`DatVisit`),
  KEY `idx_tblavmain_site_clinicid` (`site_code`,`ClinicID`),
  KEY `idx_tblavmain_clinicid_datvisit` (`ClinicID`,`DatVisit`),
  KEY `idx_tblavmain_vid_datvisit_clinicid` (`Vid`,`DatVisit`,`ClinicID`),
  KEY `idx_tblavmain_datvisit_clinicid_vid` (`DatVisit`,`ClinicID`,`Vid`),
  KEY `idx_tblavmain_site_datvisit_clinic` (`site_code`,`DatVisit`,`ClinicID`),
  KEY `idx_tblavmain_site_synced_datvisit_vid` (`site_code`,`synced_at`,`DatVisit`,`Vid`),
  KEY `idx_tblavmain_clinic_visit_app_vid` (`ClinicID`,`DatVisit`,`DaApp`,`Vid`),
  KEY `idx_tblavmain_clinic_testhiv_visit` (`ClinicID`,`TestHIV`,`DatVisit`),
  KEY `idx_art_avmain_site_clinic_visit_app_vid` (`site_code`,`ClinicID`,`DatVisit`,`DaApp`,`Vid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Table structure for table `tblavoidrug` */

DROP TABLE IF EXISTS `tblavoidrug`;

CREATE TABLE `tblavoidrug` (
  `site_code` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id` int NOT NULL,
  `DrugName` char(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Dose` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Quantity` int NOT NULL,
  `Freq` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Form` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Status` int NOT NULL,
  `Da` date NOT NULL,
  `Reason` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Remark` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Vid` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`),
  KEY `idx_tblavoidrug_vid_status_drug` (`Vid`,`Status`,`DrugName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tblavpatientstatus` */

DROP TABLE IF EXISTS `tblavpatientstatus`;

CREATE TABLE `tblavpatientstatus` (
  `site_code` char(4) NOT NULL,
  `ClinicID` int NOT NULL,
  `Status` int NOT NULL,
  `Place` int NOT NULL,
  `OPlace` varchar(50) NOT NULL,
  `Da` date NOT NULL,
  `Cause` char(50) NOT NULL,
  `Vid` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`site_code`,`ClinicID`,`Status`),
  KEY `idx_patientstatus_site_vid` (`site_code`,`Vid`),
  KEY `idx_patientstatus_status_site_vid` (`Status`,`site_code`,`Vid`),
  KEY `idx_patientstatus_site_status_vid` (`site_code`,`Status`,`Vid`),
  KEY `idx_tblavpatientstatus_site_vid_status` (`site_code`,`Vid`,`Status`),
  KEY `idx_tblavpatientstatus_site_vid` (`site_code`,`Vid`),
  KEY `idx_tblavpatientstatus_site_status` (`site_code`,`Status`),
  KEY `idx_tblavpatientstatus_clinicid_da_status` (`ClinicID`,`Da`,`Status`),
  KEY `idx_tblavpatientstatus_da_clinicid_status` (`Da`,`ClinicID`,`Status`),
  KEY `idx_tblavpatientstatus_site_da_clinic_status` (`site_code`,`Da`,`ClinicID`,`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblavtbdrug` */

DROP TABLE IF EXISTS `tblavtbdrug`;

CREATE TABLE `tblavtbdrug` (
  `site_code` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id` int NOT NULL,
  `DrugName` char(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Dose` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Quantity` int NOT NULL,
  `Freq` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Form` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Status` int NOT NULL,
  `Da` date NOT NULL,
  `Reason` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Remark` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Vid` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`),
  KEY `idx_tblavtbdrug_vid_status_drug` (`Vid`,`Status`,`DrugName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tblavtptdrug` */

DROP TABLE IF EXISTS `tblavtptdrug`;

CREATE TABLE `tblavtptdrug` (
  `site_code` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id` int NOT NULL,
  `DrugName` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Dose` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Quantity` int NOT NULL,
  `Freq` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Form` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Status` int NOT NULL,
  `Da` date NOT NULL,
  `Reason` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Remark` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Vid` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`),
  KEY `idx_tblavtptdrug_vid_status_drug` (`Vid`,`Status`,`DrugName`),
  KEY `idx_tblavtptdrug_vid_status_da_drug` (`Vid`,`Status`,`Da`,`DrugName`),
  KEY `idx_art_avtptdrug_status_da_vid_drug` (`Status`,`Da`,`Vid`,`DrugName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tblbackupetest` */

DROP TABLE IF EXISTS `tblbackupetest`;

CREATE TABLE `tblbackupetest` (
  `ClinicID` char(9) NOT NULL,
  `PCR` char(6) NOT NULL,
  `ConfirmPCR` char(6) NOT NULL,
  `OI` char(6) NOT NULL,
  `TestConfirm` char(6) NOT NULL,
  `DaBlood` date NOT NULL,
  `LabID` char(10) NOT NULL,
  `DaReceive` date NOT NULL,
  `DaAnalys` date NOT NULL,
  `Result` int NOT NULL,
  `DaRresult` date NOT NULL,
  `DBS` char(6) NOT NULL,
  `Technic` char(6) NOT NULL,
  `ResultIn` char(6) NOT NULL,
  `Other` char(30) NOT NULL,
  `TID` char(17) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblcart` */

DROP TABLE IF EXISTS `tblcart`;

CREATE TABLE `tblcart` (
  `site_code` char(4) NOT NULL,
  `ClinicID` char(7) NOT NULL,
  `ART` char(11) NOT NULL,
  `DaArt` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`site_code`,`ClinicID`),
  KEY `idx_tblcart_clinicid_daart` (`ClinicID`,`DaArt`),
  KEY `idx_tblcart_daart_clinicid` (`DaArt`,`ClinicID`),
  KEY `idx_tblcart_site_daart_clinic` (`site_code`,`DaArt`,`ClinicID`),
  KEY `idx_tblcart_site_clinicid` (`site_code`,`ClinicID`),
  KEY `idx_tblcart_clinic_daart_art` (`ClinicID`,`DaArt`,`ART`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblcausedeath` */

DROP TABLE IF EXISTS `tblcausedeath`;

CREATE TABLE `tblcausedeath` (
  `ID` int NOT NULL,
  `Ctype` int NOT NULL,
  `Cause` varchar(65) NOT NULL,
  `Status` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblciallergy` */

DROP TABLE IF EXISTS `tblciallergy`;

CREATE TABLE `tblciallergy` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `ClinicID` char(7) NOT NULL,
  `DrugName` char(5) NOT NULL,
  `Allergy` char(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblcicotrim` */

DROP TABLE IF EXISTS `tblcicotrim`;

CREATE TABLE `tblcicotrim` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `ClinicID` char(10) NOT NULL,
  `ClinicName` char(20) NOT NULL,
  `StartDate` date NOT NULL,
  `StopDate` date NOT NULL,
  `ReasonStop` char(30) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblcifamily` */

DROP TABLE IF EXISTS `tblcifamily`;

CREATE TABLE `tblcifamily` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `ClinicID` char(7) NOT NULL,
  `Faminily` int NOT NULL,
  `Age` int NOT NULL,
  `HIVstatus` int NOT NULL,
  `Status` int NOT NULL,
  `StartARV` int NOT NULL,
  `Pregnant` int NOT NULL,
  `SiteName` char(4) NOT NULL,
  `HTB` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblcifluconazole` */

DROP TABLE IF EXISTS `tblcifluconazole`;

CREATE TABLE `tblcifluconazole` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `ClinicID` char(10) NOT NULL,
  `ClinicName` char(20) NOT NULL,
  `StartDate` date NOT NULL,
  `StopDate` date NOT NULL,
  `ReasonStop` char(30) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblcimain` */

DROP TABLE IF EXISTS `tblcimain`;

CREATE TABLE `tblcimain` (
  `site_code` char(4) NOT NULL,
  `ClinicID` char(7) NOT NULL,
  `DaFirstVisit` date NOT NULL,
  `LClinicID` char(7) NOT NULL,
  `DaBirth` date NOT NULL,
  `Sex` int NOT NULL,
  `Referred` int NOT NULL,
  `Oreferred` varchar(50) NOT NULL,
  `EClinicID` char(9) NOT NULL,
  `DaTest` date NOT NULL,
  `TypeTest` int NOT NULL,
  `Vcctcode` char(6) NOT NULL,
  `VcctID` char(9) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `OffIn` int NOT NULL,
  `SiteName` char(4) NOT NULL,
  `DaART` date NOT NULL,
  `Artnum` char(10) NOT NULL,
  `Feeding` int NOT NULL,
  `TbPast` int NOT NULL,
  `TypeTB` int NOT NULL,
  `ResultTB` int NOT NULL,
  `Daonset` date NOT NULL,
  `Tbtreat` int NOT NULL,
  `Datreat` date NOT NULL,
  `ResultTreat` int NOT NULL,
  `DaResultTreat` date NOT NULL,
  `Inh` int NOT NULL,
  `TPTdrug` int NOT NULL,
  `DaStartTPT` date DEFAULT NULL,
  `DaEndTPT` date DEFAULT NULL,
  `OtherPast` int NOT NULL,
  `Cotrim` int NOT NULL,
  `Fluco` int NOT NULL,
  `Allergy` int NOT NULL,
  `ClinicIDold` char(7) DEFAULT NULL,
  `SiteNameOld` char(4) DEFAULT NULL,
  `Nationality` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`site_code`,`ClinicID`),
  KEY `idx_tblcimain_dafirstvisit_clinicid` (`DaFirstVisit`,`ClinicID`),
  KEY `idx_tblcimain_site_first_clinic` (`site_code`,`DaFirstVisit`,`ClinicID`),
  KEY `idx_tblcimain_site_clinicid` (`site_code`,`ClinicID`),
  KEY `idx_tblcimain_site_synced_first_clinic` (`site_code`,`synced_at`,`DaFirstVisit`,`ClinicID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblciothpast` */

DROP TABLE IF EXISTS `tblciothpast`;

CREATE TABLE `tblciothpast` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `ClinicID` char(7) NOT NULL,
  `DrugName` char(10) NOT NULL,
  `Clinic` char(25) NOT NULL,
  `DaStart` date NOT NULL,
  `DaStop` date NOT NULL,
  `Note` char(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblclinic` */

DROP TABLE IF EXISTS `tblclinic`;

CREATE TABLE `tblclinic` (
  `Cid` int NOT NULL AUTO_INCREMENT,
  `ClinicName` char(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Cid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblclink` */

DROP TABLE IF EXISTS `tblclink`;

CREATE TABLE `tblclink` (
  `site_code` char(4) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ClinicID` char(7) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Codes` varchar(20) COLLATE utf8mb3_unicode_ci NOT NULL,
  `Typecode` char(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ARTIss` int NOT NULL,
  `DaExpiry` date NOT NULL,
  `Dacreate` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ClinicID`,`Codes`,`Typecode`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Table structure for table `tblcommune` */

DROP TABLE IF EXISTS `tblcommune`;

CREATE TABLE `tblcommune` (
  `id` int NOT NULL,
  `commune_en` varchar(50) CHARACTER SET utf8mb3 NOT NULL,
  `commune_kh` varchar(50) CHARACTER SET utf8mb3 DEFAULT NULL,
  `district_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `_Cid` int DEFAULT NULL,
  `_Did` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Table structure for table `tblcumain` */

DROP TABLE IF EXISTS `tblcumain`;

CREATE TABLE `tblcumain` (
  `site_code` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ClinicID` char(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Daupdate` date NOT NULL,
  `AddGuardian` int NOT NULL,
  `Grou` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `House` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Street` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Village` varchar(70) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Commune` varchar(70) COLLATE utf8mb4_unicode_ci NOT NULL,
  `District` char(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Province` char(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `AddContact` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Phone` char(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ChildStatus` int NOT NULL,
  `Foccupation` int NOT NULL,
  `Moccupation` int NOT NULL,
  `Education` int NOT NULL,
  `ChildSupport` char(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Vaccine` int NOT NULL,
  `CUID` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`CUID`,`site_code`),
  KEY `idx_tblcumain_site_synced_update_cuid` (`site_code`,`synced_at`,`Daupdate`,`CUID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tblcvarvdrug` */

DROP TABLE IF EXISTS `tblcvarvdrug`;

CREATE TABLE `tblcvarvdrug` (
  `site_code` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id` int NOT NULL,
  `DrugName` char(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Dose` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Quantity` int NOT NULL,
  `Freq` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Form` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Status` int NOT NULL,
  `Da` date NOT NULL,
  `Reason` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Remark` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Vid` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`),
  KEY `idx_tblcvarvdrug_vid_status` (`Vid`,`Status`),
  KEY `idx_tblcvarvdrug_site_vid_status_drug` (`site_code`,`Vid`,`Status`,`DrugName`),
  KEY `idx_tblcvarvdrug_vid_status_drug` (`Vid`,`Status`,`DrugName`),
  KEY `idx_art_cvarvdrug_vid_site_status_drug` (`Vid`,`site_code`,`Status`,`DrugName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tblcvmain` */

DROP TABLE IF EXISTS `tblcvmain`;

CREATE TABLE `tblcvmain` (
  `site_code` char(4) NOT NULL,
  `ClinicID` char(7) NOT NULL,
  `ARTnum` char(10) NOT NULL,
  `DatVisit` date NOT NULL,
  `TypeVisit` int NOT NULL,
  `Temp` float NOT NULL,
  `Pulse` float NOT NULL,
  `Resp` float NOT NULL,
  `Blood` char(7) NOT NULL,
  `Weight` float NOT NULL,
  `Height` float NOT NULL,
  `Malnutrition` int NOT NULL,
  `WH` int NOT NULL,
  `PTB` int NOT NULL,
  `Wlost` int NOT NULL,
  `Cough` int NOT NULL,
  `Fever` int NOT NULL,
  `Enlarg` int NOT NULL,
  `Hospital` int NOT NULL,
  `NumDay` int NOT NULL,
  `CauseHospital` char(30) NOT NULL,
  `Miss1` int NOT NULL,
  `Miss1Time` int NOT NULL,
  `Miss3` int NOT NULL,
  `Miss3Time` int NOT NULL,
  `Function` int NOT NULL,
  `WHO` int NOT NULL,
  `Eligible` int NOT NULL,
  `Treatfail` int NOT NULL,
  `TypeFail` int NOT NULL,
  `TB` int NOT NULL,
  `TypeTB` int NOT NULL,
  `TBtreat` int NOT NULL,
  `DaTBtreat` date NOT NULL,
  `TestID` char(15) NOT NULL,
  `TestHIV` char(6) NOT NULL,
  `ResultHIV` int NOT NULL,
  `ReCD4` int NOT NULL,
  `ReVL` int NOT NULL,
  `CrAG` char(6) NOT NULL,
  `CrAGResult` int NOT NULL,
  `VLDetectable` int NOT NULL,
  `Referred` int NOT NULL,
  `OReferred` char(30) NOT NULL,
  `DaApp` date NOT NULL,
  `Vid` char(15) NOT NULL,
  `TPTout` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`site_code`,`Vid`),
  KEY `idx_tblcvmain_clinicid_datvisit` (`ClinicID`,`DatVisit`),
  KEY `idx_tblcvmain_vid_datvisit_clinicid` (`Vid`,`DatVisit`,`ClinicID`),
  KEY `idx_tblcvmain_datvisit_clinicid_vid` (`DatVisit`,`ClinicID`,`Vid`),
  KEY `idx_tblcvmain_site_datvisit_clinic` (`site_code`,`DatVisit`,`ClinicID`),
  KEY `idx_tblcvmain_site_synced_datvisit_vid` (`site_code`,`synced_at`,`DatVisit`,`Vid`),
  KEY `idx_tblcvmain_site_vid` (`site_code`,`Vid`),
  KEY `idx_tblcvmain_site_clinicid` (`site_code`,`ClinicID`),
  KEY `idx_tblcvmain_clinic_visit_app_vid` (`ClinicID`,`DatVisit`,`DaApp`,`Vid`),
  KEY `idx_tblcvmain_clinic_testhiv_visit` (`ClinicID`,`TestHIV`,`DatVisit`),
  KEY `idx_art_cvmain_site_clinic_visit_app_vid` (`site_code`,`ClinicID`,`DatVisit`,`DaApp`,`Vid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;

/*Table structure for table `tblcvoidrug` */

DROP TABLE IF EXISTS `tblcvoidrug`;

CREATE TABLE `tblcvoidrug` (
  `site_code` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id` int NOT NULL,
  `DrugName` char(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Dose` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Quantity` int NOT NULL,
  `Freq` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Form` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Status` int NOT NULL,
  `Da` date NOT NULL,
  `Reason` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Remark` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Vid` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`),
  KEY `idx_tblcvoidrug_vid_status_drug` (`Vid`,`Status`,`DrugName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tblcvpatientstatus` */

DROP TABLE IF EXISTS `tblcvpatientstatus`;

CREATE TABLE `tblcvpatientstatus` (
  `site_code` char(4) NOT NULL,
  `ClinicID` char(7) NOT NULL,
  `Status` int NOT NULL,
  `Place` int NOT NULL,
  `OPlace` char(20) NOT NULL,
  `Da` date NOT NULL,
  `Cause` char(50) NOT NULL,
  `Vid` char(15) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`site_code`,`ClinicID`,`Status`),
  KEY `idx_tblcvpatientstatus_clinicid_da_status` (`ClinicID`,`Da`,`Status`),
  KEY `idx_tblcvpatientstatus_da_clinicid_status` (`Da`,`ClinicID`,`Status`),
  KEY `idx_tblcvpatientstatus_site_da_clinic_status` (`site_code`,`Da`,`ClinicID`,`Status`),
  KEY `idx_tblcvpatientstatus_site_vid_status` (`site_code`,`Vid`,`Status`),
  KEY `idx_tblcvpatientstatus_site_status` (`site_code`,`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblcvtbdrug` */

DROP TABLE IF EXISTS `tblcvtbdrug`;

CREATE TABLE `tblcvtbdrug` (
  `site_code` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id` int NOT NULL,
  `DrugName` char(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Dose` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Quantity` int NOT NULL,
  `Freq` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Form` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Status` int NOT NULL,
  `Da` date NOT NULL,
  `Reason` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Remark` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Vid` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tblcvtptdrug` */

DROP TABLE IF EXISTS `tblcvtptdrug`;

CREATE TABLE `tblcvtptdrug` (
  `site_code` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id` int NOT NULL,
  `DrugName` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Dose` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Quantity` int NOT NULL,
  `Freq` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Form` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Status` int NOT NULL,
  `Da` date NOT NULL,
  `Reason` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Remark` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Vid` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`),
  KEY `idx_tblcvtptdrug_vid_status_drug` (`Vid`,`Status`,`DrugName`),
  KEY `idx_tblcvtptdrug_vid_status_da_drug` (`Vid`,`Status`,`Da`,`DrugName`),
  KEY `idx_art_cvtptdrug_status_da_vid_drug` (`Status`,`Da`,`Vid`,`DrugName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tbldistrict` */

DROP TABLE IF EXISTS `tbldistrict`;

CREATE TABLE `tbldistrict` (
  `id` int NOT NULL,
  `district_en` varchar(30) CHARACTER SET utf8mb3 NOT NULL,
  `district_kh` varchar(35) CHARACTER SET utf8mb3 NOT NULL,
  `province_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `_Did` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Table structure for table `tbldoctor` */

DROP TABLE IF EXISTS `tbldoctor`;

CREATE TABLE `tbldoctor` (
  `site_code` char(4) NOT NULL,
  `Did` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(40) NOT NULL,
  `Status` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Did`,`Name`,`Status`,`site_code`)
) ENGINE=InnoDB AUTO_INCREMENT=2664 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tbldrug` */

DROP TABLE IF EXISTS `tbldrug`;

CREATE TABLE `tbldrug` (
  `Did` int NOT NULL AUTO_INCREMENT,
  `DrugName` varchar(20) NOT NULL,
  `TypeDrug` int NOT NULL,
  `Status` int NOT NULL,
  `Detail` varchar(30) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Did`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tbldrugtreat` */

DROP TABLE IF EXISTS `tbldrugtreat`;

CREATE TABLE `tbldrugtreat` (
  `Tid` int NOT NULL AUTO_INCREMENT,
  `DrugName` char(30) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Tid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tbleimain` */

DROP TABLE IF EXISTS `tbleimain`;

CREATE TABLE `tbleimain` (
  `site_code` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ClinicID` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DafirstVisit` date NOT NULL,
  `DaBirth` date NOT NULL,
  `Sex` int NOT NULL,
  `AddGuardian` int NOT NULL,
  `Grou` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `House` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Street` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Village` varchar(70) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Commune` varchar(70) COLLATE utf8mb4_unicode_ci NOT NULL,
  `District` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Province` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `NameContact` char(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `AddContact` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Phone` char(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Fage` int NOT NULL,
  `FHIV` int NOT NULL,
  `Fstatus` int NOT NULL,
  `Mage` int NOT NULL,
  `MClinicID` int NOT NULL,
  `MArt` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `HospitalName` char(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Mstatus` int NOT NULL,
  `CatPlaceDelivery` char(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `PlaceDelivery` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `PMTCT` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DaDelivery` date NOT NULL,
  `DeliveryStatus` int NOT NULL,
  `LenBaby` float NOT NULL,
  `WBaby` float NOT NULL,
  `KnownHIV` int NOT NULL,
  `Received` int NOT NULL,
  `Syrup` int NOT NULL,
  `Cotrim` int NOT NULL,
  `Offin` int NOT NULL,
  `SiteName` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `HIVtest` int NOT NULL,
  `MHIV` int NOT NULL,
  `MLastvl` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DaMLastvl` date NOT NULL,
  `EOClinicID` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`site_code`,`ClinicID`),
  KEY `idx_tbleimain_clinic_sex_birth` (`ClinicID`,`Sex`,`DaBirth`),
  KEY `idx_tbleimain_site_clinicid` (`site_code`,`ClinicID`),
  KEY `idx_tbleimain_site_synced_first_clinic` (`site_code`,`synced_at`,`DafirstVisit`,`ClinicID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tblelink` */

DROP TABLE IF EXISTS `tblelink`;

CREATE TABLE `tblelink` (
  `site_code` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ClinicID` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Codes` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Typecode` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ARTIss` int NOT NULL,
  `DaExpiry` date NOT NULL,
  `Dacreate` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ClinicID`,`Codes`,`Typecode`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tbletest` */

DROP TABLE IF EXISTS `tbletest`;

CREATE TABLE `tbletest` (
  `site_code` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ClinicID` char(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DNAPcr` int NOT NULL,
  `DaPcrArr` date NOT NULL,
  `OI` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DaBlood` date NOT NULL,
  `LabID` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DaReceive` date NOT NULL,
  `DaAnalys` date NOT NULL,
  `Result` int DEFAULT NULL,
  `DaRresult` date NOT NULL,
  `DBS` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Technic` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ResultIn` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Other` char(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TID` char(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`site_code`,`TID`),
  KEY `idx_tbletest_clinic_dnapcr_oi_dates` (`ClinicID`,`DNAPcr`,`OI`,`DaRresult`),
  KEY `idx_tbletest_clinic_dablood` (`ClinicID`,`DaBlood`),
  KEY `idx_tbletest_site_synced_receive_tid` (`site_code`,`synced_at`,`DaReceive`,`TID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tblevarvdrug` */

DROP TABLE IF EXISTS `tblevarvdrug`;

CREATE TABLE `tblevarvdrug` (
  `site_code` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id` int NOT NULL,
  `DrugName` char(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Dose` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Quantity` int NOT NULL,
  `Freq` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Form` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Status` int NOT NULL,
  `Da` date NOT NULL,
  `Reason` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Remark` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Vid` char(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tblevmain` */

DROP TABLE IF EXISTS `tblevmain`;

CREATE TABLE `tblevmain` (
  `site_code` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ClinicID` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DatVisit` date NOT NULL,
  `TypeVisit` int NOT NULL,
  `Temp` float NOT NULL,
  `Pulse` float NOT NULL,
  `Resp` float NOT NULL,
  `Head` float NOT NULL,
  `Weight` float NOT NULL,
  `Height` float NOT NULL,
  `Malnutrition` int NOT NULL,
  `WH` int NOT NULL,
  `BCG` int NOT NULL,
  `OPV` int NOT NULL,
  `Measles` int NOT NULL,
  `Other` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Feeding` int NOT NULL,
  `DNA` int DEFAULT NULL,
  `DaResult` date NOT NULL,
  `Vid` char(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DNAPre` int DEFAULT NULL,
  `TestID` char(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DaApp` date NOT NULL,
  `Antibody` int DEFAULT NULL,
  `DaAntibody` date DEFAULT NULL,
  `Antiaffeeding` int NOT NULL,
  `OtherDNA` char(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`site_code`,`Vid`),
  KEY `idx_tblevmain_site_synced_datvisit_vid` (`site_code`,`synced_at`,`DatVisit`,`Vid`),
  KEY `idx_tblevmain_site_vid` (`site_code`,`Vid`),
  KEY `idx_tblevmain_site_clinicid` (`site_code`,`ClinicID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tblevpatientstatus` */

DROP TABLE IF EXISTS `tblevpatientstatus`;

CREATE TABLE `tblevpatientstatus` (
  `site_code` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ClinicID` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Status` int NOT NULL,
  `DaStatus` date NOT NULL,
  `Vid` char(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ClinicID`,`Status`,`site_code`),
  KEY `idx_tblevpatientstatus_site_vid_status` (`site_code`,`Vid`,`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tbllog` */

DROP TABLE IF EXISTS `tbllog`;

CREATE TABLE `tbllog` (
  `ClinicID` char(10) NOT NULL,
  `Status` char(20) NOT NULL,
  `Type` int NOT NULL,
  `Dat` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tbllostlog` */

DROP TABLE IF EXISTS `tbllostlog`;

CREATE TABLE `tbllostlog` (
  `Exsposed` int NOT NULL,
  `Child` int NOT NULL,
  `ChildARV` int NOT NULL,
  `Adult` int NOT NULL,
  `AdultARV` int NOT NULL,
  `Ed` int DEFAULT NULL,
  `Cd` int DEFAULT NULL,
  `Ad` int DEFAULT NULL,
  `DateChange` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Exsposed`,`Child`,`ChildARV`,`Adult`,`AdultARV`,`DateChange`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblmargins` */

DROP TABLE IF EXISTS `tblmargins`;

CREATE TABLE `tblmargins` (
  `mleft` float NOT NULL,
  `mright` float NOT NULL,
  `mtop` float NOT NULL,
  `mbottom` float NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblnationality` */

DROP TABLE IF EXISTS `tblnationality`;

CREATE TABLE `tblnationality` (
  `Nid` int NOT NULL AUTO_INCREMENT,
  `Nationality` varchar(40) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Nid`)
) ENGINE=InnoDB AUTO_INCREMENT=226 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tbloccupation` */

DROP TABLE IF EXISTS `tbloccupation`;

CREATE TABLE `tbloccupation` (
  `OcID` int NOT NULL AUTO_INCREMENT,
  `Name` char(30) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`OcID`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblods` */

DROP TABLE IF EXISTS `tblods`;

CREATE TABLE `tblods` (
  `od_code` char(4) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `name_kh` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `name_en` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `latitude` double unsigned DEFAULT NULL,
  `longitude` double unsigned DEFAULT NULL,
  `province_id` tinyint unsigned DEFAULT NULL,
  `created_dt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_dt` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `created_by_user_id` int DEFAULT NULL,
  `updated_by_user_id` int DEFAULT NULL,
  PRIMARY KEY (`od_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Table structure for table `tblpatienttest` */

DROP TABLE IF EXISTS `tblpatienttest`;

CREATE TABLE `tblpatienttest` (
  `site_code` char(4) NOT NULL,
  `TestID` char(15) NOT NULL,
  `ClinicID` char(10) NOT NULL,
  `DaArrival` date DEFAULT NULL,
  `Dat` date NOT NULL,
  `DaCollect` date NOT NULL,
  `CD4Rapid` int NOT NULL,
  `CD4` char(5) NOT NULL,
  `CD` char(8) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `CD8` char(6) NOT NULL,
  `HIVLoad` char(10) NOT NULL,
  `HIVLog` char(6) NOT NULL,
  `HCV` char(9) NOT NULL,
  `HCVlog` char(6) NOT NULL,
  `HIVAb` int NOT NULL,
  `HBsAg` int NOT NULL,
  `HCVPCR` int NOT NULL,
  `HBeAg` int NOT NULL,
  `TPHA` int NOT NULL,
  `AntiHBcAb` int NOT NULL,
  `RPR` int NOT NULL,
  `AntiHBeAb` int NOT NULL,
  `RPRab` char(10) NOT NULL,
  `HCVAb` int NOT NULL,
  `HBsAb` int NOT NULL,
  `WBC` char(10) NOT NULL,
  `Neutrophils` char(10) NOT NULL,
  `HGB` char(10) NOT NULL,
  `Eosinophis` char(10) NOT NULL,
  `HCT` char(10) NOT NULL,
  `Lymphocyte` char(10) NOT NULL,
  `MCV` char(10) NOT NULL,
  `Monocyte` char(10) NOT NULL,
  `PLT` char(10) NOT NULL,
  `Reticulocte` char(10) NOT NULL,
  `Prothrombin` char(10) NOT NULL,
  `ProReticulocyte` char(10) NOT NULL,
  `Creatinine` char(10) NOT NULL,
  `HDL` char(10) NOT NULL,
  `Bilirubin` char(10) NOT NULL,
  `Glucose` char(10) NOT NULL,
  `Sodium` char(10) NOT NULL,
  `AlPhosphate` char(10) NOT NULL,
  `GotASAT` char(10) NOT NULL,
  `Potassium` char(10) NOT NULL,
  `Amylase` char(10) NOT NULL,
  `GPTALAT` char(10) NOT NULL,
  `Chloride` char(10) NOT NULL,
  `CK` char(10) NOT NULL,
  `CHOL` char(10) NOT NULL,
  `Bicarbonate` char(10) NOT NULL,
  `Lactate` char(10) NOT NULL,
  `Triglyceride` char(10) NOT NULL,
  `Urea` char(10) NOT NULL,
  `Magnesium` char(10) NOT NULL,
  `Phosphorus` char(10) NOT NULL,
  `Calcium` char(10) NOT NULL,
  `BHCG` int NOT NULL,
  `SputumAFB` int NOT NULL,
  `AFBCulture` int NOT NULL,
  `AFBCulture1` char(15) NOT NULL,
  `UrineMicroscopy` int NOT NULL,
  `UrineComment` char(15) NOT NULL,
  `CSFCell` char(10) NOT NULL,
  `CSFGram` char(10) NOT NULL,
  `CSFAFB` char(10) NOT NULL,
  `CSFIndian` int NOT NULL,
  `CSFCCag` char(10) NOT NULL,
  `CSFProtein` char(10) NOT NULL,
  `CSFGlucose` char(10) NOT NULL,
  `BloodCulture` int NOT NULL,
  `BloodCulture0` char(10) NOT NULL,
  `BloodCulture1` int NOT NULL,
  `BloodCulture10` char(10) NOT NULL,
  `CTNA` int NOT NULL,
  `GCNA` int NOT NULL,
  `CXR` int NOT NULL,
  `Abdominal` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  `perf_art_has_hiv_load` tinyint(1) GENERATED ALWAYS AS ((case when ((`HIVLoad` is null) or (`HIVLoad` = _utf8mb3'')) then 0 else 1 end)) VIRTUAL,
  PRIMARY KEY (`site_code`,`TestID`),
  KEY `idx_patienttest_site_clinic_dat` (`site_code`,`ClinicID`,`Dat`),
  KEY `idx_tblpatienttest_site_clinic_dat_arrival` (`site_code`,`ClinicID`,`Dat`,`DaArrival`),
  KEY `idx_tblpatienttest_clinic_dat_arrival` (`ClinicID`,`Dat`,`DaArrival`),
  KEY `idx_tblpatienttest_site_synced_arrival_test` (`site_code`,`synced_at`,`DaArrival`,`TestID`),
  KEY `idx_tblpatienttest_clinic_arrival_dat` (`ClinicID`,`DaArrival`,`Dat`),
  KEY `idx_art_patienttest_site_dat_clinic_arrival` (`site_code`,`Dat`,`ClinicID`,`DaArrival`),
  KEY `idx_perf_art_ptest_site_hasvl_dat_clinic_arrival` (`site_code`,`perf_art_has_hiv_load`,`Dat`,`ClinicID`,`DaArrival`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblpatienttestabdominal` */

DROP TABLE IF EXISTS `tblpatienttestabdominal`;

CREATE TABLE `tblpatienttestabdominal` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `TestID` char(15) NOT NULL,
  `Abdo` char(20) NOT NULL,
  `Abdo1` char(20) NOT NULL,
  `Abdo2` char(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `tblpatienttestcxr` */

DROP TABLE IF EXISTS `tblpatienttestcxr`;

CREATE TABLE `tblpatienttestcxr` (
  `site_code` char(4) NOT NULL,
  `id` int NOT NULL,
  `TestID` char(15) NOT NULL,
  `CXR` char(20) NOT NULL,
  `CXR1` char(20) NOT NULL,
  `CXR2` char(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `tblprovince` */

DROP TABLE IF EXISTS `tblprovince`;

CREATE TABLE `tblprovince` (
  `id` int NOT NULL,
  `province_en` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `province_kh` varchar(40) CHARACTER SET utf8mb3 NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Table structure for table `tblreason` */

DROP TABLE IF EXISTS `tblreason`;

CREATE TABLE `tblreason` (
  `Rid` int NOT NULL AUTO_INCREMENT,
  `Reason` char(40) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Rid`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblsetlost` */

DROP TABLE IF EXISTS `tblsetlost`;

CREATE TABLE `tblsetlost` (
  `Exsposed` int NOT NULL,
  `Child` int NOT NULL,
  `ChildARV` int NOT NULL,
  `Adult` int NOT NULL,
  `AdultARV` int NOT NULL,
  `Ed` int DEFAULT NULL,
  `Cd` int DEFAULT NULL,
  `Ad` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblsite_syncs` */

DROP TABLE IF EXISTS `tblsite_syncs`;

CREATE TABLE `tblsite_syncs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `synced_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_data_created_at` timestamp NULL DEFAULT NULL,
  `last_data_updated_at` timestamp NULL DEFAULT NULL,
  `site_code` char(6) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `program_id` tinyint unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100138 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `tblsitename` */

DROP TABLE IF EXISTS `tblsitename`;

CREATE TABLE `tblsitename` (
  `NameEn` char(40) NOT NULL,
  `NameKh` char(40) NOT NULL,
  `SiteCode` char(4) NOT NULL,
  `Province` char(20) NOT NULL,
  `District` char(25) NOT NULL,
  `ODname` char(30) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`SiteCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblsites` */

DROP TABLE IF EXISTS `tblsites`;

CREATE TABLE `tblsites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `art_site_code` char(4) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `vcct_site_code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `site_name` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `od_code` char(6) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `od_name` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `district_id` smallint DEFAULT NULL,
  `province_id` tinyint DEFAULT NULL,
  `status_id` tinyint DEFAULT '1',
  `last_vcct_synced_at` timestamp NULL DEFAULT NULL,
  `last_vcct_data_created_at` timestamp NULL DEFAULT NULL,
  `last_vcct_data_updated_at` timestamp NULL DEFAULT NULL,
  `last_art_synced_at` timestamp NULL DEFAULT NULL,
  `last_art_data_created_at` timestamp NULL DEFAULT NULL,
  `last_art_data_updated_at` timestamp NULL DEFAULT NULL,
  `last_art_count_sync_remain` int DEFAULT NULL,
  `last_art_version` char(9) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `created_by_user_id` int DEFAULT NULL,
  `updated_by_user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_site_site_code` (`vcct_site_code`),
  KEY `idx_tblsites_art_site_code` (`art_site_code`),
  KEY `idx_tblsites_province_site` (`province_id`,`art_site_code`),
  KEY `idx_tblsites_od_site` (`od_code`,`art_site_code`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Table structure for table `tbltargroup` */

DROP TABLE IF EXISTS `tbltargroup`;

CREATE TABLE `tbltargroup` (
  `Tid` int NOT NULL,
  `Targroup` char(10) NOT NULL,
  `Targroupkh` char(50) NOT NULL,
  `Status` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Tid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tbltemp` */

DROP TABLE IF EXISTS `tbltemp`;

CREATE TABLE `tbltemp` (
  `f` char(30) NOT NULL,
  `f1` char(30) NOT NULL,
  `f2` char(30) NOT NULL,
  `f3` char(30) NOT NULL,
  `f4` char(30) NOT NULL,
  `f5` date NOT NULL,
  `f6` date NOT NULL,
  PRIMARY KEY (`f`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tbltempart` */

DROP TABLE IF EXISTS `tbltempart`;

CREATE TABLE `tbltempart` (
  `ClinicID` char(7) NOT NULL,
  `Sex` int DEFAULT NULL,
  PRIMARY KEY (`ClinicID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tbltempdrug` */

DROP TABLE IF EXISTS `tbltempdrug`;

CREATE TABLE `tbltempdrug` (
  `Vid` double NOT NULL,
  `ClinicID` int NOT NULL,
  PRIMARY KEY (`ClinicID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tbltempoi` */

DROP TABLE IF EXISTS `tbltempoi`;

CREATE TABLE `tbltempoi` (
  `ClinicID` char(7) NOT NULL,
  `Sex` int DEFAULT NULL,
  PRIMARY KEY (`ClinicID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tbluser` */

DROP TABLE IF EXISTS `tbluser`;

CREATE TABLE `tbluser` (
  `Uid` int NOT NULL,
  `Fullname` varchar(40) NOT NULL,
  `User` varchar(40) NOT NULL,
  `Pass` char(40) NOT NULL,
  `Status` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblvcctsite` */

DROP TABLE IF EXISTS `tblvcctsite`;

CREATE TABLE `tblvcctsite` (
  `Vid` varchar(10) NOT NULL,
  `SiteName` varchar(30) NOT NULL,
  `ODname` varchar(20) NOT NULL,
  `Status` int NOT NULL,
  PRIMARY KEY (`Vid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblversion` */

DROP TABLE IF EXISTS `tblversion`;

CREATE TABLE `tblversion` (
  `Version` char(15) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `tblvillage` */

DROP TABLE IF EXISTS `tblvillage`;

CREATE TABLE `tblvillage` (
  `id` int NOT NULL,
  `village_en` varchar(35) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `village_kh` varchar(35) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `commune_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `_Vid` int DEFAULT NULL,
  `_Cid` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Table structure for table `typeorm_metadata` */

DROP TABLE IF EXISTS `typeorm_metadata`;

CREATE TABLE `typeorm_metadata` (
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `database` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `schema` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `table` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `user_logins` */

DROP TABLE IF EXISTS `user_logins`;

CREATE TABLE `user_logins` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `ip_address` char(15) NOT NULL,
  `platform` varchar(50) DEFAULT NULL,
  `browser` varchar(50) DEFAULT NULL,
  `browser_v` float(6,2) unsigned DEFAULT NULL,
  `is_valid` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=548 DEFAULT CHARSET=latin1;

/*Table structure for table `user_org_units` */

DROP TABLE IF EXISTS `user_org_units`;

CREATE TABLE `user_org_units` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `province_id` tinyint unsigned DEFAULT NULL,
  `od_code` char(4) DEFAULT NULL,
  `site_id` smallint unsigned DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `user_roles` */

DROP TABLE IF EXISTS `user_roles`;

CREATE TABLE `user_roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `status_id` tinyint DEFAULT '1',
  `login_at` timestamp NULL DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=507 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `vcct_hiv_results` */

DROP TABLE IF EXISTS `vcct_hiv_results`;

CREATE TABLE `vcct_hiv_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `result_en` char(10) NOT NULL,
  `result_kh` char(10) NOT NULL,
  `status_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ID_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `vcct_line_test_results` */

DROP TABLE IF EXISTS `vcct_line_test_results`;

CREATE TABLE `vcct_line_test_results` (
  `site_code` char(6) NOT NULL,
  `vcct_id` int NOT NULL,
  `line_control` int NOT NULL,
  `line_positive` int NOT NULL,
  `line_longterm` int NOT NULL,
  `cambo_ag` int NOT NULL,
  `cambo_ab` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `created_by_user_id` int DEFAULT NULL,
  `updated_by_user_id` int DEFAULT NULL,
  PRIMARY KEY (`vcct_id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `vcct_number_recencies` */

DROP TABLE IF EXISTS `vcct_number_recencies`;

CREATE TABLE `vcct_number_recencies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `site_code` char(6) NOT NULL,
  `client_type_id` smallint NOT NULL,
  `age_0_4_male` smallint DEFAULT '0',
  `age_5_9_female` smallint DEFAULT '0',
  `age_10_14_male` smallint DEFAULT '0',
  `age_15_19_female` smallint DEFAULT '0',
  `age_20_24_male` smallint DEFAULT '0',
  `age_25_29_female` smallint DEFAULT '0',
  `age_30_34_male` smallint DEFAULT '0',
  `age_35_39_female` smallint DEFAULT '0',
  `age_40_44_male` smallint DEFAULT '0',
  `age_45_49_female` smallint DEFAULT '0',
  `age_50_plus_male` smallint DEFAULT '0',
  `age_50_plus_female` smallint DEFAULT '0',
  `total_male` smallint DEFAULT '0',
  `total_female` smallint DEFAULT '0',
  `total_rtri_longterm` smallint DEFAULT '0',
  `total_rtri_recent` smallint DEFAULT '0',
  `total_rtri_inconclusive` smallint DEFAULT '0',
  `total_rtri_invalid` smallint DEFAULT '0',
  `total_rtri_is_repeat_onetime` smallint DEFAULT '0',
  `total_rita_longterm` smallint DEFAULT '0',
  `total_rita_recent` smallint DEFAULT '0',
  `total` smallint DEFAULT '0',
  `register_year` smallint DEFAULT '0',
  `register_month` tinyint DEFAULT '0',
  `register_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `vcct_number_retests` */

DROP TABLE IF EXISTS `vcct_number_retests`;

CREATE TABLE `vcct_number_retests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `site_code` char(6) NOT NULL,
  `age_0_4_male` smallint DEFAULT '0',
  `age_5_9_female` smallint DEFAULT '0',
  `age_10_14_male` smallint DEFAULT '0',
  `age_15_19_female` smallint DEFAULT '0',
  `age_20_24_male` smallint DEFAULT '0',
  `age_25_29_female` smallint DEFAULT '0',
  `age_30_34_male` smallint DEFAULT '0',
  `age_35_39_female` smallint DEFAULT '0',
  `age_40_44_male` smallint DEFAULT '0',
  `age_45_49_female` smallint DEFAULT '0',
  `age_50_plus_male` smallint DEFAULT '0',
  `age_50_plus_female` smallint DEFAULT '0',
  `total_male` smallint DEFAULT '0',
  `total_female` smallint DEFAULT '0',
  `total_negative` smallint DEFAULT '0',
  `total_postive` smallint DEFAULT '0',
  `total` smallint DEFAULT '0',
  `retest_year` smallint DEFAULT '0',
  `retest_month` tinyint DEFAULT '0',
  `retest_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `vcct_number_test_a1_reactives` */

DROP TABLE IF EXISTS `vcct_number_test_a1_reactives`;

CREATE TABLE `vcct_number_test_a1_reactives` (
  `id` int NOT NULL AUTO_INCREMENT,
  `site_code` char(6) NOT NULL,
  `client_type_id` smallint NOT NULL,
  `age_0_4_male` smallint DEFAULT '0',
  `age_5_9_female` smallint DEFAULT '0',
  `age_10_14_male` smallint DEFAULT '0',
  `age_15_19_female` smallint DEFAULT '0',
  `age_20_24_male` smallint DEFAULT '0',
  `age_25_29_female` smallint DEFAULT '0',
  `age_30_34_male` smallint DEFAULT '0',
  `age_35_39_female` smallint DEFAULT '0',
  `age_40_44_male` smallint DEFAULT '0',
  `age_45_49_female` smallint DEFAULT '0',
  `age_50_plus_male` smallint DEFAULT '0',
  `age_50_plus_female` smallint DEFAULT '0',
  `total_male` smallint DEFAULT '0',
  `total_female` smallint DEFAULT '0',
  `total` smallint DEFAULT '0',
  `register_year` smallint DEFAULT '0',
  `register_month` tinyint DEFAULT '0',
  `register_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `vcct_number_tests` */

DROP TABLE IF EXISTS `vcct_number_tests`;

CREATE TABLE `vcct_number_tests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `site_code` char(6) NOT NULL,
  `client_type_id` smallint NOT NULL,
  `referred_to_id` smallint NOT NULL,
  `age_0_4_male` smallint DEFAULT '0',
  `age_5_9_female` smallint DEFAULT '0',
  `age_10_14_male` smallint DEFAULT '0',
  `age_15_19_female` smallint DEFAULT '0',
  `age_20_24_male` smallint DEFAULT '0',
  `age_25_29_female` smallint DEFAULT '0',
  `age_30_34_male` smallint DEFAULT '0',
  `age_35_39_female` smallint DEFAULT '0',
  `age_40_44_male` smallint DEFAULT '0',
  `age_45_49_female` smallint DEFAULT '0',
  `age_50_plus_male` smallint DEFAULT '0',
  `age_50_plus_female` smallint DEFAULT '0',
  `total_male` smallint DEFAULT '0',
  `total_female` smallint DEFAULT '0',
  `total_negative` smallint DEFAULT '0',
  `total_postive` smallint DEFAULT '0',
  `total_inconclusive` smallint DEFAULT '0',
  `total` smallint DEFAULT '0',
  `register_year` smallint DEFAULT '0',
  `register_month` tinyint DEFAULT '0',
  `register_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `vcct_patient_types` */

DROP TABLE IF EXISTS `vcct_patient_types`;

CREATE TABLE `vcct_patient_types` (
  `id` int NOT NULL,
  `type_en` char(10) DEFAULT NULL,
  `type_kh` varchar(80) NOT NULL,
  `status_id` tinyint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Pid_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `vcct_reason_to_services` */

DROP TABLE IF EXISTS `vcct_reason_to_services`;

CREATE TABLE `vcct_reason_to_services` (
  `site_code` char(6) NOT NULL,
  `vcct_id` int NOT NULL,
  `rs1` tinyint NOT NULL,
  `rs2` tinyint NOT NULL,
  `rs3` tinyint NOT NULL,
  `rs4` tinyint NOT NULL,
  `rs5` tinyint NOT NULL,
  `rs6` tinyint NOT NULL,
  `rs7` tinyint NOT NULL,
  `rs8` tinyint NOT NULL,
  `rs9` tinyint NOT NULL,
  `rs10` tinyint NOT NULL,
  `rs11` tinyint NOT NULL,
  `rs12` tinyint NOT NULL,
  `rs13` tinyint NOT NULL,
  `rs14` tinyint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `created_by_user_id` int DEFAULT NULL,
  `updated_by_user_id` int DEFAULT NULL,
  PRIMARY KEY (`vcct_id`,`site_code`),
  KEY `idx_reason_to_services_vcct_site` (`vcct_id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `vcct_reasons` */

DROP TABLE IF EXISTS `vcct_reasons`;

CREATE TABLE `vcct_reasons` (
  `id` int NOT NULL,
  `reason` char(45) NOT NULL,
  `status_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Rsid_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `vcct_refer_froms` */

DROP TABLE IF EXISTS `vcct_refer_froms`;

CREATE TABLE `vcct_refer_froms` (
  `id` tinyint NOT NULL,
  `refer_name` varchar(45) NOT NULL,
  `status_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `TID_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `vcct_refer_to_services` */

DROP TABLE IF EXISTS `vcct_refer_to_services`;

CREATE TABLE `vcct_refer_to_services` (
  `id` int NOT NULL,
  `service_en` varchar(20) DEFAULT NULL,
  `service_kh` varchar(90) NOT NULL,
  `status_id` tinyint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `vcct_retest_outs` */

DROP TABLE IF EXISTS `vcct_retest_outs`;

CREATE TABLE `vcct_retest_outs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vcct_id` int NOT NULL,
  `site_code` char(6) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `sex` int NOT NULL,
  `age` int NOT NULL,
  `result` int NOT NULL,
  `test_date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Table structure for table `vcct_retests` */

DROP TABLE IF EXISTS `vcct_retests`;

CREATE TABLE `vcct_retests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `site_code` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `site_code_from` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vcct_id` int NOT NULL DEFAULT '0',
  `sex` int NOT NULL,
  `age` int NOT NULL,
  `result` int NOT NULL,
  `test_date` date NOT NULL,
  `status_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by_user_id` int DEFAULT NULL,
  `updated_by_user_id` int DEFAULT NULL,
  `sorted_at` timestamp GENERATED ALWAYS AS (coalesce(`updated_at`,`created_at`)) STORED NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32768 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `vcct_risks` */

DROP TABLE IF EXISTS `vcct_risks`;

CREATE TABLE `vcct_risks` (
  `site_code` char(6) NOT NULL,
  `vcct_id` int NOT NULL,
  `risk1` tinyint NOT NULL,
  `risk2` tinyint NOT NULL,
  `risk3` tinyint NOT NULL,
  `risk4` tinyint NOT NULL,
  `risk5` tinyint NOT NULL,
  `risk6` tinyint NOT NULL,
  `risk7` tinyint NOT NULL,
  `risk8` tinyint NOT NULL,
  `risk9` tinyint NOT NULL,
  `risk10` tinyint NOT NULL,
  `risk11` tinyint NOT NULL,
  `risk12` tinyint NOT NULL,
  `risk13` tinyint NOT NULL,
  `risk14` tinyint NOT NULL,
  `risk15` tinyint NOT NULL,
  `risk16` tinyint NOT NULL,
  `risk17` tinyint NOT NULL,
  `risk18` tinyint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `created_by_user_id` int DEFAULT NULL,
  `updated_by_user_id` int DEFAULT NULL,
  PRIMARY KEY (`vcct_id`,`site_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `vcct_rtri_lines_delete` */

DROP TABLE IF EXISTS `vcct_rtri_lines_delete`;

CREATE TABLE `vcct_rtri_lines_delete` (
  `vcct_id` int NOT NULL,
  `l_control` char(6) NOT NULL,
  `l_positive` char(6) NOT NULL,
  `l_longterm` char(6) NOT NULL,
  `cambo_ag` char(6) NOT NULL,
  `cambo_ab` char(6) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `created_by_user_id` int DEFAULT NULL,
  `updated_by_user_id` int DEFAULT NULL,
  PRIMARY KEY (`vcct_id`),
  UNIQUE KEY `VCCTID_UNIQUE` (`vcct_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `vcct_rtri_results` */

DROP TABLE IF EXISTS `vcct_rtri_results`;

CREATE TABLE `vcct_rtri_results` (
  `id` tinyint NOT NULL AUTO_INCREMENT,
  `result` char(20) NOT NULL,
  `status_id` tinyint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ID_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `vcct_sites_delete` */

DROP TABLE IF EXISTS `vcct_sites_delete`;

CREATE TABLE `vcct_sites_delete` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `site_code` char(6) NOT NULL,
  `site_name` varchar(50) DEFAULT NULL,
  `od_name` varchar(50) DEFAULT NULL,
  `status_id` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `device_name` varchar(255) DEFAULT NULL,
  `vcct_id_start` bigint DEFAULT NULL,
  PRIMARY KEY (`id`,`site_code`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=latin1;

/*Table structure for table `vcct_vl_rita_results` */

DROP TABLE IF EXISTS `vcct_vl_rita_results`;

CREATE TABLE `vcct_vl_rita_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `result_vl` char(20) DEFAULT NULL,
  `result_rita` char(30) DEFAULT NULL,
  `status_id` tinyint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ID_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `vccts` */

DROP TABLE IF EXISTS `vccts`;

CREATE TABLE `vccts` (
  `site_code` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `vcct_id` int NOT NULL,
  `vcct_id_duplicated` int DEFAULT NULL,
  `registration_date` date NOT NULL,
  `pmrs_code` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hts_code` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uuic` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idpoor` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `sex` tinyint NOT NULL,
  `dob` date NOT NULL,
  `marital_status_id` tinyint NOT NULL,
  `occupation_id` smallint NOT NULL,
  `occupation_other` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `education_id` smallint NOT NULL,
  `province_id` int NOT NULL,
  `district_id` int NOT NULL,
  `commune_id` int DEFAULT NULL,
  `village_id` int DEFAULT NULL,
  `phone_number` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `country_of_birth_id` int NOT NULL,
  `country_of_birth_other` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_migrant` tinyint DEFAULT '0',
  `refer_from_id` tinyint NOT NULL,
  `patient_type_id` tinyint NOT NULL,
  `history_of_test` tinyint NOT NULL,
  `history_of_test_result` tinyint NOT NULL,
  `history_partner_result1` tinyint NOT NULL,
  `history_partner_result2` tinyint NOT NULL,
  `is_agree_test_hiv` tinyint NOT NULL,
  `combo_result` tinyint NOT NULL,
  `hiv_result` tinyint NOT NULL,
  `is_agree_test_rtri` tinyint NOT NULL,
  `rtri_result_id` tinyint NOT NULL,
  `is_first_invalid` tinyint NOT NULL,
  `is_agree_test_vl` tinyint NOT NULL,
  `vl_result` int NOT NULL,
  `rita_result` int NOT NULL,
  `post_counseling_id` tinyint NOT NULL,
  `post_counseling_date` date DEFAULT NULL,
  `refer_to_service_id` tinyint NOT NULL,
  `refer_to_other` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `counselor_code_deprecated` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `counselor_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by_user_id` int DEFAULT NULL,
  `updated_by_user_id` int DEFAULT NULL,
  `device_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sorted_at` timestamp GENERATED ALWAYS AS (coalesce(`updated_at`,`created_at`)) STORED NULL,
  PRIMARY KEY (`vcct_id`,`site_code`),
  KEY `vcct_site_code_vcct_id_index` (`vcct_id`,`site_code`),
  KEY `idx_vcct_dob` (`dob`),
  KEY `idx_vcct_device_id_name` (`device_id`,`device_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Table structure for table `z_setting_sites` */

DROP TABLE IF EXISTS `z_setting_sites`;

CREATE TABLE `z_setting_sites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `site_code` varchar(6) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `site_name` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `od_code` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `od_name` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `district_id` smallint DEFAULT NULL,
  `province_id` tinyint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `created_by_user_id` int DEFAULT NULL,
  `updated_by_user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Table structure for table `z_site_manipulations_DELETE` */

DROP TABLE IF EXISTS `z_site_manipulations_DELETE`;

CREATE TABLE `z_site_manipulations_DELETE` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `site_code` varchar(255) NOT NULL,
  `vcct_id_start` bigint NOT NULL,
  `device_name` varchar(255) NOT NULL,
  `created_by_user_id` bigint NOT NULL,
  `updated_by_user_id` bigint NOT NULL,
  `created_dt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_dt` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Table structure for table `z_tbl_old_commune_DELETE` */

DROP TABLE IF EXISTS `z_tbl_old_commune_DELETE`;

CREATE TABLE `z_tbl_old_commune_DELETE` (
  `Did` int NOT NULL,
  `Cid` int NOT NULL AUTO_INCREMENT,
  `CommuneEN` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  `commune_id` int DEFAULT NULL,
  `Pid` int DEFAULT NULL,
  PRIMARY KEY (`Cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1652 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `z_tbl_old_district_DELETE` */

DROP TABLE IF EXISTS `z_tbl_old_district_DELETE`;

CREATE TABLE `z_tbl_old_district_DELETE` (
  `Pid` int NOT NULL,
  `Did` int NOT NULL AUTO_INCREMENT,
  `DistrictEng` varchar(30) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Did`)
) ENGINE=InnoDB AUTO_INCREMENT=1907 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `z_tbl_old_province_DELETE` */

DROP TABLE IF EXISTS `z_tbl_old_province_DELETE`;

CREATE TABLE `z_tbl_old_province_DELETE` (
  `Pid` int NOT NULL AUTO_INCREMENT,
  `ProvinceEng` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Pid`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `z_tbl_old_village_DELETE` */

DROP TABLE IF EXISTS `z_tbl_old_village_DELETE`;

CREATE TABLE `z_tbl_old_village_DELETE` (
  `Cid` int NOT NULL,
  `Vid` int NOT NULL AUTO_INCREMENT,
  `VillageEn` varchar(35) DEFAULT NULL,
  `Did` int DEFAULT NULL,
  `Pid` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Vid`)
) ENGINE=InnoDB AUTO_INCREMENT=16679 DEFAULT CHARSET=utf8mb3;

/*Table structure for table `z_tbl_villages_wrong_DELETE` */

DROP TABLE IF EXISTS `z_tbl_villages_wrong_DELETE`;

CREATE TABLE `z_tbl_villages_wrong_DELETE` (
  `id` int NOT NULL,
  `village_en` varchar(35) NOT NULL,
  `village_kH` varchar(35) NOT NULL,
  `commune_id` smallint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Vid_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/* Trigger structure for table `tblaart` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblaart_ai` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblaart_ai` AFTER INSERT ON `tblaart` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblaart:insert'); END */$$


DELIMITER ;

/* Trigger structure for table `tblaart` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblaart_au` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblaart_au` AFTER UPDATE ON `tblaart` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblaart:update'); END */$$


DELIMITER ;

/* Trigger structure for table `tblaart` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblaart_ad` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblaart_ad` AFTER DELETE ON `tblaart` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblaart:delete'); END */$$


DELIMITER ;

/* Trigger structure for table `tblaimain` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblaimain_ai` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblaimain_ai` AFTER INSERT ON `tblaimain` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblaimain:insert'); END */$$


DELIMITER ;

/* Trigger structure for table `tblaimain` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblaimain_au` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblaimain_au` AFTER UPDATE ON `tblaimain` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblaimain:update'); END */$$


DELIMITER ;

/* Trigger structure for table `tblaimain` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblaimain_ad` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblaimain_ad` AFTER DELETE ON `tblaimain` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblaimain:delete'); END */$$


DELIMITER ;

/* Trigger structure for table `tblavarvdrug` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblavarvdrug_ai` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblavarvdrug_ai` AFTER INSERT ON `tblavarvdrug` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblavarvdrug:insert'); END */$$


DELIMITER ;

/* Trigger structure for table `tblavarvdrug` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblavarvdrug_au` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblavarvdrug_au` AFTER UPDATE ON `tblavarvdrug` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblavarvdrug:update'); END */$$


DELIMITER ;

/* Trigger structure for table `tblavarvdrug` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblavarvdrug_ad` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblavarvdrug_ad` AFTER DELETE ON `tblavarvdrug` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblavarvdrug:delete'); END */$$


DELIMITER ;

/* Trigger structure for table `tblavmain` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblavmain_ai` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblavmain_ai` AFTER INSERT ON `tblavmain` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblavmain:insert'); END */$$


DELIMITER ;

/* Trigger structure for table `tblavmain` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblavmain_au` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblavmain_au` AFTER UPDATE ON `tblavmain` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblavmain:update'); END */$$


DELIMITER ;

/* Trigger structure for table `tblavmain` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblavmain_ad` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblavmain_ad` AFTER DELETE ON `tblavmain` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblavmain:delete'); END */$$


DELIMITER ;

/* Trigger structure for table `tblavpatientstatus` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblavstatus_ai` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblavstatus_ai` AFTER INSERT ON `tblavpatientstatus` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblavpatientstatus:insert'); END */$$


DELIMITER ;

/* Trigger structure for table `tblavpatientstatus` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblavstatus_au` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblavstatus_au` AFTER UPDATE ON `tblavpatientstatus` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblavpatientstatus:update'); END */$$


DELIMITER ;

/* Trigger structure for table `tblavpatientstatus` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblavstatus_ad` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblavstatus_ad` AFTER DELETE ON `tblavpatientstatus` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblavpatientstatus:delete'); END */$$


DELIMITER ;

/* Trigger structure for table `tblavtptdrug` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblavtptdrug_ai` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblavtptdrug_ai` AFTER INSERT ON `tblavtptdrug` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblavtptdrug:insert'); END */$$


DELIMITER ;

/* Trigger structure for table `tblavtptdrug` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblavtptdrug_au` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblavtptdrug_au` AFTER UPDATE ON `tblavtptdrug` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblavtptdrug:update'); END */$$


DELIMITER ;

/* Trigger structure for table `tblavtptdrug` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblavtptdrug_ad` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblavtptdrug_ad` AFTER DELETE ON `tblavtptdrug` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblavtptdrug:delete'); END */$$


DELIMITER ;

/* Trigger structure for table `tblcart` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblcart_ai` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblcart_ai` AFTER INSERT ON `tblcart` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblcart:insert'); END */$$


DELIMITER ;

/* Trigger structure for table `tblcart` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblcart_au` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblcart_au` AFTER UPDATE ON `tblcart` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblcart:update'); END */$$


DELIMITER ;

/* Trigger structure for table `tblcart` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblcart_ad` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblcart_ad` AFTER DELETE ON `tblcart` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblcart:delete'); END */$$


DELIMITER ;

/* Trigger structure for table `tblcimain` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblcimain_ai` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblcimain_ai` AFTER INSERT ON `tblcimain` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblcimain:insert'); END */$$


DELIMITER ;

/* Trigger structure for table `tblcimain` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblcimain_au` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblcimain_au` AFTER UPDATE ON `tblcimain` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblcimain:update'); END */$$


DELIMITER ;

/* Trigger structure for table `tblcimain` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblcimain_ad` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblcimain_ad` AFTER DELETE ON `tblcimain` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblcimain:delete'); END */$$


DELIMITER ;

/* Trigger structure for table `tblcvarvdrug` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblcvarvdrug_ai` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblcvarvdrug_ai` AFTER INSERT ON `tblcvarvdrug` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblcvarvdrug:insert'); END */$$


DELIMITER ;

/* Trigger structure for table `tblcvarvdrug` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblcvarvdrug_au` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblcvarvdrug_au` AFTER UPDATE ON `tblcvarvdrug` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblcvarvdrug:update'); END */$$


DELIMITER ;

/* Trigger structure for table `tblcvarvdrug` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblcvarvdrug_ad` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblcvarvdrug_ad` AFTER DELETE ON `tblcvarvdrug` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblcvarvdrug:delete'); END */$$


DELIMITER ;

/* Trigger structure for table `tblcvmain` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblcvmain_ai` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblcvmain_ai` AFTER INSERT ON `tblcvmain` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblcvmain:insert'); END */$$


DELIMITER ;

/* Trigger structure for table `tblcvmain` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblcvmain_au` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblcvmain_au` AFTER UPDATE ON `tblcvmain` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblcvmain:update'); END */$$


DELIMITER ;

/* Trigger structure for table `tblcvmain` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblcvmain_ad` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblcvmain_ad` AFTER DELETE ON `tblcvmain` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblcvmain:delete'); END */$$


DELIMITER ;

/* Trigger structure for table `tblcvpatientstatus` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblcvstatus_ai` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblcvstatus_ai` AFTER INSERT ON `tblcvpatientstatus` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblcvpatientstatus:insert'); END */$$


DELIMITER ;

/* Trigger structure for table `tblcvpatientstatus` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblcvstatus_au` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblcvstatus_au` AFTER UPDATE ON `tblcvpatientstatus` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblcvpatientstatus:update'); END */$$


DELIMITER ;

/* Trigger structure for table `tblcvpatientstatus` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblcvstatus_ad` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblcvstatus_ad` AFTER DELETE ON `tblcvpatientstatus` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblcvpatientstatus:delete'); END */$$


DELIMITER ;

/* Trigger structure for table `tblcvtptdrug` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblcvtptdrug_ai` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblcvtptdrug_ai` AFTER INSERT ON `tblcvtptdrug` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblcvtptdrug:insert'); END */$$


DELIMITER ;

/* Trigger structure for table `tblcvtptdrug` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblcvtptdrug_au` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblcvtptdrug_au` AFTER UPDATE ON `tblcvtptdrug` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblcvtptdrug:update'); END */$$


DELIMITER ;

/* Trigger structure for table `tblcvtptdrug` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblcvtptdrug_ad` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblcvtptdrug_ad` AFTER DELETE ON `tblcvtptdrug` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblcvtptdrug:delete'); END */$$


DELIMITER ;

/* Trigger structure for table `tblpatienttest` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblpatienttest_ai` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblpatienttest_ai` AFTER INSERT ON `tblpatienttest` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblpatienttest:insert'); END */$$


DELIMITER ;

/* Trigger structure for table `tblpatienttest` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblpatienttest_au` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblpatienttest_au` AFTER UPDATE ON `tblpatienttest` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblpatienttest:update'); END */$$


DELIMITER ;

/* Trigger structure for table `tblpatienttest` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblpatienttest_ad` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblpatienttest_ad` AFTER DELETE ON `tblpatienttest` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblpatienttest:delete'); END */$$


DELIMITER ;

/* Trigger structure for table `tblsites` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblsites_ai` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblsites_ai` AFTER INSERT ON `tblsites` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblsites:insert'); END */$$


DELIMITER ;

/* Trigger structure for table `tblsites` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblsites_au` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblsites_au` AFTER UPDATE ON `tblsites` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblsites:update'); END */$$


DELIMITER ;

/* Trigger structure for table `tblsites` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `trg_art_indicator_tblsites_ad` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `trg_art_indicator_tblsites_ad` AFTER DELETE ON `tblsites` FOR EACH ROW BEGIN CALL sp_art_indicator_counts_mark_dirty('tblsites:delete'); END */$$


DELIMITER ;

/* Procedure structure for procedure `GetCounselors` */

/*!50003 DROP PROCEDURE IF EXISTS  `GetCounselors` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`%` PROCEDURE `GetCounselors`()
BEGIN
	SELECT
	    counselors.id,
	    counselors.site_code,
	    users.id as user_id,
	    counselors.first_name,
	    counselors.last_name,
	    counselors.phone,
	    counselors.sex,
	    users.username,
		counselors.status_id as status_id,
		counselors.pin_code as pin_code,
	    JSON_ARRAYAGG(roles.role_name) as roles
	FROM counselors
	LEFT JOIN users ON users.id = counselors.user_id
	LEFT JOIN user_roles ON user_roles.user_id = users.id
	LEFT JOIN roles ON roles.id = user_roles.role_id
	group by counselors.id;
END */$$
DELIMITER ;

/* Procedure structure for procedure `GetCounselorRolesBySiteCode` */

/*!50003 DROP PROCEDURE IF EXISTS  `GetCounselorRolesBySiteCode` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`mpi`@`%` PROCEDURE `GetCounselorRolesBySiteCode`(IN site_code VARCHAR(255),IN filter_mode ENUM('one','both'), IN status_id INT)
BEGIN
	SELECT
	    counselors.id,
	    counselors.site_code,
	    users.id as user_id,
	    users.first_name,
	    users.last_name,
	    counselors.phone,
	    counselors.sex,
	    users.username,
		counselors.status_id as status_id,
		counselors.pin_code as pin_code,
	    JSON_ARRAYAGG(roles.role_name) as roles
	FROM counselors
	LEFT JOIN users ON users.id = counselors.user_id
	LEFT JOIN user_roles ON user_roles.user_id = users.id
	LEFT JOIN roles ON roles.id = user_roles.role_id
	WHERE counselors.site_code = site_code
	AND (
		(filter_mode='both' AND counselors.status_id IN (1,0))
		OR (filter_mode='one' AND counselors.status_id = status_id)
	)
	GROUP BY counselors.id ORDER BY  COALESCE(users.updated_at,users.created_at) DESC;
END */$$
DELIMITER ;

/* Procedure structure for procedure `convert_all_tables_to_utf8mb4_unicode_ci` */

/*!50003 DROP PROCEDURE IF EXISTS  `convert_all_tables_to_utf8mb4_unicode_ci` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`mpi`@`%` PROCEDURE `convert_all_tables_to_utf8mb4_unicode_ci`()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE tbl_name VARCHAR(255);

    -- Cursor for selecting table names
    DECLARE cur CURSOR FOR
        SELECT DISTINCT TABLE_NAME
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND COLLATION_NAME LIKE 'utf8mb4%';

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO tbl_name;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Build dynamic SQL for altering table
        SET @sql = CONCAT(
            'ALTER TABLE `', tbl_name,
            '` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
        );

        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END LOOP;

    CLOSE cur;
END */$$
DELIMITER ;

/* Procedure structure for procedure `aggregate_delete_all_data_by_site` */

/*!50003 DROP PROCEDURE IF EXISTS  `aggregate_delete_all_data_by_site` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`mpi`@`%` PROCEDURE `aggregate_delete_all_data_by_site`(IN `p_site_code` CHAR(4))
BEGIN

		DELETE FROM tblaart			WHERE site_code=p_site_code;
		DELETE FROM tblaccess			WHERE site_code=p_site_code;
		
		DELETE FROM tblaiallergy		WHERE site_code=p_site_code;
		DELETE FROM tblaiarvtreathis 		WHERE site_code=p_site_code;
		DELETE FROM tblaimain			WHERE site_code=p_site_code;
		
		-- aiothmed
		DELETE FROM tblaiothmedabnormal		WHERE site_code=p_site_code;
		DELETE FROM tblaiothmedanemia		WHERE site_code=p_site_code;
		DELETE FROM tblaiothmeddiabete		WHERE site_code=p_site_code;
		DELETE FROM tblaiothmedhepbc		WHERE site_code=p_site_code;
		DELETE FROM tblaiothmedhyper		WHERE site_code=p_site_code;
		DELETE FROM tblaiothmedliver		WHERE site_code=p_site_code;
		DELETE FROM tblaiothmedother		WHERE site_code=p_site_code;
		DELETE FROM tblaiothmedrenal		WHERE site_code=p_site_code;
		
		DELETE FROM tblalink			WHERE site_code=p_site_code;

		
		-- PNTT
		DELETE FROM tblapntt 			WHERE site_code=p_site_code;
		DELETE FROM tblapnttchild 		WHERE site_code=p_site_code; 
		DELETE FROM tblapnttchildcont		WHERE site_code=p_site_code; 
		DELETE FROM tblapnttpart		WHERE site_code=p_site_code;
		DELETE FROM tblapnttpartcont		WHERE site_code=p_site_code;
		
		--
		
		DELETE FROM tblappointment		WHERE site_code=p_site_code;
		DELETE FROM tblaumain			WHERE site_code=p_site_code;
		
		-- tblavmains 
		DELETE FROM tblavmain			WHERE site_code=p_site_code;
		DELETE FROM tblavpatientstatus		WHERE site_code=p_site_code;
		DELETE FROM tblavoidrug			WHERE site_code=p_site_code;
		DELETE FROM tblavtbdrug			WHERE site_code=p_site_code;
		DELETE FROM tblavtptdrug		WHERE site_code=p_site_code;
		DELETE FROM tblavarvdrug		WHERE site_code=p_site_code;
		DELETE FROM tblavhydrug			WHERE site_code=p_site_code;
		
		
		DELETE FROM tblcart			WHERE site_code=p_site_code;
		
		--
		DELETE FROM tblciallergy		WHERE site_code=p_site_code;
		DELETE FROM tblcicotrim			WHERE site_code=p_site_code;
		DELETE FROM tblcifamily			WHERE site_code=p_site_code;
		DELETE FROM tblcifluconazole		WHERE site_code=p_site_code;
		DELETE FROM tblcimain			WHERE site_code=p_site_code;
		DELETE FROM tblciothpast		WHERE site_code=p_site_code;

		DELETE FROM tblclink			WHERE site_code=p_site_code;
		DELETE FROM tblcumain			WHERE site_code=p_site_code;
		
		-- tblcvmains 
		DELETE FROM tblcvmain			WHERE site_code=p_site_code;
		DELETE FROM tblcvpatientstatus		WHERE site_code=p_site_code;
		DELETE FROM tblcvarvdrug		WHERE site_code=p_site_code;
		DELETE FROM tblcvoidrug 		WHERE site_code=p_site_code;
		DELETE FROM tblcvtbdrug			WHERE site_code=p_site_code;
		DELETE FROM tblcvtptdrug		WHERE site_code=p_site_code;
		
		-- Expo Infant Clear Data
		DELETE FROM tbleimain			WHERE site_code=p_site_code;
		DELETE FROM tblelink			WHERE site_code=p_site_code;
		DELETE FROM tbletest			WHERE site_code=p_site_code;
		DELETE FROM tblevarvdrug		WHERE site_code=p_site_code;
		DELETE FROM tblevmain			WHERE site_code=p_site_code;
		DELETE FROM tblevpatientstatus		WHERE site_code=p_site_code;
		-- End Expo 
		
		-- tblpatienttests
		DELETE FROM tblpatienttest		WHERE site_code=p_site_code;
		DELETE FROM tblpatienttestabdominal	WHERE site_code=p_site_code;
		DELETE FROM tblpatienttestcxr		WHERE site_code=p_site_code;
		
		-- tbldoctor
		DELETE FROM tbldoctor			WHERE site_code=p_site_code;
	
	END */$$
DELIMITER ;

/* Procedure structure for procedure `aggregate_insert_summery_import` */

/*!50003 DROP PROCEDURE IF EXISTS  `aggregate_insert_summery_import` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`mpi`@`%` PROCEDURE `aggregate_insert_summery_import`(
    IN `p_site_code` CHAR(4),
    IN `p_filename` CHAR(35)
)
BEGIN 
    INSERT INTO imports(`filename`, last_initial, last_visited, tables_count, site_code) 
    VALUES (
        p_filename,
	 
        (SELECT MAX(last_initial)
         FROM (
             SELECT MAX(DafirstVisit) AS last_initial FROM preart_temp.tblaimain
             UNION ALL
             SELECT MAX(DafirstVisit) FROM preart_temp.tblcimain
             UNION ALL
             SELECT MAX(DafirstVisit) FROM preart_temp.tbleimain
         ) AS initial_main),

        (SELECT MAX(last_visit)
         FROM (
             SELECT MAX(DatVisit) AS last_visit FROM preart_temp.tblavmain
             UNION ALL
             SELECT MAX(DatVisit) FROM preart_temp.tblcvmain
             UNION ALL
             SELECT MAX(DatVisit) FROM preart_temp.tblevmain
         ) AS visit_main),

        (SELECT COUNT(*) 
         FROM information_schema.tables 
         WHERE table_schema = 'preart_temp' 
           AND table_type = 'BASE TABLE'),

        p_site_code
    );

END */$$
DELIMITER ;

/* Procedure structure for procedure `aggregate_count_table_temp` */

/*!50003 DROP PROCEDURE IF EXISTS  `aggregate_count_table_temp` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`mpi`@`%` PROCEDURE `aggregate_count_table_temp`()
BEGIN
	SELECT COUNT(*) 
	FROM  information_schema.tables 
	WHERE table_schema = 'preart_temp' 
	  AND table_type = 'BASE TABLE';
    END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_art_indicator_counts_mark_dirty` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_art_indicator_counts_mark_dirty` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`%` PROCEDURE `sp_art_indicator_counts_mark_dirty`(IN p_reason VARCHAR(128))
BEGIN
    INSERT INTO art_indicator_counts_dirty (
        dirty_key,
        reason,
        dirty_at,
        locked_at,
        processed_at,
        attempts,
        last_error,
        created_at,
        updated_at
    )
    VALUES (
        'country:all',
        p_reason,
        CURRENT_TIMESTAMP,
        NULL,
        NULL,
        0,
        NULL,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    ON DUPLICATE KEY UPDATE
        reason = VALUES(reason),
        dirty_at = VALUES(dirty_at),
        locked_at = NULL,
        processed_at = NULL,
        last_error = NULL,
        updated_at = CURRENT_TIMESTAMP;
END */$$
DELIMITER ;

/* Procedure structure for procedure `aggregate_tables_by_sql_1205hope` */

/*!50003 DROP PROCEDURE IF EXISTS  `aggregate_tables_by_sql_1205hope` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`mpi`@`%` PROCEDURE `aggregate_tables_by_sql_1205hope`(IN `p_site_code` CHAR(4))
BEGIN
	
	-- DELETE to Clear before Insert
	CALL aggregate_delete_all_data_by_site(p_site_code);		 
	-- a
	
	INSERT INTO tblaart (site_code,  ClinicID, ART, DaArt) 	
		      SELECT p_site_code, ClinicID, ART, DaArt FROM preart_temp.tblaart;

	INSERT INTO tblaccess(site_code, id, `Uid`, `Type`, `Dat`) 	
		     SELECT p_site_code, id, `Uid`, `Type`, `Dat` FROM preart_temp.tblaccess;
	
	INSERT INTO tblaiallergy(site_code, id, `ClinicID`, `DrugName`, `Allergy`, `Da`) 	
			SELECT p_site_code, id, `ClinicID`, `DrugName`, `Allergy`, `Da` FROM preart_temp.tblaiallergy;
		       
	
	INSERT INTO tblaiarvtreathis (site_code, id, `ClinicID`, `DrugName`, `Clinic`, `DaStart`, `DaStop`, `Note`) 	
			     SELECT p_site_code, id, `ClinicID`, `DrugName`, `Clinic`, `DaStart`, `DaStop`, `Note` FROM preart_temp.tblaiarvtreathis;
			       
		      
	INSERT INTO tblaimain(site_code, ClinicID, DafirstVisit, TypeofReturn, LClinicID, SiteNameold, DaBirth, Sex, Education, Rea, `Write`, Referred, Orefferred, DaHIV, Vcctcode, VcctID, PclinicID, OffIn, SiteName, DaART,Artnum, TbPast, TPT, TPTdrug, DaStartTPT, DaEndTPT, TypeTB, ResultTB, Daonset, Tbtreat, Datreat, ResultTreat, DaResultTreat, ARVTreatHis, Diabete, Hyper, Abnormal, Renal, Anemia, Liver, HepBC, MedOther, Allergy, Nationality) 
		     SELECT p_site_code, ClinicID, DafirstVisit, TypeofReturn, LClinicID, SiteNameold, DaBirth, Sex, Education, Rea, `Write`, Referred, Orefferred, DaHIV, Vcctcode, VcctID, PclinicID, OffIn, SiteName, DaART,Artnum, TbPast, TPT, 	-1,  DaStartTPT, DaEndTPT, TypeTB, ResultTB, Daonset, Tbtreat, Datreat, ResultTreat, DaResultTreat, ARVTreatHis, Diabete, Hyper, Abnormal, Renal, Anemia, Liver, HepBC, MedOther, Allergy, Nationality FROM preart_temp.tblaimain;
	
	-- aiothmed
			
	INSERT INTO tblaiothmedabnormal(site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note) 	
			       SELECT p_site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note FROM preart_temp.tblaiothmedabnormal;
	
	INSERT INTO tblaiothmedanemia(site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note) 	
			     SELECT p_site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note FROM preart_temp.tblaiothmedanemia;
	
	INSERT INTO tblaiothmeddiabete(site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note) 	
			      SELECT p_site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note FROM preart_temp.tblaiothmeddiabete;
	
	INSERT INTO tblaiothmedhepbc(site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note) 	
			    SELECT p_site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note FROM preart_temp.tblaiothmedhepbc;
	
	INSERT INTO tblaiothmedhyper(site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note) 	
			    SELECT p_site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note FROM preart_temp.tblaiothmedhyper;
	
	INSERT INTO tblaiothmedliver(site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note) 	
			    SELECT p_site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note FROM preart_temp.tblaiothmedliver;
	
	INSERT INTO tblaiothmedother(site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note) 	
			    SELECT p_site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note FROM preart_temp.tblaiothmedother;
	
	INSERT INTO tblaiothmedrenal(site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note) 	
			    SELECT p_site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note FROM preart_temp.tblaiothmedrenal;
	
	-- alink
	INSERT INTO tblalink(site_code, `ClinicID`, `Codes`, `Typecode`, `ARTIss`, `DaExpiry`,   `Dacreate`)
		    SELECT p_site_code, `ClinicID`, `Codes`, `Typecode`,       -1, '1900-01-01', '1900-01-01' FROM preart_temp.tblalink;  
	
	
	INSERT INTO tblappointment (site_code, `Vid`, `Doctore`, `Time`, `Att`) 	
			   SELECT p_site_code, `Vid`, `Doctore`, `Time`, `Att` FROM preart_temp.tblappointment;
			    
	INSERT INTO tblaumain(site_code, `ClinicID`,`Daupdate`, `Marital`,`Occupation` ,`HIVshow` ,`Relative` ,`Family` ,`Community` ,`Grou` ,`House` ,`Street` ,`Village` ,`Commune` ,`District` ,`Province` ,`Phone` ,`AddCont1`,`Phone1` ,`AddCont2`,`Phone2` ,`NGO`,`NameNGO`,`AUID`) 
		     SELECT p_site_code, `ClinicID`,`Daupdate`, `Marital`,`Occupation` ,`HIVshow` ,`Relative` ,`Family` ,`Community` ,`Grou` ,`House` ,`Street` ,`Village` ,`Commune` ,`District` ,`Province` ,`Phone` ,`AddCont1`,`Phone1` ,`AddCont2`,`Phone2` ,`NGO`,`NameNGO`,`AUID` FROM preart_temp.tblaumain;
	
	
	-- avmains
	INSERT INTO tblavarvdrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`) 	
		        SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid` FROM preart_temp.tblavarvdrug;
	
	INSERT INTO tblavhydrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`) 	
		       SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid` FROM preart_temp.tblavhydrug;

	INSERT INTO tblavmain (site_code, ClinicID, ARTnum, DatVisit, TypeVisit, Womenstatus, PregStatus, DaPreg, ANCservice, Weight, Height, Temp, Pulse, Resp, Blood, STIPreven, ARTAdher, Birthspac, TBinfect, Partner, Condoms, CMTypeClient, CMDaUse, CMCondom, CoC, Poc, CMVaccine, UseOther, OCMcondom, OCoc, OPoC, OCMVaccin, OCMother, Cough, Fever, Wlost, Drenching, Urine, Genital, Chemnah, Hospital, NumDay, CauseHospital, MissARV, MissTime, WHO, Eligible, TestID, `FUNCTION`, TB, TypeTB, TBtreat, DaTBtreat, TestHIV, ResultHIV, ReCD4, ReVL, ReHCV, CrAG, CrAGResult, VLDetectable, Referred, OReferred, Moderate, Renal, Rash, Hepatitis, Peripheral, Neutropenia, Hyperlipidemia, Lactic, Hypersensitivity, Jaundice, MTother, ARVreg, ResultHC, TPTout, TBout, DaApp, Vid, Foworker, Country) 
		      SELECT p_site_code, ClinicID, ARTnum, DatVisit, TypeVisit, Womenstatus, PregStatus, DaPreg, ANCservice, Weight, Height, Temp, Pulse, Resp, Blood, STIPreven, ARTAdher, Birthspac, TBinfect, Partner, Condoms, CMTypeClient, CMDaUse, CMCondom, CoC, Poc, CMVaccine, UseOther, OCMcondom, OCoc, OPoC, OCMVaccin, OCMother, Cough, Fever, Wlost, Drenching, Urine, Genital, Chemnah, Hospital, NumDay, CauseHospital, MissARV, MissTime, WHO, Eligible, TestID, `FUNCTION`, TB, TypeTB, TBtreat, DaTBtreat, TestHIV, ResultHIV, ReCD4, ReVL, ReHCV, CrAG, CrAGResult, VLDetectable, Referred, OReferred, Moderate, Renal, Rash, Hepatitis, Peripheral, Neutropenia, Hyperlipidemia, Lactic, Hypersensitivity, Jaundice, MTother, ARVreg, ResultHC, TPTout, TBout, DaApp, Vid, 	-1, -1 FROM preart_temp.tblavmain;
	      
	INSERT INTO tblavoidrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`) 	
		       SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid` FROM preart_temp.tblavoidrug;
	
	INSERT INTO tblavpatientstatus(site_code, ClinicID, `Status`, Place, OPlace, Da, Cause, Vid) 
			      SELECT p_site_code, ClinicID, `Status`, Place, OPlace, Da, Cause, Vid FROM preart_temp.tblavpatientstatus; 

	INSERT INTO tblavtbdrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`) 	
		       SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid` FROM preart_temp.tblavtbdrug;
	
	INSERT INTO tblavtptdrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`) 	
		        SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid` FROM preart_temp.tblavtptdrug;
		         
	
	
	-- c
	INSERT INTO  tblcart(site_code, ClinicID, ART, DaArt) 
		    SELECT p_site_code, ClinicID, ART, DaArt FROM preart_temp.tblcart; 
	
	
	-- ci
	INSERT INTO tblciallergy(site_code, id, `ClinicID`, `DrugName`, `Allergy`)
			SELECT p_site_code, id, `ClinicID`, `DrugName`, `Allergy` FROM preart_temp.tblciallergy;
	
	INSERT INTO tblcicotrim(site_code, id, ClinicID, ClinicName, StartDate, StopDate, ReasonStop)
		      SELECT p_site_code, id, ClinicID, ClinicName, StartDate, StopDate, ReasonStop FROM preart_temp.tblcicotrim;
			
	INSERT INTO tblcifamily(site_code, id, `ClinicID`, `Faminily`, `Age`, `HIVstatus`, `Status`, `StartARV`, `Pregnant`, `SiteName`, `HTB`)
		       SELECT p_site_code, id, `ClinicID`, `Faminily`, `Age`, `HIVstatus`, `Status`, `StartARV`, `Pregnant`, `SiteName`, `HTB` FROM preart_temp.tblcifamily;
			  
	INSERT INTO tblcifluconazole(site_code, id, ClinicID, ClinicName, StartDate, StopDate, ReasonStop)
			    SELECT p_site_code, id, ClinicID, ClinicName, StartDate, StopDate, ReasonStop FROM preart_temp.tblcifluconazole;

	INSERT INTO tblcimain(site_code, ClinicID, DaFirstVisit, LClinicID, DaBirth, Sex, Referred, Oreferred, EClinicID, DaTest, TypeTest, Vcctcode, VcctID, OffIn, SiteName, DaART, Artnum, Feeding, TbPast, TypeTB, ResultTB, Daonset, Tbtreat, Datreat, ResultTreat, DaResultTreat, Inh, TPTdrug, DaStartTPT  ,DaEndTPT	, OtherPast, Cotrim, Fluco, Allergy, ClinicIDold, SiteNameOld, Nationality) 
		     SELECT p_site_code, ClinicID, DaFirstVisit, LClinicID, DaBirth, Sex, Referred, Oreferred, EClinicID, DaTest, TypeTest, Vcctcode, VcctID, OffIn, SiteName, DaART, Artnum, Feeding, TbPast, TypeTB, ResultTB, Daonset, Tbtreat, Datreat, ResultTreat, DaResultTreat, Inh, 	  -1, '1900-01-01','1900-01-01' , OtherPast, Cotrim, Fluco, Allergy, ClinicIDold, SiteNameOld, Nationality FROM preart_temp.tblcimain; 
	
	
	INSERT INTO tblciothpast(site_code, id, ClinicID, DrugName, Clinic, DaStart, DaStop, Note)
			SELECT p_site_code, id, ClinicID, DrugName, Clinic, DaStart, DaStop, Note FROM preart_temp.tblciothpast;
			 	
		    
	INSERT INTO tblclink(site_code, `ClinicID`, `Codes`, `Typecode`, `ARTIss`, `DaExpiry`,   `Dacreate`)
		    SELECT p_site_code, `ClinicID`, `Codes`, `Typecode`,       -1, '1900-01-01', '1900-01-01' FROM preart_temp.tblclink;
		     
	INSERT INTO tblcumain(site_code, `ClinicID`, `Daupdate`, `AddGuardian`, `Grou`, `House`, `Street`, `Village`, `Commune`, `District`, `Province`, `AddContact`, `Phone`, `ChildStatus`, `Foccupation`, `Moccupation`, `Education`, `ChildSupport`, `Vaccine`, `CUID`) 	
		     SELECT p_site_code, `ClinicID`, `Daupdate`, `AddGuardian`, `Grou`, `House`, `Street`, `Village`, `Commune`, `District`, `Province`, `AddContact`, `Phone`, `ChildStatus`, `Foccupation`, `Moccupation`, `Education`, `ChildSupport`, `Vaccine`, `CUID` FROM preart_temp.tblcumain;

	-- cvmains	      
	INSERT INTO tblcvmain(site_code, ClinicID, ARTnum, DatVisit, TypeVisit, Temp, Pulse, Resp, Blood, Weight, Height, Malnutrition, WH, PTB, Wlost, Cough, Fever, Enlarg, Hospital, NumDay, CauseHospital, Miss1, Miss1Time, Miss3, Miss3Time, `FUNCTION`, WHO, Eligible, Treatfail, TypeFail, TB, TypeTB, TBtreat, DaTBtreat, TestID, TestHIV, ResultHIV, ReCD4, ReVL, CrAG, CrAGResult, VLDetectable, Referred, OReferred, DaApp, Vid, TPTout) 
		     SELECT p_site_code, ClinicID, ARTnum, DatVisit, TypeVisit, Temp, Pulse, Resp, Blood, Weight, Height, Malnutrition, WH, PTB, Wlost, Cough, Fever, Enlarg, Hospital, NumDay, CauseHospital, Miss1, Miss1Time, Miss3, Miss3Time, `FUNCTION`, WHO, Eligible, Treatfail, TypeFail, TB, TypeTB, TBtreat, DaTBtreat, TestID, TestHIV, ResultHIV, ReCD4, ReVL, CrAG, CrAGResult, VLDetectable, Referred, OReferred, DaApp, Vid, TPTout FROM preart_temp.tblcvmain; 
	
	INSERT INTO tblcvarvdrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`) 	
		        SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid` FROM preart_temp.tblcvarvdrug;
	
	INSERT INTO  tblcvoidrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`) 	
		        SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`  FROM preart_temp.tblcvoidrug;
	
	
	INSERT INTO tblcvpatientstatus(site_code, ClinicID, `Status`, Place, OPlace, Da, Cause, Vid) 
			      SELECT p_site_code, ClinicID, `Status`, Place, OPlace, Da, Cause, Vid FROM preart_temp.tblcvpatientstatus; 
	
	INSERT INTO  tblcvtbdrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`) 	
		        SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`  FROM preart_temp.tblcvtbdrug;
		         
	INSERT INTO tblcvtptdrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`) 	
		        SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid` FROM preart_temp.tblcvtptdrug;
		         
		         
	-- eimains Expo Infant : Load data
	-- INSERT INTO tbleimain(site_code, `ClinicID`, `DafirstVisit`, `DaBirth`, `Sex`, `AddGuardian`, `Grou`, `House`, `Street`, `Village`, `Commune`, `District`, `Province`, `NameContact`, `AddContact`, `Phone`, `Fage`, `FHIV`, `Fstatus`, `Mage`, `MClinicID`, `MArt`, `HospitalName`, `Mstatus`, `CatPlaceDelivery`, `PlaceDelivery`, `PMTCT`, `DaDelivery`, `DeliveryStatus`, `LenBaby`, `WBaby`, `KnownHIV`, `Received`, `Syrup`, `Cotrim`, `Offin`, `SiteName`, `HIVtest`, `MHIV`, `MLastvl`, `DaMLastvl`, `EOClinicID`)
	--	     SELECT p_site_code, `ClinicID`, `DafirstVisit`, `DaBirth`, `Sex`, `AddGuardian`, `Grou`, `House`, `Street`, `Village`, `Commune`, `District`, `Province`, `NameContact`, `AddContact`, `Phone`, `Fage`, `FHIV`, `Fstatus`, `Mage`, `MClinicID`, `MArt`, `HospitalName`, `Mstatus`, `CatPlaceDelivery`, `PlaceDelivery`, `PMTCT`, `DaDelivery`, `DeliveryStatus`, `LenBaby`, `WBaby`, `KnownHIV`, `Received`, `Syrup`, `Cotrim`, `Offin`, `SiteName`, `HIVtest`, `MHIV`, `MLastvl`, `DaMLastvl`, `EOClinicID` FROM preart_temp.tbleimain;
		
	-- INSERT INTO tblelink(site_code, `ClinicID`, `Codes`, `Typecode`, `ARTIss`, `DaExpiry`  , `Dacreate`)
	-- 	    SELECT p_site_code, `ClinicID`, `Codes`, `Typecode`,       -1, '1900-01-01', '1900-01-01'  FROM preart_temp.tblelink;
	
	-- INSERT INTO tbletest(site_code, `ClinicID`, `DNAPcr`, `DaPcrArr`, `OI`, `DaBlood`, `LabID`, `DaReceive`, `DaAnalys`, `Result`, `DaRresult`, `DBS`, `Technic`, `ResultIn`, `Other`, `TID`)
	-- 	    SELECT p_site_code, `ClinicID`, `DNAPcr`, `DaPcrArr`, `OI`, `DaBlood`, `LabID`, `DaReceive`, `DaAnalys`, `Result`, `DaRresult`, `DBS`, `Technic`, `ResultIn`, `Other`, `TID` FROM preart_temp.tbletest;
	
	-- INSERT INTO tblevarvdrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`)
	-- 		SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid` FROM preart_temp.tblevarvdrug;
	
	-- INSERT INTO tblevmain(site_code, `ClinicID`, `DatVisit`, `TypeVisit`, `Temp`, `Pulse`, `Resp`, `Head`, `Weight`, `Height`, `Malnutrition`, `WH`, `BCG`, `OPV`, `Measles`, `Other`, `Feeding`, `DNA`, `DaResult`, `Vid`, `TestID`, `DaApp`, `Antibody`, `DaAntibody`, `Antiaffeeding`, `OtherDNA`)
	-- 	     SELECT p_site_code, `ClinicID`, `DatVisit`, `TypeVisit`, `Temp`, `Pulse`, `Resp`, `Head`, `Weight`, `Height`, `Malnutrition`, `WH`, `BCG`, `OPV`, `Measles`, `Other`, `Feeding`, `DNA`, `DaResult`, `Vid`, `TestID`, `DaApp`, `Antibody`, `DaAntibody`, `Antiaffeeding`, `OtherDNA` FROM preart_temp.tblevmain;
		
	-- INSERT INTO tblevpatientstatus(site_code, `ClinicID`, `Status`, `DaStatus`, `Vid`)
	-- 	   	      SELECT p_site_code, `ClinicID`, `Status`, `DaStatus`, `Vid` FROM preart_temp.tblevpatientstatus;
				
				
				
	-- tblpatienttests		   
	INSERT INTO tblpatienttest(site_code, TestID, ClinicID, DaArrival, Dat, DaCollect, CD4Rapid, CD4, CD, CD8, HIVLoad, HIVLog, HCV, HCVlog, HIVAb, HBsAg, HCVPCR, HBeAg, TPHA, AntiHBcAb, RPR, AntiHBeAb, RPRab, HCVAb, HBsAb, WBC, Neutrophils, HGB, Eosinophis, HCT, Lymphocyte, MCV, Monocyte, PLT, Reticulocte, Prothrombin, ProReticulocyte, Creatinine, HDL, Bilirubin, Glucose, Sodium, AlPhosphate, GotASAT, Potassium, Amylase, GPTALAT, Chloride, CK, CHOL, Bicarbonate, Lactate, Triglyceride, Urea, Magnesium, Phosphorus, Calcium, BHCG, SputumAFB, AFBCulture, AFBCulture1, UrineMicroscopy, UrineComment, CSFCell, CSFGram, CSFAFB, CSFIndian, CSFCCag, CSFProtein, CSFGlucose, BloodCulture, BloodCulture0, BloodCulture1, BloodCulture10, CTNA, GCNA, CXR, Abdominal) 
			  SELECT p_site_code, TestID, ClinicID, DaArrival, Dat, DaCollect, 	 -1, CD4, CD, CD8, HIVLoad, HIVLog, HCV, HCVlog, HIVAb, HBsAg, HCVPCR, HBeAg, TPHA, AntiHBcAb, RPR, AntiHBeAb, RPRab, HCVAb, HBsAb, WBC, Neutrophils, HGB, Eosinophis, HCT, Lymphocyte, MCV, Monocyte, PLT, Reticulocte, Prothrombin, ProReticulocyte, Creatinine, HDL, Bilirubin, Glucose, Sodium, AlPhosphate, GotASAT, Potassium, Amylase, GPTALAT, Chloride, CK, CHOL, Bicarbonate, Lactate, Triglyceride, Urea, Magnesium, Phosphorus, Calcium, BHCG, SputumAFB, AFBCulture, AFBCulture1, UrineMicroscopy, UrineComment, CSFCell, CSFGram, CSFAFB, CSFIndian, CSFCCag, CSFProtein, CSFGlucose, BloodCulture, BloodCulture0, BloodCulture1, BloodCulture10, CTNA, GCNA, CXR, Abdominal FROM preart_temp.tblpatienttest;
	
	INSERT INTO tblpatienttestabdominal(site_code, id, TestID, Abdo, Abdo1, Abdo2)
				   SELECT p_site_code, id, TestID, Abdo, Abdo1, Abdo2  FROM preart_temp.tblpatienttestabdominal;
	
	INSERT INTO tblpatienttestcxr(site_code, id, TestID, CXR, CXR1, CXR2) 	
			     SELECT p_site_code, id, TestID, CXR, CXR1, CXR2  FROM preart_temp.tblpatienttestcxr;
			      
	
	INSERT INTO tbldoctor(site_code, `Did`, `Name`, `Status`) 	
		     SELECT p_site_code, `Did`, `Name`, `Status` FROM preart_temp.tbldoctor;
				
END */$$
DELIMITER ;

/* Procedure structure for procedure `aggregate_tables_by_sql_by_site` */

/*!50003 DROP PROCEDURE IF EXISTS  `aggregate_tables_by_sql_by_site` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`mpi`@`%` PROCEDURE `aggregate_tables_by_sql_by_site`(IN `p_site_code` CHAR(4))
BEGIN
	
	-- DELETE to Clear before Insert
	-- comment for Expose Infant 
	 CALL aggregate_delete_all_data_by_site(p_site_code);		 
	-- a
	
	INSERT INTO tblaart (site_code,  ClinicID, ART, DaArt) 	
		      SELECT p_site_code, ClinicID, ART, DaArt FROM preart_temp.tblaart;

	INSERT INTO tblaccess(site_code, id, `Uid`, `Type`, `Dat`) 	
		     SELECT p_site_code, id, `Uid`, `Type`, `Dat` FROM preart_temp.tblaccess;
	
	INSERT INTO tblaiallergy(site_code, id, `ClinicID`, `DrugName`, `Allergy`, `Da`) 	
			SELECT p_site_code, id, `ClinicID`, `DrugName`, `Allergy`, `Da` FROM preart_temp.tblaiallergy;
		       
	
	INSERT INTO tblaiarvtreathis (site_code, id, `ClinicID`, `DrugName`, `Clinic`, `DaStart`, `DaStop`, `Note`) 	
			     SELECT p_site_code, id, `ClinicID`, `DrugName`, `Clinic`, `DaStart`, `DaStop`, `Note` FROM preart_temp.tblaiarvtreathis;
			       
		      
	INSERT INTO tblaimain(site_code, ClinicID, DafirstVisit, TypeofReturn, LClinicID, SiteNameold, DaBirth, Sex, Education, Rea, `Write`, Referred, Orefferred, DaHIV, Vcctcode, VcctID, PclinicID, OffIn, SiteName, DaART,Artnum, TbPast, TPT, TPTdrug, DaStartTPT, DaEndTPT, TypeTB, ResultTB, Daonset, Tbtreat, Datreat, ResultTreat, DaResultTreat, ARVTreatHis, Diabete, Hyper, Abnormal, Renal, Anemia, Liver, HepBC, MedOther, Allergy, Nationality, Targroup, Refugstatus, RefugART, Refugsite) 
		     SELECT p_site_code, ClinicID, DafirstVisit, TypeofReturn, LClinicID, SiteNameold, DaBirth, Sex, Education, Rea, `Write`, Referred, Orefferred, DaHIV, Vcctcode, VcctID, PclinicID, OffIn, SiteName, DaART,Artnum, TbPast, TPT, TPTdrug, DaStartTPT, DaEndTPT, TypeTB, ResultTB, Daonset, Tbtreat, Datreat, ResultTreat, DaResultTreat, ARVTreatHis, Diabete, Hyper, Abnormal, Renal, Anemia, Liver, HepBC, MedOther, Allergy, Nationality, Targroup, Refugstatus, RefugART, Refugsite FROM preart_temp.tblaimain;

	-- aiothmed
			
	INSERT INTO tblaiothmedabnormal(site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note) 	
			       SELECT p_site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note FROM preart_temp.tblaiothmedabnormal;
	
	INSERT INTO tblaiothmedanemia(site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note) 	
			     SELECT p_site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note FROM preart_temp.tblaiothmedanemia;
	
	INSERT INTO tblaiothmeddiabete(site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note) 	
			      SELECT p_site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note FROM preart_temp.tblaiothmeddiabete;
	
	INSERT INTO tblaiothmedhepbc(site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note) 	
			    SELECT p_site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note FROM preart_temp.tblaiothmedhepbc;
	
	INSERT INTO tblaiothmedhyper(site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note) 	
			    SELECT p_site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note FROM preart_temp.tblaiothmedhyper;
	
	INSERT INTO tblaiothmedliver(site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note) 	
			    SELECT p_site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note FROM preart_temp.tblaiothmedliver;
	
	INSERT INTO tblaiothmedother(site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note) 	
			    SELECT p_site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note FROM preart_temp.tblaiothmedother;
	
	INSERT INTO tblaiothmedrenal(site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note) 	
			    SELECT p_site_code, id, ClinicID, DrugName, Clinic, DaStart, Dastop, Note FROM preart_temp.tblaiothmedrenal;
	
	-- alink
	INSERT INTO tblalink(site_code, `ClinicID`, `Codes`, `Typecode`, `ARTIss`, `DaExpiry`, `Dacreate`)
		    SELECT p_site_code, `ClinicID`, `Codes`, `Typecode`, `ARTIss`, `DaExpiry`, `Dacreate` FROM preart_temp.tblalink;      
	
	-- APNTT
	
	INSERT INTO tblapntt (site_code, ClinicID, DaVisit, SexHIV, Wsex, SexM, SexTran, Sex4, Drug, Pill, SexMoney, SexProvice, WOut, Agree, AsID) 
		     SELECT p_site_code, ClinicID, DaVisit, SexHIV, Wsex, SexM, SexTran, Sex4, Drug, Pill, SexMoney, SexProvice, WOut, Agree, AsID FROM preart_temp.tblapntt;
		      
	INSERT INTO tblapnttchild (site_code, APID, NumChild, Age,Sex, Grou, House, Street, Village, Commune, District, Province, Phone, PlanChild, PatientDate, SeviceDate, StatusHIV, Result, RegTreat, ClinicID, ArtNumber, Other, CAPID, AsID)
			  SELECT p_site_code, APID, NumChild, Age,Sex, Grou, House, Street, Village, Commune, District, Province, Phone, PlanChild, PatientDate, SeviceDate, StatusHIV, Result, RegTreat, ClinicID, ArtNumber, Other, CAPID, AsID FROM preart_temp.tblapnttchild;
	
	INSERT INTO tblapnttchildcont (site_code, id, `Dat`, `TypeContact`, `Contact`, `Confirm`, `CAPID`) 	
			      SELECT p_site_code, id, `Dat`, `TypeContact`, `Contact`, `Confirm`, `CAPID` FROM preart_temp.tblapnttchildcont;
	
	INSERT INTO tblapnttpart (site_code, `AsID`, `NumSexPart`, `NumPin`, `NumChildren`, `NumPart`, `Age`, `Sex`, `Grou`, `House`, `Street`, `Village`, `Commune`, `District`, `Province`, `Phone`, `RePatient`, `OtherPatient`, `IpvHit`, `IpvThreat` , `IpvSex`, `ProIPV`, `SupIPV`, `RefIPV`, `NotificationIPV`, `PatientDate`, `SeviceDate`, `StatusHIV`, `HTS`, `Result`, `RegTreat`, `ClinicID`, `ArtNumber`, `Other`, `APID`) 	
			 SELECT p_site_code, `AsID`, `NumSexPart`, `NumPin`, `NumChildren`, `NumPart`, `Age`, `Sex`, `Grou`, `House`, `Street`, `Village`, `Commune`, `District`, `Province`, `Phone`, `RePatient`, `OtherPatient`, `IpvHit`, `IpvThreat` , `IpvSex`, `ProIPV`, `SupIPV`, `RefIPV`, `NotificationIPV`, `PatientDate`, `SeviceDate`, `StatusHIV`, `HTS`, `Result`, `RegTreat`, `ClinicID`, `ArtNumber`, `Other`, `APID` FROM preart_temp.tblapnttpart;

	INSERT INTO tblapnttpartcont (site_code, id, `Dat`, `TypeContact`, `Contact`, `Confirm`, `APID`) 	
			     SELECT p_site_code, id, `Dat`, `TypeContact`, `Contact`, `Confirm`, `APID` FROM preart_temp.tblapnttpartcont;		       
	
	
	INSERT INTO tblappointment (site_code, `Vid`, `Doctore`, `Time`, `Att`) 	
			   SELECT p_site_code, `Vid`, `Doctore`, `Time`, `Att` FROM preart_temp.tblappointment;
			    
	INSERT INTO tblaumain(site_code, `ClinicID`,`Daupdate`, `Marital`,`Occupation` ,`HIVshow` ,`Relative` ,`Family` ,`Community` ,`Grou` ,`House` ,`Street` ,`Village` ,`Commune` ,`District` ,`Province` ,`Phone` ,`AddCont1`,`Phone1` ,`AddCont2`,`Phone2` ,`NGO`,`NameNGO`,`AUID`) 
		     SELECT p_site_code, `ClinicID`,`Daupdate`, `Marital`,`Occupation` ,`HIVshow` ,`Relative` ,`Family` ,`Community` ,`Grou` ,`House` ,`Street` ,`Village` ,`Commune` ,`District` ,`Province` ,`Phone` ,`AddCont1`,`Phone1` ,`AddCont2`,`Phone2` ,`NGO`,`NameNGO`,`AUID` FROM preart_temp.tblaumain;
	
	
	-- avmains
	INSERT INTO tblavarvdrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`) 	
		        SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid` FROM preart_temp.tblavarvdrug;
	
	INSERT INTO tblavhydrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`) 	
		       SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid` FROM preart_temp.tblavhydrug;

	INSERT INTO tblavmain (site_code, ClinicID, ARTnum, DatVisit, TypeVisit, Womenstatus, PregStatus, DaPreg, ANCservice, Weight, Height, Temp, Pulse, Resp, Blood, STIPreven, ARTAdher, Birthspac, TBinfect, Partner, Condoms, CMTypeClient, CMDaUse, CMCondom, CoC, Poc, CMVaccine, UseOther, OCMcondom, OCoc, OPoC, OCMVaccin, OCMother, Cough, Fever, Wlost, Drenching, Urine, Genital, Chemnah, Hospital, NumDay, CauseHospital, MissARV, MissTime, WHO, Eligible, TestID, `FUNCTION`, TB, TypeTB, TBtreat, DaTBtreat, TestHIV, ResultHIV, ReCD4, ReVL, ReHCV, CrAG, CrAGResult, VLDetectable, Referred, OReferred, Moderate, Renal, Rash, Hepatitis, Peripheral, Neutropenia, Hyperlipidemia, Lactic, Hypersensitivity, Jaundice, MTother, ARVreg, ResultHC, TPTout, TBout, DaApp, Vid, Foworker, Country) 
		      SELECT p_site_code, ClinicID, ARTnum, DatVisit, TypeVisit, Womenstatus, PregStatus, DaPreg, ANCservice, Weight, Height, Temp, Pulse, Resp, Blood, STIPreven, ARTAdher, Birthspac, TBinfect, Partner, Condoms, CMTypeClient, CMDaUse, CMCondom, CoC, Poc, CMVaccine, UseOther, OCMcondom, OCoc, OPoC, OCMVaccin, OCMother, Cough, Fever, Wlost, Drenching, Urine, Genital, Chemnah, Hospital, NumDay, CauseHospital, MissARV, MissTime, WHO, Eligible, TestID, `FUNCTION`, TB, TypeTB, TBtreat, DaTBtreat, TestHIV, ResultHIV, ReCD4, ReVL, ReHCV, CrAG, CrAGResult, VLDetectable, Referred, OReferred, Moderate, Renal, Rash, Hepatitis, Peripheral, Neutropenia, Hyperlipidemia, Lactic, Hypersensitivity, Jaundice, MTother, ARVreg, ResultHC, TPTout, TBout, DaApp, Vid, Foworker, Country FROM preart_temp.tblavmain;
	      
	INSERT INTO tblavoidrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`) 	
		       SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid` FROM preart_temp.tblavoidrug;
	
	INSERT INTO tblavpatientstatus(site_code, ClinicID, `Status`, Place, OPlace, Da, Cause, Vid) 
			      SELECT p_site_code, ClinicID, `Status`, Place, OPlace, Da, Cause, Vid FROM preart_temp.tblavpatientstatus; 

	INSERT INTO tblavtbdrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`) 	
		       SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid` FROM preart_temp.tblavtbdrug;
	
	INSERT INTO tblavtptdrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`) 	
		        SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid` FROM preart_temp.tblavtptdrug;
		         
	
	
	-- c
	INSERT INTO  tblcart(site_code, ClinicID, ART, DaArt) 
		    SELECT p_site_code, ClinicID, ART, DaArt FROM preart_temp.tblcart; 
	
	
	-- ci
	INSERT INTO tblciallergy(site_code, id, `ClinicID`, `DrugName`, `Allergy`)
			SELECT p_site_code, id, `ClinicID`, `DrugName`, `Allergy` FROM preart_temp.tblciallergy;
	
	INSERT INTO tblcicotrim(site_code, id, ClinicID, ClinicName, StartDate, StopDate, ReasonStop)
		      SELECT p_site_code, id, ClinicID, ClinicName, StartDate, StopDate, ReasonStop FROM preart_temp.tblcicotrim;
			
	INSERT INTO tblcifamily(site_code, id, `ClinicID`, `Faminily`, `Age`, `HIVstatus`, `Status`, `StartARV`, `Pregnant`, `SiteName`, `HTB`)
		       SELECT p_site_code, id, `ClinicID`, `Faminily`, `Age`, `HIVstatus`, `Status`, `StartARV`, `Pregnant`, `SiteName`, `HTB` FROM preart_temp.tblcifamily;
			  
	INSERT INTO tblcifluconazole(site_code, id, ClinicID, ClinicName, StartDate, StopDate, ReasonStop)
			    SELECT p_site_code, id, ClinicID, ClinicName, StartDate, StopDate, ReasonStop FROM preart_temp.tblcifluconazole;

	INSERT INTO tblcimain(site_code, ClinicID, DaFirstVisit, LClinicID, DaBirth, Sex, Referred, Oreferred, EClinicID, DaTest, TypeTest, Vcctcode, VcctID, OffIn, SiteName, DaART, Artnum, Feeding, TbPast, TypeTB, ResultTB, Daonset, Tbtreat, Datreat, ResultTreat, DaResultTreat, Inh, TPTdrug, DaStartTPT,DaEndTPT, OtherPast, Cotrim, Fluco, Allergy, ClinicIDold, SiteNameOld, Nationality) 
		     SELECT p_site_code, ClinicID, DaFirstVisit, LClinicID, DaBirth, Sex, Referred, Oreferred, EClinicID, DaTest, TypeTest, Vcctcode, VcctID, OffIn, SiteName, DaART, Artnum, Feeding, TbPast, TypeTB, ResultTB, Daonset, Tbtreat, Datreat, ResultTreat, DaResultTreat, Inh, TPTdrug, DaStartTPT,DaEndTPT, OtherPast, Cotrim, Fluco, Allergy, ClinicIDold, SiteNameOld, Nationality FROM preart_temp.tblcimain; 

	INSERT INTO tblciothpast(site_code, id, ClinicID, DrugName, Clinic, DaStart, DaStop, Note)
			SELECT p_site_code, id, ClinicID, DrugName, Clinic, DaStart, DaStop, Note FROM preart_temp.tblciothpast;
			 	
	INSERT INTO tblclink(site_code, `ClinicID`, `Codes`, `Typecode`, `ARTIss`, `DaExpiry`, `Dacreate`)
		    SELECT p_site_code, `ClinicID`, `Codes`, `Typecode`, `ARTIss`, `DaExpiry`, `Dacreate` FROM preart_temp.tblclink;
		     
	INSERT INTO tblcumain(site_code, `ClinicID`, `Daupdate`, `AddGuardian`, `Grou`, `House`, `Street`, `Village`, `Commune`, `District`, `Province`, `AddContact`, `Phone`, `ChildStatus`, `Foccupation`, `Moccupation`, `Education`, `ChildSupport`, `Vaccine`, `CUID`) 	
		     SELECT p_site_code, `ClinicID`, `Daupdate`, `AddGuardian`, `Grou`, `House`, `Street`, `Village`, `Commune`, `District`, `Province`, `AddContact`, `Phone`, `ChildStatus`, `Foccupation`, `Moccupation`, `Education`, `ChildSupport`, `Vaccine`, `CUID` FROM preart_temp.tblcumain;

	-- cvmains	      
	INSERT INTO tblcvmain(site_code, ClinicID, ARTnum, DatVisit, TypeVisit, Temp, Pulse, Resp, Blood, Weight, Height, Malnutrition, WH, PTB, Wlost, Cough, Fever, Enlarg, Hospital, NumDay, CauseHospital, Miss1, Miss1Time, Miss3, Miss3Time, `FUNCTION`, WHO, Eligible, Treatfail, TypeFail, TB, TypeTB, TBtreat, DaTBtreat, TestID, TestHIV, ResultHIV, ReCD4, ReVL, CrAG, CrAGResult, VLDetectable, Referred, OReferred, DaApp, Vid, TPTout) 
		     SELECT p_site_code, ClinicID, ARTnum, DatVisit, TypeVisit, Temp, Pulse, Resp, Blood, Weight, Height, Malnutrition, WH, PTB, Wlost, Cough, Fever, Enlarg, Hospital, NumDay, CauseHospital, Miss1, Miss1Time, Miss3, Miss3Time, `FUNCTION`, WHO, Eligible, Treatfail, TypeFail, TB, TypeTB, TBtreat, DaTBtreat, TestID, TestHIV, ResultHIV, ReCD4, ReVL, CrAG, CrAGResult, VLDetectable, Referred, OReferred, DaApp, Vid, TPTout FROM preart_temp.tblcvmain; 
	
	INSERT INTO tblcvarvdrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`) 	
		        SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid` FROM preart_temp.tblcvarvdrug;
	
	INSERT INTO  tblcvoidrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`) 	
		        SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`  FROM preart_temp.tblcvoidrug;
	
	
	INSERT INTO tblcvpatientstatus(site_code, ClinicID, `Status`, Place, OPlace, Da, Cause, Vid) 
			      SELECT p_site_code, ClinicID, `Status`, Place, OPlace, Da, Cause, Vid FROM preart_temp.tblcvpatientstatus; 
	
	INSERT INTO  tblcvtbdrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`) 	
		        SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`  FROM preart_temp.tblcvtbdrug;
		         
	INSERT INTO tblcvtptdrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`) 	
		        SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid` FROM preart_temp.tblcvtptdrug;
		         
		         
	-- eimains Expo Infant : Load data
	INSERT INTO tbleimain(site_code, `ClinicID`, `DafirstVisit`, `DaBirth`, `Sex`, `AddGuardian`, `Grou`, `House`, `Street`, `Village`, `Commune`, `District`, `Province`, `NameContact`, `AddContact`, `Phone`, `Fage`, `FHIV`, `Fstatus`, `Mage`, `MClinicID`, `MArt`, `HospitalName`, `Mstatus`, `CatPlaceDelivery`, `PlaceDelivery`, `PMTCT`, `DaDelivery`, `DeliveryStatus`, `LenBaby`, `WBaby`, `KnownHIV`, `Received`, `Syrup`, `Cotrim`, `Offin`, `SiteName`, `HIVtest`, `MHIV`, `MLastvl`, `DaMLastvl`, `EOClinicID`)
		     SELECT p_site_code, `ClinicID`, `DafirstVisit`, `DaBirth`, `Sex`, `AddGuardian`, `Grou`, `House`, `Street`, `Village`, `Commune`, `District`, `Province`, `NameContact`, `AddContact`, `Phone`, `Fage`, `FHIV`, `Fstatus`, `Mage`, `MClinicID`, `MArt`, `HospitalName`, `Mstatus`, `CatPlaceDelivery`, `PlaceDelivery`, `PMTCT`, `DaDelivery`, `DeliveryStatus`, `LenBaby`, `WBaby`, `KnownHIV`, `Received`, `Syrup`, `Cotrim`, `Offin`, `SiteName`, `HIVtest`, `MHIV`, `MLastvl`, `DaMLastvl`, `EOClinicID` FROM preart_temp.tbleimain;
		
	INSERT INTO tblelink(site_code, `ClinicID`, `Codes`, `Typecode`, `ARTIss`, `DaExpiry`, `Dacreate`)
		    SELECT p_site_code, `ClinicID`, `Codes`, `Typecode`, `ARTIss`, `DaExpiry`, `Dacreate` FROM preart_temp.tblelink;
	
	INSERT INTO tbletest(site_code, `ClinicID`, `DNAPcr`, `DaPcrArr`, `OI`, `DaBlood`, `LabID`, `DaReceive`, `DaAnalys`, `Result`, `DaRresult`, `DBS`, `Technic`, `ResultIn`, `Other`, `TID`)
		    SELECT p_site_code, `ClinicID`, `DNAPcr`, `DaPcrArr`, `OI`, `DaBlood`, `LabID`, `DaReceive`, `DaAnalys`, `Result`, `DaRresult`, `DBS`, `Technic`, `ResultIn`, `Other`, `TID` FROM preart_temp.tbletest;
	
	INSERT INTO tblevarvdrug(site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid`)
			SELECT p_site_code, id, `DrugName`, `Dose`, `Quantity`, `Freq`, `Form`, `Status`, `Da`, `Reason`, `Remark`, `Vid` FROM preart_temp.tblevarvdrug;
	
	INSERT INTO tblevmain(site_code, `ClinicID`, `DatVisit`, `TypeVisit`, `Temp`, `Pulse`, `Resp`, `Head`, `Weight`, `Height`, `Malnutrition`, `WH`, `BCG`, `OPV`, `Measles`, `Other`, `Feeding`, `DNA`, `DaResult`, `Vid`, `DNAPre`, `TestID`, `DaApp`, `Antibody`, `DaAntibody`, `Antiaffeeding`, `OtherDNA`)
		     SELECT p_site_code, `ClinicID`, `DatVisit`, `TypeVisit`, `Temp`, `Pulse`, `Resp`, `Head`, `Weight`, `Height`, `Malnutrition`, `WH`, `BCG`, `OPV`, `Measles`, `Other`, `Feeding`, `DNA`, `DaResult`, `Vid`, `DNAPre`, `TestID`, `DaApp`, `Antibody`, `DaAntibody`, `Antiaffeeding`, `OtherDNA` FROM preart_temp.tblevmain;
		
	INSERT INTO tblevpatientstatus(site_code, `ClinicID`, `Status`, `DaStatus`, `Vid`, `transfer_to_site`)
		   	      SELECT p_site_code, `ClinicID`, `Status`, `DaStatus`, `Vid`, `transfer_to_site` FROM preart_temp.tblevpatientstatus;
				
				
				
	-- tblpatienttests		   
	INSERT INTO tblpatienttest(site_code, TestID, ClinicID, DaArrival, Dat, DaCollect, CD4Rapid, CD4, CD, CD8, HIVLoad, HIVLog, HCV, HCVlog, HIVAb, HBsAg, HCVPCR, HBeAg, TPHA, AntiHBcAb, RPR, AntiHBeAb, RPRab, HCVAb, HBsAb, WBC, Neutrophils, HGB, Eosinophis, HCT, Lymphocyte, MCV, Monocyte, PLT, Reticulocte, Prothrombin, ProReticulocyte, Creatinine, HDL, Bilirubin, Glucose, Sodium, AlPhosphate, GotASAT, Potassium, Amylase, GPTALAT, Chloride, CK, CHOL, Bicarbonate, Lactate, Triglyceride, Urea, Magnesium, Phosphorus, Calcium, BHCG, SputumAFB, AFBCulture, AFBCulture1, UrineMicroscopy, UrineComment, CSFCell, CSFGram, CSFAFB, CSFIndian, CSFCCag, CSFProtein, CSFGlucose, BloodCulture, BloodCulture0, BloodCulture1, BloodCulture10, CTNA, GCNA, CXR, Abdominal) 
			  SELECT p_site_code, TestID, ClinicID, DaArrival, Dat, DaCollect, CD4Rapid, CD4, CD, CD8, HIVLoad, HIVLog, HCV, HCVlog, HIVAb, HBsAg, HCVPCR, HBeAg, TPHA, AntiHBcAb, RPR, AntiHBeAb, RPRab, HCVAb, HBsAb, WBC, Neutrophils, HGB, Eosinophis, HCT, Lymphocyte, MCV, Monocyte, PLT, Reticulocte, Prothrombin, ProReticulocyte, Creatinine, HDL, Bilirubin, Glucose, Sodium, AlPhosphate, GotASAT, Potassium, Amylase, GPTALAT, Chloride, CK, CHOL, Bicarbonate, Lactate, Triglyceride, Urea, Magnesium, Phosphorus, Calcium, BHCG, SputumAFB, AFBCulture, AFBCulture1, UrineMicroscopy, UrineComment, CSFCell, CSFGram, CSFAFB, CSFIndian, CSFCCag, CSFProtein, CSFGlucose, BloodCulture, BloodCulture0, BloodCulture1, BloodCulture10, CTNA, GCNA, CXR, Abdominal FROM preart_temp.tblpatienttest;
	
	INSERT INTO tblpatienttestabdominal(site_code, id, TestID, Abdo, Abdo1, Abdo2)
				   SELECT p_site_code, id, TestID, Abdo, Abdo1, Abdo2  FROM preart_temp.tblpatienttestabdominal;
	
	INSERT INTO tblpatienttestcxr(site_code, id, TestID, CXR, CXR1, CXR2) 	
			     SELECT p_site_code, id, TestID, CXR, CXR1, CXR2  FROM preart_temp.tblpatienttestcxr;
			      
	
	INSERT INTO tbldoctor(site_code, `Did`, `Name`, `Status`) 	
		     SELECT p_site_code, `Did`, `Name`, `Status` FROM preart_temp.tbldoctor;
				
END */$$
DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
