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
        const nodes = node.expressions.map(expr => this.shrinkNode(expr));
        const word = nodes.join('');
        const versions: string[] = [word];

        for (let currentIndex = 0; currentIndex < nodes.length; currentIndex ++) {
            for (let len = 1; len < nodes.length; len ++) {
                let current = word.substring(currentIndex, len);
                let regex = new RegExp(`(${current})\\1+`);
    
                let version = word.replace(regex, (a, b, c) => {
                    const length = a.split(b).length - 1;
                    return (length <= 0) ? a : `${b}{${length}}`;
                });
    
                if (!versions.includes(version)) versions.unshift(version);
            }
        }

        return versions.sort((a, b) => a.length - b.length)[0];
    }

    private shrinkDisjunction(node: regexTypes.Disjunction): string {
        return this.shrinkNode((node as any).left) + '|' + this.shrinkNode((node as any).right);
    }
}