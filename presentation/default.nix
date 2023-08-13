{ mkYarnPackage
, fetchYarnDeps
, which
, chromium
, fetchFromGitHub
}:

mkYarnPackage {
  name = "git-teaching-material-presentation";

  src = ./.;

  offlineCache = fetchYarnDeps {
    yarnLock = ./yarn.lock;
    hash = "sha256-BBzPHPnO4jOR5jA6CKxZSj7Y5fJXRryPzcE9B8Jt8ZE=";
  };

  nativeBuildInputs = [
    which
    chromium
  ];

  buildPhase = ''
    export HOME=$PWD/yarn_home
    
    export DEBUG="puppeteer:*"
    export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
    export PUPPETEER_EXECUTABLE_PATH="${chromium}/bin/chromium"
    # can't build PDF ("Navigation timeout of 30000 ms exceeded")
    yarn --offline build:html
  '';

  # We don't need dist tarball.
  distPhase = "true";

  installPhase = ''
    cp -R deps/*/dist/ $out
  '';
}
