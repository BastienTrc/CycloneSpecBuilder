
import 'brace/mode/text';


// var oop = require("../lib/oop");
// var DocCommentHighlightRules = window.ace.acequire('./doc_comment_highlight_rules').DocCommentHighlightRules;
// var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
export class CustomHighlightRules extends window.ace.acequire("ace/mode/text_highlight_rules").TextHighlightRules {
	constructor() {
		super();
    var keywords = ("abstract|assert|at|bool|char|" +
    "condition|const|check|edge|enum|" +
    "enumerate|final|for|fresh|goal|" +
    "graph|int|initial|invariant|label|" +
    "let|machine|node|normal|prev|" +
    "on|reach|real|start|state|" +
    "stop|string|trans|transition|via|where|with");
    var buildinConstants = ("null|true|false");
    var keywordMapper = this.createKeywordMapper({
        "variable.language": "this",
        "keyword": keywords,
        "constant.language": buildinConstants,
    }, "identifier");
    this.$rules = {
        "start": [
            {
                token: "comment",
                regex: "\\/\\/.*$"
            },
            // DocCommentHighlightRules.getStartRule("doc-start"),
            {
                token: "comment",
                regex: "\\/\\*",
                next: "comment"
            }, {
                token: "string",
                regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token: "string",
                regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            }, {
                token: "constant.numeric",
                regex: /0(?:[xX][0-9a-fA-F][0-9a-fA-F_]*|[bB][01][01_]*)[LlSsDdFfYy]?\b/
            }, {
                token: "constant.numeric",
                regex: /[+-]?\d[\d_]*(?:(?:\.[\d_]*)?(?:[eE][+-]?[\d_]+)?)?[LlSsDdFfYy]?\b/
            }, {
                token: "constant.language.boolean",
                regex: "(?:true|false)\\b"
            }, {
                regex: "(open(?:\\s+))?module(?=\\s*\\w)",
                token: "keyword",
                next: [{
                        regex: "{",
                        token: "paren.lparen",
                        next: [{
                                regex: "}",
                                token: "paren.rparen",
                                next: "start"
                            }, {
                                regex: "\\b(requires|transitive|exports|opens|to|uses|provides|with)\\b",
                                token: "keyword"
                            }]
                    }, {
                        token: "text",
                        regex: "\\s+"
                    }, {
                        token: "identifier",
                        regex: "\\w+"
                    }, {
                        token: "punctuation.operator",
                        regex: "."
                    }, {
                        token: "text",
                        regex: "\\s+"
                    }, {
                        regex: "",
                        next: "start"
                    }]
            }, {
                token: keywordMapper,
                regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token: "keyword.operator",
                regex: "!|\\$|%|&|\\||\\^|\\*|\\/|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?|\\:|\\*=|\\/=|%=|\\+=|\\-=|&=|\\|=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"
            }, {
                token: "lparen",
                regex: "[[({]"
            }, {
                token: "rparen",
                regex: "[\\])}]"
            }, {
                token: "text",
                regex: "\\s+"
            }
        ],
        "comment": [
            {
                token: "comment",
                regex: "\\*\\/",
                next: "start"
            }, {
                defaultToken: "comment"
            }
        ]
    };
}
};

export default class CycloneMode extends window.ace.acequire('ace/mode/text').Mode {
	constructor() {
		super();
		this.HighlightRules = CustomHighlightRules;
	}
}
