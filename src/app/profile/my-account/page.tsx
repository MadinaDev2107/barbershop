"use client";
import { supabase } from "@/app/supbaseClient";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Account = () => {
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localUserId = localStorage.getItem("userId");
    const localToken = localStorage.getItem("token");

    if (localUserId && localToken) {
      setUserId(localUserId);
      setToken(localToken);

      const fetchData = async () => {
        try {
          const { data: bookingData } = await supabase
            .from("booking")
            .select("name, phone")
            .eq("userId", localUserId)
            .single();

          setName(bookingData?.name || "");
          setPhone(bookingData?.phone || "");
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      // even if not found, stop loading to avoid indefinite spinner
      setLoading(false);
    }
  }, []);

  if (loading || name === null || phone === null) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <strong className="me-2">Loading...</strong>
        <div className="spinner-border" role="status" aria-hidden="true"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex flex-column align-items-start p-4">
        <div
          className="rounded-circle bg-secondary mb-4"
          style={{ width: "80px", height: "80px" }}
        ></div>

        <p><strong>User ID:</strong> {userId}</p>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Phone:</strong> {phone}</p>
      </div>
    </div>
  );
};

export default Account;
