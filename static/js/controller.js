var app = angular.module("app", ["ui.router"]);

app.config(function($urlRouterProvider,$stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state("chart", {
            url:"/",
            templateUrl : "/static/views/chart.htm"
        })
    });

app.controller('NewsController', function ($scope, $http) {

    $http.get("/api/news")
        .then(function(response) {
            $scope.news = response.data;
            console.log(response.data)
        });

});