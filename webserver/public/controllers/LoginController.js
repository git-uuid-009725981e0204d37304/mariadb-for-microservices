app.controller("LoginController", function ($scope, $window, ApiService, LocalStorage) {
    $scope.errorMessages = [];
    $scope.successMessages = [];

    $scope.login = function () {
        emptyMessages();
        ApiService.login($scope.username, $scope.password).then(
            function (data) {
                //console.log(data);
                if (data && data.token) {
                    $scope.successMessages.push("Login successful");

                    LocalStorage.setToken(data.token);

                    if (data.user) {
                        //console.info(data.user);
                        LocalStorage.setUser(data.user);
                    }


                    $window.location.href = '#/dashboard';
                } else {
                    $scope.errorMessages.push("Expected to receive access token");
                }
            },
            function (response) {

                console.info(response);

                console.info(response.headers());

                if (response.data == null && response.status == -1) {
                    $scope.errorMessages.push("Error connecting to API. Maybe resource is offline?");
                }

                if (response.data) {
                    var data = response.data;

                    if (data && data.Message) {
                        $scope.errorMessages.push(data.Message);
                        return;
                    }
                }
                $scope.errorMessages.push("An error occured. Please try again.");
            }
        );
    }

    function emptyMessages() {
        $scope.errorMessages = [];
        $scope.successMessages = [];
    }
});