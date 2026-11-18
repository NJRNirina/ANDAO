export interface Cooperative {
  id: string;
  name: string;
  rating: number;
  vehicle: string;
  seats: number;
  freeSeats: number;
  arrivalMinutes: number;
  price: number;
}

export const COOPERATIVES: Cooperative[] = [
  { id: 'cotisse', name: 'Cotisse Transport', rating: 4.8, vehicle: 'Mercedes Crafter 16 places', seats: 16, freeSeats: 6, arrivalMinutes: 12, price: 30000 },
  { id: 'cita', name: 'Cita', rating: 4.6, vehicle: 'Toyota Coaster 30 places', seats: 30, freeSeats: 9, arrivalMinutes: 25, price: 28000 },
  { id: 'kofiam', name: 'Kofiam', rating: 4.5, vehicle: 'Mazda E2200 15 places', seats: 15, freeSeats: 4, arrivalMinutes: 8, price: 31000 },
  { id: 'sonatra', name: 'Sonatra', rating: 4.2, vehicle: 'Mercedes Sprinter Phase 2 19 places', seats: 19, freeSeats: 7, arrivalMinutes: 18, price: 29000 },
  { id: 'fihavanana', name: 'Transport Fihavanana', rating: 4.7, vehicle: 'Grand Bus 35 places', seats: 35, freeSeats: 12, arrivalMinutes: 35, price: 27000 },
  { id: 'madexpress', name: "Mad'Express", rating: 4.4, vehicle: 'Mercedes Crafter VIP 14 places', seats: 14, freeSeats: 5, arrivalMinutes: 15, price: 33000 },
  { id: 'tanabus', name: 'Tana Bus', rating: 4.1, vehicle: 'Bus Tata 45 places', seats: 45, freeSeats: 15, arrivalMinutes: 40, price: 26000 },
  { id: 'soatrans', name: 'Soatrans', rating: 4.3, vehicle: 'Mercedes Sprinter Phase 1 18 places', seats: 18, freeSeats: 8, arrivalMinutes: 10, price: 30000 },
  { id: 'mahasoa', name: 'Transport Mahasoa', rating: 4.5, vehicle: 'Toyota HiAce 14 places', seats: 14, freeSeats: 7, arrivalMinutes: 14, price: 29500 },
  { id: 'vatsy', name: 'Vatsy Express', rating: 4.3, vehicle: 'Mazda T3500 22 places', seats: 22, freeSeats: 6, arrivalMinutes: 20, price: 28500 },
  { id: 'zoma', name: 'Zoma Bus', rating: 4.0, vehicle: 'Bus Isuzu 40 places', seats: 40, freeSeats: 14, arrivalMinutes: 38, price: 25500 },
  { id: 'fanilo', name: 'Fanilo Voyages', rating: 4.6, vehicle: 'Mercedes Crafter 16 places', seats: 16, freeSeats: 3, arrivalMinutes: 9, price: 34000 },
  { id: 'rova', name: 'Rova Transport', rating: 4.4, vehicle: 'Toyota Coaster 32 places', seats: 32, freeSeats: 10, arrivalMinutes: 28, price: 27500 },
  { id: 'fitia', name: 'Fitia Bus', rating: 4.2, vehicle: 'Mercedes Sprinter Phase 3 19 places', seats: 19, freeSeats: 5, arrivalMinutes: 16, price: 30500 },
  { id: 'andry', name: 'Andry Express', rating: 4.7, vehicle: 'Toyota HiAce VIP 12 places', seats: 12, freeSeats: 8, arrivalMinutes: 11, price: 31500 },
  { id: 'ocean', name: 'Océan Trans', rating: 4.1, vehicle: 'Bus Hyundai 38 places', seats: 38, freeSeats: 13, arrivalMinutes: 33, price: 26500 },
  { id: 'eco', name: 'Trans Économique', rating: 3.9, vehicle: 'Mazda E2000 18 places', seats: 18, freeSeats: 9, arrivalMinutes: 22, price: 19000 },
  { id: 'lalana', name: 'Lalana Bus', rating: 4.0, vehicle: 'Bus Isuzu 40 places', seats: 40, freeSeats: 18, arrivalMinutes: 30, price: 22000 },
  { id: 'confort', name: 'Mada Confort', rating: 4.8, vehicle: 'Mercedes Crafter VIP 14 places', seats: 14, freeSeats: 3, arrivalMinutes: 7, price: 38000 },
  { id: 'premium', name: 'Premium Voyage', rating: 4.9, vehicle: 'Mercedes Crafter VIP 12 places', seats: 12, freeSeats: 2, arrivalMinutes: 6, price: 45000 },
];