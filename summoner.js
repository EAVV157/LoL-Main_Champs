/* ----- !!! IMPORTANT: UPDATE API KEY IF NEEDED !!! ----- */
const APIKEY = "RGAPI-746eafc9-9050-4065-9c6f-efe53b58e204";
var version = '15.2.1';
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

/* ----- FIRST API DATA AQUISITIONS ----- */
async function renderSummoner() {
  /* API to obtain the summoners PUUID via Game Name and Tag */
  const summonerId = await fetch(
    `https://${mainRegion}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${APIKEY}`
  );
  const summonerIdData = await summonerId.json();
  console.log(summonerIdData);
  summonerPUUID = summonerIdData.puuid;

  /* API to obtain the summoners icon and level */
  const summonerProfile = await fetch(
    `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${summonerPUUID}?api_key=${APIKEY}`
  );
  const summonerProfileData = await summonerProfile.json();
  console.log(summonerProfileData);
  iconId = summonerProfileData.profileIconId;
  summonerLevel = summonerProfileData.summonerLevel;

  /* HTML TO CREATE THE SUMMONER PROFILE (Summoner.html has it) */

  renderChampions();
}

/* Change this later */ var filter = 10;

class championInfo {
    constructor(id, name, level) {
        this.id = id;
        this.name = name;
        this.level = level;
    }
    getChampId() {
        return this.id;
    }
    getChampName() {
        return this.name;
    }
    getChampLevel() {
        return this.level;
    }
}

/* var championsLive = [];
function getChamps(champList) {
    return new Promise((resolve, reject) => {
        
    })
} */

async function renderChampions() {
    /* API to obtain the latest version of the game */
    const apiVersion = await fetch (`https://ddragon.leagueoflegends.com/api/versions.json`);
    const apiVersionData = await apiVersion.json();
    version = apiVersionData[0];
    console.log(version);

    /* API to obtain the names of the champions that exist in the game */
    const championListLive = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
    );
    const championListLiveData = await championListLive.json();
    console.log(championListLiveData);
    const champNameId = championListLiveData.data;
    console.log(champNameId);

    /* const champs = champNameId.map(champ => {
        return {
            name: champ.id,
            id: champ.key,
        }
    }); */

    /* API to obtain the champion ID and mastery level via PUUID */
    const championListPUUID = await fetch(
        `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${summonerPUUID}?api_key=${APIKEY}`
    );
    const championListPUUIDData = await championListPUUID.json();
    let championListPUUIDFiltered = championListPUUIDData.slice(0, filter);
    console.log(championListPUUIDFiltered);

    let championId = [];
    for(let i = 0; i < filter; i++){
        championId.push(championListPUUIDFiltered[i].championId);
        /* championListID.push(championListData[i].championId)
        championListLevel.push(championListData[i].championLevel) */
    }
    console.log(championId);
}

renderSummoner();

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
