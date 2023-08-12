{ mkYarnPackage
, fetchYarnDeps
, which
, google-chrome
, fetchFromGitHub
}:

mkYarnPackage {
  name = "git-teaching-material-presentation";

  src = ./.;

  offlineCache = fetchYarnDeps {
    yarnLock = ./yarn.lock;
    hash = "sha256-PL0qj6o2zqp25eWq/uu6mGyrBrcEl6/uJiDfDECsxSI=";
  };

  pkgConfig = {
    "@marp-team/marp-cli" =
      let
        marp-cli-forked-src = fetchFromGitHub {
          owner = "GuillaumeDesforges";
          repo = "marp-cli";
          rev = "converter-async-render";
          sha256 = "Kj4d1DeKtgFvD6pNFs3TbyQFAAqlaLE2kv8INsI3FXY=";
        };
        marp-cli-forked = mkYarnPackage {
          name = "marp-cli";
          src = marp-cli-forked-src;

          offlineCache = fetchYarnDeps {
            yarnLock = "${marp-cli-forked-src}/yarn.lock";
            hash = "sha256-BogCt7ezmWxv2YfhljHYoBf47/FHR0qLZosjnoQhqgs=";
          };

          buildPhase = ''
            yarn --offline build
          '';
        };
      in {
        postInstall = ''
          cp -r ${marp-cli-forked}/libexec/@marp-team/marp-cli/node_modules/@marp-team/marp-cli/lib/ ./lib
          chmod -R +w ./lib
        '';
      };
  };

  nativeBuildInputs = [
    which
    google-chrome
  ];

  CHROME_PATH="${google-chrome}/bin/google-chrome-stable";

  buildPhase = ''
    export HOME=$PWD/yarn_home
    # can't build PDF ("Navigation timeout of 30000 ms exceeded")
    yarn --offline build:html
  '';

  # We don't need dist tarball.
  distPhase = "true";

  installPhase = ''
    cp -R deps/*/dist/ $out
  '';
}
