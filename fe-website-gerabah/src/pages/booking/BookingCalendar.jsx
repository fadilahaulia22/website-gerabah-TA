import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaCheckCircle } from 'react-icons/fa';
import { createVisit } from '../../services/bookingService';
import NavbarHome from '../../components/layouts/NavbarHome';

const BookingCalendar = () => {
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    noHp: '',
    jumlahOrang: '',
    jamKunjungan: '',
  });

  const isSameDay = (date1, date2) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (bookedDates.some((d) => isSameDay(d, date))) {
        return 'bg-orange-200 text-orange-900 font-semibold rounded-full';
      }
    }
    return null;
  };

  // const handleDateClick = (date) => {
  //   if (bookedDates.some((d) => isSameDay(d, date))) {
  //     alert('Tanggal ini sudah dibooking.');
  //   } else {
  //     setSelectedDate(date);
  //     setShowPayment(false);
  //     setPaymentSuccess(false);
  //     resetFormData();
  //   }
  // };
const isPastDateTime = (date, time) => {
  const selectedDateTime = new Date(date);
  const [hours, minutes] = time.split(":");
  selectedDateTime.setHours(hours, minutes, 0, 0);
  return selectedDateTime < new Date();
};

const isAtLeastTwoDaysAhead = (date) => {
  const now = new Date();
  const minDate = new Date(now);
  minDate.setDate(minDate.getDate() + 2);
  return date >= new Date(minDate.toDateString()); // H-2
};

const getBookingCountOnDate = (date) => {
  return bookedDates.filter((d) => isSameDay(d.date, date)).length;
};

const isTimeSlotTaken = (date, time) => {
  return bookedDates.some(
    (d) => isSameDay(d.date, date) && d.time === time
  );
};

  const handleDateClick = (date) => {
  if (!isAtLeastTwoDaysAhead(date)) {
    alert("Booking hanya bisa dilakukan minimal H-2 sebelum kunjungan.");
    return;
  }

  if (getBookingCountOnDate(date) >= 2) {
    alert("Tanggal ini sudah penuh (maksimal 2 kunjungan per hari).");
    return;
  }

  setSelectedDate(date);
  setShowPayment(false);
  setPaymentSuccess(false);
  resetFormData();
};

  const resetFormData = () => {
    setFormData({
      nama: '',
      email: '',
      noHp: '',
      jumlahOrang: '',
      jamKunjungan: '',
    });
  };

  const handleBooking = () => {
    const { nama, email, noHp, jumlahOrang, jamKunjungan } = formData;
    if (!nama || !email || !noHp || !jumlahOrang || !jamKunjungan) {
      alert("Lengkapi semua data kunjungan terlebih dahulu.");
      return;
    }

    setShowPayment(true);
  };

  // const handlePayment = () => {
  //   if (!selectedDate) return;

  //   const payload = {
  //     visit_date: selectedDate.toISOString().split("T")[0],
  //     visit_time: formData.jamKunjungan,
  //     jumlah_orang: formData.jumlahOrang,
  //     nama: formData.nama,
  //     email: formData.email,
  //     no_hp: formData.noHp,
  //   };

  //   createVisit(
  //     payload,
  //     (res) => {
  //       console.log("Booking berhasil:", res.visit);
  //       alert(res.message);

  //       setBookedDates([...bookedDates, selectedDate]);
  //       setPaymentSuccess(true);
  //       setSelectedDate(null);
  //       setShowPayment(false);
  //     },
  //     (err) => {
  //       alert("Gagal booking, coba lagi.");
  //       console.log(err);
  //     }
  //   );
  // };


  const handlePayment = () => {
  if (!selectedDate) return;

  const { jamKunjungan } = formData;

  if (isPastDateTime(selectedDate, jamKunjungan)) {
    alert("Tidak bisa booking di tanggal dan jam yang sudah lewat.");
    return;
  }

  if (getBookingCountOnDate(selectedDate) >= 2) {
    alert("Kuota booking tanggal ini sudah penuh.");
    return;
  }

  if (isTimeSlotTaken(selectedDate, jamKunjungan)) {
    alert("Slot waktu ini sudah dibooking oleh kelompok lain.");
    return;
  }

  const payload = {
    visit_date: selectedDate.toISOString().split("T")[0],
    visit_time: jamKunjungan,
    jumlah_orang: formData.jumlahOrang,
    nama: formData.nama,
    email: formData.email,
    no_hp: formData.noHp,
  };

  createVisit(
    payload,
    (res) => {
      console.log("Booking berhasil:", res.visit);
      alert(res.message);

      setBookedDates([...bookedDates, { date: selectedDate, time: jamKunjungan }]);
      setPaymentSuccess(true);
      setSelectedDate(null);
      setShowPayment(false);
    },
    (err) => {
      alert("Gagal booking, coba lagi.");
      console.log(err);
    }
  );
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <NavbarHome />

      <div className="min-h-screen bg-[#FFF7F0] pt-24 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-3xl font-bold text-orange-600 text-center mb-8 tracking-wide">
            Booking Kunjungan Edukasi
          </h2>

          <Calendar
            onClickDay={handleDateClick}
            tileClassName={tileClassName}
            className="rounded-xl shadow border p-2"
          />

          {selectedDate && !paymentSuccess && (
            <div className="mt-8 bg-orange-50 border border-orange-300 rounded-lg p-6 space-y-4">
              <p className="text-gray-700 text-lg">
                Tanggal yang dipilih:{' '}
                <span className="text-orange-600 font-semibold">
                  {selectedDate.toDateString()}
                </span>
              </p>

              <div className="space-y-3">
                <InputField
                  label="Nama Pengunjung"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Contoh: Dinda Aulia"
                />
                <InputField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Contoh: kamu@email.com"
                  type="email"
                />
                <InputField
                  label="No. HP / WhatsApp"
                  name="noHp"
                  value={formData.noHp}
                  onChange={handleChange}
                  placeholder="Contoh: 08123456789"
                  type="text"
                />
                <InputField
                  label="Jumlah Orang"
                  name="jumlahOrang"
                  value={formData.jumlahOrang}
                  onChange={handleChange}
                  placeholder="Contoh: 4"
                  type="number"
                />
                <InputField
                  label="Jam Kunjungan"
                  name="jamKunjungan"
                  value={formData.jamKunjungan}
                  onChange={handleChange}
                  type="time"
                />
              </div>

              {!showPayment ? (
                <button
                  onClick={handleBooking}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md transition duration-200 mt-4"
                >
                  Booking Sekarang
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Lanjutkan ke simulasi pembayaran...</p>
                  <button
                    onClick={handlePayment}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition duration-200"
                  >
                    Bayar & Konfirmasi
                  </button>
                </div>
              )}
            </div>
          )}

          {paymentSuccess && (
            <div className="mt-8 flex flex-col gap-4 bg-green-50 border border-green-200 rounded-lg p-6 shadow">
              <div className="flex items-start gap-4">
                <FaCheckCircle className="text-green-500 text-2xl mt-1" />
                <div>
                  <p className="text-green-700 font-medium mb-1">
                    Booking dan pembayaran berhasil!
                  </p>
                  <p className="text-sm text-green-700">
                    Terima kasih, <strong>{formData.nama}</strong>. Kunjunganmu untuk{' '}
                    <strong>{formData.jumlahOrang} orang</strong> pada pukul{' '}
                    <strong>{formData.jamKunjungan}</strong> telah dicatat.
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-700 mt-2">
                Ingin simpan riwayat kunjungan dan mendapatkan notifikasi?
                <a
                  href="/register"
                  className="ml-2 text-orange-600 hover:underline font-semibold"
                >
                  Buat akun sekarang →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Komponen input reusable
const InputField = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
      placeholder={placeholder}
      required
    />
  </div>
);

export default BookingCalendar;

