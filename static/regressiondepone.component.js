(function() {
  'use strict';

  angular.module('app')
  .component('regression', {
    controller: regressionController,
    template: `<br>
<div ng-if="$ctrl.showOptions">
  <form ng-submit="$ctrl.setSelection()">
    <p>Select the independent variable</p>
    <div class="row">
    <div class="three columns" ng-repeat="variable in $ctrl.matrixObj.elemObjArr">
      <label class="example-send-yourself-copy">
        <input type="radio" name="independentRadio" ng-value="variable.name" ng-model="$ctrl.independent">
        <span class="label-body">//variable.name//</span>
      </label>
    </div>
    </div>
    <br>
    <p ng-if="$ctrl.showOptions">Select the dependent variables</p>
    <div class="row">
    <div class="three columns" ng-repeat="var in $ctrl.matrixObj.elemObjArr | filter:$ctrl.dependentFilter" ng-if="$ctrl.independent">
      <label class="example-send-yourself-copy">
        <input type="checkbox" ng-model="var.dependent">
        <span class="label-body">//var.name//</span>
      </label>
    </div>
    </div>

    <button type="submit">Submit</button>
  </form>
</div>

<!-- table for overall regression -->
<div class="container" ng-if="$ctrl.showTable">
  <table style="border:1px solid #E1E1E1; border-radius:10%; padding:5%;">
    <p style="text-align:center;"><u>Analysis of Variance</u></p>
    <tr>
      <th>Source Of Variation</th>
      <th>Sum of Squares</th>
      <th>Degrees of Freedom</th>
      <th>Mean Square</th>
      <th>F<sub>0</sub></th>
    </tr>
    <tr>
      <td>Regression</td>
      <td><i>SS<sub>R</sub> =</i> //$ctrl.regressionObj.ssr//</td>
      <td><i>k =</i> //$ctrl.regressionObj.k//</td>
      <td><i>MS<sub>R</sub> =</i> //$ctrl.regressionObj.msr//</td>
      <td><i>MS<sub>R</sub>/MS<sub>E</sub> =</i> //$ctrl.regressionObj.f0//</td>
    </tr>
    <tr>
      <td>Error or Residual</td>
      <td><i>SS<sub>E</sub> =</i> //$ctrl.regressionObj.sse//</td>
      <td><i>n-p =</i> //$ctrl.regressionObj.n - $ctrl.regressionObj.p//</td>
      <td><i>MS<sub>E</sub> =</i> //$ctrl.regressionObj.mse//</td>
      <td></td>
    </tr>
    <tr>
      <td>Total</td>
      <td><i>SS<sub>T</sub> =</i> //$ctrl.regressionObj.sst//</td>
      <td><i>n-1 =</i> //$ctrl.regressionObj.n - 1//</td>
      <td></td>
      <td></td>
    </tr>
  </table>
</div>
<br>

<br>
<!-- table for dependent variable analysis -->
<div class="container" ng-if="$ctrl.showTable">
  <p>R<sup>2</sup><sub>adj</sub> = //$ctrl.regressionObj.r2adj//</p>
  <table style="border:1px solid #E1E1E1; border-radius:10%; padding:5%;">
    <p style="text-align:center;"><u>Regression Analysis</u></p>
    <tr>
      <th>Variable</th>
      <th>Coefficient (&beta;)</th>
      <th>Est. Standard Error</th>
      <th>t<sub>0</sub></th>
      <th>t<sub>&alpha;/2,(n-p)</sub></th>
    </tr>
    <tr ng-repeat="var in $ctrl.varTableArr">
      <td>//var.name//</td>
      <td>&beta; = //var.coeff//</td>
      <td>se(&beta;) = //var.seCoeff//</td>
      <td>t<sub>0</sub> = //var.t//</td>
      <td>//var.tTable//</td>
    </tr>
  </table>
</div>`,
  });

  regressionController.$inject = ['$http', '$stateParams', '$state'];

  function regressionController($http, $stateParams, $state){
    const vm = this;
    vm.showOptions = true;
    vm.showTable = false;

    vm.$onInit = function(){
      // console.log('$onInit fired');
      vm.matrixObj = $stateParams.matrixObj;
      console.log('matrixObj', vm.matrixObj);
    }; // close vm.$onInit

    vm.setSelection = function(){
      let depVarTableArr =[];
      let independentVar = vm.independent;
      let independentObj = {};
      let dependentObjArr = [];
      let yMatrix = [];
      let xMatrix = [];

      // split data based on variable selection
      vm.independentObj = vm.matrixObj.elemObjArr.forEach(function(elem){
        if(elem.name === independentVar){
          independentObj = elem;
        }
        if(elem.dependent){
          dependentObjArr.push(elem);
        }
      });
      console.log('dependentObjArr', dependentObjArr);

      // define xMatrix, yMatrix
      vm.matrixObj.allDataMatrix.forEach(function(lineArr){
        let indIndex = independentObj.col_index;
        let indSplice = lineArr.splice(indIndex, 1)
        yMatrix.push(indSplice);
        lineArr.unshift(1);
        xMatrix.push(lineArr);
      });

      let n = vm.matrixObj.allDataMatrix.length;
      let k = dependentObjArr.length;
      let p = k + 1
      let cMatrix = math.inv(math.multiply(math.transpose(xMatrix), xMatrix));
      let xPrY = math.multiply(math.transpose(xMatrix), yMatrix);
      let bHatMatrix = math.multiply(cMatrix, xPrY);
      let sse = math.multiply(math.transpose(yMatrix),yMatrix) - math.multiply(math.transpose(bHatMatrix), math.multiply(math.transpose(xMatrix), yMatrix));
      let sumY = 0;
      yMatrix.forEach(function(dp){
        sumY += parseFloat(dp[0]);
      });
      let ssr = math.multiply(math.transpose(bHatMatrix), math.multiply(math.transpose(xMatrix), yMatrix))-(sumY*sumY)/(n);
      let sst = sse + ssr;
      let sigSq = sse/(n-p);
      let msr = (ssr/k);
      let mse = (sse/(n-p));
      let f0 = msr/mse
      let fTable = f0Array[n-p-1][k-1];
      let tTable = tObj[n-p];

      vm.regressionObj ={
        n: n,
        k: k,
        sse: sse.toFixed(3),
        ssr: ssr.toFixed(3),
        sst: sst.toFixed(3),
        msr: msr.toFixed(3),
        mse: mse.toFixed(3),
        sigSq: sigSq.toFixed(3),
        f0: f0.toFixed(3),
        fTable: fTable,
        r2adj: 1-(sse/(n-p)/(sst/(n-1))).toFixed(3)
      };

      vm.varTableArr = [];
      for (let i = 0; i < bHatMatrix.length; i++) {
        let coeffObj;
        if(i === 0){
          let tzero = bHatMatrix[i][0]/Math.sqrt(Math.abs(sigSq*cMatrix[i][i]));
          coeffObj = {
            name: 'Constant',
            coeff: bHatMatrix[i][0].toFixed(3),
            seCoeff: Math.sqrt(sigSq*cMatrix[i][i]).toFixed(3),
            t: Math.abs(tzero).toFixed(3),
            tTable: tTable
          };
        }
        else{
          let tzero = bHatMatrix[i][0]/Math.sqrt(Math.abs(sigSq*cMatrix[i][i]));
          coeffObj = {
            name: dependentObjArr[i-1].name,
            coeff: bHatMatrix[i][0].toFixed(3),
            seCoeff: Math.sqrt(sigSq*cMatrix[i][i]).toFixed(3),
            t: Math.abs(tzero).toFixed(3),
            tTable: ' '
          };
        }
        vm.varTableArr.push(coeffObj);
      }


      vm.showOptions = false;
      vm.showTable = true;
    }; // close vm.setSelection

    vm.dependentFilter = function(val){
      return val.name !== vm.independent;
    };



  } // close controller

})();
