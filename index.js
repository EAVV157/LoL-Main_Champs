var region = localStorage.getItem("region");

if (region) {
    document.getElementById("region").value = region;
}

function storeSummonerInfo() {
    region = document.getElementById('region').value;
    let fullGameName = document.getElementById('game-name').value;
    /* Using Regular Expressions Negative and positive LookBehinds */
    let gameName = fullGameName.match(/\b(?<!#)[^#\s]+/g);
    let tagLine = fullGameName.match(/(?<=#)\w+/gm);
    
    localStorage.setItem("region", region);
    localStorage.setItem("gameName", gameName);
    localStorage.setItem("tagLine", tagLine);
}