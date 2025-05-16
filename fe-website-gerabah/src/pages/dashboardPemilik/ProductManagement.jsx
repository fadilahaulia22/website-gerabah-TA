// src/pages/KelolaProduk.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { deleteProduct, getProducts } from "../../services/product.services";


const ITEMS_PER_PAGE = 5;

const ProductManagement = () => {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();


  useEffect(() => {
    document.title = "Kelola Produk";
    fetchProduk();
  }, []);

  const fetchProduk = () => {
    getProducts((data) => {
      setProduk(data);
      setLoading(false);
    });
  };
  

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentProduk = produk.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(produk.length / ITEMS_PER_PAGE);


  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const handleDelete = (id) => {
  if (window.confirm("Yakin ingin menghapus produk ini?")) {
    deleteProduct(id, () => {
      // Filter produk yang tidak dihapus
      const updatedProduk = produk.filter((item) => item.id !== id);
      setProduk(updatedProduk);
    });
  }
  };


  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Kelola Produk</h1>
          <div className="space-x-3">
            <button
              onClick={() => navigate("/dashboard-pemilik")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Kembali ke Dashboard
            </button>
            <button
              onClick={() => navigate("/add-product")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Tambah Produk Baru
            </button>
            </div>
          </div>

        {loading ? (
          <p>Loading data produk...</p>
        ) : (
          <>
          <div className="overflow-x-auto shadow rounded-lg bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">#</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Nama</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Deskripsi</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Harga</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Stok</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Gambar</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Custom</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Kategori</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                {currentProduk.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4 line-clamp-2">{item.description}</td>
                    <td className="px-6 py-4">Rp {item.price.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4">{item.stock}</td>
                    <td className="px-6 py-4">
                      <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    </td>
                    <td className="px-6 py-4">{item.is_custom ? "Ya" : "Tidak"}</td>

                    {/* peru diperbaiki */}
                    <td className="px-6 py-4">{item.category_name || "-"}</td> 

                    <td className="px-6 py-4 text-center space-x-2">
                      <button 
                        onClick={() => navigate(`/update-product/${item.id}`)}        
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
            <div className="mt-4 flex justify-center items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => goToPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
