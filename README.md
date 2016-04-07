## Moodle GIFT generator

Moodle (https://moodle.org/) question format (GIFT) generator. Currently only `multiple-choice` and `matching` type supported

### Running

Simply put `index.php` to PHP webserver and access from browser

### Input Example
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
