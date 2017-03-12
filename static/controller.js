var app = angular.module("app", ["ui.router"]);

app.config(function($urlRouterProvider,$stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state("chart", {
            url:"/",
            templateUrl : "/static/chart.htm"
        })
    });
