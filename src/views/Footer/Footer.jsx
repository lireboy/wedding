import React from "react";
import PropTypes from "prop-types";

import { Container, Row, Col } from "react-bootstrap";
import * as SocialIcons from "components/SocialIcons";

import "./Footer.scss";

const Footer = ({ frontmatter }) => {
  if (!frontmatter) {
    return null;
  }

  const {
    copyright,
    social: { facebook, github, linkedin, instagram }
  } = frontmatter;

  return (
    <footer className="footer py-3">
      <Container>
        <Row className="align-items-center text-center">
          <Col className="copyright credit">
            <div className="nameAndLink">
              <a
                href="https://timur-portfolio.com/"
                target="_blank"
                rel="noreferrer"
              >
                {copyright}
              </a>
            </div>
            <div className="socials">
              {github ? <SocialIcons.Github className="footerSocial" userName={github} /> : null}
              {linkedin ? <SocialIcons.Linkedin className="footerSocial" userName={linkedin} /> : null}
            </div>
          </Col> {/* copyright */}
          <Col className="anaIsabel credit">
            <div className="nameAndLink">
              Fotos von &nbsp;
              <a
                href="https://google.com/"
                target="_blank"
                rel="noreferrer"
              >
                Fotograf
              </a>
            </div>
            <div className="socials">
              {instagram ? <SocialIcons.Instagram className="footerSocial" userName={instagram} /> : null}
              {facebook ? <SocialIcons.Facebook className="footerSocial" userName={facebook} /> : null}
            </div>
          </Col> {/* anaIsabel */}
        </Row>
      </Container>
    </footer>
  );
};

Footer.propTypes = {
  frontmatter: PropTypes.object,
};

Footer.defaultProps = {
  frontmatter: null,
};

export default Footer;
