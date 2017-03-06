(function() {
  'use strict';

  angular.module('app')
  .component('regression', {
    controller: regressionController,
    templateUrl: 'src/regression/regression.component.html',
  });

  regressionController.$inject = ['$http', '$stateParams', '$state'];

  function regressionController($http, $stateParams, $state){
    const vm = this;

    vm.$onInit = function(){
      // console.log('$onInit fired');
      vm.matrixObj = $stateParams.matrixObj;
      console.log('matrixObj', vm.matrixObj);


      vm.sigSq = vm.matrixObj.sse/(vm.matrixObj.n-vm.matrixObj.p);
      console.log('sigSq', vm.sigSq);

      vm.f0 = (vm.matrixObj.ssr/vm.matrixObj.k)/(vm.matrixObj.sse/(vm.matrixObj.n-vm.matrixObj.p));
      console.log('f0', vm.f0);

      // f0Array & tObj accessible!
      // access via f0 table [row(n-p-1)][column(k-1)]

      // accesses proper f0 value from table!
      vm.f0Table = f0Array[parseInt(vm.matrixObj.n) - parseInt(vm.matrixObj.p) - 1][parseInt(vm.matrixObj.k) - 1];
      console.log(vm.f0 > vm.f0Table); // true for pullStrength sample

      // accesses proper t value (if tcalc > ttable variable contributes significantly to model)
      // console.log('t value', tObj[parseInt(vm.matrixObj.n) - parseInt(vm.matrixObj.p)]);

      // TODO function to manip bHat vals for ng-repeat
        // array of objects w/ variable name, tTest values & tTable values
      vm.tableArr = [];
      for (var i = 0; i < vm.matrixObj.bHat.length; i++) {
        vm.tableArr.push({
          'bHat': vm.matrixObj.bHat[i][0],
          'name': vm.matrixObj.depVariables[i],
          'sebHatj': Math.sqrt(vm.sigSq*vm.matrixObj.C[i][i]),
          't':vm.matrixObj.bHat[i][0]/Math.sqrt(vm.sigSq*vm.matrixObj.C[i][i])
          // is 't' correct? (looks good for x2, not x1)
        });
        // console.log(vm.tableArr[i].name, vm.matrixObj.C[i][i]);
      }
      console.log(vm.tableArr);

    };



  }

})();
