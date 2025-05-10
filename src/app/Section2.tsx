"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { supabase } from "./supbaseClient";

interface Service {
  id: number;
  name: string;
  price: string;
  time: string;
  image: string;
}

export default function HaircutShopMobile() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getServices();
  }, []);

  async function getServices() {
    const { data, error } = await supabase.from("service").select("*");
    if (error) {
      console.error("Error fetching services:", error);
      return;
    }
    setServices(data || []);
  }

  return (
    <div className="p-4 md:hidden">
      <h2 className="text-xl font-bold text-center mb-4 text-green-700">
        Barberbook
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="relative rounded-xl border border-gray-200 shadow hover:shadow-md transition"
          >
            <Image
              width={400}
              height={300}
              src={service.image}
              alt={service.name}
              className="w-full h-56 object-cover rounded-t-xl"
            />
            <div className="p-3">
              <h4 className="font-semibold text-lg mb-1">{service.name}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
