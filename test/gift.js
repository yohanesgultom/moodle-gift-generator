const Gift = require('../src/gift.js')
const assert = require('assert')

describe('Gift', () => {    
    
    it('stripTags', () => {
        assert.equal(Gift.stripTags('<p>hello</p>'), 'hello')
        assert.equal(Gift.stripTags('<p>hello <b>world</b></p>', '<b>'), 'hello <b>world</b>')
    })

    it('convertToSafeName', () => {
        assert.equal(Gift.convertToSafeName('<p>hello</p>'), 'hello')
        assert.equal(Gift.convertToSafeName('<p>hello</p>', 4), 'hell')
    })

    it('convertToSafeHTML', () => {
        assert.equal(Gift.convertToSafeHTML('<p>hello</p>'), 'hello')
    })

    it('extractValue', () => {
        let input = `1.Saturn’s largest moon * Mercury`
        let expected = `Saturn’s largest moon * Mercury`
        assert.equal(Gift.extractValue(input), expected)
    })    

    it('parseMultipleChoice', () => {
        let input = `1.Who is <em>Indonesia's</em> 1st <strong>president</strong>?
*a.Ir. Sukarno
b.Moh. Hatta
c.Sukarno Hatta
d.Suharto`
        let expected = {
            name: `Who is Indonesia's 1st president?`,
            question: `Who is <em>Indonesia's</em> 1st <strong>president</strong>?`,
            type: 'multiple-choice',
            options: [
                {answer: true, text: 'Ir. Sukarno'},
                {answer: false, text: 'Moh. Hatta'},
                {answer: false, text: 'Sukarno Hatta'},
                {answer: false, text: 'Suharto'},
            ]
        }
        let actual = Gift.parseMultipleChoice(input.split('\n'))
        assert.deepEqual(actual, expected)
    })    

    it('parseMatching', () => {
        let input = `Matching.Match each definition about <strong>space</strong> below
1.Saturn’s largest moon * Mercury
2.The 2nd biggest planet in our solar system * Saturn
3.The hottest planet in our solar system * Venus
4.Planet famous for its big red spot on it * Jupiter
5.Planet known as the red planet * Mars
6.Saturn’s largest moon * Titan
`
        let expected = {
            name: `Match each definition about space below`,
            question: `Match each definition about <strong>space</strong> below`,
            type: 'matching',
            subquestions: [
                {answer: 'Mercury', text: 'Saturn’s largest moon'},
                {answer: 'Saturn', text: 'The 2nd biggest planet in our solar system'},
                {answer: 'Venus', text: 'The hottest planet in our solar system'},
                {answer: 'Jupiter', text: 'Planet famous for its big red spot on it'},
                {answer: 'Mars', text: 'Planet known as the red planet'},
                {answer: 'Titan', text: 'Saturn’s largest moon'},
            ]
        }
        let actual = Gift.parseMatching(input.split('\n'))
        assert.deepEqual(actual, expected)
    })    

    it('getGift', () => {
        let input = [
            {
                name: `Who is Indonesia's 1st president?`,
                question: `Who is <em>Indonesia's</em> 1st <strong>president</strong>?`,
                type: 'multiple-choice',
                options: [
                    {answer: true, text: 'Ir. Sukarno'},
                    {answer: false, text: 'Moh. Hatta'},
                    {answer: false, text: 'Sukarno Hatta'},
                    {answer: false, text: 'Suharto'},
                ]
            },
            {
                name: `Match each definition about space below`,
                question: `Match each definition about <strong>space</strong> below`,
                type: 'matching',
                subquestions: [
                    {answer: 'Mercury', text: 'Saturn’s largest moon'},
                    {answer: 'Saturn', text: 'The 2nd biggest planet in our solar system'},
                    {answer: 'Venus', text: 'The hottest planet in our solar system'},
                    {answer: 'Jupiter', text: 'Planet famous for its big red spot on it'},
                    {answer: 'Mars', text: 'Planet known as the red planet'},
                    {answer: 'Titan', text: 'Saturn’s largest moon'},
                ]
            }
        ]
        let expected = `::Who is Indonesia's 1st president?::[html]<p>Who is <em>Indonesia's</em> 1st <strong>president</strong>?<br></p>{
\t=<p>Ir. Sukarno</p>
\t~<p>Moh. Hatta</p>
\t~<p>Sukarno Hatta</p>
\t~<p>Suharto</p>
}

::Match each definition about space below::[html]<p>Match each definition about <strong>space</strong> below<br></p>{
\t=<p>Saturn’s largest moon<br></p> -> Mercury
\t=<p>The 2nd biggest planet in our solar system<br></p> -> Saturn
\t=<p>The hottest planet in our solar system<br></p> -> Venus
\t=<p>Planet famous for its big red spot on it<br></p> -> Jupiter
\t=<p>Planet known as the red planet<br></p> -> Mars
\t=<p>Saturn’s largest moon<br></p> -> Titan
}

`
        let actual = Gift.getGift(input)
        assert.equal(actual, expected)
    })

    it('parseQuestions', () => {
        let input = `1.Who is <em>Indonesia's</em> 1st <strong>president</strong>?
*a.Ir. Sukarno
b.Moh. Hatta
c.Sukarno Hatta
d.Suharto

Matching.Match each definition about <strong>space</strong> below
1.Saturn’s largest moon * Mercury
2.The 2nd biggest planet in our solar system * Saturn
3.The hottest planet in our solar system * Venus
4.Planet famous for its big red spot on it * Jupiter
5.Planet known as the red planet * Mars
6.Saturn’s largest moon * Titan
`
        let expected = [
            {
                name: `Who is Indonesia's 1st president?`,
                question: `Who is <em>Indonesia's</em> 1st <strong>president</strong>?`,
                type: 'multiple-choice',
                options: [
                    {answer: true, text: 'Ir. Sukarno'},
                    {answer: false, text: 'Moh. Hatta'},
                    {answer: false, text: 'Sukarno Hatta'},
                    {answer: false, text: 'Suharto'},
                ]
            },
            {
                name: `Match each definition about space below`,
                question: `Match each definition about <strong>space</strong> below`,
                type: 'matching',
                subquestions: [
                    {answer: 'Mercury', text: 'Saturn’s largest moon'},
                    {answer: 'Saturn', text: 'The 2nd biggest planet in our solar system'},
                    {answer: 'Venus', text: 'The hottest planet in our solar system'},
                    {answer: 'Jupiter', text: 'Planet famous for its big red spot on it'},
                    {answer: 'Mars', text: 'Planet known as the red planet'},
                    {answer: 'Titan', text: 'Saturn’s largest moon'},
                ]
            }
        ]
        let actual = Gift.parseQuestions(input)
        assert.deepEqual(actual, expected)
    })    


    it('parsePlainText', () => {
        let input = `1.Who is <em>Indonesia's</em> 1st <strong>president</strong>?
*a.Ir. Sukarno
b.Moh. Hatta
c.Sukarno Hatta
d.Suharto

Matching.Match each definition about <strong>space</strong> below
1.Saturn’s largest moon * Mercury
2.The 2nd biggest planet in our solar system * Saturn
3.The hottest planet in our solar system * Venus
4.Planet famous for its big red spot on it * Jupiter
5.Planet known as the red planet * Mars
6.Saturn’s largest moon * Titan
`
        let expected = `::Who is Indonesia's 1st president?::[html]<p>Who is <em>Indonesia's</em> 1st <strong>president</strong>?<br></p>{
\t=<p>Ir. Sukarno</p>
\t~<p>Moh. Hatta</p>
\t~<p>Sukarno Hatta</p>
\t~<p>Suharto</p>
}

::Match each definition about space below::[html]<p>Match each definition about <strong>space</strong> below<br></p>{
\t=<p>Saturn’s largest moon<br></p> -> Mercury
\t=<p>The 2nd biggest planet in our solar system<br></p> -> Saturn
\t=<p>The hottest planet in our solar system<br></p> -> Venus
\t=<p>Planet famous for its big red spot on it<br></p> -> Jupiter
\t=<p>Planet known as the red planet<br></p> -> Mars
\t=<p>Saturn’s largest moon<br></p> -> Titan
}

`
        let actual = Gift.convertToGift(input)
        assert.equal(actual, expected)
    })    

    it('validateQuestions', () => {
        // test empty
        let input = [
            {
                name: `Who is Indonesia's 1st president?`,
                question: `Who is <em>Indonesia's</em> 1st <strong>president</strong>?`,
                type: 'multiple-choice',
                options: [
                    {answer: true, text: 'Ir. Sukarno'},
                    {answer: false, text: 'Moh. Hatta'},
                    {answer: false, text: 'Sukarno Hatta'},
                    {answer: false, text: 'Suharto'},
                ]
            },
            {
                name: `Match each definition about space below`,
                question: `Match each definition about <strong>space</strong> below`,
                type: 'matching',
                subquestions: [
                    {answer: 'Mercury', text: 'Saturn’s largest moon'},
                    {answer: 'Saturn', text: 'The 2nd biggest planet in our solar system'},
                    {answer: 'Venus', text: 'The hottest planet in our solar system'},
                    {answer: 'Jupiter', text: 'Planet famous for its big red spot on it'},
                    {answer: 'Mars', text: 'Planet known as the red planet'},
                    {answer: 'Titan', text: 'Saturn’s largest moon'},
                ]
            }
        ]
        let expected = {total: 2, multiple: 1, matching: 1, warnings: {}}
        let actual = Gift.validateQuestions(input)        
        assert.deepEqual(actual, expected)

        input[0].question = ''
        actual = Gift.validateQuestions(input)
        expected = {total: 2, multiple: 1, matching: 1, warnings: {0: ['Question is empty or too short']}}
        assert.deepEqual(actual, expected)

        // test mix
        input[0].options = [
            {answer: false, text: 'Ir. Sukarno'},
            {answer: false, text: 'Moh. Hatta'},
            {answer: false, text: ''},
            {answer: false, text: 'Suharto'},
        ]
        actual = Gift.validateQuestions(input)
        expected = {total: 2, multiple: 1, matching: 1, warnings: {0: [
            'Question is empty or too short',
            'Option 3 is empty',
            'No answer provided',
        ]}}
        assert.deepEqual(actual, expected)

        // test different number of options (multiple-choice)
        input = [
            {
                name: `this is a question 1`,
                question: `this is a question 1`,
                type: 'multiple-choice',
                options: [
                    {answer: true, text: 'a'},
                    {answer: false, text: 'b'},
                    {answer: false, text: 'c'},
                    {answer: false, text: 'd'},
                ]
            },
            {
                name: `this is a question 2`,
                question: `this is a question 2`,
                type: 'multiple-choice',
                options: [
                    {answer: true, text: 'a'},
                    {answer: false, text: 'c'},
                    {answer: false, text: ''},
                ]
            },
        ]

        actual = Gift.validateQuestions(input)
        expected = {total: 2, multiple: 2, matching: 0, warnings: {
            1: [
                'Only 3 options provided out of 4 expected',                
                'Option 3 is empty',
            ]
        }}
        assert.deepEqual(actual, expected)

        // test duplicate
        input = [
            {
                name: `this is a question 1`,
                question: `this is a question 1`,
                type: 'multiple-choice',
                options: [
                    {answer: true, text: 'a'},
                    {answer: false, text: 'b'},
                ]
            },
            {
                name: `this is a question 2`,
                question: `this is a question 2`,
                type: 'multiple-choice',
                options: [
                    {answer: true, text: 'a'},
                    {answer: false, text: 'c'},
                ]
            },
            {
                name: `this is a question 1`,
                question: `this is a question 1`,
                type: 'multiple-choice',
                options: [
                    {answer: true, text: 'a'},
                    {answer: false, text: 'c'},
                ]
            },            
        ]
        actual = Gift.validateQuestions(input)
        expected = {total: 3, multiple: 3, matching: 0, warnings: {
            2: [
                'Duplicate of question 1',
            ]
        }}
        assert.deepEqual(actual, expected)              
    })

})