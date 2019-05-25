import * as regexTypes from "regexp-tree/ast";
import * as regexpTree from "regexp-tree";



export class RegexShrinker {

    public shrink(regex: string | RegExp): string {
        const tree = regexpTree.parse(regex instanceof RegExp ? regex : `/${regex}/`, {});
        return this.shrinkAstRegExp(tree);
    }

    private shrinkAstRegExp(tree: regexTypes.AstRegExp): string {
        return !tree.body ? '' : this.shrinkNode(tree.body);
    }

    private shrinkNode(node: regexTypes.Expression): string {
        if (node.type === 'Char') return this.shrinkChar(node);
        if (node.type === 'Alternative') return this.shrinkAlternative(node);
        if (node.type === 'Disjunction') return this.shrinkDisjunction(node);

        throw new Error(`No shrinker for ${node.type}`);
    }

    private shrinkChar(node: regexTypes.Char): string {
        return node.value;
    }

    private shrinkAlternative(node: regexTypes.Alternative): string {
        const len = node.expressions.length;
        const nodes = node.expressions.map(expr => this.shrinkNode(expr));
        const versions: string[] = [nodes.join('')];

        let current = nodes[0];
        let version = current;
        for (let i = 0; i < len; i++) {
            let next = nodes[i+1];
            if (current === next && next !== undefined) {
                version += '' + next;
            } else {
                if (version.length >= 4) {
                    versions.push(`${current}{${version.length}}${nodes.slice(version.length).join('')}`);
                }
                current = next;   
            }
        }

        return versions.sort((a, b) => a.length - b.length)[0];
    }

    private shrinkDisjunction(node: regexTypes.Disjunction): string {
        return this.shrinkNode((node as any).left) + '|' + this.shrinkNode((node as any).right);
    }
}