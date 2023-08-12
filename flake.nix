{
  nixConfig.bash-prompt-prefix = "(nix) ";

  # to be changed after PR is merged
  # https://github.com/NixOS/nixpkgs/pull/244504
  inputs.nixpkgs.url = "github:nixos/nixpkgs";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        packages.default = pkgs.runCommand "git-teaching-material" {} ''
          mkdir -p $out
          cp -r ${self.packages.${system}.presentation} $out/presentation
          cp -r ${self.packages.${system}.practical-session} $out/practical-session
        '';
        packages.presentation = pkgs.callPackage ./presentation {};
        packages.practical-session = pkgs.callPackage ./practical-session {};
      }
    );
}
