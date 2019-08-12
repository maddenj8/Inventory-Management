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

app.directive('imgUpload', function($http, $compile) {
    return {
        restrict:'AE', 
        scope: {
            url: '@',
            method: '@'
        },
        templateUrl:'/templates/imgupload.html',
        // template: '<input class="fileUpload" type="file" multiple />'+
        //     '<div class="dropzone">'+
        //         '<p class="msg">Click or Drag and Drop files to upload</p>'+
        //     '</div>'+
        //     '<div class="preview clearfix">'+
        //         '<div class="previewData clearfix" ng-repeat="data in previewData track by $index">'+
        //             '<img src={{data.src}}></img>'+
        //             '<div class="previewDetails">'+
        //                 '<div class="detail"><b>Name : </b>{{data.name}}</div>'+
        //                 '<div class="detail"><b>Type : </b>{{data.type}}</div>'+
        //                 '<div class="detail"><b>Size : </b> {{data.size}}</div>'+
        //             '</div>'+
        //             '<div class="previewControls">'+
        //                 '<span ng-click="upload(data)" class="circle upload">'+
        //                     '<i class="fa fa-check"></i>'+
        //                 '</span>'+
        //                 '<span ng-click="remove(data)" class="circle remove">'+
        //                     '<i class="fa fa-close"></i>'+
        //                 '</span>'+
        //             '</div>'+
        //         '</div>'+	
        //     '</div>',
        link: function(scope, elem, attrs) {
            var formData = new FormData();
            scope.previewData = [];	

            function previewFile(file){
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

            function getElement(className) {
                for (var i = 0; i < elem[0].childNodes.length; i++) {
                    if (elem[0].childNodes[i].className == className) {
                        return elem[0].childNodes[i]
                    }
                }
            }

            function uploadFile(e,type){
                e.preventDefault();			
                var files = "";
                if(type == "formControl"){
                    files = e.target.files;
                } else if(type === "drop"){
                    files = e.dataTransfer.files;
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
            getElement('fileUpload').onchange = function(e) {
                uploadFile(e,'formControl');
            };

            getElement('dropzone').onclick = function(e) {
                getElement('fileUpload').click();
            };

            getElement('dropzone').ondragover = function(e) {
                e.preventDefault();
            };

            getElement('dropzone').ondrop = function(e) {
                console.log('drop event: ' + e.dataTransfer)
                uploadFile(e,'drop');																		
            };
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