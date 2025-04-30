// Initialize storage with default values when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["masteredWords"], (result) => {
    if (!result.masteredWords) {
      chrome.storage.local.set({ masteredWords: [] })
    }
  })
})

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getMasteredWords") {
    chrome.storage.local.get(["masteredWords"], (result) => {
      sendResponse({ masteredWords: result.masteredWords || [] })
    })
    return true // Required for async response
  }

  if (message.action === "addMasteredWord") {
    chrome.storage.local.get(["masteredWords"], (result) => {
      const masteredWords = result.masteredWords || []
      if (!masteredWords.includes(message.word)) {
        masteredWords.push(message.word)
        chrome.storage.local.set({ masteredWords })
        sendResponse({ success: true, word: message.word })
      } else {
        sendResponse({ success: false, message: "Word already mastered" })
      }
    })
    return true // Required for async response
  }

  if (message.action === "removeMasteredWord") {
    chrome.storage.local.get(["masteredWords"], (result) => {
      const masteredWords = result.masteredWords || []
      const index = masteredWords.indexOf(message.word)
      if (index > -1) {
        masteredWords.splice(index, 1)
        chrome.storage.local.set({ masteredWords })
        sendResponse({ success: true, word: message.word })
      } else {
        sendResponse({ success: false, message: "Word not found" })
      }
    })
    return true // Required for async response
  }
})
