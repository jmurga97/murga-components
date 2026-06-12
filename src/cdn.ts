import { registerMurgaComponents } from "./index";

const MURGA_ICON_SPRITE_ID = "mc-icon-sprite";
let iconSpritePromise: Promise<void> | undefined;

registerMurgaComponents();
void installMurgaIconSprite().catch((error: unknown) => {
  console.error("Unable to load the Murga icon sprite.", error);
});

export { registerMurgaComponents };

export function installMurgaIconSprite(
  spriteUrl = new URL(/* @vite-ignore */ "./icons.svg", import.meta.url),
): Promise<void> {
  if (document.getElementById(MURGA_ICON_SPRITE_ID)) {
    return Promise.resolve();
  }

  iconSpritePromise ??= fetchAndInstallIconSprite(spriteUrl).catch((error: unknown) => {
    iconSpritePromise = undefined;
    throw error;
  });
  return iconSpritePromise;
}

async function fetchAndInstallIconSprite(spriteUrl: URL) {
  const response = await fetch(spriteUrl, { mode: "cors" });
  if (!response.ok) {
    throw new Error(`Icon sprite request failed with ${response.status}.`);
  }

  const spriteDocument = new DOMParser().parseFromString(await response.text(), "image/svg+xml");
  const sprite = spriteDocument.documentElement;
  if (sprite.localName !== "svg" || sprite.querySelector("parsererror")) {
    throw new Error("Icon sprite response is not valid SVG.");
  }

  sprite.id = MURGA_ICON_SPRITE_ID;
  sprite.setAttribute("aria-hidden", "true");
  sprite.setAttribute("focusable", "false");
  sprite.setAttribute(
    "style",
    "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none",
  );
  document.body.prepend(document.importNode(sprite, true));
}
