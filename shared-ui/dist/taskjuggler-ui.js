import * as Rn from "vue";
import { inject as Ft, provide as on, Fragment as xe, shallowRef as vo, readonly as ca, customRef as Mr, toValue as ye, watch as re, getCurrentScope as pa, onScopeDispose as fa, effectScope as va, onBeforeUnmount as nn, computed as O, watchEffect as ae, getCurrentInstance as at, isRef as Le, reactive as qt, unref as r, toRefs as se, ref as T, nextTick as de, onMounted as pe, toHandlerKey as Rr, camelize as ma, toRef as Fr, onUnmounted as rt, defineComponent as h, h as Ie, Comment as Vr, mergeProps as E, cloneVNode as Nr, createBlock as _, openBlock as m, withCtx as g, renderSlot as b, createVNode as M, createCommentVNode as ce, withKeys as Tt, normalizeStyle as Ae, Teleport as ga, normalizeProps as W, guardReactiveProps as Y, withDirectives as an, vShow as Lr, markRaw as zr, createElementBlock as K, renderList as Bt, resolveDynamicComponent as $e, withModifiers as we, watchPostEffect as ya, shallowReadonly as bt, mergeDefaults as ha, createElementVNode as me, createTextVNode as Pt, toDisplayString as Ct, toRaw as Kr, toHandlers as Hr, normalizeClass as U, vModelText as ba, useAttrs as jr, isVNode as $t } from "vue";
function _a(e) {
  var o, t, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var a = e.length;
    for (o = 0; o < a; o++) e[o] && (t = _a(e[o])) && (n && (n += " "), n += t);
  } else for (t in e) e[t] && (n && (n += " "), n += t);
  return n;
}
function wa() {
  for (var e, o, t = 0, n = "", a = arguments.length; t < a; t++) (e = arguments[t]) && (o = _a(e)) && (n && (n += " "), n += o);
  return n;
}
const rn = "-", Wr = (e) => {
  const o = Gr(e), {
    conflictingClassGroups: t,
    conflictingClassGroupModifiers: n
  } = e;
  return {
    getClassGroupId: (l) => {
      const i = l.split(rn);
      return i[0] === "" && i.length !== 1 && i.shift(), Ca(i, o) || Ur(l);
    },
    getConflictingClassGroupIds: (l, i) => {
      const u = t[l] || [];
      return i && n[l] ? [...u, ...n[l]] : u;
    }
  };
}, Ca = (e, o) => {
  if (e.length === 0)
    return o.classGroupId;
  const t = e[0], n = o.nextPart.get(t), a = n ? Ca(e.slice(1), n) : void 0;
  if (a)
    return a;
  if (o.validators.length === 0)
    return;
  const s = e.join(rn);
  return o.validators.find(({
    validator: l
  }) => l(s))?.classGroupId;
}, Fn = /^\[(.+)\]$/, Ur = (e) => {
  if (Fn.test(e)) {
    const o = Fn.exec(e)[1], t = o?.substring(0, o.indexOf(":"));
    if (t)
      return "arbitrary.." + t;
  }
}, Gr = (e) => {
  const {
    theme: o,
    prefix: t
  } = e, n = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Xr(Object.entries(e.classGroups), t).forEach(([s, l]) => {
    zo(l, n, s, o);
  }), n;
}, zo = (e, o, t, n) => {
  e.forEach((a) => {
    if (typeof a == "string") {
      const s = a === "" ? o : Vn(o, a);
      s.classGroupId = t;
      return;
    }
    if (typeof a == "function") {
      if (Yr(a)) {
        zo(a(n), o, t, n);
        return;
      }
      o.validators.push({
        validator: a,
        classGroupId: t
      });
      return;
    }
    Object.entries(a).forEach(([s, l]) => {
      zo(l, Vn(o, s), t, n);
    });
  });
}, Vn = (e, o) => {
  let t = e;
  return o.split(rn).forEach((n) => {
    t.nextPart.has(n) || t.nextPart.set(n, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), t = t.nextPart.get(n);
  }), t;
}, Yr = (e) => e.isThemeGetter, Xr = (e, o) => o ? e.map(([t, n]) => {
  const a = n.map((s) => typeof s == "string" ? o + s : typeof s == "object" ? Object.fromEntries(Object.entries(s).map(([l, i]) => [o + l, i])) : s);
  return [t, a];
}) : e, Jr = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let o = 0, t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  const a = (s, l) => {
    t.set(s, l), o++, o > e && (o = 0, n = t, t = /* @__PURE__ */ new Map());
  };
  return {
    get(s) {
      let l = t.get(s);
      if (l !== void 0)
        return l;
      if ((l = n.get(s)) !== void 0)
        return a(s, l), l;
    },
    set(s, l) {
      t.has(s) ? t.set(s, l) : a(s, l);
    }
  };
}, Sa = "!", Zr = (e) => {
  const {
    separator: o,
    experimentalParseClassName: t
  } = e, n = o.length === 1, a = o[0], s = o.length, l = (i) => {
    const u = [];
    let d = 0, c = 0, p;
    for (let S = 0; S < i.length; S++) {
      let P = i[S];
      if (d === 0) {
        if (P === a && (n || i.slice(S, S + s) === o)) {
          u.push(i.slice(c, S)), c = S + s;
          continue;
        }
        if (P === "/") {
          p = S;
          continue;
        }
      }
      P === "[" ? d++ : P === "]" && d--;
    }
    const f = u.length === 0 ? i : i.substring(c), v = f.startsWith(Sa), y = v ? f.substring(1) : f, w = p && p > c ? p - c : void 0;
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
}, Qr = (e) => {
  if (e.length <= 1)
    return e;
  const o = [];
  let t = [];
  return e.forEach((n) => {
    n[0] === "[" ? (o.push(...t.sort(), n), t = []) : t.push(n);
  }), o.push(...t.sort()), o;
}, es = (e) => ({
  cache: Jr(e.cacheSize),
  parseClassName: Zr(e),
  ...Wr(e)
}), ts = /\s+/, os = (e, o) => {
  const {
    parseClassName: t,
    getClassGroupId: n,
    getConflictingClassGroupIds: a
  } = o, s = [], l = e.trim().split(ts);
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
    const S = Qr(c).join(":"), P = p ? S + Sa : S, B = P + w;
    if (s.includes(B))
      continue;
    s.push(B);
    const q = a(w, y);
    for (let x = 0; x < q.length; ++x) {
      const k = q[x];
      s.push(P + k);
    }
    i = d + (i.length > 0 ? " " + i : i);
  }
  return i;
};
function ns() {
  let e = 0, o, t, n = "";
  for (; e < arguments.length; )
    (o = arguments[e++]) && (t = xa(o)) && (n && (n += " "), n += t);
  return n;
}
const xa = (e) => {
  if (typeof e == "string")
    return e;
  let o, t = "";
  for (let n = 0; n < e.length; n++)
    e[n] && (o = xa(e[n])) && (t && (t += " "), t += o);
  return t;
};
function as(e, ...o) {
  let t, n, a, s = l;
  function l(u) {
    const d = o.reduce((c, p) => p(c), e());
    return t = es(d), n = t.cache.get, a = t.cache.set, s = i, i(u);
  }
  function i(u) {
    const d = n(u);
    if (d)
      return d;
    const c = os(u, t);
    return a(u, c), c;
  }
  return function() {
    return s(ns.apply(null, arguments));
  };
}
const ue = (e) => {
  const o = (t) => t[e] || [];
  return o.isThemeGetter = !0, o;
}, qa = /^\[(?:([a-z-]+):)?(.+)\]$/i, rs = /^\d+\/\d+$/, ss = /* @__PURE__ */ new Set(["px", "full", "screen"]), ls = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, is = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, us = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/, ds = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, cs = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Ue = (e) => St(e) || ss.has(e) || rs.test(e), Je = (e) => At(e, "length", bs), St = (e) => !!e && !Number.isNaN(Number(e)), $o = (e) => At(e, "number", St), It = (e) => !!e && Number.isInteger(Number(e)), ps = (e) => e.endsWith("%") && St(e.slice(0, -1)), G = (e) => qa.test(e), Ze = (e) => ls.test(e), fs = /* @__PURE__ */ new Set(["length", "size", "percentage"]), vs = (e) => At(e, fs, Ba), ms = (e) => At(e, "position", Ba), gs = /* @__PURE__ */ new Set(["image", "url"]), ys = (e) => At(e, gs, ws), hs = (e) => At(e, "", _s), Mt = () => !0, At = (e, o, t) => {
  const n = qa.exec(e);
  return n ? n[1] ? typeof o == "string" ? n[1] === o : o.has(n[1]) : t(n[2]) : !1;
}, bs = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  is.test(e) && !us.test(e)
), Ba = () => !1, _s = (e) => ds.test(e), ws = (e) => cs.test(e), Cs = () => {
  const e = ue("colors"), o = ue("spacing"), t = ue("blur"), n = ue("brightness"), a = ue("borderColor"), s = ue("borderRadius"), l = ue("borderSpacing"), i = ue("borderWidth"), u = ue("contrast"), d = ue("grayscale"), c = ue("hueRotate"), p = ue("invert"), f = ue("gap"), v = ue("gradientColorStops"), y = ue("gradientColorStopPositions"), w = ue("inset"), S = ue("margin"), P = ue("opacity"), B = ue("padding"), q = ue("saturate"), x = ue("scale"), k = ue("sepia"), R = ue("skew"), F = ue("space"), L = ue("translate"), A = () => ["auto", "contain", "none"], C = () => ["auto", "hidden", "clip", "visible", "scroll"], $ = () => ["auto", G, o], I = () => [G, o], H = () => ["", Ue, Je], j = () => ["auto", St, G], oe = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], J = () => ["solid", "dashed", "dotted", "double", "none"], te = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], le = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], ve = () => ["", "0", G], qe = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], he = () => [St, G];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [Mt],
      spacing: [Ue, Je],
      blur: ["none", "", Ze, G],
      brightness: he(),
      borderColor: [e],
      borderRadius: ["none", "", "full", Ze, G],
      borderSpacing: I(),
      borderWidth: H(),
      contrast: he(),
      grayscale: ve(),
      hueRotate: he(),
      invert: ve(),
      gap: I(),
      gradientColorStops: [e],
      gradientColorStopPositions: [ps, Je],
      inset: $(),
      margin: $(),
      opacity: he(),
      padding: I(),
      saturate: he(),
      scale: he(),
      sepia: ve(),
      skew: he(),
      space: I(),
      translate: I()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", G]
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
        columns: [Ze]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": qe()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": qe()
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
        object: [...oe(), G]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: C()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": C()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": C()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: A()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": A()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": A()
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
        z: ["auto", It, G]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: $()
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
        flex: ["1", "auto", "initial", "none", G]
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
        order: ["first", "last", "none", It, G]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [Mt]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", It, G]
        }, G]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": j()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": j()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [Mt]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [It, G]
        }, G]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": j()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": j()
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
        "auto-cols": ["auto", "min", "max", "fr", G]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", G]
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
        justify: ["normal", ...le()]
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
        content: ["normal", ...le(), "baseline"]
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
        "place-content": [...le(), "baseline"]
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
        p: [B]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [B]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [B]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [B]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [B]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [B]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [B]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [B]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [B]
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
        "space-x": [F]
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
        "space-y": [F]
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
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", G, o]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [G, o, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [G, o, "none", "full", "min", "max", "fit", "prose", {
          screen: [Ze]
        }, Ze]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [G, o, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [G, o, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [G, o, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [G, o, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", Ze, Je]
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
        font: [Mt]
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
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", G]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", St, $o]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", Ue, G]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", G]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", G]
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
        "placeholder-opacity": [P]
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
        "text-opacity": [P]
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
        decoration: [...J(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", Ue, Je]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", Ue, G]
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
        indent: I()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", G]
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
        content: ["none", G]
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
        "bg-opacity": [P]
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
        bg: [...oe(), ms]
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
        bg: ["auto", "cover", "contain", vs]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, ys]
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
        "border-opacity": [P]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...J(), "hidden"]
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
        "divide-opacity": [P]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: J()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [a]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [a]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [a]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [a]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [a]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [a]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [a]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [a]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [a]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [a]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...J()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [Ue, G]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [Ue, Je]
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
        ring: H()
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
        "ring-opacity": [P]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [Ue, Je]
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
        shadow: ["", "inner", "none", Ze, hs]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [Mt]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [P]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...te(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": te()
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
        "drop-shadow": ["", "none", Ze, G]
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
        saturate: [q]
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
        "backdrop-opacity": [P]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [q]
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
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", G]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: he()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", G]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: he()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", G]
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
        scale: [x]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [x]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [x]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [It, G]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [L]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [L]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [R]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [R]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", G]
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", G]
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
        "scroll-m": I()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": I()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": I()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": I()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": I()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": I()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": I()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": I()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": I()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": I()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": I()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": I()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": I()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": I()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": I()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": I()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": I()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": I()
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
        "will-change": ["auto", "scroll", "contents", "transform", G]
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
        stroke: [Ue, Je, $o]
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
}, Ss = /* @__PURE__ */ as(Cs);
function N(...e) {
  return Ss(wa(e));
}
const Nn = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, Ln = wa, Ht = (e, o) => (t) => {
  var n;
  if (o?.variants == null) return Ln(e, t?.class, t?.className);
  const { variants: a, defaultVariants: s } = o, l = Object.keys(a).map((d) => {
    const c = t?.[d], p = s?.[d];
    if (c === null) return null;
    const f = Nn(c) || Nn(p);
    return a[d][f];
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
  return Ln(e, l, u, t?.class, t?.className);
};
function zn(e) {
  return typeof e == "string" ? `'${e}'` : new xs().serialize(e);
}
const xs = /* @__PURE__ */ (function() {
  class e {
    #e = /* @__PURE__ */ new Map();
    compare(t, n) {
      const a = typeof t, s = typeof n;
      return a === "string" && s === "string" ? t.localeCompare(n) : a === "number" && s === "number" ? t - n : String.prototype.localeCompare.call(this.serialize(t, !0), this.serialize(n, !0));
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
      const a = t.constructor, s = a === Object || a === void 0 ? "" : a.name;
      if (s !== "" && globalThis[s] === a) return this.serializeBuiltInType(s, t);
      if (typeof t.toJSON == "function") {
        const l = t.toJSON();
        return s + (l !== null && typeof l == "object" ? this.$object(l) : `(${this.serialize(l)})`);
      }
      return this.serializeObjectEntries(s, Object.entries(t));
    }
    serializeBuiltInType(t, n) {
      const a = this["$" + t];
      if (a) return a.call(this, n);
      if (typeof n?.entries == "function") return this.serializeObjectEntries(t, n.entries());
      throw new Error(`Cannot serialize ${t}`);
    }
    serializeObjectEntries(t, n) {
      const a = Array.from(n).sort((l, i) => this.compare(l[0], i[0]));
      let s = `${t}{`;
      for (let l = 0; l < a.length; l++) {
        const [i, u] = a[l];
        s += `${this.serialize(i, !0)}:${this.serialize(u)}`, l < a.length - 1 && (s += ",");
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
      for (let a = 0; a < t.length; a++) n += this.serialize(t[a]), a < t.length - 1 && (n += ",");
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
      return `Set${this.$Array(Array.from(t).sort((n, a) => this.compare(n, a)))}`;
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
function ut(e, o) {
  return e === o || zn(e) === zn(o);
}
function ro(e, o = Number.NEGATIVE_INFINITY, t = Number.POSITIVE_INFINITY) {
  return Math.min(t, Math.max(o, e));
}
function ee(e, o) {
  const t = typeof e == "string" && !o ? `${e}Context` : o, n = Symbol(t);
  return [(l) => {
    const i = Ft(n, l);
    if (i || i === null) return i;
    throw new Error(`Injection \`${n.toString()}\` not found. Component must be used within ${Array.isArray(e) ? `one of the following components: ${e.join(", ")}` : `\`${e}\``}`);
  }, (l) => (on(n, l), l)];
}
function Ce() {
  let e = document.activeElement;
  if (e == null) return null;
  for (; e != null && e.shadowRoot != null && e.shadowRoot.activeElement != null; ) e = e.shadowRoot.activeElement;
  return e;
}
function mo(e, o, t) {
  const n = t.originalEvent.target, a = new CustomEvent(e, {
    bubbles: !1,
    cancelable: !0,
    detail: t
  });
  o && n.addEventListener(e, o, { once: !0 }), n.dispatchEvent(a);
}
function tt(e) {
  return e == null;
}
function Ko(e, o) {
  return tt(e) ? !1 : Array.isArray(e) ? e.some((t) => ut(t, o)) : ut(e, o);
}
function sn(e) {
  return e ? e.flatMap((o) => o.type === xe ? sn(o.children) : [o]) : [];
}
const qs = ["INPUT", "TEXTAREA"];
function Pa(e, o, t, n = {}) {
  if (!o || n.enableIgnoredElement && qs.includes(o.nodeName)) return null;
  const { arrowKeyOptions: a = "both", attributeName: s = "[data-reka-collection-item]", itemsArray: l = [], loop: i = !0, dir: u = "ltr", preventScroll: d = !0, focus: c = !1 } = n, [p, f, v, y, w, S] = [
    e.key === "ArrowRight",
    e.key === "ArrowLeft",
    e.key === "ArrowUp",
    e.key === "ArrowDown",
    e.key === "Home",
    e.key === "End"
  ], P = v || y, B = p || f;
  if (!w && !S && (!P && !B || a === "vertical" && B || a === "horizontal" && P)) return null;
  const q = t ? Array.from(t.querySelectorAll(s)) : l;
  if (!q.length) return null;
  d && e.preventDefault();
  let x = null;
  return B || P ? x = Oa(q, o, {
    goForward: P ? y : u === "ltr" ? p : f,
    loop: i
  }) : w ? x = q.at(0) || null : S && (x = q.at(-1) || null), c && x?.focus(), x;
}
function Oa(e, o, t, n = e.length) {
  if (--n === 0) return null;
  const a = e.indexOf(o), s = t.goForward ? a + 1 : a - 1;
  if (!t.loop && (s < 0 || s >= e.length)) return null;
  const l = (s + e.length) % e.length, i = e[l];
  return i ? i.hasAttribute("disabled") && i.getAttribute("disabled") !== "false" ? Oa(e, i, t, n) : i : null;
}
const [go] = ee("ConfigProvider");
function Bs(e, o) {
  var t;
  const n = vo();
  return ae(() => {
    n.value = e();
  }, {
    ...o,
    flush: (t = void 0) != null ? t : "sync"
  }), ca(n);
}
function ct(e) {
  return pa() ? (fa(e), !0) : !1;
}
function Ps() {
  const e = /* @__PURE__ */ new Set(), o = (s) => {
    e.delete(s);
  };
  return {
    on: (s) => {
      e.add(s);
      const l = () => o(s);
      return ct(l), {
        off: l
      };
    },
    off: o,
    trigger: (...s) => Promise.all(Array.from(e).map((l) => l(...s))),
    clear: () => {
      e.clear();
    }
  };
}
function Os(e) {
  let o = !1, t;
  const n = va(!0);
  return (...a) => (o || (t = n.run(() => e(...a)), o = !0), t);
}
function Ta(e) {
  let o = 0, t, n;
  const a = () => {
    o -= 1, n && o <= 0 && (n.stop(), t = void 0, n = void 0);
  };
  return (...s) => (o += 1, n || (n = va(!0), t = n.run(() => e(...s))), ct(a), t);
}
function Ts(e) {
  if (!Le(e))
    return qt(e);
  const o = new Proxy({}, {
    get(t, n, a) {
      return r(Reflect.get(e.value, n, a));
    },
    set(t, n, a) {
      return Le(e.value[n]) && !Le(a) ? e.value[n].value = a : e.value[n] = a, !0;
    },
    deleteProperty(t, n) {
      return Reflect.deleteProperty(e.value, n);
    },
    has(t, n) {
      return Reflect.has(e.value, n);
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
  });
  return qt(o);
}
function As(e) {
  return Ts(O(e));
}
function yo(e, ...o) {
  const t = o.flat(), n = t[0];
  return As(() => Object.fromEntries(typeof n == "function" ? Object.entries(se(e)).filter(([a, s]) => !n(ye(s), a)) : Object.entries(se(e)).filter((a) => !t.includes(a[0]))));
}
const Fe = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Ds = (e) => typeof e < "u", Es = Object.prototype.toString, ks = (e) => Es.call(e) === "[object Object]", Kn = /* @__PURE__ */ $s();
function $s() {
  var e, o;
  return Fe && ((e = window?.navigator) == null ? void 0 : e.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((o = window?.navigator) == null ? void 0 : o.maxTouchPoints) > 2 && /iPad|Macintosh/.test(window?.navigator.userAgent));
}
function Is(e) {
  return at();
}
function Io(e) {
  return Array.isArray(e) ? e : [e];
}
function Aa(e, o = 1e4) {
  return Mr((t, n) => {
    let a = ye(e), s;
    const l = () => setTimeout(() => {
      a = ye(e), n();
    }, ye(o));
    return ct(() => {
      clearTimeout(s);
    }), {
      get() {
        return t(), a;
      },
      set(i) {
        a = i, n(), clearTimeout(s), s = l();
      }
    };
  });
}
function Ms(e, o) {
  Is() && nn(e, o);
}
function Da(e, o, t = {}) {
  const {
    immediate: n = !0,
    immediateCallback: a = !1
  } = t, s = vo(!1);
  let l = null;
  function i() {
    l && (clearTimeout(l), l = null);
  }
  function u() {
    s.value = !1, i();
  }
  function d(...c) {
    a && e(), i(), s.value = !0, l = setTimeout(() => {
      s.value = !1, l = null, e(...c);
    }, ye(o));
  }
  return n && (s.value = !0, Fe && d()), ct(u), {
    isPending: ca(s),
    start: d,
    stop: u
  };
}
function Rs(e, o, t) {
  return re(
    e,
    o,
    {
      ...t,
      immediate: !0
    }
  );
}
const ho = Fe ? window : void 0;
function Ke(e) {
  var o;
  const t = ye(e);
  return (o = t?.$el) != null ? o : t;
}
function Ge(...e) {
  const o = [], t = () => {
    o.forEach((i) => i()), o.length = 0;
  }, n = (i, u, d, c) => (i.addEventListener(u, d, c), () => i.removeEventListener(u, d, c)), a = O(() => {
    const i = Io(ye(e[0])).filter((u) => u != null);
    return i.every((u) => typeof u != "string") ? i : void 0;
  }), s = Rs(
    () => {
      var i, u;
      return [
        (u = (i = a.value) == null ? void 0 : i.map((d) => Ke(d))) != null ? u : [ho].filter((d) => d != null),
        Io(ye(a.value ? e[1] : e[0])),
        Io(r(a.value ? e[2] : e[1])),
        // @ts-expect-error - TypeScript gets the correct types, but somehow still complains
        ye(a.value ? e[3] : e[2])
      ];
    },
    ([i, u, d, c]) => {
      if (t(), !i?.length || !u?.length || !d?.length)
        return;
      const p = ks(c) ? { ...c } : c;
      o.push(
        ...i.flatMap(
          (f) => u.flatMap(
            (v) => d.map((y) => n(f, v, y, p))
          )
        )
      );
    },
    { flush: "post" }
  ), l = () => {
    s(), t();
  };
  return ct(t), l;
}
function ln() {
  const e = vo(!1), o = at();
  return o && pe(() => {
    e.value = !0;
  }, o), e;
}
function Fs(e) {
  const o = ln();
  return O(() => (o.value, !!e()));
}
function Vs(e) {
  return typeof e == "function" ? e : typeof e == "string" ? (o) => o.key === e : Array.isArray(e) ? (o) => e.includes(o.key) : () => !0;
}
function Ns(...e) {
  let o, t, n = {};
  e.length === 3 ? (o = e[0], t = e[1], n = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (o = !0, t = e[0], n = e[1]) : (o = e[0], t = e[1]) : (o = !0, t = e[0]);
  const {
    target: a = ho,
    eventName: s = "keydown",
    passive: l = !1,
    dedupe: i = !1
  } = n, u = Vs(o);
  return Ge(a, s, (c) => {
    c.repeat && ye(i) || u(c) && t(c);
  }, l);
}
function Ls(e) {
  return JSON.parse(JSON.stringify(e));
}
function zs(e, o, t = {}) {
  const { window: n = ho, ...a } = t;
  let s;
  const l = Fs(() => n && "ResizeObserver" in n), i = () => {
    s && (s.disconnect(), s = void 0);
  }, u = O(() => {
    const p = ye(e);
    return Array.isArray(p) ? p.map((f) => Ke(f)) : [Ke(p)];
  }), d = re(
    u,
    (p) => {
      if (i(), l.value && n) {
        s = new ResizeObserver(o);
        for (const f of p)
          f && s.observe(f, a);
      }
    },
    { immediate: !0, flush: "post" }
  ), c = () => {
    i(), d();
  };
  return ct(c), {
    isSupported: l,
    stop: c
  };
}
function fe(e, o, t, n = {}) {
  var a, s, l;
  const {
    clone: i = !1,
    passive: u = !1,
    eventName: d,
    deep: c = !1,
    defaultValue: p,
    shouldEmit: f
  } = n, v = at(), y = t || v?.emit || ((a = v?.$emit) == null ? void 0 : a.bind(v)) || ((l = (s = v?.proxy) == null ? void 0 : s.$emit) == null ? void 0 : l.bind(v?.proxy));
  let w = d;
  o || (o = "modelValue"), w = w || `update:${o.toString()}`;
  const S = (q) => i ? typeof i == "function" ? i(q) : Ls(q) : q, P = () => Ds(e[o]) ? S(e[o]) : p, B = (q) => {
    f ? f(q) && y(w, q) : y(w, q);
  };
  if (u) {
    const q = P(), x = T(q);
    let k = !1;
    return re(
      () => e[o],
      (R) => {
        k || (k = !0, x.value = S(R), de(() => k = !1));
      }
    ), re(
      x,
      (R) => {
        !k && (R !== e[o] || c) && B(R);
      },
      { deep: c }
    ), x;
  } else
    return O({
      get() {
        return P();
      },
      set(q) {
        B(q);
      }
    });
}
function Mo(e) {
  if (e === null || typeof e != "object")
    return !1;
  const o = Object.getPrototypeOf(e);
  return o !== null && o !== Object.prototype && Object.getPrototypeOf(o) !== null || Symbol.iterator in e ? !1 : Symbol.toStringTag in e ? Object.prototype.toString.call(e) === "[object Module]" : !0;
}
function Ho(e, o, t = ".", n) {
  if (!Mo(o))
    return Ho(e, {}, t, n);
  const a = Object.assign({}, o);
  for (const s in e) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const l = e[s];
    l != null && (n && n(a, s, l, t) || (Array.isArray(l) && Array.isArray(a[s]) ? a[s] = [...l, ...a[s]] : Mo(l) && Mo(a[s]) ? a[s] = Ho(
      l,
      a[s],
      (t ? `${t}.` : "") + s.toString(),
      n
    ) : a[s] = l));
  }
  return a;
}
function Ks(e) {
  return (...o) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    o.reduce((t, n) => Ho(t, n, "", e), {})
  );
}
const Hs = Ks(), js = Ta(() => {
  const e = T(/* @__PURE__ */ new Map()), o = T(), t = O(() => {
    for (const l of e.value.values()) if (l) return !0;
    return !1;
  }), n = go({ scrollBody: T(!0) });
  let a = null;
  const s = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = o.value ?? "", Kn && a?.(), o.value = void 0;
  };
  return re(t, (l, i) => {
    if (!Fe) return;
    if (!l) {
      i && s();
      return;
    }
    o.value === void 0 && (o.value = document.body.style.overflow);
    const u = window.innerWidth - document.documentElement.clientWidth, d = {
      padding: u,
      margin: 0
    }, c = n.scrollBody?.value ? typeof n.scrollBody.value == "object" ? Hs({
      padding: n.scrollBody.value.padding === !0 ? u : n.scrollBody.value.padding,
      margin: n.scrollBody.value.margin === !0 ? u : n.scrollBody.value.margin
    }, d) : d : {
      padding: 0,
      margin: 0
    };
    u > 0 && (document.body.style.paddingRight = typeof c.padding == "number" ? `${c.padding}px` : String(c.padding), document.body.style.marginRight = typeof c.margin == "number" ? `${c.margin}px` : String(c.margin), document.documentElement.style.setProperty("--scrollbar-width", `${u}px`), document.body.style.overflow = "hidden"), Kn && (a = Ge(document, "touchmove", (p) => Ws(p), { passive: !1 })), de(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), e;
});
function bo(e) {
  const o = Math.random().toString(36).substring(2, 7), t = js();
  t.value.set(o, e ?? !1);
  const n = O({
    get: () => t.value.get(o) ?? !1,
    set: (a) => t.value.set(o, a)
  });
  return Ms(() => {
    t.value.delete(o);
  }), n;
}
function Ea(e) {
  const o = window.getComputedStyle(e);
  if (o.overflowX === "scroll" || o.overflowY === "scroll" || o.overflowX === "auto" && e.clientWidth < e.scrollWidth || o.overflowY === "auto" && e.clientHeight < e.scrollHeight) return !0;
  {
    const t = e.parentNode;
    return !(t instanceof Element) || t.tagName === "BODY" ? !1 : Ea(t);
  }
}
function Ws(e) {
  const o = e || window.event, t = o.target;
  return t instanceof Element && Ea(t) ? !1 : o.touches.length > 1 ? !0 : (o.preventDefault && o.cancelable && o.preventDefault(), !1);
}
function st(e) {
  const o = go({ dir: T("ltr") });
  return O(() => e?.value || o.dir?.value || "ltr");
}
function pt(e) {
  const o = at(), t = o?.type.emits, n = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${o?.type.__name}`), t?.forEach((a) => {
    n[Rr(ma(a))] = (...s) => e(a, ...s);
  }), n;
}
let Ro = 0;
function un() {
  ae((e) => {
    if (!Fe) return;
    const o = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", o[0] ?? Hn()), document.body.insertAdjacentElement("beforeend", o[1] ?? Hn()), Ro++, e(() => {
      Ro === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((t) => t.remove()), Ro--;
    });
  });
}
function Hn() {
  const e = document.createElement("span");
  return e.setAttribute("data-reka-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
function Dt(e) {
  return O(() => ye(e) ? !!Ke(e)?.closest("form") : !0);
}
function V() {
  const e = at(), o = T(), t = O(() => ["#text", "#comment"].includes(o.value?.$el.nodeName) ? o.value?.$el.nextElementSibling : Ke(o)), n = Object.assign({}, e.exposed), a = {};
  for (const l in e.props) Object.defineProperty(a, l, {
    enumerable: !0,
    configurable: !0,
    get: () => e.props[l]
  });
  if (Object.keys(n).length > 0) for (const l in n) Object.defineProperty(a, l, {
    enumerable: !0,
    configurable: !0,
    get: () => n[l]
  });
  Object.defineProperty(a, "$el", {
    enumerable: !0,
    configurable: !0,
    get: () => e.vnode.el
  }), e.exposed = a;
  function s(l) {
    if (o.value = l, !!l && (Object.defineProperty(a, "$el", {
      enumerable: !0,
      configurable: !0,
      get: () => l instanceof Element ? l : l.$el
    }), !(l instanceof Element) && !Object.hasOwn(l, "$el"))) {
      const i = l.$.exposed, u = Object.assign({}, a);
      for (const d in i) Object.defineProperty(u, d, {
        enumerable: !0,
        configurable: !0,
        get: () => i[d]
      });
      e.exposed = u;
    }
  }
  return {
    forwardRef: s,
    currentRef: o,
    currentElement: t
  };
}
function ge(e) {
  const o = at(), t = Object.keys(o?.type.props ?? {}).reduce((a, s) => {
    const l = (o?.type.props[s]).default;
    return l !== void 0 && (a[s] = l), a;
  }, {}), n = Fr(e);
  return O(() => {
    const a = {}, s = o?.vnode.props ?? {};
    return Object.keys(s).forEach((l) => {
      a[ma(l)] = s[l];
    }), Object.keys({
      ...t,
      ...a
    }).reduce((l, i) => (n.value[i] !== void 0 && (l[i] = n.value[i]), l), {});
  });
}
function Q(e, o) {
  const t = ge(e), n = o ? pt(o) : {};
  return O(() => ({
    ...t.value,
    ...n
  }));
}
function Us(e, o) {
  const t = Aa(!1, 300);
  ct(() => {
    t.value = !1;
  });
  const n = T(null), a = Ps();
  function s() {
    n.value = null, t.value = !1;
  }
  function l(i, u) {
    const d = i.currentTarget, c = {
      x: i.clientX,
      y: i.clientY
    }, p = Gs(c, d.getBoundingClientRect()), f = Ys(c, p), v = Xs(u.getBoundingClientRect()), y = Zs([...f, ...v]);
    n.value = y, t.value = !0;
  }
  return ae((i) => {
    if (e.value && o.value) {
      const u = (c) => l(c, o.value), d = (c) => l(c, e.value);
      e.value.addEventListener("pointerleave", u), o.value.addEventListener("pointerleave", d), i(() => {
        e.value?.removeEventListener("pointerleave", u), o.value?.removeEventListener("pointerleave", d);
      });
    }
  }), ae((i) => {
    if (n.value) {
      const u = (d) => {
        if (!n.value || !(d.target instanceof Element)) return;
        const c = d.target, p = {
          x: d.clientX,
          y: d.clientY
        }, f = e.value?.contains(c) || o.value?.contains(c), v = !Js(p, n.value), y = !!c.closest("[data-grace-area-trigger]");
        f ? s() : (v || y) && (s(), a.trigger());
      };
      e.value?.ownerDocument.addEventListener("pointermove", u), i(() => e.value?.ownerDocument.removeEventListener("pointermove", u));
    }
  }), {
    isPointerInTransit: t,
    onPointerExit: a.on
  };
}
function Gs(e, o) {
  const t = Math.abs(o.top - e.y), n = Math.abs(o.bottom - e.y), a = Math.abs(o.right - e.x), s = Math.abs(o.left - e.x);
  switch (Math.min(t, n, a, s)) {
    case s:
      return "left";
    case a:
      return "right";
    case t:
      return "top";
    case n:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function Ys(e, o, t = 5) {
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
function Xs(e) {
  const { top: o, right: t, bottom: n, left: a } = e;
  return [
    {
      x: a,
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
      x: a,
      y: n
    }
  ];
}
function Js(e, o) {
  const { x: t, y: n } = e;
  let a = !1;
  for (let s = 0, l = o.length - 1; s < o.length; l = s++) {
    const i = o[s].x, u = o[s].y, d = o[l].x, c = o[l].y;
    u > n != c > n && t < (d - i) * (n - u) / (c - u) + i && (a = !a);
  }
  return a;
}
function Zs(e) {
  const o = e.slice();
  return o.sort((t, n) => t.x < n.x ? -1 : t.x > n.x ? 1 : t.y < n.y ? -1 : t.y > n.y ? 1 : 0), Qs(o);
}
function Qs(e) {
  if (e.length <= 1) return e.slice();
  const o = [];
  for (let n = 0; n < e.length; n++) {
    const a = e[n];
    for (; o.length >= 2; ) {
      const s = o[o.length - 1], l = o[o.length - 2];
      if ((s.x - l.x) * (a.y - l.y) >= (s.y - l.y) * (a.x - l.x)) o.pop();
      else break;
    }
    o.push(a);
  }
  o.pop();
  const t = [];
  for (let n = e.length - 1; n >= 0; n--) {
    const a = e[n];
    for (; t.length >= 2; ) {
      const s = t[t.length - 1], l = t[t.length - 2];
      if ((s.x - l.x) * (a.y - l.y) >= (s.y - l.y) * (a.x - l.x)) t.pop();
      else break;
    }
    t.push(a);
  }
  return t.pop(), o.length === 1 && t.length === 1 && o[0].x === t[0].x && o[0].y === t[0].y ? o : o.concat(t);
}
var el = function(e) {
  if (typeof document > "u")
    return null;
  var o = Array.isArray(e) ? e[0] : e;
  return o.ownerDocument.body;
}, _t = /* @__PURE__ */ new WeakMap(), eo = /* @__PURE__ */ new WeakMap(), to = {}, Fo = 0, ka = function(e) {
  return e && (e.host || ka(e.parentNode));
}, tl = function(e, o) {
  return o.map(function(t) {
    if (e.contains(t))
      return t;
    var n = ka(t);
    return n && e.contains(n) ? n : (console.error("aria-hidden", t, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, ol = function(e, o, t, n) {
  var a = tl(o, Array.isArray(e) ? e : [e]);
  to[t] || (to[t] = /* @__PURE__ */ new WeakMap());
  var s = to[t], l = [], i = /* @__PURE__ */ new Set(), u = new Set(a), d = function(p) {
    !p || i.has(p) || (i.add(p), d(p.parentNode));
  };
  a.forEach(d);
  var c = function(p) {
    !p || u.has(p) || Array.prototype.forEach.call(p.children, function(f) {
      if (i.has(f))
        c(f);
      else
        try {
          var v = f.getAttribute(n), y = v !== null && v !== "false", w = (_t.get(f) || 0) + 1, S = (s.get(f) || 0) + 1;
          _t.set(f, w), s.set(f, S), l.push(f), w === 1 && y && eo.set(f, !0), S === 1 && f.setAttribute(t, "true"), y || f.setAttribute(n, "true");
        } catch (P) {
          console.error("aria-hidden: cannot operate on ", f, P);
        }
    });
  };
  return c(o), i.clear(), Fo++, function() {
    l.forEach(function(p) {
      var f = _t.get(p) - 1, v = s.get(p) - 1;
      _t.set(p, f), s.set(p, v), f || (eo.has(p) || p.removeAttribute(n), eo.delete(p)), v || p.removeAttribute(t);
    }), Fo--, Fo || (_t = /* @__PURE__ */ new WeakMap(), _t = /* @__PURE__ */ new WeakMap(), eo = /* @__PURE__ */ new WeakMap(), to = {});
  };
}, nl = function(e, o, t) {
  t === void 0 && (t = "data-aria-hidden");
  var n = Array.from(Array.isArray(e) ? e : [e]), a = el(e);
  return a ? (n.push.apply(n, Array.from(a.querySelectorAll("[aria-live], script"))), ol(n, a, t, "aria-hidden")) : function() {
    return null;
  };
};
function _o(e) {
  let o;
  re(() => Ke(e), (t) => {
    t ? o = nl(t) : o && o();
  }), rt(() => {
    o && o();
  });
}
let al = 0;
function _e(e, o = "reka") {
  if ("useId" in Rn) return `${o}-${Rn.useId?.()}`;
  const t = go({ useId: void 0 });
  return t.useId ? `${o}-${t.useId()}` : `${o}-${++al}`;
}
function $a(e) {
  const o = T(), t = O(() => o.value?.width ?? 0), n = O(() => o.value?.height ?? 0);
  return pe(() => {
    const a = Ke(e);
    if (a) {
      o.value = {
        width: a.offsetWidth,
        height: a.offsetHeight
      };
      const s = new ResizeObserver((l) => {
        if (!Array.isArray(l) || !l.length) return;
        const i = l[0];
        let u, d;
        if ("borderBoxSize" in i) {
          const c = i.borderBoxSize, p = Array.isArray(c) ? c[0] : c;
          u = p.inlineSize, d = p.blockSize;
        } else
          u = a.offsetWidth, d = a.offsetHeight;
        o.value = {
          width: u,
          height: d
        };
      });
      return s.observe(a, { box: "border-box" }), () => s.unobserve(a);
    } else o.value = void 0;
  }), {
    width: t,
    height: n
  };
}
function rl(e, o) {
  const t = T(e);
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
function dn(e) {
  const o = Aa("", 1e3);
  return {
    search: o,
    handleTypeaheadSearch: (a, s) => {
      o.value = o.value + a;
      {
        const l = Ce(), i = s.map((f) => ({
          ...f,
          textValue: f.value?.textValue ?? f.ref.textContent?.trim() ?? ""
        })), u = i.find((f) => f.ref === l), d = i.map((f) => f.textValue), c = ll(d, o.value, u?.textValue), p = i.find((f) => f.textValue === c);
        return p && p.ref.focus(), p?.ref;
      }
    },
    resetTypeahead: () => {
      o.value = "";
    }
  };
}
function sl(e, o) {
  return e.map((t, n) => e[(o + n) % e.length]);
}
function ll(e, o, t) {
  const a = o.length > 1 && Array.from(o).every((d) => d === o[0]) ? o[0] : o, s = t ? e.indexOf(t) : -1;
  let l = sl(e, Math.max(s, 0));
  a.length === 1 && (l = l.filter((d) => d !== t));
  const u = l.find((d) => d.toLowerCase().startsWith(a.toLowerCase()));
  return u !== t ? u : void 0;
}
function il(e, o) {
  const t = T({}), n = T("none"), a = T(e), s = e.value ? "mounted" : "unmounted";
  let l;
  const i = o.value?.ownerDocument.defaultView ?? ho, { state: u, dispatch: d } = rl(s, {
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
    if (Fe) {
      const P = new CustomEvent(S, {
        bubbles: !1,
        cancelable: !1
      });
      o.value?.dispatchEvent(P);
    }
  };
  re(e, async (S, P) => {
    const B = P !== S;
    if (await de(), B) {
      const q = n.value, x = oo(o.value);
      S ? (d("MOUNT"), c("enter"), x === "none" && c("after-enter")) : x === "none" || x === "undefined" || t.value?.display === "none" ? (d("UNMOUNT"), c("leave"), c("after-leave")) : P && q !== x ? (d("ANIMATION_OUT"), c("leave")) : (d("UNMOUNT"), c("after-leave"));
    }
  }, { immediate: !0 });
  const p = (S) => {
    const P = oo(o.value), B = P.includes(CSS.escape(S.animationName)), q = u.value === "mounted" ? "enter" : "leave";
    if (S.target === o.value && B && (c(`after-${q}`), d("ANIMATION_END"), !a.value)) {
      const x = o.value.style.animationFillMode;
      o.value.style.animationFillMode = "forwards", l = i?.setTimeout(() => {
        o.value?.style.animationFillMode === "forwards" && (o.value.style.animationFillMode = x);
      });
    }
    S.target === o.value && P === "none" && d("ANIMATION_END");
  }, f = (S) => {
    S.target === o.value && (n.value = oo(o.value));
  }, v = re(o, (S, P) => {
    S ? (t.value = getComputedStyle(S), S.addEventListener("animationstart", f), S.addEventListener("animationcancel", p), S.addEventListener("animationend", p)) : (d("ANIMATION_END"), l !== void 0 && i?.clearTimeout(l), P?.removeEventListener("animationstart", f), P?.removeEventListener("animationcancel", p), P?.removeEventListener("animationend", p));
  }, { immediate: !0 }), y = re(u, () => {
    const S = oo(o.value);
    n.value = u.value === "mounted" ? S : "none";
  });
  return rt(() => {
    v(), y();
  }), { isPresent: O(() => ["mounted", "unmountSuspended"].includes(u.value)) };
}
function oo(e) {
  return e && getComputedStyle(e).animationName || "none";
}
var De = h({
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
    const { present: n, forceMount: a } = se(e), s = T(), { isPresent: l } = il(n, s);
    t({ present: l });
    let i = o.default({ present: l.value });
    i = sn(i || []);
    const u = at();
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
    return () => a.value || n.value || l.value ? Ie(o.default({ present: l.value })[0], { ref: (d) => {
      const c = Ke(d);
      return typeof c?.hasAttribute > "u" || (c?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = c.firstElementChild : s.value = c), c;
    } }) : null;
  }
});
const so = h({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(e, { attrs: o, slots: t }) {
    return () => {
      if (!t.default) return null;
      const n = sn(t.default()), a = n.findIndex((u) => u.type !== Vr);
      if (a === -1) return n;
      const s = n[a];
      delete s.props?.ref;
      const l = s.props ? E(o, s.props) : o, i = Nr({
        ...s,
        props: {}
      }, l);
      return n.length === 1 ? i : (n[a] = i, n);
    };
  }
}), ul = [
  "area",
  "img",
  "input"
], z = h({
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
    return typeof n == "string" && ul.includes(n) ? () => Ie(n, o) : n !== "template" ? () => Ie(e.as, o, { default: t.default }) : () => Ie(so, o, { default: t.default });
  }
});
function jo() {
  const e = T(), o = O(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : Ke(e));
  return {
    primitiveElement: e,
    currentElement: o
  };
}
const [Ia, dl] = ee("CollapsibleRoot");
var cl = /* @__PURE__ */ h({
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
    const n = e, s = fe(n, "open", t, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), { disabled: l, unmountOnHide: i } = se(n);
    return dl({
      contentId: "",
      disabled: l,
      open: s,
      unmountOnHide: i,
      onOpenToggle: () => {
        l.value || (s.value = !s.value);
      }
    }), o({ open: s }), V(), (u, d) => (m(), _(r(z), {
      as: u.as,
      "as-child": n.asChild,
      "data-state": r(s) ? "open" : "closed",
      "data-disabled": r(l) ? "" : void 0
    }, {
      default: g(() => [b(u.$slots, "default", { open: r(s) })]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state",
      "data-disabled"
    ]));
  }
}), pl = cl, fl = /* @__PURE__ */ h({
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
    const t = e, n = o, a = Ia();
    a.contentId ||= _e(void 0, "reka-collapsible-content");
    const s = T(), { forwardRef: l, currentElement: i } = V(), u = T(0), d = T(0), c = O(() => a.open.value), p = T(c.value), f = T();
    re(() => [c.value, s.value?.present], async () => {
      await de();
      const y = i.value;
      if (!y) return;
      f.value = f.value || {
        transitionDuration: y.style.transitionDuration,
        animationName: y.style.animationName
      }, y.style.transitionDuration = "0s", y.style.animationName = "none";
      const w = y.getBoundingClientRect();
      d.value = w.height, u.value = w.width, p.value || (y.style.transitionDuration = f.value.transitionDuration, y.style.animationName = f.value.animationName);
    }, { immediate: !0 });
    const v = O(() => p.value && a.open.value);
    return pe(() => {
      requestAnimationFrame(() => {
        p.value = !1;
      });
    }), Ge(i, "beforematch", (y) => {
      requestAnimationFrame(() => {
        a.onOpenToggle(), n("contentFound");
      });
    }), (y, w) => (m(), _(r(De), {
      ref_key: "presentRef",
      ref: s,
      present: y.forceMount || r(a).open.value,
      "force-mount": !0
    }, {
      default: g(({ present: S }) => [M(r(z), E(y.$attrs, {
        id: r(a).contentId,
        ref: r(l),
        "as-child": t.asChild,
        as: y.as,
        hidden: S ? void 0 : r(a).unmountOnHide.value ? "" : "until-found",
        "data-state": v.value ? void 0 : r(a).open.value ? "open" : "closed",
        "data-disabled": r(a).disabled?.value ? "" : void 0,
        style: {
          "--reka-collapsible-content-height": `${d.value}px`,
          "--reka-collapsible-content-width": `${u.value}px`
        }
      }), {
        default: g(() => [!r(a).unmountOnHide.value || S ? b(y.$slots, "default", { key: 0 }) : ce("v-if", !0)]),
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
}), vl = fl, ml = /* @__PURE__ */ h({
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
    const t = Ia();
    return (n, a) => (m(), _(r(z), {
      type: n.as === "button" ? "button" : void 0,
      as: n.as,
      "as-child": o.asChild,
      "aria-controls": r(t).contentId,
      "aria-expanded": r(t).open.value,
      "data-state": r(t).open.value ? "open" : "closed",
      "data-disabled": r(t).disabled?.value ? "" : void 0,
      disabled: r(t).disabled?.value,
      onClick: r(t).onOpenToggle
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
}), gl = ml;
function yl({ type: e, defaultValue: o, modelValue: t }) {
  const n = t || o;
  return t !== void 0 || o !== void 0 ? Array.isArray(n) ? "multiple" : "single" : e ?? "single";
}
function hl({ type: e, defaultValue: o, modelValue: t }) {
  return e || yl({
    type: e,
    defaultValue: o,
    modelValue: t
  });
}
function bl({ type: e, defaultValue: o }) {
  return o !== void 0 ? o : e === "single" ? void 0 : [];
}
function _l(e, o) {
  const t = O(() => hl(e)), n = fe(e, "modelValue", o, {
    defaultValue: bl(e),
    passive: e.modelValue === void 0,
    deep: !0
  });
  function a(l) {
    if (t.value === "single") n.value = ut(l, n.value) ? void 0 : l;
    else {
      const i = Array.isArray(n.value) ? [...n.value || []] : [n.value].filter(Boolean);
      if (Ko(i, l)) {
        const u = i.findIndex((d) => ut(d, l));
        i.splice(u, 1);
      } else i.push(l);
      n.value = i;
    }
  }
  const s = O(() => t.value === "single");
  return {
    modelValue: n,
    changeModelValue: a,
    isSingle: s
  };
}
const [wo, wl] = ee("AccordionRoot");
var Cl = /* @__PURE__ */ h({
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
    const t = e, n = o, { dir: a, disabled: s, unmountOnHide: l } = se(t), i = st(a), { modelValue: u, changeModelValue: d, isSingle: c } = _l(t, n), { forwardRef: p, currentElement: f } = V();
    return wl({
      disabled: s,
      direction: i,
      orientation: t.orientation,
      parentElement: f,
      isSingle: c,
      collapsible: t.collapsible,
      modelValue: u,
      changeModelValue: d,
      unmountOnHide: l
    }), (v, y) => (m(), _(r(z), {
      ref: r(p),
      "as-child": v.asChild,
      as: v.as
    }, {
      default: g(() => [b(v.$slots, "default", { modelValue: r(u) })]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), Sl = Cl, Wo = /* @__PURE__ */ (function(e) {
  return e.Open = "open", e.Closed = "closed", e;
})(Wo || {});
const [cn, xl] = ee("AccordionItem");
var ql = /* @__PURE__ */ h({
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
    const t = e, n = wo(), a = O(() => n.isSingle.value ? t.value === n.modelValue.value : Array.isArray(n.modelValue.value) && n.modelValue.value.includes(t.value)), s = O(() => n.disabled.value || t.disabled), l = O(() => s.value ? "" : void 0), i = O(() => a.value ? Wo.Open : Wo.Closed);
    o({
      open: a,
      dataDisabled: l
    });
    const { currentRef: u, currentElement: d } = V();
    xl({
      open: a,
      dataState: i,
      disabled: s,
      dataDisabled: l,
      triggerId: "",
      currentRef: u,
      currentElement: d,
      value: O(() => t.value)
    });
    function c(p) {
      const f = p.target;
      if (Array.from(n.parentElement.value?.querySelectorAll("[data-reka-collection-item]") ?? []).findIndex((w) => w === f) === -1) return null;
      Pa(p, f, n.parentElement.value, {
        arrowKeyOptions: n.orientation,
        dir: n.direction.value,
        focus: !0
      });
    }
    return (p, f) => (m(), _(r(pl), {
      "data-orientation": r(n).orientation,
      "data-disabled": l.value,
      "data-state": i.value,
      disabled: s.value,
      open: a.value,
      as: t.as,
      "as-child": t.asChild,
      "unmount-on-hide": t.unmountOnHide ?? r(n).unmountOnHide.value,
      onKeydown: Tt(c, [
        "up",
        "down",
        "left",
        "right",
        "home",
        "end"
      ])
    }, {
      default: g(() => [b(p.$slots, "default", { open: a.value })]),
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
}), Bl = ql, Pl = /* @__PURE__ */ h({
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
    const o = e, t = wo(), n = cn();
    return V(), (a, s) => (m(), _(r(vl), {
      role: "region",
      "as-child": o.asChild,
      as: a.as,
      "force-mount": o.forceMount,
      "aria-labelledby": r(n).triggerId,
      "data-state": r(n).dataState.value,
      "data-disabled": r(n).dataDisabled.value,
      "data-orientation": r(t).orientation,
      style: {
        "--reka-accordion-content-width": "var(--reka-collapsible-content-width)",
        "--reka-accordion-content-height": "var(--reka-collapsible-content-height)"
      },
      onContentFound: s[0] || (s[0] = (l) => r(t).changeModelValue(r(n).value.value))
    }, {
      default: g(() => [b(a.$slots, "default")]),
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
}), Ol = Pl, Tl = /* @__PURE__ */ h({
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
    const o = e, t = wo(), n = cn();
    return V(), (a, s) => (m(), _(r(z), {
      as: o.as,
      "as-child": o.asChild,
      "data-orientation": r(t).orientation,
      "data-state": r(n).dataState.value,
      "data-disabled": r(n).dataDisabled.value
    }, {
      default: g(() => [b(a.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-orientation",
      "data-state",
      "data-disabled"
    ]));
  }
}), Al = Tl, Dl = /* @__PURE__ */ h({
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
    const o = e, t = wo(), n = cn();
    n.triggerId ||= _e(void 0, "reka-accordion-trigger");
    function a() {
      const s = t.isSingle.value && n.open.value && !t.collapsible;
      n.disabled.value || s || t.changeModelValue(n.value.value);
    }
    return (s, l) => (m(), _(r(gl), {
      id: r(n).triggerId,
      ref: r(n).currentRef,
      "data-reka-collection-item": "",
      as: o.as,
      "as-child": o.asChild,
      "aria-disabled": r(n).disabled.value || void 0,
      "aria-expanded": r(n).open.value || !1,
      "data-disabled": r(n).dataDisabled.value,
      "data-orientation": r(t).orientation,
      "data-state": r(n).dataState.value,
      disabled: r(n).disabled.value,
      onClick: a
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
}), El = Dl;
const [je, kl] = ee("DialogRoot");
var $l = /* @__PURE__ */ h({
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
    const t = e, a = fe(t, "open", o, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = T(), l = T(), { modal: i } = se(t);
    return kl({
      open: a,
      modal: i,
      openModal: () => {
        a.value = !0;
      },
      onOpenChange: (u) => {
        a.value = u;
      },
      onOpenToggle: () => {
        a.value = !a.value;
      },
      contentId: "",
      titleId: "",
      descriptionId: "",
      triggerElement: s,
      contentElement: l
    }), (u, d) => b(u.$slots, "default", {
      open: r(a),
      close: () => a.value = !1
    });
  }
}), Ma = $l, Il = /* @__PURE__ */ h({
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
    const t = je();
    return (n, a) => (m(), _(r(z), E(o, {
      type: n.as === "button" ? "button" : void 0,
      onClick: a[0] || (a[0] = (s) => r(t).onOpenChange(!1))
    }), {
      default: g(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), jt = Il;
const Ml = "dismissableLayer.pointerDownOutside", Rl = "dismissableLayer.focusOutside";
function Ra(e, o) {
  const t = o.closest("[data-dismissable-layer]"), n = e.dataset.dismissableLayer === "" ? e : e.querySelector("[data-dismissable-layer]"), a = Array.from(e.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (n === t || a.indexOf(n) < a.indexOf(t)));
}
function Fl(e, o, t = !0) {
  const n = o?.value?.ownerDocument ?? globalThis?.document, a = T(!1), s = T(() => {
  });
  return ae((l) => {
    if (!Fe || !ye(t)) return;
    const i = async (d) => {
      const c = d.target;
      if (!(!o?.value || !c)) {
        if (Ra(o.value, c)) {
          a.value = !1;
          return;
        }
        if (d.target && !a.value) {
          let f = function() {
            mo(Ml, e, p);
          };
          const p = { originalEvent: d };
          d.pointerType === "touch" ? (n.removeEventListener("click", s.value), s.value = f, n.addEventListener("click", s.value, { once: !0 })) : f();
        } else n.removeEventListener("click", s.value);
        a.value = !1;
      }
    }, u = window.setTimeout(() => {
      n.addEventListener("pointerdown", i);
    }, 0);
    l(() => {
      window.clearTimeout(u), n.removeEventListener("pointerdown", i), n.removeEventListener("click", s.value);
    });
  }), { onPointerDownCapture: () => {
    ye(t) && (a.value = !0);
  } };
}
function Vl(e, o, t = !0) {
  const n = o?.value?.ownerDocument ?? globalThis?.document, a = T(!1);
  return ae((s) => {
    if (!Fe || !ye(t)) return;
    const l = async (i) => {
      if (!o?.value) return;
      await de(), await de();
      const u = i.target;
      !o.value || !u || Ra(o.value, u) || i.target && !a.value && mo(Rl, e, { originalEvent: i });
    };
    n.addEventListener("focusin", l), s(() => n.removeEventListener("focusin", l));
  }), {
    onFocusCapture: () => {
      ye(t) && (a.value = !0);
    },
    onBlurCapture: () => {
      ye(t) && (a.value = !1);
    }
  };
}
const Te = qt({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var Nl = /* @__PURE__ */ h({
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
    const t = e, n = o, { forwardRef: a, currentElement: s } = V(), l = O(() => s.value?.ownerDocument ?? globalThis.document), i = O(() => Te.layersRoot), u = O(() => s.value ? Array.from(i.value).indexOf(s.value) : -1), d = O(() => Te.layersWithOutsidePointerEventsDisabled.size > 0), c = O(() => {
      const v = Array.from(i.value), [y] = [...Te.layersWithOutsidePointerEventsDisabled].slice(-1), w = v.indexOf(y);
      return u.value >= w;
    }), p = Fl(async (v) => {
      const y = [...Te.branches].some((w) => w?.contains(v.target));
      !c.value || y || (n("pointerDownOutside", v), n("interactOutside", v), await de(), v.defaultPrevented || n("dismiss"));
    }, s), f = Vl((v) => {
      [...Te.branches].some((w) => w?.contains(v.target)) || (n("focusOutside", v), n("interactOutside", v), v.defaultPrevented || n("dismiss"));
    }, s);
    return Ns("Escape", (v) => {
      u.value === i.value.size - 1 && (n("escapeKeyDown", v), v.defaultPrevented || n("dismiss"));
    }), ae((v) => {
      s.value && (t.disableOutsidePointerEvents && (Te.layersWithOutsidePointerEventsDisabled.size === 0 && (Te.originalBodyPointerEvents = l.value.body.style.pointerEvents, l.value.body.style.pointerEvents = "none"), Te.layersWithOutsidePointerEventsDisabled.add(s.value)), i.value.add(s.value), v(() => {
        t.disableOutsidePointerEvents && Te.layersWithOutsidePointerEventsDisabled.size === 1 && !tt(Te.originalBodyPointerEvents) && (l.value.body.style.pointerEvents = Te.originalBodyPointerEvents);
      }));
    }), ae((v) => {
      v(() => {
        s.value && (i.value.delete(s.value), Te.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (v, y) => (m(), _(r(z), {
      ref: r(a),
      "as-child": v.asChild,
      as: v.as,
      "data-dismissable-layer": "",
      style: Ae({ pointerEvents: d.value ? c.value ? "auto" : "none" : void 0 }),
      onFocusCapture: r(f).onFocusCapture,
      onBlurCapture: r(f).onBlurCapture,
      onPointerdownCapture: r(p).onPointerDownCapture
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
}), Wt = Nl;
const Ll = Os(() => T([]));
function zl() {
  const e = Ll();
  return {
    add(o) {
      const t = e.value[0];
      o !== t && t?.pause(), e.value = jn(e.value, o), e.value.unshift(o);
    },
    remove(o) {
      e.value = jn(e.value, o), e.value[0]?.resume();
    }
  };
}
function jn(e, o) {
  const t = [...e], n = t.indexOf(o);
  return n !== -1 && t.splice(n, 1), t;
}
function Kl(e) {
  return e.filter((o) => o.tagName !== "A");
}
const Vo = "focusScope.autoFocusOnMount", No = "focusScope.autoFocusOnUnmount", Wn = {
  bubbles: !1,
  cancelable: !0
};
function Hl(e, { select: o = !1 } = {}) {
  const t = Ce();
  for (const n of e)
    if (et(n, { select: o }), Ce() !== t) return !0;
}
function jl(e) {
  const o = Fa(e), t = Un(o, e), n = Un(o.reverse(), e);
  return [t, n];
}
function Fa(e) {
  const o = [], t = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, { acceptNode: (n) => {
    const a = n.tagName === "INPUT" && n.type === "hidden";
    return n.disabled || n.hidden || a ? NodeFilter.FILTER_SKIP : n.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) o.push(t.currentNode);
  return o;
}
function Un(e, o) {
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
function et(e, { select: o = !1 } = {}) {
  if (e && e.focus) {
    const t = Ce();
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
    const t = e, n = o, { currentRef: a, currentElement: s } = V(), l = T(null), i = zl(), u = qt({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    ae((c) => {
      if (!Fe) return;
      const p = s.value;
      if (!t.trapped) return;
      function f(S) {
        if (u.paused || !p) return;
        const P = S.target;
        p.contains(P) ? l.value = P : et(l.value, { select: !0 });
      }
      function v(S) {
        if (u.paused || !p) return;
        const P = S.relatedTarget;
        P !== null && (p.contains(P) || et(l.value, { select: !0 }));
      }
      function y(S) {
        p.contains(l.value) || et(p);
      }
      document.addEventListener("focusin", f), document.addEventListener("focusout", v);
      const w = new MutationObserver(y);
      p && w.observe(p, {
        childList: !0,
        subtree: !0
      }), c(() => {
        document.removeEventListener("focusin", f), document.removeEventListener("focusout", v), w.disconnect();
      });
    }), ae(async (c) => {
      const p = s.value;
      if (await de(), !p) return;
      i.add(u);
      const f = Ce();
      if (!p.contains(f)) {
        const y = new CustomEvent(Vo, Wn);
        p.addEventListener(Vo, (w) => n("mountAutoFocus", w)), p.dispatchEvent(y), y.defaultPrevented || (Hl(Kl(Fa(p)), { select: !0 }), Ce() === f && et(p));
      }
      c(() => {
        p.removeEventListener(Vo, (S) => n("mountAutoFocus", S));
        const y = new CustomEvent(No, Wn), w = (S) => {
          n("unmountAutoFocus", S);
        };
        p.addEventListener(No, w), p.dispatchEvent(y), setTimeout(() => {
          y.defaultPrevented || et(f ?? document.body, { select: !0 }), p.removeEventListener(No, w), i.remove(u);
        }, 0);
      });
    });
    function d(c) {
      if (!t.loop && !t.trapped || u.paused) return;
      const p = c.key === "Tab" && !c.altKey && !c.ctrlKey && !c.metaKey, f = Ce();
      if (p && f) {
        const v = c.currentTarget, [y, w] = jl(v);
        y && w ? !c.shiftKey && f === w ? (c.preventDefault(), t.loop && et(y, { select: !0 })) : c.shiftKey && f === y && (c.preventDefault(), t.loop && et(w, { select: !0 })) : f === v && c.preventDefault();
      }
    }
    return (c, p) => (m(), _(r(z), {
      ref_key: "currentRef",
      ref: a,
      tabindex: "-1",
      "as-child": c.asChild,
      as: c.as,
      onKeydown: d
    }, {
      default: g(() => [b(c.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), Co = Gl;
const Yl = "menu.itemSelect", Uo = ["Enter", " "], Xl = [
  "ArrowDown",
  "PageUp",
  "Home"
], Va = [
  "ArrowUp",
  "PageDown",
  "End"
], Jl = [...Xl, ...Va], Zl = {
  ltr: [...Uo, "ArrowRight"],
  rtl: [...Uo, "ArrowLeft"]
}, Ql = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"]
};
function pn(e) {
  return e ? "open" : "closed";
}
function lo(e) {
  return e === "indeterminate";
}
function fn(e) {
  return lo(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
function Go(e) {
  const o = Ce();
  for (const t of e)
    if (t === o || (t.focus(), Ce() !== o)) return;
}
function ei(e, o) {
  const { x: t, y: n } = e;
  let a = !1;
  for (let s = 0, l = o.length - 1; s < o.length; l = s++) {
    const i = o[s].x, u = o[s].y, d = o[l].x, c = o[l].y;
    u > n != c > n && t < (d - i) * (n - u) / (c - u) + i && (a = !a);
  }
  return a;
}
function ti(e, o) {
  if (!o) return !1;
  const t = {
    x: e.clientX,
    y: e.clientY
  };
  return ei(t, o);
}
function Vt(e) {
  return e.pointerType === "mouse";
}
const oi = "DialogTitle", ni = "DialogContent";
function ai({ titleName: e = oi, contentName: o = ni, componentLink: t = "dialog.html#title", titleId: n, descriptionId: a, contentElement: s }) {
  const l = `Warning: \`${o}\` requires a \`${e}\` for the component to be accessible for screen reader users.

If you want to hide the \`${e}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, i = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${o}.`;
  pe(() => {
    document.getElementById(n) || console.warn(l);
    const d = s.value?.getAttribute("aria-describedby");
    a && d && (document.getElementById(a) || console.warn(i));
  });
}
var ri = /* @__PURE__ */ h({
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
    const t = e, n = o, a = je(), { forwardRef: s, currentElement: l } = V();
    return a.titleId ||= _e(void 0, "reka-dialog-title"), a.descriptionId ||= _e(void 0, "reka-dialog-description"), pe(() => {
      a.contentElement = l, Ce() !== document.body && (a.triggerElement.value = Ce());
    }), process.env.NODE_ENV !== "production" && ai({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: a.titleId,
      descriptionId: a.descriptionId,
      contentElement: l
    }), (i, u) => (m(), _(r(Co), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: u[5] || (u[5] = (d) => n("openAutoFocus", d)),
      onUnmountAutoFocus: u[6] || (u[6] = (d) => n("closeAutoFocus", d))
    }, {
      default: g(() => [M(r(Wt), E({
        id: r(a).contentId,
        ref: r(s),
        as: i.as,
        "as-child": i.asChild,
        "disable-outside-pointer-events": i.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": r(a).descriptionId,
        "aria-labelledby": r(a).titleId,
        "data-state": r(pn)(r(a).open.value)
      }, i.$attrs, {
        onDismiss: u[0] || (u[0] = (d) => r(a).onOpenChange(!1)),
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
}), Na = ri, si = /* @__PURE__ */ h({
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
    const t = e, n = o, a = je(), s = pt(n), { forwardRef: l, currentElement: i } = V();
    return _o(i), (u, d) => (m(), _(Na, E({
      ...t,
      ...r(s)
    }, {
      ref: r(l),
      "trap-focus": r(a).open.value,
      "disable-outside-pointer-events": !0,
      onCloseAutoFocus: d[0] || (d[0] = (c) => {
        c.defaultPrevented || (c.preventDefault(), r(a).triggerElement.value?.focus());
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
    }, 16, ["trap-focus"]));
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
    const t = e, a = pt(o);
    V();
    const s = je(), l = T(!1), i = T(!1);
    return (u, d) => (m(), _(Na, E({
      ...t,
      ...r(a)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: d[0] || (d[0] = (c) => {
        c.defaultPrevented || (l.value || r(s).triggerElement.value?.focus(), c.preventDefault()), l.value = !1, i.value = !1;
      }),
      onInteractOutside: d[1] || (d[1] = (c) => {
        c.defaultPrevented || (l.value = !0, c.detail.originalEvent.type === "pointerdown" && (i.value = !0));
        const p = c.target;
        r(s).triggerElement.value?.contains(p) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && i.value && c.preventDefault();
      })
    }), {
      default: g(() => [b(u.$slots, "default")]),
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
    const t = e, n = o, a = je(), s = pt(n), { forwardRef: l } = V();
    return (i, u) => (m(), _(r(De), { present: i.forceMount || r(a).open.value }, {
      default: g(() => [r(a).modal.value ? (m(), _(li, E({
        key: 0,
        ref: r(l)
      }, {
        ...t,
        ...r(s),
        ...i.$attrs
      }), {
        default: g(() => [b(i.$slots, "default")]),
        _: 3
      }, 16)) : (m(), _(ui, E({
        key: 1,
        ref: r(l)
      }, {
        ...t,
        ...r(s),
        ...i.$attrs
      }), {
        default: g(() => [b(i.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), vn = di, ci = /* @__PURE__ */ h({
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
    const t = je();
    return (n, a) => (m(), _(r(z), E(o, { id: r(t).descriptionId }), {
      default: g(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), La = ci, pi = /* @__PURE__ */ h({
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
    const o = je();
    return bo(!0), V(), (t, n) => (m(), _(r(z), {
      as: t.as,
      "as-child": t.asChild,
      "data-state": r(o).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: g(() => [b(t.$slots, "default")]),
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
    const o = je(), { forwardRef: t } = V();
    return (n, a) => r(o)?.modal.value ? (m(), _(r(De), {
      key: 0,
      present: n.forceMount || r(o).open.value
    }, {
      default: g(() => [M(fi, E(n.$attrs, {
        ref: r(t),
        as: n.as,
        "as-child": n.asChild
      }), {
        default: g(() => [b(n.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : ce("v-if", !0);
  }
}), mn = vi, mi = /* @__PURE__ */ h({
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
    const o = ln();
    return (t, n) => r(o) || t.forceMount ? (m(), _(ga, {
      key: 0,
      to: t.to,
      disabled: t.disabled,
      defer: t.defer
    }, [b(t.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : ce("v-if", !0);
  }
}), Ut = mi, gi = /* @__PURE__ */ h({
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
    return (t, n) => (m(), _(r(Ut), W(Y(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), gn = gi, yi = /* @__PURE__ */ h({
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
    const o = e, t = je();
    return V(), (n, a) => (m(), _(r(z), E(o, { id: r(t).titleId }), {
      default: g(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), za = yi, hi = /* @__PURE__ */ h({
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
    const o = e, t = je(), { forwardRef: n, currentElement: a } = V();
    return t.contentId ||= _e(void 0, "reka-dialog-content"), pe(() => {
      t.triggerElement.value = a.value;
    }), (s, l) => (m(), _(r(z), E(o, {
      ref: r(n),
      type: s.as === "button" ? "button" : void 0,
      "aria-haspopup": "dialog",
      "aria-expanded": r(t).open.value || !1,
      "aria-controls": r(t).open.value ? r(t).contentId : void 0,
      "data-state": r(t).open.value ? "open" : "closed",
      onClick: r(t).onOpenToggle
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
}), Ka = hi;
const [Ha, bi] = ee("AvatarRoot");
var _i = /* @__PURE__ */ h({
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
    return V(), bi({ imageLoadingStatus: T("idle") }), (o, t) => (m(), _(r(z), {
      "as-child": o.asChild,
      as: o.as
    }, {
      default: g(() => [b(o.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), wi = _i, Ci = /* @__PURE__ */ h({
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
    const o = e, t = Ha();
    V();
    const n = T(o.delayMs === void 0);
    return ae((a) => {
      if (o.delayMs && Fe) {
        const s = window.setTimeout(() => {
          n.value = !0;
        }, o.delayMs);
        a(() => {
          window.clearTimeout(s);
        });
      }
    }), (a, s) => n.value && r(t).imageLoadingStatus.value !== "loaded" ? (m(), _(r(z), {
      key: 0,
      "as-child": a.asChild,
      as: a.as
    }, {
      default: g(() => [b(a.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"])) : ce("v-if", !0);
  }
}), Si = Ci;
function Gn(e, o) {
  return e ? o ? (e.src !== o && (e.src = o), e.complete && e.naturalWidth > 0 ? "loaded" : "loading") : "error" : "idle";
}
function xi(e, { referrerPolicy: o, crossOrigin: t } = {}) {
  const n = T(!1), a = T(null), s = O(() => n.value ? (!a.value && Fe && (a.value = new window.Image()), a.value) : null), l = T(Gn(s.value, e.value)), i = (u) => () => {
    n.value && (l.value = u);
  };
  return pe(() => {
    n.value = !0, ae((u) => {
      const d = s.value;
      if (!d) return;
      l.value = Gn(d, e.value);
      const c = i("loaded"), p = i("error");
      d.addEventListener("load", c), d.addEventListener("error", p), o?.value && (d.referrerPolicy = o.value), typeof t?.value == "string" && (d.crossOrigin = t.value), u(() => {
        d.removeEventListener("load", c), d.removeEventListener("error", p);
      });
    });
  }), rt(() => {
    n.value = !1;
  }), l;
}
var qi = /* @__PURE__ */ h({
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
    const t = e, n = o, { src: a, referrerPolicy: s, crossOrigin: l } = se(t);
    V();
    const i = Ha(), u = xi(a, {
      referrerPolicy: s,
      crossOrigin: l
    });
    return re(u, (d) => {
      n("loadingStatusChange", d), d !== "idle" && (i.imageLoadingStatus.value = d);
    }, { immediate: !0 }), (d, c) => an((m(), _(r(z), {
      role: "img",
      "as-child": d.asChild,
      as: d.as,
      src: r(a),
      "referrer-policy": r(s)
    }, {
      default: g(() => [b(d.$slots, "default")]),
      _: 3
    }, 8, [
      "as-child",
      "as",
      "src",
      "referrer-policy"
    ])), [[Lr, r(u) === "loaded"]]);
  }
}), Bi = qi;
const Yn = "data-reka-collection-item";
function Ee(e = {}) {
  const { key: o = "", isProvider: t = !1 } = e, n = `${o}CollectionProvider`;
  let a;
  if (t) {
    const c = T(/* @__PURE__ */ new Map());
    a = {
      collectionRef: T(),
      itemMap: c
    }, on(n, a);
  } else a = Ft(n);
  const s = (c = !1) => {
    const p = a.collectionRef.value;
    if (!p) return [];
    const f = Array.from(p.querySelectorAll(`[${Yn}]`)), y = Array.from(a.itemMap.value.values()).sort((w, S) => f.indexOf(w.ref) - f.indexOf(S.ref));
    return c ? y : y.filter((w) => w.ref.dataset.disabled !== "");
  }, l = h({
    name: "CollectionSlot",
    setup(c, { slots: p }) {
      const { primitiveElement: f, currentElement: v } = jo();
      return re(v, () => {
        a.collectionRef.value = v.value;
      }), () => Ie(so, { ref: f }, p);
    }
  }), i = h({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(c, { slots: p, attrs: f }) {
      const { primitiveElement: v, currentElement: y } = jo();
      return ae((w) => {
        if (y.value) {
          const S = zr(y.value);
          a.itemMap.value.set(S, {
            ref: y.value,
            value: c.value
          }), w(() => a.itemMap.value.delete(S));
        }
      }), () => Ie(so, {
        ...f,
        [Yn]: "",
        ref: v
      }, p);
    }
  }), u = O(() => Array.from(a.itemMap.value.values())), d = O(() => a.itemMap.value.size);
  return {
    getItems: s,
    reactiveItems: u,
    itemMapSize: d,
    CollectionSlot: l,
    CollectionItem: i
  };
}
const Pi = "rovingFocusGroup.onEntryFocus", Oi = {
  bubbles: !1,
  cancelable: !0
}, Ti = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Ai(e, o) {
  return o !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e;
}
function Di(e, o, t) {
  const n = Ai(e.key, t);
  if (!(o === "vertical" && ["ArrowLeft", "ArrowRight"].includes(n)) && !(o === "horizontal" && ["ArrowUp", "ArrowDown"].includes(n)))
    return Ti[n];
}
function ja(e, o = !1) {
  const t = Ce();
  for (const n of e)
    if (n === t || (n.focus({ preventScroll: o }), Ce() !== t)) return;
}
function Ei(e, o) {
  return e.map((t, n) => e[(o + n) % e.length]);
}
const [ki, $i] = ee("RovingFocusGroup");
var Ii = /* @__PURE__ */ h({
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
    const n = e, a = t, { loop: s, orientation: l, dir: i } = se(n), u = st(i), d = fe(n, "currentTabStopId", a, {
      defaultValue: n.defaultCurrentTabStopId,
      passive: n.currentTabStopId === void 0
    }), c = T(!1), p = T(!1), f = T(0), { getItems: v, CollectionSlot: y } = Ee({ isProvider: !0 });
    function w(P) {
      const B = !p.value;
      if (P.currentTarget && P.target === P.currentTarget && B && !c.value) {
        const q = new CustomEvent(Pi, Oi);
        if (P.currentTarget.dispatchEvent(q), a("entryFocus", q), !q.defaultPrevented) {
          const x = v().map((A) => A.ref).filter((A) => A.dataset.disabled !== ""), k = x.find((A) => A.getAttribute("data-active") === ""), R = x.find((A) => A.getAttribute("data-highlighted") === ""), F = x.find((A) => A.id === d.value), L = [
            k,
            R,
            F,
            ...x
          ].filter(Boolean);
          ja(L, n.preventScrollOnEntryFocus);
        }
      }
      p.value = !1;
    }
    function S() {
      setTimeout(() => {
        p.value = !1;
      }, 1);
    }
    return o({ getItems: v }), $i({
      loop: s,
      dir: u,
      orientation: l,
      currentTabStopId: d,
      onItemFocus: (P) => {
        d.value = P;
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
    }), (P, B) => (m(), _(r(y), null, {
      default: g(() => [M(r(z), {
        tabindex: c.value || f.value === 0 ? -1 : 0,
        "data-orientation": r(l),
        as: P.as,
        "as-child": P.asChild,
        dir: r(u),
        style: { outline: "none" },
        onMousedown: B[0] || (B[0] = (q) => p.value = !0),
        onMouseup: S,
        onFocus: w,
        onBlur: B[1] || (B[1] = (q) => c.value = !1)
      }, {
        default: g(() => [b(P.$slots, "default")]),
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
}), yn = Ii, Mi = /* @__PURE__ */ h({
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
    const o = e, t = ki(), n = _e(), a = O(() => o.tabStopId || n), s = O(() => t.currentTabStopId.value === a.value), { getItems: l, CollectionItem: i } = Ee();
    pe(() => {
      o.focusable && t.onFocusableItemAdd();
    }), rt(() => {
      o.focusable && t.onFocusableItemRemove();
    });
    function u(d) {
      if (d.key === "Tab" && d.shiftKey) {
        t.onItemShiftTab();
        return;
      }
      if (d.target !== d.currentTarget) return;
      const c = Di(d, t.orientation.value, t.dir.value);
      if (c !== void 0) {
        if (d.metaKey || d.ctrlKey || d.altKey || !o.allowShiftKey && d.shiftKey) return;
        d.preventDefault();
        let p = [...l().map((f) => f.ref).filter((f) => f.dataset.disabled !== "")];
        if (c === "last") p.reverse();
        else if (c === "prev" || c === "next") {
          c === "prev" && p.reverse();
          const f = p.indexOf(d.currentTarget);
          p = t.loop.value ? Ei(p, f + 1) : p.slice(f + 1);
        }
        de(() => ja(p));
      }
    }
    return (d, c) => (m(), _(r(i), null, {
      default: g(() => [M(r(z), {
        tabindex: s.value ? 0 : -1,
        "data-orientation": r(t).orientation.value,
        "data-active": d.active ? "" : void 0,
        "data-disabled": d.focusable ? void 0 : "",
        as: d.as,
        "as-child": d.asChild,
        onMousedown: c[0] || (c[0] = (p) => {
          d.focusable ? r(t).onItemFocus(a.value) : p.preventDefault();
        }),
        onFocus: c[1] || (c[1] = (p) => r(t).onItemFocus(a.value)),
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
}), hn = Mi, Ri = /* @__PURE__ */ h({
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
    return (o, t) => (m(), _(r(z), {
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
}), bn = Ri, Fi = /* @__PURE__ */ h({
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
    const o = e, { primitiveElement: t, currentElement: n } = jo(), a = O(() => o.checked ?? o.value);
    return re(a, (s, l) => {
      if (!n.value) return;
      const i = n.value, u = window.HTMLInputElement.prototype, c = Object.getOwnPropertyDescriptor(u, "value").set;
      if (c && s !== l) {
        const p = new Event("input", { bubbles: !0 }), f = new Event("change", { bubbles: !0 });
        c.call(i, s), i.dispatchEvent(p), i.dispatchEvent(f);
      }
    }), (s, l) => (m(), _(bn, E({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...o,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), Xn = Fi, Vi = /* @__PURE__ */ h({
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
    const o = e, t = O(() => typeof o.value == "object" && Array.isArray(o.value) && o.value.length === 0 && o.required), n = O(() => typeof o.value == "string" || typeof o.value == "number" || typeof o.value == "boolean" || o.value === null || o.value === void 0 ? [{
      name: o.name,
      value: o.value
    }] : typeof o.value == "object" && Array.isArray(o.value) ? o.value.flatMap((a, s) => typeof a == "object" ? Object.entries(a).map(([l, i]) => ({
      name: `${o.name}[${s}][${l}]`,
      value: i
    })) : {
      name: `${o.name}[${s}]`,
      value: a
    }) : o.value !== null && typeof o.value == "object" && !Array.isArray(o.value) ? Object.entries(o.value).map(([a, s]) => ({
      name: `${o.name}[${a}]`,
      value: s
    })) : []);
    return (a, s) => (m(), K(xe, null, [ce(" We render single input if it's required "), t.value ? (m(), _(Xn, E({ key: a.name }, {
      ...o,
      ...a.$attrs
    }, {
      name: a.name,
      value: a.value
    }), null, 16, ["name", "value"])) : (m(!0), K(xe, { key: 1 }, Bt(n.value, (l) => (m(), _(Xn, E({ key: l.name }, { ref_for: !0 }, {
      ...o,
      ...a.$attrs
    }, {
      name: l.name,
      value: l.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), Gt = Vi;
const [Ni] = ee("CheckboxGroupRoot");
function io(e) {
  return e === "indeterminate";
}
function Wa(e) {
  return io(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
const [Li, zi] = ee("CheckboxRoot");
var Ki = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "CheckboxRoot",
  props: {
    defaultValue: {
      type: [Boolean, String],
      required: !1
    },
    modelValue: {
      type: [
        Boolean,
        String,
        null
      ],
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
    const t = e, n = o, { forwardRef: a, currentElement: s } = V(), l = Ni(null), i = fe(t, "modelValue", n, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    }), u = O(() => l?.disabled.value || t.disabled), d = O(() => tt(l?.modelValue.value) ? i.value === "indeterminate" ? "indeterminate" : i.value : Ko(l.modelValue.value, t.value));
    function c() {
      if (tt(l?.modelValue.value))
        i.value = io(i.value) ? !0 : !i.value;
      else {
        const v = [...l.modelValue.value || []];
        if (Ko(v, t.value)) {
          const y = v.findIndex((w) => ut(w, t.value));
          v.splice(y, 1);
        } else v.push(t.value);
        l.modelValue.value = v;
      }
    }
    const p = Dt(s), f = O(() => t.id && s.value ? document.querySelector(`[for="${t.id}"]`)?.innerText : void 0);
    return zi({
      disabled: u,
      state: d
    }), (v, y) => (m(), _($e(r(l)?.rovingFocus.value ? r(hn) : r(z)), E(v.$attrs, {
      id: v.id,
      ref: r(a),
      role: "checkbox",
      "as-child": v.asChild,
      as: v.as,
      type: v.as === "button" ? "button" : void 0,
      "aria-checked": r(io)(d.value) ? "mixed" : d.value,
      "aria-required": v.required,
      "aria-label": v.$attrs["aria-label"] || f.value,
      "data-state": r(Wa)(d.value),
      "data-disabled": u.value ? "" : void 0,
      disabled: u.value,
      focusable: r(l)?.rovingFocus.value ? !u.value : void 0,
      onKeydown: Tt(we(() => {
      }, ["prevent"]), ["enter"]),
      onClick: c
    }), {
      default: g(() => [b(v.$slots, "default", {
        modelValue: r(i),
        state: d.value
      }), r(p) && v.name && !r(l) ? (m(), _(r(Gt), {
        key: 0,
        type: "checkbox",
        checked: !!d.value,
        name: v.name,
        value: v.value,
        disabled: u.value,
        required: v.required
      }, null, 8, [
        "checked",
        "name",
        "value",
        "disabled",
        "required"
      ])) : ce("v-if", !0)]),
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
}), Hi = Ki, ji = /* @__PURE__ */ h({
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
    const { forwardRef: o } = V(), t = Li();
    return (n, a) => (m(), _(r(De), { present: n.forceMount || r(io)(r(t).state.value) || r(t).state.value === !0 }, {
      default: g(() => [M(r(z), E({
        ref: r(o),
        "data-state": r(Wa)(r(t).state.value),
        "data-disabled": r(t).disabled.value ? "" : void 0,
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
}), Wi = ji;
const [Ua, Ui] = ee("PopperRoot");
var Gi = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(e) {
    const o = T();
    return Ui({
      anchor: o,
      onAnchorChange: (t) => o.value = t
    }), (t, n) => b(t.$slots, "default");
  }
}), Yt = Gi, Yi = /* @__PURE__ */ h({
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
    const o = e, { forwardRef: t, currentElement: n } = V(), a = Ua();
    return ya(() => {
      a.onAnchorChange(o.reference ?? n.value);
    }), (s, l) => (m(), _(r(z), {
      ref: r(t),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: g(() => [b(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), So = Yi;
function Xi(e) {
  return e !== null;
}
function Ji(e) {
  return {
    name: "transformOrigin",
    options: e,
    fn(o) {
      const { placement: t, rects: n, middlewareData: a } = o, l = a.arrow?.centerOffset !== 0, i = l ? 0 : e.arrowWidth, u = l ? 0 : e.arrowHeight, [d, c] = Yo(t), p = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[c], f = (a.arrow?.x ?? 0) + i / 2, v = (a.arrow?.y ?? 0) + u / 2;
      let y = "", w = "";
      return d === "bottom" ? (y = l ? p : `${f}px`, w = `${-u}px`) : d === "top" ? (y = l ? p : `${f}px`, w = `${n.floating.height + u}px`) : d === "right" ? (y = `${-u}px`, w = l ? p : `${v}px`) : d === "left" && (y = `${n.floating.width + u}px`, w = l ? p : `${v}px`), { data: {
        x: y,
        y: w
      } };
    }
  };
}
function Yo(e) {
  const [o, t = "center"] = e.split("-");
  return [o, t];
}
const Zi = ["top", "right", "bottom", "left"], ot = Math.min, Be = Math.max, uo = Math.round, no = Math.floor, ze = (e) => ({
  x: e,
  y: e
}), Qi = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, eu = {
  start: "end",
  end: "start"
};
function Xo(e, o, t) {
  return Be(e, ot(o, t));
}
function Ye(e, o) {
  return typeof e == "function" ? e(o) : e;
}
function Xe(e) {
  return e.split("-")[0];
}
function Et(e) {
  return e.split("-")[1];
}
function _n(e) {
  return e === "x" ? "y" : "x";
}
function wn(e) {
  return e === "y" ? "height" : "width";
}
const tu = /* @__PURE__ */ new Set(["top", "bottom"]);
function Ne(e) {
  return tu.has(Xe(e)) ? "y" : "x";
}
function Cn(e) {
  return _n(Ne(e));
}
function ou(e, o, t) {
  t === void 0 && (t = !1);
  const n = Et(e), a = Cn(e), s = wn(a);
  let l = a === "x" ? n === (t ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return o.reference[s] > o.floating[s] && (l = co(l)), [l, co(l)];
}
function nu(e) {
  const o = co(e);
  return [Jo(e), o, Jo(o)];
}
function Jo(e) {
  return e.replace(/start|end/g, (o) => eu[o]);
}
const Jn = ["left", "right"], Zn = ["right", "left"], au = ["top", "bottom"], ru = ["bottom", "top"];
function su(e, o, t) {
  switch (e) {
    case "top":
    case "bottom":
      return t ? o ? Zn : Jn : o ? Jn : Zn;
    case "left":
    case "right":
      return o ? au : ru;
    default:
      return [];
  }
}
function lu(e, o, t, n) {
  const a = Et(e);
  let s = su(Xe(e), t === "start", n);
  return a && (s = s.map((l) => l + "-" + a), o && (s = s.concat(s.map(Jo)))), s;
}
function co(e) {
  return e.replace(/left|right|bottom|top/g, (o) => Qi[o]);
}
function iu(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function Ga(e) {
  return typeof e != "number" ? iu(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function po(e) {
  const {
    x: o,
    y: t,
    width: n,
    height: a
  } = e;
  return {
    width: n,
    height: a,
    top: t,
    left: o,
    right: o + n,
    bottom: t + a,
    x: o,
    y: t
  };
}
function Qn(e, o, t) {
  let {
    reference: n,
    floating: a
  } = e;
  const s = Ne(o), l = Cn(o), i = wn(l), u = Xe(o), d = s === "y", c = n.x + n.width / 2 - a.width / 2, p = n.y + n.height / 2 - a.height / 2, f = n[i] / 2 - a[i] / 2;
  let v;
  switch (u) {
    case "top":
      v = {
        x: c,
        y: n.y - a.height
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
        x: n.x - a.width,
        y: p
      };
      break;
    default:
      v = {
        x: n.x,
        y: n.y
      };
  }
  switch (Et(o)) {
    case "start":
      v[l] -= f * (t && d ? -1 : 1);
      break;
    case "end":
      v[l] += f * (t && d ? -1 : 1);
      break;
  }
  return v;
}
const uu = async (e, o, t) => {
  const {
    placement: n = "bottom",
    strategy: a = "absolute",
    middleware: s = [],
    platform: l
  } = t, i = s.filter(Boolean), u = await (l.isRTL == null ? void 0 : l.isRTL(o));
  let d = await l.getElementRects({
    reference: e,
    floating: o,
    strategy: a
  }), {
    x: c,
    y: p
  } = Qn(d, n, u), f = n, v = {}, y = 0;
  for (let w = 0; w < i.length; w++) {
    const {
      name: S,
      fn: P
    } = i[w], {
      x: B,
      y: q,
      data: x,
      reset: k
    } = await P({
      x: c,
      y: p,
      initialPlacement: n,
      placement: f,
      strategy: a,
      middlewareData: v,
      rects: d,
      platform: l,
      elements: {
        reference: e,
        floating: o
      }
    });
    c = B ?? c, p = q ?? p, v = {
      ...v,
      [S]: {
        ...v[S],
        ...x
      }
    }, k && y <= 50 && (y++, typeof k == "object" && (k.placement && (f = k.placement), k.rects && (d = k.rects === !0 ? await l.getElementRects({
      reference: e,
      floating: o,
      strategy: a
    }) : k.rects), {
      x: c,
      y: p
    } = Qn(d, f, u)), w = -1);
  }
  return {
    x: c,
    y: p,
    placement: f,
    strategy: a,
    middlewareData: v
  };
};
async function Nt(e, o) {
  var t;
  o === void 0 && (o = {});
  const {
    x: n,
    y: a,
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
  } = Ye(o, e), y = Ga(v), S = i[f ? p === "floating" ? "reference" : "floating" : p], P = po(await s.getClippingRect({
    element: (t = await (s.isElement == null ? void 0 : s.isElement(S))) == null || t ? S : S.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(i.floating)),
    boundary: d,
    rootBoundary: c,
    strategy: u
  })), B = p === "floating" ? {
    x: n,
    y: a,
    width: l.floating.width,
    height: l.floating.height
  } : l.reference, q = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(i.floating)), x = await (s.isElement == null ? void 0 : s.isElement(q)) ? await (s.getScale == null ? void 0 : s.getScale(q)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, k = po(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: i,
    rect: B,
    offsetParent: q,
    strategy: u
  }) : B);
  return {
    top: (P.top - k.top + y.top) / x.y,
    bottom: (k.bottom - P.bottom + y.bottom) / x.y,
    left: (P.left - k.left + y.left) / x.x,
    right: (k.right - P.right + y.right) / x.x
  };
}
const du = (e) => ({
  name: "arrow",
  options: e,
  async fn(o) {
    const {
      x: t,
      y: n,
      placement: a,
      rects: s,
      platform: l,
      elements: i,
      middlewareData: u
    } = o, {
      element: d,
      padding: c = 0
    } = Ye(e, o) || {};
    if (d == null)
      return {};
    const p = Ga(c), f = {
      x: t,
      y: n
    }, v = Cn(a), y = wn(v), w = await l.getDimensions(d), S = v === "y", P = S ? "top" : "left", B = S ? "bottom" : "right", q = S ? "clientHeight" : "clientWidth", x = s.reference[y] + s.reference[v] - f[v] - s.floating[y], k = f[v] - s.reference[v], R = await (l.getOffsetParent == null ? void 0 : l.getOffsetParent(d));
    let F = R ? R[q] : 0;
    (!F || !await (l.isElement == null ? void 0 : l.isElement(R))) && (F = i.floating[q] || s.floating[y]);
    const L = x / 2 - k / 2, A = F / 2 - w[y] / 2 - 1, C = ot(p[P], A), $ = ot(p[B], A), I = C, H = F - w[y] - $, j = F / 2 - w[y] / 2 + L, oe = Xo(I, j, H), J = !u.arrow && Et(a) != null && j !== oe && s.reference[y] / 2 - (j < I ? C : $) - w[y] / 2 < 0, te = J ? j < I ? j - I : j - H : 0;
    return {
      [v]: f[v] + te,
      data: {
        [v]: oe,
        centerOffset: j - oe - te,
        ...J && {
          alignmentOffset: te
        }
      },
      reset: J
    };
  }
}), cu = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(o) {
      var t, n;
      const {
        placement: a,
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
      } = Ye(e, o);
      if ((t = s.arrow) != null && t.alignmentOffset)
        return {};
      const P = Xe(a), B = Ne(i), q = Xe(i) === i, x = await (u.isRTL == null ? void 0 : u.isRTL(d.floating)), k = f || (q || !w ? [co(i)] : nu(i)), R = y !== "none";
      !f && R && k.push(...lu(i, w, y, x));
      const F = [i, ...k], L = await Nt(o, S), A = [];
      let C = ((n = s.flip) == null ? void 0 : n.overflows) || [];
      if (c && A.push(L[P]), p) {
        const j = ou(a, l, x);
        A.push(L[j[0]], L[j[1]]);
      }
      if (C = [...C, {
        placement: a,
        overflows: A
      }], !A.every((j) => j <= 0)) {
        var $, I;
        const j = ((($ = s.flip) == null ? void 0 : $.index) || 0) + 1, oe = F[j];
        if (oe && (!(p === "alignment" ? B !== Ne(oe) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        C.every((le) => Ne(le.placement) === B ? le.overflows[0] > 0 : !0)))
          return {
            data: {
              index: j,
              overflows: C
            },
            reset: {
              placement: oe
            }
          };
        let J = (I = C.filter((te) => te.overflows[0] <= 0).sort((te, le) => te.overflows[1] - le.overflows[1])[0]) == null ? void 0 : I.placement;
        if (!J)
          switch (v) {
            case "bestFit": {
              var H;
              const te = (H = C.filter((le) => {
                if (R) {
                  const ve = Ne(le.placement);
                  return ve === B || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  ve === "y";
                }
                return !0;
              }).map((le) => [le.placement, le.overflows.filter((ve) => ve > 0).reduce((ve, qe) => ve + qe, 0)]).sort((le, ve) => le[1] - ve[1])[0]) == null ? void 0 : H[0];
              te && (J = te);
              break;
            }
            case "initialPlacement":
              J = i;
              break;
          }
        if (a !== J)
          return {
            reset: {
              placement: J
            }
          };
      }
      return {};
    }
  };
};
function ea(e, o) {
  return {
    top: e.top - o.height,
    right: e.right - o.width,
    bottom: e.bottom - o.height,
    left: e.left - o.width
  };
}
function ta(e) {
  return Zi.some((o) => e[o] >= 0);
}
const pu = function(e) {
  return e === void 0 && (e = {}), {
    name: "hide",
    options: e,
    async fn(o) {
      const {
        rects: t
      } = o, {
        strategy: n = "referenceHidden",
        ...a
      } = Ye(e, o);
      switch (n) {
        case "referenceHidden": {
          const s = await Nt(o, {
            ...a,
            elementContext: "reference"
          }), l = ea(s, t.reference);
          return {
            data: {
              referenceHiddenOffsets: l,
              referenceHidden: ta(l)
            }
          };
        }
        case "escaped": {
          const s = await Nt(o, {
            ...a,
            altBoundary: !0
          }), l = ea(s, t.floating);
          return {
            data: {
              escapedOffsets: l,
              escaped: ta(l)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Ya = /* @__PURE__ */ new Set(["left", "top"]);
async function fu(e, o) {
  const {
    placement: t,
    platform: n,
    elements: a
  } = e, s = await (n.isRTL == null ? void 0 : n.isRTL(a.floating)), l = Xe(t), i = Et(t), u = Ne(t) === "y", d = Ya.has(l) ? -1 : 1, c = s && u ? -1 : 1, p = Ye(o, e);
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
const vu = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(o) {
      var t, n;
      const {
        x: a,
        y: s,
        placement: l,
        middlewareData: i
      } = o, u = await fu(o, e);
      return l === ((t = i.offset) == null ? void 0 : t.placement) && (n = i.arrow) != null && n.alignmentOffset ? {} : {
        x: a + u.x,
        y: s + u.y,
        data: {
          ...u,
          placement: l
        }
      };
    }
  };
}, mu = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(o) {
      const {
        x: t,
        y: n,
        placement: a
      } = o, {
        mainAxis: s = !0,
        crossAxis: l = !1,
        limiter: i = {
          fn: (S) => {
            let {
              x: P,
              y: B
            } = S;
            return {
              x: P,
              y: B
            };
          }
        },
        ...u
      } = Ye(e, o), d = {
        x: t,
        y: n
      }, c = await Nt(o, u), p = Ne(Xe(a)), f = _n(p);
      let v = d[f], y = d[p];
      if (s) {
        const S = f === "y" ? "top" : "left", P = f === "y" ? "bottom" : "right", B = v + c[S], q = v - c[P];
        v = Xo(B, v, q);
      }
      if (l) {
        const S = p === "y" ? "top" : "left", P = p === "y" ? "bottom" : "right", B = y + c[S], q = y - c[P];
        y = Xo(B, y, q);
      }
      const w = i.fn({
        ...o,
        [f]: v,
        [p]: y
      });
      return {
        ...w,
        data: {
          x: w.x - t,
          y: w.y - n,
          enabled: {
            [f]: s,
            [p]: l
          }
        }
      };
    }
  };
}, gu = function(e) {
  return e === void 0 && (e = {}), {
    options: e,
    fn(o) {
      const {
        x: t,
        y: n,
        placement: a,
        rects: s,
        middlewareData: l
      } = o, {
        offset: i = 0,
        mainAxis: u = !0,
        crossAxis: d = !0
      } = Ye(e, o), c = {
        x: t,
        y: n
      }, p = Ne(a), f = _n(p);
      let v = c[f], y = c[p];
      const w = Ye(i, o), S = typeof w == "number" ? {
        mainAxis: w,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...w
      };
      if (u) {
        const q = f === "y" ? "height" : "width", x = s.reference[f] - s.floating[q] + S.mainAxis, k = s.reference[f] + s.reference[q] - S.mainAxis;
        v < x ? v = x : v > k && (v = k);
      }
      if (d) {
        var P, B;
        const q = f === "y" ? "width" : "height", x = Ya.has(Xe(a)), k = s.reference[p] - s.floating[q] + (x && ((P = l.offset) == null ? void 0 : P[p]) || 0) + (x ? 0 : S.crossAxis), R = s.reference[p] + s.reference[q] + (x ? 0 : ((B = l.offset) == null ? void 0 : B[p]) || 0) - (x ? S.crossAxis : 0);
        y < k ? y = k : y > R && (y = R);
      }
      return {
        [f]: v,
        [p]: y
      };
    }
  };
}, yu = function(e) {
  return e === void 0 && (e = {}), {
    name: "size",
    options: e,
    async fn(o) {
      var t, n;
      const {
        placement: a,
        rects: s,
        platform: l,
        elements: i
      } = o, {
        apply: u = () => {
        },
        ...d
      } = Ye(e, o), c = await Nt(o, d), p = Xe(a), f = Et(a), v = Ne(a) === "y", {
        width: y,
        height: w
      } = s.floating;
      let S, P;
      p === "top" || p === "bottom" ? (S = p, P = f === (await (l.isRTL == null ? void 0 : l.isRTL(i.floating)) ? "start" : "end") ? "left" : "right") : (P = p, S = f === "end" ? "top" : "bottom");
      const B = w - c.top - c.bottom, q = y - c.left - c.right, x = ot(w - c[S], B), k = ot(y - c[P], q), R = !o.middlewareData.shift;
      let F = x, L = k;
      if ((t = o.middlewareData.shift) != null && t.enabled.x && (L = q), (n = o.middlewareData.shift) != null && n.enabled.y && (F = B), R && !f) {
        const C = Be(c.left, 0), $ = Be(c.right, 0), I = Be(c.top, 0), H = Be(c.bottom, 0);
        v ? L = y - 2 * (C !== 0 || $ !== 0 ? C + $ : Be(c.left, c.right)) : F = w - 2 * (I !== 0 || H !== 0 ? I + H : Be(c.top, c.bottom));
      }
      await u({
        ...o,
        availableWidth: L,
        availableHeight: F
      });
      const A = await l.getDimensions(i.floating);
      return y !== A.width || w !== A.height ? {
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
function ft(e) {
  return Sn(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function Pe(e) {
  var o;
  return (e == null || (o = e.ownerDocument) == null ? void 0 : o.defaultView) || window;
}
function We(e) {
  var o;
  return (o = (Sn(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : o.documentElement;
}
function Sn(e) {
  return xo() ? e instanceof Node || e instanceof Pe(e).Node : !1;
}
function Me(e) {
  return xo() ? e instanceof Element || e instanceof Pe(e).Element : !1;
}
function He(e) {
  return xo() ? e instanceof HTMLElement || e instanceof Pe(e).HTMLElement : !1;
}
function oa(e) {
  return !xo() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof Pe(e).ShadowRoot;
}
const hu = /* @__PURE__ */ new Set(["inline", "contents"]);
function Xt(e) {
  const {
    overflow: o,
    overflowX: t,
    overflowY: n,
    display: a
  } = Re(e);
  return /auto|scroll|overlay|hidden|clip/.test(o + n + t) && !hu.has(a);
}
const bu = /* @__PURE__ */ new Set(["table", "td", "th"]);
function _u(e) {
  return bu.has(ft(e));
}
const wu = [":popover-open", ":modal"];
function qo(e) {
  return wu.some((o) => {
    try {
      return e.matches(o);
    } catch {
      return !1;
    }
  });
}
const Cu = ["transform", "translate", "scale", "rotate", "perspective"], Su = ["transform", "translate", "scale", "rotate", "perspective", "filter"], xu = ["paint", "layout", "strict", "content"];
function xn(e) {
  const o = qn(), t = Me(e) ? Re(e) : e;
  return Cu.some((n) => t[n] ? t[n] !== "none" : !1) || (t.containerType ? t.containerType !== "normal" : !1) || !o && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !o && (t.filter ? t.filter !== "none" : !1) || Su.some((n) => (t.willChange || "").includes(n)) || xu.some((n) => (t.contain || "").includes(n));
}
function qu(e) {
  let o = nt(e);
  for (; He(o) && !Ot(o); ) {
    if (xn(o))
      return o;
    if (qo(o))
      return null;
    o = nt(o);
  }
  return null;
}
function qn() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const Bu = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Ot(e) {
  return Bu.has(ft(e));
}
function Re(e) {
  return Pe(e).getComputedStyle(e);
}
function Bo(e) {
  return Me(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function nt(e) {
  if (ft(e) === "html")
    return e;
  const o = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    oa(e) && e.host || // Fallback.
    We(e)
  );
  return oa(o) ? o.host : o;
}
function Xa(e) {
  const o = nt(e);
  return Ot(o) ? e.ownerDocument ? e.ownerDocument.body : e.body : He(o) && Xt(o) ? o : Xa(o);
}
function Lt(e, o, t) {
  var n;
  o === void 0 && (o = []), t === void 0 && (t = !0);
  const a = Xa(e), s = a === ((n = e.ownerDocument) == null ? void 0 : n.body), l = Pe(a);
  if (s) {
    const i = Zo(l);
    return o.concat(l, l.visualViewport || [], Xt(a) ? a : [], i && t ? Lt(i) : []);
  }
  return o.concat(a, Lt(a, [], t));
}
function Zo(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Ja(e) {
  const o = Re(e);
  let t = parseFloat(o.width) || 0, n = parseFloat(o.height) || 0;
  const a = He(e), s = a ? e.offsetWidth : t, l = a ? e.offsetHeight : n, i = uo(t) !== s || uo(n) !== l;
  return i && (t = s, n = l), {
    width: t,
    height: n,
    $: i
  };
}
function Bn(e) {
  return Me(e) ? e : e.contextElement;
}
function xt(e) {
  const o = Bn(e);
  if (!He(o))
    return ze(1);
  const t = o.getBoundingClientRect(), {
    width: n,
    height: a,
    $: s
  } = Ja(o);
  let l = (s ? uo(t.width) : t.width) / n, i = (s ? uo(t.height) : t.height) / a;
  return (!l || !Number.isFinite(l)) && (l = 1), (!i || !Number.isFinite(i)) && (i = 1), {
    x: l,
    y: i
  };
}
const Pu = /* @__PURE__ */ ze(0);
function Za(e) {
  const o = Pe(e);
  return !qn() || !o.visualViewport ? Pu : {
    x: o.visualViewport.offsetLeft,
    y: o.visualViewport.offsetTop
  };
}
function Ou(e, o, t) {
  return o === void 0 && (o = !1), !t || o && t !== Pe(e) ? !1 : o;
}
function dt(e, o, t, n) {
  o === void 0 && (o = !1), t === void 0 && (t = !1);
  const a = e.getBoundingClientRect(), s = Bn(e);
  let l = ze(1);
  o && (n ? Me(n) && (l = xt(n)) : l = xt(e));
  const i = Ou(s, t, n) ? Za(s) : ze(0);
  let u = (a.left + i.x) / l.x, d = (a.top + i.y) / l.y, c = a.width / l.x, p = a.height / l.y;
  if (s) {
    const f = Pe(s), v = n && Me(n) ? Pe(n) : n;
    let y = f, w = Zo(y);
    for (; w && n && v !== y; ) {
      const S = xt(w), P = w.getBoundingClientRect(), B = Re(w), q = P.left + (w.clientLeft + parseFloat(B.paddingLeft)) * S.x, x = P.top + (w.clientTop + parseFloat(B.paddingTop)) * S.y;
      u *= S.x, d *= S.y, c *= S.x, p *= S.y, u += q, d += x, y = Pe(w), w = Zo(y);
    }
  }
  return po({
    width: c,
    height: p,
    x: u,
    y: d
  });
}
function Po(e, o) {
  const t = Bo(e).scrollLeft;
  return o ? o.left + t : dt(We(e)).left + t;
}
function Qa(e, o) {
  const t = e.getBoundingClientRect(), n = t.left + o.scrollLeft - Po(e, t), a = t.top + o.scrollTop;
  return {
    x: n,
    y: a
  };
}
function Tu(e) {
  let {
    elements: o,
    rect: t,
    offsetParent: n,
    strategy: a
  } = e;
  const s = a === "fixed", l = We(n), i = o ? qo(o.floating) : !1;
  if (n === l || i && s)
    return t;
  let u = {
    scrollLeft: 0,
    scrollTop: 0
  }, d = ze(1);
  const c = ze(0), p = He(n);
  if ((p || !p && !s) && ((ft(n) !== "body" || Xt(l)) && (u = Bo(n)), He(n))) {
    const v = dt(n);
    d = xt(n), c.x = v.x + n.clientLeft, c.y = v.y + n.clientTop;
  }
  const f = l && !p && !s ? Qa(l, u) : ze(0);
  return {
    width: t.width * d.x,
    height: t.height * d.y,
    x: t.x * d.x - u.scrollLeft * d.x + c.x + f.x,
    y: t.y * d.y - u.scrollTop * d.y + c.y + f.y
  };
}
function Au(e) {
  return Array.from(e.getClientRects());
}
function Du(e) {
  const o = We(e), t = Bo(e), n = e.ownerDocument.body, a = Be(o.scrollWidth, o.clientWidth, n.scrollWidth, n.clientWidth), s = Be(o.scrollHeight, o.clientHeight, n.scrollHeight, n.clientHeight);
  let l = -t.scrollLeft + Po(e);
  const i = -t.scrollTop;
  return Re(n).direction === "rtl" && (l += Be(o.clientWidth, n.clientWidth) - a), {
    width: a,
    height: s,
    x: l,
    y: i
  };
}
const na = 25;
function Eu(e, o) {
  const t = Pe(e), n = We(e), a = t.visualViewport;
  let s = n.clientWidth, l = n.clientHeight, i = 0, u = 0;
  if (a) {
    s = a.width, l = a.height;
    const c = qn();
    (!c || c && o === "fixed") && (i = a.offsetLeft, u = a.offsetTop);
  }
  const d = Po(n);
  if (d <= 0) {
    const c = n.ownerDocument, p = c.body, f = getComputedStyle(p), v = c.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, y = Math.abs(n.clientWidth - p.clientWidth - v);
    y <= na && (s -= y);
  } else d <= na && (s += d);
  return {
    width: s,
    height: l,
    x: i,
    y: u
  };
}
const ku = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function $u(e, o) {
  const t = dt(e, !0, o === "fixed"), n = t.top + e.clientTop, a = t.left + e.clientLeft, s = He(e) ? xt(e) : ze(1), l = e.clientWidth * s.x, i = e.clientHeight * s.y, u = a * s.x, d = n * s.y;
  return {
    width: l,
    height: i,
    x: u,
    y: d
  };
}
function aa(e, o, t) {
  let n;
  if (o === "viewport")
    n = Eu(e, t);
  else if (o === "document")
    n = Du(We(e));
  else if (Me(o))
    n = $u(o, t);
  else {
    const a = Za(e);
    n = {
      x: o.x - a.x,
      y: o.y - a.y,
      width: o.width,
      height: o.height
    };
  }
  return po(n);
}
function er(e, o) {
  const t = nt(e);
  return t === o || !Me(t) || Ot(t) ? !1 : Re(t).position === "fixed" || er(t, o);
}
function Iu(e, o) {
  const t = o.get(e);
  if (t)
    return t;
  let n = Lt(e, [], !1).filter((i) => Me(i) && ft(i) !== "body"), a = null;
  const s = Re(e).position === "fixed";
  let l = s ? nt(e) : e;
  for (; Me(l) && !Ot(l); ) {
    const i = Re(l), u = xn(l);
    !u && i.position === "fixed" && (a = null), (s ? !u && !a : !u && i.position === "static" && !!a && ku.has(a.position) || Xt(l) && !u && er(e, l)) ? n = n.filter((c) => c !== l) : a = i, l = nt(l);
  }
  return o.set(e, n), n;
}
function Mu(e) {
  let {
    element: o,
    boundary: t,
    rootBoundary: n,
    strategy: a
  } = e;
  const l = [...t === "clippingAncestors" ? qo(o) ? [] : Iu(o, this._c) : [].concat(t), n], i = l[0], u = l.reduce((d, c) => {
    const p = aa(o, c, a);
    return d.top = Be(p.top, d.top), d.right = ot(p.right, d.right), d.bottom = ot(p.bottom, d.bottom), d.left = Be(p.left, d.left), d;
  }, aa(o, i, a));
  return {
    width: u.right - u.left,
    height: u.bottom - u.top,
    x: u.left,
    y: u.top
  };
}
function Ru(e) {
  const {
    width: o,
    height: t
  } = Ja(e);
  return {
    width: o,
    height: t
  };
}
function Fu(e, o, t) {
  const n = He(o), a = We(o), s = t === "fixed", l = dt(e, !0, s, o);
  let i = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const u = ze(0);
  function d() {
    u.x = Po(a);
  }
  if (n || !n && !s)
    if ((ft(o) !== "body" || Xt(a)) && (i = Bo(o)), n) {
      const v = dt(o, !0, s, o);
      u.x = v.x + o.clientLeft, u.y = v.y + o.clientTop;
    } else a && d();
  s && !n && a && d();
  const c = a && !n && !s ? Qa(a, i) : ze(0), p = l.left + i.scrollLeft - u.x - c.x, f = l.top + i.scrollTop - u.y - c.y;
  return {
    x: p,
    y: f,
    width: l.width,
    height: l.height
  };
}
function Lo(e) {
  return Re(e).position === "static";
}
function ra(e, o) {
  if (!He(e) || Re(e).position === "fixed")
    return null;
  if (o)
    return o(e);
  let t = e.offsetParent;
  return We(e) === t && (t = t.ownerDocument.body), t;
}
function tr(e, o) {
  const t = Pe(e);
  if (qo(e))
    return t;
  if (!He(e)) {
    let a = nt(e);
    for (; a && !Ot(a); ) {
      if (Me(a) && !Lo(a))
        return a;
      a = nt(a);
    }
    return t;
  }
  let n = ra(e, o);
  for (; n && _u(n) && Lo(n); )
    n = ra(n, o);
  return n && Ot(n) && Lo(n) && !xn(n) ? t : n || qu(e) || t;
}
const Vu = async function(e) {
  const o = this.getOffsetParent || tr, t = this.getDimensions, n = await t(e.floating);
  return {
    reference: Fu(e.reference, await o(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function Nu(e) {
  return Re(e).direction === "rtl";
}
const Lu = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Tu,
  getDocumentElement: We,
  getClippingRect: Mu,
  getOffsetParent: tr,
  getElementRects: Vu,
  getClientRects: Au,
  getDimensions: Ru,
  getScale: xt,
  isElement: Me,
  isRTL: Nu
};
function or(e, o) {
  return e.x === o.x && e.y === o.y && e.width === o.width && e.height === o.height;
}
function zu(e, o) {
  let t = null, n;
  const a = We(e);
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
    const y = no(p), w = no(a.clientWidth - (c + f)), S = no(a.clientHeight - (p + v)), P = no(c), q = {
      rootMargin: -y + "px " + -w + "px " + -S + "px " + -P + "px",
      threshold: Be(0, ot(1, u)) || 1
    };
    let x = !0;
    function k(R) {
      const F = R[0].intersectionRatio;
      if (F !== u) {
        if (!x)
          return l();
        F ? l(!1, F) : n = setTimeout(() => {
          l(!1, 1e-7);
        }, 1e3);
      }
      F === 1 && !or(d, e.getBoundingClientRect()) && l(), x = !1;
    }
    try {
      t = new IntersectionObserver(k, {
        ...q,
        // Handle <iframe>s
        root: a.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(k, q);
    }
    t.observe(e);
  }
  return l(!0), s;
}
function Ku(e, o, t, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: a = !0,
    ancestorResize: s = !0,
    elementResize: l = typeof ResizeObserver == "function",
    layoutShift: i = typeof IntersectionObserver == "function",
    animationFrame: u = !1
  } = n, d = Bn(e), c = a || s ? [...d ? Lt(d) : [], ...Lt(o)] : [];
  c.forEach((P) => {
    a && P.addEventListener("scroll", t, {
      passive: !0
    }), s && P.addEventListener("resize", t);
  });
  const p = d && i ? zu(d, t) : null;
  let f = -1, v = null;
  l && (v = new ResizeObserver((P) => {
    let [B] = P;
    B && B.target === d && v && (v.unobserve(o), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var q;
      (q = v) == null || q.observe(o);
    })), t();
  }), d && !u && v.observe(d), v.observe(o));
  let y, w = u ? dt(e) : null;
  u && S();
  function S() {
    const P = dt(e);
    w && !or(w, P) && t(), w = P, y = requestAnimationFrame(S);
  }
  return t(), () => {
    var P;
    c.forEach((B) => {
      a && B.removeEventListener("scroll", t), s && B.removeEventListener("resize", t);
    }), p?.(), (P = v) == null || P.disconnect(), v = null, u && cancelAnimationFrame(y);
  };
}
const Hu = vu, ju = mu, sa = cu, Wu = yu, Uu = pu, Gu = du, Yu = gu, Xu = (e, o, t) => {
  const n = /* @__PURE__ */ new Map(), a = {
    platform: Lu,
    ...t
  }, s = {
    ...a.platform,
    _c: n
  };
  return uu(e, o, {
    ...a,
    platform: s
  });
};
function Ju(e) {
  return e != null && typeof e == "object" && "$el" in e;
}
function Qo(e) {
  if (Ju(e)) {
    const o = e.$el;
    return Sn(o) && ft(o) === "#comment" ? null : o;
  }
  return e;
}
function wt(e) {
  return typeof e == "function" ? e() : r(e);
}
function Zu(e) {
  return {
    name: "arrow",
    options: e,
    fn(o) {
      const t = Qo(wt(e.element));
      return t == null ? {} : Gu({
        element: t,
        padding: e.padding
      }).fn(o);
    }
  };
}
function nr(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function la(e, o) {
  const t = nr(e);
  return Math.round(o * t) / t;
}
function Qu(e, o, t) {
  t === void 0 && (t = {});
  const n = t.whileElementsMounted, a = O(() => {
    var F;
    return (F = wt(t.open)) != null ? F : !0;
  }), s = O(() => wt(t.middleware)), l = O(() => {
    var F;
    return (F = wt(t.placement)) != null ? F : "bottom";
  }), i = O(() => {
    var F;
    return (F = wt(t.strategy)) != null ? F : "absolute";
  }), u = O(() => {
    var F;
    return (F = wt(t.transform)) != null ? F : !0;
  }), d = O(() => Qo(e.value)), c = O(() => Qo(o.value)), p = T(0), f = T(0), v = T(i.value), y = T(l.value), w = vo({}), S = T(!1), P = O(() => {
    const F = {
      position: v.value,
      left: "0",
      top: "0"
    };
    if (!c.value)
      return F;
    const L = la(c.value, p.value), A = la(c.value, f.value);
    return u.value ? {
      ...F,
      transform: "translate(" + L + "px, " + A + "px)",
      ...nr(c.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: v.value,
      left: L + "px",
      top: A + "px"
    };
  });
  let B;
  function q() {
    if (d.value == null || c.value == null)
      return;
    const F = a.value;
    Xu(d.value, c.value, {
      middleware: s.value,
      placement: l.value,
      strategy: i.value
    }).then((L) => {
      p.value = L.x, f.value = L.y, v.value = L.strategy, y.value = L.placement, w.value = L.middlewareData, S.value = F !== !1;
    });
  }
  function x() {
    typeof B == "function" && (B(), B = void 0);
  }
  function k() {
    if (x(), n === void 0) {
      q();
      return;
    }
    if (d.value != null && c.value != null) {
      B = n(d.value, c.value, q);
      return;
    }
  }
  function R() {
    a.value || (S.value = !1);
  }
  return re([s, l, i, a], q, {
    flush: "sync"
  }), re([d, c], k, {
    flush: "sync"
  }), re(a, R, {
    flush: "sync"
  }), pa() && fa(x), {
    x: bt(p),
    y: bt(f),
    strategy: bt(v),
    placement: bt(y),
    middlewareData: bt(w),
    isPositioned: bt(S),
    floatingStyles: P,
    update: q
  };
}
const ar = {
  side: "bottom",
  sideOffset: 0,
  sideFlip: !0,
  align: "center",
  alignOffset: 0,
  alignFlip: !0,
  arrowPadding: 0,
  avoidCollisions: !0,
  collisionBoundary: () => [],
  collisionPadding: 0,
  sticky: "partial",
  hideWhenDetached: !1,
  positionStrategy: "fixed",
  updatePositionStrategy: "optimized",
  prioritizePosition: !1
}, [Fm, ed] = ee("PopperContent");
var td = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ ha({
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
  }, { ...ar }),
  emits: ["placed"],
  setup(e, { emit: o }) {
    const t = e, n = o, a = Ua(), { forwardRef: s, currentElement: l } = V(), i = T(), u = T(), { width: d, height: c } = $a(u), p = O(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), f = O(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), v = O(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), y = O(() => ({
      padding: f.value,
      boundary: v.value.filter(Xi),
      altBoundary: v.value.length > 0
    })), w = O(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), S = Bs(() => [
      Hu({
        mainAxis: t.sideOffset + c.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && sa({
        ...y.value,
        ...w.value
      }),
      t.avoidCollisions && ju({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? Yu() : void 0,
        ...y.value
      }),
      !t.prioritizePosition && t.avoidCollisions && sa({
        ...y.value,
        ...w.value
      }),
      Wu({
        ...y.value,
        apply: ({ elements: I, rects: H, availableWidth: j, availableHeight: oe }) => {
          const { width: J, height: te } = H.reference, le = I.floating.style;
          le.setProperty("--reka-popper-available-width", `${j}px`), le.setProperty("--reka-popper-available-height", `${oe}px`), le.setProperty("--reka-popper-anchor-width", `${J}px`), le.setProperty("--reka-popper-anchor-height", `${te}px`);
        }
      }),
      u.value && Zu({
        element: u.value,
        padding: t.arrowPadding
      }),
      Ji({
        arrowWidth: d.value,
        arrowHeight: c.value
      }),
      t.hideWhenDetached && Uu({
        strategy: "referenceHidden",
        ...y.value
      })
    ]), P = O(() => t.reference ?? a.anchor.value), { floatingStyles: B, placement: q, isPositioned: x, middlewareData: k } = Qu(P, i, {
      strategy: t.positionStrategy,
      placement: p,
      whileElementsMounted: (...I) => Ku(...I, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: S
    }), R = O(() => Yo(q.value)[0]), F = O(() => Yo(q.value)[1]);
    ya(() => {
      x.value && n("placed");
    });
    const L = O(() => k.value.arrow?.centerOffset !== 0), A = T("");
    ae(() => {
      l.value && (A.value = window.getComputedStyle(l.value).zIndex);
    });
    const C = O(() => k.value.arrow?.x ?? 0), $ = O(() => k.value.arrow?.y ?? 0);
    return ed({
      placedSide: R,
      onArrowChange: (I) => u.value = I,
      arrowX: C,
      arrowY: $,
      shouldHideArrow: L
    }), (I, H) => (m(), K("div", {
      ref_key: "floatingRef",
      ref: i,
      "data-reka-popper-content-wrapper": "",
      style: Ae({
        ...r(B),
        transform: r(x) ? r(B).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: A.value,
        "--reka-popper-transform-origin": [r(k).transformOrigin?.x, r(k).transformOrigin?.y].join(" "),
        ...r(k).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [M(r(z), E({ ref: r(s) }, I.$attrs, {
      "as-child": t.asChild,
      as: I.as,
      "data-side": R.value,
      "data-align": F.value,
      style: { animation: r(x) ? void 0 : "none" }
    }), {
      default: g(() => [b(I.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), Oo = td;
function od(e) {
  const o = go({ nonce: T() });
  return O(() => e?.value || o.nonce?.value);
}
var nd = /* @__PURE__ */ h({
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
    return (t, n) => (m(), _(r(So), W(Y(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), rr = nd;
function ad() {
  const e = T(!1);
  return pe(() => {
    Ge("keydown", () => {
      e.value = !0;
    }, {
      capture: !0,
      passive: !0
    }), Ge(["pointerdown", "pointermove"], () => {
      e.value = !1;
    }, {
      capture: !0,
      passive: !0
    });
  }), e;
}
const rd = Ta(ad), [vt, sr] = ee(["MenuRoot", "MenuSub"], "MenuContext"), [Jt, sd] = ee("MenuRoot");
var ld = /* @__PURE__ */ h({
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
    const t = e, n = o, { modal: a, dir: s } = se(t), l = st(s), i = fe(t, "open", n), u = T(), d = rd();
    return sr({
      open: i,
      onOpenChange: (c) => {
        i.value = c;
      },
      content: u,
      onContentChange: (c) => {
        u.value = c;
      }
    }), sd({
      onClose: () => {
        i.value = !1;
      },
      isUsingKeyboardRef: d,
      dir: l,
      modal: a
    }), (c, p) => (m(), _(r(Yt), null, {
      default: g(() => [b(c.$slots, "default")]),
      _: 3
    }));
  }
}), id = ld;
const [Pn, ud] = ee("MenuContent");
var dd = /* @__PURE__ */ h({
  __name: "MenuContentImpl",
  props: /* @__PURE__ */ ha({
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
  }, { ...ar }),
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
    const t = e, n = o, a = vt(), s = Jt(), { trapFocus: l, disableOutsidePointerEvents: i, loop: u } = se(t);
    un(), bo(i.value);
    const d = T(""), c = T(0), p = T(0), f = T(null), v = T("right"), y = T(0), w = T(null), S = T(), { forwardRef: P, currentElement: B } = V(), { handleTypeaheadSearch: q } = dn();
    re(B, (A) => {
      a.onContentChange(A);
    }), rt(() => {
      window.clearTimeout(c.value);
    });
    function x(A) {
      return v.value === f.value?.side && ti(A, f.value?.area);
    }
    async function k(A) {
      n("openAutoFocus", A), !A.defaultPrevented && (A.preventDefault(), B.value?.focus({ preventScroll: !0 }));
    }
    function R(A) {
      if (A.defaultPrevented) return;
      const $ = A.target.closest("[data-reka-menu-content]") === A.currentTarget, I = A.ctrlKey || A.altKey || A.metaKey, H = A.key.length === 1, j = Pa(A, Ce(), B.value, {
        loop: u.value,
        arrowKeyOptions: "vertical",
        dir: s?.dir.value,
        focus: !0,
        attributeName: "[data-reka-collection-item]:not([data-disabled])"
      });
      if (j) return j?.focus();
      if (A.code === "Space") return;
      const oe = S.value?.getItems() ?? [];
      if ($ && (A.key === "Tab" && A.preventDefault(), !I && H && q(A.key, oe)), A.target !== B.value || !Jl.includes(A.key)) return;
      A.preventDefault();
      const J = [...oe.map((te) => te.ref)];
      Va.includes(A.key) && J.reverse(), Go(J);
    }
    function F(A) {
      A?.currentTarget?.contains?.(A.target) || (window.clearTimeout(c.value), d.value = "");
    }
    function L(A) {
      if (!Vt(A)) return;
      const C = A.target, $ = y.value !== A.clientX;
      if (A?.currentTarget?.contains(C) && $) {
        const I = A.clientX > y.value ? "right" : "left";
        v.value = I, y.value = A.clientX;
      }
    }
    return ud({
      onItemEnter: (A) => !!x(A),
      onItemLeave: (A) => {
        x(A) || (B.value?.focus(), w.value = null);
      },
      onTriggerLeave: (A) => !!x(A),
      searchRef: d,
      pointerGraceTimerRef: p,
      onPointerGraceIntentChange: (A) => {
        f.value = A;
      }
    }), (A, C) => (m(), _(r(Co), {
      "as-child": "",
      trapped: r(l),
      onMountAutoFocus: k,
      onUnmountAutoFocus: C[7] || (C[7] = ($) => n("closeAutoFocus", $))
    }, {
      default: g(() => [M(r(Wt), {
        "as-child": "",
        "disable-outside-pointer-events": r(i),
        onEscapeKeyDown: C[2] || (C[2] = ($) => n("escapeKeyDown", $)),
        onPointerDownOutside: C[3] || (C[3] = ($) => n("pointerDownOutside", $)),
        onFocusOutside: C[4] || (C[4] = ($) => n("focusOutside", $)),
        onInteractOutside: C[5] || (C[5] = ($) => n("interactOutside", $)),
        onDismiss: C[6] || (C[6] = ($) => n("dismiss"))
      }, {
        default: g(() => [M(r(yn), {
          ref_key: "rovingFocusGroupRef",
          ref: S,
          "current-tab-stop-id": w.value,
          "onUpdate:currentTabStopId": C[0] || (C[0] = ($) => w.value = $),
          "as-child": "",
          orientation: "vertical",
          dir: r(s).dir.value,
          loop: r(u),
          onEntryFocus: C[1] || (C[1] = ($) => {
            n("entryFocus", $), r(s).isUsingKeyboardRef.value || $.preventDefault();
          })
        }, {
          default: g(() => [M(r(Oo), {
            ref: r(P),
            role: "menu",
            as: A.as,
            "as-child": A.asChild,
            "aria-orientation": "vertical",
            "data-reka-menu-content": "",
            "data-state": r(pn)(r(a).open.value),
            dir: r(s).dir.value,
            side: A.side,
            "side-offset": A.sideOffset,
            align: A.align,
            "align-offset": A.alignOffset,
            "avoid-collisions": A.avoidCollisions,
            "collision-boundary": A.collisionBoundary,
            "collision-padding": A.collisionPadding,
            "arrow-padding": A.arrowPadding,
            "prioritize-position": A.prioritizePosition,
            "position-strategy": A.positionStrategy,
            "update-position-strategy": A.updatePositionStrategy,
            sticky: A.sticky,
            "hide-when-detached": A.hideWhenDetached,
            reference: A.reference,
            onKeydown: R,
            onBlur: F,
            onPointermove: L
          }, {
            default: g(() => [b(A.$slots, "default")]),
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
}), On = dd, cd = /* @__PURE__ */ h({
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
    const o = e, t = Pn(), { forwardRef: n } = V(), { CollectionItem: a } = Ee(), s = T(!1);
    async function l(u) {
      u.defaultPrevented || Vt(u) && (o.disabled ? t.onItemLeave(u) : t.onItemEnter(u) || u.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function i(u) {
      await de(), !u.defaultPrevented && Vt(u) && t.onItemLeave(u);
    }
    return (u, d) => (m(), _(r(a), { value: { textValue: u.textValue } }, {
      default: g(() => [M(r(z), E({
        ref: r(n),
        role: "menuitem",
        tabindex: "-1"
      }, u.$attrs, {
        as: u.as,
        "as-child": u.asChild,
        "aria-disabled": u.disabled || void 0,
        "data-disabled": u.disabled ? "" : void 0,
        "data-highlighted": s.value ? "" : void 0,
        onPointermove: l,
        onPointerleave: i,
        onFocus: d[0] || (d[0] = async (c) => {
          await de(), !(c.defaultPrevented || u.disabled) && (s.value = !0);
        }),
        onBlur: d[1] || (d[1] = async (c) => {
          await de(), !c.defaultPrevented && (s.value = !1);
        })
      }), {
        default: g(() => [b(u.$slots, "default")]),
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
}), lr = cd, pd = /* @__PURE__ */ h({
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
    const t = e, n = o, { forwardRef: a, currentElement: s } = V(), l = Jt(), i = Pn(), u = T(!1);
    async function d() {
      const c = s.value;
      if (!t.disabled && c) {
        const p = new CustomEvent(Yl, {
          bubbles: !0,
          cancelable: !0
        });
        n("select", p), await de(), p.defaultPrevented ? u.value = !1 : l.onClose();
      }
    }
    return (c, p) => (m(), _(lr, E(t, {
      ref: r(a),
      onClick: d,
      onPointerdown: p[0] || (p[0] = () => {
        u.value = !0;
      }),
      onPointerup: p[1] || (p[1] = async (f) => {
        await de(), !f.defaultPrevented && (u.value || f.currentTarget?.click());
      }),
      onKeydown: p[2] || (p[2] = async (f) => {
        const v = r(i).searchRef.value !== "";
        c.disabled || v && f.key === " " || r(Uo).includes(f.key) && (f.currentTarget.click(), f.preventDefault());
      })
    }), {
      default: g(() => [b(c.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Tn = pd;
const [fd, ir] = ee(["MenuCheckboxItem", "MenuRadioItem"], "MenuItemIndicatorContext");
var vd = /* @__PURE__ */ h({
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
    const o = fd({ modelValue: T(!1) });
    return (t, n) => (m(), _(r(De), { present: t.forceMount || r(lo)(r(o).modelValue.value) || r(o).modelValue.value === !0 }, {
      default: g(() => [M(r(z), {
        as: t.as,
        "as-child": t.asChild,
        "data-state": r(fn)(r(o).modelValue.value)
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
}), md = vd, gd = /* @__PURE__ */ h({
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
    const t = e, n = o, a = yo(t, ["modelValue"]), s = ge(a), l = fe(t, "modelValue", n);
    return ir({ modelValue: l }), (i, u) => (m(), _(Tn, E({ role: "menuitemcheckbox" }, r(s), {
      "aria-checked": r(lo)(r(l)) ? "mixed" : r(l),
      "data-state": r(fn)(r(l)),
      onSelect: u[0] || (u[0] = async (d) => {
        n("select", d), r(lo)(r(l)) ? l.value = !0 : l.value = !r(l);
      })
    }), {
      default: g(() => [b(i.$slots, "default", { modelValue: r(l) })]),
      _: 3
    }, 16, ["aria-checked", "data-state"]));
  }
}), yd = gd, hd = /* @__PURE__ */ h({
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
    const t = e, n = o, a = Q(t, n), s = vt(), { forwardRef: l, currentElement: i } = V();
    return _o(i), (u, d) => (m(), _(On, E(r(a), {
      ref: r(l),
      "trap-focus": r(s).open.value,
      "disable-outside-pointer-events": r(s).open.value,
      "disable-outside-scroll": !0,
      onDismiss: d[0] || (d[0] = (c) => r(s).onOpenChange(!1)),
      onFocusOutside: d[1] || (d[1] = we((c) => n("focusOutside", c), ["prevent"]))
    }), {
      default: g(() => [b(u.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus", "disable-outside-pointer-events"]));
  }
}), bd = hd, _d = /* @__PURE__ */ h({
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
    const a = Q(e, o), s = vt();
    return (l, i) => (m(), _(On, E(r(a), {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      "disable-outside-scroll": !1,
      onDismiss: i[0] || (i[0] = (u) => r(s).onOpenChange(!1))
    }), {
      default: g(() => [b(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), wd = _d, Cd = /* @__PURE__ */ h({
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
    const a = Q(e, o), s = vt(), l = Jt();
    return (i, u) => (m(), _(r(De), { present: i.forceMount || r(s).open.value }, {
      default: g(() => [r(l).modal.value ? (m(), _(bd, W(E({ key: 0 }, {
        ...i.$attrs,
        ...r(a)
      })), {
        default: g(() => [b(i.$slots, "default")]),
        _: 3
      }, 16)) : (m(), _(wd, W(E({ key: 1 }, {
        ...i.$attrs,
        ...r(a)
      })), {
        default: g(() => [b(i.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Sd = Cd, xd = /* @__PURE__ */ h({
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
    const o = e;
    return (t, n) => (m(), _(r(z), E({ role: "group" }, o), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), ur = xd, qd = /* @__PURE__ */ h({
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
    const o = e;
    return (t, n) => (m(), _(r(z), W(Y(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Bd = qd, Pd = /* @__PURE__ */ h({
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
    return (t, n) => (m(), _(r(Ut), W(Y(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Od = Pd;
const [Td, Ad] = ee("MenuRadioGroup");
var Dd = /* @__PURE__ */ h({
  __name: "MenuRadioGroup",
  props: {
    modelValue: {
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
      required: !1
    }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, n = o, a = yo(t, ["modelValue"]), s = ge(a), l = fe(t, "modelValue", n);
    return Ad({
      modelValue: l,
      onValueChange: (i) => {
        l.value = i;
      }
    }), (i, u) => (m(), _(ur, W(Y(r(s))), {
      default: g(() => [b(i.$slots, "default", { modelValue: r(l) })]),
      _: 3
    }, 16));
  }
}), Ed = Dd, kd = /* @__PURE__ */ h({
  __name: "MenuRadioItem",
  props: {
    value: {
      type: String,
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
    const t = e, n = o, a = yo(t, ["value"]), s = ge(a), { value: l } = se(t), i = Td(), u = O(() => i.modelValue.value === l?.value);
    return ir({ modelValue: u }), (d, c) => (m(), _(Tn, E({ role: "menuitemradio" }, r(s), {
      "aria-checked": u.value,
      "data-state": r(fn)(u.value),
      onSelect: c[0] || (c[0] = async (p) => {
        n("select", p), r(i).onValueChange(r(l));
      })
    }), {
      default: g(() => [b(d.$slots, "default")]),
      _: 3
    }, 16, ["aria-checked", "data-state"]));
  }
}), $d = kd, Id = /* @__PURE__ */ h({
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
    return (t, n) => (m(), _(r(z), E(o, {
      role: "separator",
      "aria-orientation": "horizontal"
    }), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Md = Id;
const [dr, Rd] = ee("MenuSub");
var Fd = /* @__PURE__ */ h({
  __name: "MenuSub",
  props: { open: {
    type: Boolean,
    required: !1,
    default: void 0
  } },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const t = e, a = fe(t, "open", o, {
      defaultValue: !1,
      passive: t.open === void 0
    }), s = vt(), l = T(), i = T();
    return ae((u) => {
      s?.open.value === !1 && (a.value = !1), u(() => a.value = !1);
    }), sr({
      open: a,
      onOpenChange: (u) => {
        a.value = u;
      },
      content: i,
      onContentChange: (u) => {
        i.value = u;
      }
    }), Rd({
      triggerId: "",
      contentId: "",
      trigger: l,
      onTriggerChange: (u) => {
        l.value = u;
      }
    }), (u, d) => (m(), _(r(Yt), null, {
      default: g(() => [b(u.$slots, "default")]),
      _: 3
    }));
  }
}), Vd = Fd, Nd = /* @__PURE__ */ h({
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
    const a = Q(e, o), s = vt(), l = Jt(), i = dr(), { forwardRef: u, currentElement: d } = V();
    return i.contentId ||= _e(void 0, "reka-menu-sub-content"), (c, p) => (m(), _(r(De), { present: c.forceMount || r(s).open.value }, {
      default: g(() => [M(On, E(r(a), {
        id: r(i).contentId,
        ref: r(u),
        "aria-labelledby": r(i).triggerId,
        align: "start",
        side: r(l).dir.value === "rtl" ? "left" : "right",
        "disable-outside-pointer-events": !1,
        "disable-outside-scroll": !1,
        "trap-focus": !1,
        onOpenAutoFocus: p[0] || (p[0] = we((f) => {
          r(l).isUsingKeyboardRef.value && r(d)?.focus();
        }, ["prevent"])),
        onCloseAutoFocus: p[1] || (p[1] = we(() => {
        }, ["prevent"])),
        onFocusOutside: p[2] || (p[2] = (f) => {
          f.defaultPrevented || f.target !== r(i).trigger.value && r(s).onOpenChange(!1);
        }),
        onEscapeKeyDown: p[3] || (p[3] = (f) => {
          r(l).onClose(), f.preventDefault();
        }),
        onKeydown: p[4] || (p[4] = (f) => {
          const v = f.currentTarget?.contains(f.target), y = r(Ql)[r(l).dir.value].includes(f.key);
          v && y && (r(s).onOpenChange(!1), r(i).trigger.value?.focus(), f.preventDefault());
        })
      }), {
        default: g(() => [b(c.$slots, "default")]),
        _: 3
      }, 16, [
        "id",
        "aria-labelledby",
        "side"
      ])]),
      _: 3
    }, 8, ["present"]));
  }
}), Ld = Nd, zd = /* @__PURE__ */ h({
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
    const o = e, t = vt(), n = Jt(), a = dr(), s = Pn(), l = T(null);
    a.triggerId ||= _e(void 0, "reka-menu-sub-trigger");
    function i() {
      l.value && window.clearTimeout(l.value), l.value = null;
    }
    rt(() => {
      i();
    });
    function u(p) {
      !Vt(p) || s.onItemEnter(p) || !o.disabled && !t.open.value && !l.value && (s.onPointerGraceIntentChange(null), l.value = window.setTimeout(() => {
        t.onOpenChange(!0), i();
      }, 100));
    }
    async function d(p) {
      if (!Vt(p)) return;
      i();
      const f = t.content.value?.getBoundingClientRect();
      if (f?.width) {
        const v = t.content.value?.dataset.side, y = v === "right", w = y ? -5 : 5, S = f[y ? "left" : "right"], P = f[y ? "right" : "left"];
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
              x: P,
              y: f.top
            },
            {
              x: P,
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
      o.disabled || f && p.key === " " || Zl[n.dir.value].includes(p.key) && (t.onOpenChange(!0), await de(), t.content.value?.focus(), p.preventDefault());
    }
    return (p, f) => (m(), _(rr, { "as-child": "" }, {
      default: g(() => [M(lr, E(o, {
        id: r(a).triggerId,
        ref: (v) => {
          r(a)?.onTriggerChange(v?.$el);
        },
        "aria-haspopup": "menu",
        "aria-expanded": r(t).open.value,
        "aria-controls": r(a).contentId,
        "data-state": r(pn)(r(t).open.value),
        onClick: f[0] || (f[0] = async (v) => {
          o.disabled || v.defaultPrevented || (v.currentTarget.focus(), r(t).open.value || r(t).onOpenChange(!0));
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
}), Kd = zd;
const [Zt, Hd] = ee("PopoverRoot");
var jd = /* @__PURE__ */ h({
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
    const t = e, n = o, { modal: a } = se(t), s = fe(t, "open", n, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), l = T(), i = T(!1);
    return Hd({
      contentId: "",
      triggerId: "",
      modal: a,
      open: s,
      onOpenChange: (u) => {
        s.value = u;
      },
      onOpenToggle: () => {
        s.value = !s.value;
      },
      triggerElement: l,
      hasCustomAnchor: i
    }), (u, d) => (m(), _(r(Yt), null, {
      default: g(() => [b(u.$slots, "default", {
        open: r(s),
        close: () => s.value = !1
      })]),
      _: 3
    }));
  }
}), Wd = jd, Ud = /* @__PURE__ */ h({
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
    const t = e, n = o, a = ge(yo(t, "trapFocus", "disableOutsidePointerEvents")), { forwardRef: s } = V(), l = Zt();
    return un(), (i, u) => (m(), _(r(Co), {
      "as-child": "",
      loop: "",
      trapped: i.trapFocus,
      onMountAutoFocus: u[5] || (u[5] = (d) => n("openAutoFocus", d)),
      onUnmountAutoFocus: u[6] || (u[6] = (d) => n("closeAutoFocus", d))
    }, {
      default: g(() => [M(r(Wt), {
        "as-child": "",
        "disable-outside-pointer-events": i.disableOutsidePointerEvents,
        onPointerDownOutside: u[0] || (u[0] = (d) => n("pointerDownOutside", d)),
        onInteractOutside: u[1] || (u[1] = (d) => n("interactOutside", d)),
        onEscapeKeyDown: u[2] || (u[2] = (d) => n("escapeKeyDown", d)),
        onFocusOutside: u[3] || (u[3] = (d) => n("focusOutside", d)),
        onDismiss: u[4] || (u[4] = (d) => r(l).onOpenChange(!1))
      }, {
        default: g(() => [M(r(Oo), E(r(a), {
          id: r(l).contentId,
          ref: r(s),
          "data-state": r(l).open.value ? "open" : "closed",
          "aria-labelledby": r(l).triggerId,
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
}), cr = Ud, Gd = /* @__PURE__ */ h({
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
    const t = e, n = o, a = Zt(), s = T(!1);
    bo(!0);
    const l = Q(t, n), { forwardRef: i, currentElement: u } = V();
    return _o(u), (d, c) => (m(), _(cr, E(r(l), {
      ref: r(i),
      "trap-focus": r(a).open.value,
      "disable-outside-pointer-events": "",
      onCloseAutoFocus: c[0] || (c[0] = we((p) => {
        n("closeAutoFocus", p), s.value || r(a).triggerElement.value?.focus();
      }, ["prevent"])),
      onPointerDownOutside: c[1] || (c[1] = (p) => {
        n("pointerDownOutside", p);
        const f = p.detail.originalEvent, v = f.button === 0 && f.ctrlKey === !0, y = f.button === 2 || v;
        s.value = y;
      }),
      onFocusOutside: c[2] || (c[2] = we(() => {
      }, ["prevent"]))
    }), {
      default: g(() => [b(d.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), Yd = Gd, Xd = /* @__PURE__ */ h({
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
    const t = e, n = o, a = Zt(), s = T(!1), l = T(!1), i = Q(t, n);
    return (u, d) => (m(), _(cr, E(r(i), {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: d[0] || (d[0] = (c) => {
        n("closeAutoFocus", c), c.defaultPrevented || (s.value || r(a).triggerElement.value?.focus(), c.preventDefault()), s.value = !1, l.value = !1;
      }),
      onInteractOutside: d[1] || (d[1] = async (c) => {
        n("interactOutside", c), c.defaultPrevented || (s.value = !0, c.detail.originalEvent.type === "pointerdown" && (l.value = !0));
        const p = c.target;
        r(a).triggerElement.value?.contains(p) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && l.value && c.preventDefault();
      })
    }), {
      default: g(() => [b(u.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Jd = Xd, Zd = /* @__PURE__ */ h({
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
    const t = e, n = o, a = Zt(), s = Q(t, n), { forwardRef: l } = V();
    return a.contentId ||= _e(void 0, "reka-popover-content"), (i, u) => (m(), _(r(De), { present: i.forceMount || r(a).open.value }, {
      default: g(() => [r(a).modal.value ? (m(), _(Yd, E({ key: 0 }, r(s), { ref: r(l) }), {
        default: g(() => [b(i.$slots, "default")]),
        _: 3
      }, 16)) : (m(), _(Jd, E({ key: 1 }, r(s), { ref: r(l) }), {
        default: g(() => [b(i.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Qd = Zd, ec = /* @__PURE__ */ h({
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
    return (t, n) => (m(), _(r(Ut), W(Y(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), tc = ec, oc = /* @__PURE__ */ h({
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
    const o = e, t = Zt(), { forwardRef: n, currentElement: a } = V();
    return t.triggerId ||= _e(void 0, "reka-popover-trigger"), pe(() => {
      t.triggerElement.value = a.value;
    }), (s, l) => (m(), _($e(r(t).hasCustomAnchor.value ? r(z) : r(So)), { "as-child": "" }, {
      default: g(() => [M(r(z), {
        id: r(t).triggerId,
        ref: r(n),
        type: s.as === "button" ? "button" : void 0,
        "aria-haspopup": "dialog",
        "aria-expanded": r(t).open.value,
        "aria-controls": r(t).contentId,
        "data-state": r(t).open.value ? "open" : "closed",
        as: s.as,
        "as-child": o.asChild,
        onClick: r(t).onOpenToggle
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
}), nc = oc, ac = /* @__PURE__ */ h({
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
    const t = e, a = pt(o);
    return V(), (s, l) => (m(), _(r(yd), W(Y({
      ...t,
      ...r(a)
    })), {
      default: g(() => [b(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), rc = ac;
const [pr, sc] = ee("DropdownMenuRoot");
var lc = /* @__PURE__ */ h({
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
    const a = fe(t, "open", n, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = T(), { modal: l, dir: i } = se(t), u = st(i);
    return sc({
      open: a,
      onOpenChange: (d) => {
        a.value = d;
      },
      onOpenToggle: () => {
        a.value = !a.value;
      },
      triggerId: "",
      triggerElement: s,
      contentId: "",
      modal: l,
      dir: u
    }), (d, c) => (m(), _(r(id), {
      open: r(a),
      "onUpdate:open": c[0] || (c[0] = (p) => Le(a) ? a.value = p : null),
      dir: r(u),
      modal: r(l)
    }, {
      default: g(() => [b(d.$slots, "default", { open: r(a) })]),
      _: 3
    }, 8, [
      "open",
      "dir",
      "modal"
    ]));
  }
}), ic = lc, uc = /* @__PURE__ */ h({
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
    const a = Q(e, o);
    V();
    const s = pr(), l = T(!1);
    function i(u) {
      u.defaultPrevented || (l.value || setTimeout(() => {
        s.triggerElement.value?.focus();
      }, 0), l.value = !1, u.preventDefault());
    }
    return s.contentId ||= _e(void 0, "reka-dropdown-menu-content"), (u, d) => (m(), _(r(Sd), E(r(a), {
      id: r(s).contentId,
      "aria-labelledby": r(s)?.triggerId,
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
        (!r(s).modal.value || v) && (l.value = !0), r(s).triggerElement.value?.contains(c.target) && c.preventDefault();
      })
    }), {
      default: g(() => [b(u.$slots, "default")]),
      _: 3
    }, 16, ["id", "aria-labelledby"]));
  }
}), dc = uc, cc = /* @__PURE__ */ h({
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
    return V(), (t, n) => (m(), _(r(ur), W(Y(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), pc = cc, fc = /* @__PURE__ */ h({
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
    const t = e, a = pt(o);
    return V(), (s, l) => (m(), _(r(Tn), W(Y({
      ...t,
      ...r(a)
    })), {
      default: g(() => [b(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), vc = fc, mc = /* @__PURE__ */ h({
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
    return V(), (t, n) => (m(), _(r(md), W(Y(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), fr = mc, gc = /* @__PURE__ */ h({
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
    return V(), (t, n) => (m(), _(r(Bd), W(Y(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), yc = gc, hc = /* @__PURE__ */ h({
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
    return (t, n) => (m(), _(r(Od), W(Y(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), bc = hc, _c = /* @__PURE__ */ h({
  __name: "DropdownMenuRadioGroup",
  props: {
    modelValue: {
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
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, a = pt(o);
    return V(), (s, l) => (m(), _(r(Ed), W(Y({
      ...t,
      ...r(a)
    })), {
      default: g(() => [b(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), wc = _c, Cc = /* @__PURE__ */ h({
  __name: "DropdownMenuRadioItem",
  props: {
    value: {
      type: String,
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
    const a = Q(e, o);
    return V(), (s, l) => (m(), _(r($d), W(Y(r(a))), {
      default: g(() => [b(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Sc = Cc, xc = /* @__PURE__ */ h({
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
    return V(), (t, n) => (m(), _(r(Md), W(Y(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), qc = xc, Bc = /* @__PURE__ */ h({
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
    const t = e, a = fe(t, "open", o, {
      passive: t.open === void 0,
      defaultValue: t.defaultOpen ?? !1
    });
    return V(), (s, l) => (m(), _(r(Vd), {
      open: r(a),
      "onUpdate:open": l[0] || (l[0] = (i) => Le(a) ? a.value = i : null)
    }, {
      default: g(() => [b(s.$slots, "default", { open: r(a) })]),
      _: 3
    }, 8, ["open"]));
  }
}), Pc = Bc, Oc = /* @__PURE__ */ h({
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
    const a = Q(e, o);
    return V(), (s, l) => (m(), _(r(Ld), E(r(a), { style: {
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
}), Tc = Oc, Ac = /* @__PURE__ */ h({
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
    return V(), (t, n) => (m(), _(r(Kd), W(Y(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Dc = Ac, Ec = /* @__PURE__ */ h({
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
    const o = e, t = pr(), { forwardRef: n, currentElement: a } = V();
    return pe(() => {
      t.triggerElement = a;
    }), t.triggerId ||= _e(void 0, "reka-dropdown-menu-trigger"), (s, l) => (m(), _(r(rr), { "as-child": "" }, {
      default: g(() => [M(r(z), {
        id: r(t).triggerId,
        ref: r(n),
        type: s.as === "button" ? "button" : void 0,
        "as-child": o.asChild,
        as: s.as,
        "aria-haspopup": "menu",
        "aria-expanded": r(t).open.value,
        "aria-controls": r(t).open.value ? r(t).contentId : void 0,
        "data-disabled": s.disabled ? "" : void 0,
        disabled: s.disabled,
        "data-state": r(t).open.value ? "open" : "closed",
        onClick: l[0] || (l[0] = async (i) => {
          !s.disabled && i.button === 0 && i.ctrlKey === !1 && (r(t)?.onOpenToggle(), await de(), r(t).open.value && i.preventDefault());
        }),
        onKeydown: l[1] || (l[1] = Tt((i) => {
          s.disabled || (["Enter", " "].includes(i.key) && r(t).onOpenToggle(), i.key === "ArrowDown" && r(t).onOpenChange(!0), [
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
}), kc = Ec, $c = /* @__PURE__ */ h({
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
    return V(), (t, n) => (m(), _(r(z), E(o, { onMousedown: n[0] || (n[0] = (a) => {
      !a.defaultPrevented && a.detail > 1 && a.preventDefault();
    }) }), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Ic = $c;
const zt = 100, [Mc, Rc] = ee("ProgressRoot"), fo = (e) => typeof e == "number";
function Fc(e, o) {
  return tt(e) || fo(e) && !Number.isNaN(e) && e <= o && e >= 0 ? e : (console.error(`Invalid prop \`value\` of value \`${e}\` supplied to \`ProgressRoot\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${zt} if no \`max\` prop is set)
  - \`null\`  or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`), null);
}
function Vc(e) {
  return fo(e) && !Number.isNaN(e) && e > 0 ? e : (console.error(`Invalid prop \`max\` of value \`${e}\` supplied to \`ProgressRoot\`. Only numbers greater than 0 are valid max values. Defaulting to \`${zt}\`.`), zt);
}
var Nc = /* @__PURE__ */ h({
  __name: "ProgressRoot",
  props: {
    modelValue: {
      type: [Number, null],
      required: !1
    },
    max: {
      type: Number,
      required: !1,
      default: zt
    },
    getValueLabel: {
      type: Function,
      required: !1,
      default: (e, o) => fo(e) ? `${Math.round(e / o * zt)}%` : void 0
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
    const a = fe(t, "modelValue", n, { passive: t.modelValue === void 0 }), s = fe(t, "max", n, { passive: t.max === void 0 });
    re(() => a.value, async (i) => {
      const u = Fc(i, t.max);
      u !== i && (await de(), a.value = u);
    }, { immediate: !0 }), re(() => t.max, (i) => {
      const u = Vc(t.max);
      u !== i && (s.value = u);
    }, { immediate: !0 });
    const l = O(() => tt(a.value) ? "indeterminate" : a.value === s.value ? "complete" : "loading");
    return Rc({
      modelValue: a,
      max: s,
      progressState: l
    }), (i, u) => (m(), _(r(z), {
      "as-child": i.asChild,
      as: i.as,
      "aria-valuemax": r(s),
      "aria-valuemin": 0,
      "aria-valuenow": fo(r(a)) ? r(a) : void 0,
      "aria-valuetext": i.getValueText?.(r(a), r(s)),
      "aria-label": i.getValueLabel(r(a), r(s)),
      role: "progressbar",
      "data-state": l.value,
      "data-value": r(a) ?? void 0,
      "data-max": r(s)
    }, {
      default: g(() => [b(i.$slots, "default", { modelValue: r(a) })]),
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
}), Lc = Nc, zc = /* @__PURE__ */ h({
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
    const o = e, t = Mc();
    return V(), (n, a) => (m(), _(r(z), E(o, {
      "data-state": r(t).progressState.value,
      "data-value": r(t).modelValue?.value ?? void 0,
      "data-max": r(t).max.value
    }), {
      default: g(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, [
      "data-state",
      "data-value",
      "data-max"
    ]));
  }
}), Kc = zc;
const Hc = "radio.select";
function jc(e, o, t) {
  mo(Hc, t, {
    originalEvent: e,
    value: o
  });
}
var Wc = /* @__PURE__ */ h({
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
    const t = e, n = o, a = fe(t, "checked", n, { passive: t.checked === void 0 }), { value: s } = se(t), { forwardRef: l, currentElement: i } = V(), u = Dt(i), d = O(() => t.id && i.value ? document.querySelector(`[for="${t.id}"]`)?.innerText ?? t.value : void 0);
    function c(p) {
      t.disabled || jc(p, t.value, (f) => {
        n("select", f), !f?.defaultPrevented && (a.value = !0, u.value && f.stopPropagation());
      });
    }
    return (p, f) => (m(), _(r(z), E(p.$attrs, {
      id: p.id,
      ref: r(l),
      role: "radio",
      type: p.as === "button" ? "button" : void 0,
      as: p.as,
      "aria-checked": r(a),
      "aria-label": d.value,
      "as-child": p.asChild,
      disabled: p.disabled ? "" : void 0,
      "data-state": r(a) ? "checked" : "unchecked",
      "data-disabled": p.disabled ? "" : void 0,
      value: r(s),
      required: p.required,
      name: p.name,
      onClick: we(c, ["stop"])
    }), {
      default: g(() => [b(p.$slots, "default", { checked: r(a) }), r(u) && p.name ? (m(), _(r(Gt), {
        key: 0,
        type: "radio",
        tabindex: "-1",
        value: r(s),
        checked: !!r(a),
        name: p.name,
        disabled: p.disabled,
        required: p.required
      }, null, 8, [
        "value",
        "checked",
        "name",
        "disabled",
        "required"
      ])) : ce("v-if", !0)]),
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
}), Uc = Wc;
const [Gc, Yc] = ee("RadioGroupRoot");
var Xc = /* @__PURE__ */ h({
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
    const t = e, n = o, { forwardRef: a, currentElement: s } = V(), l = fe(t, "modelValue", n, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    }), { disabled: i, loop: u, orientation: d, name: c, required: p, dir: f } = se(t), v = st(f), y = Dt(s);
    return Yc({
      modelValue: l,
      changeModelValue: (w) => {
        l.value = w;
      },
      disabled: i,
      loop: u,
      orientation: d,
      name: c?.value,
      required: p
    }), (w, S) => (m(), _(r(yn), {
      "as-child": "",
      orientation: r(d),
      dir: r(v),
      loop: r(u)
    }, {
      default: g(() => [M(r(z), {
        ref: r(a),
        role: "radiogroup",
        "data-disabled": r(i) ? "" : void 0,
        "as-child": w.asChild,
        as: w.as,
        "aria-orientation": r(d),
        "aria-required": r(p),
        dir: r(v)
      }, {
        default: g(() => [b(w.$slots, "default", { modelValue: r(l) }), r(y) && r(c) ? (m(), _(r(Gt), {
          key: 0,
          required: r(p),
          disabled: r(i),
          value: r(l),
          name: r(c)
        }, null, 8, [
          "required",
          "disabled",
          "value",
          "name"
        ])) : ce("v-if", !0)]),
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
}), Jc = Xc;
const [Zc, Qc] = ee("RadioGroupItem");
var ep = /* @__PURE__ */ h({
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
    const t = e, n = o, { forwardRef: a, currentElement: s } = V(), l = Gc(), i = O(() => l.disabled.value || t.disabled), u = O(() => l.required.value || t.required), d = O(() => ut(l.modelValue?.value, t.value));
    Qc({
      disabled: i,
      checked: d
    });
    const c = T(!1), p = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight"
    ];
    Ge("keydown", (v) => {
      p.includes(v.key) && (c.value = !0);
    }), Ge("keyup", () => {
      c.value = !1;
    });
    function f() {
      setTimeout(() => {
        c.value && s.value?.click();
      }, 0);
    }
    return (v, y) => (m(), _(r(hn), {
      checked: d.value,
      disabled: i.value,
      "as-child": "",
      focusable: !i.value,
      active: d.value
    }, {
      default: g(() => [M(Uc, E({
        ...v.$attrs,
        ...t
      }, {
        ref: r(a),
        checked: d.value,
        required: u.value,
        disabled: i.value,
        "onUpdate:checked": y[0] || (y[0] = (w) => r(l).changeModelValue(v.value)),
        onSelect: y[1] || (y[1] = (w) => n("select", w)),
        onKeydown: y[2] || (y[2] = Tt(we(() => {
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
}), tp = ep, op = /* @__PURE__ */ h({
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
    const { forwardRef: o } = V(), t = Zc();
    return (n, a) => (m(), _(r(De), { present: n.forceMount || r(t).checked.value }, {
      default: g(() => [M(r(z), E({
        ref: r(o),
        "data-state": r(t).checked.value ? "checked" : "unchecked",
        "data-disabled": r(t).disabled.value ? "" : void 0,
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
}), np = op;
const ap = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], rp = [" ", "Enter"], ke = 10;
function Kt(e, o, t) {
  return e === void 0 ? !1 : Array.isArray(e) ? e.some((n) => en(n, o, t)) : en(e, o, t);
}
function en(e, o, t) {
  return e === void 0 || o === void 0 ? !1 : typeof e == "string" ? e === o : typeof t == "function" ? t(e, o) : typeof t == "string" ? e?.[t] === o?.[t] : ut(e, o);
}
function sp(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
const lp = {
  key: 0,
  value: ""
}, [lt, vr] = ee("SelectRoot");
var ip = /* @__PURE__ */ h({
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
    const t = e, n = o, { required: a, disabled: s, multiple: l, dir: i } = se(t), u = fe(t, "modelValue", n, {
      defaultValue: t.defaultValue ?? (l.value ? [] : void 0),
      passive: t.modelValue === void 0,
      deep: !0
    }), d = fe(t, "open", n, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), c = T(), p = T(), f = T({
      x: 0,
      y: 0
    }), v = O(() => l.value && Array.isArray(u.value) ? u.value?.length === 0 : tt(u.value));
    Ee({ isProvider: !0 });
    const y = st(i), w = Dt(c), S = T(/* @__PURE__ */ new Set()), P = O(() => Array.from(S.value).map((x) => x.value).join(";"));
    function B(x) {
      if (l.value) {
        const k = Array.isArray(u.value) ? [...u.value] : [], R = k.findIndex((F) => en(F, x, t.by));
        R === -1 ? k.push(x) : k.splice(R, 1), u.value = [...k];
      } else u.value = x;
    }
    function q(x) {
      return Array.from(S.value).find((k) => Kt(x, k.value, t.by));
    }
    return vr({
      triggerElement: c,
      onTriggerChange: (x) => {
        c.value = x;
      },
      valueElement: p,
      onValueElementChange: (x) => {
        p.value = x;
      },
      contentId: "",
      modelValue: u,
      onValueChange: B,
      by: t.by,
      open: d,
      multiple: l,
      required: a,
      onOpenChange: (x) => {
        d.value = x;
      },
      dir: y,
      triggerPointerDownPosRef: f,
      disabled: s,
      isEmptyModelValue: v,
      optionsSet: S,
      onOptionAdd: (x) => {
        const k = q(x.value);
        k && S.value.delete(k), S.value.add(x);
      },
      onOptionRemove: (x) => {
        const k = q(x.value);
        k && S.value.delete(k);
      }
    }), (x, k) => (m(), _(r(Yt), null, {
      default: g(() => [b(x.$slots, "default", {
        modelValue: r(u),
        open: r(d)
      }), r(w) ? (m(), _(cp, {
        key: P.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: r(l),
        required: r(a),
        name: x.name,
        autocomplete: x.autocomplete,
        disabled: r(s),
        value: r(u)
      }, {
        default: g(() => [r(tt)(r(u)) ? (m(), K("option", lp)) : ce("v-if", !0), (m(!0), K(xe, null, Bt(Array.from(S.value), (R) => (m(), K("option", E({ key: R.value ?? "" }, { ref_for: !0 }, R), null, 16))), 128))]),
        _: 1
      }, 8, [
        "multiple",
        "required",
        "name",
        "autocomplete",
        "disabled",
        "value"
      ])) : ce("v-if", !0)]),
      _: 3
    }));
  }
}), up = ip, dp = /* @__PURE__ */ h({
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
    const o = e, t = T(), n = lt();
    re(() => o.value, (s, l) => {
      const i = window.HTMLSelectElement.prototype, d = Object.getOwnPropertyDescriptor(i, "value").set;
      if (s !== l && d && t.value) {
        const c = new Event("change", { bubbles: !0 });
        d.call(t.value, s), t.value.dispatchEvent(c);
      }
    });
    function a(s) {
      n.onValueChange(s.target.value);
    }
    return (s, l) => (m(), _(r(bn), { "as-child": "" }, {
      default: g(() => [me("select", E({
        ref_key: "selectElement",
        ref: t
      }, o, { onInput: a }), [b(s.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), cp = dp, pp = /* @__PURE__ */ h({
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
      default: ke
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
    return (n, a) => (m(), _(r(Oo), E(r(t), { style: {
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
}), fp = pp;
const vp = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [mt, mr] = ee("SelectContent");
var mp = /* @__PURE__ */ h({
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
    const t = e, n = o, a = lt();
    un(), bo(t.bodyLock);
    const { CollectionSlot: s, getItems: l } = Ee(), i = T();
    _o(i);
    const { search: u, handleTypeaheadSearch: d } = dn(), c = T(), p = T(), f = T(), v = T(!1), y = T(!1), w = T(!1);
    function S() {
      p.value && i.value && Go([p.value, i.value]);
    }
    re(v, () => {
      S();
    });
    const { onOpenChange: P, triggerPointerDownPosRef: B } = a;
    ae((R) => {
      if (!i.value) return;
      let F = {
        x: 0,
        y: 0
      };
      const L = (C) => {
        F = {
          x: Math.abs(Math.round(C.pageX) - (B.value?.x ?? 0)),
          y: Math.abs(Math.round(C.pageY) - (B.value?.y ?? 0))
        };
      }, A = (C) => {
        C.pointerType !== "touch" && (F.x <= 10 && F.y <= 10 ? C.preventDefault() : i.value?.contains(C.target) || P(!1), document.removeEventListener("pointermove", L), B.value = null);
      };
      B.value !== null && (document.addEventListener("pointermove", L), document.addEventListener("pointerup", A, {
        capture: !0,
        once: !0
      })), R(() => {
        document.removeEventListener("pointermove", L), document.removeEventListener("pointerup", A, { capture: !0 });
      });
    });
    function q(R) {
      const F = R.ctrlKey || R.altKey || R.metaKey;
      if (R.key === "Tab" && R.preventDefault(), !F && R.key.length === 1 && d(R.key, l()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(R.key)) {
        let A = [...l().map((C) => C.ref)];
        if (["ArrowUp", "End"].includes(R.key) && (A = A.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(R.key)) {
          const C = R.target, $ = A.indexOf(C);
          A = A.slice($ + 1);
        }
        setTimeout(() => Go(A)), R.preventDefault();
      }
    }
    const x = O(() => t.position === "popper" ? t : {}), k = ge(x.value);
    return mr({
      content: i,
      viewport: c,
      onViewportChange: (R) => {
        c.value = R;
      },
      itemRefCallback: (R, F, L) => {
        const A = !y.value && !L, C = Kt(a.modelValue.value, F, a.by);
        if (a.multiple.value) {
          if (w.value) return;
          (C || A) && (p.value = R, C && (w.value = !0));
        } else (C || A) && (p.value = R);
        A && (y.value = !0);
      },
      selectedItem: p,
      selectedItemText: f,
      onItemLeave: () => {
        i.value?.focus();
      },
      itemTextRefCallback: (R, F, L) => {
        const A = !y.value && !L;
        (Kt(a.modelValue.value, F, a.by) || A) && (f.value = R);
      },
      focusSelectedItem: S,
      position: t.position,
      isPositioned: v,
      searchRef: u
    }), (R, F) => (m(), _(r(s), null, {
      default: g(() => [M(r(Co), {
        "as-child": "",
        onMountAutoFocus: F[6] || (F[6] = we(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: F[7] || (F[7] = (L) => {
          n("closeAutoFocus", L), !L.defaultPrevented && (r(a).triggerElement.value?.focus({ preventScroll: !0 }), L.preventDefault());
        })
      }, {
        default: g(() => [M(r(Wt), {
          "as-child": "",
          "disable-outside-pointer-events": R.disableOutsidePointerEvents,
          onFocusOutside: F[2] || (F[2] = we(() => {
          }, ["prevent"])),
          onDismiss: F[3] || (F[3] = (L) => r(a).onOpenChange(!1)),
          onEscapeKeyDown: F[4] || (F[4] = (L) => n("escapeKeyDown", L)),
          onPointerDownOutside: F[5] || (F[5] = (L) => n("pointerDownOutside", L))
        }, {
          default: g(() => [(m(), _($e(R.position === "popper" ? fp : bp), E({
            ...R.$attrs,
            ...r(k)
          }, {
            id: r(a).contentId,
            ref: (L) => {
              const A = r(Ke)(L);
              A?.hasAttribute("data-reka-popper-content-wrapper") ? i.value = A.firstElementChild : i.value = A;
            },
            role: "listbox",
            "data-state": r(a).open.value ? "open" : "closed",
            dir: r(a).dir.value,
            style: {
              display: "flex",
              flexDirection: "column",
              outline: "none"
            },
            onContextmenu: F[0] || (F[0] = we(() => {
            }, ["prevent"])),
            onPlaced: F[1] || (F[1] = (L) => v.value = !0),
            onKeydown: q
          }), {
            default: g(() => [b(R.$slots, "default")]),
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
}), gp = mp;
const [An, yp] = ee("SelectItemAlignedPosition");
var hp = /* @__PURE__ */ h({
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
    const t = e, n = o, { getItems: a } = Ee(), s = lt(), l = mt(), i = T(!1), u = T(!0), d = T(), { forwardRef: c, currentElement: p } = V(), { viewport: f, selectedItem: v, selectedItemText: y, focusSelectedItem: w } = l;
    function S() {
      if (s.triggerElement.value && s.valueElement.value && d.value && p.value && f?.value && v?.value && y?.value) {
        const q = s.triggerElement.value.getBoundingClientRect(), x = p.value.getBoundingClientRect(), k = s.valueElement.value.getBoundingClientRect(), R = y.value.getBoundingClientRect();
        if (s.dir.value !== "rtl") {
          const D = R.left - x.left, ie = k.left - D, Z = q.left - ie, ne = q.width + Z, be = Math.max(ne, x.width), Oe = window.innerWidth - ke, ht = ro(ie, ke, Math.max(ke, Oe - be));
          d.value.style.minWidth = `${ne}px`, d.value.style.left = `${ht}px`;
        } else {
          const D = x.right - R.right, ie = window.innerWidth - k.right - D, Z = window.innerWidth - q.right - ie, ne = q.width + Z, be = Math.max(ne, x.width), Oe = window.innerWidth - ke, ht = ro(ie, ke, Math.max(ke, Oe - be));
          d.value.style.minWidth = `${ne}px`, d.value.style.right = `${ht}px`;
        }
        const F = a().map((D) => D.ref), L = window.innerHeight - ke * 2, A = f.value.scrollHeight, C = window.getComputedStyle(p.value), $ = Number.parseInt(C.borderTopWidth, 10), I = Number.parseInt(C.paddingTop, 10), H = Number.parseInt(C.borderBottomWidth, 10), j = Number.parseInt(C.paddingBottom, 10), oe = $ + I + A + j + H, J = Math.min(v.value.offsetHeight * 5, oe), te = window.getComputedStyle(f.value), le = Number.parseInt(te.paddingTop, 10), ve = Number.parseInt(te.paddingBottom, 10), qe = q.top + q.height / 2 - ke, he = L - qe, gt = v.value.offsetHeight / 2, Eo = v.value.offsetTop + gt, yt = $ + I + Eo, ko = oe - yt;
        if (yt <= qe) {
          const D = v.value === F[F.length - 1];
          d.value.style.bottom = "0px";
          const ie = p.value.clientHeight - f.value.offsetTop - f.value.offsetHeight, Z = Math.max(he, gt + (D ? ve : 0) + ie + H), ne = yt + Z;
          d.value.style.height = `${ne}px`;
        } else {
          const D = v.value === F[0];
          d.value.style.top = "0px";
          const Z = Math.max(qe, $ + f.value.offsetTop + (D ? le : 0) + gt) + ko;
          d.value.style.height = `${Z}px`, f.value.scrollTop = yt - qe + f.value.offsetTop;
        }
        d.value.style.margin = `${ke}px 0`, d.value.style.minHeight = `${J}px`, d.value.style.maxHeight = `${L}px`, n("placed"), requestAnimationFrame(() => i.value = !0);
      }
    }
    const P = T("");
    pe(async () => {
      await de(), S(), p.value && (P.value = window.getComputedStyle(p.value).zIndex);
    });
    function B(q) {
      q && u.value === !0 && (S(), w?.(), u.value = !1);
    }
    return zs(s.triggerElement, () => {
      S();
    }), yp({
      contentWrapper: d,
      shouldExpandOnScrollRef: i,
      onScrollButtonChange: B
    }), (q, x) => (m(), K("div", {
      ref_key: "contentWrapperElement",
      ref: d,
      style: Ae({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: P.value
      })
    }, [M(r(z), E({
      ref: r(c),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...q.$attrs,
      ...t
    }), {
      default: g(() => [b(q.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), bp = hp, _p = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(e) {
    return vr(e.context), mr(vp), (t, n) => b(t.$slots, "default");
  }
}), wp = _p;
const Cp = { key: 1 };
var Sp = /* @__PURE__ */ h({
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
    const t = e, a = Q(t, o), s = lt(), l = T();
    pe(() => {
      l.value = new DocumentFragment();
    });
    const i = T(), u = O(() => t.forceMount || s.open.value), d = T(u.value);
    return re(u, () => {
      setTimeout(() => d.value = u.value);
    }), (c, p) => u.value || d.value || i.value?.present ? (m(), _(r(De), {
      key: 0,
      ref_key: "presenceRef",
      ref: i,
      present: u.value
    }, {
      default: g(() => [M(gp, W(Y({
        ...r(a),
        ...c.$attrs
      })), {
        default: g(() => [b(c.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : l.value ? (m(), K("div", Cp, [(m(), _(ga, { to: l.value }, [M(wp, { context: r(s) }, {
      default: g(() => [b(c.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : ce("v-if", !0);
  }
}), xp = Sp;
const [qp, Bp] = ee("SelectGroup");
var Pp = /* @__PURE__ */ h({
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
    const o = e, t = _e(void 0, "reka-select-group");
    return Bp({ id: t }), (n, a) => (m(), _(r(z), E({ role: "group" }, o, { "aria-labelledby": r(t) }), {
      default: g(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["aria-labelledby"]));
  }
}), Op = Pp, Tp = /* @__PURE__ */ h({
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
    return (o, t) => (m(), _(r(z), {
      "aria-hidden": "true",
      as: o.as,
      "as-child": o.asChild
    }, {
      default: g(() => [b(o.$slots, "default", {}, () => [t[0] || (t[0] = Pt("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Ap = Tp;
const [gr, Dp] = ee("SelectItem");
var Ep = /* @__PURE__ */ h({
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
    const t = e, n = o, { disabled: a } = se(t), s = lt(), l = mt(), { forwardRef: i, currentElement: u } = V(), { CollectionItem: d } = Ee(), c = O(() => Kt(s.modelValue?.value, t.value, s.by)), p = T(!1), f = T(t.textValue ?? ""), v = _e(void 0, "reka-select-item-text"), y = "select.select";
    async function w(x) {
      if (x.defaultPrevented) return;
      const k = {
        originalEvent: x,
        value: t.value
      };
      mo(y, S, k);
    }
    async function S(x) {
      await de(), n("select", x), !x.defaultPrevented && (a.value || (s.onValueChange(t.value), s.multiple.value || s.onOpenChange(!1)));
    }
    async function P(x) {
      await de(), !x.defaultPrevented && (a.value ? l.onItemLeave?.() : x.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function B(x) {
      await de(), !x.defaultPrevented && x.currentTarget === Ce() && l.onItemLeave?.();
    }
    async function q(x) {
      await de(), !(x.defaultPrevented || l.searchRef?.value !== "" && x.key === " ") && (rp.includes(x.key) && w(x), x.key === " " && x.preventDefault());
    }
    if (t.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return pe(() => {
      u.value && l.itemRefCallback(u.value, t.value, t.disabled);
    }), Dp({
      value: t.value,
      disabled: a,
      textId: v,
      isSelected: c,
      onItemTextChange: (x) => {
        f.value = ((f.value || x?.textContent) ?? "").trim();
      }
    }), (x, k) => (m(), _(r(d), { value: { textValue: f.value } }, {
      default: g(() => [M(r(z), {
        ref: r(i),
        role: "option",
        "aria-labelledby": r(v),
        "data-highlighted": p.value ? "" : void 0,
        "aria-selected": c.value,
        "data-state": c.value ? "checked" : "unchecked",
        "aria-disabled": r(a) || void 0,
        "data-disabled": r(a) ? "" : void 0,
        tabindex: r(a) ? void 0 : -1,
        as: x.as,
        "as-child": x.asChild,
        onFocus: k[0] || (k[0] = (R) => p.value = !0),
        onBlur: k[1] || (k[1] = (R) => p.value = !1),
        onPointerup: w,
        onPointerdown: k[2] || (k[2] = (R) => {
          R.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: k[3] || (k[3] = we(() => {
        }, ["prevent", "stop"])),
        onPointermove: P,
        onPointerleave: B,
        onKeydown: q
      }, {
        default: g(() => [b(x.$slots, "default")]),
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
}), kp = Ep, $p = /* @__PURE__ */ h({
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
    const o = e, t = gr();
    return (n, a) => r(t).isSelected.value ? (m(), _(r(z), E({
      key: 0,
      "aria-hidden": "true"
    }, o), {
      default: g(() => [b(n.$slots, "default")]),
      _: 3
    }, 16)) : ce("v-if", !0);
  }
}), Ip = $p, Mp = /* @__PURE__ */ h({
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
    const o = e, t = lt(), n = mt(), a = gr(), { forwardRef: s, currentElement: l } = V(), i = O(() => ({
      value: a.value,
      disabled: a.disabled.value,
      textContent: l.value?.textContent ?? a.value?.toString() ?? ""
    }));
    return pe(() => {
      l.value && (a.onItemTextChange(l.value), n.itemTextRefCallback(l.value, a.value, a.disabled.value), t.onOptionAdd(i.value));
    }), rt(() => {
      t.onOptionRemove(i.value);
    }), (u, d) => (m(), _(r(z), E({
      id: r(a).textId,
      ref: r(s)
    }, {
      ...o,
      ...u.$attrs
    }), {
      default: g(() => [b(u.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), yr = Mp, Rp = /* @__PURE__ */ h({
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
    const o = e, t = qp({ id: "" });
    return (n, a) => (m(), _(r(z), E(o, { id: r(t).id }), {
      default: g(() => [b(n.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Fp = Rp, Vp = /* @__PURE__ */ h({
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
    return (t, n) => (m(), _(r(Ut), W(Y(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Np = Vp, Lp = /* @__PURE__ */ h({
  __name: "SelectScrollButtonImpl",
  emits: ["autoScroll"],
  setup(e, { emit: o }) {
    const t = o, { getItems: n } = Ee(), a = mt(), s = T(null);
    function l() {
      s.value !== null && (window.clearInterval(s.value), s.value = null);
    }
    ae(() => {
      n().map((c) => c.ref).find((c) => c === Ce())?.scrollIntoView({ block: "nearest" });
    });
    function i() {
      s.value === null && (s.value = window.setInterval(() => {
        t("autoScroll");
      }, 50));
    }
    function u() {
      a.onItemLeave?.(), s.value === null && (s.value = window.setInterval(() => {
        t("autoScroll");
      }, 50));
    }
    return nn(() => l()), (d, c) => (m(), _(r(z), E({
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
}), hr = Lp, zp = /* @__PURE__ */ h({
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
    const o = mt(), t = o.position === "item-aligned" ? An() : void 0, { forwardRef: n, currentElement: a } = V(), s = T(!1);
    return ae((l) => {
      if (o.viewport?.value && o.isPositioned?.value) {
        let u = function() {
          const d = i.scrollHeight - i.clientHeight;
          s.value = Math.ceil(i.scrollTop) < d;
        };
        const i = o.viewport.value;
        u(), i.addEventListener("scroll", u), l(() => i.removeEventListener("scroll", u));
      }
    }), re(a, () => {
      a.value && t?.onScrollButtonChange(a.value);
    }), (l, i) => s.value ? (m(), _(hr, {
      key: 0,
      ref: r(n),
      onAutoScroll: i[0] || (i[0] = () => {
        const { viewport: u, selectedItem: d } = r(o);
        u?.value && d?.value && (u.value.scrollTop = u.value.scrollTop + d.value.offsetHeight);
      })
    }, {
      default: g(() => [b(l.$slots, "default")]),
      _: 3
    }, 512)) : ce("v-if", !0);
  }
}), Kp = zp, Hp = /* @__PURE__ */ h({
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
    const o = mt(), t = o.position === "item-aligned" ? An() : void 0, { forwardRef: n, currentElement: a } = V(), s = T(!1);
    return ae((l) => {
      if (o.viewport?.value && o.isPositioned?.value) {
        let u = function() {
          s.value = i.scrollTop > 0;
        };
        const i = o.viewport.value;
        u(), i.addEventListener("scroll", u), l(() => i.removeEventListener("scroll", u));
      }
    }), re(a, () => {
      a.value && t?.onScrollButtonChange(a.value);
    }), (l, i) => s.value ? (m(), _(hr, {
      key: 0,
      ref: r(n),
      onAutoScroll: i[0] || (i[0] = () => {
        const { viewport: u, selectedItem: d } = r(o);
        u?.value && d?.value && (u.value.scrollTop = u.value.scrollTop - d.value.offsetHeight);
      })
    }, {
      default: g(() => [b(l.$slots, "default")]),
      _: 3
    }, 512)) : ce("v-if", !0);
  }
}), jp = Hp, Wp = /* @__PURE__ */ h({
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
    return (t, n) => (m(), _(r(z), E({ "aria-hidden": "true" }, o), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Up = Wp, Gp = /* @__PURE__ */ h({
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
    const o = e, t = lt(), { forwardRef: n, currentElement: a } = V(), s = O(() => t.disabled?.value || o.disabled);
    t.contentId ||= _e(void 0, "reka-select-content"), pe(() => {
      t.onTriggerChange(a.value);
    });
    const { getItems: l } = Ee(), { search: i, handleTypeaheadSearch: u, resetTypeahead: d } = dn();
    function c() {
      s.value || (t.onOpenChange(!0), d());
    }
    function p(f) {
      c(), t.triggerPointerDownPosRef.value = {
        x: Math.round(f.pageX),
        y: Math.round(f.pageY)
      };
    }
    return (f, v) => (m(), _(r(So), {
      "as-child": "",
      reference: f.reference
    }, {
      default: g(() => [M(r(z), {
        ref: r(n),
        role: "combobox",
        type: f.as === "button" ? "button" : void 0,
        "aria-controls": r(t).contentId,
        "aria-expanded": r(t).open.value || !1,
        "aria-required": r(t).required?.value,
        "aria-autocomplete": "none",
        disabled: s.value,
        dir: r(t)?.dir.value,
        "data-state": r(t)?.open.value ? "open" : "closed",
        "data-disabled": s.value ? "" : void 0,
        "data-placeholder": r(sp)(r(t).modelValue?.value) ? "" : void 0,
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
        onPointerup: v[2] || (v[2] = we((y) => {
          y.pointerType === "touch" && p(y);
        }, ["prevent"])),
        onKeydown: v[3] || (v[3] = (y) => {
          const w = r(i) !== "";
          !(y.ctrlKey || y.altKey || y.metaKey) && y.key.length === 1 && w && y.key === " " || (r(u)(y.key, r(l)()), r(ap).includes(y.key) && (c(), y.preventDefault()));
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
}), Yp = Gp, Xp = /* @__PURE__ */ h({
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
    const o = e, { forwardRef: t, currentElement: n } = V(), a = lt();
    pe(() => {
      a.valueElement = n;
    });
    const s = O(() => {
      let i = [];
      const u = Array.from(a.optionsSet.value), d = (c) => u.find((p) => Kt(c, p.value, a.by));
      return Array.isArray(a.modelValue.value) ? i = a.modelValue.value.map((c) => d(c)?.textContent ?? "") : i = [d(a.modelValue.value)?.textContent ?? ""], i.filter(Boolean);
    }), l = O(() => s.value.length ? s.value.join(", ") : o.placeholder);
    return (i, u) => (m(), _(r(z), {
      ref: r(t),
      as: i.as,
      "as-child": i.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": s.value.length ? void 0 : o.placeholder
    }, {
      default: g(() => [b(i.$slots, "default", {
        selectedLabel: s.value,
        modelValue: r(a).modelValue.value
      }, () => [Pt(Ct(l.value), 1)])]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-placeholder"
    ]));
  }
}), Jp = Xp, Zp = /* @__PURE__ */ h({
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
    const o = e, { nonce: t } = se(o), n = od(t), a = mt(), s = a.position === "item-aligned" ? An() : void 0, { forwardRef: l, currentElement: i } = V();
    pe(() => {
      a?.onViewportChange(i.value);
    });
    const u = T(0);
    function d(c) {
      const p = c.currentTarget, { shouldExpandOnScrollRef: f, contentWrapper: v } = s ?? {};
      if (f?.value && v?.value) {
        const y = Math.abs(u.value - p.scrollTop);
        if (y > 0) {
          const w = window.innerHeight - ke * 2, S = Number.parseFloat(v.value.style.minHeight), P = Number.parseFloat(v.value.style.height), B = Math.max(S, P);
          if (B < w) {
            const q = B + y, x = Math.min(w, q), k = q - x;
            v.value.style.height = `${x}px`, v.value.style.bottom === "0px" && (p.scrollTop = k > 0 ? k : 0, v.value.style.justifyContent = "flex-end");
          }
        }
      }
      u.value = p.scrollTop;
    }
    return (c, p) => (m(), K(xe, null, [M(r(z), E({
      ref: r(l),
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
    }, 16), M(r(z), {
      as: "style",
      nonce: r(n)
    }, {
      default: g(() => p[0] || (p[0] = [Pt(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), Qp = Zp, ef = /* @__PURE__ */ h({
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
    const a = O(() => n(o.orientation) ? o.orientation : "horizontal"), s = O(() => a.value === "vertical" ? o.orientation : void 0), l = O(() => o.decorative ? { role: "none" } : {
      "aria-orientation": s.value,
      role: "separator"
    });
    return (i, u) => (m(), _(r(z), E({
      as: i.as,
      "as-child": i.asChild,
      "data-orientation": a.value
    }, l.value), {
      default: g(() => [b(i.$slots, "default")]),
      _: 3
    }, 16, [
      "as",
      "as-child",
      "data-orientation"
    ]));
  }
}), tf = ef, of = /* @__PURE__ */ h({
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
    return (t, n) => (m(), _(tf, W(Y(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), nf = of;
function af(e = [], o, t) {
  const n = [...e];
  return n[t] = o, n.sort((a, s) => a - s);
}
function br(e, o, t) {
  const s = 100 / (t - o) * (e - o);
  return ro(s, 0, 100);
}
function rf(e, o) {
  return o > 2 ? `Value ${e + 1} of ${o}` : o === 2 ? ["Minimum", "Maximum"][e] : void 0;
}
function sf(e, o) {
  if (e.length === 1) return 0;
  const t = e.map((a) => Math.abs(a - o)), n = Math.min(...t);
  return t.indexOf(n);
}
function lf(e, o, t) {
  const n = e / 2, s = Dn([0, 50], [0, n]);
  return (n - s(o) * t) * t;
}
function uf(e) {
  return e.slice(0, -1).map((o, t) => e[t + 1] - o);
}
function df(e, o) {
  if (o > 0) {
    const t = uf(e);
    return Math.min(...t) >= o;
  }
  return !0;
}
function Dn(e, o) {
  return (t) => {
    if (e[0] === e[1] || o[0] === o[1]) return o[0];
    const n = (o[1] - o[0]) / (e[1] - e[0]);
    return o[0] + n * (t - e[0]);
  };
}
function cf(e) {
  return (String(e).split(".")[1] || "").length;
}
function pf(e, o) {
  const t = 10 ** o;
  return Math.round(e * t) / t;
}
const _r = ["PageUp", "PageDown"], wr = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight"
], Cr = {
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
}, [Sr, xr] = ee(["SliderVertical", "SliderHorizontal"]);
var ff = /* @__PURE__ */ h({
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
    const t = e, n = o, { max: a, min: s, dir: l, inverted: i } = se(t), { forwardRef: u, currentElement: d } = V(), c = kt(), p = T(), f = T(), v = O(() => l?.value !== "rtl" && !i.value || l?.value !== "ltr" && i.value);
    function y(B, q) {
      const x = f.value || d.value.getBoundingClientRect(), k = [...c.thumbElements.value][c.valueIndexToChangeRef.value], R = c.thumbAlignment.value === "contain" ? k.clientWidth : 0;
      !p.value && !q && c.thumbAlignment.value === "contain" && (p.value = B.clientX - k.getBoundingClientRect().left);
      const F = [0, x.width - R], L = v.value ? [s.value, a.value] : [a.value, s.value], A = Dn(F, L);
      f.value = x;
      const C = q ? B.clientX - x.left - R / 2 : B.clientX - x.left - (p.value ?? 0);
      return A(C);
    }
    const w = O(() => v.value ? "left" : "right"), S = O(() => v.value ? "right" : "left"), P = O(() => v.value ? 1 : -1);
    return xr({
      startEdge: w,
      endEdge: S,
      direction: P,
      size: "width"
    }), (B, q) => (m(), _(qr, {
      ref: r(u),
      dir: r(l),
      "data-orientation": "horizontal",
      style: Ae({ "--reka-slider-thumb-transform": !v.value && r(c).thumbAlignment.value === "overflow" ? "translateX(50%)" : "translateX(-50%)" }),
      onSlideStart: q[0] || (q[0] = (x) => {
        const k = y(x, !0);
        n("slideStart", k);
      }),
      onSlideMove: q[1] || (q[1] = (x) => {
        const k = y(x);
        n("slideMove", k);
      }),
      onSlideEnd: q[2] || (q[2] = () => {
        f.value = void 0, p.value = void 0, n("slideEnd");
      }),
      onStepKeyDown: q[3] || (q[3] = (x) => {
        const k = v.value ? "from-left" : "from-right", R = r(Cr)[k].includes(x.key);
        n("stepKeyDown", x, R ? -1 : 1);
      }),
      onEndKeyDown: q[4] || (q[4] = (x) => n("endKeyDown", x)),
      onHomeKeyDown: q[5] || (q[5] = (x) => n("homeKeyDown", x))
    }, {
      default: g(() => [b(B.$slots, "default")]),
      _: 3
    }, 8, ["dir", "style"]));
  }
}), vf = ff, mf = /* @__PURE__ */ h({
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
    const t = e, n = o, { max: a, min: s, inverted: l } = se(t), i = kt(), { forwardRef: u, currentElement: d } = V(), c = T(), p = T(), f = O(() => !l.value);
    function v(P, B) {
      const q = p.value || d.value.getBoundingClientRect(), x = [...i.thumbElements.value][i.valueIndexToChangeRef.value], k = i.thumbAlignment.value === "contain" ? x.clientHeight : 0;
      !c.value && !B && i.thumbAlignment.value === "contain" && (c.value = P.clientY - x.getBoundingClientRect().top);
      const R = [0, q.height - k], F = f.value ? [a.value, s.value] : [s.value, a.value], L = Dn(R, F), A = B ? P.clientY - q.top - k / 2 : P.clientY - q.top - (c.value ?? 0);
      return p.value = q, L(A);
    }
    const y = O(() => f.value ? "bottom" : "top"), w = O(() => f.value ? "top" : "bottom"), S = O(() => f.value ? 1 : -1);
    return xr({
      startEdge: y,
      endEdge: w,
      direction: S,
      size: "height"
    }), (P, B) => (m(), _(qr, {
      ref: r(u),
      "data-orientation": "vertical",
      style: Ae({ "--reka-slider-thumb-transform": !f.value && r(i).thumbAlignment.value === "overflow" ? "translateY(-50%)" : "translateY(50%)" }),
      onSlideStart: B[0] || (B[0] = (q) => {
        const x = v(q, !0);
        n("slideStart", x);
      }),
      onSlideMove: B[1] || (B[1] = (q) => {
        const x = v(q);
        n("slideMove", x);
      }),
      onSlideEnd: B[2] || (B[2] = () => {
        p.value = void 0, c.value = void 0, n("slideEnd");
      }),
      onStepKeyDown: B[3] || (B[3] = (q) => {
        const x = f.value ? "from-bottom" : "from-top", k = r(Cr)[x].includes(q.key);
        n("stepKeyDown", q, k ? -1 : 1);
      }),
      onEndKeyDown: B[4] || (B[4] = (q) => n("endKeyDown", q)),
      onHomeKeyDown: B[5] || (B[5] = (q) => n("homeKeyDown", q))
    }, {
      default: g(() => [b(P.$slots, "default")]),
      _: 3
    }, 8, ["style"]));
  }
}), gf = mf;
const [kt, yf] = ee("SliderRoot");
var hf = /* @__PURE__ */ h({
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
    const t = e, n = o, { min: a, max: s, step: l, minStepsBetweenThumbs: i, orientation: u, disabled: d, thumbAlignment: c, dir: p } = se(t), f = st(p), { forwardRef: v, currentElement: y } = V(), w = Dt(y), { CollectionSlot: S } = Ee({ isProvider: !0 }), P = fe(t, "modelValue", n, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    }), B = O(() => Array.isArray(P.value) ? [...P.value] : []), q = T(0), x = T(B.value);
    function k(C) {
      const $ = sf(B.value, C);
      L(C, $);
    }
    function R(C) {
      L(C, q.value);
    }
    function F() {
      const C = x.value[q.value];
      B.value[q.value] !== C && n("valueCommit", Kr(B.value));
    }
    function L(C, $, { commit: I } = { commit: !1 }) {
      const H = cf(l.value), j = pf(Math.round((C - a.value) / l.value) * l.value + a.value, H), oe = ro(j, a.value, s.value), J = af(B.value, oe, $);
      if (df(J, i.value * l.value)) {
        q.value = J.indexOf(oe);
        const te = String(J) !== String(P.value);
        te && I && n("valueCommit", J), te && (A.value[q.value]?.focus(), P.value = J);
      }
    }
    const A = T([]);
    return yf({
      modelValue: P,
      currentModelValue: B,
      valueIndexToChangeRef: q,
      thumbElements: A,
      orientation: u,
      min: a,
      max: s,
      disabled: d,
      thumbAlignment: c
    }), (C, $) => (m(), _(r(S), null, {
      default: g(() => [(m(), _($e(r(u) === "horizontal" ? vf : gf), E(C.$attrs, {
        ref: r(v),
        "as-child": C.asChild,
        as: C.as,
        min: r(a),
        max: r(s),
        dir: r(f),
        inverted: C.inverted,
        "aria-disabled": r(d),
        "data-disabled": r(d) ? "" : void 0,
        onPointerdown: $[0] || ($[0] = () => {
          r(d) || (x.value = B.value);
        }),
        onSlideStart: $[1] || ($[1] = (I) => !r(d) && k(I)),
        onSlideMove: $[2] || ($[2] = (I) => !r(d) && R(I)),
        onSlideEnd: $[3] || ($[3] = (I) => !r(d) && F()),
        onHomeKeyDown: $[4] || ($[4] = (I) => !r(d) && L(r(a), 0, { commit: !0 })),
        onEndKeyDown: $[5] || ($[5] = (I) => !r(d) && L(r(s), B.value.length - 1, { commit: !0 })),
        onStepKeyDown: $[6] || ($[6] = (I, H) => {
          if (!r(d)) {
            const J = r(_r).includes(I.key) || I.shiftKey && r(wr).includes(I.key) ? 10 : 1, te = q.value, le = B.value[te], ve = r(l) * J * H;
            L(le + ve, te, { commit: !0 });
          }
        })
      }), {
        default: g(() => [b(C.$slots, "default", { modelValue: r(P) }), r(w) && C.name ? (m(), _(r(Gt), {
          key: 0,
          type: "number",
          value: r(P),
          name: C.name,
          required: C.required,
          disabled: r(d),
          step: r(l)
        }, null, 8, [
          "value",
          "name",
          "required",
          "disabled",
          "step"
        ])) : ce("v-if", !0)]),
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
}), bf = hf, _f = /* @__PURE__ */ h({
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
    const t = e, n = o, a = kt();
    return (s, l) => (m(), _(r(z), E({ "data-slider-impl": "" }, t, {
      onKeydown: l[0] || (l[0] = (i) => {
        i.key === "Home" ? (n("homeKeyDown", i), i.preventDefault()) : i.key === "End" ? (n("endKeyDown", i), i.preventDefault()) : r(_r).concat(r(wr)).includes(i.key) && (n("stepKeyDown", i), i.preventDefault());
      }),
      onPointerdown: l[1] || (l[1] = (i) => {
        const u = i.target;
        u.setPointerCapture(i.pointerId), i.preventDefault(), r(a).thumbElements.value.includes(u) ? u.focus() : n("slideStart", i);
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
}), qr = _f, wf = /* @__PURE__ */ h({
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
    const o = kt(), t = Sr();
    V();
    const n = O(() => o.currentModelValue.value.map((l) => br(l, o.min.value, o.max.value))), a = O(() => o.currentModelValue.value.length > 1 ? Math.min(...n.value) : 0), s = O(() => 100 - Math.max(...n.value, 0));
    return (l, i) => (m(), _(r(z), {
      "data-disabled": r(o).disabled.value ? "" : void 0,
      "data-orientation": r(o).orientation.value,
      "as-child": l.asChild,
      as: l.as,
      style: Ae({
        [r(t).startEdge.value]: `${a.value}%`,
        [r(t).endEdge.value]: `${s.value}%`
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
}), Cf = wf, Sf = /* @__PURE__ */ h({
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
    const o = e, t = kt(), n = Sr(), { forwardRef: a, currentElement: s } = V(), { CollectionItem: l } = Ee(), i = O(() => t.modelValue?.value?.[o.index]), u = O(() => i.value === void 0 ? 0 : br(i.value, t.min.value ?? 0, t.max.value ?? 100)), d = O(() => rf(o.index, t.modelValue?.value?.length ?? 0)), c = $a(s), p = O(() => c[n.size].value), f = O(() => t.thumbAlignment.value === "overflow" || !p.value ? 0 : lf(p.value, u.value, n.direction.value)), v = ln();
    return pe(() => {
      t.thumbElements.value.push(s.value);
    }), rt(() => {
      const y = t.thumbElements.value.findIndex((w) => w === s.value) ?? -1;
      t.thumbElements.value.splice(y, 1);
    }), (y, w) => (m(), _(r(l), null, {
      default: g(() => [M(r(z), E(y.$attrs, {
        ref: r(a),
        role: "slider",
        tabindex: r(t).disabled.value ? void 0 : 0,
        "aria-label": y.$attrs["aria-label"] || d.value,
        "data-disabled": r(t).disabled.value ? "" : void 0,
        "data-orientation": r(t).orientation.value,
        "aria-valuenow": i.value,
        "aria-valuemin": r(t).min.value,
        "aria-valuemax": r(t).max.value,
        "aria-orientation": r(t).orientation.value,
        "as-child": y.asChild,
        as: y.as,
        style: {
          transform: "var(--reka-slider-thumb-transform)",
          position: "absolute",
          [r(n).startEdge.value]: `calc(${u.value}% + ${f.value}px)`,
          display: !r(v) && i.value === void 0 ? "none" : void 0
        },
        onFocus: w[0] || (w[0] = () => {
          r(t).valueIndexToChangeRef.value = y.index;
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
}), xf = Sf, qf = /* @__PURE__ */ h({
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
    const o = e, { getItems: t } = Ee(), { forwardRef: n, currentElement: a } = V(), s = O(() => a.value ? t(!0).findIndex((l) => l.ref === a.value) : -1);
    return (l, i) => (m(), _(xf, E({ ref: r(n) }, o, { index: s.value }), {
      default: g(() => [b(l.$slots, "default")]),
      _: 3
    }, 16, ["index"]));
  }
}), Bf = qf, Pf = /* @__PURE__ */ h({
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
    const o = kt();
    return V(), (t, n) => (m(), _(r(z), {
      "as-child": t.asChild,
      as: t.as,
      "data-disabled": r(o).disabled.value ? "" : void 0,
      "data-orientation": r(o).orientation.value
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
}), Of = Pf;
const [Tf, Af] = ee("SwitchRoot");
var Df = /* @__PURE__ */ h({
  __name: "SwitchRoot",
  props: {
    defaultValue: {
      type: Boolean,
      required: !1
    },
    modelValue: {
      type: [Boolean, null],
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
    const t = e, n = o, { disabled: a } = se(t), s = fe(t, "modelValue", n, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    });
    function l() {
      a.value || (s.value = !s.value);
    }
    const { forwardRef: i, currentElement: u } = V(), d = Dt(u), c = O(() => t.id && u.value ? document.querySelector(`[for="${t.id}"]`)?.innerText : void 0);
    return Af({
      modelValue: s,
      toggleCheck: l,
      disabled: a
    }), (p, f) => (m(), _(r(z), E(p.$attrs, {
      id: p.id,
      ref: r(i),
      role: "switch",
      type: p.as === "button" ? "button" : void 0,
      value: p.value,
      "aria-label": p.$attrs["aria-label"] || c.value,
      "aria-checked": r(s),
      "aria-required": p.required,
      "data-state": r(s) ? "checked" : "unchecked",
      "data-disabled": r(a) ? "" : void 0,
      "as-child": p.asChild,
      as: p.as,
      disabled: r(a),
      onClick: l,
      onKeydown: Tt(we(l, ["prevent"]), ["enter"])
    }), {
      default: g(() => [b(p.$slots, "default", { modelValue: r(s) }), r(d) && p.name ? (m(), _(r(Gt), {
        key: 0,
        type: "checkbox",
        name: p.name,
        disabled: r(a),
        required: p.required,
        value: p.value,
        checked: !!r(s)
      }, null, 8, [
        "name",
        "disabled",
        "required",
        "value",
        "checked"
      ])) : ce("v-if", !0)]),
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
}), Ef = Df, kf = /* @__PURE__ */ h({
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
    const o = Tf();
    return V(), (t, n) => (m(), _(r(z), {
      "data-state": r(o).modelValue?.value ? "checked" : "unchecked",
      "data-disabled": r(o).disabled.value ? "" : void 0,
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
}), $f = kf;
const [En, If] = ee("TabsRoot");
var Mf = /* @__PURE__ */ h({
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
    const t = e, n = o, { orientation: a, unmountOnHide: s, dir: l } = se(t), i = st(l);
    V();
    const u = fe(t, "modelValue", n, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    }), d = T();
    return If({
      modelValue: u,
      changeModelValue: (c) => {
        u.value = c;
      },
      orientation: a,
      dir: i,
      unmountOnHide: s,
      activationMode: t.activationMode,
      baseId: _e(void 0, "reka-tabs"),
      tabsList: d
    }), (c, p) => (m(), _(r(z), {
      dir: r(i),
      "data-orientation": r(a),
      "as-child": c.asChild,
      as: c.as
    }, {
      default: g(() => [b(c.$slots, "default", { modelValue: r(u) })]),
      _: 3
    }, 8, [
      "dir",
      "data-orientation",
      "as-child",
      "as"
    ]));
  }
}), Rf = Mf;
function Br(e, o) {
  return `${e}-trigger-${o}`;
}
function Pr(e, o) {
  return `${e}-content-${o}`;
}
var Ff = /* @__PURE__ */ h({
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
    const o = e, { forwardRef: t } = V(), n = En(), a = O(() => Br(n.baseId, o.value)), s = O(() => Pr(n.baseId, o.value)), l = O(() => o.value === n.modelValue.value), i = T(l.value);
    return pe(() => {
      requestAnimationFrame(() => {
        i.value = !1;
      });
    }), (u, d) => (m(), _(r(De), {
      present: u.forceMount || l.value,
      "force-mount": ""
    }, {
      default: g(({ present: c }) => [M(r(z), {
        id: s.value,
        ref: r(t),
        "as-child": u.asChild,
        as: u.as,
        role: "tabpanel",
        "data-state": l.value ? "active" : "inactive",
        "data-orientation": r(n).orientation.value,
        "aria-labelledby": a.value,
        hidden: !c,
        tabindex: "0",
        style: Ae({ animationDuration: i.value ? "0s" : void 0 })
      }, {
        default: g(() => [!r(n).unmountOnHide.value || c ? b(u.$slots, "default", { key: 0 }) : ce("v-if", !0)]),
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
}), Vf = Ff, Nf = /* @__PURE__ */ h({
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
    const o = e, { loop: t } = se(o), { forwardRef: n, currentElement: a } = V(), s = En();
    return s.tabsList = a, (l, i) => (m(), _(r(yn), {
      "as-child": "",
      orientation: r(s).orientation.value,
      dir: r(s).dir.value,
      loop: r(t)
    }, {
      default: g(() => [M(r(z), {
        ref: r(n),
        role: "tablist",
        "as-child": l.asChild,
        as: l.as,
        "aria-orientation": r(s).orientation.value
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
}), Lf = Nf, zf = /* @__PURE__ */ h({
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
    const o = e, { forwardRef: t } = V(), n = En(), a = O(() => Br(n.baseId, o.value)), s = O(() => Pr(n.baseId, o.value)), l = O(() => o.value === n.modelValue.value);
    return (i, u) => (m(), _(r(hn), {
      "as-child": "",
      focusable: !i.disabled,
      active: l.value
    }, {
      default: g(() => [M(r(z), {
        id: a.value,
        ref: r(t),
        role: "tab",
        type: i.as === "button" ? "button" : void 0,
        as: i.as,
        "as-child": i.asChild,
        "aria-selected": l.value ? "true" : "false",
        "aria-controls": s.value,
        "data-state": l.value ? "active" : "inactive",
        disabled: i.disabled,
        "data-disabled": i.disabled ? "" : void 0,
        "data-orientation": r(n).orientation.value,
        onMousedown: u[0] || (u[0] = we((d) => {
          !i.disabled && d.ctrlKey === !1 ? r(n).changeModelValue(i.value) : d.preventDefault();
        }, ["left"])),
        onKeydown: u[1] || (u[1] = Tt((d) => r(n).changeModelValue(i.value), ["enter", "space"])),
        onFocus: u[2] || (u[2] = () => {
          const d = r(n).activationMode !== "manual";
          !l.value && !i.disabled && d && r(n).changeModelValue(i.value);
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
}), Kf = zf;
const [kn, Hf] = ee("TooltipProvider");
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
    }
  },
  setup(e) {
    const o = e, { delayDuration: t, skipDelayDuration: n, disableHoverableContent: a, disableClosingTrigger: s, ignoreNonKeyboardFocus: l, disabled: i } = se(o);
    V();
    const u = T(!0), d = T(!1), { start: c, stop: p } = Da(() => {
      u.value = !0;
    }, n, { immediate: !1 });
    return Hf({
      isOpenDelayed: u,
      delayDuration: t,
      onOpen() {
        p(), u.value = !1;
      },
      onClose() {
        c();
      },
      isPointerInTransitRef: d,
      disableHoverableContent: a,
      disableClosingTrigger: s,
      disabled: i,
      ignoreNonKeyboardFocus: l
    }), (f, v) => b(f.$slots, "default");
  }
}), Wf = jf;
const Or = "tooltip.open", [To, Uf] = ee("TooltipRoot");
var Gf = /* @__PURE__ */ h({
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
    const a = kn(), s = O(() => t.disableHoverableContent ?? a.disableHoverableContent.value), l = O(() => t.disableClosingTrigger ?? a.disableClosingTrigger.value), i = O(() => t.disabled ?? a.disabled.value), u = O(() => t.delayDuration ?? a.delayDuration.value), d = O(() => t.ignoreNonKeyboardFocus ?? a.ignoreNonKeyboardFocus.value), c = fe(t, "open", n, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    });
    re(c, (q) => {
      a.onClose && (q ? (a.onOpen(), document.dispatchEvent(new CustomEvent(Or))) : a.onClose());
    });
    const p = T(!1), f = T(), v = O(() => c.value ? p.value ? "delayed-open" : "instant-open" : "closed"), { start: y, stop: w } = Da(() => {
      p.value = !0, c.value = !0;
    }, u, { immediate: !1 });
    function S() {
      w(), p.value = !1, c.value = !0;
    }
    function P() {
      w(), c.value = !1;
    }
    function B() {
      y();
    }
    return Uf({
      contentId: "",
      open: c,
      stateAttribute: v,
      trigger: f,
      onTriggerChange(q) {
        f.value = q;
      },
      onTriggerEnter() {
        a.isOpenDelayed.value ? B() : S();
      },
      onTriggerLeave() {
        s.value ? P() : w();
      },
      onOpen: S,
      onClose: P,
      disableHoverableContent: s,
      disableClosingTrigger: l,
      disabled: i,
      ignoreNonKeyboardFocus: d
    }), (q, x) => (m(), _(r(Yt), null, {
      default: g(() => [b(q.$slots, "default", { open: r(c) })]),
      _: 3
    }));
  }
}), Yf = Gf, Xf = /* @__PURE__ */ h({
  __name: "TooltipContentImpl",
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
      required: !1,
      default: "top"
    },
    sideOffset: {
      type: Number,
      required: !1,
      default: 0
    },
    align: {
      type: null,
      required: !1,
      default: "center"
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1,
      default: !0
    },
    collisionBoundary: {
      type: null,
      required: !1,
      default: () => []
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1,
      default: 0
    },
    arrowPadding: {
      type: Number,
      required: !1,
      default: 0
    },
    sticky: {
      type: String,
      required: !1,
      default: "partial"
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1,
      default: !1
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
    const t = e, n = o, a = To(), { forwardRef: s, currentElement: l } = V(), i = O(() => t.ariaLabel || l.value?.textContent), u = O(() => {
      const { ariaLabel: d, ...c } = t;
      return c;
    });
    return pe(() => {
      Ge(window, "scroll", (d) => {
        d.target?.contains(a.trigger.value) && a.onClose();
      }), Ge(window, Or, a.onClose);
    }), (d, c) => (m(), _(r(Wt), {
      "as-child": "",
      "disable-outside-pointer-events": !1,
      onEscapeKeyDown: c[0] || (c[0] = (p) => n("escapeKeyDown", p)),
      onPointerDownOutside: c[1] || (c[1] = (p) => {
        r(a).disableClosingTrigger.value && r(a).trigger.value?.contains(p.target) && p.preventDefault(), n("pointerDownOutside", p);
      }),
      onFocusOutside: c[2] || (c[2] = we(() => {
      }, ["prevent"])),
      onDismiss: c[3] || (c[3] = (p) => r(a).onClose())
    }, {
      default: g(() => [M(r(Oo), E({
        ref: r(s),
        "data-state": r(a).stateAttribute.value
      }, {
        ...d.$attrs,
        ...u.value
      }, { style: {
        "--reka-tooltip-content-transform-origin": "var(--reka-popper-transform-origin)",
        "--reka-tooltip-content-available-width": "var(--reka-popper-available-width)",
        "--reka-tooltip-content-available-height": "var(--reka-popper-available-height)",
        "--reka-tooltip-trigger-width": "var(--reka-popper-anchor-width)",
        "--reka-tooltip-trigger-height": "var(--reka-popper-anchor-height)"
      } }), {
        default: g(() => [b(d.$slots, "default"), M(r(bn), {
          id: r(a).contentId,
          role: "tooltip"
        }, {
          default: g(() => [Pt(Ct(i.value), 1)]),
          _: 1
        }, 8, ["id"])]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }));
  }
}), Tr = Xf, Jf = /* @__PURE__ */ h({
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
    const t = ge(e), { forwardRef: n, currentElement: a } = V(), { trigger: s, onClose: l } = To(), i = kn(), { isPointerInTransit: u, onPointerExit: d } = Us(s, a);
    return i.isPointerInTransitRef = u, d(() => {
      l();
    }), (c, p) => (m(), _(Tr, E({ ref: r(n) }, r(t)), {
      default: g(() => [b(c.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Zf = Jf, Qf = /* @__PURE__ */ h({
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
      required: !1,
      default: "top"
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
    const t = e, n = o, a = To(), s = Q(t, n), { forwardRef: l } = V();
    return (i, u) => (m(), _(r(De), { present: i.forceMount || r(a).open.value }, {
      default: g(() => [(m(), _($e(r(a).disableHoverableContent.value ? Tr : Zf), E({ ref: r(l) }, r(s)), {
        default: g(() => [b(i.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), ev = Qf, tv = /* @__PURE__ */ h({
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
    return (t, n) => (m(), _(r(Ut), W(Y(o)), {
      default: g(() => [b(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), ov = tv, nv = /* @__PURE__ */ h({
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
    const o = e, t = To(), n = kn();
    t.contentId ||= _e(void 0, "reka-tooltip-content");
    const { forwardRef: a, currentElement: s } = V(), l = T(!1), i = T(!1), u = O(() => t.disabled.value ? {} : {
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
    return (S, P) => (m(), _(r(So), {
      "as-child": "",
      reference: S.reference
    }, {
      default: g(() => [M(r(z), E({
        ref: r(a),
        "aria-describedby": r(t).open.value ? r(t).contentId : void 0,
        "data-state": r(t).stateAttribute.value,
        as: S.as,
        "as-child": o.asChild,
        "data-grace-area-trigger": ""
      }, Hr(u.value)), {
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
}), av = nv;
const Vm = /* @__PURE__ */ h({
  __name: "Button",
  props: {
    variant: {},
    size: {},
    class: {},
    asChild: { type: Boolean },
    as: { default: "button" }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(r(z), {
      as: e.as,
      "as-child": e.asChild,
      class: U(r(N)(r(rv)({ variant: e.variant, size: e.size }), o.class))
    }, {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "class"]));
  }
}), rv = Ht(
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
), Nm = /* @__PURE__ */ h({
  __name: "Card",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("div", {
      class: U(
        r(N)(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          o.class
        )
      )
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Lm = /* @__PURE__ */ h({
  __name: "CardContent",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("div", {
      class: U(r(N)("p-6 pt-0", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), zm = /* @__PURE__ */ h({
  __name: "CardDescription",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("p", {
      class: U(r(N)("text-sm text-muted-foreground", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Km = /* @__PURE__ */ h({
  __name: "CardFooter",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("div", {
      class: U(r(N)("flex items-center p-6 pt-0", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Hm = /* @__PURE__ */ h({
  __name: "CardHeader",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("div", {
      class: U(r(N)("flex flex-col gap-y-1.5 p-6", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), jm = /* @__PURE__ */ h({
  __name: "CardTitle",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("h3", {
      class: U(
        r(N)("text-2xl font-semibold leading-none tracking-tight", o.class)
      )
    }, [
      b(t.$slots, "default")
    ], 2));
  }
});
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const sv = (e) => typeof e < "u";
function lv(e) {
  return Le(e) ? qt(new Proxy({}, {
    get(o, t, n) {
      return r(Reflect.get(e.value, t, n));
    },
    set(o, t, n) {
      return Le(e.value[t]) && !Le(n) ? e.value[t].value = n : e.value[t] = n, !0;
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
  })) : qt(e);
}
function iv(e) {
  return lv(O(e));
}
function X(e, ...o) {
  const t = o.flat(), n = t[0];
  return iv(() => Object.fromEntries(typeof n == "function" ? Object.entries(se(e)).filter(([a, s]) => !n(ye(s), a)) : Object.entries(se(e)).filter((a) => !t.includes(a[0]))));
}
function uv(e) {
  return JSON.parse(JSON.stringify(e));
}
// @__NO_SIDE_EFFECTS__
function Ar(e, o, t, n = {}) {
  var a, s;
  const { clone: l = !1, passive: i = !1, eventName: u, deep: d = !1, defaultValue: c, shouldEmit: p } = n, f = at(), v = t || f?.emit || (f == null || (a = f.$emit) === null || a === void 0 ? void 0 : a.bind(f)) || (f == null || (s = f.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(f?.proxy));
  let y = u;
  y = y || `update:${o.toString()}`;
  const w = (B) => l ? typeof l == "function" ? l(B) : uv(B) : B, S = () => sv(e[o]) ? w(e[o]) : c, P = (B) => {
    p ? p(B) && v(y, B) : v(y, B);
  };
  if (i) {
    const B = T(S());
    let q = !1;
    return re(() => e[o], (x) => {
      q || (q = !0, B.value = w(x), de(() => q = !1));
    }), re(B, (x) => {
      !q && (x !== e[o] || d) && P(x);
    }, { deep: d }), B;
  } else return O({
    get() {
      return S();
    },
    set(B) {
      P(B);
    }
  });
}
const Wm = /* @__PURE__ */ h({
  __name: "Input",
  props: {
    defaultValue: {},
    modelValue: {},
    class: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, a = /* @__PURE__ */ Ar(t, "modelValue", o, {
      passive: !0,
      defaultValue: t.defaultValue
    });
    return (s, l) => an((m(), K("input", {
      "onUpdate:modelValue": l[0] || (l[0] = (i) => Le(a) ? a.value = i : null),
      class: U(r(N)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", t.class))
    }, null, 2)), [
      [ba, r(a)]
    ]);
  }
}), Um = /* @__PURE__ */ h({
  __name: "Dialog",
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const a = Q(e, o);
    return (s, l) => (m(), _(r(Ma), W(Y(r(a))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Gm = /* @__PURE__ */ h({
  __name: "DialogClose",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(r(jt), W(Y(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
});
const ia = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), dv = (e) => e.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (o, t, n) => n ? n.toUpperCase() : t.toLowerCase()
), cv = (e) => {
  const o = dv(e);
  return o.charAt(0).toUpperCase() + o.slice(1);
}, pv = (...e) => e.filter((o, t, n) => !!o && o.trim() !== "" && n.indexOf(o) === t).join(" ").trim(), ua = (e) => e === "";
var Rt = {
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
const fv = ({
  name: e,
  iconNode: o,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": n,
  strokeWidth: a,
  "stroke-width": s,
  size: l = Rt.width,
  color: i = Rt.stroke,
  ...u
}, { slots: d }) => Ie(
  "svg",
  {
    ...Rt,
    ...u,
    width: l,
    height: l,
    stroke: i,
    "stroke-width": ua(t) || ua(n) || t === !0 || n === !0 ? Number(a || s || Rt["stroke-width"]) * 24 / Number(l) : a || s || Rt["stroke-width"],
    class: pv(
      "lucide",
      u.class,
      ...e ? [`lucide-${ia(cv(e))}-icon`, `lucide-${ia(e)}`] : ["lucide-icon"]
    )
  },
  [...o.map((c) => Ie(...c)), ...d.default ? [d.default()] : []]
);
const Ve = (e, o) => (t, { slots: n, attrs: a }) => Ie(
  fv,
  {
    ...a,
    ...t,
    iconNode: o,
    name: e
  },
  n
);
const $n = Ve("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const In = Ve("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const vv = Ve("chevron-right", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
const mv = Ve("chevron-up", [
  ["path", { d: "m18 15-6-6-6 6", key: "153udz" }]
]);
const gv = Ve("circle-check", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
const Dr = Ve("circle", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
]);
const yv = Ve("info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);
const hv = Ve("loader-circle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const bv = Ve("octagon-x", [
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
const _v = Ve("triangle-alert", [
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
const Ao = Ve("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), Ym = /* @__PURE__ */ h({
  __name: "DialogContent",
  props: {
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(e, { emit: o }) {
    const t = e, n = o, a = X(t, "class"), s = Q(a, n);
    return (l, i) => (m(), _(r(gn), null, {
      default: g(() => [
        M(r(mn), { class: "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }),
        M(r(vn), E(r(s), {
          class: r(N)(
            "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
            t.class
          )
        }), {
          default: g(() => [
            b(l.$slots, "default"),
            M(r(jt), { class: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" }, {
              default: g(() => [
                M(r(Ao), { class: "w-4 h-4" }),
                i[0] || (i[0] = me("span", { class: "sr-only" }, "Close", -1))
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
}), Xm = /* @__PURE__ */ h({
  __name: "DialogDescription",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class"), n = ge(t);
    return (a, s) => (m(), _(r(La), E(r(n), {
      class: r(N)("text-sm text-muted-foreground", o.class)
    }), {
      default: g(() => [
        b(a.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Jm = /* @__PURE__ */ h({
  __name: "DialogFooter",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("div", {
      class: U(
        r(N)(
          "flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2",
          o.class
        )
      )
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Zm = /* @__PURE__ */ h({
  __name: "DialogHeader",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("div", {
      class: U(r(N)("flex flex-col gap-y-1.5 text-center sm:text-left", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Qm = /* @__PURE__ */ h({
  __name: "DialogScrollContent",
  props: {
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(e, { emit: o }) {
    const t = e, n = o, a = X(t, "class"), s = Q(a, n);
    return (l, i) => (m(), _(r(gn), null, {
      default: g(() => [
        M(r(mn), { class: "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }, {
          default: g(() => [
            M(r(vn), E({
              class: r(N)(
                "relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full",
                t.class
              )
            }, r(s), {
              onPointerDownOutside: i[0] || (i[0] = (u) => {
                const d = u.detail.originalEvent, c = d.target;
                (d.offsetX > c.clientWidth || d.offsetY > c.clientHeight) && u.preventDefault();
              })
            }), {
              default: g(() => [
                b(l.$slots, "default"),
                M(r(jt), { class: "absolute top-3 right-3 p-0.5 transition-colors rounded-md hover:bg-secondary" }, {
                  default: g(() => [
                    M(r(Ao), { class: "w-4 h-4" }),
                    i[1] || (i[1] = me("span", { class: "sr-only" }, "Close", -1))
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
}), eg = /* @__PURE__ */ h({
  __name: "DialogTitle",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class"), n = ge(t);
    return (a, s) => (m(), _(r(za), E(r(n), {
      class: r(N)(
        "text-lg font-semibold leading-none tracking-tight",
        o.class
      )
    }), {
      default: g(() => [
        b(a.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), tg = /* @__PURE__ */ h({
  __name: "DialogTrigger",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(r(Ka), W(Y(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), og = /* @__PURE__ */ h({
  __name: "Badge",
  props: {
    variant: {},
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("div", {
      class: U(r(N)(r(wv)({ variant: e.variant }), o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), wv = Ht(
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
), ng = /* @__PURE__ */ h({
  __name: "Avatar",
  props: {
    class: {},
    size: { default: "sm" },
    shape: { default: "circle" }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(r(wi), {
      class: U(r(N)(r(Cv)({ size: e.size, shape: e.shape }), o.class))
    }, {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), ag = /* @__PURE__ */ h({
  __name: "AvatarFallback",
  props: {
    delayMs: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(r(Si), W(Y(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), rg = /* @__PURE__ */ h({
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
    return (t, n) => (m(), _(r(Bi), E(o, { class: "h-full w-full object-cover" }), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Cv = Ht(
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
), sg = /* @__PURE__ */ h({
  __name: "Separator",
  props: {
    orientation: { default: "horizontal" },
    decorative: { type: Boolean, default: !0 },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class");
    return (n, a) => (m(), _(r(nf), E(r(t), {
      class: r(N)(
        "shrink-0 bg-border",
        o.orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
        o.class
      )
    }), null, 16, ["class"]));
  }
}), Sv = /* @__PURE__ */ h({
  __name: "Label",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class");
    return (n, a) => (m(), _(r(Ic), E(r(t), {
      class: r(N)(
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
}), lg = /* @__PURE__ */ h({
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
    const a = Q(e, o);
    return (s, l) => (m(), _(r(up), W(Y(r(a))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), ig = /* @__PURE__ */ h({
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
    class: {}
  },
  emits: ["closeAutoFocus", "escapeKeyDown", "pointerDownOutside"],
  setup(e, { emit: o }) {
    const t = e, n = o, a = X(t, "class"), s = Q(a, n);
    return (l, i) => (m(), _(r(Np), null, {
      default: g(() => [
        M(r(xp), E({ ...r(s), ...l.$attrs }, {
          class: r(N)(
            "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            e.position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            t.class
          )
        }), {
          default: g(() => [
            M(r(Bv)),
            M(r(Qp), {
              class: U(r(N)("p-1", e.position === "popper" && "h-[--reka-select-trigger-height] w-full min-w-[--reka-select-trigger-width]"))
            }, {
              default: g(() => [
                b(l.$slots, "default")
              ]),
              _: 3
            }, 8, ["class"]),
            M(r(qv))
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), ug = /* @__PURE__ */ h({
  __name: "SelectGroup",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class");
    return (n, a) => (m(), _(r(Op), E({
      class: r(N)("p-1 w-full", o.class)
    }, r(t)), {
      default: g(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), xv = { class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, dg = /* @__PURE__ */ h({
  __name: "SelectItem",
  props: {
    value: {},
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class"), n = ge(t);
    return (a, s) => (m(), _(r(kp), E(r(n), {
      class: r(N)(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        o.class
      )
    }), {
      default: g(() => [
        me("span", xv, [
          M(r(Ip), null, {
            default: g(() => [
              M(r($n), { class: "h-4 w-4" })
            ]),
            _: 1
          })
        ]),
        M(r(yr), null, {
          default: g(() => [
            b(a.$slots, "default")
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), cg = /* @__PURE__ */ h({
  __name: "SelectItemText",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(r(yr), W(Y(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), pg = /* @__PURE__ */ h({
  __name: "SelectLabel",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(r(Fp), {
      class: U(r(N)("py-1.5 pl-8 pr-2 text-sm font-semibold", o.class))
    }, {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), qv = /* @__PURE__ */ h({
  __name: "SelectScrollDownButton",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class"), n = ge(t);
    return (a, s) => (m(), _(r(Kp), E(r(n), {
      class: r(N)("flex cursor-default items-center justify-center py-1", o.class)
    }), {
      default: g(() => [
        b(a.$slots, "default", {}, () => [
          M(r(In), { class: "h-4 w-4" })
        ])
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Bv = /* @__PURE__ */ h({
  __name: "SelectScrollUpButton",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class"), n = ge(t);
    return (a, s) => (m(), _(r(jp), E(r(n), {
      class: r(N)("flex cursor-default items-center justify-center py-1", o.class)
    }), {
      default: g(() => [
        b(a.$slots, "default", {}, () => [
          M(r(mv), { class: "h-4 w-4" })
        ])
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), fg = /* @__PURE__ */ h({
  __name: "SelectSeparator",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class");
    return (n, a) => (m(), _(r(Up), E(r(t), {
      class: r(N)("-mx-1 my-1 h-px bg-muted", o.class)
    }), null, 16, ["class"]));
  }
}), vg = /* @__PURE__ */ h({
  __name: "SelectTrigger",
  props: {
    disabled: { type: Boolean },
    reference: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class"), n = ge(t);
    return (a, s) => (m(), _(r(Yp), E(r(n), {
      class: r(N)(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate text-start",
        o.class
      )
    }), {
      default: g(() => [
        b(a.$slots, "default"),
        M(r(Ap), { "as-child": "" }, {
          default: g(() => [
            M(r(In), { class: "w-4 h-4 opacity-50 shrink-0" })
          ]),
          _: 1
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), mg = /* @__PURE__ */ h({
  __name: "SelectValue",
  props: {
    placeholder: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(r(Jp), W(Y(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), gg = /* @__PURE__ */ h({
  __name: "Checkbox",
  props: {
    defaultValue: { type: [Boolean, String] },
    modelValue: { type: [Boolean, String, null] },
    disabled: { type: Boolean },
    value: {},
    id: {},
    asChild: { type: Boolean },
    as: {},
    name: {},
    required: { type: Boolean },
    class: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, n = o, a = X(t, "class"), s = Q(a, n);
    return (l, i) => (m(), _(r(Hi), E(r(s), {
      class: r(N)(
        "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        t.class
      )
    }), {
      default: g(() => [
        M(r(Wi), { class: "grid place-content-center text-current" }, {
          default: g(() => [
            b(l.$slots, "default", {}, () => [
              M(r($n), { class: "h-4 w-4" })
            ])
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), yg = /* @__PURE__ */ h({
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
    class: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, n = o, a = X(t, "class"), s = Q(a, n);
    return (l, i) => (m(), _(r(Jc), E({
      class: r(N)("grid gap-2", t.class)
    }, r(s)), {
      default: g(() => [
        b(l.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), hg = /* @__PURE__ */ h({
  __name: "RadioGroupItem",
  props: {
    id: {},
    value: {},
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    name: {},
    required: { type: Boolean },
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class"), n = ge(t);
    return (a, s) => (m(), _(r(tp), E(r(n), {
      class: r(N)(
        "peer aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        o.class
      )
    }), {
      default: g(() => [
        M(r(np), { class: "flex items-center justify-center" }, {
          default: g(() => [
            M(r(Dr), { class: "h-2.5 w-2.5 fill-current text-current" })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), bg = /* @__PURE__ */ h({
  __name: "Switch",
  props: {
    defaultValue: { type: Boolean },
    modelValue: { type: [Boolean, null] },
    disabled: { type: Boolean },
    id: {},
    value: {},
    asChild: { type: Boolean },
    as: {},
    name: {},
    required: { type: Boolean },
    class: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, n = o, a = X(t, "class"), s = Q(a, n);
    return (l, i) => (m(), _(r(Ef), E(r(s), {
      class: r(N)(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        t.class
      )
    }), {
      default: g(() => [
        M(r($f), {
          class: U(r(N)("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5"))
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
}), _g = /* @__PURE__ */ h({
  __name: "Textarea",
  props: {
    class: {},
    defaultValue: {},
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, a = /* @__PURE__ */ Ar(t, "modelValue", o, {
      passive: !0,
      defaultValue: t.defaultValue
    });
    return (s, l) => an((m(), K("textarea", {
      "onUpdate:modelValue": l[0] || (l[0] = (i) => Le(a) ? a.value = i : null),
      class: U(r(N)("flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", t.class))
    }, null, 2)), [
      [ba, r(a)]
    ]);
  }
}), wg = /* @__PURE__ */ h({
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
    class: {}
  },
  emits: ["update:modelValue", "valueCommit"],
  setup(e, { emit: o }) {
    const t = e, n = o, a = X(t, "class"), s = Q(a, n);
    return (l, i) => (m(), _(r(bf), E({
      class: r(N)(
        "relative flex w-full touch-none select-none items-center data-[orientation=vertical]:flex-col data-[orientation=vertical]:w-2 data-[orientation=vertical]:h-full",
        t.class
      )
    }, r(s)), {
      default: g(() => [
        M(r(Of), { class: "relative h-2 w-full data-[orientation=vertical]:w-2 grow overflow-hidden rounded-full bg-secondary" }, {
          default: g(() => [
            M(r(Cf), { class: "absolute h-full data-[orientation=vertical]:w-full bg-primary" })
          ]),
          _: 1
        }),
        (m(!0), K(xe, null, Bt(e.modelValue, (u, d) => (m(), _(r(Bf), {
          key: d,
          class: "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        }))), 128))
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), Cg = /* @__PURE__ */ h({
  __name: "Sheet",
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const a = Q(e, o);
    return (s, l) => (m(), _(r(Ma), W(Y(r(a))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Sg = /* @__PURE__ */ h({
  __name: "SheetClose",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(r(jt), W(Y(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), xg = /* @__PURE__ */ h({
  inheritAttrs: !1,
  __name: "SheetContent",
  props: {
    class: {},
    side: {},
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(e, { emit: o }) {
    const t = e, n = o, a = X(t, "class", "side"), s = Q(a, n);
    return (l, i) => (m(), _(r(gn), null, {
      default: g(() => [
        M(r(mn), { class: "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }),
        M(r(vn), E({
          class: r(N)(r(Pv)({ side: e.side }), t.class)
        }, { ...r(s), ...l.$attrs }), {
          default: g(() => [
            b(l.$slots, "default"),
            M(r(jt), { class: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary" }, {
              default: g(() => [
                M(r(Ao), { class: "w-4 h-4 text-muted-foreground" })
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
}), qg = /* @__PURE__ */ h({
  __name: "SheetDescription",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class");
    return (n, a) => (m(), _(r(La), E({
      class: r(N)("text-sm text-muted-foreground", o.class)
    }, r(t)), {
      default: g(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Bg = /* @__PURE__ */ h({
  __name: "SheetFooter",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("div", {
      class: U(
        r(N)(
          "flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2",
          o.class
        )
      )
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Pg = /* @__PURE__ */ h({
  __name: "SheetHeader",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("div", {
      class: U(
        r(N)("flex flex-col gap-y-2 text-center sm:text-left", o.class)
      )
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Og = /* @__PURE__ */ h({
  __name: "SheetTitle",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class");
    return (n, a) => (m(), _(r(za), E({
      class: r(N)("text-lg font-semibold text-foreground", o.class)
    }, r(t)), {
      default: g(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Tg = /* @__PURE__ */ h({
  __name: "SheetTrigger",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(r(Ka), W(Y(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Pv = Ht(
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
), Ag = /* @__PURE__ */ h({
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
    const a = Q(e, o);
    return (s, l) => (m(), _(r(Rf), W(Y(r(a))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Dg = /* @__PURE__ */ h({
  __name: "TabsContent",
  props: {
    value: {},
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class");
    return (n, a) => (m(), _(r(Vf), E({
      class: r(N)("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", o.class)
    }, r(t)), {
      default: g(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Eg = /* @__PURE__ */ h({
  __name: "TabsList",
  props: {
    loop: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class");
    return (n, a) => (m(), _(r(Lf), E(r(t), {
      class: r(N)(
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
}), Ov = { class: "truncate" }, kg = /* @__PURE__ */ h({
  __name: "TabsTrigger",
  props: {
    value: {},
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class"), n = ge(t);
    return (a, s) => (m(), _(r(Kf), E(r(n), {
      class: r(N)(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        o.class
      )
    }), {
      default: g(() => [
        me("span", Ov, [
          b(a.$slots, "default")
        ])
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), $g = /* @__PURE__ */ h({
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
    const a = Q(e, o);
    return (s, l) => (m(), _(r(Sl), W(Y(r(a))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Ig = /* @__PURE__ */ h({
  __name: "AccordionContent",
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class");
    return (n, a) => (m(), _(r(Ol), E(r(t), { class: "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down" }), {
      default: g(() => [
        me("div", {
          class: U(r(N)("pb-4 pt-0", o.class))
        }, [
          b(n.$slots, "default")
        ], 2)
      ]),
      _: 3
    }, 16));
  }
}), Mg = /* @__PURE__ */ h({
  __name: "AccordionItem",
  props: {
    disabled: { type: Boolean },
    value: {},
    unmountOnHide: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class"), n = ge(t);
    return (a, s) => (m(), _(r(Bl), E(r(n), {
      class: r(N)("border-b", o.class)
    }), {
      default: g(() => [
        b(a.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Rg = /* @__PURE__ */ h({
  __name: "AccordionTrigger",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class");
    return (n, a) => (m(), _(r(Al), { class: "flex" }, {
      default: g(() => [
        M(r(El), E(r(t), {
          class: r(N)(
            "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
            o.class
          )
        }), {
          default: g(() => [
            b(n.$slots, "default"),
            b(n.$slots, "icon", {}, () => [
              M(r(In), { class: "h-4 w-4 shrink-0 transition-transform duration-200" })
            ])
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), Fg = /* @__PURE__ */ h({
  __name: "DropdownMenu",
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean },
    dir: {},
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const a = Q(e, o);
    return (s, l) => (m(), _(r(ic), W(Y(r(a))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Tv = { class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, Vg = /* @__PURE__ */ h({
  __name: "DropdownMenuCheckboxItem",
  props: {
    modelValue: { type: [Boolean, String] },
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["select", "update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, n = o, a = X(t, "class"), s = Q(a, n);
    return (l, i) => (m(), _(r(rc), E(r(s), {
      class: r(N)(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        t.class
      )
    }), {
      default: g(() => [
        me("span", Tv, [
          M(r(fr), null, {
            default: g(() => [
              M(r($n), { class: "w-4 h-4" })
            ]),
            _: 1
          })
        ]),
        b(l.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Ng = /* @__PURE__ */ h({
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
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    disableUpdateOnLayoutShift: { type: Boolean },
    prioritizePosition: { type: Boolean },
    reference: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "closeAutoFocus"],
  setup(e, { emit: o }) {
    const t = e, n = o, a = X(t, "class"), s = Q(a, n);
    return (l, i) => (m(), _(r(bc), null, {
      default: g(() => [
        M(r(dc), E(r(s), {
          class: r(N)("z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", t.class)
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
}), Lg = /* @__PURE__ */ h({
  __name: "DropdownMenuGroup",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(r(pc), W(Y(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), zg = /* @__PURE__ */ h({
  __name: "DropdownMenuItem",
  props: {
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: {},
    inset: { type: Boolean }
  },
  setup(e) {
    const o = e, t = X(o, "class"), n = ge(t);
    return (a, s) => (m(), _(r(vc), E(r(n), {
      class: r(N)(
        "relative flex cursor-default select-none items-center rounded-sm gap-2 px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
        e.inset && "pl-8",
        o.class
      )
    }), {
      default: g(() => [
        b(a.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Kg = /* @__PURE__ */ h({
  __name: "DropdownMenuLabel",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {},
    inset: { type: Boolean }
  },
  setup(e) {
    const o = e, t = X(o, "class"), n = ge(t);
    return (a, s) => (m(), _(r(yc), E(r(n), {
      class: r(N)("px-2 py-1.5 text-sm font-semibold", e.inset && "pl-8", o.class)
    }), {
      default: g(() => [
        b(a.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Hg = /* @__PURE__ */ h({
  __name: "DropdownMenuRadioGroup",
  props: {
    modelValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = Q(e, o);
    return (s, l) => (m(), _(r(wc), W(Y(r(a))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Av = { class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, jg = /* @__PURE__ */ h({
  __name: "DropdownMenuRadioItem",
  props: {
    value: {},
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const t = e, n = o, a = X(t, "class"), s = Q(a, n);
    return (l, i) => (m(), _(r(Sc), E(r(s), {
      class: r(N)(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        t.class
      )
    }), {
      default: g(() => [
        me("span", Av, [
          M(r(fr), null, {
            default: g(() => [
              M(r(Dr), { class: "h-2 w-2 fill-current" })
            ]),
            _: 1
          })
        ]),
        b(l.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Wg = /* @__PURE__ */ h({
  __name: "DropdownMenuSeparator",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class");
    return (n, a) => (m(), _(r(qc), E(r(t), {
      class: r(N)("-mx-1 my-1 h-px bg-muted", o.class)
    }), null, 16, ["class"]));
  }
}), Ug = /* @__PURE__ */ h({
  __name: "DropdownMenuShortcut",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("span", {
      class: U(r(N)("ml-auto text-xs tracking-widest opacity-60", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Gg = /* @__PURE__ */ h({
  __name: "DropdownMenuSub",
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const a = Q(e, o);
    return (s, l) => (m(), _(r(Pc), W(Y(r(a))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Yg = /* @__PURE__ */ h({
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
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    disableUpdateOnLayoutShift: { type: Boolean },
    prioritizePosition: { type: Boolean },
    reference: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "entryFocus", "openAutoFocus", "closeAutoFocus"],
  setup(e, { emit: o }) {
    const t = e, n = o, a = X(t, "class"), s = Q(a, n);
    return (l, i) => (m(), _(r(Tc), E(r(s), {
      class: r(N)("z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", t.class)
    }), {
      default: g(() => [
        b(l.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Xg = /* @__PURE__ */ h({
  __name: "DropdownMenuSubTrigger",
  props: {
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class"), n = ge(t);
    return (a, s) => (m(), _(r(Dc), E(r(n), {
      class: r(N)(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
        o.class
      )
    }), {
      default: g(() => [
        b(a.$slots, "default"),
        M(r(vv), { class: "ml-auto h-4 w-4" })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Jg = /* @__PURE__ */ h({
  __name: "DropdownMenuTrigger",
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const t = ge(e);
    return (n, a) => (m(), _(r(kc), E({ class: "outline-none" }, r(t)), {
      default: g(() => [
        b(n.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Zg = /* @__PURE__ */ h({
  __name: "Popover",
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean },
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const a = Q(e, o);
    return (s, l) => (m(), _(r(Wd), W(Y(r(a))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Qg = /* @__PURE__ */ h({
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
    class: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(e, { emit: o }) {
    const t = e, n = o, a = X(t, "class"), s = Q(a, n);
    return (l, i) => (m(), _(r(tc), null, {
      default: g(() => [
        M(r(Qd), E({ ...r(s), ...l.$attrs }, {
          class: r(N)(
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
}), ey = /* @__PURE__ */ h({
  __name: "PopoverTrigger",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(r(nc), W(Y(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), ty = /* @__PURE__ */ h({
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
    const a = Q(e, o);
    return (s, l) => (m(), _(r(Yf), W(Y(r(a))), {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), oy = /* @__PURE__ */ h({
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
    class: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside"],
  setup(e, { emit: o }) {
    const t = e, n = o, a = X(t, "class"), s = Q(a, n);
    return (l, i) => (m(), _(r(ov), null, {
      default: g(() => [
        M(r(ev), E({ ...r(s), ...l.$attrs }, {
          class: r(N)("z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", t.class)
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
}), ny = /* @__PURE__ */ h({
  __name: "TooltipProvider",
  props: {
    delayDuration: {},
    skipDelayDuration: {},
    disableHoverableContent: { type: Boolean },
    disableClosingTrigger: { type: Boolean },
    disabled: { type: Boolean },
    ignoreNonKeyboardFocus: { type: Boolean }
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(r(Wf), W(Y(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), ay = /* @__PURE__ */ h({
  __name: "TooltipTrigger",
  props: {
    reference: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), _(r(av), W(Y(o)), {
      default: g(() => [
        b(t.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Dv = { class: "relative w-full overflow-auto" }, ry = /* @__PURE__ */ h({
  __name: "Table",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("div", Dv, [
      me("table", {
        class: U(r(N)("w-full caption-bottom text-sm", o.class))
      }, [
        b(t.$slots, "default")
      ], 2)
    ]));
  }
}), sy = /* @__PURE__ */ h({
  __name: "TableBody",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("tbody", {
      class: U(r(N)("[&_tr:last-child]:border-0", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), ly = /* @__PURE__ */ h({
  __name: "TableCaption",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("caption", {
      class: U(r(N)("mt-4 text-sm text-muted-foreground", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Ev = /* @__PURE__ */ h({
  __name: "TableCell",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("td", {
      class: U(
        r(N)(
          "p-4 align-middle [&:has([role=checkbox])]:pr-0",
          o.class
        )
      )
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), kv = /* @__PURE__ */ h({
  __name: "TableRow",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("tr", {
      class: U(r(N)("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), $v = { class: "flex items-center justify-center py-10" }, iy = /* @__PURE__ */ h({
  __name: "TableEmpty",
  props: {
    class: {},
    colspan: { default: 1 }
  },
  setup(e) {
    const o = e, t = X(o, "class");
    return (n, a) => (m(), _(kv, null, {
      default: g(() => [
        M(Ev, E({
          class: r(N)(
            "p-4 whitespace-nowrap align-middle text-sm text-foreground",
            o.class
          )
        }, r(t)), {
          default: g(() => [
            me("div", $v, [
              b(n.$slots, "default")
            ])
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), uy = /* @__PURE__ */ h({
  __name: "TableFooter",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("tfoot", {
      class: U(r(N)("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), dy = /* @__PURE__ */ h({
  __name: "TableHead",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("th", {
      class: U(r(N)("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), cy = /* @__PURE__ */ h({
  __name: "TableHeader",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("thead", {
      class: U(r(N)("[&_tr]:border-b", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), py = /* @__PURE__ */ h({
  __name: "Skeleton",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("div", {
      class: U(r(N)("animate-pulse rounded-md bg-muted", o.class))
    }, null, 2));
  }
}), fy = /* @__PURE__ */ h({
  __name: "Progress",
  props: {
    modelValue: { default: 0 },
    max: {},
    getValueLabel: {},
    getValueText: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, t = X(o, "class");
    return (n, a) => (m(), _(r(Lc), E(r(t), {
      class: r(N)(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        o.class
      )
    }), {
      default: g(() => [
        M(r(Kc), {
          class: "h-full w-full flex-1 bg-primary transition-all",
          style: Ae(`transform: translateX(-${100 - (o.modelValue ?? 0)}%);`)
        }, null, 8, ["style"])
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), vy = /* @__PURE__ */ h({
  __name: "Alert",
  props: {
    class: {},
    variant: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("div", {
      class: U(r(N)(r(Iv)({ variant: e.variant }), o.class)),
      role: "alert"
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), my = /* @__PURE__ */ h({
  __name: "AlertDescription",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("div", {
      class: U(r(N)("text-sm [&_p]:leading-relaxed", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), gy = /* @__PURE__ */ h({
  __name: "AlertTitle",
  props: {
    class: {}
  },
  setup(e) {
    const o = e;
    return (t, n) => (m(), K("h5", {
      class: U(r(N)("mb-1 font-medium leading-none tracking-tight", o.class))
    }, [
      b(t.$slots, "default")
    ], 2));
  }
}), Iv = Ht(
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
let tn = 1;
var Mv = class {
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
    const { message: o, ...t } = e, n = typeof e.id == "number" || e.id && e.id?.length > 0 ? e.id : tn++, a = this.toasts.find((l) => l.id === n), s = e.dismissible === void 0 ? !0 : e.dismissible;
    return this.dismissedToasts.has(n) && this.dismissedToasts.delete(n), a ? this.toasts = this.toasts.map((l) => l.id === n ? (this.publish({
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
    let a = t !== void 0, s;
    const l = n.then(async (u) => {
      if (s = ["resolve", u], $t(u))
        a = !1, this.create({
          id: t,
          type: "default",
          message: u
        });
      else if (Fv(u) && !u.ok) {
        a = !1;
        const c = typeof o.error == "function" ? await o.error(`HTTP error! status: ${u.status}`) : o.error, p = typeof o.description == "function" ? await o.description(`HTTP error! status: ${u.status}`) : o.description, v = typeof c == "object" && !$t(c) ? c : {
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
        a = !1;
        const c = typeof o.error == "function" ? await o.error(u) : o.error, p = typeof o.description == "function" ? await o.description(u) : o.description, v = typeof c == "object" && !$t(c) ? c : {
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
        a = !1;
        const c = typeof o.success == "function" ? await o.success(u) : o.success, p = typeof o.description == "function" ? await o.description(u) : o.description, v = typeof c == "object" && !$t(c) ? c : {
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
        a = !1;
        const d = typeof o.error == "function" ? await o.error(u) : o.error, c = typeof o.description == "function" ? await o.description(u) : o.description, f = typeof d == "object" && !$t(d) ? d : {
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
      a && (this.dismiss(t), t = void 0), o.finally?.();
    }), i = () => new Promise((u, d) => l.then(() => s[0] === "reject" ? d(s[1]) : u(s[1])).catch(d));
    return typeof t != "string" && typeof t != "number" ? { unwrap: i } : Object.assign(t, { unwrap: i });
  };
  custom = (e, o) => {
    const t = o?.id || tn++, n = this.toasts.find((s) => s.id === t), a = o?.dismissible === void 0 ? !0 : o.dismissible;
    return this.dismissedToasts.has(t) && this.dismissedToasts.delete(t), n ? this.toasts = this.toasts.map((s) => s.id === t ? (this.publish({
      ...s,
      component: e,
      dismissible: a,
      id: t,
      ...o
    }), {
      ...s,
      component: e,
      dismissible: a,
      id: t,
      ...o
    }) : s) : this.addToast({
      component: e,
      dismissible: a,
      id: t,
      ...o
    }), t;
  };
  getActiveToasts = () => this.toasts.filter((e) => !this.dismissedToasts.has(e.id));
};
const Se = new Mv();
function Rv(e, o) {
  const t = o?.id || tn++;
  return Se.create({
    message: e,
    id: t,
    type: "default",
    ...o
  }), t;
}
const Fv = (e) => e && typeof e == "object" && "ok" in e && typeof e.ok == "boolean" && "status" in e && typeof e.status == "number", Vv = Rv, Nv = () => Se.toasts, Lv = () => Se.getActiveToasts();
Object.assign(Vv, {
  success: Se.success,
  info: Se.info,
  warning: Se.warning,
  error: Se.error,
  custom: Se.custom,
  message: Se.message,
  promise: Se.promise,
  dismiss: Se.dismiss,
  loading: Se.loading
}, {
  getHistory: Nv,
  getToasts: Lv
});
function ao(e) {
  return e.label !== void 0;
}
const zv = 3, Er = "24px", kr = "16px", da = 4e3, Kv = 356, Hv = 14, jv = 45, $r = 200;
function Wv() {
  const e = T(!1);
  return ae(() => {
    const o = () => {
      e.value = document.hidden;
    };
    return document.addEventListener("visibilitychange", o), () => window.removeEventListener("visibilitychange", o);
  }), { isDocumentHidden: e };
}
function Qe(...e) {
  return e.filter(Boolean).join(" ");
}
function Uv(e) {
  const [o, t] = e.split("-"), n = [];
  return o && n.push(o), t && n.push(t), n;
}
function Gv(e, o) {
  const t = {};
  return [e, o].forEach((n, a) => {
    const s = a === 1, l = s ? "--mobile-offset" : "--offset", i = s ? kr : Er;
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
const Yv = [
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
], Xv = [
  "aria-label",
  "data-disabled",
  "data-close-button-position"
];
var Jv = /* @__PURE__ */ h({
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
    const t = e, n = o, a = T(null), s = T(null), l = T(!1), i = T(!1), u = T(!1), d = T(!1), c = T(!1), p = T(0), f = T(0), v = T(t.toast.duration || t.duration || da), y = T(null), w = T(null), S = O(() => t.index === 0), P = O(() => t.index + 1 <= t.visibleToasts), B = O(() => t.toast.type), q = O(() => t.toast.dismissible !== !1), x = O(() => t.toast.class || ""), k = O(() => t.descriptionClass || ""), R = O(() => {
      const D = t.toast.position || t.position, Z = t.heights.filter((ne) => ne.position === D).findIndex((ne) => ne.toastId === t.toast.id);
      return Z >= 0 ? Z : 0;
    }), F = O(() => {
      const D = t.toast.position || t.position;
      return t.heights.filter((Z) => Z.position === D).reduce((Z, ne, be) => be >= R.value ? Z : Z + ne.height, 0);
    }), L = O(() => R.value * t.gap + F.value || 0), A = O(() => t.toast.closeButton ?? t.closeButton), C = O(() => t.toast.duration || t.duration || da), $ = T(0), I = T(0), H = T(null), j = O(() => t.position.split("-")), oe = O(() => j.value[0]), J = O(() => j.value[1]), te = O(() => typeof t.toast.title != "string"), le = O(() => typeof t.toast.description != "string"), { isDocumentHidden: ve } = Wv(), qe = O(() => B.value && B.value === "loading");
    pe(() => {
      l.value = !0, v.value = C.value;
    }), ae(async () => {
      if (!l.value || !w.value) return;
      await de();
      const D = w.value, ie = D.style.height;
      D.style.height = "auto";
      const Z = D.getBoundingClientRect().height;
      D.style.height = ie, f.value = Z, n("update:height", {
        toastId: t.toast.id,
        height: Z,
        position: t.toast.position || t.position
      });
    });
    function he() {
      i.value = !0, p.value = L.value, setTimeout(() => {
        n("removeToast", t.toast);
      }, $r);
    }
    function gt() {
      if (qe.value || !q.value) return {};
      he(), t.toast.onDismiss?.(t.toast);
    }
    function Eo(D) {
      D.button !== 2 && (qe.value || !q.value || (y.value = /* @__PURE__ */ new Date(), p.value = L.value, D.target.setPointerCapture(D.pointerId), D.target.tagName !== "BUTTON" && (u.value = !0, H.value = {
        x: D.clientX,
        y: D.clientY
      })));
    }
    function yt() {
      if (d.value || !q.value) return;
      H.value = null;
      const D = Number(w.value?.style.getPropertyValue("--swipe-amount-x").replace("px", "") || 0), ie = Number(w.value?.style.getPropertyValue("--swipe-amount-y").replace("px", "") || 0), Z = (/* @__PURE__ */ new Date()).getTime() - (y.value?.getTime() || 0), ne = a.value === "x" ? D : ie, be = Math.abs(ne) / Z;
      if (Math.abs(ne) >= jv || be > 0.11) {
        p.value = L.value, t.toast.onDismiss?.(t.toast), a.value === "x" ? s.value = D > 0 ? "right" : "left" : s.value = ie > 0 ? "down" : "up", he(), d.value = !0;
        return;
      } else
        w.value?.style.setProperty("--swipe-amount-x", "0px"), w.value?.style.setProperty("--swipe-amount-y", "0px");
      c.value = !1, u.value = !1, a.value = null;
    }
    function ko(D) {
      if (!H.value || !q.value || (window?.getSelection()?.toString()?.length ?? !1)) return;
      const Z = D.clientY - H.value.y, ne = D.clientX - H.value.x, be = t.swipeDirections ?? Uv(t.position);
      !a.value && (Math.abs(ne) > 1 || Math.abs(Z) > 1) && (a.value = Math.abs(ne) > Math.abs(Z) ? "x" : "y");
      let Oe = {
        x: 0,
        y: 0
      };
      const ht = (it) => 1 / (1.5 + Math.abs(it) / 20);
      if (a.value === "y") {
        if (be.includes("top") || be.includes("bottom")) if (be.includes("top") && Z < 0 || be.includes("bottom") && Z > 0) Oe.y = Z;
        else {
          const it = Z * ht(Z);
          Oe.y = Math.abs(it) < Math.abs(Z) ? it : Z;
        }
      } else if (a.value === "x" && (be.includes("left") || be.includes("right")))
        if (be.includes("left") && ne < 0 || be.includes("right") && ne > 0) Oe.x = ne;
        else {
          const it = ne * ht(ne);
          Oe.x = Math.abs(it) < Math.abs(ne) ? it : ne;
        }
      (Math.abs(Oe.x) > 0 || Math.abs(Oe.y) > 0) && (c.value = !0), w.value?.style.setProperty("--swipe-amount-x", `${Oe.x}px`), w.value?.style.setProperty("--swipe-amount-y", `${Oe.y}px`);
    }
    pe(() => {
      if (l.value = !0, !w.value) return;
      const D = w.value.getBoundingClientRect().height;
      f.value = D;
      const ie = [{
        toastId: t.toast.id,
        height: D,
        position: t.toast.position
      }, ...t.heights];
      n("update:heights", ie);
    }), nn(() => {
      w.value && n("removeToast", t.toast);
    }), ae((D) => {
      if (t.toast.promise && B.value === "loading" || t.toast.duration === 1 / 0 || t.toast.type === "loading") return;
      let ie;
      const Z = () => {
        if (I.value < $.value) {
          const be = (/* @__PURE__ */ new Date()).getTime() - $.value;
          v.value = v.value - be;
        }
        I.value = (/* @__PURE__ */ new Date()).getTime();
      }, ne = () => {
        v.value !== 1 / 0 && ($.value = (/* @__PURE__ */ new Date()).getTime(), ie = setTimeout(() => {
          t.toast.onAutoClose?.(t.toast), he();
        }, v.value));
      };
      t.expanded || t.interacting || ve.value ? Z() : ne(), D(() => {
        clearTimeout(ie);
      });
    }), re(() => t.toast.delete, (D) => {
      D !== void 0 && D && (he(), t.toast.onDismiss?.(t.toast));
    }, { deep: !0 });
    function Mn() {
      u.value = !1, a.value = null, H.value = null;
    }
    return (D, ie) => (m(), K("li", {
      tabindex: "0",
      ref_key: "toastRef",
      ref: w,
      class: U(r(Qe)(t.class, x.value, D.classes?.toast, D.toast.classes?.toast, D.classes?.[B.value], D.toast?.classes?.[B.value])),
      "data-sonner-toast": "",
      "data-rich-colors": D.toast.richColors ?? D.defaultRichColors,
      "data-styled": !(D.toast.component || D.toast?.unstyled || D.unstyled),
      "data-mounted": l.value,
      "data-promise": !!D.toast.promise,
      "data-swiped": c.value,
      "data-removed": i.value,
      "data-visible": P.value,
      "data-y-position": oe.value,
      "data-x-position": J.value,
      "data-index": D.index,
      "data-front": S.value,
      "data-swiping": u.value,
      "data-dismissible": q.value,
      "data-type": B.value,
      "data-invert": D.toast.invert || D.invert,
      "data-swipe-out": d.value,
      "data-swipe-direction": s.value,
      "data-expanded": !!(D.expanded || D.expandByDefault && l.value),
      "data-testid": D.toast.testId,
      style: Ae({
        "--index": D.index,
        "--toasts-before": D.index,
        "--z-index": D.toasts.length - D.index,
        "--offset": `${i.value ? p.value : L.value}px`,
        "--initial-height": D.expandByDefault ? "auto" : `${f.value}px`,
        ...D.style,
        ...t.toast.style
      }),
      onDragend: Mn,
      onPointerdown: Eo,
      onPointerup: yt,
      onPointermove: ko
    }, [A.value && !D.toast.component && B.value !== "loading" ? (m(), K("button", {
      key: 0,
      "aria-label": D.closeButtonAriaLabel || "Close toast",
      "data-disabled": qe.value,
      "data-close-button": "true",
      "data-close-button-position": D.closeButtonPosition,
      class: U(r(Qe)(D.classes?.closeButton, D.toast?.classes?.closeButton)),
      onClick: gt
    }, [D.icons?.close ? (m(), _($e(D.icons?.close), { key: 0 })) : b(D.$slots, "close-icon", { key: 1 })], 10, Xv)) : ce("v-if", !0), D.toast.component ? (m(), _($e(D.toast.component), E({ key: 1 }, D.toast.componentProps, {
      onCloseToast: gt,
      isPaused: D.$props.expanded || D.$props.interacting || r(ve)
    }), null, 16, ["isPaused"])) : (m(), K(xe, { key: 2 }, [
      B.value !== "default" || D.toast.icon || D.toast.promise ? (m(), K("div", {
        key: 0,
        "data-icon": "",
        class: U(r(Qe)(D.classes?.icon, D.toast?.classes?.icon))
      }, [D.toast.icon ? (m(), _($e(D.toast.icon), { key: 0 })) : (m(), K(xe, { key: 1 }, [B.value === "loading" ? b(D.$slots, "loading-icon", { key: 0 }) : B.value === "success" ? b(D.$slots, "success-icon", { key: 1 }) : B.value === "error" ? b(D.$slots, "error-icon", { key: 2 }) : B.value === "warning" ? b(D.$slots, "warning-icon", { key: 3 }) : B.value === "info" ? b(D.$slots, "info-icon", { key: 4 }) : ce("v-if", !0)], 64))], 2)) : ce("v-if", !0),
      me("div", {
        "data-content": "",
        class: U(r(Qe)(D.classes?.content, D.toast?.classes?.content))
      }, [me("div", {
        "data-title": "",
        class: U(r(Qe)(D.classes?.title, D.toast.classes?.title))
      }, [te.value ? (m(), _($e(D.toast.title), W(E({ key: 0 }, D.toast.componentProps)), null, 16)) : (m(), K(xe, { key: 1 }, [Pt(Ct(D.toast.title), 1)], 64))], 2), D.toast.description ? (m(), K("div", {
        key: 0,
        "data-description": "",
        class: U(r(Qe)(D.descriptionClass, k.value, D.classes?.description, D.toast.classes?.description))
      }, [le.value ? (m(), _($e(D.toast.description), W(E({ key: 0 }, D.toast.componentProps)), null, 16)) : (m(), K(xe, { key: 1 }, [Pt(Ct(D.toast.description), 1)], 64))], 2)) : ce("v-if", !0)], 2),
      D.toast.cancel ? (m(), K("button", {
        key: 1,
        style: Ae(D.toast.cancelButtonStyle || D.cancelButtonStyle),
        class: U(r(Qe)(D.classes?.cancelButton, D.toast.classes?.cancelButton)),
        "data-button": "",
        "data-cancel": "",
        onClick: ie[0] || (ie[0] = (Z) => {
          r(ao)(D.toast.cancel) && q.value && (D.toast.cancel.onClick?.(Z), he());
        })
      }, Ct(r(ao)(D.toast.cancel) ? D.toast.cancel?.label : D.toast.cancel), 7)) : ce("v-if", !0),
      D.toast.action ? (m(), K("button", {
        key: 2,
        style: Ae(D.toast.actionButtonStyle || D.actionButtonStyle),
        class: U(r(Qe)(D.classes?.actionButton, D.toast.classes?.actionButton)),
        "data-button": "",
        "data-action": "",
        onClick: ie[1] || (ie[1] = (Z) => {
          r(ao)(D.toast.action) && (D.toast.action.onClick?.(Z), !Z.defaultPrevented && he());
        })
      }, Ct(r(ao)(D.toast.action) ? D.toast.action?.label : D.toast.action), 7)) : ce("v-if", !0)
    ], 64))], 46, Yv));
  }
}), Zv = Jv, Qt = (e, o) => {
  const t = e.__vccOpts || e;
  for (const [n, a] of o) t[n] = a;
  return t;
};
const Qv = {}, em = {
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
function tm(e, o) {
  return m(), K("svg", em, o[0] || (o[0] = [me("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }, null, -1), me("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }, null, -1)]));
}
var om = /* @__PURE__ */ Qt(Qv, [["render", tm]]);
const nm = ["data-visible"], am = { class: "sonner-spinner" };
var rm = /* @__PURE__ */ h({
  __name: "Loader",
  props: { visible: { type: Boolean } },
  setup(e) {
    const o = Array(12).fill(0);
    return (t, n) => (m(), K("div", {
      class: "sonner-loading-wrapper",
      "data-visible": t.visible
    }, [me("div", am, [(m(!0), K(xe, null, Bt(r(o), (a) => (m(), K("div", {
      key: `spinner-bar-${a}`,
      class: "sonner-loading-bar"
    }))), 128))])], 8, nm));
  }
}), sm = rm;
const lm = {}, im = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
};
function um(e, o) {
  return m(), K("svg", im, o[0] || (o[0] = [me("path", {
    "fill-rule": "evenodd",
    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
    "clip-rule": "evenodd"
  }, null, -1)]));
}
var dm = /* @__PURE__ */ Qt(lm, [["render", um]]);
const cm = {}, pm = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
};
function fm(e, o) {
  return m(), K("svg", pm, o[0] || (o[0] = [me("path", {
    "fill-rule": "evenodd",
    d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
    "clip-rule": "evenodd"
  }, null, -1)]));
}
var vm = /* @__PURE__ */ Qt(cm, [["render", fm]]);
const mm = {}, gm = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "currentColor",
  height: "20",
  width: "20"
};
function ym(e, o) {
  return m(), K("svg", gm, o[0] || (o[0] = [me("path", {
    "fill-rule": "evenodd",
    d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
    "clip-rule": "evenodd"
  }, null, -1)]));
}
var hm = /* @__PURE__ */ Qt(mm, [["render", ym]]);
const bm = {}, _m = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
};
function wm(e, o) {
  return m(), K("svg", _m, o[0] || (o[0] = [me("path", {
    "fill-rule": "evenodd",
    d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
    "clip-rule": "evenodd"
  }, null, -1)]));
}
var Cm = /* @__PURE__ */ Qt(bm, [["render", wm]]);
const Sm = ["aria-label"], xm = [
  "data-sonner-theme",
  "dir",
  "data-theme",
  "data-rich-colors",
  "data-y-position",
  "data-x-position"
], qm = typeof window < "u" && typeof document < "u";
function Bm() {
  if (typeof window > "u" || typeof document > "u") return "ltr";
  const e = document.documentElement.getAttribute("dir");
  return e === "auto" || !e ? window.getComputedStyle(document.documentElement).direction : e;
}
var Pm = /* @__PURE__ */ h({
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
    gap: { default: Hv },
    visibleToasts: { default: zv },
    closeButton: {
      type: Boolean,
      default: !1
    },
    toastOptions: { default: () => ({}) },
    class: { default: "" },
    style: {},
    offset: { default: Er },
    mobileOffset: { default: kr },
    dir: { default: "auto" },
    swipeDirections: {},
    icons: {},
    containerAriaLabel: { default: "Notifications" }
  },
  setup(e) {
    const o = e, t = jr(), n = T([]), a = O(() => o.id ? n.value.filter((C) => C.toasterId === o.id) : n.value.filter((C) => !C.toasterId));
    function s(C, $) {
      return a.value.filter((I) => !I.position && $ === 0 || I.position === C);
    }
    const l = O(() => {
      const C = a.value.filter(($) => $.position).map(($) => $.position);
      return C.length > 0 ? Array.from(new Set([o.position].concat(C))) : [o.position];
    }), i = O(() => {
      const C = {};
      return l.value.forEach(($) => {
        C[$] = n.value.filter((I) => I.position === $);
      }), C;
    }), u = T([]), d = T({}), c = T(!1);
    ae(() => {
      l.value.forEach((C) => {
        C in d.value || (d.value[C] = !1);
      });
    });
    const p = T(o.theme !== "system" ? o.theme : typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), f = T(null), v = T(null), y = T(!1), w = o.hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
    function S(C) {
      n.value.find(($) => $.id === C.id)?.delete || Se.dismiss(C.id), n.value = n.value.filter(({ id: $ }) => $ !== C.id), setTimeout(() => {
        n.value.find(($) => $.id === C.id) || (u.value = u.value.filter(($) => $.toastId !== C.id));
      }, $r + 50);
    }
    function P(C) {
      y.value && !C.currentTarget?.contains?.(C.relatedTarget) && (y.value = !1, v.value && (v.value.focus({ preventScroll: !0 }), v.value = null));
    }
    function B(C) {
      C.target instanceof HTMLElement && C.target.dataset.dismissible === "false" || y.value || (y.value = !0, v.value = C.relatedTarget);
    }
    function q(C) {
      C.target && C.target instanceof HTMLElement && C.target.dataset.dismissible === "false" || (c.value = !0);
    }
    ae((C) => {
      const $ = Se.subscribe((I) => {
        if (I.dismiss) {
          requestAnimationFrame(() => {
            n.value = n.value.map((H) => H.id === I.id ? {
              ...H,
              delete: !0
            } : H);
          });
          return;
        }
        de(() => {
          const H = n.value.findIndex((j) => j.id === I.id);
          H !== -1 ? n.value = [
            ...n.value.slice(0, H),
            {
              ...n.value[H],
              ...I
            },
            ...n.value.slice(H + 1)
          ] : n.value = [I, ...n.value];
        });
      });
      C($);
    }), ae((C) => {
      if (typeof window > "u") return;
      if (o.theme !== "system") {
        p.value = o.theme;
        return;
      }
      const $ = window.matchMedia("(prefers-color-scheme: dark)"), I = (j) => {
        p.value = j ? "dark" : "light";
      };
      I($.matches);
      const H = (j) => {
        I(j.matches);
      };
      try {
        $.addEventListener("change", H);
      } catch {
        $.addListener(H);
      }
      C(() => {
        try {
          $.removeEventListener("change", H);
        } catch {
          $.removeListener(H);
        }
      });
    }), ae(() => {
      f.value && v.value && (v.value.focus({ preventScroll: !0 }), v.value = null, y.value = !1);
    }), ae(() => {
      n.value.length <= 1 && Object.keys(d.value).forEach((C) => {
        d.value[C] = !1;
      });
    }), ae((C) => {
      function $(I) {
        const H = o.hotkey.every((J) => I[J] || I.code === J), j = Array.isArray(f.value) ? f.value[0] : f.value;
        H && (l.value.forEach((J) => {
          d.value[J] = !0;
        }), j?.focus());
        const oe = document.activeElement === f.value || j?.contains(document.activeElement);
        I.code === "Escape" && oe && l.value.forEach((J) => {
          d.value[J] = !1;
        });
      }
      qm && (document.addEventListener("keydown", $), C(() => {
        document.removeEventListener("keydown", $);
      }));
    });
    function x(C) {
      const $ = C.currentTarget, I = $.getAttribute("data-y-position") + "-" + $.getAttribute("data-x-position");
      d.value[I] = !0;
    }
    function k(C) {
      if (!c.value) {
        const $ = C.currentTarget, I = $.getAttribute("data-y-position") + "-" + $.getAttribute("data-x-position");
        d.value[I] = !1;
      }
    }
    function R() {
      Object.keys(d.value).forEach((C) => {
        d.value[C] = !1;
      });
    }
    function F() {
      c.value = !1;
    }
    function L(C) {
      u.value = C;
    }
    function A(C) {
      const $ = u.value.findIndex((I) => I.toastId === C.toastId);
      if ($ !== -1) u.value[$] = C;
      else {
        const I = u.value.findIndex((H) => H.position === C.position);
        I !== -1 ? u.value.splice(I, 0, C) : u.value.unshift(C);
      }
    }
    return (C, $) => (m(), K(xe, null, [ce(" Remove item from normal navigation flow, only available via hotkey "), me("section", {
      "aria-label": `${C.containerAriaLabel} ${r(w)}`,
      tabIndex: -1,
      "aria-live": "polite",
      "aria-relevant": "additions text",
      "aria-atomic": "false"
    }, [(m(!0), K(xe, null, Bt(l.value, (I, H) => (m(), K("ol", E({
      key: I,
      ref_for: !0,
      ref_key: "listRef",
      ref: f,
      "data-sonner-toaster": "",
      "data-sonner-theme": p.value,
      class: o.class,
      dir: C.dir === "auto" ? Bm() : C.dir,
      tabIndex: -1,
      "data-theme": C.theme,
      "data-rich-colors": C.richColors,
      "data-y-position": I.split("-")[0],
      "data-x-position": I.split("-")[1],
      style: {
        "--front-toast-height": `${u.value[0]?.height || 0}px`,
        "--width": `${r(Kv)}px`,
        "--gap": `${C.gap}px`,
        ...C.style,
        ...r(t).style,
        ...r(Gv)(C.offset, C.mobileOffset)
      }
    }, { ref_for: !0 }, C.$attrs, {
      onBlur: P,
      onFocus: B,
      onMouseenter: x,
      onMousemove: x,
      onMouseleave: k,
      onDragend: R,
      onPointerdown: q,
      onPointerup: F
    }), [(m(!0), K(xe, null, Bt(s(I, H), (j, oe) => (m(), _(Zv, {
      key: j.id,
      heights: u.value,
      icons: C.icons,
      index: oe,
      toast: j,
      defaultRichColors: C.richColors,
      duration: C.toastOptions?.duration ?? C.duration,
      class: U(C.toastOptions?.class ?? ""),
      descriptionClass: C.toastOptions?.descriptionClass,
      invert: C.invert,
      visibleToasts: C.visibleToasts,
      closeButton: C.toastOptions?.closeButton ?? C.closeButton,
      interacting: c.value,
      position: I,
      closeButtonPosition: C.toastOptions?.closeButtonPosition ?? C.closeButtonPosition,
      style: Ae(C.toastOptions?.style),
      unstyled: C.toastOptions?.unstyled,
      classes: C.toastOptions?.classes,
      cancelButtonStyle: C.toastOptions?.cancelButtonStyle,
      actionButtonStyle: C.toastOptions?.actionButtonStyle,
      "close-button-aria-label": C.toastOptions?.closeButtonAriaLabel,
      toasts: i.value[I],
      expandByDefault: C.expand,
      gap: C.gap,
      expanded: d.value[I] || !1,
      swipeDirections: o.swipeDirections,
      "onUpdate:heights": L,
      "onUpdate:height": A,
      onRemoveToast: S
    }, {
      "close-icon": g(() => [b(C.$slots, "close-icon", {}, () => [M(om)])]),
      "loading-icon": g(() => [b(C.$slots, "loading-icon", {}, () => [M(sm, { visible: j.type === "loading" }, null, 8, ["visible"])])]),
      "success-icon": g(() => [b(C.$slots, "success-icon", {}, () => [M(dm)])]),
      "error-icon": g(() => [b(C.$slots, "error-icon", {}, () => [M(Cm)])]),
      "warning-icon": g(() => [b(C.$slots, "warning-icon", {}, () => [M(hm)])]),
      "info-icon": g(() => [b(C.$slots, "info-icon", {}, () => [M(vm)])]),
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
    ]))), 128))], 16, xm))), 128))], 8, Sm)], 2112));
  }
}), Om = Pm;
const yy = /* @__PURE__ */ h({
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
    const t = X(e, "toastOptions");
    return (n, a) => (m(), _(r(Om), E({
      class: "toaster group",
      "toast-options": {
        classes: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      }
    }, r(t)), {
      "success-icon": g(() => [
        M(r(gv), { class: "size-4" })
      ]),
      "info-icon": g(() => [
        M(r(yv), { class: "size-4" })
      ]),
      "warning-icon": g(() => [
        M(r(_v), { class: "size-4" })
      ]),
      "error-icon": g(() => [
        M(r(bv), { class: "size-4" })
      ]),
      "loading-icon": g(() => [
        me("div", null, [
          M(r(hv), { class: "size-4 animate-spin" })
        ])
      ]),
      "close-icon": g(() => [
        M(r(Ao), { class: "size-4" })
      ]),
      _: 1
    }, 16));
  }
});
const Tm = /* @__PURE__ */ Symbol("vee-validate-form"), Am = /* @__PURE__ */ Symbol("vee-validate-field-instance");
function Dm(e, o, t) {
  return o.slots.default ? typeof e == "string" || !e ? o.slots.default(t()) : {
    default: () => {
      var n, a;
      return (a = (n = o.slots).default) === null || a === void 0 ? void 0 : a.call(n, t());
    }
  } : o.slots.default;
}
const Em = {
  generateMessage: ({ field: e }) => `${e} is not valid.`,
  bails: !0,
  validateOnBlur: !0,
  validateOnChange: !0,
  validateOnInput: !1,
  validateOnModelUpdate: !0
};
Object.assign({}, Em);
const km = /* @__PURE__ */ h({
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
    const t = Ft(Tm, void 0), n = O(() => t?.errors.value[e.name]);
    function a() {
      return {
        message: n.value
      };
    }
    return () => {
      if (!n.value)
        return;
      const s = e.as ? $e(e.as) : e.as, l = Dm(s, o, a), i = Object.assign({ role: "alert" }, o.attrs);
      return !s && (Array.isArray(l) || !l) && l?.length ? l : (Array.isArray(l) || !l) && !l?.length ? Ie(s || "span", i, n.value) : Ie(s, i, l);
    };
  }
}), $m = km, Ir = /* @__PURE__ */ Symbol();
function Do() {
  const e = Ft(Am), o = Ft(Ir);
  if (!e)
    throw new Error("useFormField should be used within <FormField>");
  const { name: t, errorMessage: n, meta: a } = e, s = o, l = {
    valid: O(() => a.valid),
    isDirty: O(() => a.dirty),
    isTouched: O(() => a.touched),
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
const hy = /* @__PURE__ */ h({
  __name: "FormControl",
  setup(e) {
    const { error: o, formItemId: t, formDescriptionId: n, formMessageId: a } = Do();
    return (s, l) => (m(), _(r(so), {
      id: r(t),
      "aria-describedby": r(o) ? `${r(n)} ${r(a)}` : `${r(n)}`,
      "aria-invalid": !!r(o)
    }, {
      default: g(() => [
        b(s.$slots, "default")
      ]),
      _: 3
    }, 8, ["id", "aria-describedby", "aria-invalid"]));
  }
}), Im = ["id"], by = /* @__PURE__ */ h({
  __name: "FormDescription",
  props: {
    class: {}
  },
  setup(e) {
    const o = e, { formDescriptionId: t } = Do();
    return (n, a) => (m(), K("p", {
      id: r(t),
      class: U(r(N)("text-sm text-muted-foreground", o.class))
    }, [
      b(n.$slots, "default")
    ], 10, Im));
  }
}), _y = /* @__PURE__ */ h({
  __name: "FormItem",
  props: {
    class: {}
  },
  setup(e) {
    const o = e, t = _e();
    return on(Ir, t), (n, a) => (m(), K("div", {
      class: U(r(N)("space-y-2", o.class))
    }, [
      b(n.$slots, "default")
    ], 2));
  }
}), wy = /* @__PURE__ */ h({
  __name: "FormLabel",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(e) {
    const o = e, { error: t, formItemId: n } = Do();
    return (a, s) => (m(), _(r(Sv), {
      class: U(r(N)(
        r(t) && "text-destructive",
        o.class
      )),
      for: r(n)
    }, {
      default: g(() => [
        b(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["class", "for"]));
  }
}), Cy = /* @__PURE__ */ h({
  __name: "FormMessage",
  setup(e) {
    const { name: o, formMessageId: t } = Do();
    return (n, a) => (m(), _(r($m), {
      id: r(t),
      as: "p",
      name: ye(r(o)),
      class: "text-sm font-medium text-destructive"
    }, null, 8, ["id", "name"]));
  }
});
export {
  $g as Accordion,
  Ig as AccordionContent,
  Mg as AccordionItem,
  Rg as AccordionTrigger,
  vy as Alert,
  my as AlertDescription,
  gy as AlertTitle,
  ng as Avatar,
  ag as AvatarFallback,
  rg as AvatarImage,
  og as Badge,
  Vm as Button,
  Nm as Card,
  Lm as CardContent,
  zm as CardDescription,
  Km as CardFooter,
  Hm as CardHeader,
  jm as CardTitle,
  gg as Checkbox,
  Um as Dialog,
  Gm as DialogClose,
  Ym as DialogContent,
  Xm as DialogDescription,
  Jm as DialogFooter,
  Zm as DialogHeader,
  Qm as DialogScrollContent,
  eg as DialogTitle,
  tg as DialogTrigger,
  Fg as DropdownMenu,
  Vg as DropdownMenuCheckboxItem,
  Ng as DropdownMenuContent,
  Lg as DropdownMenuGroup,
  zg as DropdownMenuItem,
  Kg as DropdownMenuLabel,
  Hg as DropdownMenuRadioGroup,
  jg as DropdownMenuRadioItem,
  Wg as DropdownMenuSeparator,
  Ug as DropdownMenuShortcut,
  Gg as DropdownMenuSub,
  Yg as DropdownMenuSubContent,
  Xg as DropdownMenuSubTrigger,
  Jg as DropdownMenuTrigger,
  hy as FormControl,
  by as FormDescription,
  _y as FormItem,
  wy as FormLabel,
  Cy as FormMessage,
  Wm as Input,
  Sv as Label,
  Zg as Popover,
  Qg as PopoverContent,
  ey as PopoverTrigger,
  fy as Progress,
  yg as RadioGroup,
  hg as RadioGroupItem,
  lg as Select,
  ig as SelectContent,
  ug as SelectGroup,
  dg as SelectItem,
  cg as SelectItemText,
  pg as SelectLabel,
  qv as SelectScrollDownButton,
  Bv as SelectScrollUpButton,
  fg as SelectSeparator,
  vg as SelectTrigger,
  mg as SelectValue,
  sg as Separator,
  Cg as Sheet,
  Sg as SheetClose,
  xg as SheetContent,
  qg as SheetDescription,
  Bg as SheetFooter,
  Pg as SheetHeader,
  Og as SheetTitle,
  Tg as SheetTrigger,
  py as Skeleton,
  wg as Slider,
  yy as Sonner,
  bg as Switch,
  ry as Table,
  sy as TableBody,
  ly as TableCaption,
  Ev as TableCell,
  iy as TableEmpty,
  uy as TableFooter,
  dy as TableHead,
  cy as TableHeader,
  kv as TableRow,
  Ag as Tabs,
  Dg as TabsContent,
  Eg as TabsList,
  kg as TabsTrigger,
  _g as Textarea,
  ty as Tooltip,
  oy as TooltipContent,
  ny as TooltipProvider,
  ay as TooltipTrigger,
  Cv as avatarVariant,
  wv as badgeVariants,
  rv as buttonVariants,
  N as cn,
  Do as useFormField
};
