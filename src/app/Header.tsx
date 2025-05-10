"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaBars, FaUser } from "react-icons/fa";

const Header = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
  }, []);

  const mobileNavItems = [
    {
      name: "Menu",
      href: "/service",
      icon: <FaBars className="w-5 h-5 text-green-600" />,
    },
    {
      name: "Profile",
      href: token ? "/profile" : "/login",
      icon: <FaUser className="w-5 h-5 text-green-600" />,
    },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-around items-center py-3 z-50 lg:hidden">
        {mobileNavItems.map((item, i) => (
          <Link
            style={{ all: "unset" }}
            href={item.href}
            key={i}
            className="flex flex-col items-center text-xs text-gray-600 hover:text-green-600 transition"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Header;
