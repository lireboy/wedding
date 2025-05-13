import React from "react";
import PropTypes from "prop-types";

import { Nav } from "react-bootstrap";
import { Link as ScrollLink } from "react-scroll";
import { Link as GatsbyLink } from "gatsby";

import "./NavItem.scss";

const NavItem = ({ href, to, onClick, children }) => {
  const isPageLink = !!href;

  return (
    <Nav.Item>
      {isPageLink ? (
        <GatsbyLink
          className="nav-link cursor-pointer"
          to={href}
          onClick={onClick}
        >
          {children || to}
        </GatsbyLink>
      ) : (
        <ScrollLink
          className="nav-link cursor-pointer"
          to={to}
          activeClass="active"
          spy
          smooth="easeInOutQuart"
          onClick={onClick}
        >
          {children || to}
        </ScrollLink>
      )}
    </Nav.Item>
  );
};

NavItem.propTypes = {
  to: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.any,
};

NavItem.defaultProps = {
  href: "",
  to: "",
  onClick: null,
  children: null,
};

export default NavItem;
