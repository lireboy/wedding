import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import { Row, Col } from "react-bootstrap";
import SectionHeader from "components/SectionHeader";
import PhotoItem from "components/PhotoItem";
import PageSection from "components/PageSection";
import "./Photos.scss";

const Photos = ({ className, frontmatter }) => {

  if (!frontmatter) {
    return null;
  }

  // FOR TEMPLATE: add "subheader: rootSubHeader" inside const below:
  const { anchor, header: rootHeader, highlights } = frontmatter;

  return (
    <PageSection className={clsx("photos-section", className)} id={anchor}>
      {/* REINSTATE FOR TEMPLATE */}
      {/* <Row>
        <SectionHeader header={rootHeader} subheader={rootSubHeader} />
      </Row> */}
      <Row>
        <SectionHeader header={rootHeader} />
      </Row>
      <Row>
        <Col>
          <h3 className="section-subheading text-muted">Fotos erstellt von &nbsp;
            <a
              href="https://google.com/"
              target="_blank"
              rel="noreferrer"
            >
              Fotograph
            </a>
          </h3>
        </Col>
      </Row>
      <Row id="highlights" data-toggle="modal" data-target="#highlightsGallery">
        {highlights.map(
          ({ slideNumber, imageFileName, imageFileNameDetail }) => (
            <PhotoItem
              key={slideNumber}
              imageFileName={imageFileName}
              slideNumber={slideNumber}
              imageFileNameDetail={imageFileNameDetail}
              highlights={highlights}
            />
          ),
        )}
      </Row> {/* highlightsGallery */}
    </PageSection>
  );
}

Photos.propTypes = {
  className: PropTypes.string,
  frontmatter: PropTypes.object,
};

Photos.defaultProps = {
  className: null,
  frontmatter: null,
};

export default Photos;