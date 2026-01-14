"use client";

import { memo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { EstablishmentCard, type Establishment } from "./EstablishmentCard";

interface EstablishmentGridProps {
  establishments: Establishment[];
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onViewDetails: (id: number) => void;
  onFilterClick: () => void;
}

function EstablishmentGridComponent({
  establishments,
  favorites,
  onToggleFavorite,
  onViewDetails,
  onFilterClick,
}: EstablishmentGridProps) {
  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites]
  );

  return (
    <section className="establishments-section">
      <div className="establishments-container">
        {/* Results Header */}
        <div className="results-header">
          <p className="results-count">
            <span className="results-number">{establishments.length}</span> lugares
            encontrados
          </p>
          <button
            onClick={onFilterClick}
            className="filter-button"
            aria-label="Abrir filtros"
          >
            <FontAwesomeIcon icon={faFilter} className="filter-icon" />
            <span>Filtros</span>
          </button>
        </div>

        {/* Grid */}
        {establishments.length > 0 ? (
          <div className="establishments-grid">
            {establishments.map((establishment) => (
              <EstablishmentCard
                key={establishment.id}
                establishment={establishment}
                isFavorite={isFavorite(establishment.id)}
                onToggleFavorite={onToggleFavorite}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon-container">
              <FontAwesomeIcon icon={faSearch} className="empty-icon" />
            </div>
            <h3 className="empty-title">No encontramos resultados</h3>
            <p className="empty-description">
              Intenta con otra búsqueda o cambia los filtros
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export const EstablishmentGrid = memo(EstablishmentGridComponent);
