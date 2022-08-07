## about

This is a basic [Three.js](https://github.com/mrdoob/three.js/) sample project showcasing how to create dynamic NFTs by querying [Olta's subgraph API](https://api.thegraph.com/subgraphs/name/olta-art/mumbai-v1/). The idea is to link up some of the contract data to how your work is supposed to behave over time via GQL.

In this case, once a dutch auction is running for your piece, the number of controls and cubes on the scene will adjust according to how many price drops are left. For example, if someone were to mint an edition at bottom price, there should be only the color control and less cubes present.

We are using [lil-gui](https://github.com/georgealways/lil-gui/) for setting up scene controls and [esbuild](https://github.com/evanw/esbuild) to produce the final JS bundle and for local serving during development. We also keep a separate [rollup](https://github.com/rollup/rollup) and [http-server](https://github.com/http-party/http-server) based [branch](https://github.com/olta-art/spincubes/tree/rollup).

## setup

Clone or download the GitHub repository:

```sh
# The main, esbuild branch:
git clone https://github.com/olta-art/spincubes.git

# The rollup branch only:
git clone -b rollup https://github.com/olta-art/spincubes.git
```

Assuming you have Node.js available, navigate to the project directory, and install the required JS dependencies:

```sh
# Wherever your clone is located :)
cd /path/to/spincubes

# Download external modules:
npm i
```

## usage

Start a local http server out the `./app` directory, watch `./main.js` for changes, and rebuild JS if necessary:

```sh
npm t
```

Once you are happy with your changes, bundle up and minify JS for production:

```sh
npm start
```

That should give your project a smaller total size when uploading to Arweave.

## structure

- `./data.json` or `./data.js` contain mock data to aid with testing.
- The `./helper.js` module contains app wide utility functions.
- The `./main.js` module will set up the scene and run the URL search param and subgraph logic.
- The `./query.js` module is meant to contain wrapper functions for creating GQL queries, at present just for fetching per project data.
- The `./app` directory contains all the files needed for successfully hosting the project on Arweave:
  - `./app/app.webmanifest` is the [web app manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) for the project, which you can edit to include extra screenshots and other metadata for [Olta's editions app](https://beta.olta.art/mumbai/) to read when uploading.
  - `./app/favicon.ico` is an empty favicon to stop browsers complaining about it missing on first load.
  - `./app/bundle.js` is the compiled JS, which includes project code and imports.
  - `./app/index.html` links up the scripts and sets up the canvas.
  - `./app/screenshot.png` is a preview and thumbnail image for the project displayed when listing on [Olta's editions app](https://beta.olta.art/mumbai/), Polygonscan, and OpenSea.

## see also

- [Olta's Polygon TESTNET beta](https://beta.olta.art/mumbai/index.html)
- [Olta's Tech docs](https://docs.olta.art/creator/introduction.html#become-a-creator)
