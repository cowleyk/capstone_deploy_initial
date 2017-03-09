(function() {
  'use strict';

  angular.module('app')
  .component('home', {
    controller: homeController,
    template: `<div id="introHomeComp" class="container">
            <p style="text-align:center;">Hello. Thanks for signing in.
                Below are the assumptions made for generating a linear regression model.  Enjoy!</p>
            <ol>
                <li>Your dependent variable should be measured on a continuous scale</li>
                <li>You have two or more independent variables, which can be either continuous or categorical</li>
                <li>You should have independence of observations/residuals</li>
                <li>There needs to be a linear relationship</li>
                <li>Your data needs to show homoscedasticity</li>
                <li>Your data must not show multicollinearity</li>
                <li>There should be no significant outliers, high leverage points or highly influential points</li>
                <li>The residuals are approximately normally distributed</li>
            </ol>
            <button ui-sref="csvmanage">Enter</button>
        </div>`
  });

  homeController.$inject = ['$http', '$state'];

  function homeController($http, $state){
    const vm = this;

     vm.$onInit = function(){
        console.log('homeController')
        console.log('depthree')
        document.getElementById('intro').innerHTML = '';

     };

  }

})();
