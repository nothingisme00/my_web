# 🔧 Troubleshooting Database Connection

## Masalah Saat Ini
Prisma tidak bisa connect ke MySQL meskipun MySQL sudah running di port 3306.

## Solusi yang Perlu Dicoba

### **1. Ubah DATABASE_URL di file `.env`**

Coba ganti format DATABASE_URL Anda dari:
```
DATABASE_URL="mysql://root:@127.0.0.1:3306/my_web_db"
```

Menjadi salah satu dari ini (coba satu per satu):

**Option A: Tanpa ':' untuk password kosong**
```
DATABASE_URL="mysql://root@127.0.0.1:3306/my_web_db"
```

**Option B: Gunakan localhost instead of 127.0.0.1**
```
DATABASE_URL="mysql://root@localhost:3306/my_web_db"
```

**Option C: Dengan socket (khusus XAMPP Windows)**
```
DATABASE_URL="mysql://root@localhost:3306/my_web_db?socket=/tmp/mysql.sock"
```

### **2. Create Database Manual via phpMyAdmin**

Karena phpMyAdmin Anda tidak bisa dibuka, coba akses via browser:
- http://localhost/phpmyadmin
- http://localhost:8080/phpmyadmin (jika Apache di port 8080)
- http://127.0.0.1/phpmyadmin

Lalu create database dengan nama: **my_web_db**

### **3. Cek XAMPP Control Panel**

Pastikan di XAMPP Control Panel:
- ✅ Apache: Running (hijau)
- ✅ MySQL: Running (hijau)

### **4. Restart MySQL**

Di XAMPP Control Panel:
1. Stop MySQL
2. Start MySQL lagi
3. Coba jalankan `npx prisma db push` lagi

### **5. Cek MySQL Configuration**

File: `C:\xampp2\mysql\bin\my.ini`

Pastikan ada baris:
```
bind-address = 127.0.0.1
port = 3306
```

## Langkah Selanjutnya

Setelah DATABASE_URL benar dan database created:

```bash
# 1. Push schema ke database
npx prisma db push

# 2. Generate Prisma Client
npx prisma generate

# 3. (Optional) Seed data
npm run db:seed

# 4. Restart dev server
npm run dev
```

## Jika Masih Error

Beritahu saya:
1. Error message lengkap dari `npx prisma db push`
2. Apakah bisa akses phpMyAdmin? Di URL apa?
3. Screenshot XAMPP Control Panel (Apache & MySQL status)
