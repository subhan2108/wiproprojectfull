import { useState } from "react";
import { apiFetch } from "../api/api";
import "./create-property.css";
import { useNavigate } from "react-router-dom";


export default function CreateProperty() {
  const [loading, setLoading] = useState(false);
  const [propertyId, setPropertyId] = useState(null);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();



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
    furnished: false,
    ac_available: false,
    balcony: false,
    gym: false,
    swimming_pool: false,
    garden: false,
    security: false,
    lift_available: false,
    power_backup: false,
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    investment_enabled: true,
    investors_required: 10,
    investors_min: 10,
    investors_max: 50,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };


  const buildPayload = () => {
  return {
    ...form,

    // numbers
    price: form.price ? Number(form.price) : null,
    rent_price: form.rent_price ? Number(form.rent_price) : null,
    area_sqft: Number(form.area_sqft),
    bedrooms: Number(form.bedrooms),
    bathrooms: Number(form.bathrooms),
    floors: Number(form.floors),
    parking_spaces: Number(form.parking_spaces),

    investors_required: Number(form.investors_required),
    investors_min: Number(form.investors_min),
    investors_max: Number(form.investors_max),

    // trim required strings
    title: form.title.trim(),
    description: form.description.trim(),
    location: form.location.trim(),
    address: form.address.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    pincode: form.pincode.trim(),
    contact_name: form.contact_name.trim(),
    contact_phone: form.contact_phone.trim(),
    contact_email: form.contact_email.trim(),
  };
};


const uploadImages = async () => {
  if (!propertyId || images.length === 0) {
    alert("Select images first");
    return;
  }

  const formData = new FormData();
  images.forEach((img) => formData.append("images", img));

  try {
    await apiFetch(`/properties/${propertyId}/images/`, {
      method: "POST",
      body: formData, // 🚫 DO NOT stringify
    });

    alert("Images uploaded successfully");
    navigate("/");
  } catch (err) {
    alert("Image upload failed");
  }
};



  const submitProperty = async (e) => {
  e.preventDefault();

  if (!isFormValid()) {
    alert("Please fill all required fields correctly");
    return;
  }

  setLoading(true);

  try {
    const res = await apiFetch("/properties/", {
      method: "POST",
      body: JSON.stringify(buildPayload()),
    });

    setPropertyId(res.id);
    alert("Property created. Now upload images.");
  } catch (err) {
    alert(JSON.stringify(err)); // 👈 SHOW REAL ERROR
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="create-property">
      <h2>Create Property</h2>

      <form onSubmit={submitProperty}>
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} />

        <select name="property_type" onChange={handleChange}>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
        </select>

        <select name="listing_type" onChange={handleChange}>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
          <option value="both">Sale & Rent</option>
        </select>

        <input name="price" type="number" placeholder="Price" onChange={handleChange} required />
        <input name="rent_price" type="number" placeholder="Rent Price (optional)" onChange={handleChange} />

        <input name="location" placeholder="Location" required onChange={handleChange} />
        <input name="address" placeholder="Full Address" required onChange={handleChange} />
        <input name="city" placeholder="City" required onChange={handleChange} />
        <input name="state" placeholder="State" required onChange={handleChange} />
        <input name="pincode" placeholder="Pincode" required onChange={handleChange} />

        <input name="area_sqft" required type="number" placeholder="Area (sqft)" onChange={handleChange} />
        <input name="bedrooms" type="number" placeholder="Bedrooms" onChange={handleChange} />
        <input name="bathrooms" type="number" placeholder="Bathrooms" onChange={handleChange} />

        <h4>Features</h4>
        {[
          "furnished",
          "ac_available",
          "balcony",
          "gym",
          "swimming_pool",
          "garden",
          "security",
          "lift_available",
          "power_backup",
        ].map((f) => (
          <label key={f}>
            <input type="checkbox" name={f} onChange={handleChange} /> {f}
          </label>
        ))}

        <h4>Investment</h4>
        <label>
          <input type="checkbox" name="investment_enabled" onChange={handleChange} />
          Enable Group Investment
        </label>

        <input name="investors_required" type="number" placeholder="Investors Required" onChange={handleChange} />

        <h4>Contact</h4>
        <input name="contact_name" placeholder="Contact Name" required onChange={handleChange} />
        <input name="contact_phone" placeholder="Contact Phone" required onChange={handleChange} />
        <input name="contact_email" type="email" placeholder="Contact Email" required onChange={handleChange} />

        <button disabled={loading}>
          {loading ? "Creating..." : "Create Property"}
        </button>
      </form>

      {propertyId && (
  <>
    <h4>Upload Images</h4>

    <input
      type="file"
      multiple
      accept="image/*"
      onChange={handleImagesChange}
    />

    <button type="button" onClick={uploadImages}>
      Upload Images
    </button>
  </>
)}

    </div>
  );
}
