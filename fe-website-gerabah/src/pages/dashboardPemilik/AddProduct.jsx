import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct, getCategories } from "../../services/product.services";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
    is_custom: false,
    category_id: "",
  });


  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Tambah Produk";
    getCategories((data) => setCategories(data));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.category_id) {
      alert("Pilih kategori terlebih dahulu");
      return;
    }


    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (["price", "stock", "category_id"].includes(key)) {
        if (value === "" || value === null) return;
        formData.append(key, Number(value));
      } else {
        formData.append(key, value);
      }
    });


    if (imageFile) {
      formData.append("image_url", imageFile);
    }


    addProduct(formData, () => {
      alert("Produk berhasil ditambahkan!");
      navigate("/product-management");
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Tambah Produk Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Harga</label>
                <div className="flex items-center">
                    <span className="px-3 py-2 bg-gray-200 rounded-l-md border border-r-0 border-gray-300 text-gray-700">Rp</span>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Stok</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Gambar</label>
            <input
              type="file"
              name="image_url"
              onChange={handleFileChange}
              accept="image/*"
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Kategori</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_custom"
              checked={form.is_custom}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label className="text-sm text-gray-700">Produk dapat dikustom</label>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => navigate("/product-management")}
              className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Tambah Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
