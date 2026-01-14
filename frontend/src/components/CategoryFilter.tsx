"use client";

import { memo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUtensils,
  faScissors,
  faDumbbell,
  faSpa,
  faMugHot,
  faMartiniGlass,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface Category {
  id: string;
  label: string;
  icon: IconDefinition;
}

export const categories: Category[] = [
  { id: "all", label: "Todos", icon: faMagnifyingGlass },
  { id: "restaurant", label: "Restaurantes", icon: faUtensils },
  { id: "salon", label: "Salones", icon: faScissors },
  { id: "gym", label: "Gimnasios", icon: faDumbbell },
  { id: "spa", label: "Spas", icon: faSpa },
  { id: "cafe", label: "Cafeterías", icon: faMugHot },
  { id: "bar", label: "Bares", icon: faMartiniGlass },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

function CategoryFilterComponent({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const handleClick = useCallback(
    (categoryId: string) => {
      onCategoryChange(categoryId);
    },
    [onCategoryChange]
  );

  return (
    <div className="category-filter">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleClick(cat.id)}
          className={`category-button ${
            selectedCategory === cat.id ? "category-button-active" : ""
          }`}
          aria-pressed={selectedCategory === cat.id}
          aria-label={`Filtrar por ${cat.label}`}
        >
          <FontAwesomeIcon icon={cat.icon} className="category-icon" />
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}

export const CategoryFilter = memo(CategoryFilterComponent);
