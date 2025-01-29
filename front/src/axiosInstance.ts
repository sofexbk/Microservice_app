import axios from 'axios';
import Cookies from 'js-cookie'; // Assurez-vous d'importer js-cookie
import Swal from 'sweetalert2';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
});

// Request interceptor to include auth token from cookies
axiosInstance.interceptors.request.use(
    (request) => {
        const authToken = Cookies.get('authToken'); // Lire le token depuis les cookies
        if (authToken) {
            request.headers.Authorization = `Bearer ${authToken}`;
        }
        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Fonction pour afficher une alerte et attendre la confirmation de l'utilisateur
const showAlertAndWait = async () => {
  await Swal.fire({
    icon: 'warning',
    title: 'Session Expirée',
    text: 'Votre session a expiré. Veuillez vous reconnecter.',
    confirmButtonText: 'OK',
    customClass: {
      container: 'custom-swal-container',
      popup: 'custom-swal-popup-warning',
      title: 'custom-swal-title-warning',
      confirmButton: 'custom-swal-confirm-button-warning'
    }
  });
  // Ici, vous pouvez ajouter un délai avant de poursuivre la redirection
  return new Promise(resolve => setTimeout(resolve, 1500)); // Attendre 2 secondes
};

// Création d'un nouvel intercepteur de réponse pour gérer les tokens expirés
axiosInstance.interceptors.response.use(
  (response) => response, // Laisser passer les réponses réussies
  async (error) => {
    const originalRequest = error.config;

    // Liste des chemins à exclure de la logique de gestion de token expiré
    const excludedPaths = ['/auth/signin', '/auth/signup', '/auth/forgot-password', '/api/reset-password'];

    // Vérifier si l'URL de la requête actuelle fait partie des chemins exclus
    const isExcludedPath = excludedPaths.some(path => originalRequest.url.includes(path));

    // Si la route est exclue, ignorer la logique de redirection
    if (isExcludedPath) {
      return Promise.reject(error);
    }

    // Gérer l'erreur 403 (Forbidden) indiquant un problème d'authentification ou d'autorisation
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true; // Marquer la requête comme réessayée

      // Afficher une alerte indiquant que la session a expiré
      await showAlertAndWait();

      // Supprimer les cookies d'authentification
      Cookies.remove('authToken');

      // Rediriger vers la page de connexion
      window.location.href = '/auth/signin';

      return Promise.reject(error); // Rejeter l'erreur pour arrêter l'exécution
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
