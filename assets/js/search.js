(function () {
  const searchRoot = document.querySelector("[data-search]");

  if (!searchRoot) {
    return;
  }

  const searchInput = searchRoot.querySelector("[data-search-input]");
  const searchResults = searchRoot.querySelector("[data-search-results]");
  const searchModal = document.getElementById("tdSearchModal");
  const searchTriggers = Array.from(document.querySelectorAll('[data-bs-target="#tdSearchModal"]'));
  const minimumQueryLength = 2;
  const maxResults = 8;
  const searchIndexUrl = `${window.location.origin}${document.documentElement.getAttribute("data-baseurl") || ""}/assets/search.json`;
  let searchIndexPromise;
  let activeResultIndex = -1;

  const getResultLinks = () => Array.from(searchResults.querySelectorAll(".td-search-result"));

  const escapeHtml = (value) =>
    value.replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character]));

  const normalize = (value) => value.toLowerCase().replace(/\s+/g, " ").trim();

  const trimSnippet = (value) => {
    if (value.length <= 160) {
      return value;
    }

    return `${value.slice(0, 157)}...`;
  };

  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const cleanText = (value) => value
    .replace(/\s+/g, " ")
    .trim();

  const getStructuredSourceBlocks = (contentHtml) => {
    if (!contentHtml) {
      return [];
    }

    const parser = new DOMParser();
    const documentFragment = parser.parseFromString(`<div>${contentHtml}</div>`, "text/html");
    const blockSelectors = "tr, p, li, h1, h2, h3, h4, h5, h6, pre, code, blockquote";

    return Array.from(documentFragment.querySelectorAll(blockSelectors))
      .map((element) => {
        if (element.tagName === "TR") {
          return cleanText(Array.from(element.children).map((cell) => cell.textContent || "").join(" | "));
        }

        if (element.tagName === "PRE") {
          return cleanText(element.textContent || "");
        }

        return cleanText(element.textContent || "");
      })
      .filter(Boolean);
  };

  const buildSourceSnippet = (entry, query) => {
    const contentHtml = entry.content_html || "";

    if (!contentHtml) {
      return "";
    }

    const sourceLines = getStructuredSourceBlocks(contentHtml);

    const matchingLine = sourceLines.find((line) => normalize(line).includes(query));

    if (!matchingLine) {
      return "";
    }

    return trimSnippet(matchingLine);
  };

  const buildPathLabel = (entry) => {
    if (entry.group_display) {
      return `${entry.group_display} > ${entry.title_display}`;
    }

    return entry.title_display;
  };

  const buildSnippet = (entry, query) => {
    const sourceSnippet = buildSourceSnippet(entry, query);

    if (sourceSnippet) {
      return sourceSnippet;
    }

    const normalizedContent = entry.content || "";
    const displayContent = entry.content_display || "";

    if (!displayContent) {
      return "";
    }

    const matchIndex = normalizedContent.indexOf(query);

    if (matchIndex === -1) {
      return trimSnippet(displayContent);
    }

    const snippetRadius = 80;
    const snippetLength = snippetRadius * 2;
    const contentLength = displayContent.length;
    const idealStart = Math.max(0, matchIndex - snippetRadius);
    const start = Math.min(idealStart, Math.max(0, contentLength - snippetLength));
    const end = Math.min(contentLength, start + snippetLength);
    const prefix = start > 0 ? "..." : "";
    const suffix = end < contentLength ? "..." : "";

    return `${prefix}${displayContent.slice(start, end).trim()}${suffix}`;
  };

  const setExpanded = (expanded) => {
    searchInput.setAttribute("aria-expanded", expanded ? "true" : "false");
  };

  const hideResults = () => {
    searchResults.hidden = true;
    searchResults.innerHTML = "";
    searchResults.scrollTop = 0;
    activeResultIndex = -1;
    setExpanded(false);
  };

  const showStatus = (message) => {
    searchResults.hidden = false;
    searchResults.innerHTML = `<div class="td-search-status">${escapeHtml(message)}</div>`;
    searchResults.scrollTop = 0;
    activeResultIndex = -1;
    setExpanded(true);
  };

  const updateActiveResult = (nextIndex) => {
    const resultLinks = getResultLinks();

    if (!resultLinks.length) {
      activeResultIndex = -1;
      return;
    }

    const normalizedIndex = ((nextIndex % resultLinks.length) + resultLinks.length) % resultLinks.length;

    resultLinks.forEach((link, index) => {
      const isActive = index === normalizedIndex;
      link.classList.toggle("is-active", isActive);
      link.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    activeResultIndex = normalizedIndex;
    resultLinks[normalizedIndex].scrollIntoView({ block: "nearest" });
  };

  const loadSearchIndex = async () => {
    if (!searchIndexPromise) {
      searchIndexPromise = fetch(searchIndexUrl, {
        headers: { Accept: "application/json" }
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`Search index unavailable: ${response.status}`);
        }

        return response.json();
      });
    }

    return searchIndexPromise;
  };

  const scoreResult = (entry, query) => {
    const exactTokenPattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(query)}([^a-z0-9]|$)`);
    let score = 0;

    if (entry.title === query) {
      score += 40;
    } else if (exactTokenPattern.test(entry.title)) {
      score += 24;
    } else if (entry.title.startsWith(query)) {
      score += 16;
    } else if (entry.title.includes(query)) {
      score += 10;
    }

    if (entry.group === query) {
      score += 18;
    } else if (exactTokenPattern.test(entry.group)) {
      score += 12;
    } else if (entry.group.startsWith(query)) {
      score += 8;
    } else if (entry.group.includes(query)) {
      score += 4;
    }

    if (exactTokenPattern.test(entry.content)) {
      score += 6;
    } else if (entry.content.includes(query)) {
      score += 2;
    }

    return score;
  };

  const renderResults = (results) => {
    if (!results.length) {
      showStatus("No matching pages found.");
      return;
    }

    searchResults.hidden = false;
    searchResults.innerHTML = results.map((result) => {
      return `
        <a class="td-search-result" href="${escapeHtml(result.url)}" role="option" aria-selected="false">
          <span class="td-search-result-path">${escapeHtml(result.pathLabel)}</span>
          <span class="td-search-result-title">${escapeHtml(result.titleLabel)}</span>
          ${result.snippet ? `<span class="td-search-result-snippet">${escapeHtml(result.snippet)}</span>` : ""}
        </a>
      `;
    }).join("");
    searchResults.scrollTop = 0;
    activeResultIndex = -1;
    setExpanded(true);
  };

  const runSearch = async () => {
    const query = normalize(searchInput.value);

    if (query.length < minimumQueryLength) {
      hideResults();
      return;
    }

    showStatus("Searching...");

    try {
      const entries = await loadSearchIndex();
      const results = entries
        .map((entry) => ({
          ...entry,
          score: scoreResult(entry, query)
        }))
        .filter((entry) => entry.score > 0)
        .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
        .slice(0, maxResults)
        .map((entry) => ({
          pathLabel: buildPathLabel(entry),
          titleLabel: entry.title_display,
          url: entry.url,
          snippet: buildSnippet(entry, query)
        }));

      renderResults(results);
    } catch (error) {
      showStatus("Search is unavailable right now.");
    }
  };

  searchInput.addEventListener("input", () => {
    void runSearch();
  });

  searchInput.addEventListener("focus", () => {
    if (searchInput.value.trim().length >= minimumQueryLength) {
      void runSearch();
    }
  });

  searchInput.addEventListener("keydown", (event) => {
    const resultLinks = getResultLinks();

    if (!resultLinks.length || searchResults.hidden) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      updateActiveResult(activeResultIndex + 1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      updateActiveResult(activeResultIndex === -1 ? resultLinks.length - 1 : activeResultIndex - 1);
      return;
    }

    if (event.key === "Enter" && activeResultIndex >= 0) {
      event.preventDefault();
      resultLinks[activeResultIndex].click();
    }
  });

  document.addEventListener("click", (event) => {
    if (!searchRoot.contains(event.target)) {
      hideResults();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.activeElement === searchInput) {
      hideResults();
      searchInput.blur();
    }
  });

  if (searchModal) {
    searchModal.addEventListener("shown.bs.modal", () => {
      searchInput.focus();

      if (searchInput.value.trim().length >= minimumQueryLength) {
        void runSearch();
      }
    });

    searchModal.addEventListener("hide.bs.modal", () => {
      if (searchModal.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    });

    searchModal.addEventListener("hidden.bs.modal", () => {
      searchInput.value = "";
      hideResults();

      const firstTrigger = searchTriggers[0];

      if (firstTrigger) {
        firstTrigger.focus();
      }
    });
  }
})();
