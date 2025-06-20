import gerabah1 from '../assets/gambar1.webp';
import gerabah2 from '../assets/gerabah2.webp';
import gerabah3 from '../assets/gerabah3.webp';
import gerabah4 from '../assets/gerabah4.webp';
import gerabah5 from '../assets/gerabah5.webp';
import gerabah6 from '../assets/gerabah6.webp';

const galleryImages = [
  { id: 1, src: gerabah1, alt: 'Gerabah 1' },
  { id: 2, src: gerabah2, alt: 'Gerabah 2' },
  { id: 3, src: gerabah3, alt: 'Gerabah 3' },
  { id: 4, src: gerabah4, alt: 'Gerabah 4' },
  { id: 5, src: gerabah5, alt: 'Gerabah 5' },
  { id: 6, src: gerabah6, alt: 'Gerabah 6' },

];

const Galery = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-orange-600 mb-4">Galeri Oemah Gerabah</h1>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Temukan berbagai karya gerabah unik hasil buatan tangan pengrajin lokal kami yang penuh kreativitas dan kearifan lokal.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {galleryImages.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Galery;
