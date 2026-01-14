"use client";

import { memo, useCallback } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faHeart as faHeartSolid,
  faLocationDot,
  faScissors,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import type { BusinessSummary } from "@/types";

// Imagen por defecto si no hay cover image
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop";

interface EstablishmentCardProps {
  business: BusinessSummary;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onViewDetails: (id: number) => void;
}

function EstablishmentCardComponent({
  business,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
}: EstablishmentCardProps) {
  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFavorite(business.id);
    },
    [business.id, onToggleFavorite]
  );

  const handleViewDetails = useCallback(() => {
    onViewDetails(business.id);
  }, [business.id, onViewDetails]);

  const rating = business.average_rating ?? 0;
  const imageUrl = business.cover_image_url || DEFAULT_IMAGE;

  return (
    <article className="establishment-card">
      {/* Image Container */}
      <div className="establishment-image-container">
        <Image
          src={imageUrl}
          alt={business.name}
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

        {/* Category Badge */}
        <div className="status-badge-container">
          <span className="status-badge status-badge-category">
            {business.category_display}
          </span>
        </div>

        {/* Services Count Badge */}
        <div className="price-badge-container">
          <span className="price-badge">
            <FontAwesomeIcon icon={faScissors} className="mr-1" />
            {business.services_count} servicios
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="establishment-content">
        <div className="establishment-header">
          <h3 className="establishment-name">{business.name}</h3>
          <div className="establishment-rating">
            <FontAwesomeIcon icon={faStar} className="rating-star" />
            <span className="rating-value">{rating.toFixed(1)}</span>
            <span className="rating-count">({business.total_reviews})</span>
          </div>
        </div>

        <div className="establishment-location">
          <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
          <span>{business.address}</span>
          {business.city && (
            <>
              <span className="location-separator">•</span>
              <span>{business.city}</span>
            </>
          )}
        </div>

        <button
          onClick={handleViewDetails}
          className="establishment-button"
          aria-label={`Ver disponibilidad de ${business.name}`}
        >
          Ver disponibilidad
        </button>
      </div>
    </article>
  );
}

export const EstablishmentCard = memo(EstablishmentCardComponent);
