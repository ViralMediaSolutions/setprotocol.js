"use strict";
// TAKEN pretty much verbatim from the awesome dharma repo with updates for markdown output
exports.__esModule = true;
// External libraries
var fs = require("fs");
var _ = require("lodash");
var HeaderTags;
(function (HeaderTags) {
    HeaderTags["H1"] = "# ";
    HeaderTags["H2"] = "## ";
    HeaderTags["H3"] = "### ";
    HeaderTags["H4"] = "#### ";
    HeaderTags["H5"] = "##### ";
    HeaderTags["H6"] = "###### ";
})(HeaderTags || (HeaderTags = {}));
/**
 * Given a file path to a Typedoc JSON output file, the
 * TypedocParser reads that file, generates a new more user-friendly
 * documentation markdown file.
 *
 * Example:
 *
 * const parser = TypedocParser.new("input/0.0.51.json");
 * await parser.parse();
 * await parser.saveFile("output/0.0.51.json");
 */
var TypedocParser = /** @class */ (function () {
    function TypedocParser(filePath, includedClasses) {
        this.filePath = filePath;
        this.includedClasses = includedClasses;
    }
    TypedocParser.jsCodeBlock = function (inputString) {
        return "```javascript\n" + inputString + "\n```\n\n";
    };
    /**
     * Given a typedoc representation of an object, returns true if that
     * representation is of a class.
     *
     * @param typedocObj
     * @returns {boolean}
     */
    TypedocParser.isClass = function (typedocObj) {
        // All class representations have child data.
        if (!typedocObj.children) {
            return false;
        }
        var firstChild = typedocObj.children[0];
        // All class representations are referred to as "Class".
        return firstChild.kindString === "Class" && typedocObj.name !== '"index"';
    };
    TypedocParser.methodSignature = function (methodName, signature, params, apiPath) {
        var returnType = TypedocParser.returnType(signature);
        if (params === "") {
            return apiPath + "." + methodName + "(): " + returnType;
        }
        return apiPath + "." + methodName + "(\n  " + params + ",\n): " + (returnType || "void");
    };
    TypedocParser.paramType = function (param) {
        var isArray = param.type && param.type.type === "array";
        var isUnion = param.type && param.type.type === "union";
        if (isArray) {
            if (param.type.elementType.type === 'union') {
                var returnType_1 = '';
                _.each(param.type.elementType.types, function (type, index) {
                    if (index) {
                        returnType_1 += ' \| ';
                    }
                    returnType_1 += "" + type.name;
                });
                return "(" + returnType_1 + ")[]";
            }
            return param.type.elementType.name + "[]";
        }
        // TODO - the case for a union type is not handled yet
        // Handle case of function param..
        var isReflection = param.type && param.type.type === "reflection";
        return isReflection ? "Function" : param.type.name;
    };
    /**
     * Given a set of signature parameters, returns a Typescript-style parameter signature.
     *
     * Examples:
     * TypedocParser.paramsString(params);
     * => "agreementId: string"
     *
     * @param {SignatureParameter[]} params
     * @returns {string}
     */
    TypedocParser.paramsString = function (params) {
        if (!params || !params.length) {
            return "";
        }
        return _.map(params, function (param) {
            var isOptional = param.flags && param.flags.isOptional;
            var paramType = TypedocParser.paramType(param);
            return "" + param.name + (isOptional ? '?' : '') + ": " + paramType;
        }).join(",\n  ");
    };
    TypedocParser.paramTable = function (params) {
        if (!params || !params.length) {
            return "";
        }
        var content = '';
        content += "| Name | Type | Description |\n";
        content += "| ------ | ------ | ------ |\n";
        _.each(params, function (param) {
            var paramType = TypedocParser.paramType(param);
            var paramDescription = '';
            if (param.comment && param.comment.text) {
                paramDescription = param.comment.text;
            }
            content += "| " + param.name + " | " + paramType + " | " + paramDescription + " |\n";
        });
        return content;
    };
    TypedocParser.returnComment = function (method) {
        if (method.comment && method.comment.returns) {
            return method.comment.returns;
        }
        return '';
    };
    TypedocParser.sectionName = function (classObj) {
        // Take the class name as the section name
        return classObj.children[0].name;
    };
    TypedocParser.getClassMethods = function (classObj) {
        return _.filter(classObj.children[0].children, function (child) {
            return child.kindString === "Method";
        });
    };
    TypedocParser.getClassName = function (classObj) {
        return classObj.children[0].name;
    };
    TypedocParser.isPromise = function (signature) {
        return signature.type.name === "Promise" &&
            signature.type.typeArguments &&
            signature.type.typeArguments.length;
    };
    TypedocParser.returnType = function (signature) {
        var isArray = signature.type.type && signature.type.type === "array";
        var isUnion = signature.type.type && signature.type.type === "union";
        // Deal with special case for arrays.
        if (isArray) {
            return signature.type.elementType.name + "[]";
        }
        var isPromise = TypedocParser.isPromise(signature);
        var promiseTargetType;
        if (isPromise) {
            var typeArgs = signature.type.typeArguments;
            var isArrayTarget = typeArgs && typeArgs[0].type === "array";
            promiseTargetType = isArrayTarget ? typeArgs[0].elementType.name + "[]" : typeArgs[0].name;
        }
        var promiseTarget = isPromise ? "<" + promiseTargetType + ">" : "";
        return signature.type.name + promiseTarget;
    };
    TypedocParser.deepFilter = function (obj, predicate) {
        var _this = this;
        // Base case:
        if (predicate(obj)) {
            return [obj];
        }
        // Recursively:
        return _.flatten(_.map(obj, function (v) {
            return typeof v === "object" ? _this.deepFilter(v, predicate) : [];
        }));
    };
    TypedocParser.interfacesInSignature = function (signature) {
        var params = signature.parameters;
        var paramInterfaces = _.compact(_.map(params, function (param) {
            if (param.type.type === "reference") {
                return param.type.name;
            }
        }));
        return paramInterfaces || [];
    };
    TypedocParser.prototype.parse = function () {
        // Read the contents of the Typedoc file.
        this.readFile();
        // Transform the Typedoc JSON into human-friendly output.
        this.parseData();
    };
    /**
     * Given a the desired output path, saves a file there containing
     * the human-friendly JSON data.
     *
     * @param {string} outputPath
     */
    TypedocParser.prototype.writeToFile = function (outputPath) {
        // Convert the documentation object into a string, so we can write it to a file.
        var contents = this.output;
        fs.writeFileSync(outputPath, contents);
    };
    TypedocParser.prototype.parseData = function () {
        this.output = this.getMarkdown();
    };
    TypedocParser.prototype.getMarkdown = function () {
        var content = '';
        content += this.getSectionsMarkdown();
        content += this.getInterfacesHeader();
        content += this.getInterfacesMarkdown();
        return content;
    };
    /** --------------- MARKDOWN --------------- **/
    TypedocParser.prototype.getSectionsMarkdown = function () {
        var _this = this;
        var sections = this.getSections();
        var content = '';
        _.each(sections, function (section) {
            content += HeaderTags.H2 + " " + section.title + "\n";
            content += _this.getClassMarkdown(section.classes);
        });
        return content;
    };
    TypedocParser.prototype.getClassMarkdown = function (classes) {
        var _this = this;
        var content = '';
        _.each(classes, function (classInfo) {
            content += _this.getMethodsMarkdown(classInfo.methods);
        });
        return content;
    };
    TypedocParser.prototype.getMethodsMarkdown = function (methods) {
        var content = '';
        _.each(methods, function (method) {
            content += HeaderTags.H3 + " " + method.name + "\n\n";
            if (method.description.length) {
                content += method.description + "\n\n";
            }
            content += "[Source](" + method.source + ")\n\n";
            content += TypedocParser.jsCodeBlock(method.signature);
            if (method.tableParams.length) {
                content += HeaderTags.H6 + " Parameters\n";
                content += method.tableParams;
            }
            if (method.returnType) {
                content += HeaderTags.H6 + " Returns\n";
                content += "`" + method.returnType + "` - " + method.returnComment + "\n";
            }
            content += "\n\n---\n\n";
        });
        return content;
    };
    TypedocParser.prototype.getInterfacesHeader = function () {
        return HeaderTags.H2 + " Interfaces\n";
    };
    TypedocParser.prototype.getInterfacesMarkdown = function () {
        var _this = this;
        var tsTypes = this.getInterfaces();
        var content = '';
        _.each(tsTypes, function (tsType) {
            content += _this.getInterfaceMarkdown(tsType);
        });
        return content;
    };
    TypedocParser.prototype.getInterfaceMarkdown = function (tsType) {
        var content = '';
        content += HeaderTags.H4 + " " + tsType.name + "\n";
        content += TypedocParser.jsCodeBlock(this.getInterfaceParametersMarkdown(tsType));
        return content;
    };
    TypedocParser.prototype.getInterfaceParametersMarkdown = function (tsType) {
        var content = '';
        content += "{\n";
        _.each(tsType.children, function (child) {
            if (child.type) {
                var isArray = child.type.type && child.type.type === "array";
                var isUnion = child.type.type && child.type.type === "union";
                // Deal with special case for arrays.
                if (isArray) {
                    content += "  " + child.name + ": " + child.type.elementType.name + "[];\n";
                    return;
                }
                // Deal with special case of unions
                if (isUnion) {
                    content += "  " + child.name + ": ";
                    _.each(child.type.types, function (type, index) {
                        if (index) {
                            content += ' | ';
                        }
                        content += "" + type.name;
                    });
                    content += ";\n";
                    return;
                }
                content += "  " + child.name + ": " + child.type.name + ";\n";
            }
            else {
                content += "  " + child.name + ": undefined;\n";
            }
        });
        content += "}";
        return content;
    };
    /** --------------- DATA --------------- **/
    TypedocParser.prototype.getSections = function () {
        var groupedClasses = this.classesPerSection();
        return _.map(groupedClasses, this.getSectionData.bind(this));
    };
    TypedocParser.prototype.getInterfaces = function () {
        return TypedocParser.deepFilter(this.input, function (obj) { return obj.kindString === "Interface" && obj.name !== "Interface"; });
    };
    TypedocParser.prototype.getSectionData = function (classes, groupName) {
        return {
            title: groupName,
            classes: this.getClassData(classes)
        };
    };
    TypedocParser.prototype.classesPerSection = function () {
        var allClasses = this.getIncludedClasses();
        return _.groupBy(allClasses, TypedocParser.sectionName);
    };
    TypedocParser.prototype.getIncludedClasses = function () {
        var _this = this;
        // Return all of the typedoc objects that refer to classes.
        var allClasses = _.filter(this.input.children, TypedocParser.isClass.bind(this));
        // Only include the classes that are in the classes passed into the constructor
        var filteredClasses = _.filter(allClasses, function (_class) {
            var currentClassName = _class.children[0].name;
            return _.some(_this.includedClasses, function (_includedClass) { return _includedClass.name === currentClassName; });
        });
        return filteredClasses;
    };
    TypedocParser.prototype.getClassData = function (classes) {
        var _this = this;
        return classes.map(function (klass) {
            var name = klass.children[0].name;
            return {
                name: name,
                methods: _this.getMethodData(klass)
            };
        });
    };
    TypedocParser.prototype.getMethodData = function (classObj) {
        var methods = TypedocParser.getClassMethods(classObj);
        var publicMethods = _.filter(methods, function (publicMethod) { return publicMethod.flags.isPublic; });
        var className = TypedocParser.getClassName(classObj);
        var apiPath = _.find(this.includedClasses, function (_class) { return _class.name === className; }).apiPath;
        return _.map(publicMethods, function (method) {
            var signature = method.signatures[0];
            var params = TypedocParser.paramsString(signature.parameters);
            var tableParams = TypedocParser.paramTable(signature.parameters);
            var description = "";
            if (signature.comment) {
                description = signature.comment.shortText;
                if (signature.comment.text) {
                    description += "\n\n" + signature.comment.text;
                }
            }
            return {
                name: method.name,
                description: description,
                interfaces: TypedocParser.interfacesInSignature(signature),
                params: params,
                returnType: TypedocParser.returnType(signature),
                returnComment: TypedocParser.returnComment(signature),
                source: method.sources[0].fileName + "#L" + method.sources[0].line,
                signature: TypedocParser.methodSignature(method.name, signature, params, apiPath),
                tableParams: tableParams
            };
        });
    };
    TypedocParser.prototype.readFile = function () {
        var rawData = fs.readFileSync(this.filePath, "utf8");
        this.input = JSON.parse(rawData);
    };
    return TypedocParser;
}());
module.exports = TypedocParser;
