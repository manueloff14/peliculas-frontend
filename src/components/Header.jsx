"use client";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Film, Tv, Search, Clock, Star } from "lucide-react";

export default function Header() {
    const tabs = [
        { name: "Inicio", href: "/" },
        { name: "Películas", href: "/peliculas" },
        /* { name: "Series", href: "/series", newService: true },
        {
            name: "En vivo",
            href: "/en-vivo",
            newService: true,
        }, */
    ];

    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Lógica mejorada para activeTab
    const getActiveTab = () => {
        if (pathname === "/") return "Inicio";
        if (pathname === "/peliculas") return "Películas";
        /* if (pathname === "/series") return "Series";
        if (pathname === "/en-vivo") return "En vivo"; */
        return null; // No activar ninguno si estamos en /ver u otras rutas
    };

    const activeTab = getActiveTab();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);

    {
        /* Función handleSearchSubmit actualizada */
    }
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setSearchResults([]);
        setSearchError(null);

        try {
            const response = await fetch(
                `${
                    process.env.NEXT_PUBLIC_API_URL
                }/api/v1/search?query=${encodeURIComponent(searchQuery)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Error ${response.status}: ${response.statusText}`
                );
            }

            const data = await response.json();

            const formattedResults = data.results.map((item) => ({
                id: item.id,
                title: item.title,
                type: item.type === "serie" ? "tv" : "movie",
                year: item.year,
                rating: item.rating,
                poster_url: item.poster_url,
                overview: item.overview,
            }));

            setSearchResults(formattedResults);
        } catch (error) {
            console.error("Error en búsqueda:", error);
            setSearchError(error.message);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearchSubmit(e);
        }
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
        setSearchError(null);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const getTypeIcon = (type) => {
        return type === "movie" ? (
            <Film className="w-4 h-4" />
        ) : (
            <Tv className="w-4 h-4" />
        );
    };

    const handleResultClick = (result) => {
        window.location.href = `/ver?contenido=${result.id}`;
        closeSearch();
    };

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-20">
                <div className="px-4 sm:px-8 lg:px-14 py-4 sm:py-6 mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex flex-grow basis-0">
                        <div
                            className="cursor-pointer flex-shrink-0 bg-[#000000af] backdrop-blur-[10px] rounded-full p-2 px-3 sm:px-4 border border-gray-900"
                            onClick={() => (window.location.href = "/")}
                        >
                            <img
                                src="https://www.rendaz.shop/rendaz-logo.svg"
                                alt="Rendaz"
                                className="w-[100px] sm:w-[110px] lg:w-[120px]"
                            />
                        </div>
                    </div>

                    {/* Nav Desktop */}
                    <nav className="hidden md:block">
                        <ul className="flex space-x-2 bg-[#00000085] backdrop-blur-[10px] rounded-full border border-gray-900">
                            {tabs.map((tab) => {
                                const isActive = tab.name === activeTab;
                                return (
                                    <li key={tab.name} className="relative">
                                        {tab.newService && (
                                            <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 transform bg-[red] backdrop-blur-[10px] rounded-full z-[99999] text-xs p-1 px-2 font-bold">
                                                Nuevo
                                            </span>
                                        )}
                                        <Link
                                            href={tab.href}
                                            className={`
                        relative z-10 inline-block px-6 lg:px-8 py-3 lg:py-4 text-sm font-bold
                        ${isActive ? "text-black" : "text-white"}
                        transition-colors duration-300
                      `}
                                        >
                                            {tab.name}
                                        </Link>

                                        {/* Slider blanco */}
                                        <div
                                            className={`
                        absolute inset-1 bg-white rounded-full 
                        transform ${isActive ? "scale-x-100" : "scale-x-0"}
                        origin-left transition-transform duration-300
                      `}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Botones de acción */}
                    <div className="items-center gap-2 sm:gap-3 [&>button]:cursor-pointer flex flex-grow basis-0 justify-end">
                        {/* Botón de búsqueda */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="text-white hover:text-gray-300 rounded-full bg-[#00000085] backdrop-blur-[10px] p-3 sm:p-4 transition-colors border border-gray-900"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                                color="white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                />
                            </svg>
                            <span className="sr-only">Buscar</span>
                        </button>

                        {/* Botón menú hamburger (solo móvil) */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden text-white hover:text-gray-300 rounded-full bg-[#00000085] backdrop-blur-[10px] p-3 transition-colors border border-gray-900"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                                color="white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>

                            <span className="sr-only">Menú</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Menú móvil */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={closeMobileMenu}
                    />

                    {/* Panel del menú */}
                    <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-[#181818] border-l border-[#313131] shadow-2xl">
                        {/* Header del menú */}
                        <div className="flex items-center justify-between p-6 border-b border-[#313131]">
                            <h3 className="text-xl font-semibold text-white">
                                Menú
                            </h3>
                            <button
                                onClick={closeMobileMenu}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="size-6" />
                            </button>
                        </div>

                        {/* Navegación móvil */}
                        <nav className="p-6">
                            <ul className="space-y-2">
                                {tabs.map((tab) => {
                                    const isActive = tab.name === activeTab;
                                    return (
                                        <li key={tab.name} className="relative">
                                            {tab.newService && (
                                                <span className="absolute top-0 right-5 translate-x-1/2 -translate-y-1/2 transform bg-[red] backdrop-blur-[10px] rounded-full z-[99999] text-xs p-1 px-2 font-bold">
                                                    Nuevo
                                                </span>
                                            )}
                                            <Link
                                                href={tab.href}
                                                onClick={closeMobileMenu}
                                                className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm
                          ${
                              isActive
                                  ? "bg-white text-black"
                                  : "bg-[#29292933] text-white hover:bg-[#2a2a2a] hover:text-gray-100"
                          }
                        `}
                                            >
                                                {/* <div className="w-2 h-2 rounded-full bg-current opacity-60"></div> */}
                                                {tab.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        {/* Footer del menú */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[#313131]">
                            <div className="flex items-center gap-3">
                                {/* <img
                                    src="https://www.rendaz.shop/rendaz-logo.svg"
                                    alt="Rendaz"
                                    className="w-8 h-8"
                                /> */}
                                <span className="text-gray-400 text-sm">
                                    Rendaz © {/* si es mayor a 2025 mostramos 2025 - mayor, si no solo 2025 */} {new Date().getFullYear() > 2025 ? "2025 - " + new Date().getFullYear() : "2025"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de búsqueda */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={closeSearch}
                    />

                    {/* Modal */}
                    <div className="relative z-10 bg-[#1a1a1a] border border-gray-600 rounded-2xl w-full max-w-2xl mx-4 shadow-2xl">
                        {/* Header del modal */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-600">
                            <h3 className="text-lg sm:text-xl font-semibold text-white">
                                Buscar contenido
                            </h3>
                            <button
                                onClick={closeSearch}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="size-6" />
                            </button>
                        </div>

                        {/* Campo de búsqueda */}
                        <div className="p-4 sm:p-6">
                            <form onSubmit={handleSearchSubmit}>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        onKeyPress={handleKeyPress}
                                        placeholder="Buscar películas, series..."
                                        className="w-full bg-[#2a2a2a] border border-gray-600 rounded-xl pl-12 pr-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors text-sm sm:text-base"
                                        autoFocus
                                    />
                                </div>
                            </form>

                            {/* Indicador de carga */}
                            {isSearching && (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
                                    <span className="ml-3 text-gray-400 text-sm sm:text-base">
                                        Buscando...
                                    </span>
                                </div>
                            )}

                            {/* Error de búsqueda */}
                            {searchError && !isSearching && (
                                <div className="text-center py-8 sm:py-12">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <X className="size-6" />
                                    </div>
                                    <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">
                                        Error en la búsqueda
                                    </h4>
                                    <p className="text-gray-400 text-xs sm:text-sm">
                                        {searchError}
                                    </p>
                                    <button
                                        onClick={() => setSearchError(null)}
                                        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                                    >
                                        Intentar de nuevo
                                    </button>
                                </div>
                            )}

                            {/* Resultados de búsqueda */}
                            {searchResults.length > 0 && !isSearching && (
                                <div className="mt-4 sm:mt-6">
                                    <h4 className="text-xs sm:text-sm font-semibold text-gray-400 mb-3 sm:mb-4 px-2">
                                        Resultados ({searchResults.length})
                                    </h4>
                                    <div className="space-y-2 max-h-80 sm:max-h-96 overflow-y-auto no-scrollbar">
                                        {searchResults.map((result) => (
                                            <button
                                                key={result.id}
                                                onClick={() =>
                                                    handleResultClick(result)
                                                }
                                                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors text-left group"
                                            >
                                                <div className="flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 bg-gray-700 rounded-lg overflow-hidden">
                                                    <img
                                                        src={
                                                            result.poster_url ||
                                                            "/placeholder-poster.jpg"
                                                        }
                                                        alt={result.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src =
                                                                "/placeholder-poster.jpg";
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-white font-semibold truncate group-hover:text-gray-100 text-sm sm:text-base">
                                                        {result.title}
                                                    </h5>
                                                    <div className="flex items-center gap-2 sm:gap-3 mt-1">
                                                        <span className="text-gray-400 text-xs sm:text-sm capitalize">
                                                            {result.type ===
                                                            "movie"
                                                                ? "Película"
                                                                : "Serie"}
                                                        </span>
                                                        <span className="text-gray-500 text-xs sm:text-sm">
                                                            •
                                                        </span>
                                                        <span className="text-gray-400 text-xs sm:text-sm">
                                                            {result.year}
                                                        </span>
                                                        {result.rating && (
                                                            <>
                                                                <span className="text-gray-500 text-xs sm:text-sm">
                                                                    •
                                                                </span>
                                                                <div className="flex items-center gap-1">
                                                                    <Star className="w-4 h-4 text-yellow-400" />
                                                                    <span className="text-gray-400 text-xs sm:text-sm">
                                                                        {result.rating.toFixed(
                                                                            1
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <div className="w-2 h-2 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Estado vacío */}
                            {searchResults.length === 0 &&
                                searchQuery &&
                                !isSearching &&
                                !searchError && (
                                    <div className="text-center flex flex-col items-center py-8 sm:py-12">
                                        <Search className="w-6 h-6 text-gray-400 mb-2" />
                                        <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">
                                            No se encontraron resultados
                                        </h4>
                                        <p className="text-gray-400 text-xs sm:text-sm">
                                            Intenta con otros términos de
                                            búsqueda
                                        </p>
                                    </div>
                                )}

                            {/* Sugerencias iniciales */}
                            {!searchQuery && !isSearching && (
                                <div className="mt-4 sm:mt-6">
                                    <h4 className="text-xs sm:text-sm font-semibold text-gray-400 mb-3 sm:mb-4 px-2">
                                        Sugerencias populares
                                    </h4>
                                    <div className="space-y-2">
                                        {[
                                            {
                                                text: "Películas de acción",
                                                icon: (
                                                    <Film className="size-4" />
                                                ),
                                            },
                                            {
                                                text: "Series recientes",
                                                icon: <Tv className="size-4" />,
                                            },
                                            {
                                                text: "Estrenos 2024",
                                                icon: (
                                                    <Clock className="size-4" />
                                                ),
                                            },
                                            {
                                                text: "Más valoradas",
                                                icon: (
                                                    <Star className="size-4" />
                                                ),
                                            },
                                        ].map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    setSearchQuery(
                                                        suggestion.text
                                                    )
                                                }
                                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors text-left group"
                                            >
                                                <div className="text-gray-400 group-hover:text-white transition-colors">
                                                    {suggestion.icon}
                                                </div>
                                                <span className="text-gray-300 group-hover:text-white transition-colors text-sm sm:text-base">
                                                    {suggestion.text}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Instrucciones */}
                            <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-600">
                                <p className="text-gray-500 text-xs text-center">
                                    Presiona Enter para buscar • Esc para cerrar
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
