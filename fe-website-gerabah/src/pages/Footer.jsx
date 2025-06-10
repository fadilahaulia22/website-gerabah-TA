import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full  bg-orange-200 text-black mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        
        {/* Tentang Kami */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Tentang Kami</h2>
          <p className="text-sm leading-relaxed">
            Oemah Gerabah menyediakan berbagai macam produk gerabah berkualitas, hasil karya pengrajin lokal Indonesia. Kami berkomitmen menjaga warisan budaya melalui sentuhan modern.
          </p>
        </div>

        {/* Kontak */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Kontak</h2>
          <ul className="text-sm space-y-2">
            <li>📍 Jl. Kerajinan No. 10, Gebangsari</li>
            <li>📞 0812-3456-7890</li>
            <li>📧 oemahgerabah@gmail.com</li>
          </ul>
        </div>

        {/* Ikuti Kami */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Ikuti Kami</h2>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-orange-500 transition flex items-center space-x-2">
              <Instagram size={20} /> <span>Instagram</span>
            </a>
            <a href="#" className="hover:text-orange-500 transition flex items-center space-x-2">
              <Facebook size={20} /> <span>Facebook</span>
            </a>
            <a href="#" className="hover:text-orange-500 transition flex items-center space-x-2">
              <Youtube size={20} /> <span>Youtube</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer bawah */}
      <div className="text-center text-sm py-4 border-t border-gray-700">
        &copy; {new Date().getFullYear()} Oemah Gerabah. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
