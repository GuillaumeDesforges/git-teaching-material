{ stdenv
, mkYarnPackage
, marp-cli
, google-chrome
}:

stdenv.mkDerivation {
  name = "git-teaching-material-presentation";
  version = "0.0.1";

  src = ./.;

  nativeBuildInputs = [
    marp-cli
  ];

  # required to build PDF
  # CHROME_PATH = "${google-chrome}/bin/google-chrome-stable";

  installPhase = ''
    mkdir -p $out/
    marp --html --engine ./marp.config.js src/slides.md -o $out/slides.html
    # can't build PDF: requires an internet connection but build is sandboxed
    # marp --html --engine ./marp.config.js src/slides.md -o $out/slides.pdf
  '';
}
