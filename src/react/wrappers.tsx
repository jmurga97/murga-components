import { createReactWrapper } from "./create-react-wrapper";

import type { ReactWrapperProps } from "./create-react-wrapper";
import type { McAppShell as McAppShellElement } from "../components/mc-app-shell";
import type { McCheckbox as McCheckboxElement } from "../components/mc-checkbox";
import type { McConfirmAction as McConfirmActionElement } from "../components/mc-confirm-action";
import type { McInput as McInputElement } from "../components/mc-input";
import type { McMediaBrowser as McMediaBrowserElement } from "../components/mc-media-browser";
import type { McNavList as McNavListElement } from "../components/mc-nav-list";
import type { McPagination as McPaginationElement } from "../components/mc-pagination";
import type { McRelationshipPanel as McRelationshipPanelElement } from "../components/mc-relationship-panel";
import type { McResourceEditor as McResourceEditorElement } from "../components/mc-resource-editor";
import type { McResourceTable as McResourceTableElement } from "../components/mc-resource-table";
import type { McSearchField as McSearchFieldElement } from "../components/mc-search-field";
import type { McSelect as McSelectElement } from "../components/mc-select";
import type { McSidebarNav as McSidebarNavElement } from "../components/mc-sidebar-nav";
import type { McTagList as McTagListElement } from "../components/mc-tag-list";
import type { McTagPicker as McTagPickerElement } from "../components/mc-tag-picker";
import type { McTextarea as McTextareaElement } from "../components/mc-textarea";
import type { McThumbnail as McThumbnailElement } from "../components/mc-thumbnail";
import type { McThumbnailRail as McThumbnailRailElement } from "../components/mc-thumbnail-rail";

type ChangeHandler = (event: CustomEvent<{ value: string }>) => void;
type CheckboxChangeHandler = (event: CustomEvent<{ checked: boolean; value: string }>) => void;
type OpenChangeHandler = (event: CustomEvent<{ open: boolean }>) => void;
type SelectChangeHandler = (event: CustomEvent<{ selectedId: string | null }>) => void;
type MultiSelectChangeHandler = (event: CustomEvent<{ selectedIds: string[] }>) => void;
type TagSelectHandler = (event: CustomEvent<{ itemId: string; selectedIds: string[] }>) => void;
type SimpleSelectHandler = (event: CustomEvent<{ selectedId: string }>) => void;
type SortHandler = (event: CustomEvent<{ columnId: string }>) => void;
type RowSelectHandler = (event: CustomEvent<{ selectedId: string }>) => void;
type ConfirmHandler = (event: CustomEvent<{ confirmed: boolean }>) => void;
type PageChangeHandler = (event: CustomEvent<{ page: number }>) => void;
type ActionHandler = (event: CustomEvent<{ action: "save" | "cancel" | "delete" }>) => void;

type McAppShellPropertyProps = Partial<Pick<McAppShellElement, "sidebarOpen" | "mobileOverlay">>;
type McAppShellEventProps = {
  onMcSidebarOpenChange?: OpenChangeHandler;
};
export type McAppShellProps = ReactWrapperProps<
  McAppShellElement,
  McAppShellPropertyProps,
  McAppShellEventProps
>;
export const McAppShell = createReactWrapper<
  McAppShellElement,
  McAppShellPropertyProps,
  McAppShellEventProps
>({
  tagName: "mc-app-shell",
  eventMap: {
    onMcSidebarOpenChange: "mc-sidebar-open-change",
  },
});

type McCheckboxPropertyProps = Partial<
  Pick<McCheckboxElement, "checked" | "name" | "value" | "disabled" | "required" | "ariaLabel">
>;
type McCheckboxEventProps = {
  onMcChange?: CheckboxChangeHandler;
};
export type McCheckboxProps = ReactWrapperProps<
  McCheckboxElement,
  McCheckboxPropertyProps,
  McCheckboxEventProps
>;
export const McCheckbox = createReactWrapper<
  McCheckboxElement,
  McCheckboxPropertyProps,
  McCheckboxEventProps
>({
  tagName: "mc-checkbox",
  eventMap: {
    onMcChange: "mc-change",
  },
});

type McInputPropertyProps = Partial<
  Pick<
    McInputElement,
    | "value"
    | "inputId"
    | "name"
    | "type"
    | "placeholder"
    | "autocomplete"
    | "disabled"
    | "required"
    | "readonly"
    | "maxlength"
    | "invalid"
    | "ariaLabel"
  >
>;
type McInputEventProps = {
  onMcInput?: ChangeHandler;
  onMcChange?: ChangeHandler;
};
export type McInputProps = ReactWrapperProps<
  McInputElement,
  McInputPropertyProps,
  McInputEventProps
>;
export const McInput = createReactWrapper<McInputElement, McInputPropertyProps, McInputEventProps>({
  tagName: "mc-input",
  eventMap: {
    onMcInput: "mc-input",
    onMcChange: "mc-change",
  },
});

type McTextareaPropertyProps = Partial<
  Pick<
    McTextareaElement,
    | "value"
    | "inputId"
    | "name"
    | "rows"
    | "placeholder"
    | "disabled"
    | "required"
    | "readonly"
    | "maxlength"
    | "invalid"
    | "ariaLabel"
  >
>;
type McTextareaEventProps = {
  onMcInput?: ChangeHandler;
  onMcChange?: ChangeHandler;
};
export type McTextareaProps = ReactWrapperProps<
  McTextareaElement,
  McTextareaPropertyProps,
  McTextareaEventProps
>;
export const McTextarea = createReactWrapper<
  McTextareaElement,
  McTextareaPropertyProps,
  McTextareaEventProps
>({
  tagName: "mc-textarea",
  eventMap: {
    onMcInput: "mc-input",
    onMcChange: "mc-change",
  },
});

type McSearchFieldPropertyProps = Partial<
  Pick<McSearchFieldElement, "value" | "inputId" | "name" | "placeholder" | "disabled" | "pending">
>;
type McSearchFieldEventProps = {
  onMcInput?: ChangeHandler;
  onMcChange?: ChangeHandler;
  onMcClear?: ChangeHandler;
};
export type McSearchFieldProps = ReactWrapperProps<
  McSearchFieldElement,
  McSearchFieldPropertyProps,
  McSearchFieldEventProps
>;
export const McSearchField = createReactWrapper<
  McSearchFieldElement,
  McSearchFieldPropertyProps,
  McSearchFieldEventProps
>({
  tagName: "mc-search-field",
  eventMap: {
    onMcInput: "mc-input",
    onMcChange: "mc-change",
    onMcClear: "mc-clear",
  },
});

type McConfirmActionPropertyProps = Partial<
  Pick<
    McConfirmActionElement,
    "open" | "tone" | "message" | "confirmLabel" | "cancelLabel" | "disabled" | "pending"
  >
>;
type McConfirmActionEventProps = {
  onMcConfirm?: ConfirmHandler;
  onMcCancel?: OpenChangeHandler;
  onMcOpenChange?: OpenChangeHandler;
};
export type McConfirmActionProps = ReactWrapperProps<
  McConfirmActionElement,
  McConfirmActionPropertyProps,
  McConfirmActionEventProps
>;
export const McConfirmAction = createReactWrapper<
  McConfirmActionElement,
  McConfirmActionPropertyProps,
  McConfirmActionEventProps
>({
  tagName: "mc-confirm-action",
  eventMap: {
    onMcConfirm: "mc-confirm",
    onMcCancel: "mc-cancel",
    onMcOpenChange: "mc-open-change",
  },
});

type McPaginationPropertyProps = Partial<
  Pick<McPaginationElement, "page" | "pageSize" | "total" | "hasMore" | "disabled">
>;
type McPaginationEventProps = {
  onMcPageChange?: PageChangeHandler;
};
export type McPaginationProps = ReactWrapperProps<
  McPaginationElement,
  McPaginationPropertyProps,
  McPaginationEventProps
>;
export const McPagination = createReactWrapper<
  McPaginationElement,
  McPaginationPropertyProps,
  McPaginationEventProps
>({
  tagName: "mc-pagination",
  eventMap: {
    onMcPageChange: "mc-page-change",
  },
});

type McResourceEditorPropertyProps = Partial<
  Pick<McResourceEditorElement, "resourceTitle" | "status" | "dirty" | "saving" | "deleting">
>;
type McResourceEditorEventProps = {
  onMcSave?: ActionHandler;
  onMcCancel?: ActionHandler;
  onMcDelete?: ActionHandler;
};
export type McResourceEditorProps = ReactWrapperProps<
  McResourceEditorElement,
  McResourceEditorPropertyProps,
  McResourceEditorEventProps
>;
export const McResourceEditor = createReactWrapper<
  McResourceEditorElement,
  McResourceEditorPropertyProps,
  McResourceEditorEventProps
>({
  tagName: "mc-resource-editor",
  eventMap: {
    onMcSave: "mc-save",
    onMcCancel: "mc-cancel",
    onMcDelete: "mc-delete",
  },
});

type McSelectPropertyProps = Partial<
  Pick<
    McSelectElement,
    | "options"
    | "selectedId"
    | "inputId"
    | "name"
    | "placeholder"
    | "disabled"
    | "open"
    | "ariaLabel"
  >
>;
type McSelectEventProps = {
  onMcChange?: SelectChangeHandler;
  onMcOpenChange?: OpenChangeHandler;
};
export type McSelectProps = ReactWrapperProps<
  McSelectElement,
  McSelectPropertyProps,
  McSelectEventProps
>;
export const McSelect = createReactWrapper<
  McSelectElement,
  McSelectPropertyProps,
  McSelectEventProps
>({
  tagName: "mc-select",
  eventMap: {
    onMcChange: "mc-change",
    onMcOpenChange: "mc-open-change",
  },
});

type McTagListPropertyProps = Partial<
  Pick<McTagListElement, "items" | "selectedIds" | "interactive">
>;
type McTagListEventProps = {
  onMcSelect?: TagSelectHandler;
};
export type McTagListProps = ReactWrapperProps<
  McTagListElement,
  McTagListPropertyProps,
  McTagListEventProps
>;
export const McTagList = createReactWrapper<
  McTagListElement,
  McTagListPropertyProps,
  McTagListEventProps
>({
  tagName: "mc-tag-list",
  eventMap: {
    onMcSelect: "mc-select",
  },
});

type McTagPickerPropertyProps = Partial<
  Pick<McTagPickerElement, "options" | "selectedIds" | "inputId" | "disabled" | "open">
>;
type McTagPickerEventProps = {
  onMcChange?: MultiSelectChangeHandler;
  onMcOpenChange?: OpenChangeHandler;
};
export type McTagPickerProps = ReactWrapperProps<
  McTagPickerElement,
  McTagPickerPropertyProps,
  McTagPickerEventProps
>;
export const McTagPicker = createReactWrapper<
  McTagPickerElement,
  McTagPickerPropertyProps,
  McTagPickerEventProps
>({
  tagName: "mc-tag-picker",
  eventMap: {
    onMcChange: "mc-change",
    onMcOpenChange: "mc-open-change",
  },
});

type McNavListPropertyProps = Partial<
  Pick<McNavListElement, "items" | "ariaLabel" | "orientation">
>;
type McNavListEventProps = {
  onMcSelect?: SimpleSelectHandler;
};
export type McNavListProps = ReactWrapperProps<
  McNavListElement,
  McNavListPropertyProps,
  McNavListEventProps
>;
export const McNavList = createReactWrapper<
  McNavListElement,
  McNavListPropertyProps,
  McNavListEventProps
>({
  tagName: "mc-nav-list",
  eventMap: {
    onMcSelect: "mc-select",
  },
});

type McThumbnailRailPropertyProps = Partial<
  Pick<McThumbnailRailElement, "items" | "selectedId" | "ariaLabel" | "orientation">
>;
type McThumbnailRailEventProps = {
  onMcSelect?: SimpleSelectHandler;
};
type McThumbnailPropertyProps = Partial<
  Pick<McThumbnailElement, "itemId" | "src" | "alt" | "selected" | "disabled" | "loading" | "ratio">
>;
type McThumbnailEventProps = {
  onMcSelect?: SimpleSelectHandler;
};
export type McThumbnailProps = ReactWrapperProps<
  McThumbnailElement,
  McThumbnailPropertyProps,
  McThumbnailEventProps
>;
export const McThumbnail = createReactWrapper<
  McThumbnailElement,
  McThumbnailPropertyProps,
  McThumbnailEventProps
>({
  tagName: "mc-thumbnail",
  eventMap: {
    onMcSelect: "mc-select",
  },
});

export type McThumbnailRailProps = ReactWrapperProps<
  McThumbnailRailElement,
  McThumbnailRailPropertyProps,
  McThumbnailRailEventProps
>;
export const McThumbnailRail = createReactWrapper<
  McThumbnailRailElement,
  McThumbnailRailPropertyProps,
  McThumbnailRailEventProps
>({
  tagName: "mc-thumbnail-rail",
  eventMap: {
    onMcSelect: "mc-select",
  },
});

type McSidebarNavPropertyProps = Partial<
  Pick<
    McSidebarNavElement,
    "ariaLabel" | "footerItems" | "items" | "secondaryItems" | "open" | "title" | "subtitle"
  >
>;
type McSidebarNavEventProps = {
  onMcSelect?: SimpleSelectHandler;
  onMcOpenChange?: OpenChangeHandler;
};
export type McSidebarNavProps = ReactWrapperProps<
  McSidebarNavElement,
  McSidebarNavPropertyProps,
  McSidebarNavEventProps
>;
export const McSidebarNav = createReactWrapper<
  McSidebarNavElement,
  McSidebarNavPropertyProps,
  McSidebarNavEventProps
>({
  tagName: "mc-sidebar-nav",
  eventMap: {
    onMcSelect: "mc-select",
    onMcOpenChange: "mc-open-change",
  },
});

type McResourceTablePropertyProps = Partial<
  Pick<McResourceTableElement, "columns" | "rows" | "selectedId" | "loading" | "emptyLabel">
>;
type McResourceTableEventProps = {
  onMcRowSelect?: RowSelectHandler;
  onMcSort?: SortHandler;
};
export type McResourceTableProps = ReactWrapperProps<
  McResourceTableElement,
  McResourceTablePropertyProps,
  McResourceTableEventProps
>;
export const McResourceTable = createReactWrapper<
  McResourceTableElement,
  McResourceTablePropertyProps,
  McResourceTableEventProps
>({
  tagName: "mc-resource-table",
  eventMap: {
    onMcRowSelect: "mc-row-select",
    onMcSort: "mc-sort",
  },
});

type McMediaBrowserPropertyProps = Partial<
  Pick<McMediaBrowserElement, "items" | "selectedId" | "showRail" | "emptyLabel">
>;
type McMediaBrowserEventProps = {
  onMcSelect?: SimpleSelectHandler;
};
export type McMediaBrowserProps = ReactWrapperProps<
  McMediaBrowserElement,
  McMediaBrowserPropertyProps,
  McMediaBrowserEventProps
>;
export const McMediaBrowser = createReactWrapper<
  McMediaBrowserElement,
  McMediaBrowserPropertyProps,
  McMediaBrowserEventProps
>({
  tagName: "mc-media-browser",
  eventMap: {
    onMcSelect: "mc-select",
  },
});

type McRelationshipPanelPropertyProps = Partial<
  Pick<McRelationshipPanelElement, "title" | "items" | "emptyLabel">
>;
type McRelationshipPanelEventProps = {
  onMcSelect?: SimpleSelectHandler;
};
export type McRelationshipPanelProps = ReactWrapperProps<
  McRelationshipPanelElement,
  McRelationshipPanelPropertyProps,
  McRelationshipPanelEventProps
>;
export const McRelationshipPanel = createReactWrapper<
  McRelationshipPanelElement,
  McRelationshipPanelPropertyProps,
  McRelationshipPanelEventProps
>({
  tagName: "mc-relationship-panel",
  eventMap: {
    onMcSelect: "mc-select",
  },
});
