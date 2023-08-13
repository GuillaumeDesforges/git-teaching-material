# Git teaching material

Teaching material to teach git in an afternoon.

## About

The course is split in two.
First a presentation about the ideas behind git and its concepts.
Then a practical session in pairs.

Presentation takes ~1h, practical session takes ~1h30.

## Build

```
nix build
```

Results are shown in `./result`.

> For now, it is not possible to build the slides using Nix, please follow instructions below.

### Building `presentation`

Setup

```
nix shell nixpkgs#yarn
export PUPPETEER_EXECUTABLE_PATH="$(nix build nixpkgs#chromium --no-link --print-out-paths)/bin/chromium"
```

in folder `presentation`

```
yarn install
yarn build
```

The result is available in the `dist` folder.
