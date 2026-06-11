import { createElement, forwardRef, useCallback, useRef } from "react";

import type { ForwardedRef, HTMLAttributes, ReactNode } from "react";

export type ReactWrapperProps<
  TElement extends HTMLElement,
  TPropertyProps extends object,
  TEventProps extends object,
> = TPropertyProps &
  TEventProps &
  Omit<HTMLAttributes<TElement>, keyof TPropertyProps | keyof TEventProps> & {
    children?: ReactNode;
  };

export function createReactWrapper<
  TElement extends HTMLElement,
  TPropertyProps extends object,
  TEventProps extends object,
>(config: { tagName: string; eventMap: Record<keyof TEventProps, `mc-${string}`> }) {
  type Props = ReactWrapperProps<TElement, TPropertyProps, TEventProps>;
  const { eventMap, tagName } = config;
  const eventEntries = Object.entries(eventMap as Record<string, `mc-${string}`>);
  const eventKeySet = new Set(eventEntries.map(([propName]) => propName));

  return forwardRef<TElement, Props>(function MurgaReactWrapper(props, forwardedRef) {
    const latestProps = useRef(props);
    const latestForwardedRef = useRef(forwardedRef);

    latestProps.current = props;
    latestForwardedRef.current = forwardedRef;

    const setRef = useCallback((element: TElement | null) => {
      if (!element) {
        return;
      }

      const mountedForwardedRef = latestForwardedRef.current;
      const forwardedRefCleanup = assignRef(mountedForwardedRef, element);
      const listeners = eventEntries.map(([propName, eventName]) => {
        const listener = (event: Event) => {
          const currentProps = latestProps.current as Record<string, unknown>;
          const handler = currentProps[propName];

          if (typeof handler === "function") {
            (handler as (event: Event) => void)(event);
          }
        };

        element.addEventListener(eventName, listener);

        return { eventName, listener };
      });

      return () => {
        for (const { eventName, listener } of listeners) {
          element.removeEventListener(eventName, listener);
        }

        if (forwardedRefCleanup) {
          forwardedRefCleanup();
        } else {
          assignRef(mountedForwardedRef, null);
        }
      };
    }, []);

    const domProps: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(props as Record<string, unknown>)) {
      if (key === "children" || eventKeySet.has(key)) {
        continue;
      }

      domProps[key === "ariaLabel" ? "aria-label" : key] = value;
    }

    const children = (props as { children?: ReactNode }).children;

    return createElement(tagName, { ...domProps, ref: setRef }, children);
  });
}

function assignRef<TElement>(
  ref: ForwardedRef<TElement>,
  value: TElement | null,
): (() => void) | undefined {
  if (typeof ref === "function") {
    return ref(value) ?? undefined;
  }

  if (ref) {
    ref.current = value;
  }

  return undefined;
}
