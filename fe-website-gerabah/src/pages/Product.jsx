import { useState, useEffect } from "react";
import { getCategories, getProducts } from "../services/product.services";
import useLogin from "../hooks/useLogin";
import hero from "../assets/banner gerabah.jpg"
import Footer from "./footer";
import Cart from "../components/Fragments/Cart";
import SkeletonCard from "../components/Fragments/SkeletonCard";
import animate from "../assets/empty.gif"
import { CiSearch } from "react-icons/ci";
import CardProduct from "../components/fragments/CardProduct";
import NavbarHome from "../components/layouts/NavbarHome";

const Product = () => {
    
    // useState
    const [keranjang, setKeranjang] = useState(false);
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("");
    const [filterCategory, setFilterCategory] = useState([]);
    const [search, setSearch] = useState("");
    const [openSearch, setOpenSearch] = useState(false);

    const [openCustom, setOpenCustom] = useState(false);
    const [customDesc, setCustomDesc] = useState("");
    const [customImage, setCustomImage] = useState(null);
    useLogin();

    useEffect(()=>{
        getProducts(data => {
            setProduct(data);
            console.log(data)
            setLoading(false);
        });
        getCategories((data) => {
            setFilterCategory(data)
        })
    },[]);


    // search filter untuk product
    const filteredProducts = product.filter(products => {
        return products.name.toLowerCase().includes(search.toLowerCase()) &&
        (category ? products.category_id  === category.id : true);
    })

    return(
        <div className="font-primary">

             <NavbarHome keranjang={keranjang} setKeranjang={setKeranjang}/>
             <img className="w-full mt-[100px] h-[500px] bg-cover object-cover bg-center mx-auto "
                src={hero} alt="banner" />

                      {/* SEARCH       */}
             <div className="block md:hidden relative">
                 <div onClick={() => setOpenSearch(!openSearch)} className="bg-black inline-block fixed top-[90px] 
                 left-0 p-2 rounded-tr-lg rounded-br-lg">                    
                 <CiSearch size={30} className="text-white" />                    
                 </div>
             </div>
             {/* Akhir Search */}
             {/* Card Product */}
             {openSearch && (
                <div className=" fixed top-[140px] left-0 w-[60%] z-50 ">
                 <div className="bg-white border rounded-tr-lg rounded-br-lg p-5 shadow-lg">
                     <h1 className="font-bold">Filter Product</h1>
                     <input
                            className="w-full py-2 rounded-lg px-3 border border-black"
                            type="text"
                            placeholder="Enter your items..."
                            onChange={(e) => setSearch(e.target.value)}
                    />
                     <div className="flex flex-col gap-2 mt-2">
                         {filterCategory.map((categories, index) => (
                            <label key={index}>
                                 <input type="radio" className="accent-pink-500 mr-2"
                                        name="categories"
                                        value={categories.id}
                                        checked={category?.id === categories.id}
                                        onChange={() => setCategory(categories)} />{categories.name}
                             </label>
                        ))}
                        <button
                            className="mt-3 text-sm text-blue-600 underline"
                            onClick={() => setCategory("")}
                            >
                            Reset Kategori
                        </button>
                     </div>
                 </div>
                 </div>
            )}
             <div className=" flex gap-5 lg:mx-10 mt-5" >
                 <div className="w-[20%] hidden lg:block">
                     <div className="bg-white border border-gray-300 rounded-lg p-5">
                         <h1 className="font-bold">Filter Product</h1>
                         <input
                            className="w-full py-2 rounded-lg px-3 border border-black"
                            type="text"
                            placeholder="Enter your items..."
                            onChange={(e) => setSearch(e.target.value)}
                        />
                         <div className="flex flex-col gap-2 mt-2">
                         {filterCategory.map((categories, index) => (
                                <label key={index}>
                                     <input
                                        type="radio"
                                        className="accent-pink-500 mr-2"
                                        name="categories"
                                        value={categories.id}
                                        checked={category?.id === categories.id}
                                        onChange={() => setCategory(categories)}
                                    /> {categories.name}
                                 </label>
                            ))}
                            <button
                                className="mt-3 text-sm text-blue-600 underline"
                                onClick={() => setCategory("")}
                                >
                                Reset Kategori
                            </button>
                              </div>
                     </div>
                 </div>
                 <div className="mx-auto md:w-[80%]">
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                         {loading ? (
                            Array.from({length:8}).map((_,index) => (
                                <SkeletonCard key={index}/>
                            ))
                        ):(
                            filteredProducts.length > 0 ? filteredProducts.map(products =>(
                                <CardProduct key={products.id}>
                                     <CardProduct.Header image_url={products.image_url} id={products.id}/>
                                     <CardProduct.Body name={products.name.substring(0, 20)} 
                                     price={products.price} 
                                    //  category={product.category}  
                                     stock={products.stock}
                                      />
                                     <CardProduct.Footer id={products.id}/>
                                 </CardProduct>
                            )): <div className=" mx-auto bg-gray-900 flex items-center justify-center">
                                     <img className="text-" src={animate} alt="" />
                                 </div>
                        )}
                     </div>
                     {/* keranjang */}
                     {keranjang && (
                        <div className="fixed z-[999] top-0 right-0">
                             <Cart products={product} setKeranjang={setKeranjang}/>
                         </div>
                    )}
                 </div>

                 {openCustom && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
    <div className="bg-white p-6 rounded-lg w-[90%] md:w-[500px]">
      <h2 className="text-xl font-bold mb-4">Pesanan Custom</h2>
      <label className="block mb-2 font-semibold">Deskripsi Permintaan:</label>
      <textarea
        className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        rows="4"
        value={customDesc}
        onChange={(e) => setCustomDesc(e.target.value)}
        placeholder="Contoh: Saya ingin pot dengan ukiran nama 'Dina'."
      />

      <label className="block mb-2 font-semibold">Unggah Gambar Referensi:</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCustomImage(e.target.files[0])}
        className="mb-4"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setOpenCustom(false)}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Batal
        </button>
        <button
          onClick={async () => {
            // Logika upload (bisa disesuaikan)
            if (!customDesc || !customImage) {
              alert("Harap isi deskripsi dan unggah gambar.");
              return;
            }

            const formData = new FormData();
            formData.append("description", customDesc);
            formData.append("image", customImage);

            try {
              const res = await fetch("http://localhost:3000/api/custom-orders", {
                method: "POST",
                body: formData,
              });

              if (res.ok) {
                alert("Pesanan custom berhasil dikirim!");
                setOpenCustom(false);
                setCustomDesc("");
                setCustomImage(null);
              } else {
                alert("Gagal mengirim pesanan custom.");
              }
            } catch (error) {
              console.error("Error kirim custom:", error);
              alert("Terjadi kesalahan.");
            }
          }}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          Kirim Pesanan
        </button>
      </div>
    </div>
  </div>
)}

             </div>

                 <Footer/>
                 <button
  onClick={() => setOpenCustom(true)}
  className="fixed bottom-10 right-10 bg-orange-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-orange-700 z-50"
>
  Pesan Custom Produk
</button>

     </div>
    )

}
export default Product