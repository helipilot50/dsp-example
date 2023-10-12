import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const userData: Prisma.UserCreateInput[] = [
  { username: "@grace", firstName: "Grace", lastName: "Hopper", jobTitle: "Admiral", emailAddress: "grace.hopper@navy.mil", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Commodore_Grace_M._Hopper%2C_USN_%28covered%29.jpg" },
  { username: "@alan", firstName: "Alan", lastName: "Turing", jobTitle: "Mathematician", emailAddress: "alan.turing@somplace.gov.uk", imageUrl: "https://cdn.britannica.com/81/191581-050-8C0A8CD3/Alan-Turing.jpg" },
  { username: "@ada", firstName: "Ada", lastName: "Lovelace", jobTitle: "Mathematician", emailAddress: "ada.lovelace@someplace.gov.uk", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ada_Lovelace_portrait.jpg/800px-Ada_Lovelace_portrait.jpg" },
  { username: "@charles", firstName: "Charles", lastName: "Babbage", jobTitle: "Mathematician", emailAddress: "charles.babbage@somplace.com", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Charles_Babbage_1860.jpg/800px-Charles_Babbage_1860.jpg" },
  { username: "@dennis", firstName: "Dennis", lastName: "Ritchie", jobTitle: "Computer Scientist", emailAddress: "dennis.ritchie@someplace.com", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Dennis_Ritchie_2011.jpg/800px-Dennis_Ritchie_2011.jpg" },
  { username: "@bjarne", firstName: "Bjarne", lastName: "Stroustrup", jobTitle: "Computer Scientist", emailAddress: "pjarne.stroustrup@someplace.com", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Bjarne_Stroustrup.jpg/800px-Bjarne_Stroustrup.jpg" },
  { username: "@james", firstName: "James", lastName: "Gosling", jobTitle: "Computer Scientist", emailAddress: "james.gosling@someplace.com", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/James_Gosling_2008.jpg/800px-James_Gosling_2008.jpg" },
  { username: "@guido", firstName: "Guido", lastName: "van Rossum", jobTitle: "Computer Scientist", emailAddress: "guido.van.rossum@someplace.com", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Guido_van_Rossum_OSCON_2006.jpg/800px-Guido_van_Rossum_OSCON_2006.jpg" },
];

export default async function userSeedData() {
  await prisma.user.deleteMany({});
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
}