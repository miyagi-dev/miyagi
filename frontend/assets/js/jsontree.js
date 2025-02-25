"use strict";
var Is, Data, DomElement, DateTime, Constants;
((e) => {
	function t(e) {
		return null != e && "" !== e.toString();
	}
	function n(e) {
		return t(e) && "object" == typeof e;
	}
	function o(e) {
		return n(e) && e instanceof Array;
	}
	(e.defined = t),
		(e.definedObject = n),
		(e.definedBoolean = function (e) {
			return t(e) && "boolean" == typeof e;
		}),
		(e.definedString = function (e) {
			return t(e) && "string" == typeof e;
		}),
		(e.definedFunction = function (e) {
			return t(e) && "function" == typeof e;
		}),
		(e.definedNumber = function (e) {
			return t(e) && "number" == typeof e;
		}),
		(e.definedArray = o),
		(e.definedDate = function (e) {
			return n(e) && e instanceof Date;
		}),
		(e.definedDecimal = function (e) {
			return t(e) && "number" == typeof e && e % 1 != 0;
		}),
		(e.invalidOptionArray = function (e, t = 1) {
			return !o(e) || e.length < t;
		}),
		(e.hexColor = function (e) {
			let t = e.length >= 2 && e.length <= 7;
			return t && "#" === e[0] && (t = isNaN(+e.substring(1, e.length - 1))), t;
		});
})(Is || (Is = {})),
	((e) => {
		let t;
		var n;
		function o(e, t) {
			return Is.definedArray(e) ? e : t;
		}
		((n = t = e.String || (e.String = {})).newGuid = function () {
			const e = [];
			for (let t = 0; t < 32; t++) {
				(8 !== t && 12 !== t && 16 !== t && 20 !== t) || e.push("-");
				const n = Math.floor(16 * Math.random()).toString(16);
				e.push(n);
			}
			return e.join("");
		}),
			(n.padNumber = function (e, t = 1) {
				const n = e.toString();
				let o = n;
				if (n.length < t) {
					const e = t - n.length + 1;
					o = Array(e).join("0") + n;
				}
				return o;
			}),
			(e.getDefaultAnyString = function (e, t) {
				return "string" == typeof e ? e : t;
			}),
			(e.getDefaultString = function (e, t) {
				return Is.definedString(e) ? e : t;
			}),
			(e.getDefaultBoolean = function (e, t) {
				return Is.definedBoolean(e) ? e : t;
			}),
			(e.getDefaultNumber = function (e, t) {
				return Is.definedNumber(e) ? e : t;
			}),
			(e.getDefaultFunction = function (e, t) {
				return Is.definedFunction(e) ? e : t;
			}),
			(e.getDefaultArray = o),
			(e.getDefaultObject = function (e, t) {
				return Is.definedObject(e) ? e : t;
			}),
			(e.getDefaultStringOrArray = function (e, t) {
				let n = t;
				if (Is.definedString(e)) {
					const o = e.toString().split(" ");
					0 === o.length ? (e = t) : (n = o);
				} else n = o(e, t);
				return n;
			}),
			(e.getFixedDecimalPlacesValue = function (e, t) {
				var n;
				const o = new RegExp("^-?\\d+(?:.\\d{0," + (t || -1) + "})?");
				return (null == (n = e.toString().match(o)) ? void 0 : n[0]) || "";
			});
	})(Data || (Data = {})),
	((e) => {
		function t(e, t, n = "", o = null) {
			const r = t.toLowerCase();
			let a =
				"text" === r ? document.createTextNode("") : document.createElement(r);
			return (
				Is.defined(n) && (a.className = n),
				Is.defined(o) ? e.insertBefore(a, o) : e.appendChild(a),
				a
			);
		}
		(e.create = t),
			(e.createWithHTML = function (e, n, o, r, a = null) {
				const i = t(e, n, o, a);
				return (i.textContent = r), i;
			}),
			(e.addClass = function (e, t) {
				e.classList.add(t);
			});
	})(DomElement || (DomElement = {})),
	((e) => {
		function t(e) {
			return e.getDay() - 1 < 0 ? 6 : e.getDay() - 1;
		}
		function n(e, t) {
			let n = e.thText;
			return (
				31 === t || 21 === t || 1 === t
					? (n = e.stText)
					: 22 === t || 2 === t
						? (n = e.ndText)
						: (23 !== t && 3 !== t) || (n = e.rdText),
				n
			);
		}
		(e.getWeekdayNumber = t),
			(e.getDayOrdinal = n),
			(e.getCustomFormattedDateText = function (e, o, r) {
				let a = r;
				const i = t(o);
				return (
					(a = a.replace("{hh}", Data.String.padNumber(o.getHours(), 2))),
					(a = a.replace("{h}", o.getHours().toString())),
					(a = a.replace("{MM}", Data.String.padNumber(o.getMinutes(), 2))),
					(a = a.replace("{M}", o.getMinutes().toString())),
					(a = a.replace("{ss}", Data.String.padNumber(o.getSeconds(), 2))),
					(a = a.replace("{s}", o.getSeconds().toString())),
					(a = a.replace("{dddd}", e.dayNames[i])),
					(a = a.replace("{ddd}", e.dayNamesAbbreviated[i])),
					(a = a.replace("{dd}", Data.String.padNumber(o.getDate()))),
					(a = a.replace("{d}", o.getDate().toString())),
					(a = a.replace("{o}", n(e, o.getDate()))),
					(a = a.replace("{mmmm}", e.monthNames[o.getMonth()])),
					(a = a.replace("{mmm}", e.monthNamesAbbreviated[o.getMonth()])),
					(a = a.replace("{mm}", Data.String.padNumber(o.getMonth() + 1))),
					(a = a.replace("{m}", (o.getMonth() + 1).toString())),
					(a = a.replace("{yyyy}", o.getFullYear().toString())),
					(a = a.replace("{yyy}", o.getFullYear().toString().substring(1))),
					(a = a.replace("{yy}", o.getFullYear().toString().substring(2))),
					(a = a.replace(
						"{y}",
						Number.parseInt(o.getFullYear().toString().substring(2)).toString(),
					)),
					a
				);
			});
	})(DateTime || (DateTime = {})),
	((Constants || (Constants = {})).JSONTREE_JS_ATTRIBUTE_NAME =
		"data-jsontree-js"),
	(() => {
		let _configuration = {},
			_elements_Data = {};
		function render() {
			const e = _configuration.domElementTypes,
				t = e.length;
			for (let n = 0; n < t; n++) {
				const t = document.getElementsByTagName(e[n]),
					o = [].slice.call(t),
					r = o.length;
				for (let e = 0; e < r && renderElement(o[e]); e++);
			}
		}
		function renderElement(e) {
			let t = !0;
			if (
				Is.defined(e) &&
				e.hasAttribute(Constants.JSONTREE_JS_ATTRIBUTE_NAME)
			) {
				const n = e.getAttribute(Constants.JSONTREE_JS_ATTRIBUTE_NAME);
				if (Is.definedString(n)) {
					const o = getObjectFromString(n);
					o.parsed && Is.definedObject(o.object)
						? renderControl(renderBindingOptions(o.object, e))
						: _configuration.safeMode ||
							(console.error(
								_configuration.attributeNotValidErrorText.replace(
									"{{attribute_name}}",
									Constants.JSONTREE_JS_ATTRIBUTE_NAME,
								),
							),
							(t = !1));
				} else
					_configuration.safeMode ||
						(console.error(
							_configuration.attributeNotSetErrorText.replace(
								"{{attribute_name}}",
								Constants.JSONTREE_JS_ATTRIBUTE_NAME,
							),
						),
						(t = !1));
			}
			return t;
		}
		function renderBindingOptions(e, t) {
			const n = buildAttributeOptions(e);
			return (n._currentView = {}), (n._currentView.element = t), n;
		}
		function renderControl(e) {
			fireCustomTriggerEvent(e.events.onBeforeRender, e._currentView.element),
				Is.definedString(e._currentView.element.id) ||
					(e._currentView.element.id = Data.String.newGuid()),
				(e._currentView.element.className = "json-tree-js"),
				e._currentView.element.removeAttribute(
					Constants.JSONTREE_JS_ATTRIBUTE_NAME,
				),
				_elements_Data.hasOwnProperty(e._currentView.element.id) ||
					(_elements_Data[e._currentView.element.id] = e),
				renderControlContainer(e),
				fireCustomTriggerEvent(
					e.events.onRenderComplete,
					e._currentView.element,
				);
		}
		function renderControlContainer(e) {
			const t = _elements_Data[e._currentView.element.id].data;
			(e._currentView.element.innerHTML = ""),
				renderControlTitleBar(e),
				Is.definedObject(t) && !Is.definedArray(t)
					? renderObject(e._currentView.element, e, t)
					: Is.definedArray(t) && renderArray(e._currentView.element, e, t);
		}
		function renderControlTitleBar(e) {
			if (e.title.show || e.title.showTreeControls || e.title.showCopyButton) {
				const t = DomElement.create(e._currentView.element, "div", "title-bar"),
					n = DomElement.create(t, "div", "controls");
				if (
					(e.title.show &&
						DomElement.createWithHTML(t, "div", "title", e.title.text, n),
					e.title.showCopyButton)
				) {
					DomElement.createWithHTML(
						n,
						"button",
						"copy-all",
						_configuration.copyAllButtonText,
					).onclick = () => {
						const t = JSON.stringify(
							_elements_Data[e._currentView.element.id].data,
						);
						navigator.clipboard.writeText(t),
							fireCustomTriggerEvent(e.events.onCopyAll, t);
					};
				}
				if (e.title.showTreeControls) {
					const t = DomElement.createWithHTML(
							n,
							"button",
							"openAll",
							_configuration.openAllButtonText,
						),
						o = DomElement.createWithHTML(
							n,
							"button",
							"closeAll",
							_configuration.closeAllButtonText,
						);
					(t.onclick = () => {
						openAllNodes(e);
					}),
						(o.onclick = () => {
							closeAllNodes(e);
						});
				}
			}
		}
		function openAllNodes(e) {
			(e.showAllAsClosed = !1),
				renderControlContainer(e),
				fireCustomTriggerEvent(e.events.onOpenAll, e._currentView.element);
		}
		function closeAllNodes(e) {
			(e.showAllAsClosed = !0),
				renderControlContainer(e),
				fireCustomTriggerEvent(e.events.onCloseAll, e._currentView.element);
		}
		function renderObject(e, t, n) {
			const o = DomElement.create(e, "div", "object-type-title"),
				r = DomElement.create(e, "div", "object-type-contents"),
				a = renderObjectValues(
					t.showArrowToggles
						? DomElement.create(o, "button", "down-arrow")
						: null,
					r,
					t,
					n,
				);
			DomElement.createWithHTML(
				o,
				"span",
				t.showValueColors ? "object" : "",
				_configuration.objectText,
			),
				t.showCounts &&
					a > 0 &&
					DomElement.createWithHTML(
						o,
						"span",
						t.showValueColors ? "object count" : "count",
						"{" + a + "}",
					);
		}
		function renderArray(e, t, n) {
			const o = DomElement.create(e, "div", "object-type-title"),
				r = DomElement.create(e, "div", "object-type-contents"),
				a = t.showArrowToggles
					? DomElement.create(o, "button", "down-arrow")
					: null;
			DomElement.createWithHTML(
				o,
				"span",
				t.showValueColors ? "array" : "",
				_configuration.arrayText,
			),
				renderArrayValues(a, r, t, n),
				t.showCounts &&
					DomElement.createWithHTML(
						o,
						"span",
						t.showValueColors ? "array count" : "count",
						"[" + n.length + "]",
					);
		}
		function renderObjectValues(e, t, n, o) {
			let r = 0,
				a = [];
			for (let e in o) o.hasOwnProperty(e) && a.push(e);
			n.sortPropertyNames &&
				((a = a.sort()),
				n.sortPropertyNamesInAlphabeticalOrder || (a = a.reverse()));
			const i = a.length;
			for (let e = 0; e < i; e++) {
				const l = a[e];
				o.hasOwnProperty(l) && (renderValue(t, n, l, o[l], e === i - 1), r++);
			}
			return addArrowEvent(n, e, t), r;
		}
		function renderArrayValues(e, t, n, o) {
			const r = o.length;
			if (n.reverseArrayValues)
				for (let e = r; e--; )
					renderValue(t, n, getIndexName(n, e, r), o[e], 0 === e);
			else
				for (let e = 0; e < r; e++)
					renderValue(t, n, getIndexName(n, e, r), o[e], e === r - 1);
			addArrowEvent(n, e, t);
		}
		function renderValue(e, t, n, o, r) {
			const a = DomElement.create(e, "div", "object-type-value"),
				i = t.showArrowToggles
					? DomElement.create(a, "button", "no-arrow")
					: null;
			let l = null,
				s = null,
				u = !1,
				c = null,
				d = !0;
			if (
				(DomElement.createWithHTML(a, "span", "title", n),
				DomElement.createWithHTML(a, "span", "split", ":"),
				Is.defined(o))
			)
				if (Is.definedFunction(o))
					t.ignore.functionValues
						? (u = !0)
						: ((l = t.showValueColors ? "function" : ""),
							(s = DomElement.createWithHTML(a, "span", l, getFunctionName(o))),
							(c = "function"),
							Is.definedFunction(t.events.onFunctionRender) &&
								fireCustomTriggerEvent(t.events.onFunctionRender, s),
							createComma(t, a, r));
				else if (Is.definedBoolean(o))
					t.ignore.booleanValues
						? (u = !0)
						: ((l = t.showValueColors ? "boolean" : ""),
							(s = DomElement.createWithHTML(a, "span", l, o)),
							(c = "boolean"),
							Is.definedFunction(t.events.onBooleanRender) &&
								fireCustomTriggerEvent(t.events.onBooleanRender, s),
							createComma(t, a, r));
				else if (Is.definedDecimal(o))
					if (t.ignore.decimalValues) u = !0;
					else {
						const e = Data.getFixedDecimalPlacesValue(
							o,
							t.maximumDecimalPlaces,
						);
						(l = t.showValueColors ? "decimal" : ""),
							(s = DomElement.createWithHTML(a, "span", l, e)),
							(c = "decimal"),
							Is.definedFunction(t.events.onDecimalRender) &&
								fireCustomTriggerEvent(t.events.onDecimalRender, s),
							createComma(t, a, r);
					}
				else if (Is.definedNumber(o))
					t.ignore.numberValues
						? (u = !0)
						: ((l = t.showValueColors ? "number" : ""),
							(s = DomElement.createWithHTML(a, "span", l, o)),
							(c = "number"),
							Is.definedFunction(t.events.onNumberRender) &&
								fireCustomTriggerEvent(t.events.onNumberRender, s),
							createComma(t, a, r));
				else if (Is.definedString(o))
					if (t.ignore.stringValues) u = !0;
					else {
						let e = null;
						t.showValueColors && t.showStringHexColors && Is.hexColor(o)
							? (e = o)
							: t.maximumStringLength > 0 &&
								o.length > t.maximumStringLength &&
								(o =
									o.substring(0, t.maximumStringLength) +
									_configuration.ellipsisText);
						const n = t.showStringQuotes ? '"' + o + '"' : o;
						(l = t.showValueColors ? "string" : ""),
							(s = DomElement.createWithHTML(a, "span", l, n)),
							(c = "string"),
							Is.definedString(e) && (s.style.color = e),
							Is.definedFunction(t.events.onStringRender) &&
								fireCustomTriggerEvent(t.events.onStringRender, s),
							createComma(t, a, r);
					}
				else if (Is.definedDate(o))
					t.ignore.dateValues
						? (u = !0)
						: ((l = t.showValueColors ? "date" : ""),
							(s = DomElement.createWithHTML(
								a,
								"span",
								l,
								DateTime.getCustomFormattedDateText(
									_configuration,
									o,
									t.dateTimeFormat,
								),
							)),
							(c = "date"),
							Is.definedFunction(t.events.onDateRender) &&
								fireCustomTriggerEvent(t.events.onDateRender, s),
							createComma(t, a, r));
				else if (Is.definedObject(o) && !Is.definedArray(o))
					if (t.ignore.objectValues) u = !0;
					else {
						const e = DomElement.create(
								a,
								"span",
								t.showValueColors ? "object" : "",
							),
							n = renderObjectValues(
								i,
								DomElement.create(a, "div", "object-type-contents"),
								t,
								o,
							);
						DomElement.createWithHTML(
							e,
							"span",
							"title",
							_configuration.objectText,
						),
							t.showCounts &&
								n > 0 &&
								DomElement.createWithHTML(e, "span", "count", "{" + n + "}"),
							createComma(t, e, r),
							(c = "object");
					}
				else if (Is.definedArray(o))
					if (t.ignore.arrayValues) u = !0;
					else {
						const e = DomElement.create(
								a,
								"span",
								t.showValueColors ? "array" : "",
							),
							n = DomElement.create(a, "div", "object-type-contents");
						DomElement.createWithHTML(
							e,
							"span",
							"title",
							_configuration.arrayText,
						),
							t.showCounts &&
								DomElement.createWithHTML(
									e,
									"span",
									"count",
									"[" + o.length + "]",
								),
							createComma(t, e, r),
							renderArrayValues(i, n, t, o),
							(c = "array");
					}
				else
					t.ignore.unknownValues
						? (u = !0)
						: ((l = t.showValueColors ? "unknown" : ""),
							(s = DomElement.createWithHTML(a, "span", l, o.toString())),
							(c = "unknown"),
							Is.definedFunction(t.events.onUnknownRender) &&
								fireCustomTriggerEvent(t.events.onUnknownRender, s),
							createComma(t, a, r));
			else
				t.ignore.nullValues
					? (u = !0)
					: ((l = t.showValueColors ? "null" : ""),
						(s = DomElement.createWithHTML(a, "span", l, "null")),
						(d = !1),
						Is.definedFunction(t.events.onNullRender) &&
							fireCustomTriggerEvent(t.events.onNullRender, s),
						createComma(t, a, r));
			u ? e.removeChild(a) : Is.defined(s) && addValueClickEvent(t, s, o, c, d);
		}
		function addValueClickEvent(e, t, n, o, r) {
			r && Is.definedFunction(e.events.onValueClick)
				? (t.onclick = () => {
						fireCustomTriggerEvent(e.events.onValueClick, n, o);
					})
				: DomElement.addClass(t, "no-hover");
		}
		function addArrowEvent(e, t, n) {
			Is.defined(t) &&
				((t.onclick = () => {
					"down-arrow" === t.className
						? ((n.style.display = "none"), (t.className = "right-arrow"))
						: ((n.style.display = "block"), (t.className = "down-arrow"));
				}),
				e.showAllAsClosed
					? ((n.style.display = "none"), (t.className = "right-arrow"))
					: (t.className = "down-arrow"));
		}
		function getFunctionName(e) {
			let t;
			const n = e.toString().split("(")[0].split(" ");
			return (t = 2 === n.length ? n[1] : n[0]), (t += "()"), t;
		}
		function createComma(e, t, n) {
			e.showCommas && !n && DomElement.createWithHTML(t, "span", "comma", ",");
		}
		function getIndexName(e, t, n) {
			let o = e.useZeroIndexingForArrays ? t.toString() : (t + 1).toString();
			return (
				e.addArrayIndexPadding ||
					(o = Data.String.padNumber(parseInt(o), n.toString().length)),
				o
			);
		}
		function buildAttributeOptions(e) {
			let t = Data.getDefaultObject(e, {});
			return (
				(t.data = Data.getDefaultObject(t.data, null)),
				(t.showCounts = Data.getDefaultBoolean(t.showCounts, !0)),
				(t.useZeroIndexingForArrays = Data.getDefaultBoolean(
					t.useZeroIndexingForArrays,
					!0,
				)),
				(t.dateTimeFormat = Data.getDefaultString(
					t.dateTimeFormat,
					"{dd}{o} {mmmm} {yyyy} {hh}:{MM}:{ss}",
				)),
				(t.showArrowToggles = Data.getDefaultBoolean(t.showArrowToggles, !0)),
				(t.showStringQuotes = Data.getDefaultBoolean(t.showStringQuotes, !0)),
				(t.showAllAsClosed = Data.getDefaultBoolean(t.showAllAsClosed, !1)),
				(t.sortPropertyNames = Data.getDefaultBoolean(t.sortPropertyNames, !0)),
				(t.sortPropertyNamesInAlphabeticalOrder = Data.getDefaultBoolean(
					t.sortPropertyNamesInAlphabeticalOrder,
					!0,
				)),
				(t.showCommas = Data.getDefaultBoolean(t.showCommas, !1)),
				(t.reverseArrayValues = Data.getDefaultBoolean(
					t.reverseArrayValues,
					!1,
				)),
				(t.addArrayIndexPadding = Data.getDefaultBoolean(
					t.addArrayIndexPadding,
					!1,
				)),
				(t.showValueColors = Data.getDefaultBoolean(t.showValueColors, !0)),
				(t.maximumDecimalPlaces = Data.getDefaultNumber(
					t.maximumDecimalPlaces,
					2,
				)),
				(t.maximumStringLength = Data.getDefaultNumber(
					t.maximumStringLength,
					0,
				)),
				(t.showStringHexColors = Data.getDefaultBoolean(
					t.showStringHexColors,
					!1,
				)),
				(t = buildAttributeOptionTitle(t)),
				(t = buildAttributeOptionIgnore(t)),
				(t = buildAttributeOptionCustomTriggers(t)),
				t
			);
		}
		function buildAttributeOptionTitle(e) {
			return (
				(e.title = Data.getDefaultObject(e.title, {})),
				(e.title.text = Data.getDefaultString(e.title.text, "JsonTree.js")),
				(e.title.show = Data.getDefaultBoolean(e.title.show, !0)),
				(e.title.showTreeControls = Data.getDefaultBoolean(
					e.title.showTreeControls,
					!0,
				)),
				(e.title.showCopyButton = Data.getDefaultBoolean(
					e.title.showCopyButton,
					!1,
				)),
				e
			);
		}
		function buildAttributeOptionIgnore(e) {
			return (
				(e.ignore = Data.getDefaultObject(e.ignore, {})),
				(e.ignore.nullValues = Data.getDefaultBoolean(e.ignore.nullValues, !1)),
				(e.ignore.functionValues = Data.getDefaultBoolean(
					e.ignore.functionValues,
					!1,
				)),
				(e.ignore.unknownValues = Data.getDefaultBoolean(
					e.ignore.unknownValues,
					!1,
				)),
				(e.ignore.booleanValues = Data.getDefaultBoolean(
					e.ignore.booleanValues,
					!1,
				)),
				(e.ignore.decimalValues = Data.getDefaultBoolean(
					e.ignore.decimalValues,
					!1,
				)),
				(e.ignore.numberValues = Data.getDefaultBoolean(
					e.ignore.numberValues,
					!1,
				)),
				(e.ignore.stringValues = Data.getDefaultBoolean(
					e.ignore.stringValues,
					!1,
				)),
				(e.ignore.dateValues = Data.getDefaultBoolean(e.ignore.dateValues, !1)),
				(e.ignore.objectValues = Data.getDefaultBoolean(
					e.ignore.objectValues,
					!1,
				)),
				(e.ignore.arrayValues = Data.getDefaultBoolean(
					e.ignore.arrayValues,
					!1,
				)),
				e
			);
		}
		function buildAttributeOptionCustomTriggers(e) {
			return (
				(e.events = Data.getDefaultObject(e.events, {})),
				(e.events.onBeforeRender = Data.getDefaultFunction(
					e.events.onBeforeRender,
					null,
				)),
				(e.events.onRenderComplete = Data.getDefaultFunction(
					e.events.onRenderComplete,
					null,
				)),
				(e.events.onValueClick = Data.getDefaultFunction(
					e.events.onValueClick,
					null,
				)),
				(e.events.onRefresh = Data.getDefaultFunction(
					e.events.onRefresh,
					null,
				)),
				(e.events.onCopyAll = Data.getDefaultFunction(
					e.events.onCopyAll,
					null,
				)),
				(e.events.onOpenAll = Data.getDefaultFunction(
					e.events.onOpenAll,
					null,
				)),
				(e.events.onCloseAll = Data.getDefaultFunction(
					e.events.onCloseAll,
					null,
				)),
				(e.events.onDestroy = Data.getDefaultFunction(
					e.events.onDestroy,
					null,
				)),
				(e.events.onBooleanRender = Data.getDefaultFunction(
					e.events.onBooleanRender,
					null,
				)),
				(e.events.onDecimalRender = Data.getDefaultFunction(
					e.events.onDecimalRender,
					null,
				)),
				(e.events.onNumberRender = Data.getDefaultFunction(
					e.events.onNumberRender,
					null,
				)),
				(e.events.onStringRender = Data.getDefaultFunction(
					e.events.onStringRender,
					null,
				)),
				(e.events.onDateRender = Data.getDefaultFunction(
					e.events.onDateRender,
					null,
				)),
				(e.events.onFunctionRender = Data.getDefaultFunction(
					e.events.onFunctionRender,
					null,
				)),
				(e.events.onNullRender = Data.getDefaultFunction(
					e.events.onNullRender,
					null,
				)),
				(e.events.onUnknownRender = Data.getDefaultFunction(
					e.events.onUnknownRender,
					null,
				)),
				e
			);
		}
		function fireCustomTriggerEvent(e, ...t) {
			Is.definedFunction(e) && e.apply(null, [].slice.call(t, 0));
		}
		function getObjectFromString(objectString) {
			const result = {
				parsed: !0,
				object: null,
			};
			try {
				Is.definedString(objectString) &&
					(result.object = JSON.parse(objectString));
			} catch (e1) {
				try {
					(result.object = eval("(" + objectString + ")")),
						Is.definedFunction(result.object) &&
							(result.object = result.object());
				} catch (e) {
					_configuration.safeMode ||
						(console.error(
							_configuration.objectErrorText
								.replace("{{error_1}}", e1.message)
								.replace("{{error_2}}", e.message),
						),
						(result.parsed = !1)),
						(result.object = null);
				}
			}
			return result;
		}
		function destroyElement(e) {
			(e._currentView.element.innerHTML = ""),
				(e._currentView.element.className = ""),
				fireCustomTriggerEvent(e.events.onDestroy, e._currentView.element);
		}
		function buildDefaultConfiguration(e = null) {
			(_configuration = Data.getDefaultObject(e, {})),
				(_configuration.safeMode = Data.getDefaultBoolean(
					_configuration.safeMode,
					!0,
				)),
				(_configuration.domElementTypes = Data.getDefaultStringOrArray(
					_configuration.domElementTypes,
					["*"],
				)),
				buildDefaultConfigurationStrings();
		}
		function buildDefaultConfigurationStrings() {
			(_configuration.objectText = Data.getDefaultAnyString(
				_configuration.objectText,
				"object",
			)),
				(_configuration.arrayText = Data.getDefaultAnyString(
					_configuration.arrayText,
					"array",
				)),
				(_configuration.closeAllButtonText = Data.getDefaultAnyString(
					_configuration.closeAllButtonText,
					"Close All",
				)),
				(_configuration.openAllButtonText = Data.getDefaultAnyString(
					_configuration.openAllButtonText,
					"Open All",
				)),
				(_configuration.copyAllButtonText = Data.getDefaultAnyString(
					_configuration.copyAllButtonText,
					"Copy All",
				)),
				(_configuration.objectErrorText = Data.getDefaultAnyString(
					_configuration.objectErrorText,
					"Errors in object: {{error_1}}, {{error_2}}",
				)),
				(_configuration.attributeNotValidErrorText = Data.getDefaultAnyString(
					_configuration.attributeNotValidErrorText,
					"The attribute '{{attribute_name}}' is not a valid object.",
				)),
				(_configuration.attributeNotSetErrorText = Data.getDefaultAnyString(
					_configuration.attributeNotSetErrorText,
					"The attribute '{{attribute_name}}' has not been set correctly.",
				)),
				(_configuration.stText = Data.getDefaultAnyString(
					_configuration.stText,
					"st",
				)),
				(_configuration.ndText = Data.getDefaultAnyString(
					_configuration.ndText,
					"nd",
				)),
				(_configuration.rdText = Data.getDefaultAnyString(
					_configuration.rdText,
					"rd",
				)),
				(_configuration.thText = Data.getDefaultAnyString(
					_configuration.thText,
					"th",
				)),
				(_configuration.ellipsisText = Data.getDefaultAnyString(
					_configuration.ellipsisText,
					"...",
				)),
				Is.invalidOptionArray(_configuration.dayNames, 7) &&
					(_configuration.dayNames = [
						"Monday",
						"Tuesday",
						"Wednesday",
						"Thursday",
						"Friday",
						"Saturday",
						"Sunday",
					]),
				Is.invalidOptionArray(_configuration.dayNamesAbbreviated, 7) &&
					(_configuration.dayNamesAbbreviated = [
						"Mon",
						"Tue",
						"Wed",
						"Thu",
						"Fri",
						"Sat",
						"Sun",
					]),
				Is.invalidOptionArray(_configuration.monthNames, 12) &&
					(_configuration.monthNames = [
						"January",
						"February",
						"March",
						"April",
						"May",
						"June",
						"July",
						"August",
						"September",
						"October",
						"November",
						"December",
					]),
				Is.invalidOptionArray(_configuration.monthNamesAbbreviated, 12) &&
					(_configuration.monthNamesAbbreviated = [
						"Jan",
						"Feb",
						"Mar",
						"Apr",
						"May",
						"Jun",
						"Jul",
						"Aug",
						"Sep",
						"Oct",
						"Nov",
						"Dec",
					]);
		}
		const _public = {
			refresh: function (e) {
				if (Is.definedString(e) && _elements_Data.hasOwnProperty(e)) {
					const t = _elements_Data[e];
					renderControlContainer(t),
						fireCustomTriggerEvent(t.events.onRefresh, t._currentView.element);
				}
				return _public;
			},
			refreshAll: function () {
				for (let e in _elements_Data)
					if (_elements_Data.hasOwnProperty(e)) {
						const t = _elements_Data[e];
						renderControlContainer(t),
							fireCustomTriggerEvent(
								t.events.onRefresh,
								t._currentView.element,
							);
					}
				return _public;
			},
			render: function (e, t) {
				return (
					Is.definedObject(e) &&
						Is.definedObject(t) &&
						renderControl(renderBindingOptions(t, e)),
					_public
				);
			},
			renderAll: function () {
				return render(), _public;
			},
			openAll: function (e) {
				return (
					Is.definedString(e) &&
						_elements_Data.hasOwnProperty(e) &&
						openAllNodes(_elements_Data[e]),
					_public
				);
			},
			closeAll: function (e) {
				return (
					Is.definedString(e) &&
						_elements_Data.hasOwnProperty(e) &&
						closeAllNodes(_elements_Data[e]),
					_public
				);
			},
			destroy: function (e) {
				return (
					Is.definedString(e) &&
						_elements_Data.hasOwnProperty(e) &&
						(destroyElement(_elements_Data[e]), delete _elements_Data[e]),
					_public
				);
			},
			destroyAll: function () {
				for (let e in _elements_Data)
					_elements_Data.hasOwnProperty(e) && destroyElement(_elements_Data[e]);
				return (_elements_Data = {}), _public;
			},
			setConfiguration: function (e) {
				if (Is.definedObject(e)) {
					let t = !1;
					const n = _configuration;
					for (let o in e)
						e.hasOwnProperty(o) &&
							_configuration.hasOwnProperty(o) &&
							n[o] !== e[o] &&
							((n[o] = e[o]), (t = !0));
					t && buildDefaultConfiguration(n);
				}
				return _public;
			},
			getIds: function () {
				const e = [];
				for (let t in _elements_Data)
					_elements_Data.hasOwnProperty(t) && e.push(t);
				return e;
			},
			getVersion: function () {
				return "2.0.0";
			},
		};
		buildDefaultConfiguration(),
			document.addEventListener("DOMContentLoaded", function () {
				render();
			}),
			Is.defined(window.$jsontree) || (window.$jsontree = _public);
	})();
