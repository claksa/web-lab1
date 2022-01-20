$(document).ready(function () {
    let canvas = $('#canvas');

    const COEFF = 67;
    const AXIS = 110;

    const X_MAX = 5;
    const X_MIN = -3;
    const Y_VALUES = ["-4.0", "-3.0", "-2.0", "-1.0", "0.0", "1.0", "2.0", "3.0"];
    const error = document.querySelector('#x_value+span.error');

    let y;
    let isValid = false;
    let xField = document.getElementById("x_value");
    // let radius = document.querySelector("input[type=checkbox]:checked").value;
    let radius = window.localStorage.getItem("r_value");
    console.log(radius);

    if (radius !== null){
        redrawFromInput(window.localStorage.getItem("x_value"), window.localStorage.getItem("y_value"));
    }

    let value = $("#x_value").val().replace(',', '.');
    let array = Array.prototype.slice.call(document.getElementsByName("y_value"));

    function select(element) {
        element.onclick = function () {
            y = this.value;
            console.log(y);
        }
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

    $(".set_r").on("click", function () {
        if (!validate_R())
            return;
        radius = $('.set_r:checked').val();
        console.log(radius);
    })

    //TODO:  изменить валидацию радиуса
    function validate_R(){
        if ($(".set_r").is(":checked")){
            if ($(".set_r:checked").length > 1){
                $(".r_container").addClass("box_error");
                return false;
            }
            $(".r_container").removeClass("box_error");
            return true;
        }
        else{
            $(".r_container").addClass("box_error");
            return false;
        }
    }


    function showMessage() {
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

    function clearCanvas() {
        canvas[0].getContext('2d').clearRect(0, 0, canvas.width(), canvas.height());
    }

    function drawPoint(x, y) {
        clearCanvas();
        let Axes = canvas[0].getContext('2d');
        if (x > canvas.width() || x < -canvas.width() || y > canvas.height() || y < -canvas.height()) {
            return;
        }
        console.log("I start draw");
        Axes.setLineDash([2, 2]);
        Axes.beginPath();
        Axes.moveTo(x, 110);
        Axes.lineTo(x, y);
        Axes.moveTo(110, y);
        Axes.lineTo(x, y);
        Axes.stroke();
        Axes.fillStyle = 'red';
        Axes.arc(x, y, 2, 0, 2 * Math.PI);
        Axes.fill();
    }

    function redrawFromInput(x, y) {
        drawPoint(x * COEFF / radius + AXIS, -(y / radius * COEFF - AXIS));
    }

    checkX();
    array.forEach(select);


    //TODO: добавить прошлые координаты из таблицы)))
    canvas.on('click', function (event) {
        console.log("clicked");

        let x = (event.offsetX - AXIS) / COEFF * radius;
        if (x < X_MIN) x = X_MIN;
        if (x > X_MAX) x = X_MAX;

        let y = (-event.offsetY + AXIS) / COEFF * radius;
        let minDiff = Infinity;
        let nearestYValue;
        for (let i = 0; i < Y_VALUES.length; i++){
            if (Math.abs(y - Y_VALUES[i]) < minDiff){
                minDiff = Math.abs(y - Y_VALUES[i]);
                nearestYValue = Y_VALUES[i];
            }
        }
        drawPoint(COEFF/radius + AXIS, -(nearestYValue/radius * COEFF - AXIS));
        let ySelected = $('input[name="x_val"][value="'+ nearestYValue.trim() +'"]');
        ySelected.trigger("click");
        $("#x_value").val();
    })

    $("#form").on("submit", function (event) {
        event.preventDefault();
        console.log("submitted");

        if (!isValid) {
            return;
        }

        let x = $("#x_value").val();
        $.ajax({
            type: "POST",
            url: "script.php",
            data: $(this).serialize() + "&y_value=" + y + "&timezone=" + new Date().getTimezoneOffset(),
            beforeSend: function () {
                $(".send_form").attr("disabled", "disabled");
            },
            success: function (data) {
                console.log("ajax_success: " + data);
                $(".send_form").attr("disabled", false);
                let result_style = document.getElementById('row').style;
                result_style.display = 'table-row';
                $("#receiver").append(data);
            },
            error: function () {
                console.log("error");
                $(".send_form").attr("disabled", false);
            }
        })

        window.localStorage.setItem("r_value", radius);
        window.localStorage.setItem("x_value", x);
        window.localStorage.setItem("y_value", y);
        return true;
    });

    //  TODO: потестить без локалсториджа
    $("#form").on("reset",function (){
        window.localStorage.removeItem("r_value");
        window.localStorage.removeItem("x_value");
        window.localStorage.removeItem("y_value");

    })



});