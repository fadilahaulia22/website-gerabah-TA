import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import useLogin from "../../hooks/useLogin";
import Button from "../../components/elements/Button";

const HeaderBooking = () => {
  const username = useLogin(); // Ambil username dari token

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 z-20">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold text-orange-600 tracking-wide">
          OemahGerabah
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {username ? (
            <>
              <div className="flex items-center gap-2 text-gray-700">
                <FaUser size={20} />
                <span className="text-sm">{username}</span>
              </div>
              <Button
               classname="bg-red-600 text-white text-sm px-4 py-1" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button classname="bg-orange-500 text-white text-sm px-4 py-1">
                Login / Daftar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderBooking;
