"use client";

import AdBlockDetector from "@/components/AdBlockDetector";
import Header from "@/components/Header";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Play,
    Globe,
    Monitor,
    Loader2,
    CheckCircle,
    Heart,
    Clock,
    Sparkles,
} from "lucide-react";
import HoverPreview from "@/components/HoverPreview";

export default function Ver() {
    const searchParams = useSearchParams();
    const contenido = searchParams.get("contenido");

    const [movieData, setMovieData] = useState(null);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingReproductor, setIsLoadingReproductor] = useState(false);
    const [server, setServer] = useState(null);
    const [isRequesting, setIsRequesting] = useState(false);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/get-movie?id=${contenido}`
                );
                const data = await response.json();

                if (data.success) {
                    setMovieData(data.data);
                    setSimilarMovies(data.data.similar_movies || []);
                }
            } catch (error) {
                console.error("Error fetching movie data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (contenido) fetchMovieData();
    }, [contenido]);

    const handleServerSelect = (selectedServer) => {
        setIsLoadingReproductor(true);
        setServer(selectedServer);
        setTimeout(() => setIsLoadingReproductor(false), 800);
    };

    const handleRequestContent = async () => {
        setIsRequesting(true);
        setTimeout(() => {
            setIsRequesting(false);
            alert(
                "¡Solicitud enviada! Te notificaremos cuando esté disponible 🎬"
            );
        }, 2000);
    };

    const getLanguageIcon = (language) => {
        return language === "Latino" ? "🇲🇽" : "🇪🇸";
    };

    const getServerIcon = (serverName) => {
        const icons = {
            StreamWish: "🎬",
            FileLions: "🦁",
            Wolfstream: "🐺",
            ABstream: "📺",
            Filemoon: "🌙",
        };
        return icons[serverName] || "📡";
    };

    if (!contenido || (!isLoading && !movieData)) {
        return (
            <>
                <AdBlockDetector />
                <Header />
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pt-24 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-7xl mx-auto">
                        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                            <div className="bg-[#00000085] backdrop-blur-[10px] rounded-2xl p-8 sm:p-12 border border-gray-700 max-w-md w-full flex flex-col items-center">
                                <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                    Contenido no encontrado
                                </h2>
                                <p className="text-gray-400 text-sm sm:text-base">
                                    El contenido que buscas no está disponible.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (isLoading) {
        return (
            <>
                <AdBlockDetector />
                <Header />
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pt-24 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
            </>
        );
    }

    return (
        <>
            <AdBlockDetector />
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pt-24">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="lg:mx-8">
                        {/* Título del contenido */}
                        <div className="mb-6 sm:mb-8 flex items-start gap-6">
                            {/* img */}
                            <img
                                className="w-[150px] h-auto rounded-2xl mb-6"
                                src={movieData.images.poster_url}
                                alt={movieData.title}
                            />
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <img
                                        className="w-[40px]"
                                        src="https://miro.medium.com/v2/resize:fit:512/1*UaUZmFbQmQ4ZstvGQ-JFeA.png"
                                        alt=""
                                    />
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                                        {movieData.title}
                                    </h1>
                                </div>
                                <div className="flex items-center gap-3 text-gray-400 text-sm">
                                    <span>{movieData.year}</span>
                                    <span>•</span>
                                    <span>{movieData.age_rating}</span>
                                    {movieData.genres.length > 0 && (
                                        <span>
                                            {movieData.genres[0]}{" "}
                                            {movieData.genres.length > 1 &&
                                                `• ${movieData.genres[1]}`}
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-400 text-sm mt-2 w-full md:w-[300px]">
                                    {/* recortamos en las primeras 220 caracteres y si hay más agregamos ... */}
                                    {movieData.overview.slice(0, 220) +
                                        (movieData.overview.length > 220
                                            ? "..."
                                            : "Actualmente no hay una descripción para este contenido, lo sentimos mucho :(")}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
                            {/* Reproductor */}
                            <div className="order-1 xl:order-2 flex-1 xl:flex-[2]">
                                <div className="bg-[#00000085] backdrop-blur-[10px] rounded-2xl border border-gray-700 overflow-hidden">
                                    {server ? (
                                        <div className="relative">
                                            <div className="p-3 sm:p-4 border-b border-gray-700">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                                        <span className="text-white font-semibold text-sm sm:text-base">
                                                            Reproduciendo en{" "}
                                                            {server.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-400 text-xs sm:text-sm">
                                                            {getLanguageIcon(
                                                                server.language
                                                            )}{" "}
                                                            {server.language}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="relative aspect-video bg-black">
                                                {isLoadingReproductor ? (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="text-center flex flex-col items-center gap-2">
                                                            <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-white animate-spin" />
                                                            <p className="text-white text-sm sm:text-base">
                                                                Cargando
                                                                reproductor...
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <iframe
                                                        src={server.url}
                                                        className="w-full h-full"
                                                        frameBorder="0"
                                                        allowFullScreen
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        title={`Reproductor ${server.name}`}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ) : /* si existe la variable de servers y está vacia o si simplemente no existe */
                                    movieData.servers.length === 0 ||
                                      movieData.servers === undefined ? (
                                        <div className="aspect-video flex items-center justify-center p-6 relative">
                                            <img
                                                src={
                                                    movieData.images.poster_url
                                                }
                                                alt=""
                                                className="absolute top-0 left-0 w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-[#000000bb] backdrop-blur-[20px]"></div>
                                            <div className="text-center max-w-md relative z-10">
                                                <div className="text-center max-w-md">
                                                    <div className="mb-6">
                                                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                                            <Sparkles className="w-10 h-10 text-white" />
                                                        </div>
                                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                                                            ¡Uy bro! 😅
                                                        </h3>
                                                        <p className="text-gray-300 text-sm sm:text-base mb-4 leading-relaxed">
                                                            Lamentablemente no
                                                            tenemos servidores
                                                            disponibles
                                                            actualmente para
                                                            este contenido.
                                                        </p>
                                                    </div>

                                                    <div className="bg-[#ffffff10] rounded-xl p-4 mb-6 border border-gray-600">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <Heart className="w-5 h-5 text-red-500" />
                                                            <span className="text-white font-semibold text-sm sm:text-base">
                                                                ¡Pero tenemos
                                                                buenas noticias!
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                                                            Puedes solicitar la
                                                            película y nuestro
                                                            equipo se encargará
                                                            de traértela en una
                                                            hora como máximo.
                                                            <span className="text-yellow-400 font-semibold">
                                                                {" "}
                                                                ¡Te recomendamos
                                                                solicitarla! :D
                                                            </span>
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={
                                                            handleRequestContent
                                                        }
                                                        disabled={isRequesting}
                                                        className="group relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                        <div className="relative flex items-center gap-3">
                                                            {isRequesting ? (
                                                                <>
                                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                                    <span className="text-sm sm:text-base">
                                                                        Enviando
                                                                        solicitud...
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Clock className="w-5 h-5" />
                                                                    <span className="text-sm sm:text-base">
                                                                        Solicitar
                                                                        Contenido
                                                                    </span>
                                                                    <Sparkles className="w-4 h-4 animate-pulse" />
                                                                </>
                                                            )}
                                                        </div>
                                                    </button>

                                                    <p className="text-gray-500 text-xs mt-4">
                                                        ⚡ Tiempo estimado:
                                                        30-60 minutos
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aspect-video flex items-center justify-center p-6">
                                            <div className="text-center">
                                                <Play className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-4" />
                                                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                                                    Selecciona un servidor
                                                </h3>
                                                <p className="text-gray-400 text-sm sm:text-base">
                                                    Elige un servidor de la
                                                    lista para comenzar
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Panel de servidores */}
                            <div className="order-2 xl:order-1 w-full xl:w-80 xl:flex-shrink-0">
                                <div className="bg-[#00000085] backdrop-blur-[10px] rounded-2xl p-4 sm:p-6 border border-gray-700">
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                                        <Monitor className="w-5 h-5" />
                                        Servidores Disponibles
                                    </h3>

                                    {movieData.servers.length > 0 ? (
                                        <div className="space-y-4">
                                            {[
                                                "Latino",
                                                "Castellano",
                                                "VOSE",
                                            ].map((language) => {
                                                const languageServers =
                                                    movieData.servers.filter(
                                                        (s) =>
                                                            s.language ===
                                                            language
                                                    );

                                                if (
                                                    languageServers.length === 0
                                                )
                                                    return null;

                                                return (
                                                    <div
                                                        key={language}
                                                        className="space-y-3"
                                                    >
                                                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300 border-b border-gray-600 pb-2">
                                                            <Globe className="w-4 h-4" />
                                                            {getLanguageIcon(
                                                                language
                                                            )}{" "}
                                                            {language}
                                                        </div>

                                                        <div className="space-y-2">
                                                            {languageServers.map(
                                                                (
                                                                    serverItem,
                                                                    index
                                                                ) => (
                                                                    <button
                                                                        key={`${serverItem.name}-${index}`}
                                                                        onClick={() =>
                                                                            handleServerSelect(
                                                                                serverItem
                                                                            )
                                                                        }
                                                                        className={`w-full p-3 sm:p-4 rounded-xl text-left transition-all duration-300 border-2 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] ${
                                                                            server?.url ===
                                                                            serverItem.url
                                                                                ? "bg-white text-black border-white shadow-lg"
                                                                                : "bg-[#ffffff15] text-white border-gray-600 hover:border-gray-400"
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="text-lg">
                                                                                    {getServerIcon(
                                                                                        serverItem.name
                                                                                    )}
                                                                                </span>
                                                                                <div>
                                                                                    <div className="font-semibold text-sm sm:text-base">
                                                                                        {
                                                                                            serverItem.name
                                                                                        }
                                                                                    </div>
                                                                                    <div className="text-xs sm:text-sm text-gray-400">
                                                                                        Calidad
                                                                                        HD
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {server?.url ===
                                                                                serverItem.url && (
                                                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                                            )}
                                                                        </div>
                                                                    </button>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        // Panel lateral cuando no hay servidores
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                                <Clock className="w-8 h-8 text-white" />
                                            </div>
                                            <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">
                                                Sin servidores
                                            </h4>
                                            <p className="text-gray-400 text-xs sm:text-sm mb-4">
                                                Solicita el contenido para que
                                                lo agreguemos
                                            </p>
                                            <div className="bg-[#ffffff10] rounded-lg p-3 border border-gray-600">
                                                <p className="text-yellow-400 text-xs font-semibold">
                                                    ⚡ Disponible en 1 hora
                                                    máximo
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Sección de similares */}
                        {/* si similar movies tiene movies mostramos si no null */}
                        {similarMovies && similarMovies.length > 0 && (
                            <div className="mt-10">
                                <section>
                                    <div className="flex items-center gap-6 mb-6">
                                        <h2 className="text-2xl font-extrabold text-white">
                                            Similares
                                        </h2>
                                    </div>

                                    {/* <div className="overflow-x-auto no-scrollbar py-4 pb-10">
                                    <div className="flex gap-4 w-max">
                                        {similarMovies.map((movie, index) => (
                                            <HoverPreview
                                                key={movie.id}
                                                movie={{
                                                    ...movie,
                                                    poster: movie.poster_url,
                                                    year: movie.year,
                                                    rating: movie.rating,
                                                    trailerUrl:
                                                        movie.trailer_url,
                                                    genres: movie.genres,
                                                    description: movie.overview,
                                                }}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                </div> */}
                                    <div className="overflow-x-auto pb-4 no-scrollbar">
                                        <div className="flex gap-4 px-2">
                                            {similarMovies.map((movie) => (
                                                <a
                                                    key={movie.id}
                                                    href={`/ver?contenido=${movie.id}`}
                                                    className="rounded-xl overflow-hidden group relative flex-shrink-0 border border-transparent shadow shadow-transparent transform transition-all duration-300 hover:scale-95 hover:border-gray-700 hover:shadow-gray-700"
                                                >
                                                    <div className="w-48 h-72 rounded-xl overflow-hidden shadow-lg">
                                                        <img
                                                            src={
                                                                movie.poster_url ||
                                                                "/placeholder-poster.jpg"
                                                            }
                                                            alt={movie.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src =
                                                                    "/placeholder-poster.jpg";
                                                            }}
                                                        />
                                                    </div>

                                                    {/* gradiente */}
                                                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-transparent to-black"></div>

                                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                                                        <h3 className="text-white font-semibold text-sm truncate">
                                                            {movie.title}
                                                        </h3>
                                                        <p className="text-gray-300 text-xs mt-1">
                                                            {movie.year} •{" "}
                                                            {movie.rating}/10
                                                        </p>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
