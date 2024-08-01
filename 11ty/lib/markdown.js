import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";

export default markdownIt({
	html: true,
	linkify: false,
}).use(markdownItAnchor, {
	permalink: markdownItAnchor.permalink.linkInsideHeader({
		symbol: `
      <span class="u-hiddenVisually">Jump to heading</span>
      <span aria-hidden="true">#</span>
    `,
		placement: "before",
	}),
});
