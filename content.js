// Global variables
let masteredWords = []
const WORD_LIST = [] // Declare WORD_LIST (or import it if available)

// Function to check if a word is in the word list and not mastered
function shouldHighlight(word) {
  const normalizedWord = word.toLowerCase()
  return WORD_LIST.includes(normalizedWord) && !masteredWords.includes(normalizedWord)
}

// Function to highlight words in text nodes
function processTextNode(textNode) {
  const text = textNode.nodeValue
  const parent = textNode.parentNode

  // Skip if parent is a script, style, or already processed
  if (
    parent.nodeName === "SCRIPT" ||
    parent.nodeName === "STYLE" ||
    parent.classList.contains("highlighted-word") ||
    parent.isContentEditable
  ) {
    return
  }

  // Regular expression to match words (handles punctuation and special characters)
  const wordRegex = /\b([a-zA-Z]+)\b/g
  let match
  let lastIndex = 0
  const fragments = []

  // Find all words in the text
  while ((match = wordRegex.exec(text)) !== null) {
    const word = match[0]
    const startIndex = match.index
    const endIndex = startIndex + word.length

    // Add text before the word
    if (startIndex > lastIndex) {
      fragments.push(document.createTextNode(text.substring(lastIndex, startIndex)))
    }

    // Check if the word should be highlighted
    if (shouldHighlight(word)) {
      const span = document.createElement("span")
      span.className = "highlighted-word"
      span.textContent = word

      // Add tooltip
      const tooltip = document.createElement("div")
      tooltip.className = "word-tooltip"
      tooltip.textContent = "Click to mark as mastered"
      span.appendChild(tooltip)

      // Add click event to mark word as mastered
      span.addEventListener("click", function () {
        const wordToMaster = this.textContent.toLowerCase()
        chrome.runtime.sendMessage({ action: "addMasteredWord", word: wordToMaster }, (response) => {
          if (response.success) {
            masteredWords.push(wordToMaster)
            refreshPage()
          }
        })
      })

      fragments.push(span)
    } else {
      // Add the word without highlighting
      fragments.push(document.createTextNode(word))
    }

    lastIndex = endIndex
  }

  // Add any remaining text
  if (lastIndex < text.length) {
    fragments.push(document.createTextNode(text.substring(lastIndex)))
  }

  // Replace the original text node with the fragments
  if (fragments.length > 1) {
    const docFrag = document.createDocumentFragment()
    fragments.forEach((fragment) => docFrag.appendChild(fragment))
    parent.replaceChild(docFrag, textNode)
  }
}

// Function to walk through all text nodes in the document
function processPage() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false)

  let node
  while ((node = walker.nextNode())) {
    processTextNode(node)
  }
}

// Function to refresh the page highlighting
function refreshPage() {
  // Remove all existing highlights
  document.querySelectorAll(".highlighted-word").forEach((el) => {
    const parent = el.parentNode
    const text = el.textContent
    const textNode = document.createTextNode(text)
    parent.replaceChild(textNode, el)
  })

  // Normalize the document to merge adjacent text nodes
  document.body.normalize()

  // Re-process the page
  processPage()
}

// Get mastered words from storage and process the page
chrome.runtime.sendMessage({ action: "getMasteredWords" }, (response) => {
  masteredWords = response.masteredWords || []

  // Wait for the page to fully load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", processPage)
  } else {
    processPage()
  }
})

// Listen for changes to mastered words from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "masteredWordsUpdated") {
    masteredWords = message.masteredWords
    refreshPage()
  }
})
