"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { supabase } from "../supbaseClient";
import { useRouter } from "next/navigation";

interface Service {
  id: number;
  name: string;
  price: string;
  time: string;
  image: string;
}

export default function HaircutShopMobile() {
  const router = useRouter();
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

  const handleServiceClick = (serviceId: number) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      router.push(`/service/${serviceId}`);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="p-4 md:hidden">
      <h2 className="text-xl font-bold text-center mb-4 text-green-700">
        💇‍♂️ Salon Services
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => handleServiceClick(service.id)}
            className="relative rounded-xl border border-gray-200 shadow hover:shadow-md transition cursor-pointer"
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
              <p className="text-green-600 font-bold">{service.price} $</p>
              <p className="text-sm text-gray-500">⏱ {service.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
