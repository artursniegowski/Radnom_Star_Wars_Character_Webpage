"use strict"

// initial value for the maximum amout of people
let maxNumberOfPeople = 0
// url of the swapi API
let urlBase = "https://swapi.dev/api/people/";

// getting elemnts IDs
const statusURL = document.getElementById("status");

// default url for iframe
// let urlIframeBase = "https://starwars.fandom.com/wiki/";
let urlIframeBase = "https://www.starwars.com/databank/";

// some names need to be adjusted
// different naming starwars.databnak and API swapi.dev
const namesAdjustment = {
    "beru whitesun lars": "beru lars", 
    "wilhuff tarkin": "grand moff tarkin",
    "jabba desilijic tiure": "jabba the hutt",
    "jek tono porkins": "jek porkins", 
    "arvel crynyd": "resistance pilots",
    "wicket systri warrick": "wicket w warrick",
    "finis valorum": "supreme chancellor valorum",
    "padmé amidala": "padme amidala",
    "roos tarpals": "general tarpals",
    "rugor nass": "boss nass",
    "ric olié": "ric olie",
    "quarsh panaka": "captain panaka",
    "shmi skywalker": "shmi skywalker lars",
    "ayla secura": "aayla secura",
    "ratts tyerel": "ratts tyerell",
    "dud bolt": "dug",
    "gregar typho": "captain typho",
    "cordé": "naboo royal handmaidens",
    "cliegg lars": "cliegg lars",
    "dormé": "dorme",
    "bail prestor organa": "bail organa",
    "grievous": "general grievous",
    "raymus antilles": "captain antilles",
}

// getting the iframe selector
const imageWeb = document.querySelector("#image-character > .iframe-page");
// setting default src on the iframe on the website
imageWeb.src = urlIframeBase + "Darth-Sidious"

const elementsCharacterInfo = document.querySelectorAll(".info-random-character");

// JSON properties and names from html
let arrayProperties = ['name', 'height', 'mass', 'hair_color', 'skin_color', 'eye_color', 'birth_year', 'gender']
let arrayNames =['Name: ', 'Height: ', 'Mass: ', 'Hair color: ', 'Skin color: ', 'Eye-color: ', 'Birth year: ', 'Gender: ']

// first checking the max number of characters in the API swapi.dev
async function getMaxUsers (urlBase) {

    let urlGeneral = urlBase;

    try {
        let res = await fetch(urlGeneral);
        
        if (res.status === 200) {
            // console.log(res.status);
            // successful loaded data
            let data = await res.json();
            return Number(data['count'])+1;
        } else {
            throw `Error ${res.status}`;
        }     
    } catch (error) {
        console.log(`URL ${urlGeneral} exited with error status ${error}`);
        return null;
    }
}

// getting the random number 
const getkRandomNumber = (maxValue) => {

    let randomNumber = 0;
    randomNumber = Math.ceil(Math.random() * maxValue);

    // checking if the random number is in the right range
    // else setting a default safe value , 30
    if ( 0 < randomNumber && randomNumber <= maxValue) {
        // console.log(`current random number ${randomNumber} is in range`);
        return randomNumber;
    } else {
        console.log(`current random number ${randomNumber} is out of range`);
        randomNumber = 30;
    }
    return randomNumber;
}

// returning the url of the character for the Iframe
const getURLForIframe = (urlIframeBase, characterName,sep="_") => urlIframeBase + (characterName.split(" ")).join(sep);

// retriving the a random character from the API swapi.dev
async function getRandomCharacter (urlBase,urlIframeBase,namesAdjustment) {

    statusURL.style.color = "blue";
    statusURL.innerText = "Status: LOADING...";
    let randomNumber = getkRandomNumber(await getMaxUsers(urlBase));
    
    let urlRandomCharacter = new URL(String(randomNumber)+'/', urlBase);

    try {
        let res = await fetch(urlRandomCharacter.href)

        if (res.status === 200) {
            console.log(`Successful loaded page ${urlRandomCharacter.href}, code: ${res.status}`);
            // successful loaded data
            let data = await res.json();
            // console.log(data)
            
            // updating values in the html 

            statusURL.innerText = "Status: SUCCESSFUL";
            statusURL.style.color = "green";

            elementsCharacterInfo.forEach((node,index) => {
                node.innerText = `${arrayNames[index]}${data[arrayProperties[index]]}`;
            });

            let nameToAdjust = String(data.name).toLowerCase();
            if (nameToAdjust in namesAdjustment) {
                data.name = namesAdjustment[nameToAdjust];
            }

            imageWeb.src = getURLForIframe(urlIframeBase,data.name,"-");

        } else {
            console.log(`API unreachable, page: ${urlRandomCharacter.href}, code: ${res.status}`);
            throw `Error ${res.status}`;
        }

    } catch (error) {
        statusURL.style.color = "red";
        statusURL.innerText = "Status: Failed";
        console.log(`URL ${urlRandomCharacter.href} exited with error status ${error}`);
        return null;
    } 
}

// setting an eventlistener for click action on the button
document.getElementById("myBt-Generator").addEventListener("click", getRandomCharacter.bind(null,urlBase,urlIframeBase,namesAdjustment));