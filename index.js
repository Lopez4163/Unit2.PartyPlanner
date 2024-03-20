//create state to hold list of parties
//fetch Api and have it added to the state array
//give user ability to remove item in array
//make form to give ability to add item to list
const COHORT = "2402-FTB-ET-WEB-FT"
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`

const state = {
  partyList: [],
}

async function render() {
  await getEvents()
  renderEvents()
}
render()

async function getEvents() {
  try {
    const response = await fetch(API_URL)
    const json = await response.json()
    state.partyList = json.data
  } catch (error) {
    console.error(error)
  }
  console.log(state.partyList)
}

const renderEvents = () => {
  const ul = document.querySelector("#events")
  state.partyList.forEach(party => {
    const li = document.createElement("li")
    li.innerText = `Name: ${party.name} \n Description: ${party.description} \n Date: ${party.date} \n Location: ${party.location}`
    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add(".delete-btn")
    deleteBtn.innerText = "Delete"
    ul.appendChild(li)
    li.appendChild(deleteBtn)
    deleteBtn.addEventListener("click", e => {
      const parentLi = e.target.parentNode
      parentLi.remove()
      state.partyList.pop(party)
      console.log(state.partyList)
    })
    state.partyList = []
  })
}

const form = document.querySelector("#form")

form.addEventListener("submit", async e => {
  e.preventDefault()

  const formData = new FormData(form)
  const newParty = {}

  for (let [key, value] of formData.entries()) {
    newParty[key] = value
  }

  try {
    await addPartyToAPI(newParty)
    state.partyList.push(newParty)
    renderEvents()
  } catch (error) {
    console.error(error)
  }
})
async function addPartyToAPI(newEvent) {
  console.log(newEvent)
  const newDate = new Date()
  newEvent.date = newDate.toISOString()
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    })
    if (!response.ok) {
      throw new Error("Failed to add party to API")
    }
    console.log("Party added to API")
  } catch (error) {
    console.error(error)
  }
}
