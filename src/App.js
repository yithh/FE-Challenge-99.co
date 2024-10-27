import React, { useState } from "react";
import "./styles.css";

export default function ListingAd({
  pics,
  title,
  address,
  description,
  project_type,
  year,
  ownership_type,
  psf_min,
  psf_max,
  subprice_label,
  availabilities_label,
}) {
  const [showDescription, setShowDescription] = useState(false);
  const [revealedPhones, setRevealedPhones] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const phonePositions = [];

  const anonymizePhones = (text) => {
    let lastIndex = 0;
    let result = "";
    const matches = Array.from(text.matchAll(/(\(?)(\d{4})(\s?)(\d{4})(\)?)/g));

    matches.forEach((match) => {
      const [fullMatch, openBracket, p1, space, p2, closeBracket] = match;
      const startIndex = match.index;

      result += text.slice(lastIndex, startIndex);
      phonePositions.push({
        index: result.length,
        number: `${p1}${p2}`,
        openBracket,
        closeBracket,
      });
      result += `${openBracket}${p1} XXXX${closeBracket}`;
      lastIndex = startIndex + fullMatch.length;
    });

    result += text.slice(lastIndex);
    return result;
  };

  const handlePhoneClick = (position) => {
    setRevealedPhones((prev) => ({
      ...prev,
      [position]: !prev[position],
    }));
  };

  const renderDescription = () => {
    const anonymizedText = anonymizePhones(description);
    let lastIndex = 0;
    const parts = [];

    phonePositions.forEach((phone, idx) => {
      if (phone.index > lastIndex) {
        parts.push(
          <span key={`text-${idx}`}>{anonymizedText.slice(lastIndex, phone.index)}</span>
        );
      }

      const displayNumber = revealedPhones[idx]
        ? `${phone.openBracket}${phone.number.slice(0, 4)} ${phone.number.slice(4)}${phone.closeBracket}`
        : `${phone.openBracket}${phone.number.slice(0, 4)} XXXX${phone.closeBracket}`;

      parts.push(
        <span
          key={`phone-${idx}`}
          onClick={() => handlePhoneClick(idx)}
          className="phoneNumber"
        >
          {displayNumber}
        </span>
      );

      lastIndex = phone.index + displayNumber.length;
    });

    if (lastIndex < anonymizedText.length) {
      parts.push(<span key="text-final">{anonymizedText.slice(lastIndex)}</span>);
    }

    return parts;
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      pics.length > 1 ? (prevIndex === 0 ? pics.length - 1 : prevIndex - 1) : 0
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      pics.length > 1 ? (prevIndex === pics.length - 1 ? 0 : prevIndex + 1) : 0
    );
  };

  return (
    <div className={`card ${showDescription ? "show-description" : ""}`}>
      <div className="image-container">
        <div className="label">LAUNCHING SOON</div>
        <div className="slider" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
          {pics.map((pic, index) => (
            <img key={index} className="slideImage" src={pic} alt={`Property ${index + 1}`} />
          ))}
        </div>
        <button className="arrow left-arrow" onClick={handlePrevImage}>
          &#9664;
        </button>
        <button className="arrow right-arrow" onClick={handleNextImage}>
          &#9654;
        </button>
      </div>
      <div className={`content ${showDescription ? "content-expanded" : ""}`}>
        <div className="header">
          <img src={`${process.env.PUBLIC_URL}/building-icon.svg`} alt="icon" className="icon" />
          <div className="title-section">
            <h1 className="title">{title}</h1>
            <p className="address">{address}</p>
          </div>
          <div className="price-info">
            <span className="psf">${psf_min} - ${psf_max} psf</span>
            <span className="subprice">{subprice_label}</span>
          </div>
        </div>
        <div className="details">
          <p>{project_type} · {year} · {ownership_type}</p>
          <p>{availabilities_label}</p>
        </div>
        {showDescription && (
          <div className="description">{renderDescription()}</div>
        )}
      </div>
      <button className="see-description" onClick={() => setShowDescription(!showDescription)}>
        {showDescription ? "Show Less" : "See description"}
      </button>
    </div>
  );
}
