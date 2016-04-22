## Moodle GIFT generator

Moodle (https://moodle.org/) question format (GIFT) generator. Currently only `multiple-choice` and `matching` type supported. Live demo: http://liveapp.ga/moodlegift/

### Running

Simply put `index.php` to PHP webserver and access from browser

![alt text](https://github.com/yohanesgultom/moodle-gift-generator/blob/master/screenshot.png "Screenshot")

### Input Example

File: https://github.com/yohanesgultom/moodle-gift-generator/blob/master/example.txt
```
1.Who is Indonesia's 1st president?
*a.Ir. Sukarno
b.Moh. Hatta
c.Sukarno Hatta
d.Suharto

Matching.Match each definition about space below
1.Saturn’s largest moon * Mercury
2.The 2nd biggest planet in our solar system * Saturn
3.The hottest planet in our solar system * Venus
4.Planet famous for its big red spot on it * Jupiter
5.Planet known as the red planet * Mars
6.Saturn’s largest moon * Titan
```

### Output (GIFT) Example

File: https://github.com/yohanesgultom/moodle-gift-generator/blob/master/example.gift
```
// multiple choices example
::Who is Indonesia's 1st president?::[html]<p>Who is Indonesia's 1st president?<br></p>{
	=<p>Ir. Sukarno</p>
	~<p>Moh. Hatta</p>
	~<p>Sukarno Hatta</p>
	~<p>Suharto</p>
}

// matching example
::Space matching for elementary school::[html]<p>Match each questions to one answer from the list<br></p>{
	=<p>What is the name of Saturn’s largest moon?<br></p> -> Mercury
	=<p>What is the name of the 2nd biggest planet in our solar system?<br></p> -> Saturn
	=<p>What is the hottest planet in our solar system?<br></p> -> Venus
	=<p>What planet is famous for its big red spot on it?<br></p> -> Jupiter
	=<p>What planet is known as the red planet?<br></p> -> Mars
	=<p>What is the name of Saturn’s largest moon?<br></p> -> Titan
}
```

### License

The MIT License (MIT)

Copyright (c) 2016 Yohanes Gultom

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
