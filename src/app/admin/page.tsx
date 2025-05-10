"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const allowedUserId = "252587bb-8fb2-4999-bb61-3f2af2c5b596";
  
    if (userId && (userId === allowedUserId)) {
      setIsAllowed(true);
    } else {
      setIsAllowed(false);
      router.push("/login"); 
    }
  }, [router]);

  if (isAllowed === null) {
    return <div>Tekshirilmoqda...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="fw-bold">Welcome, Admin!</h1>
    
    </div>
  );
};

export default AdminPage;
