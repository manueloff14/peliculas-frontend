"use client";

import { useState, useEffect } from "react";

export default function AdBlockDetector() {
    const [browserInfo, setBrowserInfo] = useState(null);
    const [showAdBlockWarning, setShowAdBlockWarning] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const detectSystemAndBrowser = () => {
        const userAgent = navigator.userAgent.toLowerCase();

        // Detectar sistema operativo
        let os = "desktop";
        if (/android/i.test(userAgent)) {
            os = "android";
        } else if (/iphone|ipad|ipod/i.test(userAgent)) {
            os = "ios";
        } else if (/windows/i.test(userAgent)) {
            os = "windows";
        } else if (/mac/i.test(userAgent)) {
            os = "mac";
        } else if (/linux/i.test(userAgent)) {
            os = "linux";
        }

        // Detectar navegador
        let browserName = "Desconocido";
        let hasBuiltInAdBlock = false;

        if (
            userAgent.includes("brave") ||
            (userAgent.includes("chrome") && navigator.brave)
        ) {
            browserName = "Brave";
            hasBuiltInAdBlock = true;
        } else if (userAgent.includes("opr/") || userAgent.includes("opera")) {
            browserName = "Opera";
            hasBuiltInAdBlock = true;
        } else if (userAgent.includes("firefox")) {
            browserName = "Firefox";
            // Firefox Focus en móvil tiene bloqueo integrado
            if (
                (os === "android" || os === "ios") &&
                userAgent.includes("focus")
            ) {
                hasBuiltInAdBlock = true;
                browserName = "Firefox Focus";
            }
        } else if (userAgent.includes("edge")) {
            browserName = "Edge";
        } else if (userAgent.includes("chrome")) {
            browserName = "Chrome";
        } else if (userAgent.includes("safari")) {
            browserName = "Safari";
        }

        return {
            name: browserName,
            hasBuiltInAdBlock,
            os: os,
            isMobile: os === "android" || os === "ios",
        };
    };

    useEffect(() => {
        const checkBrowserAndAdBlock = () => {
            const browser = detectSystemAndBrowser();
            setBrowserInfo(browser);

            // Si el navegador tiene AdBlock integrado, no mostrar alerta
            if (browser.hasBuiltInAdBlock) {
                setShowAdBlockWarning(false);
                setIsChecking(false);
                return;
            }

            // Mostrar alerta para navegadores sin AdBlock integrado
            setShowAdBlockWarning(true);
            setIsChecking(false);
        };

        setTimeout(() => {
            checkBrowserAndAdBlock();
        }, 500);
    }, []);

    const handleDownloadBrave = () => {
        let url = "https://brave.com/";

        if (browserInfo?.os === "android") {
            url =
                "https://play.google.com/store/apps/details?id=com.brave.browser";
        } else if (browserInfo?.os === "ios") {
            url =
                "https://apps.apple.com/app/brave-private-web-browser/id1052879175";
        }

        window.open(url, "_blank");
    };

    const handleDownloadAlternative = () => {
        let url = "";

        if (browserInfo?.os === "android") {
            // Firefox Focus para Android
            url =
                "https://play.google.com/store/apps/details?id=org.mozilla.focus";
        } else if (browserInfo?.os === "ios") {
            // Firefox Focus para iOS
            url =
                "https://apps.apple.com/app/firefox-focus-privacy-browser/id1055677337";
        } else {
            // Desktop - Opera como alternativa
            url = "https://www.opera.com/";
        }

        window.open(url, "_blank");
    };

    const handleDownloadExtension = (type) => {
        // Solo para desktop
        if (browserInfo?.isMobile) return;

        const urls = {
            firefox:
                "https://addons.mozilla.org/es/firefox/addon/ublock-origin/",
            chrome: "https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm",
            edge: "https://microsoftedge.microsoft.com/addons/detail/ublock-origin/odfafepnkmbhccpbejgmiehpchacaeak",
            safari: "https://apps.apple.com/us/app/adguard-for-safari/id1440147259",
            general: "https://ublockorigin.com/",
        };
        window.open(urls[type] || urls.general, "_blank");
    };

    const handleClose = () => {
        setShowAdBlockWarning(false);
    };

    const getExtensionUrl = () => {
        switch (browserInfo?.name) {
            case "Firefox":
                return "firefox";
            case "Chrome":
                return "chrome";
            case "Edge":
                return "edge";
            case "Safari":
                return "safari";
            default:
                return "general";
        }
    };

    const getBrowserSpecificMessage = () => {
        const { name, os, isMobile } = browserInfo || {};

        if (isMobile) {
            if (os === "android") {
                return `${name} en Android no permite extensiones. Te recomendamos Brave o Firefox Focus que incluyen bloqueo de anuncios integrado.`;
            } else if (os === "ios") {
                return `${name} en iOS no permite extensiones. Te sugerimos Brave o Firefox Focus para bloquear anuncios automáticamente.`;
            }
        }

        switch (name) {
            case "Firefox":
                return "Firefox no incluye bloqueador de anuncios integrado. Te recomendamos instalar uBlock Origin o cambiar a Brave.";
            case "Chrome":
                return "Chrome no incluye bloqueador de anuncios. Te sugerimos instalar uBlock Origin o cambiar a Brave para una mejor experiencia.";
            case "Edge":
                return "Microsoft Edge no tiene bloqueador de anuncios integrado. Instala uBlock Origin o prueba Brave.";
            case "Safari":
                return "Safari necesita una extensión para bloquear anuncios. Te recomendamos AdGuard o cambiar a Brave.";
            default:
                return "Tu navegador no incluye bloqueador de anuncios integrado. Te recomendamos usar Brave o instalar uBlock Origin.";
        }
    };

    const getAlternativeBrowserName = () => {
        const { os } = browserInfo || {};

        if (os === "android" || os === "ios") {
            return "Firefox Focus";
        }
        return "Opera";
    };

    if (isChecking) {
        return null /* (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-[#1a1a1a] border border-gray-600 rounded-2xl p-8">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-white">
                            Verificando navegador...
                        </span>
                    </div>
                </div>
            </div>
        ); */
    }

    if (!showAdBlockWarning) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay con blur */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

            {/* Modal */}
            <div className="relative z-10 bg-[#1a1a1a] border border-gray-600 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
                {/* Botón cerrar */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-xl"
                >
                    ✕
                </button>

                {/* Título */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        ¡Mejorar Experiencia!
                    </h2>
                    <p className="text-gray-400 text-sm">
                        <span className="text-blue-400 font-semibold">
                            {browserInfo?.name}
                        </span>
                        {browserInfo?.isMobile && (
                            <span className="text-green-400 ml-2">
                                📱{" "}
                                {browserInfo.os === "android"
                                    ? "Android"
                                    : "iOS"}
                            </span>
                        )}
                        {!browserInfo?.isMobile && (
                            <span className="text-purple-400 ml-2">
                                🖥️ Desktop
                            </span>
                        )}
                    </p>
                </div>

                {/* Icono */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl">
                            {browserInfo?.isMobile ? "📱" : "🛡️"}
                        </span>
                    </div>
                </div>

                {/* Texto explicativo específico del navegador */}
                <div className="text-center mb-8">
                    <p className="text-gray-300 text-sm leading-relaxed">
                        {getBrowserSpecificMessage()}
                    </p>
                    <p className="text-gray-400 text-xs mt-4">
                        Un bloqueador de anuncios mejora tu experiencia y
                        protege tu privacidad en nuestro reproductor externo.
                    </p>
                </div>

                {/* Botones de acción */}
                <div className="space-y-3">
                    {/* Botón principal: Brave */}
                    <button
                        onClick={handleDownloadBrave}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105"
                    >
                        <span className="text-xl">🦁</span>
                        <div className="text-left">
                            <div>Descargar Brave (Recomendado)</div>
                            <div className="text-xs opacity-80">
                                AdBlock integrado + Privacidad
                                {browserInfo?.isMobile &&
                                    ` • ${
                                        browserInfo.os === "android"
                                            ? "Play Store"
                                            : "App Store"
                                    }`}
                            </div>
                        </div>
                    </button>

                    {/* Botón secundario: Navegador alternativo o extensión */}
                    <button
                        onClick={
                            browserInfo?.isMobile
                                ? handleDownloadAlternative
                                : () =>
                                      handleDownloadExtension(getExtensionUrl())
                        }
                        className="w-full flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        <span className="text-lg">
                            {browserInfo?.isMobile ? "🌐" : "🧩"}
                        </span>
                        <div className="text-left">
                            <div>
                                {browserInfo?.isMobile ? (
                                    `Descargar ${getAlternativeBrowserName()}`
                                ) : (
                                    <>
                                        {browserInfo?.name === "Firefox" &&
                                            "uBlock Origin para Firefox"}
                                        {browserInfo?.name === "Chrome" &&
                                            "uBlock Origin para Chrome"}
                                        {browserInfo?.name === "Edge" &&
                                            "uBlock Origin para Edge"}
                                        {browserInfo?.name === "Safari" &&
                                            "AdGuard para Safari"}
                                        {![
                                            "Firefox",
                                            "Chrome",
                                            "Edge",
                                            "Safari",
                                        ].includes(browserInfo?.name) &&
                                            "Extensión AdBlock"}
                                    </>
                                )}
                            </div>
                            <div className="text-xs opacity-80">
                                {browserInfo?.isMobile
                                    ? "Alternativa con AdBlock"
                                    : "Mantener navegador actual"}
                            </div>
                        </div>
                    </button>
                </div>

                {/* Texto adicional */}
                <div className="text-center mt-6">
                    <p className="text-gray-400 text-xs">
                        {browserInfo?.isMobile
                            ? "Reinicia la aplicación después de instalar"
                            : "Recarga la página después de instalar"}
                    </p>
                </div>
            </div>
        </div>
    );
}
