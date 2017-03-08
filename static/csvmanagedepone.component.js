(function() {
  'use strict';
  // const fs = require('fs');

  angular.module('app')
  .component('csvmanage', {
    controller: csvmanageController,
    template: `<br>
<div class="container">
  <div ng-if="$ctrl.showUpload">
  <form ng-submit="$ctrl.upload()">
    <input type="file"
      id="fileinput" name="file" />
      <br>
    <button type="submit">Upload</button>
  </form>

  <br>
  </div>
</div>
    <!-- ng-repeat of input boxes for headerArr -->
  <div ng-if="$ctrl.showOptions">
    <form ng-submit="$ctrl.goToRegression()">
      <button type="submit">Get Regression Model</button>
    </form>
  </div>`
  });

  csvmanageController.$inject = ['$http', '$state'];

  function csvmanageController($http, $state) {
    const vm = this;
    vm.showUpload = true;
    let matrixObj = {
      elemObjArr: [],
      allDataMatrix: []
    };

    vm.$onInit = function(){
      console.log('csvmanage');
    };

    vm.upload = function(){
      var input = document.getElementById('fileinput');
      let rawcsvstring;

      var file = input.files[0];

      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(event) {
        var csvData = event.target.result;
        rawcsvstring = JSON.stringify(csvData);

        var csvCookie = 'csv_data='+JSON.stringify(csvData);
        document.cookie = csvCookie;

        vm.initializeMatrixObj(rawcsvstring);

      };
      reader.onerror = function() {
        alert('Unable to read ' + file.fileName);
      };

      vm.showUpload = !vm.showUpload;
      vm.showOptions = !vm.showOptions;

    };

    vm.goToRegression = function(){
      console.log('goToRegression');
      $state.go("regression", {matrixObj: matrixObj});
    }

    vm.initializeMatrixObj = function(rawcsvstring){
      rawcsvstring = rawcsvstring.substring(1, rawcsvstring.length-1);

      let csvReplaceString = rawcsvstring.replace(/\\r\\n/g, '%');

      let csvLineSplitArr = csvReplaceString.split(/%/);
      vm.headerArr = csvLineSplitArr.shift().split(',');
      csvLineSplitArr.pop();
      // csvLineSplitArr does not include headers after headerArr definied

      for (let i = 0; i < vm.headerArr.length; i++) {
        let elemObj = {
          name: vm.headerArr[i],
          dependent: false,
          col_index: i,
          valsArr: []
        };
        matrixObj.elemObjArr.push(elemObj);
      }

      let masterMatrixObj = {};
      csvLineSplitArr.forEach(function(line){
        let lineArr = line.split(',');
        matrixObj.allDataMatrix.push(lineArr);
        for (let i = 0; i < lineArr.length; i++) {
          // lineArr[i] = individual data point
          if(masterMatrixObj[i]){
            masterMatrixObj[i].push(lineArr[i]);
          }
          else{
            masterMatrixObj[i] = [];
            masterMatrixObj[i].push(lineArr[i]);
          }
        }
      });
      matrixObj.elemObjArr.forEach(function(elem){
        // elem = elemObj in array
        elem.valsArr = masterMatrixObj[elem.col_index];
      });
    };

  } // close controller

})();
