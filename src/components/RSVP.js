import React, { useState } from "react";
import "./rsvp.scss";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { Button } from "react-bootstrap";
import db from "../firebase";

const RSVP = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attending: "yes",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const colRef = collection(db, "rsvp-responses");

    try {
      const q = query(colRef, where("name", "==", formData.name.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;

        await updateDoc(docRef, {
          name: formData.name.toLowerCase(),
          email: formData.email,
          attending: formData.attending,
          timestamp: serverTimestamp(),
        });

        setSubmitted(true);
      } else {
        alert("❌ Gast existiert nicht. Bitte überprüfe deine Eingabe.");
      }
    } catch (err) {
      console.error("Fehler beim Zugriff auf Firestore:", err);
      alert("Fehler beim Absenden. Bitte versuch es später noch mal.");
    }

    setLoading(false);
  };

  if (submitted) {
    return <p>Vielen Dank für deine Rückmeldung! 💌</p>;
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <h2>Willst du dabei sein? 🎉</h2>

      <label htmlFor="name">
        Dein Name:
        <input
          type="text"
          id="name"
          name="name"
          required
          onChange={handleChange}
        />
      </label>
      <br />

      <label htmlFor="email">
        Deine E-Mail:
        <input
          type="email"
          id="email"
          name="email"
          required
          onChange={handleChange}
        />
      </label>
      <br />

      <label htmlFor="attending">
        Kommst du?
        <select
          id="attending"
          name="attending"
          onChange={handleChange}
        >
          <option value="yes">Ja, ich komme!</option>
          <option value="no">Leider nicht 😢</option>
        </select>
      </label>
      <br />

      <Button size="xl" variant="primary" className="text-uppercase main-button hero-button" type="submit" disabled={loading}>
        <p className="buttonTitle">{loading ? "Wird gesendet..." : "Antwort senden"}</p>
      </Button>
    </form>
  );
};

export default RSVP;
