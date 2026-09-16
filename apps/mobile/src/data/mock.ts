export const mockUser = {
  firstName: "Camille",
  fullName: "Camille Tremblay",
  city: "Val-d'Or",
};

export const mockActiveParcel = {
  id: "booking-4821",
  title: "Carton documents",
  origin: "Val-d'Or",
  destination: "Gatineau",
  driver: {
    name: "Alex B.",
    initial: "A",
    verified: true,
    rating: 4.9,
  },
  departure: "Demain, 7 h 30",
  eta: "Arrivée estimée 16 h 20",
  status: "En transit",
  handoverCode: "4821",
};

export const mockTrips = [
  {
    id: "trip-1",
    kind: "colis" as const,
    title: "Carton documents",
    route: "Val-d'Or → Gatineau",
    when: "Demain, 7 h 30",
    status: "En transit",
  },
  {
    id: "trip-2",
    kind: "covoiturage" as const,
    title: "Place passager",
    route: "Rouyn-Noranda → Montréal",
    when: "Vendredi, 6 h 00",
    status: "Confirmée",
  },
  {
    id: "trip-3",
    kind: "colis" as const,
    title: "Boîte pièces auto",
    route: "Amos → Val-d'Or",
    when: "12 sept.",
    status: "Livrée",
  },
];

export const mockMessages = [
  {
    id: "msg-1",
    name: "Alex B.",
    preview: "Je serai au Tim Hortons de l’autoroute vers 7 h 15.",
    time: "19:12",
    unread: true,
  },
  {
    id: "msg-2",
    name: "Support Livre-moi",
    preview: "Votre code de remise est prêt pour la livraison.",
    time: "Hier",
    unread: false,
  },
];
