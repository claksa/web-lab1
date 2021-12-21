$(document).ready(function () {

    let isValid = false;
    let xField = document.getElementById("x_value");
    const error = document.querySelector('#x_value+span.error');
    let array = Array.prototype.slice.call(document.getElementsByName("y_value"));

    let y_var;
    for (let i = 0; i < array.length; ++i) {
        array[i].addEventListener('click', function () {
            y_var = parseInt(array[i].value);
            console.log(y_var);
        })
    }

    function isValidValue(node) {
        return node.validity.valid;
    }


    function checkX() {
        xField.addEventListener("input", function (event) {
            console.log("check x");
            if (isValidValue(xField)) {
                isValid = true;
                error.textContent = '';
                error.className = 'error';
            } else {
                showMessage();
                event.preventDefault();
            }
        });
    }


    function showMessage() {
        let value = $("#x_value").val().replace(',', '.');
        if (xField.validity.valueMissing || !(value instanceof Number)) {
            error.textContent = 'Please, enter a number! :(';
        } else if (!isNaN(parseFloat(value))) {
            error.textContent = 'You entered a non-valid number!';
        }

        if (xField.validity.rangeOverflow) {
            error.textContent = 'The maximum value of x = 5!';
        }
        if (xField.validity.rangeUnderflow) {
            error.textContent = "The minimum value of x = -3!"
        }
        error.className = 'error active';
    }

    checkX();
    $("form").on("submit", function (event) {
        event.preventDefault();
        console.log("submitted");
        // let vars = $(this).serialize() + "&y_value=" + analyzeYButton(yValArray);

        if (!isValid) {
            return;
        }

        $.ajax({
            type: "POST",
            url: "/script.php",
            data: $(this).serialize() + "&y_value=",
            success: function () {
                console.log("success");
            },
            error: function () {
                console.log("error");
            }
        })
        return true;
    });


});