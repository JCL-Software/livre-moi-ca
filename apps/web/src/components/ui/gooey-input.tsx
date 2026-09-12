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
}: {
  layoutId: string;
  playAnim?: boolean;
  animKey?: number;
}) {
  return (
    <motion.span
      layoutId={layoutId}
      className="inline-flex size-4 shrink-0 items-center justify-center text-current"
    >
      <MapPin
        key={playAnim ? `map-pin-${animKey}` : "map-pin-idle"}
        size={16}
        animate={playAnim ? "path" : false}
        className="size-4"
      />
    </motion.span>
  );
}

const transition = {
  duration: 0.4,
  type: "spring" as const,
  bounce: 0.25,
};

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
  /** Visual tone. `form` matches white rounded-lg inputs. */
  appearance?: "default" | "form";
  /** Typewriter hint shown when expanded and empty (Aceternity). */
  typewriterText?: string;
  children?: ReactNode;
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
  children,
}: GooeyInputProps) {
  const reactId = useId();
  const safeId = reactId.replace(/:/g, "");
  const filterId = `gooey-filter-${safeId}`;
  const iconLayoutId = `gooey-input-icon-${safeId}`;
  const inputLayoutId = `gooey-input-field-${safeId}`;

  const inputRef = useRef<HTMLInputElement>(null);
  const prevExpandedRef = useRef(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [typewriterKey, setTypewriterKey] = useState(0);
  const [pinAnimKey, setPinAnimKey] = useState(0);
  const [playPinPath, setPlayPinPath] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const isControlled = valueProp !== undefined;
  const searchText = isControlled ? valueProp : uncontrolledValue;
  const isForm = appearance === "form";
  const isMapPin = icon === "map-pin";

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
      setIsExpanded(true);
    }
  }, [searchText, isExpanded]);

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

  const surfaceClass = isForm
    ? "border border-input bg-white text-black shadow-none dark:bg-neutral-950 dark:text-white"
    : "bg-foreground text-background shadow-sm ring-1 ring-border/60";
  const radiusClass = isForm ? "rounded-lg" : "rounded-full";
  const heightClass = isForm ? "h-8" : "h-10";
  const bubbleSizeClass = isForm ? "size-8" : "size-10";
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
              "flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden px-3 text-sm font-medium outline-none transition-[color,box-shadow]",
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
              disabled && "pointer-events-none opacity-50",
              heightClass,
              radiusClass,
              surfaceClass,
              classNames?.trigger,
            )}
          >
            {!isExpanded ? (
              isMapPin ? (
                <MapPinIcon
                  layoutId={iconLayoutId}
                  playAnim={playPinPath}
                  animKey={pinAnimKey}
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
                  "h-full w-full min-w-0 truncate bg-transparent text-sm outline-none",
                  isForm
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
                    className="text-left text-sm font-normal leading-none sm:text-sm md:text-sm lg:text-sm"
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
            {isExpanded ? (
              isMapPin ? (
                <MapPinIcon
                  layoutId={iconLayoutId}
                  playAnim={playPinPath}
                  animKey={pinAnimKey}
                />
              ) : (
                <SearchIcon layoutId={iconLayoutId} />
              )
            ) : null}
          </div>
        </motion.div>
      </div>
      {children}
    </div>
  );
}
