# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "owasp-td-jekyll"
  spec.version       = "0.1.2"
  spec.authors       = ["Leo Reading"]
  spec.email         = ["leo.reading@owasp.org"]

  spec.summary       = "OWASP Threat Dragon documentation theme."
  spec.homepage      = "https://github.com/lreading/owasp-td-jekyll"
  spec.license       = "Apache-2.0"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|LICENSE|README|_config\.yml)!i) }

  spec.add_runtime_dependency "jekyll", "~> 4.2"
end
