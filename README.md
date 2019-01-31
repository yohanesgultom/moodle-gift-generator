# Moodle GIFT generator

Moodle (https://moodle.org/) question format (GIFT) generator. Currently only `multiple-choice` and `matching` type supported. Live demo: http://moodlegift.gultom.me. Fully-rewritten in plain javascript (previously was in php).

!["Screenshot"](screenshot.png)

### Usage

Steps to generate GIFT file from plain text questions in the web app:

1. Paste/write questions in format following examples below
1. Click generate button. If there is no warning, file will automatically downloaded by your browser
1. If there is warning, fix your questions and click generate button again. Repeat until successful

Example of questions:

```
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
```
### Installation

Production:

1. Clone/download this repo
1. Copy/upload all files in `src/` to your web server

Development:

1. Install Node.js >= 8.11.1
1. Clone/download this repo
1. Enter local repo directory and install development dependencies `npm install`
1. Run test to make sure everything is fine `npm test`
1. Run using built-in web server `npm start`


### License

The MIT License (MIT)

Copyright (c) 2019 Yohanes Gultom

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
