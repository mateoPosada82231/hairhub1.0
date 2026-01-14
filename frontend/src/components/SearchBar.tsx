"use client";

import { memo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faLocationDot } from "@fortawesome/free-solid-svg-icons";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  locationQuery: string;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
}

function SearchBarComponent({
  searchQuery,
  onSearchChange,
  locationQuery,
  onLocationChange,
  onSearch,
}: SearchBarProps) {
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        onSearch();
      }
    },
    [onSearch]
  );

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <div className="search-field search-field-main">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="¿Qué estás buscando?"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="search-input"
            aria-label="Buscar establecimientos"
          />
        </div>
        <div className="search-field search-field-location">
          <FontAwesomeIcon icon={faLocationDot} className="search-icon" />
          <input
            type="text"
            placeholder="Ubicación"
            value={locationQuery}
            onChange={(e) => onLocationChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="search-input"
            aria-label="Ubicación"
          />
        </div>
        <button
          onClick={onSearch}
          className="search-button"
          aria-label="Buscar"
        >
          <FontAwesomeIcon icon={faSearch} className="search-button-icon" />
          <span>Buscar</span>
        </button>
      </div>
    </div>
  );
}

export const SearchBar = memo(SearchBarComponent);
