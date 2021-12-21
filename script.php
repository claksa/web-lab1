<?php
var_dump($_POST);

$x = $_POST['x_value'];
$y = $_POST['y_value'];
$radius = $_POST['r_value'];


function isVarExist($var){
    return isset($var);
}

function checkX($x){
    if (isVarExist($x)){

    } else {

    }

}
?>