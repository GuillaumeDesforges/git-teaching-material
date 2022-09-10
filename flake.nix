{
  nixConfig.bash-prompt-prefix = "(nix) ";

  inputs.nixpkgs.url = "nixos/nixpkgs/e34c5379866833f41e2a36f309912fa675d687c7";
  inputs.flake-utils = {
    url = "github:numtide/flake-utils";
    inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        packages.default = pkgs.runCommand "git-teaching-material" {} ''
          mkdir -p $out
          cp -r ${self.packages.${system}.practical-session} $out/practical-session
        '';
        packages.practical-session = pkgs.callPackage ./practical-session {};
      }
    );
}
