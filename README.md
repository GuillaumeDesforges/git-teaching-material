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
> See [nixos/nixpkgs#190681](https://github.com/NixOS/nixpkgs/issues/190681).

### Building `presentation`

```
cd presentation
nix shell nixpkgs#yarn --command yarn install
nix shell nixpkgs#yarn nixpkgs#chromium --command yarn build
```

The result is available in the `dist` folder.
