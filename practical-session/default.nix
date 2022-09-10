{ stdenv
, pandoc
, texlive
}:

stdenv.mkDerivation {
  name = "git-teaching-material-practical-session";
  version = "0.0.1";

  src = ./.;

  nativeBuildInputs = [
    pandoc
    texlive.combined.scheme-small
  ];

  installPhase = ''
    cp -r dist/ $out/
  '';
}
