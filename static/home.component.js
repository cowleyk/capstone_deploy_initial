(function() {
  'use strict';

  angular.module('app')
  .component('home', {
    controller: homeController,
    templateUrl: '../static/home.component.html'
  });

  homeController.$inject = ['$http', '$state'];

  function homeController($http, $state){
    const vm = this;


     vm.$onInit = function(){
        console.log('homeController $onInit')
     };



  }

})();