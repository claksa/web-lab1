$(document).ready(function () {

    let isValid = false;
    let xField = document.getElementById("x_value");
    const error = document.querySelector('#x_value+span.error');

    checkX();
    let yField = getY();

    $("form").on("submit", function (event) {
        event.preventDefault();
        console.log("submitted");

        if (!isValid) {
            return;
        }

        // console.log($(this).serialize());

        $.ajax({
            type: "POST",
            url: "/script.php",
            data: {
                'x_value': xField,
                'y_value': yField,
                'r_value': $('.set_r')
            },
            // beforeSend: function () {
            //     console.log(this.data);
            // },
            dataType: 'json',
            success: function () {
                console.log("console");
            },
            error: function () {
                console.log("error");
            }
        })
        return true;
    });


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

        // form.addEventListener('submit', function (event){
        //     if(!xField.validity.valid) {
        //         showMessage();
        //     }
        //     event.preventDefault();
        // });

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

    // function getYValue() {
    //     let y_value = $('.set_y').val();
    //     isYButtonOnClick = true;
    //     console.log(y_value);
    // }

    function getYValue () {
        $('.set_y').on('click', function () {
            let my_y = $('.set_y').val();
            console.log(my_y);
            console.log('I am click on the button!');
        })
    }

    function getY() {
        let y_value;
        $('.set_y').on('click', function () {
            y_value = $(this).val();
            console.log(y_value);
        })
        return y_value;
    }


});