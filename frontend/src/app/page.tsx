"use client";

import { useState, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { EstablishmentGrid } from "@/components/EstablishmentGrid";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import type { Establishment } from "@/components/EstablishmentCard";
import "@/styles/home.css";

// Datos mock de establecimientos
const mockEstablishments: Establishment[] = [
  {
    id: 1,
    name: "La Casa del Chef",
    category: "restaurant",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    location: "Centro, Medellín",
    rating: 4.8,
    reviews: 234,
    priceRange: "$$",
    openNow: true,
    distance: "0.8 km",
  },
  {
    id: 2,
    name: "Estilo & Glamour",
    category: "salon",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    location: "El Poblado, Medellín",
    rating: 4.9,
    reviews: 189,
    priceRange: "$$$",
    openNow: true,
    distance: "1.2 km",
  },
  {
    id: 3,
    name: "FitLife Gym",
    category: "gym",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
    location: "Laureles, Medellín",
    rating: 4.7,
    reviews: 456,
    priceRange: "$$",
    openNow: false,
    distance: "2.1 km",
  },
  {
    id: 4,
    name: "Zen Spa & Wellness",
    category: "spa",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    location: "Envigado",
    rating: 4.9,
    reviews: 312,
    priceRange: "$$$",
    openNow: true,
    distance: "3.5 km",
  },
  {
    id: 5,
    name: "Café del Parque",
    category: "cafe",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
    location: "Provenza, Medellín",
    rating: 4.6,
    reviews: 178,
    priceRange: "$",
    openNow: true,
    distance: "0.5 km",
  },
  {
    id: 6,
    name: "The Rooftop Bar",
    category: "bar",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop",
    location: "El Poblado, Medellín",
    rating: 4.5,
    reviews: 267,
    priceRange: "$$$",
    openNow: false,
    distance: "1.8 km",
  },
];

function HomePageContent() {
  // Estados
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);

  // Filtrar establecimientos usando useMemo para optimizar rendimiento
  const filteredEstablishments = useMemo(() => {
    return mockEstablishments.filter((est) => {
      const matchesCategory =
        selectedCategory === "all" || est.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        est.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        est.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation =
        locationQuery === "" ||
        est.location.toLowerCase().includes(locationQuery.toLowerCase());
      return matchesCategory && matchesSearch && matchesLocation;
    });
  }, [searchQuery, locationQuery, selectedCategory]);

  // Handlers con useCallback para evitar re-renders innecesarios
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleLocationChange = useCallback((value: string) => {
    setLocationQuery(value);
  }, []);

  const handleSearch = useCallback(() => {
    // Aquí se podría implementar búsqueda en API
    console.log("Searching:", { searchQuery, locationQuery });
  }, [searchQuery, locationQuery]);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleToggleFavorite = useCallback((id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    );
  }, []);

  const handleViewDetails = useCallback((id: number) => {
    // Aquí se implementaría la navegación al detalle
    console.log("View details:", id);
  }, []);

  const handleFilterClick = useCallback(() => {
    // Aquí se implementaría la apertura del modal de filtros
    console.log("Open filters");
  }, []);

  return (
    <div className="home-container">
      <Navbar />

      <main className="home-main">
        {/* Hero Section con título y búsqueda */}
        <section className="home-hero">
          <div className="home-hero-content">
            {/* Título */}
            <div className="home-title-container">
              <h1 className="home-title">
                Encuentra y reserva los mejores{" "}
                <span className="home-title-accent">lugares</span>
              </h1>
              <p className="home-subtitle">
                Restaurantes, spas, gimnasios, salones de belleza y más. Todo en
                un solo lugar.
              </p>
            </div>

            {/* Barra de búsqueda */}
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              locationQuery={locationQuery}
              onLocationChange={handleLocationChange}
              onSearch={handleSearch}
            />

            {/* Filtros de categoría */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </section>

        {/* Grid de establecimientos */}
        <EstablishmentGrid
          establishments={filteredEstablishments}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onViewDetails={handleViewDetails}
          onFilterClick={handleFilterClick}
        />
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-content">
          <div className="home-footer-logo">
            <FontAwesomeIcon icon={faBookOpen} className="home-footer-logo-icon" />
            <span className="home-footer-logo-text">BOOKHUB</span>
          </div>
          <p className="home-footer-copyright">
            © 2026 BookHub. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Componente principal envuelto en ProtectedRoute
export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomePageContent />
    </ProtectedRoute>
  );
}
