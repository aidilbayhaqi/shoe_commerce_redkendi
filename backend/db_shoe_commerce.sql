-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 13 Agu 2025 pada 00.00
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shoe_commerce`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `checkouts`
--

CREATE TABLE `checkouts` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `total_price` float NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `status` varchar(50) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `no_hp` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `checkouts`
--

INSERT INTO `checkouts` (`id`, `order_id`, `product_id`, `user_id`, `total_price`, `created_at`, `status`, `payment_method`, `address`, `email`, `no_hp`) VALUES
(7, 15, 14, 1, 450000, '2025-08-12 19:25:23', 'complete', 'Transfer Bank', 'Jl. Contoh aja', 'admin@gmail.com', '0812345678911'),
(8, 16, 15, 1, 200000, '2025-08-12 19:47:25', 'complete', 'Transfer Bank', 'Jl. Contoh aja', 'admin@gmail.com', '0812345678911'),
(9, 17, 14, 1, 450000, '2025-08-12 21:02:49', 'complete', 'Transfer Bank', 'Jl. Contoh aja', 'admin@gmail.com', '0812345678911');

-- --------------------------------------------------------

--
-- Struktur dari tabel `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `total_price` float NOT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `product_id`, `quantity`, `created_at`, `total_price`, `status`) VALUES
(14, 1, 13, 1, '2025-08-13 01:33:31', 500000, 'pending'),
(15, 1, 14, 1, '2025-08-13 02:23:58', 450000, 'complete'),
(16, 1, 15, 1, '2025-08-13 02:47:23', 200000, 'complete'),
(17, 1, 14, 1, '2025-08-13 04:02:41', 450000, 'complete');

-- --------------------------------------------------------

--
-- Struktur dari tabel `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `stock` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `owner_id` int(11) NOT NULL,
  `type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`type`)),
  `color` varchar(20) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `age` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `stock`, `price`, `image_url`, `created_at`, `owner_id`, `type`, `color`, `gender`, `age`) VALUES
(13, 'nike', 'testt', 19, 500000, '/uploads\\images\\fd7dd49812e74037baabee6704b58e86_sepatu-3.jpg', '2025-08-13 01:32:39', 1, '[{\"name\": \"limited\", \"size\": 34}, {\"name\": \"casual\", \"size\": 43}]', 'red', 'male', 20),
(14, 'Sepatu Lari X1', 'Sepatu ringan untuk lari jarak jauh', 48, 450000, '/uploads\\images\\769d20280c4e484b958f2f2c44c16b5e_sepatu-10.jpg', '2025-08-13 01:56:52', 1, '[{\"name\": \"Running\", \"size\": 42}]', 'black', 'male', 25),
(15, 'Sneakers Casual Y1', 'sepatu keren', 14, 200000, '/uploads\\images\\b257946227ed463d840e0e6dffb05b59_sepatu-6.jpg', '2025-08-13 02:01:50', 1, '[{\"name\": \"branded\", \"size\": 40}]', 'black', 'male', 15),
(16, 'Sepatu Olahraga Z1', 'Sepatu olahraga multifungsi', 30, 600000, '/uploads\\images\\00d0aa16b3ee4bab8569936024d3c4c4_sepatu-7.jpg', '2025-08-13 02:04:06', 1, '[{\"name\": \"sporty\", \"size\": 45}]', 'hijau', 'female', 20),
(34, 'Boots Hiking A2', 'Sepatu olahraga multifungsi', 5, 300000, '/uploads\\images\\feff814433cf49c5a8572533913f4597_sepatu-8.jpg', '2025-08-13 02:13:01', 1, '[{\"name\": \"sporty\", \"size\": 44}]', 'blue', 'male', 20),
(35, 'Sneakers Trendy K2', 'Sneakers dengan desain kekinian', 40, 1000000, '/uploads\\images\\50a7fffa40c94aebb8c424effa6aef18_ryan-plomp-jvoZ-Aux9aw-unsplash.jpg', '2025-08-13 02:14:22', 1, '[{\"name\": \"branded\", \"size\": 34}]', 'red', 'female', 15),
(36, 'Sepatu Kanvas N2', 'Sepatu kanvas ringan dan simpel', 10, 150000, '/uploads\\images\\d30a104f362e42fb9c0ed075d39bd09a_maksim-larin-ezdrvzA1hZw-unsplash.jpg', '2025-08-13 02:15:53', 1, '[{\"name\": \"vintage\", \"size\": 44}]', 'red', 'female', 20);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `address`, `phone`, `is_admin`) VALUES
(1, 'admin', 'admin@gmail.com', '$2b$12$1JkmuTN7D3p9joIvY0t/Fuj2DLhCs3yIgclcRA8VAv4.l9gEX6n16', 'Jl. Contoh aja', '0812345678911', 1),
(2, 'user123', 'user@example.com', '$2b$12$olOM5MSyQpBMuwev5rUgD.1LSFGxMJyAjyUD9eAuQYiNPdQUhXcza', 'Some Street', '08123456789', 0),
(3, 'aidil', 'aidil@gmail.com', '$2b$12$AQa9BKd3I7IxMj/9VWqUy.jbi6axPlq833dBArKpW/wKdw/zyyTC.', 'jalan ', '012938274', 0),
(4, 'aaa', 'ppp@gmail.com', '$2b$12$YVJ/pyf..W.PvbGvs5N3m.RgLoIvUaZdikEdu2lRVZuktVyLt4cJq', NULL, NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `checkouts`
--
ALTER TABLE `checkouts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_checkout_order_id` (`order_id`),
  ADD KEY `ix_checkouts_order_id` (`order_id`),
  ADD KEY `ix_checkouts_id` (`id`),
  ADD KEY `idx_checkout_user_id` (`user_id`);

--
-- Indeks untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_orders_id` (`id`),
  ADD KEY `ix_orders_user_id` (`user_id`),
  ADD KEY `idx_order_status` (`status`),
  ADD KEY `ix_orders_product_id` (`product_id`),
  ADD KEY `idx_order_user_id` (`user_id`);

--
-- Indeks untuk tabel `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `owner_id` (`owner_id`),
  ADD KEY `idx_product_name` (`name`),
  ADD KEY `idx_product_color` (`color`),
  ADD KEY `ix_products_id` (`id`),
  ADD KEY `idx_product_gender` (`gender`),
  ADD KEY `idx_product_age` (`age`),
  ADD KEY `ix_products_name` (`name`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_users_username` (`username`),
  ADD UNIQUE KEY `ix_users_email` (`email`),
  ADD KEY `idx_user_email` (`email`),
  ADD KEY `ix_users_id` (`id`),
  ADD KEY `idx_user_username` (`username`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `checkouts`
--
ALTER TABLE `checkouts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT untuk tabel `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `checkouts`
--
ALTER TABLE `checkouts`
  ADD CONSTRAINT `checkouts_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `checkouts_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `checkouts_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Ketidakleluasaan untuk tabel `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
