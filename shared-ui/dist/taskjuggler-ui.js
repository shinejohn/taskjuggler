import * as Vn from "vue";
import { inject as Nt, provide as sn, computed as A, shallowRef as Kt, shallowReadonly as ct, isRef as pt, reactive as so, unref as a, watch as re, customRef as Ma, toValue as we, getCurrentScope as fr, onScopeDispose as vr, onBeforeUnmount as mo, effectScope as mr, watchEffect as se, readonly as Ra, getCurrentInstance as vt, toRefs as ue, ref as P, nextTick as ce, onMounted as pe, Fragment as qe, toHandlerKey as Fa, camelize as yr, onUpdated as Va, triggerRef as Na, toRef as La, onUnmounted as Xe, defineComponent as h, h as Me, Comment as ja, mergeProps as E, cloneVNode as za, openBlock as m, createBlock as _, withCtx as g, renderSlot as b, createVNode as F, createCommentVNode as de, withKeys as Tt, normalizeStyle as Te, withModifiers as Ce, Teleport as gr, normalizeProps as X, guardReactiveProps as Q, markRaw as Ka, createElementBlock as H, renderList as Bt, watchPostEffect as hr, mergeDefaults as br, withDirectives as ln, vShow as Ha, resolveDynamicComponent as $e, toRaw as Wa, createElementVNode as ye, createTextVNode as Ot, toDisplayString as St, toHandlers as Ua, normalizeClass as Y, vModelText as _r, useAttrs as Ga, isVNode as Mt } from "vue";
function wr(e) {
  var o, t, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var r = e.length;
    for (o = 0; o < r; o++) e[o] && (t = wr(e[o])) && (n && (n += " "), n += t);
  } else for (t in e) e[t] && (n && (n += " "), n += t);
  return n;
}
function Cr() {
  for (var e, o, t = 0, n = "", r = arguments.length; t < r; t++) (e = arguments[t]) && (o = wr(e)) && (n && (n += " "), n += o);
  return n;
}
const un = "-", Ya = (e) => {
  const o = Ja(e), {
    conflictingClassGroups: t,
    conflictingClassGroupModifiers: n
  } = e;
  return {
    getClassGroupId: (l) => {
      const i = l.split(un);
      return i[0] === "" && i.length !== 1 && i.shift(), Sr(i, o) || Xa(l);
    },
    getConflictingClassGroupIds: (l, i) => {
      const u = t[l] || [];
      return i && n[l] ? [...u, ...n[l]] : u;
    }
  };
}, Sr = (e, o) => {
  if (e.length === 0)
    return o.classGroupId;
  const t = e[0], n = o.nextPart.get(t), r = n ? Sr(e.slice(1), n) : void 0;
  if (r)
    return r;
  if (o.validators.length === 0)
    return;
  const s = e.join(un);
  return o.validators.find(({
    validator: l
  }) => l(s))?.classGroupId;
}, Nn = /^\[(.+)\]$/, Xa = (e) => {
  if (Nn.test(e)) {
    const o = Nn.exec(e)[1], t = o?.substring(0, o.indexOf(":"));
    if (t)
      return "arbitrary.." + t;
  }
}, Ja = (e) => {
  const {
    theme: o,
    prefix: t
  } = e, n = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Qa(Object.entries(e.classGroups), t).forEach(([s, l]) => {
    Ho(l, n, s, o);
  }), n;
}, Ho = (e, o, t, n) => {
  e.forEach((r) => {
    if (typeof r == "string") {
      const s = r === "" ? o : Ln(o, r);
      s.classGroupId = t;
      return;
    }
    if (typeof r == "function") {
      if (Za(r)) {
        Ho(r(n), o, t, n);
        return;
      }
      o.validators.push({
        validator: r,
        classGroupId: t
      });
      return;
    }
    Object.entries(r).forEach(([s, l]) => {
      Ho(l, Ln(o, s), t, n);
    });
  });
}, Ln = (e, o) => {
  let t = e;
  return o.split(un).forEach((n) => {
    t.nextPart.has(n) || t.nextPart.set(n, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), t = t.nextPart.get(n);
  }), t;
}, Za = (e) => e.isThemeGetter, Qa = (e, o) => o ? e.map(([t, n]) => {
  const r = n.map((s) => typeof s == "string" ? o + s : typeof s == "object" ? Object.fromEntries(Object.entries(s).map(([l, i]) => [o + l, i])) : s);
  return [t, r];
}) : e, es = (e) => {
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
}, xr = "!", ts = (e) => {
  const {
    separator: o,
    experimentalParseClassName: t
  } = e, n = o.length === 1, r = o[0], s = o.length, l = (i) => {
    const u = [];
    let d = 0, c = 0, p;
    for (let S = 0; S < i.length; S++) {
      let O = i[S];
      if (d === 0) {
        if (O === r && (n || i.slice(S, S + s) === o)) {
          u.push(i.slice(c, S)), c = S + s;
          continue;
        }
        if (O === "/") {
          p = S;
          continue;
        }
      }
      O === "[" ? d++ : O === "]" && d--;
    }
    const f = u.length === 0 ? i : i.substring(c), v = f.startsWith(xr), y = v ? f.substring(1) : f, w = p && p > c ? p - c : void 0;
    return {
      modifiers: u,
      hasImportantModifier: v,
      baseClassName: y,
      maybePostfixModifierPosition: w
    };
  };
  return t ? (i) => t({
    className: i,
    parseClassName: l
  }) : l;
}, os = (e) => {
  if (e.length <= 1)
    return e;
  const o = [];
  let t = [];
  return e.forEach((n) => {
    n[0] === "[" ? (o.push(...t.sort(), n), t = []) : t.push(n);
  }), o.push(...t.sort()), o;
}, ns = (e) => ({
  cache: es(e.cacheSize),
  parseClassName: ts(e),
  ...Ya(e)
}), rs = /\s+/, as = (e, o) => {
  const {
    parseClassName: t,
    getClassGroupId: n,
    getConflictingClassGroupIds: r
  } = o, s = [], l = e.trim().split(rs);
  let i = "";
  for (let u = l.length - 1; u >= 0; u -= 1) {
    const d = l[u], {
      modifiers: c,
      hasImportantModifier: p,
      baseClassName: f,
      maybePostfixModifierPosition: v
    } = t(d);
    let y = !!v, w = n(y ? f.substring(0, v) : f);
    if (!w) {
      if (!y) {
        i = d + (i.length > 0 ? " " + i : i);
        continue;
      }
      if (w = n(f), !w) {
        i = d + (i.length > 0 ? " " + i : i);
        continue;
      }
      y = !1;
    }
    const S = os(c).join(":"), O = p ? S + xr : S, q = O + w;
    if (s.includes(q))
      continue;
    s.push(q);
    const B = r(w, y);
    for (let C = 0; C < B.length; ++C) {
      const $ = B[C];
      s.push(O + $);
    }
    i = d + (i.length > 0 ? " " + i : i);
  }
  return i;
};
function ss() {
  let e = 0, o, t, n = "";
  for (; e < arguments.length; )
    (o = arguments[e++]) && (t = qr(o)) && (n && (n += " "), n += t);
  return n;
}
const qr = (e) => {
  if (typeof e == "string")
    return e;
  let o, t = "";
  for (let n = 0; n < e.length; n++)
    e[n] && (o = qr(e[n])) && (t && (t += " "), t += o);
  return t;
};
function ls(e, ...o) {
  let t, n, r, s = l;
  function l(u) {
    const d = o.reduce((c, p) => p(c), e());
    return t = ns(d), n = t.cache.get, r = t.cache.set, s = i, i(u);
  }
  function i(u) {
    const d = n(u);
    if (d)
      return d;
    const c = as(u, t);
    return r(u, c), c;
  }
  return function() {
    return s(ss.apply(null, arguments));
  };
}
const ie = (e) => {
  const o = (t) => t[e] || [];
  return o.isThemeGetter = !0, o;
}, Br = /^\[(?:([a-z-]+):)?(.+)\]$/i, is = /^\d+\/\d+$/, us = /* @__PURE__ */ new Set(["px", "full", "screen"]), ds = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, cs = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, ps = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, fs = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, vs = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, We = (e) => xt(e) || us.has(e) || is.test(e), Qe = (e) => Et(e, "length", Cs), xt = (e) => !!e && !Number.isNaN(Number(e)), $o = (e) => Et(e, "number", xt), Rt = (e) => !!e && Number.isInteger(Number(e)), ms = (e) => e.endsWith("%") && xt(e.slice(0, -1)), Z = (e) => Br.test(e), et = (e) => ds.test(e), ys = /* @__PURE__ */ new Set(["length", "size", "percentage"]), gs = (e) => Et(e, ys, Or), hs = (e) => Et(e, "position", Or), bs = /* @__PURE__ */ new Set(["image", "url"]), _s = (e) => Et(e, bs, xs), ws = (e) => Et(e, "", Ss), Ft = () => !0, Et = (e, o, t) => {
  const n = Br.exec(e);
  return n ? n[1] ? typeof o == "string" ? n[1] === o : o.has(n[1]) : t(n[2]) : !1;
}, Cs = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  cs.test(e) && !ps.test(e)
), Or = () => !1, Ss = (e) => fs.test(e), xs = (e) => vs.test(e), qs = () => {
  const e = ie("colors"), o = ie("spacing"), t = ie("blur"), n = ie("brightness"), r = ie("borderColor"), s = ie("borderRadius"), l = ie("borderSpacing"), i = ie("borderWidth"), u = ie("contrast"), d = ie("grayscale"), c = ie("hueRotate"), p = ie("invert"), f = ie("gap"), v = ie("gradientColorStops"), y = ie("gradientColorStopPositions"), w = ie("inset"), S = ie("margin"), O = ie("opacity"), q = ie("padding"), B = ie("saturate"), C = ie("scale"), $ = ie("sepia"), D = ie("skew"), I = ie("space"), M = ie("translate"), j = () => ["auto", "contain", "none"], x = () => ["auto", "hidden", "clip", "visible", "scroll"], V = () => ["auto", Z, o], k = () => [Z, o], W = () => ["", We, Qe], G = () => ["auto", xt, Z], R = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], z = () => ["solid", "dashed", "dotted", "double", "none"], U = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], ne = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], ve = () => ["", "0", Z], Se = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], me = () => [xt, Z];
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
      borderSpacing: k(),
      borderWidth: W(),
      contrast: me(),
      grayscale: ve(),
      hueRotate: me(),
      invert: ve(),
      gap: k(),
      gradientColorStops: [e],
      gradientColorStopPositions: [ms, Qe],
      inset: V(),
      margin: V(),
      opacity: me(),
      padding: k(),
      saturate: me(),
      scale: me(),
      sepia: ve(),
      skew: me(),
      space: k(),
      translate: k()
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
        object: [...R(), Z]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: x()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": x()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": x()
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
        basis: V()
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
        p: [q]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [q]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [q]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [q]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [q]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [q]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [q]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [q]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [q]
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
        "space-x": [I]
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
        "space-y": [I]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", $o]
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
        "line-clamp": ["none", xt, $o]
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
        indent: k()
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
        bg: [...R(), hs]
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
        bg: ["auto", "cover", "contain", gs]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, _s]
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
        from: [y]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [y]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [y]
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
        shadow: ["", "inner", "none", et, ws]
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
        grayscale: [d]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [c]
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
        sepia: [$]
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
        "backdrop-grayscale": [d]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [c]
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
        "backdrop-sepia": [$]
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
        "translate-x": [M]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [M]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [D]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [D]
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
        "scroll-m": k()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": k()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": k()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": k()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": k()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": k()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": k()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": k()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": k()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": k()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": k()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": k()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": k()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": k()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": k()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": k()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": k()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": k()
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
        stroke: [We, Qe, $o]
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
}, Bs = /* @__PURE__ */ ls(qs);
function L(...e) {
  return Bs(Cr(e));
}
const jn = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, zn = Cr, Ht = (e, o) => (t) => {
  var n;
  if (o?.variants == null) return zn(e, t?.class, t?.className);
  const { variants: r, defaultVariants: s } = o, l = Object.keys(r).map((d) => {
    const c = t?.[d], p = s?.[d];
    if (c === null) return null;
    const f = jn(c) || jn(p);
    return r[d][f];
  }), i = t && Object.entries(t).reduce((d, c) => {
    let [p, f] = c;
    return f === void 0 || (d[p] = f), d;
  }, {}), u = o == null || (n = o.compoundVariants) === null || n === void 0 ? void 0 : n.reduce((d, c) => {
    let { class: p, className: f, ...v } = c;
    return Object.entries(v).every((y) => {
      let [w, S] = y;
      return Array.isArray(S) ? S.includes({
        ...s,
        ...i
      }[w]) : {
        ...s,
        ...i
      }[w] === S;
    }) ? [
      ...d,
      p,
      f
    ] : d;
  }, []);
  return zn(e, l, u, t?.class, t?.className);
};
function Kn(e) {
  return typeof e == "string" ? `'${e}'` : new Os().serialize(e);
}
const Os = /* @__PURE__ */ (function() {
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
  return e === o || Kn(e) === Kn(o);
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
  }, (l) => (sn(n, l), l)];
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
function Wo(e, o) {
  return rt(e) ? !1 : Array.isArray(e) ? e.some((t) => nt(t, o)) : nt(e, o);
}
function As(e, o) {
  var t;
  const n = Kt();
  return se(() => {
    n.value = e();
  }, {
    ...o,
    flush: (t = o?.flush) !== null && t !== void 0 ? t : "sync"
  }), Ra(n);
}
function Dt(e, o) {
  return fr() ? (vr(e, o), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function Ps() {
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
function Ts(e) {
  let o = !1, t;
  const n = mr(!0);
  return ((...r) => (o || (t = n.run(() => e(...r)), o = !0), t));
}
const Ee = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Es = (e) => typeof e < "u", Ds = Object.prototype.toString, ks = (e) => Ds.call(e) === "[object Object]", Hn = /* @__PURE__ */ Is();
function Is() {
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
function Ar(e) {
  if (!Ee) return e;
  let o = 0, t, n;
  const r = () => {
    o -= 1, n && o <= 0 && (n.stop(), t = void 0, n = void 0);
  };
  return ((...s) => (o += 1, n || (n = mr(!0), t = n.run(() => e(...s))), Dt(r), t));
}
function Ms(e) {
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
function Rs(e) {
  return Ms(A(e));
}
function J(e, ...o) {
  const t = o.flat(), n = t[0];
  return Rs(() => Object.fromEntries(typeof n == "function" ? Object.entries(ue(e)).filter(([r, s]) => !n(we(s), r)) : Object.entries(ue(e)).filter((r) => !t.includes(r[0]))));
}
function Pr(e, o = 1e4) {
  return Ma((t, n) => {
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
function Fs(e, o) {
  $s() && mo(e, o);
}
function Tr(e, o, t = {}) {
  const { immediate: n = !0, immediateCallback: r = !1 } = t, s = Kt(!1);
  let l;
  function i() {
    l && (clearTimeout(l), l = void 0);
  }
  function u() {
    s.value = !1, i();
  }
  function d(...c) {
    r && e(), i(), s.value = !0, l = setTimeout(() => {
      s.value = !1, l = void 0, e(...c);
    }, we(o));
  }
  return n && (s.value = !0, Ee && d()), Dt(u), {
    isPending: ct(s),
    start: d,
    stop: u
  };
}
function Vs(e, o, t) {
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
  return Vs(() => {
    var n, r;
    return [
      (n = (r = t.value) === null || r === void 0 ? void 0 : r.map((s) => je(s))) !== null && n !== void 0 ? n : [go].filter((s) => s != null),
      Mo(we(t.value ? e[1] : e[0])),
      Mo(a(t.value ? e[2] : e[1])),
      we(t.value ? e[3] : e[2])
    ];
  }, ([n, r, s, l], i, u) => {
    if (!n?.length || !r?.length || !s?.length) return;
    const d = ks(l) ? { ...l } : l, c = n.flatMap((p) => r.flatMap((f) => s.map((v) => o(p, f, v, d))));
    u(() => {
      c.forEach((p) => p());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function dn() {
  const e = Kt(!1), o = vt();
  return o && pe(() => {
    e.value = !0;
  }, o), e;
}
// @__NO_SIDE_EFFECTS__
function Ns(e) {
  const o = /* @__PURE__ */ dn();
  return A(() => (o.value, !!e()));
}
function Ls(e) {
  return typeof e == "function" ? e : typeof e == "string" ? (o) => o.key === e : Array.isArray(e) ? (o) => e.includes(o.key) : () => !0;
}
function js(...e) {
  let o, t, n = {};
  e.length === 3 ? (o = e[0], t = e[1], n = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (o = !0, t = e[0], n = e[1]) : (o = e[0], t = e[1]) : (o = !0, t = e[0]);
  const { target: r = go, eventName: s = "keydown", passive: l = !1, dedupe: i = !1 } = n, u = Ls(o);
  return Ue(r, s, (c) => {
    c.repeat && we(i) || u(c) && t(c);
  }, l);
}
function zs(e) {
  return JSON.parse(JSON.stringify(e));
}
function Ks(e, o, t = {}) {
  const { window: n = go, ...r } = t;
  let s;
  const l = /* @__PURE__ */ Ns(() => n && "ResizeObserver" in n), i = () => {
    s && (s.disconnect(), s = void 0);
  }, u = re(A(() => {
    const c = we(e);
    return Array.isArray(c) ? c.map((p) => je(p)) : [je(c)];
  }), (c) => {
    if (i(), l.value && n) {
      s = new ResizeObserver(o);
      for (const p of c) p && s.observe(p, r);
    }
  }, {
    immediate: !0,
    flush: "post"
  }), d = () => {
    i(), u();
  };
  return Dt(d), {
    isSupported: l,
    stop: d
  };
}
// @__NO_SIDE_EFFECTS__
function fe(e, o, t, n = {}) {
  var r, s;
  const { clone: l = !1, passive: i = !1, eventName: u, deep: d = !1, defaultValue: c, shouldEmit: p } = n, f = vt(), v = t || f?.emit || (f == null || (r = f.$emit) === null || r === void 0 ? void 0 : r.bind(f)) || (f == null || (s = f.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(f?.proxy));
  let y = u;
  o || (o = "modelValue"), y = y || `update:${o.toString()}`;
  const w = (q) => l ? typeof l == "function" ? l(q) : zs(q) : q, S = () => Es(e[o]) ? w(e[o]) : c, O = (q) => {
    p ? p(q) && v(y, q) : v(y, q);
  };
  if (i) {
    const q = P(S());
    let B = !1;
    return re(() => e[o], (C) => {
      B || (B = !0, q.value = w(C), ce(() => B = !1));
    }), re(q, (C) => {
      !B && (C !== e[o] || d) && O(C);
    }, { deep: d }), q;
  } else return A({
    get() {
      return S();
    },
    set(q) {
      O(q);
    }
  });
}
function cn(e) {
  return e ? e.flatMap((o) => o.type === qe ? cn(o.children) : [o]) : [];
}
const Hs = ["INPUT", "TEXTAREA"];
function Uo(e, o, t, n = {}) {
  if (!o || n.enableIgnoredElement && Hs.includes(o.nodeName)) return null;
  const { arrowKeyOptions: r = "both", attributeName: s = "[data-reka-collection-item]", itemsArray: l = [], loop: i = !0, dir: u = "ltr", preventScroll: d = !0, focus: c = !1 } = n, [p, f, v, y, w, S] = [
    e.key === "ArrowRight",
    e.key === "ArrowLeft",
    e.key === "ArrowUp",
    e.key === "ArrowDown",
    e.key === "Home",
    e.key === "End"
  ], O = v || y, q = p || f;
  if (!w && !S && (!O && !q || r === "vertical" && q || r === "horizontal" && O)) return null;
  const B = t ? Array.from(t.querySelectorAll(s)) : l;
  if (!B.length) return null;
  d && e.preventDefault();
  let C = null;
  return q || O ? C = Er(B, o, {
    goForward: O ? y : u === "ltr" ? p : f,
    loop: i
  }) : w ? C = B.at(0) || null : S && (C = B.at(-1) || null), c && C?.focus(), C;
}
function Er(e, o, t, n = e.includes(o) ? e.length : e.length + 1) {
  if (--n === 0) return null;
  const r = e.indexOf(o);
  let s;
  if (r === -1 ? s = t.goForward ? 0 : e.length - 1 : s = t.goForward ? r + 1 : r - 1, !t.loop && (s < 0 || s >= e.length)) return null;
  const l = (s + e.length) % e.length, i = e[l];
  return i ? i.hasAttribute("disabled") && i.getAttribute("disabled") !== "false" ? Er(e, i, t, n) : i : null;
}
const [ho] = /* @__PURE__ */ oe("ConfigProvider");
function Ro(e) {
  if (e === null || typeof e != "object")
    return !1;
  const o = Object.getPrototypeOf(e);
  return o !== null && o !== Object.prototype && Object.getPrototypeOf(o) !== null || Symbol.iterator in e ? !1 : Symbol.toStringTag in e ? Object.prototype.toString.call(e) === "[object Module]" : !0;
}
function Go(e, o, t = ".", n) {
  if (!Ro(o))
    return Go(e, {}, t, n);
  const r = { ...o };
  for (const s of Object.keys(e)) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const l = e[s];
    l != null && (n && n(r, s, l, t) || (Array.isArray(l) && Array.isArray(r[s]) ? r[s] = [...l, ...r[s]] : Ro(l) && Ro(r[s]) ? r[s] = Go(
      l,
      r[s],
      (t ? `${t}.` : "") + s.toString(),
      n
    ) : r[s] = l));
  }
  return r;
}
function Ws(e) {
  return (...o) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    o.reduce((t, n) => Go(t, n, "", e), {})
  );
}
const Dr = Ws(), Us = /* @__PURE__ */ Ar(() => {
  const e = P(/* @__PURE__ */ new Map()), o = P(), t = A(() => {
    for (const l of e.value.values()) if (l) return !0;
    return !1;
  }), n = ho({ scrollBody: P(!0) });
  let r = null;
  const s = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = o.value ?? "", Hn && r?.(), o.value = void 0;
  };
  return re(t, (l, i) => {
    if (!Ee) return;
    if (!l) {
      i && s();
      return;
    }
    o.value === void 0 && (o.value = document.body.style.overflow);
    const u = window.innerWidth - document.documentElement.clientWidth, d = {
      padding: u,
      margin: 0
    }, c = n.scrollBody?.value ? typeof n.scrollBody.value == "object" ? Dr({
      padding: n.scrollBody.value.padding === !0 ? u : n.scrollBody.value.padding,
      margin: n.scrollBody.value.margin === !0 ? u : n.scrollBody.value.margin
    }, d) : d : {
      padding: 0,
      margin: 0
    };
    u > 0 && (document.body.style.paddingRight = typeof c.padding == "number" ? `${c.padding}px` : String(c.padding), document.body.style.marginRight = typeof c.margin == "number" ? `${c.margin}px` : String(c.margin), document.documentElement.style.setProperty("--scrollbar-width", `${u}px`), document.body.style.overflow = "hidden"), Hn && (r = Ue(document, "touchmove", (p) => Gs(p), { passive: !1 })), ce(() => {
      t.value && (document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden");
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), e;
});
function bo(e) {
  const o = Math.random().toString(36).substring(2, 7), t = Us();
  t.value.set(o, e ?? !1);
  const n = A({
    get: () => t.value.get(o) ?? !1,
    set: (r) => t.value.set(o, r)
  });
  return Fs(() => {
    t.value.delete(o);
  }), n;
}
function kr(e) {
  const o = window.getComputedStyle(e);
  if (o.overflowX === "scroll" || o.overflowY === "scroll" || o.overflowX === "auto" && e.clientWidth < e.scrollWidth || o.overflowY === "auto" && e.clientHeight < e.scrollHeight) return !0;
  {
    const t = e.parentNode;
    return !(t instanceof Element) || t.tagName === "BODY" ? !1 : kr(t);
  }
}
function Gs(e) {
  const o = e || window.event, t = o.target;
  return t instanceof Element && kr(t) ? !1 : o.touches.length > 1 ? !0 : (o.preventDefault && o.cancelable && o.preventDefault(), !1);
}
function lt(e) {
  const o = ho({ dir: P("ltr") });
  return A(() => e?.value || o.dir?.value || "ltr");
}
function mt(e) {
  const o = vt(), t = o?.type.emits, n = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${o?.type.__name}`), t?.forEach((r) => {
    n[Fa(yr(r))] = (...s) => e(r, ...s);
  }), n;
}
let Fo = 0;
function pn() {
  se((e) => {
    if (!Ee) return;
    const o = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", o[0] ?? Wn()), document.body.insertAdjacentElement("beforeend", o[1] ?? Wn()), Fo++, e(() => {
      Fo === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((t) => t.remove()), Fo--;
    });
  });
}
function Wn() {
  const e = document.createElement("span");
  return e.setAttribute("data-reka-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
function kt(e) {
  return A(() => we(e) ? !!je(e)?.closest("form") : !0);
}
function N() {
  const e = vt(), o = P(), t = A(() => n());
  Va(() => {
    t.value !== n() && Na(o);
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
      const u = i.$.exposed, d = Object.assign({}, s);
      for (const c in u) Object.defineProperty(d, c, {
        enumerable: !0,
        configurable: !0,
        get: () => u[c]
      });
      e.exposed = d;
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
  }, {}), n = La(e);
  return A(() => {
    const r = {}, s = o?.vnode.props ?? {};
    return Object.keys(s).forEach((l) => {
      r[yr(l)] = s[l];
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
function Ys(e, o) {
  const t = Pr(!1, 300);
  Dt(() => {
    t.value = !1;
  });
  const n = P(null), r = /* @__PURE__ */ Ps();
  function s() {
    n.value = null, t.value = !1;
  }
  function l(i, u) {
    if (!u) return;
    const d = i.currentTarget, c = {
      x: i.clientX,
      y: i.clientY
    }, p = Xs(c, d.getBoundingClientRect()), f = Js(c, p, 1), v = Zs(u.getBoundingClientRect()), y = el([...f, ...v]);
    n.value = y, t.value = !0;
  }
  return se((i) => {
    if (e.value && o.value) {
      const u = (c) => l(c, o.value), d = (c) => l(c, e.value);
      e.value.addEventListener("pointerleave", u), o.value.addEventListener("pointerleave", d), i(() => {
        e.value?.removeEventListener("pointerleave", u), o.value?.removeEventListener("pointerleave", d);
      });
    }
  }), se((i) => {
    if (n.value) {
      const u = (d) => {
        if (!n.value || !(d.target instanceof Element)) return;
        const c = d.target, p = {
          x: d.clientX,
          y: d.clientY
        }, f = e.value?.contains(c) || o.value?.contains(c), v = !Qs(p, n.value), y = !!c.closest("[data-grace-area-trigger]");
        f ? s() : (v || y) && (s(), r.trigger());
      };
      e.value?.ownerDocument.addEventListener("pointermove", u), i(() => e.value?.ownerDocument.removeEventListener("pointermove", u));
    }
  }), {
    isPointerInTransit: t,
    onPointerExit: r.on
  };
}
function Xs(e, o) {
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
function Js(e, o, t = 5) {
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
function Zs(e) {
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
function Qs(e, o) {
  const { x: t, y: n } = e;
  let r = !1;
  for (let s = 0, l = o.length - 1; s < o.length; l = s++) {
    const i = o[s].x, u = o[s].y, d = o[l].x, c = o[l].y;
    u > n != c > n && t < (d - i) * (n - u) / (c - u) + i && (r = !r);
  }
  return r;
}
function el(e) {
  const o = e.slice();
  return o.sort((t, n) => t.x < n.x ? -1 : t.x > n.x ? 1 : t.y < n.y ? -1 : t.y > n.y ? 1 : 0), tl(o);
}
function tl(e) {
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
var ol = function(e) {
  if (typeof document > "u")
    return null;
  var o = Array.isArray(e) ? e[0] : e;
  return o.ownerDocument.body;
}, wt = /* @__PURE__ */ new WeakMap(), to = /* @__PURE__ */ new WeakMap(), oo = {}, Vo = 0, Ir = function(e) {
  return e && (e.host || Ir(e.parentNode));
}, nl = function(e, o) {
  return o.map(function(t) {
    if (e.contains(t))
      return t;
    var n = Ir(t);
    return n && e.contains(n) ? n : (console.error("aria-hidden", t, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, rl = function(e, o, t, n) {
  var r = nl(o, Array.isArray(e) ? e : [e]);
  oo[t] || (oo[t] = /* @__PURE__ */ new WeakMap());
  var s = oo[t], l = [], i = /* @__PURE__ */ new Set(), u = new Set(r), d = function(p) {
    !p || i.has(p) || (i.add(p), d(p.parentNode));
  };
  r.forEach(d);
  var c = function(p) {
    !p || u.has(p) || Array.prototype.forEach.call(p.children, function(f) {
      if (i.has(f))
        c(f);
      else
        try {
          var v = f.getAttribute(n), y = v !== null && v !== "false", w = (wt.get(f) || 0) + 1, S = (s.get(f) || 0) + 1;
          wt.set(f, w), s.set(f, S), l.push(f), w === 1 && y && to.set(f, !0), S === 1 && f.setAttribute(t, "true"), y || f.setAttribute(n, "true");
        } catch (O) {
          console.error("aria-hidden: cannot operate on ", f, O);
        }
    });
  };
  return c(o), i.clear(), Vo++, function() {
    l.forEach(function(p) {
      var f = wt.get(p) - 1, v = s.get(p) - 1;
      wt.set(p, f), s.set(p, v), f || (to.has(p) || p.removeAttribute(n), to.delete(p)), v || p.removeAttribute(t);
    }), Vo--, Vo || (wt = /* @__PURE__ */ new WeakMap(), wt = /* @__PURE__ */ new WeakMap(), to = /* @__PURE__ */ new WeakMap(), oo = {});
  };
}, al = function(e, o, t) {
  t === void 0 && (t = "data-aria-hidden");
  var n = Array.from(Array.isArray(e) ? e : [e]), r = ol(e);
  return r ? (n.push.apply(n, Array.from(r.querySelectorAll("[aria-live], script"))), rl(n, r, t, "aria-hidden")) : function() {
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
    t && !n ? o = al(t) : o && o();
  }), Xe(() => {
    o && o();
  });
}
let sl = 0;
function be(e, o = "reka") {
  let t;
  const n = ho({ useId: void 0 });
  return n.useId ? t = n.useId() : "useId" in Vn ? t = Vn.useId?.() : t = `${++sl}`, o ? `${o}-${t}` : t;
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
        let u, d;
        if ("borderBoxSize" in i) {
          const c = i.borderBoxSize, p = Array.isArray(c) ? c[0] : c;
          u = p.inlineSize, d = p.blockSize;
        } else
          u = r.offsetWidth, d = r.offsetHeight;
        o.value = {
          width: u,
          height: d
        };
      });
      return s.observe(r, { box: "border-box" }), () => s.unobserve(r);
    } else o.value = void 0;
  }), {
    width: t,
    height: n
  };
}
function ll(e, o) {
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
function fn(e) {
  const o = Pr("", 1e3);
  return {
    search: o,
    handleTypeaheadSearch: (r, s) => {
      o.value = o.value + r;
      {
        const l = he(), i = s.map((f) => ({
          ...f,
          textValue: f.value?.textValue ?? f.ref.textContent?.trim() ?? ""
        })), u = i.find((f) => f.ref === l), d = i.map((f) => f.textValue), c = ul(d, o.value, u?.textValue), p = i.find((f) => f.textValue === c);
        return p && p.ref.focus(), p?.ref;
      }
    },
    resetTypeahead: () => {
      o.value = "";
    }
  };
}
function il(e, o) {
  return e.map((t, n) => e[(o + n) % e.length]);
}
function ul(e, o, t) {
  const r = o.length > 1 && Array.from(o).every((d) => d === o[0]) ? o[0] : o, s = t ? e.indexOf(t) : -1;
  let l = il(e, Math.max(s, 0));
  r.length === 1 && (l = l.filter((d) => d !== t));
  const u = l.find((d) => d.toLowerCase().startsWith(r.toLowerCase()));
  return u !== t ? u : void 0;
}
function dl(e, o) {
  const t = P({}), n = P("none"), r = P(e), s = e.value ? "mounted" : "unmounted";
  let l;
  const i = o.value?.ownerDocument.defaultView ?? go, { state: u, dispatch: d } = ll(s, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: { MOUNT: "mounted" }
  }), c = (S) => {
    if (Ee) {
      const O = new CustomEvent(S, {
        bubbles: !1,
        cancelable: !1
      });
      o.value?.dispatchEvent(O);
    }
  };
  re(e, async (S, O) => {
    const q = O !== S;
    if (await ce(), q) {
      const B = n.value, C = no(o.value);
      S ? (d("MOUNT"), c("enter"), C === "none" && c("after-enter")) : C === "none" || C === "undefined" || t.value?.display === "none" ? (d("UNMOUNT"), c("leave"), c("after-leave")) : O && B !== C ? (d("ANIMATION_OUT"), c("leave")) : (d("UNMOUNT"), c("after-leave"));
    }
  }, { immediate: !0 });
  const p = (S) => {
    const O = no(o.value), q = O.includes(CSS.escape(S.animationName)), B = u.value === "mounted" ? "enter" : "leave";
    if (S.target === o.value && q && (c(`after-${B}`), d("ANIMATION_END"), !r.value)) {
      const C = o.value.style.animationFillMode;
      o.value.style.animationFillMode = "forwards", l = i?.setTimeout(() => {
        o.value?.style.animationFillMode === "forwards" && (o.value.style.animationFillMode = C);
      });
    }
    S.target === o.value && O === "none" && d("ANIMATION_END");
  }, f = (S) => {
    S.target === o.value && (n.value = no(o.value));
  }, v = re(o, (S, O) => {
    S ? (t.value = getComputedStyle(S), S.addEventListener("animationstart", f), S.addEventListener("animationcancel", p), S.addEventListener("animationend", p)) : (d("ANIMATION_END"), l !== void 0 && i?.clearTimeout(l), O?.removeEventListener("animationstart", f), O?.removeEventListener("animationcancel", p), O?.removeEventListener("animationend", p));
  }, { immediate: !0 }), y = re(u, () => {
    const S = no(o.value);
    n.value = u.value === "mounted" ? S : "none";
  });
  return Xe(() => {
    v(), y();
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
    const { present: n, forceMount: r } = ue(e), s = P(), { isPresent: l } = dl(n, s);
    t({ present: l });
    let i = o.default({ present: l.value });
    i = cn(i || []);
    const u = vt();
    if (i && i?.length > 1) {
      const d = u?.parent?.type.name ? `<${u.parent.type.name} />` : "component";
      throw new Error([
        `Detected an invalid children for \`${d}\` for  \`Presence\` component.`,
        "",
        "Note: Presence works similarly to `v-if` directly, but it waits for animation/transition to finished before unmounting. So it expect only one direct child of valid VNode type.",
        "You can apply a few solutions:",
        ["Provide a single child element so that `presence` directive attach correctly.", "Ensure the first child is an actual element instead of a raw text node or comment node."].map((c) => `  - ${c}`).join(`
`)
      ].join(`
`));
    }
    return () => r.value || n.value || l.value ? Me(o.default({ present: l.value })[0], { ref: (d) => {
      const c = je(d);
      return typeof c?.hasAttribute > "u" || (c?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = c.firstElementChild : s.value = c), c;
    } }) : null;
  }
});
const io = /* @__PURE__ */ h({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(e, { attrs: o, slots: t }) {
    return () => {
      if (!t.default) return null;
      const n = cn(t.default()), r = n.findIndex((u) => u.type !== ja);
      if (r === -1) return n;
      const s = n[r];
      delete s.props?.ref;
      const l = s.props ? E(o, s.props) : o, i = za({
        ...s,
        props: {}
      }, l);
      return n.length === 1 ? i : (n[r] = i, n);
    };
  }
}), cl = [
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
    return typeof n == "string" && cl.includes(n) ? () => Me(n, o) : n !== "template" ? () => Me(e.as, o, { default: t.default }) : () => Me(io, o, { default: t.default });
  }
});
function Yo() {
  const e = P(), o = A(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : je(e));
  return {
    primitiveElement: e,
    currentElement: o
  };
}
const [Mr, pl] = /* @__PURE__ */ oe("CollapsibleRoot");
var fl = /* @__PURE__ */ h({
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
    return pl({
      contentId: "",
      disabled: l,
      open: s,
      unmountOnHide: i,
      onOpenToggle: () => {
        l.value || (s.value = !s.value);
      }
    }), o({ open: s }), N(), (u, d) => (m(), _(a(K), {
      as: u.as,
      "as-child": n.asChild,
      "data-state": a(s) ? "open" : "closed",
      "data-disabled": a(l) ? "" : void 0
    }, {
      default: g(() => [b(u.$slots, "default", { open: a(s) })]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state",
      "data-disabled"
    ]));
  }
}), vl = fl, ml = /* @__PURE__ */ h({
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
    const t = e, n = o, r = Mr();
    r.contentId ||= be(void 0, "reka-collapsible-content");
    const s = P(), { forwardRef: l, currentElement: i } = N(), u = P(0), d = P(0), c = A(() => r.open.value), p = P(c.value), f = P();
    re(() => [c.value, s.value?.present], async () => {
      await ce();
      const y = i.value;
      if (!y) return;
      f.value = f.value || {
        transitionDuration: y.style.transitionDuration,
        animationName: y.style.animationName
      }, y.style.transitionDuration = "0s", y.style.animationName = "none";
      const w = y.getBoundingClientRect();
      d.value = w.height, u.value = w.width, p.value || (y.style.transitionDuration = f.value.transitionDuration, y.style.animationName = f.value.animationName);
    }, { immediate: !0 });
    const v = A(() => p.value && r.open.value);
    return pe(() => {
      requestAnimationFrame(() => {
        p.value = !1;
      });
    }), Ue(i, "beforematch", (y) => {
      requestAnimationFrame(() => {
        r.onOpenToggle(), n("contentFound");
      });
    }), (y, w) => (m(), _(a(De), {
      ref_key: "presentRef",
      ref: s,
      present: y.forceMount || a(r).open.value,
      "force-mount": !0
    }, {
      default: g(({ present: S }) => [F(a(K), E(y.$attrs, {
        id: a(r).contentId,
        ref: a(l),
        "as-child": t.asChild,
        as: y.as,
        hidden: S ? void 0 : a(r).unmountOnHide.value ? "" : "until-found",
        "data-state": v.value ? void 0 : a(r).open.value ? "open" : "closed",
        "data-disabled": a(r).disabled?.value ? "" : void 0,
        style: {
          "--reka-collapsible-content-height": `${d.value}px`,
          "--reka-collapsible-content-width": `${u.value}px`
        }
      }), {
        default: g(() => [!a(r).unmountOnHide.value || S ? b(y.$slots, "default", { key: 0 }) : de("v-if", !0)]),
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
}), yl = ml, gl = /* @__PURE__ */ h({
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
    N();
    const t = Mr();
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
      default: g(() => [b(n.$slots, "default")]),
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
}), hl = gl;
function bl({ type: e, defaultValue: o, modelValue: t }) {
  const n = t || o;
  return t !== void 0 || o !== void 0 ? Array.isArray(n) ? "multiple" : "single" : e ?? "single";
}
function _l({ type: e, defaultValue: o, modelValue: t }) {
  return e || bl({
    type: e,
    defaultValue: o,
    modelValue: t
  });
}
function wl({ type: e, defaultValue: o }) {
  return o !== void 0 ? o : e === "single" ? void 0 : [];
}
function Cl(e, o) {
  const t = A(() => _l(e)), n = /* @__PURE__ */ fe(e, "modelValue", o, {
    defaultValue: wl(e),
    passive: e.modelValue === void 0,
    deep: !0
  });
  function r(l) {
    if (t.value === "single") n.value = nt(l, n.value) ? void 0 : l;
    else {
      const i = Array.isArray(n.value) ? [...n.value || []] : [n.value].filter(Boolean);
      if (Wo(i, l)) {
        const u = i.findIndex((d) => nt(d, l));
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
const [wo, Sl] = /* @__PURE__ */ oe("AccordionRoot");
var xl = /* @__PURE__ */ h({
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
    const t = e, n = o, { dir: r, disabled: s, unmountOnHide: l } = ue(t), i = lt(r), { modelValue: u, changeModelValue: d, isSingle: c } = Cl(t, n), { forwardRef: p, currentElement: f } = N();
    return Sl({
      disabled: s,
      direction: i,
      orientation: t.orientation,
      parentElement: f,
      isSingle: c,
      collapsible: t.collapsible,
      modelValue: u,
      changeModelValue: d,
      unmountOnHide: l
    }), (v, y) => (m(), _(a(K), {
      ref: a(p),
      "as-child": v.asChild,
      as: v.as
    }, {
      default: g(() => [b(v.$slots, "default", { modelValue: a(u) })]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), ql = xl, Xo = /* @__PURE__ */ (function(e) {
  return e.Open = "open", e.Closed = "closed", e;
})(Xo || {});
const [vn, Bl] = /* @__PURE__ */ oe("AccordionItem");
var Ol = /* @__PURE__ */ h({
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
    const t = e, n = wo(), r = A(() => n.isSingle.value ? t.value === n.modelValue.value : Array.isArray(n.modelValue.value) && n.modelValue.value.includes(t.value)), s = A(() => n.disabled.value || t.disabled), l = A(() => s.value ? "" : void 0), i = A(() => r.value ? Xo.Open : Xo.Closed);
    o({
      open: r,
      dataDisabled: l
    });
    const { currentRef: u, currentElement: d } = N();
    Bl({
      open: r,
      dataState: i,
      disabled: s,
      dataDisabled: l,
      triggerId: "",
      currentRef: u,
      currentElement: d,
      value: A(() => t.value)
    });
    function c(p) {
      const f = p.target;
      if (Array.from(n.parentElement.value?.querySelectorAll("[data-reka-collection-item]") ?? []).findIndex((w) => w === f) === -1) return null;
      Uo(p, f, n.parentElement.value, {
        arrowKeyOptions: n.orientation,
        dir: n.direction.value,
        focus: !0
      });
    }
    return (p, f) => (m(), _(a(vl), {
      "data-orientation": a(n).orientation,
      "data-disabled": l.value,
      "data-state": i.value,
      disabled: s.value,
      open: r.value,
      as: t.as,
      "as-child": t.asChild,
      "unmount-on-hide": t.unmountOnHide ?? a(n).unmountOnHide.value,
      onKeydown: Tt(c, [
        "up",
        "down",
        "left",
        "right",
        "home",
        "end"
      ])
    }, {
      default: g(() => [b(p.$slots, "default", { open: r.value })]),
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
}), Al = Ol, Pl = /* @__PURE__ */ h({
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
    const o = e, t = wo(), n = vn();
    return N(), (r, s) => (m(), _(a(yl), {
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
      default: g(() => [b(r.$slots, "default")]),
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
}), Tl = Pl, El = /* @__PURE__ */ h({
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
    const o = e, t = wo(), n = vn();
    return N(), (r, s) => (m(), _(a(K), {
      as: o.as,
      "as-child": o.asChild,
      "data-orientation": a(t).orientation,
      "data-state": a(n).dataState.value,
      "data-disabled": a(n).dataDisabled.value
    }, {
      default: g(() => [b(r.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-orientation",
      "data-state",
      "data-disabled"
    ]));
  }
}), Dl = El, kl = /* @__PURE__ */ h({
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
    const o = e, t = wo(), n = vn();
    n.triggerId ||= be(void 0, "reka-accordion-trigger");
    function r() {
      const s = t.isSingle.value && n.open.value && !t.collapsible;
      n.disabled.value || s || t.changeModelValue(n.value.value);
    }
    return (s, l) => (m(), _(a(hl), {
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
      default: g(() => [b(s.$slots, "default")]),
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
}), Il = kl;
const [ze, $l] = /* @__PURE__ */ oe("DialogRoot");
var Ml = /* @__PURE__ */ h({
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
    }), (u, d) => b(u.$slots, "default", {
      open: a(r),
      close: () => r.value = !1
    });
  }
}), Rr = Ml, Rl = /* @__PURE__ */ h({
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
    N();
    const t = ze();
    return (n, r) => (m(), _(a(K), E(o, {
      type: n.as === "button" ? "button" : void 0,
      onClick: r[0] || (r[0] = (s) => a(t).onOpenChange(!1))
    }), {
      default: g(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), Wt = Rl;
const Fl = "dismissableLayer.pointerDownOutside", Vl = "dismissableLayer.focusOutside";
function Fr(e, o) {
  if (!(o instanceof Element)) return !1;
  const t = o.closest("[data-dismissable-layer]"), n = e.dataset.dismissableLayer === "" ? e : e.querySelector("[data-dismissable-layer]"), r = Array.from(e.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (n === t || r.indexOf(n) < r.indexOf(t)));
}
function Nl(e, o, t = !0) {
  const n = o?.value?.ownerDocument ?? globalThis?.document, r = P(!1), s = P(() => {
  });
  return se((l) => {
    if (!Ee || !we(t)) return;
    const i = async (d) => {
      const c = d.target;
      if (!(!o?.value || !c)) {
        if (Fr(o.value, c)) {
          r.value = !1;
          return;
        }
        if (d.target && !r.value) {
          let f = function() {
            yo(Fl, e, p);
          };
          const p = { originalEvent: d };
          d.pointerType === "touch" ? (n.removeEventListener("click", s.value), s.value = f, n.addEventListener("click", s.value, { once: !0 })) : f();
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
function Ll(e, o, t = !0) {
  const n = o?.value?.ownerDocument ?? globalThis?.document, r = P(!1);
  return se((s) => {
    if (!Ee || !we(t)) return;
    const l = async (i) => {
      if (!o?.value) return;
      await ce(), await ce();
      const u = i.target;
      !o.value || !u || Fr(o.value, u) || i.target && !r.value && yo(Vl, e, { originalEvent: i });
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
var jl = /* @__PURE__ */ h({
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
    const t = e, n = o, { forwardRef: r, currentElement: s } = N(), l = A(() => s.value?.ownerDocument ?? globalThis.document), i = A(() => Be.layersRoot), u = A(() => s.value ? Array.from(i.value).indexOf(s.value) : -1), d = A(() => Be.layersWithOutsidePointerEventsDisabled.size > 0), c = A(() => {
      const v = Array.from(i.value), [y] = [...Be.layersWithOutsidePointerEventsDisabled].slice(-1), w = v.indexOf(y);
      return u.value >= w;
    }), p = Nl(async (v) => {
      const y = [...Be.branches].some((w) => w?.contains(v.target));
      !c.value || y || (n("pointerDownOutside", v), n("interactOutside", v), await ce(), v.defaultPrevented || n("dismiss"));
    }, s), f = Ll((v) => {
      [...Be.branches].some((w) => w?.contains(v.target)) || (n("focusOutside", v), n("interactOutside", v), v.defaultPrevented || n("dismiss"));
    }, s);
    return js("Escape", (v) => {
      u.value === i.value.size - 1 && (n("escapeKeyDown", v), v.defaultPrevented || n("dismiss"));
    }), re([s, () => t.disableOutsidePointerEvents], ([v, y], w, S) => {
      v && (y && (Be.layersWithOutsidePointerEventsDisabled.size === 0 && (Be.originalBodyPointerEvents = l.value.body.style.pointerEvents, l.value.body.style.pointerEvents = "none"), Be.layersWithOutsidePointerEventsDisabled.add(v), S(() => {
        Be.layersWithOutsidePointerEventsDisabled.delete(v), Be.layersWithOutsidePointerEventsDisabled.size === 0 && !rt(Be.originalBodyPointerEvents) && (l.value.body.style.pointerEvents = Be.originalBodyPointerEvents);
      })), i.value.add(v));
    }, { immediate: !0 }), se((v) => {
      v(() => {
        s.value && (i.value.delete(s.value), Be.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (v, y) => (m(), _(a(K), {
      ref: a(r),
      "as-child": v.asChild,
      as: v.as,
      "data-dismissable-layer": "",
      style: Te({ pointerEvents: d.value ? c.value ? "auto" : "none" : void 0 }),
      onFocusCapture: a(f).onFocusCapture,
      onBlurCapture: a(f).onBlurCapture,
      onPointerdownCapture: a(p).onPointerDownCapture
    }, {
      default: g(() => [b(v.$slots, "default")]),
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
}), Ut = jl;
const zl = /* @__PURE__ */ Ts(() => P([]));
function Kl() {
  const e = zl();
  return {
    add(o) {
      const t = e.value[0];
      o !== t && t?.pause(), e.value = Un(e.value, o), e.value.unshift(o);
    },
    remove(o) {
      e.value = Un(e.value, o), e.value[0]?.resume();
    }
  };
}
function Un(e, o) {
  const t = [...e], n = t.indexOf(o);
  return n !== -1 && t.splice(n, 1), t;
}
const No = "focusScope.autoFocusOnMount", Lo = "focusScope.autoFocusOnUnmount", Gn = {
  bubbles: !1,
  cancelable: !0
};
function Hl(e, { select: o = !1 } = {}) {
  const t = he();
  for (const n of e)
    if (ot(n, { select: o }), he() !== t) return !0;
}
function Wl(e) {
  const o = Vr(e), t = Yn(o, e), n = Yn(o.reverse(), e);
  return [t, n];
}
function Vr(e) {
  const o = [], t = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, { acceptNode: (n) => {
    const r = n.tagName === "INPUT" && n.type === "hidden";
    return n.disabled || n.hidden || r ? NodeFilter.FILTER_SKIP : n.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) o.push(t.currentNode);
  return o;
}
function Yn(e, o) {
  for (const t of e) if (!Ul(t, { upTo: o })) return t;
}
function Ul(e, { upTo: o }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (o !== void 0 && e === o) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function Gl(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function ot(e, { select: o = !1 } = {}) {
  if (e && e.focus) {
    const t = he();
    e.focus({ preventScroll: !0 }), e !== t && Gl(e) && o && e.select();
  }
}
var Yl = /* @__PURE__ */ h({
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
    const t = e, n = o, { currentRef: r, currentElement: s } = N(), l = P(null), i = Kl(), u = /* @__PURE__ */ so({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    se((c) => {
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
      function y(S) {
        const O = l.value;
        if (O === null || !S.some((C) => C.removedNodes.length > 0)) return;
        p.contains(O) || ot(p);
      }
      document.addEventListener("focusin", f), document.addEventListener("focusout", v);
      const w = new MutationObserver(y);
      p && w.observe(p, {
        childList: !0,
        subtree: !0
      }), c(() => {
        document.removeEventListener("focusin", f), document.removeEventListener("focusout", v), w.disconnect();
      });
    }), se(async (c) => {
      const p = s.value;
      if (await ce(), !p) return;
      i.add(u);
      const f = he();
      if (!p.contains(f)) {
        const y = new CustomEvent(No, Gn);
        p.addEventListener(No, (w) => n("mountAutoFocus", w)), p.dispatchEvent(y), y.defaultPrevented || (Hl(Vr(p), { select: !0 }), he() === f && ot(p));
      }
      c(() => {
        p.removeEventListener(No, (S) => n("mountAutoFocus", S));
        const y = new CustomEvent(Lo, Gn), w = (S) => {
          n("unmountAutoFocus", S);
        };
        p.addEventListener(Lo, w), p.dispatchEvent(y), p.setAttribute("data-focus-scope-unmounting", ""), setTimeout(() => {
          y.defaultPrevented || ot(f ?? document.body, { select: !0 }), p.removeEventListener(Lo, w), i.remove(u), p.removeAttribute("data-focus-scope-unmounting");
        }, 0);
      });
    });
    function d(c) {
      if (!t.loop && !t.trapped || u.paused) return;
      const p = c.key === "Tab" && !c.altKey && !c.ctrlKey && !c.metaKey, f = he();
      if (p && f) {
        const v = c.currentTarget, [y, w] = Wl(v);
        y && w ? !c.shiftKey && f === w ? (c.preventDefault(), t.loop && ot(y, { select: !0 })) : c.shiftKey && f === y && (c.preventDefault(), t.loop && ot(w, { select: !0 })) : f === v && c.preventDefault();
      }
    }
    return (c, p) => (m(), _(a(K), {
      ref_key: "currentRef",
      ref: r,
      tabindex: "-1",
      "as-child": c.asChild,
      as: c.as,
      onKeydown: d
    }, {
      default: g(() => [b(c.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), Co = Yl;
const Xl = "menu.itemSelect", Jo = ["Enter", " "], Jl = [
  "ArrowDown",
  "PageUp",
  "Home"
], Nr = [
  "ArrowUp",
  "PageDown",
  "End"
], Zl = [...Jl, ...Nr], Ql = {
  ltr: [...Jo, "ArrowRight"],
  rtl: [...Jo, "ArrowLeft"]
}, ei = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"]
};
function mn(e) {
  return e ? "open" : "closed";
}
function uo(e) {
  return e === "indeterminate";
}
function yn(e) {
  return uo(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
function Zo(e) {
  const o = he();
  for (const t of e)
    if (t === o || (t.focus(), he() !== o)) return;
}
function ti(e, o) {
  const { x: t, y: n } = e;
  let r = !1;
  for (let s = 0, l = o.length - 1; s < o.length; l = s++) {
    const i = o[s].x, u = o[s].y, d = o[l].x, c = o[l].y;
    u > n != c > n && t < (d - i) * (n - u) / (c - u) + i && (r = !r);
  }
  return r;
}
function oi(e, o) {
  if (!o) return !1;
  const t = {
    x: e.clientX,
    y: e.clientY
  };
  return ti(t, o);
}
function At(e) {
  return e.pointerType === "mouse";
}
const ni = "DialogTitle", ri = "DialogContent";
function ai({ titleName: e = ni, contentName: o = ri, componentLink: t = "dialog.html#title", titleId: n, descriptionId: r, contentElement: s }) {
  const l = `Warning: \`${o}\` requires a \`${e}\` for the component to be accessible for screen reader users.

If you want to hide the \`${e}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, i = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${o}.`;
  pe(() => {
    document.getElementById(n) || console.warn(l);
    const d = s.value?.getAttribute("aria-describedby");
    r && d && (document.getElementById(r) || console.warn(i));
  });
}
var si = /* @__PURE__ */ h({
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
    const t = e, n = o, r = ze(), { forwardRef: s, currentElement: l } = N();
    return r.titleId ||= be(void 0, "reka-dialog-title"), r.descriptionId ||= be(void 0, "reka-dialog-description"), pe(() => {
      r.contentElement = l, he() !== document.body && (r.triggerElement.value = he());
    }), process.env.NODE_ENV !== "production" && ai({
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
      onMountAutoFocus: u[5] || (u[5] = (d) => n("openAutoFocus", d)),
      onUnmountAutoFocus: u[6] || (u[6] = (d) => n("closeAutoFocus", d))
    }, {
      default: g(() => [F(a(Ut), E({
        id: a(r).contentId,
        ref: a(s),
        as: i.as,
        "as-child": i.asChild,
        "disable-outside-pointer-events": i.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": a(r).descriptionId,
        "aria-labelledby": a(r).titleId,
        "data-state": a(mn)(a(r).open.value)
      }, i.$attrs, {
        onDismiss: u[0] || (u[0] = (d) => a(r).onOpenChange(!1)),
        onEscapeKeyDown: u[1] || (u[1] = (d) => n("escapeKeyDown", d)),
        onFocusOutside: u[2] || (u[2] = (d) => n("focusOutside", d)),
        onInteractOutside: u[3] || (u[3] = (d) => n("interactOutside", d)),
        onPointerDownOutside: u[4] || (u[4] = (d) => n("pointerDownOutside", d))
      }), {
        default: g(() => [b(i.$slots, "default")]),
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
}), Lr = si, li = /* @__PURE__ */ h({
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
    const t = e, n = o, r = ze(), s = mt(n), { forwardRef: l, currentElement: i } = N();
    return _o(i), (u, d) => (m(), _(Lr, E({
      ...t,
      ...a(s)
    }, {
      ref: a(l),
      "trap-focus": a(r).open.value,
      "disable-outside-pointer-events": t.disableOutsidePointerEvents,
      onCloseAutoFocus: d[0] || (d[0] = (c) => {
        c.defaultPrevented || (c.preventDefault(), a(r).triggerElement.value?.focus());
      }),
      onPointerDownOutside: d[1] || (d[1] = (c) => {
        const p = c.detail.originalEvent, f = p.button === 0 && p.ctrlKey === !0;
        (p.button === 2 || f) && c.preventDefault();
      }),
      onFocusOutside: d[2] || (d[2] = (c) => {
        c.preventDefault();
      })
    }), {
      default: g(() => [b(u.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus", "disable-outside-pointer-events"]));
  }
}), ii = li, ui = /* @__PURE__ */ h({
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
    N();
    const s = ze(), l = P(!1), i = P(!1);
    return (u, d) => (m(), _(Lr, E({
      ...t,
      ...a(r)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: d[0] || (d[0] = (c) => {
        c.defaultPrevented || (l.value || a(s).triggerElement.value?.focus(), c.preventDefault()), l.value = !1, i.value = !1;
      }),
      onInteractOutside: d[1] || (d[1] = (c) => {
        c.defaultPrevented || (l.value = !0, c.detail.originalEvent.type === "pointerdown" && (i.value = !0));
        const p = c.target;
        a(s).triggerElement.value?.contains(p) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && i.value && c.preventDefault();
      })
    }), {
      default: g(() => [b(u.$slots, "default")]),
      _: 3
    }, 16));
  }
}), di = ui, ci = /* @__PURE__ */ h({
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
    const t = e, n = o, r = ze(), s = mt(n), { forwardRef: l } = N();
    return (i, u) => (m(), _(a(De), { present: i.forceMount || a(r).open.value }, {
      default: g(() => [a(r).modal.value ? (m(), _(ii, E({
        key: 0,
        ref: a(l)
      }, {
        ...t,
        ...a(s),
        ...i.$attrs
      }), {
        default: g(() => [b(i.$slots, "default")]),
        _: 3
      }, 16)) : (m(), _(di, E({
        key: 1,
        ref: a(l)
      }, {
        ...t,
        ...a(s),
        ...i.$attrs
      }), {
        default: g(() => [b(i.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), gn = ci, pi = /* @__PURE__ */ h({
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
    N();
    const t = ze();
    return (n, r) => (m(), _(a(K), E(o, { id: a(t).descriptionId }), {
      default: g(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), jr = pi, fi = /* @__PURE__ */ h({
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
    return bo(!0), N(), (t, n) => (m(), _(a(K), {
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
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), vi = fi, mi = /* @__PURE__ */ h({
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
    const o = ze(), { forwardRef: t } = N();
    return (n, r) => a(o)?.modal.value ? (m(), _(a(De), {
      key: 0,
      present: n.forceMount || a(o).open.value
    }, {
      default: g(() => [F(vi, E(n.$attrs, {
        ref: a(t),
        as: n.as,
        "as-child": n.asChild
      }), {
        default: g(() => [b(n.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : de("v-if", !0);
  }
}), hn = mi, yi = /* @__PURE__ */ h({
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
    const o = /* @__PURE__ */ dn();
    return (t, n) => a(o) || t.forceMount ? (m(), _(gr, {
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
}), Gt = yi, gi = /* @__PURE__ */ h({
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
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), bn = gi, hi = /* @__PURE__ */ h({
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
    return N(), (n, r) => (m(), _(a(K), E(o, { id: a(t).titleId }), {
      default: g(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), zr = hi, bi = /* @__PURE__ */ h({
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
    const o = e, t = ze(), { forwardRef: n, currentElement: r } = N();
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
      default: g(() => [b(s.$slots, "default")]),
      _: 3
    }, 16, [
      "type",
      "aria-expanded",
      "aria-controls",
      "data-state",
      "onClick"
    ]));
  }
}), Kr = bi;
const Xn = "data-reka-collection-item";
function ke(e = {}) {
  const { key: o = "", isProvider: t = !1 } = e, n = `${o}CollectionProvider`;
  let r;
  if (t) {
    const c = P(/* @__PURE__ */ new Map());
    r = {
      collectionRef: P(),
      itemMap: c
    }, sn(n, r);
  } else r = Nt(n);
  const s = (c = !1) => {
    const p = r.collectionRef.value;
    if (!p) return [];
    const f = Array.from(p.querySelectorAll(`[${Xn}]`)), y = Array.from(r.itemMap.value.values()).sort((w, S) => f.indexOf(w.ref) - f.indexOf(S.ref));
    return c ? y : y.filter((w) => w.ref.dataset.disabled !== "");
  }, l = /* @__PURE__ */ h({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(c, { slots: p, attrs: f }) {
      const { primitiveElement: v, currentElement: y } = Yo();
      return re(y, () => {
        r.collectionRef.value = y.value;
      }), () => Me(io, {
        ref: v,
        ...f
      }, p);
    }
  }), i = /* @__PURE__ */ h({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(c, { slots: p, attrs: f }) {
      const { primitiveElement: v, currentElement: y } = Yo();
      return se((w) => {
        if (y.value) {
          const S = Ka(y.value);
          r.itemMap.value.set(S, {
            ref: y.value,
            value: c.value
          }), w(() => r.itemMap.value.delete(S));
        }
      }), () => Me(io, {
        ...f,
        [Xn]: "",
        ref: v
      }, p);
    }
  }), u = A(() => Array.from(r.itemMap.value.values())), d = A(() => r.itemMap.value.size);
  return {
    getItems: s,
    reactiveItems: u,
    itemMapSize: d,
    CollectionSlot: l,
    CollectionItem: i
  };
}
var _i = /* @__PURE__ */ h({
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
      default: g(() => [b(o.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), _n = _i, wi = /* @__PURE__ */ h({
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
    const o = e, { primitiveElement: t, currentElement: n } = Yo(), r = A(() => o.checked ?? o.value);
    return re(r, (s, l) => {
      if (!n.value) return;
      const i = n.value, u = window.HTMLInputElement.prototype, c = Object.getOwnPropertyDescriptor(u, "value").set;
      if (c && s !== l) {
        const p = new Event("input", { bubbles: !0 }), f = new Event("change", { bubbles: !0 });
        c.call(i, s), i.dispatchEvent(p), i.dispatchEvent(f);
      }
    }), (s, l) => (m(), _(_n, E({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...o,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), Jn = wi, Ci = /* @__PURE__ */ h({
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
    return (r, s) => (m(), H(qe, null, [de(" We render single input if it's required "), t.value ? (m(), _(Jn, E({ key: r.name }, {
      ...o,
      ...r.$attrs
    }, {
      name: r.name,
      value: r.value
    }), null, 16, ["name", "value"])) : (m(!0), H(qe, { key: 1 }, Bt(n.value, (l) => (m(), _(Jn, E({ key: l.name }, { ref_for: !0 }, {
      ...o,
      ...r.$attrs
    }, {
      name: l.name,
      value: l.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), Yt = Ci;
const Si = "rovingFocusGroup.onEntryFocus", xi = {
  bubbles: !1,
  cancelable: !0
}, qi = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Bi(e, o) {
  return o !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e;
}
function Oi(e, o, t) {
  const n = Bi(e.key, t);
  if (!(o === "vertical" && ["ArrowLeft", "ArrowRight"].includes(n)) && !(o === "horizontal" && ["ArrowUp", "ArrowDown"].includes(n)))
    return qi[n];
}
function Hr(e, o = !1) {
  const t = he();
  for (const n of e)
    if (n === t || (n.focus({ preventScroll: o }), he() !== t)) return;
}
function Ai(e, o) {
  return e.map((t, n) => e[(o + n) % e.length]);
}
const [Wr, Pi] = /* @__PURE__ */ oe("PopperRoot");
var Ti = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(e) {
    const o = P();
    return Pi({
      anchor: o,
      onAnchorChange: (t) => o.value = t
    }), (t, n) => b(t.$slots, "default");
  }
}), Xt = Ti, Ei = /* @__PURE__ */ h({
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
    const o = e, { forwardRef: t, currentElement: n } = N(), r = Wr();
    return hr(() => {
      r.onAnchorChange(o.reference ?? n.value);
    }), (s, l) => (m(), _(a(K), {
      ref: a(t),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: g(() => [b(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), So = Ei;
function Di(e) {
  return e !== null;
}
function ki(e) {
  return {
    name: "transformOrigin",
    options: e,
    fn(o) {
      const { placement: t, rects: n, middlewareData: r } = o, l = r.arrow?.centerOffset !== 0, i = l ? 0 : e.arrowWidth, u = l ? 0 : e.arrowHeight, [d, c] = Qo(t), p = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[c], f = (r.arrow?.x ?? 0) + i / 2, v = (r.arrow?.y ?? 0) + u / 2;
      let y = "", w = "";
      return d === "bottom" ? (y = l ? p : `${f}px`, w = `${-u}px`) : d === "top" ? (y = l ? p : `${f}px`, w = `${n.floating.height + u}px`) : d === "right" ? (y = `${-u}px`, w = l ? p : `${v}px`) : d === "left" && (y = `${n.floating.width + u}px`, w = l ? p : `${v}px`), { data: {
        x: y,
        y: w
      } };
    }
  };
}
function Qo(e) {
  const [o, t = "center"] = e.split("-");
  return [o, t];
}
const Ii = ["top", "right", "bottom", "left"], at = Math.min, Oe = Math.max, co = Math.round, ro = Math.floor, Le = (e) => ({
  x: e,
  y: e
}), $i = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function en(e, o, t) {
  return Oe(e, at(o, t));
}
function Ge(e, o) {
  return typeof e == "function" ? e(o) : e;
}
function Ye(e) {
  return e.split("-")[0];
}
function It(e) {
  return e.split("-")[1];
}
function wn(e) {
  return e === "x" ? "y" : "x";
}
function Cn(e) {
  return e === "y" ? "height" : "width";
}
function Ne(e) {
  const o = e[0];
  return o === "t" || o === "b" ? "y" : "x";
}
function Sn(e) {
  return wn(Ne(e));
}
function Mi(e, o, t) {
  t === void 0 && (t = !1);
  const n = It(e), r = Sn(e), s = Cn(r);
  let l = r === "x" ? n === (t ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return o.reference[s] > o.floating[s] && (l = po(l)), [l, po(l)];
}
function Ri(e) {
  const o = po(e);
  return [tn(e), o, tn(o)];
}
function tn(e) {
  return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
const Zn = ["left", "right"], Qn = ["right", "left"], Fi = ["top", "bottom"], Vi = ["bottom", "top"];
function Ni(e, o, t) {
  switch (e) {
    case "top":
    case "bottom":
      return t ? o ? Qn : Zn : o ? Zn : Qn;
    case "left":
    case "right":
      return o ? Fi : Vi;
    default:
      return [];
  }
}
function Li(e, o, t, n) {
  const r = It(e);
  let s = Ni(Ye(e), t === "start", n);
  return r && (s = s.map((l) => l + "-" + r), o && (s = s.concat(s.map(tn)))), s;
}
function po(e) {
  const o = Ye(e);
  return $i[o] + e.slice(o.length);
}
function ji(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function Ur(e) {
  return typeof e != "number" ? ji(e) : {
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
function er(e, o, t) {
  let {
    reference: n,
    floating: r
  } = e;
  const s = Ne(o), l = Sn(o), i = Cn(l), u = Ye(o), d = s === "y", c = n.x + n.width / 2 - r.width / 2, p = n.y + n.height / 2 - r.height / 2, f = n[i] / 2 - r[i] / 2;
  let v;
  switch (u) {
    case "top":
      v = {
        x: c,
        y: n.y - r.height
      };
      break;
    case "bottom":
      v = {
        x: c,
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
  switch (It(o)) {
    case "start":
      v[l] -= f * (t && d ? -1 : 1);
      break;
    case "end":
      v[l] += f * (t && d ? -1 : 1);
      break;
  }
  return v;
}
async function zi(e, o) {
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
    boundary: d = "clippingAncestors",
    rootBoundary: c = "viewport",
    elementContext: p = "floating",
    altBoundary: f = !1,
    padding: v = 0
  } = Ge(o, e), y = Ur(v), S = i[f ? p === "floating" ? "reference" : "floating" : p], O = fo(await s.getClippingRect({
    element: (t = await (s.isElement == null ? void 0 : s.isElement(S))) == null || t ? S : S.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(i.floating)),
    boundary: d,
    rootBoundary: c,
    strategy: u
  })), q = p === "floating" ? {
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
  }, $ = fo(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: i,
    rect: q,
    offsetParent: B,
    strategy: u
  }) : q);
  return {
    top: (O.top - $.top + y.top) / C.y,
    bottom: ($.bottom - O.bottom + y.bottom) / C.y,
    left: (O.left - $.left + y.left) / C.x,
    right: ($.right - O.right + y.right) / C.x
  };
}
const Ki = 50, Hi = async (e, o, t) => {
  const {
    placement: n = "bottom",
    strategy: r = "absolute",
    middleware: s = [],
    platform: l
  } = t, i = l.detectOverflow ? l : {
    ...l,
    detectOverflow: zi
  }, u = await (l.isRTL == null ? void 0 : l.isRTL(o));
  let d = await l.getElementRects({
    reference: e,
    floating: o,
    strategy: r
  }), {
    x: c,
    y: p
  } = er(d, n, u), f = n, v = 0;
  const y = {};
  for (let w = 0; w < s.length; w++) {
    const S = s[w];
    if (!S)
      continue;
    const {
      name: O,
      fn: q
    } = S, {
      x: B,
      y: C,
      data: $,
      reset: D
    } = await q({
      x: c,
      y: p,
      initialPlacement: n,
      placement: f,
      strategy: r,
      middlewareData: y,
      rects: d,
      platform: i,
      elements: {
        reference: e,
        floating: o
      }
    });
    c = B ?? c, p = C ?? p, y[O] = {
      ...y[O],
      ...$
    }, D && v < Ki && (v++, typeof D == "object" && (D.placement && (f = D.placement), D.rects && (d = D.rects === !0 ? await l.getElementRects({
      reference: e,
      floating: o,
      strategy: r
    }) : D.rects), {
      x: c,
      y: p
    } = er(d, f, u)), w = -1);
  }
  return {
    x: c,
    y: p,
    placement: f,
    strategy: r,
    middlewareData: y
  };
}, Wi = (e) => ({
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
      element: d,
      padding: c = 0
    } = Ge(e, o) || {};
    if (d == null)
      return {};
    const p = Ur(c), f = {
      x: t,
      y: n
    }, v = Sn(r), y = Cn(v), w = await l.getDimensions(d), S = v === "y", O = S ? "top" : "left", q = S ? "bottom" : "right", B = S ? "clientHeight" : "clientWidth", C = s.reference[y] + s.reference[v] - f[v] - s.floating[y], $ = f[v] - s.reference[v], D = await (l.getOffsetParent == null ? void 0 : l.getOffsetParent(d));
    let I = D ? D[B] : 0;
    (!I || !await (l.isElement == null ? void 0 : l.isElement(D))) && (I = i.floating[B] || s.floating[y]);
    const M = C / 2 - $ / 2, j = I / 2 - w[y] / 2 - 1, x = at(p[O], j), V = at(p[q], j), k = x, W = I - w[y] - V, G = I / 2 - w[y] / 2 + M, R = en(k, G, W), z = !u.arrow && It(r) != null && G !== R && s.reference[y] / 2 - (G < k ? x : V) - w[y] / 2 < 0, U = z ? G < k ? G - k : G - W : 0;
    return {
      [v]: f[v] + U,
      data: {
        [v]: R,
        centerOffset: G - R - U,
        ...z && {
          alignmentOffset: U
        }
      },
      reset: z
    };
  }
}), Ui = function(e) {
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
        elements: d
      } = o, {
        mainAxis: c = !0,
        crossAxis: p = !0,
        fallbackPlacements: f,
        fallbackStrategy: v = "bestFit",
        fallbackAxisSideDirection: y = "none",
        flipAlignment: w = !0,
        ...S
      } = Ge(e, o);
      if ((t = s.arrow) != null && t.alignmentOffset)
        return {};
      const O = Ye(r), q = Ne(i), B = Ye(i) === i, C = await (u.isRTL == null ? void 0 : u.isRTL(d.floating)), $ = f || (B || !w ? [po(i)] : Ri(i)), D = y !== "none";
      !f && D && $.push(...Li(i, w, y, C));
      const I = [i, ...$], M = await u.detectOverflow(o, S), j = [];
      let x = ((n = s.flip) == null ? void 0 : n.overflows) || [];
      if (c && j.push(M[O]), p) {
        const G = Mi(r, l, C);
        j.push(M[G[0]], M[G[1]]);
      }
      if (x = [...x, {
        placement: r,
        overflows: j
      }], !j.every((G) => G <= 0)) {
        var V, k;
        const G = (((V = s.flip) == null ? void 0 : V.index) || 0) + 1, R = I[G];
        if (R && (!(p === "alignment" ? q !== Ne(R) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        x.every((ne) => Ne(ne.placement) === q ? ne.overflows[0] > 0 : !0)))
          return {
            data: {
              index: G,
              overflows: x
            },
            reset: {
              placement: R
            }
          };
        let z = (k = x.filter((U) => U.overflows[0] <= 0).sort((U, ne) => U.overflows[1] - ne.overflows[1])[0]) == null ? void 0 : k.placement;
        if (!z)
          switch (v) {
            case "bestFit": {
              var W;
              const U = (W = x.filter((ne) => {
                if (D) {
                  const ve = Ne(ne.placement);
                  return ve === q || // Create a bias to the `y` side axis due to horizontal
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
function tr(e, o) {
  return {
    top: e.top - o.height,
    right: e.right - o.width,
    bottom: e.bottom - o.height,
    left: e.left - o.width
  };
}
function or(e) {
  return Ii.some((o) => e[o] >= 0);
}
const Gi = function(e) {
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
          }), i = tr(l, t.reference);
          return {
            data: {
              referenceHiddenOffsets: i,
              referenceHidden: or(i)
            }
          };
        }
        case "escaped": {
          const l = await n.detectOverflow(o, {
            ...s,
            altBoundary: !0
          }), i = tr(l, t.floating);
          return {
            data: {
              escapedOffsets: i,
              escaped: or(i)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Gr = /* @__PURE__ */ new Set(["left", "top"]);
async function Yi(e, o) {
  const {
    placement: t,
    platform: n,
    elements: r
  } = e, s = await (n.isRTL == null ? void 0 : n.isRTL(r.floating)), l = Ye(t), i = It(t), u = Ne(t) === "y", d = Gr.has(l) ? -1 : 1, c = s && u ? -1 : 1, p = Ge(o, e);
  let {
    mainAxis: f,
    crossAxis: v,
    alignmentAxis: y
  } = typeof p == "number" ? {
    mainAxis: p,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: p.mainAxis || 0,
    crossAxis: p.crossAxis || 0,
    alignmentAxis: p.alignmentAxis
  };
  return i && typeof y == "number" && (v = i === "end" ? y * -1 : y), u ? {
    x: v * c,
    y: f * d
  } : {
    x: f * d,
    y: v * c
  };
}
const Xi = function(e) {
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
      } = o, u = await Yi(o, e);
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
}, Ji = function(e) {
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
              x: q,
              y: B
            } = O;
            return {
              x: q,
              y: B
            };
          }
        },
        ...d
      } = Ge(e, o), c = {
        x: t,
        y: n
      }, p = await s.detectOverflow(o, d), f = Ne(Ye(r)), v = wn(f);
      let y = c[v], w = c[f];
      if (l) {
        const O = v === "y" ? "top" : "left", q = v === "y" ? "bottom" : "right", B = y + p[O], C = y - p[q];
        y = en(B, y, C);
      }
      if (i) {
        const O = f === "y" ? "top" : "left", q = f === "y" ? "bottom" : "right", B = w + p[O], C = w - p[q];
        w = en(B, w, C);
      }
      const S = u.fn({
        ...o,
        [v]: y,
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
}, Zi = function(e) {
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
        crossAxis: d = !0
      } = Ge(e, o), c = {
        x: t,
        y: n
      }, p = Ne(r), f = wn(p);
      let v = c[f], y = c[p];
      const w = Ge(i, o), S = typeof w == "number" ? {
        mainAxis: w,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...w
      };
      if (u) {
        const B = f === "y" ? "height" : "width", C = s.reference[f] - s.floating[B] + S.mainAxis, $ = s.reference[f] + s.reference[B] - S.mainAxis;
        v < C ? v = C : v > $ && (v = $);
      }
      if (d) {
        var O, q;
        const B = f === "y" ? "width" : "height", C = Gr.has(Ye(r)), $ = s.reference[p] - s.floating[B] + (C && ((O = l.offset) == null ? void 0 : O[p]) || 0) + (C ? 0 : S.crossAxis), D = s.reference[p] + s.reference[B] + (C ? 0 : ((q = l.offset) == null ? void 0 : q[p]) || 0) - (C ? S.crossAxis : 0);
        y < $ ? y = $ : y > D && (y = D);
      }
      return {
        [f]: v,
        [p]: y
      };
    }
  };
}, Qi = function(e) {
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
        ...d
      } = Ge(e, o), c = await l.detectOverflow(o, d), p = Ye(r), f = It(r), v = Ne(r) === "y", {
        width: y,
        height: w
      } = s.floating;
      let S, O;
      p === "top" || p === "bottom" ? (S = p, O = f === (await (l.isRTL == null ? void 0 : l.isRTL(i.floating)) ? "start" : "end") ? "left" : "right") : (O = p, S = f === "end" ? "top" : "bottom");
      const q = w - c.top - c.bottom, B = y - c.left - c.right, C = at(w - c[S], q), $ = at(y - c[O], B), D = !o.middlewareData.shift;
      let I = C, M = $;
      if ((t = o.middlewareData.shift) != null && t.enabled.x && (M = B), (n = o.middlewareData.shift) != null && n.enabled.y && (I = q), D && !f) {
        const x = Oe(c.left, 0), V = Oe(c.right, 0), k = Oe(c.top, 0), W = Oe(c.bottom, 0);
        v ? M = y - 2 * (x !== 0 || V !== 0 ? x + V : Oe(c.left, c.right)) : I = w - 2 * (k !== 0 || W !== 0 ? k + W : Oe(c.top, c.bottom));
      }
      await u({
        ...o,
        availableWidth: M,
        availableHeight: I
      });
      const j = await l.getDimensions(i.floating);
      return y !== j.width || w !== j.height ? {
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
  return xn(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function Ae(e) {
  var o;
  return (e == null || (o = e.ownerDocument) == null ? void 0 : o.defaultView) || window;
}
function Ke(e) {
  var o;
  return (o = (xn(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : o.documentElement;
}
function xn(e) {
  return xo() ? e instanceof Node || e instanceof Ae(e).Node : !1;
}
function Re(e) {
  return xo() ? e instanceof Element || e instanceof Ae(e).Element : !1;
}
function Je(e) {
  return xo() ? e instanceof HTMLElement || e instanceof Ae(e).HTMLElement : !1;
}
function nr(e) {
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
function eu(e) {
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
const tu = /transform|translate|scale|rotate|perspective|filter/, ou = /paint|layout|strict|content/, dt = (e) => !!e && e !== "none";
let jo;
function qn(e) {
  const o = Re(e) ? Fe(e) : e;
  return dt(o.transform) || dt(o.translate) || dt(o.scale) || dt(o.rotate) || dt(o.perspective) || !Bn() && (dt(o.backdropFilter) || dt(o.filter)) || tu.test(o.willChange || "") || ou.test(o.contain || "");
}
function nu(e) {
  let o = st(e);
  for (; Je(o) && !Pt(o); ) {
    if (qn(o))
      return o;
    if (qo(o))
      return null;
    o = st(o);
  }
  return null;
}
function Bn() {
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
    nr(e) && e.host || // Fallback.
    Ke(e)
  );
  return nr(o) ? o.host : o;
}
function Yr(e) {
  const o = st(e);
  return Pt(o) ? e.ownerDocument ? e.ownerDocument.body : e.body : Je(o) && Jt(o) ? o : Yr(o);
}
function Lt(e, o, t) {
  var n;
  o === void 0 && (o = []), t === void 0 && (t = !0);
  const r = Yr(e), s = r === ((n = e.ownerDocument) == null ? void 0 : n.body), l = Ae(r);
  if (s) {
    const i = on(l);
    return o.concat(l, l.visualViewport || [], Jt(r) ? r : [], i && t ? Lt(i) : []);
  } else
    return o.concat(r, Lt(r, [], t));
}
function on(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Xr(e) {
  const o = Fe(e);
  let t = parseFloat(o.width) || 0, n = parseFloat(o.height) || 0;
  const r = Je(e), s = r ? e.offsetWidth : t, l = r ? e.offsetHeight : n, i = co(t) !== s || co(n) !== l;
  return i && (t = s, n = l), {
    width: t,
    height: n,
    $: i
  };
}
function On(e) {
  return Re(e) ? e : e.contextElement;
}
function qt(e) {
  const o = On(e);
  if (!Je(o))
    return Le(1);
  const t = o.getBoundingClientRect(), {
    width: n,
    height: r,
    $: s
  } = Xr(o);
  let l = (s ? co(t.width) : t.width) / n, i = (s ? co(t.height) : t.height) / r;
  return (!l || !Number.isFinite(l)) && (l = 1), (!i || !Number.isFinite(i)) && (i = 1), {
    x: l,
    y: i
  };
}
const ru = /* @__PURE__ */ Le(0);
function Jr(e) {
  const o = Ae(e);
  return !Bn() || !o.visualViewport ? ru : {
    x: o.visualViewport.offsetLeft,
    y: o.visualViewport.offsetTop
  };
}
function au(e, o, t) {
  return o === void 0 && (o = !1), !t || o && t !== Ae(e) ? !1 : o;
}
function ft(e, o, t, n) {
  o === void 0 && (o = !1), t === void 0 && (t = !1);
  const r = e.getBoundingClientRect(), s = On(e);
  let l = Le(1);
  o && (n ? Re(n) && (l = qt(n)) : l = qt(e));
  const i = au(s, t, n) ? Jr(s) : Le(0);
  let u = (r.left + i.x) / l.x, d = (r.top + i.y) / l.y, c = r.width / l.x, p = r.height / l.y;
  if (s) {
    const f = Ae(s), v = n && Re(n) ? Ae(n) : n;
    let y = f, w = on(y);
    for (; w && n && v !== y; ) {
      const S = qt(w), O = w.getBoundingClientRect(), q = Fe(w), B = O.left + (w.clientLeft + parseFloat(q.paddingLeft)) * S.x, C = O.top + (w.clientTop + parseFloat(q.paddingTop)) * S.y;
      u *= S.x, d *= S.y, c *= S.x, p *= S.y, u += B, d += C, y = Ae(w), w = on(y);
    }
  }
  return fo({
    width: c,
    height: p,
    x: u,
    y: d
  });
}
function Oo(e, o) {
  const t = Bo(e).scrollLeft;
  return o ? o.left + t : ft(Ke(e)).left + t;
}
function Zr(e, o) {
  const t = e.getBoundingClientRect(), n = t.left + o.scrollLeft - Oo(e, t), r = t.top + o.scrollTop;
  return {
    x: n,
    y: r
  };
}
function su(e) {
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
  }, d = Le(1);
  const c = Le(0), p = Je(n);
  if ((p || !p && !s) && ((yt(n) !== "body" || Jt(l)) && (u = Bo(n)), p)) {
    const v = ft(n);
    d = qt(n), c.x = v.x + n.clientLeft, c.y = v.y + n.clientTop;
  }
  const f = l && !p && !s ? Zr(l, u) : Le(0);
  return {
    width: t.width * d.x,
    height: t.height * d.y,
    x: t.x * d.x - u.scrollLeft * d.x + c.x + f.x,
    y: t.y * d.y - u.scrollTop * d.y + c.y + f.y
  };
}
function lu(e) {
  return Array.from(e.getClientRects());
}
function iu(e) {
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
const rr = 25;
function uu(e, o) {
  const t = Ae(e), n = Ke(e), r = t.visualViewport;
  let s = n.clientWidth, l = n.clientHeight, i = 0, u = 0;
  if (r) {
    s = r.width, l = r.height;
    const c = Bn();
    (!c || c && o === "fixed") && (i = r.offsetLeft, u = r.offsetTop);
  }
  const d = Oo(n);
  if (d <= 0) {
    const c = n.ownerDocument, p = c.body, f = getComputedStyle(p), v = c.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, y = Math.abs(n.clientWidth - p.clientWidth - v);
    y <= rr && (s -= y);
  } else d <= rr && (s += d);
  return {
    width: s,
    height: l,
    x: i,
    y: u
  };
}
function du(e, o) {
  const t = ft(e, !0, o === "fixed"), n = t.top + e.clientTop, r = t.left + e.clientLeft, s = Je(e) ? qt(e) : Le(1), l = e.clientWidth * s.x, i = e.clientHeight * s.y, u = r * s.x, d = n * s.y;
  return {
    width: l,
    height: i,
    x: u,
    y: d
  };
}
function ar(e, o, t) {
  let n;
  if (o === "viewport")
    n = uu(e, t);
  else if (o === "document")
    n = iu(Ke(e));
  else if (Re(o))
    n = du(o, t);
  else {
    const r = Jr(e);
    n = {
      x: o.x - r.x,
      y: o.y - r.y,
      width: o.width,
      height: o.height
    };
  }
  return fo(n);
}
function Qr(e, o) {
  const t = st(e);
  return t === o || !Re(t) || Pt(t) ? !1 : Fe(t).position === "fixed" || Qr(t, o);
}
function cu(e, o) {
  const t = o.get(e);
  if (t)
    return t;
  let n = Lt(e, [], !1).filter((i) => Re(i) && yt(i) !== "body"), r = null;
  const s = Fe(e).position === "fixed";
  let l = s ? st(e) : e;
  for (; Re(l) && !Pt(l); ) {
    const i = Fe(l), u = qn(l);
    !u && i.position === "fixed" && (r = null), (s ? !u && !r : !u && i.position === "static" && !!r && (r.position === "absolute" || r.position === "fixed") || Jt(l) && !u && Qr(e, l)) ? n = n.filter((c) => c !== l) : r = i, l = st(l);
  }
  return o.set(e, n), n;
}
function pu(e) {
  let {
    element: o,
    boundary: t,
    rootBoundary: n,
    strategy: r
  } = e;
  const l = [...t === "clippingAncestors" ? qo(o) ? [] : cu(o, this._c) : [].concat(t), n], i = ar(o, l[0], r);
  let u = i.top, d = i.right, c = i.bottom, p = i.left;
  for (let f = 1; f < l.length; f++) {
    const v = ar(o, l[f], r);
    u = Oe(v.top, u), d = at(v.right, d), c = at(v.bottom, c), p = Oe(v.left, p);
  }
  return {
    width: d - p,
    height: c - u,
    x: p,
    y: u
  };
}
function fu(e) {
  const {
    width: o,
    height: t
  } = Xr(e);
  return {
    width: o,
    height: t
  };
}
function vu(e, o, t) {
  const n = Je(o), r = Ke(o), s = t === "fixed", l = ft(e, !0, s, o);
  let i = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const u = Le(0);
  function d() {
    u.x = Oo(r);
  }
  if (n || !n && !s)
    if ((yt(o) !== "body" || Jt(r)) && (i = Bo(o)), n) {
      const v = ft(o, !0, s, o);
      u.x = v.x + o.clientLeft, u.y = v.y + o.clientTop;
    } else r && d();
  s && !n && r && d();
  const c = r && !n && !s ? Zr(r, i) : Le(0), p = l.left + i.scrollLeft - u.x - c.x, f = l.top + i.scrollTop - u.y - c.y;
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
function sr(e, o) {
  if (!Je(e) || Fe(e).position === "fixed")
    return null;
  if (o)
    return o(e);
  let t = e.offsetParent;
  return Ke(e) === t && (t = t.ownerDocument.body), t;
}
function ea(e, o) {
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
  let n = sr(e, o);
  for (; n && eu(n) && zo(n); )
    n = sr(n, o);
  return n && Pt(n) && zo(n) && !qn(n) ? t : n || nu(e) || t;
}
const mu = async function(e) {
  const o = this.getOffsetParent || ea, t = this.getDimensions, n = await t(e.floating);
  return {
    reference: vu(e.reference, await o(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function yu(e) {
  return Fe(e).direction === "rtl";
}
const gu = {
  convertOffsetParentRelativeRectToViewportRelativeRect: su,
  getDocumentElement: Ke,
  getClippingRect: pu,
  getOffsetParent: ea,
  getElementRects: mu,
  getClientRects: lu,
  getDimensions: fu,
  getScale: qt,
  isElement: Re,
  isRTL: yu
};
function ta(e, o) {
  return e.x === o.x && e.y === o.y && e.width === o.width && e.height === o.height;
}
function hu(e, o) {
  let t = null, n;
  const r = Ke(e);
  function s() {
    var i;
    clearTimeout(n), (i = t) == null || i.disconnect(), t = null;
  }
  function l(i, u) {
    i === void 0 && (i = !1), u === void 0 && (u = 1), s();
    const d = e.getBoundingClientRect(), {
      left: c,
      top: p,
      width: f,
      height: v
    } = d;
    if (i || o(), !f || !v)
      return;
    const y = ro(p), w = ro(r.clientWidth - (c + f)), S = ro(r.clientHeight - (p + v)), O = ro(c), B = {
      rootMargin: -y + "px " + -w + "px " + -S + "px " + -O + "px",
      threshold: Oe(0, at(1, u)) || 1
    };
    let C = !0;
    function $(D) {
      const I = D[0].intersectionRatio;
      if (I !== u) {
        if (!C)
          return l();
        I ? l(!1, I) : n = setTimeout(() => {
          l(!1, 1e-7);
        }, 1e3);
      }
      I === 1 && !ta(d, e.getBoundingClientRect()) && l(), C = !1;
    }
    try {
      t = new IntersectionObserver($, {
        ...B,
        // Handle <iframe>s
        root: r.ownerDocument
      });
    } catch {
      t = new IntersectionObserver($, B);
    }
    t.observe(e);
  }
  return l(!0), s;
}
function bu(e, o, t, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: r = !0,
    ancestorResize: s = !0,
    elementResize: l = typeof ResizeObserver == "function",
    layoutShift: i = typeof IntersectionObserver == "function",
    animationFrame: u = !1
  } = n, d = On(e), c = r || s ? [...d ? Lt(d) : [], ...o ? Lt(o) : []] : [];
  c.forEach((O) => {
    r && O.addEventListener("scroll", t, {
      passive: !0
    }), s && O.addEventListener("resize", t);
  });
  const p = d && i ? hu(d, t) : null;
  let f = -1, v = null;
  l && (v = new ResizeObserver((O) => {
    let [q] = O;
    q && q.target === d && v && o && (v.unobserve(o), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var B;
      (B = v) == null || B.observe(o);
    })), t();
  }), d && !u && v.observe(d), o && v.observe(o));
  let y, w = u ? ft(e) : null;
  u && S();
  function S() {
    const O = ft(e);
    w && !ta(w, O) && t(), w = O, y = requestAnimationFrame(S);
  }
  return t(), () => {
    var O;
    c.forEach((q) => {
      r && q.removeEventListener("scroll", t), s && q.removeEventListener("resize", t);
    }), p?.(), (O = v) == null || O.disconnect(), v = null, u && cancelAnimationFrame(y);
  };
}
const _u = Xi, wu = Ji, lr = Ui, Cu = Qi, Su = Gi, xu = Wi, qu = Zi, Bu = (e, o, t) => {
  const n = /* @__PURE__ */ new Map(), r = {
    platform: gu,
    ...t
  }, s = {
    ...r.platform,
    _c: n
  };
  return Hi(e, o, {
    ...r,
    platform: s
  });
};
function Ou(e) {
  return e != null && typeof e == "object" && "$el" in e;
}
function nn(e) {
  if (Ou(e)) {
    const o = e.$el;
    return xn(o) && yt(o) === "#comment" ? null : o;
  }
  return e;
}
function Ct(e) {
  return typeof e == "function" ? e() : a(e);
}
function Au(e) {
  return {
    name: "arrow",
    options: e,
    fn(o) {
      const t = nn(Ct(e.element));
      return t == null ? {} : xu({
        element: t,
        padding: e.padding
      }).fn(o);
    }
  };
}
function oa(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function ir(e, o) {
  const t = oa(e);
  return Math.round(o * t) / t;
}
function Pu(e, o, t) {
  t === void 0 && (t = {});
  const n = t.whileElementsMounted, r = A(() => {
    var I;
    return (I = Ct(t.open)) != null ? I : !0;
  }), s = A(() => Ct(t.middleware)), l = A(() => {
    var I;
    return (I = Ct(t.placement)) != null ? I : "bottom";
  }), i = A(() => {
    var I;
    return (I = Ct(t.strategy)) != null ? I : "absolute";
  }), u = A(() => {
    var I;
    return (I = Ct(t.transform)) != null ? I : !0;
  }), d = A(() => nn(e.value)), c = A(() => nn(o.value)), p = P(0), f = P(0), v = P(i.value), y = P(l.value), w = Kt({}), S = P(!1), O = A(() => {
    const I = {
      position: v.value,
      left: "0",
      top: "0"
    };
    if (!c.value)
      return I;
    const M = ir(c.value, p.value), j = ir(c.value, f.value);
    return u.value ? {
      ...I,
      transform: "translate(" + M + "px, " + j + "px)",
      ...oa(c.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: v.value,
      left: M + "px",
      top: j + "px"
    };
  });
  let q;
  function B() {
    if (d.value == null || c.value == null)
      return;
    const I = r.value;
    Bu(d.value, c.value, {
      middleware: s.value,
      placement: l.value,
      strategy: i.value
    }).then((M) => {
      p.value = M.x, f.value = M.y, v.value = M.strategy, y.value = M.placement, w.value = M.middlewareData, S.value = I !== !1;
    });
  }
  function C() {
    typeof q == "function" && (q(), q = void 0);
  }
  function $() {
    if (C(), n === void 0) {
      B();
      return;
    }
    if (d.value != null && c.value != null) {
      q = n(d.value, c.value, B);
      return;
    }
  }
  function D() {
    r.value || (S.value = !1);
  }
  return re([s, l, i, r], B, {
    flush: "sync"
  }), re([d, c], $, {
    flush: "sync"
  }), re(r, D, {
    flush: "sync"
  }), fr() && vr(C), {
    x: ct(p),
    y: ct(f),
    strategy: ct(v),
    placement: ct(y),
    middlewareData: ct(w),
    isPositioned: ct(S),
    floatingStyles: O,
    update: B
  };
}
const na = {
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
}, [Dm, Tu] = /* @__PURE__ */ oe("PopperContent");
var Eu = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ br({
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
  }, { ...na }),
  emits: ["placed"],
  setup(e, { emit: o }) {
    const t = e, n = o, r = Wr(), { forwardRef: s, currentElement: l } = N(), i = P(), u = P(), { width: d, height: c } = $r(u), p = A(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), f = A(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), v = A(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), y = A(() => ({
      padding: f.value,
      boundary: v.value.filter(Di),
      altBoundary: v.value.length > 0
    })), w = A(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), S = As(() => [
      _u({
        mainAxis: t.sideOffset + c.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && lr({
        ...y.value,
        ...w.value
      }),
      t.avoidCollisions && wu({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? qu() : void 0,
        ...y.value
      }),
      !t.prioritizePosition && t.avoidCollisions && lr({
        ...y.value,
        ...w.value
      }),
      Cu({
        ...y.value,
        apply: ({ elements: k, rects: W, availableWidth: G, availableHeight: R }) => {
          const { width: z, height: U } = W.reference, ne = k.floating.style;
          ne.setProperty("--reka-popper-available-width", `${G}px`), ne.setProperty("--reka-popper-available-height", `${R}px`), ne.setProperty("--reka-popper-anchor-width", `${z}px`), ne.setProperty("--reka-popper-anchor-height", `${U}px`);
        }
      }),
      u.value && Au({
        element: u.value,
        padding: t.arrowPadding
      }),
      ki({
        arrowWidth: d.value,
        arrowHeight: c.value
      }),
      t.hideWhenDetached && Su({
        strategy: "referenceHidden",
        ...y.value
      })
    ]), O = A(() => t.reference ?? r.anchor.value), { floatingStyles: q, placement: B, isPositioned: C, middlewareData: $ } = Pu(O, i, {
      strategy: t.positionStrategy,
      placement: p,
      whileElementsMounted: (...k) => bu(...k, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: S
    }), D = A(() => Qo(B.value)[0]), I = A(() => Qo(B.value)[1]);
    hr(() => {
      C.value && n("placed");
    });
    const M = A(() => {
      const k = $.value.arrow?.centerOffset !== 0;
      return t.hideShiftedArrow && k;
    }), j = P("");
    se(() => {
      l.value && (j.value = window.getComputedStyle(l.value).zIndex);
    });
    const x = A(() => $.value.arrow?.x ?? 0), V = A(() => $.value.arrow?.y ?? 0);
    return Tu({
      placedSide: D,
      onArrowChange: (k) => u.value = k,
      arrowX: x,
      arrowY: V,
      shouldHideArrow: M
    }), (k, W) => (m(), H("div", {
      ref_key: "floatingRef",
      ref: i,
      "data-reka-popper-content-wrapper": "",
      style: Te({
        ...a(q),
        transform: a(C) ? a(q).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: j.value,
        "--reka-popper-transform-origin": [a($).transformOrigin?.x, a($).transformOrigin?.y].join(" "),
        ...a($).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [F(a(K), E({ ref: a(s) }, k.$attrs, {
      "as-child": t.asChild,
      as: k.as,
      "data-side": D.value,
      "data-align": I.value,
      style: { animation: a(C) ? void 0 : "none" }
    }), {
      default: g(() => [b(k.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), Ao = Eu;
function Du(e) {
  const o = ho({ nonce: P() });
  return A(() => e?.value || o.nonce?.value);
}
const [ra, ku] = /* @__PURE__ */ oe("AvatarRoot");
var Iu = /* @__PURE__ */ h({
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
    return N(), ku({ imageLoadingStatus: P("idle") }), (o, t) => (m(), _(a(K), {
      "as-child": o.asChild,
      as: o.as
    }, {
      default: g(() => [b(o.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), $u = Iu, Mu = /* @__PURE__ */ h({
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
    const o = e, t = ra();
    N();
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
      default: g(() => [b(r.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"])) : de("v-if", !0);
  }
}), Ru = Mu;
function ur(e, o) {
  return e ? o ? (e.src !== o && (e.src = o), e.complete && e.naturalWidth > 0 ? "loaded" : "loading") : "error" : "idle";
}
function Fu(e, { referrerPolicy: o, crossOrigin: t } = {}) {
  const n = P(!1), r = P(null), s = A(() => n.value ? (!r.value && Ee && (r.value = new window.Image()), r.value) : null), l = P(ur(s.value, e.value)), i = (u) => () => {
    n.value && (l.value = u);
  };
  return pe(() => {
    n.value = !0, se((u) => {
      const d = s.value;
      if (!d) return;
      l.value = ur(d, e.value);
      const c = i("loaded"), p = i("error");
      d.addEventListener("load", c), d.addEventListener("error", p), o?.value && (d.referrerPolicy = o.value), typeof t?.value == "string" && (d.crossOrigin = t.value), u(() => {
        d.removeEventListener("load", c), d.removeEventListener("error", p);
      });
    });
  }), Xe(() => {
    n.value = !1;
  }), l;
}
var Vu = /* @__PURE__ */ h({
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
    N();
    const i = ra(), u = Fu(r, {
      referrerPolicy: s,
      crossOrigin: l
    });
    return re(u, (d) => {
      n("loadingStatusChange", d), d !== "idle" && (i.imageLoadingStatus.value = d);
    }, { immediate: !0 }), (d, c) => ln((m(), _(a(K), {
      role: "img",
      "as-child": d.asChild,
      as: d.as,
      src: a(r),
      referrerpolicy: a(s),
      crossorigin: a(l)
    }, {
      default: g(() => [b(d.$slots, "default")]),
      _: 3
    }, 8, [
      "as-child",
      "as",
      "src",
      "referrerpolicy",
      "crossorigin"
    ])), [[Ha, a(u) === "loaded"]]);
  }
}), Nu = Vu;
const [Lu, ju] = /* @__PURE__ */ oe("RovingFocusGroup");
var zu = /* @__PURE__ */ h({
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
    const n = e, r = t, { loop: s, orientation: l, dir: i } = ue(n), u = lt(i), d = /* @__PURE__ */ fe(n, "currentTabStopId", r, {
      defaultValue: n.defaultCurrentTabStopId,
      passive: n.currentTabStopId === void 0
    }), c = P(!1), p = P(!1), f = P(0), { getItems: v, CollectionSlot: y } = ke({ isProvider: !0 });
    function w(O) {
      const q = !p.value;
      if (O.currentTarget && O.target === O.currentTarget && q && !c.value) {
        const B = new CustomEvent(Si, xi);
        if (O.currentTarget.dispatchEvent(B), r("entryFocus", B), !B.defaultPrevented) {
          const C = v().map((j) => j.ref).filter((j) => j.dataset.disabled !== ""), $ = C.find((j) => j.getAttribute("data-active") === ""), D = C.find((j) => j.getAttribute("data-highlighted") === ""), I = C.find((j) => j.id === d.value), M = [
            $,
            D,
            I,
            ...C
          ].filter(Boolean);
          Hr(M, n.preventScrollOnEntryFocus);
        }
      }
      p.value = !1;
    }
    function S() {
      setTimeout(() => {
        p.value = !1;
      }, 1);
    }
    return o({ getItems: v }), ju({
      loop: s,
      dir: u,
      orientation: l,
      currentTabStopId: d,
      onItemFocus: (O) => {
        d.value = O;
      },
      onItemShiftTab: () => {
        c.value = !0;
      },
      onFocusableItemAdd: () => {
        f.value++;
      },
      onFocusableItemRemove: () => {
        f.value--;
      }
    }), (O, q) => (m(), _(a(y), null, {
      default: g(() => [F(a(K), {
        tabindex: c.value || f.value === 0 ? -1 : 0,
        "data-orientation": a(l),
        as: O.as,
        "as-child": O.asChild,
        dir: a(u),
        style: { outline: "none" },
        onMousedown: q[0] || (q[0] = (B) => p.value = !0),
        onMouseup: S,
        onFocus: w,
        onBlur: q[1] || (q[1] = (B) => c.value = !1)
      }, {
        default: g(() => [b(O.$slots, "default")]),
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
}), An = zu, Ku = /* @__PURE__ */ h({
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
    const o = e, t = Lu(), n = be(), r = A(() => o.tabStopId || n), s = A(() => t.currentTabStopId.value === r.value), { getItems: l, CollectionItem: i } = ke();
    pe(() => {
      o.focusable && t.onFocusableItemAdd();
    }), Xe(() => {
      o.focusable && t.onFocusableItemRemove();
    });
    function u(d) {
      if (d.key === "Tab" && d.shiftKey) {
        t.onItemShiftTab();
        return;
      }
      if (d.target !== d.currentTarget) return;
      const c = Oi(d, t.orientation.value, t.dir.value);
      if (c !== void 0) {
        if (d.metaKey || d.ctrlKey || d.altKey || !o.allowShiftKey && d.shiftKey) return;
        d.preventDefault();
        let p = [...l().map((f) => f.ref).filter((f) => f.dataset.disabled !== "")];
        if (c === "last") p.reverse();
        else if (c === "prev" || c === "next") {
          c === "prev" && p.reverse();
          const f = p.indexOf(d.currentTarget);
          p = t.loop.value ? Ai(p, f + 1) : p.slice(f + 1);
        }
        ce(() => Hr(p));
      }
    }
    return (d, c) => (m(), _(a(i), null, {
      default: g(() => [F(a(K), {
        tabindex: s.value ? 0 : -1,
        "data-orientation": a(t).orientation.value,
        "data-active": d.active ? "" : void 0,
        "data-disabled": d.focusable ? void 0 : "",
        as: d.as,
        "as-child": d.asChild,
        onMousedown: c[0] || (c[0] = (p) => {
          d.focusable ? a(t).onItemFocus(r.value) : p.preventDefault();
        }),
        onFocus: c[1] || (c[1] = (p) => a(t).onItemFocus(r.value)),
        onKeydown: u
      }, {
        default: g(() => [b(d.$slots, "default")]),
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
}), Pn = Ku;
const [Hu] = /* @__PURE__ */ oe("CheckboxGroupRoot");
function Tn(e) {
  return e === "indeterminate";
}
function aa(e) {
  return Tn(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
const [Wu, Uu] = /* @__PURE__ */ oe("CheckboxRoot");
var Gu = /* @__PURE__ */ h({
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
    const t = e, n = o, { forwardRef: r, currentElement: s } = N(), l = Hu(null), i = /* @__PURE__ */ fe(t, "modelValue", n, {
      defaultValue: t.defaultValue ?? t.falseValue,
      passive: t.modelValue === void 0
    }), u = A(() => l?.disabled.value || t.disabled), d = A(() => nt(i.value, t.trueValue)), c = A(() => rt(l?.modelValue.value) ? i.value === "indeterminate" ? "indeterminate" : d.value : Wo(l.modelValue.value, t.value));
    function p() {
      if (rt(l?.modelValue.value))
        i.value === "indeterminate" ? i.value = t.trueValue : i.value = d.value ? t.falseValue : t.trueValue;
      else {
        const y = [...l.modelValue.value || []];
        if (Wo(y, t.value)) {
          const w = y.findIndex((S) => nt(S, t.value));
          y.splice(w, 1);
        } else y.push(t.value);
        l.modelValue.value = y;
      }
    }
    const f = kt(s), v = A(() => t.id && s.value ? document.querySelector(`[for="${t.id}"]`)?.innerText : void 0);
    return Uu({
      disabled: u,
      state: c
    }), (y, w) => (m(), _($e(a(l)?.rovingFocus.value ? a(Pn) : a(K)), E(y.$attrs, {
      id: y.id,
      ref: a(r),
      role: "checkbox",
      "as-child": y.asChild,
      as: y.as,
      type: y.as === "button" ? "button" : void 0,
      "aria-checked": a(Tn)(c.value) ? "mixed" : c.value,
      "aria-required": y.required,
      "aria-label": y.$attrs["aria-label"] || v.value,
      "data-state": a(aa)(c.value),
      "data-disabled": u.value ? "" : void 0,
      disabled: u.value,
      focusable: a(l)?.rovingFocus.value ? !u.value : void 0,
      onKeydown: Tt(Ce(() => {
      }, ["prevent"]), ["enter"]),
      onClick: p
    }), {
      default: g(() => [b(y.$slots, "default", {
        modelValue: a(i),
        state: c.value
      }), a(f) && y.name && !a(l) ? (m(), _(a(Yt), {
        key: 0,
        type: "checkbox",
        checked: !!c.value,
        name: y.name,
        value: y.value,
        disabled: u.value,
        required: y.required
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
}), Yu = Gu, Xu = /* @__PURE__ */ h({
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
    const { forwardRef: o } = N(), t = Wu();
    return (n, r) => (m(), _(a(De), { present: n.forceMount || a(Tn)(a(t).state.value) || a(t).state.value === !0 }, {
      default: g(() => [F(a(K), E({
        ref: a(o),
        "data-state": a(aa)(a(t).state.value),
        "data-disabled": a(t).disabled.value ? "" : void 0,
        style: { pointerEvents: "none" },
        "as-child": n.asChild,
        as: n.as
      }, n.$attrs), {
        default: g(() => [b(n.$slots, "default")]),
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
}), Ju = Xu;
function Zu(e = [], o, t) {
  const n = [...e];
  return n[t] = o, n.sort((r, s) => r - s);
}
function sa(e, o, t) {
  const s = 100 / (t - o) * (e - o);
  return lo(s, 0, 100);
}
function Qu(e, o) {
  return o > 2 ? `Value ${e + 1} of ${o}` : o === 2 ? ["Minimum", "Maximum"][e] : void 0;
}
function ed(e, o) {
  if (e.length === 1) return 0;
  const t = e.map((r) => Math.abs(r - o)), n = Math.min(...t);
  return t.indexOf(n);
}
function td(e, o, t) {
  const n = e / 2, s = En([0, 50], [0, n]);
  return (n - s(o) * t) * t;
}
function od(e) {
  return e.slice(0, -1).map((o, t) => e[t + 1] - o);
}
function nd(e, o) {
  if (o > 0) {
    const t = od(e);
    return Math.min(...t) >= o;
  }
  return !0;
}
function En(e, o) {
  return (t) => {
    if (e[0] === e[1] || o[0] === o[1]) return o[0];
    const n = (o[1] - o[0]) / (e[1] - e[0]);
    return o[0] + n * (t - e[0]);
  };
}
function rd(e) {
  return (String(e).split(".")[1] || "").length;
}
function ad(e, o) {
  const t = 10 ** o;
  return Math.round(e * t) / t;
}
const la = ["PageUp", "PageDown"], ia = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight"
], ua = {
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
}, [da, ca] = /* @__PURE__ */ oe(["SliderVertical", "SliderHorizontal"]);
var sd = /* @__PURE__ */ h({
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
    const t = e, n = o, { max: r, min: s, dir: l, inverted: i } = ue(t), { forwardRef: u, currentElement: d } = N(), c = $t(), p = P(), f = P(), v = A(() => l?.value !== "rtl" && !i.value || l?.value !== "ltr" && i.value);
    function y(q, B) {
      const C = f.value || d.value.getBoundingClientRect(), $ = [...c.thumbElements.value][c.valueIndexToChangeRef.value], D = c.thumbAlignment.value === "contain" ? $.clientWidth : 0;
      !p.value && !B && c.thumbAlignment.value === "contain" && (p.value = q.clientX - $.getBoundingClientRect().left);
      const I = [0, C.width - D], M = v.value ? [s.value, r.value] : [r.value, s.value], j = En(I, M);
      f.value = C;
      const x = B ? q.clientX - C.left - D / 2 : q.clientX - C.left - (p.value ?? 0);
      return j(x);
    }
    const w = A(() => v.value ? "left" : "right"), S = A(() => v.value ? "right" : "left"), O = A(() => v.value ? 1 : -1);
    return ca({
      startEdge: w,
      endEdge: S,
      direction: O,
      size: "width"
    }), (q, B) => (m(), _(pa, {
      ref: a(u),
      dir: a(l),
      "data-orientation": "horizontal",
      style: Te({ "--reka-slider-thumb-transform": !v.value && a(c).thumbAlignment.value === "overflow" ? "translateX(50%)" : "translateX(-50%)" }),
      onSlideStart: B[0] || (B[0] = (C) => {
        const $ = y(C, !0);
        n("slideStart", $);
      }),
      onSlideMove: B[1] || (B[1] = (C) => {
        const $ = y(C);
        n("slideMove", $);
      }),
      onSlideEnd: B[2] || (B[2] = () => {
        f.value = void 0, p.value = void 0, n("slideEnd");
      }),
      onStepKeyDown: B[3] || (B[3] = (C) => {
        const $ = v.value ? "from-left" : "from-right", D = a(ua)[$].includes(C.key);
        n("stepKeyDown", C, D ? -1 : 1);
      }),
      onEndKeyDown: B[4] || (B[4] = (C) => n("endKeyDown", C)),
      onHomeKeyDown: B[5] || (B[5] = (C) => n("homeKeyDown", C))
    }, {
      default: g(() => [b(q.$slots, "default")]),
      _: 3
    }, 8, ["dir", "style"]));
  }
}), ld = sd, id = /* @__PURE__ */ h({
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
    const t = e, n = o, { max: r, min: s, inverted: l } = ue(t), i = $t(), { forwardRef: u, currentElement: d } = N(), c = P(), p = P(), f = A(() => !l.value);
    function v(O, q) {
      const B = p.value || d.value.getBoundingClientRect(), C = [...i.thumbElements.value][i.valueIndexToChangeRef.value], $ = i.thumbAlignment.value === "contain" ? C.clientHeight : 0;
      !c.value && !q && i.thumbAlignment.value === "contain" && (c.value = O.clientY - C.getBoundingClientRect().top);
      const D = [0, B.height - $], I = f.value ? [r.value, s.value] : [s.value, r.value], M = En(D, I), j = q ? O.clientY - B.top - $ / 2 : O.clientY - B.top - (c.value ?? 0);
      return p.value = B, M(j);
    }
    const y = A(() => f.value ? "bottom" : "top"), w = A(() => f.value ? "top" : "bottom"), S = A(() => f.value ? 1 : -1);
    return ca({
      startEdge: y,
      endEdge: w,
      direction: S,
      size: "height"
    }), (O, q) => (m(), _(pa, {
      ref: a(u),
      "data-orientation": "vertical",
      style: Te({ "--reka-slider-thumb-transform": !f.value && a(i).thumbAlignment.value === "overflow" ? "translateY(-50%)" : "translateY(50%)" }),
      onSlideStart: q[0] || (q[0] = (B) => {
        const C = v(B, !0);
        n("slideStart", C);
      }),
      onSlideMove: q[1] || (q[1] = (B) => {
        const C = v(B);
        n("slideMove", C);
      }),
      onSlideEnd: q[2] || (q[2] = () => {
        p.value = void 0, c.value = void 0, n("slideEnd");
      }),
      onStepKeyDown: q[3] || (q[3] = (B) => {
        const C = f.value ? "from-bottom" : "from-top", $ = a(ua)[C].includes(B.key);
        n("stepKeyDown", B, $ ? -1 : 1);
      }),
      onEndKeyDown: q[4] || (q[4] = (B) => n("endKeyDown", B)),
      onHomeKeyDown: q[5] || (q[5] = (B) => n("homeKeyDown", B))
    }, {
      default: g(() => [b(O.$slots, "default")]),
      _: 3
    }, 8, ["style"]));
  }
}), ud = id;
const [$t, dd] = /* @__PURE__ */ oe("SliderRoot");
var cd = /* @__PURE__ */ h({
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
    const t = e, n = o, { min: r, max: s, step: l, minStepsBetweenThumbs: i, orientation: u, disabled: d, thumbAlignment: c, dir: p } = ue(t), f = lt(p), { forwardRef: v, currentElement: y } = N(), w = kt(y), { CollectionSlot: S } = ke({ isProvider: !0 }), O = /* @__PURE__ */ fe(t, "modelValue", n, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    }), q = A(() => Array.isArray(O.value) ? [...O.value] : []), B = P(0), C = P(q.value);
    function $(x) {
      const V = ed(q.value, x);
      M(x, V);
    }
    function D(x) {
      M(x, B.value);
    }
    function I() {
      const x = C.value[B.value];
      q.value[B.value] !== x && n("valueCommit", Wa(q.value));
    }
    function M(x, V, { commit: k } = { commit: !1 }) {
      const W = rd(l.value), G = ad(Math.round((x - r.value) / l.value) * l.value + r.value, W), R = lo(G, r.value, s.value), z = Zu(q.value, R, V);
      if (nd(z, i.value * l.value)) {
        B.value = z.indexOf(R);
        const U = String(z) !== String(O.value);
        U && k && n("valueCommit", z), U && (j.value[B.value]?.focus(), O.value = z);
      }
    }
    const j = P([]);
    return dd({
      modelValue: O,
      currentModelValue: q,
      valueIndexToChangeRef: B,
      thumbElements: j,
      orientation: u,
      min: r,
      max: s,
      disabled: d,
      thumbAlignment: c
    }), (x, V) => (m(), _(a(S), null, {
      default: g(() => [(m(), _($e(a(u) === "horizontal" ? ld : ud), E(x.$attrs, {
        ref: a(v),
        "as-child": x.asChild,
        as: x.as,
        min: a(r),
        max: a(s),
        dir: a(f),
        inverted: x.inverted,
        "aria-disabled": a(d),
        "data-disabled": a(d) ? "" : void 0,
        onPointerdown: V[0] || (V[0] = () => {
          a(d) || (C.value = q.value);
        }),
        onSlideStart: V[1] || (V[1] = (k) => !a(d) && $(k)),
        onSlideMove: V[2] || (V[2] = (k) => !a(d) && D(k)),
        onSlideEnd: V[3] || (V[3] = (k) => !a(d) && I()),
        onHomeKeyDown: V[4] || (V[4] = (k) => !a(d) && M(a(r), 0, { commit: !0 })),
        onEndKeyDown: V[5] || (V[5] = (k) => !a(d) && M(a(s), q.value.length - 1, { commit: !0 })),
        onStepKeyDown: V[6] || (V[6] = (k, W) => {
          if (!a(d)) {
            const z = a(la).includes(k.key) || k.shiftKey && a(ia).includes(k.key) ? 10 : 1, U = B.value, ne = q.value[U], ve = a(l) * z * W;
            M(ne + ve, U, { commit: !0 });
          }
        })
      }), {
        default: g(() => [b(x.$slots, "default", { modelValue: a(O) }), a(w) && x.name ? (m(), _(a(Yt), {
          key: 0,
          type: "number",
          value: a(O),
          name: x.name,
          required: x.required,
          disabled: a(d),
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
}), pd = cd, fd = /* @__PURE__ */ h({
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
    const t = e, n = o, r = $t();
    return (s, l) => (m(), _(a(K), E({ "data-slider-impl": "" }, t, {
      onKeydown: l[0] || (l[0] = (i) => {
        i.key === "Home" ? (n("homeKeyDown", i), i.preventDefault()) : i.key === "End" ? (n("endKeyDown", i), i.preventDefault()) : a(la).concat(a(ia)).includes(i.key) && (n("stepKeyDown", i), i.preventDefault());
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
      default: g(() => [b(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), pa = fd, vd = /* @__PURE__ */ h({
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
    const o = $t(), t = da();
    N();
    const n = A(() => o.currentModelValue.value.map((l) => sa(l, o.min.value, o.max.value))), r = A(() => o.currentModelValue.value.length > 1 ? Math.min(...n.value) : 0), s = A(() => 100 - Math.max(...n.value, 0));
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
      default: g(() => [b(l.$slots, "default")]),
      _: 3
    }, 8, [
      "data-disabled",
      "data-orientation",
      "as-child",
      "as",
      "style"
    ]));
  }
}), md = vd, yd = /* @__PURE__ */ h({
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
    const o = e, t = $t(), n = da(), { forwardRef: r, currentElement: s } = N(), { CollectionItem: l } = ke(), i = A(() => t.modelValue?.value?.[o.index]), u = A(() => i.value === void 0 ? 0 : sa(i.value, t.min.value ?? 0, t.max.value ?? 100)), d = A(() => Qu(o.index, t.modelValue?.value?.length ?? 0)), c = $r(s), p = A(() => c[n.size].value), f = A(() => t.thumbAlignment.value === "overflow" || !p.value ? 0 : td(p.value, u.value, n.direction.value)), v = /* @__PURE__ */ dn();
    return pe(() => {
      t.thumbElements.value.push(s.value);
    }), Xe(() => {
      const y = t.thumbElements.value.findIndex((w) => w === s.value) ?? -1;
      t.thumbElements.value.splice(y, 1);
    }), (y, w) => (m(), _(a(l), null, {
      default: g(() => [F(a(K), E(y.$attrs, {
        ref: a(r),
        role: "slider",
        tabindex: a(t).disabled.value ? void 0 : 0,
        "aria-label": y.$attrs["aria-label"] || d.value,
        "data-disabled": a(t).disabled.value ? "" : void 0,
        "data-orientation": a(t).orientation.value,
        "aria-valuenow": i.value,
        "aria-valuemin": a(t).min.value,
        "aria-valuemax": a(t).max.value,
        "aria-orientation": a(t).orientation.value,
        "as-child": y.asChild,
        as: y.as,
        style: {
          transform: "var(--reka-slider-thumb-transform)",
          position: "absolute",
          [a(n).startEdge.value]: `calc(${u.value}% + ${f.value}px)`,
          display: !a(v) && i.value === void 0 ? "none" : void 0
        },
        onFocus: w[0] || (w[0] = () => {
          a(t).valueIndexToChangeRef.value = y.index;
        })
      }), {
        default: g(() => [b(y.$slots, "default")]),
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
}), gd = yd, hd = /* @__PURE__ */ h({
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
    const o = e, { getItems: t } = ke(), { forwardRef: n, currentElement: r } = N(), s = A(() => r.value ? t(!0).findIndex((l) => l.ref === r.value) : -1);
    return (l, i) => (m(), _(gd, E({ ref: a(n) }, o, { index: s.value }), {
      default: g(() => [b(l.$slots, "default")]),
      _: 3
    }, 16, ["index"]));
  }
}), bd = hd, _d = /* @__PURE__ */ h({
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
    const o = $t();
    return N(), (t, n) => (m(), _(a(K), {
      "as-child": t.asChild,
      as: t.as,
      "data-disabled": a(o).disabled.value ? "" : void 0,
      "data-orientation": a(o).orientation.value
    }, {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 8, [
      "as-child",
      "as",
      "data-disabled",
      "data-orientation"
    ]));
  }
}), wd = _d, Cd = /* @__PURE__ */ h({
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
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), fa = Cd;
function Sd() {
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
const xd = /* @__PURE__ */ Ar(Sd), [gt, va] = /* @__PURE__ */ oe(["MenuRoot", "MenuSub"], "MenuContext"), [Zt, qd] = /* @__PURE__ */ oe("MenuRoot");
var Bd = /* @__PURE__ */ h({
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
    const t = e, n = o, { modal: r, dir: s } = ue(t), l = lt(s), i = /* @__PURE__ */ fe(t, "open", n), u = P(), d = xd();
    return va({
      open: i,
      onOpenChange: (c) => {
        i.value = c;
      },
      content: u,
      onContentChange: (c) => {
        u.value = c;
      }
    }), qd({
      onClose: () => {
        i.value = !1;
      },
      isUsingKeyboardRef: d,
      dir: l,
      modal: r
    }), (c, p) => (m(), _(a(Xt), null, {
      default: g(() => [b(c.$slots, "default")]),
      _: 3
    }));
  }
}), Od = Bd;
const [Po, Ad] = /* @__PURE__ */ oe("MenuContent");
var Pd = /* @__PURE__ */ h({
  __name: "MenuContentImpl",
  props: /* @__PURE__ */ br({
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
  }, { ...na }),
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
    pn(), bo(i.value);
    const d = P(""), c = P(0), p = P(0), f = P(null), v = P("right"), y = P(0), w = P(null), S = P(), { forwardRef: O, currentElement: q } = N(), { handleTypeaheadSearch: B } = fn(), C = P();
    function $(R) {
      const z = Uo(R, C.value || he(), q.value, {
        loop: u.value,
        arrowKeyOptions: "vertical",
        dir: s?.dir.value,
        focus: !1,
        attributeName: "[data-reka-collection-item]:not([data-disabled])"
      });
      z && (C.value = z, z.scrollIntoView({ block: "nearest" }));
    }
    function D() {
      C.value && C.value.click();
    }
    const I = P(), M = P();
    re(C, (R) => {
      M.value && (R === void 0 || R !== M.value.trigger.value) && (M.value.onOpenChange(!1), M.value = void 0);
    }), re(q, (R) => {
      r.onContentChange(R);
    }), Xe(() => {
      window.clearTimeout(c.value);
    });
    function j(R) {
      return v.value === f.value?.side && oi(R, f.value?.area);
    }
    async function x(R) {
      n("openAutoFocus", R), !R.defaultPrevented && (R.preventDefault(), q.value?.focus({ preventScroll: !0 }));
    }
    function V(R) {
      if (R.defaultPrevented) return;
      const z = R.target, U = z.closest("[data-reka-menu-content]") === R.currentTarget, ne = ["input", "textarea"].includes(z.tagName.toLowerCase()), ve = R.ctrlKey || R.altKey || R.metaKey, Se = R.key.length === 1, me = Uo(R, he(), q.value, {
        loop: u.value,
        arrowKeyOptions: "vertical",
        dir: s?.dir.value,
        focus: !0,
        attributeName: "[data-reka-collection-item]:not([data-disabled])"
      });
      if (me) return me?.focus();
      if (R.code === "Space") return;
      const He = S.value?.getItems() ?? [];
      if (U && (R.key === "Tab" && R.preventDefault(), !ve && Se && !ne && B(R.key, He)), R.target !== q.value || !Zl.includes(R.key)) return;
      R.preventDefault();
      const bt = [...He.map((Ze) => Ze.ref)];
      Nr.includes(R.key) && bt.reverse(), Zo(bt);
    }
    function k(R) {
      R?.currentTarget?.contains?.(R.target) || (window.clearTimeout(c.value), d.value = "");
    }
    function W(R) {
      if (!At(R)) return;
      const z = R.target, U = y.value !== R.clientX;
      if (R?.currentTarget?.contains(z) && U) {
        const ne = R.clientX > y.value ? "right" : "left";
        v.value = ne, y.value = R.clientX;
      }
    }
    function G(R) {
      At(R) && I.value && I.value.focus();
    }
    return Ad({
      onItemEnter: (R) => !!j(R),
      onItemLeave: (R) => j(R) ? !0 : (["INPUT", "TEXTAREA"].includes(he()?.tagName || "") || q.value?.focus(), w.value = null, !1),
      onTriggerLeave: (R) => !!j(R),
      searchRef: d,
      highlightedElement: C,
      onKeydownNavigation: $,
      onKeydownEnter: D,
      filterElement: I,
      onFilterElementChange: (R) => {
        I.value = R;
      },
      activeSubmenuContext: M,
      pointerGraceTimerRef: p,
      onPointerGraceIntentChange: (R) => {
        f.value = R;
      }
    }), (R, z) => (m(), _(a(Co), {
      "as-child": "",
      trapped: a(l),
      onMountAutoFocus: x,
      onUnmountAutoFocus: z[7] || (z[7] = (U) => n("closeAutoFocus", U))
    }, {
      default: g(() => [F(a(Ut), {
        "as-child": "",
        "disable-outside-pointer-events": a(i),
        onEscapeKeyDown: z[2] || (z[2] = (U) => n("escapeKeyDown", U)),
        onPointerDownOutside: z[3] || (z[3] = (U) => n("pointerDownOutside", U)),
        onFocusOutside: z[4] || (z[4] = (U) => n("focusOutside", U)),
        onInteractOutside: z[5] || (z[5] = (U) => n("interactOutside", U)),
        onDismiss: z[6] || (z[6] = (U) => n("dismiss"))
      }, {
        default: g(() => [F(a(An), {
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
          default: g(() => [F(a(Ao), {
            ref: a(O),
            role: "menu",
            as: R.as,
            "as-child": R.asChild,
            "aria-orientation": "vertical",
            "data-reka-menu-content": "",
            "data-state": a(mn)(a(r).open.value),
            dir: a(s).dir.value,
            side: R.side,
            "side-offset": R.sideOffset,
            align: R.align,
            "align-offset": R.alignOffset,
            "avoid-collisions": R.avoidCollisions,
            "collision-boundary": R.collisionBoundary,
            "collision-padding": R.collisionPadding,
            "arrow-padding": R.arrowPadding,
            "prioritize-position": R.prioritizePosition,
            "position-strategy": R.positionStrategy,
            "update-position-strategy": R.updatePositionStrategy,
            sticky: R.sticky,
            "hide-when-detached": R.hideWhenDetached,
            reference: R.reference,
            onKeydown: V,
            onBlur: k,
            onPointermove: W,
            onPointerenter: G
          }, {
            default: g(() => [b(R.$slots, "default")]),
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
}), Dn = Pd, Td = /* @__PURE__ */ h({
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
    const o = e, t = Po(), { forwardRef: n, currentElement: r } = N(), { CollectionItem: s } = ke(), l = P(!1), i = A(() => l.value || r.value != null && t.highlightedElement.value === r.value);
    async function u(c) {
      if (!(c.defaultPrevented || !At(c))) {
        if (o.disabled) t.onItemLeave(c);
        else if (!t.onItemEnter(c)) {
          const f = c.currentTarget;
          t.highlightedElement.value = f, ["INPUT", "TEXTAREA"].includes(he()?.tagName || "") || f.focus({ preventScroll: !0 });
        }
      }
    }
    async function d(c) {
      if (await ce(), c.defaultPrevented || !At(c) || t.highlightedElement.value !== r.value) return;
      !t.onItemLeave(c) && t.highlightedElement.value === r.value && (t.highlightedElement.value = void 0);
    }
    return (c, p) => (m(), _(a(s), { value: { textValue: c.textValue } }, {
      default: g(() => [F(a(K), E({
        ref: a(n),
        role: "menuitem",
        tabindex: "-1"
      }, c.$attrs, {
        as: c.as,
        "as-child": c.asChild,
        "aria-disabled": c.disabled || void 0,
        "data-disabled": c.disabled ? "" : void 0,
        "data-highlighted": i.value ? "" : void 0,
        onPointermove: u,
        onPointerleave: d,
        onFocus: p[0] || (p[0] = async (f) => {
          await ce(), !(f.defaultPrevented || c.disabled) && (l.value = !0, a(t).highlightedElement.value = f.currentTarget);
        }),
        onBlur: p[1] || (p[1] = async (f) => {
          await ce(), !f.defaultPrevented && (l.value = !1);
        })
      }), {
        default: g(() => [b(c.$slots, "default")]),
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
}), ma = Td, Ed = /* @__PURE__ */ h({
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
    const t = e, n = o, { forwardRef: r, currentElement: s } = N(), l = Zt(), i = Po(), u = P(!1);
    async function d() {
      const c = s.value;
      if (!t.disabled && c) {
        const p = new CustomEvent(Xl, {
          bubbles: !0,
          cancelable: !0
        });
        n("select", p), await ce(), p.defaultPrevented ? u.value = !1 : l.onClose();
      }
    }
    return (c, p) => (m(), _(ma, E(t, {
      ref: a(r),
      onClick: d,
      onPointerdown: p[0] || (p[0] = () => {
        u.value = !0;
      }),
      onPointerup: p[1] || (p[1] = async (f) => {
        await ce(), !f.defaultPrevented && (u.value || f.currentTarget?.click());
      }),
      onKeydown: p[2] || (p[2] = async (f) => {
        const v = a(i).searchRef.value !== "";
        c.disabled || v && f.key === " " || a(Jo).includes(f.key) && (f.currentTarget?.click(), f.preventDefault());
      })
    }), {
      default: g(() => [b(c.$slots, "default")]),
      _: 3
    }, 16));
  }
}), kn = Ed;
const [Dd, ya] = /* @__PURE__ */ oe(["MenuCheckboxItem", "MenuRadioItem"], "MenuItemIndicatorContext");
var kd = /* @__PURE__ */ h({
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
    const o = Dd({ modelValue: P(!1) });
    return (t, n) => (m(), _(a(De), { present: t.forceMount || a(uo)(a(o).modelValue.value) || a(o).modelValue.value === !0 }, {
      default: g(() => [F(a(K), {
        as: t.as,
        "as-child": t.asChild,
        "data-state": a(yn)(a(o).modelValue.value)
      }, {
        default: g(() => [b(t.$slots, "default")]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "data-state"
      ])]),
      _: 3
    }, 8, ["present"]));
  }
}), Id = kd, $d = /* @__PURE__ */ h({
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
    return ya({ modelValue: l }), (i, u) => (m(), _(kn, E({ role: "menuitemcheckbox" }, a(s), {
      "aria-checked": a(uo)(a(l)) ? "mixed" : a(l),
      "data-state": a(yn)(a(l)),
      onSelect: u[0] || (u[0] = async (d) => {
        n("select", d), a(uo)(a(l)) ? l.value = !0 : l.value = !a(l);
      })
    }), {
      default: g(() => [b(i.$slots, "default", { modelValue: a(l) })]),
      _: 3
    }, 16, ["aria-checked", "data-state"]));
  }
}), Md = $d, Rd = /* @__PURE__ */ h({
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
    const t = e, n = o, r = te(t, n), s = gt(), { forwardRef: l, currentElement: i } = N();
    return _o(i), (u, d) => (m(), _(Dn, E(a(r), {
      ref: a(l),
      "trap-focus": a(s).open.value,
      "disable-outside-pointer-events": a(s).open.value,
      "disable-outside-scroll": !0,
      onDismiss: d[0] || (d[0] = (c) => a(s).onOpenChange(!1)),
      onFocusOutside: d[1] || (d[1] = Ce((c) => n("focusOutside", c), ["prevent"]))
    }), {
      default: g(() => [b(u.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus", "disable-outside-pointer-events"]));
  }
}), Fd = Rd, Vd = /* @__PURE__ */ h({
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
    return (l, i) => (m(), _(Dn, E(a(r), {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      "disable-outside-scroll": !1,
      onDismiss: i[0] || (i[0] = (u) => a(s).onOpenChange(!1))
    }), {
      default: g(() => [b(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Nd = Vd, Ld = /* @__PURE__ */ h({
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
      default: g(() => [a(l).modal.value ? (m(), _(Fd, X(E({ key: 0 }, {
        ...i.$attrs,
        ...a(r)
      })), {
        default: g(() => [b(i.$slots, "default")]),
        _: 3
      }, 16)) : (m(), _(Nd, X(E({ key: 1 }, {
        ...i.$attrs,
        ...a(r)
      })), {
        default: g(() => [b(i.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), jd = Ld;
const [zd, Kd] = /* @__PURE__ */ oe("MenuGroup");
var Hd = /* @__PURE__ */ h({
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
    return Kd({ id: t }), (n, r) => (m(), _(a(K), E({ role: "group" }, o, { "aria-labelledby": a(t) }), {
      default: g(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["aria-labelledby"]));
  }
}), ga = Hd, Wd = /* @__PURE__ */ h({
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
    const o = e, t = zd({ id: "" });
    return (n, r) => (m(), _(a(K), E(o, { id: a(t).id || void 0 }), {
      default: g(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Ud = Wd, Gd = /* @__PURE__ */ h({
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
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Yd = Gd;
const [Xd, Jd] = /* @__PURE__ */ oe("MenuRadioGroup");
var Zd = /* @__PURE__ */ h({
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
    return Jd({
      modelValue: l,
      onValueChange: (i) => {
        l.value = i;
      }
    }), (i, u) => (m(), _(ga, X(Q(a(s))), {
      default: g(() => [b(i.$slots, "default", { modelValue: a(l) })]),
      _: 3
    }, 16));
  }
}), Qd = Zd, ec = /* @__PURE__ */ h({
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
    const t = e, n = o, r = J(t, ["value"]), s = ge(r), { value: l } = ue(t), i = Xd(), u = A(() => i.modelValue.value === l?.value);
    return ya({ modelValue: u }), (d, c) => (m(), _(kn, E({ role: "menuitemradio" }, a(s), {
      "aria-checked": u.value,
      "data-state": a(yn)(u.value),
      onSelect: c[0] || (c[0] = async (p) => {
        n("select", p), a(i).onValueChange(a(l));
      })
    }), {
      default: g(() => [b(d.$slots, "default")]),
      _: 3
    }, 16, ["aria-checked", "data-state"]));
  }
}), tc = ec, oc = /* @__PURE__ */ h({
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
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), nc = oc;
const [ha, rc] = /* @__PURE__ */ oe("MenuSub");
var ac = /* @__PURE__ */ h({
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
    }), va({
      open: r,
      onOpenChange: (u) => {
        r.value = u;
      },
      content: i,
      onContentChange: (u) => {
        i.value = u;
      }
    }), rc({
      triggerId: "",
      contentId: "",
      trigger: l,
      onTriggerChange: (u) => {
        l.value = u;
      }
    }), (u, d) => (m(), _(a(Xt), null, {
      default: g(() => [b(u.$slots, "default")]),
      _: 3
    }));
  }
}), sc = ac, lc = /* @__PURE__ */ h({
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
    const r = te(e, o), s = gt(), l = Zt(), i = ha(), u = Po(), { forwardRef: d, currentElement: c } = N();
    return i.contentId ||= be(void 0, "reka-menu-sub-content"), (p, f) => (m(), _(a(De), { present: p.forceMount || a(s).open.value }, {
      default: g(() => [F(Dn, E(a(r), {
        id: a(i).contentId,
        ref: a(d),
        "aria-labelledby": a(i).triggerId,
        align: "start",
        side: a(l).dir.value === "rtl" ? "left" : "right",
        "disable-outside-pointer-events": !1,
        "disable-outside-scroll": !1,
        "trap-focus": !1,
        onOpenAutoFocus: f[0] || (f[0] = Ce((v) => {
          a(l).isUsingKeyboardRef.value && a(c)?.focus();
        }, ["prevent"])),
        onCloseAutoFocus: f[1] || (f[1] = Ce(() => {
        }, ["prevent"])),
        onFocusOutside: f[2] || (f[2] = (v) => {
          if (v.defaultPrevented) return;
          const y = a(u).filterElement.value?.contains(v.target);
          v.target !== a(i).trigger.value && !y && a(s).onOpenChange(!1);
        }),
        onEscapeKeyDown: f[3] || (f[3] = (v) => {
          a(l).onClose(), v.preventDefault();
        }),
        onKeydown: f[4] || (f[4] = (v) => {
          const y = v.currentTarget?.contains(v.target), w = a(ei)[a(l).dir.value].includes(v.key);
          y && w && (a(s).onOpenChange(!1), a(u).filterElement.value ? (a(u).filterElement.value.focus(), a(u).highlightedElement.value = a(i).trigger.value, a(i).trigger.value?.scrollIntoView({ block: "nearest" })) : a(i).trigger.value?.focus(), v.preventDefault());
        })
      }), {
        default: g(() => [b(p.$slots, "default")]),
        _: 3
      }, 16, [
        "id",
        "aria-labelledby",
        "side"
      ])]),
      _: 3
    }, 8, ["present"]));
  }
}), ic = lc, uc = /* @__PURE__ */ h({
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
    const o = e, t = gt(), n = Zt(), r = ha(), s = Po();
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
    async function d(p) {
      if (!At(p)) return;
      i();
      const f = t.content.value?.getBoundingClientRect();
      if (f?.width) {
        const v = t.content.value?.dataset.side, y = v === "right", w = y ? -5 : 5, S = f[y ? "left" : "right"], O = f[y ? "right" : "left"];
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
    async function c(p) {
      const f = s.searchRef.value !== "";
      o.disabled || f && p.key === " " || Ql[n.dir.value].includes(p.key) && (t.onOpenChange(!0), await ce(), t.content.value?.focus(), p.preventDefault());
    }
    return (p, f) => (m(), _(fa, { "as-child": "" }, {
      default: g(() => [F(ma, E(o, {
        id: a(r).triggerId,
        ref: (v) => {
          v && a(r)?.onTriggerChange(v?.$el);
        },
        "aria-haspopup": "menu",
        "aria-expanded": a(t).open.value,
        "aria-controls": a(r).contentId,
        "data-state": a(mn)(a(t).open.value),
        onClick: f[0] || (f[0] = async (v) => {
          o.disabled || v.defaultPrevented || (v.currentTarget?.focus(), a(t).open.value || a(t).onOpenChange(!0));
        }),
        onPointermove: u,
        onPointerleave: d,
        onKeydown: c
      }), {
        default: g(() => [b(p.$slots, "default")]),
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
}), dc = uc;
const [Qt, cc] = /* @__PURE__ */ oe("PopoverRoot");
var pc = /* @__PURE__ */ h({
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
    return cc({
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
    }), (u, d) => (m(), _(a(Xt), null, {
      default: g(() => [b(u.$slots, "default", {
        open: a(s),
        close: () => s.value = !1
      })]),
      _: 3
    }));
  }
}), fc = pc, vc = /* @__PURE__ */ h({
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
    const t = e, n = o, r = ge(J(t, "trapFocus", "disableOutsidePointerEvents")), { forwardRef: s } = N(), l = Qt();
    return pn(), (i, u) => (m(), _(a(Co), {
      "as-child": "",
      loop: "",
      trapped: i.trapFocus,
      onMountAutoFocus: u[5] || (u[5] = (d) => n("openAutoFocus", d)),
      onUnmountAutoFocus: u[6] || (u[6] = (d) => n("closeAutoFocus", d))
    }, {
      default: g(() => [F(a(Ut), {
        "as-child": "",
        "disable-outside-pointer-events": i.disableOutsidePointerEvents,
        onPointerDownOutside: u[0] || (u[0] = (d) => n("pointerDownOutside", d)),
        onInteractOutside: u[1] || (u[1] = (d) => n("interactOutside", d)),
        onEscapeKeyDown: u[2] || (u[2] = (d) => n("escapeKeyDown", d)),
        onFocusOutside: u[3] || (u[3] = (d) => n("focusOutside", d)),
        onDismiss: u[4] || (u[4] = (d) => a(l).onOpenChange(!1))
      }, {
        default: g(() => [F(a(Ao), E(a(r), {
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
          default: g(() => [b(i.$slots, "default")]),
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
}), ba = vc, mc = /* @__PURE__ */ h({
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
    const l = te(t, n), { forwardRef: i, currentElement: u } = N();
    return _o(u), (d, c) => (m(), _(ba, E(a(l), {
      ref: a(i),
      "trap-focus": a(r).open.value,
      "disable-outside-pointer-events": "",
      onCloseAutoFocus: c[0] || (c[0] = Ce((p) => {
        n("closeAutoFocus", p), s.value || a(r).triggerElement.value?.focus();
      }, ["prevent"])),
      onPointerDownOutside: c[1] || (c[1] = (p) => {
        n("pointerDownOutside", p);
        const f = p.detail.originalEvent, v = f.button === 0 && f.ctrlKey === !0, y = f.button === 2 || v;
        s.value = y;
      }),
      onFocusOutside: c[2] || (c[2] = Ce(() => {
      }, ["prevent"]))
    }), {
      default: g(() => [b(d.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), yc = mc, gc = /* @__PURE__ */ h({
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
    return (u, d) => (m(), _(ba, E(a(i), {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: d[0] || (d[0] = (c) => {
        n("closeAutoFocus", c), c.defaultPrevented || (s.value || a(r).triggerElement.value?.focus(), c.preventDefault()), s.value = !1, l.value = !1;
      }),
      onInteractOutside: d[1] || (d[1] = async (c) => {
        n("interactOutside", c), c.defaultPrevented || (s.value = !0, c.detail.originalEvent.type === "pointerdown" && (l.value = !0));
        const p = c.target;
        a(r).triggerElement.value?.contains(p) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && l.value && c.preventDefault();
      })
    }), {
      default: g(() => [b(u.$slots, "default")]),
      _: 3
    }, 16));
  }
}), hc = gc, bc = /* @__PURE__ */ h({
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
    const t = e, n = o, r = Qt(), s = te(t, n), { forwardRef: l } = N();
    return r.contentId ||= be(void 0, "reka-popover-content"), (i, u) => (m(), _(a(De), { present: i.forceMount || a(r).open.value }, {
      default: g(() => [a(r).modal.value ? (m(), _(yc, E({ key: 0 }, a(s), { ref: a(l) }), {
        default: g(() => [b(i.$slots, "default")]),
        _: 3
      }, 16)) : (m(), _(hc, E({ key: 1 }, a(s), { ref: a(l) }), {
        default: g(() => [b(i.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), _c = bc, wc = /* @__PURE__ */ h({
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
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Cc = wc, Sc = /* @__PURE__ */ h({
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
    const o = e, t = Qt(), { forwardRef: n, currentElement: r } = N();
    return t.triggerId ||= be(void 0, "reka-popover-trigger"), pe(() => {
      t.triggerElement.value = r.value;
    }), (s, l) => (m(), _($e(a(t).hasCustomAnchor.value ? a(K) : a(So)), { "as-child": "" }, {
      default: g(() => [F(a(K), {
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
        default: g(() => [b(s.$slots, "default")]),
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
}), xc = Sc, qc = /* @__PURE__ */ h({
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
    return N(), (s, l) => (m(), _(a(Md), X(Q({
      ...t,
      ...a(r)
    })), {
      default: g(() => [b(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Bc = qc;
const [_a, Oc] = /* @__PURE__ */ oe("DropdownMenuRoot");
var Ac = /* @__PURE__ */ h({
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
    N();
    const r = /* @__PURE__ */ fe(t, "open", n, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = P(), { modal: l, dir: i } = ue(t), u = lt(i);
    return Oc({
      open: r,
      onOpenChange: (d) => {
        r.value = d;
      },
      onOpenToggle: () => {
        r.value = !r.value;
      },
      triggerId: "",
      triggerElement: s,
      contentId: "",
      modal: l,
      dir: u
    }), (d, c) => (m(), _(a(Od), {
      open: a(r),
      "onUpdate:open": c[0] || (c[0] = (p) => pt(r) ? r.value = p : null),
      dir: a(u),
      modal: a(l)
    }, {
      default: g(() => [b(d.$slots, "default", { open: a(r) })]),
      _: 3
    }, 8, [
      "open",
      "dir",
      "modal"
    ]));
  }
}), Pc = Ac, Tc = /* @__PURE__ */ h({
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
    N();
    const s = _a(), l = P(!1);
    function i(u) {
      u.defaultPrevented || (l.value || setTimeout(() => {
        s.triggerElement.value?.focus();
      }, 0), l.value = !1, u.preventDefault());
    }
    return s.contentId ||= be(void 0, "reka-dropdown-menu-content"), (u, d) => (m(), _(a(jd), E(a(r), {
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
      onInteractOutside: d[0] || (d[0] = (c) => {
        if (c.defaultPrevented) return;
        const p = c.detail.originalEvent, f = p.button === 0 && p.ctrlKey === !0, v = p.button === 2 || f;
        (!a(s).modal.value || v) && (l.value = !0), a(s).triggerElement.value?.contains(c.target) && c.preventDefault();
      })
    }), {
      default: g(() => [b(u.$slots, "default")]),
      _: 3
    }, 16, ["id", "aria-labelledby"]));
  }
}), Ec = Tc, Dc = /* @__PURE__ */ h({
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
    return N(), (t, n) => (m(), _(a(ga), X(Q(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), kc = Dc, Ic = /* @__PURE__ */ h({
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
    return N(), (s, l) => (m(), _(a(kn), X(Q({
      ...t,
      ...a(r)
    })), {
      default: g(() => [b(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), $c = Ic, Mc = /* @__PURE__ */ h({
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
    return N(), (t, n) => (m(), _(a(Id), X(Q(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), wa = Mc, Rc = /* @__PURE__ */ h({
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
    return N(), (t, n) => (m(), _(a(Ud), X(Q(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Fc = Rc, Vc = /* @__PURE__ */ h({
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
    return (t, n) => (m(), _(a(Yd), X(Q(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Nc = Vc, Lc = /* @__PURE__ */ h({
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
    return N(), (s, l) => (m(), _(a(Qd), X(Q({
      ...t,
      ...a(r)
    })), {
      default: g(() => [b(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), jc = Lc, zc = /* @__PURE__ */ h({
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
    return N(), (s, l) => (m(), _(a(tc), X(Q(a(r))), {
      default: g(() => [b(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Kc = zc, Hc = /* @__PURE__ */ h({
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
    return N(), (t, n) => (m(), _(a(nc), X(Q(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Wc = Hc, Uc = /* @__PURE__ */ h({
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
    return N(), (s, l) => (m(), _(a(sc), {
      open: a(r),
      "onUpdate:open": l[0] || (l[0] = (i) => pt(r) ? r.value = i : null)
    }, {
      default: g(() => [b(s.$slots, "default", { open: a(r) })]),
      _: 3
    }, 8, ["open"]));
  }
}), Gc = Uc, Yc = /* @__PURE__ */ h({
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
    return N(), (s, l) => (m(), _(a(ic), E(a(r), { style: {
      "--reka-dropdown-menu-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-dropdown-menu-content-available-width": "var(--reka-popper-available-width)",
      "--reka-dropdown-menu-content-available-height": "var(--reka-popper-available-height)",
      "--reka-dropdown-menu-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-dropdown-menu-trigger-height": "var(--reka-popper-anchor-height)"
    } }), {
      default: g(() => [b(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Xc = Yc, Jc = /* @__PURE__ */ h({
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
    return N(), (t, n) => (m(), _(a(dc), X(Q(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Zc = Jc, Qc = /* @__PURE__ */ h({
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
    const o = e, t = _a(), { forwardRef: n, currentElement: r } = N();
    return pe(() => {
      t.triggerElement = r;
    }), t.triggerId ||= be(void 0, "reka-dropdown-menu-trigger"), (s, l) => (m(), _(a(fa), { "as-child": "" }, {
      default: g(() => [F(a(K), {
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
        default: g(() => [b(s.$slots, "default")]),
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
}), ep = Qc, tp = /* @__PURE__ */ h({
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
    return N(), (t, n) => (m(), _(a(K), E(o, { onMousedown: n[0] || (n[0] = (r) => {
      !r.defaultPrevented && r.detail > 1 && r.preventDefault();
    }) }), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), op = tp;
const jt = 100, [np, rp] = /* @__PURE__ */ oe("ProgressRoot"), vo = (e) => typeof e == "number";
function ap(e, o) {
  return rt(e) || vo(e) && !Number.isNaN(e) && e <= o && e >= 0 ? e : (console.error(`Invalid prop \`value\` of value \`${e}\` supplied to \`ProgressRoot\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${jt} if no \`max\` prop is set)
  - \`null\`  or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`), null);
}
function sp(e) {
  return vo(e) && !Number.isNaN(e) && e > 0 ? e : (console.error(`Invalid prop \`max\` of value \`${e}\` supplied to \`ProgressRoot\`. Only numbers greater than 0 are valid max values. Defaulting to \`${jt}\`.`), jt);
}
var lp = /* @__PURE__ */ h({
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
    N();
    const r = /* @__PURE__ */ fe(t, "modelValue", n, { passive: t.modelValue === void 0 }), s = /* @__PURE__ */ fe(t, "max", n, { passive: t.max === void 0 });
    re(() => r.value, async (i) => {
      const u = ap(i, t.max);
      u !== i && (await ce(), r.value = u);
    }, { immediate: !0 }), re(() => t.max, (i) => {
      const u = sp(t.max);
      u !== i && (s.value = u);
    }, { immediate: !0 });
    const l = A(() => rt(r.value) ? "indeterminate" : r.value === s.value ? "complete" : "loading");
    return rp({
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
      default: g(() => [b(i.$slots, "default", { modelValue: a(r) })]),
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
}), ip = lp, up = /* @__PURE__ */ h({
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
    const o = e, t = np();
    return N(), (n, r) => (m(), _(a(K), E(o, {
      "data-state": a(t).progressState.value,
      "data-value": a(t).modelValue?.value ?? void 0,
      "data-max": a(t).max.value
    }), {
      default: g(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, [
      "data-state",
      "data-value",
      "data-max"
    ]));
  }
}), dp = up;
const cp = "radio.select";
function pp(e, o, t) {
  yo(cp, t, {
    originalEvent: e,
    value: o
  });
}
var fp = /* @__PURE__ */ h({
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
    const t = e, n = o, r = /* @__PURE__ */ fe(t, "checked", n, { passive: t.checked === void 0 }), { value: s } = ue(t), { forwardRef: l, currentElement: i } = N(), u = kt(i), d = A(() => t.id && i.value ? document.querySelector(`[for="${t.id}"]`)?.innerText ?? t.value : void 0);
    function c(p) {
      t.disabled || pp(p, t.value, (f) => {
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
      "aria-label": d.value,
      "as-child": p.asChild,
      disabled: p.disabled ? "" : void 0,
      "data-state": a(r) ? "checked" : "unchecked",
      "data-disabled": p.disabled ? "" : void 0,
      value: a(s),
      required: p.required,
      name: p.name,
      onClick: Ce(c, ["stop"])
    }), {
      default: g(() => [b(p.$slots, "default", { checked: a(r) }), a(u) && p.name ? (m(), _(a(Yt), {
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
}), vp = fp;
const [mp, yp] = /* @__PURE__ */ oe("RadioGroupRoot");
var gp = /* @__PURE__ */ h({
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
    const t = e, n = o, { forwardRef: r, currentElement: s } = N(), l = /* @__PURE__ */ fe(t, "modelValue", n, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    }), { disabled: i, loop: u, orientation: d, name: c, required: p, dir: f } = ue(t), v = lt(f), y = kt(s);
    return yp({
      modelValue: l,
      changeModelValue: (w) => {
        l.value = w;
      },
      disabled: i,
      loop: u,
      orientation: d,
      name: c?.value,
      required: p
    }), (w, S) => (m(), _(a(An), {
      "as-child": "",
      orientation: a(d),
      dir: a(v),
      loop: a(u)
    }, {
      default: g(() => [F(a(K), {
        ref: a(r),
        role: "radiogroup",
        "data-disabled": a(i) ? "" : void 0,
        "as-child": w.asChild,
        as: w.as,
        "aria-orientation": a(d),
        "aria-required": a(p),
        dir: a(v)
      }, {
        default: g(() => [b(w.$slots, "default", { modelValue: a(l) }), a(y) && a(c) ? (m(), _(a(Yt), {
          key: 0,
          required: a(p),
          disabled: a(i),
          value: a(l),
          name: a(c)
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
}), hp = gp;
const [bp, _p] = /* @__PURE__ */ oe("RadioGroupItem");
var wp = /* @__PURE__ */ h({
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
    const t = e, n = o, { forwardRef: r, currentElement: s } = N(), l = mp(), i = A(() => l.disabled.value || t.disabled), u = A(() => l.required.value || t.required), d = A(() => nt(l.modelValue?.value, t.value));
    _p({
      disabled: i,
      checked: d
    });
    const c = P(!1), p = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight"
    ];
    Ue("keydown", (v) => {
      p.includes(v.key) && (c.value = !0);
    }), Ue("keyup", () => {
      c.value = !1;
    });
    function f() {
      setTimeout(() => {
        c.value && s.value?.click();
      }, 0);
    }
    return (v, y) => (m(), _(a(Pn), {
      checked: d.value,
      disabled: i.value,
      "as-child": "",
      focusable: !i.value,
      active: d.value
    }, {
      default: g(() => [F(vp, E({
        ...v.$attrs,
        ...t
      }, {
        ref: a(r),
        checked: d.value,
        required: u.value,
        disabled: i.value,
        "onUpdate:checked": y[0] || (y[0] = (w) => a(l).changeModelValue(v.value)),
        onSelect: y[1] || (y[1] = (w) => n("select", w)),
        onKeydown: y[2] || (y[2] = Tt(Ce(() => {
        }, ["prevent"]), ["enter"])),
        onFocus: f
      }), {
        default: g(() => [b(v.$slots, "default", {
          checked: d.value,
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
}), Cp = wp, Sp = /* @__PURE__ */ h({
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
    const { forwardRef: o } = N(), t = bp();
    return (n, r) => (m(), _(a(De), { present: n.forceMount || a(t).checked.value }, {
      default: g(() => [F(a(K), E({
        ref: a(o),
        "data-state": a(t).checked.value ? "checked" : "unchecked",
        "data-disabled": a(t).disabled.value ? "" : void 0,
        "as-child": n.asChild,
        as: n.as
      }, n.$attrs), {
        default: g(() => [b(n.$slots, "default")]),
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
}), xp = Sp;
const qp = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], Bp = [" ", "Enter"], Ie = 10;
function zt(e, o, t) {
  return e === void 0 ? !1 : Array.isArray(e) ? e.some((n) => rn(n, o, t)) : rn(e, o, t);
}
function rn(e, o, t) {
  return e === void 0 || o === void 0 ? !1 : typeof e == "string" ? e === o : typeof t == "function" ? t(e, o) : typeof t == "string" ? e?.[t] === o?.[t] : nt(e, o);
}
function Op(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
const Ap = {
  key: 0,
  value: ""
}, [it, Ca] = /* @__PURE__ */ oe("SelectRoot");
var Pp = /* @__PURE__ */ h({
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
    }), d = /* @__PURE__ */ fe(t, "open", n, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), c = P(), p = P(), f = P({
      x: 0,
      y: 0
    }), v = A(() => l.value && Array.isArray(u.value) ? u.value?.length === 0 : rt(u.value));
    ke({ isProvider: !0 });
    const y = lt(i), w = kt(c), S = P(/* @__PURE__ */ new Set()), O = A(() => Array.from(S.value).map((C) => C.value).join(";"));
    function q(C) {
      if (l.value) {
        const $ = Array.isArray(u.value) ? [...u.value] : [], D = $.findIndex((I) => rn(I, C, t.by));
        D === -1 ? $.push(C) : $.splice(D, 1), u.value = [...$];
      } else u.value = C;
    }
    function B(C) {
      return Array.from(S.value).find(($) => zt(C, $.value, t.by));
    }
    return Ca({
      triggerElement: c,
      onTriggerChange: (C) => {
        c.value = C;
      },
      valueElement: p,
      onValueElementChange: (C) => {
        p.value = C;
      },
      contentId: "",
      modelValue: u,
      onValueChange: q,
      by: t.by,
      open: d,
      multiple: l,
      required: r,
      onOpenChange: (C) => {
        d.value = C;
      },
      dir: y,
      triggerPointerDownPosRef: f,
      disabled: s,
      isEmptyModelValue: v,
      optionsSet: S,
      onOptionAdd: (C) => {
        const $ = B(C.value);
        $ && S.value.delete($), S.value.add(C);
      },
      onOptionRemove: (C) => {
        const $ = B(C.value);
        $ && S.value.delete($);
      }
    }), (C, $) => (m(), _(a(Xt), null, {
      default: g(() => [b(C.$slots, "default", {
        modelValue: a(u),
        open: a(d)
      }), a(w) && C.name ? (m(), _(Dp, {
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
        default: g(() => [a(rt)(a(u)) ? (m(), H("option", Ap)) : de("v-if", !0), (m(!0), H(qe, null, Bt(Array.from(S.value), (D) => (m(), H("option", E({ key: D.value ?? "" }, { ref_for: !0 }, D), null, 16))), 128))]),
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
}), Tp = Pp, Ep = /* @__PURE__ */ h({
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
      const i = window.HTMLSelectElement.prototype, d = Object.getOwnPropertyDescriptor(i, "value").set;
      if (s !== l && d && t.value) {
        const c = new Event("change", { bubbles: !0 });
        d.call(t.value, s), t.value.dispatchEvent(c);
      }
    });
    function r(s) {
      n.onValueChange(s.target.value);
    }
    return (s, l) => (m(), _(a(_n), { "as-child": "" }, {
      default: g(() => [ye("select", E({
        ref_key: "selectElement",
        ref: t
      }, o, { onInput: r }), [b(s.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), Dp = Ep, kp = /* @__PURE__ */ h({
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
      default: Ie
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
      default: g(() => [b(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Ip = kp;
const $p = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [ht, Sa] = /* @__PURE__ */ oe("SelectContent");
var Mp = /* @__PURE__ */ h({
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
    pn(), bo(t.bodyLock);
    const { CollectionSlot: s, getItems: l } = ke(), i = P();
    _o(i);
    const { search: u, handleTypeaheadSearch: d } = fn(), c = P(), p = P(), f = P(), v = P(!1), y = P(!1), w = P(!1);
    function S() {
      p.value && i.value && Zo([p.value, i.value]);
    }
    re(v, () => {
      S();
    });
    const { onOpenChange: O, triggerPointerDownPosRef: q } = r;
    se((D) => {
      if (!i.value) return;
      let I = {
        x: 0,
        y: 0
      };
      const M = (x) => {
        I = {
          x: Math.abs(Math.round(x.pageX) - (q.value?.x ?? 0)),
          y: Math.abs(Math.round(x.pageY) - (q.value?.y ?? 0))
        };
      }, j = (x) => {
        x.pointerType !== "touch" && (I.x <= 10 && I.y <= 10 ? x.preventDefault() : i.value?.contains(x.target) || O(!1), document.removeEventListener("pointermove", M), q.value = null);
      };
      q.value !== null && (document.addEventListener("pointermove", M), document.addEventListener("pointerup", j, {
        capture: !0,
        once: !0
      })), D(() => {
        document.removeEventListener("pointermove", M), document.removeEventListener("pointerup", j, { capture: !0 });
      });
    });
    function B(D) {
      const I = D.ctrlKey || D.altKey || D.metaKey;
      if (D.key === "Tab" && D.preventDefault(), !I && D.key.length === 1 && d(D.key, l()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(D.key)) {
        let j = [...l().map((x) => x.ref)];
        if (["ArrowUp", "End"].includes(D.key) && (j = j.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(D.key)) {
          const x = D.target, V = j.indexOf(x);
          j = j.slice(V + 1);
        }
        setTimeout(() => Zo(j)), D.preventDefault();
      }
    }
    const C = A(() => t.position === "popper" ? t : {}), $ = ge(C.value);
    return Sa({
      content: i,
      viewport: c,
      onViewportChange: (D) => {
        c.value = D;
      },
      itemRefCallback: (D, I, M) => {
        const j = !y.value && !M, x = zt(r.modelValue.value, I, r.by);
        if (r.multiple.value) {
          if (w.value) return;
          (x || j) && (p.value = D, x && (w.value = !0));
        } else (x || j) && (p.value = D);
        j && (y.value = !0);
      },
      selectedItem: p,
      selectedItemText: f,
      onItemLeave: () => {
        i.value?.focus();
      },
      itemTextRefCallback: (D, I, M) => {
        const j = !y.value && !M;
        (zt(r.modelValue.value, I, r.by) || j) && (f.value = D);
      },
      focusSelectedItem: S,
      position: t.position,
      isPositioned: v,
      searchRef: u
    }), (D, I) => (m(), _(a(s), null, {
      default: g(() => [F(a(Co), {
        "as-child": "",
        onMountAutoFocus: I[6] || (I[6] = Ce(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: I[7] || (I[7] = (M) => {
          n("closeAutoFocus", M), !M.defaultPrevented && (a(r).triggerElement.value?.focus({ preventScroll: !0 }), M.preventDefault());
        })
      }, {
        default: g(() => [F(a(Ut), {
          "as-child": "",
          "disable-outside-pointer-events": D.disableOutsidePointerEvents,
          onFocusOutside: I[2] || (I[2] = Ce(() => {
          }, ["prevent"])),
          onDismiss: I[3] || (I[3] = (M) => a(r).onOpenChange(!1)),
          onEscapeKeyDown: I[4] || (I[4] = (M) => n("escapeKeyDown", M)),
          onPointerDownOutside: I[5] || (I[5] = (M) => n("pointerDownOutside", M))
        }, {
          default: g(() => [(m(), _($e(D.position === "popper" ? Ip : Np), E({
            ...D.$attrs,
            ...a($)
          }, {
            id: a(r).contentId,
            ref: (M) => {
              if (!M) return;
              const j = a(je)(M);
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
            onContextmenu: I[0] || (I[0] = Ce(() => {
            }, ["prevent"])),
            onPlaced: I[1] || (I[1] = (M) => v.value = !0),
            onKeydown: B
          }), {
            default: g(() => [b(D.$slots, "default")]),
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
}), Rp = Mp;
const [In, Fp] = /* @__PURE__ */ oe("SelectItemAlignedPosition");
var Vp = /* @__PURE__ */ h({
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
    const t = e, n = o, { getItems: r } = ke(), s = it(), l = ht(), i = P(!1), u = P(!0), d = P(), { forwardRef: c, currentElement: p } = N(), { viewport: f, selectedItem: v, selectedItemText: y, focusSelectedItem: w } = l;
    function S() {
      if (s.triggerElement.value && s.valueElement.value && d.value && p.value && f?.value && v?.value && y?.value) {
        const B = s.triggerElement.value.getBoundingClientRect(), C = p.value.getBoundingClientRect(), $ = s.valueElement.value.getBoundingClientRect(), D = y.value.getBoundingClientRect();
        if (s.dir.value !== "rtl") {
          const T = D.left - C.left, le = $.left - T, ee = B.left - le, ae = B.width + ee, _e = Math.max(ae, C.width), Pe = window.innerWidth - Ie, _t = lo(le, Ie, Math.max(Ie, Pe - _e));
          d.value.style.minWidth = `${ae}px`, d.value.style.left = `${_t}px`;
        } else {
          const T = C.right - D.right, le = window.innerWidth - $.right - T, ee = window.innerWidth - B.right - le, ae = B.width + ee, _e = Math.max(ae, C.width), Pe = window.innerWidth - Ie, _t = lo(le, Ie, Math.max(Ie, Pe - _e));
          d.value.style.minWidth = `${ae}px`, d.value.style.right = `${_t}px`;
        }
        const I = r().map((T) => T.ref), M = window.innerHeight - Ie * 2, j = f.value.scrollHeight, x = window.getComputedStyle(p.value), V = Number.parseInt(x.borderTopWidth, 10), k = Number.parseInt(x.paddingTop, 10), W = Number.parseInt(x.borderBottomWidth, 10), G = Number.parseInt(x.paddingBottom, 10), R = V + k + j + G + W, z = Math.min(v.value.offsetHeight * 5, R), U = window.getComputedStyle(f.value), ne = Number.parseInt(U.paddingTop, 10), ve = Number.parseInt(U.paddingBottom, 10), Se = B.top + B.height / 2 - Ie, me = M - Se, He = v.value.offsetHeight / 2, bt = v.value.offsetTop + He, Ze = V + k + bt, Io = R - Ze;
        if (Ze <= Se) {
          const T = v.value === I.at(-1);
          d.value.style.bottom = "0px";
          const le = p.value.clientHeight - f.value.offsetTop - f.value.offsetHeight, ee = Math.max(me, He + (T ? ve : 0) + le + W), ae = Ze + ee;
          d.value.style.height = `${ae}px`;
        } else {
          const T = v.value === I[0];
          d.value.style.top = "0px";
          const ee = Math.max(Se, V + f.value.offsetTop + (T ? ne : 0) + He) + Io;
          d.value.style.height = `${ee}px`, f.value.scrollTop = Ze - Se + f.value.offsetTop;
        }
        d.value.style.margin = `${Ie}px 0`, d.value.style.minHeight = `${z}px`, d.value.style.maxHeight = `${M}px`, n("placed"), requestAnimationFrame(() => i.value = !0);
      }
    }
    const O = P("");
    pe(async () => {
      await ce(), S(), p.value && (O.value = window.getComputedStyle(p.value).zIndex);
    });
    function q(B) {
      B && u.value === !0 && (S(), w?.(), u.value = !1);
    }
    return Ks(s.triggerElement, () => {
      S();
    }), Fp({
      contentWrapper: d,
      shouldExpandOnScrollRef: i,
      onScrollButtonChange: q
    }), (B, C) => (m(), H("div", {
      ref_key: "contentWrapperElement",
      ref: d,
      style: Te({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: O.value
      })
    }, [F(a(K), E({
      ref: a(c),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...B.$attrs,
      ...t
    }), {
      default: g(() => [b(B.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), Np = Vp, Lp = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(e) {
    return Ca(e.context), Sa($p), (t, n) => b(t.$slots, "default");
  }
}), jp = Lp;
const zp = { key: 1 };
var Kp = /* @__PURE__ */ h({
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
    const i = P(), u = A(() => t.forceMount || s.open.value), d = P(u.value);
    let c;
    function p() {
      c && (clearTimeout(c), c = void 0);
    }
    return re(u, (f, v, y) => {
      p(), c = setTimeout(() => {
        d.value = u.value, c = void 0;
      }), y(p);
    }), Xe(p), (f, v) => u.value || d.value || i.value?.present ? (m(), _(a(De), {
      key: 0,
      ref_key: "presenceRef",
      ref: i,
      present: u.value
    }, {
      default: g(() => [F(Rp, X(Q({
        ...a(r),
        ...f.$attrs
      })), {
        default: g(() => [b(f.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : l.value ? (m(), H("div", zp, [(m(), _(gr, { to: l.value }, [F(jp, { context: a(s) }, {
      default: g(() => [b(f.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : de("v-if", !0);
  }
}), Hp = Kp;
const [Wp, Up] = /* @__PURE__ */ oe("SelectGroup");
var Gp = /* @__PURE__ */ h({
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
    return Up({ id: t }), (n, r) => (m(), _(a(K), E({ role: "group" }, o, { "aria-labelledby": a(t) }), {
      default: g(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["aria-labelledby"]));
  }
}), Yp = Gp, Xp = /* @__PURE__ */ h({
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
      default: g(() => [b(o.$slots, "default", {}, () => [t[0] || (t[0] = Ot("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Jp = Xp;
const [xa, Zp] = /* @__PURE__ */ oe("SelectItem");
var Qp = /* @__PURE__ */ h({
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
    const t = e, n = o, { disabled: r } = ue(t), s = it(), l = ht(), { forwardRef: i, currentElement: u } = N(), { CollectionItem: d } = ke(), c = A(() => zt(s.modelValue?.value, t.value, s.by)), p = P(!1), f = P(t.textValue ?? ""), v = be(void 0, "reka-select-item-text"), y = "select.select";
    async function w(C) {
      if (C.defaultPrevented) return;
      const $ = {
        originalEvent: C,
        value: t.value
      };
      yo(y, S, $);
    }
    async function S(C) {
      await ce(), n("select", C), !C.defaultPrevented && (r.value || (s.onValueChange(t.value), s.multiple.value || s.onOpenChange(!1)));
    }
    async function O(C) {
      await ce(), !C.defaultPrevented && (r.value ? l.onItemLeave?.() : C.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function q(C) {
      await ce(), !C.defaultPrevented && C.currentTarget === he() && l.onItemLeave?.();
    }
    async function B(C) {
      await ce(), !(C.defaultPrevented || l.searchRef?.value !== "" && C.key === " ") && (Bp.includes(C.key) && w(C), C.key === " " && C.preventDefault());
    }
    if (t.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return pe(() => {
      u.value && l.itemRefCallback(u.value, t.value, t.disabled);
    }), Zp({
      value: t.value,
      disabled: r,
      textId: v,
      isSelected: c,
      onItemTextChange: (C) => {
        f.value = ((f.value || C?.textContent) ?? "").trim();
      }
    }), (C, $) => (m(), _(a(d), { value: { textValue: f.value } }, {
      default: g(() => [F(a(K), {
        ref: a(i),
        role: "option",
        "aria-labelledby": a(v),
        "data-highlighted": p.value ? "" : void 0,
        "aria-selected": c.value,
        "data-state": c.value ? "checked" : "unchecked",
        "aria-disabled": a(r) || void 0,
        "data-disabled": a(r) ? "" : void 0,
        tabindex: a(r) ? void 0 : -1,
        as: C.as,
        "as-child": C.asChild,
        onFocus: $[0] || ($[0] = (D) => p.value = !0),
        onBlur: $[1] || ($[1] = (D) => p.value = !1),
        onPointerup: w,
        onPointerdown: $[2] || ($[2] = (D) => {
          D.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: $[3] || ($[3] = Ce(() => {
        }, ["prevent", "stop"])),
        onPointermove: O,
        onPointerleave: q,
        onKeydown: B
      }, {
        default: g(() => [b(C.$slots, "default")]),
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
}), ef = Qp, tf = /* @__PURE__ */ h({
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
    const o = e, t = xa();
    return (n, r) => a(t).isSelected.value ? (m(), _(a(K), E({
      key: 0,
      "aria-hidden": "true"
    }, o), {
      default: g(() => [b(n.$slots, "default")]),
      _: 3
    }, 16)) : de("v-if", !0);
  }
}), of = tf, nf = /* @__PURE__ */ h({
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
    const o = e, t = it(), n = ht(), r = xa(), { forwardRef: s, currentElement: l } = N(), i = A(() => ({
      value: r.value,
      disabled: r.disabled.value,
      textContent: l.value?.textContent ?? r.value?.toString() ?? ""
    }));
    return pe(() => {
      l.value && (r.onItemTextChange(l.value), n.itemTextRefCallback(l.value, r.value, r.disabled.value), t.onOptionAdd(i.value));
    }), Xe(() => {
      t.onOptionRemove(i.value);
    }), (u, d) => (m(), _(a(K), E({
      id: a(r).textId,
      ref: a(s)
    }, {
      ...o,
      ...u.$attrs
    }), {
      default: g(() => [b(u.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), qa = nf, rf = /* @__PURE__ */ h({
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
    const o = e, t = Wp({ id: "" });
    return (n, r) => (m(), _(a(K), E(o, { id: a(t).id }), {
      default: g(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), af = rf, sf = /* @__PURE__ */ h({
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
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), lf = sf, uf = /* @__PURE__ */ h({
  __name: "SelectScrollButtonImpl",
  emits: ["autoScroll"],
  setup(e, { emit: o }) {
    const t = o, { getItems: n } = ke(), r = ht(), s = P(null);
    function l() {
      s.value !== null && (window.clearInterval(s.value), s.value = null);
    }
    se(() => {
      n().map((c) => c.ref).find((c) => c === he())?.scrollIntoView({ block: "nearest" });
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
    return mo(() => l()), (d, c) => (m(), _(a(K), E({
      "aria-hidden": "true",
      style: { flexShrink: 0 }
    }, d.$parent?.$props, {
      onPointerdown: i,
      onPointermove: u,
      onPointerleave: c[0] || (c[0] = () => {
        l();
      })
    }), {
      default: g(() => [b(d.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Ba = uf, df = /* @__PURE__ */ h({
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
    const o = ht(), t = o.position === "item-aligned" ? In() : void 0, { forwardRef: n, currentElement: r } = N(), s = P(!1);
    return se((l) => {
      if (o.viewport?.value && o.isPositioned?.value) {
        let u = function() {
          const d = i.scrollHeight - i.clientHeight;
          s.value = Math.ceil(i.scrollTop) < d;
        };
        const i = o.viewport.value;
        u(), i.addEventListener("scroll", u), l(() => i.removeEventListener("scroll", u));
      }
    }), re(r, () => {
      r.value && t?.onScrollButtonChange(r.value);
    }), (l, i) => s.value ? (m(), _(Ba, {
      key: 0,
      ref: a(n),
      onAutoScroll: i[0] || (i[0] = () => {
        const { viewport: u, selectedItem: d } = a(o);
        u?.value && d?.value && (u.value.scrollTop = u.value.scrollTop + d.value.offsetHeight);
      })
    }, {
      default: g(() => [b(l.$slots, "default")]),
      _: 3
    }, 512)) : de("v-if", !0);
  }
}), cf = df, pf = /* @__PURE__ */ h({
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
    const o = ht(), t = o.position === "item-aligned" ? In() : void 0, { forwardRef: n, currentElement: r } = N(), s = P(!1);
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
    }), (l, i) => s.value ? (m(), _(Ba, {
      key: 0,
      ref: a(n),
      onAutoScroll: i[0] || (i[0] = () => {
        const { viewport: u, selectedItem: d } = a(o);
        u?.value && d?.value && (u.value.scrollTop = u.value.scrollTop - d.value.offsetHeight);
      })
    }, {
      default: g(() => [b(l.$slots, "default")]),
      _: 3
    }, 512)) : de("v-if", !0);
  }
}), ff = pf, vf = /* @__PURE__ */ h({
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
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), mf = vf, yf = /* @__PURE__ */ h({
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
    const o = e, t = it(), { forwardRef: n, currentElement: r } = N(), s = A(() => t.disabled?.value || o.disabled);
    t.contentId ||= be(void 0, "reka-select-content"), pe(() => {
      t.onTriggerChange(r.value);
    });
    const { getItems: l } = ke(), { search: i, handleTypeaheadSearch: u, resetTypeahead: d } = fn();
    function c() {
      s.value || (t.onOpenChange(!0), d());
    }
    function p(f) {
      c(), t.triggerPointerDownPosRef.value = {
        x: Math.round(f.pageX),
        y: Math.round(f.pageY)
      };
    }
    return (f, v) => (m(), _(a(So), {
      "as-child": "",
      reference: f.reference
    }, {
      default: g(() => [F(a(K), {
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
        "data-placeholder": a(Op)(a(t).modelValue?.value) ? "" : void 0,
        "as-child": f.asChild,
        as: f.as,
        onClick: v[0] || (v[0] = (y) => {
          y?.currentTarget?.focus();
        }),
        onPointerdown: v[1] || (v[1] = (y) => {
          if (y.pointerType === "touch") return y.preventDefault();
          const w = y.target;
          w.hasPointerCapture(y.pointerId) && w.releasePointerCapture(y.pointerId), y.button === 0 && y.ctrlKey === !1 && (p(y), y.preventDefault());
        }),
        onPointerup: v[2] || (v[2] = Ce((y) => {
          y.pointerType === "touch" && p(y);
        }, ["prevent"])),
        onKeydown: v[3] || (v[3] = (y) => {
          const w = a(i) !== "";
          !(y.ctrlKey || y.altKey || y.metaKey) && y.key.length === 1 && w && y.key === " " || (a(u)(y.key, a(l)()), a(qp).includes(y.key) && (c(), y.preventDefault()));
        })
      }, {
        default: g(() => [b(f.$slots, "default")]),
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
}), gf = yf, hf = /* @__PURE__ */ h({
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
    const o = e, { forwardRef: t, currentElement: n } = N(), r = it();
    pe(() => {
      r.valueElement = n;
    });
    const s = A(() => {
      let i = [];
      const u = Array.from(r.optionsSet.value), d = (c) => u.find((p) => zt(c, p.value, r.by));
      return Array.isArray(r.modelValue.value) ? i = r.modelValue.value.map((c) => d(c)?.textContent ?? "") : i = [d(r.modelValue.value)?.textContent ?? ""], i.filter(Boolean);
    }), l = A(() => s.value.length ? s.value.join(", ") : o.placeholder);
    return (i, u) => (m(), _(a(K), {
      ref: a(t),
      as: i.as,
      "as-child": i.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": s.value.length ? void 0 : o.placeholder
    }, {
      default: g(() => [b(i.$slots, "default", {
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
}), bf = hf, _f = /* @__PURE__ */ h({
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
    const o = e, { nonce: t } = ue(o), n = Du(t), r = ht(), s = r.position === "item-aligned" ? In() : void 0, { forwardRef: l, currentElement: i } = N();
    pe(() => {
      r?.onViewportChange(i.value);
    });
    const u = P(0);
    function d(c) {
      const p = c.currentTarget, { shouldExpandOnScrollRef: f, contentWrapper: v } = s ?? {};
      if (f?.value && v?.value) {
        const y = Math.abs(u.value - p.scrollTop);
        if (y > 0) {
          const w = window.innerHeight - Ie * 2, S = Number.parseFloat(v.value.style.minHeight), O = Number.parseFloat(v.value.style.height), q = Math.max(S, O);
          if (q < w) {
            const B = q + y, C = Math.min(w, B), $ = B - C;
            v.value.style.height = `${C}px`, v.value.style.bottom === "0px" && (p.scrollTop = $ > 0 ? $ : 0, v.value.style.justifyContent = "flex-end");
          }
        }
      }
      u.value = p.scrollTop;
    }
    return (c, p) => (m(), H(qe, null, [F(a(K), E({
      ref: a(l),
      "data-reka-select-viewport": "",
      role: "presentation"
    }, {
      ...c.$attrs,
      ...o
    }, {
      style: {
        position: "relative",
        flex: 1,
        overflow: "hidden auto"
      },
      onScroll: d
    }), {
      default: g(() => [b(c.$slots, "default")]),
      _: 3
    }, 16), F(a(K), {
      as: "style",
      nonce: a(n)
    }, {
      default: g(() => p[0] || (p[0] = [Ot(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), wf = _f, Cf = /* @__PURE__ */ h({
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
      default: g(() => [b(i.$slots, "default")]),
      _: 3
    }, 16, [
      "as",
      "as-child",
      "data-orientation"
    ]));
  }
}), Sf = Cf, xf = /* @__PURE__ */ h({
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
    return (t, n) => (m(), _(Sf, X(Q(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), qf = xf;
const [Bf, Of] = /* @__PURE__ */ oe("SwitchRoot");
var Af = /* @__PURE__ */ h({
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
    const { forwardRef: u, currentElement: d } = N(), c = kt(d), p = A(() => t.id && d.value ? document.querySelector(`[for="${t.id}"]`)?.innerText : void 0);
    return Of({
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
      default: g(() => [b(f.$slots, "default", {
        modelValue: a(s),
        checked: l.value
      }), a(c) && f.name ? (m(), _(a(Yt), {
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
}), Pf = Af, Tf = /* @__PURE__ */ h({
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
    const o = Bf();
    return N(), (t, n) => (m(), _(a(K), {
      "data-state": a(o).checked.value ? "checked" : "unchecked",
      "data-disabled": a(o).disabled.value ? "" : void 0,
      "as-child": t.asChild,
      as: t.as
    }, {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 8, [
      "data-state",
      "data-disabled",
      "as-child",
      "as"
    ]));
  }
}), Ef = Tf;
const [$n, Df] = /* @__PURE__ */ oe("TabsRoot");
var kf = /* @__PURE__ */ h({
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
    N();
    const u = /* @__PURE__ */ fe(t, "modelValue", n, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    }), d = P(), c = Kt(/* @__PURE__ */ new Set());
    return Df({
      modelValue: u,
      changeModelValue: (p) => {
        u.value = p;
      },
      orientation: r,
      dir: i,
      unmountOnHide: s,
      activationMode: t.activationMode,
      baseId: be(void 0, "reka-tabs"),
      tabsList: d,
      contentIds: c,
      registerContent: (p) => {
        c.value = /* @__PURE__ */ new Set([...c.value, p]);
      },
      unregisterContent: (p) => {
        const f = new Set(c.value);
        f.delete(p), c.value = f;
      }
    }), (p, f) => (m(), _(a(K), {
      dir: a(i),
      "data-orientation": a(r),
      "as-child": p.asChild,
      as: p.as
    }, {
      default: g(() => [b(p.$slots, "default", { modelValue: a(u) })]),
      _: 3
    }, 8, [
      "dir",
      "data-orientation",
      "as-child",
      "as"
    ]));
  }
}), If = kf;
function Oa(e, o) {
  return `${e}-trigger-${o}`;
}
function Aa(e, o) {
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
    const o = e, { forwardRef: t } = N(), n = $n(), r = A(() => Oa(n.baseId, o.value)), s = A(() => Aa(n.baseId, o.value)), l = A(() => o.value === n.modelValue.value), i = P(l.value);
    return pe(() => {
      n.registerContent(o.value), requestAnimationFrame(() => {
        i.value = !1;
      });
    }), mo(() => {
      n.unregisterContent(o.value);
    }), (u, d) => (m(), _(a(De), {
      present: u.forceMount || l.value,
      "force-mount": ""
    }, {
      default: g(({ present: c }) => [F(a(K), {
        id: s.value,
        ref: a(t),
        "as-child": u.asChild,
        as: u.as,
        role: "tabpanel",
        "data-state": l.value ? "active" : "inactive",
        "data-orientation": a(n).orientation.value,
        "aria-labelledby": r.value,
        hidden: !c,
        tabindex: "0",
        style: Te({ animationDuration: i.value ? "0s" : void 0 })
      }, {
        default: g(() => [!a(n).unmountOnHide.value || c ? b(u.$slots, "default", { key: 0 }) : de("v-if", !0)]),
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
}), Mf = $f, Rf = /* @__PURE__ */ h({
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
    const o = e, { loop: t } = ue(o), { forwardRef: n, currentElement: r } = N(), s = $n();
    return s.tabsList = r, (l, i) => (m(), _(a(An), {
      "as-child": "",
      orientation: a(s).orientation.value,
      dir: a(s).dir.value,
      loop: a(t)
    }, {
      default: g(() => [F(a(K), {
        ref: a(n),
        role: "tablist",
        "as-child": l.asChild,
        as: l.as,
        "aria-orientation": a(s).orientation.value
      }, {
        default: g(() => [b(l.$slots, "default")]),
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
}), Ff = Rf, Vf = /* @__PURE__ */ h({
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
    const o = e, { forwardRef: t } = N(), n = $n(), r = A(() => Oa(n.baseId, o.value)), s = A(() => n.contentIds.value.has(o.value) ? Aa(n.baseId, o.value) : void 0), l = A(() => o.value === n.modelValue.value);
    return (i, u) => (m(), _(a(Pn), {
      "as-child": "",
      focusable: !i.disabled,
      active: l.value
    }, {
      default: g(() => [F(a(K), {
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
        onMousedown: u[0] || (u[0] = Ce((d) => {
          !i.disabled && d.ctrlKey === !1 ? a(n).changeModelValue(i.value) : d.preventDefault();
        }, ["left"])),
        onKeydown: u[1] || (u[1] = Tt((d) => a(n).changeModelValue(i.value), ["enter", "space"])),
        onFocus: u[2] || (u[2] = () => {
          const d = a(n).activationMode !== "manual";
          !l.value && !i.disabled && d && a(n).changeModelValue(i.value);
        })
      }, {
        default: g(() => [b(i.$slots, "default")]),
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
}), Nf = Vf;
const [To, Lf] = /* @__PURE__ */ oe("TooltipProvider");
var jf = /* @__PURE__ */ h({
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
    N();
    const d = P(!0), c = P(!1), { start: p, stop: f } = Tr(() => {
      d.value = !0;
    }, n, { immediate: !1 });
    return Lf({
      isOpenDelayed: d,
      delayDuration: t,
      onOpen() {
        f(), d.value = !1;
      },
      onClose() {
        p();
      },
      isPointerInTransitRef: c,
      disableHoverableContent: r,
      disableClosingTrigger: s,
      disabled: i,
      ignoreNonKeyboardFocus: l,
      content: u
    }), (v, y) => b(v.$slots, "default");
  }
}), zf = jf;
const Pa = "tooltip.open", [Eo, Kf] = /* @__PURE__ */ oe("TooltipRoot");
var Hf = /* @__PURE__ */ h({
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
    N();
    const r = To(), s = A(() => t.disableHoverableContent ?? r.disableHoverableContent.value), l = A(() => t.disableClosingTrigger ?? r.disableClosingTrigger.value), i = A(() => t.disabled ?? r.disabled.value), u = A(() => t.delayDuration ?? r.delayDuration.value), d = A(() => t.ignoreNonKeyboardFocus ?? r.ignoreNonKeyboardFocus.value), c = /* @__PURE__ */ fe(t, "open", n, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    });
    re(c, (B) => {
      r.onClose && (B ? (r.onOpen(), document.dispatchEvent(new CustomEvent(Pa))) : r.onClose());
    });
    const p = P(!1), f = P(), v = A(() => c.value ? p.value ? "delayed-open" : "instant-open" : "closed"), { start: y, stop: w } = Tr(() => {
      p.value = !0, c.value = !0;
    }, u, { immediate: !1 });
    function S() {
      w(), p.value = !1, c.value = !0;
    }
    function O() {
      w(), c.value = !1;
    }
    function q() {
      y();
    }
    return Kf({
      contentId: "",
      open: c,
      stateAttribute: v,
      trigger: f,
      onTriggerChange(B) {
        f.value = B;
      },
      onTriggerEnter() {
        r.isOpenDelayed.value ? q() : S();
      },
      onTriggerLeave() {
        s.value ? O() : w();
      },
      onOpen: S,
      onClose: O,
      disableHoverableContent: s,
      disableClosingTrigger: l,
      disabled: i,
      ignoreNonKeyboardFocus: d
    }), (B, C) => (m(), _(a(Xt), null, {
      default: g(() => [b(B.$slots, "default", { open: a(c) })]),
      _: 3
    }));
  }
}), Wf = Hf, Uf = /* @__PURE__ */ h({
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
    const t = e, n = o, r = Eo(), s = To(), { forwardRef: l, currentElement: i } = N(), u = A(() => t.ariaLabel || i.value?.textContent), d = A(() => {
      const { ariaLabel: c, ...p } = t;
      return Dr(p, s.content.value ?? {}, {
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
      Ue(window, "scroll", (c) => {
        c.target?.contains(r.trigger.value) && r.onClose();
      }, { capture: !0 }), Ue(window, Pa, r.onClose);
    }), (c, p) => (m(), _(a(Ut), {
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
      default: g(() => [F(a(Ao), E({
        ref: a(l),
        "data-state": a(r).stateAttribute.value
      }, {
        ...c.$attrs,
        ...d.value
      }, { style: {
        "--reka-tooltip-content-transform-origin": "var(--reka-popper-transform-origin)",
        "--reka-tooltip-content-available-width": "var(--reka-popper-available-width)",
        "--reka-tooltip-content-available-height": "var(--reka-popper-available-height)",
        "--reka-tooltip-trigger-width": "var(--reka-popper-anchor-width)",
        "--reka-tooltip-trigger-height": "var(--reka-popper-anchor-height)"
      } }), {
        default: g(() => [b(c.$slots, "default"), F(a(_n), {
          id: a(r).contentId,
          role: "tooltip"
        }, {
          default: g(() => [Ot(St(u.value), 1)]),
          _: 1
        }, 8, ["id"])]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }));
  }
}), Ta = Uf, Gf = /* @__PURE__ */ h({
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
    const t = ge(e), { forwardRef: n, currentElement: r } = N(), { trigger: s, onClose: l } = Eo(), i = To(), { isPointerInTransit: u, onPointerExit: d } = Ys(s, r);
    return i.isPointerInTransitRef = u, d(() => {
      l();
    }), (c, p) => (m(), _(Ta, E({ ref: a(n) }, a(t)), {
      default: g(() => [b(c.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Yf = Gf, Xf = /* @__PURE__ */ h({
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
    const t = e, n = o, r = Eo(), s = te(t, n), { forwardRef: l } = N();
    return (i, u) => (m(), _(a(De), { present: i.forceMount || a(r).open.value }, {
      default: g(() => [(m(), _($e(a(r).disableHoverableContent.value ? Ta : Yf), E({ ref: a(l) }, a(s)), {
        default: g(() => [b(i.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Jf = Xf, Zf = /* @__PURE__ */ h({
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
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Qf = Zf, ev = /* @__PURE__ */ h({
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
    const { forwardRef: r, currentElement: s } = N(), l = P(!1), i = P(!1), u = A(() => t.disabled.value ? {} : {
      click: w,
      focus: v,
      pointermove: p,
      pointerleave: f,
      pointerdown: c,
      blur: y
    });
    pe(() => {
      t.onTriggerChange(s.value);
    });
    function d() {
      setTimeout(() => {
        l.value = !1;
      }, 1);
    }
    function c() {
      t.open && !t.disableClosingTrigger.value && t.onClose(), l.value = !0, document.addEventListener("pointerup", d, { once: !0 });
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
    function y() {
      t.onClose();
    }
    function w() {
      t.disableClosingTrigger.value || t.onClose();
    }
    return (S, O) => (m(), _(a(So), {
      "as-child": "",
      reference: S.reference
    }, {
      default: g(() => [F(a(K), E({
        ref: a(r),
        "aria-describedby": a(t).open.value ? a(t).contentId : void 0,
        "data-state": a(t).stateAttribute.value,
        as: S.as,
        "as-child": o.asChild,
        "data-grace-area-trigger": ""
      }, Ua(u.value)), {
        default: g(() => [b(S.$slots, "default")]),
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
}), tv = ev;
const km = /* @__PURE__ */ h({
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
      class: Y(a(L)(a(ov)({ variant: e.variant, size: e.size }), o.class))
    }, {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "class"]));
  }
}), ov = Ht(
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
), Im = /* @__PURE__ */ h({
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
}), $m = /* @__PURE__ */ h({
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
}), Mm = /* @__PURE__ */ h({
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
}), Rm = /* @__PURE__ */ h({
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
}), Fm = /* @__PURE__ */ h({
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
}), Vm = /* @__PURE__ */ h({
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
}), Nm = /* @__PURE__ */ h({
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
    return (s, l) => ln((m(), H("input", {
      "onUpdate:modelValue": l[0] || (l[0] = (i) => pt(r) ? r.value = i : null),
      class: Y(a(L)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", t.class))
    }, null, 2)), [
      [_r, a(r)]
    ]);
  }
}), Lm = /* @__PURE__ */ h({
  __name: "Dialog",
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const r = te(e, o);
    return (s, l) => (m(), _(a(Rr), X(Q(a(r))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), jm = /* @__PURE__ */ h({
  __name: "DialogClose",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(Wt), X(Q(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
});
const dr = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), nv = (e) => e.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (o, t, n) => n ? n.toUpperCase() : t.toLowerCase()
), rv = (e) => {
  const o = nv(e);
  return o.charAt(0).toUpperCase() + o.slice(1);
}, av = (...e) => e.filter((o, t, n) => !!o && o.trim() !== "" && n.indexOf(o) === t).join(" ").trim(), cr = (e) => e === "";
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
const sv = ({
  name: e,
  iconNode: o,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": n,
  strokeWidth: r,
  "stroke-width": s,
  size: l = Vt.width,
  color: i = Vt.stroke,
  ...u
}, { slots: d }) => Me(
  "svg",
  {
    ...Vt,
    ...u,
    width: l,
    height: l,
    stroke: i,
    "stroke-width": cr(t) || cr(n) || t === !0 || n === !0 ? Number(r || s || Vt["stroke-width"]) * 24 / Number(l) : r || s || Vt["stroke-width"],
    class: av(
      "lucide",
      u.class,
      ...e ? [`lucide-${dr(rv(e))}-icon`, `lucide-${dr(e)}`] : ["lucide-icon"]
    )
  },
  [...o.map((c) => Me(...c)), ...d.default ? [d.default()] : []]
);
const Ve = (e, o) => (t, { slots: n, attrs: r }) => Me(
  sv,
  {
    ...r,
    ...t,
    iconNode: o,
    name: e
  },
  n
);
const Mn = Ve("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const Rn = Ve("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const lv = Ve("chevron-right", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
const iv = Ve("chevron-up", [
  ["path", { d: "m18 15-6-6-6 6", key: "153udz" }]
]);
const uv = Ve("circle-check", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
const Ea = Ve("circle", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
]);
const dv = Ve("info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);
const cv = Ve("loader-circle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const pv = Ve("octagon-x", [
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
const fv = Ve("triangle-alert", [
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
]), zm = /* @__PURE__ */ h({
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
    return (l, i) => (m(), _(a(bn), null, {
      default: g(() => [
        F(a(hn), { class: "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }),
        F(a(gn), E(a(s), {
          class: a(L)(
            "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
            t.class
          )
        }), {
          default: g(() => [
            b(l.$slots, "default"),
            F(a(Wt), { class: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" }, {
              default: g(() => [
                F(a(Do), { class: "w-4 h-4" }),
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
}), Km = /* @__PURE__ */ h({
  __name: "DialogDescription",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class"), n = ge(t);
    return (r, s) => (m(), _(a(jr), E(a(n), {
      class: a(L)("text-sm text-muted-foreground", o.class)
    }), {
      default: g(() => [
        b(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Hm = /* @__PURE__ */ h({
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
}), Wm = /* @__PURE__ */ h({
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
}), Um = /* @__PURE__ */ h({
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
    return (l, i) => (m(), _(a(bn), null, {
      default: g(() => [
        F(a(hn), { class: "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }, {
          default: g(() => [
            F(a(gn), E({
              class: a(L)(
                "relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full",
                t.class
              )
            }, a(s), {
              onPointerDownOutside: i[0] || (i[0] = (u) => {
                const d = u.detail.originalEvent, c = d.target;
                (d.offsetX > c.clientWidth || d.offsetY > c.clientHeight) && u.preventDefault();
              })
            }), {
              default: g(() => [
                b(l.$slots, "default"),
                F(a(Wt), { class: "absolute top-3 right-3 p-0.5 transition-colors rounded-md hover:bg-secondary" }, {
                  default: g(() => [
                    F(a(Do), { class: "w-4 h-4" }),
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
}), Gm = /* @__PURE__ */ h({
  __name: "DialogTitle",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class"), n = ge(t);
    return (r, s) => (m(), _(a(zr), E(a(n), {
      class: a(L)(
        "text-lg font-semibold leading-none tracking-tight",
        o.class
      )
    }), {
      default: g(() => [
        b(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Ym = /* @__PURE__ */ h({
  __name: "DialogTrigger",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(Kr), X(Q(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Xm = /* @__PURE__ */ h({
  __name: "Badge",
  props: {
    variant: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("div", {
      class: Y(a(L)(a(vv)({ variant: e.variant }), o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), vv = Ht(
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
), Jm = /* @__PURE__ */ h({
  __name: "Avatar",
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    size: { default: "sm" },
    shape: { default: "circle" }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a($u), {
      class: Y(a(L)(a(mv)({ size: e.size, shape: e.shape }), o.class))
    }, {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), Zm = /* @__PURE__ */ h({
  __name: "AvatarFallback",
  props: {
    delayMs: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(Ru), X(Q(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Qm = /* @__PURE__ */ h({
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
    return (t, n) => (m(), _(a(Nu), E(o, { class: "h-full w-full object-cover" }), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), mv = Ht(
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
), ey = /* @__PURE__ */ h({
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
    return (n, r) => (m(), _(a(qf), E(a(t), {
      class: a(L)(
        "shrink-0 bg-border",
        o.orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
        o.class
      )
    }), null, 16, ["class"]));
  }
}), yv = /* @__PURE__ */ h({
  __name: "Label",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(op), E(a(t), {
      class: a(L)(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        o.class
      )
    }), {
      default: g(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), ty = /* @__PURE__ */ h({
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
    return (s, l) => (m(), _(a(Tp), X(Q(a(r))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), oy = /* @__PURE__ */ h({
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
    return (l, i) => (m(), _(a(lf), null, {
      default: g(() => [
        F(a(Hp), E({ ...a(s), ...l.$attrs }, {
          class: a(L)(
            "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            e.position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            t.class
          )
        }), {
          default: g(() => [
            F(a(bv)),
            F(a(wf), {
              class: Y(a(L)("p-1", e.position === "popper" && "h-[--reka-select-trigger-height] w-full min-w-[--reka-select-trigger-width]"))
            }, {
              default: g(() => [
                b(l.$slots, "default")
              ]),
              _: 3
            }, 8, ["class"]),
            F(a(hv))
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), ny = /* @__PURE__ */ h({
  __name: "SelectGroup",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(Yp), E({
      class: a(L)("p-1 w-full", o.class)
    }, a(t)), {
      default: g(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), gv = { class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, ry = /* @__PURE__ */ h({
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
    return (r, s) => (m(), _(a(ef), E(a(n), {
      class: a(L)(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        o.class
      )
    }), {
      default: g(() => [
        ye("span", gv, [
          F(a(of), null, {
            default: g(() => [
              F(a(Mn), { class: "h-4 w-4" })
            ]),
            _: 1
          })
        ]),
        F(a(qa), null, {
          default: g(() => [
            b(r.$slots, "default")
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), ay = /* @__PURE__ */ h({
  __name: "SelectItemText",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(qa), X(Q(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), sy = /* @__PURE__ */ h({
  __name: "SelectLabel",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(af), {
      class: Y(a(L)("py-1.5 pl-8 pr-2 text-sm font-semibold", o.class))
    }, {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), hv = /* @__PURE__ */ h({
  __name: "SelectScrollDownButton",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class"), n = ge(t);
    return (r, s) => (m(), _(a(cf), E(a(n), {
      class: a(L)("flex cursor-default items-center justify-center py-1", o.class)
    }), {
      default: g(() => [
        b(r.$slots, "default", {}, () => [
          F(a(Rn), { class: "h-4 w-4" })
        ])
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), bv = /* @__PURE__ */ h({
  __name: "SelectScrollUpButton",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class"), n = ge(t);
    return (r, s) => (m(), _(a(ff), E(a(n), {
      class: a(L)("flex cursor-default items-center justify-center py-1", o.class)
    }), {
      default: g(() => [
        b(r.$slots, "default", {}, () => [
          F(a(iv), { class: "h-4 w-4" })
        ])
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), ly = /* @__PURE__ */ h({
  __name: "SelectSeparator",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(mf), E(a(t), {
      class: a(L)("-mx-1 my-1 h-px bg-muted", o.class)
    }), null, 16, ["class"]));
  }
}), iy = /* @__PURE__ */ h({
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
    return (r, s) => (m(), _(a(gf), E(a(n), {
      class: a(L)(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate text-start",
        o.class
      )
    }), {
      default: g(() => [
        b(r.$slots, "default"),
        F(a(Jp), { "as-child": "" }, {
          default: g(() => [
            F(a(Rn), { class: "w-4 h-4 opacity-50 shrink-0" })
          ]),
          _: 1
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), uy = /* @__PURE__ */ h({
  __name: "SelectValue",
  props: {
    placeholder: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(bf), X(Q(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), dy = /* @__PURE__ */ h({
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
    return (l, i) => (m(), _(a(Yu), E(a(s), {
      class: a(L)(
        "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        t.class
      )
    }), {
      default: g(() => [
        F(a(Ju), { class: "grid place-content-center text-current" }, {
          default: g(() => [
            b(l.$slots, "default", {}, () => [
              F(a(Mn), { class: "h-4 w-4" })
            ])
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), cy = /* @__PURE__ */ h({
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
    return (l, i) => (m(), _(a(hp), E({
      class: a(L)("grid gap-2", t.class)
    }, a(s)), {
      default: g(() => [
        b(l.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), py = /* @__PURE__ */ h({
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
    return (r, s) => (m(), _(a(Cp), E(a(n), {
      class: a(L)(
        "peer aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        o.class
      )
    }), {
      default: g(() => [
        F(a(xp), { class: "flex items-center justify-center" }, {
          default: g(() => [
            F(a(Ea), { class: "h-2.5 w-2.5 fill-current text-current" })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), fy = /* @__PURE__ */ h({
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
    return (l, i) => (m(), _(a(Pf), E(a(s), {
      class: a(L)(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        t.class
      )
    }), {
      default: g(() => [
        F(a(Ef), {
          class: Y(a(L)("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5"))
        }, {
          default: g(() => [
            b(l.$slots, "thumb")
          ]),
          _: 3
        }, 8, ["class"])
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), vy = /* @__PURE__ */ h({
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
    return (s, l) => ln((m(), H("textarea", {
      "onUpdate:modelValue": l[0] || (l[0] = (i) => pt(r) ? r.value = i : null),
      class: Y(a(L)("flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", t.class))
    }, null, 2)), [
      [_r, a(r)]
    ]);
  }
}), my = /* @__PURE__ */ h({
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
    return (l, i) => (m(), _(a(pd), E({
      class: a(L)(
        "relative flex w-full touch-none select-none items-center data-[orientation=vertical]:flex-col data-[orientation=vertical]:w-2 data-[orientation=vertical]:h-full",
        t.class
      )
    }, a(s)), {
      default: g(() => [
        F(a(wd), { class: "relative h-2 w-full data-[orientation=vertical]:w-2 grow overflow-hidden rounded-full bg-secondary" }, {
          default: g(() => [
            F(a(md), { class: "absolute h-full data-[orientation=vertical]:w-full bg-primary" })
          ]),
          _: 1
        }),
        (m(!0), H(qe, null, Bt(e.modelValue, (u, d) => (m(), _(a(bd), {
          key: d,
          class: "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        }))), 128))
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), yy = /* @__PURE__ */ h({
  __name: "Sheet",
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const r = te(e, o);
    return (s, l) => (m(), _(a(Rr), X(Q(a(r))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), gy = /* @__PURE__ */ h({
  __name: "SheetClose",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(Wt), X(Q(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), hy = /* @__PURE__ */ h({
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
    return (l, i) => (m(), _(a(bn), null, {
      default: g(() => [
        F(a(hn), { class: "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }),
        F(a(gn), E({
          class: a(L)(a(_v)({ side: e.side }), t.class)
        }, { ...a(s), ...l.$attrs }), {
          default: g(() => [
            b(l.$slots, "default"),
            F(a(Wt), { class: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary" }, {
              default: g(() => [
                F(a(Do), { class: "w-4 h-4 text-muted-foreground" })
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
}), by = /* @__PURE__ */ h({
  __name: "SheetDescription",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(jr), E({
      class: a(L)("text-sm text-muted-foreground", o.class)
    }, a(t)), {
      default: g(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), _y = /* @__PURE__ */ h({
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
}), wy = /* @__PURE__ */ h({
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
}), Cy = /* @__PURE__ */ h({
  __name: "SheetTitle",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(zr), E({
      class: a(L)("text-lg font-semibold text-foreground", o.class)
    }, a(t)), {
      default: g(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Sy = /* @__PURE__ */ h({
  __name: "SheetTrigger",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(Kr), X(Q(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), _v = Ht(
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
), xy = /* @__PURE__ */ h({
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
    return (s, l) => (m(), _(a(If), X(Q(a(r))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), qy = /* @__PURE__ */ h({
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
    return (n, r) => (m(), _(a(Mf), E({
      class: a(L)("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", o.class)
    }, a(t)), {
      default: g(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), By = /* @__PURE__ */ h({
  __name: "TabsList",
  props: {
    loop: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(Ff), E(a(t), {
      class: a(L)(
        "inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        o.class
      )
    }), {
      default: g(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), wv = { class: "truncate" }, Oy = /* @__PURE__ */ h({
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
    return (r, s) => (m(), _(a(Nf), E(a(n), {
      class: a(L)(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        o.class
      )
    }), {
      default: g(() => [
        ye("span", wv, [
          b(r.$slots, "default")
        ])
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Ay = /* @__PURE__ */ h({
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
    return (s, l) => (m(), _(a(ql), X(Q(a(r))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Py = /* @__PURE__ */ h({
  __name: "AccordionContent",
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(Tl), E(a(t), { class: "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down" }), {
      default: g(() => [
        ye("div", {
          class: Y(a(L)("pb-4 pt-0", o.class))
        }, [
          b(n.$slots, "default")
        ], 2)
      ]),
      _: 3
    }, 16));
  }
}), Ty = /* @__PURE__ */ h({
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
    return (r, s) => (m(), _(a(Al), E(a(n), {
      class: a(L)("border-b", o.class)
    }), {
      default: g(() => [
        b(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Ey = /* @__PURE__ */ h({
  __name: "AccordionTrigger",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(Dl), { class: "flex" }, {
      default: g(() => [
        F(a(Il), E(a(t), {
          class: a(L)(
            "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
            o.class
          )
        }), {
          default: g(() => [
            b(n.$slots, "default"),
            b(n.$slots, "icon", {}, () => [
              F(a(Rn), { class: "h-4 w-4 shrink-0 transition-transform duration-200" })
            ])
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), Dy = /* @__PURE__ */ h({
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
    return (s, l) => (m(), _(a(Pc), X(Q(a(r))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Cv = { class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, ky = /* @__PURE__ */ h({
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
    return (l, i) => (m(), _(a(Bc), E(a(s), {
      class: a(L)(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        t.class
      )
    }), {
      default: g(() => [
        ye("span", Cv, [
          F(a(wa), null, {
            default: g(() => [
              F(a(Mn), { class: "w-4 h-4" })
            ]),
            _: 1
          })
        ]),
        b(l.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Iy = /* @__PURE__ */ h({
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
    return (l, i) => (m(), _(a(Nc), null, {
      default: g(() => [
        F(a(Ec), E(a(s), {
          class: a(L)("z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", t.class)
        }), {
          default: g(() => [
            b(l.$slots, "default")
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), $y = /* @__PURE__ */ h({
  __name: "DropdownMenuGroup",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(kc), X(Q(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), My = /* @__PURE__ */ h({
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
      default: g(() => [
        b(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Ry = /* @__PURE__ */ h({
  __name: "DropdownMenuLabel",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] },
    inset: { type: Boolean }
  },
  setup(e) {
    const o = e, t = J(o, "class"), n = ge(t);
    return (r, s) => (m(), _(a(Fc), E(a(n), {
      class: a(L)("px-2 py-1.5 text-sm font-semibold", e.inset && "pl-8", o.class)
    }), {
      default: g(() => [
        b(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Fy = /* @__PURE__ */ h({
  __name: "DropdownMenuRadioGroup",
  props: {
    modelValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const r = te(e, o);
    return (s, l) => (m(), _(a(jc), X(Q(a(r))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Sv = { class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, Vy = /* @__PURE__ */ h({
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
    return (l, i) => (m(), _(a(Kc), E(a(s), {
      class: a(L)(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        t.class
      )
    }), {
      default: g(() => [
        ye("span", Sv, [
          F(a(wa), null, {
            default: g(() => [
              F(a(Ea), { class: "h-2 w-2 fill-current" })
            ]),
            _: 1
          })
        ]),
        b(l.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Ny = /* @__PURE__ */ h({
  __name: "DropdownMenuSeparator",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(a(Wc), E(a(t), {
      class: a(L)("-mx-1 my-1 h-px bg-muted", o.class)
    }), null, 16, ["class"]));
  }
}), Ly = /* @__PURE__ */ h({
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
}), jy = /* @__PURE__ */ h({
  __name: "DropdownMenuSub",
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const r = te(e, o);
    return (s, l) => (m(), _(a(Gc), X(Q(a(r))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), zy = /* @__PURE__ */ h({
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
    return (l, i) => (m(), _(a(Xc), E(a(s), {
      class: a(L)("z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", t.class)
    }), {
      default: g(() => [
        b(l.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Ky = /* @__PURE__ */ h({
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
    return (r, s) => (m(), _(a(Zc), E(a(n), {
      class: a(L)(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
        o.class
      )
    }), {
      default: g(() => [
        b(r.$slots, "default"),
        F(a(lv), { class: "ml-auto h-4 w-4" })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Hy = /* @__PURE__ */ h({
  __name: "DropdownMenuTrigger",
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const t = ge(e);
    return (n, r) => (m(), _(a(ep), E({ class: "outline-none" }, a(t)), {
      default: g(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Wy = /* @__PURE__ */ h({
  __name: "Popover",
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean },
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const r = te(e, o);
    return (s, l) => (m(), _(a(fc), X(Q(a(r))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Uy = /* @__PURE__ */ h({
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
    return (l, i) => (m(), _(a(Cc), null, {
      default: g(() => [
        F(a(_c), E({ ...a(s), ...l.$attrs }, {
          class: a(L)(
            "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            t.class
          )
        }), {
          default: g(() => [
            b(l.$slots, "default")
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), Gy = /* @__PURE__ */ h({
  __name: "PopoverTrigger",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(xc), X(Q(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Yy = /* @__PURE__ */ h({
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
    return (s, l) => (m(), _(a(Wf), X(Q(a(r))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Xy = /* @__PURE__ */ h({
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
    return (l, i) => (m(), _(a(Qf), null, {
      default: g(() => [
        F(a(Jf), E({ ...a(s), ...l.$attrs }, {
          class: a(L)("z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", t.class)
        }), {
          default: g(() => [
            b(l.$slots, "default")
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), Jy = /* @__PURE__ */ h({
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
    return (t, n) => (m(), _(a(zf), X(Q(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Zy = /* @__PURE__ */ h({
  __name: "TooltipTrigger",
  props: {
    reference: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(a(tv), X(Q(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), xv = { class: "relative w-full overflow-auto" }, Qy = /* @__PURE__ */ h({
  __name: "Table",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("div", xv, [
      ye("table", {
        class: Y(a(L)("w-full caption-bottom text-sm", o.class))
      }, [
        b(t.$slots, "default")
      ], 2)
    ]));
  }
}), eg = /* @__PURE__ */ h({
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
}), tg = /* @__PURE__ */ h({
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
}), qv = /* @__PURE__ */ h({
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
}), Bv = /* @__PURE__ */ h({
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
}), Ov = { class: "flex items-center justify-center py-10" }, og = /* @__PURE__ */ h({
  __name: "TableEmpty",
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    colspan: { default: 1 }
  },
  setup(e) {
    const o = e, t = J(o, "class");
    return (n, r) => (m(), _(Bv, null, {
      default: g(() => [
        F(qv, E({
          class: a(L)(
            "p-4 whitespace-nowrap align-middle text-sm text-foreground",
            o.class
          )
        }, a(t)), {
          default: g(() => [
            ye("div", Ov, [
              b(n.$slots, "default")
            ])
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), ng = /* @__PURE__ */ h({
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
}), rg = /* @__PURE__ */ h({
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
}), ag = /* @__PURE__ */ h({
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
}), sg = /* @__PURE__ */ h({
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
}), lg = /* @__PURE__ */ h({
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
    return (n, r) => (m(), _(a(ip), E(a(t), {
      class: a(L)(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        o.class
      )
    }), {
      default: g(() => [
        F(a(dp), {
          class: "h-full w-full flex-1 bg-primary transition-all",
          style: Te(`transform: translateX(-${100 - (o.modelValue ?? 0)}%);`)
        }, null, 8, ["style"])
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), ig = /* @__PURE__ */ h({
  __name: "Alert",
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    variant: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), H("div", {
      class: Y(a(L)(a(Av)({ variant: e.variant }), o.class)),
      role: "alert"
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), ug = /* @__PURE__ */ h({
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
}), dg = /* @__PURE__ */ h({
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
}), Av = Ht(
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
let an = 1;
var Pv = class {
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
    const { message: o, ...t } = e, n = typeof e.id == "number" || e.id && e.id?.length > 0 ? e.id : an++, r = this.toasts.find((l) => l.id === n), s = e.dismissible === void 0 ? !0 : e.dismissible;
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
      else if (Ev(u) && !u.ok) {
        r = !1;
        const c = typeof o.error == "function" ? await o.error(`HTTP error! status: ${u.status}`) : o.error, p = typeof o.description == "function" ? await o.description(`HTTP error! status: ${u.status}`) : o.description, v = typeof c == "object" && !Mt(c) ? c : {
          message: c || "",
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
        const c = typeof o.error == "function" ? await o.error(u) : o.error, p = typeof o.description == "function" ? await o.description(u) : o.description, v = typeof c == "object" && !Mt(c) ? c : {
          message: c || "",
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
        const c = typeof o.success == "function" ? await o.success(u) : o.success, p = typeof o.description == "function" ? await o.description(u) : o.description, v = typeof c == "object" && !Mt(c) ? c : {
          message: c || "",
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
        const d = typeof o.error == "function" ? await o.error(u) : o.error, c = typeof o.description == "function" ? await o.description(u) : o.description, f = typeof d == "object" && !Mt(d) ? d : {
          message: d || "",
          id: t || ""
        };
        this.create({
          id: t,
          type: "error",
          description: c,
          ...f
        });
      }
    }).finally(() => {
      r && (this.dismiss(t), t = void 0), o.finally?.();
    }), i = () => new Promise((u, d) => l.then(() => s[0] === "reject" ? d(s[1]) : u(s[1])).catch(d));
    return typeof t != "string" && typeof t != "number" ? { unwrap: i } : Object.assign(t, { unwrap: i });
  };
  custom = (e, o) => {
    const t = o?.id || an++, n = this.toasts.find((s) => s.id === t), r = o?.dismissible === void 0 ? !0 : o.dismissible;
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
const xe = new Pv();
function Tv(e, o) {
  const t = o?.id || an++;
  return xe.create({
    message: e,
    id: t,
    type: "default",
    ...o
  }), t;
}
const Ev = (e) => e && typeof e == "object" && "ok" in e && typeof e.ok == "boolean" && "status" in e && typeof e.status == "number", Dv = Tv, kv = () => xe.toasts, Iv = () => xe.getActiveToasts();
Object.assign(Dv, {
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
  getHistory: kv,
  getToasts: Iv
});
function ao(e) {
  return e.label !== void 0;
}
const $v = 3, Da = "24px", ka = "16px", pr = 4e3, Mv = 356, Rv = 14, Fv = 45, Ia = 200;
function Vv() {
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
function Nv(e) {
  const [o, t] = e.split("-"), n = [];
  return o && n.push(o), t && n.push(t), n;
}
function Lv(e, o) {
  const t = {};
  return [e, o].forEach((n, r) => {
    const s = r === 1, l = s ? "--mobile-offset" : "--offset", i = s ? ka : Da;
    function u(d) {
      [
        "top",
        "right",
        "bottom",
        "left"
      ].forEach((c) => {
        t[`${l}-${c}`] = typeof d == "number" ? `${d}px` : d;
      });
    }
    typeof n == "number" || typeof n == "string" ? u(n) : typeof n == "object" ? [
      "top",
      "right",
      "bottom",
      "left"
    ].forEach((d) => {
      n[d] === void 0 ? t[`${l}-${d}`] = i : t[`${l}-${d}`] = typeof n[d] == "number" ? `${n[d]}px` : n[d];
    }) : u(i);
  }), t;
}
const jv = [
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
], zv = [
  "aria-label",
  "data-disabled",
  "data-close-button-position"
];
var Kv = /* @__PURE__ */ h({
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
    const t = e, n = o, r = P(null), s = P(null), l = P(!1), i = P(!1), u = P(!1), d = P(!1), c = P(!1), p = P(0), f = P(0), v = P(t.toast.duration || t.duration || pr), y = P(null), w = P(null), S = A(() => t.index === 0), O = A(() => t.index + 1 <= t.visibleToasts), q = A(() => t.toast.type), B = A(() => t.toast.dismissible !== !1), C = A(() => t.toast.class || ""), $ = A(() => t.descriptionClass || ""), D = A(() => {
      const T = t.toast.position || t.position, ee = t.heights.filter((ae) => ae.position === T).findIndex((ae) => ae.toastId === t.toast.id);
      return ee >= 0 ? ee : 0;
    }), I = A(() => {
      const T = t.toast.position || t.position;
      return t.heights.filter((ee) => ee.position === T).reduce((ee, ae, _e) => _e >= D.value ? ee : ee + ae.height, 0);
    }), M = A(() => D.value * t.gap + I.value || 0), j = A(() => t.toast.closeButton ?? t.closeButton), x = A(() => t.toast.duration || t.duration || pr), V = P(0), k = P(0), W = P(null), G = A(() => t.position.split("-")), R = A(() => G.value[0]), z = A(() => G.value[1]), U = A(() => typeof t.toast.title != "string"), ne = A(() => typeof t.toast.description != "string"), { isDocumentHidden: ve } = Vv(), Se = A(() => q.value && q.value === "loading");
    pe(() => {
      l.value = !0, v.value = x.value;
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
      i.value = !0, p.value = M.value, setTimeout(() => {
        n("removeToast", t.toast);
      }, Ia);
    }
    function He() {
      if (Se.value || !B.value) return {};
      me(), t.toast.onDismiss?.(t.toast);
    }
    function bt(T) {
      T.button !== 2 && (Se.value || !B.value || (y.value = /* @__PURE__ */ new Date(), p.value = M.value, T.target.setPointerCapture(T.pointerId), T.target.tagName !== "BUTTON" && (u.value = !0, W.value = {
        x: T.clientX,
        y: T.clientY
      })));
    }
    function Ze() {
      if (d.value || !B.value) return;
      W.value = null;
      const T = Number(w.value?.style.getPropertyValue("--swipe-amount-x").replace("px", "") || 0), le = Number(w.value?.style.getPropertyValue("--swipe-amount-y").replace("px", "") || 0), ee = (/* @__PURE__ */ new Date()).getTime() - (y.value?.getTime() || 0), ae = r.value === "x" ? T : le, _e = Math.abs(ae) / ee;
      if (Math.abs(ae) >= Fv || _e > 0.11) {
        p.value = M.value, t.toast.onDismiss?.(t.toast), r.value === "x" ? s.value = T > 0 ? "right" : "left" : s.value = le > 0 ? "down" : "up", me(), d.value = !0;
        return;
      } else
        w.value?.style.setProperty("--swipe-amount-x", "0px"), w.value?.style.setProperty("--swipe-amount-y", "0px");
      c.value = !1, u.value = !1, r.value = null;
    }
    function Io(T) {
      if (!W.value || !B.value || (window?.getSelection()?.toString()?.length ?? !1)) return;
      const ee = T.clientY - W.value.y, ae = T.clientX - W.value.x, _e = t.swipeDirections ?? Nv(t.position);
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
      (Math.abs(Pe.x) > 0 || Math.abs(Pe.y) > 0) && (c.value = !0), w.value?.style.setProperty("--swipe-amount-x", `${Pe.x}px`), w.value?.style.setProperty("--swipe-amount-y", `${Pe.y}px`);
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
      if (t.toast.promise && q.value === "loading" || t.toast.duration === 1 / 0 || t.toast.type === "loading") return;
      let le;
      const ee = () => {
        if (k.value < V.value) {
          const _e = (/* @__PURE__ */ new Date()).getTime() - V.value;
          v.value = v.value - _e;
        }
        k.value = (/* @__PURE__ */ new Date()).getTime();
      }, ae = () => {
        v.value !== 1 / 0 && (V.value = (/* @__PURE__ */ new Date()).getTime(), le = setTimeout(() => {
          t.toast.onAutoClose?.(t.toast), me();
        }, v.value));
      };
      t.expanded || t.interacting || ve.value ? ee() : ae(), T(() => {
        clearTimeout(le);
      });
    }), re(() => t.toast.delete, (T) => {
      T !== void 0 && T && (me(), t.toast.onDismiss?.(t.toast));
    }, { deep: !0 });
    function Fn() {
      u.value = !1, r.value = null, W.value = null;
    }
    return (T, le) => (m(), H("li", {
      tabindex: "0",
      ref_key: "toastRef",
      ref: w,
      class: Y(a(tt)(t.class, C.value, T.classes?.toast, T.toast.classes?.toast, T.classes?.[q.value], T.toast?.classes?.[q.value])),
      "data-sonner-toast": "",
      "data-rich-colors": T.toast.richColors ?? T.defaultRichColors,
      "data-styled": !(T.toast.component || T.toast?.unstyled || T.unstyled),
      "data-mounted": l.value,
      "data-promise": !!T.toast.promise,
      "data-swiped": c.value,
      "data-removed": i.value,
      "data-visible": O.value,
      "data-y-position": R.value,
      "data-x-position": z.value,
      "data-index": T.index,
      "data-front": S.value,
      "data-swiping": u.value,
      "data-dismissible": B.value,
      "data-type": q.value,
      "data-invert": T.toast.invert || T.invert,
      "data-swipe-out": d.value,
      "data-swipe-direction": s.value,
      "data-expanded": !!(T.expanded || T.expandByDefault && l.value),
      "data-testid": T.toast.testId,
      style: Te({
        "--index": T.index,
        "--toasts-before": T.index,
        "--z-index": T.toasts.length - T.index,
        "--offset": `${i.value ? p.value : M.value}px`,
        "--initial-height": T.expandByDefault ? "auto" : `${f.value}px`,
        ...T.style,
        ...t.toast.style
      }),
      onDragend: Fn,
      onPointerdown: bt,
      onPointerup: Ze,
      onPointermove: Io
    }, [j.value && !T.toast.component && q.value !== "loading" ? (m(), H("button", {
      key: 0,
      "aria-label": T.closeButtonAriaLabel || "Close toast",
      "data-disabled": Se.value,
      "data-close-button": "true",
      "data-close-button-position": T.closeButtonPosition,
      class: Y(a(tt)(T.classes?.closeButton, T.toast?.classes?.closeButton)),
      onClick: He
    }, [T.icons?.close ? (m(), _($e(T.icons?.close), { key: 0 })) : b(T.$slots, "close-icon", { key: 1 })], 10, zv)) : de("v-if", !0), T.toast.component ? (m(), _($e(T.toast.component), E({ key: 1 }, T.toast.componentProps, {
      onCloseToast: He,
      isPaused: T.$props.expanded || T.$props.interacting || a(ve)
    }), null, 16, ["isPaused"])) : (m(), H(qe, { key: 2 }, [
      q.value !== "default" || T.toast.icon || T.toast.promise ? (m(), H("div", {
        key: 0,
        "data-icon": "",
        class: Y(a(tt)(T.classes?.icon, T.toast?.classes?.icon))
      }, [T.toast.icon ? (m(), _($e(T.toast.icon), { key: 0 })) : (m(), H(qe, { key: 1 }, [q.value === "loading" ? b(T.$slots, "loading-icon", { key: 0 }) : q.value === "success" ? b(T.$slots, "success-icon", { key: 1 }) : q.value === "error" ? b(T.$slots, "error-icon", { key: 2 }) : q.value === "warning" ? b(T.$slots, "warning-icon", { key: 3 }) : q.value === "info" ? b(T.$slots, "info-icon", { key: 4 }) : de("v-if", !0)], 64))], 2)) : de("v-if", !0),
      ye("div", {
        "data-content": "",
        class: Y(a(tt)(T.classes?.content, T.toast?.classes?.content))
      }, [ye("div", {
        "data-title": "",
        class: Y(a(tt)(T.classes?.title, T.toast.classes?.title))
      }, [U.value ? (m(), _($e(T.toast.title), X(E({ key: 0 }, T.toast.componentProps)), null, 16)) : (m(), H(qe, { key: 1 }, [Ot(St(T.toast.title), 1)], 64))], 2), T.toast.description ? (m(), H("div", {
        key: 0,
        "data-description": "",
        class: Y(a(tt)(T.descriptionClass, $.value, T.classes?.description, T.toast.classes?.description))
      }, [ne.value ? (m(), _($e(T.toast.description), X(E({ key: 0 }, T.toast.componentProps)), null, 16)) : (m(), H(qe, { key: 1 }, [Ot(St(T.toast.description), 1)], 64))], 2)) : de("v-if", !0)], 2),
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
    ], 64))], 46, jv));
  }
}), Hv = Kv, eo = (e, o) => {
  const t = e.__vccOpts || e;
  for (const [n, r] of o) t[n] = r;
  return t;
};
const Wv = {}, Uv = {
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
function Gv(e, o) {
  return m(), H("svg", Uv, o[0] || (o[0] = [ye("line", {
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
var Yv = /* @__PURE__ */ eo(Wv, [["render", Gv]]);
const Xv = ["data-visible"], Jv = { class: "sonner-spinner" };
var Zv = /* @__PURE__ */ h({
  __name: "Loader",
  props: { visible: { type: Boolean } },
  setup(e) {
    const o = Array(12).fill(0);
    return (t, n) => (m(), H("div", {
      class: "sonner-loading-wrapper",
      "data-visible": t.visible
    }, [ye("div", Jv, [(m(!0), H(qe, null, Bt(a(o), (r) => (m(), H("div", {
      key: `spinner-bar-${r}`,
      class: "sonner-loading-bar"
    }))), 128))])], 8, Xv));
  }
}), Qv = Zv;
const em = {}, tm = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
};
function om(e, o) {
  return m(), H("svg", tm, o[0] || (o[0] = [ye("path", {
    "fill-rule": "evenodd",
    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
    "clip-rule": "evenodd"
  }, null, -1)]));
}
var nm = /* @__PURE__ */ eo(em, [["render", om]]);
const rm = {}, am = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
};
function sm(e, o) {
  return m(), H("svg", am, o[0] || (o[0] = [ye("path", {
    "fill-rule": "evenodd",
    d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
    "clip-rule": "evenodd"
  }, null, -1)]));
}
var lm = /* @__PURE__ */ eo(rm, [["render", sm]]);
const im = {}, um = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "currentColor",
  height: "20",
  width: "20"
};
function dm(e, o) {
  return m(), H("svg", um, o[0] || (o[0] = [ye("path", {
    "fill-rule": "evenodd",
    d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
    "clip-rule": "evenodd"
  }, null, -1)]));
}
var cm = /* @__PURE__ */ eo(im, [["render", dm]]);
const pm = {}, fm = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
};
function vm(e, o) {
  return m(), H("svg", fm, o[0] || (o[0] = [ye("path", {
    "fill-rule": "evenodd",
    d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
    "clip-rule": "evenodd"
  }, null, -1)]));
}
var mm = /* @__PURE__ */ eo(pm, [["render", vm]]);
const ym = ["aria-label"], gm = [
  "data-sonner-theme",
  "dir",
  "data-theme",
  "data-rich-colors",
  "data-y-position",
  "data-x-position"
], hm = typeof window < "u" && typeof document < "u";
function bm() {
  if (typeof window > "u" || typeof document > "u") return "ltr";
  const e = document.documentElement.getAttribute("dir");
  return e === "auto" || !e ? window.getComputedStyle(document.documentElement).direction : e;
}
var _m = /* @__PURE__ */ h({
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
    gap: { default: Rv },
    visibleToasts: { default: $v },
    closeButton: {
      type: Boolean,
      default: !1
    },
    toastOptions: { default: () => ({}) },
    class: { default: "" },
    style: {},
    offset: { default: Da },
    mobileOffset: { default: ka },
    dir: { default: "auto" },
    swipeDirections: {},
    icons: {},
    containerAriaLabel: { default: "Notifications" }
  },
  setup(e) {
    const o = e, t = Ga(), n = P([]), r = A(() => o.id ? n.value.filter((x) => x.toasterId === o.id) : n.value.filter((x) => !x.toasterId));
    function s(x, V) {
      return r.value.filter((k) => !k.position && V === 0 || k.position === x);
    }
    const l = A(() => {
      const x = r.value.filter((V) => V.position).map((V) => V.position);
      return x.length > 0 ? Array.from(new Set([o.position].concat(x))) : [o.position];
    }), i = A(() => {
      const x = {};
      return l.value.forEach((V) => {
        x[V] = n.value.filter((k) => k.position === V);
      }), x;
    }), u = P([]), d = P({}), c = P(!1);
    se(() => {
      l.value.forEach((x) => {
        x in d.value || (d.value[x] = !1);
      });
    });
    const p = P(o.theme !== "system" ? o.theme : typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), f = P(null), v = P(null), y = P(!1), w = o.hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
    function S(x) {
      n.value.find((V) => V.id === x.id)?.delete || xe.dismiss(x.id), n.value = n.value.filter(({ id: V }) => V !== x.id), setTimeout(() => {
        n.value.find((V) => V.id === x.id) || (u.value = u.value.filter((V) => V.toastId !== x.id));
      }, Ia + 50);
    }
    function O(x) {
      y.value && !x.currentTarget?.contains?.(x.relatedTarget) && (y.value = !1, v.value && (v.value.focus({ preventScroll: !0 }), v.value = null));
    }
    function q(x) {
      x.target instanceof HTMLElement && x.target.dataset.dismissible === "false" || y.value || (y.value = !0, v.value = x.relatedTarget);
    }
    function B(x) {
      x.target && x.target instanceof HTMLElement && x.target.dataset.dismissible === "false" || (c.value = !0);
    }
    se((x) => {
      const V = xe.subscribe((k) => {
        if (k.dismiss) {
          requestAnimationFrame(() => {
            n.value = n.value.map((W) => W.id === k.id ? {
              ...W,
              delete: !0
            } : W);
          });
          return;
        }
        ce(() => {
          const W = n.value.findIndex((G) => G.id === k.id);
          W !== -1 ? n.value = [
            ...n.value.slice(0, W),
            {
              ...n.value[W],
              ...k
            },
            ...n.value.slice(W + 1)
          ] : n.value = [k, ...n.value];
        });
      });
      x(V);
    }), se((x) => {
      if (typeof window > "u") return;
      if (o.theme !== "system") {
        p.value = o.theme;
        return;
      }
      const V = window.matchMedia("(prefers-color-scheme: dark)"), k = (G) => {
        p.value = G ? "dark" : "light";
      };
      k(V.matches);
      const W = (G) => {
        k(G.matches);
      };
      try {
        V.addEventListener("change", W);
      } catch {
        V.addListener(W);
      }
      x(() => {
        try {
          V.removeEventListener("change", W);
        } catch {
          V.removeListener(W);
        }
      });
    }), se(() => {
      f.value && v.value && (v.value.focus({ preventScroll: !0 }), v.value = null, y.value = !1);
    }), se(() => {
      n.value.length <= 1 && Object.keys(d.value).forEach((x) => {
        d.value[x] = !1;
      });
    }), se((x) => {
      function V(k) {
        const W = o.hotkey.every((z) => k[z] || k.code === z), G = Array.isArray(f.value) ? f.value[0] : f.value;
        W && (l.value.forEach((z) => {
          d.value[z] = !0;
        }), G?.focus());
        const R = document.activeElement === f.value || G?.contains(document.activeElement);
        k.code === "Escape" && R && l.value.forEach((z) => {
          d.value[z] = !1;
        });
      }
      hm && (document.addEventListener("keydown", V), x(() => {
        document.removeEventListener("keydown", V);
      }));
    });
    function C(x) {
      const V = x.currentTarget, k = V.getAttribute("data-y-position") + "-" + V.getAttribute("data-x-position");
      d.value[k] = !0;
    }
    function $(x) {
      if (!c.value) {
        const V = x.currentTarget, k = V.getAttribute("data-y-position") + "-" + V.getAttribute("data-x-position");
        d.value[k] = !1;
      }
    }
    function D() {
      Object.keys(d.value).forEach((x) => {
        d.value[x] = !1;
      });
    }
    function I() {
      c.value = !1;
    }
    function M(x) {
      u.value = x;
    }
    function j(x) {
      const V = u.value.findIndex((k) => k.toastId === x.toastId);
      if (V !== -1) u.value[V] = x;
      else {
        const k = u.value.findIndex((W) => W.position === x.position);
        k !== -1 ? u.value.splice(k, 0, x) : u.value.unshift(x);
      }
    }
    return (x, V) => (m(), H(qe, null, [de(" Remove item from normal navigation flow, only available via hotkey "), ye("section", {
      "aria-label": `${x.containerAriaLabel} ${a(w)}`,
      tabIndex: -1,
      "aria-live": "polite",
      "aria-relevant": "additions text",
      "aria-atomic": "false"
    }, [(m(!0), H(qe, null, Bt(l.value, (k, W) => (m(), H("ol", E({
      key: k,
      ref_for: !0,
      ref_key: "listRef",
      ref: f,
      "data-sonner-toaster": "",
      "data-sonner-theme": p.value,
      class: o.class,
      dir: x.dir === "auto" ? bm() : x.dir,
      tabIndex: -1,
      "data-theme": x.theme,
      "data-rich-colors": x.richColors,
      "data-y-position": k.split("-")[0],
      "data-x-position": k.split("-")[1],
      style: {
        "--front-toast-height": `${u.value[0]?.height || 0}px`,
        "--width": `${a(Mv)}px`,
        "--gap": `${x.gap}px`,
        ...x.style,
        ...a(t).style,
        ...a(Lv)(x.offset, x.mobileOffset)
      }
    }, { ref_for: !0 }, x.$attrs, {
      onBlur: O,
      onFocus: q,
      onMouseenter: C,
      onMousemove: C,
      onMouseleave: $,
      onDragend: D,
      onPointerdown: B,
      onPointerup: I
    }), [(m(!0), H(qe, null, Bt(s(k, W), (G, R) => (m(), _(Hv, {
      key: G.id,
      heights: u.value,
      icons: x.icons,
      index: R,
      toast: G,
      defaultRichColors: x.richColors,
      duration: x.toastOptions?.duration ?? x.duration,
      class: Y(x.toastOptions?.class ?? ""),
      descriptionClass: x.toastOptions?.descriptionClass,
      invert: x.invert,
      visibleToasts: x.visibleToasts,
      closeButton: x.toastOptions?.closeButton ?? x.closeButton,
      interacting: c.value,
      position: k,
      closeButtonPosition: x.toastOptions?.closeButtonPosition ?? x.closeButtonPosition,
      style: Te(x.toastOptions?.style),
      unstyled: x.toastOptions?.unstyled,
      classes: x.toastOptions?.classes,
      cancelButtonStyle: x.toastOptions?.cancelButtonStyle,
      actionButtonStyle: x.toastOptions?.actionButtonStyle,
      "close-button-aria-label": x.toastOptions?.closeButtonAriaLabel,
      toasts: i.value[k],
      expandByDefault: x.expand,
      gap: x.gap,
      expanded: d.value[k] || !1,
      swipeDirections: o.swipeDirections,
      "onUpdate:heights": M,
      "onUpdate:height": j,
      onRemoveToast: S
    }, {
      "close-icon": g(() => [b(x.$slots, "close-icon", {}, () => [F(Yv)])]),
      "loading-icon": g(() => [b(x.$slots, "loading-icon", {}, () => [F(Qv, { visible: G.type === "loading" }, null, 8, ["visible"])])]),
      "success-icon": g(() => [b(x.$slots, "success-icon", {}, () => [F(nm)])]),
      "error-icon": g(() => [b(x.$slots, "error-icon", {}, () => [F(mm)])]),
      "warning-icon": g(() => [b(x.$slots, "warning-icon", {}, () => [F(cm)])]),
      "info-icon": g(() => [b(x.$slots, "info-icon", {}, () => [F(lm)])]),
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
    ]))), 128))], 16, gm))), 128))], 8, ym)], 2112));
  }
}), wm = _m;
const cg = /* @__PURE__ */ h({
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
    return (n, r) => (m(), _(a(wm), E({
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
      "success-icon": g(() => [
        F(a(uv), { class: "size-4" })
      ]),
      "info-icon": g(() => [
        F(a(dv), { class: "size-4" })
      ]),
      "warning-icon": g(() => [
        F(a(fv), { class: "size-4" })
      ]),
      "error-icon": g(() => [
        F(a(pv), { class: "size-4" })
      ]),
      "loading-icon": g(() => [
        ye("div", null, [
          F(a(cv), { class: "size-4 animate-spin" })
        ])
      ]),
      "close-icon": g(() => [
        F(a(Do), { class: "size-4" })
      ]),
      _: 1
    }, 16));
  }
});
const Cm = /* @__PURE__ */ Symbol("vee-validate-form"), Sm = /* @__PURE__ */ Symbol("vee-validate-field-instance");
function xm(e, o, t) {
  return o.slots.default ? typeof e == "string" || !e ? o.slots.default(t()) : {
    default: () => {
      var n, r;
      return (r = (n = o.slots).default) === null || r === void 0 ? void 0 : r.call(n, t());
    }
  } : o.slots.default;
}
const qm = {
  generateMessage: ({ field: e }) => `${e} is not valid.`,
  bails: !0,
  validateOnBlur: !0,
  validateOnChange: !0,
  validateOnInput: !1,
  validateOnModelUpdate: !0
};
Object.assign({}, qm);
const Bm = /* @__PURE__ */ h({
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
    const t = Nt(Cm, void 0), n = A(() => t?.errors.value[e.name]);
    function r() {
      return {
        message: n.value
      };
    }
    return () => {
      if (!n.value)
        return;
      const s = e.as ? $e(e.as) : e.as, l = xm(s, o, r), i = Object.assign({ role: "alert" }, o.attrs);
      return !s && (Array.isArray(l) || !l) && l?.length ? l : (Array.isArray(l) || !l) && !l?.length ? Me(s || "span", i, n.value) : Me(s, i, l);
    };
  }
}), Om = Bm, $a = /* @__PURE__ */ Symbol();
function ko() {
  const e = Nt(Sm), o = Nt($a);
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
const pg = /* @__PURE__ */ h({
  __name: "FormControl",
  setup(e) {
    const { error: o, formItemId: t, formDescriptionId: n, formMessageId: r } = ko();
    return (s, l) => (m(), _(a(io), {
      id: a(t),
      "aria-describedby": a(o) ? `${a(n)} ${a(r)}` : `${a(n)}`,
      "aria-invalid": !!a(o)
    }, {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 8, ["id", "aria-describedby", "aria-invalid"]));
  }
}), Am = ["id"], fg = /* @__PURE__ */ h({
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
    ], 10, Am));
  }
}), vg = /* @__PURE__ */ h({
  __name: "FormItem",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, t = be();
    return sn($a, t), (n, r) => (m(), H("div", {
      class: Y(a(L)("space-y-2", o.class))
    }, [
      b(n.$slots, "default")
    ], 2));
  }
}), mg = /* @__PURE__ */ h({
  __name: "FormLabel",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, { error: t, formItemId: n } = ko();
    return (r, s) => (m(), _(yv, {
      class: Y(a(L)(
        a(t) && "text-destructive",
        o.class
      )),
      for: a(n)
    }, {
      default: g(() => [
        b(r.$slots, "default")
      ]),
      _: 3
    }, 8, ["class", "for"]));
  }
}), yg = /* @__PURE__ */ h({
  __name: "FormMessage",
  setup(e) {
    const { name: o, formMessageId: t } = ko();
    return (n, r) => (m(), _(a(Om), {
      id: a(t),
      as: "p",
      name: we(a(o)),
      class: "text-sm font-medium text-destructive"
    }, null, 8, ["id", "name"]));
  }
});
function Ko(e) {
  const o = e.data;
  return o && typeof o == "object" && "data" in o && o.data != null ? o.data : o;
}
function Pm(e, o) {
  return new Promise((t, n) => {
    const r = setTimeout(() => n(new Error("Matrix connection timed out")), o);
    e.then(
      (s) => {
        clearTimeout(r), t(s);
      },
      (s) => {
        clearTimeout(r), n(s);
      }
    );
  });
}
function gg(e) {
  const { api: o, createClient: t, timelineEvent: n, defaultDeviceId: r } = e, s = e.connectTimeoutMs ?? 5e3, l = P({ enabled: !1 }), i = P(!1), u = P(!1);
  let d = null;
  return function() {
    const p = A(() => l.value.enabled), f = A(() => l.value.provisioned === !0);
    async function v() {
      if (u.value)
        return l.value;
      i.value = !0;
      try {
        const D = await o.get("/matrix/session");
        return l.value = Ko(D), u.value = !0, l.value;
      } catch {
        return l.value = { enabled: !1 }, u.value = !0, l.value;
      } finally {
        i.value = !1;
      }
    }
    async function y() {
      const D = await v();
      if (!D.provisioned || !D.access_token || !D.homeserver_url)
        return !1;
      if (d)
        return !0;
      const I = t({
        baseUrl: D.homeserver_url,
        accessToken: D.access_token,
        userId: D.user_id,
        deviceId: D.device_id ?? r
      });
      try {
        return await Pm(I.startClient({ initialSyncLimit: 20 }), s), d = I, !0;
      } catch {
        try {
          I.stopClient();
        } catch {
        }
        return !1;
      }
    }
    async function w(D) {
      try {
        const I = await o.get(`/matrix/dm/${D}`), M = Ko(I);
        return M?.session && (l.value = M.session, u.value = !0), M ? { room_id: M.room_id, session: l.value } : null;
      } catch {
        return null;
      }
    }
    async function S(D) {
      if (!await y() || !d)
        return [];
      const M = d.getRoom(D);
      return M ? B(M, d.getUserId() ?? "") : [];
    }
    function O(D, I) {
      const M = d;
      if (!M)
        return () => {
        };
      const j = (x, V) => {
        if (!V || V.roomId !== D || x.getType() !== "m.room.message")
          return;
        const k = x.getContent()?.body;
        k && I({
          id: x.getId() ?? `${Date.now()}`,
          sender_id: x.getSender() ?? "",
          content: k,
          created_at: new Date(x.getTs()).toISOString(),
          is_mine: x.getSender() === M.getUserId()
        });
      };
      return M.on(n, j), () => {
        M.removeListener(n, j);
      };
    }
    async function q(D, I) {
      if (!await y() || !d)
        throw new Error("Matrix client not connected");
      await d.sendTextMessage(D, I);
    }
    function B(D, I) {
      return D.getLiveTimeline().getEvents().filter((M) => M.getType() === "m.room.message").map((M) => ({
        id: M.getId() ?? `${M.getTs()}`,
        sender_id: M.getSender() ?? "",
        content: M.getContent()?.body ?? "",
        created_at: new Date(M.getTs()).toISOString(),
        is_mine: M.getSender() === I
      }));
    }
    async function C() {
      if (await v(), !f.value)
        return [];
      try {
        const D = await o.get("/matrix/conversations"), I = Ko(D);
        return Array.isArray(I) ? I : [];
      } catch {
        return [];
      }
    }
    function $() {
      d?.stopClient(), d = null, l.value = { enabled: !1 }, u.value = !1;
    }
    return {
      session: l,
      loading: i,
      isEnabled: p,
      isProvisioned: f,
      loadSession: v,
      connectClient: y,
      getDirectRoom: w,
      loadRoomMessages: S,
      subscribeToRoom: O,
      sendRoomMessage: q,
      loadConversations: C,
      resetSession: $
    };
  };
}
export {
  Ay as Accordion,
  Py as AccordionContent,
  Ty as AccordionItem,
  Ey as AccordionTrigger,
  ig as Alert,
  ug as AlertDescription,
  dg as AlertTitle,
  Jm as Avatar,
  Zm as AvatarFallback,
  Qm as AvatarImage,
  Xm as Badge,
  km as Button,
  Im as Card,
  $m as CardContent,
  Mm as CardDescription,
  Rm as CardFooter,
  Fm as CardHeader,
  Vm as CardTitle,
  dy as Checkbox,
  Lm as Dialog,
  jm as DialogClose,
  zm as DialogContent,
  Km as DialogDescription,
  Hm as DialogFooter,
  Wm as DialogHeader,
  Um as DialogScrollContent,
  Gm as DialogTitle,
  Ym as DialogTrigger,
  Dy as DropdownMenu,
  ky as DropdownMenuCheckboxItem,
  Iy as DropdownMenuContent,
  $y as DropdownMenuGroup,
  My as DropdownMenuItem,
  Ry as DropdownMenuLabel,
  Fy as DropdownMenuRadioGroup,
  Vy as DropdownMenuRadioItem,
  Ny as DropdownMenuSeparator,
  Ly as DropdownMenuShortcut,
  jy as DropdownMenuSub,
  zy as DropdownMenuSubContent,
  Ky as DropdownMenuSubTrigger,
  Hy as DropdownMenuTrigger,
  pg as FormControl,
  fg as FormDescription,
  vg as FormItem,
  mg as FormLabel,
  yg as FormMessage,
  Nm as Input,
  yv as Label,
  Wy as Popover,
  Uy as PopoverContent,
  Gy as PopoverTrigger,
  lg as Progress,
  cy as RadioGroup,
  py as RadioGroupItem,
  ty as Select,
  oy as SelectContent,
  ny as SelectGroup,
  ry as SelectItem,
  ay as SelectItemText,
  sy as SelectLabel,
  hv as SelectScrollDownButton,
  bv as SelectScrollUpButton,
  ly as SelectSeparator,
  iy as SelectTrigger,
  uy as SelectValue,
  ey as Separator,
  yy as Sheet,
  gy as SheetClose,
  hy as SheetContent,
  by as SheetDescription,
  _y as SheetFooter,
  wy as SheetHeader,
  Cy as SheetTitle,
  Sy as SheetTrigger,
  sg as Skeleton,
  my as Slider,
  cg as Sonner,
  fy as Switch,
  Qy as Table,
  eg as TableBody,
  tg as TableCaption,
  qv as TableCell,
  og as TableEmpty,
  ng as TableFooter,
  rg as TableHead,
  ag as TableHeader,
  Bv as TableRow,
  xy as Tabs,
  qy as TabsContent,
  By as TabsList,
  Oy as TabsTrigger,
  vy as Textarea,
  Yy as Tooltip,
  Xy as TooltipContent,
  Jy as TooltipProvider,
  Zy as TooltipTrigger,
  mv as avatarVariant,
  vv as badgeVariants,
  ov as buttonVariants,
  L as cn,
  gg as createUseMatrix,
  ko as useFormField
};
