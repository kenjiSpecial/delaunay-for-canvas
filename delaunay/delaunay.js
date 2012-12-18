/**
 * Created with JetBrains WebStorm.
 * User: kenjisaito
 * Date: 12/14/12
 * Time: 3:41 PM
 * To change this template use File | Settings | File Templates.
 */

//define the point class
var Point = function(x, y){
    this.x = x;
    this.y = y;
};

var Circle = function(rad, centerPoint){
    this.rad = rad;
    this.centerPoint = centerPoint;
};

var DelaunayDataSet = function( vertex, context){
    this.vertex = vertex;
    this.context = context;

    this.fillTriangleColor = "#ff0000";
    this.fillTriangleCheck = true;

    this.strokeTriangleColor = "rgba( 80, 80, 80, .2)";
    this.strokeTriangleCheck = true;
}

DelaunayDataSet.prototype.drawTriangle = function(){

    for (var i = 0; i < this.triangleVertexNumber.length; i += 3) {

        if(this.triangleVertexNumber[i] !== 0 && this.triangleVertexNumber[i] !== 1 && this.triangleVertexNumber[i] !== 2 && this.triangleVertexNumber[i + 1] !== 0 && this.triangleVertexNumber[i + 1] !== 1 && this.triangleVertexNumber[i + 1] !== 2&& this.triangleVertexNumber[i + 2] !==  0&& this.triangleVertexNumber[i + 2] !== 1 && this.triangleVertexNumber[i + 2] !== 2){

            this.context.beginPath();
//        console.log(this.triangleVertexNumber[i]);

            this.context.moveTo(this.vertex[this.triangleVertexNumber[i]].x, this.vertex[this.triangleVertexNumber[i]].y);
//        console.log(this.triangleVertexNumber[i + 1]);
            this.context.lineTo(this.vertex[this.triangleVertexNumber[i + 1]].x, this.vertex[this.triangleVertexNumber[i + 1]].y);
//        console.log(this.triangleVertexNumber[i + 2]);
            this.context.lineTo(this.vertex[this.triangleVertexNumber[i + 2]].x, this.vertex[this.triangleVertexNumber[i + 2]].y);
            this.context.lineTo(this.vertex[this.triangleVertexNumber[i]].x, this.vertex[this.triangleVertexNumber[i]].y);

            if (this.fillTriangleCheck) {
                if(i > this.triangleVertexNumber.length - 9){
//               var num = 120 + (80 / this.triangleVertexNumber.length * i)|0;
                    this.context.fillStyle = "rgba(169,105,108, 0.6)";
                }else{
                    var num = 120 + (80 / this.triangleVertexNumber.length * i)|0;
                    this.context.fillStyle = "#" + num.toString(16) + num.toString(16) + num.toString(16);
                }

                this.context.fill();
            }

            if (this.strokeTriangleCheck) {
                this.context.strokeStyle = this.strokeTriangleColor;
                this.context.stroke();
            }

            this.context.closePath();

        }
    }
};

DelaunayDataSet.prototype.update = function(){

    var vertexNumber = this.vertex.length;
    this.triangleVertexNumber = [ 0, 1, 2];
    this.circumCircles = [];


    var firstCircle = calculationCircle( this.vertex[0], this.vertex[1], this.vertex[2]);
    this.circumCircles.push(firstCircle);

    for(var i = 3; i < vertexNumber; i++){
        calTriangles(this, i);
        if(i > 3){
            removeTriangle(this, i);
        }
    }

};


// define the method which is very useful
function distanceBetweenPoints(pt1, pt2){
    var dx = pt2.x - pt1.x;
    var dy = pt2.y - pt1.y;

    return  Math.sqrt(dx * dx + dy * dy);
}

function distanceBetweenPointAndCircle(pt, circle){
    var dx = pt.x - circle.centerPoint.x;
    var dy = pt.y - circle.centerPoint.y;

    return  Math.sqrt(dx * dx + dy * dy);
}

function judgeBetweenDistance(_pt, _circle) {
    var dis = distanceBetweenPointAndCircle(_pt, _circle);

    var circleJudge = false;
    if (dis < _circle.rad) {
        circleJudge = true;
    }

    return circleJudge;
}

//this is the process of 3 ( separating of the triangles, add the circum circles, and deleting the extra triangle
function calTriangles( _delaunayDataSet, num){
    var newNumber = num;
    var pt = _delaunayDataSet.vertex[newNumber];

    var tempVertexNumber = [];
    var tempCircles = [];
    var tempNumbers =[];

    for(var i = 0; i < _delaunayDataSet.circumCircles.length; i++){
//        console.log("i: " + i);
        if(judgeBetweenDistance(pt, _delaunayDataSet.circumCircles[i])){
            tempNumbers.push(i);

            var selectingNum01 = _delaunayDataSet.triangleVertexNumber[3 * i];
            var selectingNum02 = _delaunayDataSet.triangleVertexNumber[3 * i + 1];
            var selectingNum03 = _delaunayDataSet.triangleVertexNumber[3 * i + 2];

//                push the number to pointNumbers array
            tempVertexNumber.push(selectingNum01);
            tempVertexNumber.push(selectingNum02);
            tempVertexNumber.push(newNumber);

            tempVertexNumber.push(selectingNum02);
            tempVertexNumber.push(selectingNum03);
            tempVertexNumber.push(newNumber);

            tempVertexNumber.push(selectingNum03);
            tempVertexNumber.push(selectingNum01);
            tempVertexNumber.push(newNumber);

            var ct01circle1 = calculationCircle( _delaunayDataSet.vertex[selectingNum01], _delaunayDataSet.vertex[selectingNum02], _delaunayDataSet.vertex[newNumber]);
            var ct01circle2 = calculationCircle( _delaunayDataSet.vertex[selectingNum02], _delaunayDataSet.vertex[selectingNum03], _delaunayDataSet.vertex[newNumber]);
            var ct01circle3 = calculationCircle( _delaunayDataSet.vertex[selectingNum03], _delaunayDataSet.vertex[selectingNum01], _delaunayDataSet.vertex[newNumber]);

            tempCircles.push(ct01circle1);
            tempCircles.push(ct01circle2);
            tempCircles.push(ct01circle3);
        }
    }

    for(i = 0; i < tempVertexNumber.length; i++){
        _delaunayDataSet.triangleVertexNumber.push(tempVertexNumber[i]);
    }

    for(i = 0; i < tempCircles.length; i++){
        _delaunayDataSet.circumCircles.push(tempCircles[i]);
    }

    for (i = 0; i < tempNumbers.length; i++) {
        var num = tempNumbers[i] - i;

        var slicedObjectPtNumbers;
        var slicedCircles;

        if (num == 0) {
            slicedObjectPtNumbers = _delaunayDataSet.triangleVertexNumber.slice(3);
            slicedCircles = _delaunayDataSet.circumCircles.slice(1);
        } else {
            var slicedObjectPtNumberBefore = _delaunayDataSet.triangleVertexNumber.slice(0, 3 * num);
            var slicedObjectPtNumberAfter = _delaunayDataSet.triangleVertexNumber.slice(3 * num + 3);
            slicedObjectPtNumbers = slicedObjectPtNumberBefore.concat(slicedObjectPtNumberAfter);

            var slicedCircleBefore = _delaunayDataSet.circumCircles.slice(0, num);
            var slicedCircleAfter = _delaunayDataSet.circumCircles.slice(1 + num);
            slicedCircles = slicedCircleBefore.concat(slicedCircleAfter);
        }

        _delaunayDataSet.triangleVertexNumber = slicedObjectPtNumbers;
        _delaunayDataSet.circumCircles = slicedCircles;
    }

}

function calculationCircle(pt01, pt02, pt03) {

    var x1 = pt01.x;
    var y1 = pt01.y;

    var x2 = pt02.x;
    var y2 = pt02.y;

    var x3 = pt03.x;
    var y3 = pt03.y;

    var c = 2.0 * ((x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1));
    var tempX = ((y3 - y1) * (x2 * x2 - x1 * x1 + y2 * y2 - y1 * y1) + (y1 - y2) * (x3 * x3 - x1 * x1 + y3 * y3 - y1 * y1)) / c;
    var tempY = ((x1 - x3) * (x2 * x2 - x1 * x1 + y2 * y2 - y1 * y1) + (x2 - x1) * (x3 * x3 - x1 * x1 + y3 * y3 - y1 * y1)) / c;
    var tempPt = new Point(tempX, tempY);

    var tempRad = Math.sqrt(Math.pow(tempX - x1, 2) + Math.pow(tempY - y1, 2));

    return new Circle(tempRad, tempPt);
}

function removeTriangle( _delaunayDataSet, tempVertexNum){
    var circumcircleArrays = _delaunayDataSet.circumCircles;
    var ommitCircumCircleNumbers = [];

    for( var i = 0; i < circumcircleArrays.length;i++){
        var vertexNum01 = _delaunayDataSet.triangleVertexNumber[i * 3];
        var vertexNum02 = _delaunayDataSet.triangleVertexNumber[i * 3 + 1];
        var vertexNum03 = _delaunayDataSet.triangleVertexNumber[i * 3 + 2];

        for(var num = 0; num < tempVertexNum; num++){
            if(num != vertexNum01 && num != vertexNum02 && num != vertexNum03){

                if(judgeBetweenDistance(_delaunayDataSet.vertex[num], circumcircleArrays[i])){
                    ommitCircumCircleNumbers.push(i);
                    break;
                }

            }
        }

    }


    //omit
    var tempCircumCircleArray = [];
    var tempTriagneNumberArray = [];

    for( i = 0; i < circumcircleArrays.length; i++){
        for(var j = 0; j < ommitCircumCircleNumbers.length; j++){
            if(ommitCircumCircleNumbers[j] == i){
                break;
            }
        }

        if(j == ommitCircumCircleNumbers.length){

            tempTriagneNumberArray.push( _delaunayDataSet.triangleVertexNumber[3 * i]);
            tempTriagneNumberArray.push( _delaunayDataSet.triangleVertexNumber[3 * i + 1]);
            tempTriagneNumberArray.push( _delaunayDataSet.triangleVertexNumber[3 * i + 2]);

            tempCircumCircleArray.push( _delaunayDataSet.circumCircles[i]);
        }
    }



//    console.log("tempTriagneNumberArray.length: " + tempTriagneNumberArray.length);
    _delaunayDataSet.triangleVertexNumber = [];
    for( i = 0; i < tempTriagneNumberArray.length; i++){
        _delaunayDataSet.triangleVertexNumber[i] = tempTriagneNumberArray[i];
    }

    _delaunayDataSet.circumCircles = [];
    for( i = 0; i < tempCircumCircleArray.length; i++){
        _delaunayDataSet.circumCircles[i] = tempCircumCircleArray[i];
    }
}

function initTriangle(context, recWid, recHig, recTop, recLeft){
    var vertex = [];

    var bigRad = Math.sqrt(Math.pow(recWid, 2) + Math.pow(recHig, 2)) / 2;
    var bigCirclePos = new Point(recWid / 2 + recLeft, recHig / 2 + recTop);

    vertex.push(new Point(bigCirclePos.x - Math.sqrt(3) * bigRad, bigCirclePos.y - bigRad));
    vertex.push(new Point(bigCirclePos.x + Math.sqrt(3) * bigRad, bigCirclePos.y - bigRad));
    vertex.push(new Point(bigCirclePos.x, bigCirclePos.y + bigRad * 2));


//    setting DelaunayDataSet with the vertex.
    return new DelaunayDataSet( vertex, context);
}