/* ----- !!! IMPORTANT: UPDATE API KEY IF NEEDED !!! ----- */
const APIKEY = "RGAPI-dffa1378-9ba1-4fea-9a52-f1d6e04d7757";
var version = "15.2.1";
/* ----- Obtain variables from local storage ----- */
var region = localStorage.getItem("region");
var gameName = localStorage.getItem("gameName");
var tagLine = localStorage.getItem("tagLine");
var fullGameName = gameName.concat(" #", tagLine);

/* ----- Set search bar values from index/local storage ----- */
document.getElementById("region").value = region;
document.getElementById("game-name").value = fullGameName;

/* ----- Same function from Index ----- */
function storeSummonerInfo() {
  region = document.getElementById("region").value;
  fullGameName = document.getElementById("game-name").value;
  /* Using Regular Expressions Negative and positive LookBehinds */
  gameName = fullGameName.match(/\b(?<!#)[^#\s]+/g);
  tagLine = fullGameName.match(/(?<=#)\w+/gm);

  localStorage.setItem("region", region);
  localStorage.setItem("gameName", gameName);
  localStorage.setItem("tagLine", tagLine);
}

class ChampionRoster {
  constructor(id, level, key, name, title) {
    this.id = id;
    this.level = level;
    this.key = key;
    this.name = name;
    this.title = title;
  }

  setChampId(id) {
    this.id = id;
  }
  setChampLevel(level) {
    this.level = level;
  }
  setChampKey(key) {
    this.key = key;
  }
  setChampName(name) {
    this.name = name;
  }
  setChampTitle(title) {
    this.title = title;
  }

  getChampId() {
    return this.id;
  }
  getChampLevel() {
    return this.level;
  }
  getChampKey() {
    return this.key;
  }
  getChampName() {
    return this.name;
  }
  getChampTitle() {
    return this.title;
  }
}

/* ----- Variables for main continent/region for API ----- */
const americas = ["NA1", "LA2", "LA1", "BR1"];
const aisa = ["KR", "JP1", "PH2", "TW2", "VN2", "OC1"];
const europe = ["EUW1", "EUN1", "ME1", "RU", "TR1"];

var mainRegion = "";
function cycleMainRegion(mRegion, mRegionName) {
  if (mainRegion) return;
  for (let i = 0; i < mRegion.length; i++) {
    if (region === mRegion[i]) mainRegion = mRegionName;
  }
}
cycleMainRegion(americas, "americas");
cycleMainRegion(aisa, "aisa");
cycleMainRegion(europe, "europe");

var summonerPUUID = "";
var iconId = 0;
var summonerLevel = 0;

/* Change this later */ var filter = 3;

/* ----- API DATA AQUISITIONS ----- */
async function renderAPIs() {
  /* API to obtain the latest version of the game */
  const apiVersion = await fetch(
    `https://ddragon.leagueoflegends.com/api/versions.json`
  );
  const apiVersionData = await apiVersion.json();
  version = apiVersionData[0];
  console.log(version);

  /* API to obtain the summoners PUUID via Game Name and Tag */
  const summonerId = await fetch(
    `https://${mainRegion}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${APIKEY}`
  );
  const summonerIdData = await summonerId.json();
  summonerPUUID = summonerIdData.puuid;
  console.log(summonerIdData);

  /* API to obtain the summoners icon and level */
  const summonerProfile = await fetch(
    `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${summonerPUUID}?api_key=${APIKEY}`
  );
  const summonerProfileData = await summonerProfile.json();
  console.log(summonerProfileData);
  iconId = summonerProfileData.profileIconId;
  summonerLevel = summonerProfileData.summonerLevel;

  /* API to obtain the champion ID and mastery level via PUUID */
  const champMastery = await fetch(
    `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${summonerPUUID}?api_key=${APIKEY}`
  );
  const champMasteryData = await champMastery.json();
  let champMasteryFiltered = champMasteryData.slice(0, filter);
  console.log(champMasteryFiltered);

  let dynamicChamps = new Map();

  for (var key in champMasteryFiltered) {
    let tempId = champMasteryFiltered[key].championId;
    let tempLevel = champMasteryFiltered[key].championLevel;

    dynamicChamps.set(tempId, tempLevel);
  }

  console.log(dynamicChamps);

  /* API to obtain the names of the champions that exist in the game */
  const championListLive = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
  );
  const championListLiveData = await championListLive.json();
  const champInfo = championListLiveData.data;

  let championsLive = new Map();
  for (var key in champInfo) {
    let tempName = champInfo[key].name;
    let tempId = champInfo[key].key;
    let tempTitle = champInfo[key].title;
    /* console.log(tempName + ": " + tempId + "," + tempTitle); */

    dynamicChamps.set(tempId, tempName);

    for (var k in champInfo[key]) {
      console.log(`${k}: ${champInfo[key][k]}`)
    }
  }



  /* ----- Remove the Loading HTML from the webpage ----- */
  const summonerLoading = document.querySelector(".summoner");
  summonerLoading.classList.remove("summoner__loading");

  /* HTML TO CREATE THE SUMMONER PROFILE (Summoner.html has it) */
  /* `<div class="summoner__profile">
            <div class="summoner__profile--display">
              <div class="summoner__profile--wrapper">
                <img
                  src="https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${iconId}.png"
                  class="summoner__profile--img"
                />
              </div>
              <h1 class="summoner__profile--name">${gameName} <span class="silver">#${tagLine}</span></h1>
            </div>
            <div class="summoner__profile--filter">
              <h3 class="summoner__profile--filter-sub">Filter:</h3>
              <select id="filter" class="summoner__filter" onchange="filterChamps(event)">
                <option value="TOP_3" selected>Top 3 Champions</option>
                <option value="TOP_5">Top 5 Champions</option>
                <option value="TOP_10">Top 10 Champions</option>
                <option value="A_Z_10">Alphabetical Top 10</option>
              </select>
            </div>
          </div>` */
}



/* var championsLive = [];
function getChamps(champList) {
    return new Promise((resolve, reject) => {
        
    })
} */

setTimeout(() => {
  renderAPIs();
}, Math.random() * 1500 + 2500);

async function renderChampions1(status, filter) {
  var topChampsAmmount = filter;
  const summonerWrapper = document.querySelector(".summoner");
  console.log(summonerWrapper);
  const summoner = await getAccount();
  summonerWrapper.classList.remove(".summoner__loading");
  const summonerHTML = ``;

  if (status /* === '404' */) {
    summonerHTML = `<div class="summoner-champion__display">
            <div class="summoner-champion--wrapper">
              <img
              src="assets/null_champ-bg.jpg"
              class="summoner-champion--img"
              >
            </div>
            <div class="summoner-champion__info--container">
              <h3 class="summoner-champion__title">Summoner not found</h3>
              <p class="summoner-champion__description">
                Verify that the summoner name and/or the #TAG is correctly
                written.
              </p>
            </div>
          </div>`;
  } else {
    summonerHTML = summoner
      .map((champions) => {
        return ``;
      })
      .join("");
  }

  summonerWrapper.innerHTML = summonerHTML;
}
