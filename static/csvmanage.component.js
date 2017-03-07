(function() {
  'use strict';
  // const fs = require('fs');

  angular.module('app')
  .component('csvmanage', {
    controller: csvmanageController,
    template: '<p>csvmanage</p>'
  });

  csvmanageController.$inject = ['$scope', '$state'];

  function csvmanageController($scope, $state) {
    const vm = this;

    vm.$onInit = function(){
        console.log('csvmanage $onInit')
    }
  }


})();
