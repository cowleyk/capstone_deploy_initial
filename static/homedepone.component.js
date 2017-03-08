(function() {
  'use strict';

  angular.module('app')
  .component('home', {
    controller: homeController,
    template: `<br>
                <button>Login</button>`
  });

  homeController.$inject = ['$http', '$state'];

  function homeController($http, $state){
    const vm = this;

     vm.$onInit = function(){
        console.log('homeController')
        console.log('depone')
     };

  }

})();
