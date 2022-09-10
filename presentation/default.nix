{ stdenv
, mkYarnPackage
}:

stdenv.mkDerivation {
  name = "git-teaching-material-presentation";
  version = "0.0.1";

  src = ./.;

  nativeBuildInputs = [];

  installPhase = ''
    cp -r dist/ $out/
  '';
}
