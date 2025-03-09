-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 08, 2025 at 11:51 AM
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
-- Database: `cryptichackerspirit11`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard`
--

CREATE TABLE `leaderboard` (
  `user_id` int(11) NOT NULL,
  `total_points` int(11) DEFAULT 0,
  `rank` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

CREATE TABLE `players` (
  `player_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `university` varchar(100) NOT NULL,
  `category` enum('Batsman','Bowler','All-Rounder') NOT NULL,
  `total_runs` int(11) DEFAULT 0,
  `balls_faced` int(11) DEFAULT 0,
  `innings_played` int(11) DEFAULT 0,
  `wickets` int(11) DEFAULT 0,
  `overs_bowled` int(11) DEFAULT 0,
  `runs_conceded` int(11) DEFAULT 0,
  `player_value` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `players`
--

INSERT INTO `players` (`player_id`, `name`, `university`, `category`, `total_runs`, `balls_faced`, `innings_played`, `wickets`, `overs_bowled`, `runs_conceded`, `player_value`) VALUES
(1, 'Chamika Chandimal', 'University of the Visual & Performing Arts', 'Batsman', 530, 588, 10, 0, 3, 21, 0.00),
(2, 'Dimuth Dhananjaya', 'University of the Visual & Performing Arts', 'All-Rounder', 250, 208, 10, 8, 40, 240, 0.00),
(3, 'Avishka Mendis', 'Eastern University', 'All-Rounder', 210, 175, 7, 7, 35, 210, 0.00),
(4, 'Danushka Kumara', 'University of the Visual & Performing Arts', 'Batsman', 780, 866, 15, 0, 5, 35, 0.00),
(5, 'Praveen Vandersay', 'Eastern University', 'Batsman', 329, 365, 7, 0, 3, 24, 0.00),
(6, 'Niroshan Mathews', 'University of the Visual & Performing Arts', 'Batsman', 275, 305, 5, 0, 2, 18, 0.00),
(7, 'Chaturanga Gunathilaka', 'University of Moratuwa', 'Bowler', 132, 264, 11, 29, 88, 528, 0.00),
(8, 'Lahiru Rathnayake', 'University of Ruhuna', 'Batsman', 742, 824, 14, 0, 1, 8, 0.00),
(9, 'Jeewan Thirimanne', 'University of Jaffna', 'Batsman', 780, 866, 15, 0, 3, 24, 0.00),
(10, 'Kalana Samarawickrama', 'Eastern University', 'Batsman', 728, 808, 14, 0, 4, 32, 0.00),
(11, 'Lakshan Vandersay', 'University of the Visual & Performing Arts', 'All-Rounder', 405, 337, 15, 15, 75, 450, 0.00),
(12, 'Roshen Samarawickrama', 'University of Kelaniya', 'Bowler', 140, 280, 14, 46, 140, 560, 0.00),
(13, 'Sammu Sandakan', 'University of Ruhuna', 'Bowler', 120, 240, 10, 26, 80, 320, 0.00),
(14, 'Kalana Jayawardene', 'University of Jaffna', 'Bowler', 120, 240, 10, 33, 100, 400, 0.00),
(15, 'Binura Samarawickrama', 'University of the Visual & Performing Arts', 'Bowler', 77, 154, 7, 21, 63, 252, 0.00),
(16, 'Dasun Thirimanne', 'Eastern University', 'Bowler', 121, 242, 11, 29, 88, 440, 0.00),
(17, 'Angelo Samarawickrama', 'University of Kelaniya', 'Batsman', 424, 471, 8, 0, 1, 7, 0.00),
(18, 'Nuwan Jayawickrama', 'University of Ruhuna', 'Batsman', 300, 333, 6, 0, 3, 27, 0.00),
(19, 'Kusal Dhananjaya', 'South Eastern University', 'Batsman', 480, 533, 10, 0, 2, 16, 0.00),
(20, 'Chamika Bandara', 'Eastern University', 'Batsman', 270, 300, 5, 0, 5, 45, 0.00),
(21, 'Dilruwan Shanaka', 'University of Peradeniya', 'Batsman', 384, 426, 8, 0, 5, 45, 0.00),
(22, 'Danushka Jayawickrama', 'University of Peradeniya', 'All-Rounder', 350, 291, 14, 14, 70, 350, 0.00),
(23, 'Charith Shanaka', 'University of Colombo', 'Batsman', 477, 530, 9, 0, 3, 27, 0.00),
(24, 'Asela Nissanka', 'University of Sri Jayewardenepura', 'Batsman', 765, 850, 15, 0, 0, 1, 0.00),
(25, 'Wanindu Hasaranga', 'University of Colombo', 'Bowler', 120, 240, 10, 30, 90, 540, 0.00),
(26, 'Asela Vandersay', 'University of the Visual & Performing Arts', 'Bowler', 154, 308, 14, 37, 112, 448, 0.00),
(27, 'Pathum Fernando', 'University of Peradeniya', 'Batsman', 450, 500, 10, 0, 2, 18, 0.00),
(28, 'Angelo Kumara', 'Eastern University', 'Batsman', 330, 366, 6, 0, 1, 8, 0.00),
(29, 'Danushka Rajapaksa', 'University of Peradeniya', 'Batsman', 441, 490, 9, 0, 5, 35, 0.00),
(30, 'Suranga Shanaka', 'South Eastern University', 'Bowler', 55, 110, 5, 13, 40, 160, 0.00),
(31, 'Pathum Dhananjaya', 'Eastern University', 'Batsman', 360, 400, 8, 0, 1, 9, 0.00),
(32, 'Asela Asalanka', 'South Eastern University', 'Batsman', 550, 611, 11, 0, 0, 1, 0.00),
(33, 'Minod Rathnayake', 'University of Kelaniya', 'Bowler', 154, 308, 14, 37, 112, 448, 0.00),
(34, 'Binura Lakmal', 'University of Kelaniya', 'Batsman', 540, 600, 12, 0, 2, 16, 0.00),
(35, 'Praveen Asalanka', 'Eastern University', 'Batsman', 477, 530, 9, 0, 1, 7, 0.00),
(36, 'Angelo Jayawardene', 'University of Jaffna', 'Batsman', 468, 520, 9, 0, 3, 21, 0.00),
(37, 'Kamindu Asalanka', 'University of Moratuwa', 'Bowler', 135, 270, 15, 45, 135, 810, 0.00),
(38, 'Sadeera Rajapaksa', 'University of Jaffna', 'All-Rounder', 275, 229, 11, 8, 44, 264, 0.00),
(39, 'Sandakan Hasaranga', 'University of Kelaniya', 'Batsman', 795, 883, 15, 0, 1, 7, 0.00),
(40, 'Bhanuka Rajapaksa', 'University of Moratuwa', 'All-Rounder', 364, 303, 14, 11, 56, 336, 0.00),
(41, 'Chamika Rajapaksa', 'University of Ruhuna', 'Batsman', 450, 500, 9, 0, 1, 7, 0.00),
(42, 'Kamindu Lakmal', 'University of the Visual & Performing Arts', 'Batsman', 780, 866, 15, 0, 5, 35, 0.00),
(43, 'Lakshan Gunathilaka', 'University of Peradeniya', 'Bowler', 84, 168, 7, 21, 63, 315, 0.00),
(44, 'Tharindu Thirimanne', 'South Eastern University', 'Batsman', 611, 678, 13, 0, 2, 18, 0.00),
(45, 'Dinesh Samarawickrama', 'University of Jaffna', 'Batsman', 400, 444, 8, 0, 3, 27, 0.00),
(46, 'Suranga Sandakan', 'University of Moratuwa', 'Batsman', 235, 261, 5, 0, 4, 36, 0.00),
(47, 'Sandakan Dickwella', 'University of Jaffna', 'Batsman', 368, 408, 8, 0, 3, 27, 0.00),
(48, 'Sammu Rajapaksa', 'University of Ruhuna', 'Batsman', 240, 266, 5, 0, 2, 16, 0.00),
(49, 'Suranga Bandara', 'University of Moratuwa', 'Bowler', 154, 308, 14, 46, 140, 840, 0.00),
(50, 'Tharindu Embuldeniya', 'University of the Visual & Performing Arts', 'All-Rounder', 264, 220, 12, 12, 60, 360, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `team_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `team_name` varchar(100) NOT NULL,
  `total_points` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `team_players`
--

CREATE TABLE `team_players` (
  `team_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `budget` decimal(10,2) DEFAULT 9000000.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`player_id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`team_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `team_players`
--
ALTER TABLE `team_players`
  ADD PRIMARY KEY (`team_id`,`player_id`),
  ADD KEY `player_id` (`player_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `players`
--
ALTER TABLE `players`
  MODIFY `player_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `team_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD CONSTRAINT `leaderboard_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `teams`
--
ALTER TABLE `teams`
  ADD CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `team_players`
--
ALTER TABLE `team_players`
  ADD CONSTRAINT `team_players_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `team_players_ibfk_2` FOREIGN KEY (`player_id`) REFERENCES `players` (`player_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
