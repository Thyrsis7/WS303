document.addEventListener("DOMContentLoaded", function() {
    const presentation = document.querySelector('.presentation');
    const co2Text = document.querySelector('.co2-text'); // Sélectionne la section CO2
    let hasScrolled = false; // Drapeau pour vérifier si l'utilisateur a défilé

    function checkVisibility() {
        const rectPresentation = presentation.getBoundingClientRect();
        const rectCo2Text = co2Text.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);

        // Vérifie si la section présentation est visible dans la fenêtre
        if (rectPresentation.top <= windowHeight && rectPresentation.bottom >= 0 && hasScrolled) {
            presentation.classList.add('visible'); // Ajoute la classe pour démarrer l'animation
        }

        // Vérifie si la section CO2 est visible dans la fenêtre
        if (rectCo2Text.top <= windowHeight && rectCo2Text.bottom >= 0 && hasScrolled) {
            co2Text.classList.add('visible'); // Ajoute la classe pour démarrer l'animation
        }
    }

    // Écouteur d'événement pour le défilement
    window.addEventListener('scroll', function() {
        if (!hasScrolled) {
            hasScrolled = true; // Marque que l'utilisateur a commencé à défiler
        }
        checkVisibility(); // Vérifie la visibilité
    });

    // Vérifie la visibilité lors du chargement initial
    checkVisibility(); 
});
// Variables de données fictives pour les augmentations de températures par région
const temperatureData = {
    "01": 1.8, "02": 1.6, "03": 1.4, "04": 2.7, "05": 2.5, // Ain, Aisne, Allier, Alpes-de-Haute-Provence, Hautes-Alpes
    "06": 2.9, "07": 1.9, "08": 1.5, "09": 2.3, "10": 1.7, // Alpes-Maritimes, Ardèche, Ardennes, Ariège, Aube
    "11": 2.0, "12": 2.1, "13": 2.8, "14": 1.5, "15": 1.6, // Aude, Aveyron, Bouches-du-Rhône, Calvados, Cantal
    "16": 1.7, "17": 1.8, "18": 1.4, "19": 1.9, "21": 1.5, // Charente, Charente-Maritime, Cher, Corrèze, Côte-d'Or
    "22": 1.4, "23": 1.6, "24": 1.7, "25": 1.8, "26": 2.0, // Côtes-d'Armor, Creuse, Dordogne, Doubs, Drôme
    "27": 1.5, "28": 1.6, "29": 1.3, "2A": 2.3, "2B": 2.3, // Eure, Eure-et-Loir, Finistère, Corse-du-Sud, Haute-Corse
    "30": 2.6, "31": 2.2, "32": 1.8, "33": 1.9, "34": 2.5, // Gard, Haute-Garonne, Gers, Gironde, Hérault
    "35": 1.4, "36": 1.5, "37": 1.6, "38": 2.4, "39": 1.7, // Ille-et-Vilaine, Indre, Indre-et-Loire, Isère, Jura
    "40": 1.9, "41": 1.5, "42": 1.8, "43": 1.7, "44": 1.6, // Landes, Loir-et-Cher, Loire, Haute-Loire, Loire-Atlantique
    "45": 1.5, "46": 1.9, "47": 1.8, "48": 1.9, "49": 1.7, // Loiret, Lot, Lot-et-Garonne, Lozère, Maine-et-Loire
    "50": 1.3, "51": 1.5, "52": 1.6, "53": 1.4, "54": 1.6, // Manche, Marne, Haute-Marne, Mayenne, Meurthe-et-Moselle
    "55": 1.5, "56": 1.4, "57": 1.7, "58": 1.5, "59": 1.4, // Meuse, Morbihan, Moselle, Nièvre, Nord
    "60": 1.5, "61": 1.6, "62": 1.4, "63": 1.8, "64": 1.9, // Oise, Orne, Pas-de-Calais, Puy-de-Dôme, Pyrénées-Atlantiques
    "65": 2.1, "66": 2.6, "67": 1.7, "68": 1.8, "69": 2.3, // Hautes-Pyrénées, Pyrénées-Orientales, Bas-Rhin, Haut-Rhin, Rhône
    "70": 1.6, "71": 1.5, "72": 1.5, "73": 2.4, "74": 2.5, // Haute-Saône, Saône-et-Loire, Sarthe, Savoie, Haute-Savoie
    "75": 2.1, "76": 1.4, "77": 1.5, "78": 1.6, "79": 1.5, // Paris, Seine-Maritime, Seine-et-Marne, Yvelines, Deux-Sèvres
    "80": 1.4, "81": 1.8, "82": 1.9, "83": 2.8, "84": 2.7, // Somme, Tarn, Tarn-et-Garonne, Var, Vaucluse
    "85": 1.6, "86": 1.7, "87": 1.8, "88": 1.6, "89": 1.5, // Vendée, Vienne, Haute-Vienne, Vosges, Yonne
    "90": 1.7, "91": 1.6, "92": 1.7, "93": 1.6, "94": 1.8, "95": 1.5 // Territoire de Belfort, Essonne, Hauts-de-Seine, Seine-Saint-Denis, Val-de-Marne, Val-d'Oise
};

// Fonction pour déterminer la couleur en fonction de l'augmentation des températures
function getColor(tempIncrease) {
    if (tempIncrease > 2.5) return '#d73027'; // Rouge foncé : augmentation élevée
    if (tempIncrease > 1.5) return '#fc8d59'; // Orange : augmentation modérée
    return '#fee08b'; // Jaune : faible augmentation
}

// Création de la carte de France avec D3.js
const width = 800;
const height = 600;

const projection = d3.geoMercator()
    .center([2.454071, 46.379465]) // Centre de la France
    .scale(2000) // Zoom sur la France
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

const svg = d3.select("#france-map").append("svg")
    .attr("width", width)
    .attr("height", height);

// Tooltip pour afficher des informations sur les régions
const tooltip = d3.select("#tooltip");

// Charger les données GeoJSON des départements français
d3.json("https://france-geojson.gregoiredavid.fr/repo/departements.geojson").then(function(geojson) {
    const regions = svg.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#69b3a2") // Couleur par défaut
        .attr("stroke", "#333")
        .attr("stroke-width", 1)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke-width", 2).attr("stroke", "#000"); // Accentuer la bordure au survol

            // Afficher le tooltip avec les informations de la région
            const code = d.properties.code;
            const tempIncrease = temperatureData[code] || "Données non disponibles";
            tooltip
                .style("visibility", "visible")
                .html(`<strong>Région :</strong> ${d.properties.nom}<br>
                    <strong>Augmentation de température :</strong> ${tempIncrease} °C`);

            // Positionner le tooltip
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
            d3.select(this).attr("stroke-width", 1).attr("stroke", "#333"); // Réinitialiser la bordure
            tooltip.style("visibility", "hidden");
        })
        .on("click", function(event, d) {
            // Changer la couleur de la région en fonction de l'augmentation de température
            const code = d.properties.code;
            const tempIncrease = temperatureData[code] || 0;
            const color = getColor(tempIncrease);
            d3.select(this).attr("fill", color);
        });

    // Bouton pour afficher/masquer les couleurs des régions
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