"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HoverPreview from "@/components/HoverPreview";

export default function Peliculas() {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeWindow, setTimeWindow] = useState("day");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/page?type=inicio&time_window=${timeWindow}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                        },
                    }
                );
                if (!response.ok) throw new Error("Error al cargar los datos");
                const data = await response.json();
                setPageData(data.sections);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [timeWindow]);

    // ... (mantenemos los estados de loading y error igual)

    return (
        <main>
            <Header />

            {/* Hero Section */}
            <section className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]">
                {/* Hero Content */}
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 lg:bottom-10 lg:left-14 z-10 w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-[450px] lg:w-[500px] flex flex-col gap-2 sm:gap-3 md:gap-4 items-start">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight">
                        Interstellar
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed max-w-full md:max-w-[400px]">
                        {"Un grupo de exploradores hacen uso de un agujero de gusano recientemente descubierto para superar las limitaciones de los viajes espaciales tripulados y vencer las inmensas distancias que tiene un viaje interestelar.".slice(
                            0,
                            150
                        )}
                    </p>
                    <button
                        onClick={() =>
                            window.open(`/ver?contenido=${157336}`, "_blank")
                        }
                        className="cursor-pointer text-xs sm:text-sm md:text-base bg-white text-black py-2 px-4 sm:py-3 sm:px-6 rounded-full font-extrabold hover:bg-gray-200 transition-colors duration-200 mt-1 sm:mt-2"
                    >
                        ¡Ver ahora!
                    </button>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute bottom-0 left-0 w-full h-[120px] sm:h-[150px] md:h-[180px] lg:h-[200px] bg-gradient-to-t from-[#171717] via-[#171717]/80 to-transparent" />

                {/* Side Gradient for mobile */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#171717] via-transparent to-transparent md:hidden" />

                {/* Hero Image */}
                <img
                    src="https://image.tmdb.org/t/p/original/qtVS7HCnlfsCzV4GXxzkiwI0rMO.jpg"
                    className="w-full h-full object-cover object-center"
                    alt="Spider-Man: un nuevo universo"
                />
            </section>

            {/* Loading Spinner */}
            {loading && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                </div>
            )}

            {/* Main Content */}
            <div className="px-4 sm:px-8 lg:px-14 py-6">
                {!loading && (
                    <>
                        {/* Trending Section */}
                        {pageData?.[`trending_${timeWindow}_movies`] && (
                            <section>
                                <div className="flex items-center gap-6 mb-6">
                                    <h2 className="text-2xl font-extrabold text-white">
                                        Tendencias
                                    </h2>
                                    <div className="flex bg-[#000000af] backdrop-blur-[10px] rounded-full border border-gray-900 [&>button]:font-bold ">
                                        <button
                                            onClick={() => setTimeWindow("day")}
                                            className={`px-4 py-1 rounded-full ${
                                                timeWindow === "day"
                                                    ? "bg-white text-black"
                                                    : "bg-transparent text-white"
                                            }`}
                                        >
                                            Hoy
                                        </button>
                                        <button
                                            onClick={() =>
                                                setTimeWindow("week")
                                            }
                                            className={`px-4 py-1 rounded-full ${
                                                timeWindow === "week"
                                                    ? "bg-white text-black"
                                                    : "bg-transparent text-white"
                                            }`}
                                        >
                                            Esta semana
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto no-scrollbar py-4 pb-10">
                                    <div className="flex gap-4 w-max">
                                        {pageData[
                                            `trending_${timeWindow}_movies`
                                        ].results.map((movie) => (
                                            <HoverPreview
                                                key={movie.id}
                                                movie={{
                                                    id: movie.id.toString(),
                                                    title: movie.title,
                                                    poster: movie.poster_url,
                                                    year: movie.year,
                                                    genres: movie.genres,
                                                    rating: movie.rating,
                                                    description:
                                                        movie.description,
                                                    trailerUrl:
                                                        movie.trailer_url,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Popular Movies */}
                        {pageData?.upcoming_movies && (
                            <section className="mt-12">
                                <div className="flex items-center gap-6 mb-6">
                                    <h2 className="text-2xl font-extrabold text-white">
                                        Próximamente
                                    </h2>
                                </div>

                                <div className="overflow-x-auto no-scrollbar py-4 pb-10">
                                    <div className="flex gap-4 w-max">
                                        {pageData.upcoming_movies.results.map(
                                            (movie) => (
                                                <HoverPreview
                                                    key={movie.id}
                                                    movie={{
                                                        id: movie.id.toString(),
                                                        title: movie.title,
                                                        poster: movie.poster_url,
                                                        year: movie.year,
                                                        genres: movie.genres,
                                                        rating: movie.rating,
                                                        description:
                                                            movie.description,
                                                        trailerUrl:
                                                            movie.trailer_url,
                                                    }}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Popular Movies */}
                        {pageData?.now_playing_movies && (
                            <section className="mt-12">
                                <div className="flex items-center gap-6 mb-6 s">
                                    <h2 className="text-2xl font-extrabold text-white">
                                        En cines
                                    </h2>
                                </div>

                                <div className="overflow-x-auto no-scrollbar py-4 pb-10">
                                    <div className="flex gap-4 w-max">
                                        {pageData.now_playing_movies.results.map(
                                            (movie) => (
                                                <HoverPreview
                                                    key={movie.id}
                                                    movie={{
                                                        id: movie.id.toString(),
                                                        title: movie.title,
                                                        poster: movie.poster_url,
                                                        year: movie.year,
                                                        genres: movie.genres,
                                                        rating: movie.rating,
                                                        description:
                                                            movie.description,
                                                        trailerUrl:
                                                            movie.trailer_url,
                                                    }}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Popular TV */}
                        {pageData?.top_rated_movies && (
                            <section className="mt-12">
                                <div className="flex items-center gap-6 mb-6">
                                    <h2 className="text-2xl font-extrabold text-white">
                                        Mejor valoradas
                                    </h2>
                                </div>

                                <div className="overflow-x-auto no-scrollbar py-4 pb-10">
                                    <div className="flex gap-4 w-max">
                                        {pageData.top_rated_movies.results.map(
                                            (movie) => (
                                                <HoverPreview
                                                    key={movie.id}
                                                    movie={{
                                                        id: movie.id.toString(),
                                                        title: movie.title,
                                                        poster: movie.poster_url,
                                                        year: movie.year,
                                                        genres: movie.genres,
                                                        rating: movie.rating,
                                                        description:
                                                            movie.description,
                                                        trailerUrl:
                                                            movie.trailer_url,
                                                    }}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>

            <footer className="text-center mb-10">
                <span className="text-[#949494] text-center font-bold text-sm">
                    Este sitio web fue creado con el proposito de descentralizar
                    la informacion de películas y series de televisión.
                </span>
            </footer>
        </main>
    );
}
