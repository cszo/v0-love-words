// Global variables
let masteredWords = []
let filteredMasteredWords = []
let filteredWordList = []
let currentTab = "mastered"

// DOM elements
const masteredCountElement = document.getElementById("masteredCount")
const remainingCountElement = document.getElementById("remainingCount")
const masteredWordsList = document.getElementById("masteredWordsList")
const fullWordList = document.getElementById("fullWordList")
const searchInput = document.getElementById("searchInput")
const wordListSearchInput = document.getElementById("wordListSearchInput")
const newWordInput = document.getElementById("newWordInput")
const addWordBtn = document.getElementById("addWordBtn")
const masteredTab = document.getElementById("masteredTab")
const wordListTab = document.getElementById("wordListTab")
const masteredWordsSection = document.getElementById("masteredWordsSection")
const wordListSection = document.getElementById("wordListSection")


// Function to update the stats display
function updateStats() {
  masteredCountElement.textContent = masteredWords.length
  remainingCountElement.textContent = WORD_LIST.length - masteredWords.length
}

// Function to render the mastered words list
function renderMasteredWords() {
  masteredWordsList.innerHTML = ""

  if (filteredMasteredWords.length === 0) {
    const emptyMessage = document.createElement("div")
    emptyMessage.className = "empty-list"
    emptyMessage.textContent = searchInput.value ? "No matching words found" : "No mastered words yet"
    masteredWordsList.appendChild(emptyMessage)
    return
  }

  filteredMasteredWords.forEach((word) => {
    const wordItem = document.createElement("div")
    wordItem.className = "word-item"

    const wordText = document.createElement("span")
    wordText.textContent = word

    const removeBtn = document.createElement("button")
    removeBtn.className = "remove-btn"
    removeBtn.textContent = "Remove"
    removeBtn.addEventListener("click", () => removeMasteredWord(word))

    wordItem.appendChild(wordText)
    wordItem.appendChild(removeBtn)
    masteredWordsList.appendChild(wordItem)
  })
}

// Function to render the full word list
function renderWordList() {
  fullWordList.innerHTML = ""

  if (filteredWordList.length === 0) {
    const emptyMessage = document.createElement("div")
    emptyMessage.className = "empty-list"
    emptyMessage.textContent = "No matching words found"
    fullWordList.appendChild(emptyMessage)
    return
  }

  filteredWordList.forEach((word) => {
    const wordItem = document.createElement("div")
    wordItem.className = "word-item"

    const wordText = document.createElement("span")
    wordText.textContent = word

    const isMastered = masteredWords.includes(word)
    const actionBtn = document.createElement("button")
    actionBtn.className = isMastered ? "remove-btn" : "add-btn"
    actionBtn.textContent = isMastered ? "Remove" : "Add"
    actionBtn.style.backgroundColor = isMastered ? "#f44336" : "#4CAF50"

    actionBtn.addEventListener("click", () => {
      if (isMastered) {
        removeMasteredWord(word)
      } else {
        addMasteredWord(word)
      }
    })

    wordItem.appendChild(wordText)
    wordItem.appendChild(actionBtn)
    fullWordList.appendChild(wordItem)
  })
}

// Function to filter mastered words based on search input
function filterMasteredWords() {
  const searchTerm = searchInput.value.toLowerCase()
  filteredMasteredWords = masteredWords.filter((word) => word.toLowerCase().includes(searchTerm))
  renderMasteredWords()
}

// Function to filter word list based on search input
function filterWordList() {
  const searchTerm = wordListSearchInput.value.toLowerCase()
  filteredWordList = WORD_LIST.filter((word) => word.toLowerCase().includes(searchTerm)).slice(0, 100) // Limit to 100 results for performance
  renderWordList()
}

// Function to add a word to mastered words
function addMasteredWord(word) {
  const normalizedWord = word.toLowerCase()

  if (!masteredWords.includes(normalizedWord)) {
    chrome.runtime.sendMessage({ action: "addMasteredWord", word: normalizedWord }, (response) => {
      if (response.success) {
        masteredWords.push(normalizedWord)
        masteredWords.sort()
        updateStats()
        filterMasteredWords()
        filterWordList()

        // Notify content script about the update
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: "masteredWordsUpdated",
              masteredWords: masteredWords,
            })
          }
        })
      }
    })
  }
}

// Function to remove a word from mastered words
function removeMasteredWord(word) {
  const normalizedWord = word.toLowerCase()

  chrome.runtime.sendMessage({ action: "removeMasteredWord", word: normalizedWord }, (response) => {
    if (response.success) {
      const index = masteredWords.indexOf(normalizedWord)
      if (index > -1) {
        masteredWords.splice(index, 1)
        updateStats()
        filterMasteredWords()
        filterWordList()

        // Notify content script about the update
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: "masteredWordsUpdated",
              masteredWords: masteredWords,
            })
          }
        })
      }
    }
  })
}

// Function to switch tabs
function switchTab(tab) {
  currentTab = tab

  if (tab === "mastered") {
    masteredTab.classList.add("active")
    wordListTab.classList.remove("active")
    masteredWordsSection.style.display = "block"
    wordListSection.style.display = "none"
  } else {
    masteredTab.classList.remove("active")
    wordListTab.classList.add("active")
    masteredWordsSection.style.display = "none"
    wordListSection.style.display = "block"

    // Initialize word list if it's empty
    if (filteredWordList.length === 0 && wordListSearchInput.value === "") {
      filteredWordList = WORD_LIST.slice(0, 100) // Show first 100 words
      renderWordList()
    }
  }
}

// Event listeners
searchInput.addEventListener("input", filterMasteredWords)
wordListSearchInput.addEventListener("input", filterWordList)

addWordBtn.addEventListener("click", () => {
  const word = newWordInput.value.trim()
  if (word) {
    addMasteredWord(word)
    newWordInput.value = ""
  }
})

newWordInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const word = newWordInput.value.trim()
    if (word) {
      addMasteredWord(word)
      newWordInput.value = ""
    }
  }
})

masteredTab.addEventListener("click", () => switchTab("mastered"))
wordListTab.addEventListener("click", () => switchTab("wordList"))

// Initialize the popup
document.addEventListener("DOMContentLoaded", () => {
  // Get mastered words from storage
  chrome.runtime.sendMessage({ action: "getMasteredWords" }, (response) => {
    masteredWords = response.masteredWords || []
    masteredWords.sort()
    filteredMasteredWords = [...masteredWords]

    updateStats()
    renderMasteredWords()

    // Initialize the first tab
    switchTab("mastered")
  })
})
