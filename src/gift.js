/**
 * Library to parse questions in simple plain text format to Moodle Gift format
 * 
 * @author yohanes.gultom@gmail.com
 */

// Plain text questions example:
let _examples = `
1.Who is <em>Indonesia's</em> 1st <strong>president</strong>?
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

const ANSWER_MARK = '*'

const Gift = {
    convertToGift: (txt) => {
        if (!txt) return ''
        return Gift.getGift(Gift.parseQuestions(txt))
    },
    validateQuestions: (questions) => {
        let result = {
            total: 0,
            multiple: 0,
            matching: 0,
            warnings: {},
        }
        let firstQuestionOptionsCount = 0;
        let questionMap = {}
        questions.forEach((q, i) => {
            let w = []            
            
            // question
            if (!q.question || q.question.length < 5) {
                w.push('Question is empty or too short')
            } else {
                // simple hash by removing non-alphanumerics
                let hash = q.question.replace(/[^a-zA-Z\d]/g, '')
                if (hash in questionMap) {
                    w.push(`Duplicate of question ${questionMap[hash]+1}`)
                } else {
                    questionMap[hash] = i
                }
            }            

            // multiple-choice            
            if (q.type == 'multiple-choice') {
                result.multiple++

                if (!'options' in q || q.options.length <= 0) {
                    w.push('No option provided')
                    return
                }

                // set standard using first non-empty question
                if (firstQuestionOptionsCount == 0 && q.options.length > 0) {
                    firstQuestionOptionsCount = q.options.length
                }
                if (firstQuestionOptionsCount > 0 && q.options.length != firstQuestionOptionsCount) {
                    w.push(`Only ${q.options.length} options provided out of ${firstQuestionOptionsCount} expected`)
                }

                let answerCount = 0
                q.options.forEach((o, j) => {
                    if (o.answer) answerCount++
                    if (!o.text) {
                        w.push(`Option ${j+1} is empty`)
                    }
                })
                if (answerCount <= 0) {
                    w.push('No answer provided')
                } else if (answerCount > 1) {
                    w.push(`${answerCount} answers provided`)
                }
            }

            // matching
            else if (q.type == 'matching') {
                result.matching++

                if (!'subquestions' in q || q.subquestions.length <= 0) {
                    w.push('No subquestion provided')
                    return
                }

                q.subquestions.forEach((o, j) => {
                    if (!o.answer) {
                        w.push(`Subquestion ${j+1} has empty answer`)
                    }
                    if (!o.text) {
                        w.push(`Subquestion ${j+1} is empty`)
                    }
                })
            }

            if (w.length > 0) result.warnings[i] = w
        })

        result.total = result.multiple + result.matching
        return result
    },
    parseQuestions: (txt) => {
        let questions = []
        let blocks = txt.replace(/\n[ \t]+/m, "\n").split("\n\n")
        blocks.forEach((str) => {
            if (!str) return
            let lines = str.split('\n')
            if (lines[0].toLowerCase().startsWith('matching')) {
                questions.push(Gift.parseMatching(lines))    
            } else {
                questions.push(Gift.parseMultipleChoice(lines))
            }
        })
        return questions
    },
    parseMultipleChoice: (lines) => {
        let question = {
            type: null, 
            name: null, 
            question: null, 
            options: [], 
        }
        lines.forEach((line, j) => {
            // assume first line is the question
            if (j == 0) {
                let str = Gift.extractValue(line)
                question.name = Gift.convertToSafeName(str)
                question.question = Gift.convertToSafeHTML(str)
                question.type = "multiple-choice"
            } else {
                if (Gift.isOption(line)) {
                    question.options.push({
                        text: Gift.convertToSafeHTML(Gift.extractValue(line)),
                        answer: Gift.isAnswer(line),
                    })
                } else {                     
                    if (question.options.length <= 0) {
                        // handle multiple lines question
                        question.question += Gift.extractValue(line)
                    } else {
                        // multiple lines option
                        let last = question.options.length - 1
                        question.options[last].text += Gift.extractValue(line)
                    }
                }
            }
        })
        return question
    },
    parseMatching: (lines) => {
        let question = {
            type: null, 
            name: null, 
            question: null, 
            subquestions: [], 
        }
        lines.forEach((line, j) => {
            if (j == 0) {
                let str = Gift.extractValue(line)
                question.name = Gift.convertToSafeName(str)
                question.question = Gift.convertToSafeHTML(str)
                question.type = "matching"
            } else {
                let arr = line.split(ANSWER_MARK)
                if (arr && arr.length == 2) {
                    question.subquestions.push({
                        text: Gift.convertToSafeHTML(Gift.extractValue(arr[0])),
                        answer: arr[1].trim(),
                    })
                }
            }
        })
        return question
    },    
    extractValue: (str) => {
        let dot = str.indexOf('.')
        if (dot) {
            value = str.substr(dot+1).trim()
            // remove colon from question
            if (!isNaN(str.substr(0, dot))) {
                value = value.replace(/:/g, '')
            }
            return value
        }
        return str.replace(/:/g, '').trim()
    },
    getGift: (questions) => {
        let res = ''        
        questions.forEach((q) => {                        
            let options = ''
            if (q.type == 'multiple-choice') {
                options = q.options.reduce((r, o) => {
                    let mark = o.answer ? '=' : '~'
                    return `${r}\t${mark}<p>${o.text}</p>\n`
                }, '')
            } else if (q.type == 'matching') {
                options = q.subquestions.reduce((r, s) => `${r}\t=<p>${s.text}<br></p> -> ${s.answer}\n`, '')
            }
            res += `::${q.name}::[html]<p>${q.question}<br></p>{\n${options}}\n\n`
        })
        return res
    },
    // it is an option if started with NaN and dot
    isOption: (str) => {
        let dot = str.indexOf('.')
        return dot && isNaN(str.substr(0, dot))
    },
    // it is an answer if started with given mark
    isAnswer: (str, mark = ANSWER_MARK) => {
        return str[0] == mark
    },    
    stripTags: (input, allowed = '<strong><b><i><em><u>') => {
        //  discuss at: http://locutus.io/php/strip_tags/
        // original by: Kevin van Zonneveld (http://kvz.io)
        
        // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
        allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')
        
        let tags = /<\/?([a-z0-9]*)\b[^>]*>?/gi
        let commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi
        
        let after = input
        // removes tha '<' char at the end of the string to replicate PHP's behaviour
        after = (after.substring(after.length - 1) === '<') ? after.substring(0, after.length - 1) : after
        
        // recursively remove tags to ensure that the returned string doesn't contain forbidden tags after previous passes (e.g. '<<bait/>switch/>')
        while (true) {
            let before = after
            after = before.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
                return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
            })
        
            // return once no more tags are removed
            if (before === after) {
                return after
            }
        }
    },
    convertToSafeName: (str, maxLength = 50) => {
        return str ? Gift.stripTags(str, '').substr(0, Math.min(maxLength, str.length)) : str
    },
    convertToSafeHTML: (str, allowed) => {
        return str ? Gift.stripTags(str) : str
    },
}

if (typeof module == 'object') {
    module.exports = Gift
}