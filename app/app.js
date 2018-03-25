(function(){
	'use strict';
	// Création du module angular sliderapp qui représente notre application et qui sera appeler plus tard. 
	const app = angular.module('sliderApp',['ngAnimate']);

	// Création du controller qui controllera notre affichage et notre scope.
	app.controller('SliderController', function($scope,$interval,$timeout) {
		// Ici on etablie le tableau qui contient la liste nos images sous format d'objet contenant l'id, la source de l'image, son titre et son paragraphe
    	$scope.images=[{id:'1',src:'img1.jpg',title:'Image 1',description: 'Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'},{id:'2',src:'img2.jpg',title:'Image 2',description: 'Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'},{id:'3',src:'img3.jpg',title:'Image 3',description: 'Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'}]; 

    	// Mise en place du fonctionnement de la barre de progression avant changement auto, en utilisant $interval et un timer de relance
		var progressTimer;
		//fonction qui demarre le remplissage de la bare
        $scope.move = function() {
		var width = 1;
          if ( angular.isDefined(progressTimer) ) return;

          progressTimer = $interval(function() {
            if (width < 100) {
               width++; 
		       $scope.progression = {"width": width + "%"}
            } else {
              $scope.stopMove();
            }
          }, 45);
        };
        // fonction qui arrete la barre lorsque qu'elle est pleine et la relance en appellant à nouveau la fonction precedente.
        $scope.stopMove = function() {
          var timer;
          if (angular.isDefined(progressTimer)) {
            $interval.cancel(progressTimer);
            progressTimer = undefined;
            timer=$timeout(function(){
					$scope.move();
			},500);
          }
        };
		$scope.move()
	});
 	// Création de la directive qui va generer le slider ainsi que gerer son fonctionnement
	app.directive('slider', function ($timeout) {
	  return {
	    restrict: 'AE',
		replace: true,
		scope:{
			images: '='
		},
		// fonction dans la quel on va apporter la logic et les changements due au interactions du slider
	    link: function (scope, elem, attrs) {
		
			scope.currentIndex=0;
			// fonction pour le bouton image suivante
			scope.next=function(){
				scope.currentIndex<scope.images.length-1?scope.currentIndex++:scope.currentIndex=0;
			};
			// fonction pour le bouton image precedente
			scope.prev=function(){
				scope.currentIndex>0?scope.currentIndex--:scope.currentIndex=scope.images.length-1;
			};
			// on surveille l'index de l'image afficher pour bien cacher les autres.
			scope.$watch('currentIndex',function(){
				scope.images.forEach(function(image){
					image.visible=false;
				});
				scope.images[scope.currentIndex].visible=true;
			});
			
			
			// fonction qui gere le changement automatique d'image toute les 5 secondes
			var timer;
			
			var autoSlide = function(){
				timer=$timeout(function(){
					scope.next();
					autoSlide();
				},5000);
			};
			
			autoSlide();
			
			scope.$on('$destroy',function(){
				$timeout.cancel(timer);
			});
			
			
	    },
		templateUrl:'template/template.html'
	  }
	});

})();
