(function($, $document) {
    "use strict";
    console.log("entrou primeiro")
    document.addEventListener("DOMContentLoaded", function () {
        setTimeout(() => {
            console.log("entrou segundo")
            const bannerElement = document.querySelector("aside");
            if (!bannerElement) return;
    
            const segmentoId = bannerElement.id;
            const apiUrl = `http://localhost:4502/graphql/execute.json/banco-bradesco/banners-get-banner-by-segmento;segmento=${segmentoId}`;
    
            const scriptAxios = document.createElement("script");
            scriptAxios.src = "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
            scriptAxios.onload = function() {
                axios.get(apiUrl)
                    .then(response => {
                        console.log(response)
                        const data = response.data;
                        if (!data || !data.data || !data.data.bannersModelList) return;
                        const slides = data.data.bannersModelList.items.map(banner => ({
                            desktop: banner.imgTypeDesk === "webp" ? banner.imageDeskWebp._path : banner.imageDeskJpg._path,
                            mobile: banner.imgTypeMob === "webp" ? banner.imageMobWebp._path : banner.imageMobJpg._path,
                            alt: banner.alt || "Imagem do banner",
                            link: banner.link || "",
                            priority: banner.priority
                        }));
                        slides.sort(function(a, b) { 
                            return a.priority - b.priority;
                        });
                        criarCarrossel(slides);
                    })
                    .catch(error => console.error("Erro ao buscar os banners:", error));
            };
            document.head.appendChild(scriptAxios);
    
            function criarCarrossel(slides) {

                const targetElement = document.getElementById("meuCarrossel");
                if (!targetElement) console.log("achou o id meucarrossel");
    
                const swiperContainer = document.createElement("div");
                swiperContainer.classList.add("swiper-container");
    
                const swiperWrapper = document.createElement("div");
                swiperWrapper.classList.add("swiper-wrapper");
    
                slides.forEach(slideData => {
                    const slide = document.createElement("div");
                    slide.classList.add("swiper-slide");
                    
                    const anchor = slideData.link ? document.createElement("a") : document.createElement("div");
                    if (slideData.link) {
                        anchor.href = slideData.link;
                        anchor.target = "_blank";
                    }
                    
                    const picture = document.createElement("picture");
                    
                    const sourceDesktop = document.createElement("source");
                    sourceDesktop.srcset = slideData.desktop;
                    sourceDesktop.media = "(min-width: 570px)";
                    
                    const sourceMobile = document.createElement("source");
                    sourceMobile.srcset = slideData.mobile;
                    sourceMobile.media = "(max-width: 569px)";
                    
                    const img = document.createElement("img");
                    img.src = slideData.desktop;
                    img.alt = slideData.alt;
                    img.style.width = "100vw";
                    img.style.height = "auto";
                    
                    picture.appendChild(sourceDesktop);
                    picture.appendChild(sourceMobile);
                    picture.appendChild(img);
                    
                    anchor.appendChild(picture);
                    slide.appendChild(anchor);
                    swiperWrapper.appendChild(slide);
                });
    
                swiperContainer.appendChild(swiperWrapper);
                const paginationContainer = document.createElement("div");
                paginationContainer.classList.add("swiper-pagination");
                swiperContainer.appendChild(paginationContainer);
                targetElement.appendChild(swiperContainer);
    
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = "https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css";
                document.head.appendChild(link);
    
                const style = document.createElement("style");
                style.innerHTML = `
                    .swiper-container {
                        overflow: hidden;
                        width: 100vw;
                        position: relative;
                    }
                    .swiper-wrapper {
                        display: flex;
                    }
                    .swiper-slide {
                        flex: 1 0 100vw;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .swiper-pagination {
                        position: absolute;
                        bottom: 70px !important;
                        right: 50px;
                        width: auto !important;
                        left: auto !important;
                    }
                    .swiper-pagination-bullet {
                        width: 10px;
                        height: 10px;
                        background: gray;
                        opacity: 0.7;
                        transition: opacity 0.3s ease;
                    }
                    .swiper-pagination-bullet-active {
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        background: transparent;
                        position: relative;
                        opacity: 1;
                        overflow: hidden;
                        box-shadow: inset 0 0 0 4px gray;
                    }
                    .swiper-pagination-bullet-active::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        box-shadow: inset 0 0 0 4px red;
                        clip-path: inset(0 0 0 100%);
                        animation: fillBorder 9s linear forwards;
                    }
                    @keyframes fillBorder {
                        from {
                            clip-path: inset(0 0 0 100%);
                        }
                        to {
                            clip-path: inset(0 0 0 0);
                        }
                    }
                `;
                document.head.appendChild(style);
    
                const script = document.createElement("script");
                script.src = "https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.js";
                script.onload = function() {
                    new Swiper(".swiper-container", {
                        loop: true,
                        autoplay: {
                            delay: 9000,
                            disableOnInteraction: false,
                        },
                        pagination: {
                            el: ".swiper-pagination",
                            clickable: true,
                            renderBullet: function (index, className) {
                                return `<span class="${className}"></span>`;
                            }
                        },
                    });
                };
                document.body.appendChild(script);
            }
            
        }, 1000);
    });
})($, $(document));
