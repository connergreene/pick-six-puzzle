'use strict'
app.directive('picksix', function(){
    return {
        templateUrl: 'browser/js/templates/pick-six-puzzle.html', 
        restrict: 'E',
        scope:{
            states:'='
        }
    };
});
