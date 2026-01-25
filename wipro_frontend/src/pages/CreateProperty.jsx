import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";
import "./create-property.css";
import { useNavigate } from "react-router-dom";
import MiniVerticalNav from "../components/MiniVerticalNav";

export default function CreateProperty() {
  const navigate = useNavigate();

  // 🔐 Listing gate
  const [listingStatus, setListingStatus] = useState("loading");
  const [checking, setChecking] = useState(true);

  // ---------- PROPERTY FORM STATE ----------
  const [loading, setLoading] = useState(false);
  const [propertyId, setPropertyId] = useState(null);
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    property_type: "residential",
    listing_type: "sale",
    price: "",
    rent_price: "",
    location: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    area_sqft: "",
    bedrooms: 0,
    bathrooms: 0,
    floors: 1,
    parking_spaces: 0,
    contact_name: "",
    contact_phone: "",
    contact_email: "",
  });

  /* ================= CHECK LISTING STATUS ================= */

  useEffect(() => {
    apiFetch("/listing-requests/my/")
      .then((data) => {
        if (!data || data.length === 0) {
          setListingStatus("none");
        } else {
          setListingStatus(data[0].status); // payment_pending | approved | rejected
        }
      })
      .catch(() => setListingStatus("none"))
      .finally(() => setChecking(false));
  }, []);

  /* ================= CREATE LISTING REQUEST ================= */

  const createListingRequestAndPay = async () => {
    try {
      const res = await apiFetch(
        "/listing-requests/create/",
        { method: "POST" }
      );

      navigate("/pay", {
        state: {
          purpose: "property_listing",
          amount: 1000,
          request_id: res.id,
        },
      });
    } catch (err) {
      alert(err?.error || err?.detail || "Failed to create listing request");
    }
  };

  /* ================= FORM HELPERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImagesChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const isFormValid = () => {
    return (
      form.title &&
      form.location &&
      form.address &&
      form.city &&
      form.state &&
      form.pincode &&
      form.contact_name &&
      form.contact_phone &&
      form.contact_email &&
      Number(form.price) > 0 &&
      Number(form.area_sqft) > 0
    );
  };

  const buildPayload = () => ({
    ...form,
    price: Number(form.price),
    rent_price: form.rent_price ? Number(form.rent_price) : null,
    area_sqft: Number(form.area_sqft),
    bedrooms: Number(form.bedrooms),
    bathrooms: Number(form.bathrooms),
  });

  /* ================= SUBMIT PROPERTY ================= */

  const submitProperty = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch("/properties/", {
        method: "POST",
        body: JSON.stringify(buildPayload()),
      });

      setPropertyId(res.id);
      alert("Property created successfully");
      navigate("/my-properties");
    } catch (err) {
      alert(err?.detail || "Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  /* ================= IMAGE UPLOAD ================= */

  const uploadImages = async () => {
    if (!propertyId || images.length === 0) return;

    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    try {
      await apiFetch(`/properties/${propertyId}/images/`, {
        method: "POST",
        body: formData,
      });

      navigate("/my-properties");
    } catch {
      alert("Image upload failed");
    }
  };

  /* ================= UI ================= */

  if (checking) return <p>Checking permission…</p>;

  return (
    <div className="create-property">
      <h2>Create Property</h2>

      <div className="market-sidebar">
        <MiniVerticalNav />
      </div>

      {/* 🟢 NO REQUEST */}
      {listingStatus === "none" && (
        <button className="btn-pay" onClick={createListingRequestAndPay}>
          Pay ₹1000 to Create Property
        </button>
      )}

      {/* 🟡 PENDING */}
      {listingStatus === "payment_pending" && (
        <button className="btn-pending" disabled>
          Listing Request Pending
        </button>
      )}

      {/* 🔴 REJECTED */}
      {listingStatus === "rejected" && (
        <button className="btn-pay" onClick={createListingRequestAndPay}>
          Request Rejected – Pay Again
        </button>
      )}

      {/* ✅ APPROVED → SHOW FORM */}
      {listingStatus === "approved" && (
        <>
          <form onSubmit={submitProperty}>
            <input name="title" placeholder="Title" onChange={handleChange} />
            <textarea name="description" placeholder="Description" onChange={handleChange} />

            <input name="price" type="number" placeholder="Price" onChange={handleChange} />
            <input name="area_sqft" type="number" placeholder="Area (sqft)" onChange={handleChange} />

            <input name="location" placeholder="Location" onChange={handleChange} />
            <input name="address" placeholder="Address" onChange={handleChange} />
            <input name="city" placeholder="City" onChange={handleChange} />
            <input name="state" placeholder="State" onChange={handleChange} />
            <input name="pincode" placeholder="Pincode" onChange={handleChange} />

            <input name="contact_name" placeholder="Contact Name" onChange={handleChange} />
            <input name="contact_phone" placeholder="Phone" onChange={handleChange} />
            <input name="contact_email" placeholder="Email" onChange={handleChange} />

            <button disabled={loading}>
              {loading ? "Creating…" : "Create Property"}
            </button>
          </form>

          {propertyId && (
            <>
              <input type="file" multiple onChange={handleImagesChange} />
              <button onClick={uploadImages}>Upload Images</button>
            </>
          )}
        </>
      )}
    </div>
  );
}
