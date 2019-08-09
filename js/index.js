var app = angular.module("mainpage", ['ngRoute'])

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/templates/mainpage.html',
        controller: 'boxes'
    })
    $routeProvider.when('/new-item/:id', {
        templateUrl: '/templates/newitem.html',
        controller: 'itemController',
        controllerAs: 'box'
    })
    $routeProvider.when('/new-box/', {
        templateUrl: '/templates/newbox.html',
        controller: 'boxController', 
        controllerAs: 'newBox'
    })
    $locationProvider.html5Mode(true)
}]) 

app.controller('viewController', function($scope) {
    $scope.$on('$viewContentLoaded', function(event) {
        console.log('something is loaded')
        M.AutoInit()
        fill_todays_date()
    })
})

app.controller('boxController', function($scope) {

})

app.controller('itemController', ['$routeParams', function($routeParams) {
    this.id = $routeParams.id
}])

app.controller('topbar', function($scope) {
    $scope.items = ["this", "that", "other"]
}) 

app.controller('boxes', function($scope) {
    $scope.boxes = [
        {code: "Y05",
            items: [
                {title: "iPhone 6s", est_price: "$250", class:"sellable", make:"Apple", sale_type: "Buy it now"},
                {title: "iPad Pro", est_price: "$350", class:"For own use", make:"Apple"},
                {title: "iPhone X", est_price: "$750", class:"Fixable", make:"Apple", sale_type: "Buy it now"},
            ]
        },
        {code: "Y06",
            items: [
                {title: "iPhone 6s", est_price: "$250", class:"sellable", make:"Apple", sale_type: "Buy it now"},
                {title: "iPhone X", est_price: "$750", class:"Fixable", make:"Apple", sale_type: "Buy it now"},
            ]
        }
    ]
})

app.controller('testCtrl', function($scope) {
    $scope.name = "Jason Madden"
})

function fill_todays_date() {
    var todays_date = new Date()
    var dd = String(todays_date.getDate()).padStart(2, '0')
    var mm = String(todays_date.getMonth() + 1).padStart(2, '0')
    var yyyy = todays_date.getFullYear()
    var today = yyyy + '-' + mm + '-' + dd
    console.log(today)
    document.querySelector('#date_created').value = today
}