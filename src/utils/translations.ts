
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export const translations: Translations = {
  en: {
    // Navigation
    "home": "Home",
    "admin_dashboard": "Admin Dashboard",
    "admin_login": "Admin Login",
    "logout": "Logout",
    
    // Homepage
    "find_your_perfect_stay": "Find Your Perfect Stay",
    "browse_selection": "Browse our selection of apartments and find the perfect place for your next trip. Book with confidence and enjoy your stay.",
    "search_placeholder": "Search apartments by name, location, or description...",
    "no_apartments": "No apartments found matching your search.",
    "night": "night",
    "periods_available": "period available",
    "periods_available_plural": "periods available",
    "fully_booked": "Fully booked",
    
    // Apartment Details
    "about_this_place": "About this place",
    "per_night": "per night",
    "select_period": "Select Available Period",
    "choose_period": "Choose period",
    "no_periods": "No periods available",
    "nights": "nights",
    "full_name": "Full Name",
    "name_placeholder": "Enter your full name",
    "email": "Email",
    "email_placeholder": "Enter your email address",
    "phone": "Phone Number",
    "phone_placeholder": "Enter your phone number",
    "service_fee": "Service fee",
    "total": "Total",
    "reserve": "Reserve",
    
    // Admin
    "admin_title": "Admin Login",
    "admin_description": "Enter your credentials to access the admin dashboard",
    "username": "Username",
    "username_placeholder": "Enter your username",
    "password": "Password",
    "password_placeholder": "Enter your password",
    "login": "Login",
    "logging_in": "Logging in...",
    "default_credentials": "Default credentials: username: admin, password: admin",
    
    // Messages
    "login_success": "Login successful!",
    "login_error": "Invalid username or password",
    "booking_success": "Booking successful!",
    "fill_all_fields": "Please fill in all fields",
    
    // Footer
    "all_rights_reserved": "All rights reserved.",
    "apartment_booking": "Apartment Booking System"
  },
  fr: {
    // Navigation
    "home": "Accueil",
    "admin_dashboard": "Tableau de Bord Admin",
    "admin_login": "Connexion Admin",
    "logout": "Déconnexion",
    
    // Homepage
    "find_your_perfect_stay": "Trouvez Votre Séjour Parfait",
    "browse_selection": "Parcourez notre sélection d'appartements et trouvez l'endroit idéal pour votre prochain voyage. Réservez en toute confiance et profitez de votre séjour.",
    "search_placeholder": "Rechercher par nom, emplacement ou description...",
    "no_apartments": "Aucun appartement trouvé correspondant à votre recherche.",
    "night": "nuit",
    "periods_available": "période disponible",
    "periods_available_plural": "périodes disponibles",
    "fully_booked": "Complet",
    
    // Apartment Details
    "about_this_place": "À propos de ce lieu",
    "per_night": "par nuit",
    "select_period": "Sélectionner une Période Disponible",
    "choose_period": "Choisir une période",
    "no_periods": "Aucune période disponible",
    "nights": "nuits",
    "full_name": "Nom Complet",
    "name_placeholder": "Entrez votre nom complet",
    "email": "Email",
    "email_placeholder": "Entrez votre adresse email",
    "phone": "Numéro de Téléphone",
    "phone_placeholder": "Entrez votre numéro de téléphone",
    "service_fee": "Frais de service",
    "total": "Total",
    "reserve": "Réserver",
    
    // Admin
    "admin_title": "Connexion Admin",
    "admin_description": "Entrez vos identifiants pour accéder au tableau de bord admin",
    "username": "Nom d'utilisateur",
    "username_placeholder": "Entrez votre nom d'utilisateur",
    "password": "Mot de passe",
    "password_placeholder": "Entrez votre mot de passe",
    "login": "Connexion",
    "logging_in": "Connexion en cours...",
    "default_credentials": "Identifiants par défaut : nom d'utilisateur : admin, mot de passe : admin",
    
    // Messages
    "login_success": "Connexion réussie !",
    "login_error": "Nom d'utilisateur ou mot de passe invalide",
    "booking_success": "Réservation réussie !",
    "fill_all_fields": "Veuillez remplir tous les champs",
    
    // Footer
    "all_rights_reserved": "Tous droits réservés.",
    "apartment_booking": "Système de Réservation d'Appartements"
  }
};

// Language context and hook
export type Language = "en" | "fr";

// Default language
export const DEFAULT_LANGUAGE: Language = "fr";

// Function to translate a key
export const t = (key: string, language: Language = DEFAULT_LANGUAGE): string => {
  return translations[language][key] || key;
};
