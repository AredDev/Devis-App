export type Etablissement = 'Restaurant' | 'Hôtel' | 'Copropriété' | 'Autre';

export type Nuisible = 'Rats' | 'Cafards' | 'Punaises de lit' | 'Frelons' | 'Autre';

export type Urgence = '24h' | 'annuel' | 'simple';

export type Statut = 'nouveau' | 'traite' | 'archive';

export interface Devis {
  id: string;
  created_at: string;
  etablissement: Etablissement;
  surface: number;
  nuisibles: Nuisible[];
  urgence: Urgence;
  nom: string;
  email: string;
  telephone: string;
  message?: string;
  statut: Statut;
  ip_address: string;
}

export type DevisInput = Omit<Devis, 'id' | 'created_at' | 'statut' | 'ip_address'>;
