$(document).ready(function () {
    let canvas = $('#canvas');

    const COEFF = 68;
    const AXIS = 110;

    const X_MAX = 5;
    const X_MIN = -3;
    const Y_VALUES = ["-4.0", "-3.0", "-2.0", "-1.0", "0.0", "1.0", "2.0", "3.0"];
    const error = document.querySelector('#x_value+span.error');

    let y;
    let radius;
    let isValid = false;
    const xField = document.getElementById("x_value");

    let value = $("#x_value").val().replace(',', '.');
    let array = Array.prototype.slice.call(document.getElementsByName("y_value"));

    function select(element) {
        element.onclick = function () {
            y = $(this).val();
            console.log(y);
        }
    }

    function isValidValue(node) {
        return node.validity.valid;
    }


    function validateX() {
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

    function checkFirstQuarter(x, y, r) {
        return x <= 0 && y >= 0 && x >= -r && y <= r;
    }

    function checkSecondQuarter(x, y, r) {
        return x >= 0 && x >= 0 && x * x + y * y <= r * r;
    }

    function checkThirdQuarter(x, y, r) {
        return x <= 0 && y <= 0 && 2 * y >= -x - r;
    }

    function checkCoordinates(x, y, r) {
        return checkFirstQuarter(x, y, r) || checkSecondQuarter(x, y, r) || checkThirdQuarter(x, y, r);
    }


    function showMessage() {
        if (xField.validity.valueMissing || !(value instanceof Number)) {
            error.textContent = 'Пожалуйста, введите число! :(';
        } else if (!isNaN(parseFloat(value))) {
            error.textContent = 'Вы ввели невалидное число!';
        }

        if (xField.validity.rangeOverflow) {
            error.textContent = 'Максимальное значение х = 5!';
        }
        if (xField.validity.rangeUnderflow) {
            error.textContent = "Минимальное значение у = -3!"
        }
        error.className = 'error active';
    }

    function clearCanvas() {
        canvas[0].getContext('2d').clearRect(0, 0, canvas.width(), canvas.height());
    }

    function drawPoint(x, y, color) {
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
        Axes.fillStyle = color;
        Axes.arc(x, y, 2, 0, 2 * Math.PI);
        Axes.fill();
    }

    function redrawFromInput(x, y, radius) {
        let color = 'green';
        if (checkCoordinates(x, y, radius)) {
            color = 'red';
            console.log('checked');
        }
        drawPoint(x * COEFF / radius + AXIS, -(y / radius * COEFF - AXIS), color);
    }

    function clickDraw(event) {
        console.log("clicked");
        let x = (event.offsetX - AXIS) / COEFF * radius;
        if (x < X_MIN) x = X_MIN;
        if (x > X_MAX) x = X_MAX;

        let y = (-event.offsetY + AXIS) / COEFF * radius;
        let minDiff = Infinity;
        let nearestYValue;
        for (let i = 0; i < Y_VALUES.length; i++) {
            if (Math.abs(y - Y_VALUES[i]) < minDiff) {
                minDiff = Math.abs(y - Y_VALUES[i]);
                nearestYValue = Y_VALUES[i];
            }
        }
        drawPoint(COEFF * x / radius + AXIS, -(nearestYValue/ radius * COEFF - AXIS), 'red');
        let ySelected = $('input[name="x_val"][value="' + nearestYValue.trim() + '"]');
        ySelected.trigger("click");
        $("#x_value").val();
    }

    canvas.on('click', clickDraw);


    validateX();
    array.forEach(select);
    $("#form").on("submit", function (event) {
        event.preventDefault();
        console.log("submitted");

        if (!isValid) {
            return;
        }

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
        return true;
    });

    $('#form').on("reset", function (event) {
        $('.set_y').removeClass('y_selected');
    })


    $(".set_r").on("change", function () {
        radius = $(this).val();
        let x = $('#x_value').val();

        let svgGraph = document.querySelector(".result-graph").getSVGDocument();
        svgGraph.querySelector('.coordinate-text_minus-Rx').textContent = (-radius).toString();
        svgGraph.querySelector('.coordinate-text_minus-Ry').textContent = (-radius).toString();
        svgGraph.querySelector('.coordinate-text_minus-half-Rx').textContent = (-radius / 2).toString();
        svgGraph.querySelector('.coordinate-text_minus-half-Ry').textContent = (-radius / 2).toString();
        svgGraph.querySelector('.coordinate-text_plus-Rx').textContent = (radius).toString();
        svgGraph.querySelector('.coordinate-text_plus-Ry').textContent = (radius).toString();
        svgGraph.querySelector('.coordinate-text_plus-half-Rx').textContent = (radius / 2).toString();
        svgGraph.querySelector('.coordinate-text_plus-half-Ry').textContent = (radius / 2).toString();

        redrawFromInput(x,y,radius);
    });

    $('.set_x').on('input', event => redrawFromInput(x,y,radius));
    $('.set_y').on('click', event => redrawFromInput(x,y,radius));

});