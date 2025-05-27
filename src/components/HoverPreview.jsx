"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function HoverPreview({ movie, index, allMovies = [] }) {
    const [isHovered, setIsHovered] = useState(false);
    const [modalWasClosed, setModalWasClosed] = useState(false);
    const containerRef = useRef(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Detectar si el modal debe mostrarse basado en la URL
    const infoParam = searchParams.get("info");
    const shouldShowModal = infoParam === movie.id && !modalWasClosed;

    // Resetear el estado cuando cambia la URL a una película diferente
    useEffect(() => {
        if (infoParam !== movie.id) {
            setModalWasClosed(false);
        }
    }, [infoParam, movie.id]);

    // Resetear el estado cuando no hay parámetro info
    useEffect(() => {
        if (!infoParam) {
            setModalWasClosed(false);
        }
    }, [infoParam]);

    // Función para obtener películas similares
    const getSimilarMovies = () => {
        if (!allMovies || allMovies.length === 0) return [];

        // Filtrar películas que comparten al menos un género
        const similar = allMovies.filter(
            (m) =>
                m.id !== movie.id &&
                m.genres.some((genre) => movie.genres.includes(genre))
        );

        // Si no hay suficientes similares, agregar otras películas
        if (similar.length < 6) {
            const others = allMovies.filter(
                (m) => m.id !== movie.id && !similar.find((s) => s.id === m.id)
            );
            similar.push(...others);
        }

        return similar.slice(0, 6); // Máximo 6 películas similares
    };

    const getCardPosition = () => {
        if (!containerRef.current)
            return { left: "50%", transform: "translateX(-50%)" };

        const rect = containerRef.current.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const cardWidth = 320;
        const containerWidth = 200;

        // DETECCIÓN MEJORADA - Primer elemento visible (borde izquierdo)
        if (rect.left <= 100) {
            return { left: "0px", transform: "translateX(0)" };
        }

        // DETECCIÓN MEJORADA - Último elemento visible (borde derecho)
        if (rect.right >= screenWidth - 100) {
            return { right: "0px", transform: "translateX(0)" };
        }

        // Para elementos del centro - Calcular posición centrada
        const containerCenter = rect.left + containerWidth / 2;
        const cardLeft = containerCenter - cardWidth / 2;

        if (cardLeft < 20) {
            return { left: "20px", transform: "translateX(0)" };
        }

        if (cardLeft + cardWidth > screenWidth - 20) {
            return { right: "20px", transform: "translateX(0)" };
        }

        return {
            left: `${cardLeft - rect.left}px`,
            transform: "translateX(0)",
        };
    };

    // Función para extraer el ID del video de YouTube
    const getYouTubeVideoId = (url) => {
        if (!url) return null;
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    // Manejar click en el video - redirigir a /ver?contenido=id
    const handleVideoClick = () => {
        router.push(`/ver?contenido=${movie.id}`);
    };

    // Manejar click en película similar
    const handleSimilarMovieClick = (movieId) => {
        router.push(`/?info=${movieId}`);
    };

    // Manejar click en botón de más info - navegar a /?info=id
    const handleMoreInfoClick = (e) => {
        e.stopPropagation();
        setModalWasClosed(false);
        router.push(`/?info=${movie.id}`);
        setIsHovered(false);
    };

    // Cerrar modal - marcar como cerrado y limpiar URL
    const closeModal = () => {
        setModalWasClosed(true);
        router.push("/", { scroll: false });
    };

    // Ocultar hover cuando el modal está abierto
    useEffect(() => {
        if (shouldShowModal) {
            setIsHovered(false);
        }
    }, [shouldShowModal]);

    // Manejo de tecla ESC para cerrar modal
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === "Escape" && shouldShowModal) {
                closeModal();
            }
        };

        if (shouldShowModal) {
            document.addEventListener("keydown", handleEscKey);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscKey);
            document.body.style.overflow = "unset";
        };
    }, [shouldShowModal]);

    const similarMovies = getSimilarMovies();

    return (
        <>
            <div
                ref={containerRef}
                className="relative flex-shrink-0 w-[200px] h-[300px] cursor-pointer group"
                onMouseEnter={() => !shouldShowModal && setIsHovered(true)}
                onMouseLeave={() => !shouldShowModal && setIsHovered(false)}
            >
                {/* Imagen original */}
                <div className="w-full h-full relative overflow-hidden rounded-lg transition-all duration-500 ease-out">
                    <img
                        src={movie.poster || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-all duration-500 ease-out"
                    />

                    {/* Overlay sutil que aparece en hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
                </div>

                {/* Card de hover expandida - CON TRAILER DE YOUTUBE */}
                {isHovered && !shouldShowModal && (
                    <div
                        className="absolute z-[9999] w-[250px] md:w-[320px] bg-zinc-900 rounded-xl overflow-hidden shadow-md shadow-[#272727] border border-zinc-700/50 backdrop-blur-sm"
                        style={{
                            top: -10,
                            ...getCardPosition(),
                            animation:
                                "slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                        }}
                    >
                        {/* TRAILER DE YOUTUBE - TODOS LOS CONTROLES OCULTOS */}
                        <div className="relative w-full h-[120px] md:h-[180px] overflow-hidden">
                            {movie.trailerUrl &&
                            getYouTubeVideoId(movie.trailerUrl) ? (
                                <div className="relative w-full h-full">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                                            movie.trailerUrl
                                        )}?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&loop=1&playlist=${getYouTubeVideoId(
                                            movie.trailerUrl
                                        )}&modestbranding=1&iv_load_policy=3&fs=0&disablekb=1&cc_load_policy=0&start=0&end=0&origin=${
                                            typeof window !== "undefined"
                                                ? window.location.origin
                                                : ""
                                        }&enablejsapi=0&widgetid=1`}
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allow="autoplay; encrypted-media"
                                        allowFullScreen={false}
                                        style={{
                                            pointerEvents: "none",
                                        }}
                                    />
                                    {/* Overlay invisible para capturar clicks */}
                                    <div
                                        className="absolute inset-0 cursor-pointer z-10"
                                        onClick={handleVideoClick}
                                        style={{ pointerEvents: "auto" }}
                                    />
                                </div>
                            ) : (
                                // Fallback a la imagen si no hay trailer
                                <div
                                    className="relative w-full h-full"
                                    onClick={handleVideoClick}
                                >
                                    <img
                                        src={movie.poster || "/placeholder.svg"}
                                        alt={movie.title}
                                        className="w-full h-full object-cover scale-105 transition-transform duration-700 ease-out hover:scale-110"
                                    />
                                </div>
                            )}

                            {/* Gradiente overlay mejorado */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                            {/* Controles de reproducción con animaciones */}
                            <div className="absolute bottom-4 left-4 flex gap-2 pointer-events-auto z-20">
                                <button
                                    className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-all duration-300 ease-out hover:scale-125 shadow-lg hover:shadow-xl"
                                    style={{
                                        animation:
                                            "fadeInScale 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both",
                                    }}
                                    onClick={handleVideoClick}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="size-4 md:size-6"
                                        color="black"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Botón de más info */}
                            <button
                                className="absolute bottom-4 right-4 w-8 h-8 md:w-10 md:h-10 bg-zinc-800/90 border-2 border-zinc-600 rounded-full flex items-center justify-center hover:bg-zinc-700 hover:border-white transition-all duration-300 ease-out hover:scale-125 shadow-lg pointer-events-auto z-20"
                                style={{
                                    animation:
                                        "fadeInScale 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
                                }}
                                onClick={handleMoreInfoClick}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-4 md:size-6"
                                    color="white"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Información con animación escalonada */}
                        <div
                            className="p-5 text-white"
                            onClick={handleMoreInfoClick}
                        >
                            <h3
                                className="text-xl font-bold mb-3 leading-tight"
                                style={{
                                    animation:
                                        "fadeInUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
                                }}
                            >
                                {/* mostraremos solo los primeros 22 caracteres */}
                                {movie.title.length > 22
                                    ? movie.title.substring(0, 22) + "..."
                                    : movie.title}
                            </h3>

                            {/* Metadatos */}
                            <div
                                className="flex items-center gap-3 text-sm text-gray-300 mb-4"
                                style={{
                                    animation:
                                        "fadeInUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
                                }}
                            >
                                {movie.rating && (
                                    <span className="px-2 py-1 bg-zinc-700 rounded text-xs font-bold shadow-sm">
                                        {movie.rating}
                                    </span>
                                )}
                                <span className="font-medium">
                                    {movie.year}
                                </span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                                {/* solo mostramos dos generos */}
                                {movie.genres.length > 0 && (
                                    <span>
                                        {movie.genres[0]}{" "}
                                        {movie.genres.length > 1 &&
                                            `• ${movie.genres[1]}`}
                                    </span>
                                )}
                            </div>

                            {/* Descripción */}
                            {movie.description && (
                                <p
                                    className="text-sm text-gray-300 leading-relaxed"
                                    style={{
                                        animation:
                                            "fadeInUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
                                    }}
                                >
                                    {movie.description.length > 60
                                        ? `${movie.description.substring(
                                              0,
                                              60
                                          )}...`
                                        : movie.description}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Estilos CSS para las animaciones */}
                <style jsx>{`
                    @keyframes slideInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px) scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }

                    @keyframes fadeInScale {
                        from {
                            opacity: 0;
                            transform: scale(0.8);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }

                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes modalSlideIn {
                        from {
                            opacity: 0;
                            transform: scale(0.9);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                `}</style>
            </div>

            {/* MODAL DE INFORMACIÓN DETALLADA - CON IFRAME SIN CONTROLES */}
            {shouldShowModal && (
                <div
                    className="fixed inset-0 bg-[#0000008e] backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    <div
                        className="bg-zinc-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-zinc-700/50 shadow-2xl no-scrollbar "
                        style={{
                            animation:
                                "modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header del modal - TRAILER SIN CONTROLES */}
                        <div className="relative">
                            {movie.trailerUrl &&
                            getYouTubeVideoId(movie.trailerUrl) ? (
                                <div className="relative w-full h-[25vh] md:h-[50vh] overflow-hidden rounded-t-2xl">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                                            movie.trailerUrl
                                        )}?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&loop=1&playlist=${getYouTubeVideoId(
                                            movie.trailerUrl
                                        )}&modestbranding=1&iv_load_policy=3&fs=0&disablekb=1&cc_load_policy=0&start=0&end=0&origin=${
                                            typeof window !== "undefined"
                                                ? window.location.origin
                                                : ""
                                        }&enablejsapi=0&widgetid=1`}
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allow="autoplay; encrypted-media"
                                        allowFullScreen={false}
                                        title={`${movie.title} - Trailer`}
                                        style={{
                                            pointerEvents: "none",
                                        }}
                                    />

                                    {/* Overlay clickeable para ir a ver la película completa */}
                                    <div
                                        className="absolute inset-0 cursor-pointer z-10 bg-transparent hover:bg-black/10 transition-colors duration-200"
                                        onClick={handleVideoClick}
                                        title="Click para ver la película completa"
                                        style={{ pointerEvents: "auto" }}
                                    />

                                    {/* Gradiente overlay sutil */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                                </div>
                            ) : (
                                // Fallback a imagen si no hay trailer
                                <div
                                    className="relative w-full h-[50vh] overflow-hidden rounded-t-2xl"
                                    onClick={handleVideoClick}
                                >
                                    <img
                                        src={movie.poster || "/placeholder.svg"}
                                        alt={movie.title}
                                        className="w-full h-full object-cover cursor-pointer"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                </div>
                            )}

                            {/* Botón cerrar */}
                            <button
                                onClick={closeModal}
                                className="fixed top-4 right-4 w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-all duration-200 z-20"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6 text-white"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Contenido del modal */}
                        <div className="p-6 text-white">
                            <h2 className="text-3xl font-bold mb-4">
                                {movie.title}
                            </h2>

                            {/* Metadatos expandidos */}
                            <div className="flex items-center gap-4 mb-6">
                                {movie.rating && (
                                    <span className="text-xs md:text-base px-3 py-1 bg-green-600 rounded font-bold">
                                        {movie.rating}
                                    </span>
                                )}
                                <span className="text-sm md:text-base font-medium">
                                    {movie.year}
                                </span>
                                <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                                <span className="text-sm md:text-base text-gray-300">
                                    {movie.genres.join(", ")}
                                </span>
                            </div>

                            {/* Descripción completa */}
                            <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-6">
                                {movie.description}
                            </p>

                            {/* Botones de acción */}
                            <div className={`flex gap-3 ${similarMovies.length > 0 ? "mb-8" : ""}`}>
                                <button
                                    onClick={() =>
                                        router.push(
                                            `/ver?contenido=${movie.id}`
                                        )
                                    }
                                    className="flex-1 bg-white text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    ¡Ver Ahora!
                                </button>
                            </div>

                            {/* SECCIÓN DE CONTENIDO SIMILAR - SIN HOVER */}
                            {similarMovies.length > 0 && (
                                <div className="border-t border-zinc-700 pt-6 hidden">
                                    <h3 className="text-xl font-semibold mb-4">
                                        Contenido Similar
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                        {similarMovies.map((similarMovie) => (
                                            <div
                                                key={similarMovie.id}
                                                className="cursor-pointer group"
                                                onClick={() =>
                                                    handleSimilarMovieClick(
                                                        similarMovie.id
                                                    )
                                                }
                                            >
                                                <div className="relative overflow-hidden rounded-lg transition-transform duration-200 group-hover:scale-105">
                                                    <img
                                                        src={
                                                            similarMovie.poster ||
                                                            "/placeholder.svg"
                                                        }
                                                        alt={similarMovie.title}
                                                        className="w-full h-[220px] object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                                                </div>
                                                <h4 className="text-sm font-medium mt-2 text-gray-300 group-hover:text-white transition-colors duration-200 line-clamp-2">
                                                    {similarMovie.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {similarMovie.year}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
