# Releasing

Version lives in `owasp-td-jekyll.gemspec`. Releases are driven by tags, not by pushing to main.

1. Bump the version in the gemspec (e.g. patch: 1.0.2 → 1.0.3) in a PR and merge to main.
2. From main, create and push a tag whose version matches: `git tag v1.0.3 && git push origin v1.0.3`.
3. The release workflow runs on tag push: it sets the gemspec to the tag version, builds the gem, and publishes to RubyGems.

Tag format must be `v` plus the version (e.g. `v1.0.3`).
