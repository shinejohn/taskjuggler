import * as Fn from "vue";
import { inject as Nt, provide as an, computed as A, shallowRef as Kt, shallowReadonly as ct, isRef as pt, reactive as so, unref as a, watch as re, customRef as Ia, toValue as we, getCurrentScope as pr, onScopeDispose as fr, onBeforeUnmount as mo, effectScope as vr, watchEffect as se, readonly as Ma, getCurrentInstance as vt, toRefs as ue, ref as P, nextTick as ce, onMounted as pe, Fragment as qe, toHandlerKey as Ra, camelize as mr, onUpdated as Fa, triggerRef as Va, toRef as Na, onUnmounted as Xe, defineComponent as h, h as Me, Comment as La, mergeProps as E, cloneVNode as ja, openBlock as m, createBlock as _, withCtx as y, renderSlot as b, createVNode as I, createCommentVNode as de, withKeys as Tt, normalizeStyle as Te, withModifiers as Ce, Teleport as yr, normalizeProps as X, guardReactiveProps as Q, markRaw as za, createElementBlock as H, renderList as Bt, watchPostEffect as gr, mergeDefaults as hr, withDirectives as sn, vShow as Ka, resolveDynamicComponent as Ie, toRaw as Ha, createElementVNode as ye, createTextVNode as Ot, toDisplayString as St, toHandlers as Wa, normalizeClass as Y, vModelText as br, useAttrs as Ua, isVNode as Mt } from "vue";
function _r(e) {
  var o, t, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var r = e.length;
    for (o = 0; o < r; o++) e[o] && (t = _r(e[o])) && (n && (n += " "), n += t);
  } else for (t in e) e[t] && (n && (n += " "), n += t);
  return n;
}
function wr() {
  for (var e, o, t = 0, n = "", r = arguments.length; t < r; t++) (e = arguments[t]) && (o = _r(e)) && (n && (n += " "), n += o);
  return n;
}
const ln = "-", Ga = (e) => {
  const o = Xa(e), {
    conflictingClassGroups: t,
    conflictingClassGroupModifiers: n
  } = e;
  return {
    getClassGroupId: (l) => {
      const i = l.split(ln);
      return i[0] === "" && i.length !== 1 && i.shift(), Cr(i, o) || Ya(l);
    },
    getConflictingClassGroupIds: (l, i) => {
      const u = t[l] || [];
      return i && n[l] ? [...u, ...n[l]] : u;
    }
  };
}, Cr = (e, o) => {
  if (e.length === 0)
    return o.classGroupId;
  const t = e[0], n = o.nextPart.get(t), r = n ? Cr(e.slice(1), n) : void 0;
  if (r)
    return r;
  if (o.validators.length === 0)
    return;
  const s = e.join(ln);
  return o.validators.find(({
    validator: l
  }) => l(s))?.classGroupId;
}, Vn = /^\[(.+)\]$/, Ya = (e) => {
  if (Vn.test(e)) {
    const o = Vn.exec(e)[1], t = o?.substring(0, o.indexOf(":"));
    if (t)
      return "arbitrary.." + t;
  }
}, Xa = (e) => {
  const {
    theme: o,
    prefix: t
  } = e, n = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Za(Object.entries(e.classGroups), t).forEach(([s, l]) => {
    Ko(l, n, s, o);
  }), n;
}, Ko = (e, o, t, n) => {
  e.forEach((r) => {
    if (typeof r == "string") {
      const s = r === "" ? o : Nn(o, r);
      s.classGroupId = t;
      return;
    }
    if (typeof r == "function") {
      if (Ja(r)) {
        Ko(r(n), o, t, n);
        return;
      }
      o.validators.push({
        validator: r,
        classGroupId: t
      });
      return;
    }
    Object.entries(r).forEach(([s, l]) => {
      Ko(l, Nn(o, s), t, n);
    });
  });
}, Nn = (e, o) => {
  let t = e;
  return o.split(ln).forEach((n) => {
    t.nextPart.has(n) || t.nextPart.set(n, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), t = t.nextPart.get(n);
  }), t;
}, Ja = (e) => e.isThemeGetter, Za = (e, o) => o ? e.map(([t, n]) => {
  const r = n.map((s) => typeof s == "string" ? o + s : typeof s == "object" ? Object.fromEntries(Object.entries(s).map(([l, i]) => [o + l, i])) : s);
  return [t, r];
}) : e, Qa = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let o = 0, t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  const r = (s, l) => {
    t.set(s, l), o++, o > e && (o = 0, n = t, t = /* @__PURE__ */ new Map());
  };
  return {
    get(s) {
      let l = t.get(s);
      if (l !== void 0)
        return l;
      if ((l = n.get(s)) !== void 0)
        return r(s, l), l;
    },
    set(s, l) {
      t.has(s) ? t.set(s, l) : r(s, l);
    }
  };
}, Sr = "!", es = (e) => {
  const {
    separator: o,
    experimentalParseClassName: t
  } = e, n = o.length === 1, r = o[0], s = o.length, l = (i) => {
    const u = [];
    let c = 0, d = 0, p;
    for (let S = 0; S < i.length; S++) {
      let O = i[S];
      if (c === 0) {
        if (O === r && (n || i.slice(S, S + s) === o)) {
          u.push(i.slice(d, S)), d = S + s;
          continue;
        }
        if (O === "/") {
          p = S;
          continue;
        }
      }
      O === "[" ? c++ : O === "]" && c--;
    }
    const f = u.length === 0 ? i : i.substring(d), v = f.startsWith(Sr), g = v ? f.substring(1) : f, w = p && p > d ? p - d : void 0;
    return {
      modifiers: u,
      hasImportantModifier: v,
      baseClassName: g,
      maybePostfixModifierPosition: w
    };
  };
  return t ? (i) => t({
    className: i,
    parseClassName: l
  }) : l;
}, ts = (e) => {
  if (e.length <= 1)
    return e;
  const o = [];
  let t = [];
  return e.forEach((n) => {
    n[0] === "[" ? (o.push(...t.sort(), n), t = []) : t.push(n);
  }), o.push(...t.sort()), o;
}, os = (e) => ({
  cache: Qa(e.cacheSize),
  parseClassName: es(e),
  ...Ga(e)
}), ns = /\s+/, rs = (e, o) => {
  const {
    parseClassName: t,
    getClassGroupId: n,
    getConflictingClassGroupIds: r
  } = o, s = [], l = e.trim().split(ns);
  let i = "";
  for (let u = l.length - 1; u >= 0; u -= 1) {
    const c = l[u], {
      modifiers: d,
      hasImportantModifier: p,
      baseClassName: f,
      maybePostfixModifierPosition: v
    } = t(c);
    let g = !!v, w = n(g ? f.substring(0, v) : f);
    if (!w) {
      if (!g) {
        i = c + (i.length > 0 ? " " + i : i);
        continue;
      }
      if (w = n(f), !w) {
        i = c + (i.length > 0 ? " " + i : i);
        continue;
      }
      g = !1;
    }
    const S = ts(d).join(":"), O = p ? S + Sr : S, x = O + w;
    if (s.includes(x))
      continue;
    s.push(x);
    const B = r(w, g);
    for (let C = 0; C < B.length; ++C) {
      const k = B[C];
      s.push(O + k);
    }
    i = c + (i.length > 0 ? " " + i : i);
  }
  return i;
};
function as() {
  let e = 0, o, t, n = "";
  for (; e < arguments.length; )
    (o = arguments[e++]) && (t = xr(o)) && (n && (n += " "), n += t);
  return n;
}
const xr = (e) => {
  if (typeof e == "string")
    return e;
  let o, t = "";
  for (let n = 0; n < e.length; n++)
    e[n] && (o = xr(e[n])) && (t && (t += " "), t += o);
  return t;
};
function ss(e, ...o) {
  let t, n, r, s = l;
  function l(u) {
    const c = o.reduce((d, p) => p(d), e());
    return t = os(c), n = t.cache.get, r = t.cache.set, s = i, i(u);
  }
  function i(u) {
    const c = n(u);
    if (c)
      return c;
    const d = rs(u, t);
    return r(u, d), d;
  }
  return function() {
    return s(as.apply(null, arguments));
  };
}
const ie = (e) => {
  const o = (t) => t[e] || [];
  return o.isThemeGetter = !0, o;
}, qr = /^\[(?:([a-z-]+):)?(.+)\]$/i, ls = /^\d+\/\d+$/, is = /* @__PURE__ */ new Set(["px", "full", "screen"]), us = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, ds = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, cs = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, ps = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, fs = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, We = (e) => xt(e) || is.has(e) || ls.test(e), Qe = (e) => Et(e, "length", ws), xt = (e) => !!e && !Number.isNaN(Number(e)), Io = (e) => Et(e, "number", xt), Rt = (e) => !!e && Number.isInteger(Number(e)), vs = (e) => e.endsWith("%") && xt(e.slice(0, -1)), Z = (e) => qr.test(e), et = (e) => us.test(e), ms = /* @__PURE__ */ new Set(["length", "size", "percentage"]), ys = (e) => Et(e, ms, Br), gs = (e) => Et(e, "position", Br), hs = /* @__PURE__ */ new Set(["image", "url"]), bs = (e) => Et(e, hs, Ss), _s = (e) => Et(e, "", Cs), Ft = () => !0, Et = (e, o, t) => {
  const n = qr.exec(e);
  return n ? n[1] ? typeof o == "string" ? n[1] === o : o.has(n[1]) : t(n[2]) : !1;
}, ws = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  ds.test(e) && !cs.test(e)
), Br = () => !1, Cs = (e) => ps.test(e), Ss = (e) => fs.test(e), xs = () => {
  const e = ie("colors"), o = ie("spacing"), t = ie("blur"), n = ie("brightness"), r = ie("borderColor"), s = ie("borderRadius"), l = ie("borderSpacing"), i = ie("borderWidth"), u = ie("contrast"), c = ie("grayscale"), d = ie("hueRotate"), p = ie("invert"), f = ie("gap"), v = ie("gradientColorStops"), g = ie("gradientColorStopPositions"), w = ie("inset"), S = ie("margin"), O = ie("opacity"), x = ie("padding"), B = ie("saturate"), C = ie("scale"), k = ie("sepia"), M = ie("skew"), R = ie("space"), N = ie("translate"), j = () => ["auto", "contain", "none"], q = () => ["auto", "hidden", "clip", "visible", "scroll"], F = () => ["auto", Z, o], D = () => [Z, o], W = () => ["", We, Qe], G = () => ["auto", xt, Z], $ = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], z = () => ["solid", "dashed", "dotted", "double", "none"], U = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], ne = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], ve = () => ["", "0", Z], Se = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], me = () => [xt, Z];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [Ft],
      spacing: [We, Qe],
      blur: ["none", "", et, Z],
      brightness: me(),
      borderColor: [e],
      borderRadius: ["none", "", "full", et, Z],
      borderSpacing: D(),
      borderWidth: W(),
      contrast: me(),
      grayscale: ve(),
      hueRotate: me(),
      invert: ve(),
      gap: D(),
      gradientColorStops: [e],
      gradientColorStopPositions: [vs, Qe],
      inset: F(),
      margin: F(),
      opacity: me(),
      padding: D(),
      saturate: me(),
      scale: me(),
      sepia: ve(),
      skew: me(),
      space: D(),
      translate: D()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", Z]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [et]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": Se()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": Se()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: [...$(), Z]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: q()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": q()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": q()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: j()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": j()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": j()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [w]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [w]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [w]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [w]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [w]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [w]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [w]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [w]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [w]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ["auto", Rt, Z]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: F()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["wrap", "wrap-reverse", "nowrap"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ["1", "auto", "initial", "none", Z]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ve()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ve()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", Rt, Z]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [Ft]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", Rt, Z]
        }, Z]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": G()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": G()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [Ft]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [Rt, Z]
        }, Z]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": G()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": G()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ["auto", "min", "max", "fr", Z]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", Z]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [f]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [f]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [f]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...ne()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": ["start", "end", "center", "stretch"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", "start", "end", "center", "stretch"]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...ne(), "baseline"]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", "start", "end", "center", "stretch", "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": [...ne(), "baseline"]
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", "start", "end", "center", "stretch"]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [x]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [x]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [x]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [x]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [x]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [x]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [x]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [x]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [x]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [S]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [S]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [S]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [S]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [S]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [S]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [S]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [S]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [S]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [R]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      "space-y": [{
        "space-y": [R]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-y-reverse": ["space-y-reverse"],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", Z, o]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [Z, o, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [Z, o, "none", "full", "min", "max", "fit", "prose", {
          screen: [et]
        }, et]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [Z, o, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [Z, o, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [Z, o, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [Z, o, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", et, Qe]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", Io]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Ft]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", Z]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", xt, Io]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", We, Z]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", Z]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", Z]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: [e]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [O]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: [e]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [O]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...z(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", We, Qe]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", We, Z]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [e]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: D()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", Z]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", Z]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      "bg-opacity": [{
        "bg-opacity": [O]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: [...$(), gs]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "round", "space"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", ys]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, bs]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [e]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [g]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [g]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [g]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [v]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [v]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [v]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [s]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [s]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [s]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [s]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [s]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [s]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [s]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [s]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [s]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [s]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [s]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [s]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [s]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [s]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [s]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [i]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [i]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [i]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [i]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [i]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [i]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [i]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [i]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [i]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [O]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...z(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [i]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y": [{
        "divide-y": [i]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      "divide-opacity": [{
        "divide-opacity": [O]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: z()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [r]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [r]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [r]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [r]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [r]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [r]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [r]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [r]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [r]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [r]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...z()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [We, Z]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [We, Qe]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [e]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: W()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      "ring-color": [{
        ring: [e]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [O]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [We, Qe]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [e]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", et, _s]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [Ft]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [O]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...U(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": U()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ["", "none"]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [t]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [n]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [u]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", et, Z]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [c]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [d]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [p]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [B]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [k]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": ["", "none"]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": [t]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [n]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [u]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [c]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [d]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [p]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [O]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [B]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [k]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": [l]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [l]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [l]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", Z]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: me()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", Z]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: me()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", Z]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ["", "gpu", "none"]
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [C]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [C]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [C]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [Rt, Z]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [N]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [N]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [M]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [M]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", Z]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", e]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", Z]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [e]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["none", "auto"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "y", "x", ""]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": D()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": D()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": D()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": D()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": D()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": D()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": D()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": D()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": D()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": D()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": D()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": D()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": D()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": D()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": D()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": D()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": D()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": D()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", Z]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [e, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [We, Qe, Io]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [e, "none"]
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    }
  };
}, qs = /* @__PURE__ */ ss(xs);
function L(...e) {
  return qs(wr(e));
}
const Ln = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, jn = wr, Ht = (e, o) => (t) => {
  var n;
  if (o?.variants == null) return jn(e, t?.class, t?.className);
  const { variants: r, defaultVariants: s } = o, l = Object.keys(r).map((c) => {
    const d = t?.[c], p = s?.[c];
    if (d === null) return null;
    const f = Ln(d) || Ln(p);
    return r[c][f];
  }), i = t && Object.entries(t).reduce((c, d) => {
    let [p, f] = d;
    return f === void 0 || (c[p] = f), c;
  }, {}), u = o == null || (n = o.compoundVariants) === null || n === void 0 ? void 0 : n.reduce((c, d) => {
    let { class: p, className: f, ...v } = d;
    return Object.entries(v).every((g) => {
      let [w, S] = g;
      return Array.isArray(S) ? S.includes({
        ...s,
        ...i
      }[w]) : {
        ...s,
        ...i
      }[w] === S;
    }) ? [
      ...c,
      p,
      f
    ] : c;
  }, []);
  return jn(e, l, u, t?.class, t?.className);
};
function zn(e) {
  return typeof e == "string" ? `'${e}'` : new Bs().serialize(e);
}
const Bs = /* @__PURE__ */ (function() {
  class e {
    #e = /* @__PURE__ */ new Map();
    compare(t, n) {
      const r = typeof t, s = typeof n;
      return r === "string" && s === "string" ? t.localeCompare(n) : r === "number" && s === "number" ? t - n : String.prototype.localeCompare.call(this.serialize(t, !0), this.serialize(n, !0));
    }
    serialize(t, n) {
      if (t === null) return "null";
      switch (typeof t) {
        case "string":
          return n ? t : `'${t}'`;
        case "bigint":
          return `${t}n`;
        case "object":
          return this.$object(t);
        case "function":
          return this.$function(t);
      }
      return String(t);
    }
    serializeObject(t) {
      const n = Object.prototype.toString.call(t);
      if (n !== "[object Object]") return this.serializeBuiltInType(n.length < 10 ? `unknown:${n}` : n.slice(8, -1), t);
      const r = t.constructor, s = r === Object || r === void 0 ? "" : r.name;
      if (s !== "" && globalThis[s] === r) return this.serializeBuiltInType(s, t);
      if (typeof t.toJSON == "function") {
        const l = t.toJSON();
        return s + (l !== null && typeof l == "object" ? this.$object(l) : `(${this.serialize(l)})`);
      }
      return this.serializeObjectEntries(s, Object.entries(t));
    }
    serializeBuiltInType(t, n) {
      const r = this["$" + t];
      if (r) return r.call(this, n);
      if (typeof n?.entries == "function") return this.serializeObjectEntries(t, n.entries());
      throw new Error(`Cannot serialize ${t}`);
    }
    serializeObjectEntries(t, n) {
      const r = Array.from(n).sort((l, i) => this.compare(l[0], i[0]));
      let s = `${t}{`;
      for (let l = 0; l < r.length; l++) {
        const [i, u] = r[l];
        s += `${this.serialize(i, !0)}:${this.serialize(u)}`, l < r.length - 1 && (s += ",");
      }
      return s + "}";
    }
    $object(t) {
      let n = this.#e.get(t);
      return n === void 0 && (this.#e.set(t, `#${this.#e.size}`), n = this.serializeObject(t), this.#e.set(t, n)), n;
    }
    $function(t) {
      const n = Function.prototype.toString.call(t);
      return n.slice(-15) === "[native code] }" ? `${t.name || ""}()[native]` : `${t.name}(${t.length})${n.replace(/\s*\n\s*/g, "")}`;
    }
    $Array(t) {
      let n = "[";
      for (let r = 0; r < t.length; r++) n += this.serialize(t[r]), r < t.length - 1 && (n += ",");
      return n + "]";
    }
    $Date(t) {
      try {
        return `Date(${t.toISOString()})`;
      } catch {
        return "Date(null)";
      }
    }
    $ArrayBuffer(t) {
      return `ArrayBuffer[${new Uint8Array(t).join(",")}]`;
    }
    $Set(t) {
      return `Set${this.$Array(Array.from(t).sort((n, r) => this.compare(n, r)))}`;
    }
    $Map(t) {
      return this.serializeObjectEntries("Map", t.entries());
    }
  }
  for (const o of ["Error", "RegExp", "URL"]) e.prototype["$" + o] = function(t) {
    return `${o}(${t})`;
  };
  for (const o of ["Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array", "Uint32Array", "Float32Array", "Float64Array"]) e.prototype["$" + o] = function(t) {
    return `${o}[${t.join(",")}]`;
  };
  for (const o of ["BigInt64Array", "BigUint64Array"]) e.prototype["$" + o] = function(t) {
    return `${o}[${t.join("n,")}${t.length > 0 ? "n" : ""}]`;
  };
  return e;
})();
function nt(e, o) {
  return e === o || zn(e) === zn(o);
}
function lo(e, o = Number.NEGATIVE_INFINITY, t = Number.POSITIVE_INFINITY) {
  return Math.min(t, Math.max(o, e));
}
function oe(e, o) {
  const t = typeof e == "string" && !o ? `${e}Context` : o, n = Symbol(t);
  return [(l) => {
    const i = Nt(n, l);
    if (i || i === null) return i;
    throw new Error(`Injection \`${n.toString()}\` not found. Component must be used within ${Array.isArray(e) ? `one of the following components: ${e.join(", ")}` : `\`${e}\``}`);
  }, (l) => (an(n, l), l)];
}
function he() {
  let e = document.activeElement;
  if (e == null) return null;
  for (; e != null && e.shadowRoot != null && e.shadowRoot.activeElement != null; ) e = e.shadowRoot.activeElement;
  return e;
}
function yo(e, o, t) {
  const n = t.originalEvent.target, r = new CustomEvent(e, {
    bubbles: !1,
    cancelable: !0,
    detail: t
  });
  o && n.addEventListener(e, o, { once: !0 }), n.dispatchEvent(r);
}
function rt(e) {
  return e == null;
}
function Ho(e, o) {
  return rt(e) ? !1 : Array.isArray(e) ? e.some((t) => nt(t, o)) : nt(e, o);
}
function Os(e, o) {
  var t;
  const n = Kt();
  return se(() => {
    n.value = e();
  }, {
    ...o,
    flush: (t = o?.flush) !== null && t !== void 0 ? t : "sync"
  }), Ma(n);
}
function Dt(e, o) {
  return pr() ? (fr(e, o), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function As() {
  const e = /* @__PURE__ */ new Set(), o = (s) => {
    e.delete(s);
  };
  return {
    on: (s) => {
      e.add(s);
      const l = () => o(s);
      return Dt(l), { off: l };
    },
    off: o,
    trigger: (...s) => Promise.all(Array.from(e).map((l) => l(...s))),
    clear: () => {
      e.clear();
    }
  };
}
// @__NO_SIDE_EFFECTS__
function Ps(e) {
  let o = !1, t;
  const n = vr(!0);
  return ((...r) => (o || (t = n.run(() => e(...r)), o = !0), t));
}
const Ee = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Ts = (e) => typeof e < "u", Es = Object.prototype.toString, Ds = (e) => Es.call(e) === "[object Object]", Kn = /* @__PURE__ */ ks();
function ks() {
  var e, o, t;
  return Ee && !!(!((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0) && e.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((o = window) === null || o === void 0 || (o = o.navigator) === null || o === void 0 ? void 0 : o.maxTouchPoints) > 2 && /iPad|Macintosh/.test((t = window) === null || t === void 0 ? void 0 : t.navigator.userAgent));
}
function Mo(e) {
  return Array.isArray(e) ? e : [e];
}
function $s(e) {
  return vt();
}
// @__NO_SIDE_EFFECTS__
function Or(e) {
  if (!Ee) return e;
  let o = 0, t, n;
  const r = () => {
    o -= 1, n && o <= 0 && (n.stop(), t = void 0, n = void 0);
  };
  return ((...s) => (o += 1, n || (n = vr(!0), t = n.run(() => e(...s))), Dt(r), t));
}
function Is(e) {
  return pt(e) ? so(new Proxy({}, {
    get(o, t, n) {
      return a(Reflect.get(e.value, t, n));
    },
    set(o, t, n) {
      return pt(e.value[t]) && !pt(n) ? e.value[t].value = n : e.value[t] = n, !0;
    },
    deleteProperty(o, t) {
      return Reflect.deleteProperty(e.value, t);
    },
    has(o, t) {
      return Reflect.has(e.value, t);
    },
    ownKeys() {
      return Object.keys(e.value);
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: !0,
        configurable: !0
      };
    }
  })) : so(e);
}
function Ms(e) {
  return Is(A(e));
}
function J(e, ...o) {
  const t = o.flat(), n = t[0];
  return Ms(() => Object.fromEntries(typeof n == "function" ? Object.entries(ue(e)).filter(([r, s]) => !n(we(s), r)) : Object.entries(ue(e)).filter((r) => !t.includes(r[0]))));
}
function Ar(e, o = 1e4) {
  return Ia((t, n) => {
    let r = we(e), s;
    const l = () => setTimeout(() => {
      r = we(e), n();
    }, we(o));
    return Dt(() => {
      clearTimeout(s);
    }), {
      get() {
        return t(), r;
      },
      set(i) {
        r = i, n(), clearTimeout(s), s = l();
      }
    };
  });
}
function Rs(e, o) {
  $s() && mo(e, o);
}
function Pr(e, o, t = {}) {
  const { immediate: n = !0, immediateCallback: r = !1 } = t, s = Kt(!1);
  let l;
  function i() {
    l && (clearTimeout(l), l = void 0);
  }
  function u() {
    s.value = !1, i();
  }
  function c(...d) {
    r && e(), i(), s.value = !0, l = setTimeout(() => {
      s.value = !1, l = void 0, e(...d);
    }, we(o));
  }
  return n && (s.value = !0, Ee && c()), Dt(u), {
    isPending: ct(s),
    start: c,
    stop: u
  };
}
function Fs(e, o, t) {
  return re(e, o, {
    ...t,
    immediate: !0
  });
}
const go = Ee ? window : void 0;
function je(e) {
  var o;
  const t = we(e);
  return (o = t?.$el) !== null && o !== void 0 ? o : t;
}
function Ue(...e) {
  const o = (n, r, s, l) => (n.addEventListener(r, s, l), () => n.removeEventListener(r, s, l)), t = A(() => {
    const n = Mo(we(e[0])).filter((r) => r != null);
    return n.every((r) => typeof r != "string") ? n : void 0;
  });
  return Fs(() => {
    var n, r;
    return [
      (n = (r = t.value) === null || r === void 0 ? void 0 : r.map((s) => je(s))) !== null && n !== void 0 ? n : [go].filter((s) => s != null),
      Mo(we(t.value ? e[1] : e[0])),
      Mo(a(t.value ? e[2] : e[1])),
      we(t.value ? e[3] : e[2])
    ];
  }, ([n, r, s, l], i, u) => {
    if (!n?.length || !r?.length || !s?.length) return;
    const c = Ds(l) ? { ...l } : l, d = n.flatMap((p) => r.flatMap((f) => s.map((v) => o(p, f, v, c))));
    u(() => {
      d.forEach((p) => p());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function un() {
  const e = Kt(!1), o = vt();
  return o && pe(() => {
    e.value = !0;
  }, o), e;
}
// @__NO_SIDE_EFFECTS__
function Vs(e) {
  const o = /* @__PURE__ */ un();
  return A(() => (o.value, !!e()));
}
function Ns(e) {
  return typeof e == "function" ? e : typeof e == "string" ? (o) => o.key === e : Array.isArray(e) ? (o) => e.includes(o.key) : () => !0;
}
function Ls(...e) {
  let o, t, n = {};
  e.length === 3 ? (o = e[0], t = e[1], n = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (o = !0, t = e[0], n = e[1]) : (o = e[0], t = e[1]) : (o = !0, t = e[0]);
  const { target: r = go, eventName: s = "keydown", passive: l = !1, dedupe: i = !1 } = n, u = Ns(o);
  return Ue(r, s, (d) => {
    d.repeat && we(i) || u(d) && t(d);
  }, l);
}
function js(e) {
  return JSON.parse(JSON.stringify(e));
}
function zs(e, o, t = {}) {
  const { window: n = go, ...r } = t;
  let s;
  const l = /* @__PURE__ */ Vs(() => n && "ResizeObserver" in n), i = () => {
    s && (s.disconnect(), s = void 0);
  }, u = re(A(() => {
    const d = we(e);
    return Array.isArray(d) ? d.map((p) => je(p)) : [je(d)];
  }), (d) => {
    if (i(), l.value && n) {
      s = new ResizeObserver(o);
      for (const p of d) p && s.observe(p, r);
    }
  }, {
    immediate: !0,
    flush: "post"
  }), c = () => {
    i(), u();
  };
  return Dt(c), {
    isSupported: l,
    stop: c
  };
}
// @__NO_SIDE_EFFECTS__
function fe(e, o, t, n = {}) {
  var r, s;
  const { clone: l = !1, passive: i = !1, eventName: u, deep: c = !1, defaultValue: d, shouldEmit: p } = n, f = vt(), v = t || f?.emit || (f == null || (r = f.$emit) === null || r === void 0 ? void 0 : r.bind(f)) || (f == null || (s = f.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(f?.proxy));
  let g = u;
  o || (o = "modelValue"), g = g || `update:${o.toString()}`;
  const w = (x) => l ? typeof l == "function" ? l(x) : js(x) : x, S = () => Ts(e[o]) ? w(e[o]) : d, O = (x) => {
    p ? p(x) && v(g, x) : v(g, x);
  };
  if (i) {
    const x = P(S());
    let B = !1;
    return re(() => e[o], (C) => {
      B || (B = !0, x.value = w(C), ce(() => B = !1));
    }), re(x, (C) => {
      !B && (C !== e[o] || c) && O(C);
    }, { deep: c }), x;
  } else return A({
    get() {
      return S();
    },
    set(x) {
      O(x);
    }
  });
}
function dn(e) {
  return e ? e.flatMap((o) => o.type === qe ? dn(o.children) : [o]) : [];
}
const Ks = ["INPUT", "TEXTAREA"];
function Wo(e, o, t, n = {}) {
  if (!o || n.enableIgnoredElement && Ks.includes(o.nodeName)) return null;
  const { arrowKeyOptions: r = "both", attributeName: s = "[data-reka-collection-item]", itemsArray: l = [], loop: i = !0, dir: u = "ltr", preventScroll: c = !0, focus: d = !1 } = n, [p, f, v, g, w, S] = [
    e.key === "ArrowRight",
    e.key === "ArrowLeft",
    e.key === "ArrowUp",
    e.key === "ArrowDown",
    e.key === "Home",
    e.key === "End"
  ], O = v || g, x = p || f;
  if (!w && !S && (!O && !x || r === "vertical" && x || r === "horizontal" && O)) return null;
  const B = t ? Array.from(t.querySelectorAll(s)) : l;
  if (!B.length) return null;
  c && e.preventDefault();
  let C = null;
  return x || O ? C = Tr(B, o, {
    goForward: O ? g : u === "ltr" ? p : f,
    loop: i
  }) : w ? C = B.at(0) || null : S && (C = B.at(-1) || null), d && C?.focus(), C;
}
function Tr(e, o, t, n = e.includes(o) ? e.length : e.length + 1) {
  if (--n === 0) return null;
  const r = e.indexOf(o);
  let s;
  if (r === -1 ? s = t.goForward ? 0 : e.length - 1 : s = t.goForward ? r + 1 : r - 1, !t.loop && (s < 0 || s >= e.length)) return null;
  const l = (s + e.length) % e.length, i = e[l];
  return i ? i.hasAttribute("disabled") && i.getAttribute("disabled") !== "false" ? Tr(e, i, t, n) : i : null;
}
const [ho] = /* @__PURE__ */ oe("ConfigProvider");
function Ro(e) {
  if (e === null || typeof e != "object")
    return !1;
  const o = Object.getPrototypeOf(e);
  return o !== null && o !== Object.prototype && Object.getPrototypeOf(o) !== null || Symbol.iterator in e ? !1 : Symbol.toStringTag in e ? Object.prototype.toString.call(e) === "[object Module]" : !0;
}
function Uo(e, o, t = ".", n) {
  if (!Ro(o))
    return Uo(e, {}, t, n);
  const r = { ...o };
  for (const s of Object.keys(e)) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const l = e[s];
    l != null && (n && n(r, s, l, t) || (Array.isArray(l) && Array.isArray(r[s]) ? r[s] = [...l, ...r[s]] : Ro(l) && Ro(r[s]) ? r[s] = Uo(
      l,
      r[s],
      (t ? `${t}.` : "") + s.toString(),
      n
    ) : r[s] = l));
  }
  return r;
}
function Hs(e) {
  return (...o) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    o.reduce((t, n) => Uo(t, n, "", e), {})
  );
}
const Er = Hs(), Ws = /* @__PURE__ */ Or(() => {
  const e = P(/* @__PURE__ */ new Map()), o = P(), t = A(() => {
    for (const l of e.value.values()) if (l) return !0;
    return !1;
  }), n = ho({ scrollBody: P(!0) });
  let r = null;
  const s = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = o.value ?? "", Kn && r?.(), o.value = void 0;
  };
  return re(t, (l, i) => {
    if (!Ee) return;
    if (!l) {
      i && s();
      return;
    }
    o.value === void 0 && (o.value = document.body.style.overflow);
    const u = window.innerWidth - document.documentElement.clientWidth, c = {
      padding: u,
      margin: 0
    }, d = n.scrollBody?.value ? typeof n.scrollBody.value == "object" ? Er({
      padding: n.scrollBody.value.padding === !0 ? u : n.scrollBody.value.padding,
      margin: n.scrollBody.value.margin === !0 ? u : n.scrollBody.value.margin
    }, c) : c : {
      padding: 0,
      margin: 0
    };
    u > 0 && (document.body.style.paddingRight = typeof d.padding == "number" ? `${d.padding}px` : String(d.padding), document.body.style.marginRight = typeof d.margin == "number" ? `${d.margin}px` : String(d.margin), document.documentElement.style.setProperty("--scrollbar-width", `${u}px`), document.body.style.overflow = "hidden"), Kn && (r = Ue(document, "touchmove", (p) => Us(p), { passive: !1 })), ce(() => {
      t.value && (document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden");
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), e;
});
function bo(e) {
  const o = Math.random().toString(36).substring(2, 7), t = Ws();
  t.value.set(o, e ?? !1);
  const n = A({
    get: () => t.value.get(o) ?? !1,
    set: (r) => t.value.set(o, r)
  });
  return Rs(() => {
    t.value.delete(o);
  }), n;
}
function Dr(e) {
  const o = window.getComputedStyle(e);
  if (o.overflowX === "scroll" || o.overflowY === "scroll" || o.overflowX === "auto" && e.clientWidth < e.scrollWidth || o.overflowY === "auto" && e.clientHeight < e.scrollHeight) return !0;
  {
    const t = e.parentNode;
    return !(t instanceof Element) || t.tagName === "BODY" ? !1 : Dr(t);
  }
}
function Us(e) {
  const o = e || window.event, t = o.target;
  return t instanceof Element && Dr(t) ? !1 : o.touches.length > 1 ? !0 : (o.preventDefault && o.cancelable && o.preventDefault(), !1);
}
function lt(e) {
  const o = ho({ dir: P("ltr") });
  return A(() => e?.value || o.dir?.value || "ltr");
}
function mt(e) {
  const o = vt(), t = o?.type.emits, n = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${o?.type.__name}`), t?.forEach((r) => {
    n[Ra(mr(r))] = (...s) => e(r, ...s);
  }), n;
}
let Fo = 0;
function cn() {
  se((e) => {
    if (!Ee) return;
    const o = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", o[0] ?? Hn()), document.body.insertAdjacentElement("beforeend", o[1] ?? Hn()), Fo++, e(() => {
      Fo === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((t) => t.remove()), Fo--;
    });
  });
}
function Hn() {
  const e = document.createElement("span");
  return e.setAttribute("data-reka-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
function kt(e) {
  return A(() => we(e) ? !!je(e)?.closest("form") : !0);
}
function V() {
  const e = vt(), o = P(), t = A(() => n());
  Fa(() => {
    t.value !== n() && Va(o);
  });
  function n() {
    return o.value && "$el" in o.value && ["#text", "#comment"].includes(o.value.$el.nodeName) ? o.value.$el.nextElementSibling : je(o);
  }
  const r = Object.assign({}, e.exposed), s = {};
  for (const i in e.props) Object.defineProperty(s, i, {
    enumerable: !0,
    configurable: !0,
    get: () => e.props[i]
  });
  if (Object.keys(r).length > 0) for (const i in r) Object.defineProperty(s, i, {
    enumerable: !0,
    configurable: !0,
    get: () => r[i]
  });
  Object.defineProperty(s, "$el", {
    enumerable: !0,
    configurable: !0,
    get: () => e.vnode.el
  }), e.exposed = s;
  function l(i) {
    if (o.value = i, !!i && (Object.defineProperty(s, "$el", {
      enumerable: !0,
      configurable: !0,
      get: () => i instanceof Element ? i : i.$el
    }), !(i instanceof Element) && !Object.hasOwn(i, "$el"))) {
      const u = i.$.exposed, c = Object.assign({}, s);
      for (const d in u) Object.defineProperty(c, d, {
        enumerable: !0,
        configurable: !0,
        get: () => u[d]
      });
      e.exposed = c;
    }
  }
  return {
    forwardRef: l,
    currentRef: o,
    currentElement: t
  };
}
function ge(e) {
  const o = vt(), t = Object.keys(o?.type.props ?? {}).reduce((r, s) => {
    const l = (o?.type.props[s]).default;
    return l !== void 0 && (r[s] = l), r;
  }, {}), n = Na(e);
  return A(() => {
    const r = {}, s = o?.vnode.props ?? {};
    return Object.keys(s).forEach((l) => {
      r[mr(l)] = s[l];
    }), Object.keys({
      ...t,
      ...r
    }).reduce((l, i) => (n.value[i] !== void 0 && (l[i] = n.value[i]), l), {});
  });
}
function te(e, o) {
  const t = ge(e), n = o ? mt(o) : {};
  return A(() => ({
    ...t.value,
    ...n
  }));
}
function Gs(e, o) {
  const t = Ar(!1, 300);
  Dt(() => {
    t.value = !1;
  });
  const n = P(null), r = /* @__PURE__ */ As();
  function s() {
    n.value = null, t.value = !1;
  }
  function l(i, u) {
    if (!u) return;
    const c = i.currentTarget, d = {
      x: i.clientX,
      y: i.clientY
    }, p = Ys(d, c.getBoundingClientRect()), f = Xs(d, p, 1), v = Js(u.getBoundingClientRect()), g = Qs([...f, ...v]);
    n.value = g, t.value = !0;
  }
  return se((i) => {
    if (e.value && o.value) {
      const u = (d) => l(d, o.value), c = (d) => l(d, e.value);
      e.value.addEventListener("pointerleave", u), o.value.addEventListener("pointerleave", c), i(() => {
        e.value?.removeEventListener("pointerleave", u), o.value?.removeEventListener("pointerleave", c);
      });
    }
  }), se((i) => {
    if (n.value) {
      const u = (c) => {
        if (!n.value || !(c.target instanceof Element)) return;
        const d = c.target, p = {
          x: c.clientX,
          y: c.clientY
        }, f = e.value?.contains(d) || o.value?.contains(d), v = !Zs(p, n.value), g = !!d.closest("[data-grace-area-trigger]");
        f ? s() : (v || g) && (s(), r.trigger());
      };
      e.value?.ownerDocument.addEventListener("pointermove", u), i(() => e.value?.ownerDocument.removeEventListener("pointermove", u));
    }
  }), {
    isPointerInTransit: t,
    onPointerExit: r.on
  };
}
function Ys(e, o) {
  const t = Math.abs(o.top - e.y), n = Math.abs(o.bottom - e.y), r = Math.abs(o.right - e.x), s = Math.abs(o.left - e.x);
  switch (Math.min(t, n, r, s)) {
    case s:
      return "left";
    case r:
      return "right";
    case t:
      return "top";
    case n:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function Xs(e, o, t = 5) {
  const n = [];
  switch (o) {
    case "top":
      n.push({
        x: e.x - t,
        y: e.y + t
      }, {
        x: e.x + t,
        y: e.y + t
      });
      break;
    case "bottom":
      n.push({
        x: e.x - t,
        y: e.y - t
      }, {
        x: e.x + t,
        y: e.y - t
      });
      break;
    case "left":
      n.push({
        x: e.x + t,
        y: e.y - t
      }, {
        x: e.x + t,
        y: e.y + t
      });
      break;
    case "right":
      n.push({
        x: e.x - t,
        y: e.y - t
      }, {
        x: e.x - t,
        y: e.y + t
      });
      break;
  }
  return n;
}
function Js(e) {
  const { top: o, right: t, bottom: n, left: r } = e;
  return [
    {
      x: r,
      y: o
    },
    {
      x: t,
      y: o
    },
    {
      x: t,
      y: n
    },
    {
      x: r,
      y: n
    }
  ];
}
function Zs(e, o) {
  const { x: t, y: n } = e;
  let r = !1;
  for (let s = 0, l = o.length - 1; s < o.length; l = s++) {
    const i = o[s].x, u = o[s].y, c = o[l].x, d = o[l].y;
    u > n != d > n && t < (c - i) * (n - u) / (d - u) + i && (r = !r);
  }
  return r;
}
function Qs(e) {
  const o = e.slice();
  return o.sort((t, n) => t.x < n.x ? -1 : t.x > n.x ? 1 : t.y < n.y ? -1 : t.y > n.y ? 1 : 0), el(o);
}
function el(e) {
  if (e.length <= 1) return e.slice();
  const o = [];
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    for (; o.length >= 2; ) {
      const s = o.at(-1), l = o[o.length - 2];
      if ((s.x - l.x) * (r.y - l.y) >= (s.y - l.y) * (r.x - l.x)) o.pop();
      else break;
    }
    o.push(r);
  }
  o.pop();
  const t = [];
  for (let n = e.length - 1; n >= 0; n--) {
    const r = e[n];
    for (; t.length >= 2; ) {
      const s = t.at(-1), l = t[t.length - 2];
      if ((s.x - l.x) * (r.y - l.y) >= (s.y - l.y) * (r.x - l.x)) t.pop();
      else break;
    }
    t.push(r);
  }
  return t.pop(), o.length === 1 && t.length === 1 && o[0].x === t[0].x && o[0].y === t[0].y ? o : o.concat(t);
}
var tl = function(e) {
  if (typeof document > "u")
    return null;
  var o = Array.isArray(e) ? e[0] : e;
  return o.ownerDocument.body;
}, wt = /* @__PURE__ */ new WeakMap(), to = /* @__PURE__ */ new WeakMap(), oo = {}, Vo = 0, kr = function(e) {
  return e && (e.host || kr(e.parentNode));
}, ol = function(e, o) {
  return o.map(function(t) {
    if (e.contains(t))
      return t;
    var n = kr(t);
    return n && e.contains(n) ? n : (console.error("aria-hidden", t, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, nl = function(e, o, t, n) {
  var r = ol(o, Array.isArray(e) ? e : [e]);
  oo[t] || (oo[t] = /* @__PURE__ */ new WeakMap());
  var s = oo[t], l = [], i = /* @__PURE__ */ new Set(), u = new Set(r), c = function(p) {
    !p || i.has(p) || (i.add(p), c(p.parentNode));
  };
  r.forEach(c);
  var d = function(p) {
    !p || u.has(p) || Array.prototype.forEach.call(p.children, function(f) {
      if (i.has(f))
        d(f);
      else
        try {
          var v = f.getAttribute(n), g = v !== null && v !== "false", w = (wt.get(f) || 0) + 1, S = (s.get(f) || 0) + 1;
          wt.set(f, w), s.set(f, S), l.push(f), w === 1 && g && to.set(f, !0), S === 1 && f.setAttribute(t, "true"), g || f.setAttribute(n, "true");
        } catch (O) {
          console.error("aria-hidden: cannot operate on ", f, O);
        }
    });
  };
  return d(o), i.clear(), Vo++, function() {
    l.forEach(function(p) {
      var f = wt.get(p) - 1, v = s.get(p) - 1;
      wt.set(p, f), s.set(p, v), f || (to.has(p) || p.removeAttribute(n), to.delete(p)), v || p.removeAttribute(t);
    }), Vo--, Vo || (wt = /* @__PURE__ */ new WeakMap(), wt = /* @__PURE__ */ new WeakMap(), to = /* @__PURE__ */ new WeakMap(), oo = {});
  };
}, rl = function(e, o, t) {
  t === void 0 && (t = "data-aria-hidden");
  var n = Array.from(Array.isArray(e) ? e : [e]), r = tl(e);
  return r ? (n.push.apply(n, Array.from(r.querySelectorAll("[aria-live], script"))), nl(n, r, t, "aria-hidden")) : function() {
    return null;
  };
};
function _o(e) {
  let o;
  re(() => je(e), (t) => {
    let n = !1;
    try {
      n = !!t?.closest("[popover]:not(:popover-open)");
    } catch {
    }
    t && !n ? o = rl(t) : o && o();
  }), Xe(() => {
    o && o();
  });
}
let al = 0;
function be(e, o = "reka") {
  let t;
  const n = ho({ useId: void 0 });
  return n.useId ? t = n.useId() : "useId" in Fn ? t = Fn.useId?.() : t = `${++al}`, o ? `${o}-${t}` : t;
}
function $r(e) {
  const o = P(), t = A(() => o.value?.width ?? 0), n = A(() => o.value?.height ?? 0);
  return pe(() => {
    const r = je(e);
    if (r) {
      o.value = {
        width: r.offsetWidth,
        height: r.offsetHeight
      };
      const s = new ResizeObserver((l) => {
        if (!Array.isArray(l) || !l.length) return;
        const i = l[0];
        let u, c;
        if ("borderBoxSize" in i) {
          const d = i.borderBoxSize, p = Array.isArray(d) ? d[0] : d;
          u = p.inlineSize, c = p.blockSize;
        } else
          u = r.offsetWidth, c = r.offsetHeight;
        o.value = {
          width: u,
          height: c
        };
      });
      return s.observe(r, { box: "border-box" }), () => s.unobserve(r);
    } else o.value = void 0;
  }), {
    width: t,
    height: n
  };
}
function sl(e, o) {
  const t = P(e);
  function n(s) {
    return o[t.value][s] ?? t.value;
  }
  return {
    state: t,
    dispatch: (s) => {
      t.value = n(s);
    }
  };
}
function pn(e) {
  const o = Ar("", 1e3);
  return {
    search: o,
    handleTypeaheadSearch: (r, s) => {
      o.value = o.value + r;
      {
        const l = he(), i = s.map((f) => ({
          ...f,
          textValue: f.value?.textValue ?? f.ref.textContent?.trim() ?? ""
        })), u = i.find((f) => f.ref === l), c = i.map((f) => f.textValue), d = il(c, o.value, u?.textValue), p = i.find((f) => f.textValue === d);
        return p && p.ref.focus(), p?.ref;
      }
    },
    resetTypeahead: () => {
      o.value = "";
    }
  };
}
function ll(e, o) {
  return e.map((t, n) => e[(o + n) % e.length]);
}
function il(e, o, t) {
  const r = o.length > 1 && Array.from(o).every((c) => c === o[0]) ? o[0] : o, s = t ? e.indexOf(t) : -1;
  let l = ll(e, Math.max(s, 0));
  r.length === 1 && (l = l.filter((c) => c !== t));
  const u = l.find((c) => c.toLowerCase().startsWith(r.toLowerCase()));
  return u !== t ? u : void 0;
}
function ul(e, o) {
  const t = P({}), n = P("none"), r = P(e), s = e.value ? "mounted" : "unmounted";
  let l;
  const i = o.value?.ownerDocument.defaultView ?? go, { state: u, dispatch: c } = sl(s, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: { MOUNT: "mounted" }
  }), d = (S) => {
    if (Ee) {
      const O = new CustomEvent(S, {
        bubbles: !1,
        cancelable: !1
      });
      o.value?.dispatchEvent(O);
    }
  };
  re(e, async (S, O) => {
    const x = O !== S;
    if (await ce(), x) {
      const B = n.value, C = no(o.value);
      S ? (c("MOUNT"), d("enter"), C === "none" && d("after-enter")) : C === "none" || C === "undefined" || t.value?.display === "none" ? (c("UNMOUNT"), d("leave"), d("after-leave")) : O && B !== C ? (c("ANIMATION_OUT"), d("leave")) : (c("UNMOUNT"), d("after-leave"));
    }
  }, { immediate: !0 });
  const p = (S) => {
    const O = no(o.value), x = O.includes(CSS.escape(S.animationName)), B = u.value === "mounted" ? "enter" : "leave";
    if (S.target === o.value && x && (d(`after-${B}`), c("ANIMATION_END"), !r.value)) {
      const C = o.value.style.animationFillMode;
      o.value.style.animationFillMode = "forwards", l = i?.setTimeout(() => {
        o.value?.style.animationFillMode === "forwards" && (o.value.style.animationFillMode = C);
      });
    }
    S.target === o.value && O === "none" && c("ANIMATION_END");
  }, f = (S) => {
    S.target === o.value && (n.value = no(o.value));
  }, v = re(o, (S, O) => {
    S ? (t.value = getComputedStyle(S), S.addEventListener("animationstart", f), S.addEventListener("animationcancel", p), S.addEventListener("animationend", p)) : (c("ANIMATION_END"), l !== void 0 && i?.clearTimeout(l), O?.removeEventListener("animationstart", f), O?.removeEventListener("animationcancel", p), O?.removeEventListener("animationend", p));
  }, { immediate: !0 }), g = re(u, () => {
    const S = no(o.value);
    n.value = u.value === "mounted" ? S : "none";
  });
  return Xe(() => {
    v(), g();
  }), { isPresent: A(() => ["mounted", "unmountSuspended"].includes(u.value)) };
}
function no(e) {
  return e && getComputedStyle(e).animationName || "none";
}
var De = /* @__PURE__ */ h({
  name: "Presence",
  props: {
    present: {
      type: Boolean,
      required: !0
    },
    forceMount: { type: Boolean }
  },
  slots: {},
  setup(e, { slots: o, expose: t }) {
    const { present: n, forceMount: r } = ue(e), s = P(), { isPresent: l } = ul(n, s);
    t({ present: l });
    let i = o.default({ present: l.value });
    i = dn(i || []);
    const u = vt();
    if (i && i?.length > 1) {
      const c = u?.parent?.type.name ? `<${u.parent.type.name} />` : "component";
      throw new Error([
        `Detected an invalid children for \`${c}\` for  \`Presence\` component.`,
        "",
        "Note: Presence works similarly to `v-if` directly, but it waits for animation/transition to finished before unmounting. So it expect only one direct child of valid VNode type.",
        "You can apply a few solutions:",
        ["Provide a single child element so that `presence` directive attach correctly.", "Ensure the first child is an actual element instead of a raw text node or comment node."].map((d) => `  - ${d}`).join(`
`)
      ].join(`
`));
    }
    return () => r.value || n.value || l.value ? Me(o.default({ present: l.value })[0], { ref: (c) => {
      const d = je(c);
      return typeof d?.hasAttribute > "u" || (d?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = d.firstElementChild : s.value = d), d;
    } }) : null;
  }
});
const io = /* @__PURE__ */ h({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(e, { attrs: o, slots: t }) {
    return () => {
      if (!t.default) return null;
      const n = dn(t.default()), r = n.findIndex((u) => u.type !== La);
      if (r === -1) return n;
      const s = n[r];
      delete s.props?.ref;
      const l = s.props ? E(o, s.props) : o, i = ja({
        ...s,
        props: {}
      }, l);
      return n.length === 1 ? i : (n[r] = i, n);
    };
  }
}), dl = [
  "area",
  "img",
  "input"
], K = /* @__PURE__ */ h({
  name: "Primitive",
  inheritAttrs: !1,
  props: {
    asChild: {
      type: Boolean,
      default: !1
    },
    as: {
      type: [String, Object],
      default: "div"
    }
  },
  setup(e, { attrs: o, slots: t }) {
    const n = e.asChild ? "template" : e.as;
    return typeof n == "string" && dl.includes(n) ? () => Me(n, o) : n !== "template" ? () => Me(e.as, o, { default: t.default }) : () => Me(io, o, { default: t.default });
  }
});
function Go() {
  const e = P(), o = A(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : je(e));
  return {
    primitiveElement: e,
    currentElement: o
  };
}
const [Ir, cl] = /* @__PURE__ */ oe("CollapsibleRoot");
var pl = /* @__PURE__ */ h({
  __name: "CollapsibleRoot",
  props: {
    defaultOpen: {
      type: Boolean,
      required: !1,
      default: !1
    },
    open: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    unmountOnHide: {
      type: Boolean,
      required: !1,
      default: !0
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["update:open"],
  setup(e, { expose: o, emit: t }) {
    const n = e, s = /* @__PURE__ */ fe(n, "open", t, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), { disabled: l, unmountOnHide: i } = ue(n);
    return cl({
      contentId: "",
      disabled: l,
      open: s,
      unmountOnHide: i,
      onOpenToggle: () => {
        l.value || (s.value = !s.value);
      }
    }), o({ open: s }), V(), (u, c) => (m(), _(a(K), {
      as: u.as,
      "as-child": n.asChild,
      "data-state": a(s) ? "open" : "closed",
      "data-disabled": a(l) ? "" : void 0
    }, {
      default: y(() => [b(u.$slots, "default", { open: a(s) })]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state",
      "data-disabled"
    ]));
  }
}), fl = pl, vl = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "CollapsibleContent",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["contentFound"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = Ir();
    r.contentId ||= be(void 0, "reka-collapsible-content");
    const s = P(), { forwardRef: l, currentElement: i } = V(), u = P(0), c = P(0), d = A(() => r.open.value), p = P(d.value), f = P();
    re(() => [d.value, s.value?.present], async () => {
      await ce();
      const g = i.value;
      if (!g) return;
      f.value = f.value || {
        transitionDuration: g.style.transitionDuration,
        animationName: g.style.animationName
      }, g.style.transitionDuration = "0s", g.style.animationName = "none";
      const w = g.getBoundingClientRect();
      c.value = w.height, u.value = w.width, p.value || (g.style.transitionDuration = f.value.transitionDuration, g.style.animationName = f.value.animationName);
    }, { immediate: !0 });
    const v = A(() => p.value && r.open.value);
    return pe(() => {
      requestAnimationFrame(() => {
        p.value = !1;
      });
    }), Ue(i, "beforematch", (g) => {
      requestAnimationFrame(() => {
        r.onOpenToggle(), n("contentFound");
      });
    }), (g, w) => (m(), _(a(De), {
      ref_key: "presentRef",
      ref: s,
      present: g.forceMount || a(r).open.value,
      "force-mount": !0
    }, {
      default: y(({ present: S }) => [I(a(K), E(g.$attrs, {
        id: a(r).contentId,
        ref: a(l),
        "as-child": t.asChild,
        as: g.as,
        hidden: S ? void 0 : a(r).unmountOnHide.value ? "" : "until-found",
        "data-state": v.value ? void 0 : a(r).open.value ? "open" : "closed",
        "data-disabled": a(r).disabled?.value ? "" : void 0,
        style: {
          "--reka-collapsible-content-height": `${c.value}px`,
          "--reka-collapsible-content-width": `${u.value}px`
        }
      }), {
        default: y(() => [!a(r).unmountOnHide.value || S ? b(g.$slots, "default", { key: 0 }) : de("v-if", !0)]),
        _: 2
      }, 1040, [
        "id",
        "as-child",
        "as",
        "hidden",
        "data-state",
        "data-disabled",
        "style"
      ])]),
      _: 3
    }, 8, ["present"]));
  }
}), ml = vl, yl = /* @__PURE__ */ h({
  __name: "CollapsibleTrigger",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "button"
    }
  },
  setup(e) {
    const o = e;
    V();
    const t = Ir();
    return (n, r) => (m(), _(a(K), {
      type: n.as === "button" ? "button" : void 0,
      as: n.as,
      "as-child": o.asChild,
      "aria-controls": a(t).contentId,
      "aria-expanded": a(t).open.value,
      "data-state": a(t).open.value ? "open" : "closed",
      "data-disabled": a(t).disabled?.value ? "" : void 0,
      disabled: a(t).disabled?.value,
      onClick: a(t).onOpenToggle
    }, {
      default: y(() => [b(n.$slots, "default")]),
      _: 3
    }, 8, [
      "type",
      "as",
      "as-child",
      "aria-controls",
      "aria-expanded",
      "data-state",
      "data-disabled",
      "disabled",
      "onClick"
    ]));
  }
}), gl = yl;
function hl({ type: e, defaultValue: o, modelValue: t }) {
  const n = t || o;
  return t !== void 0 || o !== void 0 ? Array.isArray(n) ? "multiple" : "single" : e ?? "single";
}
function bl({ type: e, defaultValue: o, modelValue: t }) {
  return e || hl({
    type: e,
    defaultValue: o,
    modelValue: t
  });
}
function _l({ type: e, defaultValue: o }) {
  return o !== void 0 ? o : e === "single" ? void 0 : [];
}
function wl(e, o) {
  const t = A(() => bl(e)), n = /* @__PURE__ */ fe(e, "modelValue", o, {
    defaultValue: _l(e),
    passive: e.modelValue === void 0,
    deep: !0
  });
  function r(l) {
    if (t.value === "single") n.value = nt(l, n.value) ? void 0 : l;
    else {
      const i = Array.isArray(n.value) ? [...n.value || []] : [n.value].filter(Boolean);
      if (Ho(i, l)) {
        const u = i.findIndex((c) => nt(c, l));
        i.splice(u, 1);
      } else i.push(l);
      n.value = i;
    }
  }
  const s = A(() => t.value === "single");
  return {
    modelValue: n,
    changeModelValue: r,
    isSingle: s
  };
}
const [wo, Cl] = /* @__PURE__ */ oe("AccordionRoot");
var Sl = /* @__PURE__ */ h({
  __name: "AccordionRoot",
  props: {
    collapsible: {
      type: Boolean,
      required: !1,
      default: !1
    },
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    dir: {
      type: String,
      required: !1
    },
    orientation: {
      type: String,
      required: !1,
      default: "vertical"
    },
    unmountOnHide: {
      type: Boolean,
      required: !1,
      default: !0
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    },
    type: {
      type: String,
      required: !1
    },
    modelValue: {
      type: null,
      required: !1
    },
    defaultValue: {
      type: null,
      required: !1
    }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, n = o, { dir: r, disabled: s, unmountOnHide: l } = ue(t), i = lt(r), { modelValue: u, changeModelValue: c, isSingle: d } = wl(t, n), { forwardRef: p, currentElement: f } = V();
    return Cl({
      disabled: s,
      direction: i,
      orientation: t.orientation,
      parentElement: f,
      isSingle: d,
      collapsible: t.collapsible,
      modelValue: u,
      changeModelValue: c,
      unmountOnHide: l
    }), (v, g) => (m(), _(a(K), {
      ref: a(p),
      "as-child": v.asChild,
      as: v.as
    }, {
      default: y(() => [b(v.$slots, "default", { modelValue: a(u) })]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), xl = Sl, Yo = /* @__PURE__ */ (function(e) {
  return e.Open = "open", e.Closed = "closed", e;
})(Yo || {});
const [fn, ql] = /* @__PURE__ */ oe("AccordionItem");
var Bl = /* @__PURE__ */ h({
  __name: "AccordionItem",
  props: {
    disabled: {
      type: Boolean,
      required: !1
    },
    value: {
      type: String,
      required: !0
    },
    unmountOnHide: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e, { expose: o }) {
    const t = e, n = wo(), r = A(() => n.isSingle.value ? t.value === n.modelValue.value : Array.isArray(n.modelValue.value) && n.modelValue.value.includes(t.value)), s = A(() => n.disabled.value || t.disabled), l = A(() => s.value ? "" : void 0), i = A(() => r.value ? Yo.Open : Yo.Closed);
    o({
      open: r,
      dataDisabled: l
    });
    const { currentRef: u, currentElement: c } = V();
    ql({
      open: r,
      dataState: i,
      disabled: s,
      dataDisabled: l,
      triggerId: "",
      currentRef: u,
      currentElement: c,
      value: A(() => t.value)
    });
    function d(p) {
      const f = p.target;
      if (Array.from(n.parentElement.value?.querySelectorAll("[data-reka-collection-item]") ?? []).findIndex((w) => w === f) === -1) return null;
      Wo(p, f, n.parentElement.value, {
        arrowKeyOptions: n.orientation,
        dir: n.direction.value,
        focus: !0
      });
    }
    return (p, f) => (m(), _(a(fl), {
      "data-orientation": a(n).orientation,
      "data-disabled": l.value,
      "data-state": i.value,
      disabled: s.value,
      open: r.value,
      as: t.as,
      "as-child": t.asChild,
      "unmount-on-hide": t.unmountOnHide ?? a(n).unmountOnHide.value,
      onKeydown: Tt(d, [
        "up",
        "down",
        "left",
        "right",
        "home",
        "end"
      ])
    }, {
      default: y(() => [b(p.$slots, "default", { open: r.value })]),
      _: 3
    }, 8, [
      "data-orientation",
      "data-disabled",
      "data-state",
      "disabled",
      "open",
      "as",
      "as-child",
      "unmount-on-hide"
    ]));
  }
}), Ol = Bl, Al = /* @__PURE__ */ h({
  __name: "AccordionContent",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e, t = wo(), n = fn();
    return V(), (r, s) => (m(), _(a(ml), {
      role: "region",
      "as-child": o.asChild,
      as: r.as,
      "force-mount": o.forceMount,
      "aria-labelledby": a(n).triggerId,
      "data-state": a(n).dataState.value,
      "data-disabled": a(n).dataDisabled.value,
      "data-orientation": a(t).orientation,
      style: {
        "--reka-accordion-content-width": "var(--reka-collapsible-content-width)",
        "--reka-accordion-content-height": "var(--reka-collapsible-content-height)"
      },
      onContentFound: s[0] || (s[0] = (l) => a(t).changeModelValue(a(n).value.value))
    }, {
      default: y(() => [b(r.$slots, "default")]),
      _: 3
    }, 8, [
      "as-child",
      "as",
      "force-mount",
      "aria-labelledby",
      "data-state",
      "data-disabled",
      "data-orientation"
    ]));
  }
}), Pl = Al, Tl = /* @__PURE__ */ h({
  __name: "AccordionHeader",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "h3"
    }
  },
  setup(e) {
    const o = e, t = wo(), n = fn();
    return V(), (r, s) => (m(), _(a(K), {
      as: o.as,
      "as-child": o.asChild,
      "data-orientation": a(t).orientation,
      "data-state": a(n).dataState.value,
      "data-disabled": a(n).dataDisabled.value
    }, {
      default: y(() => [b(r.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-orientation",
      "data-state",
      "data-disabled"
    ]));
  }
}), El = Tl, Dl = /* @__PURE__ */ h({
  __name: "AccordionTrigger",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e, t = wo(), n = fn();
    n.triggerId ||= be(void 0, "reka-accordion-trigger");
    function r() {
      const s = t.isSingle.value && n.open.value && !t.collapsible;
      n.disabled.value || s || t.changeModelValue(n.value.value);
    }
    return (s, l) => (m(), _(a(gl), {
      id: a(n).triggerId,
      ref: a(n).currentRef,
      "data-reka-collection-item": "",
      as: o.as,
      "as-child": o.asChild,
      "aria-disabled": a(n).disabled.value || void 0,
      "aria-expanded": a(n).open.value || !1,
      "data-disabled": a(n).dataDisabled.value,
      "data-orientation": a(t).orientation,
      "data-state": a(n).dataState.value,
      disabled: a(n).disabled.value,
      onClick: r
    }, {
      default: y(() => [b(s.$slots, "default")]),
      _: 3
    }, 8, [
      "id",
      "as",
      "as-child",
      "aria-disabled",
      "aria-expanded",
      "data-disabled",
      "data-orientation",
      "data-state",
      "disabled"
    ]));
  }
}), kl = Dl;
const [ze, $l] = /* @__PURE__ */ oe("DialogRoot");
var Il = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "DialogRoot",
  props: {
    open: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    defaultOpen: {
      type: Boolean,
      required: !1,
      default: !1
    },
    modal: {
      type: Boolean,
      required: !1,
      default: !0
    }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const t = e, r = /* @__PURE__ */ fe(t, "open", o, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = P(), l = P(), { modal: i } = ue(t);
    return $l({
      open: r,
      modal: i,
      openModal: () => {
        r.value = !0;
      },
      onOpenChange: (u) => {
        r.value = u;
      },
      onOpenToggle: () => {
        r.value = !r.value;
      },
      contentId: "",
      titleId: "",
      descriptionId: "",
      triggerElement: s,
      contentElement: l
    }), (u, c) => b(u.$slots, "default", {
      open: a(r),
      close: () => r.value = !1
    });
  }
}), Mr = Il, Ml = /* @__PURE__ */ h({
  __name: "DialogClose",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "button"
    }
  },
  setup(e) {
    const o = e;
    V();
    const t = ze();
    return (n, r) => (m(), _(a(K), E(o, {
      type: n.as === "button" ? "button" : void 0,
      onClick: r[0] || (r[0] = (s) => a(t).onOpenChange(!1))
    }), {
      default: y(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), Wt = Ml;
const Rl = "dismissableLayer.pointerDownOutside", Fl = "dismissableLayer.focusOutside";
function Rr(e, o) {
  if (!(o instanceof Element)) return !1;
  const t = o.closest("[data-dismissable-layer]"), n = e.dataset.dismissableLayer === "" ? e : e.querySelector("[data-dismissable-layer]"), r = Array.from(e.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (n === t || r.indexOf(n) < r.indexOf(t)));
}
function Vl(e, o, t = !0) {
  const n = o?.value?.ownerDocument ?? globalThis?.document, r = P(!1), s = P(() => {
  });
  return se((l) => {
    if (!Ee || !we(t)) return;
    const i = async (c) => {
      const d = c.target;
      if (!(!o?.value || !d)) {
        if (Rr(o.value, d)) {
          r.value = !1;
          return;
        }
        if (c.target && !r.value) {
          let f = function() {
            yo(Rl, e, p);
          };
          const p = { originalEvent: c };
          c.pointerType === "touch" ? (n.removeEventListener("click", s.value), s.value = f, n.addEventListener("click", s.value, { once: !0 })) : f();
        } else n.removeEventListener("click", s.value);
        r.value = !1;
      }
    }, u = window.setTimeout(() => {
      n.addEventListener("pointerdown", i);
    }, 0);
    l(() => {
      window.clearTimeout(u), n.removeEventListener("pointerdown", i), n.removeEventListener("click", s.value);
    });
  }), { onPointerDownCapture: () => {
    we(t) && (r.value = !0);
  } };
}
function Nl(e, o, t = !0) {
  const n = o?.value?.ownerDocument ?? globalThis?.document, r = P(!1);
  return se((s) => {
    if (!Ee || !we(t)) return;
    const l = async (i) => {
      if (!o?.value) return;
      await ce(), await ce();
      const u = i.target;
      !o.value || !u || Rr(o.value, u) || i.target && !r.value && yo(Fl, e, { originalEvent: i });
    };
    n.addEventListener("focusin", l), s(() => n.removeEventListener("focusin", l));
  }), {
    onFocusCapture: () => {
      we(t) && (r.value = !0);
    },
    onBlurCapture: () => {
      we(t) && (r.value = !1);
    }
  };
}
const Be = /* @__PURE__ */ so({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var Ll = /* @__PURE__ */ h({
  __name: "DismissableLayer",
  props: {
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1,
      default: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "dismiss"
  ],
  setup(e, { emit: o }) {
    const t = e, n = o, { forwardRef: r, currentElement: s } = V(), l = A(() => s.value?.ownerDocument ?? globalThis.document), i = A(() => Be.layersRoot), u = A(() => s.value ? Array.from(i.value).indexOf(s.value) : -1), c = A(() => Be.layersWithOutsidePointerEventsDisabled.size > 0), d = A(() => {
      const v = Array.from(i.value), [g] = [...Be.layersWithOutsidePointerEventsDisabled].slice(-1), w = v.indexOf(g);
      return u.value >= w;
    }), p = Vl(async (v) => {
      const g = [...Be.branches].some((w) => w?.contains(v.target));
      !d.value || g || (n("pointerDownOutside", v), n("interactOutside", v), await ce(), v.defaultPrevented || n("dismiss"));
    }, s), f = Nl((v) => {
      [...Be.branches].some((w) => w?.contains(v.target)) || (n("focusOutside", v), n("interactOutside", v), v.defaultPrevented || n("dismiss"));
    }, s);
    return Ls("Escape", (v) => {
      u.value === i.value.size - 1 && (n("escapeKeyDown", v), v.defaultPrevented || n("dismiss"));
    }), re([s, () => t.disableOutsidePointerEvents], ([v, g], w, S) => {
      v && (g && (Be.layersWithOutsidePointerEventsDisabled.size === 0 && (Be.originalBodyPointerEvents = l.value.body.style.pointerEvents, l.value.body.style.pointerEvents = "none"), Be.layersWithOutsidePointerEventsDisabled.add(v), S(() => {
        Be.layersWithOutsidePointerEventsDisabled.delete(v), Be.layersWithOutsidePointerEventsDisabled.size === 0 && !rt(Be.originalBodyPointerEvents) && (l.value.body.style.pointerEvents = Be.originalBodyPointerEvents);
      })), i.value.add(v));
    }, { immediate: !0 }), se((v) => {
      v(() => {
        s.value && (i.value.delete(s.value), Be.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (v, g) => (m(), _(a(K), {
      ref: a(r),
      "as-child": v.asChild,
      as: v.as,
      "data-dismissable-layer": "",
      style: Te({ pointerEvents: c.value ? d.value ? "auto" : "none" : void 0 }),
      onFocusCapture: a(f).onFocusCapture,
      onBlurCapture: a(f).onBlurCapture,
      onPointerdownCapture: a(p).onPointerDownCapture
    }, {
      default: y(() => [b(v.$slots, "default")]),
      _: 3
    }, 8, [
      "as-child",
      "as",
      "style",
      "onFocusCapture",
      "onBlurCapture",
      "onPointerdownCapture"
    ]));
  }
}), Ut = Ll;
const jl = /* @__PURE__ */ Ps(() => P([]));
function zl() {
  const e = jl();
  return {
    add(o) {
      const t = e.value[0];
      o !== t && t?.pause(), e.value = Wn(e.value, o), e.value.unshift(o);
    },
    remove(o) {
      e.value = Wn(e.value, o), e.value[0]?.resume();
    }
  };
}
function Wn(e, o) {
  const t = [...e], n = t.indexOf(o);
  return n !== -1 && t.splice(n, 1), t;
}
const No = "focusScope.autoFocusOnMount", Lo = "focusScope.autoFocusOnUnmount", Un = {
  bubbles: !1,
  cancelable: !0
};
function Kl(e, { select: o = !1 } = {}) {
  const t = he();
  for (const n of e)
    if (ot(n, { select: o }), he() !== t) return !0;
}
function Hl(e) {
  const o = Fr(e), t = Gn(o, e), n = Gn(o.reverse(), e);
  return [t, n];
}
function Fr(e) {
  const o = [], t = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, { acceptNode: (n) => {
    const r = n.tagName === "INPUT" && n.type === "hidden";
    return n.disabled || n.hidden || r ? NodeFilter.FILTER_SKIP : n.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) o.push(t.currentNode);
  return o;
}
function Gn(e, o) {
  for (const t of e) if (!Wl(t, { upTo: o })) return t;
}
function Wl(e, { upTo: o }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (o !== void 0 && e === o) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function Ul(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function ot(e, { select: o = !1 } = {}) {
  if (e && e.focus) {
    const t = he();
    e.focus({ preventScroll: !0 }), e !== t && Ul(e) && o && e.select();
  }
}
var Gl = /* @__PURE__ */ h({
  __name: "FocusScope",
  props: {
    loop: {
      type: Boolean,
      required: !1,
      default: !1
    },
    trapped: {
      type: Boolean,
      required: !1,
      default: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["mountAutoFocus", "unmountAutoFocus"],
  setup(e, { emit: o }) {
    const t = e, n = o, { currentRef: r, currentElement: s } = V(), l = P(null), i = zl(), u = /* @__PURE__ */ so({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    se((d) => {
      if (!Ee) return;
      const p = s.value;
      if (!t.trapped) return;
      function f(S) {
        if (u.paused || !p) return;
        const O = S.target;
        p.contains(O) ? l.value = O : ot(l.value, { select: !0 });
      }
      function v(S) {
        if (u.paused || !p) return;
        const O = S.relatedTarget;
        O !== null && (p.contains(O) || ot(l.value, { select: !0 }));
      }
      function g(S) {
        const O = l.value;
        if (O === null || !S.some((C) => C.removedNodes.length > 0)) return;
        p.contains(O) || ot(p);
      }
      document.addEventListener("focusin", f), document.addEventListener("focusout", v);
      const w = new MutationObserver(g);
      p && w.observe(p, {
        childList: !0,
        subtree: !0
      }), d(() => {
        document.removeEventListener("focusin", f), document.removeEventListener("focusout", v), w.disconnect();
      });
    }), se(async (d) => {
      const p = s.value;
      if (await ce(), !p) return;
      i.add(u);
      const f = he();
      if (!p.contains(f)) {
        const g = new CustomEvent(No, Un);
        p.addEventListener(No, (w) => n("mountAutoFocus", w)), p.dispatchEvent(g), g.defaultPrevented || (Kl(Fr(p), { select: !0 }), he() === f && ot(p));
      }
      d(() => {
        p.removeEventListener(No, (S) => n("mountAutoFocus", S));
        const g = new CustomEvent(Lo, Un), w = (S) => {
          n("unmountAutoFocus", S);
        };
        p.addEventListener(Lo, w), p.dispatchEvent(g), p.setAttribute("data-focus-scope-unmounting", ""), setTimeout(() => {
          g.defaultPrevented || ot(f ?? document.body, { select: !0 }), p.removeEventListener(Lo, w), i.remove(u), p.removeAttribute("data-focus-scope-unmounting");
        }, 0);
      });
    });
    function c(d) {
      if (!t.loop && !t.trapped || u.paused) return;
      const p = d.key === "Tab" && !d.altKey && !d.ctrlKey && !d.metaKey, f = he();
      if (p && f) {
        const v = d.currentTarget, [g, w] = Hl(v);
        g && w ? !d.shiftKey && f === w ? (d.preventDefault(), t.loop && ot(g, { select: !0 })) : d.shiftKey && f === g && (d.preventDefault(), t.loop && ot(w, { select: !0 })) : f === v && d.preventDefault();
      }
    }
    return (d, p) => (m(), _(a(K), {
      ref_key: "currentRef",
      ref: r,
      tabindex: "-1",
      "as-child": d.asChild,
      as: d.as,
      onKeydown: c
    }, {
      default: y(() => [b(d.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), Co = Gl;
const Yl = "menu.itemSelect", Xo = ["Enter", " "], Xl = [
  "ArrowDown",
  "PageUp",
  "Home"
], Vr = [
  "ArrowUp",
  "PageDown",
  "End"
], Jl = [...Xl, ...Vr], Zl = {
  ltr: [...Xo, "ArrowRight"],
  rtl: [...Xo, "ArrowLeft"]
}, Ql = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"]
};
function vn(e) {
  return e ? "open" : "closed";
}
function uo(e) {
  return e === "indeterminate";
}
function mn(e) {
  return uo(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
function Jo(e) {
  const o = he();
  for (const t of e)
    if (t === o || (t.focus(), he() !== o)) return;
}
function ei(e, o) {
  const { x: t, y: n } = e;
  let r = !1;
  for (let s = 0, l = o.length - 1; s < o.length; l = s++) {
    const i = o[s].x, u = o[s].y, c = o[l].x, d = o[l].y;
    u > n != d > n && t < (c - i) * (n - u) / (d - u) + i && (r = !r);
  }
  return r;
}
function ti(e, o) {
  if (!o) return !1;
  const t = {
    x: e.clientX,
    y: e.clientY
  };
  return ei(t, o);
}
function At(e) {
  return e.pointerType === "mouse";
}
const oi = "DialogTitle", ni = "DialogContent";
function ri({ titleName: e = oi, contentName: o = ni, componentLink: t = "dialog.html#title", titleId: n, descriptionId: r, contentElement: s }) {
  const l = `Warning: \`${o}\` requires a \`${e}\` for the component to be accessible for screen reader users.

If you want to hide the \`${e}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, i = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${o}.`;
  pe(() => {
    document.getElementById(n) || console.warn(l);
    const c = s.value?.getAttribute("aria-describedby");
    r && c && (document.getElementById(r) || console.warn(i));
  });
}
var ai = /* @__PURE__ */ h({
  __name: "DialogContentImpl",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    trapFocus: {
      type: Boolean,
      required: !1
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(e, { emit: o }) {
    const t = e, n = o, r = ze(), { forwardRef: s, currentElement: l } = V();
    return r.titleId ||= be(void 0, "reka-dialog-title"), r.descriptionId ||= be(void 0, "reka-dialog-description"), pe(() => {
      r.contentElement = l, he() !== document.body && (r.triggerElement.value = he());
    }), process.env.NODE_ENV !== "production" && ri({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: r.titleId,
      descriptionId: r.descriptionId,
      contentElement: l
    }), (i, u) => (m(), _(a(Co), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: u[5] || (u[5] = (c) => n("openAutoFocus", c)),
      onUnmountAutoFocus: u[6] || (u[6] = (c) => n("closeAutoFocus", c))
    }, {
      default: y(() => [I(a(Ut), E({
        id: a(r).contentId,
        ref: a(s),
        as: i.as,
        "as-child": i.asChild,
        "disable-outside-pointer-events": i.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": a(r).descriptionId,
        "aria-labelledby": a(r).titleId,
        "data-state": a(vn)(a(r).open.value)
      }, i.$attrs, {
        onDismiss: u[0] || (u[0] = (c) => a(r).onOpenChange(!1)),
        onEscapeKeyDown: u[1] || (u[1] = (c) => n("escapeKeyDown", c)),
        onFocusOutside: u[2] || (u[2] = (c) => n("focusOutside", c)),
        onInteractOutside: u[3] || (u[3] = (c) => n("interactOutside", c)),
        onPointerDownOutside: u[4] || (u[4] = (c) => n("pointerDownOutside", c))
      }), {
        default: y(() => [b(i.$slots, "default")]),
        _: 3
      }, 16, [
        "id",
        "as",
        "as-child",
        "disable-outside-pointer-events",
        "aria-describedby",
        "aria-labelledby",
        "data-state"
      ])]),
      _: 3
    }, 8, ["trapped"]));
  }
}), Nr = ai, si = /* @__PURE__ */ h({
  __name: "DialogContentModal",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    trapFocus: {
      type: Boolean,
      required: !1
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1,
      default: !0
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(e, { emit: o }) {
    const t = e, n = o, r = ze(), s = mt(n), { forwardRef: l, currentElement: i } = V();
    return _o(i), (u, c) => (m(), _(Nr, E({
      ...t,
      ...a(s)
    }, {
      ref: a(l),
      "trap-focus": a(r).open.value,
      "disable-outside-pointer-events": t.disableOutsidePointerEvents,
      onCloseAutoFocus: c[0] || (c[0] = (d) => {
        d.defaultPrevented || (d.preventDefault(), a(r).triggerElement.value?.focus());
      }),
      onPointerDownOutside: c[1] || (c[1] = (d) => {
        const p = d.detail.originalEvent, f = p.button === 0 && p.ctrlKey === !0;
        (p.button === 2 || f) && d.preventDefault();
      }),
      onFocusOutside: c[2] || (c[2] = (d) => {
        d.preventDefault();
      })
    }), {
      default: y(() => [b(u.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus", "disable-outside-pointer-events"]));
  }
}), li = si, ii = /* @__PURE__ */ h({
  __name: "DialogContentNonModal",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    trapFocus: {
      type: Boolean,
      required: !1
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(e, { emit: o }) {
    const t = e, r = mt(o);
    V();
    const s = ze(), l = P(!1), i = P(!1);
    return (u, c) => (m(), _(Nr, E({
      ...t,
      ...a(r)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: c[0] || (c[0] = (d) => {
        d.defaultPrevented || (l.value || a(s).triggerElement.value?.focus(), d.preventDefault()), l.value = !1, i.value = !1;
      }),
      onInteractOutside: c[1] || (c[1] = (d) => {
        d.defaultPrevented || (l.value = !0, d.detail.originalEvent.type === "pointerdown" && (i.value = !0));
        const p = d.target;
        a(s).triggerElement.value?.contains(p) && d.preventDefault(), d.detail.originalEvent.type === "focusin" && i.value && d.preventDefault();
      })
    }), {
      default: y(() => [b(u.$slots, "default")]),
      _: 3
    }, 16));
  }
}), ui = ii, di = /* @__PURE__ */ h({
  __name: "DialogContent",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(e, { emit: o }) {
    const t = e, n = o, r = ze(), s = mt(n), { forwardRef: l } = V();
    return (i, u) => (m(), _(a(De), { present: i.forceMount || a(r).open.value }, {
      default: y(() => [a(r).modal.value ? (m(), _(li, E({
        key: 0,
        ref: a(l)
      }, {
        ...t,
        ...a(s),
        ...i.$attrs
      }), {
        default: y(() => [b(i.$slots, "default")]),
        _: 3
      }, 16)) : (m(), _(ui, E({
        key: 1,
        ref: a(l)
      }, {
        ...t,
        ...a(s),
        ...i.$attrs
      }), {
        default: y(() => [b(i.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), yn = di, ci = /* @__PURE__ */ h({
  __name: "DialogDescription",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "p"
    }
  },
  setup(e) {
    const o = e;
    V();
    const t = ze();
    return (n, r) => (m(), _(a(K), E(o, { id: a(t).descriptionId }), {
      default: y(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Lr = ci, pi = /* @__PURE__ */ h({
  __name: "DialogOverlayImpl",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = ze();
    return bo(!0), V(), (t, n) => (m(), _(a(K), {
      as: t.as,
      "as-child": t.asChild,
      "data-state": a(o).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" },
      onPointerdown: n[0] || (n[0] = Ce(() => {
      }, [
        "left",
        "self",
        "prevent"
      ]))
    }, {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), fi = pi, vi = /* @__PURE__ */ h({
  __name: "DialogOverlay",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = ze(), { forwardRef: t } = V();
    return (n, r) => a(o)?.modal.value ? (m(), _(a(De), {
      key: 0,
      present: n.forceMount || a(o).open.value
    }, {
      default: y(() => [I(fi, E(n.$attrs, {
        ref: a(t),
        as: n.as,
        "as-child": n.asChild
      }), {
        default: y(() => [b(n.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : de("v-if", !0);
  }
}), gn = vi, mi = /* @__PURE__ */ h({
  __name: "Teleport",
  props: {
    to: {
      type: null,
      required: !1,
      default: "body"
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    defer: {
      type: Boolean,
      required: !1
    },
    forceMount: {
      type: Boolean,
      required: !1
    }
  },
  setup(e) {
    const o = /* @__PURE__ */ un();
    return (t, n) => a(o) || t.forceMount ? (m(), _(yr, {
      key: 0,
      to: t.to,
      disabled: t.disabled,
      defer: t.defer
    }, [b(t.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : de("v-if", !0);
  }
}), Gt = mi, yi = /* @__PURE__ */ h({
  __name: "DialogPortal",
  props: {
    to: {
      type: null,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    defer: {
      type: Boolean,
      required: !1
    },
    forceMount: {
      type: Boolean,
      required: !1
    }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(Gt), X(Q(o)), {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), hn = yi, gi = /* @__PURE__ */ h({
  __name: "DialogTitle",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "h2"
    }
  },
  setup(e) {
    const o = e, t = ze();
    return V(), (n, r) => (m(), _(a(K), E(o, { id: a(t).titleId }), {
      default: y(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), jr = gi, hi = /* @__PURE__ */ h({
  __name: "DialogTrigger",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "button"
    }
  },
  setup(e) {
    const o = e, t = ze(), { forwardRef: n, currentElement: r } = V();
    return t.contentId ||= be(void 0, "reka-dialog-content"), pe(() => {
      t.triggerElement.value = r.value;
    }), (s, l) => (m(), _(a(K), E(o, {
      ref: a(n),
      type: s.as === "button" ? "button" : void 0,
      "aria-haspopup": "dialog",
      "aria-expanded": a(t).open.value || !1,
      "aria-controls": a(t).open.value ? a(t).contentId : void 0,
      "data-state": a(t).open.value ? "open" : "closed",
      onClick: a(t).onOpenToggle
    }), {
      default: y(() => [b(s.$slots, "default")]),
      _: 3
    }, 16, [
      "type",
      "aria-expanded",
      "aria-controls",
      "data-state",
      "onClick"
    ]));
  }
}), zr = hi;
const Yn = "data-reka-collection-item";
function ke(e = {}) {
  const { key: o = "", isProvider: t = !1 } = e, n = `${o}CollectionProvider`;
  let r;
  if (t) {
    const d = P(/* @__PURE__ */ new Map());
    r = {
      collectionRef: P(),
      itemMap: d
    }, an(n, r);
  } else r = Nt(n);
  const s = (d = !1) => {
    const p = r.collectionRef.value;
    if (!p) return [];
    const f = Array.from(p.querySelectorAll(`[${Yn}]`)), g = Array.from(r.itemMap.value.values()).sort((w, S) => f.indexOf(w.ref) - f.indexOf(S.ref));
    return d ? g : g.filter((w) => w.ref.dataset.disabled !== "");
  }, l = /* @__PURE__ */ h({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(d, { slots: p, attrs: f }) {
      const { primitiveElement: v, currentElement: g } = Go();
      return re(g, () => {
        r.collectionRef.value = g.value;
      }), () => Me(io, {
        ref: v,
        ...f
      }, p);
    }
  }), i = /* @__PURE__ */ h({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(d, { slots: p, attrs: f }) {
      const { primitiveElement: v, currentElement: g } = Go();
      return se((w) => {
        if (g.value) {
          const S = za(g.value);
          r.itemMap.value.set(S, {
            ref: g.value,
            value: d.value
          }), w(() => r.itemMap.value.delete(S));
        }
      }), () => Me(io, {
        ...f,
        [Yn]: "",
        ref: v
      }, p);
    }
  }), u = A(() => Array.from(r.itemMap.value.values())), c = A(() => r.itemMap.value.size);
  return {
    getItems: s,
    reactiveItems: u,
    itemMapSize: c,
    CollectionSlot: l,
    CollectionItem: i
  };
}
var bi = /* @__PURE__ */ h({
  __name: "VisuallyHidden",
  props: {
    feature: {
      type: String,
      required: !1,
      default: "focusable"
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(e) {
    return (o, t) => (m(), _(a(K), {
      as: o.as,
      "as-child": o.asChild,
      "aria-hidden": o.feature === "focusable" ? "true" : void 0,
      "data-hidden": o.feature === "fully-hidden" ? "" : void 0,
      tabindex: o.feature === "fully-hidden" ? "-1" : void 0,
      style: {
        position: "absolute",
        border: 0,
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        clipPath: "inset(50%)",
        whiteSpace: "nowrap",
        wordWrap: "normal",
        top: "-1px",
        left: "-1px"
      }
    }, {
      default: y(() => [b(o.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), bn = bi, _i = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "VisuallyHiddenInputBubble",
  props: {
    name: {
      type: String,
      required: !0
    },
    value: {
      type: null,
      required: !0
    },
    checked: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    required: {
      type: Boolean,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    feature: {
      type: String,
      required: !1,
      default: "fully-hidden"
    }
  },
  setup(e) {
    const o = e, { primitiveElement: t, currentElement: n } = Go(), r = A(() => o.checked ?? o.value);
    return re(r, (s, l) => {
      if (!n.value) return;
      const i = n.value, u = window.HTMLInputElement.prototype, d = Object.getOwnPropertyDescriptor(u, "value").set;
      if (d && s !== l) {
        const p = new Event("input", { bubbles: !0 }), f = new Event("change", { bubbles: !0 });
        d.call(i, s), i.dispatchEvent(p), i.dispatchEvent(f);
      }
    }), (s, l) => (m(), _(bn, E({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...o,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), Xn = _i, wi = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "VisuallyHiddenInput",
  props: {
    name: {
      type: String,
      required: !0
    },
    value: {
      type: null,
      required: !0
    },
    checked: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    required: {
      type: Boolean,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    feature: {
      type: String,
      required: !1,
      default: "fully-hidden"
    }
  },
  setup(e) {
    const o = e, t = A(() => typeof o.value == "object" && Array.isArray(o.value) && o.value.length === 0 && o.required), n = A(() => typeof o.value == "string" || typeof o.value == "number" || typeof o.value == "boolean" || o.value === null || o.value === void 0 ? [{
      name: o.name,
      value: o.value
    }] : typeof o.value == "object" && Array.isArray(o.value) ? o.value.flatMap((r, s) => typeof r == "object" ? Object.entries(r).map(([l, i]) => ({
      name: `${o.name}[${s}][${l}]`,
      value: i
    })) : {
      name: `${o.name}[${s}]`,
      value: r
    }) : o.value !== null && typeof o.value == "object" && !Array.isArray(o.value) ? Object.entries(o.value).map(([r, s]) => ({
      name: `${o.name}[${r}]`,
      value: s
    })) : []);
    return (r, s) => (m(), H(qe, null, [de(" We render single input if it's required "), t.value ? (m(), _(Xn, E({ key: r.name }, {
      ...o,
      ...r.$attrs
    }, {
      name: r.name,
      value: r.value
    }), null, 16, ["name", "value"])) : (m(!0), H(qe, { key: 1 }, Bt(n.value, (l) => (m(), _(Xn, E({ key: l.name }, { ref_for: !0 }, {
      ...o,
      ...r.$attrs
    }, {
      name: l.name,
      value: l.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), Yt = wi;
const Ci = "rovingFocusGroup.onEntryFocus", Si = {
  bubbles: !1,
  cancelable: !0
}, xi = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function qi(e, o) {
  return o !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e;
}
function Bi(e, o, t) {
  const n = qi(e.key, t);
  if (!(o === "vertical" && ["ArrowLeft", "ArrowRight"].includes(n)) && !(o === "horizontal" && ["ArrowUp", "ArrowDown"].includes(n)))
    return xi[n];
}
function Kr(e, o = !1) {
  const t = he();
  for (const n of e)
    if (n === t || (n.focus({ preventScroll: o }), he() !== t)) return;
}
function Oi(e, o) {
  return e.map((t, n) => e[(o + n) % e.length]);
}
const [Hr, Ai] = /* @__PURE__ */ oe("PopperRoot");
var Pi = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(e) {
    const o = P();
    return Ai({
      anchor: o,
      onAnchorChange: (t) => o.value = t
    }), (t, n) => b(t.$slots, "default");
  }
}), Xt = Pi, Ti = /* @__PURE__ */ h({
  __name: "PopperAnchor",
  props: {
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e, { forwardRef: t, currentElement: n } = V(), r = Hr();
    return gr(() => {
      r.onAnchorChange(o.reference ?? n.value);
    }), (s, l) => (m(), _(a(K), {
      ref: a(t),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: y(() => [b(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), So = Ti;
function Ei(e) {
  return e !== null;
}
function Di(e) {
  return {
    name: "transformOrigin",
    options: e,
    fn(o) {
      const { placement: t, rects: n, middlewareData: r } = o, l = r.arrow?.centerOffset !== 0, i = l ? 0 : e.arrowWidth, u = l ? 0 : e.arrowHeight, [c, d] = Zo(t), p = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[d], f = (r.arrow?.x ?? 0) + i / 2, v = (r.arrow?.y ?? 0) + u / 2;
      let g = "", w = "";
      return c === "bottom" ? (g = l ? p : `${f}px`, w = `${-u}px`) : c === "top" ? (g = l ? p : `${f}px`, w = `${n.floating.height + u}px`) : c === "right" ? (g = `${-u}px`, w = l ? p : `${v}px`) : c === "left" && (g = `${n.floating.width + u}px`, w = l ? p : `${v}px`), { data: {
        x: g,
        y: w
      } };
    }
  };
}
function Zo(e) {
  const [o, t = "center"] = e.split("-");
  return [o, t];
}
const ki = ["top", "right", "bottom", "left"], at = Math.min, Oe = Math.max, co = Math.round, ro = Math.floor, Le = (e) => ({
  x: e,
  y: e
}), $i = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function Qo(e, o, t) {
  return Oe(e, at(o, t));
}
function Ge(e, o) {
  return typeof e == "function" ? e(o) : e;
}
function Ye(e) {
  return e.split("-")[0];
}
function $t(e) {
  return e.split("-")[1];
}
function _n(e) {
  return e === "x" ? "y" : "x";
}
function wn(e) {
  return e === "y" ? "height" : "width";
}
function Ne(e) {
  const o = e[0];
  return o === "t" || o === "b" ? "y" : "x";
}
function Cn(e) {
  return _n(Ne(e));
}
function Ii(e, o, t) {
  t === void 0 && (t = !1);
  const n = $t(e), r = Cn(e), s = wn(r);
  let l = r === "x" ? n === (t ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return o.reference[s] > o.floating[s] && (l = po(l)), [l, po(l)];
}
function Mi(e) {
  const o = po(e);
  return [en(e), o, en(o)];
}
function en(e) {
  return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
const Jn = ["left", "right"], Zn = ["right", "left"], Ri = ["top", "bottom"], Fi = ["bottom", "top"];
function Vi(e, o, t) {
  switch (e) {
    case "top":
    case "bottom":
      return t ? o ? Zn : Jn : o ? Jn : Zn;
    case "left":
    case "right":
      return o ? Ri : Fi;
    default:
      return [];
  }
}
function Ni(e, o, t, n) {
  const r = $t(e);
  let s = Vi(Ye(e), t === "start", n);
  return r && (s = s.map((l) => l + "-" + r), o && (s = s.concat(s.map(en)))), s;
}
function po(e) {
  const o = Ye(e);
  return $i[o] + e.slice(o.length);
}
function Li(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function Wr(e) {
  return typeof e != "number" ? Li(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function fo(e) {
  const {
    x: o,
    y: t,
    width: n,
    height: r
  } = e;
  return {
    width: n,
    height: r,
    top: t,
    left: o,
    right: o + n,
    bottom: t + r,
    x: o,
    y: t
  };
}
function Qn(e, o, t) {
  let {
    reference: n,
    floating: r
  } = e;
  const s = Ne(o), l = Cn(o), i = wn(l), u = Ye(o), c = s === "y", d = n.x + n.width / 2 - r.width / 2, p = n.y + n.height / 2 - r.height / 2, f = n[i] / 2 - r[i] / 2;
  let v;
  switch (u) {
    case "top":
      v = {
        x: d,
        y: n.y - r.height
      };
      break;
    case "bottom":
      v = {
        x: d,
        y: n.y + n.height
      };
      break;
    case "right":
      v = {
        x: n.x + n.width,
        y: p
      };
      break;
    case "left":
      v = {
        x: n.x - r.width,
        y: p
      };
      break;
    default:
      v = {
        x: n.x,
        y: n.y
      };
  }
  switch ($t(o)) {
    case "start":
      v[l] -= f * (t && c ? -1 : 1);
      break;
    case "end":
      v[l] += f * (t && c ? -1 : 1);
      break;
  }
  return v;
}
async function ji(e, o) {
  var t;
  o === void 0 && (o = {});
  const {
    x: n,
    y: r,
    platform: s,
    rects: l,
    elements: i,
    strategy: u
  } = e, {
    boundary: c = "clippingAncestors",
    rootBoundary: d = "viewport",
    elementContext: p = "floating",
    altBoundary: f = !1,
    padding: v = 0
  } = Ge(o, e), g = Wr(v), S = i[f ? p === "floating" ? "reference" : "floating" : p], O = fo(await s.getClippingRect({
    element: (t = await (s.isElement == null ? void 0 : s.isElement(S))) == null || t ? S : S.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(i.floating)),
    boundary: c,
    rootBoundary: d,
    strategy: u
  })), x = p === "floating" ? {
    x: n,
    y: r,
    width: l.floating.width,
    height: l.floating.height
  } : l.reference, B = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(i.floating)), C = await (s.isElement == null ? void 0 : s.isElement(B)) ? await (s.getScale == null ? void 0 : s.getScale(B)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, k = fo(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: i,
    rect: x,
    offsetParent: B,
    strategy: u
  }) : x);
  return {
    top: (O.top - k.top + g.top) / C.y,
    bottom: (k.bottom - O.bottom + g.bottom) / C.y,
    left: (O.left - k.left + g.left) / C.x,
    right: (k.right - O.right + g.right) / C.x
  };
}
const zi = 50, Ki = async (e, o, t) => {
  const {
    placement: n = "bottom",
    strategy: r = "absolute",
    middleware: s = [],
    platform: l
  } = t, i = l.detectOverflow ? l : {
    ...l,
    detectOverflow: ji
  }, u = await (l.isRTL == null ? void 0 : l.isRTL(o));
  let c = await l.getElementRects({
    reference: e,
    floating: o,
    strategy: r
  }), {
    x: d,
    y: p
  } = Qn(c, n, u), f = n, v = 0;
  const g = {};
  for (let w = 0; w < s.length; w++) {
    const S = s[w];
    if (!S)
      continue;
    const {
      name: O,
      fn: x
    } = S, {
      x: B,
      y: C,
      data: k,
      reset: M
    } = await x({
      x: d,
      y: p,
      initialPlacement: n,
      placement: f,
      strategy: r,
      middlewareData: g,
      rects: c,
      platform: i,
      elements: {
        reference: e,
        floating: o
      }
    });
    d = B ?? d, p = C ?? p, g[O] = {
      ...g[O],
      ...k
    }, M && v < zi && (v++, typeof M == "object" && (M.placement && (f = M.placement), M.rects && (c = M.rects === !0 ? await l.getElementRects({
      reference: e,
      floating: o,
      strategy: r
    }) : M.rects), {
      x: d,
      y: p
    } = Qn(c, f, u)), w = -1);
  }
  return {
    x: d,
    y: p,
    placement: f,
    strategy: r,
    middlewareData: g
  };
}, Hi = (e) => ({
  name: "arrow",
  options: e,
  async fn(o) {
    const {
      x: t,
      y: n,
      placement: r,
      rects: s,
      platform: l,
      elements: i,
      middlewareData: u
    } = o, {
      element: c,
      padding: d = 0
    } = Ge(e, o) || {};
    if (c == null)
      return {};
    const p = Wr(d), f = {
      x: t,
      y: n
    }, v = Cn(r), g = wn(v), w = await l.getDimensions(c), S = v === "y", O = S ? "top" : "left", x = S ? "bottom" : "right", B = S ? "clientHeight" : "clientWidth", C = s.reference[g] + s.reference[v] - f[v] - s.floating[g], k = f[v] - s.reference[v], M = await (l.getOffsetParent == null ? void 0 : l.getOffsetParent(c));
    let R = M ? M[B] : 0;
    (!R || !await (l.isElement == null ? void 0 : l.isElement(M))) && (R = i.floating[B] || s.floating[g]);
    const N = C / 2 - k / 2, j = R / 2 - w[g] / 2 - 1, q = at(p[O], j), F = at(p[x], j), D = q, W = R - w[g] - F, G = R / 2 - w[g] / 2 + N, $ = Qo(D, G, W), z = !u.arrow && $t(r) != null && G !== $ && s.reference[g] / 2 - (G < D ? q : F) - w[g] / 2 < 0, U = z ? G < D ? G - D : G - W : 0;
    return {
      [v]: f[v] + U,
      data: {
        [v]: $,
        centerOffset: G - $ - U,
        ...z && {
          alignmentOffset: U
        }
      },
      reset: z
    };
  }
}), Wi = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(o) {
      var t, n;
      const {
        placement: r,
        middlewareData: s,
        rects: l,
        initialPlacement: i,
        platform: u,
        elements: c
      } = o, {
        mainAxis: d = !0,
        crossAxis: p = !0,
        fallbackPlacements: f,
        fallbackStrategy: v = "bestFit",
        fallbackAxisSideDirection: g = "none",
        flipAlignment: w = !0,
        ...S
      } = Ge(e, o);
      if ((t = s.arrow) != null && t.alignmentOffset)
        return {};
      const O = Ye(r), x = Ne(i), B = Ye(i) === i, C = await (u.isRTL == null ? void 0 : u.isRTL(c.floating)), k = f || (B || !w ? [po(i)] : Mi(i)), M = g !== "none";
      !f && M && k.push(...Ni(i, w, g, C));
      const R = [i, ...k], N = await u.detectOverflow(o, S), j = [];
      let q = ((n = s.flip) == null ? void 0 : n.overflows) || [];
      if (d && j.push(N[O]), p) {
        const G = Ii(r, l, C);
        j.push(N[G[0]], N[G[1]]);
      }
      if (q = [...q, {
        placement: r,
        overflows: j
      }], !j.every((G) => G <= 0)) {
        var F, D;
        const G = (((F = s.flip) == null ? void 0 : F.index) || 0) + 1, $ = R[G];
        if ($ && (!(p === "alignment" ? x !== Ne($) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        q.every((ne) => Ne(ne.placement) === x ? ne.overflows[0] > 0 : !0)))
          return {
            data: {
              index: G,
              overflows: q
            },
            reset: {
              placement: $
            }
          };
        let z = (D = q.filter((U) => U.overflows[0] <= 0).sort((U, ne) => U.overflows[1] - ne.overflows[1])[0]) == null ? void 0 : D.placement;
        if (!z)
          switch (v) {
            case "bestFit": {
              var W;
              const U = (W = q.filter((ne) => {
                if (M) {
                  const ve = Ne(ne.placement);
                  return ve === x || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  ve === "y";
                }
                return !0;
              }).map((ne) => [ne.placement, ne.overflows.filter((ve) => ve > 0).reduce((ve, Se) => ve + Se, 0)]).sort((ne, ve) => ne[1] - ve[1])[0]) == null ? void 0 : W[0];
              U && (z = U);
              break;
            }
            case "initialPlacement":
              z = i;
              break;
          }
        if (r !== z)
          return {
            reset: {
              placement: z
            }
          };
      }
      return {};
    }
  };
};
function er(e, o) {
  return {
    top: e.top - o.height,
    right: e.right - o.width,
    bottom: e.bottom - o.height,
    left: e.left - o.width
  };
}
function tr(e) {
  return ki.some((o) => e[o] >= 0);
}
const Ui = function(e) {
  return e === void 0 && (e = {}), {
    name: "hide",
    options: e,
    async fn(o) {
      const {
        rects: t,
        platform: n
      } = o, {
        strategy: r = "referenceHidden",
        ...s
      } = Ge(e, o);
      switch (r) {
        case "referenceHidden": {
          const l = await n.detectOverflow(o, {
            ...s,
            elementContext: "reference"
          }), i = er(l, t.reference);
          return {
            data: {
              referenceHiddenOffsets: i,
              referenceHidden: tr(i)
            }
          };
        }
        case "escaped": {
          const l = await n.detectOverflow(o, {
            ...s,
            altBoundary: !0
          }), i = er(l, t.floating);
          return {
            data: {
              escapedOffsets: i,
              escaped: tr(i)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Ur = /* @__PURE__ */ new Set(["left", "top"]);
async function Gi(e, o) {
  const {
    placement: t,
    platform: n,
    elements: r
  } = e, s = await (n.isRTL == null ? void 0 : n.isRTL(r.floating)), l = Ye(t), i = $t(t), u = Ne(t) === "y", c = Ur.has(l) ? -1 : 1, d = s && u ? -1 : 1, p = Ge(o, e);
  let {
    mainAxis: f,
    crossAxis: v,
    alignmentAxis: g
  } = typeof p == "number" ? {
    mainAxis: p,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: p.mainAxis || 0,
    crossAxis: p.crossAxis || 0,
    alignmentAxis: p.alignmentAxis
  };
  return i && typeof g == "number" && (v = i === "end" ? g * -1 : g), u ? {
    x: v * d,
    y: f * c
  } : {
    x: f * c,
    y: v * d
  };
}
const Yi = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(o) {
      var t, n;
      const {
        x: r,
        y: s,
        placement: l,
        middlewareData: i
      } = o, u = await Gi(o, e);
      return l === ((t = i.offset) == null ? void 0 : t.placement) && (n = i.arrow) != null && n.alignmentOffset ? {} : {
        x: r + u.x,
        y: s + u.y,
        data: {
          ...u,
          placement: l
        }
      };
    }
  };
}, Xi = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(o) {
      const {
        x: t,
        y: n,
        placement: r,
        platform: s
      } = o, {
        mainAxis: l = !0,
        crossAxis: i = !1,
        limiter: u = {
          fn: (O) => {
            let {
              x,
              y: B
            } = O;
            return {
              x,
              y: B
            };
          }
        },
        ...c
      } = Ge(e, o), d = {
        x: t,
        y: n
      }, p = await s.detectOverflow(o, c), f = Ne(Ye(r)), v = _n(f);
      let g = d[v], w = d[f];
      if (l) {
        const O = v === "y" ? "top" : "left", x = v === "y" ? "bottom" : "right", B = g + p[O], C = g - p[x];
        g = Qo(B, g, C);
      }
      if (i) {
        const O = f === "y" ? "top" : "left", x = f === "y" ? "bottom" : "right", B = w + p[O], C = w - p[x];
        w = Qo(B, w, C);
      }
      const S = u.fn({
        ...o,
        [v]: g,
        [f]: w
      });
      return {
        ...S,
        data: {
          x: S.x - t,
          y: S.y - n,
          enabled: {
            [v]: l,
            [f]: i
          }
        }
      };
    }
  };
}, Ji = function(e) {
  return e === void 0 && (e = {}), {
    options: e,
    fn(o) {
      const {
        x: t,
        y: n,
        placement: r,
        rects: s,
        middlewareData: l
      } = o, {
        offset: i = 0,
        mainAxis: u = !0,
        crossAxis: c = !0
      } = Ge(e, o), d = {
        x: t,
        y: n
      }, p = Ne(r), f = _n(p);
      let v = d[f], g = d[p];
      const w = Ge(i, o), S = typeof w == "number" ? {
        mainAxis: w,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...w
      };
      if (u) {
        const B = f === "y" ? "height" : "width", C = s.reference[f] - s.floating[B] + S.mainAxis, k = s.reference[f] + s.reference[B] - S.mainAxis;
        v < C ? v = C : v > k && (v = k);
      }
      if (c) {
        var O, x;
        const B = f === "y" ? "width" : "height", C = Ur.has(Ye(r)), k = s.reference[p] - s.floating[B] + (C && ((O = l.offset) == null ? void 0 : O[p]) || 0) + (C ? 0 : S.crossAxis), M = s.reference[p] + s.reference[B] + (C ? 0 : ((x = l.offset) == null ? void 0 : x[p]) || 0) - (C ? S.crossAxis : 0);
        g < k ? g = k : g > M && (g = M);
      }
      return {
        [f]: v,
        [p]: g
      };
    }
  };
}, Zi = function(e) {
  return e === void 0 && (e = {}), {
    name: "size",
    options: e,
    async fn(o) {
      var t, n;
      const {
        placement: r,
        rects: s,
        platform: l,
        elements: i
      } = o, {
        apply: u = () => {
        },
        ...c
      } = Ge(e, o), d = await l.detectOverflow(o, c), p = Ye(r), f = $t(r), v = Ne(r) === "y", {
        width: g,
        height: w
      } = s.floating;
      let S, O;
      p === "top" || p === "bottom" ? (S = p, O = f === (await (l.isRTL == null ? void 0 : l.isRTL(i.floating)) ? "start" : "end") ? "left" : "right") : (O = p, S = f === "end" ? "top" : "bottom");
      const x = w - d.top - d.bottom, B = g - d.left - d.right, C = at(w - d[S], x), k = at(g - d[O], B), M = !o.middlewareData.shift;
      let R = C, N = k;
      if ((t = o.middlewareData.shift) != null && t.enabled.x && (N = B), (n = o.middlewareData.shift) != null && n.enabled.y && (R = x), M && !f) {
        const q = Oe(d.left, 0), F = Oe(d.right, 0), D = Oe(d.top, 0), W = Oe(d.bottom, 0);
        v ? N = g - 2 * (q !== 0 || F !== 0 ? q + F : Oe(d.left, d.right)) : R = w - 2 * (D !== 0 || W !== 0 ? D + W : Oe(d.top, d.bottom));
      }
      await u({
        ...o,
        availableWidth: N,
        availableHeight: R
      });
      const j = await l.getDimensions(i.floating);
      return g !== j.width || w !== j.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function xo() {
  return typeof window < "u";
}
function yt(e) {
  return Sn(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function Ae(e) {
  var o;
  return (e == null || (o = e.ownerDocument) == null ? void 0 : o.defaultView) || window;
}
function Ke(e) {
  var o;
  return (o = (Sn(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : o.documentElement;
}
function Sn(e) {
  return xo() ? e instanceof Node || e instanceof Ae(e).Node : !1;
}
function Re(e) {
  return xo() ? e instanceof Element || e instanceof Ae(e).Element : !1;
}
function Je(e) {
  return xo() ? e instanceof HTMLElement || e instanceof Ae(e).HTMLElement : !1;
}
function or(e) {
  return !xo() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof Ae(e).ShadowRoot;
}
function Jt(e) {
  const {
    overflow: o,
    overflowX: t,
    overflowY: n,
    display: r
  } = Fe(e);
  return /auto|scroll|overlay|hidden|clip/.test(o + n + t) && r !== "inline" && r !== "contents";
}
function Qi(e) {
  return /^(table|td|th)$/.test(yt(e));
}
function qo(e) {
  try {
    if (e.matches(":popover-open"))
      return !0;
  } catch {
  }
  try {
    return e.matches(":modal");
  } catch {
    return !1;
  }
}
const eu = /transform|translate|scale|rotate|perspective|filter/, tu = /paint|layout|strict|content/, dt = (e) => !!e && e !== "none";
let jo;
function xn(e) {
  const o = Re(e) ? Fe(e) : e;
  return dt(o.transform) || dt(o.translate) || dt(o.scale) || dt(o.rotate) || dt(o.perspective) || !qn() && (dt(o.backdropFilter) || dt(o.filter)) || eu.test(o.willChange || "") || tu.test(o.contain || "");
}
function ou(e) {
  let o = st(e);
  for (; Je(o) && !Pt(o); ) {
    if (xn(o))
      return o;
    if (qo(o))
      return null;
    o = st(o);
  }
  return null;
}
function qn() {
  return jo == null && (jo = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), jo;
}
function Pt(e) {
  return /^(html|body|#document)$/.test(yt(e));
}
function Fe(e) {
  return Ae(e).getComputedStyle(e);
}
function Bo(e) {
  return Re(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function st(e) {
  if (yt(e) === "html")
    return e;
  const o = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    or(e) && e.host || // Fallback.
    Ke(e)
  );
  return or(o) ? o.host : o;
}
function Gr(e) {
  const o = st(e);
  return Pt(o) ? e.ownerDocument ? e.ownerDocument.body : e.body : Je(o) && Jt(o) ? o : Gr(o);
}
function Lt(e, o, t) {
  var n;
  o === void 0 && (o = []), t === void 0 && (t = !0);
  const r = Gr(e), s = r === ((n = e.ownerDocument) == null ? void 0 : n.body), l = Ae(r);
  if (s) {
    const i = tn(l);
    return o.concat(l, l.visualViewport || [], Jt(r) ? r : [], i && t ? Lt(i) : []);
  } else
    return o.concat(r, Lt(r, [], t));
}
function tn(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Yr(e) {
  const o = Fe(e);
  let t = parseFloat(o.width) || 0, n = parseFloat(o.height) || 0;
  const r = Je(e), s = r ? e.offsetWidth : t, l = r ? e.offsetHeight : n, i = co(t) !== s || co(n) !== l;
  return i && (t = s, n = l), {
    width: t,
    height: n,
    $: i
  };
}
function Bn(e) {
  return Re(e) ? e : e.contextElement;
}
function qt(e) {
  const o = Bn(e);
  if (!Je(o))
    return Le(1);
  const t = o.getBoundingClientRect(), {
    width: n,
    height: r,
    $: s
  } = Yr(o);
  let l = (s ? co(t.width) : t.width) / n, i = (s ? co(t.height) : t.height) / r;
  return (!l || !Number.isFinite(l)) && (l = 1), (!i || !Number.isFinite(i)) && (i = 1), {
    x: l,
    y: i
  };
}
const nu = /* @__PURE__ */ Le(0);
function Xr(e) {
  const o = Ae(e);
  return !qn() || !o.visualViewport ? nu : {
    x: o.visualViewport.offsetLeft,
    y: o.visualViewport.offsetTop
  };
}
function ru(e, o, t) {
  return o === void 0 && (o = !1), !t || o && t !== Ae(e) ? !1 : o;
}
function ft(e, o, t, n) {
  o === void 0 && (o = !1), t === void 0 && (t = !1);
  const r = e.getBoundingClientRect(), s = Bn(e);
  let l = Le(1);
  o && (n ? Re(n) && (l = qt(n)) : l = qt(e));
  const i = ru(s, t, n) ? Xr(s) : Le(0);
  let u = (r.left + i.x) / l.x, c = (r.top + i.y) / l.y, d = r.width / l.x, p = r.height / l.y;
  if (s) {
    const f = Ae(s), v = n && Re(n) ? Ae(n) : n;
    let g = f, w = tn(g);
    for (; w && n && v !== g; ) {
      const S = qt(w), O = w.getBoundingClientRect(), x = Fe(w), B = O.left + (w.clientLeft + parseFloat(x.paddingLeft)) * S.x, C = O.top + (w.clientTop + parseFloat(x.paddingTop)) * S.y;
      u *= S.x, c *= S.y, d *= S.x, p *= S.y, u += B, c += C, g = Ae(w), w = tn(g);
    }
  }
  return fo({
    width: d,
    height: p,
    x: u,
    y: c
  });
}
function Oo(e, o) {
  const t = Bo(e).scrollLeft;
  return o ? o.left + t : ft(Ke(e)).left + t;
}
function Jr(e, o) {
  const t = e.getBoundingClientRect(), n = t.left + o.scrollLeft - Oo(e, t), r = t.top + o.scrollTop;
  return {
    x: n,
    y: r
  };
}
function au(e) {
  let {
    elements: o,
    rect: t,
    offsetParent: n,
    strategy: r
  } = e;
  const s = r === "fixed", l = Ke(n), i = o ? qo(o.floating) : !1;
  if (n === l || i && s)
    return t;
  let u = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = Le(1);
  const d = Le(0), p = Je(n);
  if ((p || !p && !s) && ((yt(n) !== "body" || Jt(l)) && (u = Bo(n)), p)) {
    const v = ft(n);
    c = qt(n), d.x = v.x + n.clientLeft, d.y = v.y + n.clientTop;
  }
  const f = l && !p && !s ? Jr(l, u) : Le(0);
  return {
    width: t.width * c.x,
    height: t.height * c.y,
    x: t.x * c.x - u.scrollLeft * c.x + d.x + f.x,
    y: t.y * c.y - u.scrollTop * c.y + d.y + f.y
  };
}
function su(e) {
  return Array.from(e.getClientRects());
}
function lu(e) {
  const o = Ke(e), t = Bo(e), n = e.ownerDocument.body, r = Oe(o.scrollWidth, o.clientWidth, n.scrollWidth, n.clientWidth), s = Oe(o.scrollHeight, o.clientHeight, n.scrollHeight, n.clientHeight);
  let l = -t.scrollLeft + Oo(e);
  const i = -t.scrollTop;
  return Fe(n).direction === "rtl" && (l += Oe(o.clientWidth, n.clientWidth) - r), {
    width: r,
    height: s,
    x: l,
    y: i
  };
}
const nr = 25;
function iu(e, o) {
  const t = Ae(e), n = Ke(e), r = t.visualViewport;
  let s = n.clientWidth, l = n.clientHeight, i = 0, u = 0;
  if (r) {
    s = r.width, l = r.height;
    const d = qn();
    (!d || d && o === "fixed") && (i = r.offsetLeft, u = r.offsetTop);
  }
  const c = Oo(n);
  if (c <= 0) {
    const d = n.ownerDocument, p = d.body, f = getComputedStyle(p), v = d.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, g = Math.abs(n.clientWidth - p.clientWidth - v);
    g <= nr && (s -= g);
  } else c <= nr && (s += c);
  return {
    width: s,
    height: l,
    x: i,
    y: u
  };
}
function uu(e, o) {
  const t = ft(e, !0, o === "fixed"), n = t.top + e.clientTop, r = t.left + e.clientLeft, s = Je(e) ? qt(e) : Le(1), l = e.clientWidth * s.x, i = e.clientHeight * s.y, u = r * s.x, c = n * s.y;
  return {
    width: l,
    height: i,
    x: u,
    y: c
  };
}
function rr(e, o, t) {
  let n;
  if (o === "viewport")
    n = iu(e, t);
  else if (o === "document")
    n = lu(Ke(e));
  else if (Re(o))
    n = uu(o, t);
  else {
    const r = Xr(e);
    n = {
      x: o.x - r.x,
      y: o.y - r.y,
      width: o.width,
      height: o.height
    };
  }
  return fo(n);
}
function Zr(e, o) {
  const t = st(e);
  return t === o || !Re(t) || Pt(t) ? !1 : Fe(t).position === "fixed" || Zr(t, o);
}
function du(e, o) {
  const t = o.get(e);
  if (t)
    return t;
  let n = Lt(e, [], !1).filter((i) => Re(i) && yt(i) !== "body"), r = null;
  const s = Fe(e).position === "fixed";
  let l = s ? st(e) : e;
  for (; Re(l) && !Pt(l); ) {
    const i = Fe(l), u = xn(l);
    !u && i.position === "fixed" && (r = null), (s ? !u && !r : !u && i.position === "static" && !!r && (r.position === "absolute" || r.position === "fixed") || Jt(l) && !u && Zr(e, l)) ? n = n.filter((d) => d !== l) : r = i, l = st(l);
  }
  return o.set(e, n), n;
}
function cu(e) {
  let {
    element: o,
    boundary: t,
    rootBoundary: n,
    strategy: r
  } = e;
  const l = [...t === "clippingAncestors" ? qo(o) ? [] : du(o, this._c) : [].concat(t), n], i = rr(o, l[0], r);
  let u = i.top, c = i.right, d = i.bottom, p = i.left;
  for (let f = 1; f < l.length; f++) {
    const v = rr(o, l[f], r);
    u = Oe(v.top, u), c = at(v.right, c), d = at(v.bottom, d), p = Oe(v.left, p);
  }
  return {
    width: c - p,
    height: d - u,
    x: p,
    y: u
  };
}
function pu(e) {
  const {
    width: o,
    height: t
  } = Yr(e);
  return {
    width: o,
    height: t
  };
}
function fu(e, o, t) {
  const n = Je(o), r = Ke(o), s = t === "fixed", l = ft(e, !0, s, o);
  let i = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const u = Le(0);
  function c() {
    u.x = Oo(r);
  }
  if (n || !n && !s)
    if ((yt(o) !== "body" || Jt(r)) && (i = Bo(o)), n) {
      const v = ft(o, !0, s, o);
      u.x = v.x + o.clientLeft, u.y = v.y + o.clientTop;
    } else r && c();
  s && !n && r && c();
  const d = r && !n && !s ? Jr(r, i) : Le(0), p = l.left + i.scrollLeft - u.x - d.x, f = l.top + i.scrollTop - u.y - d.y;
  return {
    x: p,
    y: f,
    width: l.width,
    height: l.height
  };
}
function zo(e) {
  return Fe(e).position === "static";
}
function ar(e, o) {
  if (!Je(e) || Fe(e).position === "fixed")
    return null;
  if (o)
    return o(e);
  let t = e.offsetParent;
  return Ke(e) === t && (t = t.ownerDocument.body), t;
}
function Qr(e, o) {
  const t = Ae(e);
  if (qo(e))
    return t;
  if (!Je(e)) {
    let r = st(e);
    for (; r && !Pt(r); ) {
      if (Re(r) && !zo(r))
        return r;
      r = st(r);
    }
    return t;
  }
  let n = ar(e, o);
  for (; n && Qi(n) && zo(n); )
    n = ar(n, o);
  return n && Pt(n) && zo(n) && !xn(n) ? t : n || ou(e) || t;
}
const vu = async function(e) {
  const o = this.getOffsetParent || Qr, t = this.getDimensions, n = await t(e.floating);
  return {
    reference: fu(e.reference, await o(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function mu(e) {
  return Fe(e).direction === "rtl";
}
const yu = {
  convertOffsetParentRelativeRectToViewportRelativeRect: au,
  getDocumentElement: Ke,
  getClippingRect: cu,
  getOffsetParent: Qr,
  getElementRects: vu,
  getClientRects: su,
  getDimensions: pu,
  getScale: qt,
  isElement: Re,
  isRTL: mu
};
function ea(e, o) {
  return e.x === o.x && e.y === o.y && e.width === o.width && e.height === o.height;
}
function gu(e, o) {
  let t = null, n;
  const r = Ke(e);
  function s() {
    var i;
    clearTimeout(n), (i = t) == null || i.disconnect(), t = null;
  }
  function l(i, u) {
    i === void 0 && (i = !1), u === void 0 && (u = 1), s();
    const c = e.getBoundingClientRect(), {
      left: d,
      top: p,
      width: f,
      height: v
    } = c;
    if (i || o(), !f || !v)
      return;
    const g = ro(p), w = ro(r.clientWidth - (d + f)), S = ro(r.clientHeight - (p + v)), O = ro(d), B = {
      rootMargin: -g + "px " + -w + "px " + -S + "px " + -O + "px",
      threshold: Oe(0, at(1, u)) || 1
    };
    let C = !0;
    function k(M) {
      const R = M[0].intersectionRatio;
      if (R !== u) {
        if (!C)
          return l();
        R ? l(!1, R) : n = setTimeout(() => {
          l(!1, 1e-7);
        }, 1e3);
      }
      R === 1 && !ea(c, e.getBoundingClientRect()) && l(), C = !1;
    }
    try {
      t = new IntersectionObserver(k, {
        ...B,
        // Handle <iframe>s
        root: r.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(k, B);
    }
    t.observe(e);
  }
  return l(!0), s;
}
function hu(e, o, t, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: r = !0,
    ancestorResize: s = !0,
    elementResize: l = typeof ResizeObserver == "function",
    layoutShift: i = typeof IntersectionObserver == "function",
    animationFrame: u = !1
  } = n, c = Bn(e), d = r || s ? [...c ? Lt(c) : [], ...o ? Lt(o) : []] : [];
  d.forEach((O) => {
    r && O.addEventListener("scroll", t, {
      passive: !0
    }), s && O.addEventListener("resize", t);
  });
  const p = c && i ? gu(c, t) : null;
  let f = -1, v = null;
  l && (v = new ResizeObserver((O) => {
    let [x] = O;
    x && x.target === c && v && o && (v.unobserve(o), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var B;
      (B = v) == null || B.observe(o);
    })), t();
  }), c && !u && v.observe(c), o && v.observe(o));
  let g, w = u ? ft(e) : null;
  u && S();
  function S() {
    const O = ft(e);
    w && !ea(w, O) && t(), w = O, g = requestAnimationFrame(S);
  }
  return t(), () => {
    var O;
    d.forEach((x) => {
      r && x.removeEventListener("scroll", t), s && x.removeEventListener("resize", t);
    }), p?.(), (O = v) == null || O.disconnect(), v = null, u && cancelAnimationFrame(g);
  };
}
const bu = Yi, _u = Xi, sr = Wi, wu = Zi, Cu = Ui, Su = Hi, xu = Ji, qu = (e, o, t) => {
  const n = /* @__PURE__ */ new Map(), r = {
    platform: yu,
    ...t
  }, s = {
    ...r.platform,
    _c: n
  };
  return Ki(e, o, {
    ...r,
    platform: s
  });
};
function Bu(e) {
  return e != null && typeof e == "object" && "$el" in e;
}
function on(e) {
  if (Bu(e)) {
    const o = e.$el;
    return Sn(o) && yt(o) === "#comment" ? null : o;
  }
  return e;
}
function Ct(e) {
  return typeof e == "function" ? e() : a(e);
}
function Ou(e) {
  return {
    name: "arrow",
    options: e,
    fn(o) {
      const t = on(Ct(e.element));
      return t == null ? {} : Su({
        element: t,
        padding: e.padding
      }).fn(o);
    }
  };
}
function ta(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function lr(e, o) {
  const t = ta(e);
  return Math.round(o * t) / t;
}
function Au(e, o, t) {
  t === void 0 && (t = {});
  const n = t.whileElementsMounted, r = A(() => {
    var R;
    return (R = Ct(t.open)) != null ? R : !0;
  }), s = A(() => Ct(t.middleware)), l = A(() => {
    var R;
    return (R = Ct(t.placement)) != null ? R : "bottom";
  }), i = A(() => {
    var R;
    return (R = Ct(t.strategy)) != null ? R : "absolute";
  }), u = A(() => {
    var R;
    return (R = Ct(t.transform)) != null ? R : !0;
  }), c = A(() => on(e.value)), d = A(() => on(o.value)), p = P(0), f = P(0), v = P(i.value), g = P(l.value), w = Kt({}), S = P(!1), O = A(() => {
    const R = {
      position: v.value,
      left: "0",
      top: "0"
    };
    if (!d.value)
      return R;
    const N = lr(d.value, p.value), j = lr(d.value, f.value);
    return u.value ? {
      ...R,
      transform: "translate(" + N + "px, " + j + "px)",
      ...ta(d.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: v.value,
      left: N + "px",
      top: j + "px"
    };
  });
  let x;
  function B() {
    if (c.value == null || d.value == null)
      return;
    const R = r.value;
    qu(c.value, d.value, {
      middleware: s.value,
      placement: l.value,
      strategy: i.value
    }).then((N) => {
      p.value = N.x, f.value = N.y, v.value = N.strategy, g.value = N.placement, w.value = N.middlewareData, S.value = R !== !1;
    });
  }
  function C() {
    typeof x == "function" && (x(), x = void 0);
  }
  function k() {
    if (C(), n === void 0) {
      B();
      return;
    }
    if (c.value != null && d.value != null) {
      x = n(c.value, d.value, B);
      return;
    }
  }
  function M() {
    r.value || (S.value = !1);
  }
  return re([s, l, i, r], B, {
    flush: "sync"
  }), re([c, d], k, {
    flush: "sync"
  }), re(r, M, {
    flush: "sync"
  }), pr() && fr(C), {
    x: ct(p),
    y: ct(f),
    strategy: ct(v),
    placement: ct(g),
    middlewareData: ct(w),
    isPositioned: ct(S),
    floatingStyles: O,
    update: B
  };
}
const oa = {
  side: "bottom",
  sideOffset: 0,
  sideFlip: !0,
  align: "center",
  alignOffset: 0,
  alignFlip: !0,
  arrowPadding: 0,
  hideShiftedArrow: !0,
  avoidCollisions: !0,
  collisionBoundary: () => [],
  collisionPadding: 0,
  sticky: "partial",
  hideWhenDetached: !1,
  positionStrategy: "fixed",
  updatePositionStrategy: "optimized",
  prioritizePosition: !1
}, [Tm, Pu] = /* @__PURE__ */ oe("PopperContent");
var Tu = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ hr({
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    align: {
      type: null,
      required: !1
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  }, { ...oa }),
  emits: ["placed"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = Hr(), { forwardRef: s, currentElement: l } = V(), i = P(), u = P(), { width: c, height: d } = $r(u), p = A(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), f = A(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), v = A(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), g = A(() => ({
      padding: f.value,
      boundary: v.value.filter(Ei),
      altBoundary: v.value.length > 0
    })), w = A(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), S = Os(() => [
      bu({
        mainAxis: t.sideOffset + d.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && sr({
        ...g.value,
        ...w.value
      }),
      t.avoidCollisions && _u({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? xu() : void 0,
        ...g.value
      }),
      !t.prioritizePosition && t.avoidCollisions && sr({
        ...g.value,
        ...w.value
      }),
      wu({
        ...g.value,
        apply: ({ elements: D, rects: W, availableWidth: G, availableHeight: $ }) => {
          const { width: z, height: U } = W.reference, ne = D.floating.style;
          ne.setProperty("--reka-popper-available-width", `${G}px`), ne.setProperty("--reka-popper-available-height", `${$}px`), ne.setProperty("--reka-popper-anchor-width", `${z}px`), ne.setProperty("--reka-popper-anchor-height", `${U}px`);
        }
      }),
      u.value && Ou({
        element: u.value,
        padding: t.arrowPadding
      }),
      Di({
        arrowWidth: c.value,
        arrowHeight: d.value
      }),
      t.hideWhenDetached && Cu({
        strategy: "referenceHidden",
        ...g.value
      })
    ]), O = A(() => t.reference ?? r.anchor.value), { floatingStyles: x, placement: B, isPositioned: C, middlewareData: k } = Au(O, i, {
      strategy: t.positionStrategy,
      placement: p,
      whileElementsMounted: (...D) => hu(...D, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: S
    }), M = A(() => Zo(B.value)[0]), R = A(() => Zo(B.value)[1]);
    gr(() => {
      C.value && n("placed");
    });
    const N = A(() => {
      const D = k.value.arrow?.centerOffset !== 0;
      return t.hideShiftedArrow && D;
    }), j = P("");
    se(() => {
      l.value && (j.value = window.getComputedStyle(l.value).zIndex);
    });
    const q = A(() => k.value.arrow?.x ?? 0), F = A(() => k.value.arrow?.y ?? 0);
    return Pu({
      placedSide: M,
      onArrowChange: (D) => u.value = D,
      arrowX: q,
      arrowY: F,
      shouldHideArrow: N
    }), (D, W) => (m(), H("div", {
      ref_key: "floatingRef",
      ref: i,
      "data-reka-popper-content-wrapper": "",
      style: Te({
        ...a(x),
        transform: a(C) ? a(x).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: j.value,
        "--reka-popper-transform-origin": [a(k).transformOrigin?.x, a(k).transformOrigin?.y].join(" "),
        ...a(k).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [I(a(K), E({ ref: a(s) }, D.$attrs, {
      "as-child": t.asChild,
      as: D.as,
      "data-side": M.value,
      "data-align": R.value,
      style: { animation: a(C) ? void 0 : "none" }
    }), {
      default: y(() => [b(D.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), Ao = Tu;
function Eu(e) {
  const o = ho({ nonce: P() });
  return A(() => e?.value || o.nonce?.value);
}
const [na, Du] = /* @__PURE__ */ oe("AvatarRoot");
var ku = /* @__PURE__ */ h({
  __name: "AvatarRoot",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(e) {
    return V(), Du({ imageLoadingStatus: P("idle") }), (o, t) => (m(), _(a(K), {
      "as-child": o.asChild,
      as: o.as
    }, {
      default: y(() => [b(o.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), $u = ku, Iu = /* @__PURE__ */ h({
  __name: "AvatarFallback",
  props: {
    delayMs: {
      type: Number,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(e) {
    const o = e, t = na();
    V();
    const n = P(o.delayMs === void 0);
    return se((r) => {
      if (o.delayMs && Ee) {
        const s = window.setTimeout(() => {
          n.value = !0;
        }, o.delayMs);
        r(() => {
          window.clearTimeout(s);
        });
      }
    }), (r, s) => n.value && a(t).imageLoadingStatus.value !== "loaded" ? (m(), _(a(K), {
      key: 0,
      "as-child": r.asChild,
      as: r.as
    }, {
      default: y(() => [b(r.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"])) : de("v-if", !0);
  }
}), Mu = Iu;
function ir(e, o) {
  return e ? o ? (e.src !== o && (e.src = o), e.complete && e.naturalWidth > 0 ? "loaded" : "loading") : "error" : "idle";
}
function Ru(e, { referrerPolicy: o, crossOrigin: t } = {}) {
  const n = P(!1), r = P(null), s = A(() => n.value ? (!r.value && Ee && (r.value = new window.Image()), r.value) : null), l = P(ir(s.value, e.value)), i = (u) => () => {
    n.value && (l.value = u);
  };
  return pe(() => {
    n.value = !0, se((u) => {
      const c = s.value;
      if (!c) return;
      l.value = ir(c, e.value);
      const d = i("loaded"), p = i("error");
      c.addEventListener("load", d), c.addEventListener("error", p), o?.value && (c.referrerPolicy = o.value), typeof t?.value == "string" && (c.crossOrigin = t.value), u(() => {
        c.removeEventListener("load", d), c.removeEventListener("error", p);
      });
    });
  }), Xe(() => {
    n.value = !1;
  }), l;
}
var Fu = /* @__PURE__ */ h({
  __name: "AvatarImage",
  props: {
    src: {
      type: String,
      required: !0
    },
    referrerPolicy: {
      type: null,
      required: !1
    },
    crossOrigin: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "img"
    }
  },
  emits: ["loadingStatusChange"],
  setup(e, { emit: o }) {
    const t = e, n = o, { src: r, referrerPolicy: s, crossOrigin: l } = ue(t);
    V();
    const i = na(), u = Ru(r, {
      referrerPolicy: s,
      crossOrigin: l
    });
    return re(u, (c) => {
      n("loadingStatusChange", c), c !== "idle" && (i.imageLoadingStatus.value = c);
    }, { immediate: !0 }), (c, d) => sn((m(), _(a(K), {
      role: "img",
      "as-child": c.asChild,
      as: c.as,
      src: a(r),
      referrerpolicy: a(s),
      crossorigin: a(l)
    }, {
      default: y(() => [b(c.$slots, "default")]),
      _: 3
    }, 8, [
      "as-child",
      "as",
      "src",
      "referrerpolicy",
      "crossorigin"
    ])), [[Ka, a(u) === "loaded"]]);
  }
}), Vu = Fu;
const [Nu, Lu] = /* @__PURE__ */ oe("RovingFocusGroup");
var ju = /* @__PURE__ */ h({
  __name: "RovingFocusGroup",
  props: {
    orientation: {
      type: String,
      required: !1,
      default: void 0
    },
    dir: {
      type: String,
      required: !1
    },
    loop: {
      type: Boolean,
      required: !1,
      default: !1
    },
    currentTabStopId: {
      type: [String, null],
      required: !1
    },
    defaultCurrentTabStopId: {
      type: String,
      required: !1
    },
    preventScrollOnEntryFocus: {
      type: Boolean,
      required: !1,
      default: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["entryFocus", "update:currentTabStopId"],
  setup(e, { expose: o, emit: t }) {
    const n = e, r = t, { loop: s, orientation: l, dir: i } = ue(n), u = lt(i), c = /* @__PURE__ */ fe(n, "currentTabStopId", r, {
      defaultValue: n.defaultCurrentTabStopId,
      passive: n.currentTabStopId === void 0
    }), d = P(!1), p = P(!1), f = P(0), { getItems: v, CollectionSlot: g } = ke({ isProvider: !0 });
    function w(O) {
      const x = !p.value;
      if (O.currentTarget && O.target === O.currentTarget && x && !d.value) {
        const B = new CustomEvent(Ci, Si);
        if (O.currentTarget.dispatchEvent(B), r("entryFocus", B), !B.defaultPrevented) {
          const C = v().map((j) => j.ref).filter((j) => j.dataset.disabled !== ""), k = C.find((j) => j.getAttribute("data-active") === ""), M = C.find((j) => j.getAttribute("data-highlighted") === ""), R = C.find((j) => j.id === c.value), N = [
            k,
            M,
            R,
            ...C
          ].filter(Boolean);
          Kr(N, n.preventScrollOnEntryFocus);
        }
      }
      p.value = !1;
    }
    function S() {
      setTimeout(() => {
        p.value = !1;
      }, 1);
    }
    return o({ getItems: v }), Lu({
      loop: s,
      dir: u,
      orientation: l,
      currentTabStopId: c,
      onItemFocus: (O) => {
        c.value = O;
      },
      onItemShiftTab: () => {
        d.value = !0;
      },
      onFocusableItemAdd: () => {
        f.value++;
      },
      onFocusableItemRemove: () => {
        f.value--;
      }
    }), (O, x) => (m(), _(a(g), null, {
      default: y(() => [I(a(K), {
        tabindex: d.value || f.value === 0 ? -1 : 0,
        "data-orientation": a(l),
        as: O.as,
        "as-child": O.asChild,
        dir: a(u),
        style: { outline: "none" },
        onMousedown: x[0] || (x[0] = (B) => p.value = !0),
        onMouseup: S,
        onFocus: w,
        onBlur: x[1] || (x[1] = (B) => d.value = !1)
      }, {
        default: y(() => [b(O.$slots, "default")]),
        _: 3
      }, 8, [
        "tabindex",
        "data-orientation",
        "as",
        "as-child",
        "dir"
      ])]),
      _: 3
    }));
  }
}), On = ju, zu = /* @__PURE__ */ h({
  __name: "RovingFocusItem",
  props: {
    tabStopId: {
      type: String,
      required: !1
    },
    focusable: {
      type: Boolean,
      required: !1,
      default: !0
    },
    active: {
      type: Boolean,
      required: !1
    },
    allowShiftKey: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(e) {
    const o = e, t = Nu(), n = be(), r = A(() => o.tabStopId || n), s = A(() => t.currentTabStopId.value === r.value), { getItems: l, CollectionItem: i } = ke();
    pe(() => {
      o.focusable && t.onFocusableItemAdd();
    }), Xe(() => {
      o.focusable && t.onFocusableItemRemove();
    });
    function u(c) {
      if (c.key === "Tab" && c.shiftKey) {
        t.onItemShiftTab();
        return;
      }
      if (c.target !== c.currentTarget) return;
      const d = Bi(c, t.orientation.value, t.dir.value);
      if (d !== void 0) {
        if (c.metaKey || c.ctrlKey || c.altKey || !o.allowShiftKey && c.shiftKey) return;
        c.preventDefault();
        let p = [...l().map((f) => f.ref).filter((f) => f.dataset.disabled !== "")];
        if (d === "last") p.reverse();
        else if (d === "prev" || d === "next") {
          d === "prev" && p.reverse();
          const f = p.indexOf(c.currentTarget);
          p = t.loop.value ? Oi(p, f + 1) : p.slice(f + 1);
        }
        ce(() => Kr(p));
      }
    }
    return (c, d) => (m(), _(a(i), null, {
      default: y(() => [I(a(K), {
        tabindex: s.value ? 0 : -1,
        "data-orientation": a(t).orientation.value,
        "data-active": c.active ? "" : void 0,
        "data-disabled": c.focusable ? void 0 : "",
        as: c.as,
        "as-child": c.asChild,
        onMousedown: d[0] || (d[0] = (p) => {
          c.focusable ? a(t).onItemFocus(r.value) : p.preventDefault();
        }),
        onFocus: d[1] || (d[1] = (p) => a(t).onItemFocus(r.value)),
        onKeydown: u
      }, {
        default: y(() => [b(c.$slots, "default")]),
        _: 3
      }, 8, [
        "tabindex",
        "data-orientation",
        "data-active",
        "data-disabled",
        "as",
        "as-child"
      ])]),
      _: 3
    }));
  }
}), An = zu;
const [Ku] = /* @__PURE__ */ oe("CheckboxGroupRoot");
function Pn(e) {
  return e === "indeterminate";
}
function ra(e) {
  return Pn(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
const [Hu, Wu] = /* @__PURE__ */ oe("CheckboxRoot");
var Uu = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "CheckboxRoot",
  props: {
    defaultValue: {
      type: null,
      required: !1
    },
    modelValue: {
      type: null,
      required: !1,
      default: void 0
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    value: {
      type: null,
      required: !1,
      default: "on"
    },
    id: {
      type: String,
      required: !1
    },
    trueValue: {
      type: null,
      required: !1,
      default: () => !0
    },
    falseValue: {
      type: null,
      required: !1,
      default: () => !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "button"
    },
    name: {
      type: String,
      required: !1
    },
    required: {
      type: Boolean,
      required: !1
    }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, n = o, { forwardRef: r, currentElement: s } = V(), l = Ku(null), i = /* @__PURE__ */ fe(t, "modelValue", n, {
      defaultValue: t.defaultValue ?? t.falseValue,
      passive: t.modelValue === void 0
    }), u = A(() => l?.disabled.value || t.disabled), c = A(() => nt(i.value, t.trueValue)), d = A(() => rt(l?.modelValue.value) ? i.value === "indeterminate" ? "indeterminate" : c.value : Ho(l.modelValue.value, t.value));
    function p() {
      if (rt(l?.modelValue.value))
        i.value === "indeterminate" ? i.value = t.trueValue : i.value = c.value ? t.falseValue : t.trueValue;
      else {
        const g = [...l.modelValue.value || []];
        if (Ho(g, t.value)) {
          const w = g.findIndex((S) => nt(S, t.value));
          g.splice(w, 1);
        } else g.push(t.value);
        l.modelValue.value = g;
      }
    }
    const f = kt(s), v = A(() => t.id && s.value ? document.querySelector(`[for="${t.id}"]`)?.innerText : void 0);
    return Wu({
      disabled: u,
      state: d
    }), (g, w) => (m(), _(Ie(a(l)?.rovingFocus.value ? a(An) : a(K)), E(g.$attrs, {
      id: g.id,
      ref: a(r),
      role: "checkbox",
      "as-child": g.asChild,
      as: g.as,
      type: g.as === "button" ? "button" : void 0,
      "aria-checked": a(Pn)(d.value) ? "mixed" : d.value,
      "aria-required": g.required,
      "aria-label": g.$attrs["aria-label"] || v.value,
      "data-state": a(ra)(d.value),
      "data-disabled": u.value ? "" : void 0,
      disabled: u.value,
      focusable: a(l)?.rovingFocus.value ? !u.value : void 0,
      onKeydown: Tt(Ce(() => {
      }, ["prevent"]), ["enter"]),
      onClick: p
    }), {
      default: y(() => [b(g.$slots, "default", {
        modelValue: a(i),
        state: d.value
      }), a(f) && g.name && !a(l) ? (m(), _(a(Yt), {
        key: 0,
        type: "checkbox",
        checked: !!d.value,
        name: g.name,
        value: g.value,
        disabled: u.value,
        required: g.required
      }, null, 8, [
        "checked",
        "name",
        "value",
        "disabled",
        "required"
      ])) : de("v-if", !0)]),
      _: 3
    }, 16, [
      "id",
      "as-child",
      "as",
      "type",
      "aria-checked",
      "aria-required",
      "aria-label",
      "data-state",
      "data-disabled",
      "disabled",
      "focusable",
      "onKeydown"
    ]));
  }
}), Gu = Uu, Yu = /* @__PURE__ */ h({
  __name: "CheckboxIndicator",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(e) {
    const { forwardRef: o } = V(), t = Hu();
    return (n, r) => (m(), _(a(De), { present: n.forceMount || a(Pn)(a(t).state.value) || a(t).state.value === !0 }, {
      default: y(() => [I(a(K), E({
        ref: a(o),
        "data-state": a(ra)(a(t).state.value),
        "data-disabled": a(t).disabled.value ? "" : void 0,
        style: { pointerEvents: "none" },
        "as-child": n.asChild,
        as: n.as
      }, n.$attrs), {
        default: y(() => [b(n.$slots, "default")]),
        _: 3
      }, 16, [
        "data-state",
        "data-disabled",
        "as-child",
        "as"
      ])]),
      _: 3
    }, 8, ["present"]));
  }
}), Xu = Yu;
function Ju(e = [], o, t) {
  const n = [...e];
  return n[t] = o, n.sort((r, s) => r - s);
}
function aa(e, o, t) {
  const s = 100 / (t - o) * (e - o);
  return lo(s, 0, 100);
}
function Zu(e, o) {
  return o > 2 ? `Value ${e + 1} of ${o}` : o === 2 ? ["Minimum", "Maximum"][e] : void 0;
}
function Qu(e, o) {
  if (e.length === 1) return 0;
  const t = e.map((r) => Math.abs(r - o)), n = Math.min(...t);
  return t.indexOf(n);
}
function ed(e, o, t) {
  const n = e / 2, s = Tn([0, 50], [0, n]);
  return (n - s(o) * t) * t;
}
function td(e) {
  return e.slice(0, -1).map((o, t) => e[t + 1] - o);
}
function od(e, o) {
  if (o > 0) {
    const t = td(e);
    return Math.min(...t) >= o;
  }
  return !0;
}
function Tn(e, o) {
  return (t) => {
    if (e[0] === e[1] || o[0] === o[1]) return o[0];
    const n = (o[1] - o[0]) / (e[1] - e[0]);
    return o[0] + n * (t - e[0]);
  };
}
function nd(e) {
  return (String(e).split(".")[1] || "").length;
}
function rd(e, o) {
  const t = 10 ** o;
  return Math.round(e * t) / t;
}
const sa = ["PageUp", "PageDown"], la = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight"
], ia = {
  "from-left": [
    "Home",
    "PageDown",
    "ArrowDown",
    "ArrowLeft"
  ],
  "from-right": [
    "Home",
    "PageDown",
    "ArrowDown",
    "ArrowRight"
  ],
  "from-bottom": [
    "Home",
    "PageDown",
    "ArrowDown",
    "ArrowLeft"
  ],
  "from-top": [
    "Home",
    "PageUp",
    "ArrowUp",
    "ArrowLeft"
  ]
}, [ua, da] = /* @__PURE__ */ oe(["SliderVertical", "SliderHorizontal"]);
var ad = /* @__PURE__ */ h({
  __name: "SliderHorizontal",
  props: {
    dir: {
      type: String,
      required: !1
    },
    min: {
      type: Number,
      required: !0
    },
    max: {
      type: Number,
      required: !0
    },
    inverted: {
      type: Boolean,
      required: !0
    }
  },
  emits: [
    "slideEnd",
    "slideStart",
    "slideMove",
    "homeKeyDown",
    "endKeyDown",
    "stepKeyDown"
  ],
  setup(e, { emit: o }) {
    const t = e, n = o, { max: r, min: s, dir: l, inverted: i } = ue(t), { forwardRef: u, currentElement: c } = V(), d = It(), p = P(), f = P(), v = A(() => l?.value !== "rtl" && !i.value || l?.value !== "ltr" && i.value);
    function g(x, B) {
      const C = f.value || c.value.getBoundingClientRect(), k = [...d.thumbElements.value][d.valueIndexToChangeRef.value], M = d.thumbAlignment.value === "contain" ? k.clientWidth : 0;
      !p.value && !B && d.thumbAlignment.value === "contain" && (p.value = x.clientX - k.getBoundingClientRect().left);
      const R = [0, C.width - M], N = v.value ? [s.value, r.value] : [r.value, s.value], j = Tn(R, N);
      f.value = C;
      const q = B ? x.clientX - C.left - M / 2 : x.clientX - C.left - (p.value ?? 0);
      return j(q);
    }
    const w = A(() => v.value ? "left" : "right"), S = A(() => v.value ? "right" : "left"), O = A(() => v.value ? 1 : -1);
    return da({
      startEdge: w,
      endEdge: S,
      direction: O,
      size: "width"
    }), (x, B) => (m(), _(ca, {
      ref: a(u),
      dir: a(l),
      "data-orientation": "horizontal",
      style: Te({ "--reka-slider-thumb-transform": !v.value && a(d).thumbAlignment.value === "overflow" ? "translateX(50%)" : "translateX(-50%)" }),
      onSlideStart: B[0] || (B[0] = (C) => {
        const k = g(C, !0);
        n("slideStart", k);
      }),
      onSlideMove: B[1] || (B[1] = (C) => {
        const k = g(C);
        n("slideMove", k);
      }),
      onSlideEnd: B[2] || (B[2] = () => {
        f.value = void 0, p.value = void 0, n("slideEnd");
      }),
      onStepKeyDown: B[3] || (B[3] = (C) => {
        const k = v.value ? "from-left" : "from-right", M = a(ia)[k].includes(C.key);
        n("stepKeyDown", C, M ? -1 : 1);
      }),
      onEndKeyDown: B[4] || (B[4] = (C) => n("endKeyDown", C)),
      onHomeKeyDown: B[5] || (B[5] = (C) => n("homeKeyDown", C))
    }, {
      default: y(() => [b(x.$slots, "default")]),
      _: 3
    }, 8, ["dir", "style"]));
  }
}), sd = ad, ld = /* @__PURE__ */ h({
  __name: "SliderVertical",
  props: {
    min: {
      type: Number,
      required: !0
    },
    max: {
      type: Number,
      required: !0
    },
    inverted: {
      type: Boolean,
      required: !0
    }
  },
  emits: [
    "slideEnd",
    "slideStart",
    "slideMove",
    "homeKeyDown",
    "endKeyDown",
    "stepKeyDown"
  ],
  setup(e, { emit: o }) {
    const t = e, n = o, { max: r, min: s, inverted: l } = ue(t), i = It(), { forwardRef: u, currentElement: c } = V(), d = P(), p = P(), f = A(() => !l.value);
    function v(O, x) {
      const B = p.value || c.value.getBoundingClientRect(), C = [...i.thumbElements.value][i.valueIndexToChangeRef.value], k = i.thumbAlignment.value === "contain" ? C.clientHeight : 0;
      !d.value && !x && i.thumbAlignment.value === "contain" && (d.value = O.clientY - C.getBoundingClientRect().top);
      const M = [0, B.height - k], R = f.value ? [r.value, s.value] : [s.value, r.value], N = Tn(M, R), j = x ? O.clientY - B.top - k / 2 : O.clientY - B.top - (d.value ?? 0);
      return p.value = B, N(j);
    }
    const g = A(() => f.value ? "bottom" : "top"), w = A(() => f.value ? "top" : "bottom"), S = A(() => f.value ? 1 : -1);
    return da({
      startEdge: g,
      endEdge: w,
      direction: S,
      size: "height"
    }), (O, x) => (m(), _(ca, {
      ref: a(u),
      "data-orientation": "vertical",
      style: Te({ "--reka-slider-thumb-transform": !f.value && a(i).thumbAlignment.value === "overflow" ? "translateY(-50%)" : "translateY(50%)" }),
      onSlideStart: x[0] || (x[0] = (B) => {
        const C = v(B, !0);
        n("slideStart", C);
      }),
      onSlideMove: x[1] || (x[1] = (B) => {
        const C = v(B);
        n("slideMove", C);
      }),
      onSlideEnd: x[2] || (x[2] = () => {
        p.value = void 0, d.value = void 0, n("slideEnd");
      }),
      onStepKeyDown: x[3] || (x[3] = (B) => {
        const C = f.value ? "from-bottom" : "from-top", k = a(ia)[C].includes(B.key);
        n("stepKeyDown", B, k ? -1 : 1);
      }),
      onEndKeyDown: x[4] || (x[4] = (B) => n("endKeyDown", B)),
      onHomeKeyDown: x[5] || (x[5] = (B) => n("homeKeyDown", B))
    }, {
      default: y(() => [b(O.$slots, "default")]),
      _: 3
    }, 8, ["style"]));
  }
}), id = ld;
const [It, ud] = /* @__PURE__ */ oe("SliderRoot");
var dd = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "SliderRoot",
  props: {
    defaultValue: {
      type: Array,
      required: !1,
      default: () => [0]
    },
    modelValue: {
      type: [Array, null],
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    orientation: {
      type: String,
      required: !1,
      default: "horizontal"
    },
    dir: {
      type: String,
      required: !1
    },
    inverted: {
      type: Boolean,
      required: !1,
      default: !1
    },
    min: {
      type: Number,
      required: !1,
      default: 0
    },
    max: {
      type: Number,
      required: !1,
      default: 100
    },
    step: {
      type: Number,
      required: !1,
      default: 1
    },
    minStepsBetweenThumbs: {
      type: Number,
      required: !1,
      default: 0
    },
    thumbAlignment: {
      type: String,
      required: !1,
      default: "contain"
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    },
    name: {
      type: String,
      required: !1
    },
    required: {
      type: Boolean,
      required: !1
    }
  },
  emits: ["update:modelValue", "valueCommit"],
  setup(e, { emit: o }) {
    const t = e, n = o, { min: r, max: s, step: l, minStepsBetweenThumbs: i, orientation: u, disabled: c, thumbAlignment: d, dir: p } = ue(t), f = lt(p), { forwardRef: v, currentElement: g } = V(), w = kt(g), { CollectionSlot: S } = ke({ isProvider: !0 }), O = /* @__PURE__ */ fe(t, "modelValue", n, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    }), x = A(() => Array.isArray(O.value) ? [...O.value] : []), B = P(0), C = P(x.value);
    function k(q) {
      const F = Qu(x.value, q);
      N(q, F);
    }
    function M(q) {
      N(q, B.value);
    }
    function R() {
      const q = C.value[B.value];
      x.value[B.value] !== q && n("valueCommit", Ha(x.value));
    }
    function N(q, F, { commit: D } = { commit: !1 }) {
      const W = nd(l.value), G = rd(Math.round((q - r.value) / l.value) * l.value + r.value, W), $ = lo(G, r.value, s.value), z = Ju(x.value, $, F);
      if (od(z, i.value * l.value)) {
        B.value = z.indexOf($);
        const U = String(z) !== String(O.value);
        U && D && n("valueCommit", z), U && (j.value[B.value]?.focus(), O.value = z);
      }
    }
    const j = P([]);
    return ud({
      modelValue: O,
      currentModelValue: x,
      valueIndexToChangeRef: B,
      thumbElements: j,
      orientation: u,
      min: r,
      max: s,
      disabled: c,
      thumbAlignment: d
    }), (q, F) => (m(), _(a(S), null, {
      default: y(() => [(m(), _(Ie(a(u) === "horizontal" ? sd : id), E(q.$attrs, {
        ref: a(v),
        "as-child": q.asChild,
        as: q.as,
        min: a(r),
        max: a(s),
        dir: a(f),
        inverted: q.inverted,
        "aria-disabled": a(c),
        "data-disabled": a(c) ? "" : void 0,
        onPointerdown: F[0] || (F[0] = () => {
          a(c) || (C.value = x.value);
        }),
        onSlideStart: F[1] || (F[1] = (D) => !a(c) && k(D)),
        onSlideMove: F[2] || (F[2] = (D) => !a(c) && M(D)),
        onSlideEnd: F[3] || (F[3] = (D) => !a(c) && R()),
        onHomeKeyDown: F[4] || (F[4] = (D) => !a(c) && N(a(r), 0, { commit: !0 })),
        onEndKeyDown: F[5] || (F[5] = (D) => !a(c) && N(a(s), x.value.length - 1, { commit: !0 })),
        onStepKeyDown: F[6] || (F[6] = (D, W) => {
          if (!a(c)) {
            const z = a(sa).includes(D.key) || D.shiftKey && a(la).includes(D.key) ? 10 : 1, U = B.value, ne = x.value[U], ve = a(l) * z * W;
            N(ne + ve, U, { commit: !0 });
          }
        })
      }), {
        default: y(() => [b(q.$slots, "default", { modelValue: a(O) }), a(w) && q.name ? (m(), _(a(Yt), {
          key: 0,
          type: "number",
          value: a(O),
          name: q.name,
          required: q.required,
          disabled: a(c),
          step: a(l)
        }, null, 8, [
          "value",
          "name",
          "required",
          "disabled",
          "step"
        ])) : de("v-if", !0)]),
        _: 3
      }, 16, [
        "as-child",
        "as",
        "min",
        "max",
        "dir",
        "inverted",
        "aria-disabled",
        "data-disabled"
      ]))]),
      _: 3
    }));
  }
}), cd = dd, pd = /* @__PURE__ */ h({
  __name: "SliderImpl",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  emits: [
    "slideStart",
    "slideMove",
    "slideEnd",
    "homeKeyDown",
    "endKeyDown",
    "stepKeyDown"
  ],
  setup(e, { emit: o }) {
    const t = e, n = o, r = It();
    return (s, l) => (m(), _(a(K), E({ "data-slider-impl": "" }, t, {
      onKeydown: l[0] || (l[0] = (i) => {
        i.key === "Home" ? (n("homeKeyDown", i), i.preventDefault()) : i.key === "End" ? (n("endKeyDown", i), i.preventDefault()) : a(sa).concat(a(la)).includes(i.key) && (n("stepKeyDown", i), i.preventDefault());
      }),
      onPointerdown: l[1] || (l[1] = (i) => {
        const u = i.target;
        u.setPointerCapture(i.pointerId), i.preventDefault(), a(r).thumbElements.value.includes(u) ? u.focus() : n("slideStart", i);
      }),
      onPointermove: l[2] || (l[2] = (i) => {
        i.target.hasPointerCapture(i.pointerId) && n("slideMove", i);
      }),
      onPointerup: l[3] || (l[3] = (i) => {
        const u = i.target;
        u.hasPointerCapture(i.pointerId) && (u.releasePointerCapture(i.pointerId), n("slideEnd", i));
      })
    }), {
      default: y(() => [b(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), ca = pd, fd = /* @__PURE__ */ h({
  __name: "SliderRange",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(e) {
    const o = It(), t = ua();
    V();
    const n = A(() => o.currentModelValue.value.map((l) => aa(l, o.min.value, o.max.value))), r = A(() => o.currentModelValue.value.length > 1 ? Math.min(...n.value) : 0), s = A(() => 100 - Math.max(...n.value, 0));
    return (l, i) => (m(), _(a(K), {
      "data-disabled": a(o).disabled.value ? "" : void 0,
      "data-orientation": a(o).orientation.value,
      "as-child": l.asChild,
      as: l.as,
      style: Te({
        [a(t).startEdge.value]: `${r.value}%`,
        [a(t).endEdge.value]: `${s.value}%`
      })
    }, {
      default: y(() => [b(l.$slots, "default")]),
      _: 3
    }, 8, [
      "data-disabled",
      "data-orientation",
      "as-child",
      "as",
      "style"
    ]));
  }
}), vd = fd, md = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "SliderThumbImpl",
  props: {
    index: {
      type: Number,
      required: !0
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e, t = It(), n = ua(), { forwardRef: r, currentElement: s } = V(), { CollectionItem: l } = ke(), i = A(() => t.modelValue?.value?.[o.index]), u = A(() => i.value === void 0 ? 0 : aa(i.value, t.min.value ?? 0, t.max.value ?? 100)), c = A(() => Zu(o.index, t.modelValue?.value?.length ?? 0)), d = $r(s), p = A(() => d[n.size].value), f = A(() => t.thumbAlignment.value === "overflow" || !p.value ? 0 : ed(p.value, u.value, n.direction.value)), v = /* @__PURE__ */ un();
    return pe(() => {
      t.thumbElements.value.push(s.value);
    }), Xe(() => {
      const g = t.thumbElements.value.findIndex((w) => w === s.value) ?? -1;
      t.thumbElements.value.splice(g, 1);
    }), (g, w) => (m(), _(a(l), null, {
      default: y(() => [I(a(K), E(g.$attrs, {
        ref: a(r),
        role: "slider",
        tabindex: a(t).disabled.value ? void 0 : 0,
        "aria-label": g.$attrs["aria-label"] || c.value,
        "data-disabled": a(t).disabled.value ? "" : void 0,
        "data-orientation": a(t).orientation.value,
        "aria-valuenow": i.value,
        "aria-valuemin": a(t).min.value,
        "aria-valuemax": a(t).max.value,
        "aria-orientation": a(t).orientation.value,
        "as-child": g.asChild,
        as: g.as,
        style: {
          transform: "var(--reka-slider-thumb-transform)",
          position: "absolute",
          [a(n).startEdge.value]: `calc(${u.value}% + ${f.value}px)`,
          display: !a(v) && i.value === void 0 ? "none" : void 0
        },
        onFocus: w[0] || (w[0] = () => {
          a(t).valueIndexToChangeRef.value = g.index;
        })
      }), {
        default: y(() => [b(g.$slots, "default")]),
        _: 3
      }, 16, [
        "tabindex",
        "aria-label",
        "data-disabled",
        "data-orientation",
        "aria-valuenow",
        "aria-valuemin",
        "aria-valuemax",
        "aria-orientation",
        "as-child",
        "as",
        "style"
      ])]),
      _: 3
    }));
  }
}), yd = md, gd = /* @__PURE__ */ h({
  __name: "SliderThumb",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(e) {
    const o = e, { getItems: t } = ke(), { forwardRef: n, currentElement: r } = V(), s = A(() => r.value ? t(!0).findIndex((l) => l.ref === r.value) : -1);
    return (l, i) => (m(), _(yd, E({ ref: a(n) }, o, { index: s.value }), {
      default: y(() => [b(l.$slots, "default")]),
      _: 3
    }, 16, ["index"]));
  }
}), hd = gd, bd = /* @__PURE__ */ h({
  __name: "SliderTrack",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(e) {
    const o = It();
    return V(), (t, n) => (m(), _(a(K), {
      "as-child": t.asChild,
      as: t.as,
      "data-disabled": a(o).disabled.value ? "" : void 0,
      "data-orientation": a(o).orientation.value
    }, {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 8, [
      "as-child",
      "as",
      "data-disabled",
      "data-orientation"
    ]));
  }
}), _d = bd, wd = /* @__PURE__ */ h({
  __name: "MenuAnchor",
  props: {
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(So), X(Q(o)), {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), pa = wd;
function Cd() {
  const e = P(!1);
  return pe(() => {
    Ue("keydown", () => {
      e.value = !0;
    }, {
      capture: !0,
      passive: !0
    }), Ue(["pointerdown", "pointermove"], () => {
      e.value = !1;
    }, {
      capture: !0,
      passive: !0
    });
  }), e;
}
const Sd = /* @__PURE__ */ Or(Cd), [gt, fa] = /* @__PURE__ */ oe(["MenuRoot", "MenuSub"], "MenuContext"), [Zt, xd] = /* @__PURE__ */ oe("MenuRoot");
var qd = /* @__PURE__ */ h({
  __name: "MenuRoot",
  props: {
    open: {
      type: Boolean,
      required: !1,
      default: !1
    },
    dir: {
      type: String,
      required: !1
    },
    modal: {
      type: Boolean,
      required: !1,
      default: !0
    }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const t = e, n = o, { modal: r, dir: s } = ue(t), l = lt(s), i = /* @__PURE__ */ fe(t, "open", n), u = P(), c = Sd();
    return fa({
      open: i,
      onOpenChange: (d) => {
        i.value = d;
      },
      content: u,
      onContentChange: (d) => {
        u.value = d;
      }
    }), xd({
      onClose: () => {
        i.value = !1;
      },
      isUsingKeyboardRef: c,
      dir: l,
      modal: r
    }), (d, p) => (m(), _(a(Xt), null, {
      default: y(() => [b(d.$slots, "default")]),
      _: 3
    }));
  }
}), Bd = qd;
const [Po, Od] = /* @__PURE__ */ oe("MenuContent");
var Ad = /* @__PURE__ */ h({
  __name: "MenuContentImpl",
  props: /* @__PURE__ */ hr({
    loop: {
      type: Boolean,
      required: !1
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1
    },
    disableOutsideScroll: {
      type: Boolean,
      required: !1
    },
    trapFocus: {
      type: Boolean,
      required: !1
    },
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    align: {
      type: null,
      required: !1
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  }, { ...oa }),
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "entryFocus",
    "openAutoFocus",
    "closeAutoFocus",
    "dismiss"
  ],
  setup(e, { emit: o }) {
    const t = e, n = o, r = gt(), s = Zt(), { trapFocus: l, disableOutsidePointerEvents: i, loop: u } = ue(t);
    cn(), bo(i.value);
    const c = P(""), d = P(0), p = P(0), f = P(null), v = P("right"), g = P(0), w = P(null), S = P(), { forwardRef: O, currentElement: x } = V(), { handleTypeaheadSearch: B } = pn(), C = P();
    function k($) {
      const z = Wo($, C.value || he(), x.value, {
        loop: u.value,
        arrowKeyOptions: "vertical",
        dir: s?.dir.value,
        focus: !1,
        attributeName: "[data-reka-collection-item]:not([data-disabled])"
      });
      z && (C.value = z, z.scrollIntoView({ block: "nearest" }));
    }
    function M() {
      C.value && C.value.click();
    }
    const R = P(), N = P();
    re(C, ($) => {
      N.value && ($ === void 0 || $ !== N.value.trigger.value) && (N.value.onOpenChange(!1), N.value = void 0);
    }), re(x, ($) => {
      r.onContentChange($);
    }), Xe(() => {
      window.clearTimeout(d.value);
    });
    function j($) {
      return v.value === f.value?.side && ti($, f.value?.area);
    }
    async function q($) {
      n("openAutoFocus", $), !$.defaultPrevented && ($.preventDefault(), x.value?.focus({ preventScroll: !0 }));
    }
    function F($) {
      if ($.defaultPrevented) return;
      const z = $.target, U = z.closest("[data-reka-menu-content]") === $.currentTarget, ne = ["input", "textarea"].includes(z.tagName.toLowerCase()), ve = $.ctrlKey || $.altKey || $.metaKey, Se = $.key.length === 1, me = Wo($, he(), x.value, {
        loop: u.value,
        arrowKeyOptions: "vertical",
        dir: s?.dir.value,
        focus: !0,
        attributeName: "[data-reka-collection-item]:not([data-disabled])"
      });
      if (me) return me?.focus();
      if ($.code === "Space") return;
      const He = S.value?.getItems() ?? [];
      if (U && ($.key === "Tab" && $.preventDefault(), !ve && Se && !ne && B($.key, He)), $.target !== x.value || !Jl.includes($.key)) return;
      $.preventDefault();
      const bt = [...He.map((Ze) => Ze.ref)];
      Vr.includes($.key) && bt.reverse(), Jo(bt);
    }
    function D($) {
      $?.currentTarget?.contains?.($.target) || (window.clearTimeout(d.value), c.value = "");
    }
    function W($) {
      if (!At($)) return;
      const z = $.target, U = g.value !== $.clientX;
      if ($?.currentTarget?.contains(z) && U) {
        const ne = $.clientX > g.value ? "right" : "left";
        v.value = ne, g.value = $.clientX;
      }
    }
    function G($) {
      At($) && R.value && R.value.focus();
    }
    return Od({
      onItemEnter: ($) => !!j($),
      onItemLeave: ($) => j($) ? !0 : (["INPUT", "TEXTAREA"].includes(he()?.tagName || "") || x.value?.focus(), w.value = null, !1),
      onTriggerLeave: ($) => !!j($),
      searchRef: c,
      highlightedElement: C,
      onKeydownNavigation: k,
      onKeydownEnter: M,
      filterElement: R,
      onFilterElementChange: ($) => {
        R.value = $;
      },
      activeSubmenuContext: N,
      pointerGraceTimerRef: p,
      onPointerGraceIntentChange: ($) => {
        f.value = $;
      }
    }), ($, z) => (m(), _(a(Co), {
      "as-child": "",
      trapped: a(l),
      onMountAutoFocus: q,
      onUnmountAutoFocus: z[7] || (z[7] = (U) => n("closeAutoFocus", U))
    }, {
      default: y(() => [I(a(Ut), {
        "as-child": "",
        "disable-outside-pointer-events": a(i),
        onEscapeKeyDown: z[2] || (z[2] = (U) => n("escapeKeyDown", U)),
        onPointerDownOutside: z[3] || (z[3] = (U) => n("pointerDownOutside", U)),
        onFocusOutside: z[4] || (z[4] = (U) => n("focusOutside", U)),
        onInteractOutside: z[5] || (z[5] = (U) => n("interactOutside", U)),
        onDismiss: z[6] || (z[6] = (U) => n("dismiss"))
      }, {
        default: y(() => [I(a(On), {
          ref_key: "rovingFocusGroupRef",
          ref: S,
          "current-tab-stop-id": w.value,
          "onUpdate:currentTabStopId": z[0] || (z[0] = (U) => w.value = U),
          "as-child": "",
          orientation: "vertical",
          dir: a(s).dir.value,
          loop: a(u),
          onEntryFocus: z[1] || (z[1] = (U) => {
            n("entryFocus", U), a(s).isUsingKeyboardRef.value || U.preventDefault();
          })
        }, {
          default: y(() => [I(a(Ao), {
            ref: a(O),
            role: "menu",
            as: $.as,
            "as-child": $.asChild,
            "aria-orientation": "vertical",
            "data-reka-menu-content": "",
            "data-state": a(vn)(a(r).open.value),
            dir: a(s).dir.value,
            side: $.side,
            "side-offset": $.sideOffset,
            align: $.align,
            "align-offset": $.alignOffset,
            "avoid-collisions": $.avoidCollisions,
            "collision-boundary": $.collisionBoundary,
            "collision-padding": $.collisionPadding,
            "arrow-padding": $.arrowPadding,
            "prioritize-position": $.prioritizePosition,
            "position-strategy": $.positionStrategy,
            "update-position-strategy": $.updatePositionStrategy,
            sticky: $.sticky,
            "hide-when-detached": $.hideWhenDetached,
            reference: $.reference,
            onKeydown: F,
            onBlur: D,
            onPointermove: W,
            onPointerenter: G
          }, {
            default: y(() => [b($.$slots, "default")]),
            _: 3
          }, 8, [
            "as",
            "as-child",
            "data-state",
            "dir",
            "side",
            "side-offset",
            "align",
            "align-offset",
            "avoid-collisions",
            "collision-boundary",
            "collision-padding",
            "arrow-padding",
            "prioritize-position",
            "position-strategy",
            "update-position-strategy",
            "sticky",
            "hide-when-detached",
            "reference"
          ])]),
          _: 3
        }, 8, [
          "current-tab-stop-id",
          "dir",
          "loop"
        ])]),
        _: 3
      }, 8, ["disable-outside-pointer-events"])]),
      _: 3
    }, 8, ["trapped"]));
  }
}), En = Ad, Pd = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "MenuItemImpl",
  props: {
    disabled: {
      type: Boolean,
      required: !1
    },
    textValue: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e, t = Po(), { forwardRef: n, currentElement: r } = V(), { CollectionItem: s } = ke(), l = P(!1), i = A(() => l.value || r.value != null && t.highlightedElement.value === r.value);
    async function u(d) {
      if (!(d.defaultPrevented || !At(d))) {
        if (o.disabled) t.onItemLeave(d);
        else if (!t.onItemEnter(d)) {
          const f = d.currentTarget;
          t.highlightedElement.value = f, ["INPUT", "TEXTAREA"].includes(he()?.tagName || "") || f.focus({ preventScroll: !0 });
        }
      }
    }
    async function c(d) {
      if (await ce(), d.defaultPrevented || !At(d) || t.highlightedElement.value !== r.value) return;
      !t.onItemLeave(d) && t.highlightedElement.value === r.value && (t.highlightedElement.value = void 0);
    }
    return (d, p) => (m(), _(a(s), { value: { textValue: d.textValue } }, {
      default: y(() => [I(a(K), E({
        ref: a(n),
        role: "menuitem",
        tabindex: "-1"
      }, d.$attrs, {
        as: d.as,
        "as-child": d.asChild,
        "aria-disabled": d.disabled || void 0,
        "data-disabled": d.disabled ? "" : void 0,
        "data-highlighted": i.value ? "" : void 0,
        onPointermove: u,
        onPointerleave: c,
        onFocus: p[0] || (p[0] = async (f) => {
          await ce(), !(f.defaultPrevented || d.disabled) && (l.value = !0, a(t).highlightedElement.value = f.currentTarget);
        }),
        onBlur: p[1] || (p[1] = async (f) => {
          await ce(), !f.defaultPrevented && (l.value = !1);
        })
      }), {
        default: y(() => [b(d.$slots, "default")]),
        _: 3
      }, 16, [
        "as",
        "as-child",
        "aria-disabled",
        "data-disabled",
        "data-highlighted"
      ])]),
      _: 3
    }, 8, ["value"]));
  }
}), va = Pd, Td = /* @__PURE__ */ h({
  __name: "MenuItem",
  props: {
    disabled: {
      type: Boolean,
      required: !1
    },
    textValue: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const t = e, n = o, { forwardRef: r, currentElement: s } = V(), l = Zt(), i = Po(), u = P(!1);
    async function c() {
      const d = s.value;
      if (!t.disabled && d) {
        const p = new CustomEvent(Yl, {
          bubbles: !0,
          cancelable: !0
        });
        n("select", p), await ce(), p.defaultPrevented ? u.value = !1 : l.onClose();
      }
    }
    return (d, p) => (m(), _(va, E(t, {
      ref: a(r),
      onClick: c,
      onPointerdown: p[0] || (p[0] = () => {
        u.value = !0;
      }),
      onPointerup: p[1] || (p[1] = async (f) => {
        await ce(), !f.defaultPrevented && (u.value || f.currentTarget?.click());
      }),
      onKeydown: p[2] || (p[2] = async (f) => {
        const v = a(i).searchRef.value !== "";
        d.disabled || v && f.key === " " || a(Xo).includes(f.key) && (f.currentTarget?.click(), f.preventDefault());
      })
    }), {
      default: y(() => [b(d.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Dn = Td;
const [Ed, ma] = /* @__PURE__ */ oe(["MenuCheckboxItem", "MenuRadioItem"], "MenuItemIndicatorContext");
var Dd = /* @__PURE__ */ h({
  __name: "MenuItemIndicator",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(e) {
    const o = Ed({ modelValue: P(!1) });
    return (t, n) => (m(), _(a(De), { present: t.forceMount || a(uo)(a(o).modelValue.value) || a(o).modelValue.value === !0 }, {
      default: y(() => [I(a(K), {
        as: t.as,
        "as-child": t.asChild,
        "data-state": a(mn)(a(o).modelValue.value)
      }, {
        default: y(() => [b(t.$slots, "default")]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "data-state"
      ])]),
      _: 3
    }, 8, ["present"]));
  }
}), kd = Dd, $d = /* @__PURE__ */ h({
  __name: "MenuCheckboxItem",
  props: {
    modelValue: {
      type: [Boolean, String],
      required: !1,
      default: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    textValue: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["select", "update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = J(t, ["modelValue"]), s = ge(r), l = /* @__PURE__ */ fe(t, "modelValue", n);
    return ma({ modelValue: l }), (i, u) => (m(), _(Dn, E({ role: "menuitemcheckbox" }, a(s), {
      "aria-checked": a(uo)(a(l)) ? "mixed" : a(l),
      "data-state": a(mn)(a(l)),
      onSelect: u[0] || (u[0] = async (c) => {
        n("select", c), a(uo)(a(l)) ? l.value = !0 : l.value = !a(l);
      })
    }), {
      default: y(() => [b(i.$slots, "default", { modelValue: a(l) })]),
      _: 3
    }, 16, ["aria-checked", "data-state"]));
  }
}), Id = $d, Md = /* @__PURE__ */ h({
  __name: "MenuRootContentModal",
  props: {
    loop: {
      type: Boolean,
      required: !1
    },
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    align: {
      type: null,
      required: !1
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "entryFocus",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(e, { emit: o }) {
    const t = e, n = o, r = te(t, n), s = gt(), { forwardRef: l, currentElement: i } = V();
    return _o(i), (u, c) => (m(), _(En, E(a(r), {
      ref: a(l),
      "trap-focus": a(s).open.value,
      "disable-outside-pointer-events": a(s).open.value,
      "disable-outside-scroll": !0,
      onDismiss: c[0] || (c[0] = (d) => a(s).onOpenChange(!1)),
      onFocusOutside: c[1] || (c[1] = Ce((d) => n("focusOutside", d), ["prevent"]))
    }), {
      default: y(() => [b(u.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus", "disable-outside-pointer-events"]));
  }
}), Rd = Md, Fd = /* @__PURE__ */ h({
  __name: "MenuRootContentNonModal",
  props: {
    loop: {
      type: Boolean,
      required: !1
    },
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    align: {
      type: null,
      required: !1
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "entryFocus",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(e, { emit: o }) {
    const r = te(e, o), s = gt();
    return (l, i) => (m(), _(En, E(a(r), {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      "disable-outside-scroll": !1,
      onDismiss: i[0] || (i[0] = (u) => a(s).onOpenChange(!1))
    }), {
      default: y(() => [b(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Vd = Fd, Nd = /* @__PURE__ */ h({
  __name: "MenuContent",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    loop: {
      type: Boolean,
      required: !1
    },
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    align: {
      type: null,
      required: !1
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "entryFocus",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(e, { emit: o }) {
    const r = te(e, o), s = gt(), l = Zt();
    return (i, u) => (m(), _(a(De), { present: i.forceMount || a(s).open.value }, {
      default: y(() => [a(l).modal.value ? (m(), _(Rd, X(E({ key: 0 }, {
        ...i.$attrs,
        ...a(r)
      })), {
        default: y(() => [b(i.$slots, "default")]),
        _: 3
      }, 16)) : (m(), _(Vd, X(E({ key: 1 }, {
        ...i.$attrs,
        ...a(r)
      })), {
        default: y(() => [b(i.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Ld = Nd;
const [jd, zd] = /* @__PURE__ */ oe("MenuGroup");
var Kd = /* @__PURE__ */ h({
  __name: "MenuGroup",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e, t = be(void 0, "reka-menu-group");
    return zd({ id: t }), (n, r) => (m(), _(a(K), E({ role: "group" }, o, { "aria-labelledby": a(t) }), {
      default: y(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["aria-labelledby"]));
  }
}), ya = Kd, Hd = /* @__PURE__ */ h({
  __name: "MenuLabel",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "div"
    }
  },
  setup(e) {
    const o = e, t = jd({ id: "" });
    return (n, r) => (m(), _(a(K), E(o, { id: a(t).id || void 0 }), {
      default: y(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Wd = Hd, Ud = /* @__PURE__ */ h({
  __name: "MenuPortal",
  props: {
    to: {
      type: null,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    defer: {
      type: Boolean,
      required: !1
    },
    forceMount: {
      type: Boolean,
      required: !1
    }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(Gt), X(Q(o)), {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Gd = Ud;
const [Yd, Xd] = /* @__PURE__ */ oe("MenuRadioGroup");
var Jd = /* @__PURE__ */ h({
  __name: "MenuRadioGroup",
  props: {
    modelValue: {
      type: null,
      required: !1,
      default: ""
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = J(t, ["modelValue"]), s = ge(r), l = /* @__PURE__ */ fe(t, "modelValue", n);
    return Xd({
      modelValue: l,
      onValueChange: (i) => {
        l.value = i;
      }
    }), (i, u) => (m(), _(ya, X(Q(a(s))), {
      default: y(() => [b(i.$slots, "default", { modelValue: a(l) })]),
      _: 3
    }, 16));
  }
}), Zd = Jd, Qd = /* @__PURE__ */ h({
  __name: "MenuRadioItem",
  props: {
    value: {
      type: null,
      required: !0
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    textValue: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = J(t, ["value"]), s = ge(r), { value: l } = ue(t), i = Yd(), u = A(() => i.modelValue.value === l?.value);
    return ma({ modelValue: u }), (c, d) => (m(), _(Dn, E({ role: "menuitemradio" }, a(s), {
      "aria-checked": u.value,
      "data-state": a(mn)(u.value),
      onSelect: d[0] || (d[0] = async (p) => {
        n("select", p), a(i).onValueChange(a(l));
      })
    }), {
      default: y(() => [b(c.$slots, "default")]),
      _: 3
    }, 16, ["aria-checked", "data-state"]));
  }
}), ec = Qd, tc = /* @__PURE__ */ h({
  __name: "MenuSeparator",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(K), E(o, {
      role: "separator",
      "aria-orientation": "horizontal"
    }), {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), oc = tc;
const [ga, nc] = /* @__PURE__ */ oe("MenuSub");
var rc = /* @__PURE__ */ h({
  __name: "MenuSub",
  props: { open: {
    type: Boolean,
    required: !1,
    default: void 0
  } },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const t = e, r = /* @__PURE__ */ fe(t, "open", o, {
      defaultValue: !1,
      passive: t.open === void 0
    }), s = gt(), l = P(), i = P();
    return se((u) => {
      s?.open.value === !1 && (r.value = !1), u(() => r.value = !1);
    }), fa({
      open: r,
      onOpenChange: (u) => {
        r.value = u;
      },
      content: i,
      onContentChange: (u) => {
        i.value = u;
      }
    }), nc({
      triggerId: "",
      contentId: "",
      trigger: l,
      onTriggerChange: (u) => {
        l.value = u;
      }
    }), (u, c) => (m(), _(a(Xt), null, {
      default: y(() => [b(u.$slots, "default")]),
      _: 3
    }));
  }
}), ac = rc, sc = /* @__PURE__ */ h({
  __name: "MenuSubContent",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    loop: {
      type: Boolean,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1,
      default: !0
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "entryFocus",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(e, { emit: o }) {
    const r = te(e, o), s = gt(), l = Zt(), i = ga(), u = Po(), { forwardRef: c, currentElement: d } = V();
    return i.contentId ||= be(void 0, "reka-menu-sub-content"), (p, f) => (m(), _(a(De), { present: p.forceMount || a(s).open.value }, {
      default: y(() => [I(En, E(a(r), {
        id: a(i).contentId,
        ref: a(c),
        "aria-labelledby": a(i).triggerId,
        align: "start",
        side: a(l).dir.value === "rtl" ? "left" : "right",
        "disable-outside-pointer-events": !1,
        "disable-outside-scroll": !1,
        "trap-focus": !1,
        onOpenAutoFocus: f[0] || (f[0] = Ce((v) => {
          a(l).isUsingKeyboardRef.value && a(d)?.focus();
        }, ["prevent"])),
        onCloseAutoFocus: f[1] || (f[1] = Ce(() => {
        }, ["prevent"])),
        onFocusOutside: f[2] || (f[2] = (v) => {
          if (v.defaultPrevented) return;
          const g = a(u).filterElement.value?.contains(v.target);
          v.target !== a(i).trigger.value && !g && a(s).onOpenChange(!1);
        }),
        onEscapeKeyDown: f[3] || (f[3] = (v) => {
          a(l).onClose(), v.preventDefault();
        }),
        onKeydown: f[4] || (f[4] = (v) => {
          const g = v.currentTarget?.contains(v.target), w = a(Ql)[a(l).dir.value].includes(v.key);
          g && w && (a(s).onOpenChange(!1), a(u).filterElement.value ? (a(u).filterElement.value.focus(), a(u).highlightedElement.value = a(i).trigger.value, a(i).trigger.value?.scrollIntoView({ block: "nearest" })) : a(i).trigger.value?.focus(), v.preventDefault());
        })
      }), {
        default: y(() => [b(p.$slots, "default")]),
        _: 3
      }, 16, [
        "id",
        "aria-labelledby",
        "side"
      ])]),
      _: 3
    }, 8, ["present"]));
  }
}), lc = sc, ic = /* @__PURE__ */ h({
  __name: "MenuSubTrigger",
  props: {
    disabled: {
      type: Boolean,
      required: !1
    },
    textValue: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e, t = gt(), n = Zt(), r = ga(), s = Po();
    re(t.open, (p) => {
      p ? s.activeSubmenuContext.value = {
        onOpenChange: t.onOpenChange,
        trigger: r.trigger
      } : s.activeSubmenuContext.value?.trigger.value === r.trigger.value && (s.activeSubmenuContext.value = void 0);
    });
    const l = P(null);
    r.triggerId ||= be(void 0, "reka-menu-sub-trigger");
    function i() {
      l.value && window.clearTimeout(l.value), l.value = null;
    }
    Xe(() => {
      i();
    });
    function u(p) {
      !At(p) || s.onItemEnter(p) || !o.disabled && !t.open.value && !l.value && (s.onPointerGraceIntentChange(null), l.value = window.setTimeout(() => {
        t.onOpenChange(!0), i();
      }, 100));
    }
    async function c(p) {
      if (!At(p)) return;
      i();
      const f = t.content.value?.getBoundingClientRect();
      if (f?.width) {
        const v = t.content.value?.dataset.side, g = v === "right", w = g ? -5 : 5, S = f[g ? "left" : "right"], O = f[g ? "right" : "left"];
        s.onPointerGraceIntentChange({
          area: [
            {
              x: p.clientX + w,
              y: p.clientY
            },
            {
              x: S,
              y: f.top
            },
            {
              x: O,
              y: f.top
            },
            {
              x: O,
              y: f.bottom
            },
            {
              x: S,
              y: f.bottom
            }
          ],
          side: v
        }), window.clearTimeout(s.pointerGraceTimerRef.value), s.pointerGraceTimerRef.value = window.setTimeout(() => s.onPointerGraceIntentChange(null), 300);
      } else {
        if (s.onTriggerLeave(p)) return;
        s.onPointerGraceIntentChange(null);
      }
    }
    async function d(p) {
      const f = s.searchRef.value !== "";
      o.disabled || f && p.key === " " || Zl[n.dir.value].includes(p.key) && (t.onOpenChange(!0), await ce(), t.content.value?.focus(), p.preventDefault());
    }
    return (p, f) => (m(), _(pa, { "as-child": "" }, {
      default: y(() => [I(va, E(o, {
        id: a(r).triggerId,
        ref: (v) => {
          v && a(r)?.onTriggerChange(v?.$el);
        },
        "aria-haspopup": "menu",
        "aria-expanded": a(t).open.value,
        "aria-controls": a(r).contentId,
        "data-state": a(vn)(a(t).open.value),
        onClick: f[0] || (f[0] = async (v) => {
          o.disabled || v.defaultPrevented || (v.currentTarget?.focus(), a(t).open.value || a(t).onOpenChange(!0));
        }),
        onPointermove: u,
        onPointerleave: c,
        onKeydown: d
      }), {
        default: y(() => [b(p.$slots, "default")]),
        _: 3
      }, 16, [
        "id",
        "aria-expanded",
        "aria-controls",
        "data-state"
      ])]),
      _: 3
    }));
  }
}), uc = ic;
const [Qt, dc] = /* @__PURE__ */ oe("PopoverRoot");
var cc = /* @__PURE__ */ h({
  __name: "PopoverRoot",
  props: {
    defaultOpen: {
      type: Boolean,
      required: !1,
      default: !1
    },
    open: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    modal: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const t = e, n = o, { modal: r } = ue(t), s = /* @__PURE__ */ fe(t, "open", n, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), l = P(), i = P(!1);
    return dc({
      contentId: "",
      triggerId: "",
      modal: r,
      open: s,
      onOpenChange: (u) => {
        s.value = u;
      },
      onOpenToggle: () => {
        s.value = !s.value;
      },
      triggerElement: l,
      hasCustomAnchor: i
    }), (u, c) => (m(), _(a(Xt), null, {
      default: y(() => [b(u.$slots, "default", {
        open: a(s),
        close: () => s.value = !1
      })]),
      _: 3
    }));
  }
}), pc = cc, fc = /* @__PURE__ */ h({
  __name: "PopoverContentImpl",
  props: {
    trapFocus: {
      type: Boolean,
      required: !1
    },
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    align: {
      type: null,
      required: !1
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(e, { emit: o }) {
    const t = e, n = o, r = ge(J(t, "trapFocus", "disableOutsidePointerEvents")), { forwardRef: s } = V(), l = Qt();
    return cn(), (i, u) => (m(), _(a(Co), {
      "as-child": "",
      loop: "",
      trapped: i.trapFocus,
      onMountAutoFocus: u[5] || (u[5] = (c) => n("openAutoFocus", c)),
      onUnmountAutoFocus: u[6] || (u[6] = (c) => n("closeAutoFocus", c))
    }, {
      default: y(() => [I(a(Ut), {
        "as-child": "",
        "disable-outside-pointer-events": i.disableOutsidePointerEvents,
        onPointerDownOutside: u[0] || (u[0] = (c) => n("pointerDownOutside", c)),
        onInteractOutside: u[1] || (u[1] = (c) => n("interactOutside", c)),
        onEscapeKeyDown: u[2] || (u[2] = (c) => n("escapeKeyDown", c)),
        onFocusOutside: u[3] || (u[3] = (c) => n("focusOutside", c)),
        onDismiss: u[4] || (u[4] = (c) => a(l).onOpenChange(!1))
      }, {
        default: y(() => [I(a(Ao), E(a(r), {
          id: a(l).contentId,
          ref: a(s),
          "data-state": a(l).open.value ? "open" : "closed",
          "aria-labelledby": a(l).triggerId,
          style: {
            "--reka-popover-content-transform-origin": "var(--reka-popper-transform-origin)",
            "--reka-popover-content-available-width": "var(--reka-popper-available-width)",
            "--reka-popover-content-available-height": "var(--reka-popper-available-height)",
            "--reka-popover-trigger-width": "var(--reka-popper-anchor-width)",
            "--reka-popover-trigger-height": "var(--reka-popper-anchor-height)"
          },
          role: "dialog"
        }), {
          default: y(() => [b(i.$slots, "default")]),
          _: 3
        }, 16, [
          "id",
          "data-state",
          "aria-labelledby"
        ])]),
        _: 3
      }, 8, ["disable-outside-pointer-events"])]),
      _: 3
    }, 8, ["trapped"]));
  }
}), ha = fc, vc = /* @__PURE__ */ h({
  __name: "PopoverContentModal",
  props: {
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    align: {
      type: null,
      required: !1
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(e, { emit: o }) {
    const t = e, n = o, r = Qt(), s = P(!1);
    bo(!0);
    const l = te(t, n), { forwardRef: i, currentElement: u } = V();
    return _o(u), (c, d) => (m(), _(ha, E(a(l), {
      ref: a(i),
      "trap-focus": a(r).open.value,
      "disable-outside-pointer-events": "",
      onCloseAutoFocus: d[0] || (d[0] = Ce((p) => {
        n("closeAutoFocus", p), s.value || a(r).triggerElement.value?.focus();
      }, ["prevent"])),
      onPointerDownOutside: d[1] || (d[1] = (p) => {
        n("pointerDownOutside", p);
        const f = p.detail.originalEvent, v = f.button === 0 && f.ctrlKey === !0, g = f.button === 2 || v;
        s.value = g;
      }),
      onFocusOutside: d[2] || (d[2] = Ce(() => {
      }, ["prevent"]))
    }), {
      default: y(() => [b(c.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), mc = vc, yc = /* @__PURE__ */ h({
  __name: "PopoverContentNonModal",
  props: {
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    align: {
      type: null,
      required: !1
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(e, { emit: o }) {
    const t = e, n = o, r = Qt(), s = P(!1), l = P(!1), i = te(t, n);
    return (u, c) => (m(), _(ha, E(a(i), {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: c[0] || (c[0] = (d) => {
        n("closeAutoFocus", d), d.defaultPrevented || (s.value || a(r).triggerElement.value?.focus(), d.preventDefault()), s.value = !1, l.value = !1;
      }),
      onInteractOutside: c[1] || (c[1] = async (d) => {
        n("interactOutside", d), d.defaultPrevented || (s.value = !0, d.detail.originalEvent.type === "pointerdown" && (l.value = !0));
        const p = d.target;
        a(r).triggerElement.value?.contains(p) && d.preventDefault(), d.detail.originalEvent.type === "focusin" && l.value && d.preventDefault();
      })
    }), {
      default: y(() => [b(u.$slots, "default")]),
      _: 3
    }, 16));
  }
}), gc = yc, hc = /* @__PURE__ */ h({
  __name: "PopoverContent",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    align: {
      type: null,
      required: !1
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(e, { emit: o }) {
    const t = e, n = o, r = Qt(), s = te(t, n), { forwardRef: l } = V();
    return r.contentId ||= be(void 0, "reka-popover-content"), (i, u) => (m(), _(a(De), { present: i.forceMount || a(r).open.value }, {
      default: y(() => [a(r).modal.value ? (m(), _(mc, E({ key: 0 }, a(s), { ref: a(l) }), {
        default: y(() => [b(i.$slots, "default")]),
        _: 3
      }, 16)) : (m(), _(gc, E({ key: 1 }, a(s), { ref: a(l) }), {
        default: y(() => [b(i.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), bc = hc, _c = /* @__PURE__ */ h({
  __name: "PopoverPortal",
  props: {
    to: {
      type: null,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    defer: {
      type: Boolean,
      required: !1
    },
    forceMount: {
      type: Boolean,
      required: !1
    }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(Gt), X(Q(o)), {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), wc = _c, Cc = /* @__PURE__ */ h({
  __name: "PopoverTrigger",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "button"
    }
  },
  setup(e) {
    const o = e, t = Qt(), { forwardRef: n, currentElement: r } = V();
    return t.triggerId ||= be(void 0, "reka-popover-trigger"), pe(() => {
      t.triggerElement.value = r.value;
    }), (s, l) => (m(), _(Ie(a(t).hasCustomAnchor.value ? a(K) : a(So)), { "as-child": "" }, {
      default: y(() => [I(a(K), {
        id: a(t).triggerId,
        ref: a(n),
        type: s.as === "button" ? "button" : void 0,
        "aria-haspopup": "dialog",
        "aria-expanded": a(t).open.value,
        "aria-controls": a(t).contentId,
        "data-state": a(t).open.value ? "open" : "closed",
        as: s.as,
        "as-child": o.asChild,
        onClick: a(t).onOpenToggle
      }, {
        default: y(() => [b(s.$slots, "default")]),
        _: 3
      }, 8, [
        "id",
        "type",
        "aria-expanded",
        "aria-controls",
        "data-state",
        "as",
        "as-child",
        "onClick"
      ])]),
      _: 3
    }));
  }
}), Sc = Cc, xc = /* @__PURE__ */ h({
  __name: "DropdownMenuCheckboxItem",
  props: {
    modelValue: {
      type: [Boolean, String],
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    textValue: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["select", "update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, r = mt(o);
    return V(), (s, l) => (m(), _(a(Id), X(Q({
      ...t,
      ...a(r)
    })), {
      default: y(() => [b(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), qc = xc;
const [ba, Bc] = /* @__PURE__ */ oe("DropdownMenuRoot");
var Oc = /* @__PURE__ */ h({
  __name: "DropdownMenuRoot",
  props: {
    defaultOpen: {
      type: Boolean,
      required: !1
    },
    open: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    dir: {
      type: String,
      required: !1
    },
    modal: {
      type: Boolean,
      required: !1,
      default: !0
    }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const t = e, n = o;
    V();
    const r = /* @__PURE__ */ fe(t, "open", n, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = P(), { modal: l, dir: i } = ue(t), u = lt(i);
    return Bc({
      open: r,
      onOpenChange: (c) => {
        r.value = c;
      },
      onOpenToggle: () => {
        r.value = !r.value;
      },
      triggerId: "",
      triggerElement: s,
      contentId: "",
      modal: l,
      dir: u
    }), (c, d) => (m(), _(a(Bd), {
      open: a(r),
      "onUpdate:open": d[0] || (d[0] = (p) => pt(r) ? r.value = p : null),
      dir: a(u),
      modal: a(l)
    }, {
      default: y(() => [b(c.$slots, "default", { open: a(r) })]),
      _: 3
    }, 8, [
      "open",
      "dir",
      "modal"
    ]));
  }
}), Ac = Oc, Pc = /* @__PURE__ */ h({
  __name: "DropdownMenuContent",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    loop: {
      type: Boolean,
      required: !1
    },
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    align: {
      type: null,
      required: !1
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "closeAutoFocus"
  ],
  setup(e, { emit: o }) {
    const r = te(e, o);
    V();
    const s = ba(), l = P(!1);
    function i(u) {
      u.defaultPrevented || (l.value || setTimeout(() => {
        s.triggerElement.value?.focus();
      }, 0), l.value = !1, u.preventDefault());
    }
    return s.contentId ||= be(void 0, "reka-dropdown-menu-content"), (u, c) => (m(), _(a(Ld), E(a(r), {
      id: a(s).contentId,
      "aria-labelledby": a(s)?.triggerId,
      style: {
        "--reka-dropdown-menu-content-transform-origin": "var(--reka-popper-transform-origin)",
        "--reka-dropdown-menu-content-available-width": "var(--reka-popper-available-width)",
        "--reka-dropdown-menu-content-available-height": "var(--reka-popper-available-height)",
        "--reka-dropdown-menu-trigger-width": "var(--reka-popper-anchor-width)",
        "--reka-dropdown-menu-trigger-height": "var(--reka-popper-anchor-height)"
      },
      onCloseAutoFocus: i,
      onInteractOutside: c[0] || (c[0] = (d) => {
        if (d.defaultPrevented) return;
        const p = d.detail.originalEvent, f = p.button === 0 && p.ctrlKey === !0, v = p.button === 2 || f;
        (!a(s).modal.value || v) && (l.value = !0), a(s).triggerElement.value?.contains(d.target) && d.preventDefault();
      })
    }), {
      default: y(() => [b(u.$slots, "default")]),
      _: 3
    }, 16, ["id", "aria-labelledby"]));
  }
}), Tc = Pc, Ec = /* @__PURE__ */ h({
  __name: "DropdownMenuGroup",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e;
    return V(), (t, n) => (m(), _(a(ya), X(Q(o)), {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Dc = Ec, kc = /* @__PURE__ */ h({
  __name: "DropdownMenuItem",
  props: {
    disabled: {
      type: Boolean,
      required: !1
    },
    textValue: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const t = e, r = mt(o);
    return V(), (s, l) => (m(), _(a(Dn), X(Q({
      ...t,
      ...a(r)
    })), {
      default: y(() => [b(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), $c = kc, Ic = /* @__PURE__ */ h({
  __name: "DropdownMenuItemIndicator",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e;
    return V(), (t, n) => (m(), _(a(kd), X(Q(o)), {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), _a = Ic, Mc = /* @__PURE__ */ h({
  __name: "DropdownMenuLabel",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e;
    return V(), (t, n) => (m(), _(a(Wd), X(Q(o)), {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Rc = Mc, Fc = /* @__PURE__ */ h({
  __name: "DropdownMenuPortal",
  props: {
    to: {
      type: null,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    defer: {
      type: Boolean,
      required: !1
    },
    forceMount: {
      type: Boolean,
      required: !1
    }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(Gd), X(Q(o)), {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Vc = Fc, Nc = /* @__PURE__ */ h({
  __name: "DropdownMenuRadioGroup",
  props: {
    modelValue: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, r = mt(o);
    return V(), (s, l) => (m(), _(a(Zd), X(Q({
      ...t,
      ...a(r)
    })), {
      default: y(() => [b(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Lc = Nc, jc = /* @__PURE__ */ h({
  __name: "DropdownMenuRadioItem",
  props: {
    value: {
      type: null,
      required: !0
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    textValue: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const r = te(e, o);
    return V(), (s, l) => (m(), _(a(ec), X(Q(a(r))), {
      default: y(() => [b(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), zc = jc, Kc = /* @__PURE__ */ h({
  __name: "DropdownMenuSeparator",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e;
    return V(), (t, n) => (m(), _(a(oc), X(Q(o)), {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Hc = Kc, Wc = /* @__PURE__ */ h({
  __name: "DropdownMenuSub",
  props: {
    defaultOpen: {
      type: Boolean,
      required: !1
    },
    open: {
      type: Boolean,
      required: !1,
      default: void 0
    }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const t = e, r = /* @__PURE__ */ fe(t, "open", o, {
      passive: t.open === void 0,
      defaultValue: t.defaultOpen ?? !1
    });
    return V(), (s, l) => (m(), _(a(ac), {
      open: a(r),
      "onUpdate:open": l[0] || (l[0] = (i) => pt(r) ? r.value = i : null)
    }, {
      default: y(() => [b(s.$slots, "default", { open: a(r) })]),
      _: 3
    }, 8, ["open"]));
  }
}), Uc = Wc, Gc = /* @__PURE__ */ h({
  __name: "DropdownMenuSubContent",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    loop: {
      type: Boolean,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "entryFocus",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(e, { emit: o }) {
    const r = te(e, o);
    return V(), (s, l) => (m(), _(a(lc), E(a(r), { style: {
      "--reka-dropdown-menu-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-dropdown-menu-content-available-width": "var(--reka-popper-available-width)",
      "--reka-dropdown-menu-content-available-height": "var(--reka-popper-available-height)",
      "--reka-dropdown-menu-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-dropdown-menu-trigger-height": "var(--reka-popper-anchor-height)"
    } }), {
      default: y(() => [b(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Yc = Gc, Xc = /* @__PURE__ */ h({
  __name: "DropdownMenuSubTrigger",
  props: {
    disabled: {
      type: Boolean,
      required: !1
    },
    textValue: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e;
    return V(), (t, n) => (m(), _(a(uc), X(Q(o)), {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Jc = Xc, Zc = /* @__PURE__ */ h({
  __name: "DropdownMenuTrigger",
  props: {
    disabled: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "button"
    }
  },
  setup(e) {
    const o = e, t = ba(), { forwardRef: n, currentElement: r } = V();
    return pe(() => {
      t.triggerElement = r;
    }), t.triggerId ||= be(void 0, "reka-dropdown-menu-trigger"), (s, l) => (m(), _(a(pa), { "as-child": "" }, {
      default: y(() => [I(a(K), {
        id: a(t).triggerId,
        ref: a(n),
        type: s.as === "button" ? "button" : void 0,
        "as-child": o.asChild,
        as: s.as,
        "aria-haspopup": "menu",
        "aria-expanded": a(t).open.value,
        "aria-controls": a(t).open.value ? a(t).contentId : void 0,
        "data-disabled": s.disabled ? "" : void 0,
        disabled: s.disabled,
        "data-state": a(t).open.value ? "open" : "closed",
        onClick: l[0] || (l[0] = async (i) => {
          !s.disabled && i.button === 0 && i.ctrlKey === !1 && (a(t)?.onOpenToggle(), await ce(), a(t).open.value && i.preventDefault());
        }),
        onKeydown: l[1] || (l[1] = Tt((i) => {
          s.disabled || (["Enter", " "].includes(i.key) && a(t).onOpenToggle(), i.key === "ArrowDown" && a(t).onOpenChange(!0), [
            "Enter",
            " ",
            "ArrowDown"
          ].includes(i.key) && i.preventDefault());
        }, [
          "enter",
          "space",
          "arrow-down"
        ]))
      }, {
        default: y(() => [b(s.$slots, "default")]),
        _: 3
      }, 8, [
        "id",
        "type",
        "as-child",
        "as",
        "aria-expanded",
        "aria-controls",
        "data-disabled",
        "disabled",
        "data-state"
      ])]),
      _: 3
    }));
  }
}), Qc = Zc, ep = /* @__PURE__ */ h({
  __name: "Label",
  props: {
    for: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "label"
    }
  },
  setup(e) {
    const o = e;
    return V(), (t, n) => (m(), _(a(K), E(o, { onMousedown: n[0] || (n[0] = (r) => {
      !r.defaultPrevented && r.detail > 1 && r.preventDefault();
    }) }), {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), tp = ep;
const jt = 100, [op, np] = /* @__PURE__ */ oe("ProgressRoot"), vo = (e) => typeof e == "number";
function rp(e, o) {
  return rt(e) || vo(e) && !Number.isNaN(e) && e <= o && e >= 0 ? e : (console.error(`Invalid prop \`value\` of value \`${e}\` supplied to \`ProgressRoot\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${jt} if no \`max\` prop is set)
  - \`null\`  or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`), null);
}
function ap(e) {
  return vo(e) && !Number.isNaN(e) && e > 0 ? e : (console.error(`Invalid prop \`max\` of value \`${e}\` supplied to \`ProgressRoot\`. Only numbers greater than 0 are valid max values. Defaulting to \`${jt}\`.`), jt);
}
var sp = /* @__PURE__ */ h({
  __name: "ProgressRoot",
  props: {
    modelValue: {
      type: [Number, null],
      required: !1
    },
    max: {
      type: Number,
      required: !1,
      default: jt
    },
    getValueLabel: {
      type: Function,
      required: !1,
      default: (e, o) => vo(e) ? `${Math.round(e / o * jt)}%` : void 0
    },
    getValueText: {
      type: Function,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["update:modelValue", "update:max"],
  setup(e, { emit: o }) {
    const t = e, n = o;
    V();
    const r = /* @__PURE__ */ fe(t, "modelValue", n, { passive: t.modelValue === void 0 }), s = /* @__PURE__ */ fe(t, "max", n, { passive: t.max === void 0 });
    re(() => r.value, async (i) => {
      const u = rp(i, t.max);
      u !== i && (await ce(), r.value = u);
    }, { immediate: !0 }), re(() => t.max, (i) => {
      const u = ap(t.max);
      u !== i && (s.value = u);
    }, { immediate: !0 });
    const l = A(() => rt(r.value) ? "indeterminate" : r.value === s.value ? "complete" : "loading");
    return np({
      modelValue: r,
      max: s,
      progressState: l
    }), (i, u) => (m(), _(a(K), {
      "as-child": i.asChild,
      as: i.as,
      "aria-valuemax": a(s),
      "aria-valuemin": 0,
      "aria-valuenow": vo(a(r)) ? a(r) : void 0,
      "aria-valuetext": i.getValueText?.(a(r), a(s)),
      "aria-label": i.getValueLabel(a(r), a(s)),
      role: "progressbar",
      "data-state": l.value,
      "data-value": a(r) ?? void 0,
      "data-max": a(s)
    }, {
      default: y(() => [b(i.$slots, "default", { modelValue: a(r) })]),
      _: 3
    }, 8, [
      "as-child",
      "as",
      "aria-valuemax",
      "aria-valuenow",
      "aria-valuetext",
      "aria-label",
      "data-state",
      "data-value",
      "data-max"
    ]));
  }
}), lp = sp, ip = /* @__PURE__ */ h({
  __name: "ProgressIndicator",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e, t = op();
    return V(), (n, r) => (m(), _(a(K), E(o, {
      "data-state": a(t).progressState.value,
      "data-value": a(t).modelValue?.value ?? void 0,
      "data-max": a(t).max.value
    }), {
      default: y(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, [
      "data-state",
      "data-value",
      "data-max"
    ]));
  }
}), up = ip;
const dp = "radio.select";
function cp(e, o, t) {
  yo(dp, t, {
    originalEvent: e,
    value: o
  });
}
var pp = /* @__PURE__ */ h({
  __name: "Radio",
  props: {
    id: {
      type: String,
      required: !1
    },
    value: {
      type: null,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    checked: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "button"
    },
    name: {
      type: String,
      required: !1
    },
    required: {
      type: Boolean,
      required: !1
    }
  },
  emits: ["update:checked", "select"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = /* @__PURE__ */ fe(t, "checked", n, { passive: t.checked === void 0 }), { value: s } = ue(t), { forwardRef: l, currentElement: i } = V(), u = kt(i), c = A(() => t.id && i.value ? document.querySelector(`[for="${t.id}"]`)?.innerText ?? t.value : void 0);
    function d(p) {
      t.disabled || cp(p, t.value, (f) => {
        n("select", f), !f?.defaultPrevented && (r.value = !0, u.value && f.stopPropagation());
      });
    }
    return (p, f) => (m(), _(a(K), E(p.$attrs, {
      id: p.id,
      ref: a(l),
      role: "radio",
      type: p.as === "button" ? "button" : void 0,
      as: p.as,
      "aria-checked": a(r),
      "aria-label": c.value,
      "as-child": p.asChild,
      disabled: p.disabled ? "" : void 0,
      "data-state": a(r) ? "checked" : "unchecked",
      "data-disabled": p.disabled ? "" : void 0,
      value: a(s),
      required: p.required,
      name: p.name,
      onClick: Ce(d, ["stop"])
    }), {
      default: y(() => [b(p.$slots, "default", { checked: a(r) }), a(u) && p.name ? (m(), _(a(Yt), {
        key: 0,
        type: "radio",
        tabindex: "-1",
        value: a(s),
        checked: !!a(r),
        name: p.name,
        disabled: p.disabled,
        required: p.required
      }, null, 8, [
        "value",
        "checked",
        "name",
        "disabled",
        "required"
      ])) : de("v-if", !0)]),
      _: 3
    }, 16, [
      "id",
      "type",
      "as",
      "aria-checked",
      "aria-label",
      "as-child",
      "disabled",
      "data-state",
      "data-disabled",
      "value",
      "required",
      "name"
    ]));
  }
}), fp = pp;
const [vp, mp] = /* @__PURE__ */ oe("RadioGroupRoot");
var yp = /* @__PURE__ */ h({
  __name: "RadioGroupRoot",
  props: {
    modelValue: {
      type: null,
      required: !1
    },
    defaultValue: {
      type: null,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    orientation: {
      type: String,
      required: !1,
      default: void 0
    },
    dir: {
      type: String,
      required: !1
    },
    loop: {
      type: Boolean,
      required: !1,
      default: !0
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    },
    name: {
      type: String,
      required: !1
    },
    required: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, n = o, { forwardRef: r, currentElement: s } = V(), l = /* @__PURE__ */ fe(t, "modelValue", n, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    }), { disabled: i, loop: u, orientation: c, name: d, required: p, dir: f } = ue(t), v = lt(f), g = kt(s);
    return mp({
      modelValue: l,
      changeModelValue: (w) => {
        l.value = w;
      },
      disabled: i,
      loop: u,
      orientation: c,
      name: d?.value,
      required: p
    }), (w, S) => (m(), _(a(On), {
      "as-child": "",
      orientation: a(c),
      dir: a(v),
      loop: a(u)
    }, {
      default: y(() => [I(a(K), {
        ref: a(r),
        role: "radiogroup",
        "data-disabled": a(i) ? "" : void 0,
        "as-child": w.asChild,
        as: w.as,
        "aria-orientation": a(c),
        "aria-required": a(p),
        dir: a(v)
      }, {
        default: y(() => [b(w.$slots, "default", { modelValue: a(l) }), a(g) && a(d) ? (m(), _(a(Yt), {
          key: 0,
          required: a(p),
          disabled: a(i),
          value: a(l),
          name: a(d)
        }, null, 8, [
          "required",
          "disabled",
          "value",
          "name"
        ])) : de("v-if", !0)]),
        _: 3
      }, 8, [
        "data-disabled",
        "as-child",
        "as",
        "aria-orientation",
        "aria-required",
        "dir"
      ])]),
      _: 3
    }, 8, [
      "orientation",
      "dir",
      "loop"
    ]));
  }
}), gp = yp;
const [hp, bp] = /* @__PURE__ */ oe("RadioGroupItem");
var _p = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "RadioGroupItem",
  props: {
    id: {
      type: String,
      required: !1
    },
    value: {
      type: null,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "button"
    },
    name: {
      type: String,
      required: !1
    },
    required: {
      type: Boolean,
      required: !1
    }
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const t = e, n = o, { forwardRef: r, currentElement: s } = V(), l = vp(), i = A(() => l.disabled.value || t.disabled), u = A(() => l.required.value || t.required), c = A(() => nt(l.modelValue?.value, t.value));
    bp({
      disabled: i,
      checked: c
    });
    const d = P(!1), p = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight"
    ];
    Ue("keydown", (v) => {
      p.includes(v.key) && (d.value = !0);
    }), Ue("keyup", () => {
      d.value = !1;
    });
    function f() {
      setTimeout(() => {
        d.value && s.value?.click();
      }, 0);
    }
    return (v, g) => (m(), _(a(An), {
      checked: c.value,
      disabled: i.value,
      "as-child": "",
      focusable: !i.value,
      active: c.value
    }, {
      default: y(() => [I(fp, E({
        ...v.$attrs,
        ...t
      }, {
        ref: a(r),
        checked: c.value,
        required: u.value,
        disabled: i.value,
        "onUpdate:checked": g[0] || (g[0] = (w) => a(l).changeModelValue(v.value)),
        onSelect: g[1] || (g[1] = (w) => n("select", w)),
        onKeydown: g[2] || (g[2] = Tt(Ce(() => {
        }, ["prevent"]), ["enter"])),
        onFocus: f
      }), {
        default: y(() => [b(v.$slots, "default", {
          checked: c.value,
          required: u.value,
          disabled: i.value
        })]),
        _: 3
      }, 16, [
        "checked",
        "required",
        "disabled"
      ])]),
      _: 3
    }, 8, [
      "checked",
      "disabled",
      "focusable",
      "active"
    ]));
  }
}), wp = _p, Cp = /* @__PURE__ */ h({
  __name: "RadioGroupIndicator",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(e) {
    const { forwardRef: o } = V(), t = hp();
    return (n, r) => (m(), _(a(De), { present: n.forceMount || a(t).checked.value }, {
      default: y(() => [I(a(K), E({
        ref: a(o),
        "data-state": a(t).checked.value ? "checked" : "unchecked",
        "data-disabled": a(t).disabled.value ? "" : void 0,
        "as-child": n.asChild,
        as: n.as
      }, n.$attrs), {
        default: y(() => [b(n.$slots, "default")]),
        _: 3
      }, 16, [
        "data-state",
        "data-disabled",
        "as-child",
        "as"
      ])]),
      _: 3
    }, 8, ["present"]));
  }
}), Sp = Cp;
const xp = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], qp = [" ", "Enter"], $e = 10;
function zt(e, o, t) {
  return e === void 0 ? !1 : Array.isArray(e) ? e.some((n) => nn(n, o, t)) : nn(e, o, t);
}
function nn(e, o, t) {
  return e === void 0 || o === void 0 ? !1 : typeof e == "string" ? e === o : typeof t == "function" ? t(e, o) : typeof t == "string" ? e?.[t] === o?.[t] : nt(e, o);
}
function Bp(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
const Op = {
  key: 0,
  value: ""
}, [it, wa] = /* @__PURE__ */ oe("SelectRoot");
var Ap = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "SelectRoot",
  props: {
    open: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    defaultOpen: {
      type: Boolean,
      required: !1
    },
    defaultValue: {
      type: null,
      required: !1
    },
    modelValue: {
      type: null,
      required: !1,
      default: void 0
    },
    by: {
      type: [String, Function],
      required: !1
    },
    dir: {
      type: String,
      required: !1
    },
    multiple: {
      type: Boolean,
      required: !1
    },
    autocomplete: {
      type: String,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    name: {
      type: String,
      required: !1
    },
    required: {
      type: Boolean,
      required: !1
    }
  },
  emits: ["update:modelValue", "update:open"],
  setup(e, { emit: o }) {
    const t = e, n = o, { required: r, disabled: s, multiple: l, dir: i } = ue(t), u = /* @__PURE__ */ fe(t, "modelValue", n, {
      defaultValue: t.defaultValue ?? (l.value ? [] : void 0),
      passive: t.modelValue === void 0,
      deep: !0
    }), c = /* @__PURE__ */ fe(t, "open", n, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), d = P(), p = P(), f = P({
      x: 0,
      y: 0
    }), v = A(() => l.value && Array.isArray(u.value) ? u.value?.length === 0 : rt(u.value));
    ke({ isProvider: !0 });
    const g = lt(i), w = kt(d), S = P(/* @__PURE__ */ new Set()), O = A(() => Array.from(S.value).map((C) => C.value).join(";"));
    function x(C) {
      if (l.value) {
        const k = Array.isArray(u.value) ? [...u.value] : [], M = k.findIndex((R) => nn(R, C, t.by));
        M === -1 ? k.push(C) : k.splice(M, 1), u.value = [...k];
      } else u.value = C;
    }
    function B(C) {
      return Array.from(S.value).find((k) => zt(C, k.value, t.by));
    }
    return wa({
      triggerElement: d,
      onTriggerChange: (C) => {
        d.value = C;
      },
      valueElement: p,
      onValueElementChange: (C) => {
        p.value = C;
      },
      contentId: "",
      modelValue: u,
      onValueChange: x,
      by: t.by,
      open: c,
      multiple: l,
      required: r,
      onOpenChange: (C) => {
        c.value = C;
      },
      dir: g,
      triggerPointerDownPosRef: f,
      disabled: s,
      isEmptyModelValue: v,
      optionsSet: S,
      onOptionAdd: (C) => {
        const k = B(C.value);
        k && S.value.delete(k), S.value.add(C);
      },
      onOptionRemove: (C) => {
        const k = B(C.value);
        k && S.value.delete(k);
      }
    }), (C, k) => (m(), _(a(Xt), null, {
      default: y(() => [b(C.$slots, "default", {
        modelValue: a(u),
        open: a(c)
      }), a(w) && C.name ? (m(), _(Ep, {
        key: O.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: a(l),
        required: a(r),
        name: C.name,
        autocomplete: C.autocomplete,
        disabled: a(s),
        value: a(u)
      }, {
        default: y(() => [a(rt)(a(u)) ? (m(), H("option", Op)) : de("v-if", !0), (m(!0), H(qe, null, Bt(Array.from(S.value), (M) => (m(), H("option", E({ key: M.value ?? "" }, { ref_for: !0 }, M), null, 16))), 128))]),
        _: 1
      }, 8, [
        "multiple",
        "required",
        "name",
        "autocomplete",
        "disabled",
        "value"
      ])) : de("v-if", !0)]),
      _: 3
    }));
  }
}), Pp = Ap, Tp = /* @__PURE__ */ h({
  __name: "BubbleSelect",
  props: {
    autocomplete: {
      type: String,
      required: !1
    },
    autofocus: {
      type: Boolean,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    form: {
      type: String,
      required: !1
    },
    multiple: {
      type: Boolean,
      required: !1
    },
    name: {
      type: String,
      required: !1
    },
    required: {
      type: Boolean,
      required: !1
    },
    size: {
      type: Number,
      required: !1
    },
    value: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e, t = P(), n = it();
    re(() => o.value, (s, l) => {
      const i = window.HTMLSelectElement.prototype, c = Object.getOwnPropertyDescriptor(i, "value").set;
      if (s !== l && c && t.value) {
        const d = new Event("change", { bubbles: !0 });
        c.call(t.value, s), t.value.dispatchEvent(d);
      }
    });
    function r(s) {
      n.onValueChange(s.target.value);
    }
    return (s, l) => (m(), _(a(bn), { "as-child": "" }, {
      default: y(() => [ye("select", E({
        ref_key: "selectElement",
        ref: t
      }, o, { onInput: r }), [b(s.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), Ep = Tp, Dp = /* @__PURE__ */ h({
  __name: "SelectPopperPosition",
  props: {
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    align: {
      type: null,
      required: !1,
      default: "start"
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1,
      default: $e
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const t = ge(e);
    return (n, r) => (m(), _(a(Ao), E(a(t), { style: {
      boxSizing: "border-box",
      "--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-select-content-available-width": "var(--reka-popper-available-width)",
      "--reka-select-content-available-height": "var(--reka-popper-available-height)",
      "--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
    } }), {
      default: y(() => [b(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), kp = Dp;
const $p = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [ht, Ca] = /* @__PURE__ */ oe("SelectContent");
var Ip = /* @__PURE__ */ h({
  __name: "SelectContentImpl",
  props: {
    position: {
      type: String,
      required: !1,
      default: "item-aligned"
    },
    bodyLock: {
      type: Boolean,
      required: !1,
      default: !0
    },
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    align: {
      type: null,
      required: !1,
      default: "start"
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1,
      default: !0
    }
  },
  emits: [
    "closeAutoFocus",
    "escapeKeyDown",
    "pointerDownOutside"
  ],
  setup(e, { emit: o }) {
    const t = e, n = o, r = it();
    cn(), bo(t.bodyLock);
    const { CollectionSlot: s, getItems: l } = ke(), i = P();
    _o(i);
    const { search: u, handleTypeaheadSearch: c } = pn(), d = P(), p = P(), f = P(), v = P(!1), g = P(!1), w = P(!1);
    function S() {
      p.value && i.value && Jo([p.value, i.value]);
    }
    re(v, () => {
      S();
    });
    const { onOpenChange: O, triggerPointerDownPosRef: x } = r;
    se((M) => {
      if (!i.value) return;
      let R = {
        x: 0,
        y: 0
      };
      const N = (q) => {
        R = {
          x: Math.abs(Math.round(q.pageX) - (x.value?.x ?? 0)),
          y: Math.abs(Math.round(q.pageY) - (x.value?.y ?? 0))
        };
      }, j = (q) => {
        q.pointerType !== "touch" && (R.x <= 10 && R.y <= 10 ? q.preventDefault() : i.value?.contains(q.target) || O(!1), document.removeEventListener("pointermove", N), x.value = null);
      };
      x.value !== null && (document.addEventListener("pointermove", N), document.addEventListener("pointerup", j, {
        capture: !0,
        once: !0
      })), M(() => {
        document.removeEventListener("pointermove", N), document.removeEventListener("pointerup", j, { capture: !0 });
      });
    });
    function B(M) {
      const R = M.ctrlKey || M.altKey || M.metaKey;
      if (M.key === "Tab" && M.preventDefault(), !R && M.key.length === 1 && c(M.key, l()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(M.key)) {
        let j = [...l().map((q) => q.ref)];
        if (["ArrowUp", "End"].includes(M.key) && (j = j.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(M.key)) {
          const q = M.target, F = j.indexOf(q);
          j = j.slice(F + 1);
        }
        setTimeout(() => Jo(j)), M.preventDefault();
      }
    }
    const C = A(() => t.position === "popper" ? t : {}), k = ge(C.value);
    return Ca({
      content: i,
      viewport: d,
      onViewportChange: (M) => {
        d.value = M;
      },
      itemRefCallback: (M, R, N) => {
        const j = !g.value && !N, q = zt(r.modelValue.value, R, r.by);
        if (r.multiple.value) {
          if (w.value) return;
          (q || j) && (p.value = M, q && (w.value = !0));
        } else (q || j) && (p.value = M);
        j && (g.value = !0);
      },
      selectedItem: p,
      selectedItemText: f,
      onItemLeave: () => {
        i.value?.focus();
      },
      itemTextRefCallback: (M, R, N) => {
        const j = !g.value && !N;
        (zt(r.modelValue.value, R, r.by) || j) && (f.value = M);
      },
      focusSelectedItem: S,
      position: t.position,
      isPositioned: v,
      searchRef: u
    }), (M, R) => (m(), _(a(s), null, {
      default: y(() => [I(a(Co), {
        "as-child": "",
        onMountAutoFocus: R[6] || (R[6] = Ce(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: R[7] || (R[7] = (N) => {
          n("closeAutoFocus", N), !N.defaultPrevented && (a(r).triggerElement.value?.focus({ preventScroll: !0 }), N.preventDefault());
        })
      }, {
        default: y(() => [I(a(Ut), {
          "as-child": "",
          "disable-outside-pointer-events": M.disableOutsidePointerEvents,
          onFocusOutside: R[2] || (R[2] = Ce(() => {
          }, ["prevent"])),
          onDismiss: R[3] || (R[3] = (N) => a(r).onOpenChange(!1)),
          onEscapeKeyDown: R[4] || (R[4] = (N) => n("escapeKeyDown", N)),
          onPointerDownOutside: R[5] || (R[5] = (N) => n("pointerDownOutside", N))
        }, {
          default: y(() => [(m(), _(Ie(M.position === "popper" ? kp : Vp), E({
            ...M.$attrs,
            ...a(k)
          }, {
            id: a(r).contentId,
            ref: (N) => {
              if (!N) return;
              const j = a(je)(N);
              j?.hasAttribute("data-reka-popper-content-wrapper") ? i.value = j.firstElementChild : i.value = j;
            },
            role: "listbox",
            "data-state": a(r).open.value ? "open" : "closed",
            dir: a(r).dir.value,
            style: {
              display: "flex",
              flexDirection: "column",
              outline: "none"
            },
            onContextmenu: R[0] || (R[0] = Ce(() => {
            }, ["prevent"])),
            onPlaced: R[1] || (R[1] = (N) => v.value = !0),
            onKeydown: B
          }), {
            default: y(() => [b(M.$slots, "default")]),
            _: 3
          }, 16, [
            "id",
            "data-state",
            "dir",
            "onKeydown"
          ]))]),
          _: 3
        }, 8, ["disable-outside-pointer-events"])]),
        _: 3
      })]),
      _: 3
    }));
  }
}), Mp = Ip;
const [kn, Rp] = /* @__PURE__ */ oe("SelectItemAlignedPosition");
var Fp = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "SelectItemAlignedPosition",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["placed"],
  setup(e, { emit: o }) {
    const t = e, n = o, { getItems: r } = ke(), s = it(), l = ht(), i = P(!1), u = P(!0), c = P(), { forwardRef: d, currentElement: p } = V(), { viewport: f, selectedItem: v, selectedItemText: g, focusSelectedItem: w } = l;
    function S() {
      if (s.triggerElement.value && s.valueElement.value && c.value && p.value && f?.value && v?.value && g?.value) {
        const B = s.triggerElement.value.getBoundingClientRect(), C = p.value.getBoundingClientRect(), k = s.valueElement.value.getBoundingClientRect(), M = g.value.getBoundingClientRect();
        if (s.dir.value !== "rtl") {
          const T = M.left - C.left, le = k.left - T, ee = B.left - le, ae = B.width + ee, _e = Math.max(ae, C.width), Pe = window.innerWidth - $e, _t = lo(le, $e, Math.max($e, Pe - _e));
          c.value.style.minWidth = `${ae}px`, c.value.style.left = `${_t}px`;
        } else {
          const T = C.right - M.right, le = window.innerWidth - k.right - T, ee = window.innerWidth - B.right - le, ae = B.width + ee, _e = Math.max(ae, C.width), Pe = window.innerWidth - $e, _t = lo(le, $e, Math.max($e, Pe - _e));
          c.value.style.minWidth = `${ae}px`, c.value.style.right = `${_t}px`;
        }
        const R = r().map((T) => T.ref), N = window.innerHeight - $e * 2, j = f.value.scrollHeight, q = window.getComputedStyle(p.value), F = Number.parseInt(q.borderTopWidth, 10), D = Number.parseInt(q.paddingTop, 10), W = Number.parseInt(q.borderBottomWidth, 10), G = Number.parseInt(q.paddingBottom, 10), $ = F + D + j + G + W, z = Math.min(v.value.offsetHeight * 5, $), U = window.getComputedStyle(f.value), ne = Number.parseInt(U.paddingTop, 10), ve = Number.parseInt(U.paddingBottom, 10), Se = B.top + B.height / 2 - $e, me = N - Se, He = v.value.offsetHeight / 2, bt = v.value.offsetTop + He, Ze = F + D + bt, $o = $ - Ze;
        if (Ze <= Se) {
          const T = v.value === R.at(-1);
          c.value.style.bottom = "0px";
          const le = p.value.clientHeight - f.value.offsetTop - f.value.offsetHeight, ee = Math.max(me, He + (T ? ve : 0) + le + W), ae = Ze + ee;
          c.value.style.height = `${ae}px`;
        } else {
          const T = v.value === R[0];
          c.value.style.top = "0px";
          const ee = Math.max(Se, F + f.value.offsetTop + (T ? ne : 0) + He) + $o;
          c.value.style.height = `${ee}px`, f.value.scrollTop = Ze - Se + f.value.offsetTop;
        }
        c.value.style.margin = `${$e}px 0`, c.value.style.minHeight = `${z}px`, c.value.style.maxHeight = `${N}px`, n("placed"), requestAnimationFrame(() => i.value = !0);
      }
    }
    const O = P("");
    pe(async () => {
      await ce(), S(), p.value && (O.value = window.getComputedStyle(p.value).zIndex);
    });
    function x(B) {
      B && u.value === !0 && (S(), w?.(), u.value = !1);
    }
    return zs(s.triggerElement, () => {
      S();
    }), Rp({
      contentWrapper: c,
      shouldExpandOnScrollRef: i,
      onScrollButtonChange: x
    }), (B, C) => (m(), H("div", {
      ref_key: "contentWrapperElement",
      ref: c,
      style: Te({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: O.value
      })
    }, [I(a(K), E({
      ref: a(d),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...B.$attrs,
      ...t
    }), {
      default: y(() => [b(B.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), Vp = Fp, Np = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(e) {
    return wa(e.context), Ca($p), (t, n) => b(t.$slots, "default");
  }
}), Lp = Np;
const jp = { key: 1 };
var zp = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "SelectContent",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    position: {
      type: String,
      required: !1
    },
    bodyLock: {
      type: Boolean,
      required: !1
    },
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    align: {
      type: null,
      required: !1
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1
    }
  },
  emits: [
    "closeAutoFocus",
    "escapeKeyDown",
    "pointerDownOutside"
  ],
  setup(e, { emit: o }) {
    const t = e, r = te(t, o), s = it(), l = P();
    pe(() => {
      l.value = new DocumentFragment();
    });
    const i = P(), u = A(() => t.forceMount || s.open.value), c = P(u.value);
    let d;
    function p() {
      d && (clearTimeout(d), d = void 0);
    }
    return re(u, (f, v, g) => {
      p(), d = setTimeout(() => {
        c.value = u.value, d = void 0;
      }), g(p);
    }), Xe(p), (f, v) => u.value || c.value || i.value?.present ? (m(), _(a(De), {
      key: 0,
      ref_key: "presenceRef",
      ref: i,
      present: u.value
    }, {
      default: y(() => [I(Mp, X(Q({
        ...a(r),
        ...f.$attrs
      })), {
        default: y(() => [b(f.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : l.value ? (m(), H("div", jp, [(m(), _(yr, { to: l.value }, [I(Lp, { context: a(s) }, {
      default: y(() => [b(f.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : de("v-if", !0);
  }
}), Kp = zp;
const [Hp, Wp] = /* @__PURE__ */ oe("SelectGroup");
var Up = /* @__PURE__ */ h({
  __name: "SelectGroup",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e, t = be(void 0, "reka-select-group");
    return Wp({ id: t }), (n, r) => (m(), _(a(K), E({ role: "group" }, o, { "aria-labelledby": a(t) }), {
      default: y(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["aria-labelledby"]));
  }
}), Gp = Up, Yp = /* @__PURE__ */ h({
  __name: "SelectIcon",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(e) {
    return (o, t) => (m(), _(a(K), {
      "aria-hidden": "true",
      as: o.as,
      "as-child": o.asChild
    }, {
      default: y(() => [b(o.$slots, "default", {}, () => [t[0] || (t[0] = Ot("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Xp = Yp;
const [Sa, Jp] = /* @__PURE__ */ oe("SelectItem");
var Zp = /* @__PURE__ */ h({
  __name: "SelectItem",
  props: {
    value: {
      type: null,
      required: !0
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    textValue: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const t = e, n = o, { disabled: r } = ue(t), s = it(), l = ht(), { forwardRef: i, currentElement: u } = V(), { CollectionItem: c } = ke(), d = A(() => zt(s.modelValue?.value, t.value, s.by)), p = P(!1), f = P(t.textValue ?? ""), v = be(void 0, "reka-select-item-text"), g = "select.select";
    async function w(C) {
      if (C.defaultPrevented) return;
      const k = {
        originalEvent: C,
        value: t.value
      };
      yo(g, S, k);
    }
    async function S(C) {
      await ce(), n("select", C), !C.defaultPrevented && (r.value || (s.onValueChange(t.value), s.multiple.value || s.onOpenChange(!1)));
    }
    async function O(C) {
      await ce(), !C.defaultPrevented && (r.value ? l.onItemLeave?.() : C.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function x(C) {
      await ce(), !C.defaultPrevented && C.currentTarget === he() && l.onItemLeave?.();
    }
    async function B(C) {
      await ce(), !(C.defaultPrevented || l.searchRef?.value !== "" && C.key === " ") && (qp.includes(C.key) && w(C), C.key === " " && C.preventDefault());
    }
    if (t.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return pe(() => {
      u.value && l.itemRefCallback(u.value, t.value, t.disabled);
    }), Jp({
      value: t.value,
      disabled: r,
      textId: v,
      isSelected: d,
      onItemTextChange: (C) => {
        f.value = ((f.value || C?.textContent) ?? "").trim();
      }
    }), (C, k) => (m(), _(a(c), { value: { textValue: f.value } }, {
      default: y(() => [I(a(K), {
        ref: a(i),
        role: "option",
        "aria-labelledby": a(v),
        "data-highlighted": p.value ? "" : void 0,
        "aria-selected": d.value,
        "data-state": d.value ? "checked" : "unchecked",
        "aria-disabled": a(r) || void 0,
        "data-disabled": a(r) ? "" : void 0,
        tabindex: a(r) ? void 0 : -1,
        as: C.as,
        "as-child": C.asChild,
        onFocus: k[0] || (k[0] = (M) => p.value = !0),
        onBlur: k[1] || (k[1] = (M) => p.value = !1),
        onPointerup: w,
        onPointerdown: k[2] || (k[2] = (M) => {
          M.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: k[3] || (k[3] = Ce(() => {
        }, ["prevent", "stop"])),
        onPointermove: O,
        onPointerleave: x,
        onKeydown: B
      }, {
        default: y(() => [b(C.$slots, "default")]),
        _: 3
      }, 8, [
        "aria-labelledby",
        "data-highlighted",
        "aria-selected",
        "data-state",
        "aria-disabled",
        "data-disabled",
        "tabindex",
        "as",
        "as-child"
      ])]),
      _: 3
    }, 8, ["value"]));
  }
}), Qp = Zp, ef = /* @__PURE__ */ h({
  __name: "SelectItemIndicator",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(e) {
    const o = e, t = Sa();
    return (n, r) => a(t).isSelected.value ? (m(), _(a(K), E({
      key: 0,
      "aria-hidden": "true"
    }, o), {
      default: y(() => [b(n.$slots, "default")]),
      _: 3
    }, 16)) : de("v-if", !0);
  }
}), tf = ef, of = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "SelectItemText",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(e) {
    const o = e, t = it(), n = ht(), r = Sa(), { forwardRef: s, currentElement: l } = V(), i = A(() => ({
      value: r.value,
      disabled: r.disabled.value,
      textContent: l.value?.textContent ?? r.value?.toString() ?? ""
    }));
    return pe(() => {
      l.value && (r.onItemTextChange(l.value), n.itemTextRefCallback(l.value, r.value, r.disabled.value), t.onOptionAdd(i.value));
    }), Xe(() => {
      t.onOptionRemove(i.value);
    }), (u, c) => (m(), _(a(K), E({
      id: a(r).textId,
      ref: a(s)
    }, {
      ...o,
      ...u.$attrs
    }), {
      default: y(() => [b(u.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), xa = of, nf = /* @__PURE__ */ h({
  __name: "SelectLabel",
  props: {
    for: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "div"
    }
  },
  setup(e) {
    const o = e, t = Hp({ id: "" });
    return (n, r) => (m(), _(a(K), E(o, { id: a(t).id }), {
      default: y(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), rf = nf, af = /* @__PURE__ */ h({
  __name: "SelectPortal",
  props: {
    to: {
      type: null,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    defer: {
      type: Boolean,
      required: !1
    },
    forceMount: {
      type: Boolean,
      required: !1
    }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(Gt), X(Q(o)), {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), sf = af, lf = /* @__PURE__ */ h({
  __name: "SelectScrollButtonImpl",
  emits: ["autoScroll"],
  setup(e, { emit: o }) {
    const t = o, { getItems: n } = ke(), r = ht(), s = P(null);
    function l() {
      s.value !== null && (window.clearInterval(s.value), s.value = null);
    }
    se(() => {
      n().map((d) => d.ref).find((d) => d === he())?.scrollIntoView({ block: "nearest" });
    });
    function i() {
      s.value === null && (s.value = window.setInterval(() => {
        t("autoScroll");
      }, 50));
    }
    function u() {
      r.onItemLeave?.(), s.value === null && (s.value = window.setInterval(() => {
        t("autoScroll");
      }, 50));
    }
    return mo(() => l()), (c, d) => (m(), _(a(K), E({
      "aria-hidden": "true",
      style: { flexShrink: 0 }
    }, c.$parent?.$props, {
      onPointerdown: i,
      onPointermove: u,
      onPointerleave: d[0] || (d[0] = () => {
        l();
      })
    }), {
      default: y(() => [b(c.$slots, "default")]),
      _: 3
    }, 16));
  }
}), qa = lf, uf = /* @__PURE__ */ h({
  __name: "SelectScrollDownButton",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = ht(), t = o.position === "item-aligned" ? kn() : void 0, { forwardRef: n, currentElement: r } = V(), s = P(!1);
    return se((l) => {
      if (o.viewport?.value && o.isPositioned?.value) {
        let u = function() {
          const c = i.scrollHeight - i.clientHeight;
          s.value = Math.ceil(i.scrollTop) < c;
        };
        const i = o.viewport.value;
        u(), i.addEventListener("scroll", u), l(() => i.removeEventListener("scroll", u));
      }
    }), re(r, () => {
      r.value && t?.onScrollButtonChange(r.value);
    }), (l, i) => s.value ? (m(), _(qa, {
      key: 0,
      ref: a(n),
      onAutoScroll: i[0] || (i[0] = () => {
        const { viewport: u, selectedItem: c } = a(o);
        u?.value && c?.value && (u.value.scrollTop = u.value.scrollTop + c.value.offsetHeight);
      })
    }, {
      default: y(() => [b(l.$slots, "default")]),
      _: 3
    }, 512)) : de("v-if", !0);
  }
}), df = uf, cf = /* @__PURE__ */ h({
  __name: "SelectScrollUpButton",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = ht(), t = o.position === "item-aligned" ? kn() : void 0, { forwardRef: n, currentElement: r } = V(), s = P(!1);
    return se((l) => {
      if (o.viewport?.value && o.isPositioned?.value) {
        let u = function() {
          s.value = i.scrollTop > 0;
        };
        const i = o.viewport.value;
        u(), i.addEventListener("scroll", u), l(() => i.removeEventListener("scroll", u));
      }
    }), re(r, () => {
      r.value && t?.onScrollButtonChange(r.value);
    }), (l, i) => s.value ? (m(), _(qa, {
      key: 0,
      ref: a(n),
      onAutoScroll: i[0] || (i[0] = () => {
        const { viewport: u, selectedItem: c } = a(o);
        u?.value && c?.value && (u.value.scrollTop = u.value.scrollTop - c.value.offsetHeight);
      })
    }, {
      default: y(() => [b(l.$slots, "default")]),
      _: 3
    }, 512)) : de("v-if", !0);
  }
}), pf = cf, ff = /* @__PURE__ */ h({
  __name: "SelectSeparator",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(K), E({ "aria-hidden": "true" }, o), {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), vf = ff, mf = /* @__PURE__ */ h({
  __name: "SelectTrigger",
  props: {
    disabled: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "button"
    }
  },
  setup(e) {
    const o = e, t = it(), { forwardRef: n, currentElement: r } = V(), s = A(() => t.disabled?.value || o.disabled);
    t.contentId ||= be(void 0, "reka-select-content"), pe(() => {
      t.onTriggerChange(r.value);
    });
    const { getItems: l } = ke(), { search: i, handleTypeaheadSearch: u, resetTypeahead: c } = pn();
    function d() {
      s.value || (t.onOpenChange(!0), c());
    }
    function p(f) {
      d(), t.triggerPointerDownPosRef.value = {
        x: Math.round(f.pageX),
        y: Math.round(f.pageY)
      };
    }
    return (f, v) => (m(), _(a(So), {
      "as-child": "",
      reference: f.reference
    }, {
      default: y(() => [I(a(K), {
        ref: a(n),
        role: "combobox",
        type: f.as === "button" ? "button" : void 0,
        "aria-controls": a(t).contentId,
        "aria-expanded": a(t).open.value || !1,
        "aria-required": a(t).required?.value,
        "aria-autocomplete": "none",
        disabled: s.value,
        dir: a(t)?.dir.value,
        "data-state": a(t)?.open.value ? "open" : "closed",
        "data-disabled": s.value ? "" : void 0,
        "data-placeholder": a(Bp)(a(t).modelValue?.value) ? "" : void 0,
        "as-child": f.asChild,
        as: f.as,
        onClick: v[0] || (v[0] = (g) => {
          g?.currentTarget?.focus();
        }),
        onPointerdown: v[1] || (v[1] = (g) => {
          if (g.pointerType === "touch") return g.preventDefault();
          const w = g.target;
          w.hasPointerCapture(g.pointerId) && w.releasePointerCapture(g.pointerId), g.button === 0 && g.ctrlKey === !1 && (p(g), g.preventDefault());
        }),
        onPointerup: v[2] || (v[2] = Ce((g) => {
          g.pointerType === "touch" && p(g);
        }, ["prevent"])),
        onKeydown: v[3] || (v[3] = (g) => {
          const w = a(i) !== "";
          !(g.ctrlKey || g.altKey || g.metaKey) && g.key.length === 1 && w && g.key === " " || (a(u)(g.key, a(l)()), a(xp).includes(g.key) && (d(), g.preventDefault()));
        })
      }, {
        default: y(() => [b(f.$slots, "default")]),
        _: 3
      }, 8, [
        "type",
        "aria-controls",
        "aria-expanded",
        "aria-required",
        "disabled",
        "dir",
        "data-state",
        "data-disabled",
        "data-placeholder",
        "as-child",
        "as"
      ])]),
      _: 3
    }, 8, ["reference"]));
  }
}), yf = mf, gf = /* @__PURE__ */ h({
  __name: "SelectValue",
  props: {
    placeholder: {
      type: String,
      required: !1,
      default: ""
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(e) {
    const o = e, { forwardRef: t, currentElement: n } = V(), r = it();
    pe(() => {
      r.valueElement = n;
    });
    const s = A(() => {
      let i = [];
      const u = Array.from(r.optionsSet.value), c = (d) => u.find((p) => zt(d, p.value, r.by));
      return Array.isArray(r.modelValue.value) ? i = r.modelValue.value.map((d) => c(d)?.textContent ?? "") : i = [c(r.modelValue.value)?.textContent ?? ""], i.filter(Boolean);
    }), l = A(() => s.value.length ? s.value.join(", ") : o.placeholder);
    return (i, u) => (m(), _(a(K), {
      ref: a(t),
      as: i.as,
      "as-child": i.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": s.value.length ? void 0 : o.placeholder
    }, {
      default: y(() => [b(i.$slots, "default", {
        selectedLabel: s.value,
        modelValue: a(r).modelValue.value
      }, () => [Ot(St(l.value), 1)])]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-placeholder"
    ]));
  }
}), hf = gf, bf = /* @__PURE__ */ h({
  __name: "SelectViewport",
  props: {
    nonce: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e, { nonce: t } = ue(o), n = Eu(t), r = ht(), s = r.position === "item-aligned" ? kn() : void 0, { forwardRef: l, currentElement: i } = V();
    pe(() => {
      r?.onViewportChange(i.value);
    });
    const u = P(0);
    function c(d) {
      const p = d.currentTarget, { shouldExpandOnScrollRef: f, contentWrapper: v } = s ?? {};
      if (f?.value && v?.value) {
        const g = Math.abs(u.value - p.scrollTop);
        if (g > 0) {
          const w = window.innerHeight - $e * 2, S = Number.parseFloat(v.value.style.minHeight), O = Number.parseFloat(v.value.style.height), x = Math.max(S, O);
          if (x < w) {
            const B = x + g, C = Math.min(w, B), k = B - C;
            v.value.style.height = `${C}px`, v.value.style.bottom === "0px" && (p.scrollTop = k > 0 ? k : 0, v.value.style.justifyContent = "flex-end");
          }
        }
      }
      u.value = p.scrollTop;
    }
    return (d, p) => (m(), H(qe, null, [I(a(K), E({
      ref: a(l),
      "data-reka-select-viewport": "",
      role: "presentation"
    }, {
      ...d.$attrs,
      ...o
    }, {
      style: {
        position: "relative",
        flex: 1,
        overflow: "hidden auto"
      },
      onScroll: c
    }), {
      default: y(() => [b(d.$slots, "default")]),
      _: 3
    }, 16), I(a(K), {
      as: "style",
      nonce: a(n)
    }, {
      default: y(() => p[0] || (p[0] = [Ot(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), _f = bf, wf = /* @__PURE__ */ h({
  __name: "BaseSeparator",
  props: {
    orientation: {
      type: String,
      required: !1,
      default: "horizontal"
    },
    decorative: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e, t = ["horizontal", "vertical"];
    function n(i) {
      return t.includes(i);
    }
    const r = A(() => n(o.orientation) ? o.orientation : "horizontal"), s = A(() => r.value === "vertical" ? o.orientation : void 0), l = A(() => o.decorative ? { role: "none" } : {
      "aria-orientation": s.value,
      role: "separator"
    });
    return (i, u) => (m(), _(a(K), E({
      as: i.as,
      "as-child": i.asChild,
      "data-orientation": r.value
    }, l.value), {
      default: y(() => [b(i.$slots, "default")]),
      _: 3
    }, 16, [
      "as",
      "as-child",
      "data-orientation"
    ]));
  }
}), Cf = wf, Sf = /* @__PURE__ */ h({
  __name: "Separator",
  props: {
    orientation: {
      type: String,
      required: !1,
      default: "horizontal"
    },
    decorative: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(Cf, X(Q(o)), {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), xf = Sf;
const [qf, Bf] = /* @__PURE__ */ oe("SwitchRoot");
var Of = /* @__PURE__ */ h({
  __name: "SwitchRoot",
  props: {
    defaultValue: {
      type: null,
      required: !1
    },
    modelValue: {
      type: null,
      required: !1,
      default: void 0
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    id: {
      type: String,
      required: !1
    },
    value: {
      type: String,
      required: !1,
      default: "on"
    },
    trueValue: {
      type: null,
      required: !1,
      default: () => !0
    },
    falseValue: {
      type: null,
      required: !1,
      default: () => !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "button"
    },
    name: {
      type: String,
      required: !1
    },
    required: {
      type: Boolean,
      required: !1
    }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, n = o, { disabled: r } = ue(t), s = /* @__PURE__ */ fe(t, "modelValue", n, {
      defaultValue: t.defaultValue ?? t.falseValue,
      passive: t.modelValue === void 0
    }), l = A(() => s.value === t.trueValue);
    function i() {
      r.value || (s.value = l.value ? t.falseValue : t.trueValue);
    }
    const { forwardRef: u, currentElement: c } = V(), d = kt(c), p = A(() => t.id && c.value ? document.querySelector(`[for="${t.id}"]`)?.innerText : void 0);
    return Bf({
      checked: l,
      toggleCheck: i,
      disabled: r
    }), (f, v) => (m(), _(a(K), E(f.$attrs, {
      id: f.id,
      ref: a(u),
      role: "switch",
      type: f.as === "button" ? "button" : void 0,
      value: f.value,
      "aria-label": f.$attrs["aria-label"] || p.value,
      "aria-checked": l.value,
      "aria-required": f.required,
      "data-state": l.value ? "checked" : "unchecked",
      "data-disabled": a(r) ? "" : void 0,
      "as-child": f.asChild,
      as: f.as,
      disabled: a(r),
      onClick: i,
      onKeydown: Tt(Ce(i, ["prevent"]), ["enter"])
    }), {
      default: y(() => [b(f.$slots, "default", {
        modelValue: a(s),
        checked: l.value
      }), a(d) && f.name ? (m(), _(a(Yt), {
        key: 0,
        type: "checkbox",
        name: f.name,
        disabled: a(r),
        required: f.required,
        value: f.value,
        checked: l.value
      }, null, 8, [
        "name",
        "disabled",
        "required",
        "value",
        "checked"
      ])) : de("v-if", !0)]),
      _: 3
    }, 16, [
      "id",
      "type",
      "value",
      "aria-label",
      "aria-checked",
      "aria-required",
      "data-state",
      "data-disabled",
      "as-child",
      "as",
      "disabled",
      "onKeydown"
    ]));
  }
}), Af = Of, Pf = /* @__PURE__ */ h({
  __name: "SwitchThumb",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(e) {
    const o = qf();
    return V(), (t, n) => (m(), _(a(K), {
      "data-state": a(o).checked.value ? "checked" : "unchecked",
      "data-disabled": a(o).disabled.value ? "" : void 0,
      "as-child": t.asChild,
      as: t.as
    }, {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 8, [
      "data-state",
      "data-disabled",
      "as-child",
      "as"
    ]));
  }
}), Tf = Pf;
const [$n, Ef] = /* @__PURE__ */ oe("TabsRoot");
var Df = /* @__PURE__ */ h({
  __name: "TabsRoot",
  props: {
    defaultValue: {
      type: null,
      required: !1
    },
    orientation: {
      type: String,
      required: !1,
      default: "horizontal"
    },
    dir: {
      type: String,
      required: !1
    },
    activationMode: {
      type: String,
      required: !1,
      default: "automatic"
    },
    modelValue: {
      type: null,
      required: !1
    },
    unmountOnHide: {
      type: Boolean,
      required: !1,
      default: !0
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, n = o, { orientation: r, unmountOnHide: s, dir: l } = ue(t), i = lt(l);
    V();
    const u = /* @__PURE__ */ fe(t, "modelValue", n, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    }), c = P(), d = Kt(/* @__PURE__ */ new Set());
    return Ef({
      modelValue: u,
      changeModelValue: (p) => {
        u.value = p;
      },
      orientation: r,
      dir: i,
      unmountOnHide: s,
      activationMode: t.activationMode,
      baseId: be(void 0, "reka-tabs"),
      tabsList: c,
      contentIds: d,
      registerContent: (p) => {
        d.value = /* @__PURE__ */ new Set([...d.value, p]);
      },
      unregisterContent: (p) => {
        const f = new Set(d.value);
        f.delete(p), d.value = f;
      }
    }), (p, f) => (m(), _(a(K), {
      dir: a(i),
      "data-orientation": a(r),
      "as-child": p.asChild,
      as: p.as
    }, {
      default: y(() => [b(p.$slots, "default", { modelValue: a(u) })]),
      _: 3
    }, 8, [
      "dir",
      "data-orientation",
      "as-child",
      "as"
    ]));
  }
}), kf = Df;
function Ba(e, o) {
  return `${e}-trigger-${o}`;
}
function Oa(e, o) {
  return `${e}-content-${o}`;
}
var $f = /* @__PURE__ */ h({
  __name: "TabsContent",
  props: {
    value: {
      type: [String, Number],
      required: !0
    },
    forceMount: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e, { forwardRef: t } = V(), n = $n(), r = A(() => Ba(n.baseId, o.value)), s = A(() => Oa(n.baseId, o.value)), l = A(() => o.value === n.modelValue.value), i = P(l.value);
    return pe(() => {
      n.registerContent(o.value), requestAnimationFrame(() => {
        i.value = !1;
      });
    }), mo(() => {
      n.unregisterContent(o.value);
    }), (u, c) => (m(), _(a(De), {
      present: u.forceMount || l.value,
      "force-mount": ""
    }, {
      default: y(({ present: d }) => [I(a(K), {
        id: s.value,
        ref: a(t),
        "as-child": u.asChild,
        as: u.as,
        role: "tabpanel",
        "data-state": l.value ? "active" : "inactive",
        "data-orientation": a(n).orientation.value,
        "aria-labelledby": r.value,
        hidden: !d,
        tabindex: "0",
        style: Te({ animationDuration: i.value ? "0s" : void 0 })
      }, {
        default: y(() => [!a(n).unmountOnHide.value || d ? b(u.$slots, "default", { key: 0 }) : de("v-if", !0)]),
        _: 2
      }, 1032, [
        "id",
        "as-child",
        "as",
        "data-state",
        "data-orientation",
        "aria-labelledby",
        "hidden",
        "style"
      ])]),
      _: 3
    }, 8, ["present"]));
  }
}), If = $f, Mf = /* @__PURE__ */ h({
  __name: "TabsList",
  props: {
    loop: {
      type: Boolean,
      required: !1,
      default: !0
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(e) {
    const o = e, { loop: t } = ue(o), { forwardRef: n, currentElement: r } = V(), s = $n();
    return s.tabsList = r, (l, i) => (m(), _(a(On), {
      "as-child": "",
      orientation: a(s).orientation.value,
      dir: a(s).dir.value,
      loop: a(t)
    }, {
      default: y(() => [I(a(K), {
        ref: a(n),
        role: "tablist",
        "as-child": l.asChild,
        as: l.as,
        "aria-orientation": a(s).orientation.value
      }, {
        default: y(() => [b(l.$slots, "default")]),
        _: 3
      }, 8, [
        "as-child",
        "as",
        "aria-orientation"
      ])]),
      _: 3
    }, 8, [
      "orientation",
      "dir",
      "loop"
    ]));
  }
}), Rf = Mf, Ff = /* @__PURE__ */ h({
  __name: "TabsTrigger",
  props: {
    value: {
      type: [String, Number],
      required: !0
    },
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "button"
    }
  },
  setup(e) {
    const o = e, { forwardRef: t } = V(), n = $n(), r = A(() => Ba(n.baseId, o.value)), s = A(() => n.contentIds.value.has(o.value) ? Oa(n.baseId, o.value) : void 0), l = A(() => o.value === n.modelValue.value);
    return (i, u) => (m(), _(a(An), {
      "as-child": "",
      focusable: !i.disabled,
      active: l.value
    }, {
      default: y(() => [I(a(K), {
        id: r.value,
        ref: a(t),
        role: "tab",
        type: i.as === "button" ? "button" : void 0,
        as: i.as,
        "as-child": i.asChild,
        "aria-selected": l.value ? "true" : "false",
        "aria-controls": s.value,
        "data-state": l.value ? "active" : "inactive",
        disabled: i.disabled,
        "data-disabled": i.disabled ? "" : void 0,
        "data-orientation": a(n).orientation.value,
        onMousedown: u[0] || (u[0] = Ce((c) => {
          !i.disabled && c.ctrlKey === !1 ? a(n).changeModelValue(i.value) : c.preventDefault();
        }, ["left"])),
        onKeydown: u[1] || (u[1] = Tt((c) => a(n).changeModelValue(i.value), ["enter", "space"])),
        onFocus: u[2] || (u[2] = () => {
          const c = a(n).activationMode !== "manual";
          !l.value && !i.disabled && c && a(n).changeModelValue(i.value);
        })
      }, {
        default: y(() => [b(i.$slots, "default")]),
        _: 3
      }, 8, [
        "id",
        "type",
        "as",
        "as-child",
        "aria-selected",
        "aria-controls",
        "data-state",
        "disabled",
        "data-disabled",
        "data-orientation"
      ])]),
      _: 3
    }, 8, ["focusable", "active"]));
  }
}), Vf = Ff;
const [To, Nf] = /* @__PURE__ */ oe("TooltipProvider");
var Lf = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "TooltipProvider",
  props: {
    delayDuration: {
      type: Number,
      required: !1,
      default: 700
    },
    skipDelayDuration: {
      type: Number,
      required: !1,
      default: 300
    },
    disableHoverableContent: {
      type: Boolean,
      required: !1,
      default: !1
    },
    disableClosingTrigger: {
      type: Boolean,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    ignoreNonKeyboardFocus: {
      type: Boolean,
      required: !1,
      default: !1
    },
    content: {
      type: Object,
      required: !1
    }
  },
  setup(e) {
    const o = e, { delayDuration: t, skipDelayDuration: n, disableHoverableContent: r, disableClosingTrigger: s, ignoreNonKeyboardFocus: l, disabled: i, content: u } = ue(o);
    V();
    const c = P(!0), d = P(!1), { start: p, stop: f } = Pr(() => {
      c.value = !0;
    }, n, { immediate: !1 });
    return Nf({
      isOpenDelayed: c,
      delayDuration: t,
      onOpen() {
        f(), c.value = !1;
      },
      onClose() {
        p();
      },
      isPointerInTransitRef: d,
      disableHoverableContent: r,
      disableClosingTrigger: s,
      disabled: i,
      ignoreNonKeyboardFocus: l,
      content: u
    }), (v, g) => b(v.$slots, "default");
  }
}), jf = Lf;
const Aa = "tooltip.open", [Eo, zf] = /* @__PURE__ */ oe("TooltipRoot");
var Kf = /* @__PURE__ */ h({
  __name: "TooltipRoot",
  props: {
    defaultOpen: {
      type: Boolean,
      required: !1,
      default: !1
    },
    open: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    delayDuration: {
      type: Number,
      required: !1,
      default: void 0
    },
    disableHoverableContent: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    disableClosingTrigger: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    disabled: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    ignoreNonKeyboardFocus: {
      type: Boolean,
      required: !1,
      default: void 0
    }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const t = e, n = o;
    V();
    const r = To(), s = A(() => t.disableHoverableContent ?? r.disableHoverableContent.value), l = A(() => t.disableClosingTrigger ?? r.disableClosingTrigger.value), i = A(() => t.disabled ?? r.disabled.value), u = A(() => t.delayDuration ?? r.delayDuration.value), c = A(() => t.ignoreNonKeyboardFocus ?? r.ignoreNonKeyboardFocus.value), d = /* @__PURE__ */ fe(t, "open", n, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    });
    re(d, (B) => {
      r.onClose && (B ? (r.onOpen(), document.dispatchEvent(new CustomEvent(Aa))) : r.onClose());
    });
    const p = P(!1), f = P(), v = A(() => d.value ? p.value ? "delayed-open" : "instant-open" : "closed"), { start: g, stop: w } = Pr(() => {
      p.value = !0, d.value = !0;
    }, u, { immediate: !1 });
    function S() {
      w(), p.value = !1, d.value = !0;
    }
    function O() {
      w(), d.value = !1;
    }
    function x() {
      g();
    }
    return zf({
      contentId: "",
      open: d,
      stateAttribute: v,
      trigger: f,
      onTriggerChange(B) {
        f.value = B;
      },
      onTriggerEnter() {
        r.isOpenDelayed.value ? x() : S();
      },
      onTriggerLeave() {
        s.value ? O() : w();
      },
      onOpen: S,
      onClose: O,
      disableHoverableContent: s,
      disableClosingTrigger: l,
      disabled: i,
      ignoreNonKeyboardFocus: c
    }), (B, C) => (m(), _(a(Xt), null, {
      default: y(() => [b(B.$slots, "default", { open: a(d) })]),
      _: 3
    }));
  }
}), Hf = Kf, Wf = /* @__PURE__ */ h({
  __name: "TooltipContentImpl",
  props: {
    ariaLabel: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    as: {
      type: null,
      required: !1
    },
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    align: {
      type: null,
      required: !1
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    }
  },
  emits: ["escapeKeyDown", "pointerDownOutside"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = Eo(), s = To(), { forwardRef: l, currentElement: i } = V(), u = A(() => t.ariaLabel || i.value?.textContent), c = A(() => {
      const { ariaLabel: d, ...p } = t;
      return Er(p, s.content.value ?? {}, {
        side: "top",
        sideOffset: 0,
        align: "center",
        avoidCollisions: !0,
        collisionBoundary: [],
        collisionPadding: 0,
        arrowPadding: 0,
        sticky: "partial",
        hideWhenDetached: !1
      });
    });
    return pe(() => {
      Ue(window, "scroll", (d) => {
        d.target?.contains(r.trigger.value) && r.onClose();
      }, { capture: !0 }), Ue(window, Aa, r.onClose);
    }), (d, p) => (m(), _(a(Ut), {
      "as-child": "",
      "disable-outside-pointer-events": !1,
      onEscapeKeyDown: p[0] || (p[0] = (f) => n("escapeKeyDown", f)),
      onPointerDownOutside: p[1] || (p[1] = (f) => {
        a(r).disableClosingTrigger.value && a(r).trigger.value?.contains(f.target) && f.preventDefault(), n("pointerDownOutside", f);
      }),
      onFocusOutside: p[2] || (p[2] = Ce(() => {
      }, ["prevent"])),
      onDismiss: p[3] || (p[3] = (f) => a(r).onClose())
    }, {
      default: y(() => [I(a(Ao), E({
        ref: a(l),
        "data-state": a(r).stateAttribute.value
      }, {
        ...d.$attrs,
        ...c.value
      }, { style: {
        "--reka-tooltip-content-transform-origin": "var(--reka-popper-transform-origin)",
        "--reka-tooltip-content-available-width": "var(--reka-popper-available-width)",
        "--reka-tooltip-content-available-height": "var(--reka-popper-available-height)",
        "--reka-tooltip-trigger-width": "var(--reka-popper-anchor-width)",
        "--reka-tooltip-trigger-height": "var(--reka-popper-anchor-height)"
      } }), {
        default: y(() => [b(d.$slots, "default"), I(a(bn), {
          id: a(r).contentId,
          role: "tooltip"
        }, {
          default: y(() => [Ot(St(u.value), 1)]),
          _: 1
        }, 8, ["id"])]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }));
  }
}), Pa = Wf, Uf = /* @__PURE__ */ h({
  __name: "TooltipContentHoverable",
  props: {
    ariaLabel: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    },
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    align: {
      type: null,
      required: !1
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    }
  },
  setup(e) {
    const t = ge(e), { forwardRef: n, currentElement: r } = V(), { trigger: s, onClose: l } = Eo(), i = To(), { isPointerInTransit: u, onPointerExit: c } = Gs(s, r);
    return i.isPointerInTransitRef = u, c(() => {
      l();
    }), (d, p) => (m(), _(Pa, E({ ref: a(n) }, a(t)), {
      default: y(() => [b(d.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Gf = Uf, Yf = /* @__PURE__ */ h({
  __name: "TooltipContent",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    ariaLabel: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    },
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    align: {
      type: null,
      required: !1
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    }
  },
  emits: ["escapeKeyDown", "pointerDownOutside"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = Eo(), s = te(t, n), { forwardRef: l } = V();
    return (i, u) => (m(), _(a(De), { present: i.forceMount || a(r).open.value }, {
      default: y(() => [(m(), _(Ie(a(r).disableHoverableContent.value ? Pa : Gf), E({ ref: a(l) }, a(s)), {
        default: y(() => [b(i.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Xf = Yf, Jf = /* @__PURE__ */ h({
  __name: "TooltipPortal",
  props: {
    to: {
      type: null,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    defer: {
      type: Boolean,
      required: !1
    },
    forceMount: {
      type: Boolean,
      required: !1
    }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(Gt), X(Q(o)), {
      default: y(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Zf = Jf, Qf = /* @__PURE__ */ h({
  __name: "TooltipTrigger",
  props: {
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "button"
    }
  },
  setup(e) {
    const o = e, t = Eo(), n = To();
    t.contentId ||= be(void 0, "reka-tooltip-content");
    const { forwardRef: r, currentElement: s } = V(), l = P(!1), i = P(!1), u = A(() => t.disabled.value ? {} : {
      click: w,
      focus: v,
      pointermove: p,
      pointerleave: f,
      pointerdown: d,
      blur: g
    });
    pe(() => {
      t.onTriggerChange(s.value);
    });
    function c() {
      setTimeout(() => {
        l.value = !1;
      }, 1);
    }
    function d() {
      t.open && !t.disableClosingTrigger.value && t.onClose(), l.value = !0, document.addEventListener("pointerup", c, { once: !0 });
    }
    function p(S) {
      S.pointerType !== "touch" && !i.value && !n.isPointerInTransitRef.value && (t.onTriggerEnter(), i.value = !0);
    }
    function f() {
      t.onTriggerLeave(), i.value = !1;
    }
    function v(S) {
      l.value || t.ignoreNonKeyboardFocus.value && !S.target.matches?.(":focus-visible") || t.onOpen();
    }
    function g() {
      t.onClose();
    }
    function w() {
      t.disableClosingTrigger.value || t.onClose();
    }
    return (S, O) => (m(), _(a(So), {
      "as-child": "",
      reference: S.reference
    }, {
      default: y(() => [I(a(K), E({
        ref: a(r),
        "aria-describedby": a(t).open.value ? a(t).contentId : void 0,
        "data-state": a(t).stateAttribute.value,
        as: S.as,
        "as-child": o.asChild,
        "data-grace-area-trigger": ""
      }, Wa(u.value)), {
        default: y(() => [b(S.$slots, "default")]),
        _: 3
      }, 16, [
        "aria-describedby",
        "data-state",
        "as",
        "as-child"
      ])]),
      _: 3
    }, 8, ["reference"]));
  }
}), ev = Qf;
const Em = /* @__PURE__ */ h({
  __name: "Button",
  props: {
    variant: {},
    size: {},
    class: { type: [Boolean, null, String, Object, Array] },
    asChild: { type: Boolean },
    as: { default: "button" }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(K), {
      as: e.as,
      "as-child": e.asChild,
      class: Y(a(L)(a(tv)({ variant: e.variant, size: e.size }), o.class))
    }, {
      default: y(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "class"]));
  }
}), tv = Ht(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        "icon-sm": "size-9",
        "icon-lg": "size-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
), Dm = /* @__PURE__ */ h({
  __name: "Card",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("div", {
      class: Y(
        a(L)(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          o.class
        )
      )
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), km = /* @__PURE__ */ h({
  __name: "CardContent",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("div", {
      class: Y(a(L)("p-6 pt-0", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), $m = /* @__PURE__ */ h({
  __name: "CardDescription",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("p", {
      class: Y(a(L)("text-sm text-muted-foreground", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Im = /* @__PURE__ */ h({
  __name: "CardFooter",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("div", {
      class: Y(a(L)("flex items-center p-6 pt-0", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Mm = /* @__PURE__ */ h({
  __name: "CardHeader",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("div", {
      class: Y(a(L)("flex flex-col gap-y-1.5 p-6", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Rm = /* @__PURE__ */ h({
  __name: "CardTitle",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("h3", {
      class: Y(
        a(L)("text-2xl font-semibold leading-none tracking-tight", o.class)
      )
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Fm = /* @__PURE__ */ h({
  __name: "Input",
  props: {
    defaultValue: {},
    modelValue: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, r = /* @__PURE__ */ fe(t, "modelValue", o, {
      passive: !0,
      defaultValue: t.defaultValue
    });
    return (s, l) => sn((m(), H("input", {
      "onUpdate:modelValue": l[0] || (l[0] = (i) => pt(r) ? r.value = i : null),
      class: Y(a(L)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", t.class))
    }, null, 2)), [
      [br, a(r)]
    ]);
  }
}), Vm = /* @__PURE__ */ h({
  __name: "Dialog",
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const r = te(e, o);
    return (s, l) => (m(), _(a(Mr), X(Q(a(r))), {
      default: y(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Nm = /* @__PURE__ */ h({
  __name: "DialogClose",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(Wt), X(Q(o)), {
      default: y(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
});
const ur = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), ov = (e) => e.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (o, t, n) => n ? n.toUpperCase() : t.toLowerCase()
), nv = (e) => {
  const o = ov(e);
  return o.charAt(0).toUpperCase() + o.slice(1);
}, rv = (...e) => e.filter((o, t, n) => !!o && o.trim() !== "" && n.indexOf(o) === t).join(" ").trim(), dr = (e) => e === "";
var Vt = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
const av = ({
  name: e,
  iconNode: o,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": n,
  strokeWidth: r,
  "stroke-width": s,
  size: l = Vt.width,
  color: i = Vt.stroke,
  ...u
}, { slots: c }) => Me(
  "svg",
  {
    ...Vt,
    ...u,
    width: l,
    height: l,
    stroke: i,
    "stroke-width": dr(t) || dr(n) || t === !0 || n === !0 ? Number(r || s || Vt["stroke-width"]) * 24 / Number(l) : r || s || Vt["stroke-width"],
    class: rv(
      "lucide",
      u.class,
      ...e ? [`lucide-${ur(nv(e))}-icon`, `lucide-${ur(e)}`] : ["lucide-icon"]
    )
  },
  [...o.map((d) => Me(...d)), ...c.default ? [c.default()] : []]
);
const Ve = (e, o) => (t, { slots: n, attrs: r }) => Me(
  av,
  {
    ...r,
    ...t,
    iconNode: o,
    name: e
  },
  n
);
const In = Ve("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const Mn = Ve("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const sv = Ve("chevron-right", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
const lv = Ve("chevron-up", [
  ["path", { d: "m18 15-6-6-6 6", key: "153udz" }]
]);
const iv = Ve("circle-check", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
const Ta = Ve("circle", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
]);
const uv = Ve("info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);
const dv = Ve("loader-circle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const cv = Ve("octagon-x", [
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  [
    "path",
    {
      d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",
      key: "2d38gg"
    }
  ],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
]);
const pv = Ve("triangle-alert", [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
]);
const Do = Ve("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), Lm = /* @__PURE__ */ h({
  __name: "DialogContent",
  props: {
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = J(t, "class"), s = te(r, n);
    return (l, i) => (m(), _(a(hn), null, {
      default: y(() => [
        I(a(gn), { class: "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }),
        I(a(yn), E(a(s), {
          class: a(L)(
            "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
            t.class
          )
        }), {
          default: y(() => [
            b(l.$slots, "default"),
            I(a(Wt), { class: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" }, {
              default: y(() => [
                I(a(Do), { class: "w-4 h-4" }),
                i[0] || (i[0] = ye("span", { class: "sr-only" }, "Close", -1))
              ]),
              _: 1
            })
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), jm = /* @__PURE__ */ h({
  __name: "DialogDescription",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class"), n = ge(t);
    return (r, s) => (m(), _(a(Lr), E(a(n), {
      class: a(L)("text-sm text-muted-foreground", o.class)
    }), {
      default: y(() => [
        b(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), zm = /* @__PURE__ */ h({
  __name: "DialogFooter",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("div", {
      class: Y(
        a(L)(
          "flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2",
          o.class
        )
      )
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Km = /* @__PURE__ */ h({
  __name: "DialogHeader",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("div", {
      class: Y(a(L)("flex flex-col gap-y-1.5 text-center sm:text-left", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Hm = /* @__PURE__ */ h({
  __name: "DialogScrollContent",
  props: {
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = J(t, "class"), s = te(r, n);
    return (l, i) => (m(), _(a(hn), null, {
      default: y(() => [
        I(a(gn), { class: "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }, {
          default: y(() => [
            I(a(yn), E({
              class: a(L)(
                "relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full",
                t.class
              )
            }, a(s), {
              onPointerDownOutside: i[0] || (i[0] = (u) => {
                const c = u.detail.originalEvent, d = c.target;
                (c.offsetX > d.clientWidth || c.offsetY > d.clientHeight) && u.preventDefault();
              })
            }), {
              default: y(() => [
                b(l.$slots, "default"),
                I(a(Wt), { class: "absolute top-3 right-3 p-0.5 transition-colors rounded-md hover:bg-secondary" }, {
                  default: y(() => [
                    I(a(Do), { class: "w-4 h-4" }),
                    i[1] || (i[1] = ye("span", { class: "sr-only" }, "Close", -1))
                  ]),
                  _: 1
                })
              ]),
              _: 3
            }, 16, ["class"])
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
}), Wm = /* @__PURE__ */ h({
  __name: "DialogTitle",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class"), n = ge(t);
    return (r, s) => (m(), _(a(jr), E(a(n), {
      class: a(L)(
        "text-lg font-semibold leading-none tracking-tight",
        o.class
      )
    }), {
      default: y(() => [
        b(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Um = /* @__PURE__ */ h({
  __name: "DialogTrigger",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(zr), X(Q(o)), {
      default: y(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Gm = /* @__PURE__ */ h({
  __name: "Badge",
  props: {
    variant: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("div", {
      class: Y(a(L)(a(fv)({ variant: e.variant }), o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), fv = Ht(
  "inline-flex gap-1 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
), Ym = /* @__PURE__ */ h({
  __name: "Avatar",
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    size: { default: "sm" },
    shape: { default: "circle" }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a($u), {
      class: Y(a(L)(a(vv)({ size: e.size, shape: e.shape }), o.class))
    }, {
      default: y(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), Xm = /* @__PURE__ */ h({
  __name: "AvatarFallback",
  props: {
    delayMs: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(Mu), X(Q(o)), {
      default: y(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Jm = /* @__PURE__ */ h({
  __name: "AvatarImage",
  props: {
    src: {},
    referrerPolicy: {},
    crossOrigin: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(Vu), E(o, { class: "h-full w-full object-cover" }), {
      default: y(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), vv = Ht(
  "inline-flex items-center justify-center font-normal text-foreground select-none shrink-0 bg-secondary overflow-hidden",
  {
    variants: {
      size: {
        sm: "h-10 w-10 text-xs",
        base: "h-16 w-16 text-2xl",
        lg: "h-32 w-32 text-5xl"
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-md"
      }
    }
  }
), Zm = /* @__PURE__ */ h({
  __name: "Separator",
  props: {
    orientation: { default: "horizontal" },
    decorative: { type: Boolean, default: !0 },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(xf), E(a(t), {
      class: a(L)(
        "shrink-0 bg-border",
        o.orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
        o.class
      )
    }), null, 16, ["class"]));
  }
}), mv = /* @__PURE__ */ h({
  __name: "Label",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(tp), E(a(t), {
      class: a(L)(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        o.class
      )
    }), {
      default: y(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Qm = /* @__PURE__ */ h({
  __name: "Select",
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    defaultValue: {},
    modelValue: {},
    by: { type: [String, Function] },
    dir: {},
    multiple: { type: Boolean },
    autocomplete: {},
    disabled: { type: Boolean },
    name: {},
    required: { type: Boolean }
  },
  emits: ["update:modelValue", "update:open"],
  setup(e, { emit: o }) {
    const r = te(e, o);
    return (s, l) => (m(), _(a(Pp), X(Q(a(r))), {
      default: y(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), ey = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "SelectContent",
  props: {
    forceMount: { type: Boolean },
    position: { default: "popper" },
    bodyLock: { type: Boolean },
    side: {},
    sideOffset: {},
    sideFlip: { type: Boolean },
    align: {},
    alignOffset: {},
    alignFlip: { type: Boolean },
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    hideShiftedArrow: { type: Boolean },
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    disableUpdateOnLayoutShift: { type: Boolean },
    prioritizePosition: { type: Boolean },
    reference: {},
    asChild: { type: Boolean },
    as: {},
    disableOutsidePointerEvents: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["closeAutoFocus", "escapeKeyDown", "pointerDownOutside"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = J(t, "class"), s = te(r, n);
    return (l, i) => (m(), _(a(sf), null, {
      default: y(() => [
        I(a(Kp), E({ ...a(s), ...l.$attrs }, {
          class: a(L)(
            "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            e.position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            t.class
          )
        }), {
          default: y(() => [
            I(a(hv)),
            I(a(_f), {
              class: Y(a(L)("p-1", e.position === "popper" && "h-[--reka-select-trigger-height] w-full min-w-[--reka-select-trigger-width]"))
            }, {
              default: y(() => [
                b(l.$slots, "default")
              ]),
              _: 3
            }, 8, ["class"]),
            I(a(gv))
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), ty = /* @__PURE__ */ h({
  __name: "SelectGroup",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(Gp), E({
      class: a(L)("p-1 w-full", o.class)
    }, a(t)), {
      default: y(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), yv = { class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, oy = /* @__PURE__ */ h({
  __name: "SelectItem",
  props: {
    value: {},
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class"), n = ge(t);
    return (r, s) => (m(), _(a(Qp), E(a(n), {
      class: a(L)(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        o.class
      )
    }), {
      default: y(() => [
        ye("span", yv, [
          I(a(tf), null, {
            default: y(() => [
              I(a(In), { class: "h-4 w-4" })
            ]),
            _: 1
          })
        ]),
        I(a(xa), null, {
          default: y(() => [
            b(r.$slots, "default")
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), ny = /* @__PURE__ */ h({
  __name: "SelectItemText",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(xa), X(Q(o)), {
      default: y(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), ry = /* @__PURE__ */ h({
  __name: "SelectLabel",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(rf), {
      class: Y(a(L)("py-1.5 pl-8 pr-2 text-sm font-semibold", o.class))
    }, {
      default: y(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), gv = /* @__PURE__ */ h({
  __name: "SelectScrollDownButton",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class"), n = ge(t);
    return (r, s) => (m(), _(a(df), E(a(n), {
      class: a(L)("flex cursor-default items-center justify-center py-1", o.class)
    }), {
      default: y(() => [
        b(r.$slots, "default", {}, () => [
          I(a(Mn), { class: "h-4 w-4" })
        ])
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), hv = /* @__PURE__ */ h({
  __name: "SelectScrollUpButton",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class"), n = ge(t);
    return (r, s) => (m(), _(a(pf), E(a(n), {
      class: a(L)("flex cursor-default items-center justify-center py-1", o.class)
    }), {
      default: y(() => [
        b(r.$slots, "default", {}, () => [
          I(a(lv), { class: "h-4 w-4" })
        ])
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), ay = /* @__PURE__ */ h({
  __name: "SelectSeparator",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(vf), E(a(t), {
      class: a(L)("-mx-1 my-1 h-px bg-muted", o.class)
    }), null, 16, ["class"]));
  }
}), sy = /* @__PURE__ */ h({
  __name: "SelectTrigger",
  props: {
    disabled: { type: Boolean },
    reference: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class"), n = ge(t);
    return (r, s) => (m(), _(a(yf), E(a(n), {
      class: a(L)(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate text-start",
        o.class
      )
    }), {
      default: y(() => [
        b(r.$slots, "default"),
        I(a(Xp), { "as-child": "" }, {
          default: y(() => [
            I(a(Mn), { class: "w-4 h-4 opacity-50 shrink-0" })
          ]),
          _: 1
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), ly = /* @__PURE__ */ h({
  __name: "SelectValue",
  props: {
    placeholder: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(hf), X(Q(o)), {
      default: y(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), iy = /* @__PURE__ */ h({
  __name: "Checkbox",
  props: {
    defaultValue: {},
    modelValue: {},
    disabled: { type: Boolean },
    value: {},
    id: {},
    trueValue: {},
    falseValue: {},
    asChild: { type: Boolean },
    as: {},
    name: {},
    required: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = J(t, "class"), s = te(r, n);
    return (l, i) => (m(), _(a(Gu), E(a(s), {
      class: a(L)(
        "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        t.class
      )
    }), {
      default: y(() => [
        I(a(Xu), { class: "grid place-content-center text-current" }, {
          default: y(() => [
            b(l.$slots, "default", {}, () => [
              I(a(In), { class: "h-4 w-4" })
            ])
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), uy = /* @__PURE__ */ h({
  __name: "RadioGroup",
  props: {
    modelValue: {},
    defaultValue: {},
    disabled: { type: Boolean },
    orientation: {},
    dir: {},
    loop: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    name: {},
    required: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = J(t, "class"), s = te(r, n);
    return (l, i) => (m(), _(a(gp), E({
      class: a(L)("grid gap-2", t.class)
    }, a(s)), {
      default: y(() => [
        b(l.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), dy = /* @__PURE__ */ h({
  __name: "RadioGroupItem",
  props: {
    id: {},
    value: {},
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    name: {},
    required: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class"), n = ge(t);
    return (r, s) => (m(), _(a(wp), E(a(n), {
      class: a(L)(
        "peer aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        o.class
      )
    }), {
      default: y(() => [
        I(a(Sp), { class: "flex items-center justify-center" }, {
          default: y(() => [
            I(a(Ta), { class: "h-2.5 w-2.5 fill-current text-current" })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), cy = /* @__PURE__ */ h({
  __name: "Switch",
  props: {
    defaultValue: {},
    modelValue: {},
    disabled: { type: Boolean },
    id: {},
    value: {},
    trueValue: {},
    falseValue: {},
    asChild: { type: Boolean },
    as: {},
    name: {},
    required: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = J(t, "class"), s = te(r, n);
    return (l, i) => (m(), _(a(Af), E(a(s), {
      class: a(L)(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        t.class
      )
    }), {
      default: y(() => [
        I(a(Tf), {
          class: Y(a(L)("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5"))
        }, {
          default: y(() => [
            b(l.$slots, "thumb")
          ]),
          _: 3
        }, 8, ["class"])
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), py = /* @__PURE__ */ h({
  __name: "Textarea",
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    defaultValue: {},
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, r = /* @__PURE__ */ fe(t, "modelValue", o, {
      passive: !0,
      defaultValue: t.defaultValue
    });
    return (s, l) => sn((m(), H("textarea", {
      "onUpdate:modelValue": l[0] || (l[0] = (i) => pt(r) ? r.value = i : null),
      class: Y(a(L)("flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", t.class))
    }, null, 2)), [
      [br, a(r)]
    ]);
  }
}), fy = /* @__PURE__ */ h({
  __name: "Slider",
  props: {
    defaultValue: {},
    modelValue: {},
    disabled: { type: Boolean },
    orientation: {},
    dir: {},
    inverted: { type: Boolean },
    min: {},
    max: {},
    step: {},
    minStepsBetweenThumbs: {},
    thumbAlignment: {},
    asChild: { type: Boolean },
    as: {},
    name: {},
    required: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["update:modelValue", "valueCommit"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = J(t, "class"), s = te(r, n);
    return (l, i) => (m(), _(a(cd), E({
      class: a(L)(
        "relative flex w-full touch-none select-none items-center data-[orientation=vertical]:flex-col data-[orientation=vertical]:w-2 data-[orientation=vertical]:h-full",
        t.class
      )
    }, a(s)), {
      default: y(() => [
        I(a(_d), { class: "relative h-2 w-full data-[orientation=vertical]:w-2 grow overflow-hidden rounded-full bg-secondary" }, {
          default: y(() => [
            I(a(vd), { class: "absolute h-full data-[orientation=vertical]:w-full bg-primary" })
          ]),
          _: 1
        }),
        (m(!0), H(qe, null, Bt(e.modelValue, (u, c) => (m(), _(a(hd), {
          key: c,
          class: "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        }))), 128))
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), vy = /* @__PURE__ */ h({
  __name: "Sheet",
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const r = te(e, o);
    return (s, l) => (m(), _(a(Mr), X(Q(a(r))), {
      default: y(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), my = /* @__PURE__ */ h({
  __name: "SheetClose",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(Wt), X(Q(o)), {
      default: y(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), yy = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "SheetContent",
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    side: {},
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = J(t, "class", "side"), s = te(r, n);
    return (l, i) => (m(), _(a(hn), null, {
      default: y(() => [
        I(a(gn), { class: "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }),
        I(a(yn), E({
          class: a(L)(a(bv)({ side: e.side }), t.class)
        }, { ...a(s), ...l.$attrs }), {
          default: y(() => [
            b(l.$slots, "default"),
            I(a(Wt), { class: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary" }, {
              default: y(() => [
                I(a(Do), { class: "w-4 h-4 text-muted-foreground" })
              ]),
              _: 1
            })
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), gy = /* @__PURE__ */ h({
  __name: "SheetDescription",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(Lr), E({
      class: a(L)("text-sm text-muted-foreground", o.class)
    }, a(t)), {
      default: y(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), hy = /* @__PURE__ */ h({
  __name: "SheetFooter",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("div", {
      class: Y(
        a(L)(
          "flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2",
          o.class
        )
      )
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), by = /* @__PURE__ */ h({
  __name: "SheetHeader",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("div", {
      class: Y(
        a(L)("flex flex-col gap-y-2 text-center sm:text-left", o.class)
      )
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), _y = /* @__PURE__ */ h({
  __name: "SheetTitle",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(jr), E({
      class: a(L)("text-lg font-semibold text-foreground", o.class)
    }, a(t)), {
      default: y(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), wy = /* @__PURE__ */ h({
  __name: "SheetTrigger",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(zr), X(Q(o)), {
      default: y(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), bv = Ht(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
), Cy = /* @__PURE__ */ h({
  __name: "Tabs",
  props: {
    defaultValue: {},
    orientation: {},
    dir: {},
    activationMode: {},
    modelValue: {},
    unmountOnHide: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const r = te(e, o);
    return (s, l) => (m(), _(a(kf), X(Q(a(r))), {
      default: y(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Sy = /* @__PURE__ */ h({
  __name: "TabsContent",
  props: {
    value: {},
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(If), E({
      class: a(L)("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", o.class)
    }, a(t)), {
      default: y(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), xy = /* @__PURE__ */ h({
  __name: "TabsList",
  props: {
    loop: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(Rf), E(a(t), {
      class: a(L)(
        "inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        o.class
      )
    }), {
      default: y(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), _v = { class: "truncate" }, qy = /* @__PURE__ */ h({
  __name: "TabsTrigger",
  props: {
    value: {},
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class"), n = ge(t);
    return (r, s) => (m(), _(a(Vf), E(a(n), {
      class: a(L)(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        o.class
      )
    }), {
      default: y(() => [
        ye("span", _v, [
          b(r.$slots, "default")
        ])
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), By = /* @__PURE__ */ h({
  __name: "Accordion",
  props: {
    collapsible: { type: Boolean },
    disabled: { type: Boolean },
    dir: {},
    orientation: {},
    unmountOnHide: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    type: {},
    modelValue: {},
    defaultValue: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const r = te(e, o);
    return (s, l) => (m(), _(a(xl), X(Q(a(r))), {
      default: y(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Oy = /* @__PURE__ */ h({
  __name: "AccordionContent",
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(Pl), E(a(t), { class: "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down" }), {
      default: y(() => [
        ye("div", {
          class: Y(a(L)("pb-4 pt-0", o.class))
        }, [
          b(n.$slots, "default")
        ], 2)
      ]),
      _: 3
    }, 16));
  }
}), Ay = /* @__PURE__ */ h({
  __name: "AccordionItem",
  props: {
    disabled: { type: Boolean },
    value: {},
    unmountOnHide: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class"), n = ge(t);
    return (r, s) => (m(), _(a(Ol), E(a(n), {
      class: a(L)("border-b", o.class)
    }), {
      default: y(() => [
        b(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Py = /* @__PURE__ */ h({
  __name: "AccordionTrigger",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(El), { class: "flex" }, {
      default: y(() => [
        I(a(kl), E(a(t), {
          class: a(L)(
            "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
            o.class
          )
        }), {
          default: y(() => [
            b(n.$slots, "default"),
            b(n.$slots, "icon", {}, () => [
              I(a(Mn), { class: "h-4 w-4 shrink-0 transition-transform duration-200" })
            ])
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), Ty = /* @__PURE__ */ h({
  __name: "DropdownMenu",
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean },
    dir: {},
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const r = te(e, o);
    return (s, l) => (m(), _(a(Ac), X(Q(a(r))), {
      default: y(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), wv = { class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, Ey = /* @__PURE__ */ h({
  __name: "DropdownMenuCheckboxItem",
  props: {
    modelValue: { type: [Boolean, String] },
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["select", "update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = J(t, "class"), s = te(r, n);
    return (l, i) => (m(), _(a(qc), E(a(s), {
      class: a(L)(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        t.class
      )
    }), {
      default: y(() => [
        ye("span", wv, [
          I(a(_a), null, {
            default: y(() => [
              I(a(In), { class: "w-4 h-4" })
            ]),
            _: 1
          })
        ]),
        b(l.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Dy = /* @__PURE__ */ h({
  __name: "DropdownMenuContent",
  props: {
    forceMount: { type: Boolean },
    loop: { type: Boolean },
    side: {},
    sideOffset: { default: 4 },
    sideFlip: { type: Boolean },
    align: {},
    alignOffset: {},
    alignFlip: { type: Boolean },
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    hideShiftedArrow: { type: Boolean },
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    disableUpdateOnLayoutShift: { type: Boolean },
    prioritizePosition: { type: Boolean },
    reference: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "closeAutoFocus"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = J(t, "class"), s = te(r, n);
    return (l, i) => (m(), _(a(Vc), null, {
      default: y(() => [
        I(a(Tc), E(a(s), {
          class: a(L)("z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", t.class)
        }), {
          default: y(() => [
            b(l.$slots, "default")
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), ky = /* @__PURE__ */ h({
  __name: "DropdownMenuGroup",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(Dc), X(Q(o)), {
      default: y(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), $y = /* @__PURE__ */ h({
  __name: "DropdownMenuItem",
  props: {
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] },
    inset: { type: Boolean }
  },
  setup(e) {
    const o = e, t = J(o, "class"), n = ge(t);
    return (r, s) => (m(), _(a($c), E(a(n), {
      class: a(L)(
        "relative flex cursor-default select-none items-center rounded-sm gap-2 px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
        e.inset && "pl-8",
        o.class
      )
    }), {
      default: y(() => [
        b(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Iy = /* @__PURE__ */ h({
  __name: "DropdownMenuLabel",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] },
    inset: { type: Boolean }
  },
  setup(e) {
    const o = e, t = J(o, "class"), n = ge(t);
    return (r, s) => (m(), _(a(Rc), E(a(n), {
      class: a(L)("px-2 py-1.5 text-sm font-semibold", e.inset && "pl-8", o.class)
    }), {
      default: y(() => [
        b(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), My = /* @__PURE__ */ h({
  __name: "DropdownMenuRadioGroup",
  props: {
    modelValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const r = te(e, o);
    return (s, l) => (m(), _(a(Lc), X(Q(a(r))), {
      default: y(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Cv = { class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, Ry = /* @__PURE__ */ h({
  __name: "DropdownMenuRadioItem",
  props: {
    value: {},
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = J(t, "class"), s = te(r, n);
    return (l, i) => (m(), _(a(zc), E(a(s), {
      class: a(L)(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        t.class
      )
    }), {
      default: y(() => [
        ye("span", Cv, [
          I(a(_a), null, {
            default: y(() => [
              I(a(Ta), { class: "h-2 w-2 fill-current" })
            ]),
            _: 1
          })
        ]),
        b(l.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Fy = /* @__PURE__ */ h({
  __name: "DropdownMenuSeparator",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(Hc), E(a(t), {
      class: a(L)("-mx-1 my-1 h-px bg-muted", o.class)
    }), null, 16, ["class"]));
  }
}), Vy = /* @__PURE__ */ h({
  __name: "DropdownMenuShortcut",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("span", {
      class: Y(a(L)("ml-auto text-xs tracking-widest opacity-60", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Ny = /* @__PURE__ */ h({
  __name: "DropdownMenuSub",
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const r = te(e, o);
    return (s, l) => (m(), _(a(Uc), X(Q(a(r))), {
      default: y(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Ly = /* @__PURE__ */ h({
  __name: "DropdownMenuSubContent",
  props: {
    forceMount: { type: Boolean },
    loop: { type: Boolean },
    sideOffset: {},
    sideFlip: { type: Boolean },
    alignOffset: {},
    alignFlip: { type: Boolean },
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    hideShiftedArrow: { type: Boolean },
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    disableUpdateOnLayoutShift: { type: Boolean },
    prioritizePosition: { type: Boolean },
    reference: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "entryFocus", "openAutoFocus", "closeAutoFocus"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = J(t, "class"), s = te(r, n);
    return (l, i) => (m(), _(a(Yc), E(a(s), {
      class: a(L)("z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", t.class)
    }), {
      default: y(() => [
        b(l.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), jy = /* @__PURE__ */ h({
  __name: "DropdownMenuSubTrigger",
  props: {
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class"), n = ge(t);
    return (r, s) => (m(), _(a(Jc), E(a(n), {
      class: a(L)(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
        o.class
      )
    }), {
      default: y(() => [
        b(r.$slots, "default"),
        I(a(sv), { class: "ml-auto h-4 w-4" })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), zy = /* @__PURE__ */ h({
  __name: "DropdownMenuTrigger",
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const t = ge(e);
    return (n, r) => (m(), _(a(Qc), E({ class: "outline-none" }, a(t)), {
      default: y(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Ky = /* @__PURE__ */ h({
  __name: "Popover",
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean },
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const r = te(e, o);
    return (s, l) => (m(), _(a(pc), X(Q(a(r))), {
      default: y(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Hy = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "PopoverContent",
  props: {
    forceMount: { type: Boolean },
    side: {},
    sideOffset: { default: 4 },
    sideFlip: { type: Boolean },
    align: { default: "center" },
    alignOffset: {},
    alignFlip: { type: Boolean },
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    hideShiftedArrow: { type: Boolean },
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    disableUpdateOnLayoutShift: { type: Boolean },
    prioritizePosition: { type: Boolean },
    reference: {},
    asChild: { type: Boolean },
    as: {},
    disableOutsidePointerEvents: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = J(t, "class"), s = te(r, n);
    return (l, i) => (m(), _(a(wc), null, {
      default: y(() => [
        I(a(bc), E({ ...a(s), ...l.$attrs }, {
          class: a(L)(
            "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            t.class
          )
        }), {
          default: y(() => [
            b(l.$slots, "default")
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), Wy = /* @__PURE__ */ h({
  __name: "PopoverTrigger",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(Sc), X(Q(o)), {
      default: y(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Uy = /* @__PURE__ */ h({
  __name: "Tooltip",
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean },
    delayDuration: {},
    disableHoverableContent: { type: Boolean },
    disableClosingTrigger: { type: Boolean },
    disabled: { type: Boolean },
    ignoreNonKeyboardFocus: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const r = te(e, o);
    return (s, l) => (m(), _(a(Hf), X(Q(a(r))), {
      default: y(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Gy = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "TooltipContent",
  props: {
    forceMount: { type: Boolean },
    ariaLabel: {},
    asChild: { type: Boolean },
    as: {},
    side: {},
    sideOffset: { default: 4 },
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["escapeKeyDown", "pointerDownOutside"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = J(t, "class"), s = te(r, n);
    return (l, i) => (m(), _(a(Zf), null, {
      default: y(() => [
        I(a(Xf), E({ ...a(s), ...l.$attrs }, {
          class: a(L)("z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", t.class)
        }), {
          default: y(() => [
            b(l.$slots, "default")
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), Yy = /* @__PURE__ */ h({
  __name: "TooltipProvider",
  props: {
    delayDuration: {},
    skipDelayDuration: {},
    disableHoverableContent: { type: Boolean },
    disableClosingTrigger: { type: Boolean },
    disabled: { type: Boolean },
    ignoreNonKeyboardFocus: { type: Boolean },
    content: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(jf), X(Q(o)), {
      default: y(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Xy = /* @__PURE__ */ h({
  __name: "TooltipTrigger",
  props: {
    reference: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(ev), X(Q(o)), {
      default: y(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Sv = { class: "relative w-full overflow-auto" }, Jy = /* @__PURE__ */ h({
  __name: "Table",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("div", Sv, [
      ye("table", {
        class: Y(a(L)("w-full caption-bottom text-sm", o.class))
      }, [
        b(t.$slots, "default")
      ], 2)
    ]));
  }
}), Zy = /* @__PURE__ */ h({
  __name: "TableBody",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("tbody", {
      class: Y(a(L)("[&_tr:last-child]:border-0", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Qy = /* @__PURE__ */ h({
  __name: "TableCaption",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("caption", {
      class: Y(a(L)("mt-4 text-sm text-muted-foreground", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), xv = /* @__PURE__ */ h({
  __name: "TableCell",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("td", {
      class: Y(
        a(L)(
          "p-4 align-middle [&:has([role=checkbox])]:pr-0",
          o.class
        )
      )
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), qv = /* @__PURE__ */ h({
  __name: "TableRow",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("tr", {
      class: Y(a(L)("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Bv = { class: "flex items-center justify-center py-10" }, eg = /* @__PURE__ */ h({
  __name: "TableEmpty",
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    colspan: { default: 1 }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(qv, null, {
      default: y(() => [
        I(xv, E({
          class: a(L)(
            "p-4 whitespace-nowrap align-middle text-sm text-foreground",
            o.class
          )
        }, a(t)), {
          default: y(() => [
            ye("div", Bv, [
              b(n.$slots, "default")
            ])
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), tg = /* @__PURE__ */ h({
  __name: "TableFooter",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("tfoot", {
      class: Y(a(L)("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), og = /* @__PURE__ */ h({
  __name: "TableHead",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("th", {
      class: Y(a(L)("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), ng = /* @__PURE__ */ h({
  __name: "TableHeader",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("thead", {
      class: Y(a(L)("[&_tr]:border-b", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), rg = /* @__PURE__ */ h({
  __name: "Skeleton",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("div", {
      class: Y(a(L)("animate-pulse rounded-md bg-muted", o.class))
    }, null, 2));
  }
}), ag = /* @__PURE__ */ h({
  __name: "Progress",
  props: {
    modelValue: { default: 0 },
    max: {},
    getValueLabel: {},
    getValueText: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(lp), E(a(t), {
      class: a(L)(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        o.class
      )
    }), {
      default: y(() => [
        I(a(up), {
          class: "h-full w-full flex-1 bg-primary transition-all",
          style: Te(`transform: translateX(-${100 - (o.modelValue ?? 0)}%);`)
        }, null, 8, ["style"])
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), sg = /* @__PURE__ */ h({
  __name: "Alert",
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    variant: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("div", {
      class: Y(a(L)(a(Ov)({ variant: e.variant }), o.class)),
      role: "alert"
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), lg = /* @__PURE__ */ h({
  __name: "AlertDescription",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("div", {
      class: Y(a(L)("text-sm [&_p]:leading-relaxed", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), ig = /* @__PURE__ */ h({
  __name: "AlertTitle",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("h5", {
      class: Y(a(L)("mb-1 font-medium leading-none tracking-tight", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Ov = Ht(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
let rn = 1;
var Av = class {
  subscribers;
  toasts;
  dismissedToasts;
  constructor() {
    this.subscribers = [], this.toasts = [], this.dismissedToasts = /* @__PURE__ */ new Set();
  }
  subscribe = (e) => (this.subscribers.push(e), () => {
    const o = this.subscribers.indexOf(e);
    this.subscribers.splice(o, 1);
  });
  publish = (e) => {
    this.subscribers.forEach((o) => o(e));
  };
  addToast = (e) => {
    this.publish(e), this.toasts = [...this.toasts, e];
  };
  create = (e) => {
    const { message: o, ...t } = e, n = typeof e.id == "number" || e.id && e.id?.length > 0 ? e.id : rn++, r = this.toasts.find((l) => l.id === n), s = e.dismissible === void 0 ? !0 : e.dismissible;
    return this.dismissedToasts.has(n) && this.dismissedToasts.delete(n), r ? this.toasts = this.toasts.map((l) => l.id === n ? (this.publish({
      ...l,
      ...e,
      id: n,
      title: o
    }), {
      ...l,
      ...e,
      id: n,
      dismissible: s,
      title: o
    }) : l) : this.addToast({
      title: o,
      ...t,
      dismissible: s,
      id: n
    }), n;
  };
  dismiss = (e) => (e ? (this.dismissedToasts.add(e), requestAnimationFrame(() => this.subscribers.forEach((o) => o({
    id: e,
    dismiss: !0
  })))) : this.toasts.forEach((o) => {
    this.subscribers.forEach((t) => t({
      id: o.id,
      dismiss: !0
    }));
  }), e);
  message = (e, o) => this.create({
    ...o,
    message: e,
    type: "default"
  });
  error = (e, o) => this.create({
    ...o,
    type: "error",
    message: e
  });
  success = (e, o) => this.create({
    ...o,
    type: "success",
    message: e
  });
  info = (e, o) => this.create({
    ...o,
    type: "info",
    message: e
  });
  warning = (e, o) => this.create({
    ...o,
    type: "warning",
    message: e
  });
  loading = (e, o) => this.create({
    ...o,
    type: "loading",
    message: e
  });
  promise = (e, o) => {
    if (!o) return;
    let t;
    o.loading !== void 0 && (t = this.create({
      ...o,
      promise: e,
      type: "loading",
      message: o.loading,
      description: typeof o.description != "function" ? o.description : void 0
    }));
    const n = Promise.resolve(e instanceof Function ? e() : e);
    let r = t !== void 0, s;
    const l = n.then(async (u) => {
      if (s = ["resolve", u], Mt(u))
        r = !1, this.create({
          id: t,
          type: "default",
          message: u
        });
      else if (Tv(u) && !u.ok) {
        r = !1;
        const d = typeof o.error == "function" ? await o.error(`HTTP error! status: ${u.status}`) : o.error, p = typeof o.description == "function" ? await o.description(`HTTP error! status: ${u.status}`) : o.description, v = typeof d == "object" && !Mt(d) ? d : {
          message: d || "",
          id: t || ""
        };
        this.create({
          id: t,
          type: "error",
          description: p,
          ...v
        });
      } else if (u instanceof Error) {
        r = !1;
        const d = typeof o.error == "function" ? await o.error(u) : o.error, p = typeof o.description == "function" ? await o.description(u) : o.description, v = typeof d == "object" && !Mt(d) ? d : {
          message: d || "",
          id: t || ""
        };
        this.create({
          id: t,
          type: "error",
          description: p,
          ...v
        });
      } else if (o.success !== void 0) {
        r = !1;
        const d = typeof o.success == "function" ? await o.success(u) : o.success, p = typeof o.description == "function" ? await o.description(u) : o.description, v = typeof d == "object" && !Mt(d) ? d : {
          message: d || "",
          id: t || ""
        };
        this.create({
          id: t,
          type: "success",
          description: p,
          ...v
        });
      }
    }).catch(async (u) => {
      if (s = ["reject", u], o.error !== void 0) {
        r = !1;
        const c = typeof o.error == "function" ? await o.error(u) : o.error, d = typeof o.description == "function" ? await o.description(u) : o.description, f = typeof c == "object" && !Mt(c) ? c : {
          message: c || "",
          id: t || ""
        };
        this.create({
          id: t,
          type: "error",
          description: d,
          ...f
        });
      }
    }).finally(() => {
      r && (this.dismiss(t), t = void 0), o.finally?.();
    }), i = () => new Promise((u, c) => l.then(() => s[0] === "reject" ? c(s[1]) : u(s[1])).catch(c));
    return typeof t != "string" && typeof t != "number" ? { unwrap: i } : Object.assign(t, { unwrap: i });
  };
  custom = (e, o) => {
    const t = o?.id || rn++, n = this.toasts.find((s) => s.id === t), r = o?.dismissible === void 0 ? !0 : o.dismissible;
    return this.dismissedToasts.has(t) && this.dismissedToasts.delete(t), n ? this.toasts = this.toasts.map((s) => s.id === t ? (this.publish({
      ...s,
      component: e,
      dismissible: r,
      id: t,
      ...o
    }), {
      ...s,
      component: e,
      dismissible: r,
      id: t,
      ...o
    }) : s) : this.addToast({
      component: e,
      dismissible: r,
      id: t,
      ...o
    }), t;
  };
  getActiveToasts = () => this.toasts.filter((e) => !this.dismissedToasts.has(e.id));
};
const xe = new Av();
function Pv(e, o) {
  const t = o?.id || rn++;
  return xe.create({
    message: e,
    id: t,
    type: "default",
    ...o
  }), t;
}
const Tv = (e) => e && typeof e == "object" && "ok" in e && typeof e.ok == "boolean" && "status" in e && typeof e.status == "number", Ev = Pv, Dv = () => xe.toasts, kv = () => xe.getActiveToasts();
Object.assign(Ev, {
  success: xe.success,
  info: xe.info,
  warning: xe.warning,
  error: xe.error,
  custom: xe.custom,
  message: xe.message,
  promise: xe.promise,
  dismiss: xe.dismiss,
  loading: xe.loading
}, {
  getHistory: Dv,
  getToasts: kv
});
function ao(e) {
  return e.label !== void 0;
}
const $v = 3, Ea = "24px", Da = "16px", cr = 4e3, Iv = 356, Mv = 14, Rv = 45, ka = 200;
function Fv() {
  const e = P(!1);
  return se(() => {
    const o = () => {
      e.value = document.hidden;
    };
    return document.addEventListener("visibilitychange", o), () => window.removeEventListener("visibilitychange", o);
  }), { isDocumentHidden: e };
}
function tt(...e) {
  return e.filter(Boolean).join(" ");
}
function Vv(e) {
  const [o, t] = e.split("-"), n = [];
  return o && n.push(o), t && n.push(t), n;
}
function Nv(e, o) {
  const t = {};
  return [e, o].forEach((n, r) => {
    const s = r === 1, l = s ? "--mobile-offset" : "--offset", i = s ? Da : Ea;
    function u(c) {
      [
        "top",
        "right",
        "bottom",
        "left"
      ].forEach((d) => {
        t[`${l}-${d}`] = typeof c == "number" ? `${c}px` : c;
      });
    }
    typeof n == "number" || typeof n == "string" ? u(n) : typeof n == "object" ? [
      "top",
      "right",
      "bottom",
      "left"
    ].forEach((c) => {
      n[c] === void 0 ? t[`${l}-${c}`] = i : t[`${l}-${c}`] = typeof n[c] == "number" ? `${n[c]}px` : n[c];
    }) : u(i);
  }), t;
}
const Lv = [
  "data-rich-colors",
  "data-styled",
  "data-mounted",
  "data-promise",
  "data-swiped",
  "data-removed",
  "data-visible",
  "data-y-position",
  "data-x-position",
  "data-index",
  "data-front",
  "data-swiping",
  "data-dismissible",
  "data-type",
  "data-invert",
  "data-swipe-out",
  "data-swipe-direction",
  "data-expanded",
  "data-testid"
], jv = [
  "aria-label",
  "data-disabled",
  "data-close-button-position"
];
var zv = /* @__PURE__ */ h({
  __name: "Toast",
  props: {
    toast: {},
    toasts: {},
    index: {},
    swipeDirections: {},
    expanded: { type: Boolean },
    invert: { type: Boolean },
    heights: {},
    gap: {},
    position: {},
    closeButtonPosition: {},
    visibleToasts: {},
    expandByDefault: { type: Boolean },
    closeButton: { type: Boolean },
    interacting: { type: Boolean },
    style: {},
    cancelButtonStyle: {},
    actionButtonStyle: {},
    duration: {},
    class: {},
    unstyled: { type: Boolean },
    descriptionClass: {},
    loadingIcon: {},
    classes: {},
    icons: {},
    closeButtonAriaLabel: {},
    defaultRichColors: { type: Boolean }
  },
  emits: [
    "update:heights",
    "update:height",
    "removeToast"
  ],
  setup(e, { emit: o }) {
    const t = e, n = o, r = P(null), s = P(null), l = P(!1), i = P(!1), u = P(!1), c = P(!1), d = P(!1), p = P(0), f = P(0), v = P(t.toast.duration || t.duration || cr), g = P(null), w = P(null), S = A(() => t.index === 0), O = A(() => t.index + 1 <= t.visibleToasts), x = A(() => t.toast.type), B = A(() => t.toast.dismissible !== !1), C = A(() => t.toast.class || ""), k = A(() => t.descriptionClass || ""), M = A(() => {
      const T = t.toast.position || t.position, ee = t.heights.filter((ae) => ae.position === T).findIndex((ae) => ae.toastId === t.toast.id);
      return ee >= 0 ? ee : 0;
    }), R = A(() => {
      const T = t.toast.position || t.position;
      return t.heights.filter((ee) => ee.position === T).reduce((ee, ae, _e) => _e >= M.value ? ee : ee + ae.height, 0);
    }), N = A(() => M.value * t.gap + R.value || 0), j = A(() => t.toast.closeButton ?? t.closeButton), q = A(() => t.toast.duration || t.duration || cr), F = P(0), D = P(0), W = P(null), G = A(() => t.position.split("-")), $ = A(() => G.value[0]), z = A(() => G.value[1]), U = A(() => typeof t.toast.title != "string"), ne = A(() => typeof t.toast.description != "string"), { isDocumentHidden: ve } = Fv(), Se = A(() => x.value && x.value === "loading");
    pe(() => {
      l.value = !0, v.value = q.value;
    }), se(async () => {
      if (!l.value || !w.value) return;
      await ce();
      const T = w.value, le = T.style.height;
      T.style.height = "auto";
      const ee = T.getBoundingClientRect().height;
      T.style.height = le, f.value = ee, n("update:height", {
        toastId: t.toast.id,
        height: ee,
        position: t.toast.position || t.position
      });
    });
    function me() {
      i.value = !0, p.value = N.value, setTimeout(() => {
        n("removeToast", t.toast);
      }, ka);
    }
    function He() {
      if (Se.value || !B.value) return {};
      me(), t.toast.onDismiss?.(t.toast);
    }
    function bt(T) {
      T.button !== 2 && (Se.value || !B.value || (g.value = /* @__PURE__ */ new Date(), p.value = N.value, T.target.setPointerCapture(T.pointerId), T.target.tagName !== "BUTTON" && (u.value = !0, W.value = {
        x: T.clientX,
        y: T.clientY
      })));
    }
    function Ze() {
      if (c.value || !B.value) return;
      W.value = null;
      const T = Number(w.value?.style.getPropertyValue("--swipe-amount-x").replace("px", "") || 0), le = Number(w.value?.style.getPropertyValue("--swipe-amount-y").replace("px", "") || 0), ee = (/* @__PURE__ */ new Date()).getTime() - (g.value?.getTime() || 0), ae = r.value === "x" ? T : le, _e = Math.abs(ae) / ee;
      if (Math.abs(ae) >= Rv || _e > 0.11) {
        p.value = N.value, t.toast.onDismiss?.(t.toast), r.value === "x" ? s.value = T > 0 ? "right" : "left" : s.value = le > 0 ? "down" : "up", me(), c.value = !0;
        return;
      } else
        w.value?.style.setProperty("--swipe-amount-x", "0px"), w.value?.style.setProperty("--swipe-amount-y", "0px");
      d.value = !1, u.value = !1, r.value = null;
    }
    function $o(T) {
      if (!W.value || !B.value || (window?.getSelection()?.toString()?.length ?? !1)) return;
      const ee = T.clientY - W.value.y, ae = T.clientX - W.value.x, _e = t.swipeDirections ?? Vv(t.position);
      !r.value && (Math.abs(ae) > 1 || Math.abs(ee) > 1) && (r.value = Math.abs(ae) > Math.abs(ee) ? "x" : "y");
      let Pe = {
        x: 0,
        y: 0
      };
      const _t = (ut) => 1 / (1.5 + Math.abs(ut) / 20);
      if (r.value === "y") {
        if (_e.includes("top") || _e.includes("bottom")) if (_e.includes("top") && ee < 0 || _e.includes("bottom") && ee > 0) Pe.y = ee;
        else {
          const ut = ee * _t(ee);
          Pe.y = Math.abs(ut) < Math.abs(ee) ? ut : ee;
        }
      } else if (r.value === "x" && (_e.includes("left") || _e.includes("right")))
        if (_e.includes("left") && ae < 0 || _e.includes("right") && ae > 0) Pe.x = ae;
        else {
          const ut = ae * _t(ae);
          Pe.x = Math.abs(ut) < Math.abs(ae) ? ut : ae;
        }
      (Math.abs(Pe.x) > 0 || Math.abs(Pe.y) > 0) && (d.value = !0), w.value?.style.setProperty("--swipe-amount-x", `${Pe.x}px`), w.value?.style.setProperty("--swipe-amount-y", `${Pe.y}px`);
    }
    pe(() => {
      if (l.value = !0, !w.value) return;
      const T = w.value.getBoundingClientRect().height;
      f.value = T;
      const le = [{
        toastId: t.toast.id,
        height: T,
        position: t.toast.position
      }, ...t.heights];
      n("update:heights", le);
    }), mo(() => {
      w.value && n("removeToast", t.toast);
    }), se((T) => {
      if (t.toast.promise && x.value === "loading" || t.toast.duration === 1 / 0 || t.toast.type === "loading") return;
      let le;
      const ee = () => {
        if (D.value < F.value) {
          const _e = (/* @__PURE__ */ new Date()).getTime() - F.value;
          v.value = v.value - _e;
        }
        D.value = (/* @__PURE__ */ new Date()).getTime();
      }, ae = () => {
        v.value !== 1 / 0 && (F.value = (/* @__PURE__ */ new Date()).getTime(), le = setTimeout(() => {
          t.toast.onAutoClose?.(t.toast), me();
        }, v.value));
      };
      t.expanded || t.interacting || ve.value ? ee() : ae(), T(() => {
        clearTimeout(le);
      });
    }), re(() => t.toast.delete, (T) => {
      T !== void 0 && T && (me(), t.toast.onDismiss?.(t.toast));
    }, { deep: !0 });
    function Rn() {
      u.value = !1, r.value = null, W.value = null;
    }
    return (T, le) => (m(), H("li", {
      tabindex: "0",
      ref_key: "toastRef",
      ref: w,
      class: Y(a(tt)(t.class, C.value, T.classes?.toast, T.toast.classes?.toast, T.classes?.[x.value], T.toast?.classes?.[x.value])),
      "data-sonner-toast": "",
      "data-rich-colors": T.toast.richColors ?? T.defaultRichColors,
      "data-styled": !(T.toast.component || T.toast?.unstyled || T.unstyled),
      "data-mounted": l.value,
      "data-promise": !!T.toast.promise,
      "data-swiped": d.value,
      "data-removed": i.value,
      "data-visible": O.value,
      "data-y-position": $.value,
      "data-x-position": z.value,
      "data-index": T.index,
      "data-front": S.value,
      "data-swiping": u.value,
      "data-dismissible": B.value,
      "data-type": x.value,
      "data-invert": T.toast.invert || T.invert,
      "data-swipe-out": c.value,
      "data-swipe-direction": s.value,
      "data-expanded": !!(T.expanded || T.expandByDefault && l.value),
      "data-testid": T.toast.testId,
      style: Te({
        "--index": T.index,
        "--toasts-before": T.index,
        "--z-index": T.toasts.length - T.index,
        "--offset": `${i.value ? p.value : N.value}px`,
        "--initial-height": T.expandByDefault ? "auto" : `${f.value}px`,
        ...T.style,
        ...t.toast.style
      }),
      onDragend: Rn,
      onPointerdown: bt,
      onPointerup: Ze,
      onPointermove: $o
    }, [j.value && !T.toast.component && x.value !== "loading" ? (m(), H("button", {
      key: 0,
      "aria-label": T.closeButtonAriaLabel || "Close toast",
      "data-disabled": Se.value,
      "data-close-button": "true",
      "data-close-button-position": T.closeButtonPosition,
      class: Y(a(tt)(T.classes?.closeButton, T.toast?.classes?.closeButton)),
      onClick: He
    }, [T.icons?.close ? (m(), _(Ie(T.icons?.close), { key: 0 })) : b(T.$slots, "close-icon", { key: 1 })], 10, jv)) : de("v-if", !0), T.toast.component ? (m(), _(Ie(T.toast.component), E({ key: 1 }, T.toast.componentProps, {
      onCloseToast: He,
      isPaused: T.$props.expanded || T.$props.interacting || a(ve)
    }), null, 16, ["isPaused"])) : (m(), H(qe, { key: 2 }, [
      x.value !== "default" || T.toast.icon || T.toast.promise ? (m(), H("div", {
        key: 0,
        "data-icon": "",
        class: Y(a(tt)(T.classes?.icon, T.toast?.classes?.icon))
      }, [T.toast.icon ? (m(), _(Ie(T.toast.icon), { key: 0 })) : (m(), H(qe, { key: 1 }, [x.value === "loading" ? b(T.$slots, "loading-icon", { key: 0 }) : x.value === "success" ? b(T.$slots, "success-icon", { key: 1 }) : x.value === "error" ? b(T.$slots, "error-icon", { key: 2 }) : x.value === "warning" ? b(T.$slots, "warning-icon", { key: 3 }) : x.value === "info" ? b(T.$slots, "info-icon", { key: 4 }) : de("v-if", !0)], 64))], 2)) : de("v-if", !0),
      ye("div", {
        "data-content": "",
        class: Y(a(tt)(T.classes?.content, T.toast?.classes?.content))
      }, [ye("div", {
        "data-title": "",
        class: Y(a(tt)(T.classes?.title, T.toast.classes?.title))
      }, [U.value ? (m(), _(Ie(T.toast.title), X(E({ key: 0 }, T.toast.componentProps)), null, 16)) : (m(), H(qe, { key: 1 }, [Ot(St(T.toast.title), 1)], 64))], 2), T.toast.description ? (m(), H("div", {
        key: 0,
        "data-description": "",
        class: Y(a(tt)(T.descriptionClass, k.value, T.classes?.description, T.toast.classes?.description))
      }, [ne.value ? (m(), _(Ie(T.toast.description), X(E({ key: 0 }, T.toast.componentProps)), null, 16)) : (m(), H(qe, { key: 1 }, [Ot(St(T.toast.description), 1)], 64))], 2)) : de("v-if", !0)], 2),
      T.toast.cancel ? (m(), H("button", {
        key: 1,
        style: Te(T.toast.cancelButtonStyle || T.cancelButtonStyle),
        class: Y(a(tt)(T.classes?.cancelButton, T.toast.classes?.cancelButton)),
        "data-button": "",
        "data-cancel": "",
        onClick: le[0] || (le[0] = (ee) => {
          a(ao)(T.toast.cancel) && B.value && (T.toast.cancel.onClick?.(ee), me());
        })
      }, St(a(ao)(T.toast.cancel) ? T.toast.cancel?.label : T.toast.cancel), 7)) : de("v-if", !0),
      T.toast.action ? (m(), H("button", {
        key: 2,
        style: Te(T.toast.actionButtonStyle || T.actionButtonStyle),
        class: Y(a(tt)(T.classes?.actionButton, T.toast.classes?.actionButton)),
        "data-button": "",
        "data-action": "",
        onClick: le[1] || (le[1] = (ee) => {
          a(ao)(T.toast.action) && (T.toast.action.onClick?.(ee), !ee.defaultPrevented && me());
        })
      }, St(a(ao)(T.toast.action) ? T.toast.action?.label : T.toast.action), 7)) : de("v-if", !0)
    ], 64))], 46, Lv));
  }
}), Kv = zv, eo = (e, o) => {
  const t = e.__vccOpts || e;
  for (const [n, r] of o) t[n] = r;
  return t;
};
const Hv = {}, Wv = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stoke-width": "1.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function Uv(e, o) {
  return m(), H("svg", Wv, o[0] || (o[0] = [ye("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }, null, -1), ye("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }, null, -1)]));
}
var Gv = /* @__PURE__ */ eo(Hv, [["render", Uv]]);
const Yv = ["data-visible"], Xv = { class: "sonner-spinner" };
var Jv = /* @__PURE__ */ h({
  __name: "Loader",
  props: { visible: { type: Boolean } },
  setup(e) {
    const o = Array(12).fill(0);
    return (t, n) => (m(), H("div", {
      class: "sonner-loading-wrapper",
      "data-visible": t.visible
    }, [ye("div", Xv, [(m(!0), H(qe, null, Bt(a(o), (r) => (m(), H("div", {
      key: `spinner-bar-${r}`,
      class: "sonner-loading-bar"
    }))), 128))])], 8, Yv));
  }
}), Zv = Jv;
const Qv = {}, em = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
};
function tm(e, o) {
  return m(), H("svg", em, o[0] || (o[0] = [ye("path", {
    "fill-rule": "evenodd",
    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
    "clip-rule": "evenodd"
  }, null, -1)]));
}
var om = /* @__PURE__ */ eo(Qv, [["render", tm]]);
const nm = {}, rm = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
};
function am(e, o) {
  return m(), H("svg", rm, o[0] || (o[0] = [ye("path", {
    "fill-rule": "evenodd",
    d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
    "clip-rule": "evenodd"
  }, null, -1)]));
}
var sm = /* @__PURE__ */ eo(nm, [["render", am]]);
const lm = {}, im = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "currentColor",
  height: "20",
  width: "20"
};
function um(e, o) {
  return m(), H("svg", im, o[0] || (o[0] = [ye("path", {
    "fill-rule": "evenodd",
    d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
    "clip-rule": "evenodd"
  }, null, -1)]));
}
var dm = /* @__PURE__ */ eo(lm, [["render", um]]);
const cm = {}, pm = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
};
function fm(e, o) {
  return m(), H("svg", pm, o[0] || (o[0] = [ye("path", {
    "fill-rule": "evenodd",
    d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
    "clip-rule": "evenodd"
  }, null, -1)]));
}
var vm = /* @__PURE__ */ eo(cm, [["render", fm]]);
const mm = ["aria-label"], ym = [
  "data-sonner-theme",
  "dir",
  "data-theme",
  "data-rich-colors",
  "data-y-position",
  "data-x-position"
], gm = typeof window < "u" && typeof document < "u";
function hm() {
  if (typeof window > "u" || typeof document > "u") return "ltr";
  const e = document.documentElement.getAttribute("dir");
  return e === "auto" || !e ? window.getComputedStyle(document.documentElement).direction : e;
}
var bm = /* @__PURE__ */ h({
  name: "Toaster",
  inheritAttrs: !1,
  __name: "Toaster",
  props: {
    id: {},
    invert: {
      type: Boolean,
      default: !1
    },
    theme: { default: "light" },
    position: { default: "bottom-right" },
    closeButtonPosition: { default: "top-left" },
    hotkey: { default: () => ["altKey", "KeyT"] },
    richColors: {
      type: Boolean,
      default: !1
    },
    expand: {
      type: Boolean,
      default: !1
    },
    duration: {},
    gap: { default: Mv },
    visibleToasts: { default: $v },
    closeButton: {
      type: Boolean,
      default: !1
    },
    toastOptions: { default: () => ({}) },
    class: { default: "" },
    style: {},
    offset: { default: Ea },
    mobileOffset: { default: Da },
    dir: { default: "auto" },
    swipeDirections: {},
    icons: {},
    containerAriaLabel: { default: "Notifications" }
  },
  setup(e) {
    const o = e, t = Ua(), n = P([]), r = A(() => o.id ? n.value.filter((q) => q.toasterId === o.id) : n.value.filter((q) => !q.toasterId));
    function s(q, F) {
      return r.value.filter((D) => !D.position && F === 0 || D.position === q);
    }
    const l = A(() => {
      const q = r.value.filter((F) => F.position).map((F) => F.position);
      return q.length > 0 ? Array.from(new Set([o.position].concat(q))) : [o.position];
    }), i = A(() => {
      const q = {};
      return l.value.forEach((F) => {
        q[F] = n.value.filter((D) => D.position === F);
      }), q;
    }), u = P([]), c = P({}), d = P(!1);
    se(() => {
      l.value.forEach((q) => {
        q in c.value || (c.value[q] = !1);
      });
    });
    const p = P(o.theme !== "system" ? o.theme : typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), f = P(null), v = P(null), g = P(!1), w = o.hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
    function S(q) {
      n.value.find((F) => F.id === q.id)?.delete || xe.dismiss(q.id), n.value = n.value.filter(({ id: F }) => F !== q.id), setTimeout(() => {
        n.value.find((F) => F.id === q.id) || (u.value = u.value.filter((F) => F.toastId !== q.id));
      }, ka + 50);
    }
    function O(q) {
      g.value && !q.currentTarget?.contains?.(q.relatedTarget) && (g.value = !1, v.value && (v.value.focus({ preventScroll: !0 }), v.value = null));
    }
    function x(q) {
      q.target instanceof HTMLElement && q.target.dataset.dismissible === "false" || g.value || (g.value = !0, v.value = q.relatedTarget);
    }
    function B(q) {
      q.target && q.target instanceof HTMLElement && q.target.dataset.dismissible === "false" || (d.value = !0);
    }
    se((q) => {
      const F = xe.subscribe((D) => {
        if (D.dismiss) {
          requestAnimationFrame(() => {
            n.value = n.value.map((W) => W.id === D.id ? {
              ...W,
              delete: !0
            } : W);
          });
          return;
        }
        ce(() => {
          const W = n.value.findIndex((G) => G.id === D.id);
          W !== -1 ? n.value = [
            ...n.value.slice(0, W),
            {
              ...n.value[W],
              ...D
            },
            ...n.value.slice(W + 1)
          ] : n.value = [D, ...n.value];
        });
      });
      q(F);
    }), se((q) => {
      if (typeof window > "u") return;
      if (o.theme !== "system") {
        p.value = o.theme;
        return;
      }
      const F = window.matchMedia("(prefers-color-scheme: dark)"), D = (G) => {
        p.value = G ? "dark" : "light";
      };
      D(F.matches);
      const W = (G) => {
        D(G.matches);
      };
      try {
        F.addEventListener("change", W);
      } catch {
        F.addListener(W);
      }
      q(() => {
        try {
          F.removeEventListener("change", W);
        } catch {
          F.removeListener(W);
        }
      });
    }), se(() => {
      f.value && v.value && (v.value.focus({ preventScroll: !0 }), v.value = null, g.value = !1);
    }), se(() => {
      n.value.length <= 1 && Object.keys(c.value).forEach((q) => {
        c.value[q] = !1;
      });
    }), se((q) => {
      function F(D) {
        const W = o.hotkey.every((z) => D[z] || D.code === z), G = Array.isArray(f.value) ? f.value[0] : f.value;
        W && (l.value.forEach((z) => {
          c.value[z] = !0;
        }), G?.focus());
        const $ = document.activeElement === f.value || G?.contains(document.activeElement);
        D.code === "Escape" && $ && l.value.forEach((z) => {
          c.value[z] = !1;
        });
      }
      gm && (document.addEventListener("keydown", F), q(() => {
        document.removeEventListener("keydown", F);
      }));
    });
    function C(q) {
      const F = q.currentTarget, D = F.getAttribute("data-y-position") + "-" + F.getAttribute("data-x-position");
      c.value[D] = !0;
    }
    function k(q) {
      if (!d.value) {
        const F = q.currentTarget, D = F.getAttribute("data-y-position") + "-" + F.getAttribute("data-x-position");
        c.value[D] = !1;
      }
    }
    function M() {
      Object.keys(c.value).forEach((q) => {
        c.value[q] = !1;
      });
    }
    function R() {
      d.value = !1;
    }
    function N(q) {
      u.value = q;
    }
    function j(q) {
      const F = u.value.findIndex((D) => D.toastId === q.toastId);
      if (F !== -1) u.value[F] = q;
      else {
        const D = u.value.findIndex((W) => W.position === q.position);
        D !== -1 ? u.value.splice(D, 0, q) : u.value.unshift(q);
      }
    }
    return (q, F) => (m(), H(qe, null, [de(" Remove item from normal navigation flow, only available via hotkey "), ye("section", {
      "aria-label": `${q.containerAriaLabel} ${a(w)}`,
      tabIndex: -1,
      "aria-live": "polite",
      "aria-relevant": "additions text",
      "aria-atomic": "false"
    }, [(m(!0), H(qe, null, Bt(l.value, (D, W) => (m(), H("ol", E({
      key: D,
      ref_for: !0,
      ref_key: "listRef",
      ref: f,
      "data-sonner-toaster": "",
      "data-sonner-theme": p.value,
      class: o.class,
      dir: q.dir === "auto" ? hm() : q.dir,
      tabIndex: -1,
      "data-theme": q.theme,
      "data-rich-colors": q.richColors,
      "data-y-position": D.split("-")[0],
      "data-x-position": D.split("-")[1],
      style: {
        "--front-toast-height": `${u.value[0]?.height || 0}px`,
        "--width": `${a(Iv)}px`,
        "--gap": `${q.gap}px`,
        ...q.style,
        ...a(t).style,
        ...a(Nv)(q.offset, q.mobileOffset)
      }
    }, { ref_for: !0 }, q.$attrs, {
      onBlur: O,
      onFocus: x,
      onMouseenter: C,
      onMousemove: C,
      onMouseleave: k,
      onDragend: M,
      onPointerdown: B,
      onPointerup: R
    }), [(m(!0), H(qe, null, Bt(s(D, W), (G, $) => (m(), _(Kv, {
      key: G.id,
      heights: u.value,
      icons: q.icons,
      index: $,
      toast: G,
      defaultRichColors: q.richColors,
      duration: q.toastOptions?.duration ?? q.duration,
      class: Y(q.toastOptions?.class ?? ""),
      descriptionClass: q.toastOptions?.descriptionClass,
      invert: q.invert,
      visibleToasts: q.visibleToasts,
      closeButton: q.toastOptions?.closeButton ?? q.closeButton,
      interacting: d.value,
      position: D,
      closeButtonPosition: q.toastOptions?.closeButtonPosition ?? q.closeButtonPosition,
      style: Te(q.toastOptions?.style),
      unstyled: q.toastOptions?.unstyled,
      classes: q.toastOptions?.classes,
      cancelButtonStyle: q.toastOptions?.cancelButtonStyle,
      actionButtonStyle: q.toastOptions?.actionButtonStyle,
      "close-button-aria-label": q.toastOptions?.closeButtonAriaLabel,
      toasts: i.value[D],
      expandByDefault: q.expand,
      gap: q.gap,
      expanded: c.value[D] || !1,
      swipeDirections: o.swipeDirections,
      "onUpdate:heights": N,
      "onUpdate:height": j,
      onRemoveToast: S
    }, {
      "close-icon": y(() => [b(q.$slots, "close-icon", {}, () => [I(Gv)])]),
      "loading-icon": y(() => [b(q.$slots, "loading-icon", {}, () => [I(Zv, { visible: G.type === "loading" }, null, 8, ["visible"])])]),
      "success-icon": y(() => [b(q.$slots, "success-icon", {}, () => [I(om)])]),
      "error-icon": y(() => [b(q.$slots, "error-icon", {}, () => [I(vm)])]),
      "warning-icon": y(() => [b(q.$slots, "warning-icon", {}, () => [I(dm)])]),
      "info-icon": y(() => [b(q.$slots, "info-icon", {}, () => [I(sm)])]),
      _: 2
    }, 1032, [
      "heights",
      "icons",
      "index",
      "toast",
      "defaultRichColors",
      "duration",
      "class",
      "descriptionClass",
      "invert",
      "visibleToasts",
      "closeButton",
      "interacting",
      "position",
      "closeButtonPosition",
      "style",
      "unstyled",
      "classes",
      "cancelButtonStyle",
      "actionButtonStyle",
      "close-button-aria-label",
      "toasts",
      "expandByDefault",
      "gap",
      "expanded",
      "swipeDirections"
    ]))), 128))], 16, ym))), 128))], 8, mm)], 2112));
  }
}), _m = bm;
const ug = /* @__PURE__ */ h({
  __name: "Sonner",
  props: {
    id: {},
    invert: { type: Boolean },
    theme: {},
    position: {},
    closeButtonPosition: {},
    hotkey: {},
    richColors: { type: Boolean },
    expand: { type: Boolean },
    duration: {},
    gap: {},
    visibleToasts: {},
    closeButton: { type: Boolean },
    toastOptions: {},
    class: {},
    style: {},
    offset: {},
    mobileOffset: {},
    dir: {},
    swipeDirections: {},
    icons: {},
    containerAriaLabel: {}
  },
  setup(e) {
    const t = J(e, "toastOptions");
    return (n, r) => (m(), _(a(_m), E({
      class: "toaster group",
      "toast-options": {
        classes: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      }
    }, a(t)), {
      "success-icon": y(() => [
        I(a(iv), { class: "size-4" })
      ]),
      "info-icon": y(() => [
        I(a(uv), { class: "size-4" })
      ]),
      "warning-icon": y(() => [
        I(a(pv), { class: "size-4" })
      ]),
      "error-icon": y(() => [
        I(a(cv), { class: "size-4" })
      ]),
      "loading-icon": y(() => [
        ye("div", null, [
          I(a(dv), { class: "size-4 animate-spin" })
        ])
      ]),
      "close-icon": y(() => [
        I(a(Do), { class: "size-4" })
      ]),
      _: 1
    }, 16));
  }
});
const wm = /* @__PURE__ */ Symbol("vee-validate-form"), Cm = /* @__PURE__ */ Symbol("vee-validate-field-instance");
function Sm(e, o, t) {
  return o.slots.default ? typeof e == "string" || !e ? o.slots.default(t()) : {
    default: () => {
      var n, r;
      return (r = (n = o.slots).default) === null || r === void 0 ? void 0 : r.call(n, t());
    }
  } : o.slots.default;
}
const xm = {
  generateMessage: ({ field: e }) => `${e} is not valid.`,
  bails: !0,
  validateOnBlur: !0,
  validateOnChange: !0,
  validateOnInput: !1,
  validateOnModelUpdate: !0
};
Object.assign({}, xm);
const qm = /* @__PURE__ */ h({
  name: "ErrorMessage",
  props: {
    as: {
      type: String,
      default: void 0
    },
    name: {
      type: String,
      required: !0
    }
  },
  setup(e, o) {
    const t = Nt(wm, void 0), n = A(() => t?.errors.value[e.name]);
    function r() {
      return {
        message: n.value
      };
    }
    return () => {
      if (!n.value)
        return;
      const s = e.as ? Ie(e.as) : e.as, l = Sm(s, o, r), i = Object.assign({ role: "alert" }, o.attrs);
      return !s && (Array.isArray(l) || !l) && l?.length ? l : (Array.isArray(l) || !l) && !l?.length ? Me(s || "span", i, n.value) : Me(s, i, l);
    };
  }
}), Bm = qm, $a = /* @__PURE__ */ Symbol();
function ko() {
  const e = Nt(Cm), o = Nt($a);
  if (!e)
    throw new Error("useFormField should be used within <FormField>");
  const { name: t, errorMessage: n, meta: r } = e, s = o, l = {
    valid: A(() => r.valid),
    isDirty: A(() => r.dirty),
    isTouched: A(() => r.touched),
    error: n
  };
  return {
    id: s,
    name: t,
    formItemId: `${s}-form-item`,
    formDescriptionId: `${s}-form-item-description`,
    formMessageId: `${s}-form-item-message`,
    ...l
  };
}
const dg = /* @__PURE__ */ h({
  __name: "FormControl",
  setup(e) {
    const { error: o, formItemId: t, formDescriptionId: n, formMessageId: r } = ko();
    return (s, l) => (m(), _(a(io), {
      id: a(t),
      "aria-describedby": a(o) ? `${a(n)} ${a(r)}` : `${a(n)}`,
      "aria-invalid": !!a(o)
    }, {
      default: y(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 8, ["id", "aria-describedby", "aria-invalid"]));
  }
}), Om = ["id"], cg = /* @__PURE__ */ h({
  __name: "FormDescription",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, { formDescriptionId: t } = ko();
    return (n, r) => (m(), H("p", {
      id: a(t),
      class: Y(a(L)("text-sm text-muted-foreground", o.class))
    }, [
      b(n.$slots, "default")
    ], 10, Om));
  }
}), pg = /* @__PURE__ */ h({
  __name: "FormItem",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = be();
    return an($a, t), (n, r) => (m(), H("div", {
      class: Y(a(L)("space-y-2", o.class))
    }, [
      b(n.$slots, "default")
    ], 2));
  }
}), fg = /* @__PURE__ */ h({
  __name: "FormLabel",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, { error: t, formItemId: n } = ko();
    return (r, s) => (m(), _(mv, {
      class: Y(a(L)(
        a(t) && "text-destructive",
        o.class
      )),
      for: a(n)
    }, {
      default: y(() => [
        b(r.$slots, "default")
      ]),
      _: 3
    }, 8, ["class", "for"]));
  }
}), vg = /* @__PURE__ */ h({
  __name: "FormMessage",
  setup(e) {
    const { name: o, formMessageId: t } = ko();
    return (n, r) => (m(), _(a(Bm), {
      id: a(t),
      as: "p",
      name: we(a(o)),
      class: "text-sm font-medium text-destructive"
    }, null, 8, ["id", "name"]));
  }
});
export {
  By as Accordion,
  Oy as AccordionContent,
  Ay as AccordionItem,
  Py as AccordionTrigger,
  sg as Alert,
  lg as AlertDescription,
  ig as AlertTitle,
  Ym as Avatar,
  Xm as AvatarFallback,
  Jm as AvatarImage,
  Gm as Badge,
  Em as Button,
  Dm as Card,
  km as CardContent,
  $m as CardDescription,
  Im as CardFooter,
  Mm as CardHeader,
  Rm as CardTitle,
  iy as Checkbox,
  Vm as Dialog,
  Nm as DialogClose,
  Lm as DialogContent,
  jm as DialogDescription,
  zm as DialogFooter,
  Km as DialogHeader,
  Hm as DialogScrollContent,
  Wm as DialogTitle,
  Um as DialogTrigger,
  Ty as DropdownMenu,
  Ey as DropdownMenuCheckboxItem,
  Dy as DropdownMenuContent,
  ky as DropdownMenuGroup,
  $y as DropdownMenuItem,
  Iy as DropdownMenuLabel,
  My as DropdownMenuRadioGroup,
  Ry as DropdownMenuRadioItem,
  Fy as DropdownMenuSeparator,
  Vy as DropdownMenuShortcut,
  Ny as DropdownMenuSub,
  Ly as DropdownMenuSubContent,
  jy as DropdownMenuSubTrigger,
  zy as DropdownMenuTrigger,
  dg as FormControl,
  cg as FormDescription,
  pg as FormItem,
  fg as FormLabel,
  vg as FormMessage,
  Fm as Input,
  mv as Label,
  Ky as Popover,
  Hy as PopoverContent,
  Wy as PopoverTrigger,
  ag as Progress,
  uy as RadioGroup,
  dy as RadioGroupItem,
  Qm as Select,
  ey as SelectContent,
  ty as SelectGroup,
  oy as SelectItem,
  ny as SelectItemText,
  ry as SelectLabel,
  gv as SelectScrollDownButton,
  hv as SelectScrollUpButton,
  ay as SelectSeparator,
  sy as SelectTrigger,
  ly as SelectValue,
  Zm as Separator,
  vy as Sheet,
  my as SheetClose,
  yy as SheetContent,
  gy as SheetDescription,
  hy as SheetFooter,
  by as SheetHeader,
  _y as SheetTitle,
  wy as SheetTrigger,
  rg as Skeleton,
  fy as Slider,
  ug as Sonner,
  cy as Switch,
  Jy as Table,
  Zy as TableBody,
  Qy as TableCaption,
  xv as TableCell,
  eg as TableEmpty,
  tg as TableFooter,
  og as TableHead,
  ng as TableHeader,
  qv as TableRow,
  Cy as Tabs,
  Sy as TabsContent,
  xy as TabsList,
  qy as TabsTrigger,
  py as Textarea,
  Uy as Tooltip,
  Gy as TooltipContent,
  Yy as TooltipProvider,
  Xy as TooltipTrigger,
  vv as avatarVariant,
  fv as badgeVariants,
  tv as buttonVariants,
  L as cn,
  ko as useFormField
};
