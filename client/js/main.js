angular.module('project-atom', ['ngRoute', 'firebase'])
.config(function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl: 'views/home.html',
        controller: 'mainController'
    }) // when closing tag
    .when('/levelOne', {
        templateUrl:'views/level1.html',
        controller: 'levelOneController'
    }).when('/levelTwo', {
        templateUrl:'views/level2.html',
        controller: 'levelTwoController'
    }).when('/levelThree',{
        templateUrl:'views/level3.html',
        controller: 'levelThreeController'
    }).when('/levelFour',{
        templateUrl:'views/level4.html',
        controller: 'levelFourController'
    }).when('/levelFive',{
        templateUrl:'views/level5.html',
        controller: 'levelFiveController'
    }).otherwise({
        redirectTo: '/'
    });// redirect Closing tag
})

.controller('mainController', ['$scope', '$firebase',"$firebaseArray", function($scope, $firebase,$firebaseArray,$timeout){
        var elmentsRef = new Firebase("https://projectatom.firebaseio.com/elements");
        
        $scope.data = $firebaseArray(elmentsRef);
        
        $scope.elementArray = [];

        $scope.addedElement = function(element){
            $scope.elementArray.push(element);
        };
        
        $scope.clearElement = function(){
            $scope.elementArray=[];
            $scope.dataInput='';
        };
        
        console.log($scope.elementArray);

        //$scope.pageData=[];

    //     elmentsRef.on("value", function(snapshot) {
    //             var snapVal = snapshot.val();
    //             //Sending the elementsData to the reciving socket
    //             $scope.$emit('elementsData', snapVal);
    //     });
        
    // //$watch check to see for any updates or changes in the $on    
    //   $scope.$watch(function(){
    //       //This is essentially a socket for the data from firebase
    //       //elementsData is the name of the 'on'
    //     $scope.$on('elementsData', function(envt, args){
    //           //Heres the data
    //           //Page data will go in here to list
    //           //Just need to get the ng repeat the data by the scope
              
              
    //           //Args is the data returned
    //         $scope.pageData = angular.copy(args);
    //     });
    //   });

        
        console.log($scope.pageData);
    //debugger;

 // $scope.list3 = $firebaseArray(elmentsRef);

  $scope.list1 = {};
  $scope.item2 = {};
  
  console.log($scope.list1, "List !");
    
}])

.controller('loginController', ['$scope', '$firebase', function($scope, $firebase){
    var ref = new Firebase("https://projectatom.firebaseio.com/");
    
    var authData = ref.getAuth();
    var userData;
    
      if (authData) {
            $scope.loginData = true;
            ref.child("users").child(authData.uid).on("value", function(snapshot) {
                    console.log(snapshot.val(), "This is the users information.");
                    $scope.userdata = snapshot.val();
                    console.log($scope.userdata);
                });
          console.log("Authenticated user with uid:", authData.uid);
      } else {
         $scope.loginData = false; 
      }
    
    $scope.FacebookSignup = function(){

        ref.authWithOAuthPopup("facebook", function(err, authData) {
            $scope.loginData = true;
            if(authData){
                console.log(authData);
                $scope.signedUp = true;
                $scope.userdata = authData;
                ref.child("users").child(authData.uid).set({
                        displayName: authData.facebook.displayName,
                        firstName: authData.facebook.cachedUserProfile.first_name,
                        lastName: authData.facebook.cachedUserProfile.last_name,
                        profilePic: authData.facebook.profileImageURL,
                        coins: 10
                });
                
                ref.child("users").child(authData.uid).on("value", function(snapshot) {
                    console.log(snapshot.val(), "This is the users information.");
                    $scope.userdata = snapshot.val();
                    console.log($scope.userdata);
                });
                
            }else{
                console.log("Login Failed!");
                $scope.loginData = false;
            }
        });
    };
    
    $scope.FacebookLogin = function(){
        $scope.loginData = true;
        ref.authWithOAuthPopup("facebook", function(error, authData) {

            if(authData){
                ref.child("users").child(authData.uid).on("value", function(snapshot) {
                    console.log(snapshot.val(), "This is the users information.");
                    $scope.userdata = snapshot.val();
                    console.log($scope.userdata);
                });
            }else{
                console.log("Login Failed!");
            }
        });
    };
    
    $scope.logOut = function(){
        $scope.loginData = false;
        ref.unauth();
    };
    
    $scope.profiles = function(){
        
        $('#Profile').foundation('reveal', 'open');
    }
    
}])

.controller('levelOneController', ['$scope', '$firebase', "$firebaseArray", function($scope, $firebase, $firebaseArray){
    
    var elmentsRef = new Firebase("https://projectatom.firebaseio.com/elements");
         $scope.elements = $firebaseArray(elmentsRef);
         
         $scope.answers = [];
        //  $scope.rest = false;
         
        $scope.selectedElement = function(element){
            console.log(element, "Element passed from clicked id");
            $scope.answers.push(element);
        };
        
        $scope.clear = function(){
            $scope.answers = [];
        }
        
        $scope.check = function(){
         
         // H20   
           var  hydrogenCount = 0;
           var  oxygenCount = 0;
            //console.log($scope.answers);
            
            for (var i = 0; i < $scope.answers.length;i++ ) {
                console.log($scope.answers[i]);
                if($scope.answers[i] === 'hydrogen'){
                    
                    hydrogenCount += 1;
                    
                }
                if($scope.answers[i] === 'oxygen'){
                    oxygenCount += 1;
                    
                }            
                
            }
            
            
            if( hydrogenCount === 2 && oxygenCount === 1){
                //   hydrogenCount = 0;
                //   oxygenCount = 0;
                console.log('youWin');
     
                 var userds = new Firebase("https://projectatom.firebaseio.com/users");
                 var refref = new Firebase("https://projectatom.firebaseio.com/");              
                   $("#what").html("You Won! + 5 Molecules");
                        
                    var authData = refref.getAuth();
                    if (authData) {
                      
                      userds.child(authData.uid).once("value", function(snapshot) {
                          
                         var snapVal = snapshot.val();
                         var coins = snapVal.coins;
                         var gain = 5;
                         var newCoins = coins + gain;
                         console.log(newCoins, "New Coins");
                         updateFire(authData,newCoins); 
                     
                     });
                      
                    }
                    
                              function updateFire(authData, newCoins){
                             userds.child(authData.uid).update({ coins: newCoins });
                             
                         };
                 window.setTimeout(Alertify, 3000);
        
            }else{
                $("#what").html("You Lost! ): Try Again!");
            }
            
            function Alertify() {
              window.location.assign("https://project-atom-vcabieles.c9users.io/#/levelTwo");
            }
            
        };
         
}])

.controller('levelTwoController', ['$scope', '$firebase', "$firebaseArray", function($scope, $firebase, $firebaseArray){

    var elmentsRef = new Firebase("https://projectatom.firebaseio.com/elements");
         $scope.elements = $firebaseArray(elmentsRef);
         
         $scope.answers = [];
         
        $scope.selectedElement = function(element){
            console.log(element, "Element passed from clicked id");
            $scope.answers.push(element);
        };
        
        $scope.clear = function(){
            $scope.answers = [];
        }
        
        $scope.check = function(){
            
          // Baking Soda
           var  hydrogenCount = 0;
           var  carbonCount = 0;
           var  sodiumCount = 0;
           var  oxygenCount = 0;
            
            //console.log($scope.answers);
            
            for (var i = 0; i < $scope.answers.length;i++ ) {
                console.log($scope.answers[i]);
                if($scope.answers[i] === 'hydrogen'){
                    
                    hydrogenCount += 1;
                    
                }
                if($scope.answers[i] === 'carbon'){
                    carbonCount += 1;
                    
                }
                if($scope.answers[i] === 'sodium'){
                   sodiumCount += 1;
                    
                }
                if($scope.answers[i] === 'oxygen'){
                   oxygenCount += 1;
                    
                }
                
            }
            
            if(hydrogenCount === 1 & carbonCount === 1 & sodiumCount === 1 & oxygenCount === 3){
                console.log('youWin');
                
                 var userds = new Firebase("https://projectatom.firebaseio.com/users");
                 var refref = new Firebase("https://projectatom.firebaseio.com/");              
                   $("#what").html("You Won! + 7 Molecules"+"<br>"+"Check Out How Many Molecules "+"<br>"+"You Have On Your Profile");
                        
                    var authData = refref.getAuth();
                    if (authData) {
                      
                      userds.child(authData.uid).once("value", function(snapshot) {
                          
                         var snapVal = snapshot.val();
                         var coins = snapVal.coins;
                         var gain = 7;
                         var newCoins = coins + gain;
                         console.log(newCoins, "New Coins");
                         updateFire(authData,newCoins); 
                     
                     });
                      
                    }
                    
                              function updateFire(authData, newCoins){
                             userds.child(authData.uid).update({ coins: newCoins });
                             
                         };
                 
                 window.setTimeout(Alertify, 7000);
                 
            }else{
                 $("#what").html("You Lost! ): Try Again!");
            }
            
            function Alertify() {
              window.location.assign("https://project-atom-vcabieles.c9users.io/#/levelThree");
            }
            
        };

}])

.controller('levelThreeController', ['$scope', '$firebase', "$firebaseArray", function($scope, $firebase, $firebaseArray){

    var elmentsRef = new Firebase("https://projectatom.firebaseio.com/elements");
         $scope.elements = $firebaseArray(elmentsRef);
         
         $scope.answers = [];
         
        $scope.selectedElement = function(element){
            console.log(element, "Element passed from clicked id");
            $scope.answers.push(element);
        };
        
        $scope.clear = function(){
            $scope.answers = [];
        }
        
        $scope.check = function(){
         
           // Methane   
           var  hydrogenCount = 0;
           var  carbonCount = 0;

            //console.log($scope.answers);
            
            for (var i = 0; i < $scope.answers.length;i++ ) {
                console.log($scope.answers[i]);
                if($scope.answers[i] === 'carbon'){
                    
                    carbonCount += 1;
                    
                }
                if($scope.answers[i] === 'hydrogen'){
                    hydrogenCount += 1;
                    
                }
                
            }
            
            if(hydrogenCount === 4 & carbonCount === 1){
                $("#what").html("You Won! + 6 molecules");
                var userds = new Firebase("https://projectatom.firebaseio.com/users");
                 var refref = new Firebase("https://projectatom.firebaseio.com/");              
                        
                    var authData = refref.getAuth();
                    if (authData) {
                      
                      userds.child(authData.uid).once("value", function(snapshot) {
                          
                         var snapVal = snapshot.val();
                         var coins = snapVal.coins;
                         var gain = 6;
                         var newCoins = coins + gain;
                         console.log(newCoins, "New Coins");
                         updateFire(authData,newCoins); 
                     
                     });
                      
                    }
                    
                              function updateFire(authData, newCoins){
                             userds.child(authData.uid).update({ coins: newCoins });
                             
                         };
                 window.setTimeout(Alertify, 3000);
                 
            }else{
                $("#what").html("You Lost! ): Try Again!");
            }
            
            function Alertify() {
              window.location.assign("https://project-atom-vcabieles.c9users.io/#/levelFour");
            }
            
        };
    
}])

.controller('levelFourController', ['$scope', '$firebase', "$firebaseArray", function($scope, $firebase, $firebaseArray){

    var elmentsRef = new Firebase("https://projectatom.firebaseio.com/elements");
         $scope.elements = $firebaseArray(elmentsRef);
         
         $scope.answers = [];
         
        $scope.selectedElement = function(element){
            console.log(element, "Element passed from clicked id");
            $scope.answers.push(element);
        };
        
        $scope.clear = function(){
            $scope.answers = [];
        }
        
        $scope.check = function(){
         
           //  Citric Acid    
           var  hydrogenCount = 0;
           var  oxygenCount = 0;
           var  carbonCount = 0;

            //console.log($scope.answers);
            
            for (var i = 0; i < $scope.answers.length;i++ ) {
                console.log($scope.answers[i]);
                if($scope.answers[i] === 'oxygen'){
                    
                    oxygenCount += 1;
                    
                }
                if($scope.answers[i] === 'hydrogen'){
                    hydrogenCount += 1;
                    
                }
                if($scope.answers[i] === 'carbon'){
                    carbonCount += 1;
                    
                } 
                
            }
            
            if(carbonCount === 6 & oxygenCount === 7 & hydrogenCount == 8){
                var userds = new Firebase("https://projectatom.firebaseio.com/users");
                 var refref = new Firebase("https://projectatom.firebaseio.com/");              
                   $("#what").html("You Won! + 12 Molecueles");
                        
                    var authData = refref.getAuth();
                    if (authData) {
                      
                      userds.child(authData.uid).once("value", function(snapshot) {
                          
                         var snapVal = snapshot.val();
                         var coins = snapVal.coins;
                         var gain = 12;
                         var newCoins = coins + gain;
                         console.log(newCoins, "New Coins");
                         updateFire(authData,newCoins); 
                     
                     });
                      
                    }
                    
                        function updateFire(authData, newCoins){
                             userds.child(authData.uid).update({ coins: newCoins });
                             
                         };
                console.log('youWin');
                 window.setTimeout(Alertify, 3000);
                 
            }else{
                $("#what").html("You Lost! ): Try Again!");
            }
            
            function Alertify() {
              window.location.assign("https://project-atom-vcabieles.c9users.io/#/levelFive");
            }
            
        };

}])

.controller('levelFiveController', ['$scope', '$firebase', "$firebaseArray", function($scope, $firebase, $firebaseArray){

    var elmentsRef = new Firebase("https://projectatom.firebaseio.com/elements");
         $scope.elements = $firebaseArray(elmentsRef);
         
         $scope.answers = [];
         
        $scope.selectedElement = function(element){
            console.log(element, "Element passed from clicked id");
            $scope.answers.push(element);
        };
        
        $scope.clear = function(){
            $scope.answers = [];
        }
        
        $scope.check = function(){
         
           // Methane   
           var sodiumCount = 0;
           var chlorineCount = 0;
       

            //console.log($scope.answers);
            
            for (var i = 0; i < $scope.answers.length;i++ ) {
                console.log($scope.answers[i]);
                if($scope.answers[i] === 'sodium'){
                    
                    sodiumCount += 1;
                    
                }
                if($scope.answers[i] === 'chlorine'){
                    chlorineCount += 1;
                    
                }

                
            }
            
            if(sodiumCount === 1 & chlorineCount === 1){
                var userds = new Firebase("https://projectatom.firebaseio.com/users");
                 var refref = new Firebase("https://projectatom.firebaseio.com/");              
                
                    var authData = refref.getAuth();
                    if (authData) {
                      
                      userds.child(authData.uid).once("value", function(snapshot) {
                          
                         var snapVal = snapshot.val();
                         var coins = snapVal.coins;
                         var gain = 3;
                         var newCoins = coins + gain;
                         console.log(newCoins, "New Coins");
                         updateFire(authData,newCoins); 
                     
                     });
                      
                    }
                    
                              function updateFire(authData, newCoins){
                             userds.child(authData.uid).update({ coins: newCoins });
                             
                         };
                 window.setTimeout(Alertify, 3000);
                 $("#what").html("You Won! congratulations you finish the Game! + 3 Molecules");
            }else{
                $("#what").html("You Lost! ): Try Again!");
            }
            
            function Alertify() {
              window.location.assign("https://project-atom-vcabieles.c9users.io/#/");
            }
            
        };

}]);