"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { supabase } from "@/app/supbaseClient";
import React, { useEffect, useState } from "react";
import { FaScissors } from "react-icons/fa6";

interface Service {
  name: string;
}

interface Booking {
  userId: string | null;
  name: string;
  phone: string;
  selectedDay: string;
  selectedMaster: string;
  selectedTime: string;
  selectedServices: Service[];
}


const Brons = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("booking")
        .select("*")
        .eq("userId", userId);

      if (error) {
        console.error("Booking fetch error:", error);
      } else {
        setBookings(data as Booking[]);
      }

      setLoading(false);
    };

    if (userId) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading)
    return (
      <div className="d-flex align-items-center mt-5">
        <strong>Loading...</strong>
        <div
          className="spinner-border ms-auto"
          role="status"
          aria-hidden="true"
        ></div>
      </div>
    );

  if (bookings.length === 0)
    return <div className="p-4">Hech qanday bron topilmadi.</div>;

  return (
    <div
      className="p-4"
      style={{
        maxHeight: "80vh", // bu balandlikni kerak bo‘lsa o‘zgartir
        overflowY: "auto",
      }}
    >
      {bookings.map((bron, index) => (
        <div
          key={index}
          className="card mb-3"
          style={{
            padding: "16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h5>{bron.name}</h5>
          <p>
            <strong>📞 Phone:</strong> {bron.phone}
          </p>
          <p>
            <strong>📅 Date:</strong> {bron.selectedDay}
          </p>
          <p>
            <strong>⏰ Time:</strong> {bron.selectedTime}
          </p>
          <p>
            <strong>🧑‍🔧 Master:</strong> {bron.selectedMaster}
          </p>
          <div>
            <strong>🛠 Services:</strong>
            {bron.selectedServices && bron.selectedServices.length > 0 ? (
              bron.selectedServices.map((service, i) => (
                <p key={i} className="ms-3 mb-1">
                  <FaScissors className="me-2 text-secondary" />
                  {service.name}
                </p>
              ))
            ) : (
              <p className="ms-3">Xizmatlar topilmadi</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};


export default Brons;
