import { Expect, Test, TestCase, TestFixture, FocusTest } from "alsatian";
import { RegexShrinker } from "../src/RegexShrinker";

@TestFixture('RegexShrinkerTest')
export class RegexShrinkerTest {

    @TestCase('a', 'a')
    @TestCase('aa', 'aa')
    @TestCase('aaa', 'aaa')
    @TestCase('aaaa', 'aaaa')
    @TestCase('aaaaa', 'a{5}')
    @TestCase('aaaaaa', 'a{6}')
    @TestCase('aaaaaaaaaaaaa', 'a{13}')
    @TestCase('aaaaaaaaaaaaab', 'a{13}b')
    @TestCase('aaaaaaaaaaaaa|bbbbbbbbbbbbb', 'a{13}|b{13}')
    @Test('Shrink with alternative operator single char')
    public shrinkAlternatives(initialRegex: string, finalRegex: string) {
        const shrinker = new RegexShrinker();
        Expect(shrinker.shrink(initialRegex)).toEqual(finalRegex);
    }

    @TestCase('abcabcabc', 'abc{3}')
    @Test('Shrink with alternative operator more char')
    public shrinkAlternativeMoreChars(initialRegex: string, finalRegex: string) {
        const shrinker = new RegexShrinker();
        Expect(shrinker.shrink(initialRegex)).toEqual(finalRegex);
    }
}