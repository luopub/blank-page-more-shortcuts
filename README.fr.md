# Raccourcis de page vierge Extension Chrome

Une extension de navigateur Chrome riche en fonctionnalités qui affiche des raccourcis vers les sites Web récemment visités sur la page de nouvel onglet, avec support pour les formats et quantités d'affichage personnalisés.

## Fonctionnalités

- 🎯 **Raccourcis intelligents**: Récupère automatiquement les sites Web récemment visités, dédupliqués par domaine
- ⚙️ **Paramètres flexibles**: Support pour personnaliser le nombre d'affichage (10-50) et le format (grille/liste/carte)
- 🔍 **Recherche instantanée**: Zone de recherche intégrée pour filtrer et trouver rapidement les raccourcis
- 📜 **Affichage de l'historique**: Cliquez sur un domaine pour voir toutes les pages visitées sous ce site Web
- 🎨 **Interface élégante**: Design moderne avec mise en page responsive
- 💾 **Paramètres persistants**: Les paramètres sont automatiquement enregistrés et restaurés à la prochaine ouverture
- 🔧 **Double contrôle**: Prend en charge à la fois les paramètres dans la page et le paramètre de la fenêtre contextuelle de l'extension
- 🌐 **Icônes de site Web**: Chargement intelligent de favicon, prend en charge les adresses IP du réseau interne
- 🌍 **Support multilingue**: Prend en charge le chinois, l'anglais, l'allemand, le français, l'espagnol, le japonais et le coréen
- 📊 **Compteur de pages**: Affiche le nombre de pages historiques pour chaque domaine

## Installation

1. Téléchargez ou clonez ce projet sur votre machine locale
2. Ouvrez le navigateur Chrome et accédez à `chrome://extensions/`
3. Activez le "Mode développeur"
4. Cliquez sur "Charger l'extension non empaquetée"
5. Sélectionnez le dossier du projet
6. Installation de l'extension terminée

## Guide d'utilisation

### Utilisation de base
- Après l'installation, ouvrez un nouvel onglet pour voir les raccourcis
- Cliquez sur n'importe quel raccourci pour accéder directement au site Web correspondant

### Paramètres
1. **Paramètres dans la page**: Cliquez sur le bouton ⚙️ dans le coin supérieur droit
2. **Paramètres de la fenêtre contextuelle de l'extension**: Cliquez sur l'icône de l'extension dans la barre d'outils du navigateur

### Fonction de recherche
- Tapez des mots-clés dans la zone de recherche pour filtrer les raccourcis en temps réel
- Prend en charge la recherche à la fois des titres de site Web et des URL
- Appuyez sur Entrée ou commencez simplement à taper pour déclencher la recherche

### Affichage de l'historique
- Cliquez sur un domaine avec plusieurs pages historiques pour ouvrir une fenêtre modale d'historique
- La fenêtre modale affiche toutes les pages visitées sous ce domaine (jusqu'à 30)
- Affiche le titre de la page, le chemin d'URL et l'heure de visite
- Prend en charge la touche Échap ou cliquer à l'extérieur pour fermer la fenêtre modale

### Options configurables
- **Nombre d'affichage**: 10, 20, 30, 40 ou 50 éléments
- **Format d'affichage**:
  - Mise en page en grille: Disposition en grille ordonnée
  - Mise en page en liste: Affichage en liste verticale
  - Mise en page en carte: Grand style de carte
- **Icônes de site Web**: Activer/désactiver l'affichage des favicons

## Structure des fichiers

```
blank-page-more-shortcuts/
├── manifest.json          # Fichier de configuration de l'extension
├── newtab.html           # Nouvelle page HTML d'onglet
├── popup.html            # Fenêtre contextuelle HTML de l'extension
├── styles/
│   ├── newtab.css        # Styles de la nouvelle page d'onglet
│   └── popup.css         # Styles de la fenêtre contextuelle
├── scripts/
│   ├── newtab.js         # Logique de la nouvelle page d'onglet
│   └── popup.js          # Logique de la fenêtre contextuelle
├── icons/                # Icônes de l'extension (à ajouter)
└── README.md             # Documentation
```

## Implémentation technique

### Technologies principales
- **Manifest V3**: Utilise la dernière API d'extension Chrome
- **Chrome Storage API**: Stockage persistant pour les paramètres utilisateur
- **Chrome History API**: Accès à l'historique du navigateur
- **Chrome i18n API**: Support multilingue
- **JavaScript moderne**: Syntaxe ES6+, conception modulaire
- **Fetch API**: Prend en charge le chargement d'icônes pour les IP de réseau interne

### Modules fonctionnels principaux
1. **Gestion des paramètres**: Charger, enregistrer et synchroniser les configurations utilisateur
2. **Traitement de l'historique**: Récupérer, filtrer et dédupliquer les sites Web récemment visités
3. **Gestion de l'historique de domaine**: Enregistrer la liste des pages historiques pour chaque domaine (jusqu'à 30)
4. **Fonction de recherche**: Filtrage et recherche en temps réel des raccourcis
5. **Système de fenêtre modale**: Afficher les pages historiques sous un domaine
6. **Système de chargement d'icônes**: Mécanisme de repli à plusieurs niveaux, prend en charge les IP internes et plusieurs sources d'icônes
7. **Rendu UI**: Générer dynamiquement l'interface de raccourcis en fonction des paramètres
8. **Gestion des événements**: Interaction utilisateur et mises à jour des paramètres

## Autorisations

L'extension nécessite les autorisations suivantes:
- `storage`: Enregistrer les paramètres utilisateur
- `tabs`: Accéder aux informations des onglets
- `history`: Lire l'historique du navigateur

## Développement

### Développement local
1. Après avoir apporté des modifications au code, cliquez sur le bouton d'actualisation sur la page `chrome://extensions/`
2. Ouvrez un nouvel onglet pour voir les modifications

### Personnalisation des styles
- Modifiez `styles/newtab.css` pour ajuster les styles de page
- Modifiez `styles/popup.css` pour ajuster les styles de la fenêtre contextuelle

### Extension des fonctionnalités
- Ajoutez de nouveaux modules JavaScript dans le répertoire `scripts/`
- Modifiez `manifest.json` pour ajouter les autorisations nécessaires

## Notes

1. L'extension ne peut accéder qu'à l'historique des pages Web régulières, pas aux pages internes de Chrome
2. La récupération de l'historique est limitée à un maximum de 10 000 enregistrements
3. Chaque domaine enregistre un maximum de 30 pages historiques
4. Les icônes de site Web sont récupérées à partir de plusieurs services tiers (Yandex, Google, DuckDuckGo)
5. Les icônes pour les IP de réseau interne sont récupérées via fetch et converties en dataURL, ce qui peut affecter la vitesse de chargement
6. Lorsque le chargement des icônes échoue, une icône colorée basée sur la première lettre est affichée comme solution de repli

## Informations sur la version

- **Version**: 1.0.0
- **Compatibilité**: Chrome 88+
- **Langues prises en charge**: Chinois (Simplifié), Anglais, Allemand, Français, Espagnol, Japonais, Coréen
- **Dernière mise à jour**: Janvier 2026

## Licence

Licence MIT
