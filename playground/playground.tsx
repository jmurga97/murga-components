import { useState } from "react";

import { registerMurgaComponents } from "../src";
import { McInput, McTagPicker } from "../src/react";

registerMurgaComponents();

const tags = [
  { id: "editorial", label: "Editorial" },
  { id: "portrait", label: "Portrait" },
  { id: "analog", label: "Analog" },
];

export function Playground() {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(["editorial"]);

  return (
    <main className="playground">
      <header className="hero">
        <p className="eyebrow">[MURGA COMPONENTS / 0.1.0]</p>
        <h1>Web components for dense editorial interfaces.</h1>
        <p>
          A manual Vite playground for checking the public Lit components and their React wrappers.
        </p>
      </header>

      <section className="grid" aria-label="Component examples">
        <article className="panel panel-wide">
          <mc-overview-panel
            title="Library overview"
            description="ES modules, explicit registration and optional React wrappers."
            stats={[
              { id: "components", label: "Components", value: "24" },
              { id: "entries", label: "Public entries", value: "3+" },
            ]}
          />
        </article>

        <article className="panel">
          <div className="panel-heading">
            <span>Actions</span>
            <mc-badge tone="accent">LIVE</mc-badge>
          </div>
          <div className="stack">
            <mc-button variant="primary">Publish package</mc-button>
            <mc-button variant="secondary">Inspect build</mc-button>
            <mc-status-text tone="success" label="[BUILD READY]" />
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <span>Inputs</span>
            <span className="meta">CONTROLLED</span>
          </div>
          <div className="stack">
            <McInput inputId="package-name" value="@murga/components" ariaLabel="Package name" />
            <McTagPicker
              inputId="tags"
              open={pickerOpen}
              options={tags}
              selectedIds={selectedIds}
              onMcChange={(event) => setSelectedIds(event.detail.selectedIds)}
              onMcOpenChange={(event) => setPickerOpen(event.detail.open)}
            />
          </div>
        </article>

        <article className="panel panel-wide">
          <mc-inline-message
            tone="success"
            title="Explicit registration"
            message="Import the register entrypoint for every component, or define individual components from granular entrypoints."
          />
        </article>
      </section>
    </main>
  );
}
