{ stdenv
, mkYarnPackage
, marp-cli
}:

stdenv.mkDerivation {
  name = "git-teaching-material-presentation";
  version = "0.0.1";

  src = ./.;

  installPhase = ''
    mkdir -p $out/
    ${marp-cli}/bin/marp src/slides.md -o $out/slides.html
  '';
}
