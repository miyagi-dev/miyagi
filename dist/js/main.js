const e = {
    list: "Headman-list",
    listItem: "Headman-listItem",
    content: "Headman-content",
    iframe: "Headman-frame",
    toggle: "Headman-toggle",
    toggleMenu: "Headman-toggleMobileMenu",
    link: "Headman-link"
  },
  t = { embedded: "/component?", container: "/show?" };
let n, r;
function i(e, t, n) {
  t.remove(), (t.src = n), e.insertBefore(t, e.lastElementChild);
}
function a(t) {
  r.filter(e => "true" === e.getAttribute("aria-expanded")).forEach(n => {
    n.closest(`.${e.listItem}`).contains(t) ||
      n.setAttribute("aria-expanded", !1);
  });
}
function o(t) {
  !(function t(n) {
    const r = n.closest(`.${e.list}`);
    if (r) {
      let n = r.previousElementSibling;
      if (n) {
        for (; n && !n.classList.contains(e.link); )
          n = n.previousElementSibling;
        if ((console.log(n), n)) {
          const r = n.previousElementSibling;
          r &&
            "false" === r.getAttribute("aria-expanded") &&
            (r.setAttribute("aria-expanded", !0),
            r.closest(`.${e.listItem}`) && t(r.closest(`.${e.listItem}`)));
        }
      }
    }
  })(t);
}
function l(r) {
  const i = n.filter(
      e =>
        e
          .getAttribute("href")
          .replace("&embedded=true", "")
          .indexOf(
            r.replace(t.container, t.embedded).replace("&embedded=true", "")
          ) >= 0
    )[0],
    a = n.filter(e => e.getAttribute("aria-current"))[0],
    o = i.previousElementSibling,
    l = o && o.classList.contains(e.toggle) ? o : null;
  return (
    a && a.removeAttribute("aria-current"),
    i.setAttribute("aria-current", "page"),
    l && l.setAttribute("aria-expanded", !0),
    i
  );
}
(window.onPageChanged = function(e) {
  const n = l(e);
  a(n), o(n), history.pushState(null, e, e.replace(t.embedded, t.container));
}),
  document.addEventListener("DOMContentLoaded", () => {
    const c = document.querySelector(`.${e.content}`),
      d = document.querySelector(`.${e.iframe}`),
      u = document.querySelector(`.${e.toggleMenu}`);
    (n = Array.from(document.querySelectorAll(`.${e.link}`))),
      (r = Array.from(document.querySelectorAll(`.${e.toggle}`))),
      u &&
        u.addEventListener("click", e => {
          e.preventDefault(),
            (function(e) {
              let t;
              (t = "true" !== e.getAttribute("aria-expanded")),
                e.setAttribute("aria-expanded", t);
            })(e.target);
        }),
      r.forEach(e => {
        e.addEventListener("click", e => {
          e.preventDefault(),
            (function(e) {
              e.setAttribute(
                "aria-expanded",
                "true" !== e.getAttribute("aria-expanded")
              );
            })(e.target);
        });
      }),
      n.forEach(n => {
        n.addEventListener("click", n => {
          n.preventDefault(),
            (function(n, r, a) {
              const o = n.getAttribute("href");
              l(o),
                i(r, a, o),
                history.pushState(null, o, o.replace(t.embedded, t.container)),
                window.innerWidth <= 512 &&
                  document
                    .querySelector(`.${e.toggleMenu}`)
                    .setAttribute("aria-expanded", !1);
            })(n.target, c, d);
        });
      }),
      window.addEventListener("popstate", () =>
        (function(e, n) {
          "" !== document.location.search
            ? i(e, n, document.location.href.replace(t.container, t.embedded))
            : i(e, n, `${t.embedded}file=all&embedded=true`);
          const r = l(
            document.location.href
              .replace(location.origin, "")
              .replace(t.container, t.embedded)
          );
          a(r), o(r);
        })(c, d)
      );
  });
