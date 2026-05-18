import { z } from 'zod';

export const etablissementSchema = z.enum(['Restaurant', 'Hôtel', 'Copropriété', 'Autre'], {
  error: "Le type d'établissement est requis",
});

export const surfaceSchema = z
  .number({
    error: "La surface est requise",
  })
  .min(10, "La surface minimale est de 10 m²")
  .max(50000, "La surface maximale est de 50 000 m²");

export const nuisiblesSchema = z
  .array(z.enum(['Rats', 'Cafards', 'Punaises de lit', 'Frelons', 'Autre']))
  .min(1, "Veuillez sélectionner au moins un type de nuisible");

export const urgenceSchema = z.enum(['24h', 'annuel', 'simple'], {
  error: "Le degré d'urgence est requis",
});

export const nomSchema = z
  .string()
  .min(2, "Le nom du contact doit faire au moins 2 caractères")
  .max(100, "Le nom ne doit pas dépasser 100 caractères");

export const emailSchema = z
  .string()
  .min(1, "L'email est requis")
  .email("Veuillez saisir une adresse email valide");

// Validate international telephone numbers (standard format: leading optional +, followed by 8 to 20 digits, spaces, or dashes)
export const telephoneSchema = z
  .string()
  .min(1, "Le numéro de téléphone est requis")
  .regex(
    /^\+?[0-9\s.-]{8,20}$/,
    "Veuillez saisir un numéro de téléphone valide avec son indicatif (ex: +33 6 12 34 56 78)"
  );

export const messageSchema = z
  .string()
  .max(500, "Le message ne doit pas dépasser 500 caractères")
  .optional();

// Complete devis validation schema
export const devisFormSchema = z.object({
  etablissement: etablissementSchema,
  surface: surfaceSchema,
  nuisibles: nuisiblesSchema,
  urgence: urgenceSchema,
  nom: nomSchema,
  email: emailSchema,
  telephone: telephoneSchema,
  message: messageSchema,
});

export type DevisFormData = z.infer<typeof devisFormSchema>;
