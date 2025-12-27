-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Dec 27, 2025 at 11:38 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gear_guard`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_equipment_open_requests` (IN `p_equipment_id` INT, OUT `v_count` INT)   BEGIN
    SELECT COUNT(*) INTO v_count
    FROM maintenance_requests mr
    JOIN request_stages rs ON mr.stage_id = rs.stage_id
    WHERE mr.equipment_id = p_equipment_id
      AND rs.stage_name IN ('New', 'In Progress');
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `is_team_member` (IN `p_user_id` INT, IN `p_team_id` INT, OUT `v_exists` BOOLEAN)   BEGIN
    DECLARE count_result INT;
    SELECT COUNT(*) INTO count_result
    FROM team_members 
    WHERE user_id = p_user_id AND team_id = p_team_id;
    
    SET v_exists = (count_result > 0);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `department_name`, `created_at`) VALUES
(1, 'Production', '2025-12-27 11:32:26'),
(2, 'IT', '2025-12-27 11:32:26'),
(3, 'Maintenance', '2025-12-27 11:32:26'),
(4, 'Administration', '2025-12-27 11:32:26'),
(5, 'Quality Control', '2025-12-27 11:32:26');

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

CREATE TABLE `equipment` (
  `equipment_id` int(11) NOT NULL,
  `equipment_name` varchar(100) NOT NULL,
  `serial_number` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `warranty_expiry_date` date DEFAULT NULL,
  `warranty_info` text DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `assigned_employee_id` int(11) DEFAULT NULL,
  `maintenance_team_id` int(11) DEFAULT NULL,
  `default_technician_id` int(11) DEFAULT NULL,
  `is_scrapped` tinyint(1) DEFAULT 0,
  `scrap_date` date DEFAULT NULL,
  `scrap_reason` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`equipment_id`, `equipment_name`, `serial_number`, `category`, `category_id`, `purchase_date`, `warranty_expiry_date`, `warranty_info`, `location`, `department_id`, `assigned_employee_id`, `maintenance_team_id`, `default_technician_id`, `is_scrapped`, `scrap_date`, `scrap_reason`, `created_at`, `updated_at`) VALUES
(1, 'CNC Milling Machine 01', 'CNC-2023-001', 'CNC Machines', NULL, '2023-01-15', '2026-01-15', '3-year warranty, includes maintenance', 'Production Floor - Section A', 1, 10, 1, 8, 0, NULL, NULL, '2025-12-27 11:32:26', '2025-12-27 11:32:26'),
(2, 'Office Laptop - Dell XPS', 'LAP-2024-045', 'Computers', NULL, '2024-03-10', '2027-03-10', 'Extended warranty - on-site support', 'IT Department - Desk 5', 2, 7, 3, 8, 0, NULL, NULL, '2025-12-27 11:32:26', '2025-12-27 11:32:26'),
(3, 'Printer HP LaserJet Pro', 'PRN-2023-089', 'Office Equipment', NULL, '2023-06-20', '2025-06-20', 'Standard warranty', 'Administration - Reception', 4, NULL, 3, 8, 0, NULL, NULL, '2025-12-27 11:32:26', '2025-12-27 11:32:26'),
(4, 'Forklift - Toyota 8FGCU25', 'FLT-2022-012', 'Vehicles', NULL, '2022-11-05', NULL, 'Warranty expired', 'Warehouse - Bay 3', 1, 10, 1, 8, 0, NULL, NULL, '2025-12-27 11:32:26', '2025-12-27 11:32:26'),
(5, 'HVAC Unit - Building A', 'HVAC-2021-001', 'HVAC Systems', NULL, '2021-04-12', NULL, 'Warranty expired - maintenance contract active', 'Building A - Rooftop', 4, NULL, 4, 9, 0, NULL, NULL, '2025-12-27 11:32:26', '2025-12-27 11:32:26'),
(6, 'Server Rack - Main Data Center', 'SRV-2023-101', 'Computers', NULL, '2023-09-01', '2026-09-01', 'Premium support included', 'Data Center - Room 204', 2, NULL, 3, 8, 0, NULL, NULL, '2025-12-27 11:32:26', '2025-12-27 11:32:26');

-- --------------------------------------------------------

--
-- Stand-in structure for view `equipment_by_category`
-- (See below for the actual view)
--
CREATE TABLE `equipment_by_category` (
`category` varchar(100)
,`equipment_count` bigint(21)
,`active_count` bigint(21)
,`scrapped_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `equipment_categories`
--

CREATE TABLE `equipment_categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment_categories`
--

INSERT INTO `equipment_categories` (`category_id`, `category_name`, `description`, `created_at`) VALUES
(1, 'CNC Machines', 'Computer numerical control machines', '2025-12-27 11:32:26'),
(2, 'Vehicles', 'Company vehicles and forklifts', '2025-12-27 11:32:26'),
(3, 'Computers', 'Desktops, laptops, and servers', '2025-12-27 11:32:26'),
(4, 'HVAC Systems', 'Heating and cooling equipment', '2025-12-27 11:32:26'),
(5, 'Office Equipment', 'Printers, scanners, copiers', '2025-12-27 11:32:26');

-- --------------------------------------------------------

--
-- Stand-in structure for view `equipment_with_open_requests`
-- (See below for the actual view)
--
CREATE TABLE `equipment_with_open_requests` (
`equipment_id` int(11)
,`equipment_name` varchar(100)
,`serial_number` varchar(100)
,`category` varchar(50)
,`category_id` int(11)
,`purchase_date` date
,`warranty_expiry_date` date
,`warranty_info` text
,`location` varchar(100)
,`department_id` int(11)
,`assigned_employee_id` int(11)
,`maintenance_team_id` int(11)
,`default_technician_id` int(11)
,`is_scrapped` tinyint(1)
,`scrap_date` date
,`scrap_reason` text
,`created_at` datetime
,`updated_at` datetime
,`open_request_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_requests`
--

CREATE TABLE `maintenance_requests` (
  `request_id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `request_type` enum('Corrective','Preventive') NOT NULL,
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `equipment_id` int(11) NOT NULL,
  `maintenance_team_id` int(11) NOT NULL,
  `assigned_to` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `stage_id` int(11) NOT NULL,
  `scheduled_date` datetime DEFAULT NULL,
  `duration_hours` decimal(5,2) DEFAULT NULL,
  `date_start` datetime DEFAULT NULL,
  `is_overdue` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `completed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maintenance_requests`
--

INSERT INTO `maintenance_requests` (`request_id`, `subject`, `description`, `request_type`, `priority`, `equipment_id`, `maintenance_team_id`, `assigned_to`, `created_by`, `stage_id`, `scheduled_date`, `duration_hours`, `date_start`, `is_overdue`, `created_at`, `completed_at`) VALUES
(1, 'Leaking Oil from CNC Machine', 'CNC Machine 01 is leaking hydraulic oil from the base. Oil puddle forming on floor. Needs immediate attention to prevent damage.', 'Corrective', 'high', 1, 1, 8, 10, 2, NULL, NULL, '2025-12-27 09:32:26', 0, '2025-12-27 11:32:26', NULL),
(2, 'Laptop Not Starting', 'Dell XPS laptop shows black screen when power button is pressed. No beep, no lights. Suspected power supply issue.', 'Corrective', 'medium', 2, 3, NULL, 7, 1, NULL, NULL, NULL, 0, '2025-12-27 11:32:26', NULL),
(3, 'Printer Paper Jam', 'HP LaserJet Pro keeps jamming with every print job. Paper gets stuck in the middle. Tried cleaning but issue persists.', 'Corrective', 'low', 3, 3, NULL, 7, 1, NULL, NULL, NULL, 0, '2025-12-27 11:32:26', NULL),
(4, 'Monthly Forklift Inspection', 'Routine monthly inspection of forklift. Check hydraulic system, brakes, tires, and battery.', 'Preventive', 'medium', 4, 1, 8, 5, 3, '2025-12-30 00:00:00', 2.50, '2025-12-30 00:00:00', 0, '2025-12-27 11:32:26', '2025-12-30 00:00:00'),
(5, 'HVAC Filter Replacement', 'Quarterly filter replacement for Building A HVAC unit. Schedule during off-hours.', 'Preventive', 'low', 5, 4, NULL, 5, 1, '2026-01-03 00:00:00', NULL, NULL, 0, '2025-12-27 11:32:26', NULL),
(6, 'Server Backup Verification', 'Weekly server backup verification and log check. Ensure all backups are running correctly.', 'Preventive', 'medium', 6, 3, 8, 5, 3, '2025-12-26 00:00:00', 1.00, '2025-12-26 00:00:00', 0, '2025-12-27 11:32:26', '2025-12-26 00:00:00'),
(7, 'Forklift Battery Replacement', 'Forklift battery is no longer holding charge. Needs replacement. Order new battery first.', 'Corrective', 'urgent', 4, 1, NULL, 10, 1, NULL, NULL, NULL, 0, '2025-12-27 11:32:26', NULL);

--
-- Triggers `maintenance_requests`
--
DELIMITER $$
CREATE TRIGGER `trigger_equipment_scrap` AFTER UPDATE ON `maintenance_requests` FOR EACH ROW BEGIN
    IF NEW.stage_id = (SELECT stage_id FROM request_stages WHERE stage_name = 'Scrap')
       AND (OLD.stage_id IS NULL OR OLD.stage_id != NEW.stage_id) THEN
        UPDATE equipment
        SET is_scrapped = 1,
            scrap_date = CURDATE(),
            scrap_reason = COALESCE(NEW.description, NEW.subject, 'Scrapped via maintenance request')
        WHERE equipment_id = NEW.equipment_id;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trigger_log_request_changes` AFTER UPDATE ON `maintenance_requests` FOR EACH ROW BEGIN
    IF OLD.stage_id IS NULL OR OLD.stage_id != NEW.stage_id THEN
        INSERT INTO request_logs (request_id, action, old_stage, new_stage, action_by)
        VALUES (
            NEW.request_id,
            'Stage Changed',
            (SELECT stage_name FROM request_stages WHERE stage_id = OLD.stage_id),
            (SELECT stage_name FROM request_stages WHERE stage_id = NEW.stage_id),
            COALESCE(NEW.assigned_to, NEW.created_by)
        );
    END IF;
    
    IF (OLD.assigned_to IS NULL AND NEW.assigned_to IS NOT NULL) 
       OR (OLD.assigned_to IS NOT NULL AND NEW.assigned_to IS NULL)
       OR (OLD.assigned_to IS NOT NULL AND NEW.assigned_to IS NOT NULL AND OLD.assigned_to != NEW.assigned_to) THEN
        INSERT INTO request_logs (request_id, action, action_by)
        VALUES (
            NEW.request_id,
            'Assignment Changed',
            COALESCE(NEW.assigned_to, NEW.created_by)
        );
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trigger_update_overdue_before_insert` BEFORE INSERT ON `maintenance_requests` FOR EACH ROW BEGIN
    IF NEW.request_type = 'Preventive' 
       AND NEW.scheduled_date IS NOT NULL
       AND NEW.scheduled_date < NOW()
       AND NEW.stage_id NOT IN (
           SELECT stage_id FROM request_stages WHERE stage_name IN ('Repaired', 'Scrap')
       ) THEN
        SET NEW.is_overdue = 1;
    ELSE
        SET NEW.is_overdue = 0;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trigger_update_overdue_before_update` BEFORE UPDATE ON `maintenance_requests` FOR EACH ROW BEGIN
    IF NEW.request_type = 'Preventive' 
       AND NEW.scheduled_date IS NOT NULL
       AND NEW.scheduled_date < NOW()
       AND NEW.stage_id NOT IN (
           SELECT stage_id FROM request_stages WHERE stage_name IN ('Repaired', 'Scrap')
       ) THEN
        SET NEW.is_overdue = 1;
    ELSE
        SET NEW.is_overdue = 0;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_teams`
--

CREATE TABLE `maintenance_teams` (
  `team_id` int(11) NOT NULL,
  `team_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maintenance_teams`
--

INSERT INTO `maintenance_teams` (`team_id`, `team_name`, `description`, `created_at`) VALUES
(1, 'Mechanics', 'Handles mechanical repairs and maintenance', '2025-12-27 11:32:26'),
(2, 'Electricians', 'Electrical system repairs and installations', '2025-12-27 11:32:26'),
(3, 'IT Support', 'Computer and network support', '2025-12-27 11:32:26'),
(4, 'HVAC Team', 'Heating, ventilation, and air conditioning', '2025-12-27 11:32:26'),
(5, 'General Maintenance', 'General facility maintenance tasks', '2025-12-27 11:32:26');

-- --------------------------------------------------------

--
-- Table structure for table `request_logs`
--

CREATE TABLE `request_logs` (
  `log_id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `action` varchar(100) DEFAULT NULL,
  `old_stage` varchar(20) DEFAULT NULL,
  `new_stage` varchar(20) DEFAULT NULL,
  `action_by` int(11) DEFAULT NULL,
  `action_time` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `request_stages`
--

CREATE TABLE `request_stages` (
  `stage_id` int(11) NOT NULL,
  `stage_name` varchar(20) NOT NULL,
  `sequence_no` int(11) NOT NULL,
  `is_closed` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `request_stages`
--

INSERT INTO `request_stages` (`stage_id`, `stage_name`, `sequence_no`, `is_closed`, `created_at`) VALUES
(1, 'New', 1, 0, '2025-12-27 09:56:19'),
(2, 'In Progress', 2, 0, '2025-12-27 09:56:19'),
(3, 'Repaired', 3, 1, '2025-12-27 09:56:19'),
(4, 'Scrap', 4, 1, '2025-12-27 09:56:19');

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `team_member_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `team_members`
--

INSERT INTO `team_members` (`team_member_id`, `team_id`, `user_id`, `created_at`) VALUES
(1, 1, 8, '2025-12-27 11:32:26'),
(2, 2, 9, '2025-12-27 11:32:26'),
(3, 3, 8, '2025-12-27 11:32:26');

-- --------------------------------------------------------

--
-- Stand-in structure for view `team_performance`
-- (See below for the actual view)
--
CREATE TABLE `team_performance` (
`team_id` int(11)
,`team_name` varchar(100)
,`total_requests` bigint(21)
,`corrective_count` bigint(21)
,`preventive_count` bigint(21)
,`avg_duration_hours` decimal(9,6)
,`overdue_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('admin','manager','technician','employee') NOT NULL,
  `avatar_url` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `password_hash` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `role`, `avatar_url`, `is_active`, `created_at`, `password_hash`) VALUES
(4, 'Admin User', 'admin@test.com', 'admin', NULL, 1, '2025-12-27 11:04:06', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(5, 'Manager One', 'manager@test.com', 'manager', NULL, 1, '2025-12-27 11:04:06', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(6, 'Technician One', 'tech@test.com', 'technician', NULL, 1, '2025-12-27 11:04:06', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(7, 'Employee One', 'employee@test.com', 'employee', NULL, 1, '2025-12-27 11:04:06', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(8, 'Technician One', 'tech1@test.com', 'technician', NULL, 1, '2025-12-27 11:32:26', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(9, 'Technician Two', 'tech2@test.com', 'technician', NULL, 1, '2025-12-27 11:32:26', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(10, 'John Smith', 'john@test.com', 'employee', NULL, 1, '2025-12-27 11:32:26', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- --------------------------------------------------------

--
-- Structure for view `equipment_by_category`
--
DROP TABLE IF EXISTS `equipment_by_category`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `equipment_by_category`  AS SELECT coalesce(`e`.`category`,`ec`.`category_name`,'Uncategorized') AS `category`, count(0) AS `equipment_count`, count(case when `e`.`is_scrapped` = 0 then 1 end) AS `active_count`, count(case when `e`.`is_scrapped` = 1 then 1 end) AS `scrapped_count` FROM (`equipment` `e` left join `equipment_categories` `ec` on(`e`.`category_id` = `ec`.`category_id`)) GROUP BY coalesce(`e`.`category`,`ec`.`category_name`,'Uncategorized') ;

-- --------------------------------------------------------

--
-- Structure for view `equipment_with_open_requests`
--
DROP TABLE IF EXISTS `equipment_with_open_requests`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `equipment_with_open_requests`  AS SELECT `e`.`equipment_id` AS `equipment_id`, `e`.`equipment_name` AS `equipment_name`, `e`.`serial_number` AS `serial_number`, `e`.`category` AS `category`, `e`.`category_id` AS `category_id`, `e`.`purchase_date` AS `purchase_date`, `e`.`warranty_expiry_date` AS `warranty_expiry_date`, `e`.`warranty_info` AS `warranty_info`, `e`.`location` AS `location`, `e`.`department_id` AS `department_id`, `e`.`assigned_employee_id` AS `assigned_employee_id`, `e`.`maintenance_team_id` AS `maintenance_team_id`, `e`.`default_technician_id` AS `default_technician_id`, `e`.`is_scrapped` AS `is_scrapped`, `e`.`scrap_date` AS `scrap_date`, `e`.`scrap_reason` AS `scrap_reason`, `e`.`created_at` AS `created_at`, `e`.`updated_at` AS `updated_at`, count(case when `mr`.`stage_id` in (select `request_stages`.`stage_id` from `request_stages` where `request_stages`.`stage_name` in ('New','In Progress')) then 1 end) AS `open_request_count` FROM (`equipment` `e` left join `maintenance_requests` `mr` on(`mr`.`equipment_id` = `e`.`equipment_id`)) WHERE `e`.`is_scrapped` = 0 GROUP BY `e`.`equipment_id` ;

-- --------------------------------------------------------

--
-- Structure for view `team_performance`
--
DROP TABLE IF EXISTS `team_performance`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `team_performance`  AS SELECT `mt`.`team_id` AS `team_id`, `mt`.`team_name` AS `team_name`, count(`mr`.`request_id`) AS `total_requests`, count(case when `mr`.`request_type` = 'Corrective' then 1 end) AS `corrective_count`, count(case when `mr`.`request_type` = 'Preventive' then 1 end) AS `preventive_count`, avg(`mr`.`duration_hours`) AS `avg_duration_hours`, count(case when `mr`.`is_overdue` = 1 then 1 end) AS `overdue_count` FROM (`maintenance_teams` `mt` left join `maintenance_requests` `mr` on(`mr`.`maintenance_team_id` = `mt`.`team_id`)) GROUP BY `mt`.`team_id`, `mt`.`team_name` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`),
  ADD UNIQUE KEY `department_name` (`department_name`);

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`equipment_id`),
  ADD UNIQUE KEY `serial_number` (`serial_number`),
  ADD KEY `default_technician_id` (`default_technician_id`),
  ADD KEY `idx_equipment_department` (`department_id`),
  ADD KEY `idx_equipment_category` (`category_id`),
  ADD KEY `idx_equipment_team` (`maintenance_team_id`),
  ADD KEY `idx_equipment_serial` (`serial_number`),
  ADD KEY `idx_equipment_scrapped` (`is_scrapped`),
  ADD KEY `idx_equipment_employee` (`assigned_employee_id`);

--
-- Indexes for table `equipment_categories`
--
ALTER TABLE `equipment_categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- Indexes for table `maintenance_requests`
--
ALTER TABLE `maintenance_requests`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `idx_requests_equipment` (`equipment_id`),
  ADD KEY `idx_requests_team` (`maintenance_team_id`),
  ADD KEY `idx_requests_stage` (`stage_id`),
  ADD KEY `idx_requests_assigned` (`assigned_to`),
  ADD KEY `idx_requests_scheduled` (`scheduled_date`),
  ADD KEY `idx_requests_type` (`request_type`),
  ADD KEY `idx_requests_overdue` (`is_overdue`),
  ADD KEY `idx_requests_created_by` (`created_by`),
  ADD KEY `idx_requests_priority` (`priority`);

--
-- Indexes for table `maintenance_teams`
--
ALTER TABLE `maintenance_teams`
  ADD PRIMARY KEY (`team_id`),
  ADD UNIQUE KEY `team_name` (`team_name`);

--
-- Indexes for table `request_logs`
--
ALTER TABLE `request_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `idx_logs_request` (`request_id`),
  ADD KEY `idx_logs_action_time` (`action_time`),
  ADD KEY `idx_logs_action_by` (`action_by`);

--
-- Indexes for table `request_stages`
--
ALTER TABLE `request_stages`
  ADD PRIMARY KEY (`stage_id`),
  ADD UNIQUE KEY `stage_name` (`stage_name`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`team_member_id`),
  ADD UNIQUE KEY `unique_team_user` (`team_id`,`user_id`),
  ADD KEY `idx_team_members_team` (`team_id`),
  ADD KEY `idx_team_members_user` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `equipment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `equipment_categories`
--
ALTER TABLE `equipment_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `maintenance_requests`
--
ALTER TABLE `maintenance_requests`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `maintenance_teams`
--
ALTER TABLE `maintenance_teams`
  MODIFY `team_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `request_logs`
--
ALTER TABLE `request_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `request_stages`
--
ALTER TABLE `request_stages`
  MODIFY `stage_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `team_members`
--
ALTER TABLE `team_members`
  MODIFY `team_member_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `equipment`
--
ALTER TABLE `equipment`
  ADD CONSTRAINT `equipment_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `equipment_categories` (`category_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `equipment_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `equipment_ibfk_3` FOREIGN KEY (`assigned_employee_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `equipment_ibfk_4` FOREIGN KEY (`maintenance_team_id`) REFERENCES `maintenance_teams` (`team_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `equipment_ibfk_5` FOREIGN KEY (`default_technician_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `maintenance_requests`
--
ALTER TABLE `maintenance_requests`
  ADD CONSTRAINT `maintenance_requests_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`),
  ADD CONSTRAINT `maintenance_requests_ibfk_2` FOREIGN KEY (`maintenance_team_id`) REFERENCES `maintenance_teams` (`team_id`),
  ADD CONSTRAINT `maintenance_requests_ibfk_3` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `maintenance_requests_ibfk_4` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `maintenance_requests_ibfk_5` FOREIGN KEY (`stage_id`) REFERENCES `request_stages` (`stage_id`);

--
-- Constraints for table `request_logs`
--
ALTER TABLE `request_logs`
  ADD CONSTRAINT `request_logs_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `maintenance_requests` (`request_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `request_logs_ibfk_2` FOREIGN KEY (`action_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `team_members`
--
ALTER TABLE `team_members`
  ADD CONSTRAINT `team_members_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `maintenance_teams` (`team_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `team_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
