import os, subprocess
os.chdir('d:/SEMSETER 6/PBS-IF23FX/project/LokaWisata/frontend-user')
subprocess.run(['git', 'reset', '--hard', '7d90752'], check=True)
commits = [
    ('membuat kerangka dasar proyek frontend', ['package.json', 'package-lock.json', '.gitignore']),
    ('menambahkan lisensi dan pedoman pengembangan', ['LICENSE', 'CLAUDE.md', 'AGENTS.md', '.claude/']),
    ('mengatur konfigurasi Expo dan Babel', ['app.json', 'babel.config.js']),
    ('menambahkan aset gambar dan ikon aplikasi', ['assets/']),
    ('mendefinisikan konstanta warna dan tema aplikasi', ['src/utils/constants.js']),
    ('membuat utilitas penyimpanan token lokal', ['src/storage/tokenStorage.js']),
    ('mengonfigurasi klien API dan wrapper jaringan', ['src/api/axios.js']),
    ('membuat layanan autentikasi', ['src/api/authApi.js']),
    ('membuat layanan destinasi wisata', ['src/api/wisataApi.js']),
    ('membuat layanan data ulasan pengguna', ['src/api/reviewApi.js']),
    ('membuat layanan data favorit pengguna', ['src/api/favoriteApi.js']),
    ('membuat komponen label kategori', ['src/components/CategoryChip.js']),
    ('membuat komponen penilai bintang', ['src/components/RatingStars.js']),
    ('membuat komponen kartu ulasan', ['src/components/ReviewCard.js']),
    ('membuat komponen kerangka loading', ['src/components/SkeletonLoader.js']),
    ('membuat komponen kartu destinasi wisata', ['src/components/WisataCard.js']),
    ('membuat state global untuk sesi pengguna', ['src/context/AuthContext.js']),
    ('membuat custom hook akses autentikasi', ['src/hooks/useAuth.js']),
    ('membuat halaman login', ['src/screens/auth/LoginScreen.js']),
    ('membuat halaman registrasi', ['src/screens/auth/RegisterScreen.js']),
    ('membuat halaman detail wisata', ['src/screens/detail/DetailWisataScreen.js']),
    ('membuat halaman penjelajahan', ['src/screens/explore/ExploreScreen.js']),
    ('membuat halaman daftar favorit', ['src/screens/favorite/FavoriteScreen.js']),
    ('membuat halaman beranda utama', ['src/screens/home/HomeScreen.js']),
    ('membuat halaman profil pengguna', ['src/screens/profile/ProfileScreen.js']),
    ('menyusun navigasi layar autentikasi', ['src/navigation/AuthNavigator.js']),
    ('menyusun navigasi menu tab bawah', ['src/navigation/BottomTabNavigator.js']),
    ('menyusun navigasi utama aplikasi', ['src/navigation/RootNavigator.js']),
    ('menginisialisasi entry point aplikasi', ['App.js', 'index.js']),
    ('menyempurnakan konfigurasi IDE untuk lingkungan JavaScript murni', ['jsconfig.json'])
]
for msg, files in commits:
    cmd = ['git', 'checkout', 'backup-before-rewrite-final', '--'] + files
    subprocess.run(cmd, check=True)
    subprocess.run(['git', 'commit', '-m', msg], check=True)

subprocess.run(['git', 'cherry-pick', 'f153a5d'], check=True)

