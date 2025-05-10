"use client";
import { supabase } from "@/app/supbaseClient";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Account = () => {
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localUserId = localStorage.getItem("userId");
    const localToken = localStorage.getItem("token");

    if (localUserId && localToken) {
      const fetchData = async () => {
        try {
          const { data } = await supabase
            .from("booking")
            .select("*")
            .eq("userId", localUserId);

          console.log(data);
          setName(data?.[0].name || "");
          setPhone(data?.[0].phone || "");
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
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
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Phone:</strong> {phone}
        </p>
      </div>
    </div>
  );
};

export default Account;
