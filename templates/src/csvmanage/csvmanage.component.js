(function() {
  'use strict';
  // const fs = require('fs');

  angular.module('app')
  .component('csvmanage', {
    controller: csvmanageController,
    templateUrl: 'src/csvmanage/csvmanage.component.html'
  });

  csvmanageController.$inject = ['$scope', '$state'];

  function csvmanageController($scope, $state) {
    const vm = this;
    $scope.csv = {
    	content: null,
    	header: true,
    	headerVisible: true,
    	separator: ',',
    	separatorVisible: true,
    	result: null,
    	encoding: 'ISO-8859-1',
    	encodingVisible: true,
        uploadButtonLabel: "upload a csv file"
    };
    vm.variables = [];
    vm.showUpload = true;
    let headerArr;
    let csvObj = {};
    let indMatrix = [];
    let depMatrix = [];
    vm.manipData = function(){
      // run when 'upload' button clicked
      let fileData = $scope.csv.content;

      let split1 = fileData.split(/\n/);
      headerArr = split1.shift().split(',');
      headerArr.forEach(function(elem){
        let elemObj = {'name':elem, 'dependent':false};
        vm.variables.push(elemObj);
      });
      for (var i = 0; i < split1.length; i++) {
        let obvsNum = i+1;
        split1[i] = split1[i].split(',');
        csvObj[obvsNum] = split1[i];
        if(csvObj[obvsNum].length !== headerArr.length){
          delete csvObj[obvsNum];
        }
      }
      split1.pop();
      // let headerArr = split1[0];
      vm.showOptions = true;
      vm.showUpload = false;
      // csvObj = {obvs#:[yN, x1N, x2N]}
    };

    // TODO create constructor for csv data
      // include variable name array, dependent variable, y & x arrays
    // TODO make csv.separator customizable

    vm.setSelection = function(){

      let indIndex = headerArr.indexOf(vm.independent);
      let depNameArr = ['constant'];
      let depIndex = [];
      vm.variables.forEach(function(elem){
        if(elem.dependent){
          depIndex.push(headerArr.indexOf(elem.name));
          depNameArr.push(elem.name);
        }
      });
      for(let key in csvObj){
        let tempArr = csvObj[key];
        indMatrix.push([tempArr[indIndex]]);
        tempArr.splice(indIndex, 1);
        tempArr.unshift(1);
        depMatrix.push(tempArr);
      }

      let xPrXinv = math.inv(math.multiply(math.transpose(depMatrix), depMatrix));
      let xPrY = math.multiply(math.transpose(depMatrix), indMatrix);
      let bHat = math.multiply(xPrXinv, xPrY);
      let sse = math.multiply(math.transpose(indMatrix),indMatrix) - math.multiply(math.transpose(bHat), math.multiply(math.transpose(depMatrix), indMatrix));
      let sumY = 0;
      indMatrix.forEach(function(elem){
        sumY += parseFloat(elem[0]);
      });
      let ssr = math.multiply(math.transpose(bHat), math.multiply(math.transpose(depMatrix), indMatrix))-(sumY*sumY)/(Object.keys(csvObj).length);
      let sst = sse + ssr;



      let matrixObj = {
        'variables': headerArr,
        'depVariables': depNameArr,
        'C': xPrXinv,
        'bHat': bHat,
        'X': depMatrix,
        'y': indMatrix,
        'n': Object.keys(csvObj).length,
        'k': depIndex.length,
        'p': depIndex.length+1,
        'sse': sse,
        'ssr': ssr,
        'sst': sst
      };
      $state.go("regression", {matrixObj: matrixObj});

      };

      vm.dependentFilter = function(val){
        return val.name !== vm.independent;
      };

      vm.showOptions = false;

  }


})();
