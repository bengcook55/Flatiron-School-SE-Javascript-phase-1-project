const form = document.getElementById('search-form')
const container = document.querySelector('.card-container')
const states = document.getElementById('states')
const card = document.querySelector('#card')





//add new comparison card to card container div
function createCard(location, income, age, property){
    
    //Create card that renders after form submission
    const newCard = document.createElement('div')
    newCard.id = 'card'
    container.append(newCard)
    
    //Create close button
    const closeButton = document.createElement('div')
    closeButton.className = 'close-btn'
    newCard.append(closeButton)

    const closeIcon = document.createElement('img')
    closeIcon.className = 'icon'
    closeIcon.src = "https://cdn11.bigcommerce.com/s-69o9yl6pah/images/stencil/1280x1280/products/639/1026/Exit_sign__80869.1588876729.png?c=2"
    closeButton.append(closeIcon)

    //Delete entire card when close icon is clicked
    closeButton.addEventListener('click', (e) => console.log(e.target.parentElement.parentElement.remove()))

    //Create Card Header (location Info)
    const cardHeader = document.createElement('div')
    cardHeader.className = 'card-header'
    
        const h3 = document.createElement('h3')
        h3.textContent = location.city
        h3.className = 'city'
        cardHeader.append(h3)

        const h4 = document.createElement('h4')
        h4.textContent = `${location.state}, USA`
        h4.className = 'state'
        cardHeader.append(h4)

        newCard.append(cardHeader)


    //Create data div that populates with fetched info from API
    const dataDiv = document.createElement('div')
    const incomeP = document.createElement('p')
    const ageP = document.createElement('p')
    const propertyP = document.createElement('p')

        dataDiv.append(incomeP, ageP, propertyP)
        dataDiv.className = 'data-div'
        newCard.append(dataDiv)
            
        incomeP.innerHTML = `Median Income: <span class='data'>${income}</span>`

        ageP.innerHTML = `Median Age: <span class='data'>${age} years</span>`
        
        propertyP.innerHTML = `Median Property Value: <span class='data'>${property}</span>`
}



// Fetch requests via async await using data USA API
async function getData(loc, callback){
    const location = loc.stateStr;
    let incomeData, ageData, propertyData;
    try {
        incomeData = await fetch(`https://datausa.io/api/data?measure=Household%20Income%20by%20Race,Household%20Income%20by%20Race%20Moe&Geography=${location}:similar&year=latest`)
            .then(res => res.json())
            .then(d => updateIncome(d))

        ageData = await fetch(`https://datausa.io/api/data?measure=Median%20Age&Geography=${location}:parents&year=latest`)
            .then(response => response.json())
            .then(d => updateAge(d))

        propertyData = await fetch(`https://datausa.io/api/data?measure=Property%20Value&Geography=${location}:parents&year=latest`)
            .then(res => res.json())
            .then(d => updateProperty(d))

    } catch(error){
        console.log(error)
    } finally{
        callback(loc, incomeData, ageData, propertyData)
    }
}



//data from fetch and how they are to update with specified function
function updateIncome(d){
    const householdIncome = d.data.slice(-1)['0']['Household Income by Race'].toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        });
      return householdIncome;
}

function updateAge(d){
    const age = d.data.slice(-1)['0']['Median Age']
   
    return age;
}

function updateProperty(d){
    const propertyValue = d.data.slice(-1)['0']['Property Value'].toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      });
      
    return propertyValue;
}


//create card after DOM loads
document.addEventListener('DOMContentLoaded', beginningCard)

form.addEventListener('submit', handleSubmit)


function handleSubmit(e){
    e.preventDefault()

    //create location object (posts to db.json) from search input
    let newLocationObject = {
        city: e.target.city.value,
        st: e.target.states.value,
        state: states.options[states.selectedIndex].text,
        stateStr: `${e.target.city.value.replace(' ','-')}-${e.target.states.value}`.toLowerCase(),
    }

    //add card to page
    getData(newLocationObject, createCard)

    form.reset()
}


// Show beginning cards which contain a city and iterate over each in an array using map/filter/forEach etc.
const startingPoint = [
   ['Columbus', 'OH', 'Ohio'],
   ['Westerville', 'OH', 'Ohio'],
   ['Mount Vernon', 'OH', 'Ohio'],
]

function startCity(city, st, state){

    let preloadedLocation = {
        city: city.toString(),
        st: st.toString(),
        state: state.toString(),
        stateStr: `${city.replace(' ','-').toLowerCase()}-${st.toLowerCase()}`,
    }

    getData(preloadedLocation, createCard)
}

function beginningCard(){
    startingPoint.forEach(location => startCity(location[0], location[1], location[2]))
}
