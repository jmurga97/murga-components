import type { McAppShell, McAppShellArgs } from "../components/mc-app-shell";
import type { McBadge, McBadgeArgs } from "../components/mc-badge";
import type { McButton, McButtonArgs } from "../components/mc-button";
import type { McCheckbox, McCheckboxArgs } from "../components/mc-checkbox";
import type { McConfirmAction, McConfirmActionArgs } from "../components/mc-confirm-action";
import type { McField, McFieldArgs } from "../components/mc-field";
import type { McInlineMessage, McInlineMessageArgs } from "../components/mc-inline-message";
import type { McInput, McInputArgs } from "../components/mc-input";
import type { McMediaBrowser, McMediaBrowserArgs } from "../components/mc-media-browser";
import type { McNavList, McNavListArgs } from "../components/mc-nav-list";
import type { McOverviewPanel, McOverviewPanelArgs } from "../components/mc-overview-panel";
import type { McPagination, McPaginationArgs } from "../components/mc-pagination";
import type {
  McRelationshipPanel,
  McRelationshipPanelArgs,
} from "../components/mc-relationship-panel";
import type { McResourceEditor, McResourceEditorArgs } from "../components/mc-resource-editor";
import type { McResourceTable, McResourceTableArgs } from "../components/mc-resource-table";
import type { McSearchField, McSearchFieldArgs } from "../components/mc-search-field";
import type { McSelect, McSelectArgs } from "../components/mc-select";
import type { McSidebarNav, McSidebarNavArgs } from "../components/mc-sidebar-nav";
import type { McStatusText, McStatusTextArgs } from "../components/mc-status-text";
import type { McTagList, McTagListArgs } from "../components/mc-tag-list";
import type { McTagPicker, McTagPickerArgs } from "../components/mc-tag-picker";
import type { McTextarea, McTextareaArgs } from "../components/mc-textarea";
import type { McThemeSwitcher, McThemeSwitcherArgs } from "../components/mc-theme-switcher";
import type { McThumbnail, McThumbnailArgs } from "../components/mc-thumbnail";
import type { McThumbnailRail, McThumbnailRailArgs } from "../components/mc-thumbnail-rail";
import type { McTheme } from "../internal/contracts";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

export type GenericWebComponent<P, T extends HTMLElement = HTMLElement> = DetailedHTMLProps<
  HTMLAttributes<T>,
  T
> &
  Omit<P, "ariaLabel">;

type McThemeSwitcherJsxProps = GenericWebComponent<McThemeSwitcherArgs, McThemeSwitcher> & {
  "onmc-theme-change"?: (event: CustomEvent<{ theme: McTheme }>) => void;
};

declare module "react/jsx-runtime" {
  // Module augmentation follows React's JSX namespace contract.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "mc-app-shell": GenericWebComponent<McAppShellArgs, McAppShell>;
      "mc-badge": GenericWebComponent<McBadgeArgs, McBadge>;
      "mc-button": GenericWebComponent<McButtonArgs, McButton>;
      "mc-checkbox": GenericWebComponent<McCheckboxArgs, McCheckbox>;
      "mc-confirm-action": GenericWebComponent<McConfirmActionArgs, McConfirmAction>;
      "mc-field": GenericWebComponent<McFieldArgs, McField>;
      "mc-inline-message": GenericWebComponent<McInlineMessageArgs, McInlineMessage>;
      "mc-input": GenericWebComponent<McInputArgs, McInput>;
      "mc-media-browser": GenericWebComponent<McMediaBrowserArgs, McMediaBrowser>;
      "mc-nav-list": GenericWebComponent<McNavListArgs, McNavList>;
      "mc-overview-panel": GenericWebComponent<McOverviewPanelArgs, McOverviewPanel>;
      "mc-pagination": GenericWebComponent<McPaginationArgs, McPagination>;
      "mc-relationship-panel": GenericWebComponent<McRelationshipPanelArgs, McRelationshipPanel>;
      "mc-resource-editor": GenericWebComponent<McResourceEditorArgs, McResourceEditor>;
      "mc-resource-table": GenericWebComponent<McResourceTableArgs, McResourceTable>;
      "mc-search-field": GenericWebComponent<McSearchFieldArgs, McSearchField>;
      "mc-select": GenericWebComponent<McSelectArgs, McSelect>;
      "mc-sidebar-nav": GenericWebComponent<McSidebarNavArgs, McSidebarNav>;
      "mc-status-text": GenericWebComponent<McStatusTextArgs, McStatusText>;
      "mc-tag-list": GenericWebComponent<McTagListArgs, McTagList>;
      "mc-tag-picker": GenericWebComponent<McTagPickerArgs, McTagPicker>;
      "mc-textarea": GenericWebComponent<McTextareaArgs, McTextarea>;
      "mc-theme-switcher": McThemeSwitcherJsxProps;
      "mc-thumbnail": GenericWebComponent<McThumbnailArgs, McThumbnail>;
      "mc-thumbnail-rail": GenericWebComponent<McThumbnailRailArgs, McThumbnailRail>;
    }
  }
}
