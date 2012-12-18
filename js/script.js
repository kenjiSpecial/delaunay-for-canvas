/**
 * Created with JetBrains WebStorm.
 * User: kenjisaito
 * Date: 12/17/12
 * Time: 11:20 AM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    var canvas = document.getElementById("myCanvas");
    var canvasWid = window.innerWidth;
    var canvasHig = window.innerHeight;

    canvas.width = canvasWid;
    canvas.height = canvasHig;

    var context = canvas.getContext("2d");


    var recWid = canvasWid;
    var recHig = canvasHig;

    var recTop = 0;
    var recLeft = 0;

    var delaneyNum = 80;
    var myDelaunayDataSet = initTriangle(context, recWid, recHig, recTop, recLeft);

//    from here, starting loop
//    setup the triangle



    var tempPt;
    tempPt = new Point(0, 0);
    myDelaunayDataSet.vertex.push(tempPt);

    tempPt = new Point(canvasWid, 0);
    myDelaunayDataSet.vertex.push(tempPt);

    tempPt = new Point(0, canvasHig);
    myDelaunayDataSet.vertex.push(tempPt);

    tempPt = new Point( canvasWid, canvasHig);
    myDelaunayDataSet.vertex.push(tempPt);


    for(var i = 0; i < delaneyNum - 4; i++){
        var pt = new Point(Math.random() * recWid + recLeft, Math.random() * recHig + recTop);
        myDelaunayDataSet.vertex.push(pt);
    }
    var mousePos = new Point( canvasWid/2, canvasHig/2);
    myDelaunayDataSet.vertex.push(mousePos);

    myDelaunayDataSet.update();
    myDelaunayDataSet.drawTriangle();

    function getMousePos(canvas, evt){
        var rect = canvas.getBoundingClientRect();
        return new Point( evt.clientX - rect.left, evt.clientY - rect.top);
    }


    canvas.addEventListener('mousemove', function(evt) {
        mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;

        $("#mousePosition").html(message);

    }, false);

    loop();

    function loop(){
//        console.log("loop");
        context.clearRect( 0, 0, canvasWid, canvasHig);

        myDelaunayDataSet.vertex[myDelaunayDataSet.vertex.length - 1] = mousePos;

        myDelaunayDataSet.update();
        myDelaunayDataSet.drawTriangle();


        context.fillStyle = "#330000";
        context.beginPath();
        context.arc( mousePos.x, mousePos.y, 3, 0, 2 * Math.PI, false);
        context.fill();
        context.closePath();

        requestAnimFrame(loop);
    }




})();