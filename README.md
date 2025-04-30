# WordMaster Chrome Extension

> **Your AI Language Companion: Building a Personal Universe of English Words, One Discovery at a Time**

## Overview

WordMaster is a Chrome extension designed to help you master English vocabulary while browsing the web. It intelligently highlights unfamiliar words from a curated list of 8,000 essential English words, allowing you to learn in context and track your progress over time.

## Features

- **Smart Word Highlighting**: Automatically identifies and highlights words from your learning list that you haven't mastered yet
- **Contextual Learning**: Learn new words as you encounter them naturally in web content
- **Progress Tracking**: Keep track of words you've mastered and see your vocabulary growth over time
- **Personalized Experience**: The extension adapts to your knowledge level, focusing only on words you need to learn
- **User-Friendly Interface**: Simple popup interface to manage your word lists and view statistics

## Installation

### From Source (Developer Mode)

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top-right corner
4. Click "Load unpacked" and select the directory containing the extension files
5. The extension should now be installed and visible in your Chrome toolbar

## How to Use

1. **Browse the Web**: Visit any English website as you normally would
2. **Learn New Words**: Words from the 8,000-word list that you haven't mastered will be highlighted in yellow
3. **Mark Words as Mastered**: Click on any highlighted word to mark it as mastered
4. **Track Your Progress**: Click the extension icon in your toolbar to:
   - View statistics about your vocabulary progress
   - Search and manage your mastered words
   - Browse the full word list
   - Add words manually to your mastered list

## Technical Details

The extension consists of several components:

- **manifest.json**: Configuration file for the Chrome extension
- **background.js**: Handles background processes and communication between components
- **content.js**: Scans web pages and highlights unfamiliar words
- **content.css**: Styles for highlighted words
- **popup.html/js**: Provides the user interface for managing words and viewing progress
- **wordList.js**: Contains the curated list of 8,000 essential English words

## Customization

### Word List

Replace the array in `wordList.js` with your own list of words. The default list contains graded English words organized by difficulty level.

### Highlight Style

Modify `content.css` to change the appearance of highlighted words:

```css
.highlighted-word {
  background-color: #ffeb3b;
  border-radius: 2px;
  padding: 0 2px;
  cursor: pointer;
}
```

### Extension Icons

Replace the placeholder icons in the `images` folder with your own custom icons for a personalized look.

## Privacy

WordMaster respects your privacy:

- All data is stored locally on your device using Chrome's storage API
- No data is sent to external servers
- The extension only accesses page content to identify words for highlighting

## Contributing

Contributions are welcome! If you'd like to improve WordMaster:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for providing valuable resources and inspiration
