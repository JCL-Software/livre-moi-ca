"use client";

import {
  useState,
  useRef,
  useEffect,
  useId,
  useMemo,
  useCallback,
  type ChangeEvent,
  type ReactNode,
  type Ref,
} from "react";
import { motion } from "motion/react";
import { MapPin } from "@/components/animate-ui/icons/map-pin";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { cn } from "@/lib/utils";

function GooeyFilter({
  filterId,
  blur,
}: {
  filterId: string;
  blur: number;
}) {
  return (
    <svg className="absolute hidden h-0 w-0" aria-hidden>
      <defs>
        <filter id={filterId} x="-8%" y="-40%" width="116%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

function SearchIcon({ layoutId }: { layoutId: string }) {
  return (
    <motion.svg
      layoutId={layoutId}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      className="size-4 shrink-0"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </motion.svg>
  );
}

function MapPinIcon({
  layoutId,
  playAnim,
  animKey = 0,
  size = 16,
}: {
  layoutId: string;
  playAnim?: boolean;
  animKey?: number;
  size?: number;
}) {
  return (
    <motion.span
      layoutId={layoutId}
      className="inline-flex shrink-0 items-center justify-center text-current"
      style={{ width: size, height: size }}
    >
      <MapPin
        key={playAnim ? `map-pin-${animKey}` : "map-pin-idle"}
        size={size}
        animate={playAnim ? "path" : false}
        className="size-full"
      />
    </motion.span>
  );
}

export const GOOEY_INPUT_TRANSITION = {
  duration: 0.4,
  type: "spring" as const,
  bounce: 0.25,
};

const transition = GOOEY_INPUT_TRANSITION;

const iconBubbleVariants = {
  collapsed: { scale: 0, opacity: 0 },
  expanded: { scale: 1, opacity: 1 },
};

export interface GooeyInputClassNames {
  root?: string;
  filterWrap?: string;
  buttonRow?: string;
  trigger?: string;
  input?: string;
  bubble?: string;
  bubbleSurface?: string;
}

export interface GooeyInputProps {
  id?: string;
  placeholder?: string;
  className?: string;
  classNames?: GooeyInputClassNames;
  collapsedWidth?: number | string;
  expandedWidth?: number | string;
  expandedOffset?: number;
  gooeyBlur?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  clearOnCollapse?: boolean;
  icon?: "search" | "map-pin";
  /** Visual tone. `form` matches white rounded-lg inputs. `uber` keeps the 56px home fields. */
  appearance?: "default" | "form" | "uber";
  /** Typewriter hint shown when expanded and empty (Aceternity). */
  typewriterText?: string;
  endAction?: ReactNode;
  children?: ReactNode;
  barRef?: Ref<HTMLDivElement>;
}

export function GooeyInput({
  id,
  placeholder = "Type to search...",
  className,
  classNames,
  collapsedWidth = 115,
  expandedWidth = 200,
  expandedOffset = 50,
  gooeyBlur = 5,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onOpenChange,
  onFocus,
  onBlur,
  disabled = false,
  clearOnCollapse = true,
  icon = "search",
  appearance = "default",
  typewriterText,
  endAction,
  children,
  barRef,
}: GooeyInputProps) {
  const reactId = useId();
  const safeId = reactId.replace(/:/g, "");
  const filterId = `gooey-filter-${safeId}`;
  const iconLayoutId = `gooey-input-icon-${safeId}`;
  const inputLayoutId = `gooey-input-field-${safeId}`;

  const inputRef = useRef<HTMLInputElement>(null);
  const startsExpanded = Boolean(valueProp ?? defaultValue);
  const prevExpandedRef = useRef(startsExpanded);
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(startsExpanded);
  const [typewriterKey, setTypewriterKey] = useState(0);
  const [pinAnimKey, setPinAnimKey] = useState(0);
  const [playPinPath, setPlayPinPath] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const isControlled = valueProp !== undefined;
  const searchText = isControlled ? valueProp : uncontrolledValue;
  const isUber = appearance === "uber";
  const isForm = appearance === "form" || isUber;
  const isMapPin = icon === "map-pin";
  const pinSize = isUber ? 20 : 16;

  useEffect(() => {
    setMounted(true);
  }, []);

  const setSearchText = useCallback(
    (next: string) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const setExpanded = useCallback(
    (next: boolean) => {
      if (!next) {
        setPlayPinPath(false);
      }
      setIsExpanded(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  useEffect(() => {
    const wasExpanded = prevExpandedRef.current;
    if (isExpanded && !wasExpanded) {
      inputRef.current?.focus();
      if (typewriterText) {
        setTypewriterKey((key) => key + 1);
      }
    } else if (!isExpanded && wasExpanded) {
      setPlayPinPath(false);
      if (clearOnCollapse) {
        setSearchText("");
      }
    }
    prevExpandedRef.current = isExpanded;
  }, [isExpanded, setSearchText, clearOnCollapse, typewriterText]);

  useEffect(() => {
    if (searchText && !isExpanded) {
      setExpanded(true);
    }
  }, [searchText, isExpanded, setExpanded]);

  const buttonVariants = useMemo(
    () => ({
      collapsed: { width: collapsedWidth, marginLeft: 0 },
      expanded: {
        width:
          typeof expandedWidth === "string" &&
          expandedWidth === "100%" &&
          expandedOffset > 0
            ? `calc(100% - ${expandedOffset}px)`
            : expandedWidth,
        marginLeft: expandedOffset,
      },
    }),
    [collapsedWidth, expandedWidth, expandedOffset],
  );

  const handleExpand = useCallback(() => {
    if (disabled) return;
    setExpanded(true);
  }, [disabled, setExpanded]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    [setSearchText],
  );

  const handleBlur = useCallback(() => {
    onBlur?.();
    if (!searchText) setExpanded(false);
  }, [searchText, setExpanded, onBlur]);

  const handleFocus = useCallback(() => {
    onFocus?.();
  }, [onFocus]);

  const handleFieldPointerDown = useCallback(() => {
    if (!isMapPin || disabled) return;
    setPlayPinPath(true);
    setPinAnimKey((key) => key + 1);
  }, [disabled, isMapPin]);

  const surfaceClass = isUber
    ? "border-0 bg-[#EEEEEE] text-black shadow-none"
    : isForm
      ? "border border-input bg-white text-black shadow-none dark:bg-neutral-950 dark:text-white"
      : "bg-foreground text-background shadow-sm ring-1 ring-border/60";
  const radiusClass = isForm ? "rounded-lg" : "rounded-full";
  const heightClass = isUber ? "h-14" : isForm ? "h-8" : "h-10";
  const bubbleSizeClass = isUber ? "size-14" : isForm ? "size-8" : "size-10";
  const triggerPadClass = isUber
    ? endAction
      ? "px-4 pr-12"
      : "px-4"
    : endAction
      ? "px-3 pr-11"
      : "px-3";
  const textClass = isUber ? "text-base font-medium" : "text-sm font-medium";
  const inputTextClass = isUber ? "text-base font-medium" : "text-sm";
  const showTypewriter =
    Boolean(typewriterText) && isExpanded && searchText.length === 0;
  const typewriterWords = useMemo(() => {
    if (!typewriterText) return [];
    return typewriterText.split(/\s+/).filter(Boolean).map((text) => ({
      text,
      className: "!text-neutral-400 dark:!text-neutral-500",
    }));
  }, [typewriterText]);

  return (
    <div
      className={cn(
        "relative isolate flex w-full items-center justify-start",
        className,
        classNames?.root,
      )}
    >
      {isForm ? null : <GooeyFilter filterId={filterId} blur={gooeyBlur} />}

      <div
        ref={barRef}
        className={cn(
          "relative flex w-full items-center justify-center overflow-hidden",
          heightClass,
          classNames?.filterWrap,
        )}
        style={isForm ? undefined : { filter: `url(#${filterId})` }}
      >
        <motion.div
          className={cn(
            "flex w-full items-center justify-center",
            heightClass,
            classNames?.buttonRow,
          )}
          variants={buttonVariants}
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          transition={transition}
        >
          <div
            role="presentation"
            onClick={handleExpand}
            onPointerDown={handleFieldPointerDown}
            className={cn(
              "flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden outline-none transition-[color,box-shadow]",
              triggerPadClass,
              textClass,
              isUber
                ? "focus-within:ring-2 focus-within:ring-black"
                : "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
              disabled && "pointer-events-none opacity-50",
              heightClass,
              radiusClass,
              surfaceClass,
              classNames?.trigger,
            )}
          >
            {!isExpanded && mounted ? (
              isMapPin ? (
                <MapPinIcon
                  layoutId={iconLayoutId}
                  playAnim={playPinPath}
                  animKey={pinAnimKey}
                  size={pinSize}
                />
              ) : (
                <SearchIcon layoutId={iconLayoutId} />
              )
            ) : null}
            <div className="relative h-full min-w-0 flex-1">
              <motion.input
                layoutId={inputLayoutId}
                id={id}
                ref={inputRef}
                type="text"
                enterKeyHint="search"
                autoComplete="off"
                value={searchText}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled || !isExpanded}
                placeholder={showTypewriter ? "" : placeholder}
                aria-label={placeholder}
                className={cn(
                  "h-full w-full min-w-0 truncate bg-transparent outline-none",
                  inputTextClass,
                  isUber
                    ? cn(
                        "text-black placeholder:text-[#6B6B6B]",
                        !isExpanded && "pointer-events-none",
                      )
                    : isForm
                      ? cn(
                          "text-black dark:text-white",
                          isExpanded
                            ? "placeholder:text-neutral-400"
                            : "pointer-events-none placeholder:text-neutral-500",
                        )
                      : cn(
                          "text-background",
                          isExpanded
                            ? "placeholder:text-background/50 dark:placeholder:text-background/45"
                            : "pointer-events-none placeholder:text-background/80 dark:placeholder:text-background/70",
                        ),
                  classNames?.input,
                )}
              />
              {showTypewriter ? (
                <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden">
                  <TypewriterEffect
                    key={typewriterKey}
                    autoStart
                    words={typewriterWords}
                    className={cn(
                      "text-left font-normal leading-none",
                      isUber
                        ? "text-base text-[#6B6B6B] sm:text-base md:text-base lg:text-base"
                        : "text-sm sm:text-sm md:text-sm lg:text-sm",
                    )}
                    cursorClassName="hidden"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>

        <motion.div
          className={cn(
            "absolute top-1/2 left-0 flex -translate-y-1/2 items-center justify-center",
            bubbleSizeClass,
            classNames?.bubble,
          )}
          variants={iconBubbleVariants}
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          transition={transition}
        >
          <div
            className={cn(
              "flex items-center justify-center",
              bubbleSizeClass,
              radiusClass,
              surfaceClass,
              classNames?.bubbleSurface,
            )}
          >
            {isExpanded && mounted ? (
              isMapPin ? (
                <MapPinIcon
                  layoutId={iconLayoutId}
                  playAnim={playPinPath}
                  animKey={pinAnimKey}
                  size={pinSize}
                />
              ) : (
                <SearchIcon layoutId={iconLayoutId} />
              )
            ) : null}
          </div>
        </motion.div>
      </div>
      {endAction ? (
        <div className="absolute top-1/2 right-3 z-20 -translate-y-1/2">
          {endAction}
        </div>
      ) : null}
      {children}
    </div>
  );
}
