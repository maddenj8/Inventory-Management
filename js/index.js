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

app.controller('topbar', function($scope) {
    $scope.items = ["this", "that", "other"]
}) 

// --------- FUNCTIONS FOR BOXES --------- //
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

app.controller('boxController', function($scope) {

})

// -------- FUNCTIONS FOR ITEMS ----------- //
app.controller('itemController', ['$routeParams', function($routeParams) {
    this.id = $routeParams.id
}])

app.directive('img-upload', function($http, $compile) {
    return {
        restrict: 'AE', 
        scope: {
            url:'@', 
            method:'@'
        },
        link: function(scope, elem, attrs) {
            var formData = new FormData()
            scope.previewData = [] // list of images uploaded

            function previewData (file) {
                var reader = new FileReader();
                var obj = new FormData().append('file',file);			
                reader.onload=function(data){
                    var src = data.target.result;
                    var size = ((file.size/(1024*1024)) > 1)? (file.size/(1024*1024)) + ' mB' : (file.size/		1024)+' kB';
                    scope.$apply(function(){
                        scope.previewData.push({'name':file.name,'size':size,'type':file.type,
                                                'src':src,'data':obj});
                    });								
                    console.log(scope.previewData);
                }
                reader.readAsDataURL(file);
            }
            function uploadFile(e,type){
                e.preventDefault();			
                var files = "";
                if(type == "formControl"){
                    files = e.target.files;
                } else if(type === "drop"){
                    files = e.originalEvent.dataTransfer.files;
                }			
                for(var i=0;i<files.length;i++){
                    var file = files[i];
                    if(file.type.indexOf("image") !== -1){
                        previewFile(file);								
                    } else {
                        alert(file.name + " is not supported");
                    }
                }
            }
            elem.find('.fileUpload').bind('change',function(e){
                uploadFile(e,'formControl');
            });

            elem.find('.dropzone').bind("click",function(e){
                $compile(elem.find('.fileUpload'))(scope).trigger('click');
                // console.log('element was clicked')
            });

            elem.find('.dropzone').bind("dragover",function(e){
                e.preventDefault();
            });

            elem.find('.dropzone').bind("drop",function(e){
                uploadFile(e,'drop');																		
            });
            scope.upload=function(obj){
                $http({method:scope.method,url:scope.url,data: obj.data,
                    headers: {'Content-Type': undefined},transformRequest: angular.identity
                }).success(function(data){

                });
            }

            scope.remove=function(data){
                var index= scope.previewData.indexOf(data);
                scope.previewData.splice(index,1);
            }	
        }
    }
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