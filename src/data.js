// data.js — default state for the app
// Replace survivor names with actual Survivor 50 cast once announced

export const DEFAULT_DATA = {
  season: "Survivor 50",
  totalSurvivors: 24,
  lastUpdated: null,
  tribes: [
    { id: "frank",  name: "Frank's Tribe",  owner: "Frank",  icon: null, survivors: [16, 10, 8]  }, // Jonathan, Angelina, Chrissy
    { id: "james",  name: "James's Tribe",  owner: "James",  icon: null, survivors: [4, 12, 2]  }, // Cirie, Rick Devens, Colby
    { id: "graham", name: "Graham's Tribe", owner: "Graham", icon: null, survivors: [9, 15, 5]  }, // Christian, Genevieve, Ozzy
    { id: "coley",  name: "Coley's Tribe",  owner: "Coley",  icon: null, survivors: [11, 20, 21] }, // Mike, Charlie, Tiffany
    { id: "robbie", name: "Robbie's Tribe", owner: "Robbie", icon: null, survivors: [24, 3, 22]  }, // Savannah, Stephenie, Joe
    { id: "adam",   name: "Adam's Tribe",   owner: "Adam",   icon: null, survivors: [13, 19, 23] }  // Dee, Q, Rizo
  ],
  survivors: [
    { id: 1,  name: "Jenna Lewis-Dougherty",      photo: null, eliminated: false, eliminationOrder: null },
    { id: 2,  name: "Colby Donaldson",             photo: null, eliminated: false, eliminationOrder: null },
    { id: 3,  name: "Stephenie LaGrossa Kendrick", photo: null, eliminated: false, eliminationOrder: null },
    { id: 4,  name: "Cirie Fields",                photo: null, eliminated: false, eliminationOrder: null },
    { id: 5,  name: "Ozzy Lusth",                  photo: null, eliminated: false, eliminationOrder: null },
    { id: 6,  name: "Benjamin 'Coach' Wade",       photo: null, eliminated: false, eliminationOrder: null },
    { id: 7,  name: "Aubry Bracco",                photo: null, eliminated: false, eliminationOrder: null },
    { id: 8,  name: "Chrissy Hofbeck",             photo: null, eliminated: false, eliminationOrder: null },
    { id: 9,  name: "Christian Hubicki",           photo: null, eliminated: false, eliminationOrder: null },
    { id: 10, name: "Angelina Keeley",             photo: null, eliminated: false, eliminationOrder: null },
    { id: 11, name: "Mike White",                  photo: null, eliminated: false, eliminationOrder: null },
    { id: 12, name: "Rick Devens",                 photo: null, eliminated: false, eliminationOrder: null },
    { id: 13, name: "Dee Valladares",              photo: null, eliminated: false, eliminationOrder: null },
    { id: 14, name: "Emily Flippen",               photo: null, eliminated: false, eliminationOrder: null },
    { id: 15, name: "Genevieve Mushaluk",          photo: null, eliminated: false, eliminationOrder: null },
    { id: 16, name: "Jonathan Young",              photo: null, eliminated: false, eliminationOrder: null },
    { id: 17, name: "Kamilla Karthigesu",          photo: null, eliminated: false, eliminationOrder: null },
    { id: 18, name: "Kyle Fraser",                 photo: null, eliminated: false, eliminationOrder: null },
    { id: 19, name: "Q Burdette",                  photo: null, eliminated: false, eliminationOrder: null },
    { id: 20, name: "Charlie Davis",               photo: null, eliminated: false, eliminationOrder: null },
    { id: 21, name: "Tiffany Ervin",               photo: null, eliminated: false, eliminationOrder: null },
    { id: 22, name: "Joe Hunter",                  photo: null, eliminated: false, eliminationOrder: null },
    { id: 23, name: "Rizo Velovic",                photo: null, eliminated: false, eliminationOrder: null },
    { id: 24, name: "Savannah Louie",              photo: null, eliminated: false, eliminationOrder: null }
  ]
};

// Scoring: 1st eliminated = 1 pt, winner (last standing) = 24 pts
// For active (non-eliminated) survivors: tentative points = current number of people still in game
// e.g. if 4 people have been eliminated, 20 remain, each active survivor tentatively holds rank 5
export function calculatePoints(survivor, allSurvivors) {
  const total = allSurvivors.length;
  if (survivor.eliminated && survivor.eliminationOrder !== null) {
    return survivor.eliminationOrder;
  }
  // Tentative: active survivors always show max possible points (total cast size)
  return total;
}

export function getTribePoints(tribe, allSurvivors) {
  return tribe.survivors.reduce((sum, sid) => {
    const s = allSurvivors.find(x => x.id === sid);
    if (!s) return sum;
    return sum + calculatePoints(s, allSurvivors);
  }, 0);
}
