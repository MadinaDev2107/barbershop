"use client";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { supabase } from "../supbaseClient";

const ProfilePage = () => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
    }
  };

  return (
    <ul className="list-group w-100">
      <Link
        href={"/profile/my-account"}
        className="list-group-item text-start p-5 mt-5"
        style={{ cursor: "pointer" }}
      >
        My Profile
      </Link>
      <Link
        href={"/profile/brons"}
        className="list-group-item text-start p-5"
        style={{ cursor: "pointer" }}
      >
        My Brons
      </Link>
      <li
        className="list-group-item text-start p-5"
        style={{ cursor: "pointer" }}
        onClick={() => handleLogout()}
      >
        Logout
      </li>
    </ul>
  );
};

export default ProfilePage;
