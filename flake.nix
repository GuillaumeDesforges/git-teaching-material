{
  nixConfig.bash-prompt-prefix = "(nix) ";

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
