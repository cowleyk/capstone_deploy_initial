(function() {
  'use strict';
  // const fs = require('fs');

  angular.module('app')
  .component('csvmanage', {
    controller: csvmanageController,
    template: `<br>
<br>
<div class="container">
  <h2 ng-if="$ctrl.showUpload">Select .csv File</h2>
  <h2 ng-if="!$ctrl.showUpload">Select Regression</h2>
  <div class="row">
    <div class="six columns" ng-if="$ctrl.showUpload">
      <form ng-submit="$ctrl.upload()">
        <input type="file"
          id="fileinput" name="file" style="height:20px; margin:5px;"/><br>
        <button type="submit">Upload</button>
      </form>
  </div>
  <div class="six columns" ng-if="$ctrl.showUpload">
    <p ng-if="$ctrl.serverDataAvailable" style="height:20px; margin:5px;">Load Previously Used .csv File</p>
    <button ng-if="$ctrl.serverDataAvailable" ng-click="$ctrl.useServerData()">Load</button>
  </div>
</div>
</div>
<div class="container">
  <div ng-if="$ctrl.showOptions">
    <form ng-submit="$ctrl.goToRegression()">
      <button type="submit">Multiple Linear Regression</button>
    </form>
  </div>
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
      console.log('depthree');
      document.getElementById('intro').innerHTML = '';
      $http.get('/getuserdata').then(function(data){
        console.log('get return', data);
        if(data.status === 200){
          vm.serverDataAvailable = true;
        }
        vm.serverData = data.data;
      })
    };

    vm.upload = function(){
      var input = document.getElementById('fileinput');
      let rawcsvstring;

      var file = input.files[0];

      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(event) {
        vm.csvData = event.target.result;
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

    vm.useServerData = function(){
      console.log('useServerData');
      console.log(vm.serverData);
      let rawcsvstring = "*"+vm.serverData+"*"
      vm.initializeMatrixObj(rawcsvstring)
      vm.showUpload = !vm.showUpload;
      vm.showOptions = !vm.showOptions;
    }

    vm.goToRegression = function(){
      console.log('goToRegression');
      $http.get('/csvpost').then(function(data){
        console.log('csvpost return', data)
      })
      $state.go("regression", {matrixObj: matrixObj});
    }

    vm.initializeMatrixObj = function(rawcsvstring){
      let csvReplaceString;
      if(rawcsvstring[0] === '*'){
        rawcsvstring = rawcsvstring.substring(1, rawcsvstring.length-1);
        csvReplaceString = rawcsvstring.replace(/rn/g, '%');
      }
      else{
        rawcsvstring = rawcsvstring.substring(1, rawcsvstring.length-1);
        csvReplaceString = rawcsvstring.replace(/\\r\\n/g, '%');
      }

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
