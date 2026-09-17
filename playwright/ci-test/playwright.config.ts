import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: "./tests",
    
    /* Timeout global de 30 secondes par test */
    timeout: 30 * 1000,
    
    /* Timeout de 15 secondes pour les assertions (expect) */
    expect: {
        timeout: 15 * 1000,
    },
    
    /* Exécuter les tests en parallèle */
    fullyParallel: true,
    
    /* Échouer en CI si test.only est laissé dans le code */
    forbidOnly: !!process.env.CI,
    
    /* Réessayer 2 fois en CI, 0 fois en local */
    retries: process.env.CI ? 2 : 0,
    
    /* 1 seul worker en CI pour éviter les conflits, parallèle en local */
    workers: process.env.CI ? 1 : undefined,
    
    /* Rapport de test en HTML */
    reporter: "html",
    
    /* Paramètres partagés pour tous les projets */
    use: {
        /* Enregistrer une trace lors du premier échec pour débogage */
        trace: "on-first-retry",
        
        /* CORRECTION 1 : URL de base logique. 
           Si STAGING=1, on pointe vers le site de préprod, sinon le local Hugo (port 1313) */
        baseURL: process.env.STAGING === "1" 
            ? "https://votre-site-de-staging.com" 
            : "http://127.0.0.1:1313",
    },

    /* Configuration des projets de navigateurs */
    projects: [
        /* CORRECTION 2 : Suppression du projet "setup" s'il n'est pas strictement nécessaire.
           Pour un site statique Hugo public, l'authentification (login) est rarement requise.
           Si vous avez VRAIMENT un fichier tests/global.setup.ts, vous pouvez le remettre. */
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
            },
            // dependencies: ["setup"], // <-- Retiré pour éviter l'erreur de dépendance manquante
        },
        
        // Vous pouvez décommenter Firefox ou Webkit plus tard si besoin
        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },
    ],

    /* CORRECTION 3 : Lancer automatiquement le serveur Hugo avant les tests */
    webServer: {
        command: "hugo server --config config.toml,config/config.dev.toml --disableFastRender",
        url: "http://127.0.0.1:1313",
        reuseExistingServer: !process.env.CI, // Réutilise le serveur s'il est déjà lancé en local
        timeout: 120 * 1000, // Donne 2 minutes à Hugo pour builder le site au besoin
    },
});