const dataDiv = document.getElementById("data")
const apiURL = 'https://exercisedb.p.rapidapi.com/exercises/bodyPart/%7Bchest%7D'

let mainList = []
let bodypartsList = []
let equipmentList = []




async function getApiURL(endpoint, value) {
    const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/${endpoint}/${value}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "exercisedb.p.rapidapi.com",
            "x-rapidapi-key": "360a6abca3mshcfce9cbd521f228p1e181djsn14d1d0e4c955"
        }
    })
    const data = await response.json();
    if (endpoint == "bodypart") {
        bodypartsList = data
    } else {
        equipmentList = data
    }
    mergeLists()
}

function mergeLists() {
    mainList = bodypartsList.concat(equipmentList);
    displayData(mainList)
}


//bodypart code
const bodyparts = ["Body Parts", "back", "cardio", "chest", "lower arms", "lower legs", "neck", "shoulders", "upper arms", "upper legs", "waist"]
const equipment = ["Equipment", "assisted", "band", "barbell", "body weight", "cable", "dumbbell", "kettlebell", "leverage machine", "medicine ball", "resistance band", "roller", "rope", "smith machine", "trap bar", "weighted"]


const exercises = document.getElementById("exercises");


window.addEventListener("load", function () {
    createDropdown("bodypart", bodyparts);
    let d2 = document.getElementById("bodypart")
    d2.value = localStorage.getItem("bodypart")
})
window.addEventListener("load", function () {
    createDropdown("equipment", equipment);
})


function createDropdown(name, items) {
    const select = document.createElement("select"); //---create the select element
    select.className = "selectMenu"
    select.name = name
    select.id = name
    for (let i = 0; i < items.length; i++) { //---as long as 'i' is less than the number of items increase by 1
        const item = items[i]; //---declaring 'i' as items
        const option = document.createElement("option"); //---create options for select
        option.setAttribute("value", item); //---places item value into options
        option.innerHTML = item; //---change content of options to items
        option.ID = "options"
        select.appendChild(option); //---append options to select

    }
    exercises.appendChild(select); //---append select to exercises div


    select.addEventListener("change", function () { // --- calls correct data when option is changed
        const item = select.value;
        dataDiv.innerHTML = ''; //<------Clears previous results from page
        getApiURL(name, item);
        if (select.id == "bodypart") {
            localStorage.setItem("bodypart", select.value)
        }
    })
}


function displayData(data) { //----------filters matching results of select options and displays data to appropriate elements
    let d1 = document.getElementById("equipment")
    let d2 = document.getElementById("bodypart")
    let result = data;
    if (d1.selectedIndex > 0) {
        const selected = d1.value;
        result = result.filter(({ equipment }) => equipment.includes(selected));
    }

    if (d2.selectedIndex > 0) {
        const selected = d2.value;
        result = result.filter(({ bodyPart }) => bodyPart.includes(selected));
    }

    const unique = [];

    //Filter our duplicates
    result.map(x => unique.filter(a => a.id == x.id).length > 0 ? null : unique.push(x));
    console.log(unique);

    unique.forEach(element => {
        const div = document.createElement("div");
        const button = document.createElement("button");
        button.ID = "myBtn"
        button.innerHTML = element.name
        div.appendChild(button)
        div.className = "card"
        dataDiv.appendChild(div)
        button.className = "dButtons";
        button.setAttribute('type', 'button');
        button.onclick = (ev) => {
            const modalImg = document.getElementById("modalImg")
            const img = document.createElement("img");
            img.className = "appGifs"
            img.src = element.gifUrl

            modalImg.innerHTML = ''; // reset
            modalImg.appendChild(img);

            $('#exampleModalLongTitle').text(element.name);
            $('#exampleModalCenter').modal('show');
        }
    });

}