# FAQ

## 1. How can I see the mastered words stored by the extension?

You can view the mastered words stored by the extension using Chrome's DevTools:

1. Go to `chrome://extensions/` in your browser.
2. Enable **Developer mode** (toggle in the top right).
3. Find your extension and click on **"Service Worker"** or **"background page"** under the extension entry. This opens a DevTools window for your extension.
4. In the DevTools window, go to the **Console** tab.
5. Run the following command to see all data stored:
   ```js
   chrome.storage.local.get(null, (data) => { console.log(data); });
   ```
   Or, to see just the mastered words:
   ```js
   chrome.storage.local.get('masteredWords', (data) => { console.log(data.masteredWords); });
   ```

## 2. How can I export the words I have mastered?

To export your mastered words:

1. Follow the steps above to open the extension's background page console.
2. Run this command in the console:
   ```js
   chrome.storage.local.get('masteredWords', (data) => {
     const words = data.masteredWords || [];
     console.log(words.join(", "));
   });
   ```
   This will print a comma-separated list of your mastered words. You can copy and paste this list wherever you like.

If you want to save the list to a file, you can copy the output and paste it into a text editor, then save it as a `.txt` or `.csv` file.

---

If you have more questions, feel free to ask or open an issue on the repository!