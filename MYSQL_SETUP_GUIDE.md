# 🔧 Setup Database MySQL - Panduan Cepat

## ✅ MySQL Server Sudah Running!

MySQL server Anda sudah running di port 3306 (PID 8532).

---

## 📝 Langkah Setup Database

### **1. Cek File `.env` Anda**

Pastikan file `.env` di root project memiliki `DATABASE_URL` yang benar:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE_NAME"
```

**Contoh:**
```env
# Jika username: root, password: (kosong), database: my_web
DATABASE_URL="mysql://root@localhost:3306/my_web"

# Jika username: root, password: password123, database: my_web
DATABASE_URL="mysql://root:password123@localhost:3306/my_web"
```

**Format lengkap:**
```
mysql://[username]:[password]@[host]:[port]/[database_name]
```

---

### **2. Buat Database di MySQL**

Buka MySQL client (phpMyAdmin, MySQL Workbench, atau command line) dan jalankan:

```sql
CREATE DATABASE my_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Atau via command line:**
```bash
# Jika MySQL ada di PATH
mysql -u root -p -e "CREATE DATABASE my_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Jika pakai XAMPP (Windows)
"C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE my_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

---

### **3. Jalankan Prisma Migration**

Setelah database dibuat dan `.env` sudah benar, jalankan:

```bash
npx prisma migrate dev --name init
```

Ini akan:
- Membuat semua tabel yang dibutuhkan
- Generate Prisma Client

---

### **4. (Opsional) Seed Database**

Jika ingin mengisi data awal:

```bash
npm run db:seed
```

---

### **5. Restart Development Server**

```bash
npm run dev
```

---

## 🔍 Troubleshooting

### **Error: Access denied for user**
- Cek username dan password di `DATABASE_URL`
- Pastikan user MySQL memiliki akses ke database

### **Error: Unknown database**
- Database belum dibuat, jalankan `CREATE DATABASE` di step 2

### **Error: Can't reach database server**
- MySQL server tidak running
- Port salah (default: 3306)
- Host salah (default: localhost atau 127.0.0.1)

---

## 📋 Checklist

- [ ] MySQL server running (✅ Sudah running!)
- [ ] File `.env` ada dan `DATABASE_URL` benar
- [ ] Database `my_web` sudah dibuat
- [ ] Jalankan `npx prisma migrate dev`
- [ ] Restart `npm run dev`

---

## 💡 Tips

**Jika pakai XAMPP:**
- Pastikan Apache dan MySQL sudah start di XAMPP Control Panel
- Default username: `root`, password: (kosong)
- DATABASE_URL: `mysql://root@localhost:3306/my_web`

**Jika pakai MySQL Workbench:**
- Buat connection baru ke localhost:3306
- Buat database `my_web` via GUI
- Copy kredensial ke `.env`

---

## ✅ Setelah Setup Berhasil

Website Anda akan bisa diakses di:
- **English**: http://localhost:3000/en
- **Indonesian**: http://localhost:3000/id

Dan semua fitur translate sudah 100% berfungsi! 🎉
