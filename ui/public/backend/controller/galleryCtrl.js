app.controller('galleryCtrl', function($scope, $http, $modal, Upload) {
    $scope.pageList = function() {
        $scope.showCreateFolder = false;
    	$scope.currentUrl = '/gallery';
    	$scope.galleryData = {};
    	$scope.refresh();
    };

    $scope.navigate = function(url) {
        $scope.currentUrl = url;        
        $scope.refresh();
    };

    $scope.refresh = function () {
        $http.get($scope.currentUrl).
	    success(function(data, status, headers, config) {
	        if (data) {  
            	$scope.galleryData = data;
	        };
	    }).
	    error(function(data, status, headers, config) {
	    	$scope.galleryData = {};
	    });
    };

    $scope.createFolder = function() {
        $http.post('/admin/gallery/create-folder', { folder : $scope.folderName })
        .success(function(data, status, headers, config){
            $scope.refresh();
        }).error(function(data, status, headers, config) {
        });
        $scope.showCreateFolder = false;
        $scope.folderName = '';
    };

    $scope.removeFolder = function(folderName) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'alertBoxCtrl',
            size: 'sm',
            resolve: {
                message: function() {
                    return "Do you want delete !";
                }
            }           
        });

        modalInstance.result.then(function() {    
            $http.post('/admin/gallery/remove', { name : folderName })
            .success(function(data, status, headers, config){
                $scope.refresh();
            }).error(function(data, status, headers, config) {
            });
        }, function() {            
        });
    };

    $scope.removeFile = function(path) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'alertBoxCtrl',
            size: 'sm',
            resolve: {
                message: function() {
                    return "Do you want delete !";
                }
            }           
        });    
        var index = path.lastIndexOf("\\");
        var fileName = path.substring(index + 1);
        modalInstance.result.then(function() {    
            $http.post('/admin/gallery/remove', { name : fileName })
            .success(function(data, status, headers, config){
                $scope.refresh();
            }).error(function(data, status, headers, config) {
            });
        }, function() {            
        });
    };

    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: '/admin/gallery/upload',
                    file: file
                }).progress(function (evt) {
                    $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + $scope.progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    // console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    $scope.refresh();
                });
            }
        }
    };
});