# Jira Scrumblize

Make Jira Scrum-friendly

*This repo is mostly inspired by the [Scrummer extension](https://github.com/foucdeg/scrummer). :)*

## Installation

### Through Chrome-web store

Install the extension [here](https://chrome.google.com/webstore/detail/jira-scrumblize/lfglfaihiikkmhehemahdledaakpnchb?hl=en-US&gl=FR).

### Through Chrome Developper settings

1. Download [Jira-Scrumblize Chrome Extension](build/jira-scrumblize.chromium.zip).
2. Extract the downloaded archive.
3. Enable **Developper Mode** in [Chrome Extensions Settings](chrome://extensions/).
4. Click **Load unpacked extension...**.
5. Open the **jira-scrumblize.chromium** folder you precedently created.

## Development

Run `yarn` command to install project dependancies.

### Styles

Edit `jisc.css` to modify the style of existing CSS Jira classes.
Edit `scrummer.css` to modify the style of classes injected by our script.

### Script

Run `yarn dev` to make Webpack watch `src/index.js` file and transpile it with the `es2015` preset into `pre-build/jisc.js`.

### Debug

1. Load the extension in [Chrome Extensions Settings](chrome://extensions/).
2. Click **Load unpacked extension...**.
3. Open the **pre-build** folder of this repo (after having ran `yarn dev`).
4. You need to manualy reload the extension in [Chrome Extensions Settings](chrome://extensions/) to watch your changes.
