{
  nixConfig.bash-prompt-prefix = "(nix) ";

  inputs.flake-utils = {
    url = "github:numtide/flake-utils";
    inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        packages.default = pkgs.stdenv.mkDerivation {
          name = "git-teaching-material";
          version = "0.0.1";

          src = ./.;
          
          nativeBuildInputs = with pkgs; [
            pandoc
            texlive.combined.scheme-small
          ];

          installPhase = ''
            cp -r dist/ $out/
          '';
        };
      }
    );
}
