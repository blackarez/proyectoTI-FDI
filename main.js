$(document).ready(function(){

    //#inicializacion de variables globales
    var matrix = [];
    matrix["senal"] = [];
    matrix["frecuencia"] = [];
    matrix["probabilidad"] = [];
    matrix["senalTransmitida"] = [];
    matrix["probabilidadSenal"] = 0;
    senalDisponible = [];

    //#funcion principal
    $("button[id=exec]").click(function(){

        var datos = $("#dataInit").val();
        console.log(datos.length);
        cleanMatrix();
        if (datos.length > 0) {
            calcularSenales();
        }
    });

    $('input[id="canal"]').change(function() {
        if(this.checked) {
            $('#canalValue').val('');
            $('#canalValue').css("display", "block");
            $('#blockFinalText').css("display", "block");
        } else {
            $('#canalValue').val('');
            $('#canalValue').css("display", "none");
            $('#blockFinalText').css("display", "none");
        }
    });
    //#se calcula los tipos de señales y la cantidad que se repiten
    var calcularSenales = function() {
        var datos = $("#dataInit").val();
        var splitInfo = datos.split('');
        var lengthText = splitInfo.length;
        
        splitInfo.forEach((element, index) => {
            if (index == 0) {
                matrix["senal"].push(element);
                matrix["frecuencia"].push(1);
            } else {
                var auxIndex = matrix["senal"].indexOf(element);
                if (auxIndex >= 0){
                    matrix["frecuencia"][auxIndex] += 1;
                } else {
                    matrix["senal"].push(element);
                    matrix["frecuencia"].push(1);
                }
            }
        });
        calcularProbabilidad(lengthText);
        if ($("#canal").is(':checked')) {
            valorarCanal();
        }
        
    };
    
    //#se calcula la probabilidad de cada señal
    var calcularProbabilidad = function(lengthText) {
        matrix["frecuencia"].forEach((number)=> {
            matrix["probabilidad"].push(number/lengthText);
        });
        calcularSenalTransmitida();
    };

    //#se calcula cuanta señal se va ha transmitir
    var calcularSenalTransmitida = function() {
        console.log("matrix");
        console.log(matrix);
        console.log("log 2: "+ Math.log2(4));
        var datos = $("#dataInit").val();
        matrix["probabilidad"].forEach((dataProbability) => {
            matrix["senalTransmitida"].push(dataProbability*Math.log2(1/dataProbability));
        });
        matrix["senalTransmitida"].forEach((senalTransmitidaX) => {
            matrix["probabilidadSenal"] += senalTransmitidaX;
        });
        $("#dataH1").val(matrix["probabilidadSenal"]);
        imprimirTabla();
    };

    //#muestra los datos en la tabla
    var imprimirTabla = function() {
        $("#tableData").empty();
        $("#divTable").css("display", "block");
        var numeroSenal = matrix["senal"].length;
        console.log("nSenal" + numeroSenal);
        //se configura la cabecera
        $("#tableData").append('<tr>');
        $("#tableData").append('<th>Tipos de datos</th>');
        for (let index = 0; index < numeroSenal; index++) {
            $("#tableData").append('<th>S'+index+'</th>');       
        }
        $("#tableData").append('</tr>');
        imprimirSenal();
        imprimirFrecuencia();
        imprimirProbabilidad();
        imprimirSenalTransmitida();

    };

    var imprimirSenal = function() {
        //se muestra la data
        $("#tableData").append('<tr>');
        $("#tableData").append('<td style="background-color: #96bef9;">Señales</td>');
        matrix["senal"].forEach((dataItem) => {
            $("#tableData").append('<td style="background-color: #96bef9;">'+dataItem+'</td>');       
        });
        $("#tableData").append('</tr>');
    };

    var imprimirFrecuencia = function() {
        //se muestra la data
        $("#tableData").append('<tr>');
        $("#tableData").append('<td style="background-color: #4e93f9;">Frecuencia</td>');
        matrix["frecuencia"].forEach((dataItem) => {
            $("#tableData").append('<td style="background-color: #4e93f9;">'+dataItem+'</td>');       
        });
        $("#tableData").append('</tr>');
    };

    var imprimirProbabilidad = function() {
        //se muestra la data
        $("#tableData").append('<tr>');
        $("#tableData").append('<td style="background-color: #96bef9;">Probabilidad</td>');
        matrix["probabilidad"].forEach((dataItem) => {
            $("#tableData").append('<td style="background-color: #96bef9;">'+dataItem+'</td>');       
        });
        $("#tableData").append('</tr>');
    };

    var imprimirSenalTransmitida = function() {
        //se muestra la data
        $("#tableData").append('<tr>');
        $("#tableData").append('<td style="background-color: #4e93f9;">Señal Transmitida</td>');
        matrix["senalTransmitida"].forEach((dataItem) => {
            $("#tableData").append('<td style="background-color: #4e93f9;">'+dataItem+'</td>');       
        });
        $("#tableData").append('</tr>');
    };

    $("button[id=cleanAll]").click(function(){
        clean();
    });

    var clean = function() {
        cleanMatrix();
        $("#tableData").empty();
        $("#divTable").css("display", "none");
        $("#dataH1").val("");
        $("#dataInit").val("");
        $("#finishData").val("");
        $('#canalValue').val("");
        $('input[id="canal"]').prop('checked', false);
        $('#canalValue').css("display", "none");
        $('#blockFinalText').css("display", "none");
    };

    var cleanMatrix = function() {
        matrix["senal"] = [];
        matrix["frecuencia"] = [];
        matrix["probabilidad"] = [];
        matrix["senalTransmitida"] = [];
        matrix["probabilidadSenal"] = 0;
        senalDisponible = [];
    };
    
    var valorarCanal = function() {
        var valorCanal = $('#canalValue').val();
        var auxCanalActual = 0;
        matrix["senalTransmitida"].forEach((senalTransmitidaX, index) => {
            auxCanalActual += senalTransmitidaX;
            if (auxCanalActual <= valorCanal) {
                console.log("senal :" +index + " : " +matrix["senal"][index]);
                senalDisponible.push(matrix["senal"][index]);
            }
        });
        construirSeñalFinal();
    };

    var construirSeñalFinal = function() {
        var datos = $("#dataInit").val();
        var splitInfoFinal = datos.split('');
        var dataFinal = "";
        splitInfoFinal.forEach((letra) => {
            var auxIndex = senalDisponible.indexOf(letra);
            if (auxIndex < 0){
                dataFinal += "-";
            } else {
                dataFinal += letra;
            }
        });
        $("#finishData").val(dataFinal);
    };
});