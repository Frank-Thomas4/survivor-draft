export const DEFAULT_DATA = {
  season: "Survivor 50",
  totalSurvivors: 24,
  lastUpdated: null,
  tribes: [
    { id: "frank",  name: "Frank's Tribe",  owner: "Frank",  icon: null, survivors: [16, 10, 8]  },
    { id: "james",  name: "James's Tribe",  owner: "James",  icon: null, survivors: [4, 12, 2]  },
    { id: "graham", name: "Graham's Tribe", owner: "Graham", icon: null, survivors: [9, 15, 5]  },
    { id: "coley",  name: "Coley's Tribe",  owner: "Coley",  icon: null, survivors: [11, 20, 21] },
    { id: "robbie", name: "Robbie's Tribe", owner: "Robbie", icon: null, survivors: [24, 3, 22]  },
    { id: "adam",   name: "Adam's Tribe",   owner: "Adam",   icon: null, survivors: [13, 19, 23] }
  ],
  survivors: [
    { id: 1,  name: "Jenna Lewis-Dougherty",      eliminated: false, eliminationOrder: null },
    { id: 2,  name: "Colby Donaldson",             eliminated: false, eliminationOrder: null },
    { id: 3,  name: "Stephenie LaGrossa Kendrick", eliminated: false, eliminationOrder: null },
    { id: 4,  name: "Cirie Fields",                eliminated: false, eliminationOrder: null },
    { id: 5,  name: "Ozzy Lusth",                  eliminated: false, eliminationOrder: null },
    { id: 6,  name: "Benjamin 'Coach' Wade",       eliminated: false, eliminationOrder: null },
    { id: 7,  name: "Aubry Bracco",                eliminated: false, eliminationOrder: null },
    { id: 8,  name: "Chrissy Hofbeck",             eliminated: false, eliminationOrder: null },
    { id: 9,  name: "Christian Hubicki",           eliminated: false, eliminationOrder: null },
    { id: 10, name: "Angelina Keeley",             eliminated: false, eliminationOrder: null },
    { id: 11, name: "Mike White",                  eliminated: false, eliminationOrder: null },
    { id: 12, name: "Rick Devens",                 eliminated: false, eliminationOrder: null },
    { id: 13, name: "Dee Valladares",              eliminated: false, eliminationOrder: null },
    { id: 14, name: "Emily Flippen",               eliminated: false, eliminationOrder: null },
    { id: 15, name: "Genevieve Mushaluk",          eliminated: false, eliminationOrder: null },
    { id: 16, name: "Jonathan Young",              eliminated: false, eliminationOrder: null },
    { id: 17, name: "Kamilla Karthigesu",          eliminated: false, eliminationOrder: null },
    { id: 18, name: "Kyle Fraser",                 eliminated: false, eliminationOrder: null },
    { id: 19, name: "Q Burdette",                  eliminated: false, eliminationOrder: null },
    { id: 20, name: "Charlie Davis",               eliminated: false, eliminationOrder: null },
    { id: 21, name: "Tiffany Ervin",               eliminated: false, eliminationOrder: null },
    { id: 22, name: "Joe Hunter",                  eliminated: false, eliminationOrder: null },
    { id: 23, name: "Rizo Velovic",                eliminated: false, eliminationOrder: null },
    { id: 24, name: "Savannah Louie",              eliminated: false, eliminationOrder: null }
  ]
};

export function calculatePoints(survivor, allSurvivors) {
  const total = allSurvivors.length;
  if (survivor.eliminated && survivor.eliminationOrder !== null) {
    return survivor.eliminationOrder;
  }
  return total;
}

export function getTribePoints(tribe, allSurvivors) {
  return tribe.survivors.reduce((sum, sid) => {
    const s = allSurvivors.find(x => x.id === sid);
    if (!s) return sum;
    return sum + calculatePoints(s, allSurvivors);
  }, 0);
}