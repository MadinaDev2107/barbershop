"use client";
import { supabase } from "@/app/supbaseClient";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

interface Master {
  id: string;
  name: string;
  time: string[];
}

const MasterManagement = () => {
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newMaster, setNewMaster] = useState({
    name: "",
    time: [] as string[],
  });
  const [edits, setEdit] = useState<null | string>(null);

  const timeOptions = ["9:00", "11:00", "15:00", "16:00", "20:00"];

  // Ma'lumotlarni olish
  const fetchMasters = async () => {
    const { data, error } = await supabase.from("master").select("*");
    if (error) {
      console.error("Error fetching masters:", error);
    } else {
      setMasters(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMasters();
  }, []);

  // Qo‘shish
  const handleAddMaster = async () => {
    const { error } = await supabase.from("master").insert(newMaster);
    if (error) {
      console.error("Error adding master:", error);
    } else {
      fetchMasters();
      setShowModal(false);
      setNewMaster({ name: "", time: [] });
    }
  };

  // Tahrirlash
  const handleUpdateMaster = async () => {
    const { error } = await supabase
      .from("master")
      .update(newMaster)
      .eq("id", edits);
    if (error) {
      console.error("Error updating master:", error);
    } else {
      fetchMasters();
      setShowModal(false);
      setEdit(null);
      setNewMaster({ name: "", time: [] });
    }
  };

  // O‘chirish
  const handleDeleteMaster = async (id: string) => {
    const { error } = await supabase.from("master").delete().eq("id", id);
    if (error) {
      console.error("Error deleting master:", error);
    } else {
      setMasters(masters.filter((master) => master.id !== id));
    }
  };

  // Edit bosilganda ma'lumotlarni chiqarish
  const edit = async (id: string) => {
    setEdit(id);
    setShowModal(true);
    const { data, error } = await supabase
      .from("master")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching master:", error);
    } else {
      setNewMaster({ name: data.name, time: data.time });
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center mt-5">
        <strong>Loading...</strong>
        <div
          className="spinner-border ms-2"
          role="status"
          aria-hidden="true"
        ></div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Master Management</h2>

      {/* Qo‘shish tugmasi */}
      <button
        className="btn btn-success mb-4"
        onClick={() => setShowModal(true)}
      >
        <FaPlus /> Add Master
      </button>

      {/* Jadval */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {masters.map((master) => (
            <tr key={master.id}>
              <td>{master.name}</td>
              <td>{master.time.join(", ")}</td>
              <td>
                <button
                  className="btn btn-warning"
                  onClick={() => edit(master.id)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="btn btn-danger ms-2"
                  onClick={() => handleDeleteMaster(master.id)}
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
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ display: "block" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {edits ? "Edit Master" : "Add New Master"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEdit(null);
                    setNewMaster({ name: "", time: [] });
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newMaster.name}
                    onChange={(e) =>
                      setNewMaster({ ...newMaster, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <div>
                    {timeOptions.map((option) => (
                      <div
                        key={option}
                        className="form-check form-check-inline"
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={option}
                          checked={newMaster.time.includes(option)}
                          onChange={(e) => {
                            const selectedTime = e.target.value;
                            const updatedTime = newMaster.time.includes(
                              selectedTime
                            )
                              ? newMaster.time.filter((t) => t !== selectedTime)
                              : [...newMaster.time, selectedTime];
                            setNewMaster({ ...newMaster, time: updatedTime });
                          }}
                        />
                        <label className="form-check-label">{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEdit(null);
                    setNewMaster({ name: "", time: [] });
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={edits ? handleUpdateMaster : handleAddMaster}
                >
                  {edits ? "Update" : "Add"} Master
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterManagement;
