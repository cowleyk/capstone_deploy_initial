(function() {
  'use strict';
  // const fs = require('fs');

  angular.module('app')
  .component('csvmanage', {
    controller: csvmanageController,
    template: `<p>csvmanage</p>
            <br>
            <a ui-sref="home">home</a>
            <br>
            <br>
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
            </div>`
  });

  csvmanageController.$inject = ['$scope', '$state'];

  function csvmanageController($scope, $state) {
    const vm = this;

    vm.$onInit = function(){
        console.log('csvmanage $onInit')
        console.log('change2')
    }
    vm.upload = function(){
      var data = null;
      var input = document.getElementById('fileinput');
      var file = input.files[0];
      // console.log(file);
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(event) {
          var csvData = event.target.result;
          console.log(csvData);
          console.log(typeof csvData);
      };
      reader.onerror = function() {
          console.log('Unable to read ' + file.fileName);
      };

    }
  }


})();
