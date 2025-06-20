import { useNavigate } from "react-router-dom";
import Footer from "./footer";

const HomePage = () => {
  const navigate = useNavigate();
  

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Selamat Datang di Oemah Gerabah</h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Temukan keunikan produk kerajinan tangan, pesan kunjungan ke tempat kami, dan rasakan pengalaman membuat gerabah secara langsung!
          </p>
        </section>

        <div className="flex justify-center gap-6 flex-wrap">
          <button
            onClick={() => navigate("/booking-kunjungan")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
          >
            Booking Kunjungan
          </button>

          <button
            onClick={() => navigate("/products")}
            className="bg-white border-2 border-orange-500 hover:bg-orange-100 text-orange-600 font-semibold px-6 py-3 rounded-lg shadow transition"
          >
            Lihat Produk
          </button>
        </div>

        <section className="mt-16 text-center">
          <img
            src="https://i.pinimg.com/736x/12/5b/cf/125bcfb8d1b3349c5222bb15449594d4.jpg" 
            alt="Galeri Gerabah"
            className="mx-auto rounded-xl shadow-lg"
          />
        </section>
      </main>
    </div>

      <Footer/>
</>
  )
};

export default HomePage;