import React from "react";
import Layout from "../components/PageLayout";
import RSVP from "../components/RSVP";

const TeilnahmePage = () => {
  const navbarData = { brand: "Franzi & Timur", menuText: "Menü" };
  const footerData = { copyright: "© 2025", social: {} };

  return (
    <Layout
      langKey="de"
      navbarData={navbarData}
      footerData={footerData}
    >
      <div style={{ padding: "2rem 1rem", maxWidth: "600px", margin: "0 auto" }}>
        <RSVP />
      </div>
    </Layout>
  );
};

export default TeilnahmePage;
