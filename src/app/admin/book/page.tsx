"use client";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { supabase } from "@/app/supbaseClient";

interface Service {
  name: string;
  price: number;
  time: string;
}

interface Booking {
  id: number;
  userId: string;
  name: string;
  phone: string;
  selectedDay: string;
  selectedMaster: string;
  selectedTime: string;
  selectedServices: Service[]; 
}

const Book = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase.from("booking").select("*");

      if (error) {
        console.error("Error fetching bookings:", error);
      } else {
        setBookings(data);
      }

      setLoading(false);
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center mt-5">
        <strong>Loading...</strong>
        <div
          className="spinner-border ms-2"
          role="status"
          aria-hidden="true"
        ></div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Bookings</h2>

      {bookings.length === 0 ? (
        <div className="alert alert-info">No bookings found.</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Selected Day</th>
              <th>Master</th>
              <th>Time</th>
              <th>Services</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.name}</td>
                <td>{booking.phone}</td>
                <td>{booking.selectedDay}</td>
                <td>{booking.selectedMaster}</td>
                <td>{booking.selectedTime}</td>
                <td>
                  {/* selectedServices object arrayni render qilish */}
                  {booking.selectedServices.map((service, idx) => (
                    <div key={idx}>
                      <strong>{service.name}</strong> - ${service.price}
                     
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Book;
