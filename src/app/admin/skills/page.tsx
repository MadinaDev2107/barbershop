"use client";
import { supabase } from "@/app/supbaseClient";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";

interface Service {
  id: string;
  name: string;
  time: string;
  price: number;
  image?: string;
}

const ServiceManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newService, setNewService] = useState<Service>({
    id: "",
    name: "",
    time: "",
    price: 0,
    image: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchServices = async () => {
    const { data, error } = await supabase.from("service").select("*");
    if (error) {
      console.error("Error fetching services:", error);
    } else {
      setServices(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAddService = async () => {
    const { error } = await supabase.from("service").insert({
      name: newService.name,
      time: newService.time,
      price: newService.price,
      image: newService.image,
    });

    if (error) {
      console.error("Error adding service:", error);
    } else {
      fetchServices();
      setShowModal(false);
      resetForm();
    }
  };

  const handleUpdateService = async () => {
    const { error } = await supabase
      .from("service")
      .update({
        name: newService.name,
        time: newService.time,
        price: newService.price,
        image: newService.image,
      })
      .eq("id", editingId);

    if (error) {
      console.error("Error updating service:", error);
    } else {
      fetchServices();
      setShowModal(false);
      resetForm();
    }
  };

  const handleDeleteService = async (id: string) => {
    const { error } = await supabase.from("service").delete().eq("id", id);
    if (error) {
      console.error("Error deleting service:", error);
    } else {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setNewService({
      id: service.id,
      name: service.name,
      time: service.time,
      price: service.price,
      image: service.image || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setNewService({ id: "", name: "", time: "", price: 0, image: "" });
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <strong>Loading...</strong>
        <div className="spinner-border ms-2" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Service Management</h2>

      <button
        className="btn btn-success mb-4"
        onClick={() => setShowModal(true)}
      >
        <FaPlus /> Add Service
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Time</th>
            <th>Price ($)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>
                {service.image && (
                  <Image
                    src={service.image}
                    alt="Service"
                    width={50}
                    height={50}
                  />
                )}
              </td>
              <td>{service.name}</td>
              <td>{service.time}</td>
              <td>{service.price}</td>
              <td>
                <button
                  className="btn btn-warning"
                  onClick={() => handleEdit(service)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="btn btn-danger ms-2"
                  onClick={() => handleDeleteService(service.id)}
                >
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingId ? "Edit Service" : "Add New Service"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newService.name}
                    onChange={(e) =>
                      setNewService({ ...newService, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newService.time}
                    onChange={(e) =>
                      setNewService({ ...newService, time: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newService.price}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const base64 = await convertToBase64(file);
                        setNewService({ ...newService, image: base64 });
                      }
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={editingId ? handleUpdateService : handleAddService}
                >
                  {editingId ? "Update" : "Add"} Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
