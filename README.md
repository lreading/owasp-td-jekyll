# owasp-td-jekyll

This is a jekyll theme meant to be used as a documentation site as opposed to a blog, specifically being designed for [OWASP Threat Dragon](https://github.com/OWASP/threat-dragon).  It is opinionated on the file structure of your documentation for breadcrumbs to work.  An example documentation file directory:
```
|---- environment (group)
|-------- page_1.md 
|-------- page_2.md
|-------- page_3.md
|---- tools (group)
|-------- tool_1.md
|-------- tool_1.md
|---- macos (group)
|-------- page_1.md
|---- windows (group)
|-------- page_1.md
|---- linux (group)
|-------- page_1.md
```

This theme is based on (Mike Goodwin's original Threat Dragon documentation site)[https://github.com/threatdragon/threatdragon.github.io/tree/original]


## TODO
- Document the theme using github pages (and this theme)
- Document using bootstrap classes

## Installation

Add this line to your Jekyll site's `Gemfile`:

```ruby
gem "owasp-td-jekyll"
```

And add this line to your Jekyll site's `_config.yml`:

```yaml
theme: owasp-td-jekyll
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install owasp-td-jekyll

## Usage
### TLDR;
Install the gem
Ensure your pages are structured as `group/page.md`
Add your config:
```
title: OWASP Threat Dragon

theme: owasp-td-jekyll

brand: OWASP Threat Dragon
faviconUrl: /assets/images/favicon.ico

header_links:
  - text: Try the web app
    fa_class: fa fa-flask
    url: https://www.threatdragon.com/#/

  - text: Download the desktop app
    fa_class: fa fa-cloud-download-alt
    target: _blank
    url: https://github.com/OWASP/threat-dragon/releases

  - text: Visit us on GitHub
    fa_class: fab fa-github
    target: _blank
    url: https://github.com/OWASP/threat-dragon


nav:
  categories:
    - name: Development
      groups:
        - name: Environment
          fa_class: fas fa-layer-group
        - name: Contributing
          fa_class: fas fa-user-ninja
    - name: Threat Modeling
      groups:
        - name: Modeling
          fa_class: fas fa-project-diagram
        - name: Icons
          fa_class: fas fa-icons

logo_src: assets/images/threatdragon_logo_image.svg
homeLinks:
  - relative_url: something
    description: This is my description.  There are many like it, but this one is mine.
    fa_class: fas fa-project-diagram
  - relative_url: something_else
    description: This is my description.  There are many like it, but this one is mine.
    fa_class: fas fa-user-ninja

```

### General Config
|Name|Type|Description|
|---|---|---|
|`brand`|string|The brand name to be used as the home link in the navbar|
|`faviconUrl`|string|The relative path to the favicon|
|`header_links`|array<object>|Additional links to be added to the navbar (top, not sidebar)
|`header_links[0].text`|string|The text of the link|
|`header_links[0].fa_class`|string|The font-awesome class to use for the dropdown.  Use the full class, eg `fab fa-github`|
|`header_links[0].url`|string|The url to be used as the href preoprty on the anchor.|
|`header_links[0].target`|string|The `target` property for the anchor. Optional|

### Sidebar
The sidebar is used as the primary navigation for the site, unless it is on a smaller device.  The navigation is built from a combination of properties provided in your `_config.yaml` as well as having the `group` and `nav_order` properties set in your (front matter)[https://jekyllrb.com/docs/front-matter/]

|Name|Description|Required|
|---|---|---|
|`group`|Top level navigation on the sidebar is based on groups.  Associate a page to a group.  If only one page exists in a group, it is just a link as opposed to a dropdown.|yes|
|`nav_order`|The order in which to display the link in the navigation (within the group)|no|

Config for the sidebar, to be put in your `_config.yaml`:
|Name|Type|Description|
|---|---|---|
|`nav`|object|The top-level navigation object|
|`nav.categories`|array<object>|Categories to separate the different menu options.  Used as a logical grouping|
|`nav.categories[].name`|string|The name of the category.  Used for display purposes|
|`nav.categories[].groups`|array<object>|The groups (dropdowns) to be used in the category.|
|`nav.categories[].groups[].name`|string|The name of the group.  This should match the group tag used in your (front matter)[https://jekyllrb.com/docs/front-matter/].  If only a single page exists in a group, the nav will be a link as opposed to drop-down.|
|`nav.categories[].groups[].fa_class`|string|The font-awesome class to use for the dropdown.  Use the full class, eg `fas fa-user-ninja`|


Example nav in `_config.yaml`
```
nav:
  categories:
    - name: Cat 1
      groups:
        - name: My Dropdown
          fa_class: fas-fa-layer-group
```
Example page:
```
---
title: Users
path: modeling/users
group: Cat 1
layout: page
nav_order: 0
---
# Users
Some more text goes here
```
_____
## Layouts

### Home
The home page layout is a special layout.  Text is put into the jumbotron, with an optional image (if configured in the config).  Actions may also be configured for this using the `_config.yaml`.  This was set up with the idea of only ever having a single home page.

Home Options (to be set in your `_config.yaml`):
|Name|Type|Description|Required|
|---|---|---|---|
|`logo_src`|string|The location of your main brand logo|no|
|`homeLinks`|array<object>|The links/actions to display under the main content|no|
|`homeLinks[].relative_url`|string|To be used as a link to a relative page|yes|
|`homeLinks[].description`|string|Text to put under the icon|no|
|`homeLinks[].fa_class`|string|The font-awesome class to use for the dropdown.  Use the full class, eg `fas fa-user-ninja`|yes|

Example home page:
```
---
layout: home
title: Home
path: /
---

# Hello, world!
This is some content I got going on here, thanks for swinging by...
```

### Page
The page layout is the standard layout to be used.  Example page:
```
---
title: Users
path: modeling/users
group: Icons
layout: page
nav_order: 0
---
# Users
Some more text goes here
```

____
## Breadcrumbs
Breadcrumbs rely on the file structure of your documentation to be as follows: `category/group/page.md`.  Please see the top of the readme for a full example tree.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/lreading/owasp-td-jekyll. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## Development

To set up your environment to develop this theme, run `bundle install`.

Your theme is setup just like a normal Jekyll site! To test your theme, run `bundle exec jekyll serve` and open your browser at `http://localhost:4000`. This starts a Jekyll server using your theme. Add pages, documents, data, etc. like normal to test your theme's contents. As you make modifications to your theme and to your content, your site will regenerate and you should see the changes in the browser after a refresh, just like normal.

When your theme is released, only the files in `_layouts`, `_includes`, `_sass` and `assets` tracked with Git will be bundled.
To add a custom directory to your theme-gem, please edit the regexp in `owasp-td-jekyll.gemspec` accordingly.

## License

The theme is available as open source under the terms of the [Apache 2.0 License](http://www.apache.org/licenses/).
