"use client";
import React, { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import { supabase } from "@/app/supbaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Service {
  id: number;
  name: string;
  price: number;
  time: number;
}

interface Master {
  id: number;
  name: string;
  time: string[];
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

export default function BookingPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [days, setDays] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedMaster, setSelectedMaster] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [availableTimes, setAvailableTimes] = useState<
    { time: string; isBooked: boolean }[]
  >([]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const next7Days = Array.from({ length: 7 }, (_, i) =>
      dayjs().add(i, "day").format("YYYY-MM-DD")
    );
    setDays(next7Days);
  }, []);

  // Memoize fetchServices function to avoid unnecessary re-creations
  const fetchServices = useCallback(async () => {
    if (id) {
      const { data, error } = await supabase
        .from("service")
        .select("*")
        .eq("id", id);
      if (error) console.error(error);
      else setServices(data as Service[]);
    }
  }, [id]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]); // Add fetchServices to dependency array

  useEffect(() => {
    fetchMasters();
  }, []);

  // Memoize fetchAvailableTimes function to avoid unnecessary re-creations
  const fetchAvailableTimes = useCallback(async () => {
    if (!selectedMaster || !selectedDay) {
      setAvailableTimes([]);
      return;
    }

    const master = masters.find((master) => master.name === selectedMaster);

    if (master) {
      const { data, error } = await supabase
        .from("booking")
        .select("selectedTime")
        .eq("selectedDay", selectedDay)
        .eq("selectedMaster", selectedMaster);

      if (error) {
        console.error("Error fetching bookings:", error);
        return;
      }

      const bookedTimes = data.map(
        (b: { selectedTime: string }) => b.selectedTime
      );
      const availableTimesWithStatus = master.time.map((time) => ({
        time,
        isBooked: bookedTimes.includes(time),
      }));

      setAvailableTimes(availableTimesWithStatus);
    }
  }, [selectedMaster, selectedDay, masters]);

  useEffect(() => {
    fetchAvailableTimes();
  }, [selectedMaster, selectedDay, fetchAvailableTimes]);

  const fetchMasters = async () => {
    const { data, error } = await supabase.from("master").select("*");
    if (error) console.error(error);
    else setMasters(data as Master[]);
  };

  const handleServiceSelect = (service: Service) => {
    if (!selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

  const book = () => {
    setShowModal(true);
  };

  const handleConfirmBooking = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const booking: Booking = {
      userId,
      name,
      phone,
      selectedDay,
      selectedMaster,
      selectedTime,
      selectedServices,
    };

    if (userId && token) {
      const { data, error } = await supabase.from("booking").insert(booking);

      if (error) {
        console.error("Error inserting booking:", error);
        toast.error("❌ Booking failed. Please try again.");
      } else {
        console.log("Booking successful:", data);
        toast.success("✅ Booking successful!");
        setShowModal(false);
        setName("");
        setPhone("");
        router.push("/");
      }
    } else {
      console.log("User not logged in.");
      toast.warn("⚠️ You must be logged in to make a booking.");
    }
  };

  return (
    <div className="container mt-3 px-3">
      {/* Days Scroll */}
      <div className="d-flex overflow-auto gap-2 mt-3 pb-2">
        {days.map((day) => (
          <button
            key={day}
            className={`btn ${
              selectedDay === day
                ? "btn-primary text-white"
                : "btn-outline-secondary"
            } flex-shrink-0`}
            style={{ minWidth: "120px" }}
            onClick={() => setSelectedDay(day)}
          >
            {dayjs(day).format("ddd, MMM D")}
          </button>
        ))}
      </div>

      {/* Select master */}
      <div className="mt-4 d-flex flex-column gap-3">
        <select
          className="form-select"
          value={selectedMaster}
          onChange={(e) => setSelectedMaster(e.target.value)}
        >
          <option value="">Select master</option>
          {masters.map((master) => (
            <option key={master.id} value={master.name}>
              {master.name}
            </option>
          ))}
        </select>

        {/* Select time */}
        <select
          className="form-select"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          disabled={!selectedMaster}
        >
          <option value="">Select time</option>
          {availableTimes.map(({ time, isBooked }) => (
            <option key={time} value={time} disabled={isBooked}>
              {time} {isBooked && "(Booked)"}
            </option>
          ))}
        </select>
      </div>

      {/* Services list */}
      <div className="row mt-4 g-3">
        {services.map((service) => (
          <div key={service.id} className="col-12">
            <div
              className="card p-3 shadow-sm"
              onClick={() => handleServiceSelect(service)}
              style={{ cursor: "pointer" }}
            >
              <h5 className="card-title mb-1">{service.name}</h5>
              <p className="card-text mb-0">Price: ${service.price}</p>
              <p className="card-text">Duration: {service.time} mins</p>
            </div>
          </div>
        ))}
      </div>

      {/* Selected services */}
      {selectedServices.length > 0 && (
        <div className="card mt-4 p-3">
          <h5 className="card-title mb-2">Selected Services:</h5>
          {selectedServices.map((s) => (
            <div key={s.id} className="d-flex justify-content-between">
              <span>{s.name}</span>
              <span>${s.price}</span>
            </div>
          ))}
          <hr />
          <div className="d-flex justify-content-between fw-bold">
            <span>Total:</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      )}

      <button
        onClick={book}
        className="btn btn-primary m-2 w-100"
        disabled={
          !selectedTime || !selectedMaster || selectedServices.length === 0
        }
      >
        Book
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter your details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConfirmBooking}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}
