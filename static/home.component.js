(function() {
  'use strict';

  angular.module('app')
  .component('home', {
    controller: homeController,
    template: `
                <p>homeController</p>
                <br>
                <a ui-sref="csvmanage">csvmanage</a>`
  });

  homeController.$inject = ['$http', '$state'];

  function homeController($http, $state){
    const vm = this;


     vm.$onInit = function(){
        console.log('homeController $onInit')
     };



  }

})();
