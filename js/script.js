// Variables de données fictives pour les augmentations de températures par région
const temperatureData = {
    // ... (données pour chaque région)
};

document.addEventListener("DOMContentLoaded", function() {
    // Gestion des animations au scroll
    const presentation = document.querySelector('.presentation');
    const co2Text = document.querySelector('.co2-text');
    const glaciersText = document.querySelector('.glaciers-text');
    let hasScrolled = false;

    function checkVisibility() {
        const rectPresentation = presentation.getBoundingClientRect();
        const rectCo2Text = co2Text.getBoundingClientRect();
        const rectGlaciers = glaciersText.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);

        if (rectPresentation.top <= windowHeight && rectPresentation.bottom >= 0 && hasScrolled) {
            presentation.classList.add('visible');
        }

        if (rectCo2Text.top <= windowHeight && rectCo2Text.bottom >= 0 && hasScrolled) {
            co2Text.classList.add('visible');
        }

        if (rectGlaciers.top <= windowHeight && rectGlaciers.bottom >= 0 && hasScrolled) {
            glaciersText.classList.add('visible');
        }
    }

    window.addEventListener('scroll', function() {
        if (!hasScrolled) {
            hasScrolled = true;
        }
        checkVisibility();
    });

    checkVisibility();

    // Fonction pour déterminer la couleur en fonction de l'augmentation des températures
    function getColor(tempIncrease) {
        if (tempIncrease > 2.5) return '#d73027'; // Rouge
        if (tempIncrease > 1.5) return '#fc8d59'; // Orange
        return '#fee08b'; // Jaune
    }

    // Configuration de la carte D3.js
    const width = 800;
    const height = 600;

    const projection = d3.geoMercator()
        .center([2.454071, 46.379465])
        .scale(2000)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const svg = d3.select("#france-map").append("svg")
        .attr("width", width)
        .attr("height", height);

    const tooltip = d3.select("#tooltip");

    // Chargement et création de la carte
    d3.json("https://france-geojson.gregoiredavid.fr/repo/departements.geojson").then(function(geojson) {
        const regions = svg.selectAll("path")
            .data(geojson.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#69b3a2")
            .attr("stroke", "#333")
            .attr("stroke-width", 1)
            .on("mouseover", function(event, d) {
                d3.select(this).attr("stroke-width", 2).attr("stroke", "#000");

                const code = d.properties.code;
                const tempIncrease = temperatureData[code] || "Données non disponibles";
                tooltip
                    .style("visibility", "visible")
                    .html(`<strong>Région :</strong> ${d.properties.nom}<br>
                        <strong>Augmentation de température :</strong> ${tempIncrease} °C`);

                tooltip
                    .style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mousemove", function(event) {
                tooltip
                    .style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).attr("stroke-width", 1).attr("stroke", "#333");
                tooltip.style("visibility", "hidden");
            })
            .on("click", function(event, d) {
                const code = d.properties.code;
                const tempIncrease = temperatureData[code] || 0;
                const color = getColor(tempIncrease);
                d3.select(this).attr("fill", color);
            });

        // Gestion du bouton pour afficher/masquer les couleurs
        const toggleColorsButton = document.getElementById("toggle-colors-btn");
        let colorsShown = false;

        toggleColorsButton.addEventListener("click", function() {
            if (!colorsShown) {
                regions.each(function(d) {
                    const code = d.properties.code;
                    const tempIncrease = temperatureData[code] || 0;
                    const color = getColor(tempIncrease);
                    d3.select(this).attr("fill", color);
                });
                toggleColorsButton.textContent = "Masquer les couleurs des régions";
                colorsShown = true;
            } else {
                regions.each(function() {
                    d3.select(this).attr("fill", "#69b3a2");
                });
                toggleColorsButton.textContent = "Afficher les couleurs de chaque région";
                colorsShown = false;
            }
        });
    });

    // Création du graphique d'évolution de la température
    const tempCtx = document.getElementById('tempChart').getContext('2d');
    const tempChart = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: ['2000', '2005', '2010', '2015', '2020'],
            datasets: [{
                label: 'Augmentation de la température (°C)',
                data: [0, 0.5, 1.0, 1.5, 2.0],
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Évolution de la température (2000-2020)'
                },
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Température (°C)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Année'
                    }
                }
            }
        }
    });

    // Graphique pour la fonte des glaciers
    const glaciersCtx = document.getElementById('glaciersChart').getContext('2d');
    const glaciersChart = new Chart(glaciersCtx, {
        type: 'bar',
        data: {
            labels: ['2010', '2015', '2020'],
            datasets: [{
                label: 'Fonte des glaciers (%)',
                data: [20, 30, 40],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Fonte des glaciers (2010-2020)'
                },
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Pourcentage (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Année'
                    }
                }
            }
        }
    });

    // Graphique pour la montée du niveau des océans
    const seaLevelCtx = document.getElementById('seaLevelChart').getContext('2d');
    const seaLevelChart = new Chart(seaLevelCtx, {
        type: 'line',
        data: {
            labels: ['2000', '2005', '2010', '2015', '2020'],
            datasets: [{
                label: 'Montée du niveau des océans (cm)',
                data: [0, 3, 6, 9, 12],
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Montée du niveau des océans (2000-2020)'
                },
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Niveau (cm)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Année'
                    }
                }
            }
        }
    });

    // Graphique pour l'impact en France
    const impactCtx = document.getElementById('impactChart').getContext('2d');
    const impactChart = new Chart(impactCtx, {
        type: 'pie',
        data: {
            labels: ['Impacts Directs', 'Conséquences', 'Adaptation'],
            datasets: [{
                label: 'Impact du changement climatique en France',
                data: [30, 40, 30],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Impact du changement climatique en France'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
});
