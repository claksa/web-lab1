$(document).ready(function () {
    let canvas = $('#canvas');

    const GRAPH_COFF = 67;
    const GRAPH_MOVE = 110;

    const X_MAX = 5;
    const X_MIN = -3;
    const Y_VALUES = ["-4.0", "-3.0", "-2.0", "-1.0", "0.0", "1.0", "2.0", "3.0"];
    const error = document.querySelector('#x_value+span.error');

    let y;
    let isValid = false;
    let xField = document.getElementById("x_value");
    let radius = window.localStorage.getItem("r_value");

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
        if (x > canvas.width() || x < -canvas.width() || y > canvas.height() || y < -canvas.height())
            return;

        let Axes = canvas[0].getContext('2d');
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
        drawPoint(x * GRAPH_COFF / radius + GRAPH_MOVE,
            -(y / radius * GRAPH_COFF - GRAPH_MOVE));
    }

    //main

    checkX();

    array.forEach(select);
    if (radius !== null){
        redrawFromInput(window.localStorage.getItem("x_value"), window.localStorage.getItem("y_value"));
    }

    canvas.on("click", function (event) {

        let x = (event.offsetX - GRAPH_MOVE) / GRAPH_COFF * radius;
        if (x < X_MIN) x = X_MIN;
        if (x > X_MAX) x = X_MAX;

        let y = (-event.offsetY + GRAPH_MOVE) / GRAPH_COFF * radius;
        let minDiff = Infinity;
        let nearestYValue;
        for (let i = 0; i < Y_VALUES.length; i++) {
            if (Math.abs(x - Y_VALUES[i]) < minDiff) {
                minDiff = Math.abs(x - Y_VALUES[i]);
                nearestYValue = Y_VALUES[i];
            }
        }

        drawPoint(GRAPH_COFF / radius + GRAPH_MOVE, -(nearestYValue * y / radius * GRAPH_COFF - GRAPH_MOVE));

    //    let ySelected = $('input[name="y_value"][value="' + nearestYValue.trim() + '"]');
      //  ySelected.trigger("click");

      //  $("#x_value").val(x.toString().substring(0, 5));
    })

    $("form").on("submit", function (event) {
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

});