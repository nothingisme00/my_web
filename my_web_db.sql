-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 04, 2025 at 09:42 AM
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
-- Database: `my_web_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `slug`, `description`, `createdAt`, `updatedAt`) VALUES
('cmiopcr8700005zcul52x7b1l', 'Mental Health', 'mental-health', NULL, '2025-12-02 14:57:45.942', '2025-12-02 14:57:45.942'),
('cmiopktlt00011n0sdvy7p7e0', 'Fasting', 'fasting', NULL, '2025-12-02 15:04:02.273', '2025-12-02 15:04:02.273'),
('cmippx7al000ehm4o89bbt2zl', 'Travelling', 'travelling', NULL, '2025-12-03 08:01:26.061', '2025-12-03 08:01:26.061'),
('cmir19wxg000cd29g1wr92kex', 'Gaya Hidup', 'gaya-hidup', NULL, '2025-12-04 06:07:01.109', '2025-12-04 06:07:01.109'),
('cmir1xsr3000a13o86uc4wunf', 'Alam', 'alam', NULL, '2025-12-04 06:25:35.440', '2025-12-04 06:25:35.440');

-- --------------------------------------------------------

--
-- Table structure for table `loginactivity`
--

CREATE TABLE `loginactivity` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `ipAddress` varchar(191) NOT NULL,
  `userAgent` text DEFAULT NULL,
  `success` tinyint(1) NOT NULL DEFAULT 0,
  `reason` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `loginactivity`
--

INSERT INTO `loginactivity` (`id`, `email`, `ipAddress`, `userAgent`, `success`, `reason`, `createdAt`) VALUES
('cmiop1z7p000070zs1jy1cdr2', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-02 14:49:23.077'),
('cmioph7af00001n0s5cag7nv2', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-02 15:01:13.381'),
('cmioq3kzu00006ihxj60vol1b', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-02 15:18:37.577'),
('cmip6rgpa0000k8inols985es', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-02 23:05:05.613'),
('cmipf131j0000g8q3c7j0u761', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-03 02:56:31.398'),
('cmipf9ycb000dg8q3cq2wc92s', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-03 03:03:25.211'),
('cmipgu3tb0000dei4pyxl6fxb', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-03 03:47:05.038'),
('cmipox5yq0000u6ov583e1o8d', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-03 07:33:24.721'),
('cmipq1u9d000khm4o1bv81m44', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-03 08:05:02.447'),
('cmipqetsg0000qhphdw2xwuyk', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-03 08:15:08.366'),
('cmipt4p4l0000chwc6255nsmo', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-03 09:31:14.611'),
('cmipw5ld10000f0tuzegxcr1f', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-03 10:55:55.235'),
('cmipwp6el0000zwqlz2pipqhs', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-03 11:11:08.973'),
('cmipwt00v0001zwqlznto79qa', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-03 11:14:07.326'),
('cmipwtqpv0004zwqly18xe7ut', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-03 11:14:41.923'),
('cmiqrwhyw0000q7n0l9og4neb', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-04 01:44:38.647'),
('cmiqs61dy0002q7n090hi2xwt', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-04 01:52:03.718'),
('cmir05jmx0000d29g8a3srnlm', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-04 05:35:37.640'),
('cmir0ze240002d29gfumsgti6', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-04 05:58:50.090'),
('cmir3wyuv0000ui8gydep29om', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-04 07:20:55.926'),
('cmir3ye9n0001ui8geuhunt7t', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-04 07:22:02.555'),
('cmir4wms9000010e5re57nj4y', 'alfatahatalarais12@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'login-success', '2025-12-04 07:48:39.897');

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` varchar(191) NOT NULL,
  `filename` varchar(191) NOT NULL,
  `originalName` varchar(191) NOT NULL,
  `mimeType` varchar(191) NOT NULL,
  `size` int(11) NOT NULL,
  `url` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `content` text NOT NULL,
  `excerpt` text DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `published` tinyint(1) NOT NULL DEFAULT 0,
  `views` int(11) NOT NULL DEFAULT 0,
  `readingTime` int(11) NOT NULL DEFAULT 5,
  `author` varchar(191) NOT NULL DEFAULT 'Alfattah',
  `publishedAt` datetime(3) DEFAULT NULL,
  `metaDescription` text DEFAULT NULL,
  `metaKeywords` varchar(191) DEFAULT NULL,
  `categoryId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `reactionsLove` int(11) NOT NULL DEFAULT 0,
  `reactionsLike` int(11) NOT NULL DEFAULT 0,
  `reactionsWow` int(11) NOT NULL DEFAULT 0,
  `reactionsFire` int(11) NOT NULL DEFAULT 0,
  `archivedAt` datetime(3) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'draft',
  `contentEn` text DEFAULT NULL,
  `excerptEn` text DEFAULT NULL,
  `metaDescriptionEn` text DEFAULT NULL,
  `titleEn` varchar(191) DEFAULT NULL,
  `tags` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`id`, `title`, `slug`, `content`, `excerpt`, `image`, `published`, `views`, `readingTime`, `author`, `publishedAt`, `metaDescription`, `metaKeywords`, `categoryId`, `createdAt`, `updatedAt`, `reactionsLove`, `reactionsLike`, `reactionsWow`, `reactionsFire`, `archivedAt`, `status`, `contentEn`, `excerptEn`, `metaDescriptionEn`, `titleEn`, `tags`) VALUES
('cmiop5xt9000270zsctukpcot', 'Menjaga Kewarasan di Tengah Kebisingan: Pentingnya Kesehatan Mental di Era Digital', 'menjaga-kesehatan-mental-era-digital', '<p>Seringkah Anda merasa lelah bahkan setelah bangun tidur? Atau mungkin merasa cemas berlebihan saat notifikasi ponsel berbunyi? Di era digital yang serba cepat ini, kita sering kali lupa bahwa kesehatan bukan hanya soal fisik, tetapi juga tentang apa yang terjadi di dalam pikiran dan perasaan kita.</p><p>Kesehatan mental (<em>mental health</em>) bukanlah sekadar \"tidak gila\". Menurut Organisasi Kesehatan Dunia (WHO), kesehatan mental adalah kondisi sejahtera di mana individu menyadari potensinya sendiri, dapat mengatasi tekanan hidup yang normal, bekerja secara produktif, dan mampu memberikan kontribusi kepada komunitasnya.</p><p>Lantas, bagaimana cara kita merawatnya di tengah hiruk-pikuk kesibukan?</p><h4>Tanda-Tanda Mental Anda Sedang \"Lelah\"</h4><p>Sering kali, tubuh dan pikiran kita memberikan sinyal SOS sebelum benar-benar <em>burnout</em>, namun kita sering mengabaikannya. Berikut beberapa tanda yang perlu diwaspadai:</p><ul><li><p><strong>Perubahan Pola Tidur:</strong> Insomnia parah atau justru ingin tidur sepanjang hari.</p></li><li><p><strong>Mudah Tersinggung:</strong> Hal-hal kecil yang biasanya tidak mengganggu tiba-tiba membuat Anda sangat marah atau sedih.</p></li><li><p><strong>Kehilangan Minat:</strong> Hobi atau aktivitas yang dulu menyenangkan kini terasa membebani.</p></li><li><p><strong>Kelelahan Fisik Tanpa Sebab:</strong> Sakit kepala, nyeri otot, atau gangguan pencernaan yang tidak hilang meski sudah berobat.</p></li></ul><h4>Langkah Sederhana Menjaga Kesehatan Mental</h4><p>Menjaga kesehatan mental tidak harus mahal atau rumit. Berikut adalah fondasi dasar yang bisa Anda terapkan mulai hari ini:</p><p><strong>1. Lakukan \"Digital Detox\" Berkala</strong> Media sosial sering kali menjadi sumber kecemasan karena fenomena <em>FOMO (Fear of Missing Out)</em> dan kebiasaan membandingkan diri dengan orang lain. Cobalah untuk mematikan notifikasi non-esensial atau tetapkan jam \"bebas gawai\", misalnya satu jam sebelum tidur.</p><p><strong>2. Praktikkan <em>Mindfulness</em></strong> <em>Mindfulness</em> adalah seni hadir seutuhnya di masa kini. Anda tidak perlu bermeditasi berjam-jam. Cukup luangkan waktu 5 menit untuk duduk diam, fokus pada napas, dan rasakan keberadaan Anda tanpa memikirkan pekerjaan esok hari atau penyesalan masa lalu.</p><p><strong>3. Tetapkan Batasan (Boundaries)</strong> Belajarlah untuk berkata \"tidak\". Menolong orang lain itu baik, tetapi mengorbankan kapasitas mental diri sendiri demi menyenangkan orang lain adalah jalan cepat menuju stres kronis. Batasi jam kerja dan lindungi waktu istirahat Anda.</p><p><strong>4. Bergerak dan Terhubung</strong> Olahraga ringan dapat memicu hormon endorfin yang meningkatkan suasana hati. Selain itu, jangan ragu untuk bercerita kepada sahabat atau orang terpercaya. Manusia adalah makhluk sosial; terkadang, \"obat\" terbaik adalah didengarkan.</p><h4>Kapan Harus Mencari Bantuan Profesional?</h4><p>Jika perasaan sedih, cemas, atau hampa berlangsung lebih dari dua minggu dan mulai mengganggu aktivitas sehari-hari (seperti tidak bisa bekerja atau merawat diri), itu adalah tanda untuk mencari bantuan profesional.</p><p>Mengingat konsultasi ke Psikolog atau Psikiater bukanlah tanda kelemahan, melainkan tanda kekuatan—bahwa Anda cukup peduli pada diri sendiri untuk mencari kesembuhan.</p><h4>Kesimpulan</h4><p>Kesehatan mental adalah perjalanan, bukan tujuan akhir. Tidak apa-apa untuk tidak merasa \"oke\" setiap saat. Mulailah dengan langkah kecil hari ini: tarik napas dalam-dalam, hargai diri sendiri, dan ingatlah bahwa Anda berharga.</p>', 'Di dunia yang menuntut kita untuk selalu \"produktif\" dan terkoneksi 24 jam, kesehatan mental sering kali menjadi korban. Artikel ini membahas tanda-tanda kelelahan mental yang sering diabaikan dan langkah praktis untuk menemukan kembali ketenangan batin Anda.', 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 1, 30, 3, 'Alfattah', '2025-12-02 14:57:28.650', NULL, NULL, 'cmiopcr8700005zcul52x7b1l', '2025-12-02 14:52:27.880', '2025-12-04 07:20:38.766', 0, 0, 0, 0, NULL, 'published', '<p>Do you often feel tired even after waking up? Or maybe feel overly anxious when your phone notification goes off? In this fast-paced digital age, we often forget that health is not just about the physical, but also about what goes on inside our minds and feelings.</p><p><em>Mental</em> health is not just about \"not being crazy\". According to the World Health Organization (WHO), mental health is a state of well-being in which individuals realize their own potential, can cope with normal life stresses, work productively, and are able to contribute to their communities.</p><p>So, how do we take care of it in the midst of our busy lives?</p><h4>Signs You\'re Mentally \"Tired\"</h4><p>Often times, our bodies and minds give us SOS signals before we get <em>burnt out</em>, but we often ignore them. Here are some signs to look out for:</p><ul><li><p><strong>Changes in Sleep Patterns:</strong> Severe insomnia or wanting to sleep all day.</p></li><li><p><strong>Irritability:</strong> Little things that usually don\'t bother you suddenly make you very angry or sad.</p></li><li><p><strong>Loss of Interest:</strong> Hobbies or activities that used to be fun now feel overwhelming.</p></li><li><p><strong>Unexplained Physical Fatigue:</strong> Headaches, muscle aches, or indigestion that don\'t go away despite treatment.</p></li></ul><h4>Simple Steps to Maintain Mental Health</h4><p>Maintaining mental health doesn\'t have to be expensive or complicated. Here is a basic foundation that you can implement starting today:</p><p><strong>1. Do a Periodic \"Digital Detox\"</strong> Social media is often a source of anxiety due to the <em>FOMO (Fear of Missing Out)</em> phenomenon and the habit of comparing yourself to others. Try to turn off non-essential notifications or set a \"device-free\" hour, such as one hour before bedtime.</p><p><strong>2. Practice <em>Mindfulness</em></strong> <em>Mindfulness</em> is the art of being fully present in the present. You don\'t have to meditate for hours. Just take 5 minutes to sit still, focus on your breath, and feel where you are without thinking about tomorrow\'s work or past regrets.</p><p><strong>3. Set Boundaries</strong> Learn to say \"no\". Helping others is good, but sacrificing your own mental capacity to please others is a quick path to chronic stress. Limit your working hours and protect your time off.</p><p><strong>4. Move and Connect</strong> Light exercise can trigger mood-boosting endorphins. Also, don\'t hesitate to confide in a friend or trusted person. Humans are social creatures; sometimes, the best \"medicine\" is to be heard.</p><h4>When to Seek Professional Help?</h4><p>If feelings of sadness, anxiety, or emptiness last for more than two weeks and start to interfere with daily activities (such as not being able to work or take care of yourself), it is a sign to seek professional help.</p><p>Remembering to consult a psychologist or psychiatrist is not a sign of weakness, but rather a sign of strength-that you care enough about yourself to seek healing.</p><h4>Conclusion</h4><p>Mental health is a journey, not an end goal. It\'s okay not to feel \"okay\" all the time. Start with small steps today: take a deep breath, appreciate yourself, and remember that you are valuable.</p>', 'In a world that demands us to be \"productive\" and connected 24/7, mental health is often a casualty. This article discusses the often-overlooked signs of mental fatigue and practical steps to rediscover your inner calm.', NULL, 'Maintaining sanity amidst the noise: The Importance of Mental Health in the Digital Age', NULL),
('cmiopl20s00041n0sa4mz8npl', 'Intermittent Fasting: Bukan Sekadar Diet, Tapi Gaya Hidup untuk Kesehatan Optimal', 'intermittent-fasting-gaya-hidup', '<p>Dalam dekade terakhir, dunia kesehatan dan kebugaran selalu mencari \"formula ajaib\" untuk mencapai berat badan ideal dan kesehatan prima. Salah satu metode yang paling populer dan banyak diteliti adalah <em>Intermittent Fasting</em> (IF) atau Puasa Berselang.</p><p>IF bukanlah diet dalam artian konvensional (yang membatasi jenis makanan), melainkan <strong>pola makan</strong> yang berganti-ganti antara periode makan dan periode puasa. Fokus utama IF adalah pada <em>waktu</em> makan Anda.</p><hr class=\"my-8 border-gray-300 dark:border-gray-700\"><h2>💡 Prinsip Dasar <em>Intermittent Fasting</em></h2><p>Prinsip IF sangat sederhana: memanjangkan waktu istirahat tubuh dari proses pencernaan. Secara biologis, ketika kita berpuasa, tubuh kehabisan energi dari glukosa dan mulai membakar lemak sebagai sumber energi utama.</p><p>Ada beberapa metode IF yang paling umum diterapkan:</p><ol><li><p><strong>Metode 16/8:</strong> Ini adalah metode paling populer. Anda berpuasa selama 16 jam per hari dan memiliki \"jendela makan\" selama 8 jam.</p><blockquote><p><em>Contoh:</em> Anda berhenti makan pukul 8 malam dan baru makan lagi pukul 12 siang keesokan harinya.</p></blockquote></li><li><p><strong>Metode 5:2:</strong> Anda makan normal selama 5 hari dalam seminggu. Pada 2 hari non-berturut-turut, Anda membatasi asupan kalori hingga 500-600 kalori per hari.</p></li></ol><p><strong>Puasa 24 Jam (Eat-Stop-Eat):</strong> Melakukan puasa penuh selama 24 jam, satu atau dua kali seminggu.</p><hr class=\"my-8 border-gray-300 dark:border-gray-700\"><h2>🔬 Manfaat Ilmiah di Balik IF</h2><p>Manfaat IF melampaui sekadar penurunan berat badan. Berbagai penelitian menunjukkan potensi positif IF terhadap kesehatan:</p><ul><li><p><strong>1. Penurunan Berat Badan dan Lemak:</strong> Dengan membatasi waktu makan, otomatis total asupan kalori harian cenderung berkurang. Lebih penting lagi, IF meningkatkan pembakaran lemak.</p></li><li><p><strong>2. Peningkatan Sensitivitas Insulin:</strong> IF dapat secara signifikan menurunkan kadar insulin dan gula darah, yang sangat bermanfaat dalam pencegahan Diabetes Tipe 2.</p></li><li><p><strong>3. Peningkatan Fungsi Otak:</strong> Beberapa studi menunjukkan bahwa IF dapat meningkatkan produksi <strong>BDNF (<em>Brain-Derived Neurotrophic Factor</em>)</strong>, sebuah hormon yang mendukung pertumbuhan sel saraf baru dan melindungi dari penyakit neurodegeneratif.</p></li></ul><p><strong>4. <em>Autophagy</em>:</strong> Selama puasa, tubuh mengaktifkan proses pembersihan sel yang disebut <em>autophagy</em>. Proses ini membantu menghilangkan protein lama dan rusak yang menumpuk di sel, yang dipercaya dapat memperlambat penuaan.</p><hr class=\"my-8 border-gray-300 dark:border-gray-700\"><h2>🚧 Tips Memulai IF dengan Aman</h2><p>Meskipun IF aman bagi kebanyakan orang dewasa sehat, konsultasi medis tetap disarankan, terutama bagi penderita kondisi tertentu (seperti diabetes atau ibu hamil/menyusui).</p><ol><li><p><strong>Mulai Bertahap:</strong> Jangan langsung melakukan puasa 16 jam. Coba perlahan memanjangkan jeda antara makan malam dan sarapan keesokan harinya (misalnya, dari 12 jam menjadi 14 jam, lalu 16 jam).</p></li><li><p><strong>Perhatikan Asupan Selama Jendela Makan:</strong> IF tidak berarti Anda boleh makan makanan yang tidak sehat secara berlebihan. Fokus pada makanan utuh, kaya serat, protein, dan lemak sehat untuk menjaga energi tetap stabil.</p></li><li><p><strong>Prioritaskan Hidrasi:</strong> Minum air putih, kopi hitam, atau teh tawar selama periode puasa sangat penting untuk menghindari dehidrasi dan membantu mengelola rasa lapar.</p></li></ol><p><strong>Dengarkan Tubuh Anda:</strong> Jika Anda merasa pusing, mual, atau sakit kepala parah, segera hentikan puasa dan makanlah. IF seharusnya terasa berkelanjutan, bukan menyiksa.</p><video class=\"rounded-lg max-w-full w-full shadow-lg border border-gray-200 dark:border-gray-700 my-4\" src=\"https://www.w3schools.com/html/mov_bbb.mp4\" controls=\"controls\" preload=\"metadata\" style=\"max-height: 500px;\"></video><hr class=\"my-8 border-gray-300 dark:border-gray-700\"><h2>Kesimpulan</h2><p><em>Intermittent Fasting</em> adalah alat yang ampuh untuk meningkatkan kesehatan metabolik, mengelola berat badan, dan mungkin memperlambat penuaan sel. Dengan pendekatan yang tepat dan komitmen pada kualitas nutrisi, IF bisa menjadi bagian yang sangat efektif dan berkelanjutan dari gaya hidup sehat Anda.</p><p></p>', 'Intermittent Fasting (IF) telah menjadi tren kesehatan global. Lebih dari sekadar metode penurunan berat badan, IF adalah pola makan yang berfokus pada kapan Anda makan, bukan apa yang Anda makan. Pahami prinsip dasar, manfaat ilmiah, dan cara memulainya dengan aman.', 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQYhARrdIdQa6XJnPR7M_NeEgFzFlqsAMHqnY9Zl3fFeba9g6kqC6MioAfSW4JQ9jQl7qIhgqWH-ucEYk-kQF4II3GNTbc1q1q0veFdaB0O1tL3D-o', 1, 16, 3, 'Alfattah', '2025-12-02 15:04:13.173', NULL, NULL, 'cmiopktlt00011n0sdvy7p7e0', '2025-12-02 15:04:13.177', '2025-12-04 05:40:31.794', 0, 0, 0, 0, NULL, 'published', '<p>In the last decade, the world of health and fitness has been searching for the \"magic formula\" to achieve ideal weight and excellent health. One of the most popular and widely researched methods is <em>Intermittent Fasting</em> (IF).</p><p>IF is not a diet in the conventional sense (restricting the types of food), but rather an eating <strong>pattern</strong> that alternates between periods of eating and periods of fasting. The main focus of IF is on the <em>timing of</em> your meals.</p><hr class=\"my-8 border-gray-300 dark:border-gray-700\"><h2>💡 Basic Principles of <em>Intermittent Fasting</em></h2><p>The principle of IF is very simple: extending the body\'s break from the digestive process. Biologically, when we fast, the body runs out of energy from glucose and starts burning fat as the main source of energy.</p><p>There are several IF methods that are most commonly practiced:</p><ol><li><p><strong>16/8 method:</strong> This is the most popular method. You fast for 16 hours per day and have an 8-hour \"eating window\".</p><blockquote><p><em>Example:</em> You stop eating at 8pm and only eat again at 12pm the next day.</p></blockquote></li><li><p><strong>5:2 method:</strong> You eat normally for 5 days a week. On 2 non-consecutive days, you limit your calorie intake to 500-600 calories per day.</p></li></ol><p><strong>24-Hour Fasting (Eat-Stop-Eat):</strong> Doing a full fast for 24 hours, once or twice a week.</p><hr class=\"my-8 border-gray-300 dark:border-gray-700\"><h2>🔬 Scientific Benefits Behind IF</h2><p>The benefits of IF go beyond weight loss. Various studies have shown the positive potential of IF on health:</p><ul><li><p><strong>1. Weight and Fat Loss:</strong> By restricting eating times, total daily calorie intake tends to decrease. More importantly, IF increases fat burning.</p></li><li><p><strong>2. Increased Insulin Sensitivity:</strong> IF can significantly lower insulin and blood sugar levels, which is highly beneficial in the prevention of Type 2 Diabetes.</p></li><li><p><strong>3. Improved Brain Function:</strong> Some studies show that IF can increase the production of <strong>BDNF (<em>Brain-Derived Neurotrophic Factor</em>)</strong>, a hormone that supports the growth of new nerve cells and protects against neurodegenerative diseases.</p></li></ul><p><strong>4. <em>Autophagy</em>:</strong> During fasting, the body activates a cell-cleaning process called <em>autophagy</em>. This process helps remove old and damaged proteins that accumulate in cells, which is believed to slow down aging.</p><hr class=\"my-8 border-gray-300 dark:border-gray-700\"><h2>🚧 Tips for Starting IF Safely</h2><p>While IF is safe for most healthy adults, medical consultation is recommended, especially for those with certain conditions (such as diabetes or pregnant/breastfeeding mothers).</p><ol><li><p><strong>Start Gradually:</strong> Don\'t do a 16-hour fast right away. Try slowly lengthening the gap between dinner and breakfast the next day (for example, from 12 hours to 14 hours, then 16 hours).</p></li><li><p><strong>Watch Your Intake During the Meal Window:</strong> IF doesn\'t mean you can overeat unhealthy foods. Focus on whole foods, rich in fiber, protein and healthy fats to keep energy stable.</p></li><li><p><strong>Prioritize Hydration:</strong> Drinking water, black coffee, or plain tea during the fasting period is essential to avoid dehydration and help manage hunger.</p></li></ol><p><strong>Listen to Your Body:</strong> If you feel dizzy, nauseous, or have a severe headache, stop fasting immediately and eat. IF should feel sustainable, not excruciating.</p><video class=\"rounded-lg max-w-full w-full shadow-lg border border-gray-200 dark:border-gray-700 my-4\" src=\"https://www.w3schools.com/html/mov_bbb.mp4\" controls=\"controls\" preload=\"metadata\" style=\"max-height: 500px;\"></video><hr class=\"my-8 border-gray-300 dark:border-gray-700\"><h2>Conclusion</h2><p><em>Intermittent Fasting</em> is a powerful tool to improve metabolic health, manage weight, and possibly slow down cellular aging. With the right approach and a commitment to nutritional quality, IF can be a highly effective and sustainable part of your healthy lifestyle.</p><p></p>', 'Intermittent Fasting (IF) has become a global health trend. More than just a weight loss method, IF is a diet that focuses on when you eat, not what you eat. Understand the basic principles, scientific benefits and how to start safely.', NULL, 'Intermittent Fasting: Not Just a Diet, But a Lifestyle for Optimal Health', NULL),
('cmippromn000dhm4odo3dg51k', 'Surga Bahari Tropis: Mengapa Indonesia Adalah Jantung Segitiga Terumbu Karang Dunia', 'pesona-bawah-laut-indonesia-segitiga-terumbu-karang', '<p>Indonesia, negara kepulauan terbesar di dunia, sering disebut sebagai \"Zamrud Khatulistiwa.\" Namun, jika kita melihat lebih dalam, keindahan sejati negara ini mungkin terletak di bawah permukaannya. Indonesia adalah rumah bagi <strong>Segitiga Terumbu Karang (<em>Coral Triangle</em>)</strong>, sebuah kawasan perairan yang diakui secara global sebagai pusat keanekaragaman hayati laut dunia.</p><h2>Mengapa Indonesia Menjadi Jantung Segitiga Terumbu Karang?</h2><p>Segitiga Terumbu Karang adalah wilayah perairan tropis yang meliputi Indonesia, Malaysia, Filipina, Papua Nugini, Timor Leste, dan Kepulauan Solomon. Indonesia menyumbang bagian terbesar dan paling vital dari wilayah ini.</p><p>Para ilmuwan mencatat bahwa di perairan Indonesia:</p><ul><li><p>Terdapat lebih dari <strong>500 spesies karang</strong> (76% dari total spesies karang dunia).</p><img class=\"rounded-lg max-w-full h-auto\" src=\"https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&amp;w=1374&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\"></li><li><p>Rumah bagi lebih dari <strong>3.000 spesies ikan</strong> karang.</p><img class=\"rounded-lg max-w-full h-auto\" src=\"https://images.unsplash.com/photo-1604637733652-7b13b0bb7114?q=80&amp;w=1374&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\"></li><li><p>Merupakan tempat berkembang biak bagi enam dari tujuh spesies penyu laut dunia.</p></li></ul><p>Keanekaragaman yang luar biasa ini disebabkan oleh lokasinya yang strategis di persimpangan dua samudra besar (Pasifik dan Hindia) yang membawa arus air kaya nutrisi.</p><h2>🐠 Destinasi Selam Paling Ikonik di Indonesia</h2><p>Kekayaan bahari Indonesia tersebar luas dari barat hingga timur. Berikut adalah beberapa lokasi menyelam dan <em>snorkeling</em> paling ikonik yang wajib dikunjungi:</p><p><strong>Raja Ampat, Papua Barat:</strong> Sering disebut sebagai \"Amazon Lautan.\" Dengan lanskap pulau karst yang memesona di atas air, Raja Ampat menawarkan pengalaman menyelam dengan visibilitas luar biasa, <em>marine life</em> yang padat, dan peluang melihat Ikan Pari Manta raksasa.</p><ol><li><p><strong>Taman Nasional Bunaken, Sulawesi Utara:</strong> Terkenal dengan dinding karangnya (<em>reef wall</em>) yang curam. Bunaken adalah tempat sempurna untuk menyaksikan biota laut bergerak dari perairan dangkal ke kedalaman laut yang tak terhingga.</p><img class=\"rounded-lg max-w-full h-auto\" src=\"https://images.unsplash.com/photo-1619679663063-46b197c0f3c5?q=80&amp;w=1472&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\"></li><li><p><strong>Taman Nasional Komodo, Nusa Tenggara Timur:</strong> Selain terkenal dengan kadal purba Komodo, perairan di sekitarnya adalah tempat berkumpulnya hiu, lumba-lumba, dan <em>sea turtle</em>. Arusnya yang kuat menjamin pasokan makanan yang melimpah bagi biota laut.</p><img class=\"rounded-lg max-w-full h-auto\" src=\"https://plus.unsplash.com/premium_photo-1661876927592-7ce56910bbda?q=80&amp;w=1563&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\"></li><li><p><strong>Kepulauan Derawan, Kalimantan Timur:</strong> Dikenal karena <strong>Danau Kakaban</strong>, danau air payau tempat tinggal ubur-ubur tanpa sengat (<em>stingless jellyfish</em>), sebuah fenomena alam yang sangat langka.</p><img class=\"rounded-lg max-w-full h-auto\" src=\"https://images.unsplash.com/photo-1727402528721-9b3715d4ce1e?q=80&amp;w=1633&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\"></li></ol><h2>🌊 Tantangan Konservasi dan Peran Kita</h2><p>Meskipun memiliki kekayaan yang melimpah, ekosistem bawah laut Indonesia menghadapi ancaman serius, termasuk penangkapan ikan yang merusak (seperti pengeboman dan penggunaan sianida), polusi plastik, dan pemutihan karang (<em>coral bleaching</em>) akibat perubahan iklim.</p><p>Sebagai pengunjung, kita memiliki peran penting:</p><ul><li><p><strong>Pilih Operator Tur yang Bertanggung Jawab:</strong> Pastikan pemandu selam atau <em>snorkeling</em> Anda menjunjung tinggi etika konservasi.</p></li><li><p><strong>Hindari Menyentuh atau Menginjak Karang:</strong> Terumbu karang adalah organisme hidup yang sangat sensitif.</p></li></ul><p><strong>Kurangi Sampah Plastik:</strong> Sebisa mungkin bawa botol minum sendiri dan kurangi penggunaan plastik sekali pakai selama perjalanan.</p><video class=\"rounded-lg max-w-full w-full shadow-lg border border-gray-200 dark:border-gray-700 my-4\" src=\"/uploads/videos/video-1764761859778-rnyhxv.mp4\" controls=\"controls\" preload=\"metadata\" style=\"max-height: 500px;\"></video><hr class=\"my-8 border-gray-300 dark:border-gray-700\"><h2>Kesimpulan</h2><p>Keindahan bawah laut Indonesia adalah warisan alam global. Dari keragaman spesies hingga lanskap karang yang menakjubkan, Indonesia menawarkan petualangan yang mengubah pandangan bagi setiap penggemar laut. Mari kita jaga harta karun ini, sehingga generasi mendatang masih dapat menikmati pesona bahari tropis yang tak tertandingi.</p>', 'Indonesia, yang memiliki lebih dari 17.000 pulau, menyimpan harta karun berupa keindahan bawah laut yang tiada tara. Dari Raja Ampat hingga Taman Nasional Bunaken, mari selami mengapa perairan Indonesia diakui sebagai pusat biodiversitas laut dunia.', 'https://images.unsplash.com/photo-1571880826835-7ab2b833ad07?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 1, 23, 3, 'Alfattah', '2025-12-03 08:03:35.476', 'Jelajahi keindahan bawah laut Indonesia, jantung Coral Triangle dunia. Destinasi wajib: Raja Ampat dan Bunaken. Pahami pentingnya konservasi bahari Indonesia.', NULL, 'cmippx7al000ehm4o89bbt2zl', '2025-12-03 07:57:08.587', '2025-12-04 07:30:54.389', 0, 0, 0, 0, NULL, 'published', '<p>Indonesia, the largest archipelago in the world, is often referred to as the \"Emerald Equator.\" However, if we look deeper, the country\'s true beauty may lie beneath its surface. Indonesia is home to the <strong><em>Coral Triangle</em></strong>, an area of water globally recognized as the world\'s center of marine biodiversity.</p><h2>Why is Indonesia the Heart of the Coral Triangle?</h2><p>The Coral Triangle is an area of tropical waters that includes Indonesia, Malaysia, the Philippines, Papua New Guinea, Timor Leste and the Solomon Islands. Indonesia accounts for the largest and most vital part of this region.</p><p>Scientists note that in Indonesian waters:</p><ul><li><p>There are more than <strong>500 coral species</strong> (76% of the world\'s total coral species).</p><img class=\"rounded-lg max-w-full h-auto\" src=\"https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&amp;w=1374&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\"></li><li><p>Home to more than <strong>3,000 species of</strong> reef <strong>fish</strong>.</p><img class=\"rounded-lg max-w-full h-auto\" src=\"https://images.unsplash.com/photo-1604637733652-7b13b0bb7114?q=80&amp;w=1374&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\"></li><li><p>A breeding ground for six of the world\'s seven species of sea turtles.</p></li></ul><p>This incredible diversity is due to its strategic location at the crossroads of two large oceans (Pacific and Indian) that carry nutrient-rich water currents.</p><h2>🐠 Indonesia\'s Most Iconic Diving Destinations</h2><p>Indonesia\'s maritime riches are widespread from west to east. Here are some of the most iconic diving and <em>snorkeling</em> locations that are a must-visit:</p><p><strong>Raja Ampat, West Papua:</strong> Often referred to as the \"Oceanic Amazon.\" With a mesmerizing landscape of karst islands above the water, Raja Ampat offers diving experiences with exceptional visibility, dense <em>marine life</em>, and the chance to see giant Manta Rays.</p><ol><li><p><strong>Bunaken National Park, North Sulawesi:</strong> Famous for its steep<em>reef wall</em>. Bunaken is the perfect place to watch marine life move from shallow waters to the infinite depths of the ocean.</p><img class=\"rounded-lg max-w-full h-auto\" src=\"https://images.unsplash.com/photo-1619679663063-46b197c0f3c5?q=80&amp;w=1472&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\"></li><li><p><strong>Komodo National Park, East Nusa Tenggara:</strong> As well as being famous for the ancient Komodo lizards, the surrounding waters are home to sharks, dolphins and <em>sea turtles</em>. The strong currents ensure an abundant food supply for the marine life.</p><img class=\"rounded-lg max-w-full h-auto\" src=\"https://plus.unsplash.com/premium_photo-1661876927592-7ce56910bbda?q=80&amp;w=1563&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\"></li><li><p><strong>Derawan Islands, East Kalimantan:</strong> Known for <strong>Lake Kakaban</strong>, a brackish water lake where<em>stingless jellyfish</em> live, an extremely rare natural phenomenon.</p><img class=\"rounded-lg max-w-full h-auto\" src=\"https://images.unsplash.com/photo-1727402528721-9b3715d4ce1e?q=80&amp;w=1633&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\"></li></ol><h2>🌊 Conservation Challenges and Our Role</h2><p>Despite their abundance, Indonesia\'s underwater ecosystems face serious threats, including destructive fishing (such as bombing and cyanide use), plastic pollution, and<em>coral bleaching</em> due to climate change.</p><p>As visitors, we have an important role to play:</p><ul><li><p><strong>Choose a Responsible Tour Operator:</strong> Make sure your dive or <em>snorkeling</em> guide upholds conservation ethics.</p></li><li><p><strong>Avoid Touching or Stepping on Coral:</strong> Coral reefs are extremely sensitive living organisms.</p></li></ul><p><strong>Reduce Plastic Waste:</strong> Bring your own water bottle and reduce the use of single-use plastics during your trip.</p><video class=\"rounded-lg max-w-full w-full shadow-lg border border-gray-200 dark:border-gray-700 my-4\" src=\"/uploads/videos/video-1764761859778-rnyhxv.mp4\" controls=\"controls\" preload=\"metadata\" style=\"max-height: 500px;\"></video><hr class=\"my-8 border-gray-300 dark:border-gray-700\"><h2>Conclusion</h2><p>Indonesia\'s underwater beauty is a global natural heritage. From a diversity of species to stunning coral landscapes, Indonesia offers a sight-changing adventure for every ocean enthusiast. Let\'s protect this treasure, so that future generations can still enjoy the unparalleled charm of tropical marine life.</p>', 'Indonesia, with more than 17,000 islands, is a treasure trove of underwater beauty. From Raja Ampat to Bunaken National Park, let\'s dive into why Indonesia\'s waters are recognized as the world\'s center of marine biodiversity.', 'Explore the underwater beauty of Indonesia, the heart of the world\'s Coral Triangle. Mandatory destinations: Raja Ampat and Bunaken. Understand the importance of Indonesia\'s marine conservation.', 'Tropical Marine Paradise: Why Indonesia is the Heart of the World\'s Coral Triangle', NULL),
('cmir1dcft000ed29gy9b70hr5', 'Digital Minimalism: Seni Menemukan Fokus di Tengah Kebisingan Dunia Maya', 'digital-minimalism-seni-menemukan-fokus-di-tengah-kebisingan-dunia-maya', '<h1><strong>Mengapa Kita Perlu \"Diet\" Digital?</strong></h1><p>Pernahkah Anda membuka ponsel hanya untuk mengecek jam, tapi sadar 30 menit kemudian Anda sedang asyik <em>scrolling</em> media sosial tanpa tujuan? Di era modern, perhatian kita adalah komoditas yang paling diperebutkan. Notifikasi yang tak henti, email pekerjaan, dan arus informasi yang deras sering kali membuat otak kita kelelahan, cemas, dan sulit fokus. Inilah mengapa konsep <strong>Digital Minimalism</strong> menjadi semakin relevan.</p><h1><strong>Apa Itu Digital Minimalism?</strong></h1><p>Dipopulerkan oleh penulis Cal Newport, Digital Minimalism bukanlah tentang menolak teknologi sepenuhnya atau hidup seperti manusia gua. Ini adalah filosofi penggunaan teknologi di mana Anda memfokuskan waktu online Anda pada sejumlah kecil aktivitas yang dioptimalkan dengan hati-hati dan sangat mendukung hal-hal yang Anda hargai. Sederhananya: <strong>gunakan teknologi sebagai alat, bukan sebagai tuan.</strong></p><h2><strong>3 Langkah Awal Memulai Digital Minimalism</strong></h2><p>Jika Anda ingin mulai menerapkan gaya hidup ini, berikut adalah langkah praktisnya:</p><ol><li><p><strong>Lakukan Audit Aplikasi (The 30-Day Declutter):</strong> Hapus aplikasi yang memicu <em>scrolling</em> tanpa pikir panjang (seperti media sosial atau game) dari ponsel Anda selama 30 hari. Akseslah hanya melalui browser di laptop jika benar-benar perlu. Rasakan betapa banyaknya waktu luang yang tiba-tiba Anda miliki.</p></li><li><p><strong>Matikan Notifikasi Non-Esensial:</strong> Biarkan hanya notifikasi telepon atau pesan teks dari keluarga inti yang aktif. Matikan notifikasi \"likes\", berita terbaru, atau promo aplikasi belanja. Jadikan pengecekan ponsel sebagai aktivitas yang Anda <em>pilih</em> untuk lakukan, bukan reaksi terhadap bunyi \"ting\".</p></li><li><p><strong>Terapkan Waktu Bebas Layar (Phone-Free Zones):</strong> Tetapkan aturan sederhana, misalnya tidak ada ponsel di meja makan atau tidak membawa ponsel ke kamar tidur. Gunakan jam weker fisik alih-alih alarm ponsel untuk menghindari godaan mengecek internet begitu bangun tidur.</p></li></ol><hr class=\"my-8 border-gray-300 dark:border-gray-700\"><p><strong>Kesimpulan</strong></p><p>Menerapkan Digital Minimalism memberi ruang bagi otak untuk bernapas. Dengan mengurangi kebisingan digital, Anda akan menemukan kembali nikmatnya percakapan tatap muka yang mendalam, hobi yang terlupakan, dan ketenangan saat sendirian tanpa gangguan.</p><p></p>', 'Merasa lelah karena terus-menerus terhubung dengan notifikasi? Digital Minimalism menawarkan jalan keluar. Pelajari cara menggunakan teknologi dengan penuh kesadaran (intentionality) untuk mendapatkan kembali waktu, fokus, dan ketenangan pikiran Anda tanpa harus membuang smartphone.', 'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 1, 5, 2, 'Alfattah', '2025-12-04 06:18:33.059', 'Panduan lengkap memulai Digital Minimalism untuk pemula. Temukan cara mengurangi kecanduan gadget.', NULL, 'cmir19wxg000cd29g1wr92kex', '2025-12-04 06:09:41.169', '2025-12-04 07:42:43.272', 0, 0, 0, 0, NULL, 'published', '<h1><strong>Why do we need a digital \"diet\"?</strong></h1><p>Have you ever opened your phone to check the time, only to realize 30 minutes later that you\'re aimlessly <em>scrolling through</em> social media? In the modern era, our attention is the most contested commodity. Endless notifications, work emails, and a constant stream of information often leave our brains exhausted, anxious, and unfocused. This is why the concept of <strong>Digital Minimalism</strong> is becoming increasingly relevant.</p><h1><strong>What is Digital Minimalism?</strong></h1><p>Popularized by author Cal Newport, Digital Minimalism is not about rejecting technology completely or living like a caveman. It\'s a philosophy of technology use where you focus your online time on a small number of carefully optimized activities that strongly support the things you value. Simply put: <strong>use technology as a tool, not as a master.</strong></p><h2><strong>3 Steps to Starting Digital Minimalism</strong></h2><p>If you want to start implementing this lifestyle, here are the practical steps:</p><ol><li><p><strong>Do an App Audit (The 30-Day Declutter):</strong> Remove apps that trigger mindless <em>scrolling</em> (like social media or games) from your phone for 30 days. Only access them through your browser on your laptop if you really need to. Feel how much free time you suddenly have.</p></li><li><p><strong>Turn off Non-Essential Notifications:</strong> Keep only phone notifications or text messages from immediate family active. Turn off notifications for \"likes\", news updates, or shopping app promos. Make checking your phone an activity you <em>choose to</em> do, not a reaction to the \"ting\" sound.</p></li><li><p><strong>Implement Phone-Free Zones:</strong> Set simple rules, such as no phones at the dinner table or no phones in the bedroom. Use a physical alarm clock instead of a phone alarm to avoid the temptation to check the internet as soon as you wake up.</p></li></ol><hr class=\"my-8 border-gray-300 dark:border-gray-700\"><p><strong>Conclusion</strong></p><p>Implementing Digital Minimalism gives your brain room to breathe. By reducing digital noise, you will rediscover the joy of deep face-to-face conversations, forgotten hobbies, and the serenity of being alone without distractions.</p><p></p>', 'Feeling tired of being constantly connected to notifications? Digital Minimalism offers a way out. Learn how to use technology with intentionality to reclaim your time, focus and peace of mind without having to ditch your smartphone.', 'A complete guide to starting Digital Minimalism for beginners. Discover how to reduce your gadget addiction.', 'Digital Minimalism: The Art of Finding Focus in the Noise of Cyberspace', 'Wood Wide Web, Mikoriza, Fakta Unik, Hutan, Ekosistem, Biologi, Komunikasi Tumbuhan'),
('cmir1tot1000113o8c0lek1a4', 'Wood Wide Web: Internet Rahasia di Bawah Kaki Kita', 'wood-wide-web-internet-rahasia-di-bawah-kaki-kita', '<h1><strong>Hutan Bukan Sekadar Kumpulan Pohon</strong></h1><p>Saat berjalan di hutan, kita mungkin berpikir setiap pohon adalah individu yang berdiri sendiri, bersaing memperebutkan sinar matahari. Namun, sains modern membuktikan sebaliknya: hutan adalah sebuah komunitas sosial yang sangat terhubung. Jauh di bawah tanah, tersembunyi dari pandangan mata, terdapat jaringan rumit yang dijuluki para ilmuwan sebagai <strong>\"Wood Wide Web\"</strong>.</p><h1>Siapa \"Provider\" Internet Hutan Ini?</h1><p>Jaringan ini tidak terbuat dari kabel serat optik, melainkan dari jamur mikroskopis yang disebut <strong>mikoriza</strong> (mycorrhiza). Benang-benang halus jamur ini (hifa) menempel pada akar pohon dan menghubungkan satu pohon dengan pohon lainnya, menciptakan sistem komunikasi raksasa.</p><p>Hubungan ini bersifat <em>simbiosis mutualisme</em> (saling menguntungkan):</p><ul><li><p><strong>Pohon</strong> memberikan gula (hasil fotosintesis) kepada jamur.</p></li><li><p><strong>Jamur</strong> menyediakan nutrisi tanah (seperti fosfor dan nitrogen) dan air yang sulit dijangkau oleh akar pohon sendirian.</p></li></ul><h1><strong>Apa yang Mereka Bicarakan?</strong></h1><p>Melalui jaringan ini, pohon melakukan hal-hal yang menakjubkan:</p><ol><li><p><strong>Transfer Kekayaan:</strong> \"Pohon Ibu\" (pohon tua yang besar) dapat mengirimkan kelebihan gula kepada pohon-pohon muda (anakan) yang tertutup bayangan agar tetap hidup.</p></li><li><p><strong>Sistem Peringatan Dini:</strong> Jika satu pohon diserang hama atau kutu, ia dapat melepaskan sinyal kimia melalui akar ke jaringan jamur. Pohon tetangga yang menerima sinyal ini akan segera memproduksi zat pertahanan untuk melindungi diri sebelum hama datang.</p></li><li><p><strong>Sabotase:</strong> Beberapa spesies pohon tertentu bahkan menggunakan jaringan ini untuk menyebarkan racun guna mematikan pesaing dari spesies lain.</p></li></ol><p>Ternyata, hutan di bawah tanah jauh lebih sibuk, cerdas, dan kooperatif daripada yang pernah kita bayangkan.</p>', 'Tahukah Anda bahwa pohon-pohon di hutan diam-diam saling \"chatting\" dan bertransaksi? Temukan rahasia Wood Wide Web, jaringan bawah tanah menakjubkan yang mengubah cara kita memandang pepohonan.', 'https://images.unsplash.com/photo-1523274620588-4c03146581a1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 1, 5, 2, 'Alfattah', '2025-12-04 06:24:38.740', NULL, NULL, 'cmir1xsr3000a13o86uc4wunf', '2025-12-04 06:22:23.696', '2025-12-04 07:42:53.372', 0, 0, 0, 0, NULL, 'published', '<h1><strong>A forest is not just a collection of trees</strong></h1><p>When walking in a forest, we might think of each tree as a solitary individual, competing for sunlight. But modern science proves otherwise: forests are highly connected social communities. Deep underground, hidden from view, lies an intricate network that scientists have dubbed the <strong>\"Wood Wide Web\"</strong>.</p><h1>Who is the \"Provider\" of this Forest Internet?</h1><p>This network is not made of fiber optic cables, but of microscopic fungi called <strong>mycorrhiza</strong>. These fungi\'s fine threads (hyphae) attach to tree roots and connect one tree to another, creating a giant communication system.</p><p>This relationship is <em>symbiotic mutualism</em>:</p><ul><li><p>The<strong>tree</strong> provides sugar (from photosynthesis) to the fungus.</p></li><li><p>The<strong>fungi</strong> provide soil nutrients (such as phosphorus and nitrogen) and water that the tree roots could not reach on their own.</p></li></ul><h1><strong>What Are They Talking About?</strong></h1><p>Through this network, trees do amazing things:</p><ol><li><p><strong>Wealth Transfer:</strong> \"Mother Trees\" (big old trees) can send excess sugar to young trees (saplings) covered in shadow to keep them alive.</p></li><li><p><strong>Early Warning System:</strong> If one tree is attacked by pests or bugs, it can release chemical signals through its roots to a network of fungi. Neighboring trees that receive this signal will immediately produce defense substances to protect themselves before the pests arrive.</p></li><li><p><strong>Sabotage:</strong> Certain tree species even use this network to spread toxins to kill competitors of other species.</p></li></ol><p>As it turns out, the forest below ground is a lot busier, smarter and more cooperative than we ever imagined.</p>', 'Did you know that trees in the forest are secretly \"chatting\" and transacting with each other? Discover the secrets of the Wood Wide Web, an amazing underground network that is changing the way we view trees.', NULL, 'Wood Wide Web: The Secret Internet Under Our Feet', 'Wood Wide Web, Mikoriza, Fakta Unik, Hutan, Ekosistem, Biologi, Komunikasi Tumbuhan');

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `content` text DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `demoUrl` varchar(191) DEFAULT NULL,
  `githubUrl` varchar(191) DEFAULT NULL,
  `techStack` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Completed',
  `views` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `descriptionEn` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `value` text NOT NULL,
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`, `updatedAt`) VALUES
('cmioq445u00016ihxq379cbek', 'site_name', '', '2025-12-03 07:50:13.342'),
('cmioq446c00026ihxdtb0w5s6', 'site_bio', '', '2025-12-03 07:50:13.411'),
('cmioq446p00036ihxzuf4heb5', 'owner_name', '', '2025-12-03 07:50:13.421'),
('cmioq446x00046ihxxug2vhhv', 'contact_email', '', '2025-12-03 07:50:13.437'),
('cmip7r1ur0001k8in4xcozpaa', 'about_page_content', '{\"name\":\"Alfattah Atalarais\",\"title\":\"\",\"titleEn\":\"\",\"tagline\":\"Mendokumentasikan perjalanan belajar saya, berbagi perspektif baru, dan membangun jejak digital saya satu per satu.\",\"taglineEn\":\"Documenting my learning journey, sharing new perspectives, and building my digital footprint one by one.\",\"profileImage\":\"/uploads/profile-1764718527612.png\",\"location\":\"Binjai, North Sumatra\",\"email\":\"alfatahatalarais12@gmail.com\",\"website\":\"\",\"bio\":\"\",\"bioEn\":\"awdawd\",\"cvUrl\":\"https://bit.ly/AlfattahCV\",\"portfolioUrl\":\"http://bit.ly/AlfattahPortolio\",\"techStack\":\"HTML5, CSS, JavaScript, MySQL\",\"tools\":\"Microsoft Word, Microsoft Excel, Microsoft PowerPoint, Canva, VS Code, Adobe Photoshop, Adobe Lightroom, Google Drive\",\"hobbies\":\"Photography, Travelling\",\"experiences\":[{\"id\":\"1764718664053\",\"title\":\"Software Engineer Intern\",\"company\":\"Fairtech Pte Ltd\",\"startMonth\":\"06\",\"startYear\":\"2025\",\"endMonth\":\"09\",\"endYear\":\"2025\",\"descriptionEn\":\"I applied full-stack development principles to build functional web applications, combining user-focused frontend design with database-integrated backend systems. I also coordinated data migration projects between servers, working closely with the technical team to plan, execute, and document each process. During these projects, I followed an Agile-based workflow in the software development lifecycle, collaborating through Git, troubleshooting, and ensuring quality through thorough testing and debugging.\",\"descriptionId\":\"Saya menerapkan prinsip pengembangan full-stack untuk membangun aplikasi web fungsional, menggabungkan desain frontend yang berfokus pada pengguna dengan sistem backend yang terintegrasi dengan database. Saya juga mengoordinasikan proyek migrasi data antar server, bekerja sama erat dengan tim teknis untuk merencanakan, melaksanakan, dan mendokumentasikan setiap proses. Selama proyek-proyek ini, saya mengikuti alur kerja berbasis Agile dalam siklus hidup pengembangan perangkat lunak, berkolaborasi melalui Git, mengatasi masalah, dan memastikan kualitas melalui pengujian dan debugging yang menyeluruh.\",\"isCurrent\":false},{\"id\":\"1764730636492\",\"title\":\"IT Engineer Freelance\",\"company\":\"PT.Graha Karya Informasi\",\"startMonth\":\"04\",\"startYear\":\"2023\",\"endMonth\":\"04\",\"endYear\":\"2024\",\"descriptionEn\":\"I was responsible for the installation and configuration of server systems, as well as the management of data backups at various client locations in accordance with company standards. I also coordinated data migration projects between servers, working closely with the technical team from planning to documentation to ensure smooth and secure operations.\",\"descriptionId\":\"Saya bertanggung jawab atas pemasangan dan konfigurasi sistem server, serta pengelolaan cadangan data di berbagai lokasi klien sesuai dengan standar perusahaan. Saya juga mengoordinasikan proyek migrasi data antar server, bekerja sama dengan tim teknis mulai dari perencanaan hingga dokumentasi untuk memastikan operasi yang lancar dan aman.\",\"isCurrent\":false}],\"volunteering\":[{\"id\":\"1764730915782\",\"role\":\"Event Commitee\",\"organization\":\"Google DevFest 2023\",\"period\":\"2023\",\"descriptionEn\":\"Fully responsible for the smooth operation of the registration area. I managed the entry flow of participants to minimize waiting time and ensure the event could start on time. This role required close coordination with the operations team regarding security protocols and data validation. Through this experience, I honed my time management skills, interpersonal communication in handling large crowds, and cross-functional teamwork.\",\"descriptionId\":\"Bertanggung jawab penuh atas kelancaran operasional di area registrasi. Saya mengelola alur masuk peserta untuk meminimalkan waktu tunggu dan memastikan acara dapat dimulai tepat waktu. Peran ini menuntut koordinasi ketat dengan tim operasional terkait protokol keamanan dan validasi data. Melalui pengalaman ini, saya mengasah kemampuan manajemen waktu, komunikasi interpersonal dalam menangani kerumunan besar, serta kerja sama tim lintas fungsi .\"}],\"educations\":[{\"id\":\"1764730814927\",\"degree\":\"Bachelor of Computer Science\",\"institution\":\"Universitas Negeri Medan\",\"period\":\"\",\"description\":\"\",\"gpa\":\"3.71\",\"startYear\":\"2020\",\"endYear\":\"2024\",\"thesis\":\"Deteksi Jenis Sampah Otomatis menggunakan YOLO\",\"locationUrl\":\"https://share.google/sXGYJAezo224bYs1X\"}]}', '2025-12-04 03:58:02.637'),
('cmipgvawu0005dei4nj7utusq', 'social_github', '', '2025-12-03 07:44:41.902'),
('cmipgvax00006dei4uvpxbphn', 'social_linkedin', '', '2025-12-03 07:44:41.911'),
('cmipgvax70007dei41gcagbd4', 'social_twitter', '', '2025-12-03 07:44:41.921'),
('cmipgvaxf0008dei4sjjuwz7q', 'social_instagram', '', '2025-12-03 07:44:41.931'),
('cmipgvaxn0009dei4268sp1h4', 'social_whatsapp', '', '2025-12-03 07:44:41.941'),
('cmipgvcfl000jdei45smsxnd5', 'seo_description', '', '2025-12-03 07:44:42.733'),
('cmipgvcfq000kdei4jvfgnd5w', 'seo_keywords', '', '2025-12-03 07:44:42.745'),
('cmipgve64000wdei4tm75em8p', 'page_blog', 'true', '2025-12-03 07:50:59.105'),
('cmipgve6a000xdei4z6wf9n1h', 'page_portfolio', 'false', '2025-12-03 07:50:59.114'),
('cmipgve6i000ydei4kpxqgitn', 'page_watchlist', 'true', '2025-12-03 07:50:59.126'),
('cmipgve6o000zdei49fmic7w7', 'page_about', 'true', '2025-12-03 07:50:59.133');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `name`, `createdAt`, `updatedAt`) VALUES
('cmioo291p0000uw0ltmv4p63k', 'alfatahatalarais12@gmail.com', '$2b$10$lnDLGqrSe57KTYSSrMGMN.n1TW9f2avrWuOyt50QznsvYj9nN61/q', 'Administrator', '2025-12-02 14:21:36.205', '2025-12-02 14:21:36.205');

-- --------------------------------------------------------

--
-- Table structure for table `watchlist`
--

CREATE TABLE `watchlist` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL DEFAULT 'Anime',
  `genre` varchar(191) DEFAULT NULL,
  `totalEpisode` int(11) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Completed',
  `rating` double DEFAULT NULL,
  `imageUrl` varchar(191) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `completedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `notesId` text DEFAULT NULL,
  `notesEn` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `watchlist`
--

INSERT INTO `watchlist` (`id`, `title`, `type`, `genre`, `totalEpisode`, `status`, `rating`, `imageUrl`, `year`, `completedAt`, `createdAt`, `updatedAt`, `notesId`, `notesEn`) VALUES
('cmipfgxdt000pg8q3h4am4hwt', 'Breaking Bad', 'Series', 'Drama, Crime', 62, 'Completed', 9.4, 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg', 2008, '2025-12-04 04:27:14.633', '2025-12-03 03:08:50.559', '2025-12-04 04:27:14.637', 'Plotnya pinter dan detail. Jarang ada plot hole yang ganggu. Walaupun durasinya panjang, tapi setiap episode rasanya penting buat jalan ceritanya. Pengembangan karakternya salah satu yang terbaik yang pernah saya tonton.', 'The plot is clever and detailed. There are rarely any plot holes that get in the way. Although the duration is long, every episode feels important to the storyline. The character development is one of the best I\'ve ever seen.'),
('cmipfit20000qg8q3k5si1sou', 'Dark', 'Series', 'Crime, Drama, Sci-Fi & Fantasy, Mystery', 26, 'Completed', 9, 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg', 2017, '2025-12-03 03:47:30.415', '2025-12-03 03:10:18.264', '2025-12-03 03:47:30.416', 'Ceritanya memang rumit dan butuh fokus penuh karena banyak timeline dan karakter. Bukan tipe tontonan santai yang bisa disambi. Tapi, penulisannya sangat rapi. Semua detail kecil di awal ternyata punya arti di akhir. Konsep time travel-nya dieksekusi dengan sangat logis dan konsisten.', 'The story is complicated and requires full focus because of the many timelines and characters. It\'s not the type of casual viewing that can be juggled. However, the writing is very neat. All the little details at the beginning turn out to have meaning at the end. The concept of time travel is executed very logically and consistently.'),
('cmipfk12k000rg8q3a35hud1e', 'The Boys', 'Series', 'Sci-Fi & Fantasy, Action & Adventure', 33, 'Completed', 8, 'https://image.tmdb.org/t/p/w500/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg', 2019, '2025-12-03 03:47:56.683', '2025-12-03 03:11:15.308', '2025-12-03 03:47:56.684', 'Ceritanya seru dan pace-nya cepat, nggak bertele-tele. Visual efeknya juga bagus untuk ukuran series. Cuma memang cukup gore dan brutal, jadi mungkin nggak cocok buat semua orang. Tapi kalau suka cerita yang gelap dan penuh intrik, ini rekomendasi yang bagus.', 'The story is exciting and the pace is fast, not long-winded. The visual effects are also good for a series. It\'s just quite gory and brutal, so it might not be suitable for everyone. But if you like dark and intriguing stories, this is a good recommendation.'),
('cmipfmah4000sg8q3zw5hjx6s', 'Alice in Borderland', 'Series', 'Mystery, Drama, Action & Adventure', 22, 'Completed', 8, 'https://image.tmdb.org/t/p/w500/Ac8ruycRXzgcsndTZFK6ouGA0FA.jpg', 2020, '2025-12-03 03:47:49.140', '2025-12-03 03:13:00.808', '2025-12-03 03:47:49.141', 'Konsep survival-nya menarik karena pembagian jenis game berdasarkan kartu remi itu unik. Alurnya cepat, jadi nggak bikin ngantuk. Untuk penikmat teka-teki, series ini memuaskan. Cuma mungkin ending dan penjelasan di season 2 agak terlalu filosofis buat sebagian orang, tapi secara keseluruhan eksekusinya solid.', 'The survival concept is interesting because the division of game types based on playing cards is unique. The flow is fast, so it doesn\'t get sleepy. For puzzle lovers, this series is satisfying. The ending and explanation in season 2 might be a bit too philosophical for some people, but overall the execution is solid.'),
('cmipfndey000tg8q3in2h9949', 'Gen V', 'Series', 'Action & Adventure, Drama, Sci-Fi & Fantasy', 16, 'Completed', 8, 'https://image.tmdb.org/t/p/w500/tEv842Nd5uMSavURG4aQO1pNtst.jpg', 2023, '2025-12-03 03:47:38.680', '2025-12-03 03:13:51.274', '2025-12-03 03:47:38.681', 'Alurnya solid dan pace-nya terjaga. Visual efeknya bagus, selevel dengan The Boys. Meskipun skalanya terasa lebih kecil karena fokus di area kampus, tapi konfliknya tetap intens. Tontonan wajib buat yang mau paham konteks lengkap universe ini sebelum lanjut ke season berikutnya.', 'The plot is solid and the pace is maintained. The visual effects are good, on the same level as The Boys. Although the scale feels smaller because it focuses on the campus area, the conflict is still intense. A must-watch for those who want to understand the full context of this universe before moving on to the next season.'),
('cmir0822i0001d29g9biahvn0', 'My Hero Academia', 'Anime', 'Action & Adventure, Animation, Sci-Fi & Fantasy', 170, 'Watching', 8, 'https://image.tmdb.org/t/p/w500/phuYuzqWW9ru8EA3HVjE9W2Rr3M.jpg', 2016, NULL, '2025-12-04 05:37:34.840', '2025-12-04 05:37:34.840', 'Definisi anime shonen modern yang solid. Perjalanan Deku dari nol sampai jadi hero beneran kerasa emosional. Bagian terbaiknya jelas di scoring musiknya, lagu \'You Say Run\' nggak pernah gagal bikin merinding pas adegan berantem. Walaupun temanya klise superhero, tapi eksekusi animasinya memanjakan mata.', 'The definition of a solid modern shonen anime. Deku\'s journey from zero to hero is emotional. The best part is definitely the music score, the song \'You Say Run\' never fails to give you goosebumps during the fight scenes. Although the theme is superhero cliché, the animation execution is a treat for the eyes.');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('10b1c6c3-ce1e-4c9c-b4e0-d8c848d32952', 'e6cc31fb2488e89009b78a43839c1f08f2b146472d5fe030151b97be927924fe', '2025-12-02 14:21:24.010', '20251121233302_init', NULL, NULL, '2025-12-02 14:21:23.559', 1),
('3c03f0e9-035b-4a1d-9778-891148e38175', '2500e78a3b64a53fd57952b3331056f9b33940a618223a707f3010e7453db77a', '2025-12-02 14:21:24.622', '20251201114722_add_post_status_and_archived', NULL, NULL, '2025-12-02 14:21:24.535', 1),
('487b4021-a8c2-4a08-b7ab-af3f8c135413', 'dfa9a1ed443ea7fe76be6b35b443331f43f80485dc6ad57a7ecdb4302adbe443', '2025-12-02 14:21:31.146', '20251202142131_add_bilingual_fields', NULL, NULL, '2025-12-02 14:21:31.081', 1),
('96bd119e-6cb3-4a33-8324-019058e57044', '3d26b9a9d7dd6cde81087054caa6a22afc8663061023cefa6ded5df140b391d2', '2025-12-03 03:33:29.550', '20251203033255_add_bilingual_watchlist_notes', NULL, NULL, '2025-12-03 03:33:29.491', 1),
('a879b774-4967-450e-bb7f-83f829322ac7', '633f73843ff30a71d677782317d6631f4670c8d2988d836d4a8396b7096518b6', '2025-12-02 14:21:24.531', '20251123000000_fix_settings_value_text', NULL, NULL, '2025-12-02 14:21:24.013', 1),
('f54a66ba-68ee-48c9-af38-423799c555ac', '8752282764a2e7691e33f7633aa3840e97f1252505fb523fd03317d4d45ee8bd', '2025-12-04 06:40:47.917', '20251204064047_remove_tag_model_use_string_tags', NULL, NULL, '2025-12-04 06:40:47.693', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Category_name_key` (`name`),
  ADD UNIQUE KEY `Category_slug_key` (`slug`),
  ADD KEY `Category_slug_idx` (`slug`);

--
-- Indexes for table `loginactivity`
--
ALTER TABLE `loginactivity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `LoginActivity_email_idx` (`email`),
  ADD KEY `LoginActivity_ipAddress_idx` (`ipAddress`),
  ADD KEY `LoginActivity_createdAt_idx` (`createdAt`),
  ADD KEY `LoginActivity_success_idx` (`success`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Media_createdAt_idx` (`createdAt`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Post_slug_key` (`slug`),
  ADD KEY `Post_slug_idx` (`slug`),
  ADD KEY `Post_published_idx` (`published`),
  ADD KEY `Post_createdAt_idx` (`createdAt`),
  ADD KEY `Post_publishedAt_idx` (`publishedAt`),
  ADD KEY `Post_categoryId_idx` (`categoryId`),
  ADD KEY `Post_published_publishedAt_idx` (`published`,`publishedAt`),
  ADD KEY `Post_published_views_idx` (`published`,`views`),
  ADD KEY `Post_status_idx` (`status`),
  ADD KEY `Post_status_publishedAt_idx` (`status`,`publishedAt`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Project_slug_key` (`slug`),
  ADD KEY `Project_slug_idx` (`slug`),
  ADD KEY `Project_createdAt_idx` (`createdAt`),
  ADD KEY `Project_views_idx` (`views`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Settings_key_key` (`key`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `watchlist`
--
ALTER TABLE `watchlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Watchlist_status_idx` (`status`),
  ADD KEY `Watchlist_type_idx` (`type`),
  ADD KEY `Watchlist_rating_idx` (`rating`),
  ADD KEY `Watchlist_createdAt_idx` (`createdAt`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `Post_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
