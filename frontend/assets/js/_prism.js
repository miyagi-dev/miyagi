/* PrismJS 1.30.0
https://prismjs.com/download.html#themes=prism&languages=markup+clike+javascript+handlebars+json+markup-templating+pug+twig+yaml */
var _self =
		"undefined" != typeof window
			? window
			: "undefined" != typeof WorkerGlobalScope &&
				  self instanceof WorkerGlobalScope
				? self
				: {},
	Prism = (function (e) {
		var n = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,
			t = 0,
			r = {},
			a = {
				manual: e.Prism && e.Prism.manual,
				disableWorkerMessageHandler:
					e.Prism && e.Prism.disableWorkerMessageHandler,
				util: {
					encode: function e(n) {
						return n instanceof i
							? new i(n.type, e(n.content), n.alias)
							: Array.isArray(n)
								? n.map(e)
								: n
										.replace(/&/g, "&amp;")
										.replace(/</g, "&lt;")
										.replace(/\u00a0/g, " ");
					},
					type: function (e) {
						return Object.prototype.toString.call(e).slice(8, -1);
					},
					objId: function (e) {
						return (
							e.__id || Object.defineProperty(e, "__id", { value: ++t }), e.__id
						);
					},
					clone: function e(n, t) {
						var r, i;
						switch (((t = t || {}), a.util.type(n))) {
							case "Object":
								if (((i = a.util.objId(n)), t[i])) return t[i];
								for (var l in ((r = {}), (t[i] = r), n))
									n.hasOwnProperty(l) && (r[l] = e(n[l], t));
								return r;
							case "Array":
								return (
									(i = a.util.objId(n)),
									t[i]
										? t[i]
										: ((r = []),
											(t[i] = r),
											n.forEach(function (n, a) {
												r[a] = e(n, t);
											}),
											r)
								);
							default:
								return n;
						}
					},
					getLanguage: function (e) {
						for (; e; ) {
							var t = n.exec(e.className);
							if (t) return t[1].toLowerCase();
							e = e.parentElement;
						}
						return "none";
					},
					setLanguage: function (e, t) {
						(e.className = e.className.replace(RegExp(n, "gi"), "")),
							e.classList.add("language-" + t);
					},
					currentScript: function () {
						if ("undefined" == typeof document) return null;
						if (
							document.currentScript &&
							"SCRIPT" === document.currentScript.tagName
						)
							return document.currentScript;
						try {
							throw new Error();
						} catch (r) {
							var e = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(r.stack) ||
								[])[1];
							if (e) {
								var n = document.getElementsByTagName("script");
								for (var t in n) if (n[t].src == e) return n[t];
							}
							return null;
						}
					},
					isActive: function (e, n, t) {
						for (var r = "no-" + n; e; ) {
							var a = e.classList;
							if (a.contains(n)) return !0;
							if (a.contains(r)) return !1;
							e = e.parentElement;
						}
						return !!t;
					},
				},
				languages: {
					plain: r,
					plaintext: r,
					text: r,
					txt: r,
					extend: function (e, n) {
						var t = a.util.clone(a.languages[e]);
						for (var r in n) t[r] = n[r];
						return t;
					},
					insertBefore: function (e, n, t, r) {
						var i = (r = r || a.languages)[e],
							l = {};
						for (var o in i)
							if (i.hasOwnProperty(o)) {
								if (o == n)
									for (var s in t) t.hasOwnProperty(s) && (l[s] = t[s]);
								t.hasOwnProperty(o) || (l[o] = i[o]);
							}
						var u = r[e];
						return (
							(r[e] = l),
							a.languages.DFS(a.languages, function (n, t) {
								t === u && n != e && (this[n] = l);
							}),
							l
						);
					},
					DFS: function e(n, t, r, i) {
						i = i || {};
						var l = a.util.objId;
						for (var o in n)
							if (n.hasOwnProperty(o)) {
								t.call(n, o, n[o], r || o);
								var s = n[o],
									u = a.util.type(s);
								"Object" !== u || i[l(s)]
									? "Array" !== u || i[l(s)] || ((i[l(s)] = !0), e(s, t, o, i))
									: ((i[l(s)] = !0), e(s, t, null, i));
							}
					},
				},
				plugins: {},
				highlightAll: function (e, n) {
					a.highlightAllUnder(document, e, n);
				},
				highlightAllUnder: function (e, n, t) {
					var r = {
						callback: t,
						container: e,
						selector:
							'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
					};
					a.hooks.run("before-highlightall", r),
						(r.elements = Array.prototype.slice.apply(
							r.container.querySelectorAll(r.selector),
						)),
						a.hooks.run("before-all-elements-highlight", r);
					for (var i, l = 0; (i = r.elements[l++]); )
						a.highlightElement(i, !0 === n, r.callback);
				},
				highlightElement: function (n, t, r) {
					var i = a.util.getLanguage(n),
						l = a.languages[i];
					a.util.setLanguage(n, i);
					var o = n.parentElement;
					o && "pre" === o.nodeName.toLowerCase() && a.util.setLanguage(o, i);
					var s = { element: n, language: i, grammar: l, code: n.textContent };
					function u(e) {
						(s.highlightedCode = e),
							a.hooks.run("before-insert", s),
							(s.element.innerHTML = s.highlightedCode),
							a.hooks.run("after-highlight", s),
							a.hooks.run("complete", s),
							r && r.call(s.element);
					}
					if (
						(a.hooks.run("before-sanity-check", s),
						(o = s.element.parentElement) &&
							"pre" === o.nodeName.toLowerCase() &&
							!o.hasAttribute("tabindex") &&
							o.setAttribute("tabindex", "0"),
						!s.code)
					)
						return a.hooks.run("complete", s), void (r && r.call(s.element));
					if ((a.hooks.run("before-highlight", s), s.grammar))
						if (t && e.Worker) {
							var c = new Worker(a.filename);
							(c.onmessage = function (e) {
								u(e.data);
							}),
								c.postMessage(
									JSON.stringify({
										language: s.language,
										code: s.code,
										immediateClose: !0,
									}),
								);
						} else u(a.highlight(s.code, s.grammar, s.language));
					else u(a.util.encode(s.code));
				},
				highlight: function (e, n, t) {
					var r = { code: e, grammar: n, language: t };
					if ((a.hooks.run("before-tokenize", r), !r.grammar))
						throw new Error(
							'The language "' + r.language + '" has no grammar.',
						);
					return (
						(r.tokens = a.tokenize(r.code, r.grammar)),
						a.hooks.run("after-tokenize", r),
						i.stringify(a.util.encode(r.tokens), r.language)
					);
				},
				tokenize: function (e, n) {
					var t = n.rest;
					if (t) {
						for (var r in t) n[r] = t[r];
						delete n.rest;
					}
					var a = new s();
					return (
						u(a, a.head, e),
						o(e, a, n, a.head, 0),
						(function (e) {
							for (var n = [], t = e.head.next; t !== e.tail; )
								n.push(t.value), (t = t.next);
							return n;
						})(a)
					);
				},
				hooks: {
					all: {},
					add: function (e, n) {
						var t = a.hooks.all;
						(t[e] = t[e] || []), t[e].push(n);
					},
					run: function (e, n) {
						var t = a.hooks.all[e];
						if (t && t.length) for (var r, i = 0; (r = t[i++]); ) r(n);
					},
				},
				Token: i,
			};
		function i(e, n, t, r) {
			(this.type = e),
				(this.content = n),
				(this.alias = t),
				(this.length = 0 | (r || "").length);
		}
		function l(e, n, t, r) {
			e.lastIndex = n;
			var a = e.exec(t);
			if (a && r && a[1]) {
				var i = a[1].length;
				(a.index += i), (a[0] = a[0].slice(i));
			}
			return a;
		}
		function o(e, n, t, r, s, g) {
			for (var f in t)
				if (t.hasOwnProperty(f) && t[f]) {
					var h = t[f];
					h = Array.isArray(h) ? h : [h];
					for (var d = 0; d < h.length; ++d) {
						if (g && g.cause == f + "," + d) return;
						var v = h[d],
							p = v.inside,
							m = !!v.lookbehind,
							y = !!v.greedy,
							k = v.alias;
						if (y && !v.pattern.global) {
							var x = v.pattern.toString().match(/[imsuy]*$/)[0];
							v.pattern = RegExp(v.pattern.source, x + "g");
						}
						for (
							var b = v.pattern || v, w = r.next, A = s;
							w !== n.tail && !(g && A >= g.reach);
							A += w.value.length, w = w.next
						) {
							var P = w.value;
							if (n.length > e.length) return;
							if (!(P instanceof i)) {
								var E,
									S = 1;
								if (y) {
									if (!(E = l(b, A, e, m)) || E.index >= e.length) break;
									var L = E.index,
										O = E.index + E[0].length,
										C = A;
									for (C += w.value.length; L >= C; )
										C += (w = w.next).value.length;
									if (((A = C -= w.value.length), w.value instanceof i))
										continue;
									for (
										var j = w;
										j !== n.tail && (C < O || "string" == typeof j.value);
										j = j.next
									)
										S++, (C += j.value.length);
									S--, (P = e.slice(A, C)), (E.index -= A);
								} else if (!(E = l(b, 0, P, m))) continue;
								L = E.index;
								var N = E[0],
									_ = P.slice(0, L),
									M = P.slice(L + N.length),
									W = A + P.length;
								g && W > g.reach && (g.reach = W);
								var I = w.prev;
								if (
									(_ && ((I = u(n, I, _)), (A += _.length)),
									c(n, I, S),
									(w = u(n, I, new i(f, p ? a.tokenize(N, p) : N, k, N))),
									M && u(n, w, M),
									S > 1)
								) {
									var T = { cause: f + "," + d, reach: W };
									o(e, n, t, w.prev, A, T),
										g && T.reach > g.reach && (g.reach = T.reach);
								}
							}
						}
					}
				}
		}
		function s() {
			var e = { value: null, prev: null, next: null },
				n = { value: null, prev: e, next: null };
			(e.next = n), (this.head = e), (this.tail = n), (this.length = 0);
		}
		function u(e, n, t) {
			var r = n.next,
				a = { value: t, prev: n, next: r };
			return (n.next = a), (r.prev = a), e.length++, a;
		}
		function c(e, n, t) {
			for (var r = n.next, a = 0; a < t && r !== e.tail; a++) r = r.next;
			(n.next = r), (r.prev = n), (e.length -= a);
		}
		if (
			((e.Prism = a),
			(i.stringify = function e(n, t) {
				if ("string" == typeof n) return n;
				if (Array.isArray(n)) {
					var r = "";
					return (
						n.forEach(function (n) {
							r += e(n, t);
						}),
						r
					);
				}
				var i = {
						type: n.type,
						content: e(n.content, t),
						tag: "span",
						classes: ["token", n.type],
						attributes: {},
						language: t,
					},
					l = n.alias;
				l &&
					(Array.isArray(l)
						? Array.prototype.push.apply(i.classes, l)
						: i.classes.push(l)),
					a.hooks.run("wrap", i);
				var o = "";
				for (var s in i.attributes)
					o +=
						" " +
						s +
						'="' +
						(i.attributes[s] || "").replace(/"/g, "&quot;") +
						'"';
				return (
					"<" +
					i.tag +
					' class="' +
					i.classes.join(" ") +
					'"' +
					o +
					">" +
					i.content +
					"</" +
					i.tag +
					">"
				);
			}),
			!e.document)
		)
			return e.addEventListener
				? (a.disableWorkerMessageHandler ||
						e.addEventListener(
							"message",
							function (n) {
								var t = JSON.parse(n.data),
									r = t.language,
									i = t.code,
									l = t.immediateClose;
								e.postMessage(a.highlight(i, a.languages[r], r)),
									l && e.close();
							},
							!1,
						),
					a)
				: a;
		var g = a.util.currentScript();
		function f() {
			a.manual || a.highlightAll();
		}
		if (
			(g &&
				((a.filename = g.src),
				g.hasAttribute("data-manual") && (a.manual = !0)),
			!a.manual)
		) {
			var h = document.readyState;
			"loading" === h || ("interactive" === h && g && g.defer)
				? document.addEventListener("DOMContentLoaded", f)
				: window.requestAnimationFrame
					? window.requestAnimationFrame(f)
					: window.setTimeout(f, 16);
		}
		return a;
	})(_self);
"undefined" != typeof module && module.exports && (module.exports = Prism),
	"undefined" != typeof global && (global.Prism = Prism);
(Prism.languages.markup = {
	comment: { pattern: /<!--(?:(?!<!--)[\s\S])*?-->/, greedy: !0 },
	prolog: { pattern: /<\?[\s\S]+?\?>/, greedy: !0 },
	doctype: {
		pattern:
			/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
		greedy: !0,
		inside: {
			"internal-subset": {
				pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
				lookbehind: !0,
				greedy: !0,
				inside: null,
			},
			string: { pattern: /"[^"]*"|'[^']*'/, greedy: !0 },
			punctuation: /^<!|>$|[[\]]/,
			"doctype-tag": /^DOCTYPE/i,
			name: /[^\s<>'"]+/,
		},
	},
	cdata: { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, greedy: !0 },
	tag: {
		pattern:
			/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
		greedy: !0,
		inside: {
			tag: {
				pattern: /^<\/?[^\s>\/]+/,
				inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
			},
			"special-attr": [],
			"attr-value": {
				pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
				inside: {
					punctuation: [
						{ pattern: /^=/, alias: "attr-equals" },
						{ pattern: /^(\s*)["']|["']$/, lookbehind: !0 },
					],
				},
			},
			punctuation: /\/?>/,
			"attr-name": {
				pattern: /[^\s>\/]+/,
				inside: { namespace: /^[^\s>\/:]+:/ },
			},
		},
	},
	entity: [
		{ pattern: /&[\da-z]{1,8};/i, alias: "named-entity" },
		/&#x?[\da-f]{1,8};/i,
	],
}),
	(Prism.languages.markup.tag.inside["attr-value"].inside.entity =
		Prism.languages.markup.entity),
	(Prism.languages.markup.doctype.inside["internal-subset"].inside =
		Prism.languages.markup),
	Prism.hooks.add("wrap", function (a) {
		"entity" === a.type &&
			(a.attributes.title = a.content.replace(/&amp;/, "&"));
	}),
	Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
		value: function (a, e) {
			var s = {};
			(s["language-" + e] = {
				pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
				lookbehind: !0,
				inside: Prism.languages[e],
			}),
				(s.cdata = /^<!\[CDATA\[|\]\]>$/i);
			var t = {
				"included-cdata": { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: s },
			};
			t["language-" + e] = { pattern: /[\s\S]+/, inside: Prism.languages[e] };
			var n = {};
			(n[a] = {
				pattern: RegExp(
					"(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)".replace(
						/__/g,
						function () {
							return a;
						},
					),
					"i",
				),
				lookbehind: !0,
				greedy: !0,
				inside: t,
			}),
				Prism.languages.insertBefore("markup", "cdata", n);
		},
	}),
	Object.defineProperty(Prism.languages.markup.tag, "addAttribute", {
		value: function (a, e) {
			Prism.languages.markup.tag.inside["special-attr"].push({
				pattern: RegExp(
					"(^|[\"'\\s])(?:" +
						a +
						")\\s*=\\s*(?:\"[^\"]*\"|'[^']*'|[^\\s'\">=]+(?=[\\s>]))",
					"i",
				),
				lookbehind: !0,
				inside: {
					"attr-name": /^[^\s=]+/,
					"attr-value": {
						pattern: /=[\s\S]+/,
						inside: {
							value: {
								pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
								lookbehind: !0,
								alias: [e, "language-" + e],
								inside: Prism.languages[e],
							},
							punctuation: [{ pattern: /^=/, alias: "attr-equals" }, /"|'/],
						},
					},
				},
			});
		},
	}),
	(Prism.languages.html = Prism.languages.markup),
	(Prism.languages.mathml = Prism.languages.markup),
	(Prism.languages.svg = Prism.languages.markup),
	(Prism.languages.xml = Prism.languages.extend("markup", {})),
	(Prism.languages.ssml = Prism.languages.xml),
	(Prism.languages.atom = Prism.languages.xml),
	(Prism.languages.rss = Prism.languages.xml);
Prism.languages.clike = {
	comment: [
		{ pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0, greedy: !0 },
		{ pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
	],
	string: {
		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: !0,
	},
	"class-name": {
		pattern:
			/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
		lookbehind: !0,
		inside: { punctuation: /[.\\]/ },
	},
	keyword:
		/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
	boolean: /\b(?:false|true)\b/,
	function: /\b\w+(?=\()/,
	number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
	operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
	punctuation: /[{}[\];(),.:]/,
};
(Prism.languages.javascript = Prism.languages.extend("clike", {
	"class-name": [
		Prism.languages.clike["class-name"],
		{
			pattern:
				/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
			lookbehind: !0,
		},
	],
	keyword: [
		{ pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0 },
		{
			pattern:
				/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
			lookbehind: !0,
		},
	],
	function:
		/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
	number: {
		pattern: RegExp(
			"(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])",
		),
		lookbehind: !0,
	},
	operator:
		/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
})),
	(Prism.languages.javascript["class-name"][0].pattern =
		/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/),
	Prism.languages.insertBefore("javascript", "keyword", {
		regex: {
			pattern: RegExp(
				"((?:^|[^$\\w\\xA0-\\uFFFF.\"'\\])\\s]|\\b(?:return|yield))\\s*)/(?:(?:\\[(?:[^\\]\\\\\r\n]|\\\\.)*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}|(?:\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.)*\\])*\\])*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\\s|/\\*(?:[^*]|\\*(?!/))*\\*/)*(?:$|[\r\n,.;:})\\]]|//))",
			),
			lookbehind: !0,
			greedy: !0,
			inside: {
				"regex-source": {
					pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
					lookbehind: !0,
					alias: "language-regex",
					inside: Prism.languages.regex,
				},
				"regex-delimiter": /^\/|\/$/,
				"regex-flags": /^[a-z]+$/,
			},
		},
		"function-variable": {
			pattern:
				/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
			alias: "function",
		},
		parameter: [
			{
				pattern:
					/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
				lookbehind: !0,
				inside: Prism.languages.javascript,
			},
			{
				pattern:
					/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
				lookbehind: !0,
				inside: Prism.languages.javascript,
			},
			{
				pattern:
					/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
				lookbehind: !0,
				inside: Prism.languages.javascript,
			},
			{
				pattern:
					/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
				lookbehind: !0,
				inside: Prism.languages.javascript,
			},
		],
		constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
	}),
	Prism.languages.insertBefore("javascript", "string", {
		hashbang: { pattern: /^#!.*/, greedy: !0, alias: "comment" },
		"template-string": {
			pattern:
				/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
			greedy: !0,
			inside: {
				"template-punctuation": { pattern: /^`|`$/, alias: "string" },
				interpolation: {
					pattern:
						/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
					lookbehind: !0,
					inside: {
						"interpolation-punctuation": {
							pattern: /^\$\{|\}$/,
							alias: "punctuation",
						},
						rest: Prism.languages.javascript,
					},
				},
				string: /[\s\S]+/,
			},
		},
		"string-property": {
			pattern:
				/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
			lookbehind: !0,
			greedy: !0,
			alias: "property",
		},
	}),
	Prism.languages.insertBefore("javascript", "operator", {
		"literal-property": {
			pattern:
				/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
			lookbehind: !0,
			alias: "property",
		},
	}),
	Prism.languages.markup &&
		(Prism.languages.markup.tag.addInlined("script", "javascript"),
		Prism.languages.markup.tag.addAttribute(
			"on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)",
			"javascript",
		)),
	(Prism.languages.js = Prism.languages.javascript);
!(function (e) {
	function n(e, n) {
		return "___" + e.toUpperCase() + n + "___";
	}
	Object.defineProperties((e.languages["markup-templating"] = {}), {
		buildPlaceholders: {
			value: function (t, a, r, o) {
				if (t.language === a) {
					var c = (t.tokenStack = []);
					(t.code = t.code.replace(r, function (e) {
						if ("function" == typeof o && !o(e)) return e;
						for (var r, i = c.length; -1 !== t.code.indexOf((r = n(a, i))); )
							++i;
						return (c[i] = e), r;
					})),
						(t.grammar = e.languages.markup);
				}
			},
		},
		tokenizePlaceholders: {
			value: function (t, a) {
				if (t.language === a && t.tokenStack) {
					t.grammar = e.languages[a];
					var r = 0,
						o = Object.keys(t.tokenStack);
					!(function c(i) {
						for (var u = 0; u < i.length && !(r >= o.length); u++) {
							var g = i[u];
							if (
								"string" == typeof g ||
								(g.content && "string" == typeof g.content)
							) {
								var l = o[r],
									s = t.tokenStack[l],
									f = "string" == typeof g ? g : g.content,
									p = n(a, l),
									k = f.indexOf(p);
								if (k > -1) {
									++r;
									var m = f.substring(0, k),
										d = new e.Token(
											a,
											e.tokenize(s, t.grammar),
											"language-" + a,
											s,
										),
										h = f.substring(k + p.length),
										v = [];
									m && v.push.apply(v, c([m])),
										v.push(d),
										h && v.push.apply(v, c([h])),
										"string" == typeof g
											? i.splice.apply(i, [u, 1].concat(v))
											: (g.content = v);
								}
							} else g.content && c(g.content);
						}
						return i;
					})(t.tokens);
				}
			},
		},
	});
})(Prism);
!(function (a) {
	(a.languages.handlebars = {
		comment: /\{\{![\s\S]*?\}\}/,
		delimiter: { pattern: /^\{\{\{?|\}\}\}?$/, alias: "punctuation" },
		string: /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
		number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][+-]?\d+)?/,
		boolean: /\b(?:false|true)\b/,
		block: {
			pattern: /^(\s*(?:~\s*)?)[#\/]\S+?(?=\s*(?:~\s*)?$|\s)/,
			lookbehind: !0,
			alias: "keyword",
		},
		brackets: {
			pattern: /\[[^\]]+\]/,
			inside: { punctuation: /\[|\]/, variable: /[\s\S]+/ },
		},
		punctuation: /[!"#%&':()*+,.\/;<=>@\[\\\]^`{|}~]/,
		variable: /[^!"#%&'()*+,\/;<=>@\[\\\]^`{|}~\s]+/,
	}),
		a.hooks.add("before-tokenize", function (e) {
			a.languages["markup-templating"].buildPlaceholders(
				e,
				"handlebars",
				/\{\{\{[\s\S]+?\}\}\}|\{\{[\s\S]+?\}\}/g,
			);
		}),
		a.hooks.add("after-tokenize", function (e) {
			a.languages["markup-templating"].tokenizePlaceholders(e, "handlebars");
		}),
		(a.languages.hbs = a.languages.handlebars),
		(a.languages.mustache = a.languages.handlebars);
})(Prism);
(Prism.languages.json = {
	property: {
		pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
		lookbehind: !0,
		greedy: !0,
	},
	string: {
		pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
		lookbehind: !0,
		greedy: !0,
	},
	comment: { pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/, greedy: !0 },
	number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
	punctuation: /[{}[\],]/,
	operator: /:/,
	boolean: /\b(?:false|true)\b/,
	null: { pattern: /\bnull\b/, alias: "keyword" },
}),
	(Prism.languages.webmanifest = Prism.languages.json);
!(function (e) {
	e.languages.pug = {
		comment: {
			pattern: /(^([\t ]*))\/\/.*(?:(?:\r?\n|\r)\2[\t ].+)*/m,
			lookbehind: !0,
		},
		"multiline-script": {
			pattern:
				/(^([\t ]*)script\b.*\.[\t ]*)(?:(?:\r?\n|\r(?!\n))(?:\2[\t ].+|\s*?(?=\r?\n|\r)))+/m,
			lookbehind: !0,
			inside: e.languages.javascript,
		},
		filter: {
			pattern:
				/(^([\t ]*)):.+(?:(?:\r?\n|\r(?!\n))(?:\2[\t ].+|\s*?(?=\r?\n|\r)))+/m,
			lookbehind: !0,
			inside: {
				"filter-name": { pattern: /^:[\w-]+/, alias: "variable" },
				text: /\S[\s\S]*/,
			},
		},
		"multiline-plain-text": {
			pattern:
				/(^([\t ]*)[\w\-#.]+\.[\t ]*)(?:(?:\r?\n|\r(?!\n))(?:\2[\t ].+|\s*?(?=\r?\n|\r)))+/m,
			lookbehind: !0,
		},
		markup: {
			pattern: /(^[\t ]*)<.+/m,
			lookbehind: !0,
			inside: e.languages.markup,
		},
		doctype: { pattern: /((?:^|\n)[\t ]*)doctype(?: .+)?/, lookbehind: !0 },
		"flow-control": {
			pattern:
				/(^[\t ]*)(?:case|default|each|else|if|unless|when|while)\b(?: .+)?/m,
			lookbehind: !0,
			inside: {
				each: {
					pattern: /^each .+? in\b/,
					inside: { keyword: /\b(?:each|in)\b/, punctuation: /,/ },
				},
				branch: {
					pattern: /^(?:case|default|else|if|unless|when|while)\b/,
					alias: "keyword",
				},
				rest: e.languages.javascript,
			},
		},
		keyword: {
			pattern: /(^[\t ]*)(?:append|block|extends|include|prepend)\b.+/m,
			lookbehind: !0,
		},
		mixin: [
			{
				pattern: /(^[\t ]*)mixin .+/m,
				lookbehind: !0,
				inside: {
					keyword: /^mixin/,
					function: /\w+(?=\s*\(|\s*$)/,
					punctuation: /[(),.]/,
				},
			},
			{
				pattern: /(^[\t ]*)\+.+/m,
				lookbehind: !0,
				inside: {
					name: { pattern: /^\+\w+/, alias: "function" },
					rest: e.languages.javascript,
				},
			},
		],
		script: {
			pattern: /(^[\t ]*script(?:(?:&[^(]+)?\([^)]+\))*[\t ]).+/m,
			lookbehind: !0,
			inside: e.languages.javascript,
		},
		"plain-text": {
			pattern:
				/(^[\t ]*(?!-)[\w\-#.]*[\w\-](?:(?:&[^(]+)?\([^)]+\))*\/?[\t ]).+/m,
			lookbehind: !0,
		},
		tag: {
			pattern: /(^[\t ]*)(?!-)[\w\-#.]*[\w\-](?:(?:&[^(]+)?\([^)]+\))*\/?:?/m,
			lookbehind: !0,
			inside: {
				attributes: [
					{ pattern: /&[^(]+\([^)]+\)/, inside: e.languages.javascript },
					{
						pattern: /\([^)]+\)/,
						inside: {
							"attr-value": {
								pattern: /(=\s*(?!\s))(?:\{[^}]*\}|[^,)\r\n]+)/,
								lookbehind: !0,
								inside: e.languages.javascript,
							},
							"attr-name": /[\w-]+(?=\s*!?=|\s*[,)])/,
							punctuation: /[!=(),]+/,
						},
					},
				],
				punctuation: /:/,
				"attr-id": /#[\w\-]+/,
				"attr-class": /\.[\w\-]+/,
			},
		},
		code: [
			{
				pattern: /(^[\t ]*(?:-|!?=)).+/m,
				lookbehind: !0,
				inside: e.languages.javascript,
			},
		],
		punctuation: /[.\-!=|]+/,
	};
	for (
		var t = [
				{ filter: "atpl", language: "twig" },
				{ filter: "coffee", language: "coffeescript" },
				"ejs",
				"handlebars",
				"less",
				"livescript",
				"markdown",
				{ filter: "sass", language: "scss" },
				"stylus",
			],
			n = {},
			a = 0,
			i = t.length;
		a < i;
		a++
	) {
		var r = t[a];
		(r = "string" == typeof r ? { filter: r, language: r } : r),
			e.languages[r.language] &&
				(n["filter-" + r.filter] = {
					pattern: RegExp(
						"(^([\t ]*)):<filter_name>(?:(?:\r?\n|\r(?!\n))(?:\\2[\t ].+|\\s*?(?=\r?\n|\r)))+".replace(
							"<filter_name>",
							function () {
								return r.filter;
							},
						),
						"m",
					),
					lookbehind: !0,
					inside: {
						"filter-name": { pattern: /^:[\w-]+/, alias: "variable" },
						text: {
							pattern: /\S[\s\S]*/,
							alias: [r.language, "language-" + r.language],
							inside: e.languages[r.language],
						},
					},
				});
	}
	e.languages.insertBefore("pug", "filter", n);
})(Prism);
(Prism.languages.twig = {
	comment: /^\{#[\s\S]*?#\}$/,
	"tag-name": { pattern: /(^\{%-?\s*)\w+/, lookbehind: !0, alias: "keyword" },
	delimiter: { pattern: /^\{[{%]-?|-?[%}]\}$/, alias: "punctuation" },
	string: {
		pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
		inside: { punctuation: /^['"]|['"]$/ },
	},
	keyword: /\b(?:even|if|odd)\b/,
	boolean: /\b(?:false|null|true)\b/,
	number: /\b0x[\dA-Fa-f]+|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][-+]?\d+)?/,
	operator: [
		{
			pattern:
				/(\s)(?:and|b-and|b-or|b-xor|ends with|in|is|matches|not|or|same as|starts with)(?=\s)/,
			lookbehind: !0,
		},
		/[=<>]=?|!=|\*\*?|\/\/?|\?:?|[-+~%|]/,
	],
	punctuation: /[()\[\]{}:.,]/,
}),
	Prism.hooks.add("before-tokenize", function (e) {
		"twig" === e.language &&
			Prism.languages["markup-templating"].buildPlaceholders(
				e,
				"twig",
				/\{(?:#[\s\S]*?#|%[\s\S]*?%|\{[\s\S]*?\})\}/g,
			);
	}),
	Prism.hooks.add("after-tokenize", function (e) {
		Prism.languages["markup-templating"].tokenizePlaceholders(e, "twig");
	});
!(function (e) {
	var n = /[*&][^\s[\]{},]+/,
		r =
			/!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,
		t =
			"(?:" +
			r.source +
			"(?:[ \t]+" +
			n.source +
			")?|" +
			n.source +
			"(?:[ \t]+" +
			r.source +
			")?)",
		a =
			"(?:[^\\s\\x00-\\x08\\x0e-\\x1f!\"#%&'*,\\-:>?@[\\]`{|}\\x7f-\\x84\\x86-\\x9f\\ud800-\\udfff\\ufffe\\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*".replace(
				/<PLAIN>/g,
				function () {
					return "[^\\s\\x00-\\x08\\x0e-\\x1f,[\\]{}\\x7f-\\x84\\x86-\\x9f\\ud800-\\udfff\\ufffe\\uffff]";
				},
			),
		d = "\"(?:[^\"\\\\\r\n]|\\\\.)*\"|'(?:[^'\\\\\r\n]|\\\\.)*'";
	function o(e, n) {
		n = (n || "").replace(/m/g, "") + "m";
		var r =
			"([:\\-,[{]\\s*(?:\\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\\]|\\}|(?:[\r\n]\\s*)?#))"
				.replace(/<<prop>>/g, function () {
					return t;
				})
				.replace(/<<value>>/g, function () {
					return e;
				});
		return RegExp(r, n);
	}
	(e.languages.yaml = {
		scalar: {
			pattern: RegExp(
				"([\\-:]\\s*(?:\\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\\S[^\r\n]*(?:\\2[^\r\n]+)*)".replace(
					/<<prop>>/g,
					function () {
						return t;
					},
				),
			),
			lookbehind: !0,
			alias: "string",
		},
		comment: /#.*/,
		key: {
			pattern: RegExp(
				"((?:^|[:\\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\\s*:\\s)"
					.replace(/<<prop>>/g, function () {
						return t;
					})
					.replace(/<<key>>/g, function () {
						return "(?:" + a + "|" + d + ")";
					}),
			),
			lookbehind: !0,
			greedy: !0,
			alias: "atrule",
		},
		directive: { pattern: /(^[ \t]*)%.+/m, lookbehind: !0, alias: "important" },
		datetime: {
			pattern: o(
				"\\d{4}-\\d\\d?-\\d\\d?(?:[tT]|[ \t]+)\\d\\d?:\\d{2}:\\d{2}(?:\\.\\d*)?(?:[ \t]*(?:Z|[-+]\\d\\d?(?::\\d{2})?))?|\\d{4}-\\d{2}-\\d{2}|\\d\\d?:\\d{2}(?::\\d{2}(?:\\.\\d*)?)?",
			),
			lookbehind: !0,
			alias: "number",
		},
		boolean: {
			pattern: o("false|true", "i"),
			lookbehind: !0,
			alias: "important",
		},
		null: { pattern: o("null|~", "i"), lookbehind: !0, alias: "important" },
		string: { pattern: o(d), lookbehind: !0, greedy: !0 },
		number: {
			pattern: o(
				"[+-]?(?:0x[\\da-f]+|0o[0-7]+|(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:e[+-]?\\d+)?|\\.inf|\\.nan)",
				"i",
			),
			lookbehind: !0,
		},
		tag: r,
		important: n,
		punctuation: /---|[:[\]{}\-,|>?]|\.\.\./,
	}),
		(e.languages.yml = e.languages.yaml);
})(Prism);
