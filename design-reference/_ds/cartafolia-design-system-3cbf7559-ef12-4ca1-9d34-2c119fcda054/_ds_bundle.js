/* @ds-bundle: {"format":4,"namespace":"CartafoliaDesignSystem_3cbf75","components":[{"name":"CardArt","sourcePath":"components/catalog/CardArt.jsx"},{"name":"CardTile","sourcePath":"components/catalog/CardTile.jsx"},{"name":"ConditionBadge","sourcePath":"components/catalog/ConditionBadge.jsx"},{"name":"FilterGroup","sourcePath":"components/catalog/FilterGroup.jsx"},{"name":"RarityBadge","sourcePath":"components/catalog/RarityBadge.jsx"},{"name":"SpecList","sourcePath":"components/catalog/SpecList.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Panel","sourcePath":"components/core/Panel.jsx"},{"name":"Tooltip","sourcePath":"components/core/Tooltip.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Skeleton","sourcePath":"components/feedback/Skeleton.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"SearchField","sourcePath":"components/forms/SearchField.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Breadcrumb","sourcePath":"components/navigation/Breadcrumb.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"Pagination","sourcePath":"components/navigation/Pagination.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/catalog/CardArt.jsx":"b7dcbe04085f","components/catalog/CardTile.jsx":"fb59f5ac16b3","components/catalog/ConditionBadge.jsx":"55fe9bd5f74e","components/catalog/FilterGroup.jsx":"3bc4e26f8250","components/catalog/RarityBadge.jsx":"3c096f5a02b5","components/catalog/SpecList.jsx":"a21d06f7f114","components/core/Badge.jsx":"d38ec56efcfc","components/core/Button.jsx":"84d629d180e5","components/core/Chip.jsx":"f5193fde5d03","components/core/Icon.jsx":"e5ed87fc0efb","components/core/IconButton.jsx":"cba4f057731d","components/core/Panel.jsx":"44065fb58024","components/core/Tooltip.jsx":"1d8a9513afbe","components/feedback/Dialog.jsx":"d25810fc7105","components/feedback/EmptyState.jsx":"ee3764531ff8","components/feedback/Skeleton.jsx":"0275dfee4657","components/feedback/Toast.jsx":"5e1613108d08","components/forms/Checkbox.jsx":"f294b72130dd","components/forms/Input.jsx":"4789caf02dec","components/forms/SearchField.jsx":"f42a5305cbe6","components/forms/Select.jsx":"a3601252d008","components/forms/Switch.jsx":"5ac6f85d7ad0","components/navigation/Breadcrumb.jsx":"0c7a68afeeb5","components/navigation/NavBar.jsx":"27134124e794","components/navigation/Pagination.jsx":"c7f7dc04534a","components/navigation/Tabs.jsx":"99b193d13c68","ui_kits/sito/App.jsx":"cc3ea53a1926","ui_kits/sito/CardDetailScreen.jsx":"6af994300c78","ui_kits/sito/CatalogScreen.jsx":"55fd4f662d28","ui_kits/sito/HomeScreen.jsx":"0b1b32994a8d","ui_kits/sito/SetsScreen.jsx":"21f29a61585b","ui_kits/sito/StoreScreen.jsx":"9aa815a20c72","ui_kits/sito/data.jsx":"28d7b2f5dc9c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CartafoliaDesignSystem_3cbf75 = window.CartafoliaDesignSystem_3cbf75 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/catalog/CardArt.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Riquadro proporzione carta (63×88). Senza `src` mostra il placeholder foil del design system. */
function CardArt({
  src,
  alt = "",
  rarity = "common",
  code,
  foil,
  sheen = 0,
  radius = "var(--r-cardart)",
  style,
  ...rest
}) {
  const caption = typeof code === "string" ? code.trim() : code ? String(code) : "";
  const isFoil = foil || rarity === "holo" || rarity === "ultra" || rarity === "secret";
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      position: "relative",
      aspectRatio: "var(--card-aspect)",
      width: "100%",
      overflow: "hidden",
      borderRadius: radius,
      background: isFoil ? "var(--foil)" : "linear-gradient(160deg,var(--ink-100),var(--paper-100))",
      boxShadow: "var(--sh-inset-hairline)",
      ...style
    }
  }), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center",
      containerType: "inline-size",
      background: isFoil ? "radial-gradient(120% 90% at 30% 15%,rgba(255,255,255,.65),transparent 60%)" : "var(--pattern-dots) 0 0/var(--pattern-dots-size)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-code)",
      letterSpacing: "var(--ls-eyebrow)",
      textTransform: "uppercase",
      color: isFoil ? "rgba(14,11,18,.5)" : "var(--text-faint)",
      textAlign: "center",
      padding: "0 8px",
      maxWidth: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontSize: "clamp(7px,14cqw,12px)",
      containerType: "inline-size"
    }
  }, caption)), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--foil-sheen)",
      opacity: sheen,
      transform: `translateX(${-60 + sheen * 120}%)`,
      mixBlendMode: "screen",
      transition: "opacity var(--dur-base) var(--ease-out), transform var(--dur-slow) var(--ease-out)",
      pointerEvents: "none"
    }
  }));
}
Object.assign(__ds_scope, { CardArt });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/CardArt.jsx", error: String((e && e.message) || e) }); }

// components/catalog/ConditionBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const COND = {
  mint: {
    label: "Mint",
    short: "M",
    level: 5,
    color: "var(--cond-mint)"
  },
  "near-mint": {
    label: "Near Mint",
    short: "NM",
    level: 4,
    color: "var(--cond-near-mint)"
  },
  excellent: {
    label: "Excellent",
    short: "EX",
    level: 3,
    color: "var(--cond-excellent)"
  },
  good: {
    label: "Good",
    short: "GD",
    level: 2,
    color: "var(--cond-good)"
  },
  played: {
    label: "Played",
    short: "PL",
    level: 1,
    color: "var(--cond-played)"
  }
};
function ConditionBadge({
  condition = "near-mint",
  compact,
  style,
  ...rest
}) {
  const c = COND[condition] || COND["near-mint"];
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    title: `Condizione: ${c.label}`,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "5px 10px",
      borderRadius: "var(--r-xs)",
      background: "var(--surface-sunken)",
      font: "var(--type-code)",
      color: "var(--text-body)",
      whiteSpace: "nowrap",
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: "inline-flex",
      gap: 2,
      alignItems: "flex-end",
      height: 12
    }
  }, [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 3,
      height: 4 + i * 1.6,
      borderRadius: 1,
      background: i <= c.level ? c.color : "var(--ink-200)"
    }
  }))), compact ? c.short : c.label);
}
Object.assign(__ds_scope, { ConditionBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/ConditionBadge.jsx", error: String((e && e.message) || e) }); }

// components/catalog/RarityBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const RARITY = {
  common: {
    label: "Comune",
    color: "var(--rarity-common)",
    dots: 1
  },
  uncommon: {
    label: "Non comune",
    color: "var(--rarity-uncommon)",
    dots: 2
  },
  rare: {
    label: "Rara",
    color: "var(--rarity-rare)",
    dots: 3
  },
  holo: {
    label: "Holo",
    color: "var(--rarity-holo)",
    dots: 4
  },
  ultra: {
    label: "Ultra rara",
    color: "var(--rarity-ultra)",
    dots: 5
  },
  secret: {
    label: "Segreta",
    color: "var(--rarity-secret)",
    dots: 6
  }
};
function RarityBadge({
  rarity = "common",
  showLabel = true,
  size = "md",
  style,
  ...rest
}) {
  const r = RARITY[rarity] || RARITY.common;
  const d = size === "sm" ? 5 : 6;
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    title: r.label,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      padding: size === "sm" ? "3px 9px" : "5px 11px",
      borderRadius: "var(--r-pill)",
      background: "var(--surface-card)",
      border: `var(--bw-hairline) solid ${r.color}`,
      font: "var(--type-label)",
      fontSize: size === "sm" ? "var(--fs-micro)" : "var(--fs-caption)",
      color: r.color,
      letterSpacing: "var(--ls-eyebrow)",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: "inline-flex",
      gap: 2
    }
  }, Array.from({
    length: r.dots
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: d,
      height: d,
      borderRadius: "var(--r-pill)",
      background: r.color
    }
  }))), showLabel && r.label);
}
Object.assign(__ds_scope, { RarityBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/RarityBadge.jsx", error: String((e && e.message) || e) }); }

// components/catalog/SpecList.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SpecList({
  items = [],
  dense,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("dl", _extends({}, rest, {
    style: {
      display: "grid",
      gap: 0,
      margin: 0,
      ...style
    }
  }), items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 16,
      padding: dense ? "7px 0" : "11px 0",
      borderTop: i ? "1px solid var(--border-hairline)" : "none"
    }
  }, /*#__PURE__*/React.createElement("dt", {
    style: {
      font: "var(--type-label)",
      fontSize: "var(--fs-caption)",
      fontWeight: "var(--fw-semibold)",
      letterSpacing: "var(--ls-eyebrow)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, it.label), /*#__PURE__*/React.createElement("dd", {
    style: {
      margin: 0,
      textAlign: "right",
      color: "var(--text-strong)",
      font: it.mono ? "var(--type-code)" : "var(--type-body)",
      fontSize: it.mono ? "var(--fs-body-s)" : "var(--fs-body-s)",
      fontWeight: it.mono ? "var(--fw-medium)" : "var(--fw-semibold)"
    }
  }, it.value))));
}
Object.assign(__ds_scope, { SpecList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/SpecList.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  neutral: {
    bg: "var(--ink-50)",
    fg: "var(--text-body)",
    bd: "var(--border-subtle)"
  },
  brand: {
    bg: "var(--surface-brand)",
    fg: "var(--text-invert)",
    bd: "transparent"
  },
  accent: {
    bg: "var(--surface-accent-soft)",
    fg: "var(--cyan-700)",
    bd: "var(--cyan-300)"
  },
  success: {
    bg: "var(--state-success-soft)",
    fg: "var(--state-success)",
    bd: "transparent"
  },
  warning: {
    bg: "var(--state-warning-soft)",
    fg: "#8A5A00",
    bd: "transparent"
  },
  danger: {
    bg: "var(--state-danger-soft)",
    fg: "var(--cherry-700)",
    bd: "transparent"
  },
  foil: {
    bg: "var(--foil)",
    fg: "var(--ink-950)",
    bd: "var(--ink-950)"
  },
  invert: {
    bg: "var(--ink-950)",
    fg: "var(--text-invert)",
    bd: "transparent"
  }
};
function Badge({
  tone = "neutral",
  uppercase = true,
  icon,
  children,
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "4px 10px",
      background: t.bg,
      color: t.fg,
      border: `1px solid ${t.bd}`,
      borderRadius: "var(--r-pill)",
      fontFamily: "var(--font-body)",
      fontSize: "var(--fs-micro)",
      fontWeight: "var(--fw-bold)",
      letterSpacing: uppercase ? "var(--ls-eyebrow)" : "0",
      textTransform: uppercase ? "uppercase" : "none",
      lineHeight: 1.3,
      whiteSpace: "nowrap",
      ...style
    }
  }), icon, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const SIZES = {
  sm: {
    padding: "8px 16px",
    fontSize: "var(--fs-body-s)",
    gap: "6px",
    minHeight: 36
  },
  md: {
    padding: "12px 22px",
    fontSize: "var(--fs-body-m)",
    gap: "8px",
    minHeight: 46
  },
  lg: {
    padding: "16px 30px",
    fontSize: "var(--fs-body-l)",
    gap: "10px",
    minHeight: 56
  }
};
const VARIANTS = {
  primary: {
    background: "var(--surface-brand)",
    color: "var(--text-invert)",
    border: "var(--bw-strong) solid var(--ink-950)",
    shadow: "var(--sh-sticker-sm)",
    hoverBg: "var(--surface-brand-hover)"
  },
  secondary: {
    background: "var(--surface-card)",
    color: "var(--text-strong)",
    border: "var(--bw-strong) solid var(--ink-950)",
    shadow: "var(--sh-sticker-sm)",
    hoverBg: "var(--paper-100)"
  },
  ghost: {
    background: "transparent",
    color: "var(--text-strong)",
    border: "var(--bw-strong) solid transparent",
    shadow: "none",
    hoverBg: "var(--ink-50)"
  },
  foil: {
    background: "var(--foil)",
    color: "var(--ink-950)",
    border: "var(--bw-strong) solid var(--ink-950)",
    shadow: "var(--sh-sticker-sm)",
    hoverBg: "var(--foil)"
  },
  invert: {
    background: "var(--surface-invert)",
    color: "var(--text-invert)",
    border: "var(--bw-strong) solid var(--ink-950)",
    shadow: "none",
    hoverBg: "var(--ink-800)"
  }
};
function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  fullWidth,
  disabled,
  as = "button",
  href,
  onClick,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const Tag = as === "a" ? "a" : "button";
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: s.gap,
    padding: s.padding,
    minHeight: s.minHeight,
    width: fullWidth ? "100%" : "auto",
    font: "var(--type-label)",
    fontSize: s.fontSize,
    fontWeight: "var(--fw-bold)",
    letterSpacing: "-0.01em",
    textDecoration: "none",
    whiteSpace: "nowrap",
    background: hover && !disabled ? v.hoverBg : v.background,
    color: v.color,
    border: v.border,
    borderRadius: "var(--r-control)",
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : press ? "none" : hover ? "var(--sh-sticker)" : v.shadow,
    transform: disabled ? "none" : press ? "translate(2px,2px)" : hover ? "translateY(-2px)" : "none",
    transition: "var(--t-control)",
    opacity: disabled ? .4 : 1,
    ...style
  };
  return React.createElement(Tag, {
    ...rest,
    href: Tag === "a" ? href : undefined,
    disabled: Tag === "button" ? disabled : undefined,
    onClick: disabled ? undefined : onClick,
    style: base,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false)
  }, icon, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CDN = "https://unpkg.com/lucide-static@0.446.0/icons/";

/** Glifo Lucide reso via CSS mask: eredita currentColor e la dimensione del testo. */
function Icon({
  name = "sparkles",
  size = 20,
  color,
  style,
  label,
  ...rest
}) {
  const url = `url("${CDN}${name}.svg")`;
  return /*#__PURE__*/React.createElement("span", _extends({
    role: label ? "img" : "presentation",
    "aria-label": label,
    "aria-hidden": label ? undefined : true
  }, rest, {
    style: {
      display: "inline-block",
      flex: "none",
      width: size,
      height: size,
      background: color || "currentColor",
      WebkitMask: `${url} center/contain no-repeat`,
      mask: `${url} center/contain no-repeat`,
      ...style
    }
  }));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/catalog/FilterGroup.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function FilterGroup({
  title,
  activeCount,
  defaultOpen = true,
  children,
  style,
  ...rest
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement("section", _extends({}, rest, {
    style: {
      borderTop: "1px solid var(--border-hairline)",
      padding: "14px 0",
      ...style
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(o => !o),
    "aria-expanded": open,
    style: {
      all: "unset",
      display: "flex",
      width: "100%",
      alignItems: "center",
      gap: 8,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      fontWeight: "var(--fw-bold)",
      color: "var(--text-strong)",
      letterSpacing: "var(--ls-eyebrow)",
      textTransform: "uppercase",
      fontSize: "var(--fs-caption)"
    }
  }, title), activeCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      placeItems: "center",
      minWidth: 18,
      height: 18,
      padding: "0 5px",
      borderRadius: "var(--r-pill)",
      background: "var(--surface-brand)",
      color: "var(--text-invert)",
      font: "var(--type-code)",
      fontSize: "var(--fs-micro)"
    }
  }, activeCount), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16,
    style: {
      marginLeft: "auto",
      color: "var(--text-muted)",
      transform: open ? "rotate(0deg)" : "rotate(-90deg)",
      transition: "transform var(--dur-base) var(--ease-snap)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 2,
      overflow: "hidden",
      maxHeight: open ? 600 : 0,
      opacity: open ? 1 : 0,
      marginTop: open ? 10 : 0,
      transition: "max-height var(--dur-slow) var(--ease-out), opacity var(--dur-base) var(--ease-out), margin-top var(--dur-base) var(--ease-out)"
    }
  }, children));
}
Object.assign(__ds_scope, { FilterGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/FilterGroup.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Chip({
  selected,
  count,
  icon,
  onClick,
  onRemove,
  disabled,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const interactive = !!(onClick || onRemove);
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    type: "button",
    disabled: disabled,
    onClick: disabled ? undefined : onClick,
    "aria-pressed": onClick ? !!selected : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      padding: "7px 14px",
      minHeight: 36,
      background: selected ? "var(--ink-950)" : hover && interactive ? "var(--paper-100)" : "var(--surface-card)",
      color: selected ? "var(--text-invert)" : "var(--text-body)",
      border: `var(--bw-hairline) solid ${selected ? "var(--ink-950)" : "var(--border-subtle)"}`,
      borderRadius: "var(--r-pill)",
      font: "var(--type-label)",
      cursor: disabled ? "not-allowed" : interactive ? "pointer" : "default",
      transform: hover && interactive && !disabled ? "translateY(-1px)" : "none",
      transition: "var(--t-control)",
      opacity: disabled ? .45 : 1,
      ...style
    }
  }), icon, children, count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-code)",
      opacity: .6
    }
  }, count), onRemove && /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onRemove(e);
    },
    style: {
      display: "inline-grid",
      placeItems: "center",
      marginRight: -4,
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 14
  })));
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: 32,
  md: 40,
  lg: 48
};
function IconButton({
  icon = "x",
  variant = "secondary",
  size = "md",
  label,
  active,
  disabled,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const d = SIZES[size] || SIZES.md;
  const skins = {
    secondary: {
      bg: "var(--surface-card)",
      fg: "var(--text-strong)",
      bd: "var(--bw-strong) solid var(--ink-950)"
    },
    ghost: {
      bg: "transparent",
      fg: "var(--text-muted)",
      bd: "var(--bw-strong) solid transparent"
    },
    brand: {
      bg: "var(--surface-brand)",
      fg: "var(--text-invert)",
      bd: "var(--bw-strong) solid var(--ink-950)"
    },
    invert: {
      bg: "var(--ink-800)",
      fg: "var(--text-invert)",
      bd: "var(--bw-strong) solid transparent"
    }
  };
  const k = skins[variant] || skins.secondary;
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    "aria-label": label,
    "aria-pressed": active,
    disabled: disabled,
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      width: d,
      height: d,
      display: "inline-grid",
      placeItems: "center",
      borderRadius: "var(--r-pill)",
      background: active ? "var(--surface-brand-soft)" : hover && !disabled ? variant === "ghost" ? "var(--ink-50)" : k.bg : k.bg,
      color: active ? "var(--text-brand)" : k.fg,
      border: k.bd,
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: disabled || variant === "ghost" ? "none" : press ? "none" : hover ? "var(--sh-sticker-sm)" : "none",
      transform: disabled ? "none" : press ? "translate(2px,2px)" : hover ? "translateY(-2px)" : "none",
      transition: "var(--t-control)",
      opacity: disabled ? .4 : 1,
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === "sm" ? 16 : size === "lg" ? 22 : 18
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/catalog/CardTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Tessera del catalogo: inclinazione 3D che segue il cursore, riflesso foil, sollevamento. */
function CardTile({
  name,
  code,
  set,
  rarity = "common",
  src,
  liked,
  onLike,
  onClick,
  badge,
  tilt = true,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [rot, setRot] = React.useState({
    x: 0,
    y: 0
  });
  const move = e => {
    if (!tilt) return;
    const r = e.currentTarget.getBoundingClientRect();
    setRot({
      y: ((e.clientX - r.left) / r.width - .5) * 10,
      x: -((e.clientY - r.top) / r.height - .5) * 10
    });
  };
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    onClick: onClick,
    onMouseMove: move,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setRot({
        x: 0,
        y: 0
      });
    },
    style: {
      position: "relative",
      display: "grid",
      gap: 12,
      padding: 12,
      minWidth: 0,
      cursor: onClick ? "pointer" : "default",
      background: "var(--surface-card)",
      border: `var(--bw-hairline) solid ${hover ? "var(--ink-950)" : "var(--border-hairline)"}`,
      borderRadius: "var(--r-card)",
      boxShadow: hover ? "var(--sh-3)" : "var(--sh-1)",
      transform: hover ? "var(--lift-hover)" : "none",
      transition: "var(--t-card), border-color var(--dur-fast) var(--ease-out)",
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      perspective: 700
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.CardArt, {
    src: src,
    alt: name,
    rarity: rarity,
    code: code,
    sheen: hover ? 1 : 0,
    style: {
      transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale(${hover ? 1.02 : 1})`,
      transformStyle: "preserve-3d",
      transition: "transform var(--dur-base) var(--ease-out)"
    }
  })), badge && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 20,
      left: 20
    }
  }, badge), onLike && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 18,
      right: 18,
      opacity: hover || liked ? 1 : 0,
      transition: "opacity var(--dur-fast) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "heart",
    size: "sm",
    variant: liked ? "brand" : "secondary",
    label: liked ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti",
    onClick: e => {
      e.stopPropagation();
      onLike(e);
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 8,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-card-title)",
      color: "var(--text-strong)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      minWidth: 0
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-code)",
      color: "var(--text-faint)",
      flex: "none",
      whiteSpace: "nowrap"
    }
  }, code)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.RarityBadge, {
    rarity: rarity,
    size: "sm"
  }), set && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      fontSize: "var(--fs-caption)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-muted)"
    }
  }, set))));
}
Object.assign(__ds_scope, { CardTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/catalog/CardTile.jsx", error: String((e && e.message) || e) }); }

// components/core/Panel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SKINS = {
  card: {
    background: "var(--surface-card)",
    color: "var(--text-body)",
    border: "var(--bw-hairline) solid var(--border-hairline)",
    boxShadow: "var(--sh-1)"
  },
  sunken: {
    background: "var(--surface-sunken)",
    color: "var(--text-body)",
    border: "var(--bw-hairline) solid var(--border-hairline)",
    boxShadow: "none"
  },
  sticker: {
    background: "var(--surface-card)",
    color: "var(--text-body)",
    border: "var(--bw-strong) solid var(--ink-950)",
    boxShadow: "var(--sh-sticker)"
  },
  invert: {
    background: "var(--surface-invert)",
    color: "var(--text-invert)",
    border: "var(--bw-hairline) solid var(--border-invert)",
    boxShadow: "none"
  },
  foil: {
    background: "var(--foil)",
    color: "var(--ink-950)",
    border: "var(--bw-strong) solid var(--ink-950)",
    boxShadow: "var(--sh-sticker)"
  }
};
function Panel({
  variant = "card",
  padding = "var(--sp-6)",
  hoverLift,
  as = "div",
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const s = SKINS[variant] || SKINS.card;
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({}, rest, {
    onMouseEnter: hoverLift ? () => setHover(true) : undefined,
    onMouseLeave: hoverLift ? () => setHover(false) : undefined,
    style: {
      ...s,
      padding,
      borderRadius: "var(--r-card)",
      transform: hover ? "var(--lift-hover)" : "none",
      boxShadow: hover ? variant === "sticker" || variant === "foil" ? "6px 6px 0 var(--ink-950)" : "var(--sh-3)" : s.boxShadow,
      transition: "var(--t-card)",
      ...style
    }
  }), children);
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Panel.jsx", error: String((e && e.message) || e) }); }

// components/core/Tooltip.jsx
try { (() => {
function Tooltip({
  label,
  side = "top",
  children,
  style
}) {
  const [open, setOpen] = React.useState(false);
  const pos = {
    top: {
      bottom: "calc(100% + 8px)",
      left: "50%",
      transform: `translateX(-50%) translateY(${open ? "0" : "4px"})`
    },
    bottom: {
      top: "calc(100% + 8px)",
      left: "50%",
      transform: `translateX(-50%) translateY(${open ? "0" : "-4px"})`
    },
    left: {
      right: "calc(100% + 8px)",
      top: "50%",
      transform: "translateY(-50%)"
    },
    right: {
      left: "calc(100% + 8px)",
      top: "50%",
      transform: "translateY(-50%)"
    }
  }[side];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex",
      ...style
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false)
  }, children, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: "absolute",
      ...pos,
      zIndex: 60,
      pointerEvents: "none",
      opacity: open ? 1 : 0,
      transition: `opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-snap)`,
      background: "var(--ink-950)",
      color: "var(--text-invert)",
      padding: "6px 10px",
      borderRadius: "var(--r-xs)",
      font: "var(--type-label)",
      fontSize: "var(--fs-caption)",
      whiteSpace: "nowrap",
      boxShadow: "var(--sh-2)"
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Dialog({
  open,
  title,
  eyebrow,
  footer,
  onClose,
  width = 560,
  children,
  style,
  ...rest
}) {
  React.useEffect(() => {
    if (!open) return;
    const h = e => {
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 100,
      display: "grid",
      placeItems: "center",
      padding: "var(--sp-6)",
      background: "var(--scrim-modal)",
      backdropFilter: "blur(3px)",
      animation: "none"
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": typeof title === "string" ? title : undefined,
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      maxWidth: width,
      maxHeight: "86vh",
      overflow: "auto",
      background: "var(--surface-card)",
      border: "var(--bw-strong) solid var(--ink-950)",
      borderRadius: "var(--r-xl)",
      boxShadow: "var(--sh-3)",
      padding: "var(--sp-8)",
      display: "grid",
      gap: "var(--sp-5)",
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: "var(--sp-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6,
      flex: 1
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-eyebrow)",
      letterSpacing: "var(--ls-eyebrow)",
      textTransform: "uppercase",
      color: "var(--text-brand)"
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--fw-bold) var(--fs-title-m)/var(--lh-title-m) var(--font-display)",
      letterSpacing: "var(--ls-title-m)"
    }
  }, title)), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    variant: "ghost",
    label: "Chiudi",
    onClick: onClose
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-body)"
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--sp-3)",
      justifyContent: "flex-end",
      flexWrap: "wrap"
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function EmptyState({
  icon = "search",
  title,
  description,
  action,
  compact,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: "grid",
      gap: "var(--sp-4)",
      justifyItems: "center",
      textAlign: "center",
      padding: compact ? "var(--sp-8)" : "var(--sp-16) var(--sp-8)",
      background: "var(--surface-sunken)",
      border: "1px dashed var(--border-subtle)",
      borderRadius: "var(--r-lg)",
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      placeItems: "center",
      width: 56,
      height: 56,
      borderRadius: "var(--r-pill)",
      background: "var(--surface-card)",
      border: "var(--bw-strong) solid var(--ink-950)",
      boxShadow: "var(--sh-sticker-sm)",
      color: "var(--text-strong)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 24
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6,
      maxWidth: 420
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--fw-bold) var(--fs-title-s)/var(--lh-title-s) var(--font-display)",
      color: "var(--text-strong)"
    }
  }, title), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-body)",
      fontSize: "var(--fs-body-s)",
      color: "var(--text-muted)"
    }
  }, description)), action);
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Skeleton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Skeleton({
  shape = "line",
  width = "100%",
  height,
  count = 1,
  style,
  ...rest
}) {
  const h = height || (shape === "line" ? 14 : shape === "title" ? 26 : undefined);
  const items = Array.from({
    length: count
  });
  const box = i => ({
    width: shape === "line" && count > 1 && i === count - 1 ? "70%" : width,
    height: shape === "card" ? undefined : h,
    aspectRatio: shape === "card" ? "var(--card-aspect)" : undefined,
    borderRadius: shape === "card" ? "var(--r-cardart)" : shape === "circle" ? "var(--r-pill)" : "var(--r-xs)",
    background: "linear-gradient(90deg,var(--ink-100) 25%,var(--paper-100) 37%,var(--ink-100) 63%)",
    backgroundSize: "400% 100%",
    animation: "cf-shimmer 1.4s var(--ease-in-out) infinite"
  });
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: "grid",
      gap: 8,
      ...style
    }
  }), /*#__PURE__*/React.createElement("style", null, "@keyframes cf-shimmer{0%{background-position:100% 0}100%{background-position:0 0}}"), items.map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: box(i)
  })));
}
Object.assign(__ds_scope, { Skeleton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Skeleton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  neutral: {
    bg: "var(--ink-950)",
    fg: "var(--text-invert)",
    icon: "info"
  },
  success: {
    bg: "var(--state-success)",
    fg: "#FFFFFF",
    icon: "check"
  },
  brand: {
    bg: "var(--surface-brand)",
    fg: "var(--text-invert)",
    icon: "sparkles"
  },
  danger: {
    bg: "var(--cherry-700)",
    fg: "var(--text-invert)",
    icon: "info"
  }
};
function Toast({
  tone = "neutral",
  title,
  description,
  action,
  onClose,
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    role: "status",
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "14px 16px",
      background: t.bg,
      color: t.fg,
      borderRadius: "var(--r-md)",
      boxShadow: "var(--sh-3)",
      minWidth: 280,
      maxWidth: 420,
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: t.icon,
    size: 18,
    style: {
      marginTop: 2,
      opacity: .9
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 3,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)"
    }
  }, title), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      fontSize: "var(--fs-caption)",
      fontWeight: "var(--fw-regular)",
      opacity: .8
    }
  }, description)), action, onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "Chiudi",
    style: {
      all: "unset",
      cursor: "pointer",
      opacity: .7,
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 16
  })));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  checked,
  label,
  description,
  count,
  disabled,
  onChange,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      gap: 10,
      alignItems: description ? "flex-start" : "center",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? .45 : 1,
      padding: "4px 0",
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: onChange
  }, rest, {
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  })), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 20,
      height: 20,
      flex: "none",
      display: "grid",
      placeItems: "center",
      marginTop: description ? 2 : 0,
      background: checked ? "var(--ink-950)" : "var(--surface-card)",
      border: `var(--bw-strong) solid ${checked ? "var(--ink-950)" : hover ? "var(--ink-500)" : "var(--border-subtle)"}`,
      borderRadius: "var(--r-xs)",
      color: "var(--text-invert)",
      transition: "var(--t-control)",
      transform: checked ? "scale(1)" : "scale(.96)"
    }
  }, checked && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      gap: 2,
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-body)",
      fontSize: "var(--fs-body-s)",
      color: "var(--text-strong)",
      fontWeight: checked ? "var(--fw-semibold)" : "var(--fw-regular)"
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      fontSize: "var(--fs-caption)",
      fontWeight: "var(--fw-regular)",
      color: "var(--text-muted)"
    }
  }, description)), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-code)",
      color: "var(--text-faint)"
    }
  }, count));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  icon,
  suffix,
  size = "md",
  disabled,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const pad = size === "lg" ? "14px 16px" : size === "sm" ? "8px 12px" : "11px 14px";
  const bd = error ? "var(--state-danger)" : focus ? "var(--ink-950)" : "var(--border-subtle)";
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "grid",
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      color: "var(--text-strong)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: pad,
      background: disabled ? "var(--surface-sunken)" : "var(--surface-card)",
      border: `var(--bw-hairline) solid ${bd}`,
      borderRadius: "var(--r-field)",
      boxShadow: focus ? "var(--sh-focus)" : "none",
      transition: "box-shadow var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)",
      color: "var(--text-muted)",
      opacity: disabled ? .6 : 1
    }
  }, icon, /*#__PURE__*/React.createElement("input", _extends({}, rest, {
    disabled: disabled,
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      all: "unset",
      flex: 1,
      minWidth: 0,
      font: "var(--type-body)",
      fontSize: size === "sm" ? "var(--fs-body-s)" : "var(--fs-body-m)",
      color: "var(--text-strong)"
    }
  })), suffix), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      fontSize: "var(--fs-caption)",
      fontWeight: "var(--fw-medium)",
      color: error ? "var(--state-danger)" : "var(--text-muted)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SearchField({
  value,
  onChange,
  onClear,
  placeholder = "Cerca una carta, un'espansione, un artista…",
  size = "lg",
  suggestions = [],
  onPick,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const open = focus && suggestions.length > 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: size === "lg" ? "14px 18px" : "10px 14px",
      background: "var(--surface-card)",
      border: `var(--bw-strong) solid ${focus ? "var(--ink-950)" : "var(--border-subtle)"}`,
      borderRadius: "var(--r-pill)",
      boxShadow: focus ? "var(--sh-focus)" : "var(--sh-1)",
      transition: "box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-fast) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: size === "lg" ? 20 : 18,
    style: {
      color: focus ? "var(--text-strong)" : "var(--text-muted)"
    }
  }), /*#__PURE__*/React.createElement("input", _extends({}, rest, {
    value: value,
    placeholder: placeholder,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setTimeout(() => setFocus(false), 120),
    style: {
      all: "unset",
      flex: 1,
      minWidth: 0,
      font: "var(--type-body)",
      fontSize: size === "lg" ? "var(--fs-body-l)" : "var(--fs-body-m)",
      color: "var(--text-strong)"
    }
  })), value && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClear,
    "aria-label": "Cancella ricerca",
    style: {
      all: "unset",
      cursor: "pointer",
      display: "grid",
      placeItems: "center",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 18
  }))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "calc(100% + 8px)",
      left: 0,
      right: 0,
      zIndex: 40,
      background: "var(--surface-card)",
      border: "var(--bw-hairline) solid var(--border-subtle)",
      borderRadius: "var(--r-md)",
      boxShadow: "var(--sh-3)",
      overflow: "hidden"
    }
  }, suggestions.map((s, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    onMouseDown: () => onPick && onPick(s),
    style: {
      all: "unset",
      display: "flex",
      width: "100%",
      alignItems: "center",
      gap: 10,
      padding: "11px 16px",
      cursor: "pointer",
      font: "var(--type-body)",
      fontSize: "var(--fs-body-s)",
      color: "var(--text-body)",
      borderTop: i ? "1px solid var(--border-hairline)" : "none"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "sparkles",
    size: 14,
    style: {
      color: "var(--cyan-600)"
    }
  }), typeof s === "string" ? s : s.label, s && s.meta && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      font: "var(--type-code)",
      color: "var(--text-faint)"
    }
  }, s.meta)))));
}
Object.assign(__ds_scope, { SearchField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchField.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  value,
  options = [],
  onChange,
  size = "md",
  disabled,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "grid",
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      color: "var(--text-strong)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({}, rest, {
    value: value,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      all: "unset",
      width: "100%",
      boxSizing: "border-box",
      cursor: disabled ? "not-allowed" : "pointer",
      padding: size === "sm" ? "8px 34px 8px 12px" : "11px 38px 11px 14px",
      background: disabled ? "var(--surface-sunken)" : "var(--surface-card)",
      border: `var(--bw-hairline) solid ${focus ? "var(--ink-950)" : "var(--border-subtle)"}`,
      borderRadius: "var(--r-field)",
      boxShadow: focus ? "var(--sh-focus)" : "none",
      font: "var(--type-body)",
      fontSize: size === "sm" ? "var(--fs-body-s)" : "var(--fs-body-m)",
      color: "var(--text-strong)",
      transition: "box-shadow var(--dur-fast) var(--ease-out)",
      opacity: disabled ? .6 : 1
    }
  }), options.map(o => {
    const v = typeof o === "string" ? o : o.value,
      l = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16,
    style: {
      position: "absolute",
      right: 14,
      pointerEvents: "none",
      color: "var(--text-muted)"
    }
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  checked,
  label,
  onChange,
  disabled,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? .45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    checked: checked,
    disabled: disabled,
    onChange: onChange
  }, rest, {
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  })), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 44,
      height: 26,
      flex: "none",
      borderRadius: "var(--r-pill)",
      padding: 3,
      background: checked ? "var(--surface-brand)" : "var(--ink-200)",
      border: "var(--bw-strong) solid var(--ink-950)",
      display: "flex",
      justifyContent: checked ? "flex-end" : "flex-start",
      transition: "background-color var(--dur-base) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      borderRadius: "var(--r-pill)",
      background: "var(--paper-0)",
      boxShadow: "var(--sh-1)",
      transition: "transform var(--dur-base) var(--ease-spring)"
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      color: "var(--text-strong)"
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumb.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Breadcrumb({
  items = [],
  onNavigate,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({}, rest, {
    "aria-label": "Percorso",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      flexWrap: "wrap",
      ...style
    }
  }), items.map((it, i) => {
    const last = i === items.length - 1;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, last ? /*#__PURE__*/React.createElement("span", {
      "aria-current": "page",
      style: {
        font: "var(--type-label)",
        fontSize: "var(--fs-body-s)",
        color: "var(--text-strong)"
      }
    }, it.label) : /*#__PURE__*/React.createElement("a", {
      href: it.href || "#",
      onClick: e => {
        if (onNavigate) {
          e.preventDefault();
          onNavigate(it.id || it.label);
        }
      },
      style: {
        font: "var(--type-label)",
        fontSize: "var(--fs-body-s)",
        fontWeight: "var(--fw-medium)",
        color: "var(--text-muted)",
        textDecoration: "none"
      }
    }, it.label), !last && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "chevron-right",
      size: 14,
      style: {
        color: "var(--text-faint)"
      }
    }));
  }));
}
Object.assign(__ds_scope, { Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function NavBar({
  items = [],
  active,
  onNavigate,
  right,
  logoSrc = "/assets/logo-mark.svg",
  brand = "cartafolia",
  sticky = true,
  style,
  ...rest
}) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const el = document.scrollingElement || document.documentElement;
    const h = () => setScrolled(el.scrollTop > 8);
    window.addEventListener("scroll", h, {
      passive: true
    });
    h();
    return () => window.removeEventListener("scroll", h);
  }, []);
  return /*#__PURE__*/React.createElement("header", _extends({}, rest, {
    style: {
      position: sticky ? "sticky" : "static",
      top: 0,
      zIndex: 50,
      background: scrolled ? "var(--glass-bg)" : "var(--surface-page)",
      backdropFilter: scrolled ? "var(--glass-blur)" : "none",
      borderBottom: `1px solid ${scrolled ? "var(--border-subtle)" : "transparent"}`,
      transition: "background-color var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)",
      ...style
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "14px var(--gutter)",
      display: "flex",
      alignItems: "center",
      gap: "var(--sp-6)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate && onNavigate(items[0] && items[0].id);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: "",
    width: "32",
    height: "32",
    style: {
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--fw-black) var(--fs-title-s)/1 var(--font-display)",
      letterSpacing: "-0.04em",
      color: "var(--text-strong)"
    }
  }, brand)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 2,
      marginLeft: "var(--sp-4)"
    }
  }, items.map(it => {
    const on = it.id === active;
    return /*#__PURE__*/React.createElement("a", {
      key: it.id,
      href: it.href || "#",
      onClick: e => {
        e.preventDefault();
        onNavigate && onNavigate(it.id);
      },
      style: {
        position: "relative",
        padding: "8px 14px",
        borderRadius: "var(--r-pill)",
        textDecoration: "none",
        font: "var(--type-label)",
        color: on ? "var(--text-strong)" : "var(--text-muted)",
        background: on ? "var(--surface-brand-soft)" : "transparent",
        transition: "var(--t-control)"
      }
    }, it.label, it.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 6,
        font: "var(--type-code)",
        color: "var(--text-faint)"
      }
    }, it.count));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: "var(--sp-3)"
    }
  }, right)));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Pagination.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Pagination({
  page = 1,
  pages = 1,
  onChange,
  style,
  ...rest
}) {
  const nums = [];
  const from = Math.max(1, Math.min(page - 1, pages - 2)),
    to = Math.min(pages, from + 2);
  for (let i = from; i <= to; i++) nums.push(i);
  const go = p => onChange && onChange(Math.min(pages, Math.max(1, p)));
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "arrow-left",
    variant: "secondary",
    size: "sm",
    label: "Pagina precedente",
    disabled: page <= 1,
    onClick: () => go(page - 1)
  }), from > 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-code)",
      color: "var(--text-faint)",
      padding: "0 2px"
    }
  }, "\u2026"), nums.map(n => /*#__PURE__*/React.createElement("button", {
    key: n,
    type: "button",
    onClick: () => go(n),
    "aria-current": n === page ? "page" : undefined,
    style: {
      all: "unset",
      cursor: "pointer",
      minWidth: 34,
      height: 34,
      display: "grid",
      placeItems: "center",
      borderRadius: "var(--r-pill)",
      background: n === page ? "var(--ink-950)" : "transparent",
      color: n === page ? "var(--text-invert)" : "var(--text-body)",
      font: "var(--type-label)",
      transition: "var(--t-control)"
    }
  }, n)), to < pages && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-code)",
      color: "var(--text-faint)",
      padding: "0 2px"
    }
  }, "\u2026"), to < pages && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => go(pages),
    style: {
      all: "unset",
      cursor: "pointer",
      minWidth: 34,
      height: 34,
      display: "grid",
      placeItems: "center",
      borderRadius: "var(--r-pill)",
      font: "var(--type-label)",
      color: "var(--text-body)"
    }
  }, pages), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "arrow-right",
    variant: "secondary",
    size: "sm",
    label: "Pagina successiva",
    disabled: page >= pages,
    onClick: () => go(page + 1)
  }));
}
Object.assign(__ds_scope, { Pagination });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Pagination.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tabs({
  items = [],
  value,
  onChange,
  variant = "underline",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    role: "tablist",
    style: {
      display: "flex",
      gap: variant === "pill" ? 6 : "var(--sp-5)",
      borderBottom: variant === "underline" ? "1px solid var(--border-hairline)" : "none",
      background: variant === "pill" ? "var(--surface-sunken)" : "transparent",
      padding: variant === "pill" ? 4 : 0,
      borderRadius: variant === "pill" ? "var(--r-pill)" : 0,
      width: variant === "pill" ? "fit-content" : "auto",
      ...style
    }
  }), items.map(it => {
    const on = it.id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      role: "tab",
      "aria-selected": on,
      type: "button",
      onClick: () => onChange && onChange(it.id),
      style: {
        all: "unset",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: variant === "pill" ? "8px 16px" : "12px 2px",
        borderRadius: variant === "pill" ? "var(--r-pill)" : 0,
        background: variant === "pill" && on ? "var(--surface-card)" : "transparent",
        boxShadow: variant === "pill" && on ? "var(--sh-1)" : "none",
        borderBottom: variant === "underline" ? `3px solid ${on ? "var(--surface-brand)" : "transparent"}` : "none",
        marginBottom: variant === "underline" ? -1 : 0,
        font: "var(--type-label)",
        color: on ? "var(--text-strong)" : "var(--text-muted)",
        transition: "var(--t-control)"
      }
    }, it.label, it.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        font: "var(--type-code)",
        color: "var(--text-faint)"
      }
    }, it.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sito/App.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  NavBar,
  Button,
  IconButton,
  Icon,
  Toast,
  Dialog,
  Badge,
  SearchField,
  RarityBadge,
  ConditionBadge,
  SpecList,
  CardArt
} = window.CartafoliaDesignSystem_3cbf75;
const NAV = [{
  id: "home",
  label: "Vetrina"
}, {
  id: "catalogo",
  label: "Catalogo",
  count: 2480
}, {
  id: "espansioni",
  label: "Espansioni"
}, {
  id: "negozio",
  label: "Il negozio"
}];
function Footer({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--surface-invert)",
      color: "var(--text-invert-muted)",
      marginTop: "var(--sp-16)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "var(--sp-12) var(--gutter-lg)",
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr",
      gap: "var(--sp-10)"
    },
    className: "cf-footer"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--sp-3)",
      alignContent: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark.svg",
    width: "28",
    height: "28",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--fw-black) var(--fs-title-s)/1 var(--font-display)",
      letterSpacing: "-0.04em",
      color: "var(--text-invert)"
    }
  }, "cartafolia")), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      fontSize: "var(--fs-body-s)",
      maxWidth: 340
    }
  }, "Vetrina e catalogo di carte da collezione. Via Zamboni 41, Bologna. Non vendiamo online: passa in negozio.")), [["Sito", ["Vetrina", "Catalogo", "Espansioni", "Il negozio"]], ["Info", ["Orari", "Come arrivare", "Scambi", "Privacy"]]].map(([t, items]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: "grid",
      gap: "var(--sp-3)",
      alignContent: "start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-eyebrow)",
      letterSpacing: "var(--ls-eyebrow)",
      textTransform: "uppercase",
      color: "var(--ink-400)"
    }
  }, t), items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      font: "var(--type-body)",
      fontSize: "var(--fs-body-s)",
      color: "var(--text-invert-muted)",
      textDecoration: "none"
    }
  }, i))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--border-invert)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "var(--sp-4) var(--gutter-lg)",
      display: "flex",
      justifyContent: "space-between",
      gap: "var(--sp-4)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-code)",
      color: "var(--ink-500)"
    }
  }, "\xA9 2026 Cartafolia \xB7 P.IVA 00000000000"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-code)",
      color: "var(--ink-500)"
    }
  }, "Le carte mostrate sono propriet\xE0 dei rispettivi titolari."))));
}
function App() {
  const [route, setRoute] = React.useState("home");
  const [card, setCard] = React.useState(null);
  const [query, setQuery] = React.useState("");
  const [liked, setLiked] = React.useState({});
  const [toast, setToast] = React.useState(null);
  const [quick, setQuick] = React.useState(null);
  const show = (t, d, tone) => {
    setToast({
      title: t,
      description: d,
      tone: tone || "success"
    });
    clearTimeout(window.__cft);
    window.__cft = setTimeout(() => setToast(null), 2600);
  };
  const onLike = c => {
    setLiked(l => {
      const n = {
        ...l,
        [c.id]: !l[c.id]
      };
      show(n[c.id] ? "Salvata nella tua lista" : "Rimossa dalla lista", n[c.id] ? c.name + " · la ritrovi in Preferiti." : null, n[c.id] ? "success" : "neutral");
      return n;
    });
  };
  const openCard = c => {
    setCard(c);
    setRoute("carta");
    window.scrollTo(0, 0);
  };
  const go = id => {
    setRoute(id);
    window.scrollTo(0, 0);
  };
  const openSet = s => {
    if (s && s.id) {
      setQuery("");
      go("catalogo");
    } else go("espansioni");
  };
  const props = {
    query,
    setQuery,
    onOpen: openCard,
    liked,
    onLike,
    onNavigate: go,
    onOpenSet: openSet,
    onSearch: q => {
      setQuery(q);
      go("catalogo");
    },
    onToast: () => show("Iscrizione registrata", "Ti scriviamo martedì.")
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    items: NAV,
    active: route === "carta" ? "catalogo" : route,
    onNavigate: go,
    logoSrc: "../../assets/logo-mark.svg",
    right: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IconButton, {
      icon: "heart",
      variant: "ghost",
      label: "La tua lista",
      active: Object.values(liked).some(Boolean),
      onClick: () => show("La tua lista", Object.values(liked).filter(Boolean).length + " carte salvate", "neutral")
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "search",
      variant: "ghost",
      label: "Cerca",
      onClick: () => go("catalogo")
    }), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: () => go("negozio")
    }, "Vieni a trovarci"))
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1
    }
  }, route === "home" && /*#__PURE__*/React.createElement(window.HomeScreen, props), route === "catalogo" && /*#__PURE__*/React.createElement(window.CatalogScreen, props), route === "espansioni" && /*#__PURE__*/React.createElement(window.SetsScreen, props), route === "negozio" && /*#__PURE__*/React.createElement(window.StoreScreen, props), route === "carta" && card && /*#__PURE__*/React.createElement(window.CardDetailScreen, _extends({
    card: card
  }, props))), /*#__PURE__*/React.createElement(Footer, {
    onNavigate: go
  }), /*#__PURE__*/React.createElement(Dialog, {
    open: !!quick,
    title: quick && quick.name,
    eyebrow: quick && window.setOf(quick.set).name,
    onClose: () => setQuick(null),
    footer: /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        openCard(quick);
        setQuick(null);
      }
    }, "Vedi la scheda")
  }, quick && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--sp-5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 140,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(CardArt, {
    rarity: quick.rarity,
    code: window.codeOf(quick)
  })), /*#__PURE__*/React.createElement(SpecList, {
    style: {
      flex: 1
    },
    items: [{
      label: "Codice",
      value: window.codeOf(quick),
      mono: true
    }, {
      label: "Rarità",
      value: /*#__PURE__*/React.createElement(RarityBadge, {
        rarity: quick.rarity,
        size: "sm"
      })
    }, {
      label: "Condizione",
      value: /*#__PURE__*/React.createElement(ConditionBadge, {
        condition: quick.cond,
        compact: true
      })
    }]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      right: "var(--sp-6)",
      bottom: "var(--sp-6)",
      zIndex: 80,
      display: "grid",
      gap: 10,
      opacity: toast ? 1 : 0,
      transform: toast ? "translateY(0)" : "translateY(12px)",
      transition: "opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-spring)",
      pointerEvents: toast ? "auto" : "none"
    }
  }, toast && /*#__PURE__*/React.createElement(Toast, {
    tone: toast.tone,
    title: toast.title,
    description: toast.description,
    onClose: () => setToast(null)
  })));
}
Object.assign(window, {
  App,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sito/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sito/CardDetailScreen.jsx
try { (() => {
const {
  Button,
  IconButton,
  Badge,
  Panel,
  Icon,
  CardArt,
  CardTile,
  RarityBadge,
  ConditionBadge,
  SpecList,
  Breadcrumb,
  Tooltip
} = window.CartafoliaDesignSystem_3cbf75;
function CardDetailScreen({
  card,
  onNavigate,
  onOpen,
  liked,
  onLike
}) {
  const [hover, setHover] = React.useState(false);
  const [rot, setRot] = React.useState({
    x: 0,
    y: 0
  });
  const s = window.setOf(card.set);
  const move = e => {
    const r = e.currentTarget.getBoundingClientRect();
    setRot({
      y: ((e.clientX - r.left) / r.width - .5) * 16,
      x: -((e.clientY - r.top) / r.height - .5) * 16
    });
  };
  const simili = window.CARDS.filter(c => c.id !== card.id && (c.set === card.set || c.rarity === card.rarity)).slice(0, 4);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "var(--sp-8) var(--gutter-lg) var(--section-y)"
    }
  }, /*#__PURE__*/React.createElement(Breadcrumb, {
    style: {
      marginBottom: "var(--sp-8)"
    },
    onNavigate: id => onNavigate(id),
    items: [{
      id: "home",
      label: "Vetrina"
    }, {
      id: "catalogo",
      label: "Catalogo"
    }, {
      id: "espansioni",
      label: s.name
    }, {
      label: card.name
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "cf-detail",
    style: {
      display: "grid",
      gridTemplateColumns: "420px minmax(0,1fr)",
      gap: "var(--sp-16)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cf-detail-sticky",
    style: {
      position: "sticky",
      top: 100,
      display: "grid",
      gap: "var(--sp-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      perspective: 900
    },
    onMouseMove: move,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setRot({
        x: 0,
        y: 0
      });
    }
  }, /*#__PURE__*/React.createElement(CardArt, {
    rarity: card.rarity,
    code: window.codeOf(card),
    sheen: hover ? 1 : 0,
    radius: "var(--r-lg)",
    style: {
      transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale(${hover ? 1.03 : 1})`,
      transformStyle: "preserve-3d",
      transition: "transform var(--dur-base) var(--ease-out)",
      boxShadow: hover ? "var(--sh-glow-cyan)" : "var(--sh-2)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--sp-2)",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 14,
    style: {
      color: "var(--text-faint)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      fontSize: "var(--fs-caption)",
      fontWeight: "var(--fw-regular)",
      color: "var(--text-muted)"
    }
  }, "Muovi il mouse sulla carta per vedere il riflesso"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--sp-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--sp-3)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--sp-2)",
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(RarityBadge, {
    rarity: card.rarity
  }), /*#__PURE__*/React.createElement(ConditionBadge, {
    condition: card.cond
  }), card.nuovo && /*#__PURE__*/React.createElement(Badge, {
    tone: "foil"
  }, "Nuovo arrivo")), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--fw-bold) var(--fs-display-l)/var(--lh-display-l) var(--font-display)",
      letterSpacing: "var(--ls-display-l)"
    }
  }, card.name), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      fontSize: "var(--fs-body-l)",
      lineHeight: "var(--lh-body-l)",
      color: "var(--text-muted)",
      maxWidth: 560
    }
  }, "Esposta in vetrina 3, sotto vetro. \xC8 una ", s.name.toLowerCase(), " del ", s.year, ": chiedila in negozio e la guardiamo insieme, fuori dalla bustina.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--sp-3)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 16
    })
  }, "Vieni a vederla"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "heart",
      size: 16
    }),
    onClick: () => onLike(card)
  }, liked[card.id] ? "Nella tua lista" : "Salva nella lista"), /*#__PURE__*/React.createElement(Tooltip, {
    label: "Copia il link della scheda"
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "share-2",
    label: "Condividi"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cf-2col",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--sp-6)"
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    padding: "var(--sp-5)"
  }, /*#__PURE__*/React.createElement(SpecList, {
    items: [{
      label: "Espansione",
      value: s.name
    }, {
      label: "Codice",
      value: window.codeOf(card),
      mono: true
    }, {
      label: "Numero",
      value: card.num,
      mono: true
    }, {
      label: "Anno",
      value: String(s.year),
      mono: true
    }]
  })), /*#__PURE__*/React.createElement(Panel, {
    padding: "var(--sp-5)"
  }, /*#__PURE__*/React.createElement(SpecList, {
    items: [{
      label: "Illustrazione",
      value: card.artist
    }, {
      label: "Lingua",
      value: card.lang
    }, {
      label: "Condizione",
      value: card.cond === "near-mint" ? "Near Mint" : card.cond[0].toUpperCase() + card.cond.slice(1)
    }, {
      label: "In vetrina da",
      value: "12 marzo",
      mono: true
    }]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--sp-4)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--fw-bold) var(--fs-title-m)/var(--lh-title-m) var(--font-display)",
      letterSpacing: "var(--ls-title-m)"
    }
  }, "Nella stessa vetrina"), /*#__PURE__*/React.createElement("div", {
    className: "cf-row5",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
      gap: "var(--grid-gap)"
    }
  }, simili.map(c => /*#__PURE__*/React.createElement(CardTile, {
    key: c.id,
    name: c.name,
    code: window.codeOf(c),
    rarity: c.rarity,
    tilt: false,
    onClick: () => onOpen(c)
  })))))));
}
Object.assign(window, {
  CardDetailScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sito/CardDetailScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sito/CatalogScreen.jsx
try { (() => {
const {
  Button,
  IconButton,
  Badge,
  Chip,
  Panel,
  Icon,
  SearchField,
  Select,
  Checkbox,
  Switch,
  CardTile,
  CardArt,
  RarityBadge,
  ConditionBadge,
  FilterGroup,
  Tabs,
  Pagination,
  EmptyState,
  Skeleton
} = window.CartafoliaDesignSystem_3cbf75;
const RARITIES = [["common", "Comune"], ["uncommon", "Non comune"], ["rare", "Rara"], ["holo", "Holo"], ["ultra", "Ultra rara"], ["secret", "Segreta"]];
function CatalogScreen({
  query,
  setQuery,
  onOpen,
  liked,
  onLike
}) {
  const [rar, setRar] = React.useState([]);
  const [sets, setSets] = React.useState([]);
  const [foil, setFoil] = React.useState(false);
  const [view, setView] = React.useState("griglia");
  const [sort, setSort] = React.useState("Novità");
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 380);
    return () => clearTimeout(t);
  }, [rar, sets, foil, query, sort]);
  const list = window.CARDS.filter(c => (!rar.length || rar.includes(c.rarity)) && (!sets.length || sets.includes(c.set)) && (!foil || ["holo", "ultra", "secret"].includes(c.rarity)) && (!query || c.name.toLowerCase().includes(query.toLowerCase()) || window.codeOf(c).toLowerCase().includes(query.toLowerCase())));
  const active = rar.length + sets.length + (foil ? 1 : 0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "var(--sp-10) var(--gutter-lg) var(--section-y)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--sp-4)",
      marginBottom: "var(--sp-8)"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--fw-bold) var(--fs-display-l)/var(--lh-display-l) var(--font-display)",
      letterSpacing: "var(--ls-display-l)"
    }
  }, "Catalogo"), /*#__PURE__*/React.createElement(SearchField, {
    size: "md",
    value: query,
    onChange: e => setQuery(e.target.value),
    onClear: () => setQuery(""),
    style: {
      maxWidth: 640
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "cf-catalog",
    style: {
      display: "grid",
      gridTemplateColumns: "260px minmax(0,1fr)",
      gap: "var(--sp-10)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("aside", {
    className: "cf-sidebar",
    style: {
      position: "sticky",
      top: 96,
      display: "grid",
      gap: "var(--sp-2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      fontWeight: "var(--fw-bold)",
      color: "var(--text-strong)"
    }
  }, "Filtri ", active > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-brand)"
    }
  }, "(", active, ")")), active > 0 && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setRar([]);
      setSets([]);
      setFoil(false);
    },
    style: {
      all: "unset",
      cursor: "pointer",
      font: "var(--type-label)",
      fontSize: "var(--fs-caption)",
      color: "var(--text-muted)",
      textDecoration: "underline"
    }
  }, "azzera")), /*#__PURE__*/React.createElement(Switch, {
    checked: foil,
    label: "Solo foil",
    onChange: () => setFoil(!foil),
    style: {
      margin: "var(--sp-2) 0"
    }
  }), /*#__PURE__*/React.createElement(FilterGroup, {
    title: "Rarit\xE0",
    activeCount: rar.length
  }, RARITIES.map(([id, l]) => /*#__PURE__*/React.createElement(Checkbox, {
    key: id,
    checked: rar.includes(id),
    label: l,
    count: window.CARDS.filter(c => c.rarity === id).length,
    onChange: () => toggle(rar, setRar, id)
  }))), /*#__PURE__*/React.createElement(FilterGroup, {
    title: "Espansione",
    activeCount: sets.length
  }, window.SETS.map(s => /*#__PURE__*/React.createElement(Checkbox, {
    key: s.id,
    checked: sets.includes(s.id),
    label: s.name,
    description: s.code + " · " + s.year,
    count: window.CARDS.filter(c => c.set === s.id).length,
    onChange: () => toggle(sets, setSets, s.id)
  }))), /*#__PURE__*/React.createElement(FilterGroup, {
    title: "Condizione",
    defaultOpen: false
  }, [["mint", "Mint"], ["near-mint", "Near Mint"], ["excellent", "Excellent"], ["good", "Good"], ["played", "Played"]].map(([id, l]) => /*#__PURE__*/React.createElement(Checkbox, {
    key: id,
    label: l,
    count: window.CARDS.filter(c => c.cond === id).length
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--sp-5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--sp-4)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      color: "var(--text-muted)"
    }
  }, list.length, " carte"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--sp-2)",
      flexWrap: "wrap"
    }
  }, rar.map(r => /*#__PURE__*/React.createElement(Chip, {
    key: r,
    onRemove: () => toggle(rar, setRar, r)
  }, (RARITIES.find(x => x[0] === r) || [])[1])), sets.map(s => /*#__PURE__*/React.createElement(Chip, {
    key: s,
    onRemove: () => toggle(sets, setSets, s)
  }, window.setOf(s).name))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: "var(--sp-3)"
    }
  }, /*#__PURE__*/React.createElement(Select, {
    size: "sm",
    value: sort,
    options: ["Novità", "Rarità", "A–Z", "Espansione"],
    onChange: e => setSort(e.target.value)
  }), /*#__PURE__*/React.createElement(Tabs, {
    variant: "pill",
    items: [{
      id: "griglia",
      label: "Griglia"
    }, {
      id: "lista",
      label: "Lista"
    }],
    value: view,
    onChange: setView
  }))), loading ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(var(--grid-card-min),1fr))",
      gap: "var(--grid-gap)"
    }
  }, Array.from({
    length: 8
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "grid",
      gap: 10,
      padding: 12,
      background: "var(--surface-card)",
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--r-card)"
    }
  }, /*#__PURE__*/React.createElement(Skeleton, {
    shape: "card"
  }), /*#__PURE__*/React.createElement(Skeleton, {
    count: 2
  })))) : list.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    title: "Nessuna carta con questi filtri",
    description: "Prova a togliere la rarit\xE0 o ad allargare l'espansione.",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => {
        setRar([]);
        setSets([]);
        setFoil(false);
        setQuery("");
      }
    }, "Azzera i filtri")
  }) : view === "griglia" ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(var(--grid-card-min),1fr))",
      gap: "var(--grid-gap)"
    }
  }, list.map(c => /*#__PURE__*/React.createElement(CardTile, {
    key: c.id,
    name: c.name,
    code: window.codeOf(c),
    set: window.setOf(c.set).name,
    rarity: c.rarity,
    liked: !!liked[c.id],
    onLike: () => onLike(c),
    onClick: () => onOpen(c),
    badge: c.nuovo ? /*#__PURE__*/React.createElement(Badge, {
      tone: "foil"
    }, "Nuovo") : null
  }))) : /*#__PURE__*/React.createElement(Panel, {
    padding: "0",
    style: {
      overflow: "hidden"
    }
  }, list.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    onClick: () => onOpen(c),
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--sp-4)",
      padding: "var(--sp-3) var(--sp-4)",
      cursor: "pointer",
      borderTop: i ? "1px solid var(--border-hairline)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(CardArt, {
    rarity: c.rarity
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-card-title)",
      flex: 1,
      color: "var(--text-strong)"
    }
  }, c.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-code)",
      color: "var(--text-faint)",
      width: 96
    }
  }, window.codeOf(c)), /*#__PURE__*/React.createElement(RarityBadge, {
    rarity: c.rarity,
    size: "sm"
  }), /*#__PURE__*/React.createElement(ConditionBadge, {
    condition: c.cond,
    compact: true
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "heart",
    size: "sm",
    variant: liked[c.id] ? "brand" : "ghost",
    label: "Preferiti",
    onClick: e => {
      e.stopPropagation();
      onLike(c);
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      paddingTop: "var(--sp-6)"
    }
  }, /*#__PURE__*/React.createElement(Pagination, {
    page: page,
    pages: 12,
    onChange: setPage
  })))));
}
Object.assign(window, {
  CatalogScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sito/CatalogScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sito/HomeScreen.jsx
try { (() => {
const {
  Button,
  IconButton,
  Badge,
  Chip,
  Panel,
  Icon,
  SearchField,
  CardTile,
  RarityBadge,
  Tabs
} = window.CartafoliaDesignSystem_3cbf75;
function Hero({
  query,
  setQuery,
  onSearch
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      overflow: "hidden",
      background: "var(--surface-page)",
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--pattern-dots) 0 0/var(--pattern-dots-size)",
      opacity: .7
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "cf-2col",
    style: {
      position: "relative",
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "var(--sp-20) var(--gutter-lg) var(--sp-16)",
      display: "grid",
      gridTemplateColumns: "minmax(0,1.15fr) minmax(0,.85fr)",
      gap: "var(--sp-16)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--sp-6)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-eyebrow)",
      letterSpacing: "var(--ls-eyebrow)",
      textTransform: "uppercase",
      color: "var(--text-brand)"
    }
  }, "Vetrina e catalogo \xB7 Bologna"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--fw-black) var(--fs-display-xl)/var(--lh-display-xl) var(--font-display)",
      letterSpacing: "var(--ls-display-xl)",
      color: "var(--text-strong)"
    }
  }, "2 480 carte,", /*#__PURE__*/React.createElement("br", null), "schedate a mano."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      fontSize: "var(--fs-body-l)",
      lineHeight: "var(--lh-body-l)",
      color: "var(--text-muted)",
      maxWidth: 520
    }
  }, "Questo \xE8 il catalogo del negozio: cerca una carta, guarda com'\xE8 conservata, poi passa a vederla dal vero. Non vendiamo online."), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement(SearchField, {
    value: query,
    onChange: e => setQuery(e.target.value),
    onClear: () => setQuery(""),
    suggestions: query ? window.CARDS.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4).map(c => ({
      label: c.name,
      meta: window.codeOf(c)
    })) : [],
    onPick: s => onSearch(s.label)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--sp-2)",
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      fontSize: "var(--fs-caption)",
      color: "var(--text-faint)",
      marginRight: 4
    }
  }, "Cercati oggi"), ["Holo", "Prima edizione", "Fornace Antica", "Sotto i 10 €"].map(t => /*#__PURE__*/React.createElement(Chip, {
    key: t,
    onClick: () => onSearch(t)
  }, t)))), /*#__PURE__*/React.createElement("div", {
    className: "cf-hero-cards",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--sp-4)"
    }
  }, window.CARDS.slice(0, 4).map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    style: {
      transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)`
    }
  }, /*#__PURE__*/React.createElement(CardTile, {
    name: c.name,
    code: window.codeOf(c),
    set: window.setOf(c.set).name,
    rarity: c.rarity,
    badge: c.nuovo ? /*#__PURE__*/React.createElement(Badge, {
      tone: "foil"
    }, "Nuovo") : null
  }))))));
}
function NuoviArrivi({
  onOpen,
  liked,
  onLike
}) {
  const [tab, setTab] = React.useState("tutte");
  const list = window.CARDS.filter(c => tab === "tutte" ? true : tab === "holo" ? ["holo", "ultra", "secret"].includes(c.rarity) : window.setOf(c.set).year < 2010).slice(0, 5);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "var(--section-y) var(--gutter-lg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "var(--sp-6)",
      marginBottom: "var(--sp-8)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--sp-2)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-section)",
      letterSpacing: "var(--ls-display-m)"
    }
  }, "Appena entrate in vetrina"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-muted)"
    }
  }, "Aggiornato ogni marted\xEC, dopo l'apertura delle buste.")), /*#__PURE__*/React.createElement(Tabs, {
    items: [{
      id: "tutte",
      label: "Tutte"
    }, {
      id: "holo",
      label: "Holo e oltre"
    }, {
      id: "vintage",
      label: "Vintage"
    }],
    value: tab,
    onChange: setTab
  })), /*#__PURE__*/React.createElement("div", {
    className: "cf-row5",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(var(--grid-card-min),1fr))",
      gap: "var(--grid-gap)"
    }
  }, list.map(c => /*#__PURE__*/React.createElement(CardTile, {
    key: c.id,
    name: c.name,
    code: window.codeOf(c),
    set: window.setOf(c.set).name,
    rarity: c.rarity,
    liked: !!liked[c.id],
    onLike: () => onLike(c),
    onClick: () => onOpen(c),
    badge: c.nuovo ? /*#__PURE__*/React.createElement(Badge, {
      tone: "foil"
    }, "Nuovo") : null
  }))));
}
function Espansioni({
  onOpenSet
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-invert)",
      color: "var(--text-invert)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "var(--section-y) var(--gutter-lg)",
      display: "grid",
      gap: "var(--sp-10)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "var(--sp-6)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-section)",
      letterSpacing: "var(--ls-display-m)",
      color: "var(--text-invert)"
    }
  }, "Sei espansioni in negozio"), /*#__PURE__*/React.createElement(Button, {
    variant: "invert",
    as: "a",
    href: "#",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 16
    }),
    onClick: e => {
      e.preventDefault();
      onOpenSet();
    }
  }, "Vedi tutte")), /*#__PURE__*/React.createElement("div", {
    className: "cf-sets-inner",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
      gap: "var(--sp-4)"
    }
  }, window.SETS.map(s => /*#__PURE__*/React.createElement("a", {
    key: s.id,
    href: "#",
    onClick: e => {
      e.preventDefault();
      onOpenSet(s);
    },
    style: {
      textDecoration: "none",
      display: "grid",
      gap: "var(--sp-3)",
      padding: "var(--sp-5)",
      borderRadius: "var(--r-card)",
      background: "var(--surface-invert-soft)",
      border: "1px solid var(--border-invert)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: "var(--r-sm)",
      background: s.color
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-code)",
      color: "var(--ink-400)"
    }
  }, s.code, " \xB7 ", s.year)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--fw-bold) var(--fs-title-s)/var(--lh-title-s) var(--font-display)",
      color: "var(--text-invert)"
    }
  }, s.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      fontSize: "var(--fs-caption)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-invert-muted)"
    }
  }, s.total, " carte \xB7 ", Math.round(s.total * 0.42), " in vetrina"))))));
}
function Negozio() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "var(--section-y) var(--gutter-lg)",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--sp-12)",
      alignItems: "center"
    },
    className: "cf-2col"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--sp-5)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-section)",
      letterSpacing: "var(--ls-display-m)"
    }
  }, "Il tavolo grande \xE8 sempre libero"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      fontSize: "var(--fs-body-l)",
      lineHeight: "var(--lh-body-l)",
      color: "var(--text-muted)"
    }
  }, "Il negozio \xE8 in via Zamboni 41. Le carte del catalogo sono tutte in vetrina: chiedi e te le facciamo vedere dal vivo, senza fretta."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--sp-3)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 16
    })
  }, "Come arrivare"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 16
    })
  }, "Orari"))), /*#__PURE__*/React.createElement(Panel, {
    variant: "sticker",
    padding: "var(--sp-8)",
    style: {
      display: "grid",
      gap: "var(--sp-4)"
    }
  }, [["Martedì – Sabato", "10:00 – 19:30"], ["Domenica", "15:00 – 19:00"], ["Lunedì", "chiuso"]].map(([g, h]) => /*#__PURE__*/React.createElement("div", {
    key: g,
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: "var(--sp-4)",
      paddingBottom: "var(--sp-3)",
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      color: "var(--text-strong)"
    }
  }, g), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-code)",
      fontSize: "var(--fs-body-s)",
      color: "var(--text-body)"
    }
  }, h))), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      fontSize: "var(--fs-caption)",
      fontWeight: "var(--fw-regular)",
      color: "var(--text-muted)"
    }
  }, "Il marted\xEC apriamo le buste nuove alle 17:00. Si pu\xF2 guardare.")));
}
function HomeScreen(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Hero, props), /*#__PURE__*/React.createElement(NuoviArrivi, props), /*#__PURE__*/React.createElement(Espansioni, props), /*#__PURE__*/React.createElement(Negozio, null));
}
Object.assign(window, {
  HomeScreen,
  Hero,
  NuoviArrivi,
  Espansioni,
  Negozio
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sito/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sito/SetsScreen.jsx
try { (() => {
const {
  Button,
  Panel,
  Icon,
  Badge,
  CardArt,
  Tabs,
  RarityBadge
} = window.CartafoliaDesignSystem_3cbf75;
function SetsScreen({
  onOpenSet,
  onNavigate
}) {
  const [tab, setTab] = React.useState("tutte");
  const sets = window.SETS.filter(s => tab === "tutte" ? true : tab === "recenti" ? s.year >= 2023 : s.year < 2010);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "var(--sp-10) var(--gutter-lg) var(--section-y)",
      display: "grid",
      gap: "var(--sp-8)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--sp-4)",
      maxWidth: "var(--page-narrow)"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--fw-bold) var(--fs-display-l)/var(--lh-display-l) var(--font-display)",
      letterSpacing: "var(--ls-display-l)"
    }
  }, "Espansioni"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      fontSize: "var(--fs-body-l)",
      lineHeight: "var(--lh-body-l)",
      color: "var(--text-muted)"
    }
  }, "Ogni espansione ha il suo raccoglitore in negozio. Qui vedi quante carte ne abbiamo schedate."), /*#__PURE__*/React.createElement(Tabs, {
    items: [{
      id: "tutte",
      label: "Tutte",
      count: 6
    }, {
      id: "recenti",
      label: "Recenti"
    }, {
      id: "vintage",
      label: "Vintage"
    }],
    value: tab,
    onChange: setTab
  })), /*#__PURE__*/React.createElement("div", {
    className: "cf-sets",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(420px,1fr))",
      gap: "var(--sp-6)"
    }
  }, sets.map(s => {
    const cards = window.CARDS.filter(c => c.set === s.id);
    return /*#__PURE__*/React.createElement(Panel, {
      key: s.id,
      hoverLift: true,
      as: "article",
      padding: "var(--sp-6)",
      style: {
        display: "grid",
        gap: "var(--sp-5)",
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--sp-4)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 52,
        height: 52,
        flex: "none",
        borderRadius: "var(--r-md)",
        background: s.color,
        border: "2px solid var(--ink-950)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gap: 4,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: "var(--type-code)",
        color: "var(--text-faint)"
      }
    }, s.code, " \xB7 ", s.year), /*#__PURE__*/React.createElement("h2", {
      style: {
        font: "var(--fw-bold) var(--fs-title-m)/var(--lh-title-m) var(--font-display)",
        letterSpacing: "var(--ls-title-m)"
      }
    }, s.name)), s.year < 2010 && /*#__PURE__*/React.createElement(Badge, {
      tone: "invert"
    }, "Vintage")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: "var(--sp-2)"
      }
    }, Array.from({
      length: 6
    }).map((_, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 44
      }
    }, /*#__PURE__*/React.createElement(CardArt, {
      rarity: i % 3 === 0 ? "holo" : "common"
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--sp-4)",
        paddingTop: "var(--sp-3)",
        borderTop: "1px solid var(--border-hairline)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: "var(--type-label)",
        color: "var(--text-muted)"
      }
    }, cards.length, " schedate su ", s.total), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconRight: /*#__PURE__*/React.createElement(Icon, {
        name: "arrow-right",
        size: 16
      }),
      onClick: () => onOpenSet(s)
    }, "Sfoglia")));
  })));
}
Object.assign(window, {
  SetsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sito/SetsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sito/StoreScreen.jsx
try { (() => {
const {
  Button,
  Panel,
  Icon,
  Input,
  Checkbox,
  Badge
} = window.CartafoliaDesignSystem_3cbf75;
function StoreScreen({
  onToast
}) {
  const [email, setEmail] = React.useState("");
  const [ok, setOk] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "var(--sp-10) var(--gutter-lg) var(--section-y)",
      display: "grid",
      gap: "var(--sp-12)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cf-2col",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--sp-12)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--sp-5)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-eyebrow)",
      letterSpacing: "var(--ls-eyebrow)",
      textTransform: "uppercase",
      color: "var(--text-brand)"
    }
  }, "Il negozio"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--fw-bold) var(--fs-display-l)/var(--lh-display-l) var(--font-display)",
      letterSpacing: "var(--ls-display-l)"
    }
  }, "Via Zamboni 41,", /*#__PURE__*/React.createElement("br", null), "Bologna"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      fontSize: "var(--fs-body-l)",
      lineHeight: "var(--lh-body-l)",
      color: "var(--text-muted)"
    }
  }, "Due vetrine, un tavolo da sei posti e tre raccoglitori sempre aperti. Le carte del catalogo sono qui: si guardano, si confrontano, si scambiano."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--sp-3)"
    }
  }, [["map-pin", "Via Zamboni 41 · 40126 Bologna"], ["clock", "Mar–Sab 10:00–19:30 · Dom 15:00–19:00"], ["mail", "ciao@cartafolia.it"], ["instagram", "@cartafolia"]].map(([ic, t]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--sp-3)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      placeItems: "center",
      width: 34,
      height: 34,
      borderRadius: "var(--r-pill)",
      background: "var(--surface-sunken)",
      color: "var(--text-strong)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-body)",
      fontSize: "var(--fs-body-s)",
      color: "var(--text-body)"
    }
  }, t))))), /*#__PURE__*/React.createElement(Panel, {
    variant: "sunken",
    padding: "0",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "4/3",
      background: "var(--pattern-grid) 0 0/var(--pattern-grid-size),var(--surface-card)",
      display: "grid",
      placeItems: "center",
      gap: 8,
      textAlign: "center",
      padding: "var(--sp-6)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 28,
    style: {
      color: "var(--text-faint)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      color: "var(--text-muted)"
    }
  }, "Mappa o foto della vetrina"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      fontSize: "var(--fs-caption)",
      fontWeight: "var(--fw-regular)",
      color: "var(--text-faint)"
    }
  }, "Placeholder: nessuna immagine fornita")))), /*#__PURE__*/React.createElement(Panel, {
    variant: "sticker",
    padding: "var(--sp-8)",
    className: "cf-2col",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--sp-8)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--sp-3)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--fw-bold) var(--fs-title-l)/var(--lh-title-l) var(--font-display)",
      letterSpacing: "var(--ls-title-l)"
    }
  }, "Ti scriviamo il marted\xEC"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-muted)"
    }
  }, "Una mail a settimana con le carte entrate in vetrina. Niente altro.")), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setOk(true);
      onToast && onToast();
    },
    style: {
      display: "grid",
      gap: "var(--sp-3)"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    placeholder: "tu@esempio.it",
    value: email,
    onChange: e => setEmail(e.target.value)
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Ho letto l'informativa privacy",
    description: "Usiamo l'indirizzo solo per la mail del marted\xEC."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--sp-3)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit"
  }, "Iscrivimi"), ok && /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 12
    })
  }, "Fatto")))));
}
Object.assign(window, {
  StoreScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sito/StoreScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sito/data.jsx
try { (() => {
const SETS = [{
  id: "alb",
  name: "Alba Cromatica",
  code: "ALB",
  year: 2024,
  total: 198,
  color: "var(--cherry-500)"
}, {
  id: "eco",
  name: "Eco del Vulcano",
  code: "ECO",
  year: 2024,
  total: 165,
  color: "var(--lemon-500)"
}, {
  id: "mar",
  name: "Marea Silente",
  code: "MAR",
  year: 2023,
  total: 172,
  color: "var(--cyan-500)"
}, {
  id: "rad",
  name: "Radici Profonde",
  code: "RAD",
  year: 2023,
  total: 154,
  color: "var(--lime-500)"
}, {
  id: "cie",
  name: "Cieli Spezzati",
  code: "CIE",
  year: 2022,
  total: 189,
  color: "var(--grape-500)"
}, {
  id: "for",
  name: "Fornace Antica",
  code: "FOR",
  year: 1999,
  total: 102,
  color: "var(--ink-500)"
}];
const CARDS = [{
  id: 1,
  name: "Fulmine Notturno",
  num: "045/198",
  set: "alb",
  rarity: "holo",
  cond: "near-mint",
  artist: "M. Ferretti",
  lang: "Italiano",
  nuovo: true
}, {
  id: 2,
  name: "Guardiano di Bosco",
  num: "112/165",
  set: "eco",
  rarity: "ultra",
  cond: "mint",
  artist: "S. Adani",
  lang: "Italiano",
  nuovo: true
}, {
  id: 3,
  name: "Ala di Cenere",
  num: "003/198",
  set: "alb",
  rarity: "common",
  cond: "excellent",
  artist: "M. Ferretti",
  lang: "Italiano"
}, {
  id: 4,
  name: "Serpe di Marea",
  num: "078/172",
  set: "mar",
  rarity: "rare",
  cond: "near-mint",
  artist: "L. Bonetti",
  lang: "Giapponese"
}, {
  id: 5,
  name: "Riccio Solare",
  num: "021/154",
  set: "rad",
  rarity: "uncommon",
  cond: "good",
  artist: "S. Adani",
  lang: "Italiano"
}, {
  id: 6,
  name: "Scudo di Quarzo",
  num: "160/165",
  set: "eco",
  rarity: "secret",
  cond: "mint",
  artist: "G. Prandi",
  lang: "Italiano",
  nuovo: true
}, {
  id: 7,
  name: "Volpe di Bruma",
  num: "099/189",
  set: "cie",
  rarity: "holo",
  cond: "excellent",
  artist: "L. Bonetti",
  lang: "Inglese"
}, {
  id: 8,
  name: "Coleottero d'Ottone",
  num: "034/154",
  set: "rad",
  rarity: "common",
  cond: "played",
  artist: "G. Prandi",
  lang: "Italiano"
}, {
  id: 9,
  name: "Lupo di Vetro",
  num: "141/189",
  set: "cie",
  rarity: "ultra",
  cond: "near-mint",
  artist: "M. Ferretti",
  lang: "Italiano"
}, {
  id: 10,
  name: "Rana di Pioggia",
  num: "056/172",
  set: "mar",
  rarity: "uncommon",
  cond: "good",
  artist: "S. Adani",
  lang: "Italiano"
}, {
  id: 11,
  name: "Falco Cremisi",
  num: "012/102",
  set: "for",
  rarity: "holo",
  cond: "excellent",
  artist: "ignoto",
  lang: "Inglese"
}, {
  id: 12,
  name: "Tartaruga di Sale",
  num: "088/198",
  set: "alb",
  rarity: "rare",
  cond: "mint",
  artist: "L. Bonetti",
  lang: "Italiano"
}];
const setOf = id => SETS.find(s => s.id === id) || SETS[0];
const codeOf = c => setOf(c.set).code + " " + c.num;
Object.assign(window, {
  SETS,
  CARDS,
  setOf,
  codeOf
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sito/data.jsx", error: String((e && e.message) || e) }); }

__ds_ns.CardArt = __ds_scope.CardArt;

__ds_ns.CardTile = __ds_scope.CardTile;

__ds_ns.ConditionBadge = __ds_scope.ConditionBadge;

__ds_ns.FilterGroup = __ds_scope.FilterGroup;

__ds_ns.RarityBadge = __ds_scope.RarityBadge;

__ds_ns.SpecList = __ds_scope.SpecList;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SearchField = __ds_scope.SearchField;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.Pagination = __ds_scope.Pagination;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
