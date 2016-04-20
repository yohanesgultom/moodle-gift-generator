<?php

define("ANSWER_MARK", "*");
define("MAX_LENGTH", 50);
define("ALLOWED_TAGS", "<strong><b><i><em><u>");

$filename = "questions.gift.txt";
$source = "";
$errors = array();

function parseMultipleChoice($lines)
{
    $question = array();
    $options = array();
    foreach ($lines as $j => $line) {
        if ($j == 0) {
            $str = getQuestionOrOptionValue($line);
            $question["name"] = convertToSafeName($str);
            $question["question"] = convertToSafeHTML($str);
            $question["type"] = "multiple-choice";
        } else {
            if (isOption($line)) {
                $options[$j-1]["text"] = convertToSafeHTML(getQuestionOrOptionValue($line));
                $options[$j-1]["answer"] = isAnswer($line);
            } else {
                // handle multiple line question or option
                if (empty($options)) {
                    $question["question"] .= getQuestionOrOptionValue($line);
                } else {
                    $options[$j-2] = (string)$options[$j-2].getQuestionOrOptionValue($line);
                }
            }
        }
    }
    $question["options"] = $options;
    return $question;
}

function parseMatching($lines)
{
    $question = array();
    $subquestions = array();
    foreach ($lines as $j => $line) {
        if ($j == 0) {
            $question["question"] = getQuestionOrOptionValue($line);
            $question["type"] = "matching";
        } else {
            $tmp = explode(ANSWER_MARK, $line);
            $subquestions[$j-1]["text"] = getQuestionOrOptionValue($tmp[0]);
            $subquestions[$j-1]["answer"] = $tmp[1];
        }
    }
    $question["subquestions"] = $subquestions;
    return $question;
}

function isOption($str)
{
    $firstDot = strpos($str, ".");
    if ($firstDot !== false) {
        return !is_numeric(substr($str, 0, $firstDot));
    }
    return false;
}

function isAnswer($str)
{
    return $str[0] == ANSWER_MARK;
}

function isOptionAnswer($str)
{
    return isOption($str) && isAnswer($str);
}

function getQuestionOrOptionValue($str)
{
    $firstDot = strpos($str, ".");
    if ($firstDot !== false) {
        $value = trim(substr($str, $firstDot+1));
        // remove colon from question
        if (is_numeric(substr($str, 0, $firstDot))) {
            $value = str_replace(":", "", $value);
        }
        return $value;
    }
    return trim(str_replace(":", "", $str));
}

function validateQuestion($question)
{
    $errors = array();
    $question_text = trim($question["question"]);
    if (empty($question_text)) {
        array_push($errors, "Empty question");
    }
    if (count($question["options"]) <= 0) {
        array_push($errors, "No options provided");
    } else {
        $answered = false;
        foreach ($question["options"] as $index => $option) {
            $option_text = trim($option["text"]);
            if (empty($option_text)) {
                array_push($errors, ($index + 1)." : empty option");
            }
            if ($option["answer"] == true) {
                $answered = true;
            }
        }
        if ($answered == false) {
            array_push($errors, "No answer given");
        }
    }
    return $errors;
}

function validateQuestions($questions)
{
    $errors = array();
    foreach ($questions as $index => $question) {
        $errors_temp = validateQuestion($question);
        if (count($errors_temp) > 0) {
            $errors[$index] = $errors_temp;
        }
    }
    return $errors;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $filename = !empty($_POST["filename"]) ? trim($_POST["filename"]) : $filename;
    $source = $_POST["source"];
    $questionsRaw = explode("\n\r\n", trim($source));
    // var_dump($questionsRaw);

    $questions = array();
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

    $errors = validateQuestions($questions);
    // var_dump($questions);
    if (count($errors) == 0) {
        renderGift($questions, $filename);
    }
}

function convertToSafeName($str)
{
    if (!empty($str)) {
        $len = strlen($str) < MAX_LENGTH ? MAX_LENGTH : strlen($str);
        $str = trim(substr(strip_tags($str), 0, $len));
    }
    return $str;
}

function convertToSafeHTML($str)
{
    if (!empty($str)) {
        $str = strip_tags($str, ALLOWED_TAGS);
    }
    return $str;
}

function renderGift($questions, $filename)
{
    header('Content-type: text/plain');
    header('Content-Disposition: attachment; filename="'.$filename.'"');

    foreach ($questions as $q) {
        echo "::".$q["name"]."::";
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

if ($_SERVER["REQUEST_METHOD"] !== "POST" || count($errors) > 0) {
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <link rel="shortcut icon" href="favicon.ico" />
    <title>Moodle GIFT Generator</title>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.8/semantic.min.css">
    <style type="text/css">

    h1.ui.center.header {
        margin-top: 2em;
    }

    textarea#source {
        width:100%;
        height: 90%;
        max-height: 90%;
    }

    .ui.container.form, .form form, form .source {
        height: 100%;
    }

    .ui.container.form {
        margin-top: 1em;
    }

    .message .header {
        margin-bottom: 1em;
    }
    </style>
</head>
<body>
    <h1 class="ui center aligned header">Moodle GIFT Generator</h1>

    <div class="ui container">
        <div class="ui icon message">
          <i class="github alternate icon"></i>
          <div class="content">
            <div class="header">
              Need more help, information or even source code?
            </div>
            <p>Get them on <a href="https://github.com/yohanesgultom/moodle-gift-generator">https://github.com/yohanesgultom/moodle-gift-generator</a></p>
          </div>
        </div>
    </div>

    <?php if (count($errors) > 0) { ?>
    <div class="ui container">
        <div class="ui warning message">
            <i class="close icon"></i>
            <div class="header">
                Error(s) found!
            </div>
            <?php
            foreach ($errors as $index => $error_list) {
                echo "Question ".($index + 1)."<br>";
                echo "<ul>";
                foreach ($error_list as $error) {
                    echo "<li>".$error."</li>";
                }
                echo "</ul>";
            }
            ?>
        </div>
    </div>
    <?php } ?>

    <div class="ui container form">

        <form id="main-form" action="index.php" method="POST">
            <div class="two fields">
            <div class="field">
                <input type="text" name="filename" placeholder="File name" value="<?php echo $filename ?>" required>
            </div>
            <div class="field">
                <button class="blue ui button" type="submit"><i class="icon download"></i> Generate GIFT</button>
            </div>
        </div>
            <div class="field source">
                <textarea id="source" name="source" placeholder="Put your question here" required><?php echo $source; ?></textarea>
            </div>
        </form>
    </div>

    <script src="https://code.jquery.com/jquery-1.12.3.min.js" integrity="sha256-aaODHAgvwQW1bFOGXMeX+pC4PZIPsvn2h1sArYOhgXQ=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.8/semantic.min.js"></script>
    <script>
        $('#main-form').submit(function() {
            if (!$('input[name=filename]', this).val()) {
                alert('Please provide filename');
                return false;
            } else if (!$('textarea[name=source]', this).val()) {
                alert('Please provide source');
                return false;
            }
            return true;
        });
    </script>

</body>
</html>

<?php } ?>
