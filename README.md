# Jira Scrumblize

Make Jira Scrum-friendly

*This repo is mostly inspired by the [Scrummer extension](https://github.com/foucdeg/scrummer). :)*

## Installation

1. Download [Jira-Scrumblize Chrome Extension](build/jira-scrumblize.chromium.zip).
2. Extract the downloaded archive.
3. Enable **Developper Mode** in [Chrome Extensions Settings](chrome://extensions/).
4. Click **Load unpacked extension...**.
5. Open the **jira-scrumblize.chromium** folder you precedently created.

## Development

Run `yarn` command to install project dependancies.
You need to manualy reload the extension in [Chrome Extensions Settings](chrome://extensions/) to watch your changes.

### Styles

Edit `jisc.css` to modify the style of existing CSS Jira classes.
Edit `scrummer.css` to modify the style of classes injected by our script.

### Script

Run `yarn dev` to make Webpack watch `inject/index.js` file and transpile it with the `es2015` preset into `chrome/jisc.js`.
