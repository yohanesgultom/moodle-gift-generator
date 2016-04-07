<?php

function parseMultipleChoice($lines)
{
    $question = [];
    $options = [];
    foreach ($lines as $j => $line) {
        if ($j == 0) {
            $question["question"] = getQuestionOrOptionValue($line);
            $question["type"] = "multiple-choice";
        } else {
            $options[$j-1]["text"] = getQuestionOrOptionValue($line);
            $options[$j-1]["answer"] = isOptionAnswer($line);
        }
    }
    $question["options"] = $options;
    return $question;
}

function parseMatching($lines)
{
    $question = [];
    $subquestions = [];
    foreach ($lines as $j => $line) {
        if ($j == 0) {
            $question["question"] = getQuestionOrOptionValue($line);
            $question["type"] = "matching";
        } else {
            $tmp = explode("*", $line);
            $subquestions[$j-1]["text"] = getQuestionOrOptionValue($tmp[0]);
            $subquestions[$j-1]["answer"] = $tmp[1];
        }
    }
    $question["subquestions"] = $subquestions;
    return $question;
}

function renderGift($questions)
{
    foreach ($questions as $q) {
        echo "::".$q["question"]."::";
        echo "[html]<p>".$q["question"]."<br></p>";
        echo "{\n";
        if ($q["type"] == "multiple-choice") {
            foreach ($q["options"] as $o) {
                echo "\t";
                echo ($o["answer"]) ? "=" : "~";
                echo "<p>".$o["text"]."</p>\n";
            }
        } elseif ($q["type"] == "matching") {
            foreach ($q["subquestions"] as $o) {
                echo "\t=<p>".$o["text"]."<br></p> -> ".$o["answer"]."\n";
            }
        }
        echo "}\n\n";
    }
}

function isOption($str)
{
    $firstDot = strpos($str, ".");
    if ($firstDot !== false) {
        return !is_numeric(substr($str, 0, $firstDot));
    }
    return false;
}


function isOptionAnswer($str)
{
    return isOption($str) && $str[0] == "*";
}

function getQuestionOrOptionValue($str)
{
    $firstDot = strpos($str, ".");
    if ($firstDot !== false) {
        return trim(substr($str, $firstDot+1));
    }
    return false;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    header('Content-type: text/plain');
    header('Content-Disposition: attachment; filename="questions.gift.txt"');

    $source = $_POST["source"];
    $questionsRaw = explode("\n\r\n", trim($source));
    // var_dump($questionsRaw);

    $questions = [];
    foreach ($questionsRaw as $i => $q) {
        if (!empty($q)) {
            $lines = explode("\n", trim($q));
            if (strpos(strtolower($lines[0]), "matching") === 0) {
                $questions[$i] = parseMatching($lines);
            } else {
                $questions[$i] = parseMultipleChoice($lines);
            }
        }
    }
    // var_dump($questions);

    renderGift($questions);
} else {
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <title>Moodle GIFT Generator</title>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.8/semantic.min.css">
    <style type="text/css">

    h1.ui.center.header {
        margin-top: 3em;
    }

    textarea#source {
        width:100%;
        height: 90%;
        max-height: 90%;
    }

    .ui.container.form, .form form, form .source {
        height: 100%;
    }

    </style>
    <script src="https://code.jquery.com/jquery-1.12.3.min.js" integrity="sha256-aaODHAgvwQW1bFOGXMeX+pC4PZIPsvn2h1sArYOhgXQ=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.8/semantic.min.js"></script>
</head>
<body>
    <h1 class="ui center aligned header">Moodle GIFT Generator</h1>

    <div class="ui container form">
        <form action="index.php" method="POST">
            <div class="field">
                <button class="blue ui button" type="submit">Generate GIFT</button>
            </div>
            <div class="field source">
                <textarea id="source" name="source" placeholder="Put your question here"></textarea>
            </div>
        </form>
    </div>
</body>
</html>

<?php } ?>
