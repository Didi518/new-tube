import { db } from '@/db';
import { categories } from '@/db/schema';

const categoryNames = [
  'Auto Moto',
  'Humour',
  'Educatif',
  'Gaming',
  'Divertissements',
  'Films & Animés',
  'Mode',
  'Musique',
  'Actus & politique',
  'Personnes & Blogs',
  'Animaux',
  'Sciences & Technologies',
  'Sports',
  'Voyages',
];

async function main() {
  console.log('Chargement des catégories...');

  try {
    const values = categoryNames.map((name) => ({
      name,
      description: `Vidéos de la catégorie ${name.toLowerCase()}`,
    }));

    await db.insert(categories).values(values);

    console.log('Catégories bien générées!');
  } catch (error) {
    console.error('Erreur lors du chargement des catégories: ', error);
    process.exit(1);
  }
}

main();
