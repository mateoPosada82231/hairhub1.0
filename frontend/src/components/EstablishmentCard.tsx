"use client";

import { memo, useCallback } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faHeart as faHeartSolid,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

export interface Establishment {
  id: number;
  name: string;
  category: string;
  image: string;
  location: string;
  rating: number;
  reviews: number;
  priceRange: string;
  openNow: boolean;
  distance: string;
}

interface EstablishmentCardProps {
  establishment: Establishment;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onViewDetails: (id: number) => void;
}

function EstablishmentCardComponent({
  establishment,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
}: EstablishmentCardProps) {
  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFavorite(establishment.id);
    },
    [establishment.id, onToggleFavorite]
  );

  const handleViewDetails = useCallback(() => {
    onViewDetails(establishment.id);
  }, [establishment.id, onViewDetails]);

  return (
    <article className="establishment-card">
      {/* Image Container */}
      <div className="establishment-image-container">
        <Image
          src={establishment.image}
          alt={establishment.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="establishment-image"
          loading="lazy"
        />
        <div className="establishment-image-overlay" />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="favorite-button"
          aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <FontAwesomeIcon
            icon={isFavorite ? faHeartSolid : faHeartRegular}
            className={`favorite-icon ${isFavorite ? "favorite-icon-active" : ""}`}
          />
        </button>

        {/* Open Status Badge */}
        <div className="status-badge-container">
          <span
            className={`status-badge ${
              establishment.openNow ? "status-badge-open" : "status-badge-closed"
            }`}
          >
            {establishment.openNow ? "Abierto" : "Cerrado"}
          </span>
        </div>

        {/* Price Range Badge */}
        <div className="price-badge-container">
          <span className="price-badge">{establishment.priceRange}</span>
        </div>
      </div>

      {/* Content */}
      <div className="establishment-content">
        <div className="establishment-header">
          <h3 className="establishment-name">{establishment.name}</h3>
          <div className="establishment-rating">
            <FontAwesomeIcon icon={faStar} className="rating-star" />
            <span className="rating-value">{establishment.rating}</span>
            <span className="rating-count">({establishment.reviews})</span>
          </div>
        </div>

        <div className="establishment-location">
          <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
          <span>{establishment.location}</span>
          <span className="location-separator">•</span>
          <span>{establishment.distance}</span>
        </div>

        <button
          onClick={handleViewDetails}
          className="establishment-button"
          aria-label={`Ver disponibilidad de ${establishment.name}`}
        >
          Ver disponibilidad
        </button>
      </div>
    </article>
  );
}

export const EstablishmentCard = memo(EstablishmentCardComponent);
