import { Expect, Test, TestCase, TestFixture, FocusTest } from "alsatian";
import { RegexShrinker } from "../src/RegexShrinker";

@TestFixture('RegexShrinkerTest')
export class RegexShrinkerTest {

    @TestCase('a', 'a')
    @TestCase('aa', 'aa')
    @TestCase('aaa', 'aaa')
    @TestCase('aaaa', 'a{4}')
    @TestCase('aaaaa', 'a{5}')
    @TestCase('aaaaaa', 'a{6}')
    @TestCase('aaaaaaaaaaaaa', 'a{13}')
    @TestCase('aaaaaaaaaaaaab', 'a{13}b')
    @TestCase('aaaaaaaaaaaaa|bbbbbbbbbbbbb', 'a{13}|b{13}')
    @TestCase('bcccccccbb', 'bc{7}bb')
    @Test('Shrink with alternative operator single char')
    public shrinkAlternatives(initialRegex: string, finalRegex: string) {
        const shrinker = new RegexShrinker();
        Expect(shrinker.shrink(initialRegex)).toEqual(finalRegex);
    }

    @TestCase('ababab', 'ab{3}')
    @TestCase('abcabcabc', 'abc{3}')
    @Test('Shrink with alternative operator more char')
    public shrinkAlternativeMoreChars(initialRegex: string, finalRegex: string) {
        const shrinker = new RegexShrinker();
        Expect(shrinker.shrink(initialRegex)).toEqual(finalRegex);
    }

    // @TestCase('zza{5}a{5}hh', 'zza{10}hh')
}