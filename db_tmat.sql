-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 24, 2025 at 07:29 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_tmat`
--

-- --------------------------------------------------------

--
-- Table structure for table `api_audit_logs`
--

CREATE TABLE `api_audit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `timestamp_request` datetime NOT NULL,
  `api_key` varchar(128) NOT NULL,
  `user_id` int(11) DEFAULT NULL COMMENT 'Optional: User/Perusahaan ID dari API Key',
  `resource_path` varchar(255) NOT NULL COMMENT 'Contoh: /api/v1/realtime/push atau /api/portal/v1/site',
  `method` varchar(10) NOT NULL COMMENT 'GET, POST, PUT, DELETE',
  `http_status` smallint(3) NOT NULL COMMENT 'Contoh: 200, 404, 500',
  `request_data` text DEFAULT NULL COMMENT 'Data POST/Body request (dibatasi ukurannya)',
  `response_length` int(11) DEFAULT 0 COMMENT 'Ukuran response body dalam bytes',
  `response_time_ms` int(11) DEFAULT NULL COMMENT 'Waktu eksekusi API dalam milidetik',
  `ip_address` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_keys`
--

CREATE TABLE `api_keys` (
  `id` int(11) NOT NULL,
  `id_perusahaan` int(11) NOT NULL,
  `key_value` varchar(128) NOT NULL,
  `level` int(2) NOT NULL,
  `ignore_limits` tinyint(1) NOT NULL DEFAULT 0,
  `date_created` int(11) NOT NULL,
  `status` enum('aktif','nonaktif') NOT NULL DEFAULT 'aktif'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `api_keys`
--

INSERT INTO `api_keys` (`id`, `id_perusahaan`, `key_value`, `level`, `ignore_limits`, `date_created`, `status`) VALUES
(1, 1, 'KLHK-GLJ-1234567890', 1, 0, 1762239726, 'aktif'),
(2, 2, 'KLHK-RHM-ABCDEFGHIJ', 1, 0, 1762239726, 'nonaktif'),
(3, 3, 'KLHK-IBA-0987654321', 1, 0, 1762239726, 'aktif'),
(4, 7, 'KLHK-HT-ZXCWEBNMOP', 1, 0, 1762239726, 'aktif'),
(5, 9, 'KLHK-EAN-QAZWSXEDC1', 1, 0, 1762239726, 'aktif'),
(6, 13, 'KLHK-EAN-3462364728', 1, 0, 1762239726, 'nonaktif');

-- --------------------------------------------------------

--
-- Table structure for table `data_realtime`
--

CREATE TABLE `data_realtime` (
  `id` bigint(20) NOT NULL,
  `device_id_unik` varchar(50) NOT NULL,
  `timestamp_data` datetime NOT NULL,
  `tmat_value` decimal(6,3) DEFAULT NULL,
  `suhu_value` decimal(5,2) DEFAULT NULL,
  `ph_value` decimal(4,2) DEFAULT NULL,
  `api_key_used` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data_realtime`
--

INSERT INTO `data_realtime` (`id`, `device_id_unik`, `timestamp_data`, `tmat_value`, `suhu_value`, `ph_value`, `api_key_used`) VALUES
(1, 'DEV-GLJ-001', '2025-11-04 13:57:06', '-0.250', '28.50', '4.50', NULL),
(2, 'DEV-GLJ-001', '2025-11-04 14:02:06', '-0.245', '28.60', '4.55', NULL),
(3, 'DEV-RHM-002', '2025-11-04 13:57:06', '-0.350', '27.90', '4.10', NULL),
(4, 'DEV-RHM-002', '2025-11-04 14:02:06', '-0.355', '27.80', '4.15', NULL),
(5, 'DEV-IBA-003', '2025-11-04 13:57:06', '-0.190', '29.10', '5.00', NULL),
(6, 'DEV-IBA-003', '2025-11-04 14:02:06', '-0.195', '29.20', '5.00', NULL),
(7, 'DEV-ARM-005', '2025-11-04 13:57:06', '-0.410', '28.00', '4.80', NULL),
(8, 'DEV-ARM-005', '2025-11-04 14:02:06', '-0.412', '28.10', '4.80', NULL),
(9, 'DEV-GLJ-006', '2025-11-04 13:57:06', '-0.220', '27.50', '4.70', NULL),
(10, 'DEV-GLJ-006', '2025-11-04 14:02:06', '-0.218', '27.45', '4.70', NULL),
(11, 'DEV-HT-007', '2025-11-04 13:57:06', '-0.300', '28.80', '4.30', NULL),
(12, 'DEV-HT-007', '2025-11-04 14:02:06', '-0.305', '28.75', '4.35', NULL),
(13, 'DEV-EAN-009', '2025-11-04 13:57:06', '-0.270', '29.00', '5.10', NULL),
(14, 'DEV-EAN-009', '2025-11-04 14:02:06', '-0.275', '28.90', '5.10', NULL),
(15, 'DEV-MS-010', '2025-11-04 13:57:06', '-0.380', '27.60', '4.40', NULL),
(16, 'DEV-MS-010', '2025-11-04 14:02:06', '-0.385', '27.50', '4.40', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `name` varchar(20) NOT NULL,
  `description` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `name`, `description`) VALUES
(1, 'superadmin', 'Pengguna dengan akses penuh ke sistem KLHK'),
(2, 'manager', 'Pengguna dengan akses ke laporan dan monitoring'),
(3, 'perusahaan', 'Pengguna yang hanya bisa melihat data perusahaannya sendiri');

-- --------------------------------------------------------

--
-- Table structure for table `login_attempts`
--

CREATE TABLE `login_attempts` (
  `id` int(11) UNSIGNED NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `login` varchar(100) NOT NULL,
  `time` int(11) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `master_device`
--

CREATE TABLE `master_device` (
  `id` int(11) NOT NULL,
  `device_id_unik` varchar(50) NOT NULL,
  `id_perusahaan` int(11) NOT NULL,
  `id_site` int(11) NOT NULL,
  `tipe_alat` varchar(100) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `provinsi` varchar(100) DEFAULT NULL,
  `kabupaten` varchar(100) DEFAULT NULL,
  `kota` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `status` enum('aktif','nonaktif','perbaikan') NOT NULL DEFAULT 'aktif',
  `last_online` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `kode_titik` varchar(50) DEFAULT NULL,
  `kode_blok` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `master_device`
--

INSERT INTO `master_device` (`id`, `device_id_unik`, `id_perusahaan`, `id_site`, `tipe_alat`, `alamat`, `provinsi`, `kabupaten`, `kota`, `latitude`, `longitude`, `status`, `last_online`, `created_at`, `kode_titik`, `kode_blok`) VALUES
(1, 'DEV-GLJ-001', 1, 1, 'TMAT Logger V3', NULL, NULL, NULL, NULL, '-0.52345600', '101.55678900', 'aktif', '2025-11-04 14:02:06', '2025-11-04 07:02:06', NULL, NULL),
(2, 'DEV-RHM-002', 2, 2, 'TMAT Logger V2', NULL, NULL, NULL, NULL, '-0.60123000', '101.40100000', 'aktif', '2025-11-04 13:02:06', '2025-11-04 07:02:06', NULL, NULL),
(3, 'DEV-IBA-003', 3, 3, 'TMAT Logger V3', NULL, NULL, NULL, NULL, '-0.15000000', '110.00000000', 'aktif', '2025-11-04 14:02:06', '2025-11-04 07:02:06', NULL, NULL),
(4, 'DEV-SS-004', 4, 4, 'IoT TMAT', NULL, NULL, NULL, NULL, '-1.23450000', '103.56780000', 'nonaktif', '2025-10-30 14:02:06', '2025-11-04 07:02:06', NULL, NULL),
(5, 'DEV-ARM-005', 5, 5, 'TMAT Logger V1', NULL, NULL, NULL, NULL, '-6.15662373', '106.90190931', 'perbaikan', '2025-11-04 14:02:06', '2025-11-04 07:02:06', 'ab12', 'cd34'),
(6, 'DEV-GLJ-006', 1, 6, 'TMAT Logger V3', NULL, NULL, NULL, NULL, '-0.53000000', '101.56000000', 'aktif', '2025-11-04 14:02:06', '2025-11-04 07:02:06', NULL, NULL),
(7, 'DEV-HT-007', 7, 7, 'TMAT Logger V2', NULL, NULL, NULL, NULL, '0.20000000', '111.50000000', 'aktif', '2025-11-04 14:02:06', '2025-11-04 07:02:06', NULL, NULL),
(8, 'DEV-GPO-008', 8, 8, 'IoT TMAT', NULL, NULL, NULL, NULL, '-3.55000000', '105.00000000', 'aktif', '2025-11-18 19:49:40', '2025-11-04 07:02:06', NULL, NULL),
(9, 'DEV-EAN-009', 9, 9, 'TMAT Logger V3', NULL, NULL, NULL, NULL, '-6.20000000', '106.80000000', 'perbaikan', '2025-11-04 14:02:06', '2025-11-04 07:02:06', NULL, NULL),
(10, 'DEV-MS-010', 10, 10, 'TMAT Logger V2', NULL, NULL, NULL, NULL, '-1.50000000', '100.20000000', 'aktif', '2025-11-04 14:02:06', '2025-11-04 07:02:06', NULL, NULL),
(13, 'hans V1', 13, 3, NULL, NULL, NULL, NULL, NULL, '-6.42661400', '106.83999230', 'nonaktif', NULL, '2025-11-21 07:14:58', NULL, NULL),
(14, 'hansV2', 13, 2, NULL, NULL, 'JAWA BARAT', 'KOTA BEKASI', 'Jatiasih', '-6.30549850', '106.95233970', 'nonaktif', NULL, '2025-11-21 12:23:49', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `master_device_list`
--

CREATE TABLE `master_device_list` (
  `id` int(11) NOT NULL,
  `device` varchar(255) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `master_device_list`
--

INSERT INTO `master_device_list` (`id`, `device`, `date_created`) VALUES
(1, 'TMAT Logger V3', '2025-11-17 06:30:21'),
(2, 'TMAT Logger V1', '2025-11-17 06:30:26'),
(3, 'IoT TMAT', '2025-11-17 06:30:38'),
(6, 'TMAT Logger V5', '2025-11-18 12:48:56');

-- --------------------------------------------------------

--
-- Table structure for table `master_perusahaan`
--

CREATE TABLE `master_perusahaan` (
  `id` int(11) NOT NULL,
  `nama_perusahaan` varchar(150) NOT NULL,
  `pic_kontak` varchar(100) DEFAULT NULL,
  `email_kontak` varchar(100) NOT NULL,
  `telepon` varchar(20) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `status` enum('aktif','pending','nonaktif') NOT NULL DEFAULT 'aktif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `kode_perusahaan` varchar(50) DEFAULT NULL,
  `jenis_perusahaan` enum('PBPH','Perkebunan') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `master_perusahaan`
--

INSERT INTO `master_perusahaan` (`id`, `nama_perusahaan`, `pic_kontak`, `email_kontak`, `telepon`, `alamat`, `status`, `created_at`, `kode_perusahaan`, `jenis_perusahaan`) VALUES
(1, 'PT. Gambut Lestari Jaya', 'Budi Santoso', 'budi@gambutjaya.com', '08123456701', 'Jl. Trans Sumatra No. 12, Riau', 'aktif', '2025-11-04 07:02:06', NULL, NULL),
(2, 'PT. Riau Hijau Makmur', 'Siti Aisyah', 'siti@riauhijau.com', '08123456702', 'Jl. Industri No. 5, Riau', 'aktif', '2025-11-04 07:02:06', '', ''),
(3, 'PT. Borneo Indah Abadi', 'Alex Chandra', 'alex@borneoindah.com', '08123456703', 'Jl. Raya Pontianak Km 10, Kalimantan Barat', 'aktif', '2025-11-04 07:02:06', NULL, NULL),
(4, 'PT. Sumatera Sejahtera', 'Dewi Lestari', 'dewi@sumatera.com', '08123456704', 'Jl. Lintas Timur, Jambi', 'aktif', '2025-11-04 07:02:06', NULL, NULL),
(5, 'PT. Alam Raya Mandiri', 'Faisal Arief', 'faisal@alamraya.com', '08123456705', 'Kawasan Industri KM 15, Sumatera Selatan', 'aktif', '2025-11-04 07:02:06', NULL, NULL),
(6, 'CV. Lestari Kayu', 'Gita Permata', 'gita@kayu.com', '08123456706', 'Jl. Utama No. 88, Riau', 'aktif', '2025-11-04 07:02:06', NULL, NULL),
(7, 'PT. Hutan Tropis', 'Hendra Wijaya', 'hendra@hutantropis.com', '08123456707', 'Jl. Merdeka No. 1, Kalimantan Tengah', 'aktif', '2025-11-04 07:02:06', NULL, NULL),
(8, 'PT. Green Palm Oil', 'Indra Setiawan', 'indra@greenpalm.com', '08123456708', 'Jl. Palembang-Jambi KM 20', 'aktif', '2025-11-04 07:02:06', NULL, NULL),
(9, 'PT. Eko Alam Nusantara', 'Joko Susanto', 'joko@ekoalam.com', '08123456709', 'Perkantoran Mega Blok, Jakarta', 'aktif', '2025-11-04 07:02:06', NULL, NULL),
(10, 'CV. Mitra Sawit', 'Kiki Amelia', 'kiki@mitrasawit.com', '08123456710', 'Jl. Pelabuhan Ratu No. 5, Sumatera Barat', 'aktif', '2025-11-04 07:02:06', NULL, NULL),
(13, 'Portal GIS', 'Kinta Mahadji', 'kintamahadji@gmail.com', '085717527494', 'depok', 'aktif', '2025-11-16 13:28:42', NULL, NULL),
(14, 'Portal GAS', 'Hans Hans', 'hans@gmail.com', '081316088986', 'Jl. Wibawa Mukti Ii No.129, Rt.004/Rw.006, Jatisari, Jatiasih, Bekasi, West Java 17426', 'pending', '2025-11-20 04:39:55', NULL, 'PBPH'),
(15, 'Bjir', 'tes', 'tes@tes.com', '', 'Jl. Wibawa Mukti Ii No.129, Rt.004/Rw.006, Jatisari, Jatiasih, Bekasi, West Java 17426, KAB. BOGOR, JAWA BARAT', 'pending', '2025-11-20 04:46:25', NULL, 'Perkebunan'),
(16, 'WOW', 'Hans Hans Hans', 'hans321@gmail.com', '', 'Jalan Janur Elok I blok QB7/9, RT002/RW006, Kelapa Gading Barat, Kelapa Gading, KAB. ADM. KEP. SERIBU, DKI JAKARTA', 'pending', '2025-11-20 07:26:19', NULL, 'Perkebunan'),
(17, 'Brojir', 'mas jujun jamal', 'jujun@jamal.com', '081316088986', 'Jalan Janur Elok I blok QB7/9, RT002/RW006, Kelapa Gading Barat, Kelapa Gading, KOTA ADM. JAKARTA UTARA, DKI JAKARTA', 'pending', '2025-11-20 07:29:56', NULL, 'PBPH'),
(18, 'PT Metode Yassir', 'habib husain nurrohim', 'habib@gmail.com', '', 'Jalan Janur Elok I blok QB7/9, RT002/RW006, Kelapa Gading Barat, Kelapa Gading, KOTA ADM. JAKARTA UTARA, DKI JAKARTA', 'pending', '2025-11-20 13:38:21', NULL, 'PBPH');

-- --------------------------------------------------------

--
-- Table structure for table `master_site`
--

CREATE TABLE `master_site` (
  `id` int(11) NOT NULL,
  `id_perusahaan` int(11) NOT NULL,
  `nama_site` varchar(150) NOT NULL,
  `id_provinsi` int(11) DEFAULT 0,
  `id_kabupaten` int(11) DEFAULT 0,
  `id_kecamatan` int(11) DEFAULT 0,
  `id_kelurahan` int(11) DEFAULT 0,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `master_site`
--

INSERT INTO `master_site` (`id`, `id_perusahaan`, `nama_site`, `id_provinsi`, `id_kabupaten`, `id_kecamatan`, `id_kelurahan`, `latitude`, `longitude`, `keterangan`, `created_at`) VALUES
(1, 1, 'Site Pintu Air-01', 0, 0, 0, 0, '-0.52345600', '101.55678900', 'Lokasi utama dekat kanal primer', '2025-11-04 07:02:06'),
(2, 2, 'Site Blok R-A', 0, 0, 0, 0, '-0.60123000', '101.40100000', 'Blok area yang sering dipantau', '2025-11-04 07:02:06'),
(3, 3, 'Site Utara Sungai', 0, 0, 0, 0, '-0.15000000', '110.00000000', 'Lokasi terpencil, akses sulit', '2025-11-04 07:02:06'),
(4, 4, 'Site Tengah Areal', 0, 0, 0, 0, '-1.23450000', '103.56780000', 'Pusat area konsesi', '2025-11-04 07:02:06'),
(5, 5, 'Site Jembatan Lama', 0, 0, 0, 0, '-2.50000000', '104.70000000', 'Dekat jembatan kayu yang sudah tua', '2025-11-04 07:02:06'),
(6, 1, 'Site Post 2B', 0, 0, 0, 0, '-0.53000000', '101.56000000', 'Pos pemantauan cadangan', '2025-11-04 07:02:06'),
(7, 7, 'Site Rawa Gambut', 0, 0, 0, 0, '0.20000000', '111.50000000', 'Area dengan kedalaman gambut ekstrim', '2025-11-04 07:02:06'),
(8, 8, 'Site Blok C-1', 0, 0, 0, 0, '-3.55000000', '105.00000000', 'Blok area sawit', '2025-11-04 07:02:06'),
(9, 9, 'Site Uji Coba', 0, 0, 0, 0, '-6.20000000', '106.80000000', 'Area untuk pengujian alat baru', '2025-11-04 07:02:06'),
(10, 10, 'Site Percontohan', 0, 0, 0, 0, '-1.50000000', '100.20000000', 'Area pelatihan dan percontohan', '2025-11-04 07:02:06');

-- --------------------------------------------------------

--
-- Table structure for table `pengaturan_sistem`
--

CREATE TABLE `pengaturan_sistem` (
  `id` int(11) NOT NULL,
  `nama_sistem` varchar(100) NOT NULL,
  `email_sistem` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengaturan_sistem`
--

INSERT INTO `pengaturan_sistem` (`id`, `nama_sistem`, `email_sistem`, `created_at`, `updated_at`) VALUES
(2, 'KLHK System', 'superadmin@klhk.go.id', '2025-11-19 06:56:24', '2025-11-19 10:35:08');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(254) NOT NULL,
  `activation_selector` varchar(255) DEFAULT NULL,
  `activation_code` varchar(255) DEFAULT NULL,
  `forgotten_password_selector` varchar(255) DEFAULT NULL,
  `forgotten_password_code` varchar(255) DEFAULT NULL,
  `forgotten_password_time` int(11) UNSIGNED DEFAULT NULL,
  `remember_selector` varchar(255) DEFAULT NULL,
  `remember_code` varchar(255) DEFAULT NULL,
  `created_on` int(11) UNSIGNED NOT NULL,
  `last_login` int(11) UNSIGNED DEFAULT NULL,
  `active` tinyint(1) UNSIGNED DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `id_perusahaan` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `ip_address`, `username`, `password`, `email`, `activation_selector`, `activation_code`, `forgotten_password_selector`, `forgotten_password_code`, `forgotten_password_time`, `remember_selector`, `remember_code`, `created_on`, `last_login`, `active`, `first_name`, `last_name`, `company`, `phone`, `id_perusahaan`) VALUES
(1, '127.0.0.1', 'superadmin', '$2y$10$CO2kepduvzHIu9ddEonJC.3VNpFRHVBKBrB9aLHeZzJjxZULdfPuW', 'superadmin@klhk.go.id', NULL, NULL, NULL, NULL, NULL, '1f1c71941d00a2fcc7a015800bba38ca85e9eb81', '$2y$10$EI29OmCKqec2UW8B3r5L5u4PNh522eMtvSNicrqMOUVg.jIm27iWK', 1762239726, 1763723825, 1, 'Admin', 'Utama', 'KLHK', '', NULL),
(2, '127.0.0.1', 'manager', '$2y$10$65MP1aL.4Ua77OaxcH4qnev1UK.iK3Uyvj7u9CgaMpp57UmLCqD8u', 'manager@klhk.go.id', NULL, NULL, NULL, NULL, NULL, 'bf561b44d6fb042d9979fd048d2dcc4c2baf46bd', '$2y$10$ffIjorwrXAAkMMelLsomv.ndiftvkqNg05psejK7Lmh2VfcQs9HrC', 1762239726, 1763539874, 1, 'Budi', 'Manager', 'KLHK', NULL, NULL),
(3, '127.0.0.1', 'operator', '$2y$08$200Z6ZZbp3RAEXoaWcMA6uJOFicwNZaqk4oDhqTUiFXFe63MG.Daa', 'operator@klhk.go.id', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1762239726, 1762239726, 1, 'Dinda', 'Operator', 'KLHK', NULL, NULL),
(4, '127.0.0.1', 'user.glj', '$2y$08$200Z6ZZbp3RAEXoaWcMA6uJOFicwNZaqk4oDhqTUiFXFe63MG.Daa', 'user.glj@gambutjaya.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1762239726, 1762239726, 1, 'User', 'Gambut Jaya', 'PT. Gambut Lestari Jaya', NULL, 1),
(5, '127.0.0.1', 'user.rhm', '$2y$08$200Z6ZZbp3RAEXoaWcMA6uJOFicwNZaqk4oDhqTUiFXFe63MG.Daa', 'user.rhm@riauhijau.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1762239726, 1762239726, 1, 'User', 'Riau Hijau', 'PT. Riau Hijau Makmur', NULL, 2),
(8, '::1', 'Admin', '$2y$10$HrzdH2GJzdIjALIYUqdnQeouEFbdB87zD.Mghv1JI5VzODn2bwvGy', 'admin@admin.com', NULL, NULL, NULL, NULL, NULL, 'abea6a9a8afae3f6bbf7962f6f7deac917210709', '$2y$10$9guwQ2ErB.NjtHr7aSZ8EO6WSfGyM00W6WOp2AwP2JDchU9X3u9iq', 1763525019, 1763527346, 0, 'Admin', 'Pengawas', NULL, '', NULL),
(9, '::1', 'Hans123', '$2y$10$g1.DLMaCIQ6E0OexTsTequ2msqH7JxzpKtJHwdWxlWF0a3dCx6gT2', 'test@test.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1763539339, NULL, 0, 'Hans', 'Manager', NULL, '0857625162362', 13),
(10, '::1', 'hans1234', '$2y$10$ROSiuRyTEYOk49y2j8SLK.Gx0IE0KIpYDaR.1w2TLvzggHjPbvZve', 'hans@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1763613595, NULL, 0, 'Hans', 'Hans', NULL, '081316088986', 14),
(11, '::1', 'tes456', '$2y$10$SGNAxIfSu/b/OYw1MWzaYeUn4ycioLYFSrmOnUjjjcC5aHfNPAkgm', 'tes@tes.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1763613986, NULL, 0, 'tes', '', NULL, '', 15),
(12, '::1', 'Hans321', '$2y$10$TVyx6IKRyRySMjoMSPzI0uD8PkrstzbtlL4CIyfbAejyJbuMJj46G', 'hans321@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1763623580, NULL, 0, 'Hans', 'Hans Hans', NULL, '', 16),
(13, '::1', 'jujunjamal', '$2y$10$FOdH4BRIjL5/nbZ7WPCcoew8zaypoASYzhvrW8M0txS03Yh/oStD6', 'jujun@jamal.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1763623796, NULL, 0, 'mas', 'jujun jamal', NULL, '081316088986', 17),
(14, '::1', 'habib123', '$2y$10$7PfOTH9CCfMSLo1iXx1Wqe32wupekh0F.os8Vhc6vACy3tzI9fy8O', 'habib@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1763645902, NULL, 0, 'habib', 'husain nurrohim', NULL, '', 18);

-- --------------------------------------------------------

--
-- Table structure for table `users_groups`
--

CREATE TABLE `users_groups` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `group_id` mediumint(8) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_groups`
--

INSERT INTO `users_groups` (`id`, `user_id`, `group_id`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 2),
(4, 4, 3),
(5, 5, 3),
(8, 8, 1),
(9, 9, 3),
(10, 10, 3),
(11, 11, 3),
(12, 12, 3),
(13, 13, 3),
(14, 14, 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `api_audit_logs`
--
ALTER TABLE `api_audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_timestamp_key` (`timestamp_request`,`api_key`);

--
-- Indexes for table `api_keys`
--
ALTER TABLE `api_keys`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key_value` (`key_value`),
  ADD KEY `fk_apikey_perusahaan` (`id_perusahaan`);

--
-- Indexes for table `data_realtime`
--
ALTER TABLE `data_realtime`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_device_timestamp` (`device_id_unik`,`timestamp_data`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `master_device`
--
ALTER TABLE `master_device`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `device_id_unik` (`device_id_unik`),
  ADD KEY `fk_device_perusahaan` (`id_perusahaan`),
  ADD KEY `fk_device_site` (`id_site`);

--
-- Indexes for table `master_device_list`
--
ALTER TABLE `master_device_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `master_perusahaan`
--
ALTER TABLE `master_perusahaan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `master_site`
--
ALTER TABLE `master_site`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_site_perusahaan` (`id_perusahaan`);

--
-- Indexes for table `pengaturan_sistem`
--
ALTER TABLE `pengaturan_sistem`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `users_groups`
--
ALTER TABLE `users_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uc_users_groups` (`user_id`,`group_id`),
  ADD KEY `fk_users_groups_users1_idx` (`user_id`),
  ADD KEY `fk_users_groups_groups1_idx` (`group_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `api_audit_logs`
--
ALTER TABLE `api_audit_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_keys`
--
ALTER TABLE `api_keys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `data_realtime`
--
ALTER TABLE `data_realtime`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `master_device`
--
ALTER TABLE `master_device`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `master_device_list`
--
ALTER TABLE `master_device_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `master_perusahaan`
--
ALTER TABLE `master_perusahaan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `master_site`
--
ALTER TABLE `master_site`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `pengaturan_sistem`
--
ALTER TABLE `pengaturan_sistem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users_groups`
--
ALTER TABLE `users_groups`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `api_keys`
--
ALTER TABLE `api_keys`
  ADD CONSTRAINT `fk_apikey_perusahaan` FOREIGN KEY (`id_perusahaan`) REFERENCES `master_perusahaan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `master_device`
--
ALTER TABLE `master_device`
  ADD CONSTRAINT `fk_device_perusahaan` FOREIGN KEY (`id_perusahaan`) REFERENCES `master_perusahaan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_device_site` FOREIGN KEY (`id_site`) REFERENCES `master_site` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `master_site`
--
ALTER TABLE `master_site`
  ADD CONSTRAINT `fk_site_perusahaan` FOREIGN KEY (`id_perusahaan`) REFERENCES `master_perusahaan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users_groups`
--
ALTER TABLE `users_groups`
  ADD CONSTRAINT `fk_users_groups_groups1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_users_groups_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
