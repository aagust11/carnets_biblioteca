# Generador de Targetes QR i PDF A4

Aplicació web creada amb React, TypeScript i Tailwind CSS per maquetar targetes plegables amb codis QR incrementals llestes per imprimir en DIN-A4.

## Com publicar a GitHub Pages

Aquest projecte està 100% configurat per funcionar directament a GitHub Pages:

1. **Pujar el codi a GitHub**:
   Pugeu aquest repositori a la branca principal (`main` o `master`).

2. **Activar GitHub Pages**:
   - Aneu al vostre repositori a GitHub.
   - Feu clic a la pestanya **Settings** (Configuració).
   - Al menú lateral esquerre, seleccioneu **Pages**.
   - A l'apartat **Build and deployment** > **Source**, seleccioneu **GitHub Actions**.

3. **Llest!**:
   L'acció automàtica inclosa a `.github/workflows/deploy.yml` compilarà el projecte i publicarà la vostra web en pocs segons a `https://<el-vostre-usuari>.github.io/<nom-del-repositori>/`.

## Característiques

- **Format plegable tocant de costat (0 mm)**: Davant i Darrere junts amb línia de plegat central discontínua per imprimir i doblegar fàcilment.
- **Codi QR 100% transparent**: Sense requadre blanc, integrat directament sobre el fons de la vostra imatge.
- **Memòria automàtica**: Recorda les plantilles i el darrer número utilitzat per continuar les tirades automàticament.
- **Execució 100% client**: Tota la generació de PDF i QR es fa al navegador sense dependre de cap servidor extern.
