// src/pages/EditProduk.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCategories, getDetilProduct, updateProduct } from "../../services/product.services";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produk, setProduk] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    is_custom: false,
    category_id: "",
    image_url: "", 
  });
  const [categories, setCategories] = useState([]);

  const [newImage, setNewImage] = useState(null); // for new image file

    useEffect(() => {
    getDetilProduct(id, (data) => {
        setProduk(data);
    });
    }, [id]);

  useEffect(() => {
    document.title = "Tambah Produk";
    getCategories((data) => setCategories(data));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduk((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", produk.name);
    formData.append("description", produk.description);
    formData.append("price", produk.price);
    formData.append("stock", produk.stock);
    formData.append("is_custom", produk.is_custom);
    formData.append("category_id", produk.category_id);

    if (newImage) {
      formData.append("image_url", newImage);
    }

      updateProduct(id, formData, () => {
        alert("Produk berhasil diperbarui!");
        navigate("/product-management");
      });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Produk</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nama Produk</label>
          <input
            type="text"
            name="name"
            value={produk.name}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Deskripsi</label>
          <textarea
            name="description"
            value={produk.description}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Harga</label>
            <input
              type="number"
              name="price"
              value={produk.price}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Stok</label>
            <input
              type="number"
              name="stock"
              value={produk.stock}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="is_custom"
              checked={produk.is_custom}
              onChange={handleChange}
              className="mr-2"
            />
            Custom Produk
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium">Kategori ID</label>
          <select
            // type="text"
            name="category_id"
            value={produk.category_id}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded"
          >
            <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Foto Produk</label>
          {produk.image_url && (
            <img
              src={produk.image_url}
              alt="Foto produk lama"
              className="w-24 h-24 object-cover rounded mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block"
          />
          <p className="text-xs text-gray-500 mt-1">*Kosongkan jika tidak ingin mengganti foto</p>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Simpan Perubahan
          </button>
          <button
            type="button"
            onClick={() => navigate("/product-management")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
