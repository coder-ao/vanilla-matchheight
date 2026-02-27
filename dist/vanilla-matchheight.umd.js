/*!
 * @neruco/vanilla-matchheight
 * Vanilla matchHeight utility (byRow / target / remove / data-mh)
 * License: MIT
 */
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    // CommonJS / Node
    module.exports = factory();
  } else {
    // Browser global
    root.VanillaMatchHeight = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var THROTTLE = 80;
  var resizeTimer = null;
  var lastW = -1;

  // internal groups registry
  var groups = [];

  function parse(v) {
    var n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }

  function getTopWithMargin(el) {
    var cs = window.getComputedStyle(el);
    var rect = el.getBoundingClientRect();
    // pageY - marginTop 相当
    return rect.top + (window.scrollY || window.pageYOffset || 0) - parse(cs.marginTop);
  }

  function splitRows(elements, tolerance) {
    if (tolerance == null) tolerance = 1;

    var rows = [];
    var lastTop = null;

    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var top = getTopWithMargin(el);
      var lastRow = rows.length ? rows[rows.length - 1] : null;

      if (!lastRow) {
        rows.push([el]);
      } else if (Math.floor(Math.abs(lastTop - top)) <= tolerance) {
        lastRow.push(el);
      } else {
        rows.push([el]);
      }
      lastTop = top;
    }

    return rows;
  }

  function resetHeights(elements, property) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].style[property] = "";
    }
  }

  function measureOuterHeight(el) {
    // padding + border を含む（marginは含まない）に近い
    return el.getBoundingClientRect().height;
  }

  function normalizeElements(elements) {
    if (!elements) return [];
    // NodeList / HTMLCollection / Array を許容
    var arr = [];
    for (var i = 0; i < elements.length; i++) {
      if (elements[i]) arr.push(elements[i]);
    }
    return arr;
  }

  function applyGroup(elements, options) {
    var opts = options || {};
    var byRow = opts.byRow !== false; // default true
    var property = opts.property || "height";
    var target = opts.target || null;
    var remove = opts.remove === true;

    var els = normalizeElements(elements);
    if (!els.length) return;

    if (remove) {
      resetHeights(els, property);
      return;
    }

    // target 指定：targetの高さに揃える
    if (target && target.nodeType === 1) {
      var th = measureOuterHeight(target);
      for (var t = 0; t < els.length; t++) {
        if (els[t] === target) continue;
        els[t].style[property] = th + "px";
      }
      return;
    }

    // top順にソートして行判定の安定性UP
    els.sort(function (a, b) {
      return getTopWithMargin(a) - getTopWithMargin(b);
    });

    var buckets = byRow ? splitRows(els, 1) : [els];

    for (var b = 0; b < buckets.length; b++) {
      var bucket = buckets[b];

      // byRowで1個ならリセット（元プラグイン寄せ）
      if (byRow && bucket.length <= 1) {
        resetHeights(bucket, property);
        continue;
      }

      resetHeights(bucket, property);

      var max = 0;
      for (var j = 0; j < bucket.length; j++) {
        var h = measureOuterHeight(bucket[j]);
        if (h > max) max = h;
      }

      for (var k = 0; k < bucket.length; k++) {
        bucket[k].style[property] = max + "px";
      }
    }
  }

  function register(elements, options) {
    var els = normalizeElements(elements);
    var group = { elements: els, options: options || {} };
    groups.push(group);
    applyGroup(els, group.options);
    return group;
  }

  function updateAll() {
    for (var i = 0; i < groups.length; i++) {
      applyGroup(groups[i].elements, groups[i].options);
    }
  }

  function throttleUpdate(evt) {
    // resizeで幅変化なしならスキップ（無駄更新を減らす）
    if (evt && evt.type === "resize") {
      var w = window.innerWidth || document.documentElement.clientWidth;
      if (w === lastW) return;
      lastW = w;
    }

    if (resizeTimer) return;
    resizeTimer = setTimeout(function () {
      resizeTimer = null;
      updateAll();
    }, THROTTLE);
  }

  function applyDataApi(options) {
    var map = new Map();
    var nodes = document.querySelectorAll("[data-match-height],[data-mh]");

    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute("data-mh") || el.getAttribute("data-match-height");
      if (!key) continue;

      if (!map.has(key)) map.set(key, []);
      map.get(key).push(el);
    }

    map.forEach(function (els) {
      register(els, options || { byRow: true });
    });
  }

  // auto bind (更新だけ)
  if (typeof window !== "undefined" && window.addEventListener) {
    window.addEventListener("load", function () {
      updateAll();
    });
    window.addEventListener("resize", throttleUpdate);
    window.addEventListener("orientationchange", throttleUpdate);
  }

  // Public API
  var api = {
    // core
    register: register,
    applyGroup: applyGroup,
    applyDataApi: applyDataApi,
    updateAll: updateAll,

    // info
    groups: groups,

    // metadata
    version: "1.0.0"
  };

  return api;
});
