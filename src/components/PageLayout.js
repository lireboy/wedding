import React from "react";
import PropTypes from "prop-types";
import Navbar from "views/Navbar";
import Top from "views/Top";
import Footer from "views/Footer";
import SEO from "components/SEO";
import "./PageLayout.scss";

const PageLayout = ({ langKey = "de", keywords = [], description = "", navbarData, footerData, topData, children }) => {
  const langSelectorPart = null; // oder LanguageSelector je nach Bedarf

  return (
    <>
      <SEO lang={langKey} title="Franzi & Timur" keywords={keywords} description={description} />
      <Navbar anchors={[]} frontmatter={navbarData} extraItems={langSelectorPart} />
      {topData && <Top frontmatter={topData} />}
      <main>{children}</main>
      <Footer frontmatter={footerData} />
    </>
  );
};

PageLayout.propTypes = {
  langKey: PropTypes.string,
  keywords: PropTypes.array,
  description: PropTypes.string,
  navbarData: PropTypes.object,
  footerData: PropTypes.object,
  topData: PropTypes.object,
  children: PropTypes.node,
};

PageLayout.defaultProps = {
  langKey: "de",
  keywords: [],
  description: "",
  navbarData: {},
  footerData: {},
  topData: null,
  children: null,
};

export default PageLayout;
