
const galleryImages = [
  { id: 1, src: '../assets/gerabah1.jpg', alt: 'Gerabah 1' },
  { id: 2, src: '/images/gerabah2.jpg', alt: 'Gerabah 2' },
  { id: 3, src: '/images/gerabah3.jpg', alt: 'Gerabah 3' },
  { id: 4, src: '/images/gerabah4.jpg', alt: 'Gerabah 4' },
  { id: 5, src: '/images/gerabah5.jpg', alt: 'Gerabah 5' },
  { id: 6, src: '/images/gerabah6.jpg', alt: 'Gerabah 6' },
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
