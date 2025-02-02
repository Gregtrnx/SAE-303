const donneesMeteo = {
    '2024': { temperature: 14.25, precipitations: 16, nuages: 51.33 },
    '2023': { temperature: 14.08, precipitations: 12, nuages: 45.75 },
    '2022': { temperature: 13.33, precipitations: 8, nuages: 49.67 },
    '2021': { temperature: 13.83, precipitations: 29, nuages: 51.58 },
    '2020': { temperature: 13.75, precipitations: 35, nuages: 48.67 },
    '2019': { temperature: 13.50, precipitations: 44, nuages: 45.33 },
    '2018': { temperature: 13.41, precipitations: 55, nuages: 48.25 },
    '2017': { temperature: 13.16, precipitations: 25, nuages: 51.33 },
    '2016': { temperature: 13.66, precipitations: 55, nuages: 47.33 },
    '2015': { temperature: 13.83, precipitations: 41, nuages: 47.17 },
    '2014': { temperature: 13.75, precipitations: 55, nuages: 48.67 }
};

function mettreAJourStatistiques(annee) {
    const donnees = donneesMeteo[annee];
    document.querySelector('.carte-statistique:nth-child(1) .valeur').textContent = `${donnees.temperature}°C`;
    document.querySelector('.carte-statistique:nth-child(2) .valeur').textContent = `${donnees.precipitations}mm`;
    document.querySelector('.carte-statistique:nth-child(3) .valeur').textContent = `${donnees.nuages}%`;
}

function animerMiseAJourDonnees() {
    gsap.from('.carte-statistique .valeur', {
        scale: 0.5,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)'
    });

    gsap.from('#ligne-precipitations', {
        strokeDashoffset: 1000,
        duration: 1,
        ease: 'power3.out'
    });
}

function mettreAJourTousGraphiques(anneeSelectionnee) {
    mettreAJourGraphiquePrecipitations(anneeSelectionnee);
    mettreAJourCarteNuages(anneeSelectionnee);
    mettreAJourStatistiques(anneeSelectionnee);
    mettreAJourThermometre(anneeSelectionnee);
    animerMiseAJourDonnees();
}

function mettreAJourGraphiquePrecipitations(anneeSelectionnee) {
    const svg = document.getElementById('graphique-temperature');
    const largeur = 800;
    const hauteur = 400;
    const marge = 60;
    const largeurGraphique = largeur - (marge * 2);
    const hauteurGraphique = hauteur - (marge * 2);

    const elementsASupprimer = svg.querySelectorAll('.axe, .ligne-grille, .point-annee');
    elementsASupprimer.forEach(el => el.remove());

    for (let i = 0; i <= 6; i++) {
        const y = hauteur - (marge + (i * hauteurGraphique / 6));
        const ligneGrille = document.createElementNS("http://www.w3.org/2000/svg", "line");
        ligneGrille.setAttribute('x1', marge);
        ligneGrille.setAttribute('x2', largeur - marge);
        ligneGrille.setAttribute('y1', y);
        ligneGrille.setAttribute('y2', y);
        ligneGrille.setAttribute('class', 'ligne-grille');
        svg.insertBefore(ligneGrille, svg.firstChild);
    }

    for (let i = 0; i <= 5; i++) {
        const valeur = i * 20;
        const y = hauteur - (marge + (i * hauteurGraphique / 5));
        const texte = document.createElementNS("http://www.w3.org/2000/svg", "text");
        texte.setAttribute('x', marge - 10);
        texte.setAttribute('y', y);
        texte.setAttribute('text-anchor', 'end');
        texte.setAttribute('alignment-baseline', 'middle');
        texte.setAttribute('class', 'axe');
        texte.textContent = `${valeur}mm`;
        svg.appendChild(texte);
    }

    const annees = Object.keys(donneesMeteo).reverse();
    annees.forEach((annee, index) => {
        const x = marge + (index * (largeurGraphique / (annees.length - 1)));
        const texte = document.createElementNS("http://www.w3.org/2000/svg", "text");
        texte.setAttribute('x', x);
        texte.setAttribute('y', hauteur - marge + 20);
        texte.setAttribute('text-anchor', 'middle');
        texte.setAttribute('class', 'axe');
        texte.textContent = annee;
        svg.appendChild(texte);
    });

    const points = annees.map((annee, index) => {
        const x = marge + (index * (largeurGraphique / (annees.length - 1)));
        const y = hauteur - (marge + (donneesMeteo[annee].precipitations * hauteurGraphique / 100));
        return `${x},${y}`;
    });

    const lignePrecipitations = svg.querySelector('#ligne-precipitations');
    lignePrecipitations.setAttribute('d', `M ${points.join(' L ')}`);

    const indexSelectionne = annees.indexOf(anneeSelectionnee);
    const xSelectionne = marge + (indexSelectionne * (largeurGraphique / (annees.length - 1)));
    const ySelectionne = hauteur - (marge + (donneesMeteo[anneeSelectionnee].precipitations * hauteurGraphique / 100));

    const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    point.setAttribute('cx', xSelectionne);
    point.setAttribute('cy', ySelectionne);
    point.setAttribute('r', '6');
    point.setAttribute('fill', '#3B82F6');
    point.setAttribute('class', 'point-annee');
    svg.appendChild(point);
}

function mettreAJourThermometre(anneeSelectionnee) {
    const temperature = donneesMeteo[anneeSelectionnee].temperature;
    const tempMax = 35;
    const svg = document.getElementById('thermometre');

    const hauteurRemplissage = (temperature / tempMax) * 290;
    const elementRemplissage = svg.querySelector('#remplissage-temperature');

    elementRemplissage.setAttribute('height', hauteurRemplissage);
    elementRemplissage.setAttribute('y', 345 - hauteurRemplissage);

    const valeurTemperature = document.getElementById('valeur-temperature');
    valeurTemperature.textContent = `${temperature}°C`;

    if (!svg.querySelector('.marque-temperature')) {
        const groupeEchelle = svg.querySelector('#echelle-temperature');

        for (let i = 0; i <= 7; i++) {
            const temp = i * 5;
            const y = 345 - (temp / tempMax * 290);

            const ligne = document.createElementNS("http://www.w3.org/2000/svg", "line");
            ligne.setAttribute('x1', '65');
            ligne.setAttribute('x2', '75');
            ligne.setAttribute('y1', y);
            ligne.setAttribute('y2', y);
            ligne.setAttribute('class', 'marque-temperature');
            groupeEchelle.appendChild(ligne);

            const texte = document.createElementNS("http://www.w3.org/2000/svg", "text");
            texte.setAttribute('x', '80');
            texte.setAttribute('y', y);
            texte.setAttribute('alignment-baseline', 'middle');
            texte.setAttribute('class', 'marque-temperature');
            texte.setAttribute('fill', '#FFFFFF');
            texte.textContent = `${temp}°`;
            groupeEchelle.appendChild(texte);
        }
    }
}

function mettreAJourCarteNuages(annee) {
    const pourcentageNuages = donneesMeteo[annee].nuages;
    const texteNuages = document.querySelector('#pourcentage-nuages');

    texteNuages.textContent = `${pourcentageNuages}%`;
}

document.addEventListener('DOMContentLoaded', () => {
    const boutonsAnnees = document.querySelectorAll('.entete .selecteur-annees .bouton-annee');

    boutonsAnnees.forEach(bouton => {
        bouton.addEventListener('click', function () {
            boutonsAnnees.forEach(btn => btn.classList.remove('actif'));
            this.classList.add('actif');
            mettreAJourTousGraphiques(this.textContent);
        });
    });

    const boutonRetourHaut = document.getElementById('retour-haut');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            boutonRetourHaut.classList.add('visible');
        } else {
            boutonRetourHaut.classList.remove('visible');
        }
    });

    boutonRetourHaut.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const boutonsMois = document.querySelectorAll('.bouton-mois');
    boutonsMois.forEach(bouton => {
        bouton.addEventListener('click', function () {
            boutonsMois.forEach(btn => btn.classList.remove('actif'));
            this.classList.add('actif');
            const anneeActuelle = document.querySelector('.entete .bouton-annee.actif').textContent;
            mettreAJourThermometre(anneeActuelle);
        });
    });

    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.entete h1', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.entete .sous-titre, .entete .periode', {
        y: -30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        stagger: 0.2,
        ease: 'power3.out'
    });

    gsap.from('.carte-statistique', {
        scrollTrigger: {
            trigger: '.cartes-statistiques',
            start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });

    gsap.from('.conteneur-graphique', {
        scrollTrigger: {
            trigger: '.section-graphique',
            start: 'top 70%',
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.barre-navigation', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.utils.toArray('h2').forEach(titre => {
        gsap.from(titre, {
            scrollTrigger: {
                trigger: titre,
                start: 'top 80%',
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    mettreAJourTousGraphiques('2024');
}); 