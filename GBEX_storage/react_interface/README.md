#Instrucions
Add to app list in settings
Add url path('storage/', decorator_include(login_required, 'GBEX_storage.urls')),

ATT DU HAR ÆNDRET SETTINGS static/url!!!

# Todo
Del 0: React modul (prototype done)
Del 1: Modeller (Færdig..eller first try)
model muligheder (tager model 1: location -> box -> vial -> Gbex-ting, f.eks. batch)
   1) vial linker ud med contenttype til gbex-ting
      1) Fordele:
         1Kun en gbex-ting per vial
         2Ingen ændring af gbex modeller nødvendig 
      2) Ulemper:
         1) Opsætning af link er besværligt fra create/update form
            1) Kan evt fungere ved at man altid opsætter via storage appen og bare viser storage info 
   2) gbex-ting linker til vial via many2many til vial (fordi gbex-tingen kan være i flere vials)
      1) Fordele:
         1Virker med create/update form (men kræver vel teknisk set at man går ind i appen alligevel...)
      2) ulemper
         1) SKal kode til at forhindre flere gbex-ting på 1 vial (muligvis ikke super vigtigt da appen ikke tillader det)
         2) skal ændre på gbex-modellerne (tænker umiddelbart det er fint)

Del 2: App load
* Link til at gå ind i appen (link lavet, men ingen visuel link)
  * path('storage', StorageIndex.as_view(), name='StorageIndex') tilføjet GBEX_app/urls.py
* Load af siden skal ske via en funktion i GBEX der genererer tree_view og box_info (lavet)
  * Template for siden er vist nemmest at basere på create-react-app build output.
    * manuelt adapted. Skal manuelt opdateres med js+css ved rebuild
* Ved klik på well, så get info om well content (vial)
  * Overvej at gøre det editable. Altså måske bare load et lille single item table vertikalt eller noget
***** OVERVEJ HVOR MEGET DER SKAL LOADES AF GANGEN
1. load location og boxes -> async load vial names -> async load vial 
2. load location og boxes OG vial names -> async load vial content (pt valgt)
* Ved klik på well der IKKE indeholder noget, så giv mulighed for at linke til noget
  * Der skal være en liste over link-bare modeller
  * Der skal så displayes en autocomplete widget for disse modeller, en per model

Del 2: Widget view
* Ved createview skal appen kunne åbnes og en selected well skal kunne sendes tilbage til create formen
* 

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
