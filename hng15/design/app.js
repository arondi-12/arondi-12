const flights = {
  "ZD-114": {
    id: "ZD-114",
    agent: "Quill",
    title: "Fix the pricing “Compare plans” CTA",
    initial: "briefed",
    scopeIn: [
      "The pricing section CTA and its href",
      "The comparison table anchor on /pricing",
      "One focused commit on central-staging",
    ],
    scopeOut: [
      "Pricing amounts or plan names",
      "The billing flow behind sign-in",
      "Unrelated homepage copy",
    ],
    evidence:
      "Show the old href resolving to a 404, then the new href and anchor in the built HTML.",
    stop: "The comparison table moves or the CTA needs a billing-flow change. Ask first.",
    report: {
      changed:
        "The “Compare different plans” CTA now links to /pricing#compare-plans instead of a relative path that resolved under /pricing and returned 404. The comparison table gained a scroll anchor.",
      checks: [
        "Built HTML contains href=\"/pricing#compare-plans\" and id=\"compare-plans\".",
        "The old /pricing/client/... URL still returns 404 on the live site.",
        "Prettier and ESLint pass for both changed files.",
      ],
      assumptions: [
        "“Compare plans” should scroll to the table, not open billing.",
        "The sticky header needs 24 units of scroll margin.",
      ],
      rollback:
        "Revert commit 858cc46; no data or schema changes are involved.",
    },
  },
  "ZD-207": {
    id: "ZD-207",
    agent: "Moss",
    title: "Rewrite the sign-up page’s first sentence",
    initial: "holding",
    scopeIn: [
      "One sentence of sign-up microcopy",
      "The page’s meta description",
    ],
    scopeOut: [
      "The sign-up form fields",
      "Authentication behaviour",
      "Pricing claims",
    ],
    evidence:
      "Before/after screenshots at 390px and 1440px, plus a readability check.",
    stop: "The sentence implies a feature the product does not have. Ask for product sign-off.",
    report: {
      changed:
        "The sign-up intro now says what happens after the form, in one sentence, without promising a feature that is not shipped.",
      checks: [
        "Rendered at 390px and 1440px; no wrapping regression.",
        "Meta description is under 155 characters.",
        "Copy reviewed against the Zedu brief’s out-of-scope claims.",
      ],
      assumptions: [
        "The user has already chosen Zedu; the page should explain the next step.",
      ],
      rollback: "Revert the copy commit; no migration or feature flag.",
    },
  },
  "ZD-088": {
    id: "ZD-088",
    agent: "Ada",
    title: "Stop emoji reactions from executing script",
    initial: "landed",
    scopeIn: [
      "AppleEmojiText and its tokenizer",
      "The emoji image attributes",
    ],
    scopeOut: [
      "Message markdown rendering",
      "The reaction picker",
      "Backend storage",
    ],
    evidence:
      "Render the payload before and after the fix and compare the HTML output.",
    stop: "The change needs a new dependency or touches the message renderer. Ask first.",
    report: {
      changed:
        "AppleEmojiText no longer uses dangerouslySetInnerHTML. It tokenises the text and renders React nodes, so HTML in a reaction is escaped and only real emoji become images.",
      checks: [
        "Before: <img src=x onerror=\"alert(1)\"> appears as live HTML.",
        "After: the payload appears as &lt;img …&gt; text and the emoji still renders.",
        "ESLint and Prettier pass for the changed files.",
      ],
      assumptions: [
        "Reaction text is user-controlled and must be treated as untrusted.",
        "Emoji inside code blocks are out of scope for this component.",
      ],
      rollback:
        "Revert commit 6a37b65; the tokenizer is additive and no data changes.",
    },
  },
};

const state = Object.fromEntries(
  Object.entries(flights).map(([id, flight]) => [id, flight.initial])
);

let currentId = "ZD-114";
let editorOpen = false;

const el = (id) => document.getElementById(id);
const statusText = {
  briefed: "Awaiting clearance",
  cleared: "In flight · next checkpoint 12 min",
  holding: "Holding for a decision",
  landed: "Landed · report ready",
  approved: "Approved",
};
const boardText = {
  briefed: "Briefed",
  cleared: "In flight",
  holding: "Holding",
  landed: "Landed",
  approved: "Approved",
};

function setList(node, items) {
  node.replaceChildren();
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item;
    node.append(li);
  }
}

function render() {
  const flight = flights[currentId];
  const current = state[currentId];
  const report = el("report");

  el("flight-id").textContent = flight.id;
  el("flight-agent").textContent = flight.agent;
  el("flight-title").textContent = flight.title;
  el("flight-evidence").textContent = flight.evidence;
  el("flight-stop").textContent = flight.stop;
  setList(el("scope-in"), flight.scopeIn);
  setList(el("scope-out"), flight.scopeOut);

  const status = el("flight-status");
  status.textContent = statusText[current];
  status.dataset.state = current;

  document.querySelectorAll(".board-row").forEach((row) => {
    const id = row.dataset.flight;
    row.classList.toggle("is-active", id === currentId);
    row.querySelector("[data-board-status]").textContent = boardText[state[id]];
  });

  const clear = el("clear-flight");
  const hold = el("hold-flight");
  const land = el("land-flight");
  const reset = el("reset-flight");

  clear.hidden = !["briefed", "holding"].includes(current);
  clear.textContent =
    current === "holding" ? "Answer & clear for takeoff" : "Clear for takeoff";
  hold.hidden = current !== "cleared";
  land.hidden = current !== "cleared";
  reset.hidden = !["landed", "approved"].includes(current);

  report.hidden = !["landed", "approved"].includes(current);
  el("report-id").textContent = flight.id;
  el("report-changed").textContent = flight.report.changed;
  setList(el("report-checks"), flight.report.checks);
  setList(el("report-assumptions"), flight.report.assumptions);
  el("report-rollback").textContent = flight.report.rollback;
  el("report-thanks").hidden = current !== "approved";
  el("approve-report").hidden = current === "approved";
  el("change-report").hidden = current === "approved";

  const constraint = flight.constraint;
  const copy = el("constraint-copy");
  copy.textContent = constraint
    ? `“${constraint}”`
    : "None yet. Add one without sending the task back.";
  copy.classList.toggle("is-set", Boolean(constraint));
}

function setState(next) {
  state[currentId] = next;
  render();
}

document.querySelectorAll(".board-row").forEach((row) => {
  row.addEventListener("click", () => {
    currentId = row.dataset.flight;
    editorOpen = false;
    document.querySelector(".constraint-editor")?.remove();
    render();
  });
});

el("clear-flight").addEventListener("click", () => setState("cleared"));
el("hold-flight").addEventListener("click", () => setState("holding"));
el("land-flight").addEventListener("click", () => setState("landed"));
el("reset-flight").addEventListener("click", () => {
  state[currentId] = flights[currentId].initial;
  render();
});
el("approve-report").addEventListener("click", () => setState("approved"));
el("change-report").addEventListener("click", () => {
  setState("cleared");
  openConstraintEditor("One change: describe the single adjustment");
});

el("add-constraint").addEventListener("click", () => {
  if (editorOpen) return;
  openConstraintEditor();
});

function openConstraintEditor(
  placeholder = "e.g. Don’t touch the pricing heading"
) {
  if (editorOpen) return;
  editorOpen = true;

  const bar = document.querySelector(".constraint-bar");
  const form = document.createElement("form");
  form.className = "constraint-editor";

  const label = document.createElement("label");
  label.className = "sr-only";
  label.htmlFor = "constraint-input";
  label.textContent = "Add a constraint for this flight";

  const input = document.createElement("input");
  input.id = "constraint-input";
  input.name = "constraint";
  input.maxLength = 90;
  input.placeholder = placeholder;
  input.autocomplete = "off";

  const save = document.createElement("button");
  save.type = "submit";
  save.className = "btn btn-small btn-mint";
  save.textContent = "Save";

  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "btn btn-small btn-paper";
  cancel.textContent = "Cancel";

  form.append(label, input, save, cancel);
  bar.append(form);
  input.focus();

  const close = () => {
    editorOpen = false;
    form.remove();
  };

  cancel.addEventListener("click", close);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (value) flights[currentId].constraint = value;
    close();
    render();
  });
  form.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

render();

