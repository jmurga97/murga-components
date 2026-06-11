import { useState } from "react";

import { murgaComponentRegistry, registerMurgaComponents } from "../src";
import {
  McAppShell,
  McCheckbox,
  McConfirmAction,
  McInput,
  McMediaBrowser,
  McNavList,
  McPagination,
  McRelationshipPanel,
  McResourceEditor,
  McResourceTable,
  McSearchField,
  McSelect,
  McSidebarNav,
  McTagList,
  McTagPicker,
  McTextarea,
  McThumbnail,
  McThumbnailRail,
} from "../src/react";

import type {
  McMediaItem,
  McNavItem,
  McOption,
  McTableColumn,
  McTableRow,
  McTagItem,
  McTheme,
} from "../src/internal/contracts";

registerMurgaComponents();

const tags: McOption[] = [
  { id: "editorial", label: "Editorial" },
  { id: "portrait", label: "Portrait" },
  { id: "analog", label: "Analog" },
];

const formats: McOption[] = [
  { id: "raw", label: "RAW", description: "Original camera capture" },
  { id: "tiff", label: "TIFF", description: "Archival master" },
  { id: "jpeg", label: "JPEG", description: "Delivery format" },
];

const navigationItems: McNavItem[] = [
  { id: "overview", label: "Overview", current: true, count: 25 },
  { id: "forms", label: "Forms", count: 7 },
  { id: "media", label: "Media", count: 4 },
];

const sidebarItems: McNavItem[] = [
  { id: "catalog", label: "Catalog", description: "All public components", current: true },
  { id: "controlled", label: "Controlled", description: "React wrapper examples" },
  { id: "composed", label: "Composed", description: "Editorial workflows" },
];

const relationshipItems: McNavItem[] = [
  { id: "collection-07", label: "Collection 07", count: 18 },
  { id: "contact-sheet", label: "Contact sheet", count: 42 },
  { id: "publication", label: "Publication", count: 3 },
];

const tagItems: McTagItem[] = tags.map((tag) => ({
  id: tag.id,
  label: tag.label,
}));

const tableColumns: McTableColumn[] = [
  { id: "name", label: "Asset", sortable: true },
  { id: "format", label: "Format", width: "120px" },
  { id: "status", label: "Status", align: "end", sortable: true },
];

const tableRows: McTableRow[] = [
  { id: "asset-01", cells: { name: "Portrait 01", format: "RAW", status: "Ready" } },
  { id: "asset-02", cells: { name: "Street 12", format: "TIFF", status: "Review" } },
  { id: "asset-03", cells: { name: "Studio 08", format: "JPEG", status: "Published" } },
];

const mediaItems: McMediaItem[] = [
  createMediaItem("frame-red", "Red editorial frame", "#d71921", "#1a1a1a"),
  createMediaItem("frame-blue", "Blue editorial frame", "#5b9bf6", "#111111"),
  createMediaItem("frame-gold", "Gold editorial frame", "#d4a843", "#222222"),
];

function createMediaItem(id: string, alt: string, foreground: string, background: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="${background}"/>
      <circle cx="610" cy="160" r="120" fill="${foreground}" opacity=".9"/>
      <rect x="80" y="100" width="360" height="360" fill="none" stroke="${foreground}" stroke-width="18"/>
      <path d="M80 480L440 120M220 480L580 120" stroke="#f5f5f5" stroke-width="8" opacity=".65"/>
      <text x="80" y="550" fill="#f5f5f5" font-family="monospace" font-size="34">${id.toUpperCase()}</text>
    </svg>
  `;
  const src = `data:image/svg+xml,${encodeURIComponent(svg)}`;

  return { id, src, thumbnailSrc: src, alt, caption: `[${alt.toUpperCase()}]` };
}

export function Playground() {
  const state = useCatalogState();
  const currentSidebarItems = sidebarItems.map((item) => ({
    ...item,
    current: item.id === state.selectedSidebarItem,
  }));

  return (
    <div className="playground" data-mc-theme={state.theme}>
      <McAppShell
        sidebarOpen={state.sidebarOpen}
        onMcSidebarOpenChange={(event) => state.setSidebarOpen(event.detail.open)}
      >
        <McSidebarNav
          slot="sidebar"
          title="Murga components"
          subtitle={`${murgaComponentRegistry.length} registered elements`}
          items={currentSidebarItems}
          footerItems={[{ id: "version", label: "Version 0.1.1" }]}
          onMcSelect={(event) => state.setSelectedSidebarItem(event.detail.selectedId)}
        />

        <header slot="header" className="catalog-header">
          <mc-button
            variant="ghost"
            size="sm"
            aria-label={state.sidebarOpen ? "Close catalog navigation" : "Open catalog navigation"}
            onClick={() => state.setSidebarOpen((open) => !open)}
          >
            {state.sidebarOpen ? "[CLOSE NAV]" : "[OPEN NAV]"}
          </mc-button>
          <div className="catalog-header-title">
            <span className="eyebrow">[COMPONENT PLAYGROUND]</span>
            <span>{state.selectedSidebarItem}</span>
          </div>
          <mc-theme-switcher
            theme={state.theme}
            aria-label="Color theme"
            onmc-theme-change={(event) => state.setTheme(event.detail.theme)}
          />
        </header>

        <main slot="main" className="catalog-main">
          <section className="hero">
            <p className="eyebrow">[@MURGA.ING/COMPONENTS / 0.1.1]</p>
            <h1>Every public component, wired for inspection.</h1>
            <p>
              A manual catalog for checking Lit elements, React wrappers, events, focus behavior and
              both color themes.
            </p>
          </section>
          <CatalogGrid state={state} />
        </main>

        <footer slot="footer" className="catalog-footer">
          <span>{murgaComponentRegistry.length} registered components</span>
          <span>{state.theme} theme</span>
        </footer>
      </McAppShell>
    </div>
  );
}

function useCatalogState() {
  const [theme, setTheme] = useState<McTheme>("dark");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputValue, setInputValue] = useState("@murga.ing/components");
  const [notes, setNotes] = useState("Accessible Lit components for editorial interfaces.");
  const [checked, setChecked] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string | null>("raw");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(["editorial"]);
  const [page, setPage] = useState(2);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState("[READY]");
  const [selectedRow, setSelectedRow] = useState("asset-01");
  const [sortColumn, setSortColumn] = useState("name");
  const [selectedMedia, setSelectedMedia] = useState(mediaItems[0].id);
  const [selectedNavigation, setSelectedNavigation] = useState("overview");
  const [selectedSidebarItem, setSelectedSidebarItem] = useState("catalog");
  const [selectedRelationship, setSelectedRelationship] = useState("collection-07");

  return {
    theme,
    setTheme,
    sidebarOpen,
    setSidebarOpen,
    inputValue,
    setInputValue,
    notes,
    setNotes,
    checked,
    setChecked,
    searchValue,
    setSearchValue,
    selectOpen,
    setSelectOpen,
    selectedFormat,
    setSelectedFormat,
    pickerOpen,
    setPickerOpen,
    selectedTags,
    setSelectedTags,
    page,
    setPage,
    confirmOpen,
    setConfirmOpen,
    actionStatus,
    setActionStatus,
    selectedRow,
    setSelectedRow,
    sortColumn,
    setSortColumn,
    selectedMedia,
    setSelectedMedia,
    selectedNavigation,
    setSelectedNavigation,
    selectedSidebarItem,
    setSelectedSidebarItem,
    selectedRelationship,
    setSelectedRelationship,
  };
}

type CatalogState = ReturnType<typeof useCatalogState>;

function CatalogGrid({ state }: { state: CatalogState }) {
  return (
    <section className="catalog-grid" aria-label="Component catalog">
      <PrimitiveExamples state={state} />
      <FormExamples state={state} />
      <NavigationAndDataExamples state={state} />
      <MediaExamples state={state} />
    </section>
  );
}

function PrimitiveExamples({ state }: { state: CatalogState }) {
  return (
    <>
      <article className="catalog-card catalog-card-wide">
        <ComponentHeading name="mc-overview-panel" detail="Public registry" />
        <mc-overview-panel
          title="Library overview"
          description="Explicit registration, granular entrypoints and optional React wrappers."
          stats={[
            {
              id: "components",
              label: "Components",
              value: String(murgaComponentRegistry.length),
              status: "success",
            },
            { id: "theme", label: "Theme", value: state.theme.toUpperCase() },
            { id: "sort", label: "Table sort", value: state.sortColumn.toUpperCase() },
          ]}
          status={{ tone: "success", label: "[CATALOG READY]" }}
        >
          <mc-badge slot="actions" tone="accent">
            LIVE
          </mc-badge>
        </mc-overview-panel>
      </article>

      <article className="catalog-card">
        <ComponentHeading name="mc-button" detail="Variants and pending state" />
        <div className="stack">
          <mc-button variant="primary">Publish package</mc-button>
          <mc-button variant="secondary">Inspect build</mc-button>
          <mc-button variant="destructive" onClick={() => state.setConfirmOpen(true)}>
            Delete release
          </mc-button>
          <mc-button variant="ghost" size="sm" pending>
            Sync
          </mc-button>
        </div>
      </article>

      <article className="catalog-card">
        <ComponentHeading name="mc-badge + mc-status-text" detail="Status primitives" />
        <div className="inline-list">
          <mc-badge tone="default">Draft</mc-badge>
          <mc-badge tone="success">Ready</mc-badge>
          <mc-badge tone="warning">Review</mc-badge>
          <mc-badge tone="error">Failed</mc-badge>
        </div>
        <div className="stack compact-stack">
          <mc-status-text tone="success" label={state.actionStatus} polite />
          <mc-status-text tone="loading" />
          <mc-status-text tone="error" />
        </div>
      </article>
    </>
  );
}

function FormExamples({ state }: { state: CatalogState }) {
  return (
    <>
      <article className="catalog-card">
        <ComponentHeading name="mc-input + mc-field" detail="Controlled text value" />
        <mc-field
          input-id="package-name"
          label="Package name"
          hint={`Current value: ${state.inputValue}`}
          required
        >
          <McInput
            inputId="package-name"
            value={state.inputValue}
            ariaLabel="Package name"
            onMcInput={(event) => state.setInputValue(event.detail.value)}
          />
        </mc-field>
      </article>

      <article className="catalog-card">
        <ComponentHeading name="mc-textarea" detail="Controlled long-form value" />
        <McTextarea
          inputId="release-notes"
          value={state.notes}
          rows={5}
          ariaLabel="Release notes"
          onMcInput={(event) => state.setNotes(event.detail.value)}
        />
        <p className="catalog-note">{state.notes.length} characters</p>
      </article>

      <article className="catalog-card">
        <ComponentHeading name="mc-checkbox" detail="Boolean state" />
        <label className="control-row">
          <McCheckbox
            checked={state.checked}
            name="include-types"
            ariaLabel="Include TypeScript declarations"
            onMcChange={(event) => state.setChecked(event.detail.checked)}
          />
          <span>Include TypeScript declarations</span>
        </label>
        <p className="catalog-note">{state.checked ? "[INCLUDED]" : "[EXCLUDED]"}</p>
      </article>

      <article className="catalog-card catalog-card-wide">
        <ComponentHeading name="mc-search-field" detail="Input, change and clear events" />
        <McSearchField
          inputId="catalog-search"
          value={state.searchValue}
          placeholder="[SEARCH COMPONENTS]"
          onMcInput={(event) => state.setSearchValue(event.detail.value)}
          onMcClear={() => state.setSearchValue("")}
        />
        <p className="catalog-note">
          {state.searchValue ? `Filtering for "${state.searchValue}"` : "No active filter"}
        </p>
      </article>

      <article className="catalog-card">
        <ComponentHeading name="mc-select" detail="Single selection" />
        <McSelect
          inputId="format"
          name="format"
          options={formats}
          selectedId={state.selectedFormat}
          open={state.selectOpen}
          ariaLabel="Delivery format"
          onMcChange={(event) => state.setSelectedFormat(event.detail.selectedId)}
          onMcOpenChange={(event) => state.setSelectOpen(event.detail.open)}
        />
      </article>

      <article className="catalog-card">
        <ComponentHeading name="mc-tag-picker" detail="Multiple selection" />
        <McTagPicker
          inputId="tags"
          open={state.pickerOpen}
          options={tags}
          selectedIds={state.selectedTags}
          onMcChange={(event) => state.setSelectedTags(event.detail.selectedIds)}
          onMcOpenChange={(event) => state.setPickerOpen(event.detail.open)}
        />
      </article>

      <article className="catalog-card catalog-card-wide">
        <ComponentHeading name="mc-tag-list" detail="Interactive pressed states" />
        <McTagList
          items={tagItems}
          selectedIds={state.selectedTags}
          interactive
          onMcSelect={(event) => state.setSelectedTags(event.detail.selectedIds)}
        />
      </article>
    </>
  );
}

function NavigationAndDataExamples({ state }: { state: CatalogState }) {
  const currentNavigationItems = navigationItems.map((item) => ({
    ...item,
    current: item.id === state.selectedNavigation,
  }));

  return (
    <>
      <article className="catalog-card">
        <ComponentHeading name="mc-nav-list" detail="Horizontal navigation" />
        <McNavList
          items={currentNavigationItems}
          orientation="horizontal"
          ariaLabel="Catalog sections"
          onMcSelect={(event) => state.setSelectedNavigation(event.detail.selectedId)}
        />
      </article>

      <article className="catalog-card">
        <ComponentHeading name="mc-pagination" detail="Page change events" />
        <McPagination
          page={state.page}
          pageSize={10}
          total={47}
          onMcPageChange={(event) => state.setPage(event.detail.page)}
        />
      </article>

      <article className="catalog-card catalog-card-wide">
        <ComponentHeading name="mc-inline-message" detail="Semantic feedback" />
        <div className="stack">
          <mc-inline-message
            tone="success"
            title="Explicit registration"
            message="Components only register through their define function or the register entrypoint."
          />
          <mc-inline-message
            tone="error"
            title="Controlled state"
            message="Interactive examples update their props in response to composed custom events."
          />
        </div>
      </article>

      <article className="catalog-card catalog-card-wide">
        <ComponentHeading name="mc-confirm-action" detail="Confirm and cancel flow" />
        <mc-button variant="destructive" onClick={() => state.setConfirmOpen(true)}>
          Open confirmation
        </mc-button>
        <McConfirmAction
          open={state.confirmOpen}
          message="Delete the selected release?"
          onMcConfirm={() => {
            state.setActionStatus("[DELETE CONFIRMED]");
            state.setConfirmOpen(false);
          }}
          onMcCancel={() => {
            state.setActionStatus("[DELETE CANCELLED]");
            state.setConfirmOpen(false);
          }}
          onMcOpenChange={(event) => state.setConfirmOpen(event.detail.open)}
        />
      </article>

      <article className="catalog-card catalog-card-wide">
        <ComponentHeading name="mc-resource-table" detail="Sort and row selection" />
        <McResourceTable
          columns={tableColumns}
          rows={tableRows}
          selectedId={state.selectedRow}
          onMcSort={(event) => state.setSortColumn(event.detail.columnId)}
          onMcRowSelect={(event) => state.setSelectedRow(event.detail.selectedId)}
        />
      </article>

      <article className="catalog-card catalog-card-wide">
        <ComponentHeading name="mc-resource-editor" detail="Composed editing surface" />
        <McResourceEditor
          resourceTitle="Asset metadata"
          status={{ tone: "success", label: state.actionStatus }}
          dirty={state.inputValue !== "@murga.ing/components"}
          onMcSave={() => state.setActionStatus("[SAVED]")}
          onMcCancel={() => state.setActionStatus("[CANCELLED]")}
          onMcDelete={() => state.setConfirmOpen(true)}
        >
          <div slot="fields" className="stack">
            <mc-field input-id="editor-title" label="Title" optional>
              <McInput
                inputId="editor-title"
                value={state.inputValue}
                ariaLabel="Editor title"
                onMcInput={(event) => state.setInputValue(event.detail.value)}
              />
            </mc-field>
            <mc-field input-id="editor-notes" label="Notes">
              <McTextarea
                inputId="editor-notes"
                value={state.notes}
                rows={3}
                ariaLabel="Editor notes"
                onMcInput={(event) => state.setNotes(event.detail.value)}
              />
            </mc-field>
          </div>
          <McRelationshipPanel
            slot="aside"
            title="Relationships"
            items={relationshipItems}
            onMcSelect={(event) => state.setSelectedRelationship(event.detail.selectedId)}
          />
          <mc-status-text slot="actions" tone="idle" label={state.selectedRelationship} />
        </McResourceEditor>
      </article>

      <article className="catalog-card">
        <ComponentHeading name="mc-relationship-panel" detail="Standalone relationships" />
        <McRelationshipPanel
          title="Used by"
          items={relationshipItems}
          onMcSelect={(event) => state.setSelectedRelationship(event.detail.selectedId)}
        />
        <p className="catalog-note">Selected: {state.selectedRelationship}</p>
      </article>

      <article className="catalog-card">
        <ComponentHeading name="mc-sidebar-nav" detail="Rendered in the app shell" />
        <p className="catalog-note">
          The live sidebar contains navigation, secondary text, counts and footer actions.
        </p>
        <mc-badge tone="success">{state.selectedSidebarItem}</mc-badge>
      </article>

      <article className="catalog-card catalog-card-wide">
        <ComponentHeading name="mc-app-shell" detail="Catalog frame" />
        <p className="catalog-note">
          This entire catalog is rendered inside the app shell. Toggle its controlled sidebar from
          the header and inspect the responsive overlay below 960px.
        </p>
      </article>
    </>
  );
}

function MediaExamples({ state }: { state: CatalogState }) {
  return (
    <>
      <article className="catalog-card catalog-card-wide">
        <ComponentHeading name="mc-media-browser" detail="Keyboard and thumbnail selection" />
        <McMediaBrowser
          items={mediaItems}
          selectedId={state.selectedMedia}
          onMcSelect={(event) => state.setSelectedMedia(event.detail.selectedId)}
        >
          <mc-badge slot="meta" tone="accent">
            {state.selectedMedia}
          </mc-badge>
        </McMediaBrowser>
      </article>

      <article className="catalog-card">
        <ComponentHeading name="mc-thumbnail" detail="Standalone media control" />
        <McThumbnail
          itemId={mediaItems[1].id}
          src={mediaItems[1].src}
          alt={mediaItems[1].alt}
          ratio="landscape"
          selected={state.selectedMedia === mediaItems[1].id}
          onMcSelect={(event) => state.setSelectedMedia(event.detail.selectedId)}
        />
      </article>

      <article className="catalog-card">
        <ComponentHeading name="mc-thumbnail-rail" detail="Vertical media list" />
        <McThumbnailRail
          items={mediaItems}
          selectedId={state.selectedMedia}
          orientation="vertical"
          ariaLabel="Standalone media thumbnails"
          onMcSelect={(event) => state.setSelectedMedia(event.detail.selectedId)}
        />
      </article>
    </>
  );
}

function ComponentHeading({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="component-heading">
      <code>{name}</code>
      <span>{detail}</span>
    </div>
  );
}
