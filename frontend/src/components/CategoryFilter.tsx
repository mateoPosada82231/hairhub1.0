"use client";

import { memo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faScissors,
  faSpa,
  faPaw,
  faCar,
  faPaintBrush,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { CategoryOption } from "@/types";

// Iconos para cada categoría del backend
const categoryIcons: Record<string, IconDefinition> = {
  BARBERSHOP: faScissors,
  HAIR_SALON: faScissors,
  NAIL_SALON: faPaintBrush,
  SPA: faSpa,
  CAR_WASH: faCar,
  PET_GROOMING: faPaw,
  TATTOO_STUDIO: faPaintBrush,
  OTHER: faStore,
};

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  categories: CategoryOption[];
}

function CategoryFilterComponent({
  selectedCategory,
  onCategoryChange,
  categories,
}: CategoryFilterProps) {
  const handleClick = useCallback(
    (categoryId: string) => {
      onCategoryChange(categoryId);
    },
    [onCategoryChange]
  );

  return (
    <div className="category-filter">
      {/* Botón "Todos" */}
      <button
        onClick={() => handleClick("all")}
        className={`category-button ${
          selectedCategory === "all" ? "category-button-active" : ""
        }`}
        aria-pressed={selectedCategory === "all"}
        aria-label="Mostrar todos"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className="category-icon" />
        <span>Todos</span>
      </button>
      
      {/* Categorías del backend */}
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => handleClick(cat.value)}
          className={`category-button ${
            selectedCategory === cat.value ? "category-button-active" : ""
          }`}
          aria-pressed={selectedCategory === cat.value}
          aria-label={`Filtrar por ${cat.label}`}
        >
          <FontAwesomeIcon 
            icon={categoryIcons[cat.value] || faStore} 
            className="category-icon" 
          />
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}

export const CategoryFilter = memo(CategoryFilterComponent);
